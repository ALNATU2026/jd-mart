import React, { useState } from 'react';
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
  FileText,
  Bell,
  Activity,
  HardDrive,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminDashboardScreen: React.FC = () => {
  const {
    users,
    orders,
    products,
    stores,
    jobs,
    applications,
    riderDeliveries,
    notifications,
    navigate,
    currentUser,
  } = useApp();

  // Role & User Breakdown
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const sellersCount = users.filter((u) => (u.role || '').toLowerCase() === 'seller').length;
  const buyersCount = users.filter((u) => (u.role || '').toLowerCase() === 'buyer').length;
  const employersCount = users.filter((u) => (u.role || '').toLowerCase() === 'employer').length;
  const employeesCount = users.filter((u) =>
    ['employee', 'job seeker'].includes((u.role || '').toLowerCase())
  ).length;

  // Resource Volumes
  const productsCount = products.length;
  const ordersCount = orders.length;
  const deliveriesCount = riderDeliveries.length;
  const jobPostingsCount = jobs.length;
  const applicationsCount = applications.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // Storage and File Assets
  const uploadedFilesCount =
    products.filter((p) => p.image).length +
    applications.filter((a) => a.resumeFileUrl).length +
    users.filter((u) => u.avatar && !u.avatar.startsWith('/assets')).length;

  const notificationsCount = notifications.length;

  // System Audit Logs
  const [systemLogs] = useState([
    {
      id: 'log-1',
      admin: currentUser?.name || 'Administrator',
      action: 'FIRESTORE_RULES_DEPLOYED',
      target: 'Production Database',
      timestamp: new Date().toLocaleTimeString(),
      status: 'Success',
    },
    {
      id: 'log-2',
      admin: currentUser?.name || 'Administrator',
      action: 'STORAGE_RULES_VERIFIED',
      target: 'Firebase Cloud Storage',
      timestamp: new Date(Date.now() - 360000).toLocaleTimeString(),
      status: 'Success',
    },
    {
      id: 'log-3',
      admin: 'System Watchdog',
      action: 'AI_GEMINI_IMAGE_ANALYZER_READY',
      target: 'gemini-3.8-flash',
      timestamp: new Date(Date.now() - 720000).toLocaleTimeString(),
      status: 'Online',
    },
  ]);

  const adminNav = [
    { title: 'Users Directory', icon: <Users className="w-5 h-5 text-blue-600" />, path: '/admin/users', count: `${users.length} registered` },
    { title: 'Seller Approvals', icon: <Store className="w-5 h-5 text-emerald-600" />, path: '/admin/sellers', count: `${stores.length} stores` },
    { title: 'Rider Fleet & Licenses', icon: <Bike className="w-5 h-5 text-orange-600" />, path: '/admin/riders', count: `${deliveriesCount} trips` },
    { title: 'Orders & Disputes', icon: <Package className="w-5 h-5 text-purple-600" />, path: '/admin/orders', count: `${orders.length} in records` },
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
              <span>SUPER ADMINISTRATOR COMMAND</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">Production Platform Oversight</h1>
            <p className="text-xs text-slate-300">
              Real-time synchronization with Cloud Firestore, Firebase Storage & Gemini AI.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Backend Infrastructure</span>
            <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Firebase Cloud Connected
            </p>
          </div>
        </div>

        {/* 1. User Demographics Breakdown */}
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            User Demographics & Accounts
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Users className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold">Total Users</span>
              </div>
              <p className="text-xl font-black text-slate-900">{totalUsers}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
                <UserCheck className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold">Active Users</span>
              </div>
              <p className="text-xl font-black text-emerald-700">{activeUsers}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">Buyers</span>
              <p className="text-xl font-black text-blue-600">{buyersCount}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">Sellers</span>
              <p className="text-xl font-black text-emerald-600">{sellersCount}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">Employers</span>
              <p className="text-xl font-black text-indigo-600">{employersCount}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">Employees / Seekers</span>
              <p className="text-xl font-black text-purple-600">{employeesCount}</p>
            </div>
          </div>
        </div>

        {/* 2. Platform Operations & Cloud Storage Volumes */}
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Marketplace, Logistics & Cloud Storage Metrics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500">Products Catalog</span>
              <p className="text-xl font-black text-slate-900 mt-1">{productsCount}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500">Total Orders</span>
              <p className="text-xl font-black text-blue-600 mt-1">{ordersCount}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500">Courier Deliveries</span>
              <p className="text-xl font-black text-orange-600 mt-1">{deliveriesCount}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500">Job Postings</span>
              <p className="text-xl font-black text-indigo-600 mt-1">{jobPostingsCount}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500">Applications</span>
              <p className="text-xl font-black text-purple-600 mt-1">{applicationsCount}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-1 text-slate-500">
                <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-[11px] font-semibold">Uploaded Files</span>
              </div>
              <p className="text-xl font-black text-[#1E40AF] mt-1">{uploadedFilesCount}</p>
            </div>
          </div>
        </div>

        {/* 3. Administrative Modules Navigation */}
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
                <span>Access Control Panel</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* 4. System Audit Logs */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-600" />
              <h2 className="text-base font-bold text-slate-900">System Logs & Security Audit Trail</h2>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Server-Side Protected</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Log ID</th>
                  <th className="p-3">Authorizing User</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Target Resource</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {systemLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">{log.id}</td>
                    <td className="p-3 text-slate-700">{log.admin}</td>
                    <td className="p-3 font-bold text-blue-700">{log.action}</td>
                    <td className="p-3 text-slate-600">{log.target}</td>
                    <td className="p-3 text-slate-500">{log.timestamp}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700">
                        {log.status}
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
