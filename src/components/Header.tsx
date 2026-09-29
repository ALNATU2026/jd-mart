import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Bell,
  Menu,
  User as UserIcon,
  ChevronDown,
  Store,
  Bike,
  Briefcase,
  Shield,
  ShoppingBag,
  LogOut,
  Package,
  Phone,
  HelpCircle,
  Truck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    currentPath,
    navigate,
    currentUser,
    userRole,
    logout,
    cartCount,
    wishlist,
    setIsDrawerOpen,
    setIsNotificationsOpen,
    setIsCartOpen,
    notifications,
  } = useApp();

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

  const isAdmin = currentUser?.role === 'Admin';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      {/* Top Utility Announcement Bar (No Demo Switcher) */}
      <div className="bg-[#0F172A] text-white text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-slate-300">
          <span className="flex items-center gap-1.5 font-medium text-slate-200">
            <Truck className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Fast Nationwide Dispatch Across Sierra Leone</span>
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">
            Currency: <strong className="text-white">Le (SLL)</strong>
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-300">
          <button
            onClick={() => navigate('/orders')}
            className="hidden md:flex items-center gap-1 hover:text-white transition-colors"
          >
            <Package className="w-3.5 h-3.5 text-blue-400" />
            <span>Track Order</span>
          </button>
          <span className="hidden md:inline text-slate-600">|</span>
          <div className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 hidden sm:inline">Helpline:</span>
            <strong className="text-white">+232 76 123456</strong>
          </div>
          <span className="hidden sm:inline text-slate-600">|</span>
          <button
            onClick={() => navigate('/#help')}
            className="hidden sm:flex items-center gap-1 hover:text-white transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Help</span>
          </button>
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
                placeholder="Search products, verified stores, dispatch riders, jobs..."
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

          {/* Right Action Icons & User Account */}
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

            {/* User Account / Profile Dropdown */}
            <div className="relative">
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className={`flex items-center gap-2 p-1.5 pl-2.5 rounded-full transition-all border ${
                      isAdmin
                        ? 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    {isAdmin ? (
                      <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xs">
                        <Shield className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <img
                        src={currentUser.avatar || '/assets/icons/account.gif'}
                        alt={currentUser.name}
                        className="w-6 h-6 rounded-full object-cover bg-blue-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/icons/account.gif';
                        }}
                      />
                    )}
                    <span className="text-xs font-bold hidden sm:inline max-w-[100px] truncate">
                      {isAdmin ? 'Admin' : currentUser.name}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full hidden md:inline ${
                        isAdmin
                          ? 'bg-red-600 text-white'
                          : 'bg-blue-100 text-[#1E40AF]'
                      }`}
                    >
                      {currentUser.role}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-[11px] text-slate-400">Signed in as</p>
                        <p className="text-sm font-bold text-slate-800 truncate">
                          {currentUser.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                        <span
                          className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            isAdmin
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-50 text-[#1E40AF]'
                          }`}
                        >
                          Role: {currentUser.role}
                        </span>
                      </div>

                      {/* Admin Specific Links */}
                      {isAdmin ? (
                        <div className="py-1">
                          <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Administrator Controls
                          </p>
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              navigate('/admin');
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-2.5 font-semibold"
                          >
                            <Shield className="w-4 h-4 text-red-600" />
                            Admin Console
                          </button>
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              navigate('/admin/users');
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                          >
                            <UserIcon className="w-4 h-4 text-slate-400" />
                            Manage Users
                          </button>
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              navigate('/admin/sellers');
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                          >
                            <Store className="w-4 h-4 text-slate-400" />
                            Manage Sellers
                          </button>
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              navigate('/admin/riders');
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                          >
                            <Bike className="w-4 h-4 text-slate-400" />
                            Manage Riders
                          </button>
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              navigate('/admin/orders');
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                          >
                            <Package className="w-4 h-4 text-slate-400" />
                            Platform Orders
                          </button>
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              navigate('/admin/jobs');
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                          >
                            <Briefcase className="w-4 h-4 text-slate-400" />
                            Job Moderation
                          </button>
                        </div>
                      ) : (
                        /* Normal User Links (Role-Specific) */
                        <div className="py-1">
                          {currentUser.role === 'Seller' && (
                            <>
                              <button
                                onClick={() => {
                                  setUserDropdownOpen(false);
                                  navigate('/seller');
                                }}
                                className="w-full text-left px-4 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5 font-bold"
                              >
                                <Store className="w-4 h-4 text-emerald-600" />
                                Seller Hub
                              </button>
                              <button
                                onClick={() => {
                                  setUserDropdownOpen(false);
                                  navigate('/seller/products');
                                }}
                                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Package className="w-4 h-4 text-slate-400" />
                                My Products
                              </button>
                            </>
                          )}

                          {currentUser.role === 'Rider' && (
                            <button
                              onClick={() => {
                                setUserDropdownOpen(false);
                                navigate('/rider');
                              }}
                              className="w-full text-left px-4 py-2 text-xs text-orange-700 hover:bg-orange-50 flex items-center gap-2.5 font-bold"
                            >
                              <Bike className="w-4 h-4 text-orange-600" />
                              Rider Dispatch Hub
                            </button>
                          )}

                          {currentUser.role === 'Employer' && (
                            <button
                              onClick={() => {
                                setUserDropdownOpen(false);
                                navigate('/employer');
                              }}
                              className="w-full text-left px-4 py-2 text-xs text-indigo-700 hover:bg-indigo-50 flex items-center gap-2.5 font-bold"
                            >
                              <Briefcase className="w-4 h-4 text-indigo-600" />
                              Employer Hub
                            </button>
                          )}

                          {currentUser.role === 'Job Seeker' && (
                            <button
                              onClick={() => {
                                setUserDropdownOpen(false);
                                navigate('/job-seeker/dashboard');
                              }}
                              className="w-full text-left px-4 py-2 text-xs text-purple-700 hover:bg-purple-50 flex items-center gap-2.5 font-bold"
                            >
                              <Briefcase className="w-4 h-4 text-purple-600" />
                              Job Applications
                            </button>
                          )}

                          {currentUser.role === 'Buyer' && (
                            <button
                              onClick={() => {
                                setUserDropdownOpen(false);
                                navigate('/dashboard');
                              }}
                              className="w-full text-left px-4 py-2 text-xs text-blue-700 hover:bg-blue-50 flex items-center gap-2.5 font-bold"
                            >
                              <ShoppingBag className="w-4 h-4 text-blue-600" />
                              Buyer Dashboard
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              navigate('/account');
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                          >
                            <UserIcon className="w-4 h-4 text-slate-400" />
                            Account & Profile
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
                            Wishlist ({wishlist.length})
                          </button>
                        </div>
                      )}

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
              ) : (
                /* When Logged Out: Clean Sign In & Register */
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-3.5 py-1.5 text-xs font-bold text-[#1E40AF] hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-3.5 py-1.5 text-xs font-bold bg-[#1E40AF] text-white rounded-xl hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Sub-bar (Customer & Merchant Facing - NO Admin button here!) */}
      <nav className="bg-slate-50/80 border-t border-slate-200/70 overflow-x-auto text-xs font-semibold text-slate-700 scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-3 py-2 whitespace-nowrap">
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

          {/* Business & Service Onboarding Links */}
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
        </div>
      </nav>
    </header>
  );
};
