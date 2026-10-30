import React, { useState } from 'react';
import {
  Megaphone,
  Pin,
  Calendar,
  Sparkles,
  Info,
  AlertTriangle,
  CheckCircle2,
  Bell
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';
import { Announcement } from '../../../types';

export const EmployeeAnnouncements: React.FC = () => {
  const { announcements, currentUser } = useHR();
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const visibleAnnouncements = announcements.filter((ann) => {
    const matchesDept =
      !ann.departmentTarget ||
      ann.departmentTarget === 'All' ||
      ann.departmentTarget.toLowerCase() === (currentUser?.department || '').toLowerCase();
    const matchesCategory = filterCategory === 'All' || ann.category === filterCategory;
    return matchesDept && matchesCategory;
  });

  const categories = ['All', 'General', 'Policy', 'Urgent', 'Event', 'Holiday'];

  const priorityStyles: Record<Announcement['priority'], string> = {
    normal: 'bg-blue-50 text-blue-700 border-blue-200',
    high: 'bg-amber-50 text-amber-700 border-amber-200 font-semibold',
    urgent: 'bg-red-50 text-red-700 border-red-200 font-bold animate-pulse',
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
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Company Announcements & Broadcasts</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Stay up to date with executive notices, HR policy updates, holiday schedules, and workplace news
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterCategory === cat
                  ? 'bg-orange-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {visibleAnnouncements.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No Announcements at this Time</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Any official broadcasts and company updates published by your administrator will be displayed here.
            </p>
          </div>
        ) : (
          visibleAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className={`p-6 bg-white rounded-2xl border transition-all ${
                ann.pinned
                  ? 'border-orange-300 shadow-xs ring-1 ring-orange-200/50 bg-gradient-to-r from-orange-50/20 to-white'
                  : 'border-slate-200 shadow-2xs hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    ann.priority === 'urgent'
                      ? 'bg-red-100 text-red-600'
                      : ann.priority === 'high'
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-orange-100 text-orange-600'
                  }`}
                >
                  {ann.category === 'Holiday' ? (
                    <Sparkles className="w-5 h-5" />
                  ) : ann.priority === 'urgent' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <Megaphone className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {ann.pinned && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700">
                        <Pin className="w-3 h-3 rotate-45" />
                        <span>Pinned Notice</span>
                      </span>
                    )}

                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
                        priorityStyles[ann.priority]
                      }`}
                    >
                      {ann.priority} Priority
                    </span>

                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {ann.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{ann.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line font-normal">
                    {ann.content}
                  </p>

                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                    <span className="font-medium text-slate-600">Posted by {ann.authorName}</span>
                    <span>·</span>
                    <span>{ann.publishDate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
