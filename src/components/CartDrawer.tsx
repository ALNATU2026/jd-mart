import React from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartTotal,
    navigate,
  } = useApp();

  if (!isCartOpen) return null;

  const deliveryFee = cart.length > 0 ? (cartTotal > 200 ? 0 : 15) : 0;
  const grandTotal = cartTotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1E40AF] flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Your Shopping Cart</h3>
              <p className="text-xs text-slate-500">{cart.length} unique items</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free delivery promo banner */}
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 text-xs text-amber-800 flex items-center justify-between font-medium">
          <span>{cartTotal >= 200 ? '🎉 Free Delivery unlocked!' : `Add Le ${200 - cartTotal} more for FREE delivery`}</span>
          <span className="font-bold">Le 200 threshold</span>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-slate-300" />
              </div>
              <h4 className="text-base font-bold text-slate-700 mb-1">Your cart is empty</h4>
              <p className="text-xs text-slate-500 mb-6 max-w-xs">
                Explore our catalog for the latest electronics, fashion, food and home essentials.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/shop');
                }}
                className="px-5 py-2.5 bg-[#1E40AF] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100"
              >
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-18 h-18 rounded-xl object-cover bg-white shrink-0 border border-slate-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/images/smartwatch.jpg';
                  }}
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-red-500 p-0.5"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      Seller: {item.product.sellerName}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-extrabold text-[#1E40AF]">
                      Le {item.product.price}
                    </span>

                    <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-2xs">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-slate-100 text-slate-600 rounded-l-lg transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-slate-100 text-slate-600 rounded-r-lg transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Subtotal & Actions */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-white space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800">Le {cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span className="font-bold text-slate-800">
                  {deliveryFee === 0 ? 'FREE' : `Le ${deliveryFee}`}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Total</span>
                <span className="text-[#1E40AF]">Le {grandTotal}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/cart');
                }}
                className="py-2.5 px-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition-colors text-center"
              >
                View Full Cart
              </button>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="py-2.5 px-3 bg-[#1E40AF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verified Merchant Escrow & Rider Tracking</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
