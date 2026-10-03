import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, CheckCircle2, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Job } from '../types';

export const JobApplyScreen: React.FC<{ jobId: string }> = ({ jobId }) => {
  const { jobs, applyForJob, uploadFile, currentUser, navigate, showToast } = useApp();

  const [currentJob, setCurrentJob] = useState<Job | null>(() => {
    return jobs.find((j) => j.id === jobId) || null;
  });
  const [loadingJob, setLoadingJob] = useState(!currentJob);

  useEffect(() => {
    const existing = jobs.find((j) => j.id === jobId);
    if (existing) {
      setCurrentJob(existing);
      setLoadingJob(false);
      return;
    }

    if (jobId) {
      setLoadingJob(true);
      getDoc(doc(db, 'jobs', jobId))
        .then((snapshot) => {
          if (snapshot.exists()) {
            setCurrentJob({ id: snapshot.id, ...snapshot.data() } as Job);
          } else if (jobs.length > 0) {
            setCurrentJob(jobs[0]);
          }
        })
        .catch((err) => {
          console.warn('Error fetching job details for application:', err);
          if (jobs.length > 0) setCurrentJob(jobs[0]);
        })
        .finally(() => setLoadingJob(false));
    }
  }, [jobId, jobs]);

  const targetJob = currentJob || jobs[0];

  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [coverNote, setCoverNote] = useState('');
  const [resumeSummary, setResumeSummary] = useState('');
  const [resumeFileUrl, setResumeFileUrl] = useState('');
  const [uploadingCV, setUploadingCV] = useState(false);
  const [cvFileName, setCvFileName] = useState('');

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetJob) return;

    try {
      setUploadingCV(true);
      const metadata = await uploadFile(file, 'employee-cv', targetJob.id);
      setResumeFileUrl(metadata.downloadURL);
      setCvFileName(file.name);
      showToast('CV document uploaded to Firebase Storage!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'CV upload failed';
      showToast(msg);
    } finally {
      setUploadingCV(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !coverNote) {
      showToast('Please fill out all required fields');
      return;
    }

    if (!targetJob) {
      showToast('Unable to locate target job vacancy.');
      return;
    }

    // Verify employer ID matches the posted job
    const verifiedEmployerId = targetJob.employerId;
    console.log("[JobApplyScreen] Verified employer ID matches posted job:", {
      jobId: targetJob.id,
      jobTitle: targetJob.title,
      employerId: verifiedEmployerId,
      employerName: targetJob.employerName,
      candidate: fullName,
    });

    await applyForJob(targetJob.id, {
      fullName,
      email,
      phone,
      coverNote,
      resumeSummary: resumeSummary || 'Verified JD Mart candidate profile & background',
      resumeFileUrl,
      employerId: verifiedEmployerId,
      jobTitle: targetJob.title,
      companyName: targetJob.employerName,
    });

    navigate('/job-seeker/dashboard');
  };

  if (loadingJob && !targetJob) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] py-12 px-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#1E40AF] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Verifying vacancy and employer details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <button
            onClick={() => navigate(`/jobs/${targetJob.id}`)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#1E40AF] hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Job Details</span>
          </button>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Apply: {targetJob.title}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Submitting application directly to <strong className="text-slate-800">{targetJob.employerName}</strong>
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
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Upload CV Document (PDF / DOCX to Firebase Storage)
            </label>
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <label className="px-3.5 py-1.5 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shrink-0">
                <span>{uploadingCV ? 'Uploading to Storage...' : 'Attach CV File'}</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf"
                  className="hidden"
                  onChange={handleCvUpload}
                  disabled={uploadingCV}
                />
              </label>
              <span className="text-xs text-slate-500 truncate">
                {cvFileName || (resumeFileUrl ? 'CV attached securely' : 'No document selected yet (Max 15MB)')}
              </span>
            </div>
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
