import React from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Store, ShieldCheck, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminSellersScreen: React.FC = () => {
  const { stores, updateStore, navigate, showToast } = useApp();

  const handleApprove = (storeId: string) => {
    updateStore(storeId, { verified: true, status: 'active' });
    showToast('Seller store approved & certified with official badge!');
  };

  const handleReject = (storeId: string) => {
    updateStore(storeId, { verified: false, status: 'suspended' });
    showToast('Store approval rejected.');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
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
            Inspect merchant documents, certify storefronts, and enforce merchant standards
          </p>
        </div>

        <div className="space-y-4">
          {stores.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex items-center gap-4">
                <img src={s.logo} alt={s.name} className="w-16 h-16 rounded-2xl object-contain border p-2 bg-slate-50 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{s.name}</h3>
                    {s.verified ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified Merchant
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        Pending Verification
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{s.location} • {s.phone}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Payout: {s.bankDetails?.bankName} ({s.bankDetails?.momoNumber || s.bankDetails?.accountNumber})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast(`Viewing registration documents for ${s.name}`)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspect Docs</span>
                </button>
                {!s.verified ? (
                  <button
                    onClick={() => handleApprove(s.id)}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                  >
                    Approve Store
                  </button>
                ) : (
                  <button
                    onClick={() => handleReject(s.id)}
                    className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl text-xs font-bold"
                  >
                    Revoke Badge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
