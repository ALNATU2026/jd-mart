import React, { useState } from 'react';
import { Briefcase, Plus, Users, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EmployerDashboardScreen: React.FC = () => {
  const { jobs, applications, updateApplicationStatus, navigate, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'jobs' | 'applicants'>('jobs');

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider">
              Employer Talent Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Hire & Manage Candidates
            </h1>
            <p className="text-xs text-slate-500">
              Post job vacancies, review incoming applicant submissions, and shortlist top talent
            </p>
          </div>

          <button
            onClick={() => navigate('/employer/jobs/new')}
            className="px-5 py-2.5 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Vacancy</span>
          </button>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Active Job Postings</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{jobs.length}</p>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Received Applications</span>
            <p className="text-2xl font-black text-purple-600 mt-1">{applications.length}</p>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Shortlisted Candidates</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {applications.filter((a) => a.status === 'Shortlisted').length}
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-colors ${
              activeTab === 'jobs' ? 'bg-[#1E40AF] text-white' : 'bg-white text-slate-600'
            }`}
          >
            Posted Vacancies ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('applicants')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-colors ${
              activeTab === 'applicants' ? 'bg-[#1E40AF] text-white' : 'bg-white text-slate-600'
            }`}
          >
            Applicants Submissions ({applications.length})
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'jobs' ? (
          <div className="space-y-4">
            {jobs.map((j) => (
              <div
                key={j.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{j.title}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800">
                      {j.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {j.location} • Salary: <strong className="text-[#1E40AF]">{j.salary}</strong>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {j.applicantCount} total candidate(s) applied
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/jobs/${j.id}`)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
                  >
                    View Listing
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border">
                No job applications received yet.
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{app.fullName}</h3>
                      <p className="text-xs text-slate-500">Applied for: <strong className="text-[#1E40AF]">{app.jobTitle}</strong></p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold self-start sm:self-auto ${
                      app.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-800' :
                      app.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p>Contact: <strong>{app.phone}</strong> | {app.email}</p>
                    <p className="italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">"{app.coverNote}"</p>
                    <p className="text-slate-500">Resume/Skills: {app.resumeSummary}</p>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => updateApplicationStatus(app.id, 'Shortlisted')}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700"
                    >
                      Shortlist Candidate
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(app.id, 'Rejected')}
                      className="px-3 py-1.5 bg-red-100 text-red-700 rounded-xl font-bold hover:bg-red-200"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
