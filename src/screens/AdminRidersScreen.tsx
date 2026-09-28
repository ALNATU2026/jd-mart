import React from 'react';
import { ArrowLeft, Bike, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminRidersScreen: React.FC = () => {
  const { navigate, showToast } = useApp();

  const riders = [
    { id: 'RDR-01', name: 'Samuel Bangura', phone: '+232 79 334455', vehicle: 'Motorbike (SL-AB 2049)', license: 'Class A Commercial #SL-99482', verified: true, trips: 142, rating: 4.9 },
    { id: 'RDR-02', name: 'Alpha Bah', phone: '+232 77 119922', vehicle: 'Motorbike (SL-CD 1032)', license: 'Class A Commercial #SL-88392', verified: true, trips: 89, rating: 4.8 },
    { id: 'RDR-03', name: 'Alhaji Kamara', phone: '+232 30 442211', vehicle: 'Scooter (SL-EF 4021)', license: 'Pending verification submission', verified: false, trips: 0, rating: 5.0 },
  ];

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
            Dispatch Rider Fleet & Licensing
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Validate motorbike driver licenses, manage active couriers, and ensure road safety compliance
          </p>
        </div>

        <div className="space-y-4">
          {riders.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold shrink-0">
                  <Bike className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{r.name}</h3>
                    {r.verified ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Licensed Rider
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        License Pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{r.vehicle} • Phone: {r.phone}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">License: {r.license}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900">{r.trips} Trips</span>
                  <p className="text-[11px] text-amber-500 font-bold">★ {r.rating} Rating</p>
                </div>

                <button
                  onClick={() => showToast(`License verification updated for ${r.name}`)}
                  className="px-4 py-2 bg-[#1E40AF] text-white rounded-xl text-xs font-bold hover:bg-blue-700"
                >
                  {r.verified ? 'Review License' : 'Approve Rider'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
