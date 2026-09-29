import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Store, Bike, Briefcase, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const RegisterScreen: React.FC = () => {
  const { registerWithEmail, loginWithGoogle, navigate, showToast } = useApp();

  const [accountType, setAccountType] = useState<UserRole>('Buyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    await loginWithGoogle(accountType);
    setGoogleLoading(false);
  };

  const accountTypes: { role: UserRole; title: string; desc: string; icon: React.ReactNode }[] = [
    { role: 'Buyer', title: 'Buyer', desc: 'Shop & track orders', icon: <User className="w-4 h-4 text-blue-600" /> },
    { role: 'Seller', title: 'Seller', desc: 'Sell & manage inventory', icon: <Store className="w-4 h-4 text-emerald-600" /> },
    { role: 'Rider', title: 'Rider', desc: 'Dispatch & deliveries', icon: <Bike className="w-4 h-4 text-orange-600" /> },
    { role: 'Job Seeker', title: 'Job Seeker', desc: 'Find local vacancies', icon: <Briefcase className="w-4 h-4 text-purple-600" /> },
    { role: 'Employer', title: 'Employer', desc: 'Hire skilled workers', icon: <Briefcase className="w-4 h-4 text-indigo-600" /> },
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      showToast('Please fill out all registration fields including password');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    await registerWithEmail(name.trim(), email.trim(), password, accountType, phone.trim());
    setLoading(false);
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
              disabled={loading || googleLoading}
              className="w-full py-3.5 bg-[#1E40AF] hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Creating Account in Firebase...</span>
                </>
              ) : (
                <span>Register as {accountType}</span>
              )}
            </button>
          </form>

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold tracking-wider">Or register with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading || googleLoading}
            className="w-full py-2.5 px-4 border border-slate-200 hover:bg-slate-50 disabled:opacity-60 text-slate-700 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2.5 shadow-2xs"
          >
            {googleLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.25C.45 8.16 0 9.98 0 12s.45 3.84 1.25 5.43l4.03-3.14z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.57l4.03 3.14c.95-2.83 3.6-4.96 6.72-4.96z"
                  />
                </svg>
                <span>Continue with Google as {accountType}</span>
              </>
            )}
          </button>

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
