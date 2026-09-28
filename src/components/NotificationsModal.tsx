import React from 'react';
import { X, Bell, CheckCircle2, Tag, Truck, ShieldAlert, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationsModal: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markAllNotificationsRead,
    navigate,
  } = useApp();

  if (!isNotificationsOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'delivery':
        return <Truck className="w-4 h-4 text-orange-600" />;
      case 'promo':
        return <Tag className="w-4 h-4 text-blue-600" />;
      case 'order':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsNotificationsOpen(false)}
      />

      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#1E40AF]" />
            <h3 className="text-base font-bold text-slate-800">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
            >
              Mark all read
            </button>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1 rounded-full hover:bg-slate-200 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3 rounded-xl transition-colors ${
                notif.read ? 'bg-white text-slate-600' : 'bg-blue-50/50 text-slate-900 font-medium'
              }`}
            >
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-800">{notif.title}</h4>
                    <span className="text-[10px] text-slate-400">{notif.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
          <button
            onClick={() => {
              setIsNotificationsOpen(false);
              navigate('/dashboard');
            }}
            className="text-xs font-bold text-[#1E40AF] hover:underline"
          >
            Go to Buyer Activity Center
          </button>
        </div>
      </div>
    </div>
  );
};
