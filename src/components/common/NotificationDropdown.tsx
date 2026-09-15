import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Check, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

export const NotificationDropdown: React.FC = () => {
  const { currentUser, activeProject, notifications, markNotificationRead } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  // Scope notifications to current user and active project
  const userNotifications = notifications.filter(n => 
    (!n.userId || n.userId === currentUser.id) &&
    (!n.projectId || (activeProject?.id && n.projectId === activeProject.id))
  );

  const unreadCount = userNotifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-mh-saffron text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
          <div className="flex items-center justify-between p-3.5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm text-slate-800 dark:text-white">Notifications</h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-800 font-medium rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
            {userNotifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No notifications right now.
              </div>
            ) : (
              userNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`p-3.5 text-xs transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                    !n.read ? 'bg-amber-50/40 dark:bg-slate-700/30 font-medium' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {n.type === 'ALERT' && <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
                    {n.type === 'WARNING' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                    {n.type === 'SUCCESS' && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                    {n.type === 'INFO' && <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />}
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.timestamp.split(' ')[1]}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{n.message}</p>
                      
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                        <span>Channels:</span>
                        {n.channels.map(ch => (
                          <span key={ch} className="px-1 py-0.2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                            {ch}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
