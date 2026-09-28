import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Store, Bike, Briefcase, User, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const LoginScreen: React.FC = () => {
  const { login, switchRole, navigate } = useApp();

  const [email, setEmail] = useState('buyer@jdmart.sl');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    navigate('/');
  };

  const quickRoles: { role: UserRole; email: string; label: string; icon: React.ReactNode }[] = [
    { role: 'Buyer', email: 'buyer@jdmart.sl', label: 'Buyer', icon: <User className="w-4 h-4 text-blue-600" /> },
    { role: 'Seller', email: 'seller@jdmart.sl', label: 'Seller', icon: <Store className="w-4 h-4 text-emerald-600" /> },
    { role: 'Rider', email: 'rider@jdmart.sl', label: 'Rider', icon: <Bike className="w-4 h-4 text-orange-600" /> },
    { role: 'Employer', email: 'employer@jdmart.sl', label: 'Employer', icon: <Briefcase className="w-4 h-4 text-indigo-600" /> },
    { role: 'Admin', email: 'admin@jdmart.sl', label: 'Admin', icon: <Shield className="w-4 h-4 text-red-600" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <img
            src="/assets/logos/applogo.png"
            alt="JD Mart"
            className="w-16 h-16 object-contain mx-auto rounded-2xl bg-white p-2 shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/logos/jdmart_logo.png';
            }}
          />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign In to JD Mart
          </h2>
          <p className="text-xs text-slate-500">
            Access your buyer orders, seller storefront, or delivery fleet
          </p>
        </div>

        {/* 1-Click Role Switch Demo Buttons */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            ⚡ Quick Demo Logins
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {quickRoles.map((r) => (
              <button
                key={r.role}
                onClick={() => {
                  login(r.email, r.role);
                  switchRole(r.role);
                }}
                className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 text-xs font-semibold text-slate-800 flex items-center justify-center gap-1.5 transition-colors"
              >
                {r.icon}
                <span>{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Standard Email/Password Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-[11px] text-[#1E40AF] font-bold hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1E40AF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
            >
              Sign In
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-[#1E40AF] font-bold hover:underline"
            >
              Register Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
