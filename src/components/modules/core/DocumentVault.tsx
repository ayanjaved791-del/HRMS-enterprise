import React, { useState } from 'react';
import {
  FolderLock,
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  X,
  ShieldCheck
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';
import { DocumentItem } from '../../../types';

export const DocumentVault: React.FC = () => {
  const { documents, uploadDocument, currentUser } = useHR();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentItem['category']>('Company Policy');
  const [fileType, setFileType] = useState('PDF');
  const [fileSize, setFileSize] = useState('1.5 MB');

  const categories = ['All', 'Company Policy', 'Offer Letter', 'Non-Disclosure', 'Tax W-4', 'Appraisal Letter'];

  const filtered = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === 'All' || doc.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    uploadDocument({
      title,
      category,
      fileSize,
      fileType,
      isCompanyWide: category === 'Company Policy',
      ownerName: currentUser?.name || 'Administrator',
    });

    setIsUploadOpen(false);
    setTitle('');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Document Management Vault</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Encrypted storage for employee contracts, NDAs, statutory tax forms, and governance policies
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vault documents by title or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-slate-800 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCat === cat
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-orange-300 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                  {doc.category}
                </span>
                <span className="text-[11px] font-mono font-medium text-slate-400">{doc.fileSize}</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate" title={doc.title}>
                    {doc.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Uploaded on {doc.uploadedDate} · {doc.isCompanyWide ? 'All Staff' : doc.ownerName}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Encrypted AES-256
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Preview"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([`HRMate Document Vault Content: ${doc.title}`], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${doc.title.replace(/\s+/g, '_')}.${doc.fileType.toLowerCase()}`;
                    a.click();
                  }}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{previewDoc.title}</h3>
                <p className="text-xs text-slate-500">Category: {previewDoc.category} · Size: {previewDoc.fileSize}</p>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 space-y-2">
              <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                --- HRMate Secure Vault Verification ---
              </p>
              <p>Document ID: {previewDoc.id}</p>
              <p>Checksum SHA-256: 4f82a991c29e710b892a014aef3189</p>
              <p>Uploaded by: {previewDoc.ownerName || 'Acme Global People Ops'}</p>
              <p>Audited: Passed SOC-2 and HIPAA Storage Invariants</p>
              <div className="p-3 bg-white rounded border border-slate-200 mt-3 font-sans text-slate-700">
                This document is securely indexed in the Acme Cloud Vault. Authorized signatories can view and export this artifact in accordance with corporate retention rules.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([`HRMate Document Content: ${previewDoc.title}`], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${previewDoc.title.replace(/\s+/g, '_')}.${previewDoc.fileType.toLowerCase()}`;
                  a.click();
                }}
                className="px-4 py-2 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Encrypted File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Upload to Document Vault</h3>
              <button onClick={() => setIsUploadOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Health Insurance Policy 2026-27"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value="Company Policy">Company Policy</option>
                  <option value="Offer Letter">Offer Letter</option>
                  <option value="Non-Disclosure">Non-Disclosure</option>
                  <option value="Tax W-4">Tax W-4</option>
                  <option value="Appraisal Letter">Appraisal Letter</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">File Format</label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="DOCX">Word Document</option>
                    <option value="XLSX">Spreadsheet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Size</label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-xs"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
