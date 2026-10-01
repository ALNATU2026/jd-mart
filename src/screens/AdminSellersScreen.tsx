import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Store,
  ShieldCheck,
  FileText,
  Search,
  ExternalLink,
  MapPin,
  Phone,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminSellersScreen: React.FC = () => {
  const { stores, approveSellerStore, rejectSellerStore, navigate, showToast } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'active' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectingStoreId, setRejectingStoreId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Incomplete business documentation or invalid national ID');
  const [inspectDocStore, setInspectDocStore] = useState<any | null>(null);

  const pendingStores = stores.filter((s) => s.status === 'pending');
  const activeStores = stores.filter((s) => s.status === 'active');
  const rejectedStores = stores.filter((s) => s.status === 'rejected' || s.status === 'suspended');

  const filteredStores = stores.filter((s) => {
    if (activeFilter === 'pending' && s.status !== 'pending') return false;
    if (activeFilter === 'active' && s.status !== 'active') return false;
    if (activeFilter === 'rejected' && s.status !== 'rejected' && s.status !== 'suspended') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        (s.sellerName || '').toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.phone.includes(q)
      );
    }
    return true;
  });

  const handleApprove = async (storeId: string) => {
    await approveSellerStore(storeId);
  };

  const handleConfirmReject = async () => {
    if (!rejectingStoreId) return;
    await rejectSellerStore(rejectingStoreId, rejectionReason);
    setRejectingStoreId(null);
    setRejectionReason('Incomplete business documentation or invalid national ID');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div>
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:underline mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Admin Console</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Seller & Storefront Verification
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review seller applications, inspect business certificates, and certify merchants in Sierra Leone.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {pendingStores.length} Pending Review
            </span>
          </div>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {[
              { id: 'all', label: 'All Stores', count: stores.length },
              { id: 'pending', label: 'Pending Review', count: pendingStores.length, alert: pendingStores.length > 0 },
              { id: 'active', label: 'Certified Active', count: activeStores.length },
              { id: 'rejected', label: 'Declined / Suspended', count: rejectedStores.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeFilter === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    activeFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
                {tab.alert && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search store name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600"
            />
          </div>
        </div>

        {/* Stores List */}
        {filteredStores.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400">
            <Store className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-bold text-slate-600">No storefronts found</p>
            <p className="text-xs text-slate-400 mt-1">There are no stores under this filter</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStores.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 hover:border-slate-300 transition-all"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <img
                    src={s.logo || '/assets/icons/store.png'}
                    alt={s.name}
                    className="w-16 h-16 rounded-2xl object-cover border p-1 bg-slate-50 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/icons/store.png';
                    }}
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-black text-slate-900">{s.name}</h3>
                      {s.status === 'active' && s.verified ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Certified Merchant
                        </span>
                      ) : s.status === 'pending' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Pending Review
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> {s.status.toUpperCase()}
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {s.category || 'General'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1">
                      {s.description || 'Verified merchant storefront on JD Mart.'}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {s.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> {s.phone}
                      </span>
                      <span className="text-slate-400">
                        Payout MoMo:{' '}
                        <strong className="text-slate-700">
                          {s.bankDetails?.momoNumber || s.bankDetails?.accountNumber || s.phone}
                        </strong>
                      </span>
                    </div>

                    {s.businessInfo && (
                      <p className="text-[11px] text-blue-700 font-medium">
                        Reg/TIN: {s.businessInfo}
                      </p>
                    )}
                    {s.rejectionReason && (
                      <p className="text-[11px] text-rose-600 font-medium">
                        Decline Note: {s.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0">
                  {s.documentUrl ? (
                    <button
                      onClick={() => setInspectDocStore(s)}
                      className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#1E40AF] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Inspect Docs</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic px-2">No Doc Attached</span>
                  )}

                  {s.status === 'pending' || !s.verified ? (
                    <>
                      <button
                        onClick={() => handleApprove(s.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                      >
                        Approve & Grant Seller Role
                      </button>
                      <button
                        onClick={() => setRejectingStoreId(s.id)}
                        className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setRejectingStoreId(s.id)}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-colors"
                    >
                      Suspend Store
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Inspect Documents */}
        {inspectDocStore && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-base font-black text-slate-800">
                  Inspection: {inspectDocStore.name}
                </h3>
                <button
                  onClick={() => setInspectDocStore(null)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p>
                  <strong>Owner / Applicant:</strong> {inspectDocStore.sellerName || 'Merchant'}
                </p>
                <p>
                  <strong>Phone:</strong> {inspectDocStore.phone}
                </p>
                <p>
                  <strong>Physical Address:</strong> {inspectDocStore.location}
                </p>
                {inspectDocStore.businessInfo && (
                  <p>
                    <strong>Business Info:</strong> {inspectDocStore.businessInfo}
                  </p>
                )}

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-800 text-xs">
                      Uploaded Business / National Credential:
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Attached Document
                    </span>
                  </div>

                  {/* Inline Visual Preview for Images or Documents */}
                  {inspectDocStore.documentUrl ? (
                    <div className="space-y-2">
                      <div className="max-h-64 overflow-hidden rounded-xl border border-slate-200 bg-slate-900/5 flex items-center justify-center p-2">
                        {inspectDocStore.documentUrl.startsWith('data:image') ||
                        inspectDocStore.documentUrl.match(/\.(jpeg|jpg|png|webp|gif)($|\?)/i) ? (
                          <img
                            src={inspectDocStore.documentUrl}
                            alt="Merchant Credential"
                            className="max-h-56 max-w-full object-contain rounded-lg shadow-xs"
                          />
                        ) : inspectDocStore.documentUrl.startsWith('data:application/pdf') ||
                          inspectDocStore.documentUrl.includes('.pdf') ? (
                          <iframe
                            src={inspectDocStore.documentUrl}
                            title="Document PDF Preview"
                            className="w-full h-56 rounded-lg border-0"
                          />
                        ) : (
                          <div className="py-8 text-center space-y-2">
                            <FileText className="w-12 h-12 text-[#1E40AF] mx-auto" />
                            <p className="text-xs text-slate-600 font-semibold">
                              Official Verification Document
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <span className="text-[11px] text-slate-500 truncate max-w-xs font-mono">
                          {inspectDocStore.documentUrl.substring(0, 45)}...
                        </span>
                        <a
                          href={inspectDocStore.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#1E40AF] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 hover:bg-blue-700 transition-colors shadow-2xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Full Size</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No document attached.</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t">
                <span className="text-[11px] text-slate-500 font-medium">
                  Review document validity before approving.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      handleApprove(inspectDocStore.id);
                      setInspectDocStore(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify & Approve Store</span>
                  </button>
                  <button
                    onClick={() => setInspectDocStore(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Reject Store Application */}
        {rejectingStoreId && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="text-base font-black text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" /> Decline Seller Application
              </h3>
              <p className="text-xs text-slate-500">
                Provide a reason for the applicant so they can fix their credentials and re-submit:
              </p>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-rose-600"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setRejectingStoreId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
                >
                  Confirm Decline
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
