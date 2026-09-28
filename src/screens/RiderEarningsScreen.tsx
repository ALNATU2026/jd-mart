import React, { useState } from 'react';
import { Wallet, ArrowLeft, ArrowDownRight, Phone, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RiderEarningsScreen: React.FC = () => {
  const { navigate, showToast } = useApp();

  const [availableBalance, setAvailableBalance] = useState(620);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [amount, setAmount] = useState('');

  const payouts = [
    { id: 'PAY-1102', date: '2026-09-28', description: 'Daily delivery batch (4 trips)', amount: '+Le 100', tips: '+Le 15' },
    { id: 'PAY-1094', date: '2026-09-27', description: 'Orange Money Cashout to +232 79 334455', amount: '-Le 400', tips: '-' },
    { id: 'PAY-1081', date: '2026-09-26', description: 'Express delivery bonuses', amount: '+Le 220', tips: '+Le 25' },
  ];

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0 || val > availableBalance) {
      showToast('Enter a valid amount within balance');
      return;
    }
    setAvailableBalance((b) => b - val);
    setAmount('');
    setWithdrawModalOpen(false);
    showToast(`Le ${val} sent immediately to your Orange Money wallet!`);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <button
            onClick={() => navigate('/rider')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#1E40AF] hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Rider Hub</span>
          </button>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Rider Earnings & Wallet
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Daily trip earnings, tips, and instant mobile money transfers
              </p>
            </div>
            <button
              onClick={() => setWithdrawModalOpen(true)}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>Cash Out Today</span>
            </button>
          </div>
        </div>

        {/* Balance cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Available Wallet Balance</span>
            <p className="text-3xl font-black text-slate-900 mt-1">Le {availableBalance}</p>
            <span className="text-[11px] font-semibold text-emerald-600">● Ready to cash out</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Tips Received This Week</span>
            <p className="text-3xl font-black text-orange-600 mt-1">Le 85</p>
            <span className="text-[11px] font-semibold text-slate-400">100% goes directly to you</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Destination Account</span>
            <p className="text-sm font-bold text-slate-800 mt-1">Orange Money</p>
            <span className="text-xs text-slate-500">+232 79 334455 (Samuel Bangura)</span>
          </div>
        </div>

        {/* Payout history */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Trip Settlements History</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b">
                <tr>
                  <th className="p-3">Reference</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Details</th>
                  <th className="p-3">Tips</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payouts.map((p) => (
                  <tr key={p.id}>
                    <td className="p-3 font-bold text-slate-800">{p.id}</td>
                    <td className="p-3 text-slate-500">{p.date}</td>
                    <td className="p-3 text-slate-700">{p.description}</td>
                    <td className="p-3 text-amber-600 font-bold">{p.tips}</td>
                    <td className={`p-3 text-right font-black ${p.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {p.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cashout modal */}
        {withdrawModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-slate-900">Instant Momo Cashout</h3>
              <p className="text-xs text-slate-500">
                Available to transfer: <strong>Le {availableBalance}</strong>
              </p>

              <form onSubmit={handleWithdraw} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Amount (Le)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 300"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700"
                  >
                    Transfer to Orange Money
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
