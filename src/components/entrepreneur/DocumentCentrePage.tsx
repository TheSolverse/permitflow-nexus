import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentValidationStatus, DocumentItem } from '../../types';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles
} from 'lucide-react';

export const DocumentCentrePage: React.FC = () => {
  const { documents, uploadDocument, activeProject } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [uploadDocName, setUploadDocName] = useState('');
  const [uploadDocCategory, setUploadDocCategory] = useState('PAN Card');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeDocForFeedback, setActiveDocForFeedback] = useState<DocumentItem | null>(documents[3] || documents[0]);

  const categories = [
    'ALL',
    'PAN Card',
    'GST Certificate',
    'Company Incorporation',
    'Land Ownership / Lease Document',
    'Building Plan',
    'Fire Safety Certificate',
    'Pollution Certificate',
    'Bank Details'
  ];

  const filteredDocs = selectedCategory === 'ALL'
    ? documents
    : documents.filter(d => d.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadDocName) return;
    uploadDocument(uploadDocName, uploadDocCategory, selectedFile);
    setUploadDocName('');
    setSelectedFile(null);
  };

  const getStatusBadge = (status: DocumentValidationStatus) => {
    switch (status) {
      case 'Valid':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Missing':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Expired':
      case 'Name Mismatch':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Blurry / Unreadable':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner - Rich Light Gradient */}
      <div className="bg-gradient-to-r from-amber-500/10 via-indigo-50/50 to-white p-6 rounded-2xl border border-amber-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900">Document Centre & AI Verification</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-xs font-extrabold border border-indigo-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-700" />
              OCR AI Scanner Active
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Upload & validate documents for <strong className="text-slate-900 font-extrabold">{activeProject.businessName}</strong>. AI pre-screens for expiry & name mismatches.
          </p>
        </div>
      </div>

      {/* Grid: Upload Box + AI Validation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Box (1 Col) - Soft Indigo Card */}
        <div className="bg-gradient-to-b from-indigo-50/60 to-white p-5 rounded-2xl border border-indigo-200/90 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-indigo-950 flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-amber-600" />
            Upload New Document
          </h3>

          <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Document Category</label>
              <select
                value={uploadDocCategory}
                onChange={(e) => setUploadDocCategory(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-amber-500 shadow-xs"
              >
                {categories.filter(c => c !== 'ALL').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Document Title</label>
              <input
                type="text"
                required
                value={uploadDocName}
                onChange={(e) => setUploadDocName(e.target.value)}
                placeholder="e.g. Fire Hydrant Pressure Audit 2026"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-amber-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">File Upload (PDF, JPG, PNG, DWG)</label>
              <div className="border-2 border-dashed border-amber-300 rounded-xl p-4 text-center hover:border-amber-500 transition-colors bg-amber-50/50 cursor-pointer shadow-xs">
                <UploadCloud className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.dwg,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setSelectedFile(file);
                      if (!uploadDocName) setUploadDocName(file.name);
                    }
                  }}
                  className="text-[11px] text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white cursor-pointer"
                />
                {selectedFile ? (
                  <div className="mt-2 p-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-300 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Attached: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-1">Supports files up to 10 MB</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!uploadDocName && !selectedFile}
              className={`w-full py-2.5 rounded-xl text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                !uploadDocName && !selectedFile
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 cursor-pointer'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Upload & Run AI Scan</span>
            </button>
          </form>
        </div>

        {/* AI Validation Feedback Panel (2 Cols - Clean Light Theme) */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h3 className="font-extrabold text-sm text-slate-900">AI OCR Document Analysis Report</h3>
            </div>
            {activeDocForFeedback && (
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(activeDocForFeedback.status)}`}>
                {activeDocForFeedback.status}
              </span>
            )}
          </div>

          {activeDocForFeedback ? (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 text-sm">{activeDocForFeedback.docName}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Category: {activeDocForFeedback.category} • AI Scan Confidence: <strong className="text-slate-900">{activeDocForFeedback.aiValidationResult?.confidence || 90}%</strong>
                </div>
              </div>

              {/* Issues Section */}
              {activeDocForFeedback.aiValidationResult?.issues && activeDocForFeedback.aiValidationResult.issues.length > 0 ? (
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-300 space-y-1.5">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Flagged Issue(s):</span>
                  </div>
                  {activeDocForFeedback.aiValidationResult.issues.map((iss, idx) => (
                    <p key={idx} className="text-amber-900 text-[11px] leading-relaxed pl-5">
                      • {iss}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-emerald-900 text-xs font-semibold">
                    No issues detected. Legal name matches project profile & document seal is verified.
                  </span>
                </div>
              )}

              {/* Recommendations Section */}
              {activeDocForFeedback.aiValidationResult?.recommendations && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900">AI Recommended Fix Actions:</div>
                  {activeDocForFeedback.aiValidationResult.recommendations.map((rec, idx) => (
                    <p key={idx} className="text-slate-700 text-[11px] leading-relaxed">
                      • {rec}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              Select a document from the table below to view its AI OCR validation report.
            </div>
          )}
        </div>

      </div>

      {/* Document List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <h3 className="font-bold text-sm text-slate-900">Uploaded Document Repository</h3>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-800"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-bold">Document Name</th>
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-4 font-bold">Upload Date</th>
                <th className="py-3 px-4 font-bold">Validation Status</th>
                <th className="py-3 px-4 font-bold">AI Confidence</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr
                  key={doc.id}
                  onClick={() => setActiveDocForFeedback(doc)}
                  className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                    activeDocForFeedback?.id === doc.id ? 'bg-amber-50/60 font-semibold' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {doc.docName}
                    <div className="text-[10px] text-slate-400 font-normal">{doc.fileSize || '1.2 MB'}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {doc.category}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {doc.uploadDate || 'N/A'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {doc.aiValidationResult?.confidence || 0}%
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDocForFeedback(doc);
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 text-[11px]"
                    >
                      Inspect AI Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
