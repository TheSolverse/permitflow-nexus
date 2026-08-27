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
  Lock,
  Trash2,
  AlertTriangle
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
    setActiveTab,
    deleteAccount
  } = useApp();

  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#16261C]/95 backdrop-blur-md border-b border-[#D4EEDC] dark:border-[#253D2C] shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[64px] py-2">
          
          {/* Brand Logo & Official Badge */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab(currentUser.role === 'ENTREPRENEUR' ? 'dashboard' : currentUser.role === 'OFFICER' ? 'officer-dashboard' : 'admin-dashboard')}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2E6F40] flex items-center justify-center text-white shadow-xs border border-[#68BA7F]/40 shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#CFFFDC]" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#253D2C] dark:text-[#E8F7ED] leading-tight">
                    Permit<span className="text-[#2E6F40] dark:text-[#68BA7F]">Flow</span> <span className="text-[#253D2C] dark:text-[#CFFFDC]">Nexus</span>
                  </span>
                  <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-[#2E6F40] dark:text-[#CFFFDC] bg-[#CFFFDC]/40 dark:bg-[#253D2C] rounded-md border border-[#68BA7F]/40 dark:border-[#2E6F40]">
                    MAHARASHTRA
                  </span>
                </div>
                <p className="hidden sm:block text-[11px] text-[#4A6B53] dark:text-[#A3D4B3] font-medium leading-tight mt-0.5">
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
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F0FAF3] dark:bg-[#1E3326] hover:bg-[#DCF5E4] dark:hover:bg-[#253D2C] border border-[#D4EEDC] dark:border-[#2A4736] transition-colors text-xs text-[#192A1E] dark:text-[#E8F7ED] font-medium cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-[#2E6F40] dark:text-[#68BA7F]" />
                <div className="text-left">
                  <div className="text-[10px] text-[#60826A] dark:text-[#A3D4B3] font-normal">Active Business:</div>
                  <div className="font-bold text-[#192A1E] dark:text-white max-w-[180px] truncate">{activeProject.businessName}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#60826A] dark:text-[#A3D4B3] ml-1" />
              </button>

              {projectDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-[#1B2D23] rounded-xl shadow-xl border border-[#D4EEDC] dark:border-[#2A4736] py-1.5 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-[#60826A] dark:text-[#A3D4B3] uppercase tracking-wider">
                    Switch Business Unit
                  </div>
                  {projects.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActiveProjectId(p.id);
                        setProjectDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F0FAF3] dark:hover:bg-[#253D2C] ${
                        p.id === activeProjectId ? 'bg-[#CFFFDC]/40 dark:bg-[#253D2C] text-[#2E6F40] dark:text-[#CFFFDC] font-bold' : 'text-[#253D2C] dark:text-[#D1E8DA]'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-semibold truncate">{p.businessName}</div>
                        <div className="text-[10px] text-[#60826A] dark:text-[#A3D4B3]">{p.sector} • {p.district}</div>
                      </div>
                      {p.id === activeProjectId && <div className="w-2 h-2 rounded-full bg-[#2E6F40] dark:bg-[#68BA7F]" />}
                    </button>
                  ))}
                  <div className="border-t border-[#D4EEDC] dark:border-[#2A4736] mt-1 pt-1 px-2">
                    <button
                      onClick={() => {
                        setActiveTab('new-project');
                        setProjectDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-[#2E6F40] dark:text-[#CFFFDC] hover:bg-[#F0FAF3] dark:hover:bg-[#253D2C] rounded-lg font-bold transition-colors cursor-pointer"
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
            <div className="hidden xl:flex items-center gap-1 bg-[#F0FAF3] dark:bg-[#1E3326] p-1 rounded-lg border border-[#D4EEDC] dark:border-[#2A4736] text-[11px]">
              <button
                onClick={() => switchRole('ENTREPRENEUR')}
                className={`px-2.5 py-0.5 rounded font-bold transition-all cursor-pointer ${currentUser.role === 'ENTREPRENEUR' ? 'bg-[#2E6F40] text-white shadow-xs' : 'text-[#4A6B53] dark:text-[#A3D4B3] hover:text-[#253D2C] dark:hover:text-white'}`}
              >
                Entrepreneur
              </button>
              <button
                onClick={() => switchRole('OFFICER')}
                className={`px-2.5 py-0.5 rounded font-bold transition-all cursor-pointer ${currentUser.role === 'OFFICER' ? 'bg-[#2E6F40] text-white shadow-xs' : 'text-[#4A6B53] dark:text-[#A3D4B3] hover:text-[#253D2C] dark:hover:text-white'}`}
              >
                Officer
              </button>
              <button
                onClick={() => switchRole('ADMIN')}
                className={`px-2.5 py-0.5 rounded font-bold transition-all cursor-pointer ${currentUser.role === 'ADMIN' ? 'bg-[#2E6F40] text-white shadow-xs' : 'text-[#4A6B53] dark:text-[#A3D4B3] hover:text-[#253D2C] dark:hover:text-white'}`}
              >
                Admin
              </button>
            </div>

            {/* User Profile Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#F0FAF3] dark:hover:bg-[#1E3326] transition-colors border border-[#D4EEDC] dark:border-[#2A4736] cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[#253D2C] dark:bg-[#2E6F40] flex items-center justify-center text-[#CFFFDC] font-bold text-xs">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="hidden sm:block text-left pr-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize font-medium">
                    {currentUser.role.toLowerCase()}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                    <div className="font-bold text-xs text-slate-900 dark:text-white">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{currentUser.email}</div>
                    <div className="mt-1 inline-block px-2 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded border border-slate-200 dark:border-slate-600">
                      Role: {currentUser.role}
                    </div>
                  </div>

                  <div className="py-1">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Role (Demo Mode)
                    </div>
                    <button
                      onClick={() => { switchRole('ENTREPRENEUR'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-blue-500" />
                      Entrepreneur (Rahul Sharma)
                    </button>
                    <button
                      onClick={() => { switchRole('OFFICER'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Government Officer (Dr. V. K. Patil)
                    </button>
                    <button
                      onClick={() => { switchRole('ADMIN'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-purple-500" />
                      Platform Admin (PFN Admin)
                    </button>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-700 pt-1 space-y-0.5">
                    <button
                      onClick={() => {
                        setActiveTab('login');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 font-bold cursor-pointer transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-slate-400" />
                      {t('logout', language)}
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setShowDeleteModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 font-bold cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      Delete Account (DB)
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-200 dark:border-red-900/50 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Permanently Delete Account?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Action irreversible across PostgreSQL database
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/30 text-xs text-red-700 dark:text-red-300 leading-relaxed">
              Are you sure you want to delete <span className="font-bold">"{currentUser.name}"</span> (<span className="font-mono text-[11px]">{currentUser.email}</span>)?
              <br /><br />
              This will permanently delete your user record, all linked business projects, submitted NOCs, and uploaded compliance documents from your <strong>Supabase PostgreSQL database</strong>.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);
                  await deleteAccount(currentUser.id);
                  setIsDeleting(false);
                  setShowDeleteModal(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {isDeleting ? 'Deleting from DB...' : 'Yes, Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
