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
  Key,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DeliveryStatus } from '../types';

export const RiderDeliveryDetailScreen: React.FC<{ deliveryId: string }> = ({ deliveryId }) => {
  const {
    riderDeliveries,
    acceptRiderDelivery,
    updateRiderDeliveryStatus,
    uploadFile,
    currentUser,
    navigate,
    showToast,
  } = useApp();

  const delivery = riderDeliveries.find((d) => d.id === deliveryId) || riderDeliveries[0];

  const [photoProof, setPhotoProof] = useState<string | null>(delivery?.proofOfDeliveryPhoto || null);
  const [proofNotes, setProofNotes] = useState(delivery?.proofNotes || '');
  const [otpInput, setOtpInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [failureReason, setFailureReason] = useState('Customer unavailable at delivery address');

  if (!delivery) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] py-12 px-4 text-center">
        <p className="text-sm font-bold text-slate-700">Delivery not found.</p>
        <button
          onClick={() => navigate('/rider')}
          className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Rider Dashboard
        </button>
      </div>
    );
  }

  const handleSimulatePhoto = () => {
    setPhotoProof('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=60');
    showToast('Package handover photo captured!');
  };

  const handleAdvanceStatus = async (nextStatus: DeliveryStatus) => {
    setIsUpdating(true);
    try {
      const ok = await updateRiderDeliveryStatus(delivery.id, nextStatus, {
        otpInput: nextStatus === 'DELIVERED' ? otpInput : undefined,
        proofPhoto: photoProof || undefined,
        proofNotes: proofNotes || undefined,
      });
      if (ok && nextStatus === 'DELIVERED') {
        navigate('/rider');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmFailure = async () => {
    setIsUpdating(true);
    try {
      await updateRiderDeliveryStatus(delivery.id, 'FAILED', {
        failureReason,
      });
      setShowFailureModal(false);
      navigate('/rider');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <button
            onClick={() => navigate('/rider')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#1E40AF] hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dispatch Dashboard</span>
          </button>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Delivery Mission #{delivery.id}
              </h1>
              <p className="text-xs text-slate-500">Order Reference: {delivery.orderId}</p>
            </div>
            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-orange-100 text-orange-800 self-start sm:self-auto uppercase">
              {delivery.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* MAP ROUTE REPRESENTATION */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-600" />
              Live Route Navigation
            </h2>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              GPS Active • Courier Dispatched
            </span>
          </div>

          <div className="h-44 rounded-2xl bg-linear-to-br from-slate-100 to-amber-50 border border-slate-200 relative flex items-center justify-around p-4 overflow-hidden">
            <div className="text-center z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-900 mt-2">Pickup Point</p>
              <p className="text-[10px] text-slate-500">{delivery.sellerName}</p>
            </div>

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
            <p className="text-2xl font-black text-emerald-600">Le {delivery.deliveryFee}</p>
          </div>
        </div>

        {/* WORKFLOW CONTROLS & PROOF OF DELIVERY */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900">
            Delivery Action & Proof of Handover
          </h3>

          {/* Action based on status */}
          <div className="space-y-3">
            {delivery.status === 'Available' && (
              <button
                disabled={isUpdating}
                onClick={async () => {
                  await acceptRiderDelivery(delivery.id);
                  navigate('/rider');
                }}
                className="w-full py-4 bg-orange-600 text-white rounded-2xl text-xs font-bold hover:bg-orange-700 shadow-md flex items-center justify-center gap-2"
              >
                <Bike className="w-4 h-4" />
                <span>Accept Delivery Assignment</span>
              </button>
            )}

            {(delivery.status === 'DELIVERY_ASSIGNED' || delivery.status === 'Accepted') && (
              <button
                disabled={isUpdating}
                onClick={() => handleAdvanceStatus('GOING_TO_PICKUP')}
                className="w-full py-4 bg-orange-600 text-white rounded-2xl text-xs font-bold hover:bg-orange-700 shadow-md flex items-center justify-center gap-2"
              >
                <Bike className="w-4 h-4" />
                <span>Start Trip &rarr; Going to Merchant Store (GOING_TO_PICKUP)</span>
              </button>
            )}

            {delivery.status === 'GOING_TO_PICKUP' && (
              <button
                disabled={isUpdating}
                onClick={() => handleAdvanceStatus('ARRIVED_AT_PICKUP')}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl text-xs font-bold hover:bg-blue-700 shadow-md flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Arrived at Merchant Store (ARRIVED_AT_PICKUP)</span>
              </button>
            )}

            {delivery.status === 'ARRIVED_AT_PICKUP' && (
              <button
                disabled={isUpdating}
                onClick={() => handleAdvanceStatus('ORDER_PICKED_UP')}
                className="w-full py-4 bg-amber-600 text-white rounded-2xl text-xs font-bold hover:bg-amber-700 shadow-md flex items-center justify-center gap-2"
              >
                <Package className="w-4 h-4" />
                <span>Confirm Order Collected (ORDER_PICKED_UP)</span>
              </button>
            )}

            {(delivery.status === 'ORDER_PICKED_UP' || delivery.status === 'In Transit') && (
              <button
                disabled={isUpdating}
                onClick={() => handleAdvanceStatus('OUT_FOR_DELIVERY')}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-xs font-bold hover:bg-indigo-700 shadow-md flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>Depart Store &rarr; Out for Delivery to Customer (OUT_FOR_DELIVERY)</span>
              </button>
            )}

            {delivery.status === 'OUT_FOR_DELIVERY' && (
              <button
                disabled={isUpdating}
                onClick={() => handleAdvanceStatus('ARRIVED_AT_CUSTOMER')}
                className="w-full py-4 bg-purple-600 text-white rounded-2xl text-xs font-bold hover:bg-purple-700 shadow-md flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Arrived at Customer Destination (ARRIVED_AT_CUSTOMER)</span>
              </button>
            )}

            {delivery.status === 'ARRIVED_AT_CUSTOMER' && (
              <div className="bg-emerald-50/70 p-5 rounded-3xl border border-emerald-200 space-y-4">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Customer Handover & Proof of Delivery</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-orange-600" />
                      Customer 4-Digit Delivery Code / OTP:
                    </span>
                    <span className="text-slate-400">Ask buyer</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder={delivery.deliveryOtp ? `e.g. ${delivery.deliveryOtp}` : 'e.g. 1234'}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-black text-center tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2 text-xs">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-purple-600" />
                    <span>Package Handover Photo:</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSimulatePhoto}
                      className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 flex items-center gap-1.5"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Take / Upload Photo</span>
                    </button>
                    {photoProof && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl">
                        Photo Attached
                      </span>
                    )}
                  </div>
                </div>

                <button
                  disabled={isUpdating}
                  onClick={() => handleAdvanceStatus('DELIVERED')}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Verify OTP & Complete Delivery (DELIVERED)</span>
                </button>
              </div>
            )}

            {delivery.status === 'DELIVERED' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Delivery Mission Complete! Delivery fee credited to your available balance.</span>
              </div>
            )}

            {/* Failure trigger */}
            {!['DELIVERED', 'FAILED', 'CANCELLED'].includes(delivery.status) && (
              <div className="pt-2 text-right">
                <button
                  onClick={() => setShowFailureModal(true)}
                  className="text-xs text-red-600 hover:underline font-bold flex items-center gap-1 ml-auto"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Report Problem / Delivery Failure</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MODAL: REPORT FAILURE */}
        {showFailureModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 animate-in fade-in">
              <h3 className="text-base font-black text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Report Delivery Failure
              </h3>
              <p className="text-xs text-slate-500">
                Please select the reason why this package could not be delivered to the buyer.
              </p>

              <div className="space-y-2 text-xs">
                <label className="font-bold text-slate-700">Reason:</label>
                <select
                  value={failureReason}
                  onChange={(e) => setFailureReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                >
                  <option value="Customer unavailable at delivery address">Customer unavailable at delivery address</option>
                  <option value="Customer refused package">Customer refused package</option>
                  <option value="Address incorrect / unreachable">Address incorrect / unreachable</option>
                  <option value="Severe road blockage / flooding">Severe road blockage / flooding</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  onClick={() => setShowFailureModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmFailure}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Confirm Failure
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
