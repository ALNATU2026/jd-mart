import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Store, Bike, Briefcase, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const RegisterScreen: React.FC = () => {
  const { login, navigate, showToast } = useApp();

  const [accountType, setAccountType] = useState<UserRole>('Buyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const accountTypes: { role: UserRole; title: string; desc: string; icon: React.ReactNode }[] = [
    { role: 'Buyer', title: 'Buyer', desc: 'Shop & track orders', icon: <User className="w-4 h-4 text-blue-600" /> },
    { role: 'Seller', title: 'Seller', desc: 'Sell & manage inventory', icon: <Store className="w-4 h-4 text-emerald-600" /> },
    { role: 'Rider', title: 'Rider', desc: 'Dispatch & deliveries', icon: <Bike className="w-4 h-4 text-orange-600" /> },
    { role: 'Job Seeker', title: 'Job Seeker', desc: 'Find local vacancies', icon: <Briefcase className="w-4 h-4 text-purple-600" /> },
    { role: 'Employer', title: 'Employer', desc: 'Hire skilled workers', icon: <Briefcase className="w-4 h-4 text-indigo-600" /> },
  ];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      showToast('Please fill out all registration fields');
      return;
    }

    login(email, accountType);
    showToast(`Account created as ${accountType}!`);

    if (accountType === 'Seller') navigate('/onboarding/seller');
    else if (accountType === 'Rider') navigate('/onboarding/rider');
    else if (accountType === 'Employer') navigate('/employer');
    else if (accountType === 'Job Seeker') navigate('/job-seeker/dashboard');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center space-y-2">
          <img
            src="/assets/logos/applogo.png"
            alt="JD Mart"
            className="w-16 h-16 object-contain mx-auto rounded-2xl bg-white p-2 shadow-sm"
          />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Create Your JD Mart Account
          </h2>
          <p className="text-xs text-slate-500">
            Join Sierra Leone's digital commerce and on-demand delivery ecosystem
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          {/* Account Type Selector */}
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
              Select Account Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {accountTypes.map((t) => (
                <div
                  key={t.role}
                  onClick={() => setAccountType(t.role)}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                    accountType === t.role
                      ? 'border-[#1E40AF] bg-blue-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {t.icon}
                    <span className="text-xs font-bold text-slate-800">{t.title}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Samuel Bangura"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.sl"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Phone / WhatsApp Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+232 76 000000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#1E40AF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
            >
              Register as {accountType}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-[#1E40AF] font-bold hover:underline">
              Sign In Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
