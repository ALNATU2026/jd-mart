import React from 'react';
import { ArrowLeft, ChevronRight, Star, Heart, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CategoryDetailScreen: React.FC<{ slug: string }> = ({ slug }) => {
  const { categories, products, navigate, addToCart, toggleWishlist, isInWishlist } = useApp();

  const category = categories.find((c) => c.slug === slug) || categories[0];
  const categoryProducts = products.filter(
    (p) =>
      p.category.toLowerCase().includes(category.name.toLowerCase().slice(0, 4)) ||
      category.name.toLowerCase().includes(p.category.toLowerCase().slice(0, 4))
  );

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => navigate('/categories')} className="hover:text-[#1E40AF]">Categories</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-semibold">{category.name}</span>
        </div>

        {/* Category Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center shrink-0">
            <img
              src={category.icon}
              alt={category.name}
              className="w-10 h-10 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/icons/categories.png';
              }}
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              {category.description || 'Verified products with rapid dispatch delivery'}
            </p>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl"
          >
            All Products
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoryProducts.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl p-12 text-center text-slate-500">
              <p className="text-sm font-bold">No products currently listed in this category</p>
              <button
                onClick={() => navigate('/shop')}
                className="mt-4 px-4 py-2 bg-[#1E40AF] text-white rounded-xl text-xs font-bold"
              >
                Explore other categories
              </button>
            </div>
          ) : (
            categoryProducts.map((product) => {
              const inWish = isInWishlist(product.id);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl p-4 border border-slate-200/80 hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/images/smartwatch.jpg';
                      }}
                    />
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`absolute top-2 right-2 p-1.5 rounded-full ${
                        inWish ? 'bg-red-50 text-red-600' : 'bg-white/80 text-slate-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${inWish ? 'fill-red-600' : ''}`} />
                    </button>
                  </div>

                  <div>
                    <h3
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="text-xs font-bold text-slate-900 line-clamp-1 hover:text-[#1E40AF] cursor-pointer"
                    >
                      {product.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{product.sellerName}</p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                      <span className="text-sm font-black text-[#1E40AF]">Le {product.price}</span>
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="p-2 bg-[#1E40AF] text-white rounded-xl hover:bg-blue-700"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
