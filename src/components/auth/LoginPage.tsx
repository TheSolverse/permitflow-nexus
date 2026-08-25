import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { INITIAL_USERS } from '../../data/mockData';
import { ShieldCheck, User as UserIcon, Lock, Mail, ArrowRight, UserPlus } from 'lucide-react';
import { LanguageSelector } from '../common/LanguageSelector';
import { ThemeToggle } from '../common/ThemeToggle';

export const LoginPage: React.FC = () => {
  const { setCurrentUser, setActiveTab } = useApp();
  const [selectedRole, setSelectedRole] = useState<Role>('ENTREPRENEUR');
  const [isSignup, setIsSignup] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const match = INITIAL_USERS.find(u => u.role === selectedRole && u.email === email);
    if (match) {
      setCurrentUser(match);
    } else {
      const fallback = INITIAL_USERS.find(u => u.role === selectedRole) || INITIAL_USERS[0];
      setCurrentUser(fallback);
    }

    if (selectedRole === 'ENTREPRENEUR') setActiveTab('dashboard');
    else if (selectedRole === 'OFFICER') setActiveTab('officer-dashboard');
    else setActiveTab('admin-dashboard');
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: `usr-${Date.now()}`,
      name: name || 'New Entrepreneur',
      email: email || 'entrepreneur@newunit.in',
      role: 'ENTREPRENEUR' as Role,
      organization: businessName || 'New Maharashtra Enterprise'
    };
    setCurrentUser(newUser);
    setActiveTab('new-project');
  };

  const loginAsDemo = (role: Role) => {
    const demoUser = INITIAL_USERS.find(u => u.role === role);
    if (demoUser) {
      setCurrentUser(demoUser);
      if (role === 'ENTREPRENEUR') setActiveTab('dashboard');
      else if (role === 'OFFICER') setActiveTab('officer-dashboard');
      else setActiveTab('admin-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      
      {/* Auth Header */}
      <header className="p-4 sm:p-6 bg-white border-b border-slate-200 flex items-center justify-between">
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2 text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-amber-500 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900">
            Permit<span className="text-amber-600">Flow</span> Nexus
          </span>
        </button>

        <div className="flex items-center gap-3">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900">
              {isSignup ? 'Create Entrepreneur Account' : 'Sign in to PermitFlow'}
            </h2>
            <p className="text-xs text-slate-500">
              {isSignup ? 'Start your business approval journey in Maharashtra' : 'Access your approval dashboard, compliance tasks & incentives'}
            </p>
          </div>

          {/* Role Selector Tabs */}
          {!isSignup && (
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setSelectedRole('ENTREPRENEUR')}
                className={`py-2 rounded-lg font-bold transition-all ${
                  selectedRole === 'ENTREPRENEUR'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Entrepreneur
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('OFFICER')}
                className={`py-2 rounded-lg font-bold transition-all ${
                  selectedRole === 'OFFICER'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Officer
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('ADMIN')}
                className={`py-2 rounded-lg font-bold transition-all ${
                  selectedRole === 'ADMIN'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin
              </button>
            </div>
          )}

          {/* Login / Signup Forms */}
          {!isSignup ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
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
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Log In as {selectedRole.toLowerCase()}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anand Deshpande"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Sahyadri Bio Tech Pvt Ltd"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anand@sahyadribio.in"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Entrepreneur Profile</span>
              </button>
            </form>
          )}

          <div className="text-center text-xs text-slate-500">
            {isSignup ? (
              <span>Already have an account? <button onClick={() => setIsSignup(false)} className="text-amber-700 underline font-bold">Log in</button></span>
            ) : (
              <span>New Entrepreneur? <button onClick={() => setIsSignup(true)} className="text-amber-700 underline font-bold">Sign up here</button></span>
            )}
          </div>

          {/* One-Click Quick Demo Login Section */}
          <div className="border-t border-slate-200 pt-4 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              One-Click Instant Demo Access:
            </div>

            <div className="space-y-1.5 text-xs">
              <button
                type="button"
                onClick={() => loginAsDemo('ENTREPRENEUR')}
                className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex items-center justify-between text-left group font-medium"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-[11px]">E</span>
                  <span>Rahul Sharma (Entrepreneur)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900" />
              </button>

              <button
                type="button"
                onClick={() => loginAsDemo('OFFICER')}
                className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex items-center justify-between text-left group font-medium"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-[11px]">O</span>
                  <span>Dr. V. K. Patil (MPCB Officer)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900" />
              </button>

              <button
                type="button"
                onClick={() => loginAsDemo('ADMIN')}
                className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex items-center justify-between text-left group font-medium"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-[11px]">A</span>
                  <span>MAITRI Admin Console</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
