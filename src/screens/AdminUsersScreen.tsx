import React, { useState } from 'react';
import { ArrowLeft, Search, CheckCircle2, XCircle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminUsersScreen: React.FC = () => {
  const { users, updateUserStatus, navigate, showToast } = useApp();

  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filtered = users.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      u.phone.toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesQuery && matchesRole;
  });

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
            User Accounts & Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit user roles, enforce platform terms, suspend fraudulent accounts, or verify credentials
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by user name, email, or phone..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold"
            >
              <option value="All">All Roles</option>
              <option value="Buyer">Buyer</option>
              <option value="Seller">Seller</option>
              <option value="Rider">Rider</option>
              <option value="Job Seeker">Job Seeker</option>
              <option value="Employer">Employer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Verification</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar || '/assets/icons/account.gif'} alt={u.name} className="w-9 h-9 rounded-full object-cover bg-slate-100 border" />
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-[10px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{u.phone}</td>
                    <td className="p-3">
                      {u.verified ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Pending Review</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.status === 'active' ? (
                          <button
                            onClick={() => updateUserStatus(u.id, 'suspended')}
                            className="px-2.5 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-[11px] font-bold"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => updateUserStatus(u.id, 'active')}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[11px] font-bold"
                          >
                            Reactivate
                          </button>
                        )}
                        <button
                          onClick={() => updateUserStatus(u.id, u.status === 'suspended' ? 'suspended' : 'active', !u.verified)}
                          className="px-2.5 py-1 bg-blue-50 text-[#1E40AF] hover:bg-blue-100 rounded-lg text-[11px] font-bold"
                        >
                          {u.verified ? 'Unverify' : 'Verify'}
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
