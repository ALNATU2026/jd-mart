import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Package,
  Truck,
  Heart,
  Bell,
  ArrowRight,
  Clock,
  CheckCircle,
  Star,
  User as UserIcon,
  Wallet,
  Search,
  Grid,
  ShoppingCart,
  MessageSquare,
  AlertTriangle,
  MapPin,
  Plus,
  Trash2,
  Check,
  Send,
  Eye,
  X,
  Upload,
  Phone,
  Shield,
  Briefcase,
  Store,
  Bike,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp, normalizeRole } from '../context/AppContext';
import { Product, Order, DeliveryAddress, UserReview, UserReport, ChatMessage, UserRole } from '../types';

type DashboardTab =
  | 'home'
  | 'products'
  | 'categories'
  | 'search'
  | 'cart'
  | 'wishlist'
  | 'orders'
  | 'track'
  | 'messages'
  | 'notifications'
  | 'reviews'
  | 'profile';

export const BuyerDashboardScreen: React.FC = () => {
  const {
    currentUser,
    userRoles,
    canonicalRole,
    switchRole,
    addRoleToUser,
    orders,
    products,
    categories,
    cart,
    cartTotal,
    cartCount,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    wishlist,
    toggleWishlist,
    isInWishlist,
    notifications,
    markAllNotificationsRead,
    cancelOrder,
    confirmOrderDelivery,
    deliveryAddresses,
    addDeliveryAddress,
    deleteDeliveryAddress,
    setDefaultDeliveryAddress,
    payments,
    reviews,
    submitReview,
    reports,
    submitReport,
    messages,
    sendMessage,
    updateUserProfile,
    uploadFile,
    resetPassword,
    navigate,
    showToast,
  } = useApp();

  // Active Tab
  const [activeTab, setActiveTab] = useState<DashboardTab>('home');

  // Filtering & Search inside Dashboard
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceSort, setPriceSort] = useState<'all' | 'low' | 'high'>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Tracking state
  const [trackingOrderId, setTrackingOrderId] = useState<string>('');

  // Modals state
  const [reviewModalOrder, setReviewModalOrder] = useState<Order | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');

  const [reportModalTarget, setReportModalTarget] = useState<{ id: string; name: string; type: UserReport['reportType'] } | null>(null);
  const [reportSubject, setReportSubject] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('Found better price elsewhere');

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState('Home');
  const [newAddrRecipient, setNewAddrRecipient] = useState(currentUser?.name || '');
  const [newAddrPhone, setNewAddrPhone] = useState(currentUser?.phone || '');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Freetown');
  const [newAddrNotes, setNewAddrNotes] = useState('');
  const [newAddrIsDefault, setNewAddrIsDefault] = useState(false);

  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);

  // Chat message input
  const [chatRecipient, setChatRecipient] = useState<{ id: string; name: string; role: string } | null>(null);
  const [chatMessageText, setChatMessageText] = useState('');

  // Profile Edit State
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Filtered Buyer Orders
  const buyerOrders = useMemo(() => {
    return orders.filter(
      (o) => o.buyerId === currentUser?.id || o.buyerId === 'user-buyer-1' || o.buyerId === 'guest-buyer'
    );
  }, [orders, currentUser?.id]);

  const activeDelivery = buyerOrders.find(
    (o) => o.orderStatus === 'Out for Delivery' || o.orderStatus === 'Ready for Pickup'
  );

  const savedProducts = useMemo(() => {
    return products.filter((p) => wishlist.includes(p.id));
  }, [products, wishlist]);

  // Filtered Products for Products/Search Tabs
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCat;
    }).sort((a, b) => {
      if (priceSort === 'low') return a.price - b.price;
      if (priceSort === 'high') return b.price - a.price;
      return 0;
    });
  }, [products, searchQuery, selectedCategory, priceSort]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    if (orderStatusFilter === 'all') return buyerOrders;
    return buyerOrders.filter((o) => o.orderStatus.toLowerCase() === orderStatusFilter.toLowerCase());
  }, [buyerOrders, orderStatusFilter]);

  // Active track order
  const trackedOrder = useMemo(() => {
    if (!trackingOrderId) {
      return activeDelivery || buyerOrders[0] || null;
    }
    return orders.find((o) => o.id.toLowerCase() === trackingOrderId.toLowerCase()) || null;
  }, [trackingOrderId, activeDelivery, buyerOrders, orders]);

  // User Reviews
  const myReviews = useMemo(() => {
    return reviews.filter((r) => r.buyerId === currentUser?.id || r.buyerId === 'buyer-1');
  }, [reviews, currentUser?.id]);

  // User Reports
  const myReports = useMemo(() => {
    return reports.filter((r) => r.buyerId === currentUser?.id);
  }, [reports, currentUser?.id]);

  // Conversation list
  const activeConversations = useMemo(() => {
    const list: { id: string; name: string; role: string; lastMessage: string; time: string }[] = [];
    const seen = new Set<string>();

    messages.forEach((m) => {
      const otherId = m.senderId === currentUser?.id ? m.recipientId : m.senderId;
      const otherName = m.senderId === currentUser?.id ? m.recipientName : m.senderName;
      const otherRole = m.senderId === currentUser?.id ? 'Merchant / Courier' : m.senderRole;
      if (otherId && !seen.has(otherId)) {
        seen.add(otherId);
        list.push({
          id: otherId,
          name: otherName || 'Customer Support',
          role: otherRole,
          lastMessage: m.text,
          time: m.createdAt,
        });
      }
    });

    // Provide default support desk conversation if empty
    if (list.length === 0) {
      list.push({
        id: 'seller-partner',
        name: 'JD Verified Merchant Support',
        role: 'Seller',
        lastMessage: 'Hello! How can we help you with your order delivery today?',
        time: new Date().toISOString(),
      });
      list.push({
        id: 'rider-freetown',
        name: 'Motorbike Dispatch Support',
        role: 'Courier Rider',
        lastMessage: 'Direct dispatch line for active Freetown deliveries.',
        time: new Date().toISOString(),
      });
    }
    return list;
  }, [messages, currentUser?.id]);

  // Chat messages for current recipient
  const currentChatMessages = useMemo(() => {
    if (!chatRecipient) return [];
    return messages.filter(
      (m) =>
        (m.senderId === currentUser?.id && m.recipientId === chatRecipient.id) ||
        (m.senderId === chatRecipient.id && m.recipientId === currentUser?.id)
    );
  }, [messages, currentUser?.id, chatRecipient]);

  // Handle Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setAvatarUploading(true);
      const meta = await uploadFile(file, 'user-profile', currentUser?.id);
      await updateUserProfile({ avatar: meta.downloadURL });
      showToast('Profile photo updated in real-time!');
    } catch {
      showToast('Failed to upload photo. Please check image format.');
    } finally {
      setAvatarUploading(false);
    }
  };

  // Handle Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('Name cannot be empty');
      return;
    }
    await updateUserProfile({
      name: editName.trim(),
      phone: editPhone.trim(),
    });
    showToast('Personal information updated!');
  };

  // Submit Review Handler
  const handleConfirmSubmitReview = async () => {
    if (!reviewModalOrder) return;
    const firstItem = reviewModalOrder.items[0];
    if (!firstItem) return;

    await submitReview({
      orderId: reviewModalOrder.id,
      productId: firstItem.productId,
      productTitle: firstItem.title,
      productImage: firstItem.image,
      sellerId: reviewModalOrder.sellerId,
      sellerName: reviewModalOrder.sellerName,
      buyerId: currentUser?.id || 'buyer-1',
      buyerName: currentUser?.name || 'Customer',
      rating: reviewRating,
      comment: reviewComment.trim() || 'Great genuine product, fast delivery!',
    });

    setReviewModalOrder(null);
    setReviewComment('');
  };

  // Submit Report Handler
  const handleConfirmSubmitReport = async () => {
    if (!reportModalTarget) return;
    if (!reportSubject.trim() || !reportDescription.trim()) {
      showToast('Please fill in report subject and description');
      return;
    }

    await submitReport({
      buyerId: currentUser?.id || 'buyer-1',
      buyerName: currentUser?.name || 'Customer',
      buyerEmail: currentUser?.email || '',
      reportType: reportModalTarget.type,
      targetId: reportModalTarget.id,
      targetName: reportModalTarget.name,
      subject: reportSubject.trim(),
      description: reportDescription.trim(),
    });

    setReportModalTarget(null);
    setReportSubject('');
    setReportDescription('');
  };

  // Submit Cancel Order Handler
  const handleConfirmCancelOrder = async () => {
    if (!cancelModalOrder) return;
    await cancelOrder(cancelModalOrder.id, cancelReason);
    setCancelModalOrder(null);
  };

  // Submit Add Address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet.trim() || !newAddrRecipient.trim()) {
      showToast('Please provide street address and recipient name');
      return;
    }
    await addDeliveryAddress({
      label: newAddrLabel,
      recipientName: newAddrRecipient,
      phone: newAddrPhone,
      street: newAddrStreet,
      city: newAddrCity,
      notes: newAddrNotes,
      isDefault: newAddrIsDefault,
    });
    setIsAddressModalOpen(false);
    setNewAddrStreet('');
    setNewAddrNotes('');
  };

  // Handle Multi-Role Add
  const handleAddNonAdminRole = async (targetRole: UserRole) => {
    const success = await addRoleToUser(targetRole);
    if (success) {
      setIsAddRoleModalOpen(false);
    }
  };

  // Handle Send Chat
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatRecipient || !chatMessageText.trim()) return;
    await sendMessage(chatRecipient.id, chatRecipient.name, chatMessageText.trim());
    setChatMessageText('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* TOP WELCOME BANNER WITH MULTI-ROLE & ESCROW WALLET */}
        <div className="bg-linear-to-r from-[#1E40AF] via-blue-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <img
                  src={currentUser?.avatar || '/assets/icons/account.gif'}
                  alt={currentUser?.name || 'Buyer'}
                  className="w-18 h-18 rounded-2xl border-2 border-white/40 p-1 bg-white/10 object-cover shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/icons/account.gif';
                  }}
                />
                <label className="absolute inset-0 bg-black/40 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold">
                  <Upload className="w-4 h-4 mr-1" /> Change
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={avatarUploading}
                  />
                </label>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold text-amber-300">
                    Buyer Dashboard
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Real-Time Transactions Active
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight">
                  Welcome, {currentUser ? currentUser.name : 'Valued Buyer'}!
                </h1>
                <p className="text-xs text-blue-200 mt-0.5">
                  Manage shopping, track live deliveries, contact merchants, and handle your orders in Sierra Leone.
                </p>

                {/* Role badges & switcher */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="text-[11px] text-blue-200 font-semibold">Active Role:</span>
                  <span className="px-2.5 py-0.5 bg-amber-400 text-slate-900 rounded-full text-xs font-black">
                    {canonicalRole}
                  </span>

                  {userRoles.length > 1 && (
                    <div className="flex items-center gap-1.5 ml-2">
                      <span className="text-[11px] text-blue-200 font-semibold">Switch View:</span>
                      {userRoles.map((r) => (
                        <button
                          key={r}
                          onClick={() => switchRole(r)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold transition-all ${
                            normalizeRole(r) === canonicalRole
                              ? 'bg-white text-blue-900 shadow-xs'
                              : 'bg-white/10 hover:bg-white/20 text-white'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Add Non-Admin Role Button */}
                  <button
                    onClick={() => setIsAddRoleModalOpen(true)}
                    className="ml-2 px-2.5 py-0.5 bg-blue-800 hover:bg-blue-700 text-white rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Add Seller/Employer Role
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Escrow Wallet & Cart Status */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-3 min-w-[200px]">
                <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold shrink-0">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] text-blue-200 uppercase font-bold">Escrow Wallet</p>
                  <p className="text-xl font-black text-white">Le {currentUser?.walletBalance || 0}</p>
                  <span className="text-[10px] text-emerald-300 font-semibold">● 100% Buyer Protection</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('cart')}
                className="bg-white text-slate-900 hover:bg-slate-100 rounded-2xl p-4 flex items-center gap-3 shadow-md transition-all font-bold text-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1E40AF] text-white flex items-center justify-center font-bold">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Active Cart</p>
                  <p className="text-base font-black text-[#1E40AF]">{cartCount} items</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* 12-MODULE NAVIGATION BAR AS SPECIFIED BY BRIEF */}
        <div className="bg-white rounded-2xl p-2 shadow-xs border border-slate-200/80 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max">
            {[
              { id: 'home', label: 'Home', icon: ShoppingBag },
              { id: 'products', label: 'Products', icon: Grid },
              { id: 'categories', label: 'Categories', icon: Package },
              { id: 'search', label: 'Search', icon: Search },
              { id: 'cart', label: 'Cart', icon: ShoppingCart, count: cartCount },
              { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlist.length },
              { id: 'orders', label: 'My Orders', icon: Package, count: buyerOrders.length },
              { id: 'track', label: 'Track Order', icon: Truck, alert: !!activeDelivery },
              { id: 'messages', label: 'Messages', icon: MessageSquare },
              { id: 'notifications', label: 'Notifications', icon: Bell, count: notifications.filter((n) => !n.read).length },
              { id: 'reviews', label: 'Reviews', icon: Star, count: myReviews.length },
              { id: 'profile', label: 'Profile', icon: UserIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as DashboardTab)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                    isActive
                      ? 'bg-[#1E40AF] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                        isActive ? 'bg-amber-400 text-slate-900' : 'bg-blue-100 text-[#1E40AF]'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                  {tab.alert && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute top-2 right-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB CONTENT MODULES */}

        {/* 1. HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Live shipment notice */}
            {activeDelivery && (
              <div className="bg-amber-500 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white text-amber-600 flex items-center justify-center font-bold shrink-0 animate-pulse">
                    <Truck className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                      Motorbike Dispatch En Route
                    </span>
                    <h3 className="text-lg font-black mt-1">Order {activeDelivery.id} is heading to you!</h3>
                    <p className="text-xs text-amber-100">
                      Rider: {activeDelivery.riderName || 'Samuel Bangura'} ({activeDelivery.riderPhone || '+232 79 334455'})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setTrackingOrderId(activeDelivery.id);
                      setActiveTab('track');
                    }}
                    className="px-5 py-2.5 bg-white text-amber-800 hover:bg-amber-50 font-bold rounded-xl text-xs transition-colors shadow-xs"
                  >
                    Track Live Shipment
                  </button>
                  <button
                    onClick={() => confirmOrderDelivery(activeDelivery.id)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                  >
                    Confirm Receipt
                  </button>
                </div>
              </div>
            )}

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveTab('orders')}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs cursor-pointer hover:border-blue-400 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Total Orders</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E40AF] flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-800 mt-2">{buyerOrders.length}</p>
                <span className="text-[11px] text-blue-600 font-semibold hover:underline">View History →</span>
              </div>

              <div
                onClick={() => setActiveTab('wishlist')}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs cursor-pointer hover:border-pink-400 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Saved Wishlist</span>
                  <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-800 mt-2">{wishlist.length}</p>
                <span className="text-[11px] text-pink-600 font-semibold hover:underline">View Items →</span>
              </div>

              <div
                onClick={() => setActiveTab('messages')}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs cursor-pointer hover:border-purple-400 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Messages</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-800 mt-2">{messages.length}</p>
                <span className="text-[11px] text-purple-600 font-semibold hover:underline">Open Inbox →</span>
              </div>

              <div
                onClick={() => setActiveTab('reviews')}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs cursor-pointer hover:border-amber-400 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Reviews Given</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Star className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-800 mt-2">{myReviews.length}</p>
                <span className="text-[11px] text-amber-600 font-semibold hover:underline">My Ratings →</span>
              </div>
            </div>

            {/* Quick Actions & Recent Orders Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders Overview */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-800">Recent Purchase Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#1E40AF] font-bold hover:underline"
                  >
                    View All ({buyerOrders.length})
                  </button>
                </div>

                {buyerOrders.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl">
                    <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-600">No purchase orders placed yet</p>
                    <p className="text-xs text-slate-400 mt-1">Discover products from verified Sierra Leone sellers</p>
                    <button
                      onClick={() => setActiveTab('products')}
                      className="mt-4 px-4 py-2 bg-[#1E40AF] text-white rounded-xl text-xs font-bold hover:bg-blue-700"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {buyerOrders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="p-4 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1E40AF] flex items-center justify-center font-black text-xs shrink-0">
                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-800">{order.id}</span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  order.orderStatus === 'Delivered'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : order.orderStatus === 'Cancelled'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {order.orderStatus}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">
                              {order.items.map((i) => i.title).join(', ')}
                            </p>
                            <p className="text-[11px] text-slate-400">Total: Le {order.total} • {order.createdAt}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => {
                              setTrackingOrderId(order.id);
                              setActiveTab('track');
                            }}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1E40AF] rounded-lg text-xs font-bold"
                          >
                            Track
                          </button>
                          {order.orderStatus === 'Delivered' && (
                            <button
                              onClick={() => setReviewModalOrder(order)}
                              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-bold flex items-center gap-1"
                            >
                              <Star className="w-3 h-3" /> Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Delivery Address & Helpline Box */}
              <div className="space-y-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#1E40AF]" /> Default Delivery Address
                    </h3>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="text-xs text-[#1E40AF] font-bold hover:underline"
                    >
                      Manage
                    </button>
                  </div>
                  {deliveryAddresses[0] ? (
                    <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-slate-800">
                        {deliveryAddresses[0].label} ({deliveryAddresses[0].recipientName})
                      </span>
                      <p className="text-slate-600">{deliveryAddresses[0].street}, {deliveryAddresses[0].city}</p>
                      <p className="text-slate-500 text-[11px]">Phone: {deliveryAddresses[0].phone}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No saved address found.</p>
                  )}
                </div>

                <div className="bg-linear-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-6 shadow-md space-y-3">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase">
                    <Shield className="w-4 h-4" /> JD Mart Buyer Protection
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    All transactions are protected by JD Mart Escrow. Funds are released to merchants only after you inspect and confirm package delivery.
                  </p>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span>Help Line:</span>
                    <strong className="text-white">+232 76 123456</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Products Grid */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-800">Recommended Marketplace Products</h3>
                  <p className="text-xs text-slate-400">Verified products with nationwide dispatch</p>
                </div>
                <button
                  onClick={() => setActiveTab('products')}
                  className="text-xs text-[#1E40AF] font-bold hover:underline"
                >
                  Browse Full Catalog →
                </button>
              </div>

              {products.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Loading marketplace catalog...</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {products.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      className="rounded-2xl border border-slate-100 hover:border-slate-300 p-3 bg-white transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-full h-32 rounded-xl bg-slate-100 overflow-hidden relative mb-2">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/icons/store.png';
                            }}
                          />
                          <button
                            onClick={() => toggleWishlist(p.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-xs text-slate-600 hover:text-pink-600"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                isInWishlist(p.id) ? 'fill-pink-600 text-pink-600' : ''
                              }`}
                            />
                          </button>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{p.category}</span>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mt-0.5">{p.title}</h4>
                        <p className="text-xs font-black text-[#1E40AF] mt-1">Le {p.price}</p>
                      </div>

                      <button
                        onClick={() => {
                          addToCart(p);
                          showToast(`Added ${p.title} to cart`);
                        }}
                        className="mt-3 w-full py-1.5 bg-blue-50 hover:bg-[#1E40AF] text-[#1E40AF] hover:text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Marketplace Catalog</h2>
                <p className="text-xs text-slate-500">Browse and purchase products with real-time checkout</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1E40AF] w-44 sm:w-56"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1E40AF]"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value as any)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1E40AF]"
                >
                  <option value="all">Sort: Featured</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-600">No products match your criteria</p>
                <p className="text-xs text-slate-400 mt-1">Try resetting filters or clear search</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-2xl border border-slate-100 hover:border-slate-300 p-3 bg-white transition-all flex flex-col justify-between shadow-2xs hover:shadow-md"
                  >
                    <div>
                      <div className="w-full h-36 rounded-xl bg-slate-100 overflow-hidden relative mb-2">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/icons/store.png';
                          }}
                        />
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-xs text-slate-600 hover:text-pink-600"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              isInWishlist(p.id) ? 'fill-pink-600 text-pink-600' : ''
                            }`}
                          />
                        </button>
                      </div>

                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {p.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-2 mt-0.5">{p.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Sold by <strong className="text-slate-700">{p.sellerName || 'Verified Merchant'}</strong>
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{p.rating || 5.0}</span>
                        <span className="text-slate-400 font-normal">({p.reviewsCount || 12})</span>
                      </div>
                      <p className="text-sm font-black text-[#1E40AF] mt-1.5">Le {p.price}</p>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => {
                          addToCart(p);
                          showToast(`Added ${p.title} to cart`);
                        }}
                        className="flex-1 py-2 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => {
                          setReportModalTarget({ id: p.id, name: p.title, type: 'product' });
                        }}
                        title="Report Item"
                        className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Product Categories</h2>
              <p className="text-xs text-slate-500">Explore products grouped by sector in Sierra Leone</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setActiveTab('products');
                  }}
                  className="p-4 rounded-2xl border border-slate-100 hover:border-[#1E40AF] hover:bg-blue-50/50 transition-all cursor-pointer flex flex-col items-center text-center group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#1E40AF] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <img
                      src={cat.icon}
                      alt={cat.name}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/icons/categories.png';
                      }}
                    />
                  </div>
                  <h4 className="text-xs font-black text-slate-800 group-hover:text-[#1E40AF]">{cat.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{cat.description}</p>
                  <span className="text-[10px] text-blue-600 font-bold mt-2">Browse Catalog →</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SEARCH TAB */}
        {activeTab === 'search' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Live Search & Filter</h2>
              <p className="text-xs text-slate-500">Search genuine products, sellers, or categories</p>
            </div>

            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search products by title, keywords, or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-sm rounded-2xl border border-slate-200 focus:outline-hidden focus:border-[#1E40AF] shadow-xs"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-400 py-1">Popular:</span>
              {['Smartphones', 'Laptops', 'Fashion', 'Groceries', 'Generators', 'Solar'].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="px-3 py-1 bg-slate-100 hover:bg-blue-100 hover:text-[#1E40AF] text-slate-600 rounded-full text-xs font-semibold"
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {filteredProducts.slice(0, 8).map((p) => (
                <div key={p.id} className="p-3 rounded-2xl border border-slate-100 bg-white">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-32 object-cover rounded-xl mb-2"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/icons/store.png';
                    }}
                  />
                  <h5 className="text-xs font-bold text-slate-800 line-clamp-1">{p.title}</h5>
                  <p className="text-xs font-black text-[#1E40AF]">Le {p.price}</p>
                  <button
                    onClick={() => {
                      addToCart(p);
                      showToast(`Added ${p.title} to cart`);
                    }}
                    className="mt-2 w-full py-1.5 bg-[#1E40AF] text-white rounded-lg text-xs font-bold"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. CART TAB */}
        {activeTab === 'cart' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Your Shopping Cart</h2>
                <p className="text-xs text-slate-500">Review selected items and proceed to real-time checkout</p>
              </div>
              {cart.length > 0 && (
                <button onClick={clearCart} className="text-xs text-rose-600 font-bold hover:underline">
                  Clear All
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">Your cart is currently empty</p>
                <p className="text-xs text-slate-400 mt-1">Explore items in the marketplace</p>
                <button
                  onClick={() => setActiveTab('products')}
                  className="mt-4 px-5 py-2.5 bg-[#1E40AF] text-white rounded-xl text-xs font-bold hover:bg-blue-700"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-4 rounded-2xl border border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/icons/store.png';
                          }}
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.product.title}</h4>
                          <p className="text-xs font-black text-[#1E40AF] mt-0.5">Le {item.product.price}</p>
                          <p className="text-[10px] text-slate-400">Merchant: {item.product.sellerName || 'Verified Store'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-slate-200 bg-white rounded-lg">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="px-2.5 py-1 text-xs font-bold hover:bg-slate-100"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="px-2.5 py-1 text-xs font-bold hover:bg-slate-100"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3 h-fit">
                  <h3 className="text-sm font-black text-slate-800">Order Summary</h3>
                  <div className="space-y-1.5 text-xs text-slate-600 border-b border-slate-200 pb-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <strong className="text-slate-900">Le {cartTotal}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Standard Dispatch</span>
                      <strong className="text-slate-900">Le 15</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Escrow Protection Fee</span>
                      <strong className="text-slate-900">Le 5</strong>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-1">
                    <span>Total Due</span>
                    <span className="text-[#1E40AF]">Le {cartTotal + 20}</span>
                  </div>
                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full py-3 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    Proceed to Real-Time Checkout <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Saved Wishlist Items</h2>
              <p className="text-xs text-slate-500">Products you have saved for later</p>
            </div>

            {savedProducts.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">Your wishlist is empty</p>
                <p className="text-xs text-slate-400 mt-1">Tap the heart on any product to save it here</p>
                <button
                  onClick={() => setActiveTab('products')}
                  className="mt-4 px-5 py-2.5 bg-[#1E40AF] text-white rounded-xl text-xs font-bold hover:bg-blue-700"
                >
                  Browse Marketplace
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {savedProducts.map((p) => (
                  <div key={p.id} className="p-3 rounded-2xl border border-slate-100 bg-white flex flex-col justify-between">
                    <div>
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-32 object-cover rounded-xl mb-2"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/icons/store.png';
                        }}
                      />
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{p.title}</h4>
                      <p className="text-xs font-black text-[#1E40AF] mt-1">Le {p.price}</p>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => {
                          addToCart(p);
                          showToast(`Moved ${p.title} to cart`);
                        }}
                        className="flex-1 py-1.5 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
                      >
                        Move to Cart
                      </button>
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 7. MY ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Purchase Orders History</h2>
                <p className="text-xs text-slate-500">Track shipments, confirm deliveries, cancel orders or rate products</p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                {['all', 'confirmed', 'processing', 'out for delivery', 'delivered', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold capitalize transition-colors ${
                      orderStatusFilter === status
                        ? 'bg-[#1E40AF] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-600">No orders found matching filter</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const isEligibleForCancel = order.orderStatus === 'Pending' || order.orderStatus === 'Confirmed';
                  return (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all bg-white space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-800">Order #{order.id}</span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                                order.orderStatus === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.orderStatus === 'Cancelled'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {order.orderStatus}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">Placed on: {order.createdAt}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-slate-400">Total Escrow Amount</p>
                          <p className="text-base font-black text-[#1E40AF]">Le {order.total}</p>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-12 h-12 rounded-lg object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/assets/icons/store.png';
                              }}
                            />
                            <div className="overflow-hidden">
                              <h5 className="text-xs font-bold text-slate-800 truncate">{item.title}</h5>
                              <p className="text-[11px] text-slate-500">
                                {item.quantity}x • Le {item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Timeline snapshot */}
                      <div className="bg-blue-50/50 p-3 rounded-xl flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-medium">
                          Latest Timeline: <strong>{order.timeline[order.timeline.length - 1]?.description || 'Order placed'}</strong>
                        </span>
                        <span className="text-slate-400 text-[11px]">{order.timeline[order.timeline.length - 1]?.timestamp}</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setTrackingOrderId(order.id);
                              setActiveTab('track');
                            }}
                            className="px-3.5 py-1.5 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                          >
                            <Truck className="w-3.5 h-3.5" /> Track Live
                          </button>

                          {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                            <button
                              onClick={() => confirmOrderDelivery(order.id)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Confirm Receipt
                            </button>
                          )}

                          {order.orderStatus === 'Delivered' && (
                            <button
                              onClick={() => setReviewModalOrder(order)}
                              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                            >
                              <Star className="w-3.5 h-3.5" /> Rate & Review
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setChatRecipient({ id: order.sellerId, name: order.sellerName, role: 'Seller' });
                              setActiveTab('messages');
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5" /> Message Seller
                          </button>

                          <button
                            onClick={() => {
                              setReportModalTarget({ id: order.id, name: `Order #${order.id}`, type: 'delivery' });
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" /> Report Issue
                          </button>

                          {isEligibleForCancel && (
                            <button
                              onClick={() => setCancelModalOrder(order)}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 8. TRACK ORDER TAB */}
        {activeTab === 'track' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Real-Time Order Tracking</h2>
                <p className="text-xs text-slate-500">Live courier dispatch timeline across Freetown & Sierra Leone</p>
              </div>

              {/* Order selector dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Select Order:</span>
                <select
                  value={trackingOrderId || trackedOrder?.id || ''}
                  onChange={(e) => setTrackingOrderId(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1E40AF] font-bold"
                >
                  {buyerOrders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.id} ({o.orderStatus})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {!trackedOrder ? (
              <div className="text-center py-12">
                <Truck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No active orders to track</p>
                <p className="text-xs text-slate-400 mt-1">Place an order in the catalog to follow live delivery status</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Status Hero Card */}
                <div className="p-6 rounded-2xl bg-linear-to-r from-blue-900 to-indigo-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold text-amber-300 uppercase">
                      Current Status: {trackedOrder.orderStatus}
                    </span>
                    <h3 className="text-xl font-black mt-2">Order {trackedOrder.id}</h3>
                    <p className="text-xs text-blue-200">
                      Destination: {trackedOrder.buyerAddress}, {trackedOrder.buyerCity}
                    </p>
                    <p className="text-xs text-amber-300 mt-1">Estimated Delivery: {trackedOrder.estimatedDelivery}</p>
                  </div>

                  {trackedOrder.riderName && (
                    <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/20 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
                        <Bike className="w-5 h-5" />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-white">{trackedOrder.riderName}</p>
                        <p className="text-blue-200">{trackedOrder.riderPhone || '+232 79 000000'}</p>
                        <button
                          onClick={() => {
                            setChatRecipient({ id: trackedOrder.riderId || 'rider-1', name: trackedOrder.riderName || 'Rider', role: 'Courier Rider' });
                            setActiveTab('messages');
                          }}
                          className="mt-1 px-2.5 py-0.5 bg-white text-blue-900 rounded-md font-bold text-[10px]"
                        >
                          Chat with Rider
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step Visual Timeline */}
                <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
                  <h4 className="text-sm font-black text-slate-800">Dispatch Progress</h4>
                  <div className="relative border-l-2 border-blue-500 ml-4 pl-6 space-y-6">
                    {trackedOrder.timeline.map((step, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-xs" />
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{step.status}</span>
                          <span className="text-[10px] text-slate-400">{step.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 9. MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Communication Center</h2>
              <p className="text-xs text-slate-500">Real-time chats with sellers, dispatch riders, and dispute support</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px]">
              {/* Conversation list */}
              <div className="border border-slate-200 rounded-2xl overflow-y-auto divide-y divide-slate-100">
                <div className="p-3 bg-slate-50 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Active Conversations
                </div>
                {activeConversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setChatRecipient({ id: c.id, name: c.name, role: c.role })}
                    className={`w-full text-left p-3.5 transition-colors flex flex-col gap-1 ${
                      chatRecipient?.id === c.id ? 'bg-blue-50/70 border-l-4 border-[#1E40AF]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800">{c.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded-full font-bold">
                        {c.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{c.lastMessage}</p>
                  </button>
                ))}
              </div>

              {/* Chat Window */}
              <div className="md:col-span-2 border border-slate-200 rounded-2xl flex flex-col justify-between overflow-hidden">
                {/* Chat Header */}
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1E40AF] text-white flex items-center justify-center font-bold text-xs">
                      {chatRecipient ? chatRecipient.name.charAt(0) : 'JD'}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800">
                        {chatRecipient ? chatRecipient.name : 'Select a conversation'}
                      </h4>
                      <p className="text-[10px] text-emerald-600 font-semibold">● Online in Sierra Leone</p>
                    </div>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
                  {currentChatMessages.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 text-xs">
                      Send a message to start direct communication with {chatRecipient?.name || 'the seller'}.
                    </div>
                  ) : (
                    currentChatMessages.map((m) => {
                      const isMe = m.senderId === currentUser?.id;
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`p-3 rounded-2xl text-xs max-w-sm ${
                              isMe ? 'bg-[#1E40AF] text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-2xs'
                            }`}
                          >
                            <p>{m.text}</p>
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 px-1">
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Message Input Box */}
                <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type your message to merchant / courier..."
                    value={chatMessageText}
                    onChange={(e) => setChatMessageText(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1E40AF]"
                  />
                  <button
                    type="submit"
                    disabled={!chatMessageText.trim()}
                    className="p-2.5 bg-[#1E40AF] hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 10. NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Notifications & Alerts</h2>
                <p className="text-xs text-slate-500">Live order confirmations, rider updates, and promotions</p>
              </div>
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-[#1E40AF] font-bold hover:underline"
              >
                Mark all as read
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-600">No notifications at the moment</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                      n.read ? 'bg-white border-slate-100' : 'bg-blue-50/50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1E40AF] flex items-center justify-center shrink-0 mt-0.5">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-800">{n.title}</h4>
                        <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                    {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-[#1E40AF] shrink-0 mt-1" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 11. REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900">Your Ratings & Reviews</h2>
              <p className="text-xs text-slate-500">View and manage reviews you submitted for delivered products</p>
            </div>

            {myReviews.length === 0 ? (
              <div className="text-center py-12">
                <Star className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-600">No reviews submitted yet</p>
                <p className="text-xs text-slate-400 mt-1">Once your orders are delivered, you can review them in My Orders</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myReviews.map((r) => (
                  <div key={r.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-800">{r.productTitle}</h4>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{r.comment}"</p>
                    <p className="text-[10px] text-slate-400">
                      Seller: {r.sellerName} • {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 12. PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Account Info Form */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-black text-slate-900">Buyer Account Settings</h2>
                <p className="text-xs text-slate-500">Manage personal details, phone numbers, and security</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1E40AF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1E40AF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={currentUser?.email || ''}
                    disabled
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Verified through Firebase Authentication
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (currentUser?.email) {
                        resetPassword(currentUser.email);
                      }
                    }}
                    className="text-xs text-[#1E40AF] font-bold hover:underline"
                  >
                    Send Password Reset Link
                  </button>
                </div>
              </form>

              {/* Delivery Addresses Management */}
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-800">Saved Delivery Addresses</h3>
                    <p className="text-xs text-slate-400">Multiple addresses for quick checkout</p>
                  </div>
                  <button
                    onClick={() => setIsAddressModalOpen(true)}
                    className="px-3 py-1.5 bg-blue-50 text-[#1E40AF] hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Address
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {deliveryAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        addr.isDefault ? 'border-[#1E40AF] bg-blue-50/30' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-800">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.2 rounded-full bg-[#1E40AF] text-white text-[9px] font-extrabold">
                              Default
                            </span>
                          )}
                        </div>
                        {deliveryAddresses.length > 1 && (
                          <button
                            onClick={() => deleteDeliveryAddress(addr.id)}
                            className="text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-2 font-medium">{addr.recipientName}</p>
                      <p className="text-xs text-slate-500">{addr.street}, {addr.city}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Phone: {addr.phone}</p>

                      {!addr.isDefault && (
                        <button
                          onClick={() => setDefaultDeliveryAddress(addr.id)}
                          className="mt-3 text-[11px] text-[#1E40AF] font-bold hover:underline"
                        >
                          Set as Default Address
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Roles & Security Card */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-base font-black text-slate-800">Your Roles & Permissions</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-xs font-bold text-slate-500 uppercase">Assigned Roles</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {userRoles.map((r) => (
                        <span key={r} className="px-2.5 py-0.5 bg-blue-100 text-[#1E40AF] rounded-full text-xs font-bold">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                  <strong className="block font-bold">Role-Based Protection:</strong>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Users cannot self-assign Administrator privileges. Administrator access requires verified authentication credentials and security rule validation.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddRoleModalOpen(true)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Become Seller, Rider or Employer
                </button>
              </div>

              {/* Reports History */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
                <h3 className="text-sm font-black text-slate-800">Your Submitted Complaints</h3>
                {myReports.length === 0 ? (
                  <p className="text-xs text-slate-400">No open complaints or reports.</p>
                ) : (
                  <div className="space-y-2">
                    {myReports.map((rep) => (
                      <div key={rep.id} className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-0.5">
                        <div className="flex justify-between">
                          <span className="font-bold text-slate-800">{rep.subject}</span>
                          <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-full font-bold">
                            {rep.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{rep.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* REVIEW MODAL */}
      {reviewModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-800">Write a Review</h3>
              <button onClick={() => setReviewModalOrder(null)} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <p className="text-xs text-slate-500">Order #{reviewModalOrder.id} • {reviewModalOrder.items[0]?.title}</p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setReviewRating(s)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-6 h-6 ${s <= reviewRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Feedback</label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience regarding product quality and dispatch speed..."
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1E40AF]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setReviewModalOrder(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmitReview}
                className="px-4 py-2 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT ISSUE MODAL */}
      {reportModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-800">Report an Issue</h3>
              <button onClick={() => setReportModalTarget(null)} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <p className="text-xs text-slate-500">Reporting: <strong>{reportModalTarget.name}</strong></p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                value={reportSubject}
                onChange={(e) => setReportSubject(e.target.value)}
                placeholder="e.g. Delayed delivery / Damaged item / Wrong seller info"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1E40AF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Details & Complaint</label>
              <textarea
                rows={3}
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Please describe the issue in detail for moderation..."
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1E40AF]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setReportModalTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmitReport}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL ORDER MODAL */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-800">Cancel Order #{cancelModalOrder.id}</h3>
              <button onClick={() => setCancelModalOrder(null)} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Eligible orders can be cancelled before dispatch pickup. Escrow funds will be refunded to your balance.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1E40AF]"
              >
                <option value="Found better price elsewhere">Found better price elsewhere</option>
                <option value="Changed delivery address">Need to change delivery address</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Delivery time too long">Delivery time too long</option>
                <option value="Other reason">Other reason</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCancelModalOrder(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Keep Order
              </button>
              <button
                onClick={handleConfirmCancelOrder}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD DELIVERY ADDRESS MODAL */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-800">Add New Delivery Address</h3>
              <button onClick={() => setIsAddressModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Address Label</label>
                  <select
                    value={newAddrLabel}
                    onChange={(e) => setNewAddrLabel(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden"
                  >
                    <option value="Home">Home</option>
                    <option value="Office / Work">Office / Work</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Family">Family</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">City</label>
                  <select
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden"
                  >
                    <option value="Freetown">Freetown</option>
                    <option value="Bo">Bo</option>
                    <option value="Kenema">Kenema</option>
                    <option value="Makeni">Makeni</option>
                    <option value="Koidu">Koidu</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={newAddrRecipient}
                  onChange={(e) => setNewAddrRecipient(e.target.value)}
                  placeholder="Full name of person receiving package"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={newAddrStreet}
                  onChange={(e) => setNewAddrStreet(e.target.value)}
                  placeholder="e.g. 24 Wilkinson Road, Lumley"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newAddrPhone}
                  onChange={(e) => setNewAddrPhone(e.target.value)}
                  placeholder="+232 7X XXXXXX"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Landmark Notes (Optional)</label>
                <input
                  type="text"
                  value={newAddrNotes}
                  onChange={(e) => setNewAddrNotes(e.target.value)}
                  placeholder="Near supermarket, blue gate..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="defaultAddress"
                  checked={newAddrIsDefault}
                  onChange={(e) => setNewAddrIsDefault(e.target.checked)}
                  className="rounded-sm text-[#1E40AF]"
                />
                <label htmlFor="defaultAddress" className="text-xs text-slate-700 font-semibold cursor-pointer">
                  Set as default delivery address
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NON-ADMIN ROLE MODAL */}
      {isAddRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-800">Add Account Role</h3>
              <button onClick={() => setIsAddRoleModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Expand your JD Mart account capabilities. Multi-role accounts allow you to switch seamlessly between buying and selling or hiring.
            </p>

            <div className="space-y-3 pt-2">
              <div
                onClick={() => handleAddNonAdminRole('SELLER')}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Seller Hub</h4>
                    <p className="text-[11px] text-slate-500">List products, manage inventory & receive escrow payments</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
              </div>

              <div
                onClick={() => handleAddNonAdminRole('EMPLOYER')}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/40 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Employer Portal</h4>
                    <p className="text-[11px] text-slate-500">Post jobs, review applicant resumes & hire talent</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-600" />
              </div>

              <div
                onClick={() => handleAddNonAdminRole('DISPATCH_RIDER')}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Courier Dispatch Rider</h4>
                    <p className="text-[11px] text-slate-500">Accept delivery jobs & earn delivery fees across towns</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-600" />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 border border-slate-100">
              * Note: Administrator privileges are strictly protected and can only be provisioned by root system authorization.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
