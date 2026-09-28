import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SellerProductsScreen: React.FC = () => {
  const { products, deleteProduct, updateProduct, navigate, currentUser } = useApp();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const sellerProducts = products.filter(
    (p) =>
      (p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())) &&
      (selectedCategory === 'All' || p.category === selectedCategory)
  );

  const toggleStatus = (id: string, currentStatus: string) => {
    updateProduct(id, {
      status: currentStatus === 'active' ? 'inactive' : 'active',
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <button
              onClick={() => navigate('/seller')}
              className="flex items-center gap-1.5 text-xs font-bold text-[#1E40AF] hover:underline mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Seller Dashboard</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Product Catalog Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Add new listings, edit specifications, control prices, and manage inventory stock
            </p>
          </div>

          <button
            onClick={() => navigate('/seller/products/new')}
            className="px-5 py-2.5 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your inventory by title or keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="text-xs text-slate-500 font-semibold">
            Total Inventory: <strong className="text-slate-900">{sellerProducts.length}</strong> items
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sellerProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 border shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-slate-900 truncate">{p.title}</p>
                          <p className="text-[10px] text-slate-400 truncate">{p.condition}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-600">{p.category}</td>
                    <td className="p-4 font-black text-[#1E40AF]">Le {p.price}</td>
                    <td className="p-4">
                      <span className={`font-bold ${p.stock < 10 ? 'text-amber-600' : 'text-slate-700'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleStatus(p.id, p.status)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                          p.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {p.status === 'active' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/seller/products/${p.id}/edit`)}
                          className="p-1.5 text-slate-400 hover:text-[#1E40AF] rounded-lg hover:bg-slate-100"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
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
