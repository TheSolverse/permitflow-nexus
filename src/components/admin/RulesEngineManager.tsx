import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sliders, Plus, CheckCircle2, Trash2 } from 'lucide-react';
import { Sector, ProjectType } from '../../types';

export const RulesEngineManager: React.FC = () => {
  const { rules, addRule } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [sector, setSector] = useState<Sector | 'ALL'>('Food Processing');
  const [projectType, setProjectType] = useState<ProjectType | 'ALL'>('ALL');
  const [approvalId, setApprovalId] = useState('appr-12');
  const [department, setDepartment] = useState('FSSAI Food Safety Maharashtra');
  const [fee, setFee] = useState('₹7,500');
  const [expectedTimelineDays, setExpectedTimelineDays] = useState(18);
  const [riskCategory, setRiskCategory] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRule({
      sector,
      projectType,
      locationCategory: 'MIDC',
      hasHazardous: false,
      hasConstruction: true,
      minEmployees: 10,
      approvalId,
      department,
      fee,
      expectedTimelineDays: Number(expectedTimelineDays),
      dependencies: ['appr-2'],
      riskCategory
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">MAITRI Rules Engine Configurator</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Define dynamic approval triggers, statutory SLAs, fees, and prerequisite dependency chains.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Approval Rule</span>
        </button>
      </div>

      {/* Rules Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4 font-bold">Rule ID</th>
                <th className="py-3 px-4 font-bold">Sector Condition</th>
                <th className="py-3 px-4 font-bold">Triggered Approval</th>
                <th className="py-3 px-4 font-bold">Department</th>
                <th className="py-3 px-4 font-bold">Statutory SLA</th>
                <th className="py-3 px-4 font-bold">Fee</th>
                <th className="py-3 px-4 font-bold">Risk Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {rules.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                  <td className="py-3.5 px-4 font-bold text-purple-600 dark:text-purple-400">{r.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">{r.sector}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{r.approvalId}</td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{r.department}</td>
                  <td className="py-3.5 px-4 font-bold text-amber-600">{r.expectedTimelineDays} Days</td>
                  <td className="py-3.5 px-4 font-semibold">{r.fee}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      {r.riskCategory}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4 text-xs">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Configure New Rule</h3>
            
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Target Industry Sector</label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2"
                >
                  <option value="ALL">ALL Sectors</option>
                  <option value="Food Processing">Food Processing</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Chemical">Chemical</option>
                  <option value="Pharmaceutical">Pharmaceutical</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Department Authority</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Statutory SLA (Days)</label>
                  <input
                    type="number"
                    value={expectedTimelineDays}
                    onChange={(e) => setExpectedTimelineDays(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Fee</label>
                  <input
                    type="text"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 text-white font-bold"
                >
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
