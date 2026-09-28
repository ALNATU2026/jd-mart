import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const JobApplyScreen: React.FC<{ jobId: string }> = ({ jobId }) => {
  const { jobs, applyForJob, currentUser, navigate, showToast } = useApp();

  const job = jobs.find((j) => j.id === jobId) || jobs[0];

  const [fullName, setFullName] = useState(currentUser?.name || 'Ibrahim Koroma');
  const [email, setEmail] = useState(currentUser?.email || 'seeker@jdmart.sl');
  const [phone, setPhone] = useState(currentUser?.phone || '+232 88 112233');
  const [coverNote, setCoverNote] = useState('');
  const [resumeSummary, setResumeSummary] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !coverNote) {
      showToast('Please fill out all required fields');
      return;
    }

    applyForJob(job.id, {
      fullName,
      email,
      phone,
      coverNote,
      resumeSummary: resumeSummary || 'Verified JD Mart candidate profile & background',
    });

    navigate('/job-seeker/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <button
            onClick={() => navigate(`/jobs/${job.id}`)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#1E40AF] hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Job Details</span>
          </button>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Apply: {job.title}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Submitting application directly to <strong className="text-slate-800">{job.employerName}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Your Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">WhatsApp / Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">CV / Experience Summary</label>
            <textarea
              rows={3}
              value={resumeSummary}
              onChange={(e) => setResumeSummary(e.target.value)}
              placeholder="List your years of experience, past employers, licenses or certifications..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Cover Note / Why hire you?</label>
            <textarea
              required
              rows={4}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="Introduce yourself to the hiring team and highlight relevant strengths..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Job Application</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
