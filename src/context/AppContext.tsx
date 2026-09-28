import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  UserRole,
  Product,
  Category,
  CartItem,
  Order,
  OrderStatus,
  Store,
  RiderDelivery,
  Job,
  JobApplication,
  AppNotification,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_STORES,
  INITIAL_JOBS,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_RIDER_DELIVERIES,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

interface AppContextType {
  currentPath: string;
  navigate: (path: string) => void;
  currentUser: User | null;
  userRole: UserRole;
  switchRole: (role: UserRole) => void;
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  users: User[];
  updateUserStatus: (userId: string, status: 'active' | 'suspended', verified?: boolean) => void;

  // Categories & Products
  categories: Category[];
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  createOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  assignRiderToOrder: (orderId: string, riderId: string, riderName: string, riderPhone: string) => void;
  rateOrder: (orderId: string, rating: number) => void;
  cancelOrder: (orderId: string, reason: string) => void;

  // Stores
  stores: Store[];
  updateStore: (storeId: string, updates: Partial<Store>) => void;

  // Rider
  riderDeliveries: RiderDelivery[];
  riderOnline: boolean;
  toggleRiderOnline: () => void;
  acceptDelivery: (deliveryId: string) => void;
  updateDeliveryStatus: (deliveryId: string, status: 'In Transit' | 'Delivered', photo?: string) => void;

  // Jobs
  jobs: Job[];
  applications: JobApplication[];
  postJob: (jobData: Omit<Job, 'id' | 'applicantCount' | 'postedDate'>) => Job;
  applyForJob: (
    jobId: string,
    appData: { fullName: string; email: string; phone: string; coverNote: string; resumeSummary: string }
  ) => void;
  updateApplicationStatus: (appId: string, status: JobApplication['status']) => void;

  // Feedback & UI
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  notifications: AppNotification[];
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation State with URL synchronization
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.pathname) {
      return window.location.pathname === '' ? '/' : window.location.pathname;
    }
    return '/';
  });

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Users & Roles
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('jdmart_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('jdmart_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default logged-in buyer
  });

  const userRole: UserRole = currentUser ? currentUser.role : 'Guest';

  const switchRole = (role: UserRole) => {
    if (role === 'Guest') {
      setCurrentUser(null);
      localStorage.removeItem('jdmart_current_user');
      showToast('Switched to Guest browsing mode');
      return;
    }
    const matchingUser = users.find((u) => u.role === role) || {
      id: `user-${role.toLowerCase().replace(/\s+/g, '-')}`,
      name: `${role} Demo User`,
      email: `${role.toLowerCase().replace(/\s+/g, '')}@jdmart.sl`,
      phone: '+232 77 000111',
      role: role,
      avatar: '/assets/icons/account.gif',
      status: 'active',
      verified: true,
      walletBalance: 1500,
    };
    setCurrentUser(matchingUser);
    localStorage.setItem('jdmart_current_user', JSON.stringify(matchingUser));
    showToast(`Switched active role to: ${role}`);

    // Auto-navigate to appropriate role dashboard when switched
    if (role === 'Seller') navigate('/seller');
    else if (role === 'Rider') navigate('/rider');
    else if (role === 'Admin') navigate('/admin');
    else if (role === 'Employer') navigate('/employer');
    else if (role === 'Job Seeker') navigate('/job-seeker/dashboard');
    else if (role === 'Buyer') navigate('/dashboard');
  };

  const login = (email: string, role?: UserRole) => {
    let matched = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!matched && role) {
      matched = users.find((u) => u.role === role);
    }
    if (!matched) {
      matched = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        phone: '+232 77 123456',
        role: role || 'Buyer',
        avatar: '/assets/icons/account.gif',
        status: 'active',
        verified: true,
        walletBalance: 500,
      };
      setUsers((prev) => [...prev, matched!]);
    }
    setCurrentUser(matched);
    localStorage.setItem('jdmart_current_user', JSON.stringify(matched));
    showToast(`Welcome back, ${matched.name}!`);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('jdmart_current_user');
    showToast('You have been logged out.');
    navigate('/');
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    localStorage.setItem('jdmart_current_user', JSON.stringify(updated));
    showToast('Profile updated successfully');
  };

  const updateUserStatus = (userId: string, status: 'active' | 'suspended', verified?: boolean) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status,
            ...(verified !== undefined ? { verified } : {}),
          };
        }
        return u;
      })
    );
    showToast(`User status updated to ${status}`);
  };

  // Categories & Products
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('jdmart_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newProd, ...products];
    setProducts(updated);
    localStorage.setItem('jdmart_products', JSON.stringify(updated));
    showToast('Product listed successfully!');
    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setProducts(updated);
    localStorage.setItem('jdmart_products', JSON.stringify(updated));
    showToast('Product updated successfully!');
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem('jdmart_products', JSON.stringify(updated));
    showToast('Product removed from catalog');
  };

  // Cart Management
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('jdmart_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [...prev, { product, quantity }];
      }
      localStorage.setItem('jdmart_cart', JSON.stringify(updated));
      return updated;
    });
    showToast(`Added ${product.title.slice(0, 24)}... to cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId);
      localStorage.setItem('jdmart_cart', JSON.stringify(updated));
      return updated;
    });
    showToast('Item removed from cart');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem('jdmart_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('jdmart_cart');
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('jdmart_wishlist');
    return saved ? JSON.parse(saved) : ['prod-1', 'prod-3'];
  });

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      localStorage.setItem('jdmart_wishlist', JSON.stringify(updated));
      showToast(exists ? 'Removed from wishlist' : 'Saved to wishlist!');
      return updated;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Stores
  const [stores, setStores] = useState<Store[]>(() => {
    const saved = localStorage.getItem('jdmart_stores');
    return saved ? JSON.parse(saved) : INITIAL_STORES;
  });

  const updateStore = (storeId: string, updates: Partial<Store>) => {
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, ...updates } : s))
    );
    showToast('Store settings saved');
  };

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('jdmart_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const createOrder = (orderData: Partial<Order>): Order => {
    const newId = `JDM-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder: Order = {
      id: newId,
      buyerId: currentUser?.id || 'guest-buyer',
      buyerName: orderData.buyerName || currentUser?.name || 'Customer',
      buyerPhone: orderData.buyerPhone || currentUser?.phone || '+232 77 000000',
      buyerAddress: orderData.buyerAddress || 'Central Freetown',
      buyerCity: orderData.buyerCity || 'Freetown',
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      deliveryFee: orderData.deliveryFee || 15,
      serviceFee: orderData.serviceFee || 5,
      total: orderData.total || 0,
      deliveryMethod: orderData.deliveryMethod || 'Standard',
      paymentStatus: 'Paid',
      orderStatus: 'Confirmed',
      sellerId: orderData.items?.[0]?.sellerId || 'user-seller-1',
      sellerName: orderData.items?.[0]?.sellerName || 'JD Partner Merchant',
      timeline: [
        { status: 'Pending', timestamp: timeStr, description: 'Order submitted by buyer' },
        { status: 'Confirmed', timestamp: timeStr, description: 'Order confirmed and paid' },
      ],
      createdAt: timeStr,
      estimatedDelivery: 'Tomorrow by 2:00 PM',
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('jdmart_orders', JSON.stringify(updated));

    // Also auto-create a delivery for dispatch riders!
    const newDelivery: RiderDelivery = {
      id: `del-${Date.now().toString().slice(-4)}`,
      orderId: newId,
      pickupLocation: `${newOrder.sellerName} Warehouse, Freetown`,
      deliveryLocation: `${newOrder.buyerAddress}, ${newOrder.buyerCity}`,
      sellerName: newOrder.sellerName,
      sellerPhone: '+232 76 123456',
      customerName: newOrder.buyerName,
      customerPhone: newOrder.buyerPhone,
      packageDetails: `${newOrder.items.length} items (${newOrder.items.map((i) => i.title).join(', ')})`,
      deliveryFee: newOrder.deliveryFee + 10,
      status: 'Available',
      createdAt: timeStr,
    };
    setRiderDeliveries((prev) => [newDelivery, ...prev]);

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            orderStatus: status,
            timeline: [
              ...order.timeline,
              {
                status,
                timestamp: timeStr,
                description: note || `Order status updated to ${status}`,
              },
            ],
          };
        }
        return order;
      })
    );
    showToast(`Order ${orderId} updated to ${status}`);
  };

  const assignRiderToOrder = (
    orderId: string,
    riderId: string,
    riderName: string,
    riderPhone: string
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              riderId,
              riderName,
              riderPhone,
              orderStatus: 'Ready for Pickup',
              timeline: [
                ...o.timeline,
                {
                  status: 'Ready for Pickup',
                  timestamp: 'Just now',
                  description: `Assigned to dispatch rider ${riderName}`,
                },
              ],
            }
          : o
      )
    );
    showToast(`Rider ${riderName} assigned to order ${orderId}`);
  };

  const rateOrder = (orderId: string, rating: number) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, rating } : o))
    );
    showToast(`Thank you! Order rated ${rating} stars`);
  };

  const cancelOrder = (orderId: string, reason: string) => {
    updateOrderStatus(orderId, 'Cancelled', `Cancelled: ${reason}`);
  };

  // Rider Deliveries
  const [riderDeliveries, setRiderDeliveries] = useState<RiderDelivery[]>(() => {
    const saved = localStorage.getItem('jdmart_deliveries');
    return saved ? JSON.parse(saved) : INITIAL_RIDER_DELIVERIES;
  });
  const [riderOnline, setRiderOnline] = useState<boolean>(true);

  const toggleRiderOnline = () => {
    setRiderOnline((prev) => {
      const next = !prev;
      showToast(next ? 'You are now ONLINE for deliveries' : 'You are now OFFLINE');
      return next;
    });
  };

  const acceptDelivery = (deliveryId: string) => {
    setRiderDeliveries((prev) =>
      prev.map((del) =>
        del.id === deliveryId
          ? {
              ...del,
              status: 'Accepted',
              riderId: currentUser?.id || 'user-rider-1',
            }
          : del
      )
    );
    showToast('Delivery request accepted! Proceed to pickup location.');
  };

  const updateDeliveryStatus = (
    deliveryId: string,
    status: 'In Transit' | 'Delivered',
    photo?: string
  ) => {
    setRiderDeliveries((prev) =>
      prev.map((del) => {
        if (del.id === deliveryId) {
          const updated: RiderDelivery = {
            ...del,
            status,
            ...(photo ? { proofOfDeliveryPhoto: photo } : {}),
          };
          // Also update the linked order
          if (del.orderId) {
            updateOrderStatus(
              del.orderId,
              status === 'In Transit' ? 'Out for Delivery' : 'Delivered',
              status === 'Delivered'
                ? 'Package handed over to customer (Proof verified)'
                : 'Rider is on route to customer'
            );
          }
          return updated;
        }
        return del;
      })
    );
    showToast(`Delivery status updated: ${status}`);
  };

  // Jobs
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('jdmart_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [applications, setApplications] = useState<JobApplication[]>([
    {
      id: 'app-1',
      jobId: 'job-1',
      jobTitle: 'Express Dispatch Rider (Motorbike)',
      companyName: 'JD Logistics & Dispatch',
      applicantId: 'user-seeker-1',
      fullName: 'Ibrahim Koroma',
      email: 'seeker@jdmart.sl',
      phone: '+232 88 112233',
      coverNote: 'Experienced commercial rider with 3 years clean riding in Freetown.',
      resumeSummary: 'Valid Class A license, fluent in Krio and English, smartphone-equipped.',
      status: 'Shortlisted',
      appliedDate: '2026-09-26',
    },
  ]);

  const postJob = (jobData: Omit<Job, 'id' | 'applicantCount' | 'postedDate'>): Job => {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      applicantCount: 0,
      postedDate: new Date().toISOString().split('T')[0],
    };
    const updated = [newJob, ...jobs];
    setJobs(updated);
    localStorage.setItem('jdmart_jobs', JSON.stringify(updated));
    showToast('Job listing published successfully!');
    return newJob;
  };

  const applyForJob = (
    jobId: string,
    appData: { fullName: string; email: string; phone: string; coverNote: string; resumeSummary: string }
  ) => {
    const job = jobs.find((j) => j.id === jobId);
    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      jobId,
      jobTitle: job?.title || 'Position',
      companyName: job?.employerName || 'JD Partner',
      applicantId: currentUser?.id || 'guest-applicant',
      fullName: appData.fullName,
      email: appData.email,
      phone: appData.phone,
      coverNote: appData.coverNote,
      resumeSummary: appData.resumeSummary,
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
    };
    setApplications((prev) => [newApp, ...prev]);
    // increment applicant count
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, applicantCount: j.applicantCount + 1 } : j))
    );
    showToast('Application submitted successfully to employer!');
  };

  const updateApplicationStatus = (appId: string, status: JobApplication['status']) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status } : a))
    );
    showToast(`Application updated to ${status}`);
  };

  // UI state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3200);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        currentUser,
        userRole,
        switchRole,
        login,
        logout,
        updateUserProfile,
        users,
        updateUserStatus,
        categories,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        createOrder,
        updateOrderStatus,
        assignRiderToOrder,
        rateOrder,
        cancelOrder,
        stores,
        updateStore,
        riderDeliveries,
        riderOnline,
        toggleRiderOnline,
        acceptDelivery,
        updateDeliveryStatus,
        jobs,
        applications,
        postJob,
        applyForJob,
        updateApplicationStatus,
        toastMessage,
        showToast,
        isDrawerOpen,
        setIsDrawerOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isCartOpen,
        setIsCartOpen,
        notifications,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
