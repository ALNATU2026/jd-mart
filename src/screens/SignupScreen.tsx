import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SignupScreen: React.FC = () => {
  const { setCurrentScreen, login, showToast } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) {
      showToast('Please fill in your details');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match');
      return;
    }
    showToast('Account created successfully!');
    login(email);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col px-6 py-6">
      {/* Top Bar */}
      <div className="w-full max-w-sm mx-auto flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentScreen('login')}
          className="p-2 -ml-2 text-[#0F172A] hover:bg-slate-100 rounded-full"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <img
          src="/assets/logos/appBarlogo.png"
          alt="JDMart"
          className="h-8 object-contain"
        />
        <div className="w-9" />
      </div>

      <div className="w-full max-w-sm mx-auto my-auto">
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Create account
          </h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Join JDMart and start buying or selling in minutes.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white p-6 rounded-[30px] shadow-xl shadow-slate-200/50 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full name"
                className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] text-sm rounded-2xl border-none focus:ring-2 focus:ring-[#1E40AF] outline-none text-slate-800"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] text-sm rounded-2xl border-none focus:ring-2 focus:ring-[#1E40AF] outline-none text-slate-800"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-5 h-5" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] text-sm rounded-2xl border-none focus:ring-2 focus:ring-[#1E40AF] outline-none text-slate-800"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-11 pr-11 py-3 bg-[#F8FAFC] text-sm rounded-2xl border-none focus:ring-2 focus:ring-[#1E40AF] outline-none text-slate-800"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full pl-11 pr-11 py-3 bg-[#F8FAFC] text-sm rounded-2xl border-none focus:ring-2 focus:ring-[#1E40AF] outline-none text-slate-800"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Create Button */}
            <button
              type="submit"
              className="w-full h-14 bg-[#1E40AF] text-white rounded-2xl font-bold text-base hover:bg-blue-800 transition-all shadow-md shadow-blue-900/20 active:scale-[0.99] mt-3"
            >
              Create account
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-slate-500">
          <span>Already have an account? </span>
          <button
            onClick={() => setCurrentScreen('login')}
            className="font-bold text-[#1E40AF] hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};
