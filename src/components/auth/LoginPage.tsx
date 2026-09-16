import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role, User } from '../../types';
import { INITIAL_USERS } from '../../data/mockData';
import { ShieldCheck, User as UserIcon, Lock, Mail, ArrowRight, UserPlus, AlertCircle } from 'lucide-react';
import { LanguageSelector } from '../common/LanguageSelector';
import { ThemeToggle } from '../common/ThemeToggle';
import { t } from '../../utils/translations';
import { signupUser, loginUser } from '../../services/api';
import { supabase } from '../../utils/supabaseClient';

export const LoginPage: React.FC = () => {
  const { setCurrentUser, setActiveTab, language } = useApp();
  const [selectedRole, setSelectedRole] = useState<Role>('ENTREPRENEUR');
  const [isSignup, setIsSignup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string>('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    if (!cleanEmail || !cleanPassword) {
      setAuthError('Please enter both email and password.');
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Authenticate with Supabase Auth (signInWithPassword)
      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword
      });

      if (authErr || !authData?.user) {
        if (authErr?.message?.includes('Email not confirmed')) {
          setAuthError('Email is not confirmed yet. Please check your inbox or confirm the user in Supabase Dashboard (Authentication -> Users).');
        } else {
          setAuthError(authErr?.message || 'Invalid login credentials. Please verify your email and password.');
        }
        setIsSubmitting(false);
        return;
      }

      const authUser = authData.user;

      // 2. Load the corresponding user profile from public.users table
      const { data: dbProfile, error: profileErr } = await supabase
        .from('users')
        .select('*')
        .or(`id.eq.${authUser.id},email.ilike.${cleanEmail}`)
        .maybeSingle();

      if (profileErr) {
        console.warn('[Supabase] Error loading profile from public.users:', profileErr.message);
      }

      let profile = dbProfile;

      // If user exists in Auth but not in public.users, create their profile record using authUser.id
      if (!profile) {
        const defaultRole = (authUser.user_metadata?.role as Role) || selectedRole || 'ENTREPRENEUR';
        const defaultName = authUser.user_metadata?.name || cleanEmail.split('@')[0];
        
        const { data: createdProfile } = await supabase
          .from('users')
          .upsert({
            id: authUser.id,
            name: defaultName,
            email: cleanEmail,
            password_hash: null,
            role: defaultRole,
            district: 'Pune',
            permissions: []
          }, { onConflict: 'id' })
          .select()
          .maybeSingle();

        profile = createdProfile;
      }

      const roleToUse: Role = profile?.role || (authUser.user_metadata?.role as Role) || selectedRole;

      // Enforce portal/role selection alignment
      if (selectedRole && profile?.role && profile.role !== selectedRole) {
        setAuthError(`This account is registered as ${profile.role}, not ${selectedRole}. Please select the ${profile.role} tab.`);
        setIsSubmitting(false);
        return;
      }

      const userToLogin: User = {
        id: profile?.id || authUser.id,
        name: profile?.name || authUser.user_metadata?.name || cleanEmail.split('@')[0],
        email: profile?.email || cleanEmail,
        role: roleToUse,
        department: profile?.department || undefined,
        designation: profile?.designation || undefined,
        district: profile?.district || 'Pune',
        organization: roleToUse === 'ENTREPRENEUR' ? 'Maharashtra Enterprise' : (profile?.department || 'Government of Maharashtra'),
        permissions: profile?.permissions || []
      };

      setCurrentUser(userToLogin);
      try { localStorage.setItem('pfn_user', JSON.stringify(userToLogin)); } catch (e) {}
      setIsSubmitting(false);

      if (roleToUse === 'ENTREPRENEUR') setActiveTab('dashboard');
      else if (roleToUse === 'OFFICER') setActiveTab('officer-dashboard');
      else setActiveTab('admin-dashboard');

    } catch (err: any) {
      console.error('Login error:', err);
      setAuthError(err.message || 'An unexpected error occurred during login.');
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim() || 'New Entrepreneur';
    const cleanBusiness = businessName.trim() || `${cleanName}'s Enterprise`;
    const cleanPassword = password;

    if (!cleanEmail) {
      setAuthError('Email address is required.');
      setIsSubmitting(false);
      return;
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Call supabase.auth.signUp FIRST (Creates Auth user in auth.users)
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: {
          data: {
            name: cleanName,
            role: 'ENTREPRENEUR',
            businessName: cleanBusiness
          }
        }
      });

      // 2. Verify Supabase Auth returned a valid user; STOP if failed
      if (authErr || !authData?.user) {
        setAuthError(authErr?.message || 'Supabase Auth registration failed. Please check your credentials.');
        setIsSubmitting(false);
        return; // DO NOT create public.users record
      }

      const authUser = authData.user;

      // 3. ONLY after successful Supabase Auth signup, insert user profile into existing public.users table using authUser.id
      const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .upsert({
          id: authUser.id,
          name: cleanName,
          email: cleanEmail,
          password_hash: null, // Do NOT manually store passwords
          role: 'ENTREPRENEUR',
          department: null,
          designation: null,
          district: 'Pune',
          permissions: []
        }, { onConflict: 'id' })
        .select()
        .maybeSingle();

      if (dbError) {
        console.error('[Supabase] public.users profile insertion failed:', dbError.message);
        setAuthError(`Auth user created, but database profile creation failed: ${dbError.message}`);
        setIsSubmitting(false);
        return;
      }

      // 4. Create initial business project in public.business_projects linked to the new auth user id
      try {
        const projectId = `proj-${Date.now()}`;
        await supabase.from('business_projects').upsert({
          id: projectId,
          user_id: authUser.id,
          business_name: cleanBusiness,
          sector: 'Food Processing & Agro',
          investment_range: '₹5Cr - ₹10Cr',
          district: 'Pune',
          project_stage: 'PLANNING'
        });
      } catch (projErr) {
        console.warn('[Supabase] Business project creation notice:', projErr);
      }

      const createdUserObj: User = {
        id: authUser.id,
        name: cleanName,
        email: cleanEmail,
        role: 'ENTREPRENEUR',
        district: 'Pune',
        organization: cleanBusiness,
        permissions: []
      };

      // 5. Check if Supabase signUp returned an active session
      if (authData.session) {
        // Auto-authenticate: set user state and redirect to logged-in area
        setCurrentUser(createdUserObj);
        try { localStorage.setItem('pfn_user', JSON.stringify(createdUserObj)); } catch (e) {}
        setIsSubmitting(false);
        setActiveTab('new-project');
      } else {
        // Fallback when email confirmation is required (no session returned)
        setIsSubmitting(false);
        setAuthError('Account created! Please check your email to confirm your account, then sign in.');
      }

    } catch (err: any) {
      console.error('Signup error:', err);
      setAuthError(err.message || 'An unexpected error occurred during signup.');
      setIsSubmitting(false);
    }
  };

  const loginAsDemo = async (role: Role) => {
    setAuthError('');
    const demoUser = INITIAL_USERS.find(u => u.role === role);
    if (demoUser) {
      try {
        let authUserId = demoUser.id;
        const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
          email: demoUser.email,
          password: 'Password@123'
        });

        if (signInData?.user) {
          authUserId = signInData.user.id;
        } else if (signInErr && signInErr.message.includes('Invalid login credentials')) {
          const { data: signUpData } = await supabase.auth.signUp({
            email: demoUser.email,
            password: 'Password@123',
            options: {
              data: {
                name: demoUser.name,
                role: demoUser.role
              }
            }
          });

          if (signUpData?.user) {
            authUserId = signUpData.user.id;
          }
        }

        // Ensure user profile in public.users table with authUserId
        await supabase.from('users').upsert({
          id: authUserId,
          name: demoUser.name,
          email: demoUser.email,
          password_hash: null,
          role: demoUser.role,
          department: demoUser.department || null,
          designation: demoUser.designation || null,
          district: demoUser.district || 'Pune',
          permissions: demoUser.permissions || []
        }, { onConflict: 'email' });

        const userObj: User = {
          ...demoUser,
          id: authUserId
        };

        setCurrentUser(userObj);
        try { localStorage.setItem('pfn_user', JSON.stringify(userObj)); } catch (e) {}

        if (role === 'ENTREPRENEUR') setActiveTab('dashboard');
        else if (role === 'OFFICER') setActiveTab('officer-dashboard');
        else setActiveTab('admin-dashboard');

      } catch (err) {
        console.warn('[Demo Login] Notice:', err);
        setCurrentUser(demoUser);
        if (role === 'ENTREPRENEUR') setActiveTab('dashboard');
        else if (role === 'OFFICER') setActiveTab('officer-dashboard');
        else setActiveTab('admin-dashboard');
      }
    }
  };

  const getRoleLabel = (role: Role) => {
    if (role === 'ENTREPRENEUR') return t('entrepreneur', language);
    if (role === 'OFFICER') return t('officer', language);
    return t('admin', language);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#122017] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Auth Header */}
      <header className="p-4 sm:p-6 bg-white dark:bg-[#16261C] border-b border-[#D4EEDC] dark:border-[#253D2C] flex items-center justify-between shadow-xs">
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 text-left cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#2E6F40] flex items-center justify-center text-white shadow-xs border border-[#68BA7F]/40 shrink-0">
            <ShieldCheck className="w-6 h-6 text-[#CFFFDC]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#253D2C] dark:text-[#E8F7ED]">
              Permit<span className="text-[#2E6F40] dark:text-[#68BA7F]">Flow</span> Nexus
            </span>
            <span className="text-[10px] font-extrabold text-[#2E6F40] dark:text-[#CFFFDC] tracking-wider uppercase">
              MAHARASHTRA
            </span>
          </div>
        </button>

        <div className="flex items-center gap-3">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white dark:bg-[#1A2D22] rounded-3xl border border-[#D4EEDC] dark:border-[#253D2C] shadow-xl p-6 sm:p-8 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-[#192A1E] dark:text-white">
              {isSignup ? t('createAccountTitle', language) : t('signInTitle', language)}
            </h2>
            <p className="text-xs text-[#4A6B53] dark:text-[#A3D4B3]">
              {isSignup ? t('createAccountSubtitle', language) : t('signInSubtitle', language)}
            </p>
          </div>

          {/* Role Selector Tabs */}
          {!isSignup && (
            <div className="grid grid-cols-3 gap-1 bg-[#F0FAF3] dark:bg-[#16261C] p-1.5 rounded-2xl border border-[#D4EEDC] dark:border-[#2A4736] text-xs">
              {(['ENTREPRENEUR', 'OFFICER', 'ADMIN'] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  className={`py-2 rounded-xl font-extrabold transition-all cursor-pointer ${
                    selectedRole === r
                      ? 'bg-[#2E6F40] text-white shadow-xs scale-[1.02]'
                      : 'text-[#4A6B53] dark:text-[#A3D4B3] hover:text-[#192A1E] dark:hover:text-white'
                  }`}
                >
                  {getRoleLabel(r)}
                </button>
              ))}
            </div>
          )}

          {/* Auth Error Banner */}
          {authError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-start gap-2.5 shadow-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{authError}</div>
            </div>
          )}

          {/* Login / Signup Forms */}
          {!isSignup ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#192A1E] dark:text-[#E8F7ED] font-bold mb-1">
                  {t('emailAddress', language)}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      selectedRole === 'ENTREPRENEUR' ? 'rahul.sharma@apexfoods.in' :
                      selectedRole === 'OFFICER' ? 'vk.patil@mpcb.gov.in' : 'admin@permitflownexus.gov.in'
                    }
                    className="w-full bg-[#F8FCF9] dark:bg-[#16261C] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl pl-9 pr-3 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E6F40]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#192A1E] dark:text-[#E8F7ED] font-bold mb-1">
                  {t('password', language)}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#F8FCF9] dark:bg-[#16261C] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl pl-9 pr-3 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E6F40]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-[#2E6F40] hover:bg-[#235833] text-white font-extrabold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('logInAs', language)} {getRoleLabel(selectedRole)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#192A1E] dark:text-[#E8F7ED] font-bold mb-1">
                  {t('fullName', language)}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anand Deshpande"
                  className="w-full bg-[#F8FCF9] dark:bg-[#16261C] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[#192A1E] dark:text-[#E8F7ED] font-bold mb-1">
                  {t('businessName', language)}
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Sahyadri Bio Tech Pvt Ltd"
                  className="w-full bg-[#F8FCF9] dark:bg-[#16261C] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[#192A1E] dark:text-[#E8F7ED] font-bold mb-1">
                  {t('emailAddress', language)}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anand@sahyadribio.in"
                  className="w-full bg-[#F8FCF9] dark:bg-[#16261C] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[#192A1E] dark:text-[#E8F7ED] font-bold mb-1">
                  {t('password', language)}
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F8FCF9] dark:bg-[#16261C] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-[#2E6F40] hover:bg-[#235833] text-white font-extrabold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>{t('createAccountBtn', language)}</span>
              </button>
            </form>
          )}

          <div className="text-center text-xs text-slate-500 dark:text-slate-400">
            {isSignup ? (
              <span>
                {t('alreadyHaveAccount', language)}{' '}
                <button onClick={() => setIsSignup(false)} className="text-[#2E6F40] dark:text-[#68BA7F] underline font-extrabold cursor-pointer">
                  {t('signInHere', language)}
                </button>
              </span>
            ) : (
              <span>
                {t('newEntrepreneur', language)}{' '}
                <button onClick={() => setIsSignup(true)} className="text-[#2E6F40] dark:text-[#68BA7F] underline font-extrabold cursor-pointer">
                  {t('signUpHere', language)}
                </button>
              </span>
            )}
          </div>

          {/* One-Click Quick Demo Login Section */}
          <div className="border-t border-[#D4EEDC] dark:border-[#253D2C] pt-4 space-y-2">
            <div className="text-[11px] font-extrabold text-[#60826A] dark:text-[#A3D4B3] uppercase tracking-wider">
              ⚡ 1-Click Role Login Demo Accounts
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
              {/* 1. Entrepreneur */}
              <button
                type="button"
                onClick={() => {
                  const u = INITIAL_USERS.find(user => user.role === 'ENTREPRENEUR');
                  if (u) { setCurrentUser(u); setActiveTab('applications'); }
                }}
                className="p-2 rounded-xl bg-[#F8FCF9] hover:bg-[#EDF8F1] dark:bg-[#16261C] border border-[#D4EEDC] dark:border-[#253D2C] flex items-center gap-2 text-left cursor-pointer"
              >
                <span className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px]">1</span>
                <div>
                  <div className="font-bold text-[11px] text-[#192A1E] dark:text-white">Entrepreneur</div>
                  <div className="text-[9px] text-[#60826A] dark:text-[#A3D4B3]">Rahul Sharma</div>
                </div>
              </button>

              {/* 2. MPCB Officer */}
              <button
                type="button"
                onClick={() => {
                  const u = INITIAL_USERS.find(user => user.role === 'OFFICER_MPCB' || user.email.includes('mpcb'));
                  if (u) { setCurrentUser(u); setActiveTab('officer-dashboard'); }
                }}
                className="p-2 rounded-xl bg-blue-50/60 hover:bg-blue-100/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 flex items-center gap-2 text-left cursor-pointer"
              >
                <span className="w-6 h-6 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 text-xs flex items-center justify-center font-bold text-[10px]">2</span>
                <div>
                  <div className="font-bold text-[11px] text-blue-950 dark:text-blue-200">MPCB Officer</div>
                  <div className="text-[9px] text-blue-700 dark:text-blue-400">Dr. V. K. Patil</div>
                </div>
              </button>

              {/* 3. Fire Department Officer */}
              <button
                type="button"
                onClick={() => {
                  const u = INITIAL_USERS.find(user => user.role === 'OFFICER_FIRE' || user.email.includes('fire'));
                  if (u) { setCurrentUser(u); setActiveTab('officer-dashboard'); }
                }}
                className="p-2 rounded-xl bg-red-50/60 hover:bg-red-100/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900 flex items-center gap-2 text-left cursor-pointer"
              >
                <span className="w-6 h-6 rounded bg-red-100 text-red-800 dark:bg-red-900 text-xs flex items-center justify-center font-bold text-[10px]">3</span>
                <div>
                  <div className="font-bold text-[11px] text-red-950 dark:text-red-200">Fire Dept Officer</div>
                  <div className="text-[9px] text-red-700 dark:text-red-400">Sunita Rane</div>
                </div>
              </button>

              {/* 4. DISH Officer */}
              <button
                type="button"
                onClick={() => {
                  const u = INITIAL_USERS.find(user => user.role === 'OFFICER_DISH' || user.email.includes('dish'));
                  if (u) { setCurrentUser(u); setActiveTab('officer-dashboard'); }
                }}
                className="p-2 rounded-xl bg-amber-50/60 hover:bg-amber-100/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 flex items-center gap-2 text-left cursor-pointer"
              >
                <span className="w-6 h-6 rounded bg-amber-100 text-amber-800 dark:bg-amber-900 text-xs flex items-center justify-center font-bold text-[10px]">4</span>
                <div>
                  <div className="font-bold text-[11px] text-amber-950 dark:text-amber-200">DISH Labour Officer</div>
                  <div className="text-[9px] text-amber-700 dark:text-amber-400">Inspector A. B. Kadam</div>
                </div>
              </button>

              {/* 5. MIDC Officer */}
              <button
                type="button"
                onClick={() => {
                  const u = INITIAL_USERS.find(user => user.role === 'OFFICER_MIDC' || user.email.includes('midc'));
                  if (u) { setCurrentUser(u); setActiveTab('officer-dashboard'); }
                }}
                className="p-2 rounded-xl bg-teal-50/60 hover:bg-teal-100/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 flex items-center gap-2 text-left cursor-pointer"
              >
                <span className="w-6 h-6 rounded bg-teal-100 text-teal-800 dark:bg-teal-900 text-xs flex items-center justify-center font-bold text-[10px]">5</span>
                <div>
                  <div className="font-bold text-[11px] text-teal-950 dark:text-teal-200">MIDC Officer</div>
                  <div className="text-[9px] text-teal-700 dark:text-teal-400">Er. Suresh Shinde</div>
                </div>
              </button>

              {/* 6. MSEDCL Officer */}
              <button
                type="button"
                onClick={() => {
                  const u = INITIAL_USERS.find(user => user.role === 'OFFICER_MSEDCL' || user.email.includes('mahadiscom'));
                  if (u) { setCurrentUser(u); setActiveTab('officer-dashboard'); }
                }}
                className="p-2 rounded-xl bg-indigo-50/60 hover:bg-indigo-100/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 flex items-center gap-2 text-left cursor-pointer"
              >
                <span className="w-6 h-6 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900 text-xs flex items-center justify-center font-bold text-[10px]">6</span>
                <div>
                  <div className="font-bold text-[11px] text-indigo-950 dark:text-indigo-200">MSEDCL Officer</div>
                  <div className="text-[9px] text-indigo-700 dark:text-indigo-400">Er. R. N. Deshpande</div>
                </div>
              </button>

              {/* 7. FSSAI Officer */}
              <button
                type="button"
                onClick={() => {
                  const u = INITIAL_USERS.find(user => user.role === 'OFFICER_FSSAI' || user.email.includes('fssai'));
                  if (u) { setCurrentUser(u); setActiveTab('officer-dashboard'); }
                }}
                className="p-2 rounded-xl bg-orange-50/60 hover:bg-orange-100/60 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 flex items-center gap-2 text-left cursor-pointer"
              >
                <span className="w-6 h-6 rounded bg-orange-100 text-orange-800 dark:bg-orange-900 text-xs flex items-center justify-center font-bold text-[10px]">7</span>
                <div>
                  <div className="font-bold text-[11px] text-orange-950 dark:text-orange-200">FSSAI Officer</div>
                  <div className="text-[9px] text-orange-700 dark:text-orange-400">Meena Thorat</div>
                </div>
              </button>

              {/* 8. Admin */}
              <button
                type="button"
                onClick={() => {
                  const u = INITIAL_USERS.find(user => user.role === 'ADMIN');
                  if (u) { setCurrentUser(u); setActiveTab('admin-dashboard'); }
                }}
                className="p-2 rounded-xl bg-purple-50/60 hover:bg-purple-100/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 flex items-center gap-2 text-left cursor-pointer"
              >
                <span className="w-6 h-6 rounded bg-purple-100 text-purple-800 dark:bg-purple-900 text-xs flex items-center justify-center font-bold text-[10px]">8</span>
                <div>
                  <div className="font-bold text-[11px] text-purple-950 dark:text-purple-200">Platform Admin</div>
                  <div className="text-[9px] text-purple-700 dark:text-purple-400">MAITRI Admin</div>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
