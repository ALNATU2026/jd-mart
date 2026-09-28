import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const SplashScreen: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {
  const { navigate } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
      else navigate('/');
    }, 2400);
    return () => clearTimeout(timer);
  }, [onFinish, navigate]);

  return (
    <div className="fixed inset-0 z-50 bg-linear-to-b from-[#1E40AF] via-[#1E3A8A] to-[#0F172A] flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="animate-in zoom-in-75 duration-700 flex flex-col items-center space-y-4">
        <div className="w-28 h-28 rounded-3xl bg-white p-3 shadow-2xl flex items-center justify-center ring-4 ring-white/20">
          <img
            src="/assets/logos/applogo.png"
            alt="JD Mart Logo"
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/logos/jdmart_logo.png';
            }}
          />
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            JD<span className="text-[#F97316]">MART</span>
          </h1>
          <p className="text-sm font-medium text-blue-200 mt-1">
            Buy Smart, Sell Faster
          </p>
        </div>

        <div className="w-8 h-8 border-3 border-white/20 border-t-white rounded-full animate-spin mt-4" />
      </div>

      <button
        onClick={() => {
          if (onFinish) onFinish();
          else navigate('/');
        }}
        className="absolute bottom-10 text-xs text-white/60 hover:text-white underline font-semibold"
      >
        Skip Splash Screen
      </button>
    </div>
  );
};
