import React from 'react';
import {
  BookOpen,
  Award,
  Clock,
  Play,
  CheckCircle2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';

export const LearningManagementSystem: React.FC = () => {
  const { courses, toggleCourseEnrollment, updateCourseProgress } = useHR();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Learning Management System (LMS)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Internal corporate academy, role certification tracks, and engineering upskilling modules
          </p>
        </div>
      </div>

      {/* Course Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between group hover:border-orange-300 transition-all"
          >
            <div>
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-xs">
                  {course.category}
                </span>

                {course.badgeEarned && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-900 flex items-center gap-1 shadow-sm">
                    <Award className="w-3 h-3" /> Certified
                  </span>
                )}
              </div>

              <div className="p-5 space-y-3">
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-orange-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500">Instructor: {course.instructor}</p>

                <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
                  <span>{course.durationHours} Hours</span>
                  <span>·</span>
                  <span>{course.modulesCount} Learning Modules</span>
                </div>

                {course.isEnrolled && (
                  <div className="pt-2 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-600">Course Progress</span>
                      <span className="text-orange-600 font-bold tabular-nums">
                        {course.progressPercent}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        style={{ width: `${course.progressPercent}%` }}
                        className={`h-full ${
                          course.progressPercent === 100 ? 'bg-emerald-500' : 'bg-orange-500'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-[11px] text-slate-400 font-mono">
                {course.progressPercent === 100 ? 'Completed' : course.isEnrolled ? 'In Training' : 'Available'}
              </span>

              {course.isEnrolled ? (
                <button
                  onClick={() =>
                    updateCourseProgress(course.id, Math.min(100, course.progressPercent + 20))
                  }
                  className="px-3 py-1.5 text-xs font-semibold bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Resume Module (+20%)</span>
                </button>
              ) : (
                <button
                  onClick={() => toggleCourseEnrollment(course.id)}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-xs transition-colors"
                >
                  Enroll Course
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
