import React from 'react';
import {
  Bike,
  Power,
  TrendingUp,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  Phone,
  DollarSign,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RiderDashboardScreen: React.FC = () => {
  const {
    riderOnline,
    toggleRiderOnline,
    riderDeliveries,
    acceptDelivery,
    updateDeliveryStatus,
    navigate,
    showToast,
    currentUser,
  } = useApp();

  const availableRequests = riderDeliveries.filter((d) => d.status === 'Available');
  const activeDelivery = riderDeliveries.find((d) => d.status === 'Accepted' || d.status === 'In Transit');
  const completedToday = riderDeliveries.filter((d) => d.status === 'Delivered').length;
  const earningsToday = riderDeliveries
    .filter((d) => d.status === 'Delivered')
    .reduce((sum, d) => sum + d.deliveryFee, 0);

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Status & Online Toggle Banner */}
        <div className="bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between sm:items-center gap-6">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
              Sierra Leone Motorcycle Courier Network
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              Dispatch Rider Command
            </h1>
            <p className="text-xs text-orange-100">
              Courier: <strong className="text-white">{currentUser?.name || 'Authorized Courier'}</strong> • Vehicle: <strong className="text-white">{currentUser?.licensePlate || currentUser?.vehicleType || 'Motorbike'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 self-start sm:self-auto">
            <div className="text-right">
              <p className="text-xs font-bold text-white">
                {riderOnline ? 'YOU ARE ONLINE' : 'YOU ARE OFFLINE'}
              </p>
              <p className="text-[10px] text-orange-200">
                {riderOnline ? 'Ready to receive nearby order calls' : 'Tap switch to start earning'}
              </p>
            </div>
            <button
              onClick={toggleRiderOnline}
              className={`p-3 rounded-xl transition-all shadow-md ${
                riderOnline ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-800 text-slate-300'
              }`}
              title="Toggle Duty Status"
            >
              <Power className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Today's Earnings</span>
            <p className="text-2xl font-black text-slate-900 mt-1">Le {earningsToday}</p>
            <span className="text-[11px] font-semibold text-emerald-600">+ Le 20 customer tips</span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Active Delivery</span>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {activeDelivery ? '1 Ongoing' : 'None'}
            </p>
            <span className="text-[11px] font-semibold text-orange-600">
              {activeDelivery ? activeDelivery.id : 'Waiting for dispatch'}
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Completed Trips</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{completedToday}</p>
            <span className="text-[11px] font-semibold text-slate-400">100% on-time rate</span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Available Dispatches</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{availableRequests.length}</p>
            <span className="text-[11px] font-semibold text-blue-600">Ready to accept</span>
          </div>
        </div>

        {/* ACTIVE TRIP CALLOUT (IF IN PROGRESS) */}
        {activeDelivery && (
          <div className="bg-white rounded-3xl p-6 border-2 border-orange-400 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <Bike className="w-4 h-4 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Current Ongoing Delivery #{activeDelivery.id}</h3>
                  <span className="text-xs text-orange-600 font-bold">{activeDelivery.status}</span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/rider/deliveries/${activeDelivery.id}`)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold"
              >
                Open Navigation View
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Pickup Location (Merchant)</span>
                <p className="font-bold text-slate-800">{activeDelivery.pickupLocation}</p>
                <p className="text-slate-500">{activeDelivery.sellerName} ({activeDelivery.sellerPhone})</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Dropoff Destination (Customer)</span>
                <p className="font-bold text-slate-800">{activeDelivery.deliveryLocation}</p>
                <p className="text-slate-500">{activeDelivery.customerName} ({activeDelivery.customerPhone})</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-slate-700">Trip Fare: <strong className="text-[#1E40AF] text-sm">Le {activeDelivery.deliveryFee}</strong></span>
              {activeDelivery.status === 'Accepted' ? (
                <button
                  onClick={() => updateDeliveryStatus(activeDelivery.id, 'In Transit')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                >
                  Confirm Package Pickup & Start Transit
                </button>
              ) : (
                <button
                  onClick={() => updateDeliveryStatus(activeDelivery.id, 'Delivered', '/assets/images/smartwatch.jpg')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  Mark Delivered (Proof Verified)
                </button>
              )}
            </div>
          </div>
        )}

        {/* AVAILABLE DELIVERY REQUESTS IN AREA */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Available Delivery Requests ({availableRequests.length})</h2>
            <button
              onClick={() => navigate('/rider/deliveries')}
              className="text-xs font-bold text-[#1E40AF] hover:underline"
            >
              View Full List
            </button>
          </div>

          <div className="space-y-3">
            {availableRequests.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No new delivery requests right now in your sector.</p>
            ) : (
              availableRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-slate-900">{req.id}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        Fare: Le {req.deliveryFee}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">{req.packageDetails}</p>
                    <p className="text-[11px] text-slate-500">
                      From: {req.pickupLocation} → To: {req.deliveryLocation}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/rider/deliveries/${req.id}`)}
                      className="px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100"
                    >
                      Inspect Route
                    </button>
                    <button
                      disabled={!riderOnline}
                      onClick={() => acceptDelivery(req.id)}
                      className="px-5 py-2 bg-[#1E40AF] hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-xs"
                    >
                      Accept Delivery
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Links to Earnings */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate('/rider/earnings')}
            className="text-xs font-bold text-[#1E40AF] hover:underline flex items-center gap-1"
          >
            <span>View Rider Payout History & Momo Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
