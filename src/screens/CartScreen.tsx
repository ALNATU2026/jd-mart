import React from 'react';
import { ShoppingBag, ArrowLeft, Trash2, Heart, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartScreen: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    cartTotal,
    navigate,
    toggleWishlist,
    showToast,
  } = useApp();

  const deliveryFee = cart.length > 0 ? (cartTotal > 200 ? 0 : 15) : 0;
  const serviceFee = cart.length > 0 ? 5 : 0;
  const grandTotal = cartTotal + deliveryFee + serviceFee;

  const handleSaveForLater = (productId: string) => {
    toggleWishlist(productId);
    removeFromCart(productId);
    showToast('Item moved to saved wishlist');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#1E40AF] hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Shopping Cart ({cart.length})
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Your cart is empty</h2>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-3 bg-[#1E40AF] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
            >
              Start Shopping Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-100 bg-slate-50 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/images/smartwatch.jpg';
                      }}
                    />
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase">
                        {item.product.category}
                      </span>
                      <h3
                        onClick={() => navigate(`/product/${item.product.id}`)}
                        className="text-sm font-bold text-slate-900 hover:text-[#1E40AF] cursor-pointer line-clamp-1"
                      >
                        {item.product.title}
                      </h3>
                      <p className="text-xs text-slate-500">Seller: {item.product.sellerName}</p>
                      <p className="text-sm font-black text-[#1E40AF] mt-1">Le {item.product.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="flex items-center bg-slate-100 rounded-xl border border-slate-200">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-2 hover:bg-slate-200 text-slate-700 rounded-l-xl transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-extrabold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="p-2 hover:bg-slate-200 text-slate-700 rounded-r-xl transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-slate-900">
                        Le {item.product.price * item.quantity}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveForLater(item.product.id)}
                        className="p-2 text-slate-400 hover:text-[#1E40AF] rounded-xl hover:bg-blue-50 transition-colors"
                        title="Save for Later"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Box */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900">Order Summary</h2>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">Le {cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-slate-900">
                    {deliveryFee === 0 ? 'FREE' : `Le ${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Escrow Service Fee</span>
                  <span className="font-bold text-slate-900">Le {serviceFee}</span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-black text-slate-900">
                  <span>Estimated Total</span>
                  <span className="text-[#1E40AF]">Le {grandTotal}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-900/20"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Encrypted checkout & Escrow protection</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
