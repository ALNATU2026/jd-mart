import React from 'react';
import { useApp } from '../context/AppContext';
import { Store, Bike, Briefcase, Shield, Phone, Mail, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useApp();

  return (
    <footer className="bg-[#0F172A] text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/assets/logos/applogo.png"
                alt="JD Mart Logo"
                className="w-10 h-10 object-contain rounded-lg bg-white p-1"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/logos/jdmart_logo.png';
                }}
              />
              <span className="text-2xl font-black text-white tracking-tight">
                JD<span className="text-[#F97316]">MART</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              Sierra Leone's unified digital platform connecting buyers with verified local sellers, reliable on-demand motorbike dispatch riders, and verified job opportunities.
            </p>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>24 Siaka Stevens Street, Central Freetown, Sierra Leone</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+232 76 123456 / +232 77 987654</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>support@jdmart.sl / sales@jdmart.sl</span>
              </div>
            </div>
          </div>

          {/* Marketplace Navigation */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Marketplace
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('/shop')} className="hover:text-white transition-colors">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/category/electronics')} className="hover:text-white transition-colors">
                  Electronics & Gadgets
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/category/fashion')} className="hover:text-white transition-colors">
                  Fashion & Footwear
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/category/furniture')} className="hover:text-white transition-colors">
                  Home & Furniture
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/category/beauty')} className="hover:text-white transition-colors">
                  Beauty & Skincare
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/categories')} className="hover:text-white transition-colors">
                  Browse All 12 Categories
                </button>
              </li>
            </ul>
          </div>

          {/* Earn on JD Mart */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Earn With Us
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('/onboarding/seller')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-emerald-400" />
                  Become a Seller
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/onboarding/rider')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Bike className="w-3.5 h-3.5 text-orange-400" />
                  Become a Dispatch Rider
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/jobs')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                  Find a Job / Gigs
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/employer')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  Post Job Vacancies
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/seller')} className="hover:text-white transition-colors">
                  Seller Merchant Hub
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/rider')} className="hover:text-white transition-colors">
                  Rider Dispatch Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Account & Administration */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Account & Help
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors">
                  Buyer Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/orders')} className="hover:text-white transition-colors">
                  Order Tracking
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/wishlist')} className="hover:text-white transition-colors">
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/cart')} className="hover:text-white transition-colors">
                  Shopping Cart
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/admin')} className="hover:text-white transition-colors flex items-center gap-1.5 text-red-400">
                  <Shield className="w-3.5 h-3.5" />
                  Admin Console
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">
                  Sign In / Register
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} JD Mart Multi-Role Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Rider Safety Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
