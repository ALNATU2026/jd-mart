import React from 'react';
import { ArrowLeft, Briefcase, Trash2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminJobsScreen: React.FC = () => {
  const { jobs, navigate, showToast } = useApp();

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Admin Console</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Job Market Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review employment postings, filter spam or predatory recruiters, and verify wage standards
          </p>
        </div>

        <div className="space-y-4">
          {jobs.map((j) => (
            <div
              key={j.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{j.title}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800">
                    {j.type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Employer: {j.employerName} • Location: {j.location} • Compensation: <strong className="text-[#1E40AF]">{j.salary}</strong>
                </p>
                <p className="text-[11px] text-slate-400 mt-1">{j.applicantCount} applicants submitted</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast(`Job posting #${j.id} approved`)}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold"
                >
                  Approved
                </button>
                <button
                  onClick={() => showToast(`Job posting #${j.id} removed from marketplace`)}
                  className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
