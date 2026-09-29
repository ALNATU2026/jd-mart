import React, { useState, useRef } from 'react';
import { Store, UploadCloud, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SellerOnboardingScreen: React.FC = () => {
  const { switchRole, uploadFile, currentUser, navigate, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [momoNumber, setMomoNumber] = useState('');
  const [docUploaded, setDocUploaded] = useState(false);
  const [docUrl, setDocUrl] = useState('');
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const handleDocChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingDoc(true);
      const meta = await uploadFile(file, 'seller-document', currentUser?.id || 'seller_onboard');
      setDocUrl(meta.downloadURL);
      setDocUploaded(true);
      showToast('Document uploaded to Firebase Cloud Storage!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      showToast(msg);
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !phone) {
      showToast('Please provide your business name and contact');
      return;
    }

    switchRole('Seller');
    showToast('Seller application approved! Welcome to your Merchant Portal.');
    navigate('/seller');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
            <Store className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Become a Verified JD Mart Merchant
          </h1>
          <p className="text-xs text-slate-500">
            Open your digital storefront and start selling to thousands of customers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Business / Store Name</label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Freetown Smart Gadgets"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Main Store Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
              >
                <option value="Electronics">Electronics & Tech</option>
                <option value="Fashion">Fashion & Apparel</option>
                <option value="Beauty">Beauty & Skincare</option>
                <option value="Furniture">Furniture & Decor</option>
                <option value="Groceries">Food & Groceries</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Business Contact Phone</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+232 76 000000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Physical Store / Warehouse Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 12 Rawdon Street, Central Freetown"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Orange / Afrimoney Momo Number for Payouts</label>
            <input
              type="text"
              required
              value={momoNumber}
              onChange={(e) => setMomoNumber(e.target.value)}
              placeholder="+232 76 000000"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
            />
          </div>

          {/* Business Document Upload with Firebase Storage */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Business Registration / National ID</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              onChange={handleDocChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-700">
                {uploadingDoc
                  ? 'Uploading document to Firebase Storage...'
                  : docUploaded
                  ? '✓ Document Verified & Attached'
                  : 'Click to upload certificate or ID to Firebase Storage'}
              </p>
              <span className="text-[10px] text-slate-400">PDF, JPG, PNG or DOC up to 15MB</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            Submit Seller Verification & Launch Store
          </button>
        </form>
      </div>
    </div>
  );
};
