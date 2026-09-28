import React from 'react';
import { CheckCircle2, ArrowRight, Truck, Package, MapPin, Store } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OrderSuccessScreen: React.FC<{ orderId: string }> = ({ orderId }) => {
  const { orders, navigate } = useApp();

  const order = orders.find((o) => o.id === orderId) || orders[0];

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-6 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
            Payment Verified & Dispatched
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            Order Confirmed!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Order Reference: <strong className="text-slate-800">{order.id}</strong>
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500">Order Status:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
              {order.orderStatus}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Merchant Store:</span>
            <span className="font-bold text-slate-900">{order.sellerName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Delivery Address:</span>
            <span className="font-semibold text-slate-800 text-right truncate max-w-xs">
              {order.buyerAddress}, {order.buyerCity}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Estimated Delivery:</span>
            <span className="font-bold text-orange-600">{order.estimatedDelivery}</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-200 font-extrabold text-sm">
            <span>Total Paid:</span>
            <span className="text-[#1E40AF]">Le {order.total}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => navigate(`/orders/${order.id}`)}
            className="py-3 px-4 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Track Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/shop')}
            className="py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
