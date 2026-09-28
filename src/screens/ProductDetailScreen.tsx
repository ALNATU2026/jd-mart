import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Star,
  Truck,
  ShieldCheck,
  Store,
  MapPin,
  Check,
  Plus,
  Minus,
  MessageCircle,
  Flag,
  Share2,
  ChevronRight,
  Send,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Review } from '../types';

export const ProductDetailScreen: React.FC<{ productId: string }> = ({ productId }) => {
  const {
    products,
    navigate,
    addToCart,
    toggleWishlist,
    isInWishlist,
    showToast,
  } = useApp();

  const product = products.find((p) => p.id === productId) || products[0];
  const inWish = isInWishlist(product.id);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      userName: 'Fatmata Bangura',
      rating: 5,
      comment: 'Authentic quality, arrived in great condition within an hour via motorbike rider!',
      date: '2 days ago',
    },
    {
      id: 'rev-2',
      userName: 'John Koroma',
      rating: 4,
      comment: 'Great value for money. Seller was very responsive when I inquired about warranty.',
      date: '1 week ago',
    },
  ]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      userName: 'Verified Customer',
      rating: newRating,
      comment: newReviewText.trim(),
      date: 'Just now',
    };
    setReviews([newRev, ...reviews]);
    setNewReviewText('');
    showToast('Review submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/shop')}
              className="flex items-center gap-1 text-[#1E40AF] font-bold hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Shop</span>
            </button>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <button
              onClick={() => navigate(`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`)}
              className="hover:text-slate-800"
            >
              {product.category}
            </button>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-800 font-semibold truncate max-w-xs">{product.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                showToast('Product link copied to clipboard!');
              }}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              title="Share Product"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-2 rounded-xl bg-white border border-slate-200 transition-colors ${
                inWish ? 'text-red-600' : 'text-slate-400 hover:text-red-500'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${inWish ? 'fill-red-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Main Product Showcase Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Product Images Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center p-4">
                <img
                  src={activeImage}
                  alt={product.title}
                  className="w-full h-full object-contain max-h-96"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/images/smartwatch.jpg';
                  }}
                />

                {product.discount && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-xs font-black rounded-full shadow-md">
                    {product.discount} OFF
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex items-center gap-3 overflow-x-auto">
                <button
                  onClick={() => setActiveImage(product.image)}
                  className={`w-20 h-20 rounded-2xl border-2 overflow-hidden p-1 bg-slate-50 shrink-0 ${
                    activeImage === product.image ? 'border-[#1E40AF]' : 'border-slate-200'
                  }`}
                >
                  <img src={product.image} alt="Thumbnail 1" className="w-full h-full object-cover rounded-xl" />
                </button>
                <button
                  onClick={() => setActiveImage('/assets/images/homeheader1.png')}
                  className={`w-20 h-20 rounded-2xl border-2 overflow-hidden p-1 bg-slate-50 shrink-0 ${
                    activeImage === '/assets/images/homeheader1.png' ? 'border-[#1E40AF]' : 'border-slate-200'
                  }`}
                >
                  <img src="/assets/images/homeheader1.png" alt="Thumbnail 2" className="w-full h-full object-cover rounded-xl" />
                </button>
              </div>
            </div>

            {/* Right: Product Details & Purchase Actions */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 bg-blue-50 text-[#1E40AF] text-[11px] font-bold rounded-full uppercase tracking-wider">
                    {product.category}
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full">
                    {product.condition}
                  </span>
                  {product.stock > 0 ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} available)
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-red-500">Out of Stock</span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {product.title}
                </h1>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="ml-1 font-bold text-slate-900">{product.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{reviews.length} verified customer reviews</span>
                  <span>•</span>
                  <span>{product.reviewsCount} total orders</span>
                </div>
              </div>

              {/* Pricing Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#1E40AF]">
                  Le {product.price}
                </span>
                {product.oldPrice && (
                  <span className="text-base text-slate-400 line-through">
                    Le {product.oldPrice}
                  </span>
                )}
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full ml-auto">
                  Escrow Protected
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Description
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Seller Information Card */}
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 flex items-center justify-center text-[#1E40AF] font-bold">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{product.sellerName}</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{product.sellerLocation}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{product.sellerRating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-blue-100 text-xs">
                  <button
                    onClick={() => setContactModalOpen(true)}
                    className="flex-1 py-1.5 bg-white hover:bg-slate-50 text-[#1E40AF] font-bold rounded-xl border border-blue-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Contact Merchant</span>
                  </button>
                  <button
                    onClick={() => navigate(`/store/jd-tech-store`)}
                    className="flex-1 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 transition-colors text-center"
                  >
                    Visit Store
                  </button>
                </div>
              </div>

              {/* Quantity Selector & Action Buttons */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-700">Quantity:</span>
                  <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 hover:bg-slate-200 text-slate-700 rounded-l-xl transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-xs font-extrabold text-slate-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="p-2 hover:bg-slate-200 text-slate-700 rounded-r-xl transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => addToCart(product, quantity)}
                    className="py-3.5 px-4 bg-white border-2 border-[#1E40AF] text-[#1E40AF] hover:bg-blue-50 font-bold rounded-2xl text-xs sm:text-sm transition-colors text-center shadow-xs"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="py-3.5 px-4 bg-[#1E40AF] hover:bg-blue-700 text-white font-bold rounded-2xl text-xs sm:text-sm transition-colors text-center shadow-md shadow-blue-900/20"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Delivery highlight */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-orange-500" />
                    <span>Dispatched in 45 mins across Freetown</span>
                  </div>
                  <button
                    onClick={() => showToast('Product flagged for review by JD Mart moderators')}
                    className="text-slate-400 hover:text-red-500 flex items-center gap-1 text-[11px]"
                  >
                    <Flag className="w-3 h-3" />
                    <span>Report Item</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Customer Reviews</h2>
              <p className="text-xs text-slate-500">Feedback from verified purchasers</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-extrabold text-slate-900">{product.rating} out of 5</span>
            </div>
          </div>

          {/* Add Review Form */}
          <form onSubmit={handleAddReview} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800">Write a Review</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600">Your Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setNewRating(s)}
                    className="text-amber-400"
                  >
                    <Star className={`w-4 h-4 ${s <= newRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              placeholder="How was the product quality and delivery speed?"
              rows={2}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1E40AF]"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-[#1E40AF] text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Submit Review
              </button>
            </div>
          </form>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{rev.userName}</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                      Verified Purchase
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>
                <div className="flex items-center text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => navigate(`/product/${rel.id}`)}
                  className="bg-white rounded-3xl p-4 border border-slate-200/80 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center mb-3">
                    <img
                      src={rel.image}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/images/smartwatch.jpg';
                      }}
                    />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-[#1E40AF]">
                    {rel.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-extrabold text-[#1E40AF]">Le {rel.price}</span>
                    <div className="flex items-center text-amber-500 text-xs">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span className="font-bold ml-1">{rel.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Merchant Modal */}
        {contactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Message {product.sellerName}</h3>
                <button
                  onClick={() => setContactModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Inquiring regarding item: <strong className="text-slate-800">{product.title}</strong>
              </p>
              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Type your message to the merchant (e.g., availability, custom sizing, delivery queries)..."
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1E40AF]"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setContactModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setContactModalOpen(false);
                    setContactMessage('');
                    showToast('Message sent to seller! Check notifications for their response.');
                  }}
                  className="px-4 py-2 bg-[#1E40AF] text-white rounded-xl text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
