import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Bell,
  Menu,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  Store,
  Bike,
  Briefcase,
  Shield,
  ShoppingBag,
  LogOut,
  X,
  Package,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const Header: React.FC = () => {
  const {
    currentPath,
    navigate,
    currentUser,
    userRole,
    switchRole,
    logout,
    cartCount,
    wishlist,
    setIsDrawerOpen,
    setIsNotificationsOpen,
    setIsCartOpen,
    notifications,
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  const roles: { role: UserRole; label: string; desc: string; icon: React.ReactNode; path: string }[] = [
    { role: 'Buyer', label: 'Buyer', desc: 'Browse, buy products & track orders', icon: <ShoppingBag className="w-4 h-4 text-blue-600" />, path: '/dashboard' },
    { role: 'Seller', label: 'Seller', desc: 'Manage store, products & orders', icon: <Store className="w-4 h-4 text-emerald-600" />, path: '/seller' },
    { role: 'Rider', label: 'Dispatch Rider', desc: 'Accept packages & earn per delivery', icon: <Bike className="w-4 h-4 text-orange-600" />, path: '/rider' },
    { role: 'Job Seeker', label: 'Job Seeker', desc: 'Find local jobs & track applications', icon: <Briefcase className="w-4 h-4 text-purple-600" />, path: '/job-seeker/dashboard' },
    { role: 'Employer', label: 'Employer', desc: 'Post job vacancies & hire workers', icon: <Briefcase className="w-4 h-4 text-indigo-600" />, path: '/employer' },
    { role: 'Admin', label: 'Administrator', desc: 'Platform moderation & control center', icon: <Shield className="w-4 h-4 text-red-600" />, path: '/admin' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      {/* Top Banner / Role Persona Switcher bar */}
      <div className="bg-[#0F172A] text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          <span className="text-amber-400 font-bold flex items-center gap-1 shrink-0">
            <Sparkles className="w-3.5 h-3.5" /> Demo Switcher:
          </span>
          <span className="text-slate-300 hidden sm:inline">Active Persona:</span>
          <div className="flex items-center gap-1.5">
            {roles.map((r) => {
              const isActive = userRole === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => switchRole(r.role)}
                  className={`px-2 py-0.5 rounded-full font-medium transition-all text-[11px] flex items-center gap-1 ${
                    isActive
                      ? 'bg-[#1E40AF] text-white ring-1 ring-white/50 shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={r.desc}
                >
                  {r.label}
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-300">
          <span className="hidden md:inline text-slate-400">Currency: <strong className="text-white">Le (SLL)</strong></span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline text-slate-400">Helpline: <strong className="text-white">+232 76 123456</strong></span>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Left: Drawer Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 rounded-xl bg-blue-50 text-[#1E40AF] hover:bg-blue-100 transition-colors"
              aria-label="Open navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-left group"
            >
              <img
                src="/assets/logos/appBarlogo.png"
                alt="JD Mart"
                className="h-9 w-auto object-contain"
                onError={(e) => {
                  // fallback if image path fails
                  (e.target as HTMLImageElement).src = '/assets/logos/jdmart_logo.png';
                }}
              />
              <div className="hidden sm:block">
                <span className="text-xl font-black text-[#1E40AF] tracking-tight block leading-none">
                  JD<span className="text-[#F97316]">MART</span>
                </span>
                <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase block">
                  Marketplace & Dispatch
                </span>
              </div>
            </button>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-xl mx-2 hidden md:flex items-center relative"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, stores, jobs..."
                className="w-full pl-10 pr-20 py-2.5 bg-slate-100/90 border border-slate-200 rounded-full text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#1E40AF] focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-full text-xs font-semibold transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Button */}
            <button
              onClick={() => navigate('/search')}
              className="p-2 text-slate-600 hover:text-[#1E40AF] md:hidden rounded-lg hover:bg-slate-100"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications Button */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 text-slate-600 hover:text-[#1E40AF] rounded-xl hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#F97316] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-600 hover:text-[#1E40AF] rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 sm:relative sm:top-0 sm:right-0 px-1.5 py-0.5 bg-[#1E40AF] text-white text-[11px] font-bold rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Account Dropdown */}
            <div className="relative">
              {currentUser ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <img
                    src={currentUser.avatar || '/assets/icons/account.gif'}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover bg-blue-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/icons/account.gif';
                    }}
                  />
                  <span className="text-xs font-semibold text-slate-700 hidden lg:inline max-w-[90px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:inline" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-3 py-1.5 text-xs font-semibold text-[#1E40AF] hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-3 py-1.5 text-xs font-semibold bg-[#1E40AF] text-white rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    Register
                  </button>
                </div>
              )}

              {/* User Dropdown Menu */}
              {userDropdownOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-[#1E40AF] text-[10px] font-bold rounded-full">
                      Role: {userRole}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('/account');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      My Account & Profile
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('/orders');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      My Orders
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('/wishlist');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                    >
                      <ShoppingBag className="w-4 h-4 text-slate-400" />
                      Saved Wishlist ({wishlist.length})
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-medium"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <nav className="bg-slate-50/80 border-t border-slate-200/70 overflow-x-auto text-xs font-semibold text-slate-700 scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-4 py-2 whitespace-nowrap">
          <button
            onClick={() => navigate('/')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentPath === '/' ? 'bg-[#1E40AF] text-white' : 'hover:bg-slate-200/60'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => navigate('/shop')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentPath.startsWith('/shop') ? 'bg-[#1E40AF] text-white' : 'hover:bg-slate-200/60'
            }`}
          >
            Shop Marketplace
          </button>
          <button
            onClick={() => navigate('/categories')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentPath.startsWith('/categor') ? 'bg-[#1E40AF] text-white' : 'hover:bg-slate-200/60'
            }`}
          >
            All Categories
          </button>
          <button
            onClick={() => navigate('/jobs')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentPath.startsWith('/jobs') ? 'bg-[#1E40AF] text-white' : 'hover:bg-slate-200/60'
            }`}
          >
            Jobs & Gigs
          </button>

          <span className="text-slate-300">|</span>

          {/* Quick links to merchant / rider / jobs */}
          <button
            onClick={() => navigate('/onboarding/seller')}
            className={`px-3 py-1.5 rounded-lg transition-colors text-emerald-700 flex items-center gap-1.5 ${
              currentPath.includes('seller') ? 'bg-emerald-100 text-emerald-900 font-bold' : 'hover:bg-emerald-50'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            Become a Seller
          </button>

          <button
            onClick={() => navigate('/onboarding/rider')}
            className={`px-3 py-1.5 rounded-lg transition-colors text-orange-700 flex items-center gap-1.5 ${
              currentPath.includes('rider') ? 'bg-orange-100 text-orange-900 font-bold' : 'hover:bg-orange-50'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            Become a Rider
          </button>

          <button
            onClick={() => navigate('/employer')}
            className={`px-3 py-1.5 rounded-lg transition-colors text-indigo-700 flex items-center gap-1.5 ${
              currentPath.startsWith('/employer') ? 'bg-indigo-100 text-indigo-900 font-bold' : 'hover:bg-indigo-50'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Hire Workers
          </button>

          <button
            onClick={() => navigate('/admin')}
            className={`px-3 py-1.5 rounded-lg transition-colors text-red-700 flex items-center gap-1.5 ${
              currentPath.startsWith('/admin') ? 'bg-red-100 text-red-900 font-bold' : 'hover:bg-red-50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin Portal
          </button>
        </div>
      </nav>
    </header>
  );
};
