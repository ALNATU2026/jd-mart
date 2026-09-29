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
  PaymentRecord,
  AdminLog,
  UploadedFileItem,
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
  SYSTEM_ADMIN_USER,
} from '../data/mockData';
import {
  auth,
  db,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  FirebaseUser,
} from '../lib/firebase';
import { uploadAppFile, StorageCategory, UploadedFileMetadata } from '../lib/storage';

interface AppContextType {
  currentPath: string;
  navigate: (path: string) => void;
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  authLoading: boolean;
  userRole: UserRole;
  switchRole: (role: UserRole) => void;
  login: (email: string, role?: UserRole) => boolean;
  loginWithEmail: (email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: (preferredRole?: UserRole) => Promise<boolean>;
  registerWithEmail: (
    name: string,
    email: string,
    password: string,
    role?: UserRole,
    phone?: string
  ) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  sendVerificationEmail: () => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  users: User[];
  updateUserStatus: (userId: string, status: 'active' | 'suspended' | 'pending', verified?: boolean) => Promise<void>;

  // Categories & Products
  categories: Category[];
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

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

  // Orders & Deliveries
  orders: Order[];
  createOrder: (orderData: Partial<Order>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => Promise<void>;
  assignRiderToOrder: (orderId: string, riderId: string, riderName: string, riderPhone: string) => Promise<void>;
  rateOrder: (orderId: string, rating: number) => Promise<void>;
  cancelOrder: (orderId: string, reason: string) => Promise<void>;

  // Stores
  stores: Store[];
  updateStore: (storeId: string, updates: Partial<Store>) => Promise<void>;

  // Rider
  riderDeliveries: RiderDelivery[];
  riderOnline: boolean;
  toggleRiderOnline: () => void;
  acceptDelivery: (deliveryId: string) => Promise<void>;
  updateDeliveryStatus: (deliveryId: string, status: 'In Transit' | 'Delivered', photo?: string) => Promise<void>;

  // Jobs
  jobs: Job[];
  applications: JobApplication[];
  postJob: (jobData: Omit<Job, 'id' | 'applicantCount' | 'postedDate'>) => Promise<Job>;
  applyForJob: (
    jobId: string,
    appData: { fullName: string; email: string; phone: string; coverNote: string; resumeSummary: string; resumeFileUrl?: string }
  ) => Promise<void>;
  updateApplicationStatus: (appId: string, status: JobApplication['status']) => Promise<void>;

  // Cloud Storage & Gemini AI
  uploadFile: (file: File, category: StorageCategory, entityId?: string, onProgress?: (p: number) => void) => Promise<UploadedFileMetadata>;
  generateAIDescription: (title: string, category?: string) => Promise<string>;
  analyzeImageWithAI: (imageUrl?: string, base64?: string) => Promise<any>;

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
  // Navigation State
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

  // Toast System
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Firebase Authentication State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('jdmart_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(INITIAL_USERS);

  // Synchronize Firebase Auth with Firestore User Document
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data() as User;
            setCurrentUser(data);
            localStorage.setItem('jdmart_current_user', JSON.stringify(data));
          } else {
            // First time login via provider or fallback
            const newUser: User = {
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
              email: fbUser.email || '',
              phone: fbUser.phoneNumber || '+232 77 000000',
              role: fbUser.email === 'admin@jdmart.sl' || fbUser.email === 'admin@jdmart.com' ? 'admin' : 'buyer',
              avatar: fbUser.photoURL || '/assets/icons/account.gif',
              status: 'active',
              verified: fbUser.emailVerified || false,
              walletBalance: 0,
            };
            await setDoc(userDocRef, {
              ...newUser,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
            setCurrentUser(newUser);
            localStorage.setItem('jdmart_current_user', JSON.stringify(newUser));
          }
        } catch (error) {
          console.warn('Firestore user profile fetch error:', error);
        }
      } else {
        // Not authenticated in Firebase Auth
        const saved = localStorage.getItem('jdmart_current_user');
        if (saved) {
          try {
            setCurrentUser(JSON.parse(saved));
          } catch {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const userRole: UserRole = currentUser ? currentUser.role : 'Guest';

  // Firestore Real-Time Listeners
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('jdmart_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('jdmart_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  const [stores, setStores] = useState<Store[]>(() => {
    const saved = localStorage.getItem('jdmart_stores');
    return saved ? JSON.parse(saved) : INITIAL_STORES;
  });
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('jdmart_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [riderDeliveries, setRiderDeliveries] = useState<RiderDelivery[]>(() => {
    const saved = localStorage.getItem('jdmart_rider_deliveries');
    return saved ? JSON.parse(saved) : INITIAL_RIDER_DELIVERIES;
  });
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('jdmart_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // 1. Public Real-time Firestore sync subscriptions (Products & Jobs)
  useEffect(() => {
    let unsubProducts = () => {};
    let unsubJobs = () => {};

    try {
      unsubProducts = onSnapshot(
        collection(db, 'products'),
        (snapshot) => {
          const items: Product[] = [];
          snapshot.forEach((d) => items.push({ id: d.id, ...d.data() } as Product));
          if (items.length > 0) {
            setProducts(items);
            localStorage.setItem('jdmart_products', JSON.stringify(items));
          }
        },
        (error) => {
          console.warn('Firestore products public sync notice:', error.message);
        }
      );

      unsubJobs = onSnapshot(
        collection(db, 'jobs'),
        (snapshot) => {
          const items: Job[] = [];
          snapshot.forEach((d) => items.push({ id: d.id, ...d.data() } as Job));
          if (items.length > 0) {
            setJobs(items);
            localStorage.setItem('jdmart_jobs', JSON.stringify(items));
          }
        },
        (error) => {
          console.warn('Firestore jobs public sync notice:', error.message);
        }
      );
    } catch (e) {
      console.warn('Public collections snapshot setup notice:', e);
    }

    return () => {
      unsubProducts();
      unsubJobs();
    };
  }, []);

  // 2. Authenticated Real-time Firestore sync subscriptions
  useEffect(() => {
    // Only attach authenticated snapshot listeners if auth is ready and user is signed in
    if (authLoading || !firebaseUser) {
      return;
    }

    const unsubs: (() => void)[] = [];
    const uid = firebaseUser.uid;
    const email = firebaseUser.email || '';
    const isAdminUser =
      email === 'dalabapays@gmail.com' ||
      email === 'admin@jdmart.sl' ||
      email === 'admin@jdmart.com' ||
      currentUser?.role === 'admin';

    try {
      // 1. Orders
      if (isAdminUser) {
        const unsub = onSnapshot(
          collection(db, 'orders'),
          (snapshot) => {
            const items: Order[] = [];
            snapshot.forEach((d) => items.push({ id: d.id, ...d.data() } as Order));
            if (items.length > 0) {
              setOrders(items);
              localStorage.setItem('jdmart_orders', JSON.stringify(items));
            }
          },
          (error) => {
            console.warn('Admin orders sync notice:', error.message);
          }
        );
        unsubs.push(unsub);
      } else {
        const userRoleNorm = (currentUser?.role || '').toLowerCase();
        let ordersQuery;
        if (userRoleNorm === 'seller') {
          ordersQuery = query(collection(db, 'orders'), where('sellerId', '==', uid));
        } else if (userRoleNorm === 'dispatcher' || userRoleNorm === 'rider') {
          ordersQuery = query(collection(db, 'orders'), where('riderId', '==', uid));
        } else {
          ordersQuery = query(collection(db, 'orders'), where('buyerId', '==', uid));
        }

        const unsub = onSnapshot(
          ordersQuery,
          (snapshot) => {
            const items: Order[] = [];
            snapshot.forEach((d) => items.push({ id: d.id, ...d.data() } as Order));
            if (items.length > 0) {
              setOrders(items);
              localStorage.setItem('jdmart_orders', JSON.stringify(items));
            }
          },
          (error) => {
            console.warn('User orders sync notice:', error.message);
          }
        );
        unsubs.push(unsub);
      }

      // 2. Deliveries (Admins or Couriers)
      if (isAdminUser || ['dispatcher', 'rider'].includes((currentUser?.role || '').toLowerCase())) {
        const unsub = onSnapshot(
          collection(db, 'deliveries'),
          (snapshot) => {
            const items: RiderDelivery[] = [];
            snapshot.forEach((d) => items.push({ id: d.id, ...d.data() } as RiderDelivery));
            if (items.length > 0) {
              setRiderDeliveries(items);
              localStorage.setItem('jdmart_rider_deliveries', JSON.stringify(items));
            }
          },
          (error) => {
            console.warn('Deliveries sync notice:', error.message);
          }
        );
        unsubs.push(unsub);
      }

      // 3. Users Directory (Admin Only)
      if (isAdminUser) {
        const unsub = onSnapshot(
          collection(db, 'users'),
          (snapshot) => {
            const items: User[] = [];
            snapshot.forEach((d) => items.push({ id: d.id, ...d.data() } as User));
            if (items.length > 0) {
              setUsers(items);
              localStorage.setItem('jdmart_users', JSON.stringify(items));
            }
          },
          (error) => {
            console.warn('Admin users directory sync notice:', error.message);
          }
        );
        unsubs.push(unsub);
      }

      // 4. Notifications (User Scoped)
      const notifQuery = query(collection(db, 'notifications'), where('userId', '==', uid));
      const unsubNotif = onSnapshot(
        notifQuery,
        (snapshot) => {
          const items: AppNotification[] = [];
          snapshot.forEach((d) => items.push({ id: d.id, ...d.data() } as AppNotification));
          if (items.length > 0) {
            setNotifications(items);
            localStorage.setItem('jdmart_notifications', JSON.stringify(items));
          }
        },
        (error) => {
          console.warn('Notifications sync notice:', error.message);
        }
      );
      unsubs.push(unsubNotif);

      // 5. Applications (Employer or Candidate)
      if (isAdminUser) {
        const unsubApp = onSnapshot(
          collection(db, 'applications'),
          (snapshot) => {
            const items: JobApplication[] = [];
            snapshot.forEach((d) => items.push({ id: d.id, ...d.data() } as JobApplication));
            setApplications(items);
          },
          (error) => {
            console.warn('Admin applications sync notice:', error.message);
          }
        );
        unsubs.push(unsubApp);
      } else {
        const appQuery = query(collection(db, 'applications'), where('applicantId', '==', uid));
        const unsubApp = onSnapshot(
          appQuery,
          (snapshot) => {
            const items: JobApplication[] = [];
            snapshot.forEach((d) => items.push({ id: d.id, ...d.data() } as JobApplication));
            setApplications(items);
          },
          (error) => {
            console.warn('User applications sync notice:', error.message);
          }
        );
        unsubs.push(unsubApp);
      }
    } catch (e) {
      console.warn('Authenticated snapshot listeners setup error:', e);
    }

    return () => {
      unsubs.forEach((unsub) => {
        try {
          unsub();
        } catch {}
      });
    };
  }, [authLoading, firebaseUser, currentUser?.role]);

  // Role Redirection Helper
  const redirectAfterLogin = (role: UserRole) => {
    const r = (role || 'buyer').toLowerCase();
    if (r === 'admin') navigate('/admin');
    else if (r === 'seller') navigate('/seller');
    else if (r === 'dispatcher' || r === 'rider') navigate('/rider');
    else if (r === 'employer') navigate('/employer');
    else if (r === 'employee' || r === 'job seeker') navigate('/job-seeker/dashboard');
    else navigate('/dashboard');
  };

  // Authentication Methods
  const registerWithEmail = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = 'buyer',
    phone: string = '+232 76 000000'
  ): Promise<boolean> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      await updateProfile(cred.user, { displayName: name });

      const normalizedRole = role.toLowerCase() as UserRole;
      const newUser: User = {
        id: cred.user.uid,
        name,
        email: cleanEmail,
        phone,
        role: normalizedRole,
        avatar: '/assets/icons/account.gif',
        status: 'active',
        verified: false,
        walletBalance: 0,
      };

      await setDoc(doc(db, 'users', cred.user.uid), {
        ...newUser,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setCurrentUser(newUser);
      localStorage.setItem('jdmart_current_user', JSON.stringify(newUser));

      // Trigger Welcome Email
      fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'welcome',
          to: cleanEmail,
          recipientName: name,
          role: normalizedRole,
        }),
      }).catch((e) => console.warn('Welcome email error:', e));

      showToast(`Account successfully registered as ${normalizedRole}!`);
      // Trigger Verification Email
      try {
        await sendEmailVerification(cred.user);
      } catch (e) {
        console.warn('Auto verification notice:', e);
      }
      redirectAfterLogin(normalizedRole);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      showToast(msg.replace('Firebase: ', ''));
      return false;
    }
  };

  const loginWithGoogle = async (preferredRole: UserRole = 'buyer'): Promise<boolean> => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const fbUser = cred.user;
      const userDocRef = doc(db, 'users', fbUser.uid);
      const snap = await getDoc(userDocRef);
      let userData: User;
      if (snap.exists()) {
        userData = snap.data() as User;
      } else {
        const isAdmin = fbUser.email === 'admin@jdmart.sl' || fbUser.email === 'admin@jdmart.com';
        const roleNormalized = isAdmin ? 'admin' : ((preferredRole || 'buyer').toLowerCase() as UserRole);
        userData = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          email: fbUser.email || '',
          phone: fbUser.phoneNumber || '+232 77 000000',
          role: roleNormalized,
          avatar: fbUser.photoURL || '/assets/icons/account.gif',
          status: 'active',
          verified: fbUser.emailVerified || false,
          walletBalance: 0,
        };
        await setDoc(userDocRef, {
          ...userData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        // Trigger Welcome Email
        fetch('/api/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'welcome',
            to: userData.email,
            recipientName: userData.name,
            role: userData.role,
          }),
        }).catch(() => {});
      }
      setCurrentUser(userData);
      localStorage.setItem('jdmart_current_user', JSON.stringify(userData));
      showToast(`Signed in with Google as ${userData.name}!`);
      redirectAfterLogin(userData.role);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in error';
      showToast(msg.replace('Firebase: ', ''));
      return false;
    }
  };

  const sendVerificationEmail = async (): Promise<boolean> => {
    if (!auth.currentUser) {
      showToast('Please sign in to verify your email address.');
      return false;
    }
    try {
      await sendEmailVerification(auth.currentUser);
      showToast(`Verification link sent to ${auth.currentUser.email}`);
      // Server-side notification backup
      fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'email_verification',
          to: auth.currentUser.email,
          recipientName: currentUser?.name || 'Member',
        }),
      }).catch(() => {});
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send verification';
      showToast(msg.replace('Firebase: ', ''));
      return false;
    }
  };

  const loginWithEmail = async (email: string, password = 'password123'): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();

    // Administrator Direct Authentication
    if (cleanEmail === 'admin@jdmart.sl' || cleanEmail === 'admin@jdmart.com') {
      try {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
        if (userDoc.exists()) {
          const adminData = userDoc.data() as User;
          setCurrentUser(adminData);
          localStorage.setItem('jdmart_current_user', JSON.stringify(adminData));
        } else {
          const adminObj: User = { ...SYSTEM_ADMIN_USER, id: cred.user.uid, role: 'admin' };
          await setDoc(doc(db, 'users', cred.user.uid), adminObj);
          setCurrentUser(adminObj);
          localStorage.setItem('jdmart_current_user', JSON.stringify(adminObj));
        }
      } catch {
        // If not in Firebase Auth, provision document
        try {
          const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
          const adminObj: User = { ...SYSTEM_ADMIN_USER, id: cred.user.uid, role: 'admin' };
          await setDoc(doc(db, 'users', cred.user.uid), adminObj);
          setCurrentUser(adminObj);
          localStorage.setItem('jdmart_current_user', JSON.stringify(adminObj));
        } catch {
          setCurrentUser(SYSTEM_ADMIN_USER);
          localStorage.setItem('jdmart_current_user', JSON.stringify(SYSTEM_ADMIN_USER));
        }
      }
      showToast('Logged in as Administrator');
      navigate('/admin');
      return true;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
      if (userDoc.exists()) {
        const u = userDoc.data() as User;
        setCurrentUser(u);
        localStorage.setItem('jdmart_current_user', JSON.stringify(u));
        showToast(`Welcome back, ${u.name}!`);
        redirectAfterLogin(u.role);
        return true;
      }
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      showToast(msg.replace('Firebase: ', ''));
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      showToast('Password reset link sent to your email.');
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send password reset';
      showToast(msg.replace('Firebase: ', ''));
      return false;
    }
  };

  const login = (email: string, role?: UserRole) => {
    loginWithEmail(email).catch(() => {});
    return true;
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // ignore
    }
    setCurrentUser(null);
    localStorage.removeItem('jdmart_current_user');
    showToast('You have been signed out.');
    navigate('/');
  };

  const switchRole = (role: UserRole) => {
    if (role === 'Guest') {
      logout();
      return;
    }
    if (currentUser) {
      const updated = { ...currentUser, role };
      setCurrentUser(updated);
      localStorage.setItem('jdmart_current_user', JSON.stringify(updated));
      showToast(`Switched active workspace to: ${role}`);
      redirectAfterLogin(role);
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    localStorage.setItem('jdmart_current_user', JSON.stringify(updated));

    try {
      await updateDoc(doc(db, 'users', currentUser.id), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore profile update sync:', e);
    }
    showToast('Profile updated successfully');
  };

  const updateUserStatus = async (
    userId: string,
    status: 'active' | 'suspended' | 'pending',
    verified?: boolean
  ) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, status, ...(verified !== undefined ? { verified } : {}) };
        }
        return u;
      })
    );

    try {
      await updateDoc(doc(db, 'users', userId), {
        status,
        ...(verified !== undefined ? { verified } : {}),
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore user status sync:', e);
    }
    showToast(`User status updated to ${status}`);
  };

  // Products Management
  const addProduct = async (prodData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    const id = `prod-${Date.now()}`;
    const newProd: Product = {
      ...prodData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newProd, ...products];
    setProducts(updated);
    localStorage.setItem('jdmart_products', JSON.stringify(updated));

    try {
      await setDoc(doc(db, 'products', id), {
        ...newProd,
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore product creation sync:', e);
    }

    showToast('Product listed successfully in Firestore catalog!');
    return newProd;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setProducts(updated);
    localStorage.setItem('jdmart_products', JSON.stringify(updated));

    try {
      await updateDoc(doc(db, 'products', id), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore product update sync:', e);
    }
    showToast('Product updated successfully!');
  };

  const deleteProduct = async (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem('jdmart_products', JSON.stringify(updated));

    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      console.warn('Firestore product delete sync:', e);
    }
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
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
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
    return saved ? JSON.parse(saved) : [];
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

  // Store Management
  const updateStore = async (storeId: string, updates: Partial<Store>) => {
    setStores((prev) => prev.map((s) => (s.id === storeId ? { ...s, ...updates } : s)));
    showToast('Store settings saved');
  };

  // Orders & Deliveries
  const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
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
      sellerId: orderData.items?.[0]?.sellerId || 'seller-partner',
      sellerName: orderData.items?.[0]?.sellerName || 'JD Verified Store',
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

    // Courier Delivery Entry
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

    // Firestore Persistence
    try {
      await setDoc(doc(db, 'orders', newId), newOrder);
      await setDoc(doc(db, 'deliveries', newDelivery.id), newDelivery);
      await setDoc(doc(db, 'payments', `pay-${newId}`), {
        id: `pay-${newId}`,
        orderId: newId,
        userId: newOrder.buyerId,
        amount: newOrder.total,
        currency: 'SLL',
        status: 'Completed',
        paymentMethod: 'Escrow / Card / Mobile Money',
        transactionRef: `TX-${Date.now()}`,
        createdAt: timeStr,
      });
    } catch (e) {
      console.warn('Firestore order creation sync:', e);
    }

    // Trigger Order Confirmation Email to Buyer
    fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'order_confirmation',
        to: currentUser?.email || 'customer@jdmart.sl',
        recipientName: newOrder.buyerName,
        orderId: newId,
        amount: newOrder.total,
        trackingUrl: `${window.location.origin}/orders/${newId}`,
      }),
    }).catch((e) => console.warn('Order email notification error:', e));

    // Trigger Seller Notification Email
    fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'seller_notification',
        to: 'seller@jdmart.sl',
        recipientName: newOrder.sellerName,
        orderId: newId,
        amount: newOrder.total,
        details: `${newOrder.items.length} items ordered by ${newOrder.buyerName}. Please package for courier pickup.`,
      }),
    }).catch(() => {});

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, note?: string) => {
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    let updatedTarget: Order | null = null;
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updated = {
            ...order,
            orderStatus: status,
            timeline: [
              ...order.timeline,
              { status, timestamp: timeStr, description: note || `Status updated to ${status}` },
            ],
          };
          updatedTarget = updated;
          return updated;
        }
        return order;
      })
    );

    try {
      if (updatedTarget) {
        await updateDoc(doc(db, 'orders', orderId), {
          orderStatus: status,
          timeline: (updatedTarget as Order).timeline,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.warn('Firestore order status sync:', e);
    }

    // Send email alert for order status
    fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'order_status',
        to: (updatedTarget as Order | null)?.buyerPhone || 'customer@jdmart.sl',
        orderId,
        details: note || `Your package is now: ${status}`,
      }),
    }).catch(() => {});

    showToast(`Order #${orderId} marked as ${status}`);
  };

  const assignRiderToOrder = async (orderId: string, riderId: string, riderName: string, riderPhone: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, riderId, riderName, riderPhone, orderStatus: 'Out for Delivery' } : o))
    );
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        riderId,
        riderName,
        riderPhone,
        orderStatus: 'Out for Delivery',
      });
    } catch (e) {
      console.warn('Firestore rider assignment sync:', e);
    }
    showToast(`Rider ${riderName} assigned to order #${orderId}`);
  };

  const rateOrder = async (orderId: string, rating: number) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, rating } : o)));
    try {
      await updateDoc(doc(db, 'orders', orderId), { rating });
    } catch (e) {
      console.warn('Firestore order rating sync:', e);
    }
    showToast(`Thank you for rating your order ${rating} stars!`);
  };

  const cancelOrder = async (orderId: string, reason: string) => {
    await updateOrderStatus(orderId, 'Cancelled', `Cancellation reason: ${reason}`);
    showToast(`Order #${orderId} has been cancelled`);
  };

  // Courier Rider
  const [riderOnline, setRiderOnline] = useState<boolean>(true);
  const toggleRiderOnline = () => {
    setRiderOnline((prev) => {
      const next = !prev;
      showToast(next ? 'You are now ONLINE to receive orders' : 'You are now OFFLINE');
      return next;
    });
  };

  const acceptDelivery = async (deliveryId: string) => {
    setRiderDeliveries((prev) =>
      prev.map((d) => (d.id === deliveryId ? { ...d, status: 'Accepted', riderId: currentUser?.id } : d))
    );
    try {
      await updateDoc(doc(db, 'deliveries', deliveryId), {
        status: 'Accepted',
        riderId: currentUser?.id,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore delivery accept sync:', e);
    }
    showToast('Delivery trip accepted! Head to the store for pickup.');
  };

  const updateDeliveryStatus = async (
    deliveryId: string,
    status: 'In Transit' | 'Delivered',
    photo?: string
  ) => {
    setRiderDeliveries((prev) =>
      prev.map((d) =>
        d.id === deliveryId ? { ...d, status, ...(photo ? { proofOfDeliveryPhoto: photo } : {}) } : d
      )
    );
    try {
      await updateDoc(doc(db, 'deliveries', deliveryId), {
        status,
        ...(photo ? { proofOfDeliveryPhoto: photo } : {}),
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore delivery update sync:', e);
    }
    showToast(`Delivery status updated: ${status}`);
  };

  // Jobs Management
  const postJob = async (jobData: Omit<Job, 'id' | 'applicantCount' | 'postedDate'>): Promise<Job> => {
    const newId = `job-${Date.now()}`;
    const newJob: Job = {
      ...jobData,
      id: newId,
      applicantCount: 0,
      postedDate: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    const updated = [newJob, ...jobs];
    setJobs(updated);
    localStorage.setItem('jdmart_jobs', JSON.stringify(updated));

    try {
      await setDoc(doc(db, 'jobs', newId), newJob);
    } catch (e) {
      console.warn('Firestore job creation sync:', e);
    }

    showToast('Job listing published to JD Mart Careers!');
    return newJob;
  };

  const applyForJob = async (
    jobId: string,
    appData: { fullName: string; email: string; phone: string; coverNote: string; resumeSummary: string; resumeFileUrl?: string }
  ) => {
    const job = jobs.find((j) => j.id === jobId);
    const newAppId = `app-${Date.now()}`;
    const newApplication: JobApplication = {
      id: newAppId,
      jobId,
      jobTitle: job?.title || 'Open Position',
      companyName: job?.employerName || 'Employer',
      applicantId: currentUser?.id || 'applicant-1',
      fullName: appData.fullName,
      email: appData.email,
      phone: appData.phone,
      coverNote: appData.coverNote,
      resumeSummary: appData.resumeSummary,
      resumeFileUrl: appData.resumeFileUrl,
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
    };

    setApplications((prev) => [newApplication, ...prev]);

    try {
      await setDoc(doc(db, 'applications', newAppId), newApplication);
      if (job) {
        await updateDoc(doc(db, 'jobs', jobId), {
          applicantCount: (job.applicantCount || 0) + 1,
        });
      }
    } catch (e) {
      console.warn('Firestore job application sync:', e);
    }

    // Trigger Notification Email
    fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'job_application',
        to: appData.email,
        recipientName: appData.fullName,
        jobTitle: job?.title || 'Position',
      }),
    }).catch(() => {});

    showToast('Application submitted successfully!');
  };

  const updateApplicationStatus = async (appId: string, status: JobApplication['status']) => {
    setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status } : a)));
    try {
      await updateDoc(doc(db, 'applications', appId), { status });
    } catch (e) {
      console.warn('Firestore app status sync:', e);
    }
    showToast(`Application marked as ${status}`);
  };

  // Cloud Storage & Gemini AI
  const uploadFile = async (
    file: File,
    category: StorageCategory,
    entityId = 'general',
    onProgress?: (p: number) => void
  ): Promise<UploadedFileMetadata> => {
    const uploaderId = currentUser?.id || 'guest_user';
    const metadata = await uploadAppFile(file, category, entityId, uploaderId, onProgress);
    showToast(`File "${file.name}" uploaded successfully!`);
    return metadata;
  };

  const generateAIDescription = async (title: string, category?: string): Promise<string> => {
    try {
      const res = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category }),
      });
      const data = await res.json();
      if (data.description) {
        return data.description;
      }
      return `Premium ${title} available with fast dispatch delivery across Sierra Leone. Guaranteed quality and genuine build.`;
    } catch {
      return `High quality ${title} with official guarantee and nationwide dispatch in Sierra Leone.`;
    }
  };

  const analyzeImageWithAI = async (imageUrl?: string, base64?: string): Promise<any> => {
    try {
      const res = await fetch('/api/ai/describe-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, base64Data: base64 }),
      });
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('AI image analysis error:', err);
      return null;
    }
  };

  // UI Drawer, Notifications & Cart Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
        firebaseUser,
        authLoading,
        userRole,
        switchRole,
        login,
        loginWithEmail,
        loginWithGoogle,
        registerWithEmail,
        resetPassword,
        sendVerificationEmail,
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

        uploadFile,
        generateAIDescription,
        analyzeImageWithAI,

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
