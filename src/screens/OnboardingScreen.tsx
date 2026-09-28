import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OnboardingScreen: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {
  const { navigate } = useApp();
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: 'Discover Local Products',
      subtitle: 'Browse authentic electronics, fashion, food, and furniture from certified Sierra Leonean merchants.',
      image: '/assets/images/onboarding1.png',
    },
    {
      title: 'Rapid Motorbike Dispatch',
      subtitle: 'On-demand delivery couriers pick up orders directly and bring them straight to your doorstep.',
      image: '/assets/images/onboarding2.png',
    },
    {
      title: 'Jobs & Gigs Marketplace',
      subtitle: 'Find employment, recruit reliable workers, and manage freelance assignments in one unified platform.',
      image: '/assets/images/onboarding3.png',
    },
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((p) => p + 1);
    } else {
      if (onFinish) onFinish();
      else navigate('/');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F5F7FB] flex flex-col justify-between p-6 sm:p-12">
      {/* Top skip */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            if (onFinish) onFinish();
            else navigate('/');
          }}
          className="text-xs font-bold text-slate-500 hover:text-[#1E40AF]"
        >
          Skip Intro
        </button>
      </div>

      {/* Main Slide content */}
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="w-64 h-64 mx-auto rounded-3xl overflow-hidden bg-white p-4 shadow-xl border border-slate-100 flex items-center justify-center">
          <img
            src={pages[currentPage].image}
            alt={pages[currentPage].title}
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/images/illustra.png';
            }}
          />
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {pages[currentPage].title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            {pages[currentPage].subtitle}
          </p>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2">
          {pages.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                currentPage === i ? 'w-8 bg-[#1E40AF]' : 'w-2 bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="max-w-md mx-auto w-full">
        <button
          onClick={handleNext}
          className="w-full py-4 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition-colors shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
        >
          <span>{currentPage === pages.length - 1 ? 'Get Started' : 'Next'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
