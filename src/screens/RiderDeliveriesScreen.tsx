import React, { useState } from 'react';
import { Bike, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RiderDeliveriesScreen: React.FC = () => {
  const { riderDeliveries, acceptDelivery, navigate } = useApp();

  const [filter, setFilter] = useState<'All' | 'Available' | 'Accepted' | 'In Transit' | 'Delivered'>('All');

  const filtered = riderDeliveries.filter((d) => (filter === 'All' ? true : d.status === filter));

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <button
            onClick={() => navigate('/rider')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#1E40AF] hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Rider Dashboard</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Deliveries Board
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Accept pending delivery calls, manage pickups, and update drop-off statuses
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          {(['All', 'Available', 'Accepted', 'In Transit', 'Delivered'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                filter === st ? 'bg-[#1E40AF] text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Deliveries List */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200">
              <p className="text-sm font-bold">No deliveries in {filter} status</p>
            </div>
          ) : (
            filtered.map((del) => (
              <div
                key={del.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3"
              >
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">{del.id}</span>
                    <span className="text-xs text-slate-400">• Order: {del.orderId}</span>
                  </div>
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800">
                    {del.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-400 uppercase text-[10px]">Pickup Point</span>
                    <p className="font-semibold text-slate-800">{del.pickupLocation}</p>
                    <p className="text-slate-500">{del.sellerName}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 uppercase text-[10px]">Dropoff Destination</span>
                    <p className="font-semibold text-slate-800">{del.deliveryLocation}</p>
                    <p className="text-slate-500">{del.customerName}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-sm font-black text-[#1E40AF]">Fare: Le {del.deliveryFee}</span>
                  <div className="flex items-center gap-2">
                    {del.status === 'Available' && (
                      <button
                        onClick={() => acceptDelivery(del.id)}
                        className="px-4 py-2 bg-[#1E40AF] text-white text-xs font-bold rounded-xl"
                      >
                        Accept
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/rider/deliveries/${del.id}`)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
                    >
                      Trip Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
