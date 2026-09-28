import React, { useState } from 'react';
import { Briefcase, Clock, CheckCircle2, XCircle, ArrowRight, User, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const JobSeekerDashboardScreen: React.FC = () => {
  const { applications, jobs, navigate, currentUser, showToast } = useApp();

  const [skills, setSkills] = useState('Motorcycle Riding (Class A), Route Navigation, Customer Etiquette, Krio, English');

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Job Seeker Hub & Applications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track status updates on your job applications, interviews, and professional profile
          </p>
        </div>

        {/* Top metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Submitted Applications</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{applications.length}</p>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Shortlisted Interviews</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {applications.filter((a) => a.status === 'Shortlisted').length}
            </p>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">New Vacancies In Freetown</span>
            <p className="text-2xl font-black text-[#1E40AF] mt-1">{jobs.length}</p>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Your Applications History</h2>
            <button
              onClick={() => navigate('/jobs')}
              className="text-xs font-bold text-[#1E40AF] hover:underline"
            >
              Browse Open Gigs
            </button>
          </div>

          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{app.jobTitle}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      app.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-800' :
                      app.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Company: {app.companyName} • Applied on {app.appliedDate}</p>
                  <p className="text-xs text-slate-600 mt-2 bg-white p-2.5 rounded-xl border border-slate-200">
                    "{app.coverNote}"
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast(`Contacting hiring manager at ${app.companyName}...`)}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
                  >
                    Follow Up
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Profile Summary */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#1E40AF]" />
            Your Candidate Skills & Bio
          </h2>
          <textarea
            rows={2}
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
          />
          <div className="flex justify-end">
            <button
              onClick={() => showToast('Candidate profile updated!')}
              className="px-4 py-2 bg-[#1E40AF] text-white rounded-xl text-xs font-bold hover:bg-blue-700"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
