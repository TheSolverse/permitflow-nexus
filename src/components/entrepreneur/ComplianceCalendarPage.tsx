import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ComplianceTask } from '../../types';
import { 
  Calendar, 
  CalendarClock, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  RefreshCw, 
  Bell, 
  List, 
  Sparkles,
  Activity
} from 'lucide-react';

export const ComplianceCalendarPage: React.FC = () => {
  const { complianceTasks, activeProject } = useApp();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const projectTasks = complianceTasks.filter(t => activeProject?.id && t.projectId === activeProject.id);
  const completedCount = projectTasks.filter(t => t.status === 'COMPLETED').length;
  const totalTasks = projectTasks.length;
  const complianceHealthPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 100;

  const getStatusBadge = (status: ComplianceTask['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300';
      case 'DUE_SOON':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300';
      case 'OVERDUE':
        return 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-300';
      default:
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner - Consistent Maharashtra Gov Forest Green Theme */}
      <div className="bg-[#F8FCF9] dark:bg-[#16261C] p-6 rounded-2xl border border-[#D4EEDC] dark:border-[#253D2C] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#192A1E] dark:text-[#E8F7ED]">Compliance & Renewal Calendar</h1>
          <p className="text-xs text-[#4A6B53] dark:text-[#A3D4B3] mt-1 font-medium">
            Automated compliance tracking & renewal reminders for <strong className="text-slate-900 dark:text-white font-extrabold">{activeProject.businessName}</strong>.
          </p>
        </div>

        {/* View Mode & Health Score */}
        <div className="flex items-center gap-4">
          
          {/* Compliance Health Badge */}
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-[#D4EEDC] dark:border-[#253D2C] flex items-center gap-3 shadow-xs">
            <Activity className="w-5 h-5 text-[#2E6F40] dark:text-[#68BA7F]" />
            <div>
              <div className="text-[10px] uppercase font-bold text-[#4A6B53] dark:text-[#A3D4B3]">Compliance Health</div>
              <div className="font-extrabold text-base text-[#2E6F40] dark:text-[#68BA7F]">{complianceHealthPct}%</div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-[#D4EEDC] dark:border-[#253D2C] text-xs font-semibold shadow-xs">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-[#2E6F40] text-white shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${viewMode === 'calendar' ? 'bg-[#2E6F40] text-white shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Calendar View</span>
            </button>
          </div>
        </div>
      </div>

      {/* CALENDAR GRID VIEW */}
      {viewMode === 'calendar' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white">
            <span>August / September 2026 Renewal Schedule</span>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed</span>
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Due Soon</span>
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Overdue</span>
            </div>
          </div>

          {/* Grid mockup */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="py-2 font-bold text-slate-400 uppercase text-[10px]">{d}</div>
            ))}
            {Array.from({ length: 31 }).map((_, i) => {
              const dayNum = i + 1;
              const hasTask = projectTasks.find(t => t.dueDate.endsWith(`-${dayNum < 10 ? '0' + dayNum : dayNum}`));

              return (
                <div
                  key={i}
                  className={`min-h-[70px] p-1.5 rounded-xl border text-left flex flex-col justify-between transition-colors ${
                    hasTask
                      ? 'bg-amber-50/60 dark:bg-slate-700/60 border-amber-300 dark:border-slate-600 font-semibold'
                      : 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-[11px] font-bold">{dayNum}</span>
                  {hasTask && (
                    <div className={`p-1 rounded text-[9px] font-bold truncate leading-tight ${getStatusBadge(hasTask.status)}`}>
                      {hasTask.title}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {projectTasks.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto opacity-80" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">No Renewal Deadlines Due</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All statutory clearances and annual returns for <strong className="text-slate-700 dark:text-slate-200">{activeProject?.businessName}</strong> are up to date.
              </p>
            </div>
          ) : (
            projectTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{task.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{task.department} • {task.approvalName}</div>
                </div>

                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CalendarClock className="w-4 h-4 text-mh-saffron" />
                  <span>Due Date: {task.dueDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Renewal Period:</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{task.renewalPeriodMonths} Months Cycle</div>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Statutory Fee:</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{task.renewalFee}</div>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Action Required:</span>
                  <div className="font-medium text-slate-700 dark:text-slate-300">{task.actionRequired}</div>
                </div>
              </div>

              {/* Reminders Dispatch Tags */}
              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-slate-400 text-[11px]">Automated Reminders Sent:</span>
                  <div className="flex flex-wrap gap-1">
                    {task.reminderSentDates.map(r => (
                      <span key={r} className="px-2 py-0.2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[9px] font-semibold">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => alert(`Initiating ${task.title} submission portal...`)}
                  className="px-4 py-1.5 rounded-xl bg-mh-saffron text-white font-bold text-xs hover:brightness-110 shadow-xs flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Start Renewal</span>
                </button>
              </div>
            </div>
          )))}
        </div>
      )}

    </div>
  );
};
