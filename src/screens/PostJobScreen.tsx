import React, { useState } from 'react';
import { ArrowLeft, Save, Briefcase } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PostJobScreen: React.FC = () => {
  const { postJob, navigate, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Logistics & Delivery');
  const [type, setType] = useState<'Full-time' | 'Part-time' | 'Gig / Contract'>('Full-time');
  const [location, setLocation] = useState('Central Freetown');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !salary || !description) {
      showToast('Please fill out all required fields');
      return;
    }

    const requirements = requirementsText
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);
    const responsibilities = responsibilitiesText
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    postJob({
      employerId: 'user-emp-1',
      employerName: 'JD Partner Employer',
      title,
      category,
      type,
      location,
      salary,
      description,
      requirements: requirements.length > 0 ? requirements : ['Driver license or relevant training', 'Good communication skills'],
      responsibilities: responsibilities.length > 0 ? responsibilities : ['Execute daily tasks accurately', 'Report progress to manager'],
      status: 'active',
      featured: true,
    });

    navigate('/employer');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <button
            onClick={() => navigate('/employer')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#1E40AF] hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Employer Dashboard</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Post a Job Vacancy
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Reach thousands of job seekers, couriers, store managers, and artisans in Sierra Leone
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Job Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Express Motorbike Dispatch Rider"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
              >
                <option value="Logistics & Delivery">Logistics & Delivery</option>
                <option value="Retail & Management">Retail & Management</option>
                <option value="Marketing & Creative">Marketing & Creative</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Security & Support">Security & Support</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Employment Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Gig / Contract">Gig / Contract</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Freetown & Western Area"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Salary / Compensation (Le)</label>
              <input
                type="text"
                required
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. Le 3,000 / month + bonuses"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Role Description</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the mission, day-to-day work, and company culture..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Requirements (one per line)</label>
            <textarea
              rows={3}
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
              placeholder="Valid driver's license&#10;1+ year experience&#10;Smartphone capable"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Responsibilities (one per line)</label>
            <textarea
              rows={3}
              value={responsibilitiesText}
              onChange={(e) => setResponsibilitiesText(e.target.value)}
              placeholder="Safely pick up orders&#10;Deliver directly to buyers"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-3 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Publish Job Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
