import React, { useState } from 'react';
import {
  ArrowLeft,
  Truck,
  Phone,
  MessageCircle,
  Store,
  MapPin,
  CheckCircle2,
  Clock,
  Star,
  AlertTriangle,
  XCircle,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OrderDetailScreen: React.FC<{ orderId: string }> = ({ orderId }) => {
  const { orders, updateOrderStatus, rateOrder, cancelOrder, navigate, showToast } = useApp();

  const order = orders.find((o) => o.id === orderId) || orders[0];

  const [selectedRating, setSelectedRating] = useState<number>(order.rating || 5);
  const [rated, setRated] = useState<boolean>(!!order.rating);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [issueText, setIssueText] = useState('');

  const canCancel = order.orderStatus === 'Pending' || order.orderStatus === 'Confirmed';

  const handleRateSubmit = () => {
    rateOrder(order.id, selectedRating);
    setRated(true);
  };

  const handleConfirmCancel = () => {
    if (!cancelReason.trim()) return;
    cancelOrder(order.id, cancelReason);
    setCancelModalOpen(false);
    showToast('Order has been cancelled.');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#1E40AF] hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Order #{order.id}
              </h1>
              <p className="text-xs text-slate-500">Placed on {order.createdAt}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 self-start sm:self-auto">
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* ORDER PROGRESS TIMELINE */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1E40AF]" />
            Order Fulfillment Timeline
          </h2>

          <div className="space-y-4 pt-2">
            {order.timeline.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1E40AF] flex items-center justify-center shrink-0 mt-0.5 border border-blue-200">
                  <CheckCircle2 className="w-4 h-4 text-[#1E40AF]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800">{step.status}</h4>
                    <span className="text-[11px] text-slate-400">{step.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Products & Seller */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">Products & Merchant</h2>

            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-3 text-xs">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover border shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{item.title}</p>
                    <p className="text-slate-500">Qty: {item.quantity}</p>
                    <p className="font-black text-[#1E40AF]">Le {item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">{order.sellerName}</p>
                <p className="text-[11px] text-slate-500">Official Merchant Partner</p>
              </div>
              <button
                onClick={() => showToast('Opening direct messaging with seller...')}
                className="px-3 py-1.5 bg-blue-50 text-[#1E40AF] rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Contact Seller</span>
              </button>
            </div>
          </div>

          {/* Delivery & Dispatch Rider */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-orange-500" />
              Delivery & Dispatch Rider
            </h2>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Delivery Address:</span>
                <span className="font-bold text-slate-800 text-right">{order.buyerAddress}, {order.buyerCity}</span>
              </div>
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="font-bold text-slate-800">{order.deliveryMethod} Delivery</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Time:</span>
                <span className="font-bold text-orange-600">{order.estimatedDelivery}</span>
              </div>
            </div>

            {order.riderName ? (
              <div className="p-3.5 bg-orange-50/60 rounded-2xl border border-orange-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-orange-950">Rider: {order.riderName}</p>
                    <p className="text-[11px] text-orange-800">Motorbike Express Courier</p>
                  </div>
                  <a
                    href={`tel:${order.riderPhone}`}
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Rider</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-2xl text-xs text-slate-500">
                Dispatch rider being allocated from central hub...
              </div>
            )}
          </div>
        </div>

        {/* Rate Order Section (if delivered) */}
        {order.orderStatus === 'Delivered' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-slate-900">Rate this Order Experience</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    disabled={rated}
                    onClick={() => setSelectedRating(s)}
                    className="p-1 text-amber-400"
                  >
                    <Star
                      className={`w-6 h-6 ${s <= selectedRating ? 'fill-amber-400' : 'text-slate-300'}`}
                    />
                  </button>
                ))}
              </div>
              {!rated ? (
                <button
                  onClick={handleRateSubmit}
                  className="px-4 py-1.5 bg-[#1E40AF] text-white rounded-xl text-xs font-bold"
                >
                  Submit Rating
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-600">Rated {selectedRating} stars!</span>
              )}
            </div>
          </div>
        )}

        {/* Bottom Actions: Cancel or Report Issue */}
        <div className="flex items-center justify-between pt-2">
          {canCancel ? (
            <button
              onClick={() => setCancelModalOpen(true)}
              className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
            >
              <XCircle className="w-4 h-4" />
              <span>Cancel Order</span>
            </button>
          ) : (
            <span className="text-xs text-slate-400">Order cannot be cancelled once in transit.</span>
          )}

          <button
            onClick={() => setIssueModalOpen(true)}
            className="text-xs font-bold text-slate-600 hover:text-red-600 flex items-center gap-1"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Report Dispute / Issue</span>
          </button>
        </div>

        {/* Cancel Modal */}
        {cancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-slate-900">Cancel Order #{order.id}</h3>
              <p className="text-xs text-slate-500">
                Please tell us why you wish to cancel this order:
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Changed my mind, ordered by mistake..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setCancelModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Close
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Report Issue Modal */}
        {issueModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-slate-900">Report Order Issue</h3>
              <p className="text-xs text-slate-500">
                JD Mart Escrow Team will investigate immediately.
              </p>
              <textarea
                value={issueText}
                onChange={(e) => setIssueText(e.target.value)}
                placeholder="Describe what went wrong (e.g., damaged item, wrong product, delivery delay)..."
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIssueModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIssueModalOpen(false);
                    showToast('Dispute report logged. Escrow moderator assigned.');
                  }}
                  className="px-4 py-2 bg-[#1E40AF] text-white rounded-xl text-xs font-bold"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
