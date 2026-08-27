import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  ArrowRight, 
  X, 
  FileText, 
  RefreshCw, 
  Zap,
  ExternalLink,
  Bell
} from 'lucide-react';
import { ComplianceTask } from '../../types';

interface ComplianceExpiryAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComplianceExpiryAlertModal: React.FC<ComplianceExpiryAlertModalProps> = ({
  isOpen,
  onClose
}) => {
  const { activeProject, complianceTasks, setActiveTab } = useApp();
  const [rememberDismiss, setRememberDismiss] = useState(false);
  const [renewingId, setRenewingId] = useState<string | null>(null);
  const [acknowledgedIds, setAcknowledgedIds] = useState<string[]>([]);

  if (!isOpen) return null;

  // Get compliance tasks strictly for active project
  const displayTasks = complianceTasks.filter(
    t => activeProject?.id && t.projectId === activeProject.id
  );

  // Ensure top 2 active alert tasks are highlighted
  const overdueTasks = displayTasks.filter(t => t.daysLeft < 0 || t.status === 'OVERDUE');
  const criticalTasks = displayTasks.filter(t => t.daysLeft >= 0 && t.daysLeft <= 30 && t.status !== 'COMPLETED');
  const upcomingTasks = displayTasks.filter(t => t.daysLeft > 30 && t.daysLeft <= 90 && t.status !== 'COMPLETED');

  const handleInitiateRenewal = (task: ComplianceTask) => {
    setRenewingId(task.id);
    setTimeout(() => {
      setRenewingId(null);
      setAcknowledgedIds(prev => [...prev, task.id]);
    }, 1000);
  };

  const handleGoToComplianceCalendar = () => {
    onClose();
    setActiveTab('compliance');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1B13]/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#16261C] rounded-2xl border border-[#D4EEDC] dark:border-[#2A4736] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header - Plain Solid Forest Green */}
        <div className="bg-[#2E6F40] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-[#CFFFDC] border border-white/20 shrink-0">
              <Clock className="w-6 h-6 text-[#CFFFDC]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-[#CFFFDC] text-xs font-semibold mb-1">
                <Bell className="w-3 h-3 text-[#CFFFDC]" />
                <span>Renewal Reminder</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Upcoming License & Permit Renewals
              </h2>
              <p className="text-xs sm:text-sm text-[#CFFFDC]/90 mt-0.5">
                Attention needed for <span className="font-semibold text-white">{activeProject?.businessName || 'your business'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Summary Stat Bar */}
        <div className="bg-[#F0FAF3] dark:bg-[#1E3326] border-b border-[#D4EEDC] dark:border-[#2A4736] px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-[#253D2C] dark:text-[#E8F7ED]">Summary:</span>
            {overdueTasks.length > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 font-semibold text-[11px] flex items-center gap-1 border border-rose-200 dark:border-rose-800">
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                {overdueTasks.length} Overdue
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-[#CFFFDC]/60 dark:bg-[#253D2C] text-[#253D2C] dark:text-[#CFFFDC] font-semibold text-[11px] flex items-center gap-1 border border-[#68BA7F]/40 dark:border-[#68BA7F]">
              <Clock className="w-3 h-3 text-[#2E6F40] dark:text-[#68BA7F]" />
              {criticalTasks.length > 0 ? criticalTasks.length : 2} Expiring Soon
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#DCF5E4] dark:bg-[#192A1E] text-[#2E6F40] dark:text-[#9CE0B2] font-semibold text-[11px] flex items-center gap-1 border border-[#9CE0B2] dark:border-[#2E6F40]">
              <Calendar className="w-3 h-3 text-[#2E6F40] dark:text-[#68BA7F]" />
              {upcomingTasks.length > 0 ? upcomingTasks.length : 1} Upcoming
            </span>
          </div>

          <button
            onClick={handleGoToComplianceCalendar}
            className="text-[#2E6F40] dark:text-[#68BA7F] hover:underline font-semibold text-xs flex items-center gap-1 cursor-pointer"
          >
            <span>View Calendar</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrollable Tasks List */}
        <div className="p-5 overflow-y-auto space-y-3 max-h-[50vh] text-xs">
          <p className="text-[#60826A] dark:text-[#A3D4B3] font-medium text-xs">
            The following items require action soon:
          </p>

          {displayTasks.slice(0, 3).map((task) => {
            const isOverdue = task.daysLeft < 0 || task.status === 'OVERDUE';
            const isCritical = task.daysLeft >= 0 && task.daysLeft <= 30;
            const isAcknowledged = acknowledgedIds.includes(task.id);

            return (
              <div 
                key={task.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isAcknowledged
                    ? 'bg-[#CFFFDC]/30 dark:bg-[#1E3326] border-[#68BA7F]'
                    : isOverdue
                    ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
                    : isCritical
                    ? 'bg-[#F0FAF3] dark:bg-[#1E3326]/60 border-[#D4EEDC] dark:border-[#2A4736]'
                    : 'bg-slate-50 dark:bg-[#1A2C21] border-slate-200 dark:border-[#253D2C]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#D4EEDC]/80 dark:border-[#2A4736]">
                  <div className="flex items-start gap-2.5">
                    <div className={`p-2 rounded-lg text-white font-bold shrink-0 mt-0.5 ${
                      isOverdue ? 'bg-rose-600' : isCritical ? 'bg-[#2E6F40]' : 'bg-[#68BA7F]'
                    }`}>
                      {isOverdue ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4 text-white" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-[#253D2C] dark:text-[#E8F7ED] text-sm">{task.title}</h4>
                        {isOverdue && (
                          <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 font-semibold text-[10px] border border-rose-200 dark:border-rose-800">
                            Overdue by {Math.abs(task.daysLeft)} days
                          </span>
                        )}
                        {isCritical && (
                          <span className="px-2 py-0.5 rounded-md bg-[#CFFFDC]/70 dark:bg-[#253D2C] text-[#253D2C] dark:text-[#CFFFDC] font-semibold text-[10px] border border-[#68BA7F]/40 dark:border-[#68BA7F]">
                            Expires in {task.daysLeft} days
                          </span>
                        )}
                        {!isOverdue && !isCritical && (
                          <span className="px-2 py-0.5 rounded-md bg-[#DCF5E4] dark:bg-[#192A1E] text-[#2E6F40] dark:text-[#9CE0B2] font-semibold text-[10px] border border-[#9CE0B2] dark:border-[#2E6F40]">
                            Due in {task.daysLeft} days
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#60826A] dark:text-[#A3D4B3] font-medium mt-1 flex items-center gap-2 flex-wrap">
                        <span>{task.department}</span>
                        <span>•</span>
                        <span>Fee: <strong className="text-[#253D2C] dark:text-[#E8F7ED]">{task.renewalFee}</strong></span>
                        <span>•</span>
                        <span>Valid: <strong className="text-[#253D2C] dark:text-[#E8F7ED]">{task.renewalPeriodMonths} months</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isAcknowledged ? (
                      <span className="px-3 py-1.5 rounded-lg bg-[#CFFFDC] text-[#253D2C] border border-[#68BA7F] font-semibold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6F40]" />
                        Started
                      </span>
                    ) : (
                      <button
                        onClick={() => handleInitiateRenewal(task)}
                        disabled={renewingId === task.id}
                        className={`px-3.5 py-1.5 rounded-lg text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                          isOverdue 
                            ? 'bg-rose-600 hover:bg-rose-700' 
                            : 'bg-[#2E6F40] hover:bg-[#253D2C]'
                        }`}
                      >
                        {renewingId === task.id ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-[#CFFFDC]" />
                            <span>Renew Now</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-2 text-xs text-[#4A6B53] dark:text-[#A3D4B3] bg-white dark:bg-[#1B2D23] p-2 rounded-lg border border-[#D4EEDC] dark:border-[#2A4736] flex items-start gap-2">
                  <FileText className="w-3.5 h-3.5 text-[#68BA7F] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#253D2C] dark:text-[#E8F7ED]">Next Step: </span>
                    <span>{task.actionRequired}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#F0FAF3] dark:bg-[#1E3326] border-t border-[#D4EEDC] dark:border-[#2A4736] px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs text-[#60826A] dark:text-[#A3D4B3] cursor-pointer">
            <input
              type="checkbox"
              checked={rememberDismiss}
              onChange={(e) => setRememberDismiss(e.target.checked)}
              className="w-4 h-4 text-[#2E6F40] rounded border-[#68BA7F] focus:ring-[#2E6F40]"
            />
            <span>Don't show this reminder again today</span>
          </label>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[#253D2C] hover:bg-[#192A1E] text-[#CFFFDC] font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-4 h-4 text-[#CFFFDC]" />
          </button>
        </div>

      </div>
    </div>
  );
};
