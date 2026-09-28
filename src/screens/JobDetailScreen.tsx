import React from 'react';
import { ArrowLeft, MapPin, Briefcase, DollarSign, CheckCircle2, Share2, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const JobDetailScreen: React.FC<{ jobId: string }> = ({ jobId }) => {
  const { jobs, navigate, showToast } = useApp();

  const job = jobs.find((j) => j.id === jobId) || jobs[0];
  const similarJobs = jobs.filter((j) => j.id !== job.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <button
            onClick={() => navigate('/jobs')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#1E40AF] hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Job Listings</span>
          </button>
        </div>

        {/* Main Job Overview Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1E40AF] text-[10px] font-bold uppercase tracking-wider">
                {job.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                {job.title}
              </h1>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <strong className="text-slate-800">{job.employerName}</strong> • Posted on {job.postedDate}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full self-start sm:self-auto">
                {job.type}
              </span>
              <span className="text-base font-black text-[#1E40AF]">{job.salary}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Location: <strong>{job.location}</strong></span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-slate-400" />
              <span>Applicants: <strong>{job.applicantCount} candidates applied</strong></span>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              About the Role
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Key Responsibilities
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {job.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E40AF] mt-1.5 shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements & Qualifications */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Requirements & Qualifications
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Action bar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                showToast('Job listing URL copied to clipboard');
              }}
              className="p-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50"
              title="Share job"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate(`/jobs/apply/${job.id}`)}
              className="px-8 py-3.5 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition-colors shadow-md shadow-blue-900/20"
            >
              Apply for this Position
            </button>
          </div>
        </div>

        {/* Similar Jobs */}
        {similarJobs.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Similar Job Vacancies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {similarJobs.map((sim) => (
                <div
                  key={sim.id}
                  onClick={() => navigate(`/jobs/${sim.id}`)}
                  className="bg-white rounded-2xl p-4 border border-slate-200 hover:shadow-md cursor-pointer transition-all"
                >
                  <h3 className="text-xs font-bold text-slate-900 truncate">{sim.title}</h3>
                  <p className="text-[11px] text-slate-500">{sim.employerName} • {sim.location}</p>
                  <span className="text-xs font-black text-[#1E40AF] mt-2 block">{sim.salary}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
