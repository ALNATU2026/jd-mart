import React, { useState, useRef, useEffect } from 'react';
import {
  Store as StoreIcon,
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  FileText,
  MapPin,
  Phone,
  DollarSign,
  ChevronRight,
  Building,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SellerOnboardingScreen: React.FC = () => {
  const {
    currentUser,
    currentStore,
    applyToBecomeSeller,
    uploadFile,
    navigate,
    showToast,
    switchRole,
  } = useApp();

  const docInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [businessName, setBusinessName] = useState(currentStore?.name || '');
  const [category, setCategory] = useState(currentStore?.category || 'Electronics');
  const [description, setDescription] = useState(currentStore?.description || '');
  const [phone, setPhone] = useState(currentStore?.phone || currentUser?.phone || '');
  const [address, setAddress] = useState(currentStore?.location || currentUser?.address || '');
  const [businessInfo, setBusinessInfo] = useState(currentStore?.businessInfo || '');
  const [payoutMethod, setPayoutMethod] = useState<'Orange Money' | 'Afrimoney' | 'Bank Transfer'>('Orange Money');
  const [payoutNumber, setPayoutNumber] = useState(
    currentStore?.bankDetails?.momoNumber || currentStore?.bankDetails?.accountNumber || currentUser?.phone || ''
  );
  const [payoutAccountName, setPayoutAccountName] = useState(
    currentStore?.bankDetails?.accountName || currentUser?.name || ''
  );

  // Media state
  const [logoUrl, setLogoUrl] = useState(currentStore?.logo || '/assets/icons/store.png');
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [docUrl, setDocUrl] = useState(currentStore?.documentUrl || '');
  const [docUploaded, setDocUploaded] = useState(!!currentStore?.documentUrl);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (currentStore) {
      setBusinessName(currentStore.name || '');
      setCategory(currentStore.category || 'Electronics');
      setDescription(currentStore.description || '');
      setPhone(currentStore.phone || '');
      setAddress(currentStore.location || '');
      setBusinessInfo(currentStore.businessInfo || '');
      if (currentStore.logo) setLogoUrl(currentStore.logo);
      if (currentStore.documentUrl) {
        setDocUrl(currentStore.documentUrl);
        setDocUploaded(true);
      }
    }
  }, [currentStore]);

  // Handle Logo Upload to Firebase Cloud Storage
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingLogo(true);
      const meta = await uploadFile(file, 'product-image', currentUser?.id);
      setLogoUrl(meta.downloadURL);
      showToast('Store logo uploaded to Firebase Storage!');
    } catch {
      showToast('Failed to upload store logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  // Handle Document Upload to Firebase Cloud Storage
  const handleDocChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingDoc(true);
      const meta = await uploadFile(file, 'seller-document', currentUser?.id);
      setDocUrl(meta.downloadURL);
      setDocUploaded(true);
      showToast('Business verification document uploaded to Firebase Storage!');
    } catch {
      showToast('Document upload failed. Please try a valid PDF or image file.');
    } finally {
      setUploadingDoc(false);
    }
  };

  // Handle Submit Application
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !phone.trim() || !address.trim()) {
      showToast('Please provide store name, contact phone, and physical address');
      return;
    }

    try {
      setSubmitting(true);
      await applyToBecomeSeller({
        name: businessName.trim(),
        category,
        description: description.trim() || 'Verified merchant storefront on JD Mart.',
        phone: phone.trim(),
        location: address.trim(),
        businessInfo: businessInfo.trim(),
        logo: logoUrl,
        documentUrl: docUrl,
        bankDetails: {
          accountName: payoutAccountName.trim() || currentUser?.name || 'Store Account',
          accountNumber: payoutNumber.trim(),
          bankName: payoutMethod,
          momoNumber: payoutNumber.trim(),
        },
      });
      setIsEditing(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Application submission failed';
      showToast(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // 1. ACTIVE APPROVED SELLER VIEW
  if (currentStore && currentStore.status === 'active' && !isEditing) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl text-center space-y-6 animate-in fade-in">
          <div className="w-18 h-18 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Storefront Certified & Live
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {currentStore.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Your seller credentials have been verified by JD Mart Administration.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Category:</span>
              <strong className="text-slate-700">{currentStore.category || 'General'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Location:</span>
              <strong className="text-slate-700">{currentStore.location}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payout Phone:</span>
              <strong className="text-slate-700">{currentStore.bankDetails?.momoNumber || currentStore.phone}</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                switchRole('Seller');
                navigate('/seller');
              }}
              className="flex-1 py-3 bg-[#1E40AF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Enter Seller Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Edit Store Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. PENDING APPROVAL VIEW (ADMIN REVIEW IN PROGRESS)
  if (currentStore && currentStore.status === 'pending' && !isEditing) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-6 text-center animate-in fade-in">
          <div className="w-18 h-18 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-xs animate-pulse">
            <Clock className="w-10 h-10" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
              Pending Admin Review
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2">
              Application Under Review
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
              Your merchant application for <strong>{currentStore.name}</strong> is currently being reviewed by the JD Mart merchant compliance team in Sierra Leone.
            </p>
          </div>

          {/* Verification Step Timeline */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">1. Information Submitted</p>
                <p className="text-[11px] text-slate-500">Business credentials and MoMo payout details recorded.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 animate-spin">
                ●
              </div>
              <div>
                <p className="text-xs font-bold text-amber-800">2. Admin Verification (Active)</p>
                <p className="text-[11px] text-slate-500">
                  Checking national ID, business registration, and store address standards.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 opacity-60">
              <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">3. Storefront Unlocked</p>
                <p className="text-[11px] text-slate-500">Access full Seller Dashboard, add catalog products, and receive orders.</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl text-left text-xs text-blue-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#1E40AF]" />
              <span>Typical Review Time: 12 – 24 hours</span>
            </div>
            <p className="text-blue-700 text-[11px] leading-relaxed">
              Once certified, you will receive an in-app alert and confirmation email. You can safely continue shopping as a Buyer in the meantime.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-3 bg-[#1E40AF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
            >
              Return to Buyer Dashboard
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Update Application Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. REJECTED VIEW
  if (currentStore && currentStore.status === 'rejected' && !isEditing) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 border border-rose-200 shadow-xl space-y-6 text-center animate-in fade-in">
          <div className="w-18 h-18 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
            <AlertCircle className="w-10 h-10" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider">
              Application Needs Revisions
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2">
              Action Required for Certification
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              The compliance team reviewed your application for <strong>{currentStore.name}</strong> and requested revisions before approval.
            </p>
          </div>

          {currentStore.rejectionReason && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-left text-xs text-rose-900">
              <strong className="block mb-1 text-rose-800">Review Feedback:</strong>
              <p className="text-rose-700 leading-relaxed">{currentStore.rejectionReason}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Update & Re-Submit Application</span>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. SELLER REGISTRATION & APPLICATION FORM
  return (
    <div className="min-h-screen bg-[#F5F7FB] py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-1.5 border-b border-slate-100 pb-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1E40AF] flex items-center justify-center mx-auto mb-2 shadow-xs">
            <StoreIcon className="w-7 h-7" />
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
            Merchant Onboarding Flow
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Apply to Become a JD Mart Seller
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Open your digital storefront, upload catalog products, receive customer orders, and get paid with secure escrow in Sierra Leone.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Logo & Basic Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="relative group shrink-0">
              <img
                src={logoUrl}
                alt="Store Logo"
                className="w-18 h-18 rounded-2xl object-cover border-2 border-white shadow-md bg-white p-1"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/icons/store.png';
                }}
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-bold"
              >
                Change
              </button>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </div>
            <div className="space-y-1 text-center sm:text-left flex-1">
              <p className="text-xs font-bold text-slate-800">Store Logo & Branding</p>
              <p className="text-[11px] text-slate-500">
                Upload your official brand logo. Recommended 500x500 PNG or JPG.
              </p>
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                disabled={uploadingLogo}
                className="text-xs font-bold text-[#1E40AF] hover:underline"
              >
                {uploadingLogo ? 'Uploading logo to Storage...' : 'Browse Image File'}
              </button>
            </div>
          </div>

          {/* Store Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Business / Store Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Salone Tech Hub"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-hidden focus:border-[#1E40AF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Primary Product Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-hidden focus:border-[#1E40AF]"
              >
                <option value="Electronics">Electronics & Gadgets</option>
                <option value="Phones & Tablets">Phones & Tablets</option>
                <option value="Computers & Laptops">Computers & Accessories</option>
                <option value="Fashion & Apparel">Fashion & Clothing</option>
                <option value="Beauty & Skincare">Beauty & Cosmetics</option>
                <option value="Home & Kitchen">Home & Kitchenware</option>
                <option value="Food & Groceries">Food & Groceries</option>
                <option value="Automotive">Automotive & Spares</option>
                <option value="General Merchant">General Merchandise</option>
              </select>
            </div>
          </div>

          {/* Business Description */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Store Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell customers what products your store specializes in..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-hidden focus:border-[#1E40AF]"
            />
          </div>

          {/* Contact & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Store Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+232 77 123456"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-hidden focus:border-[#1E40AF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Store / Warehouse Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 18 Rawdon Street, Central Freetown"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-hidden focus:border-[#1E40AF]"
              />
            </div>
          </div>

          {/* Business Registration / TIN info */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Business Registration Number or TIN (Optional)
            </label>
            <input
              type="text"
              value={businessInfo}
              onChange={(e) => setBusinessInfo(e.target.value)}
              placeholder="e.g. TIN: 10023456-7 or Sole Proprietorship Reg"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-hidden focus:border-[#1E40AF]"
            />
          </div>

          {/* Document Upload */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Verification Document (National ID, Passport, or Business Reg)
            </label>
            <input
              ref={docInputRef}
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              onChange={handleDocChange}
              className="hidden"
            />
            <div
              onClick={() => docInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-[#1E40AF] rounded-2xl p-4 text-center cursor-pointer hover:bg-blue-50/40 transition-colors"
            >
              <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <p className="text-xs font-bold text-slate-800">
                {uploadingDoc
                  ? 'Uploading document to Firebase Storage...'
                  : docUploaded
                  ? '✓ Verification Document Attached'
                  : 'Click to upload National ID or Business Registration document'}
              </p>
              <span className="text-[10px] text-slate-400">PDF, JPG, PNG up to 15MB • Stored securely</span>
            </div>
          </div>

          {/* Payout Details */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
            <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" /> Merchant Payout Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Payout Method
                </label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                >
                  <option value="Orange Money">Orange Money</option>
                  <option value="Afrimoney">Afrimoney (Africell)</option>
                  <option value="Bank Transfer">Commercial Bank Account</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Mobile Money / Account Number
                </label>
                <input
                  type="text"
                  required
                  value={payoutNumber}
                  onChange={(e) => setPayoutNumber(e.target.value)}
                  placeholder="+232 76 000000"
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3.5 bg-[#1E40AF] hover:bg-blue-700 text-white font-black rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2"
            >
              {submitting ? 'Submitting Application...' : 'Submit Application for Admin Review'}
              <ArrowRight className="w-4 h-4" />
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
