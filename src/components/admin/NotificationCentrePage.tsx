import React from 'react';
import { Bell, Mail, MessageSquare, Phone, Send, CheckCircle2 } from 'lucide-react';

export const NotificationCentrePage: React.FC = () => {
  const templates = [
    { title: 'Application Submitted', channels: ['IN_APP', 'EMAIL', 'SMS'], status: 'Active' },
    { title: 'Department Query Raised', channels: ['IN_APP', 'EMAIL', 'SMS', 'WHATSAPP'], status: 'Active' },
    { title: 'Query Response Due Warning', channels: ['IN_APP', 'SMS'], status: 'Active' },
    { title: 'Inspection Scheduled Alert', channels: ['IN_APP', 'EMAIL', 'SMS'], status: 'Active' },
    { title: 'Approval Granted Certificate', channels: ['IN_APP', 'EMAIL', 'WHATSAPP'], status: 'Active' },
    { title: 'Compliance Renewal Due (30 Days)', channels: ['IN_APP', 'EMAIL'], status: 'Active' },
    { title: 'New Incentive Scheme Match', channels: ['IN_APP'], status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">System Notification Template Centre</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage alert templates and dispatch channels for In-App, Email, SMS & WhatsApp.
        </p>
      </div>

      <div className="space-y-3">
        {templates.map(t => (
          <div key={t.title} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">{t.title}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-slate-400">Dispatch Channels:</span>
                {t.channels.map(c => (
                  <span key={c} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-bold text-[10px]">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold rounded-full text-[10px]">
              {t.status}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
};
