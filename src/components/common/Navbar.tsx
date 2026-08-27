import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';
import { NotificationDropdown } from './NotificationDropdown';
import { 
  Building2, 
  ShieldCheck, 
  User as UserIcon, 
  ChevronDown, 
  Plus, 
  LogOut, 
  Lock
} from 'lucide-react';
import { t } from '../../utils/translations';
import { INITIAL_USERS } from '../../data/mockData';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    language, 
    projects, 
    activeProjectId, 
    setActiveProjectId, 
    activeProject,
    setActiveTab 
  } = useApp();

  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const switchRole = (role: 'ENTREPRENEUR' | 'OFFICER' | 'ADMIN') => {
    const target = INITIAL_USERS.find(u => u.role === role);
    if (target) {
      setCurrentUser(target);
      if (role === 'ENTREPRENEUR') setActiveTab('dashboard');
      else if (role === 'OFFICER') setActiveTab('officer-dashboard');
      else if (role === 'ADMIN') setActiveTab('admin-dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-sky-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[64px] py-2">
          
          {/* Brand Logo & Official Badge */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab(currentUser.role === 'ENTREPRENEUR' ? 'dashboard' : currentUser.role === 'OFFICER' ? 'officer-dashboard' : 'admin-dashboard')}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md border border-blue-500 shrink-0">
                <ShieldCheck className="w-6 h-6 text-amber-300" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 leading-tight">
                    Permit<span className="text-amber-600">Flow</span> <span className="text-slate-800">Nexus</span>
                  </span>
                  <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-slate-800 bg-slate-100 rounded-md border border-slate-300">
                    MAHARASHTRA
                  </span>
                </div>
                <p className="hidden sm:block text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                  {t('tagline', language)}
                </p>
              </div>
            </button>
          </div>

          {/* Active Business Project Switcher (For Entrepreneurs) */}
          {currentUser.role === 'ENTREPRENEUR' && activeProject && (
            <div className="relative hidden lg:block">
              <button
                onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-xs text-slate-800 font-medium"
              >
                <Building2 className="w-4 h-4 text-amber-600" />
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 font-normal">Active Business:</div>
                  <div className="font-bold text-slate-900 max-w-[180px] truncate">{activeProject.businessName}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {projectDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Business Unit
                  </div>
                  {projects.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActiveProjectId(p.id);
                        setProjectDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                        p.id === activeProjectId ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-semibold truncate">{p.businessName}</div>
                        <div className="text-[10px] text-slate-400">{p.sector} • {p.district}</div>
                      </div>
                      {p.id === activeProjectId && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1 px-2">
                    <button
                      onClick={() => {
                        setActiveTab('new-project');
                        setProjectDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-slate-800 hover:bg-slate-100 rounded-lg font-bold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add New Business Project
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Controls & Role Quick Switch */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />
            <ThemeToggle />
            <NotificationDropdown />

            {/* Role Switcher Pills */}
            <div className="hidden xl:flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-[11px]">
              <button
                onClick={() => switchRole('ENTREPRENEUR')}
                className={`px-2.5 py-0.5 rounded font-bold transition-all ${currentUser.role === 'ENTREPRENEUR' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Entrepreneur
              </button>
              <button
                onClick={() => switchRole('OFFICER')}
                className={`px-2.5 py-0.5 rounded font-bold transition-all ${currentUser.role === 'OFFICER' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Officer
              </button>
              <button
                onClick={() => switchRole('ADMIN')}
                className={`px-2.5 py-0.5 rounded font-bold transition-all ${currentUser.role === 'ADMIN' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Admin
              </button>
            </div>

            {/* User Profile Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-amber-400 font-bold text-xs">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="hidden sm:block text-left pr-1">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize font-medium">
                    {currentUser.role.toLowerCase()}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="font-bold text-xs text-slate-900">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-500">{currentUser.email}</div>
                    <div className="mt-1 inline-block px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 rounded border">
                      Role: {currentUser.role}
                    </div>
                  </div>

                  <div className="py-1">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Role (Demo Mode)
                    </div>
                    <button
                      onClick={() => { switchRole('ENTREPRENEUR'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-amber-600" />
                      Entrepreneur (Rahul Sharma)
                    </button>
                    <button
                      onClick={() => { switchRole('OFFICER'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      Government Officer (Dr. V. K. Patil)
                    </button>
                    <button
                      onClick={() => { switchRole('ADMIN'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <Lock className="w-3.5 h-3.5 text-purple-600" />
                      Platform Admin (PFN Admin)
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        setActiveTab('login');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-bold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      {t('logout', language)}
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
