import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Building2,
  Search,
  Filter,
  Star,
  MapPin,
  Calendar,
  MessageSquare,
  Bell,
  Settings,
  ShieldCheck,
  UploadCloud,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  DollarSign,
  FileText,
  Trash2,
  Edit,
  Eye,
  Send,
  UserCheck,
  Award,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  Job,
  JobApplication,
  WorkerProfile,
  InterviewSchedule,
  EmployerProfile,
} from '../types';

type EmployerTab =
  | 'overview'
  | 'profile'
  | 'post_job'
  | 'my_jobs'
  | 'applications'
  | 'applicants'
  | 'search_workers'
  | 'shortlisted'
  | 'interviews'
  | 'messages'
  | 'notifications'
  | 'settings';

export const EmployerDashboardScreen: React.FC = () => {
  const {
    jobs,
    applications,
    employerProfiles,
    currentEmployer,
    saveEmployerProfile,
    postJob,
    updateJob,
    closeJob,
    deleteJob,
    updateApplicationStatus,
    workerProfiles,
    saveWorkerProfile,
    interviews,
    scheduleInterview,
    updateInterviewStatus,
    uploadFile,
    generateAIDescription,
    messages,
    sendMessage,
    notifications,
    currentUser,
    navigate,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<EmployerTab>('overview');

  // Filter jobs for this employer (or admin sees all)
  const isSysAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'admin';
  const myJobs = jobs.filter((j) => isSysAdmin || j.employerId === currentUser?.id);
  const myJobIds = new Set(myJobs.map((j) => j.id));
  const myApplications = applications.filter(
    (a) => isSysAdmin || (a.employerId && a.employerId === currentUser?.id) || myJobIds.has(a.jobId)
  );
  const myInterviews = interviews.filter(
    (i) => isSysAdmin || i.employerId === currentUser?.id
  );

  // Profile Form State
  const [companyName, setCompanyName] = useState(
    currentEmployer?.companyName || currentUser?.name || ''
  );
  const [description, setDescription] = useState(currentEmployer?.description || '');
  const [phone, setPhone] = useState(currentEmployer?.phone || currentUser?.phone || '');
  const [email, setEmail] = useState(currentEmployer?.email || currentUser?.email || '');
  const [location, setLocation] = useState(currentEmployer?.location || 'Freetown');
  const [website, setWebsite] = useState(currentEmployer?.website || '');
  const [industry, setIndustry] = useState(currentEmployer?.industry || 'Technology & E-commerce');
  const [companySize, setCompanySize] = useState(currentEmployer?.companySize || '10-50 Employees');
  const [companyInfo, setCompanyInfo] = useState(currentEmployer?.companyInfo || '');
  const [logoUrl, setLogoUrl] = useState(currentEmployer?.logo || '/assets/logos/applogo.png');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Post Job Form State
  const [jobTitle, setJobTitle] = useState('');
  const [jobCategory, setJobCategory] = useState('Technology');
  const [jobType, setJobType] = useState<'Full-time' | 'Part-time' | 'Gig / Contract'>('Full-time');
  const [jobLocation, setJobLocation] = useState('Freetown');
  const [jobSalary, setJobSalary] = useState('Le 2,500 - 4,000 / month');
  const [jobDeadline, setJobDeadline] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobRequirements, setJobRequirements] = useState<string[]>([
    'Proven experience in related field',
    'Strong communication skills',
  ]);
  const [reqInput, setReqInput] = useState('');
  const [jobResponsibilities, setJobResponsibilities] = useState<string[]>([
    'Execute day-to-day deliverables on time',
    'Collaborate with team leads in Freetown',
  ]);
  const [respInput, setRespInput] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [submittingJob, setSubmittingJob] = useState(false);

  // Editing Job Modal State
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Applicant Review Modal State
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  // Schedule Interview Modal State
  const [interviewApp, setInterviewApp] = useState<JobApplication | null>(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewMode, setInterviewMode] = useState<'In-person' | 'Virtual Call' | 'Phone'>('In-person');
  const [interviewLocation, setInterviewLocation] = useState('15 Siaka Stevens Street, Freetown');
  const [interviewNotes, setInterviewNotes] = useState('');

  // Worker Search State
  const [workerSearchQuery, setWorkerSearchQuery] = useState('');
  const [workerCategoryFilter, setWorkerCategoryFilter] = useState('all');
  const [workerLocationFilter, setWorkerLocationFilter] = useState('all');
  const [workerExpFilter, setWorkerExpFilter] = useState('all');
  const [workerAvailFilter, setWorkerAvailFilter] = useState('all');
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);

  // Messaging State
  const [chatRecipient, setChatRecipient] = useState<{ id: string; name: string } | null>(null);
  const [messageInput, setMessageInput] = useState('');

  // Handlers
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await saveEmployerProfile({
        companyName,
        description,
        phone,
        email,
        location,
        website,
        industry,
        companySize,
        companyInfo,
        logo: logoUrl,
      });
    } catch {
      // toast already shown
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const meta = await uploadFile(file, 'user-profile', currentUser?.id || 'employer');
      setLogoUrl(meta.downloadURL);
      showToast('Company logo updated!');
    } catch {
      // handled
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleAIGenerateJobDesc = async () => {
    if (!jobTitle.trim()) {
      showToast('Please enter a Job Title first');
      return;
    }
    setAiGenerating(true);
    try {
      const desc = await generateAIDescription(jobTitle, jobCategory);
      setJobDescription(desc);
      showToast('AI-powered job description generated!');
    } catch {
      // fallback handled
    } finally {
      setAiGenerating(false);
    }
  };

  const handleAddRequirement = () => {
    if (reqInput.trim()) {
      setJobRequirements([...jobRequirements, reqInput.trim()]);
      setReqInput('');
    }
  };

  const handleRemoveRequirement = (idx: number) => {
    setJobRequirements(jobRequirements.filter((_, i) => i !== idx));
  };

  const handleAddResponsibility = () => {
    if (respInput.trim()) {
      setJobResponsibilities([...jobResponsibilities, respInput.trim()]);
      setRespInput('');
    }
  };

  const handleRemoveResponsibility = (idx: number) => {
    setJobResponsibilities(jobResponsibilities.filter((_, i) => i !== idx));
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !jobDescription.trim()) {
      showToast('Please provide a job title and description');
      return;
    }
    setSubmittingJob(true);
    try {
      await postJob({
        employerId: currentUser?.id || 'emp-user',
        employerName: companyName || currentUser?.name || 'JD Mart Employer',
        employerLogo: logoUrl,
        title: jobTitle.trim(),
        category: jobCategory,
        type: jobType,
        location: jobLocation,
        salary: jobSalary,
        description: jobDescription.trim(),
        requirements: jobRequirements,
        responsibilities: jobResponsibilities,
        applicationDeadline: jobDeadline || 'Open until filled',
        status: 'active',
      });
      // reset form
      setJobTitle('');
      setJobDescription('');
      setActiveTab('my_jobs');
    } catch {
      // handled
    } finally {
      setSubmittingJob(false);
    }
  };

  const handleScheduleInterviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewApp || !interviewDate || !interviewTime) {
      showToast('Please provide both interview date and time');
      return;
    }
    try {
      await scheduleInterview({
        employerId: currentUser?.id || 'emp-user',
        employerName: companyName || currentUser?.name || 'Hiring Manager',
        applicationId: interviewApp.id,
        applicantId: interviewApp.applicantId,
        applicantName: interviewApp.fullName,
        jobId: interviewApp.jobId,
        jobTitle: interviewApp.jobTitle,
        date: interviewDate,
        time: interviewTime,
        mode: interviewMode,
        locationOrLink: interviewLocation,
        notes: interviewNotes,
      });
      setInterviewApp(null);
      setInterviewDate('');
      setInterviewTime('');
      setInterviewNotes('');
    } catch {
      // handled
    }
  };

  const handleSendMessage = async () => {
    if (!chatRecipient || !messageInput.trim()) return;
    await sendMessage(chatRecipient.id, chatRecipient.name, messageInput.trim());
    setMessageInput('');
    showToast(`Message sent to ${chatRecipient.name}`);
  };

  // Filtered Workers
  const filteredWorkers = workerProfiles.filter((w) => {
    const q = workerSearchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      w.fullName.toLowerCase().includes(q) ||
      w.title.toLowerCase().includes(q) ||
      w.skills.some((s) => s.toLowerCase().includes(q)) ||
      w.location.toLowerCase().includes(q);
    const matchesCategory =
      workerCategoryFilter === 'all' || w.category.toLowerCase() === workerCategoryFilter.toLowerCase();
    const matchesLocation =
      workerLocationFilter === 'all' || w.location.toLowerCase().includes(workerLocationFilter.toLowerCase());
    const matchesExp =
      workerExpFilter === 'all' || w.experienceLevel.toLowerCase() === workerExpFilter.toLowerCase();
    const matchesAvail =
      workerAvailFilter === 'all' || w.availability.toLowerCase().includes(workerAvailFilter.toLowerCase());
    return matchesQuery && matchesCategory && matchesLocation && matchesExp && matchesAvail;
  });

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between md:items-center gap-6">
          <div className="flex items-center gap-4">
            <img
              src={logoUrl}
              alt="Company Logo"
              className="w-16 h-16 rounded-2xl object-cover bg-white/10 p-1 border border-white/20"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/logos/applogo.png';
              }}
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold uppercase tracking-wider">
                  Employer Talent Command
                </span>
                {currentEmployer?.verificationStatus === 'verified' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified Business
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {companyName || 'My Organization'}
              </h1>
              <p className="text-xs text-slate-300">
                {industry} • Location: <strong className="text-white">{location}</strong> • Contact: {phone}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('post_job')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Post a Vacancy</span>
            </button>
            <button
              onClick={() => setActiveTab('search_workers')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Search Workers</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-xs flex items-center gap-1 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: Building2 },
            { id: 'profile', label: 'Company Profile', icon: ShieldCheck },
            { id: 'post_job', label: 'Post a Job', icon: Plus },
            { id: 'my_jobs', label: `My Jobs (${myJobs.length})`, icon: Briefcase },
            { id: 'applications', label: `Applications (${myApplications.length})`, icon: FileText },
            { id: 'applicants', label: 'Applicants Review', icon: Users },
            { id: 'search_workers', label: `Search Workers (${workerProfiles.length})`, icon: Search },
            {
              id: 'shortlisted',
              label: `Shortlisted (${myApplications.filter((a) => a.status === 'Shortlisted').length})`,
              icon: Star,
            },
            { id: 'interviews', label: `Interviews (${myInterviews.length})`, icon: Calendar },
            { id: 'messages', label: 'Messages', icon: MessageSquare },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as EmployerTab)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-[#1E40AF] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Active Job Postings</span>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {myJobs.filter((j) => j.status === 'active').length}
                </p>
                <span className="text-[11px] font-semibold text-blue-600">
                  {myJobs.length} total listings
                </span>
              </div>
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Received Applications</span>
                <p className="text-2xl font-black text-indigo-600 mt-1">{myApplications.length}</p>
                <span className="text-[11px] font-semibold text-slate-400">
                  Across all active jobs
                </span>
              </div>
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Shortlisted Candidates</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">
                  {myApplications.filter((a) => a.status === 'Shortlisted').length}
                </p>
                <span className="text-[11px] font-semibold text-emerald-500">Ready for interview</span>
              </div>
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Interviews Scheduled</span>
                <p className="text-2xl font-black text-amber-600 mt-1">{myInterviews.length}</p>
                <span className="text-[11px] font-semibold text-amber-500">Upcoming sessions</span>
              </div>
            </div>

            {/* Quick Actions & Recent Applications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Recent Applications */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Recent Applications</h3>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className="text-xs text-[#1E40AF] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {myApplications.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    No candidate applications received yet. Post a new vacancy to attract workers.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {myApplications.slice(0, 5).map((app) => (
                      <div key={app.id} className="py-3.5 flex items-center justify-between gap-4">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{app.fullName}</h4>
                          <p className="text-[11px] text-slate-500">
                            Applied for <strong className="text-[#1E40AF]">{app.jobTitle}</strong> • {app.appliedDate}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              app.status === 'Shortlisted'
                                ? 'bg-emerald-100 text-emerald-800'
                                : app.status === 'Interview'
                                ? 'bg-amber-100 text-amber-800'
                                : app.status === 'Rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {app.status}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setActiveTab('applicants');
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold"
                          >
                            Review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Col: Employer Highlights */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">Talent Pool Highlights</h3>
                <p className="text-xs text-slate-500">
                  Quickly connect with skilled professionals across Freetown, Bo, Kenema, and Makeni.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-blue-900">Available Workers</h4>
                      <p className="text-[11px] text-blue-700">
                        {workerProfiles.length} verified candidate profiles ready for hire
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-purple-900">AI Job Description Generator</h4>
                      <p className="text-[11px] text-purple-700">
                        Generate comprehensive job requirements in 1 click
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('search_workers')}
                    className="w-full py-2.5 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Search className="w-4 h-4" />
                    <span>Explore Available Talent</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPANY PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs max-w-4xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Employer Company Profile</h2>
              <p className="text-xs text-slate-500">
                Information provided here is displayed to candidates and job seekers on JD Mart Careers.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Logo Row */}
              <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <img
                  src={logoUrl}
                  alt="Company Logo"
                  className="w-16 h-16 rounded-2xl object-cover bg-white border border-slate-200"
                />
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">Company Logo / Branding</label>
                  <label className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-100 inline-flex items-center gap-1.5 shadow-xs">
                    <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                    <span>{uploadingLogo ? 'Uploading...' : 'Upload New Logo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      disabled={uploadingLogo}
                    />
                  </label>
                  <p className="text-[10px] text-slate-400">PNG, JPG, or SVG up to 5MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Company / Organization Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Salone Logistics Ltd"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Industry Sector</label>
                  <input
                    type="text"
                    required
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Retail, Healthcare, IT, Logistics"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+232 76 000000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hr@company.sl"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Primary Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Freetown, Sierra Leone"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Website URL (Optional)</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://company.sl"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Company Size</label>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                  >
                    <option value="1-10 Employees">1-10 Employees (Startup / Small)</option>
                    <option value="11-50 Employees">11-50 Employees (Mid-size)</option>
                    <option value="50-200 Employees">50-200 Employees (Large)</option>
                    <option value="200+ Employees">200+ Employees (Enterprise)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Short Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of what your company does and why candidates love working with you..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Company Information & Mission</label>
                <textarea
                  rows={3}
                  value={companyInfo}
                  onChange={(e) => setCompanyInfo(e.target.value)}
                  placeholder="Additional background on business registration, corporate values, culture..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: POST A JOB */}
        {activeTab === 'post_job' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Post a New Vacancy</h2>
                <p className="text-xs text-slate-500">
                  Publish a job opening to thousands of active workers and candidates in Sierra Leone.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAIGenerateJobDesc}
                disabled={aiGenerating}
                className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>{aiGenerating ? 'AI Writing...' : 'AI Auto-Draft'}</span>
              </button>
            </div>

            <form onSubmit={handlePostJob} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Delivery Fleet Dispatcher / Warehouse Manager"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Job Category</label>
                  <select
                    value={jobCategory}
                    onChange={(e) => setJobCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                  >
                    <option value="Technology">Technology & Software</option>
                    <option value="Logistics">Logistics & Courier Delivery</option>
                    <option value="Automotive">Automotive & Mechanics</option>
                    <option value="Retail & Sales">Retail & Merchant Sales</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                    <option value="Maintenance">Maintenance & Electrical</option>
                    <option value="Design & Creative">Design & Creative</option>
                    <option value="General Services">General Services & Gigs</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Employment Type</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Gig / Contract">Gig / Contract</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    placeholder="e.g. Freetown, Lumley, Bo, Kenema"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Salary / Compensation</label>
                  <input
                    type="text"
                    required
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    placeholder="e.g. Le 3,000 - 4,500 / month"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Application Deadline</label>
                <input
                  type="date"
                  value={jobDeadline}
                  onChange={(e) => setJobDeadline(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 max-w-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Job Description</label>
                <textarea
                  rows={4}
                  required
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Outline the core role responsibilities, mission, and day-to-day impact..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              {/* Requirements Chips */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Candidate Requirements</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={reqInput}
                    onChange={(e) => setReqInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddRequirement();
                      }
                    }}
                    placeholder="Add a required skill or qualification (Press Enter)"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddRequirement}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {jobRequirements.map((req, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-xs flex items-center gap-1.5"
                    >
                      <span>{req}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(i)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Responsibilities Chips */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Key Responsibilities</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={respInput}
                    onChange={(e) => setRespInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddResponsibility();
                      }
                    }}
                    placeholder="Add a primary duty or task (Press Enter)"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddResponsibility}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {jobResponsibilities.map((resp, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-xl text-xs flex items-center gap-1.5"
                    >
                      <span>{resp}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveResponsibility(i)}
                        className="text-purple-500 hover:text-purple-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={submittingJob}
                  className="px-6 py-3 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{submittingJob ? 'Publishing...' : 'Publish Job Listing'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: MY JOBS */}
        {activeTab === 'my_jobs' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900">My Posted Vacancies</h2>
                <p className="text-xs text-slate-500">
                  Manage active listings, edit requirements, review applicants, or close positions.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('post_job')}
                className="px-4 py-2 bg-[#1E40AF] text-white rounded-xl text-xs font-bold self-start sm:self-auto flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Post Another Job
              </button>
            </div>

            {myJobs.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Job Listings Posted Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Start recruiting talent across Sierra Leone by creating your first job posting.
                </p>
                <button
                  onClick={() => setActiveTab('post_job')}
                  className="px-4 py-2 bg-[#1E40AF] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Post Your First Job
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {myJobs.map((job) => {
                  const jobApps = applications.filter((a) => a.jobId === job.id);
                  return (
                    <div
                      key={job.id}
                      className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              job.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {job.status.toUpperCase()}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800">
                            {job.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {job.category} • {job.location} • Compensation:{' '}
                          <strong className="text-[#1E40AF]">{job.salary}</strong>
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Posted: {job.postedDate} • Deadline: {job.applicationDeadline || 'Open'} •{' '}
                          <strong className="text-slate-700">{jobApps.length} candidates applied</strong>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                        <button
                          onClick={() => {
                            setActiveTab('applications');
                          }}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1E40AF] rounded-xl text-xs font-bold"
                        >
                          View Applicants ({jobApps.length})
                        </button>
                        <button
                          onClick={() => setEditingJob(job)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                          title="Edit Job"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {job.status === 'active' ? (
                          <button
                            onClick={() => closeJob(job.id)}
                            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold"
                          >
                            Close Job
                          </button>
                        ) : (
                          <button
                            onClick={() => updateJob(job.id, { status: 'active' })}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold"
                          >
                            Re-open
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this job posting?')) {
                              deleteJob(job.id);
                            }
                          }}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold"
                          title="Delete Job"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Candidate Applications</h2>
              <p className="text-xs text-slate-500">
                Review CVs, cover notes, applicant contact details, and advance candidates through your hiring pipeline.
              </p>
            </div>

            {myApplications.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs text-slate-400 text-xs">
                No candidate applications found.
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Candidate</th>
                        <th className="py-3 px-4">Job Title</th>
                        <th className="py-3 px-4">Applied Date</th>
                        <th className="py-3 px-4">Current Status</th>
                        <th className="py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900">
                            <div>{app.fullName}</div>
                            <div className="text-[11px] text-slate-500 font-normal">
                              {app.phone} • {app.email}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800">{app.jobTitle}</td>
                          <td className="py-3 px-4 text-slate-500">{app.appliedDate}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                app.status === 'Shortlisted'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : app.status === 'Interview'
                                  ? 'bg-amber-100 text-amber-800'
                                  : app.status === 'Rejected'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {app.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedApp(app);
                                  setActiveTab('applicants');
                                }}
                                className="px-2.5 py-1 bg-[#1E40AF] text-white rounded-lg text-[11px] font-bold"
                              >
                                Review Profile
                              </button>
                              <button
                                onClick={() => {
                                  setInterviewApp(app);
                                }}
                                className="px-2.5 py-1 bg-amber-500 text-white rounded-lg text-[11px] font-bold"
                              >
                                Interview
                              </button>
                              <button
                                onClick={() => {
                                  setChatRecipient({ id: app.applicantId, name: app.fullName });
                                  setActiveTab('messages');
                                }}
                                className="p-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                                title="Chat with Candidate"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: APPLICANTS REVIEW (FULL DETAIL) */}
        {activeTab === 'applicants' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Applicant In-Depth Review</h2>
                <p className="text-xs text-slate-500">
                  Inspect cover notes, resume summaries, qualifications, and change application status.
                </p>
              </div>
            </div>

            {selectedApp ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{selectedApp.fullName}</h3>
                    <p className="text-xs text-slate-500">
                      Applied for <strong className="text-[#1E40AF]">{selectedApp.jobTitle}</strong> • {selectedApp.appliedDate}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Phone: <strong className="text-slate-800">{selectedApp.phone}</strong> • Email:{' '}
                      <strong className="text-slate-800">{selectedApp.email}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        selectedApp.status === 'Shortlisted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedApp.status === 'Interview'
                          ? 'bg-amber-100 text-amber-800'
                          : selectedApp.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      Status: {selectedApp.status}
                    </span>
                  </div>
                </div>

                {/* Candidate Cover Note */}
                <div className="space-y-1 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <h4 className="text-xs font-bold text-slate-700">Applicant Cover Note</h4>
                  <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {selectedApp.coverNote || 'No specific cover letter attached.'}
                  </p>
                </div>

                {/* Resume / Qualifications Summary */}
                <div className="space-y-1 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <h4 className="text-xs font-bold text-slate-700">Resume / Experience Summary</h4>
                  <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {selectedApp.resumeSummary || 'Candidate highlighted strong on-the-job experience.'}
                  </p>
                  {selectedApp.resumeFileUrl && (
                    <div className="pt-2">
                      <a
                        href={selectedApp.resumeFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#1E40AF] font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Download Full CV Attachment</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        updateApplicationStatus(selectedApp.id, 'Shortlisted');
                        setSelectedApp({ ...selectedApp, status: 'Shortlisted' });
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Shortlist Candidate</span>
                    </button>
                    <button
                      onClick={() => setInterviewApp(selectedApp)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Schedule Interview</span>
                    </button>
                    <button
                      onClick={() => {
                        updateApplicationStatus(selectedApp.id, 'Rejected');
                        setSelectedApp({ ...selectedApp, status: 'Rejected' });
                      }}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setChatRecipient({ id: selectedApp.applicantId, name: selectedApp.fullName });
                      setActiveTab('messages');
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat With Candidate</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs text-slate-400 text-xs">
                Select an applicant from the "Applications" tab to review their complete profile.
              </div>
            )}
          </div>
        )}

        {/* TAB 7: SEARCH WORKERS */}
        {activeTab === 'search_workers' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Worker Search Directory</h2>
              <p className="text-xs text-slate-500">
                Discover qualified talent in Sierra Leone based on specific skills, location, experience, and availability.
              </p>
            </div>

            {/* Filter Controls Bar */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={workerSearchQuery}
                  onChange={(e) => setWorkerSearchQuery(e.target.value)}
                  placeholder="Search workers by name, job title, or specific skill (e.g. Electrician, Mechanic, React, Warehouse)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Category
                  </label>
                  <select
                    value={workerCategoryFilter}
                    onChange={(e) => setWorkerCategoryFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                  >
                    <option value="all">All Categories</option>
                    <option value="automotive">Automotive</option>
                    <option value="logistics">Logistics</option>
                    <option value="technology">Technology</option>
                    <option value="design & creative">Design & Creative</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Location
                  </label>
                  <select
                    value={workerLocationFilter}
                    onChange={(e) => setWorkerLocationFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                  >
                    <option value="all">All Locations</option>
                    <option value="freetown">Freetown</option>
                    <option value="lumley">Lumley</option>
                    <option value="aberdeen">Aberdeen</option>
                    <option value="kissy">Kissy Road</option>
                    <option value="waterloo">Waterloo</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Experience Level
                  </label>
                  <select
                    value={workerExpFilter}
                    onChange={(e) => setWorkerExpFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                  >
                    <option value="all">All Levels</option>
                    <option value="entry">Entry</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Availability
                  </label>
                  <select
                    value={workerAvailFilter}
                    onChange={(e) => setWorkerAvailFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                  >
                    <option value="all">Any Availability</option>
                    <option value="immediately">Immediately</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Workers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWorkers.map((worker) => (
                <div
                  key={worker.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={worker.avatar || '/assets/icons/account.gif'}
                          alt={worker.fullName}
                          className="w-12 h-12 rounded-2xl object-cover bg-slate-100 p-0.5 border border-slate-200"
                        />
                        <div>
                          <h3 className="text-sm font-black text-slate-900">{worker.fullName}</h3>
                          <p className="text-[11px] font-semibold text-[#1E40AF]">{worker.title}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{worker.location}</span>
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold flex items-center gap-0.5">
                        ★ {worker.rating || 5.0}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {worker.bio}
                    </p>

                    {/* Skills Chips */}
                    <div className="flex flex-wrap gap-1">
                      {worker.skills.slice(0, 4).map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium"
                        >
                          {s}
                        </span>
                      ))}
                      {worker.skills.length > 4 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{worker.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 block">Rate / Availability</span>
                      <strong className="text-xs text-slate-800">
                        {worker.hourlyRate ? `Le ${worker.hourlyRate} / hr` : 'Negotiable'}
                      </strong>
                    </div>

                    <button
                      onClick={() => {
                        setChatRecipient({ id: worker.userId, name: worker.fullName });
                        setActiveTab('messages');
                      }}
                      className="px-3 py-1.5 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Contact Worker</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: SHORTLISTED */}
        {activeTab === 'shortlisted' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Shortlisted Candidates</h2>
              <p className="text-xs text-slate-500">
                Top candidates selected for follow-up interviews and final hiring decisions.
              </p>
            </div>

            {myApplications.filter((a) => a.status === 'Shortlisted').length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs text-slate-400 text-xs">
                No candidates currently shortlisted. Review applications to shortlist top talent.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myApplications
                  .filter((a) => a.status === 'Shortlisted')
                  .map((app) => (
                    <div
                      key={app.id}
                      className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-base font-black text-slate-900">{app.fullName}</h3>
                          <p className="text-xs text-slate-500 font-semibold">
                            Position: <strong className="text-[#1E40AF]">{app.jobTitle}</strong>
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Phone: {app.phone} • Email: {app.email}
                          </p>
                        </div>
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                          Shortlisted
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-2xl text-xs text-slate-700 border border-slate-100">
                        {app.resumeSummary}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => setInterviewApp(app)}
                          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Schedule Interview</span>
                        </button>

                        <button
                          onClick={() => {
                            setChatRecipient({ id: app.applicantId, name: app.fullName });
                            setActiveTab('messages');
                          }}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Message</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 9: INTERVIEWS */}
        {activeTab === 'interviews' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Scheduled Interviews</h2>
              <p className="text-xs text-slate-500">
                Manage upcoming candidate interviews, venue locations, and record hiring decisions.
              </p>
            </div>

            {myInterviews.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs text-slate-400 text-xs">
                No interviews scheduled currently. Shortlist a candidate and tap "Schedule Interview".
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myInterviews.map((int) => (
                  <div
                    key={int.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-black text-slate-900">{int.applicantName}</h3>
                        <p className="text-xs font-bold text-[#1E40AF]">{int.jobTitle}</p>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          int.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : int.status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {int.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <p>
                        Date & Time: <strong className="text-slate-900">{int.date} at {int.time}</strong>
                      </p>
                      <p>
                        Format: <strong className="text-slate-900">{int.mode}</strong>
                      </p>
                      <p>
                        Venue / Link: <strong className="text-slate-900">{int.locationOrLink}</strong>
                      </p>
                      {int.notes && (
                        <p className="pt-1 text-[11px] text-slate-500 italic">"{int.notes}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      {int.status === 'Scheduled' && (
                        <>
                          <button
                            onClick={() => updateInterviewStatus(int.id, 'Completed')}
                            className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                          >
                            Mark Completed
                          </button>
                          <button
                            onClick={() => updateInterviewStatus(int.id, 'Cancelled')}
                            className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          setChatRecipient({ id: int.applicantId, name: int.applicantName });
                          setActiveTab('messages');
                        }}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 ml-auto"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message Candidate</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 10: MESSAGES */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {chatRecipient ? `Chat with ${chatRecipient.name}` : 'Candidate & Worker Messaging'}
                </h3>
                <p className="text-xs text-slate-500">
                  Direct communication with applicants, shortlisted talent, and interview candidates.
                </p>
              </div>
              {chatRecipient && (
                <button
                  onClick={() => setChatRecipient(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Clear Selection
                </button>
              )}
            </div>

            {/* Message Thread */}
            <div className="h-64 overflow-y-auto space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No conversation history yet. Send a message to initiate contact.
                </div>
              ) : (
                messages.map((m) => {
                  const isMe = m.senderId === currentUser?.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-xs px-3.5 py-2 rounded-2xl text-xs ${
                          isMe ? 'bg-[#1E40AF] text-white' : 'bg-white text-slate-800 border border-slate-200'
                        }`}
                      >
                        <p className="font-semibold text-[10px] opacity-75">{m.senderName}</p>
                        <p>{m.text}</p>
                      </div>
                      <span className="text-[9px] text-slate-400 mt-0.5">{m.createdAt}</span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  chatRecipient
                    ? `Message ${chatRecipient.name}...`
                    : 'Select a candidate or enter message...'
                }
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2.5 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 11: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs max-w-3xl mx-auto space-y-4">
            <h2 className="text-xl font-black text-slate-900">Employer Notifications</h2>
            <div className="divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No notifications recorded.
                </div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="py-3 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 12: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs max-w-3xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Employer Account & Verification</h2>
              <p className="text-xs text-slate-500">
                Manage business verification, candidate alert preferences, and organization settings.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Company Verification Badge</h4>
                  <p className="text-[11px] text-slate-500">
                    Submit business registration documents to gain the blue verified seal on JD Mart Careers.
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                  {currentEmployer?.verificationStatus || 'Active Account'}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Email Alerts on New Applications</h4>
                  <p className="text-[11px] text-slate-500">
                    Receive instant notifications whenever a candidate applies for your vacancies.
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-600">Enabled</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Dedicated Hiring Support</h4>
                  <p className="text-[11px] text-slate-500">
                    Need customized bulk hiring or dispatch courier integration?
                  </p>
                </div>
                <button
                  onClick={() => showToast('Connecting with JD Mart Corporate Hiring Team...')}
                  className="px-3 py-1.5 bg-[#1E40AF] text-white rounded-xl text-xs font-bold"
                >
                  Contact Account Manager
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: SCHEDULE INTERVIEW */}
        {interviewApp && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">Schedule Candidate Interview</h3>
                  <p className="text-xs text-slate-500">With {interviewApp.fullName} for {interviewApp.jobTitle}</p>
                </div>
                <button
                  onClick={() => setInterviewApp(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleScheduleInterviewSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Interview Date</label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Interview Time</label>
                  <input
                    type="time"
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Interview Mode</label>
                  <select
                    value={interviewMode}
                    onChange={(e) => setInterviewMode(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                  >
                    <option value="In-person">In-person Meeting</option>
                    <option value="Virtual Call">Virtual Video Call (Google Meet / Zoom)</option>
                    <option value="Phone">Telephone Screen</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Venue / Link</label>
                  <input
                    type="text"
                    required
                    value={interviewLocation}
                    onChange={(e) => setInterviewLocation(e.target.value)}
                    placeholder="e.g. 15 Siaka Stevens Street or meet.google.com/xyz"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Notes / Instructions</label>
                  <textarea
                    rows={2}
                    value={interviewNotes}
                    onChange={(e) => setInterviewNotes(e.target.value)}
                    placeholder="e.g. Please bring original ID and certificates"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setInterviewApp(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    Confirm Interview
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT JOB */}
        {editingJob && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">Edit Vacancy: {editingJob.title}</h3>
                <button
                  onClick={() => setEditingJob(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Job Title</label>
                  <input
                    type="text"
                    value={editingJob.title}
                    onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Salary</label>
                    <input
                      type="text"
                      value={editingJob.salary}
                      onChange={(e) => setEditingJob({ ...editingJob, salary: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Location</label>
                    <input
                      type="text"
                      value={editingJob.location}
                      onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                  <textarea
                    rows={4}
                    value={editingJob.description}
                    onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditingJob(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      await updateJob(editingJob.id, {
                        title: editingJob.title,
                        salary: editingJob.salary,
                        location: editingJob.location,
                        description: editingJob.description,
                      });
                      setEditingJob(null);
                    }}
                    className="px-4 py-2 bg-[#1E40AF] text-white rounded-xl text-xs font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
