import React from 'react';
import { ShieldAlert, Lock, ArrowRight, Home, UserCheck, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requiredTitle?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredTitle,
}) => {
  const { currentUser, authLoading, navigate, userRole } = useApp();

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-[#1E40AF]/20 border-t-[#1E40AF] rounded-full animate-spin mb-4" />
        <h3 className="text-sm font-bold text-slate-800">Verifying Authentication & Permissions...</h3>
        <p className="text-xs text-slate-400 mt-1">Connecting to Firebase Auth and Firestore RBAC</p>
      </div>
    );
  }

  // 1. Not Authenticated
  if (!currentUser) {
    return (
      <div className="min-h-[70vh] bg-[#F5F7FB] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs text-center space-y-5 animate-in fade-in">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#1E40AF] flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Authentication Required
            </h2>
            <p className="text-xs text-slate-500">
              {requiredTitle
                ? `You must be signed in to access ${requiredTitle}.`
                : 'Please sign in to access your personal dashboard and protected data.'}
            </p>
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-[#1E40AF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <span>Sign In to Your Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/register')}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Create a New Account
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full py-2 text-slate-400 hover:text-slate-600 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back to Marketplace</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Role Check
  if (allowedRoles && allowedRoles.length > 0) {
    const currentRoleNorm = (currentUser.role || userRole || '').toLowerCase();
    const isAllowed = allowedRoles.some((r) => r.toLowerCase() === currentRoleNorm);

    if (!isAllowed) {
      const isSellerRequired = allowedRoles.includes('seller');
      const isRiderRequired = allowedRoles.includes('dispatcher') || allowedRoles.includes('rider');
      const isEmployerRequired = allowedRoles.includes('employer');

      return (
        <div className="min-h-[70vh] bg-[#F5F7FB] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-red-200/80 shadow-xs text-center space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Role Access Restricted
              </h2>
              <p className="text-xs text-slate-500">
                This section requires <strong className="text-slate-800">{allowedRoles.join(' or ')}</strong> privileges.
              </p>
              <div className="mt-2 inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700">
                Your Current Role: <span className="text-[#1E40AF]">{currentUser.role}</span>
              </div>
            </div>

            <div className="pt-2 space-y-2.5">
              {isSellerRequired && (
                <button
                  onClick={() => navigate('/onboarding/seller')}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  Register as a Verified Merchant
                </button>
              )}

              {isRiderRequired && (
                <button
                  onClick={() => navigate('/onboarding/rider')}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  Join Rider Dispatch Fleet
                </button>
              )}

              {isEmployerRequired && (
                <button
                  onClick={() => navigate('/jobs')}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  Explore Jobs Portal
                </button>
              )}

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Go to My Account Dashboard
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full py-2 text-slate-400 hover:text-slate-600 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Marketplace</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // 3. Authorized
  return <>{children}</>;
};
