import React, { useState, useEffect } from 'react';
import {
  Search,
  Zap,
  Heart,
  ChevronRight,
  Store,
  Bike,
  Briefcase,
  Star,
  CheckCircle,
  Truck,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  Users,
  Smartphone,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HomeScreen: React.FC = () => {
  const {
    products,
    categories,
    stores,
    jobs,
    navigate,
    addToCart,
    toggleWishlist,
    isInWishlist,
    userRole,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [countdown, setCountdown] = useState({ hours: 14, minutes: 28, seconds: 45 });

  // Countdown timer simulation for flash deals
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.filter((p) => p.featured || p.discount);
  const popularCategories = categories.slice(0, 8);
  const featuredSellers = stores.slice(0, 3);
  const popularJobs = jobs.slice(0, 4);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      {/* HERO BANNER SECTION */}
      <section className="relative bg-linear-to-br from-[#1E40AF] via-[#1E3A8A] to-[#0F172A] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative background glow circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Unified E-Commerce • On-Demand Dispatch • Jobs</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Buy Smart, Sell Faster, <br className="hidden sm:inline" />
              <span className="text-[#F97316]">Deliver Anywhere.</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Sierra Leone’s all-in-one platform. Shop genuine gadgets, fashion, and furniture, hire trusted motorbike dispatch riders, or find top local employment.
            </p>

            {/* Quick Hero Actions Grid */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate('/shop')}
                className="px-6 py-3 bg-[#F97316] hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/30 flex items-center gap-2 group"
              >
                <span>Shop Marketplace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/jobs')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-colors border border-white/20 flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-purple-300" />
                <span>Find a Job</span>
              </button>

              <button
                onClick={() => navigate('/onboarding/seller')}
                className="px-4 py-3 bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5"
              >
                <Store className="w-4 h-4" />
                <span>Become a Seller</span>
              </button>

              <button
                onClick={() => navigate('/onboarding/rider')}
                className="px-4 py-3 bg-amber-500/90 hover:bg-amber-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5"
              >
                <Bike className="w-4 h-4" />
                <span>Become a Rider</span>
              </button>

              <button
                onClick={() => navigate('/employer')}
                className="px-4 py-3 bg-indigo-600/90 hover:bg-indigo-600 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5"
              >
                <span>Hire Workers</span>
              </button>
            </div>

            {/* Hero Search Box */}
            <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you looking for today? (e.g., iPhone, Sneakers, Sofa)"
                  className="w-full pl-11 pr-28 py-3.5 bg-white text-slate-800 placeholder-slate-400 rounded-2xl text-sm shadow-xl focus:outline-hidden focus:ring-3 focus:ring-[#F97316]"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/20 shadow-2xl relative">
              <img
                src="/assets/images/homeheader1.png"
                alt="JD Mart Shopping & Delivery"
                className="w-full h-72 sm:h-80 object-cover rounded-2xl shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/storefront.png';
                }}
              />

              {/* Floating badges */}
              <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 px-4 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">45 Min Fast Delivery</p>
                  <p className="text-[11px] text-slate-500">Across Greater Freetown</p>
                </div>
              </div>

              <div className="absolute -top-3 -right-3 bg-white text-slate-900 px-3.5 py-2.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">100% Verified Sellers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FLASH DEALS & DISCOUNT CAROUSEL SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  Flash Deals & Discounts
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                    HOT
                  </span>
                </h2>
                <p className="text-xs text-slate-500">Special limited-time marketplace deals</p>
              </div>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>Ends in:</span>
              <span className="px-1.5 py-0.5 bg-slate-900 text-white rounded-md">
                {String(countdown.hours).padStart(2, '0')}h
              </span>
              <span>:</span>
              <span className="px-1.5 py-0.5 bg-slate-900 text-white rounded-md">
                {String(countdown.minutes).padStart(2, '0')}m
              </span>
              <span>:</span>
              <span className="px-1.5 py-0.5 bg-slate-900 text-white rounded-md">
                {String(countdown.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>

          {/* Flash Deals Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.slice(0, 4).map((product) => {
              const inWish = isInWishlist(product.id);
              return (
                <div
                  key={product.id}
                  className="group bg-slate-50/70 hover:bg-white rounded-2xl p-3 border border-slate-200/80 hover:border-blue-300 hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div className="relative">
                    <div
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="cursor-pointer overflow-hidden rounded-xl bg-white aspect-square flex items-center justify-center border border-slate-100"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/images/smartwatch.jpg';
                        }}
                      />
                    </div>

                    {product.discount && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-extrabold rounded-full shadow-xs">
                        {product.discount}
                      </span>
                    )}

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${
                        inWish
                          ? 'bg-red-50 text-red-600'
                          : 'bg-white/80 backdrop-blur-xs text-slate-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${inWish ? 'fill-red-600' : ''}`} />
                    </button>
                  </div>

                  <div className="mt-3">
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                      {product.category}
                    </p>
                    <h3
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="text-xs font-bold text-slate-800 line-clamp-1 hover:text-[#1E40AF] cursor-pointer mt-0.5"
                    >
                      {product.title}
                    </h3>

                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-sm font-black text-[#1E40AF]">
                        Le {product.price}
                      </span>
                      {product.oldPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          Le {product.oldPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-1 text-[11px] text-slate-500 mt-1">
                      <span className="truncate">{product.sellerName}</span>
                      <div className="flex items-center text-amber-500 shrink-0">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="ml-0.5 font-bold">{product.rating}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product, 1)}
                      className="w-full mt-3 py-2 bg-[#1E40AF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-2xs"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Popular Categories
            </h2>
            <p className="text-xs text-slate-500">Explore items across all sectors</p>
          </div>
          <button
            onClick={() => navigate('/categories')}
            className="text-xs font-bold text-[#1E40AF] hover:underline flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {popularCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/category/${cat.slug}`)}
              className="bg-white rounded-2xl p-3 border border-slate-200/80 hover:border-blue-400 hover:shadow-lg transition-all text-center cursor-pointer group flex flex-col items-center justify-center gap-2"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-[#1E40AF] flex items-center justify-center transition-colors">
                <img
                  src={cat.icon}
                  alt={cat.name}
                  className="w-6 h-6 object-contain group-hover:brightness-200 transition-all"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/icons/categories.png';
                  }}
                />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#1E40AF] leading-tight">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{cat.itemCount} items</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED SELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Featured Verified Stores
            </h2>
            <p className="text-xs text-slate-500">Shop directly from trusted local retailers</p>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="text-xs font-bold text-[#1E40AF] hover:underline flex items-center gap-1"
          >
            <span>Explore Stores</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredSellers.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 p-1 bg-slate-50"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/logos/applogo.png';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className="text-sm font-black text-slate-800 truncate">{store.name}</h3>
                      {store.verified && (
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{store.location}</span>
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                  {store.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 py-2 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span className="font-bold text-slate-800">{store.rating} rating</span>
                  </div>
                  <span>{store.totalSales} orders delivered</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => navigate(`/store/${store.slug}`)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors text-center"
                >
                  Visit Store
                </button>
                <button
                  onClick={() => navigate(`/shop?seller=${encodeURIComponent(store.name)}`)}
                  className="flex-1 py-2 bg-[#1E40AF] hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors text-center"
                >
                  View Products
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR JOBS & GIGS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Popular Jobs & Opportunities
            </h2>
            <p className="text-xs text-slate-500">Apply for high-demand vacancies and freelance roles</p>
          </div>
          <button
            onClick={() => navigate('/jobs')}
            className="text-xs font-bold text-[#1E40AF] hover:underline flex items-center gap-1"
          >
            <span>Browse All Jobs</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => navigate(`/jobs/${job.id}`)}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1E40AF] text-[10px] font-bold uppercase tracking-wider mb-1.5">
                      {job.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 hover:text-[#1E40AF] transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{job.employerName}</p>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold shrink-0">
                    {job.type}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 my-3 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="font-extrabold text-[#1E40AF]">{job.salary}</span>
                <span className="text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {job.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW JD MART WORKS */}
      <section className="bg-white py-16 border-y border-slate-200/80 my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">
              Simple & Reliable
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              How JD Mart Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Empowering local commerce with end-to-end convenience from discovery to delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-3xl p-6 text-center border border-slate-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#1E40AF] mx-auto flex items-center justify-center font-black text-xl mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">Shop or Post</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Browse verified stores, negotiate or order products, or post new vacancies for skilled staff across Sierra Leone.
              </p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 text-center border border-slate-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#F97316] mx-auto flex items-center justify-center font-black text-xl mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">Instant Dispatch</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our licensed motorbike dispatch riders pick up packages directly from sellers and deliver swiftly to your doorstep.
              </p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 text-center border border-slate-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center font-black text-xl mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">Verified Delivery & Escrow</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Confirm your package with digital photo proof. Sellers receive instant payouts upon safe customer handover.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DISPATCH & DELIVERY PROMO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-linear-to-r from-orange-600 to-amber-600 rounded-3xl p-8 sm:p-12 text-white grid grid-cols-1 lg:grid-cols-2 gap-8 items-center shadow-xl">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
              On-Demand Dispatch Network
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Have a Motorbike or Bicycle? <br />
              Earn Daily as a JD Rider.
            </h2>
            <p className="text-orange-100 text-sm leading-relaxed">
              Join hundreds of dispatch riders delivering groceries, electronics, and fashion packages across Freetown. Flexible hours, instant payouts, and fuel bonuses.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate('/onboarding/rider')}
                className="px-6 py-3 bg-white text-orange-600 font-extrabold rounded-xl text-xs hover:bg-orange-50 transition-colors shadow-md"
              >
                Sign Up as a Rider
              </button>
              <button
                onClick={() => navigate('/rider')}
                className="px-5 py-3 bg-orange-700/60 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition-colors border border-white/20"
              >
                Rider Portal
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20">
              <img
                src="/assets/images/illustra.png"
                alt="Delivery Rider"
                className="w-full max-w-sm h-64 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/icons/delivery.png';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER TESTIMONIALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#1E40AF] uppercase tracking-wider">
            What Our Community Says
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Trusted by Thousands Across Freetown
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Ordered the Sony ANC headphones in the morning from Lumley and the rider brought it to my office at Siaka Stevens St within 40 minutes. Flawless experience!"
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-[#1E40AF] font-bold flex items-center justify-center text-xs">
                AK
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Aminata Kamara</h4>
                <p className="text-[10px] text-slate-400">Buyer • Central Freetown</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Setting up our electronics showroom on JD Mart doubled our monthly sales. We don’t even worry about delivery because dispatch riders take care of everything."
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                MS
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Mohamed Sesay</h4>
                <p className="text-[10px] text-slate-400">Merchant • JD Tech Store</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "I found my full-time dispatch job right through the JD Mart Job Marketplace. Reliable payouts straight into Orange Money every Friday."
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                SB
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Samuel Bangura</h4>
                <p className="text-[10px] text-slate-400">Rider • Western Area</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE APP PROMOTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-[#0F172A] rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2">
            <h3 className="text-xl font-black">Experience JD Mart On The Go</h3>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Track live motorcycle deliveries, receive real-time discount alerts, and chat directly with sellers.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/shop')}
              className="px-5 py-2.5 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-[#1E40AF]" />
              <span>Launch Web App</span>
            </button>
            <button
              onClick={() => navigate('/onboarding/seller')}
              className="px-5 py-2.5 bg-[#F97316] hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Register Your Business
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
