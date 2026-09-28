import React from 'react';
import { Truck, Bike, MapPin, Phone, CheckCircle2, Clock, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SellerDispatchScreen: React.FC = () => {
  const { riderDeliveries, acceptDelivery, showToast } = useApp();

  const availableRiders = [
    { name: 'Samuel Bangura', phone: '+232 79 334455', vehicle: 'Motorbike (TVS Apache)', location: 'Siaka Stevens St (2 mins away)', rating: 4.9, active: true },
    { name: 'Alpha Bah', phone: '+232 77 119922', vehicle: 'Motorbike (Bajaj Boxer)', location: 'Congo Cross (8 mins away)', rating: 4.8, active: true },
    { name: 'Joseph Conteh', phone: '+232 88 554433', vehicle: 'Express Scooter', location: 'Lumley Junction (15 mins away)', rating: 4.7, active: true },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dispatch & Rider Logistics Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Allocate parcels to nearby licensed dispatch couriers, track transit routes, and verify delivery signatures
          </p>
        </div>

        {/* Nearby Available Riders */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Bike className="w-5 h-5 text-orange-500" />
              <h2 className="text-base font-bold text-slate-900">Nearby Available Couriers</h2>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              ● {availableRiders.length} Online in Zone
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableRiders.map((r, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{r.name}</span>
                  <span className="text-xs text-amber-500 font-bold">★ {r.rating}</span>
                </div>
                <div className="text-[11px] text-slate-500 space-y-1">
                  <p className="flex items-center gap-1">
                    <Bike className="w-3.5 h-3.5 text-slate-400" />
                    <span>{r.vehicle}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{r.location}</span>
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <a
                    href={`tel:${r.phone}`}
                    className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                  <button
                    onClick={() => showToast(`Dispatched pickup alert to ${r.name}`)}
                    className="px-3 py-1.5 bg-[#1E40AF] text-white rounded-lg text-xs font-bold hover:bg-blue-700"
                  >
                    Request Pickup
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Delivery Status List */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Truck className="w-5 h-5 text-[#1E40AF]" />
            <h2 className="text-base font-bold text-slate-900">Active Deliveries ({riderDeliveries.length})</h2>
          </div>

          <div className="space-y-4">
            {riderDeliveries.map((del) => (
              <div
                key={del.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">{del.id}</span>
                    <span className="text-xs text-slate-400">• Order: {del.orderId}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                      {del.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1 font-semibold">{del.packageDetails}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Pickup: {del.pickupLocation} → Destination: {del.deliveryLocation}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500">Delivery Fee:</span>
                  <p className="text-base font-black text-[#1E40AF]">Le {del.deliveryFee}</p>
                  <span className="text-[10px] text-slate-400">Recipient: {del.customerName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
