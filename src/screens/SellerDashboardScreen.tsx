import React, { useState, useMemo, useRef } from 'react';
import {
  Store,
  Package,
  TrendingUp,
  DollarSign,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Star,
  MessageSquare,
  Bell,
  Settings,
  ArrowRight,
  ShoppingBag,
  Truck,
  Upload,
  Search,
  Filter,
  Eye,
  Trash2,
  Edit,
  ExternalLink,
  ChevronRight,
  MapPin,
  Phone,
  Send,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  Check,
  X,
  CreditCard,
  FileText,
  BadgeAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, Order, Store as StoreType, UserReview, SellerPayout } from '../types';

type SellerTab =
  | 'overview'
  | 'mystore'
  | 'products'
  | 'addproduct'
  | 'inventory'
  | 'orders'
  | 'customers'
  | 'sales'
  | 'earnings'
  | 'payouts'
  | 'reviews'
  | 'messages'
  | 'notifications'
  | 'settings';

export const SellerDashboardScreen: React.FC = () => {
  const {
    currentUser,
    currentStore,
    stores,
    updateStore,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    toggleProductStatus,
    orders,
    updateOrderStatus,
    reviews,
    respondToReview,
    payouts,
    requestPayout,
    messages,
    sendMessage,
    notifications,
    markAllNotificationsRead,
    uploadFile,
    generateAIDescription,
    navigate,
    showToast,
  } = useApp();

  // Active Tab
  const [activeTab, setActiveTab] = useState<SellerTab>('overview');

  // Product Filter State
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStatusFilter, setProductStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Orders Filter State
  const [orderFilter, setOrderFilter] = useState<string>('all');

  // Inventory Filter State
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'low' | 'out'>('all');

  // Add Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Electronics');
  const [newPrice, setNewPrice] = useState<number | ''>('');
  const [newOldPrice, setNewOldPrice] = useState<number | ''>('');
  const [newStock, setNewStock] = useState<number | ''>(10);
  const [newCondition, setNewCondition] = useState<'Brand New' | 'Refurbished' | 'Fair'>('Brand New');
  const [newDescription, setNewDescription] = useState('');
  const [newDeliveryAvailable, setNewDeliveryAvailable] = useState(true);
  const [newProductImages, setNewProductImages] = useState<string[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isUploadingProductImg, setIsUploadingProductImg] = useState(false);
  const productImgInputRef = useRef<HTMLInputElement>(null);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Order Details & Cancellation State
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<Order | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState('Out of stock / unable to fulfill');

  // Payout Request State
  const [payoutAmount, setPayoutAmount] = useState<number | ''>('');
  const [payoutMethod, setPayoutMethod] = useState<SellerPayout['method']>('Orange Money');
  const [payoutAccountNum, setPayoutAccountNum] = useState(
    currentStore?.bankDetails?.momoNumber || currentUser?.phone || ''
  );
  const [payoutAccountHolder, setPayoutAccountHolder] = useState(
    currentStore?.bankDetails?.accountName || currentUser?.name || ''
  );

  // Review Response State
  const [replyReviewId, setReplyReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Chat State
  const [chatRecipient, setChatRecipient] = useState<{ id: string; name: string } | null>(null);
  const [chatInputText, setChatInputText] = useState('');

  // Settings State
  const [settingsName, setSettingsName] = useState(currentStore?.name || '');
  const [settingsDescription, setSettingsDescription] = useState(currentStore?.description || '');
  const [settingsPhone, setSettingsPhone] = useState(currentStore?.phone || '');
  const [settingsLocation, setSettingsLocation] = useState(currentStore?.location || '');
  const [settingsMomo, setSettingsMomo] = useState(currentStore?.bankDetails?.momoNumber || '');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Identify seller store and seller products
  const activeSellerStore = currentStore || stores[0] || null;

  const sellerProducts = useMemo(() => {
    return products.filter(
      (p) =>
        !currentUser ||
        p.sellerId === currentUser.id ||
        (activeSellerStore && p.sellerId === activeSellerStore.id) ||
        p.sellerName === activeSellerStore?.name
    );
  }, [products, currentUser?.id, activeSellerStore]);

  const sellerOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        !currentUser ||
        o.sellerId === currentUser.id ||
        (activeSellerStore && o.sellerId === activeSellerStore.id) ||
        o.sellerName === activeSellerStore?.name
    );
  }, [orders, currentUser?.id, activeSellerStore]);

  // Statistics
  const grossSales = sellerOrders.reduce((sum, o) => (o.orderStatus !== 'Cancelled' ? sum + o.total : sum), 0);
  const commissionRate = 0.05; // 5% JD Mart platform commission
  const platformCommission = Math.round(grossSales * commissionRate);
  const netEarnings = grossSales - platformCommission;
  const totalPaidOut = payouts
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingPayouts = payouts
    .filter((p) => p.status === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);
  const availablePayoutBalance = Math.max(0, netEarnings - totalPaidOut - pendingPayouts);

  const lowStockCount = sellerProducts.filter((p) => p.stock > 0 && p.stock < 5).length;
  const outOfStockCount = sellerProducts.filter((p) => p.stock === 0).length;
  const pendingOrdersCount = sellerOrders.filter(
    (o) => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed'
  ).length;

  // Seller Reviews
  const sellerReviews = useMemo(() => {
    return reviews.filter(
      (r) =>
        r.sellerId === currentUser?.id ||
        (activeSellerStore && r.sellerId === activeSellerStore.id) ||
        sellerProducts.some((p) => p.id === r.productId)
    );
  }, [reviews, currentUser?.id, activeSellerStore, sellerProducts]);

  const averageRating = useMemo(() => {
    if (sellerReviews.length === 0) return 5.0;
    const sum = sellerReviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / sellerReviews.length).toFixed(1));
  }, [sellerReviews]);

  // Unique Customers
  const customerList = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; city: string; orderCount: number; totalSpent: number }>();
    sellerOrders.forEach((o) => {
      const key = o.buyerPhone || o.buyerName;
      if (!map.has(key)) {
        map.set(key, {
          name: o.buyerName,
          phone: o.buyerPhone,
          city: o.buyerCity,
          orderCount: 1,
          totalSpent: o.total,
        });
      } else {
        const item = map.get(key)!;
        item.orderCount += 1;
        item.totalSpent += o.total;
      }
    });
    return Array.from(map.values());
  }, [sellerOrders]);

  // Check if Seller is Pending Approval or Not Applied
  if (currentStore && currentStore.status !== 'active') {
    return (
      <div className="min-h-screen bg-[#F5F7FB] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto animate-pulse">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider">
              {currentStore.status === 'pending' ? 'Application Under Review' : 'Status: ' + currentStore.status}
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-2">
              Seller Dashboard Locked
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Your merchant storefront <strong>"{currentStore.name}"</strong> is currently awaiting administrative certification.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => navigate('/seller/onboard')}
              className="w-full py-3 bg-[#1E40AF] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
            >
              View Application Status & Documents
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
            >
              Return to Buyer Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle Multiple Product Image Uploads
  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      setIsUploadingProductImg(true);
      const uploadPromises = Array.from(files).map((f) =>
        uploadFile(f, 'product-image', currentUser?.id)
      );
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map((r) => r.downloadURL);
      setNewProductImages((prev) => [...prev, ...newUrls]);
      showToast(`${results.length} product image(s) uploaded to Cloud Storage!`);
    } catch {
      showToast('Error uploading product images. Please try again.');
    } finally {
      setIsUploadingProductImg(false);
    }
  };

  // Generate AI Description
  const handleGenerateAIDesc = async () => {
    if (!newTitle.trim()) {
      showToast('Please enter a product title first');
      return;
    }
    try {
      setIsGeneratingAI(true);
      const desc = await generateAIDescription(newTitle.trim(), newCategory);
      setNewDescription(desc);
      showToast('AI Description generated!');
    } catch {
      showToast('AI Description service unavailable');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Handle Add Product Submit
  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newPrice === '' || Number(newPrice) <= 0) {
      showToast('Please provide product title and a valid price');
      return;
    }

    const primaryImage =
      newProductImages.length > 0
        ? newProductImages[0]
        : '/assets/icons/store.png';

    await addProduct({
      title: newTitle.trim(),
      price: Number(newPrice),
      oldPrice: newOldPrice !== '' ? Number(newOldPrice) : undefined,
      discount: newOldPrice && Number(newOldPrice) > Number(newPrice) ? '15%' : undefined,
      image: primaryImage,
      images: newProductImages.length > 0 ? newProductImages : [primaryImage],
      category: newCategory,
      description: newDescription.trim() || `High quality ${newTitle.trim()} from verified JD Mart merchant.`,
      stock: newStock !== '' ? Math.max(0, Number(newStock)) : 10,
      sellerId: currentUser?.id || activeSellerStore?.id || 'seller-partner',
      sellerName: activeSellerStore?.name || currentUser?.name || 'Verified Merchant',
      sellerLocation: activeSellerStore?.location || 'Freetown',
      sellerRating: averageRating,
      condition: newCondition,
      rating: 5.0,
      reviewsCount: 0,
      status: 'active',
      deliveryAvailable: newDeliveryAvailable,
      salesCount: 0,
      viewsCount: 1,
    });

    // Reset Form
    setNewTitle('');
    setNewPrice('');
    setNewOldPrice('');
    setNewStock(10);
    setNewDescription('');
    setNewProductImages([]);
    setActiveTab('products');
  };

  // Handle Save Edit Product
  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    await updateProduct(editingProduct.id, {
      title: editingProduct.title,
      price: editingProduct.price,
      stock: editingProduct.stock,
      category: editingProduct.category,
      condition: editingProduct.condition,
      description: editingProduct.description,
    });
    setEditingProduct(null);
  };

  // Handle Payout Request Submit
  const handleRequestPayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(payoutAmount);
    if (!amount || amount <= 0) {
      showToast('Please enter a valid payout amount');
      return;
    }
    if (amount > availablePayoutBalance) {
      showToast(`Cannot request Le ${amount}. Available balance is Le ${availablePayoutBalance}`);
      return;
    }
    if (!payoutAccountNum.trim()) {
      showToast('Please enter your payout mobile money number');
      return;
    }

    await requestPayout(amount, payoutMethod, payoutAccountNum.trim(), payoutAccountHolder.trim());
    setPayoutAmount('');
  };

  // Handle Submit Reply to Review
  const handleSubmitReviewReply = async (reviewId: string) => {
    if (!replyText.trim()) return;
    await respondToReview(reviewId, replyText.trim());
    setReplyReviewId(null);
    setReplyText('');
  };

  // Handle Save Store Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSellerStore) return;
    await updateStore(activeSellerStore.id, {
      name: settingsName.trim() || activeSellerStore.name,
      description: settingsDescription.trim() || activeSellerStore.description,
      phone: settingsPhone.trim() || activeSellerStore.phone,
      location: settingsLocation.trim() || activeSellerStore.location,
      bankDetails: {
        ...activeSellerStore.bankDetails,
        accountName: currentUser?.name || 'Store Account',
        accountNumber: settingsMomo.trim() || activeSellerStore.bankDetails?.momoNumber || '',
        bankName: 'Orange Money / Afrimoney',
        momoNumber: settingsMomo.trim() || activeSellerStore.bankDetails?.momoNumber || '',
      },
    });
  };

  // Handle Store Logo Upload
  const handleSettingsLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSellerStore) return;
    try {
      setUploadingLogo(true);
      const meta = await uploadFile(file, 'product-image', currentUser?.id);
      await updateStore(activeSellerStore.id, { logo: meta.downloadURL });
      showToast('Store logo updated!');
    } catch {
      showToast('Failed to upload store logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* TOP SELLER HERO BANNER */}
        <div className="bg-linear-to-r from-slate-900 via-blue-950 to-[#1E40AF] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative group shrink-0">
                <img
                  src={activeSellerStore?.logo || '/assets/icons/store.png'}
                  alt={activeSellerStore?.name || 'Seller'}
                  className="w-18 h-18 rounded-2xl border-2 border-white/30 p-1 bg-white/10 object-cover shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/icons/store.png';
                  }}
                />
                <button
                  onClick={() => logoInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold"
                >
                  <Upload className="w-3.5 h-3.5 mr-1" /> Edit
                </button>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSettingsLogoUpload}
                  className="hidden"
                  disabled={uploadingLogo}
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Certified Merchant
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold">
                    Escrow Protected
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight">
                  {activeSellerStore ? activeSellerStore.name : 'Merchant Control Hub'}
                </h1>
                <p className="text-xs text-blue-200 mt-0.5">
                  {activeSellerStore?.location || 'Freetown, Sierra Leone'} • Contact: {activeSellerStore?.phone || currentUser?.phone}
                </p>

                <div className="flex items-center gap-3 mt-2 text-xs text-blue-100 font-semibold">
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" /> {averageRating} Rating
                  </span>
                  <span>•</span>
                  <span>{sellerProducts.length} Listed Items</span>
                  <span>•</span>
                  <span>{sellerOrders.length} Total Orders</span>
                </div>
              </div>
            </div>

            {/* Quick Balance & Payout CTA */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[200px]">
                <p className="text-[11px] text-blue-200 uppercase font-bold">Available Payout Balance</p>
                <p className="text-2xl font-black text-white">Le {availablePayoutBalance.toLocaleString()}</p>
                <span className="text-[10px] text-emerald-300 font-semibold">● Net of 5% Platform Commission</span>
              </div>

              <button
                onClick={() => setActiveTab('payouts')}
                className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-black rounded-2xl px-5 py-4 text-xs shadow-md transition-all flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                <span>Request Payout</span>
              </button>
            </div>
          </div>
        </div>

        {/* 14-MODULE SELLER DASHBOARD NAVIGATION TABS */}
        <div className="bg-white rounded-2xl p-2 shadow-xs border border-slate-200/80 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'mystore', label: 'My Store', icon: Store },
              { id: 'products', label: 'Products', icon: Package, count: sellerProducts.length },
              { id: 'addproduct', label: 'Add Product', icon: Plus },
              { id: 'inventory', label: 'Inventory', icon: SlidersHorizontal, alert: lowStockCount > 0 || outOfStockCount > 0 },
              { id: 'orders', label: 'Orders', icon: ShoppingBag, count: pendingOrdersCount, alert: pendingOrdersCount > 0 },
              { id: 'customers', label: 'Customers', icon: Users, count: customerList.length },
              { id: 'sales', label: 'Sales', icon: TrendingUp },
              { id: 'earnings', label: 'Earnings', icon: DollarSign },
              { id: 'payouts', label: 'Payouts', icon: CreditCard },
              { id: 'reviews', label: 'Reviews', icon: Star, count: sellerReviews.length },
              { id: 'messages', label: 'Messages', icon: MessageSquare },
              { id: 'notifications', label: 'Notifications', icon: Bell, count: notifications.filter((n) => !n.read).length },
              { id: 'settings', label: 'Store Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SellerTab)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                    isActive
                      ? 'bg-[#1E40AF] text-white shadow-xs'
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
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse absolute top-2 right-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Urgent Low-Stock or Out of Stock Alert */}
            {(lowStockCount > 0 || outOfStockCount > 0) && (
              <div className="bg-amber-500 rounded-3xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white text-amber-600 flex items-center justify-center font-bold shrink-0">
                    <BadgeAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black">Stock Replenishment Needed!</h3>
                    <p className="text-xs text-amber-100">
                      You have <strong>{lowStockCount}</strong> low-stock item(s) and <strong>{outOfStockCount}</strong> out-of-stock item(s).
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className="px-4 py-2 bg-white text-amber-900 hover:bg-amber-50 rounded-xl text-xs font-black shadow-xs transition-colors"
                >
                  Update Inventory Now →
                </button>
              </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
                  <div className="p-2 rounded-xl bg-blue-50 text-[#1E40AF]">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900 mt-2">Le {grossSales.toLocaleString()}</p>
                <span className="text-[11px] text-emerald-600 font-bold">● {sellerOrders.length} Completed / Placed</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Net Earnings</span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-emerald-600 mt-2">Le {netEarnings.toLocaleString()}</p>
                <span className="text-[11px] text-slate-400">95% net after Le {platformCommission.toLocaleString()} fee</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Pending Orders</span>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-amber-600 mt-2">{pendingOrdersCount}</p>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-[11px] text-[#1E40AF] font-bold hover:underline mt-1 block"
                >
                  Prepare Packages →
                </button>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Store Rating</span>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <Star className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900 mt-2">{averageRating} / 5.0</p>
                <span className="text-[11px] text-slate-400">Based on {sellerReviews.length} customer reviews</span>
              </div>
            </div>

            {/* Recent Orders for Seller */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">Incoming & Active Orders</h3>
                  <p className="text-xs text-slate-500">Orders placed by customers for your storefront</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#1E40AF] font-bold hover:underline"
                >
                  View All Orders ({sellerOrders.length}) →
                </button>
              </div>

              {sellerOrders.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl text-slate-400">
                  <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-bold text-slate-700">No customer orders yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    When customers buy items from your catalog, they will appear here in real-time.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sellerOrders.slice(0, 4).map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-slate-50/50"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">{order.id}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              order.orderStatus === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.orderStatus === 'Processing'
                                ? 'bg-blue-100 text-blue-800'
                                : order.orderStatus === 'Ready for Pickup'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Buyer: <strong>{order.buyerName}</strong> ({order.buyerPhone}) • {order.buyerAddress}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {order.items.length} item(s) • Total: Le {order.total.toLocaleString()} • {order.createdAt}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {order.orderStatus === 'Confirmed' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Processing', 'Package being sealed by merchant')}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                          >
                            Accept & Prepare
                          </button>
                        )}
                        {order.orderStatus === 'Processing' && (
                          <button
                            onClick={() =>
                              updateOrderStatus(
                                order.id,
                                'Ready for Pickup',
                                'Package ready for dispatch rider collection'
                              )
                            }
                            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                          >
                            <Truck className="w-3.5 h-3.5" /> Ready for Pickup
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setChatRecipient({ id: order.buyerId, name: order.buyerName });
                            setActiveTab('messages');
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                        >
                          Message Buyer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MY STORE */}
        {activeTab === 'mystore' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-black text-slate-900">Digital Storefront Preview</h2>
                <p className="text-xs text-slate-500">How customers see your merchant shop on JD Mart</p>
              </div>
              <button
                onClick={() => setActiveTab('settings')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" /> Edit Store Profile
              </button>
            </div>

            {/* Store Preview Card */}
            <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="h-44 bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 relative">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-6 flex items-end gap-4">
                  <img
                    src={activeSellerStore?.logo || '/assets/icons/store.png'}
                    alt="Store Logo"
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg bg-white p-1"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/icons/store.png';
                    }}
                  />
                  <div className="text-white pb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black">{activeSellerStore?.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                        ✓ Verified
                      </span>
                    </div>
                    <p className="text-xs text-blue-200">{activeSellerStore?.location}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeSellerStore?.description || 'Verified merchant storefront on JD Mart.'}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Category</span>
                    <p className="text-xs font-black text-slate-800 mt-0.5">{activeSellerStore?.category || 'General'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Phone</span>
                    <p className="text-xs font-black text-slate-800 mt-0.5">{activeSellerStore?.phone}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Rating</span>
                    <p className="text-xs font-black text-amber-600 mt-0.5">★ {averageRating}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Catalog Items</span>
                    <p className="text-xs font-black text-[#1E40AF] mt-0.5">{sellerProducts.length} Products</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-black text-slate-900">Manage Catalog Products</h2>
                <p className="text-xs text-slate-500">Edit prices, manage stock, and toggle visibility</p>
              </div>

              <button
                onClick={() => setActiveTab('addproduct')}
                className="px-4 py-2.5 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs"
              >
                <Plus className="w-4 h-4" /> Add New Product
              </button>
            </div>

            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search your products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1E40AF]"
                />
              </div>

              <select
                value={productStatusFilter}
                onChange={(e) => setProductStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200"
              >
                <option value="all">All Status</option>
                <option value="active">Active (Published)</option>
                <option value="inactive">Inactive (Unpublished)</option>
              </select>
            </div>

            {/* Product Table / Cards */}
            {sellerProducts.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No products in your catalog</p>
                <p className="text-xs text-slate-400 mt-1">Upload items to start selling to customers</p>
                <button
                  onClick={() => setActiveTab('addproduct')}
                  className="mt-4 px-5 py-2.5 bg-[#1E40AF] text-white rounded-xl text-xs font-bold"
                >
                  Add Your First Product
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {sellerProducts
                  .filter((p) => {
                    const matchQ =
                      !productSearch.trim() ||
                      p.title.toLowerCase().includes(productSearch.toLowerCase());
                    const matchS =
                      productStatusFilter === 'all' || p.status === productStatusFilter;
                    return matchQ && matchS;
                  })
                  .map((product) => (
                    <div
                      key={product.id}
                      className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/40"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/icons/store.png';
                          }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-black text-slate-800">{product.title}</h4>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                product.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {product.status === 'active' ? 'Published' : 'Draft'}
                            </span>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">
                              {product.condition}
                            </span>
                          </div>
                          <p className="text-xs text-[#1E40AF] font-black mt-0.5">Le {product.price.toLocaleString()}</p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                            <span>Stock: <strong className={product.stock < 5 ? 'text-amber-600' : 'text-slate-700'}>{product.stock} units</strong></span>
                            <span>• Category: {product.category}</span>
                            <span>• Sold: {product.salesCount || 0}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => toggleProductStatus(product.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            product.status === 'active'
                              ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {product.status === 'active' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1E40AF] rounded-xl text-xs font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete Product"
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

        {/* TAB 4: ADD PRODUCT */}
        {activeTab === 'addproduct' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900">Add New Marketplace Product</h2>
              <p className="text-xs text-slate-500">
                List genuine products with multi-image support and nationwide dispatch delivery
              </p>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-5">
              {/* Product Images Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Product Images (Multiple supported) <span className="text-rose-500">*</span>
                </label>
                <input
                  ref={productImgInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleProductImageUpload}
                  className="hidden"
                />

                <div className="flex flex-wrap gap-3 items-center">
                  {newProductImages.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group">
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setNewProductImages((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => productImgInputRef.current?.click()}
                    disabled={isUploadingProductImg}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#1E40AF] flex flex-col items-center justify-center text-slate-400 hover:text-[#1E40AF] transition-colors"
                  >
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold">
                      {isUploadingProductImg ? 'Uploading...' : '+ Add Image'}
                    </span>
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 block">
                  First image will be the primary catalog thumbnail. Stored securely on Firebase.
                </span>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Product Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Apple iPhone 15 Pro Max 256GB"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-hidden focus:border-[#1E40AF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Phones & Tablets">Phones & Tablets</option>
                    <option value="Computers & Laptops">Computers & Laptops</option>
                    <option value="Fashion & Apparel">Fashion & Apparel</option>
                    <option value="Beauty & Skincare">Beauty & Skincare</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Food & Groceries">Food & Groceries</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Furniture">Furniture</option>
                  </select>
                </div>
              </div>

              {/* Price, Stock & Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Price (Le) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 1500"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Initial Stock Units
                  </label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="10"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Condition</label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                  >
                    <option value="Brand New">Brand New (Sealed)</option>
                    <option value="Refurbished">Refurbished</option>
                    <option value="Fair">Fair / Pre-owned</option>
                  </select>
                </div>
              </div>

              {/* Description & AI Assist */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">Product Description</label>
                  <button
                    type="button"
                    onClick={handleGenerateAIDesc}
                    disabled={isGeneratingAI}
                    className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isGeneratingAI ? 'Generating AI copy...' : 'Generate with Gemini AI'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detail specifications, warranty, authentic condition, and packaging..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-hidden focus:border-[#1E40AF]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="deliveryAvail"
                  checked={newDeliveryAvailable}
                  onChange={(e) => setNewDeliveryAvailable(e.target.checked)}
                  className="rounded text-[#1E40AF]"
                />
                <label htmlFor="deliveryAvail" className="text-xs font-semibold text-slate-700">
                  Enable fast dispatch motorbike delivery across Freetown & Sierra Leone
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-colors shadow-md"
              >
                Publish Product to Marketplace
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-black text-slate-900">Inventory & Stock Control</h2>
                <p className="text-xs text-slate-500">Monitor stock levels, set low-stock thresholds, and restock units</p>
              </div>

              <div className="flex items-center gap-2">
                {(['all', 'low', 'out'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setInventoryFilter(filter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      inventoryFilter === filter
                        ? 'bg-[#1E40AF] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filter === 'all' && `All Items (${sellerProducts.length})`}
                    {filter === 'low' && `Low Stock (${lowStockCount})`}
                    {filter === 'out' && `Out of Stock (${outOfStockCount})`}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {sellerProducts
                .filter((p) => {
                  if (inventoryFilter === 'low') return p.stock > 0 && p.stock < 5;
                  if (inventoryFilter === 'out') return p.stock === 0;
                  return true;
                })
                .map((p) => (
                  <div key={p.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.title} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{p.title}</h4>
                        <p className="text-[11px] text-slate-400">Le {p.price.toLocaleString()} • {p.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          p.stock === 0
                            ? 'bg-rose-100 text-rose-800'
                            : p.stock < 5
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.stock === 0 ? 'Out of Stock' : p.stock < 5 ? `Low Stock (${p.stock})` : `In Stock (${p.stock})`}
                      </span>

                      {/* Quick stock +/- buttons */}
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateProductStock(p.id, p.stock - 1)}
                          disabled={p.stock <= 0}
                          className="px-2.5 py-1 text-xs font-black hover:bg-slate-200 disabled:opacity-30"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-black text-slate-800">{p.stock}</span>
                        <button
                          onClick={() => updateProductStock(p.id, p.stock + 1)}
                          className="px-2.5 py-1 text-xs font-black hover:bg-slate-200"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => updateProductStock(p.id, p.stock + 10)}
                        className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-[#1E40AF] rounded-xl text-xs font-bold"
                      >
                        +10 Units
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 6: ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-black text-slate-900">Customer Orders</h2>
                <p className="text-xs text-slate-500">Incoming purchase orders, packing, and dispatch preparation</p>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {['all', 'Confirmed', 'Processing', 'Ready for Pickup', 'Delivered', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
                      orderFilter === status
                        ? 'bg-[#1E40AF] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {status === 'all' ? 'All Orders' : status}
                  </button>
                ))}
              </div>
            </div>

            {sellerOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl">
                <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-bold text-slate-700">No customer orders matching this filter</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sellerOrders
                  .filter((o) => (orderFilter === 'all' ? true : o.orderStatus === orderFilter))
                  .map((order) => (
                    <div key={order.id} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-900">{order.id}</span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                order.orderStatus === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.orderStatus === 'Processing'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.orderStatus === 'Ready for Pickup'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {order.orderStatus}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">Placed on {order.createdAt}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-black text-[#1E40AF]">Le {order.total.toLocaleString()}</p>
                          <span className="text-[10px] font-bold text-emerald-600">✓ Paid via Escrow</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <img src={item.image} alt={item.title} className="w-8 h-8 rounded-lg object-cover" />
                              <span className="font-semibold text-slate-800">{item.title}</span>
                              <span className="text-slate-400">x{item.quantity}</span>
                            </div>
                            <span className="font-bold text-slate-700">Le {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      {/* Buyer Details */}
                      <div className="p-3 bg-slate-50 rounded-xl text-xs flex flex-col sm:flex-row justify-between gap-2 text-slate-600">
                        <div>
                          <span className="text-slate-400">Recipient:</span> <strong>{order.buyerName}</strong> ({order.buyerPhone})
                        </div>
                        <div>
                          <span className="text-slate-400">Delivery Address:</span> {order.buyerAddress}, {order.buyerCity}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => setSelectedOrderDetail(order)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Details
                        </button>

                        {order.orderStatus === 'Confirmed' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Processing', 'Package being sealed by merchant')}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                          >
                            Accept & Prepare
                          </button>
                        )}
                        {order.orderStatus === 'Processing' && (
                          <button
                            onClick={() =>
                              updateOrderStatus(
                                order.id,
                                'Ready for Pickup',
                                'Package ready for dispatch rider collection'
                              )
                            }
                            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                          >
                            <Truck className="w-3.5 h-3.5" /> Ready for Pickup
                          </button>
                        )}
                        {order.orderStatus === 'Ready for Pickup' && (
                          <button
                            onClick={() =>
                              updateOrderStatus(
                                order.id,
                                'Delivered',
                                'Handed over directly to customer / verified'
                              )
                            }
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Mark Delivered
                          </button>
                        )}
                        {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                          <button
                            onClick={() => setCancellingOrderId(order.id)}
                            className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setChatRecipient({ id: order.buyerId, name: order.buyerName });
                            setActiveTab('messages');
                          }}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1E40AF] rounded-xl text-xs font-bold flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Message
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: CUSTOMERS */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900">Customer Directory</h2>
              <p className="text-xs text-slate-500">Customers who ordered items from your storefront</p>
            </div>

            {customerList.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-10">No customer records yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {customerList.map((c, i) => (
                  <div key={i} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E40AF] flex items-center justify-center font-bold">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{c.name}</h4>
                        <p className="text-[11px] text-slate-400">{c.phone} • {c.city}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-slate-800">{c.orderCount} order(s)</span>
                      <p className="text-[11px] text-emerald-600 font-bold">Total: Le {c.totalSpent.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 8: SALES */}
        {activeTab === 'sales' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900">Sales Analytics</h2>
              <p className="text-xs text-slate-500">Gross transaction volume and order breakdown</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-50 rounded-2xl border">
                <span className="text-xs text-slate-400 font-bold uppercase">Total Volume</span>
                <p className="text-2xl font-black text-slate-900 mt-1">Le {grossSales.toLocaleString()}</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border">
                <span className="text-xs text-slate-400 font-bold uppercase">Successful Orders</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">{sellerOrders.length}</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border">
                <span className="text-xs text-slate-400 font-bold uppercase">Average Order Value</span>
                <p className="text-2xl font-black text-[#1E40AF] mt-1">
                  Le {sellerOrders.length > 0 ? Math.round(grossSales / sellerOrders.length).toLocaleString() : 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: EARNINGS */}
        {activeTab === 'earnings' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900">Earnings & Commissions</h2>
              <p className="text-xs text-slate-500">Transparent breakdown of sales, fees, and available payouts</p>
            </div>

            <div className="p-6 bg-linear-to-br from-slate-900 to-blue-950 rounded-2xl text-white space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-blue-200 uppercase font-bold">Gross Sales</span>
                  <p className="text-xl font-black">Le {grossSales.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-xs text-rose-300 uppercase font-bold">Platform Fee (5%)</span>
                  <p className="text-xl font-black text-rose-400">- Le {platformCommission.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-xs text-emerald-300 uppercase font-bold">Net Earnings (95%)</span>
                  <p className="text-xl font-black text-emerald-400">Le {netEarnings.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: PAYOUTS */}
        {activeTab === 'payouts' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-black text-slate-900">Merchant Payouts</h2>
                <p className="text-xs text-slate-500">Withdraw available funds directly to Orange Money or Bank</p>
              </div>

              <div className="bg-emerald-50 text-emerald-800 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-200">
                Available: Le {availablePayoutBalance.toLocaleString()}
              </div>
            </div>

            {/* Request Payout Form */}
            <form onSubmit={handleRequestPayoutSubmit} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Submit New Payout Request
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Amount (Le)</label>
                  <input
                    type="number"
                    required
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder={`Max Le ${availablePayoutBalance}`}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Method</label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                  >
                    <option value="Orange Money">Orange Money</option>
                    <option value="Airtel Money">Afrimoney (Africell)</option>
                    <option value="Bank Transfer">Commercial Bank</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Account / Phone Number</label>
                  <input
                    type="text"
                    required
                    value={payoutAccountNum}
                    onChange={(e) => setPayoutAccountNum(e.target.value)}
                    placeholder="+232 76 000000"
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={availablePayoutBalance <= 0}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Request Withdrawal Now
              </button>
            </form>

            {/* Payout History */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Payout History</h3>
              {payouts.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No withdrawal records yet.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {payouts.map((p) => (
                    <div key={p.id} className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-800">Le {p.amount.toLocaleString()}</span>
                        <p className="text-[11px] text-slate-400">
                          {p.method} ({p.accountNumber}) • {p.createdAt.split('T')[0]}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'Approved'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 11: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-black text-slate-900">Customer Ratings & Reviews</h2>
                <p className="text-xs text-slate-500">Read product reviews and post merchant responses</p>
              </div>
              <div className="flex items-center gap-1.5 text-amber-500 font-black text-sm">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>{averageRating} Store Average</span>
              </div>
            </div>

            {sellerReviews.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-10">No customer reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {sellerReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-800">{rev.buyerName}</span>
                          <span className="text-[10px] text-slate-400">{rev.createdAt.split('T')[0]}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-blue-800">{rev.productTitle}</span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>

                    {rev.sellerReply ? (
                      <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs space-y-0.5 mt-2">
                        <span className="text-[10px] font-black text-[#1E40AF] uppercase">Your Public Response:</span>
                        <p className="text-slate-800 font-medium">{rev.sellerReply.text}</p>
                      </div>
                    ) : replyReviewId === rev.id ? (
                      <div className="pt-2 space-y-2">
                        <textarea
                          rows={2}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a polite public response to this review..."
                          className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setReplyReviewId(null)}
                            className="px-3 py-1 text-xs text-slate-500 font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSubmitReviewReply(rev.id)}
                            className="px-4 py-1.5 bg-[#1E40AF] text-white rounded-xl text-xs font-bold"
                          >
                            Post Reply
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyReviewId(rev.id)}
                        className="text-xs font-bold text-[#1E40AF] hover:underline pt-1"
                      >
                        Reply to Review →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 12: MESSAGES */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900">Direct Customer Chat</h2>
              <p className="text-xs text-slate-500">Communicate directly with buyers and delivery riders</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border min-h-[300px] flex flex-col justify-between">
              <div className="space-y-3 overflow-y-auto max-h-72">
                {messages.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-10">No messages yet.</p>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${
                        m.senderId === currentUser?.id ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs sm:max-w-md p-3 rounded-2xl text-xs ${
                          m.senderId === currentUser?.id
                            ? 'bg-[#1E40AF] text-white'
                            : 'bg-white border text-slate-800'
                        }`}
                      >
                        <p className="font-bold text-[10px] opacity-75 mb-0.5">{m.senderName}</p>
                        <p>{m.text}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!chatInputText.trim()) return;
                  sendMessage(
                    chatRecipient?.id || 'admin-master',
                    chatRecipient?.name || 'Support Desk',
                    chatInputText.trim()
                  );
                  setChatInputText('');
                }}
                className="flex gap-2 mt-4 pt-3 border-t border-slate-200"
              >
                <input
                  type="text"
                  placeholder="Type a real-time message to customer..."
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1E40AF] text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 13: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Merchant Alerts & Notifications</h2>
                <p className="text-xs text-slate-500">Real-time alerts for incoming orders, payments, and reviews</p>
              </div>
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-[#1E40AF] font-bold hover:underline"
              >
                Mark all as read
              </button>
            </div>

            <div className="space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <strong className="text-slate-800">{n.title}</strong>
                    <span className="text-[10px] text-slate-400">{n.createdAt?.split('T')[0] || n.time}</span>
                  </div>
                  <p className="text-slate-600">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 14: STORE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900">Store Profile & Settings</h2>
              <p className="text-xs text-slate-500">Update business information, contact line, and payout account</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Business / Store Name</label>
                  <input
                    type="text"
                    required
                    value={settingsName}
                    onChange={(e) => setSettingsName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Store Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={settingsPhone}
                    onChange={(e) => setSettingsPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Store Description</label>
                <textarea
                  rows={2}
                  value={settingsDescription}
                  onChange={(e) => setSettingsDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Physical Store / Warehouse Address</label>
                  <input
                    type="text"
                    required
                    value={settingsLocation}
                    onChange={(e) => setSettingsLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Payout MoMo Number</label>
                  <input
                    type="text"
                    required
                    value={settingsMomo}
                    onChange={(e) => setSettingsMomo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-[#1E40AF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
              >
                Save Store Settings in Real-Time
              </button>
            </form>
          </div>
        )}

        {/* Modal: Edit Product */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-base font-black text-slate-900">Edit Product</h3>
                <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEditProduct} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.title}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Price (Le)</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Stock Units</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                      className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1E40AF] text-white rounded-xl text-xs font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Order Details */}
        {selectedOrderDetail && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">Order #{selectedOrderDetail.id}</h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        selectedOrderDetail.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedOrderDetail.orderStatus === 'Processing'
                          ? 'bg-blue-100 text-blue-800'
                          : selectedOrderDetail.orderStatus === 'Ready for Pickup'
                          ? 'bg-purple-100 text-purple-800'
                          : selectedOrderDetail.orderStatus === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {selectedOrderDetail.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Placed on {selectedOrderDetail.createdAt}</p>
                </div>
                <button
                  onClick={() => setSelectedOrderDetail(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer & Delivery Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Customer Details</span>
                  <p className="font-bold text-slate-800">{selectedOrderDetail.buyerName}</p>
                  <p className="text-slate-500">{selectedOrderDetail.buyerPhone}</p>
                  {selectedOrderDetail.buyerEmail && (
                    <p className="text-slate-500">{selectedOrderDetail.buyerEmail}</p>
                  )}
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Delivery Destination</span>
                  <p className="font-bold text-slate-800">{selectedOrderDetail.buyerAddress}</p>
                  <p className="text-slate-500">{selectedOrderDetail.buyerCity}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                    Payment: {selectedOrderDetail.paymentMethod || selectedOrderDetail.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ordered Items</h4>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                  {selectedOrderDetail.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs bg-white">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-slate-800">{item.title}</p>
                          <p className="text-[11px] text-slate-400">
                            Le {item.price.toLocaleString()} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-black text-slate-900">
                        Le {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Totals */}
              <div className="p-4 bg-blue-50/50 rounded-2xl space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>Le {selectedOrderDetail.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  <span>Le {selectedOrderDetail.deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#1E40AF] pt-1 border-t border-blue-100">
                  <span>Order Total</span>
                  <span>Le {selectedOrderDetail.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Quick Status Update inside Modal */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-slate-700 block">Update Order Status</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={async () => {
                      await updateOrderStatus(selectedOrderDetail.id, 'Processing', 'Order packaging initiated');
                      setSelectedOrderDetail((prev) => prev ? { ...prev, orderStatus: 'Processing' } : null);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      selectedOrderDetail.orderStatus === 'Processing'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    Processing
                  </button>
                  <button
                    onClick={async () => {
                      await updateOrderStatus(selectedOrderDetail.id, 'Ready for Pickup', 'Packaged & ready for courier');
                      setSelectedOrderDetail((prev) => prev ? { ...prev, orderStatus: 'Ready for Pickup' } : null);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      selectedOrderDetail.orderStatus === 'Ready for Pickup'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    Ready for Pickup
                  </button>
                  <button
                    onClick={async () => {
                      await updateOrderStatus(selectedOrderDetail.id, 'Delivered', 'Order completed and delivered');
                      setSelectedOrderDetail((prev) => prev ? { ...prev, orderStatus: 'Delivered' } : null);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      selectedOrderDetail.orderStatus === 'Delivered'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    Mark Delivered
                  </button>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    const bId = selectedOrderDetail.buyerId;
                    const bName = selectedOrderDetail.buyerName;
                    setSelectedOrderDetail(null);
                    setChatRecipient({ id: bId, name: bName });
                    setActiveTab('messages');
                  }}
                  className="px-4 py-2 bg-blue-50 text-[#1E40AF] hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" /> Message Customer
                </button>

                <button
                  onClick={() => setSelectedOrderDetail(null)}
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Cancel Order */}
        {cancellingOrderId && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-base font-black text-slate-900">Cancel Order #{cancellingOrderId}</h3>
                <button onClick={() => setCancellingOrderId(null)} className="text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-600">
                  Please provide a reason for cancelling this order. The customer will be notified and an automated refund will be initiated.
                </p>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Reason for Cancellation</label>
                  <select
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs"
                  >
                    <option value="Out of stock / unable to fulfill">Out of stock / inventory depleted</option>
                    <option value="Customer requested cancellation">Customer requested cancellation</option>
                    <option value="Incorrect pricing or item specification">Incorrect item specification</option>
                    <option value="Delivery location not serviceable">Delivery location unreachable</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancellingOrderId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await updateOrderStatus(cancellingOrderId, 'Cancelled', `Cancelled by merchant: ${cancellationReason}`);
                    setCancellingOrderId(null);
                  }}
                  className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
