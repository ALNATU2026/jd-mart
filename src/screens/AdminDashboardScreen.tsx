import React from 'react';
import {
  Shield,
  Users,
  Package,
  Bike,
  Briefcase,
  Store,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminDashboardScreen: React.FC = () => {
  const { users, orders, stores, jobs, riderDeliveries, navigate } = useApp();

  const totalUsers = users.length + 420;
  const totalOrders = orders.length + 1840;
  const totalRevenue = 492000;
  const activeRidersCount = 48;
  const openJobsCount = jobs.length;
  const pendingSellerApprovals = stores.filter((s) => !s.verified).length + 2;
  const disputeAlerts = 1;

  const adminNav = [
    { title: 'Users Directory', icon: <Users className="w-5 h-5 text-blue-600" />, path: '/admin/users', count: `${users.length} registered` },
    { title: 'Seller Approvals', icon: <Store className="w-5 h-5 text-emerald-600" />, path: '/admin/sellers', count: `${stores.length} stores` },
    { title: 'Rider Fleet & Licenses', icon: <Bike className="w-5 h-5 text-orange-600" />, path: '/admin/riders', count: `${activeRidersCount} active` },
    { title: 'Orders & Disputes', icon: <Package className="w-5 h-5 text-purple-600" />, path: '/admin/orders', count: `${orders.length} in progress` },
    { title: 'Job Moderation', icon: <Briefcase className="w-5 h-5 text-indigo-600" />, path: '/admin/jobs', count: `${jobs.length} postings` },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Banner */}
        <div className="bg-linear-to-r from-red-900 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/60 rounded-full text-xs font-bold text-red-200">
              <Shield className="w-3.5 h-3.5" />
              <span>SUPER ADMINISTRATOR CONSOLE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">Platform Moderation & Control</h1>
            <p className="text-xs text-slate-300">
              Complete oversight of marketplace commerce, couriers, payments, and disputes.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Platform Status</span>
            <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </p>
          </div>
        </div>

        {/* Platform metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500">Total Users</span>
            <p className="text-xl font-black text-slate-900 mt-1">{totalUsers}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500">Platform Orders</span>
            <p className="text-xl font-black text-blue-600 mt-1">{totalOrders}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500">Gross Volume (GMV)</span>
            <p className="text-xl font-black text-emerald-600 mt-1">Le {totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500">Licensed Riders</span>
            <p className="text-xl font-black text-orange-600 mt-1">{activeRidersCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500">Active Jobs</span>
            <p className="text-xl font-black text-purple-600 mt-1">{openJobsCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500">Dispute Alerts</span>
            <p className="text-xl font-black text-red-600 mt-1">{disputeAlerts}</p>
          </div>
        </div>

        {/* Administrative Modules Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminNav.map((mod) => (
            <div
              key={mod.title}
              onClick={() => navigate(mod.path)}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-red-400 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-red-50 flex items-center justify-center transition-colors mb-4">
                  {mod.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-red-700 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{mod.count}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-red-600">
                <span>Manage Module</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Platform Orders Log */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Recent Platform Orders Feed</h2>
            <button
              onClick={() => navigate('/admin/orders')}
              className="text-xs font-bold text-red-600 hover:underline"
            >
              View All Orders Log
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Buyer</th>
                  <th className="p-3">Seller</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Rider</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">{o.id}</td>
                    <td className="p-3 text-slate-700">{o.buyerName}</td>
                    <td className="p-3 text-slate-700">{o.sellerName}</td>
                    <td className="p-3 font-black text-[#1E40AF]">Le {o.total}</td>
                    <td className="p-3 text-slate-500">{o.riderName || 'Unassigned'}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800">
                        {o.orderStatus}
                      </span>
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
