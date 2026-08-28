import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { INITIAL_USERS } from '../../data/mockData';
import { ShieldCheck, User as UserIcon, Lock, Mail, ArrowRight, UserPlus, AlertCircle } from 'lucide-react';
import { LanguageSelector } from '../common/LanguageSelector';
import { ThemeToggle } from '../common/ThemeToggle';
import { t } from '../../utils/translations';
import { signupUser, loginUser } from '../../services/api';

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

    try {
      const res = await loginUser(cleanEmail, password, selectedRole);
      if (res?.user) {
        setCurrentUser(res.user);
        setIsSubmitting(false);
        if (selectedRole === 'ENTREPRENEUR') setActiveTab('dashboard');
        else if (selectedRole === 'OFFICER') setActiveTab('officer-dashboard');
        else setActiveTab('admin-dashboard');
        return;
      }
      if (res?.error && res.error !== 'NetworkError' && !res.error.includes('Failed to fetch')) {
        setAuthError(res.error);
        setIsSubmitting(false);
        return;
      }
    } catch (err: any) {
      console.warn('Backend login unavailable, falling back to local session authentication:', err);
    }

    // Local / Offline authentication fallback
    const localUsers = JSON.parse(localStorage.getItem('pfn_registered_users') || '[]');
    const matchedLocal = localUsers.find((u: any) => u.email.toLowerCase() === cleanEmail);
    const matchedDemo = INITIAL_USERS.find(u => u.email.toLowerCase() === cleanEmail && u.role === selectedRole);

    const userToLogin = matchedLocal || matchedDemo || {
      id: `usr-${Date.now()}`,
      name: cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Entrepreneur User',
      email: cleanEmail,
      role: selectedRole,
      organization: selectedRole === 'ENTREPRENEUR' ? 'Maharashtra Enterprise' : selectedRole === 'OFFICER' ? 'Maharashtra Pollution Control Board (MPCB)' : 'Industry Directorate Admin'
    };

    setCurrentUser(userToLogin);
    setIsSubmitting(false);
    if (selectedRole === 'ENTREPRENEUR') setActiveTab('dashboard');
    else if (selectedRole === 'OFFICER') setActiveTab('officer-dashboard');
    else setActiveTab('admin-dashboard');
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim() || 'New Entrepreneur';
    const cleanBusiness = businessName.trim() || `${cleanName}'s Enterprise`;

    const userData = {
      name: cleanName,
      email: cleanEmail,
      password: password,
      role: 'ENTREPRENEUR',
      district: 'Pune'
    };

    let userCreated: any = null;

    try {
      const res = await signupUser(userData);
      if (res?.user) {
        userCreated = res.user;
      }
    } catch (err: any) {
      console.warn('Backend signup offline, creating local user account:', err);
    }

    if (!userCreated) {
      userCreated = {
        id: `usr-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        role: 'ENTREPRENEUR',
        organization: cleanBusiness,
        phone: '+91 98765 43210'
      };
    }

    // Cache locally
    const localUsers = JSON.parse(localStorage.getItem('pfn_registered_users') || '[]');
    localStorage.setItem('pfn_registered_users', JSON.stringify([...localUsers.filter((u: any) => u.email !== cleanEmail), userCreated]));

    setCurrentUser(userCreated);
    setIsSubmitting(false);
    setActiveTab('new-project');
  };

  const loginAsDemo = async (role: Role) => {
    setAuthError('');
    const demoUser = INITIAL_USERS.find(u => u.role === role);
    if (demoUser) {
      setCurrentUser(demoUser);
      await signupUser({
        name: demoUser.name,
        email: demoUser.email,
        password: 'Password@123',
        role: demoUser.role
      }).catch(() => {});
      if (role === 'ENTREPRENEUR') setActiveTab('dashboard');
      else if (role === 'OFFICER') setActiveTab('officer-dashboard');
      else setActiveTab('admin-dashboard');
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
              {t('instantDemoAccess', language)}
            </div>

            <div className="space-y-1.5 text-xs">
              <button
                type="button"
                onClick={() => loginAsDemo('ENTREPRENEUR')}
                className="w-full p-2.5 rounded-2xl bg-[#F8FCF9] hover:bg-[#EDF8F1] dark:bg-[#16261C] dark:hover:bg-[#1E3326] border border-[#D4EEDC] dark:border-[#253D2C] transition-all flex items-center justify-between text-left group font-medium cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#CFFFDC] dark:bg-[#253D2C] text-[#2E6F40] dark:text-[#CFFFDC] flex items-center justify-center font-extrabold text-[11px]">E</span>
                  <span className="font-bold text-[#192A1E] dark:text-white">{t('demoEntrepreneur', language)}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#2E6F40] dark:group-hover:text-[#68BA7F]" />
              </button>

              <button
                type="button"
                onClick={() => loginAsDemo('OFFICER')}
                className="w-full p-2.5 rounded-2xl bg-[#F8FCF9] hover:bg-[#EDF8F1] dark:bg-[#16261C] dark:hover:bg-[#1E3326] border border-[#D4EEDC] dark:border-[#253D2C] transition-all flex items-center justify-between text-left group font-medium cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 flex items-center justify-center font-extrabold text-[11px]">O</span>
                  <span className="font-bold text-[#192A1E] dark:text-white">{t('demoOfficer', language)}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#2E6F40] dark:group-hover:text-[#68BA7F]" />
              </button>

              <button
                type="button"
                onClick={() => loginAsDemo('ADMIN')}
                className="w-full p-2.5 rounded-2xl bg-[#F8FCF9] hover:bg-[#EDF8F1] dark:bg-[#16261C] dark:hover:bg-[#1E3326] border border-[#D4EEDC] dark:border-[#253D2C] transition-all flex items-center justify-between text-left group font-medium cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 flex items-center justify-center font-extrabold text-[11px]">A</span>
                  <span className="font-bold text-[#192A1E] dark:text-white">{t('demoAdmin', language)}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#2E6F40] dark:group-hover:text-[#68BA7F]" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
