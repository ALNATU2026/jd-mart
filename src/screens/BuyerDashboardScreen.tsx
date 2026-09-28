import React from 'react';
import {
  ShoppingBag,
  Package,
  Truck,
  Heart,
  Bell,
  ArrowRight,
  Clock,
  CheckCircle,
  Star,
  User,
  Wallet,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BuyerDashboardScreen: React.FC = () => {
  const {
    currentUser,
    orders,
    products,
    wishlist,
    notifications,
    navigate,
    addToCart,
  } = useApp();

  const buyerOrders = orders.filter((o) => o.buyerId === currentUser?.id || o.buyerId === 'user-buyer-1');
  const activeDelivery = buyerOrders.find(
    (o) => o.orderStatus === 'Out for Delivery' || o.orderStatus === 'Ready for Pickup'
  );
  const savedProducts = products.filter((p) => wishlist.includes(p.id));
  const recommendedProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome & Wallet Header */}
        <div className="bg-linear-to-r from-[#1E40AF] to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar || '/assets/icons/account.gif'}
              alt={currentUser?.name || 'Buyer'}
              className="w-16 h-16 rounded-2xl border-2 border-white/40 p-1 bg-white/10 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/icons/account.gif';
              }}
            />
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold text-amber-300">
                Buyer Activity Center
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">
                Hello, {currentUser ? currentUser.name : 'Valued Buyer'}!
              </h1>
              <p className="text-xs text-blue-200">
                Track your active shipments, orders, and saved wishlist items.
              </p>
            </div>
          </div>

          {/* Wallet Summary */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-4 min-w-[220px]">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] text-blue-200 uppercase font-bold">Escrow Wallet</p>
              <p className="text-xl font-black text-white">Le {currentUser?.walletBalance || 850}</p>
              <span className="text-[10px] text-emerald-300">● 100% Protected</span>
            </div>
          </div>
        </div>

        {/* ACTIVE LIVE DELIVERY ALERT */}
        {activeDelivery && (
          <div className="bg-amber-500 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white text-amber-600 flex items-center justify-center font-bold shrink-0 animate-pulse">
                <Truck className="w-7 h-7" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                  Active Motorbike Delivery En Route
                </span>
                <h3 className="text-lg font-black mt-1">
                  Order {activeDelivery.id} is on the way!
                </h3>
                <p className="text-xs text-amber-100">
                  Rider {activeDelivery.riderName || 'Samuel Bangura'} ({activeDelivery.riderPhone || '+232 79 334455'})
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/orders/${activeDelivery.id}`)}
              className="px-5 py-2.5 bg-white text-amber-700 hover:bg-amber-50 font-bold rounded-xl text-xs transition-colors shrink-0 shadow-xs"
            >
              Track Live Order
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Recent Orders */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#1E40AF]" />
                  <h2 className="text-base font-bold text-slate-900">Recent Orders</h2>
                </div>
                <button
                  onClick={() => navigate('/orders')}
                  className="text-xs font-bold text-[#1E40AF] hover:underline flex items-center gap-1"
                >
                  <span>View All Orders</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {buyerOrders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">{order.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {order.items.length} item(s) • Total: <strong className="text-[#1E40AF]">Le {order.total}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400">Placed on {order.createdAt}</p>
                    </div>

                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Wishlist Preview */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <h2 className="text-base font-bold text-slate-900">Saved Wishlist ({savedProducts.length})</h2>
                </div>
                <button
                  onClick={() => navigate('/wishlist')}
                  className="text-xs font-bold text-[#1E40AF] hover:underline"
                >
                  Open Wishlist
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedProducts.slice(0, 2).map((prod) => (
                  <div key={prod.id} className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-16 h-16 rounded-xl object-cover bg-white shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{prod.title}</h4>
                      <p className="text-xs font-black text-[#1E40AF] mt-1">Le {prod.price}</p>
                      <button
                        onClick={() => addToCart(prod, 1)}
                        className="mt-2 text-[11px] font-bold text-[#1E40AF] hover:underline"
                      >
                        + Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Notifications & Recommended */}
          <div className="lg:col-span-4 space-y-6">
            {/* Notifications */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                <Bell className="w-5 h-5 text-[#1E40AF]" />
                Recent Notifications
              </h2>
              <div className="space-y-3">
                {notifications.slice(0, 3).map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-slate-50 text-xs space-y-1">
                    <p className="font-bold text-slate-800">{n.title}</p>
                    <p className="text-slate-600 leading-relaxed text-[11px]">{n.message}</p>
                    <span className="text-[10px] text-slate-400 block pt-1">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Products */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">
                Recommended For You
              </h2>
              <div className="space-y-3">
                {recommendedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/product/${p.id}`)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    <img src={p.image} alt={p.title} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{p.title}</p>
                      <span className="text-xs font-black text-[#1E40AF]">Le {p.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
