import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  Filter,
  ArrowRight,
  Plus,
  DollarSign,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const JobsScreen: React.FC = () => {
  const { jobs, navigate } = useApp();

  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');

  const filteredJobs = jobs.filter((j) => {
    const matchesQuery =
      j.title.toLowerCase().includes(query.toLowerCase()) ||
      j.description.toLowerCase().includes(query.toLowerCase()) ||
      j.employerName.toLowerCase().includes(query.toLowerCase());
    const matchesType = selectedType === 'All' || j.type === selectedType;
    const matchesCategory = selectedCategory === 'All' || j.category === selectedCategory;
    const matchesLocation =
      selectedLocation === 'All' || j.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesQuery && matchesType && matchesCategory && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <button onClick={() => navigate('/')} className="hover:text-[#1E40AF]">Home</button>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-800 font-semibold">Jobs Marketplace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Sierra Leone Job & Gig Marketplace
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Find verified courier, sales, management, and technical jobs across Freetown & provinces
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => navigate('/employer/jobs/new')}
              className="px-4 py-2.5 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Post a Vacancy</span>
            </button>
            <button
              onClick={() => navigate('/job-seeker/dashboard')}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold transition-colors"
            >
              My Applications
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search job title, skills, or company name..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1E40AF]"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Job Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold text-slate-800"
              >
                <option value="All">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Gig / Contract">Gig / Contract</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Industry / Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold text-slate-800"
              >
                <option value="All">All Categories</option>
                <option value="Logistics & Delivery">Logistics & Delivery</option>
                <option value="Retail & Management">Retail & Management</option>
                <option value="Marketing & Creative">Marketing & Creative</option>
                <option value="Customer Service">Customer Service</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Location Area</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold text-slate-800"
              >
                <option value="All">All Locations</option>
                <option value="Freetown">Freetown & Western Area</option>
                <option value="Lumley">Lumley / West</option>
                <option value="Central">Central Freetown</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          <p className="text-xs text-slate-500 font-semibold">
            Showing <strong className="text-slate-900">{filteredJobs.length}</strong> available vacancies
          </p>

          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-3">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">No vacancies found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                There are no open job vacancies matching your current filters. Are you an employer looking for talent?
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => navigate('/employer/jobs/new')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Post a Job Listing
                </button>
                <button
                  onClick={() => {
                    setSelectedType('All');
                    setSelectedCategory('All');
                    setSelectedLocation('All');
                    setQuery('');
                  }}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1E40AF] text-[10px] font-bold uppercase tracking-wider">
                          {job.category}
                        </span>
                        <h3
                          onClick={() => navigate(`/jobs/${job.id}`)}
                          className="text-base font-bold text-slate-900 hover:text-[#1E40AF] cursor-pointer mt-1"
                        >
                          {job.title}
                        </h3>
                        <p className="text-xs text-slate-500">{job.employerName}</p>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold shrink-0">
                        {job.type}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-3">
                      {job.requirements.slice(0, 2).map((req, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md truncate max-w-[200px]">
                          ✓ {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-[#1E40AF]">{job.salary}</span>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{job.location}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="px-4 py-2 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      View & Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
