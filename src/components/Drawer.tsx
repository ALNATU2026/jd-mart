import React from 'react';
import { X, ChevronRight, LogOut, Shield, User, Store, Bike, Briefcase } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Drawer: React.FC = () => {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    navigate,
    currentUser,
    userRole,
    logout,
    cartCount,
    wishlist,
  } = useApp();

  if (!isDrawerOpen) return null;

  const originalMenuItems = [
    { title: 'Home', icon: '/assets/icons/home.gif', path: '/' },
    { title: 'Account', icon: '/assets/icons/account.gif', path: '/account' },
    { title: 'Categories', icon: '/assets/icons/categories.png', path: '/categories' },
    { title: 'Deals & Discounts', icon: '/assets/icons/deals.gif', path: '/shop?filter=deals' },
    { title: 'My Orders', icon: '/assets/icons/myorder.png', path: '/orders' },
    { title: 'Wishlist', icon: '/assets/icons/wishlist.gif', path: '/wishlist', badge: wishlist.length },
    { title: 'Messages', icon: '/assets/icons/message.png', path: '/dashboard?tab=messages' },
    { title: 'Notifications', icon: '/assets/icons/notification.gif', path: '/dashboard?tab=notifications' },
    { title: 'My Store', icon: '/assets/icons/mystore.gif', path: '/seller' },
    { title: 'Help & Support', icon: '/assets/icons/help.gif', path: '/#help' },
  ];

  const rolePortals = [
    { title: 'Buyer Hub', icon: <User className="w-4 h-4 text-blue-600" />, path: '/dashboard' },
    { title: 'Seller Merchant Hub', icon: <Store className="w-4 h-4 text-emerald-600" />, path: '/seller' },
    { title: 'Rider Dispatch Portal', icon: <Bike className="w-4 h-4 text-orange-600" />, path: '/rider' },
    { title: 'Job Opportunities', icon: <Briefcase className="w-4 h-4 text-purple-600" />, path: '/jobs' },
    { title: 'Employer Portal', icon: <Briefcase className="w-4 h-4 text-indigo-600" />, path: '/employer' },
    { title: 'Admin Console', icon: <Shield className="w-4 h-4 text-red-600" />, path: '/admin' },
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
        {/* Drawer Header with Flutter App Color (#1E40AF) */}
        <div className="bg-[#1E40AF] text-white p-5 relative overflow-hidden">
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mt-2">
            <div className="w-14 h-14 rounded-2xl bg-white p-1.5 shadow-md flex items-center justify-center shrink-0">
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
              <p className="text-xs text-blue-200 truncate">
                {currentUser ? currentUser.name : 'Welcome to JD Mart'}
              </p>
              <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-white/15 text-[11px] font-semibold text-amber-300">
                <span>{userRole} Mode</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Menu Items */}
        <div className="flex-1 overflow-y-auto py-3 px-2 divide-y divide-slate-100">
          {/* Main Original App Menu Items */}
          <div className="space-y-1 pb-3">
            <p className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Navigation Menu
            </p>
            {originalMenuItems.map((item) => (
              <button
                key={item.title}
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate(item.path);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-blue-50/70 text-slate-700 hover:text-[#1E40AF] transition-colors group text-sm font-semibold"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 flex items-center justify-center">
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

          {/* Role Portals */}
          <div className="space-y-1 pt-3">
            <p className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Platform Portals
            </p>
            {rolePortals.map((portal) => (
              <button
                key={portal.title}
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate(portal.path);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors text-xs font-semibold"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                    {portal.icon}
                  </div>
                  <span>{portal.title}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>
            ))}
          </div>
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
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                navigate('/login');
              }}
              className="w-full py-2 bg-[#1E40AF] text-white rounded-xl text-xs font-bold text-center"
            >
              Sign In to JD Mart
            </button>
          )}
          <span className="text-[11px] text-slate-400">v2.4 Sierra Leone</span>
        </div>
      </div>
    </div>
  );
};
