import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Pin,
  Trash2,
  Edit2,
  Calendar,
  Users,
  AlertTriangle,
  Info,
  CheckCircle2,
  X,
  Sparkles
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';
import { Announcement } from '../../../types';

export const AdminAnnouncements: React.FC = () => {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, currentUser } = useHR();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Announcement['category']>('General');
  const [priority, setPriority] = useState<Announcement['priority']>('normal');
  const [departmentTarget, setDepartmentTarget] = useState('All');
  const [pinned, setPinned] = useState(false);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('General');
    setPriority('normal');
    setDepartmentTarget('All');
    setPinned(false);
    setEditingId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (ann: Announcement) => {
    setEditingId(ann.id);
    setTitle(ann.title);
    setContent(ann.content);
    setCategory(ann.category);
    setPriority(ann.priority);
    setDepartmentTarget(ann.departmentTarget || 'All');
    setPinned(Boolean(ann.pinned));
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      updateAnnouncement(editingId, {
        title: title.trim(),
        content: content.trim(),
        category,
        priority,
        departmentTarget,
        pinned,
      });
    } else {
      addAnnouncement({
        title: title.trim(),
        content: content.trim(),
        category,
        priority,
        departmentTarget,
        pinned,
        authorName: currentUser?.name || 'Administrator',
      });
    }

    setIsModalOpen(false);
    resetForm();
  };

  const priorityStyles: Record<Announcement['priority'], string> = {
    normal: 'bg-blue-50 text-blue-700 border-blue-200',
    high: 'bg-amber-50 text-amber-700 border-amber-200',
    urgent: 'bg-red-50 text-red-700 border-red-200 font-bold animate-pulse',
  };

  const categoryIcons: Record<Announcement['category'], any> = {
    General: Info,
    Urgent: AlertTriangle,
    Policy: Info,
    Event: Calendar,
    Holiday: Sparkles,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
              <Megaphone className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Organization Announcements & Broadcasts</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Post updates, policy revisions, holidays, and emergency notices to all employees' personal dashboards
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs shadow-orange-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Broadcast Announcement</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500">Active Broadcasts</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{announcements.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Visible across all employee portals</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500">Pinned Notices</p>
          <p className="text-2xl font-black text-orange-600 mt-1">
            {announcements.filter((a) => a.pinned).length}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Highlighted at the top of employee feed</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500">Urgent Priority</p>
          <p className="text-2xl font-black text-red-600 mt-1">
            {announcements.filter((a) => a.priority === 'urgent').length}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Alerts with high visual emphasis</p>
        </div>
      </div>

      {/* List of Announcements */}
      <div className="space-y-3">
        {announcements.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <Megaphone className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No Announcements Published Yet</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Create your first organization announcement to keep your team informed about company events, policy updates, and milestones.
            </p>
            <button
              onClick={openCreateModal}
              className="mt-4 px-3.5 py-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 rounded-lg inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Announcement</span>
            </button>
          </div>
        ) : (
          announcements.map((ann) => {
            const Icon = categoryIcons[ann.category] || Info;
            return (
              <div
                key={ann.id}
                className={`p-5 bg-white rounded-2xl border transition-all ${
                  ann.pinned
                    ? 'border-orange-300 shadow-xs ring-1 ring-orange-200/50'
                    : 'border-slate-200 shadow-2xs hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        ann.priority === 'urgent'
                          ? 'bg-red-100 text-red-600'
                          : ann.priority === 'high'
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {ann.pinned && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700">
                            <Pin className="w-3 h-3 rotate-45" />
                            <span>Pinned</span>
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${
                            priorityStyles[ann.priority]
                          }`}
                        >
                          {ann.priority} Priority
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {ann.category}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Target: <strong className="text-slate-600">{ann.departmentTarget || 'All'}</strong>
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{ann.title}</h3>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed whitespace-pre-line">
                        {ann.content}
                      </p>

                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                        <span>Published by {ann.authorName}</span>
                        <span>·</span>
                        <span>Date: {ann.publishDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => openEditModal(ann)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteAnnouncement(ann.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-orange-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {editingId ? 'Edit Announcement' : 'Publish Broadcast Announcement'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Headline / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Company All-Hands & Strategy Meeting"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-slate-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                  >
                    <option value="General">General</option>
                    <option value="Policy">HR Policy</option>
                    <option value="Urgent">Urgent Alert</option>
                    <option value="Event">Event</option>
                    <option value="Holiday">Holiday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target</label>
                  <select
                    value={departmentTarget}
                    onChange={(e) => setDepartmentTarget(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                  >
                    <option value="All">All Employees</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                    <option value="Human Resources">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Announcement Details *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write message details for your employees..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-slate-800 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pinToggle"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
                />
                <label htmlFor="pinToggle" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Pin this announcement to top of employee feed
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs transition-colors"
                >
                  {editingId ? 'Save Changes' : 'Publish Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
