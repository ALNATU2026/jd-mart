import React, { useState } from 'react';
import { Package, Truck, Clock, CheckCircle2, XCircle, ArrowRight, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';

export const OrdersScreen: React.FC = () => {
  const { orders, currentUser, navigate } = useApp();

  const [activeTab, setActiveTab] = useState<string>('All');

  const tabs = [
    'All',
    'Pending',
    'Processing',
    'Ready for Pickup',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
    'Refunded',
  ];

  const userOrders = orders.filter((o) => {
    if (activeTab === 'All') return true;
    return o.orderStatus === activeTab;
  });

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800';
      case 'Out for Delivery':
        return 'bg-orange-100 text-orange-800';
      case 'Ready for Pickup':
        return 'bg-purple-100 text-purple-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
      case 'Refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <button onClick={() => navigate('/')} className="hover:text-[#1E40AF]">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-semibold">My Orders</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Order History & Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your purchases, inspect live courier delivery status, and rate completed orders
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
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

        {/* Orders List */}
        <div className="space-y-4">
          {userOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
              <Package className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-800">No orders found</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">You have no {activeTab} orders at this moment.</p>
              <button
                onClick={() => navigate('/shop')}
                className="px-5 py-2 bg-[#1E40AF] text-white rounded-xl text-xs font-bold"
              >
                Browse Shop
              </button>
            </div>
          ) : (
            userOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-slate-900">{order.id}</span>
                    <span className="text-xs text-slate-400">• {order.createdAt}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-8 space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-14 h-14 rounded-xl object-cover bg-slate-50 border shrink-0"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{item.title}</p>
                          <p className="text-[11px] text-slate-500">
                            Seller: {item.sellerName} • Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="md:col-span-4 flex flex-col md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0">
                    <div>
                      <p className="text-[11px] text-slate-400">Total Amount</p>
                      <p className="text-lg font-black text-[#1E40AF]">Le {order.total}</p>
                    </div>

                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="px-4 py-2 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <span>Track Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
