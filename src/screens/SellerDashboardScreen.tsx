import React from 'react';
import {
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Plus,
  Store,
  Truck,
  Users,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SellerDashboardScreen: React.FC = () => {
  const { products, orders, navigate, currentUser } = useApp();

  const sellerProducts = products.filter(
    (p) => !currentUser || p.sellerId === currentUser.id || currentUser.role === 'Seller'
  );
  const sellerOrders = orders.filter(
    (o) => !currentUser || o.sellerId === currentUser.id || currentUser.role === 'Seller'
  );

  const totalSales = sellerOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = sellerOrders.filter(
    (o) => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed' || o.orderStatus === 'Processing'
  ).length;
  const completedOrders = sellerOrders.filter((o) => o.orderStatus === 'Delivered').length;
  const lowStockProducts = sellerProducts.filter((p) => p.stock < 10);

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with quick links */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              Merchant Hub • Verified Store
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Seller Control Dashboard
            </h1>
            <p className="text-xs text-slate-500">
              Manage your inventory, process orders, and dispatch packages to local riders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate('/seller/products/new')}
              className="px-4 py-2.5 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
            <button
              onClick={() => navigate('/seller/orders')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
            >
              Manage Orders ({pendingOrders})
            </button>
            <button
              onClick={() => navigate('/seller/store')}
              className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              Store Profile
            </button>
          </div>
        </div>

        {/* METRICS STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Total Revenue</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1E40AF] flex items-center justify-center font-bold">
                Le
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">Le {totalSales}</p>
            <span className="text-[11px] font-semibold text-emerald-600">↑ 18% vs last month</span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Pending Fulfillment</span>
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">{pendingOrders}</p>
            <span className="text-[11px] font-semibold text-orange-600">Requires packaging & dispatch</span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Completed Orders</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">{completedOrders}</p>
            <span className="text-[11px] font-semibold text-slate-400">100% payout released</span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Active Products</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">{sellerProducts.length}</p>
            <span className="text-[11px] font-semibold text-blue-600">In marketplace catalog</span>
          </div>
        </div>

        {/* STOCK ALERTS & SALES CHART SIMULATION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Orders Table */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Recent Customer Orders</h2>
              <button
                onClick={() => navigate('/seller/orders')}
                className="text-xs font-bold text-[#1E40AF] hover:underline flex items-center gap-1"
              >
                <span>View All Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-2">Order ID</th>
                    <th className="py-2">Customer</th>
                    <th className="py-2">Total</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sellerOrders.slice(0, 4).map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/50">
                      <td className="py-3 font-black text-slate-800">{o.id}</td>
                      <td className="py-3">
                        <p className="font-semibold text-slate-800">{o.buyerName}</p>
                        <p className="text-[10px] text-slate-400">{o.buyerCity}</p>
                      </td>
                      <td className="py-3 font-extrabold text-[#1E40AF]">Le {o.total}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800">
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => navigate('/seller/orders')}
                          className="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#1E40AF] rounded-lg font-bold transition-colors"
                        >
                          Process
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Alerts & Quick Dispatch */}
          <div className="lg:col-span-4 space-y-6">
            {/* Low Stock Alerts */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <h3>Stock Alerts</h3>
              </div>
              <p className="text-xs text-slate-500">Items below threshold quantity (10 units)</p>

              <div className="space-y-2 pt-1">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-2.5 bg-amber-50/50 rounded-xl border border-amber-100 text-xs">
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-slate-800 truncate">{p.title}</p>
                      <span className="text-[10px] text-amber-700 font-semibold">{p.stock} units remaining</span>
                    </div>
                    <button
                      onClick={() => navigate(`/seller/products/${p.id}/edit`)}
                      className="px-2.5 py-1 bg-white border border-amber-200 text-amber-800 font-bold rounded-lg text-[11px]"
                    >
                      Restock
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Portal Shortcuts */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Seller Modules</h3>
              <div className="space-y-2 text-xs">
                <button
                  onClick={() => navigate('/seller/products')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 font-semibold text-slate-700"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    Product Inventory
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => navigate('/seller/dispatch')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 font-semibold text-slate-700"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-orange-600" />
                    Dispatch & Riders
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => navigate('/seller/earnings')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 font-semibold text-slate-700"
                >
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Earnings & Payouts
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
