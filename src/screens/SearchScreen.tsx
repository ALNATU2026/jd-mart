import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Store, Briefcase, ChevronRight, Star, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SearchScreen: React.FC = () => {
  const { products, stores, jobs, categories, navigate } = useApp();

  // read url query param ?q=
  const [query, setQuery] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('q') || '';
    }
    return '';
  });

  const [activeTab, setActiveTab] = useState<'all' | 'products' | 'stores' | 'jobs'>('all');

  const matchingProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  const matchingStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase()) ||
      s.location.toLowerCase().includes(query.toLowerCase())
  );

  const matchingJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(query.toLowerCase()) ||
      j.description.toLowerCase().includes(query.toLowerCase()) ||
      j.category.toLowerCase().includes(query.toLowerCase()) ||
      j.employerName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Universal Search
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Search across products, verified merchant stores, categories, and jobs
          </p>
        </div>

        {/* Search input bar */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type anything (e.g. watch, fashion, delivery, store)..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 shadow-sm focus:outline-hidden focus:ring-2 focus:ring-[#1E40AF]"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'all' ? 'bg-[#1E40AF] text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Results ({matchingProducts.length + matchingStores.length + matchingJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'products' ? 'bg-[#1E40AF] text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Products ({matchingProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('stores')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'stores' ? 'bg-[#1E40AF] text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Stores ({matchingStores.length})
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'jobs' ? 'bg-[#1E40AF] text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Jobs & Gigs ({matchingJobs.length})
          </button>
        </div>

        {/* Search Results Display */}
        <div className="space-y-8">
          {/* Products Section */}
          {(activeTab === 'all' || activeTab === 'products') && matchingProducts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#1E40AF]" />
                  Products ({matchingProducts.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {matchingProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/product/${p.id}`)}
                    className="bg-white rounded-2xl p-3 border border-slate-200/80 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full aspect-square object-cover rounded-xl mb-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/images/smartwatch.jpg';
                      }}
                    />
                    <h3 className="text-xs font-bold text-slate-900 truncate">{p.title}</h3>
                    <p className="text-xs font-black text-[#1E40AF] mt-1">Le {p.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stores Section */}
          {(activeTab === 'all' || activeTab === 'stores') && matchingStores.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Store className="w-4 h-4 text-emerald-600" />
                  Stores ({matchingStores.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {matchingStores.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => navigate(`/store/${s.slug}`)}
                    className="bg-white rounded-2xl p-4 border border-slate-200/80 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img src={s.logo} alt={s.name} className="w-10 h-10 rounded-xl object-contain border p-1" />
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">{s.name}</h3>
                        <p className="text-[10px] text-slate-500">{s.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Jobs Section */}
          {(activeTab === 'all' || activeTab === 'jobs') && matchingJobs.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  Jobs & Gigs ({matchingJobs.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matchingJobs.map((j) => (
                  <div
                    key={j.id}
                    onClick={() => navigate(`/jobs/${j.id}`)}
                    className="bg-white rounded-2xl p-4 border border-slate-200/80 hover:shadow-lg transition-all cursor-pointer flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{j.title}</h3>
                      <p className="text-[11px] text-slate-500">{j.employerName} • {j.location}</p>
                      <span className="text-xs font-bold text-[#1E40AF] mt-1 block">{j.salary}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchingProducts.length === 0 && matchingStores.length === 0 && matchingJobs.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-500">
              <p className="text-sm font-bold">No results found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try another keyword or category name.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
