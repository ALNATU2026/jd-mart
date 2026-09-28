import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  Heart,
  ShoppingCart,
  ChevronRight,
  ArrowUpDown,
  RotateCcw,
  MapPin,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ShopScreen: React.FC = () => {
  const {
    products,
    categories,
    stores,
    navigate,
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSeller, setSelectedSeller] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc' | 'newest'>('popularity');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const itemsPerPage = 6;

  // Extract unique locations
  const locations = useMemo(() => {
    const locs = new Set<string>();
    stores.forEach((s) => {
      if (s.location.includes('Central')) locs.add('Central Freetown');
      else if (s.location.includes('Lumley')) locs.add('Lumley & West');
      else if (s.location.includes('Wilkinson')) locs.add('Wilkinson Road');
      else locs.add('Greater Freetown');
    });
    return ['All', ...Array.from(locs)];
  }, [stores]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesQuery =
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSeller = selectedSeller === 'All' || p.sellerName === selectedSeller;
        const matchesPrice = p.price <= maxPrice;
        const matchesRating = p.rating >= minRating;
        const matchesLocation =
          selectedLocation === 'All' || p.sellerLocation.toLowerCase().includes(selectedLocation.toLowerCase().slice(0, 5));

        return (
          matchesQuery &&
          matchesCategory &&
          matchesSeller &&
          matchesPrice &&
          matchesRating &&
          matchesLocation
        );
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return b.rating - a.rating; // popularity
      });
  }, [products, searchQuery, selectedCategory, selectedSeller, maxPrice, minRating, selectedLocation, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedSeller('All');
    setSelectedLocation('All');
    setMinRating(0);
    setMaxPrice(1000);
    setSortBy('popularity');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <button onClick={() => navigate('/')} className="hover:text-[#1E40AF]">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-semibold">Shop Marketplace</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Shop Marketplace
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Showing {filteredProducts.length} verified products with express dispatch delivery
              </p>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="sm:hidden flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#1E40AF]" />
              <span>Filter & Sort ({filteredProducts.length})</span>
            </button>
          </div>
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search in shop..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1E40AF] focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1E40AF]"
              >
                <option value="popularity">Most Popular / Highest Rating</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>

            <button
              onClick={resetFilters}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Shop Grid & Filters Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:block ${showMobileFilters ? 'block' : 'hidden'} space-y-6`}>
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#1E40AF]" />
                  Filters
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-[11px] font-bold text-blue-600 hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                  Category
                </h4>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                      selectedCategory === 'All'
                        ? 'bg-blue-50 text-[#1E40AF] font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>All Categories</span>
                    <span>{products.length}</span>
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCategory(c.name);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                        selectedCategory === c.name
                          ? 'bg-blue-50 text-[#1E40AF] font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{c.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {products.filter((p) => p.category === c.name).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Max Price
                  </h4>
                  <span className="text-xs font-extrabold text-[#1E40AF]">
                    Le {maxPrice}
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="25"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full accent-[#1E40AF] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Le 50</span>
                  <span>Le 1,000+</span>
                </div>
              </div>

              {/* Seller Filter */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                  Verified Seller
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setSelectedSeller('All');
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                      selectedSeller === 'All' ? 'bg-blue-50 text-[#1E40AF]' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    All Stores
                  </button>
                  {stores.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedSeller(s.name);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold truncate block ${
                        selectedSeller === s.name ? 'bg-blue-50 text-[#1E40AF]' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                  Dispatch Location
                </h4>
                <select
                  value={selectedLocation}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-700"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                  Minimum Rating
                </h4>
                <div className="space-y-1">
                  {[4, 3, 0].map((stars) => (
                    <button
                      key={stars}
                      onClick={() => {
                        setMinRating(stars);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                        minRating === stars ? 'bg-blue-50 text-[#1E40AF] font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1 text-amber-500">
                        {stars === 0 ? (
                          <span className="text-slate-600 font-medium">All Ratings</span>
                        ) : (
                          <>
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{stars} Stars & Above</span>
                          </>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid & Pagination */}
          <main className="lg:col-span-3 space-y-6">
            {paginatedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">No products found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                  No items matched your current filter criteria. Try adjusting the search term, price range, or category.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-[#1E40AF] text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => {
                  const inWish = isInWishlist(product.id);
                  return (
                    <div
                      key={product.id}
                      className="group bg-white rounded-3xl p-4 border border-slate-200/80 hover:border-blue-400 hover:shadow-xl transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Image Container */}
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-100 mb-3">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/images/smartwatch.jpg';
                            }}
                          />

                          {product.discount && (
                            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-red-600 text-white text-[10px] font-extrabold rounded-full shadow-xs">
                              {product.discount}
                            </span>
                          )}

                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-colors ${
                              inWish
                                ? 'bg-red-50 text-red-600'
                                : 'bg-white/80 backdrop-blur-xs text-slate-400 hover:text-red-500'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${inWish ? 'fill-red-600' : ''}`} />
                          </button>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                            {product.category}
                          </span>
                          <h3
                            onClick={() => navigate(`/product/${product.id}`)}
                            className="text-sm font-bold text-slate-900 line-clamp-1 hover:text-[#1E40AF] cursor-pointer"
                          >
                            {product.title}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="text-base font-black text-[#1E40AF]">
                              Le {product.price}
                            </span>
                            {product.oldPrice && (
                              <span className="text-xs text-slate-400 line-through ml-2">
                                Le {product.oldPrice}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center text-amber-500 text-xs">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span className="font-bold ml-1">{product.rating}</span>
                            <span className="text-[10px] text-slate-400 ml-0.5">
                              ({product.reviewsCount})
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => navigate(`/product/${product.id}`)}
                            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors text-center"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => addToCart(product, 1)}
                            className="py-2 px-3 bg-[#1E40AF] hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold ${
                        currentPage === i + 1
                          ? 'bg-[#1E40AF] text-white'
                          : 'border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
