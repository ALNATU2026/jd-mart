import React from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartModal: React.FC = () => {
  const { isCartOpen, setIsCartOpen, cartItems, updateCartQuantity, removeFromCart, showToast } = useApp();

  if (!isCartOpen) return null;

  // Calculate totals
  // prices are formatted as "Le 45" or "Le 18.75"
  const parsePrice = (priceStr: string) => {
    const num = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parsePrice(item.product.price) * item.quantity,
    0
  );

  const isFreeDelivery = subtotal >= 50;
  const deliveryFee = isFreeDelivery || subtotal === 0 ? 0 : 5;
  const total = subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#1E40AF]" />
            <h2 className="text-base font-bold text-[#0F172A]">My Cart ({cartItems.length})</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free delivery banner */}
        <div className="bg-[#EAF1FF] px-4 py-2 text-xs font-semibold text-[#1E40AF] flex items-center justify-between">
          <span>{isFreeDelivery ? '🎉 You qualified for FREE delivery!' : `Add Le ${(50 - subtotal).toFixed(2)} more for FREE delivery`}</span>
          <span className="text-[10px] bg-blue-100 px-2 py-0.5 rounded-full font-bold">Le 50 min</span>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">Your cart is empty</h3>
              <p className="text-xs text-slate-500 mt-1">Explore our flash deals and add top picks to your cart.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center space-x-3 p-3 bg-[#F8FAFC] rounded-2xl border border-slate-100"
              >
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{item.product.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm font-extrabold text-[#1E40AF]">{item.product.price}</span>
                    <span className="text-[11px] text-slate-400 line-through">{item.product.oldPrice}</span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-1.5 bg-white px-2 py-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                    className="p-1 text-slate-500 hover:text-red-500"
                    aria-label="Decrease quantity"
                  >
                    {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-red-500" /> : <Minus className="w-3.5 h-3.5" />}
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    className="p-1 text-slate-500 hover:text-blue-600"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-white space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">Le {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span className="font-semibold text-slate-800">{deliveryFee === 0 ? 'FREE' : `Le ${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-100 text-sm font-extrabold text-slate-900">
                <span>Total</span>
                <span className="text-[#1E40AF]">Le {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                showToast('Order placed successfully! Tracking active.');
                setIsCartOpen(false);
              }}
              className="w-full h-12 bg-[#1E40AF] text-white rounded-xl font-bold text-sm flex items-center justify-center space-x-2 hover:bg-blue-800 active:scale-[0.99] transition-all shadow-md shadow-blue-900/20"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
