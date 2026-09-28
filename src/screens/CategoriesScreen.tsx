import React from 'react';
import { ChevronRight, ArrowRight, Grid, LayoutGrid } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CategoriesScreen: React.FC = () => {
  const { categories, products, navigate } = useApp();

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => navigate('/')} className="hover:text-[#1E40AF]">Home</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-semibold">All Categories</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Marketplace Categories
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse through our 12 major commerce departments and find exactly what you need
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.name).length;
            return (
              <div
                key={cat.id}
                onClick={() => navigate(`/category/${cat.slug}`)}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-blue-400 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 group-hover:bg-[#1E40AF] flex items-center justify-center transition-colors mb-4">
                    <img
                      src={cat.icon}
                      alt={cat.name}
                      className="w-8 h-8 object-contain group-hover:brightness-200 transition-all"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/icons/categories.png';
                      }}
                    />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1E40AF] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {cat.description || 'Explore top rated items from certified sellers'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs font-semibold">
                  <span className="text-[#1E40AF] font-bold">{count} items</span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-blue-100 text-slate-400 group-hover:text-[#1E40AF] flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
