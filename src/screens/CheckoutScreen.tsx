import React, { useState } from 'react';
import { ArrowLeft, Truck, ShieldCheck, MapPin, Phone, User, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CheckoutScreen: React.FC = () => {
  const { cart, cartTotal, createOrder, navigate, currentUser, showToast } = useApp();

  const [fullName, setFullName] = useState(currentUser?.name || 'Aminata Kamara');
  const [phone, setPhone] = useState(currentUser?.phone || '+232 77 456789');
  const [address, setAddress] = useState(currentUser?.address || '15 Campbell Street, Central');
  const [city, setCity] = useState('Freetown');
  const [deliveryMethod, setDeliveryMethod] = useState<'Standard' | 'Express' | 'Pickup'>('Standard');
  const [paymentOption, setPaymentOption] = useState<'Mobile Money / Orange / Afrimoney' | 'Cash on Delivery'>('Mobile Money / Orange / Afrimoney');
  const [notes, setNotes] = useState('');

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-2">No items to checkout</h2>
          <p className="text-xs text-slate-500 mb-6">Your shopping cart is currently empty.</p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-2.5 bg-[#1E40AF] text-white rounded-xl text-xs font-bold"
          >
            Explore Marketplace
          </button>
        </div>
      </div>
    );
  }

  const deliveryFee = deliveryMethod === 'Pickup' ? 0 : deliveryMethod === 'Express' ? 25 : 15;
  const serviceFee = 5;
  const grandTotal = cartTotal + deliveryFee + serviceFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      showToast('Please complete all delivery information fields');
      return;
    }

    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
      sellerId: item.product.sellerId,
      sellerName: item.product.sellerName,
    }));

    const newOrder = createOrder({
      buyerName: fullName,
      buyerPhone: phone,
      buyerAddress: address,
      buyerCity: city,
      items: orderItems,
      subtotal: cartTotal,
      deliveryFee,
      serviceFee,
      total: grandTotal,
      deliveryMethod,
      sellerId: orderItems[0]?.sellerId || 'user-seller-1',
      sellerName: orderItems[0]?.sellerName || 'JD Merchant Store',
    });

    showToast('Order placed successfully! Dispatch rider requested.');
    navigate(`/order-success/${newOrder.id}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#1E40AF] hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Cart</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Checkout & Delivery
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Delivery Information & Method */}
          <div className="lg:col-span-8 space-y-6">
            {/* Delivery Info */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1E40AF]" />
                Delivery Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1E40AF]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number (with WhatsApp)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1E40AF]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Street Address / Landmark</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 15 Campbell Street, near St. Anthony Church"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1E40AF]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">City / Area</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
                  >
                    <option value="Freetown (Central / West / East)">Freetown (Central / West / East)</option>
                    <option value="Waterloo & Western Rural">Waterloo & Western Rural</option>
                    <option value="Bo City">Bo City</option>
                    <option value="Kenema">Kenema</option>
                    <option value="Makeni">Makeni</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Delivery Notes (Optional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Call before arrival, blue gate"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-orange-500" />
                Select Delivery Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => setDeliveryMethod('Standard')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    deliveryMethod === 'Standard' ? 'border-[#1E40AF] bg-blue-50/40' : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">Standard Delivery</span>
                    <span className="text-xs font-extrabold text-[#1E40AF]">Le 15</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Delivered within 2 - 4 hours</p>
                </div>

                <div
                  onClick={() => setDeliveryMethod('Express')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    deliveryMethod === 'Express' ? 'border-[#1E40AF] bg-blue-50/40' : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">Express Priority</span>
                    <span className="text-xs font-extrabold text-[#1E40AF]">Le 25</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Dedicated dispatch under 45 mins</p>
                </div>

                <div
                  onClick={() => setDeliveryMethod('Pickup')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    deliveryMethod === 'Pickup' ? 'border-[#1E40AF] bg-blue-50/40' : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">Store Pickup</span>
                    <span className="text-xs font-extrabold text-emerald-600">FREE</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Collect in merchant store</p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Payment Options (Escrow Protected)
              </h2>

              <div className="space-y-2">
                {['Mobile Money / Orange / Afrimoney', 'Cash on Delivery'].map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-colors ${
                      paymentOption === opt ? 'border-[#1E40AF] bg-blue-50/40' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentOption === opt}
                      onChange={() => setPaymentOption(opt as any)}
                      className="accent-[#1E40AF]"
                    />
                    <span className="text-xs font-bold text-slate-800">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Summary */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">Items in Order ({cart.length})</h2>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3 text-xs">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-12 h-12 rounded-xl object-cover border shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{item.product.title}</p>
                    <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                    <p className="font-extrabold text-[#1E40AF]">Le {item.product.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">Le {cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery ({deliveryMethod})</span>
                <span className="font-bold text-slate-900">Le {deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Escrow Service Fee</span>
                <span className="font-bold text-slate-900">Le {serviceFee}</span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between text-base font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-[#1E40AF]">Le {grandTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-900/20"
            >
              Place Order (Le {grandTotal})
            </button>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              By placing your order, funds are held securely until you receive and inspect your package.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
