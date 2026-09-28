import React from 'react';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WishlistScreen: React.FC = () => {
  const { wishlist, products, toggleWishlist, addToCart, navigate } = useApp();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

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
            Saved Wishlist ({savedProducts.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Keep track of items you plan to purchase or monitor for special deals
          </p>
        </div>

        {savedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 max-w-md mx-auto">
            <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-800">Your wishlist is empty</p>
            <p className="text-xs text-slate-400 mt-1 mb-6">Tap the heart icon on any product to save it here.</p>
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-2.5 bg-[#1E40AF] text-white rounded-xl text-xs font-bold"
            >
              Discover Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {savedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-red-500 hover:bg-white"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-[10px] font-bold text-blue-600 uppercase">
                    {product.category}
                  </span>
                  <h3
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="text-xs font-bold text-slate-900 line-clamp-1 hover:text-[#1E40AF] cursor-pointer mt-0.5"
                  >
                    {product.title}
                  </h3>
                  <p className="text-sm font-black text-[#1E40AF] mt-1">Le {product.price}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
                  >
                    View
                  </button>
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="py-2 text-xs font-bold text-white bg-[#1E40AF] rounded-xl hover:bg-blue-700 flex items-center justify-center gap-1"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>To Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
