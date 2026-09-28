import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Package,
  Bike,
  CheckCircle2,
  Camera,
  Navigation,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RiderDeliveryDetailScreen: React.FC<{ deliveryId: string }> = ({ deliveryId }) => {
  const { riderDeliveries, acceptDelivery, updateDeliveryStatus, navigate, showToast } = useApp();

  const delivery = riderDeliveries.find((d) => d.id === deliveryId) || riderDeliveries[0];

  const [photoProof, setPhotoProof] = useState<string | null>(delivery.proofOfDeliveryPhoto || null);
  const [notes, setNotes] = useState('');

  const handleSimulatePhoto = () => {
    setPhotoProof('/assets/images/smartwatch.jpg');
    showToast('Photo proof captured from camera simulation!');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <button
            onClick={() => navigate('/rider/deliveries')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#1E40AF] hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Deliveries</span>
          </button>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Delivery Trip #{delivery.id}
              </h1>
              <p className="text-xs text-slate-500">Order Reference: {delivery.orderId}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-orange-100 text-orange-800 self-start sm:self-auto">
              {delivery.status}
            </span>
          </div>
        </div>

        {/* MAP ROUTE SIMULATION */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-600" />
              Live Route Navigation
            </h2>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              GPS Active • 3.4 km route
            </span>
          </div>

          {/* Graphical Map Representation */}
          <div className="h-48 rounded-2xl bg-linear-to-br from-slate-100 to-blue-50 border border-slate-200 relative flex items-center justify-around p-4 overflow-hidden">
            <div className="text-center z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-900 mt-2">Pickup Point</p>
              <p className="text-[10px] text-slate-500">{delivery.sellerName}</p>
            </div>

            {/* Simulated Route Line */}
            <div className="flex-1 max-w-xs mx-4 flex items-center justify-center">
              <div className="w-full border-t-2 border-dashed border-orange-500 relative flex items-center justify-center">
                <div className="p-2 bg-orange-600 text-white rounded-full shadow-lg -mt-1 animate-pulse">
                  <Bike className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="text-center z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-900 mt-2">Destination</p>
              <p className="text-[10px] text-slate-500">{delivery.customerName}</p>
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pickup Details */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Pickup: Merchant Store
            </h3>
            <p className="text-slate-800 font-semibold">{delivery.pickupLocation}</p>
            <p className="text-slate-500">Contact: {delivery.sellerName}</p>
            <div className="pt-2">
              <a
                href={`tel:${delivery.sellerPhone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#1E40AF] rounded-xl font-bold hover:bg-blue-100"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Store ({delivery.sellerPhone})</span>
              </a>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Dropoff: Customer Address
            </h3>
            <p className="text-slate-800 font-semibold">{delivery.deliveryLocation}</p>
            <p className="text-slate-500">Customer: {delivery.customerName}</p>
            <div className="pt-2">
              <a
                href={`tel:${delivery.customerPhone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl font-bold hover:bg-emerald-100"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Customer ({delivery.customerPhone})</span>
              </a>
            </div>
          </div>
        </div>

        {/* Package & Fare Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Package Contents</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{delivery.packageDetails}</p>
            <p className="text-xs text-slate-500">Handle with care • Secure inside courier delivery box</p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-400">Guaranteed Rider Payout</span>
            <p className="text-2xl font-black text-[#1E40AF]">Le {delivery.deliveryFee}</p>
          </div>
        </div>

        {/* PHOTO PROOF & ACTION CONTROLS */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Camera className="w-4 h-4 text-purple-600" />
            Digital Proof of Delivery (Required before completing)
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleSimulatePhoto}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-200"
            >
              <Camera className="w-4 h-4" />
              <span>Capture Package Handover Photo</span>
            </button>

            {photoProof && (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4" />
                <span>Photo Proof Verified</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
            {delivery.status === 'Available' && (
              <button
                onClick={() => acceptDelivery(delivery.id)}
                className="px-6 py-3 bg-[#1E40AF] text-white rounded-xl text-xs font-bold hover:bg-blue-700"
              >
                Accept This Delivery
              </button>
            )}

            {delivery.status === 'Accepted' && (
              <button
                onClick={() => updateDeliveryStatus(delivery.id, 'In Transit')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
              >
                Confirm Pickup & Start Delivery
              </button>
            )}

            {delivery.status === 'In Transit' && (
              <button
                onClick={() => {
                  if (!photoProof) {
                    showToast('Please capture photo proof before completing handover');
                    return;
                  }
                  updateDeliveryStatus(delivery.id, 'Delivered', photoProof);
                  navigate('/rider');
                }}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-md"
              >
                Confirm Handover & Complete Delivery
              </button>
            )}

            {delivery.status === 'Delivered' && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Trip Completed Successfully!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
