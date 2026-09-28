import React, { useState } from 'react';
import { Package, Truck, Check, Printer, Clock, ArrowRight, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';

export const SellerOrdersScreen: React.FC = () => {
  const { orders, updateOrderStatus, assignRiderToOrder, showToast, navigate } = useApp();

  const [activeTab, setActiveTab] = useState<string>('All');

  const tabs = ['All', 'Confirmed', 'Processing', 'Ready for Pickup', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'All') return true;
    return o.orderStatus === activeTab;
  });

  const handleAdvanceStatus = (orderId: string, currentStatus: OrderStatus) => {
    if (currentStatus === 'Confirmed') {
      updateOrderStatus(orderId, 'Processing', 'Store has packaged the items');
    } else if (currentStatus === 'Processing') {
      assignRiderToOrder(orderId, 'user-rider-1', 'Samuel Bangura', '+232 79 334455');
    } else if (currentStatus === 'Ready for Pickup') {
      updateOrderStatus(orderId, 'Out for Delivery', 'Handed over to rider Samuel Bangura');
    } else if (currentStatus === 'Out for Delivery') {
      updateOrderStatus(orderId, 'Delivered', 'Customer signed delivery receipt');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Seller Order Fulfillment
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Accept incoming orders, pack parcels, assign motorbike riders, and track customer handovers
          </p>
        </div>

        {/* Tab filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-[#1E40AF] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders list */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200">
              <p className="text-sm font-bold">No orders found in {activeTab} status</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">{order.id}</span>
                    <span className="text-xs text-slate-400">• Customer: {order.buyerName}</span>
                  </div>
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800">
                    Status: {order.orderStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-7 space-y-2">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img src={it.image} alt={it.title} className="w-12 h-12 rounded-xl object-cover border" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{it.title}</p>
                          <p className="text-[11px] text-slate-500">Qty: {it.quantity} • Le {it.price}</p>
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-slate-500 pt-1">
                      Deliver to: <strong className="text-slate-700">{order.buyerAddress}, {order.buyerCity}</strong>
                    </p>
                  </div>

                  <div className="md:col-span-5 flex flex-col md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0">
                    <div>
                      <p className="text-[11px] text-slate-400">Total Order Payout</p>
                      <p className="text-xl font-black text-[#1E40AF]">Le {order.total}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => showToast(`Printing packing slip for order ${order.id}...`)}
                        className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600"
                        title="Print Packing Slip"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      {order.orderStatus === 'Confirmed' && (
                        <button
                          onClick={() => handleAdvanceStatus(order.id, order.orderStatus)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                        >
                          Pack Order
                        </button>
                      )}

                      {order.orderStatus === 'Processing' && (
                        <button
                          onClick={() => handleAdvanceStatus(order.id, order.orderStatus)}
                          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold"
                        >
                          Assign Rider
                        </button>
                      )}

                      {order.orderStatus === 'Ready for Pickup' && (
                        <button
                          onClick={() => handleAdvanceStatus(order.id, order.orderStatus)}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold"
                        >
                          Handover to Rider
                        </button>
                      )}

                      <button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
                      >
                        View Details
                      </button>
                    </div>
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
