import React, { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ForgotPasswordScreen: React.FC = () => {
  const { navigate, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    showToast('Reset instructions sent to your email.');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#1E40AF] hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </button>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Forgot Password</h1>
          <p className="text-xs text-slate-500 mt-1">
            Enter your registered email address to receive reset instructions
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Check Your Inbox</h3>
            <p className="text-xs text-slate-500">
              We have dispatched a reset link to <strong>{email}</strong>.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 px-6 py-2 bg-[#1E40AF] text-white rounded-xl text-xs font-bold"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@jdmart.sl"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#1E40AF] text-white font-bold rounded-xl text-xs hover:bg-blue-700"
            >
              Send Password Reset Code
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
