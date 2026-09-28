import React from 'react';
import { ArrowLeft, Package, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';

export const AdminOrdersScreen: React.FC = () => {
  const { orders, updateOrderStatus, navigate, showToast } = useApp();

  const handleForceStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status, `Admin override: Status changed to ${status}`);
    showToast(`Order ${orderId} forced to ${status}`);
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
            Orders Supervision & Escrow Disputes
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervise all marketplace transactions, resolve customer escrow disputes, or override fulfillment
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Buyer</th>
                  <th className="p-3">Seller</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Rider</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3 text-right">Escrow Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-black text-slate-900">{o.id}</td>
                    <td className="p-3 text-slate-800">{o.buyerName}</td>
                    <td className="p-3 text-slate-800">{o.sellerName}</td>
                    <td className="p-3 font-extrabold text-[#1E40AF]">Le {o.total}</td>
                    <td className="p-3 text-slate-500">{o.riderName || 'None'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800">
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleForceStatus(o.id, 'Delivered')}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[11px] font-bold"
                        >
                          Force Delivered
                        </button>
                        <button
                          onClick={() => handleForceStatus(o.id, 'Refunded')}
                          className="px-2.5 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-[11px] font-bold"
                        >
                          Refund Buyer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
