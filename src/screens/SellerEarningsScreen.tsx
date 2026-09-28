import React, { useState } from 'react';
import { DollarSign, Wallet, ArrowDownRight, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SellerEarningsScreen: React.FC = () => {
  const { showToast } = useApp();

  const [availableBalance, setAvailableBalance] = useState(4250);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  const transactions = [
    { id: 'TXN-9021', date: '2026-09-28', description: 'Payout for Order #JDM-89310', amount: '+Le 150', status: 'Completed' },
    { id: 'TXN-8812', date: '2026-09-25', description: 'Orange Money Withdrawal to +232 76 123456', amount: '-Le 1,200', status: 'Completed' },
    { id: 'TXN-8744', date: '2026-09-24', description: 'Payout for Order #JDM-88912', amount: '+Le 680', status: 'Completed' },
    { id: 'TXN-8601', date: '2026-09-20', description: 'Payout for Order #JDM-87201', amount: '+Le 420', status: 'Completed' },
  ];

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0 || amt > availableBalance) {
      showToast('Please enter a valid amount within your available balance');
      return;
    }
    setAvailableBalance((b) => b - amt);
    setWithdrawAmount('');
    setWithdrawModalOpen(false);
    showToast(`Withdrawal of Le ${amt} sent to your Orange Money wallet!`);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Seller Earnings & Financials
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Real-time escrow settlements, available withdrawal balance, and transaction history
            </p>
          </div>

          <button
            onClick={() => setWithdrawModalOpen(true)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs self-start sm:self-auto flex items-center gap-1.5"
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Request Withdrawal</span>
          </button>
        </div>

        {/* Financial metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Available For Payout</span>
            <p className="text-3xl font-black text-emerald-600 mt-1">Le {availableBalance}</p>
            <p className="text-[11px] text-slate-400 mt-1">Settled and ready for Orange/Afrimoney withdrawal</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Held in Active Escrow</span>
            <p className="text-3xl font-black text-amber-500 mt-1">Le 820</p>
            <p className="text-[11px] text-slate-400 mt-1">Released upon buyer delivery confirmation</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Lifetime Marketplace Sales</span>
            <p className="text-3xl font-black text-[#1E40AF] mt-1">Le 18,500</p>
            <p className="text-[11px] text-slate-400 mt-1">Processed securely through JD Mart</p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Settlement & Payout Transactions</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b">
                <tr>
                  <th className="p-3">Reference</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-800">{t.id}</td>
                    <td className="p-3 text-slate-500">{t.date}</td>
                    <td className="p-3 text-slate-700">{t.description}</td>
                    <td className={`p-3 font-black ${t.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {t.amount}
                    </td>
                    <td className="p-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Withdrawal Modal */}
        {withdrawModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-slate-900">Withdraw to Mobile Money</h3>
              <p className="text-xs text-slate-500">
                Available balance: <strong className="text-emerald-600">Le {availableBalance}</strong>
              </p>

              <form onSubmit={handleWithdraw} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Withdrawal Amount (Le)
                  </label>
                  <input
                    type="number"
                    required
                    max={availableBalance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="e.g. 1000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Destination Mobile Money Number
                  </label>
                  <input
                    type="text"
                    disabled
                    value="+232 76 123456 (Orange Money / Sierra Leone)"
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-xs text-slate-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
                  >
                    Confirm Instant Transfer
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
