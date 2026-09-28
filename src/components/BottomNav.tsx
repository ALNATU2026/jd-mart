import React from 'react';
import { Home, LayoutGrid, MessageSquare, User, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen, showToast } = useApp();

  const handleNav = (target: string) => {
    if (target === 'home') {
      setCurrentScreen('home');
    } else if (target === 'categories') {
      setCurrentScreen('home');
      showToast('Viewing categories');
    } else if (target === 'messages') {
      showToast('Opening live support & messages');
    } else if (target === 'account') {
      setCurrentScreen('login');
    }
  };

  const isHomeActive = currentScreen === 'home';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto pointer-events-auto">
      {/* Center Floating Action Button with notch-like design */}
      <div className="relative">
        <div className="absolute left-1/2 -top-6 -translate-x-1/2 z-10">
          <button
            onClick={() => showToast('Create new listing or request')}
            className="w-14 h-14 rounded-full bg-[#1E40AF] text-white flex items-center justify-center shadow-lg shadow-blue-900/30 hover:bg-blue-800 active:scale-95 transition-transform"
            aria-label="Add item"
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </button>
        </div>

        {/* Bottom bar container with center dip */}
        <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-between shadow-lg">
          {/* Left items */}
          <div className="flex items-center space-x-6 pl-2">
            <button
              onClick={() => handleNav('home')}
              className={`flex flex-col items-center py-1 transition-colors ${
                isHomeActive ? 'text-[#1E40AF] font-bold' : 'text-slate-500'
              }`}
            >
              <Home className="w-6 h-6 stroke-[2]" />
              <span className="text-[11px] mt-0.5">Home</span>
            </button>

            <button
              onClick={() => handleNav('categories')}
              className="flex flex-col items-center py-1 text-slate-500 hover:text-[#1E40AF] transition-colors"
            >
              <LayoutGrid className="w-6 h-6 stroke-[1.8]" />
              <span className="text-[11px] mt-0.5">Categories</span>
            </button>
          </div>

          {/* Center spacer for FAB */}
          <div className="w-12"></div>

          {/* Right items */}
          <div className="flex items-center space-x-6 pr-2">
            <button
              onClick={() => handleNav('messages')}
              className="flex flex-col items-center py-1 text-slate-500 hover:text-[#1E40AF] transition-colors"
            >
              <MessageSquare className="w-6 h-6 stroke-[1.8]" />
              <span className="text-[11px] mt-0.5">Messages</span>
            </button>

            <button
              onClick={() => handleNav('account')}
              className="flex flex-col items-center py-1 text-slate-500 hover:text-[#1E40AF] transition-colors"
            >
              <User className="w-6 h-6 stroke-[1.8]" />
              <span className="text-[11px] mt-0.5">Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
