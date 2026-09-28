import React from 'react';
import { Menu, Bell, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { setIsDrawerOpen, setIsCartOpen, setIsNotificationsOpen, cartItems } = useApp();

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-slate-100">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        {/* Drawer Toggle */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="w-[42px] h-[42px] rounded-xl bg-[#EAF1FF] flex items-center justify-center text-[#1E40AF] hover:bg-blue-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Center Logo */}
        <div className="flex-1 flex justify-center px-3">
          <img
            src="/assets/logos/appBarlogo.png"
            alt="JDMart"
            className="h-8 object-contain max-w-[170px]"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1">
          {/* Notifications */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 text-[#0F172A] hover:bg-slate-50 rounded-full transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-[24px] h-[24px]" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-[#0F172A] hover:bg-slate-50 rounded-full transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-[24px] h-[24px]" />
            {totalCartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-[#F97316] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
