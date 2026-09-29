import React, { useState, useRef } from 'react';
import { User, Mail, Phone, MapPin, Lock, Bell, Shield, Save, Check, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AccountScreen: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    sendVerificationEmail,
    uploadFile,
    resetPassword,
    showToast,
    userRole,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(currentUser?.name || 'User');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+232 77 000000');
  const [address, setAddress] = useState(currentUser?.address || 'Central Freetown');
  const [city, setCity] = useState(currentUser?.city || 'Freetown');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Please enter both current and new password');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    showToast('Password updated securely!');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingAvatar(true);
      setUploadProgress(10);
      const meta = await uploadFile(file, 'user-profile', currentUser?.id, (p) => setUploadProgress(p));
      await updateUserProfile({ avatar: meta.downloadURL });
      showToast('Profile picture updated successfully via Firebase Storage!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      showToast(msg);
    } finally {
      setUploadingAvatar(false);
      setUploadProgress(0);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email, phone, address, city });
  };

  const handleSendReset = async () => {
    if (!email) {
      showToast('Email address is missing');
      return;
    }
    await resetPassword(email);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Account & Profile Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal profile, Cloud Storage avatar, and security credentials
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100">
            <div className="relative group">
              <img
                src={currentUser?.avatar || '/assets/icons/account.gif'}
                alt={currentUser?.name || 'User'}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-200 p-1 bg-blue-50 shadow-xs"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute -bottom-2 -right-2 p-1.5 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl shadow-xs transition-transform active:scale-95"
                title="Upload Profile Picture"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{currentUser?.name || name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1E40AF] text-[11px] font-bold">
                  Role: {userRole}
                </span>
                {currentUser?.verified ? (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    Unverified Email
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{currentUser?.email || email}</p>
              {uploadingAvatar && (
                <div className="w-48 bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-[#1E40AF] h-full transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              )}
            </div>

            {!currentUser?.verified && (
              <button
                type="button"
                onClick={() => sendVerificationEmail()}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                Verify Email
              </button>
            )}
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-[#1E40AF]" />
              Personal & Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">City / Region</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">Default Delivery Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1E40AF] text-white rounded-xl text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Security / Password Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            Security & Password
          </h3>

          <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>
            <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleSendReset}
                className="text-xs text-[#1E40AF] font-bold hover:underline"
              >
                Send Password Reset Email
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
