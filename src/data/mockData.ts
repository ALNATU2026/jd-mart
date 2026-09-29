import { Category, Product, Store, Job, Order, RiderDelivery, User, AppNotification } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics', icon: '/assets/icons/electronics.png', itemCount: 0, description: 'Gadgets, audio, power banks and tech accessories' },
  { id: '2', name: 'Phones & Tablets', slug: 'phones', icon: '/assets/icons/delivery.png', itemCount: 0, description: 'Smartphones, cases, chargers & tablets' },
  { id: '3', name: 'Computers & Laptops', slug: 'computers', icon: '/assets/icons/store.png', itemCount: 0, description: 'Laptops, desktops, accessories & monitors' },
  { id: '4', name: 'Fashion & Apparel', slug: 'fashion', icon: '/assets/icons/fashion.png', itemCount: 0, description: 'Men, women and kids clothing and shoes' },
  { id: '5', name: 'Beauty & Skincare', slug: 'beauty', icon: '/assets/icons/beauty.png', itemCount: 0, description: 'Skincare, haircare, fragrances & cosmetics' },
  { id: '6', name: 'Home & Kitchen', slug: 'home-kitchen', icon: '/assets/icons/home.gif', itemCount: 0, description: 'Cookware, appliances & home essentials' },
  { id: '7', name: 'Furniture', slug: 'furniture', icon: '/assets/icons/sofa.png', itemCount: 0, description: 'Sofas, beds, office desks & dining sets' },
  { id: '8', name: 'Food & Groceries', slug: 'food', icon: '/assets/icons/discount.png', itemCount: 0, description: 'Fresh produce, packaged foods & beverages' },
  { id: '9', name: 'Automotive', slug: 'automotive', icon: '/assets/icons/delivery.png', itemCount: 0, description: 'Car parts, motor oils & maintenance gear' },
  { id: '10', name: 'Agriculture', slug: 'agriculture', icon: '/assets/icons/categories.png', itemCount: 0, description: 'Farming tools, seeds & agro equipment' },
  { id: '11', name: 'Accessories', slug: 'accessories', icon: '/assets/icons/mystore.gif', itemCount: 0, description: 'Watches, bags, jewelry & sunglasses' },
  { id: '12', name: 'Services & Gigs', slug: 'services', icon: '/assets/icons/support.png', itemCount: 0, description: 'Repair, plumbing, tutoring & design services' },
];

export const SYSTEM_ADMIN_USER: User = {
  id: 'admin-master',
  name: 'System Administrator',
  email: 'admin@jdmart.sl',
  phone: '+232 76 000000',
  role: 'Admin',
  avatar: '/assets/icons/setting.gif',
  address: 'JD Mart HQ, Freetown',
  city: 'Freetown',
  status: 'active',
  verified: true,
  walletBalance: 0,
};

// Clean non-mock initial arrays
export const INITIAL_PRODUCTS: Product[] = [];
export const INITIAL_STORES: Store[] = [];
export const INITIAL_JOBS: Job[] = [];
export const INITIAL_USERS: User[] = [SYSTEM_ADMIN_USER];
export const INITIAL_ORDERS: Order[] = [];
export const INITIAL_RIDER_DELIVERIES: RiderDelivery[] = [];
export const INITIAL_NOTIFICATIONS: AppNotification[] = [];
