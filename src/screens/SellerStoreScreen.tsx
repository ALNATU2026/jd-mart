import React, { useState } from 'react';
import { Store, MapPin, Phone, Mail, CheckCircle2, Save, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SellerStoreScreen: React.FC = () => {
  const { stores, updateStore, navigate, showToast } = useApp();

  const store = stores[0]; // Active seller's store

  const [name, setName] = useState(store.name);
  const [description, setDescription] = useState(store.description);
  const [location, setLocation] = useState(store.location);
  const [phone, setPhone] = useState(store.phone);
  const [email, setEmail] = useState(store.email);
  const [bankAccount, setBankAccount] = useState(store.bankDetails?.accountNumber || '003010293847');
  const [momoNumber, setMomoNumber] = useState(store.bankDetails?.momoNumber || '+232 76 123456');

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    updateStore(store.id, {
      name,
      description,
      location,
      phone,
      email,
      bankDetails: {
        accountName: name,
        accountNumber: bankAccount,
        bankName: 'Sierra Leone Commercial Bank',
        momoNumber,
      },
    });
    showToast('Store profile details updated successfully!');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Seller Store Settings
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure your public storefront branding, contact, and withdrawal payout accounts
            </p>
          </div>
          <button
            onClick={() => navigate(`/store/${store.slug}`)}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Eye className="w-4 h-4 text-[#1E40AF]" />
            <span>View Public Store</span>
          </button>
        </div>

        {/* Store Profile Card */}
        <form onSubmit={handleSaveStore} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <img
              src={store.logo}
              alt={store.name}
              className="w-20 h-20 rounded-2xl object-contain border p-2 bg-slate-50"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{name}</h2>
                {store.verified && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified Merchant
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{location}</p>
              <p className="text-[11px] text-blue-600 font-semibold mt-1">Slug: /store/{store.slug}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">Store Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">Store Description & Guarantee</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Store Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Customer Care Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Business Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Orange / Afrimoney Momo Number</label>
              <input
                type="text"
                value={momoNumber}
                onChange={(e) => setMomoNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1E40AF] text-white rounded-xl text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Store Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const PublicStoreScreen: React.FC<{ slug: string }> = ({ slug }) => {
  const { stores, products, navigate } = useApp();

  const store = stores.find((s) => s.slug === slug) || stores[0];
  const storeProducts = products.filter(
    (p) => p.sellerId === store.sellerId || p.sellerName.toLowerCase().includes(store.name.toLowerCase().slice(0, 4))
  );

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Banner card */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs">
          <div className="h-44 bg-linear-to-r from-blue-700 to-indigo-800 relative">
            {store.banner && (
              <img src={store.banner} alt={store.name} className="w-full h-full object-cover opacity-30" />
            )}
          </div>
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-16 relative">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <img
                src={store.logo}
                alt={store.name}
                className="w-24 h-24 rounded-3xl object-contain bg-white border-4 border-white shadow-lg p-2"
              />
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h1 className="text-2xl font-black text-slate-900">{store.name}</h1>
                  {store.verified && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{store.location}</p>
                <div className="flex items-center gap-3 text-xs text-slate-600 mt-2 justify-center sm:justify-start">
                  <span>★ {store.rating} Rating</span>
                  <span>•</span>
                  <span>{store.totalSales} Sales</span>
                  <span>•</span>
                  <span>{storeProducts.length} Products</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/shop')}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
            >
              Back to Marketplace
            </button>
          </div>
        </div>

        {/* Store Catalog */}
        <div>
          <h2 className="text-xl font-black text-slate-900 mb-4">Store Inventory ({storeProducts.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {storeProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/product/${p.id}`)}
                className="bg-white rounded-3xl p-4 border border-slate-200 hover:shadow-lg transition-all cursor-pointer"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full aspect-square object-cover rounded-2xl mb-3"
                />
                <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{p.title}</h3>
                <span className="text-sm font-black text-[#1E40AF] mt-2 block">Le {p.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
