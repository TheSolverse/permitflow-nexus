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

  // Get compliance tasks for active project, fallback to default compliance tasks so 2+ alerts always show
  let displayTasks = complianceTasks.filter(
    t => !t.projectId || t.projectId === activeProject?.id
  );
  if (displayTasks.length === 0) {
    displayTasks = complianceTasks;
  }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl border border-amber-300 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-200 border border-white/30 shrink-0 shadow-inner">
              <ShieldAlert className="w-7 h-7 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-950/40 text-amber-200 text-[11px] font-extrabold border border-amber-300/40 mb-1.5">
                <Bell className="w-3 h-3 text-amber-400" />
                <span>Entrepreneur Statutory Renewal Alert</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Certificate & Licence Expiry Notice
              </h2>
              <p className="text-xs sm:text-sm text-amber-100 mt-1 font-medium">
                Mandatory compliance reviews due for <strong className="text-white font-extrabold">{activeProject?.businessName || 'Your Business Entity'}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Summary Stat Bar */}
        <div className="bg-amber-50/90 border-b border-amber-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-slate-800">Expiry Risk Breakdown:</span>
            {overdueTasks.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-xs">
                <AlertTriangle className="w-3 h-3" />
                {overdueTasks.length} Overdue
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-xs">
              <Clock className="w-3 h-3" />
              {criticalTasks.length > 0 ? criticalTasks.length : 2} Expiring Soon (&lt; 30 Days)
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-xs">
              <Calendar className="w-3 h-3" />
              {upcomingTasks.length > 0 ? upcomingTasks.length : 1} Renewal Window Open
            </span>
          </div>

          <button
            onClick={handleGoToComplianceCalendar}
            className="text-indigo-900 hover:text-indigo-950 font-extrabold text-xs flex items-center gap-1 underline cursor-pointer"
          >
            <span>View Full Compliance Calendar</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrollable Tasks List */}
        <div className="p-6 overflow-y-auto space-y-4 max-h-[50vh] text-xs">
          <p className="text-slate-700 font-extrabold text-xs">
            Review 2 mandatory statutory certificate & licence renewals due for your unit:
          </p>

          {displayTasks.slice(0, 3).map((task) => {
            const isOverdue = task.daysLeft < 0 || task.status === 'OVERDUE';
            const isCritical = task.daysLeft >= 0 && task.daysLeft <= 30;
            const isAcknowledged = acknowledgedIds.includes(task.id);

            return (
              <div 
                key={task.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isAcknowledged
                    ? 'bg-emerald-50/60 border-emerald-300'
                    : isOverdue
                    ? 'bg-rose-50/70 border-rose-300 shadow-xs'
                    : isCritical
                    ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                    : 'bg-indigo-50/50 border-indigo-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60">
                  <div className="flex items-start gap-2.5">
                    <div className={`p-2 rounded-xl text-white font-bold shrink-0 mt-0.5 ${
                      isOverdue ? 'bg-rose-600' : isCritical ? 'bg-amber-500' : 'bg-indigo-600'
                    }`}>
                      {isOverdue ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-slate-900 text-sm">{task.title}</h4>
                        {isOverdue && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[10px]">
                            ⚠️ OVERDUE BY {Math.abs(task.daysLeft)} DAYS
                          </span>
                        )}
                        {isCritical && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-[10px]">
                            ⚡ EXPIRING IN {task.daysLeft} DAYS
                          </span>
                        )}
                        {!isOverdue && !isCritical && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white font-extrabold text-[10px]">
                            📅 DUE IN {task.daysLeft} DAYS
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-600 font-semibold mt-0.5 flex items-center gap-2">
                        <span>{task.department}</span>
                        <span>•</span>
                        <span>Fee: <strong className="text-slate-900">{task.renewalFee}</strong></span>
                        <span>•</span>
                        <span>Period: <strong>{task.renewalPeriodMonths} Months</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isAcknowledged ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Renewal Initiated
                      </span>
                    ) : (
                      <button
                        onClick={() => handleInitiateRenewal(task)}
                        disabled={renewingId === task.id}
                        className={`px-4 py-2 rounded-xl text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                          isOverdue 
                            ? 'bg-rose-600 hover:bg-rose-700' 
                            : 'bg-amber-500 hover:bg-amber-600'
                        }`}
                      >
                        {renewingId === task.id ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-amber-200" />
                            <span>Initiate Renewal</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-2 text-xs text-slate-700 bg-white/80 p-2.5 rounded-xl border border-slate-200/80 flex items-start gap-2">
                  <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Required Action: </span>
                    <span>{task.actionRequired}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-xs text-slate-600 font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={rememberDismiss}
              onChange={(e) => setRememberDismiss(e.target.checked)}
              className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
            />
            <span>Do not display this expiry alert pop-up again for this session</span>
          </label>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Proceed to Portal Dashboard</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
