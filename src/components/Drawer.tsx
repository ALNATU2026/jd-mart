import React from 'react';
import { X, ChevronRight, LogOut, Shield, User, Store, Bike, Briefcase, ShoppingBag, Package, Heart, HelpCircle, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Drawer: React.FC = () => {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    navigate,
    currentUser,
    userRole,
    logout,
    wishlist,
  } = useApp();

  if (!isDrawerOpen) return null;

  const isAdmin = currentUser?.role === 'Admin';

  const customerNav = [
    { title: 'Home', icon: '/assets/icons/home.gif', path: '/' },
    { title: 'Shop Marketplace', icon: '/assets/icons/store.png', path: '/shop' },
    { title: 'Browse Categories', icon: '/assets/icons/categories.png', path: '/categories' },
    { title: 'Jobs & Gigs', icon: '/assets/icons/support.png', path: '/jobs' },
    { title: 'Track My Orders', icon: '/assets/icons/myorder.png', path: '/orders' },
    { title: 'Saved Wishlist', icon: '/assets/icons/wishlist.gif', path: '/wishlist', badge: wishlist.length },
    { title: 'Help & Customer Support', icon: '/assets/icons/help.gif', path: '/#help' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Drawer Header */}
        <div
          className={`text-white p-5 relative overflow-hidden ${
            isAdmin ? 'bg-slate-900' : 'bg-[#1E40AF]'
          }`}
        >
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mt-2">
            <div className="w-13 h-13 rounded-2xl bg-white p-1.5 shadow-md flex items-center justify-center shrink-0">
              <img
                src="/assets/logos/applogo.png"
                alt="JD Mart"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/logos/jdmart_logo.png';
                }}
              />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-lg font-black tracking-tight leading-tight">JD MART</h2>
              <p className="text-xs text-blue-100 truncate">
                {currentUser ? currentUser.name : 'Welcome to JD Mart'}
              </p>
              {currentUser ? (
                <div
                  className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isAdmin ? 'bg-red-500 text-white' : 'bg-white/20 text-white'
                  }`}
                >
                  <span>{currentUser.role} Account</span>
                </div>
              ) : (
                <p className="text-[11px] text-blue-200 mt-0.5">Freetown, Sierra Leone</p>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Menu Items */}
        <div className="flex-1 overflow-y-auto py-3 px-2 divide-y divide-slate-100">
          {/* Main Navigation */}
          <div className="space-y-1 pb-3">
            <p className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Explore
            </p>
            {customerNav.map((item) => (
              <button
                key={item.title}
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate(item.path);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-blue-50/70 text-slate-700 hover:text-[#1E40AF] transition-colors group text-sm font-semibold"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="w-5 h-5 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <span>{item.title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#1E40AF] text-white text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#1E40AF] transition-colors" />
                </div>
              </button>
            ))}
          </div>

          {/* Business & Opportunities Portals */}
          <div className="space-y-1 pt-3 pb-3">
            <p className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Earn & Partner
            </p>
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                navigate('/onboarding/seller');
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 transition-colors text-xs font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Store className="w-4 h-4" />
                </div>
                <span>Become a Seller</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>

            <button
              onClick={() => {
                setIsDrawerOpen(false);
                navigate('/onboarding/rider');
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-orange-50 text-slate-700 hover:text-orange-800 transition-colors text-xs font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
                  <Bike className="w-4 h-4" />
                </div>
                <span>Become a Dispatch Rider</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>

            <button
              onClick={() => {
                setIsDrawerOpen(false);
                navigate('/employer');
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 transition-colors text-xs font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span>Hire Workers / Post Job</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          </div>

          {/* Admin Section (Only shown if currently authenticated as Admin) */}
          {isAdmin && (
            <div className="space-y-1 pt-3">
              <p className="px-3 py-1 text-[11px] font-bold text-red-600 uppercase tracking-wider">
                Admin Control Panel
              </p>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate('/admin');
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-red-50 text-red-800 transition-colors text-xs font-bold"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                  <span>Admin Console</span>
                </div>
                <ChevronRight className="w-4 h-4 text-red-400" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {currentUser ? (
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                logout();
              }}
              className="flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          ) : (
            <div className="w-full flex items-center gap-2">
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate('/login');
                }}
                className="flex-1 py-2 bg-[#1E40AF] text-white rounded-xl text-xs font-bold text-center"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate('/register');
                }}
                className="flex-1 py-2 bg-slate-200 text-slate-800 rounded-xl text-xs font-bold text-center"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
