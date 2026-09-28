import { Product, MenuItemModel, FeatureItem, CategoryItem, OnboardingItem, PlatformRole } from '../types';

export const APP_COLORS = {
  primary: '#1E40AF',
  secondary: '#F97316',
  background: '#F8FAFC',
  scaffoldBg: '#F5F7FB',
  dark: '#0F172A',
  white: '#FFFFFF',
};

export const PLATFORM_ROLES: PlatformRole[] = [
  'Buyer',
  'Seller',
  'Rider',
  'Job Seeker',
  'Employer',
  'Admin',
];

export const BANNERS = [
  '/assets/images/homeheader1.png',
  '/assets/images/homeheader2.png',
  '/assets/images/homeheader3.png',
];

export const FEATURES: FeatureItem[] = [
  {
    title: 'Top Deals',
    subtitle: 'Best offers',
    icon: '/assets/icons/discount.png',
    color: '#EAF1FF',
  },
  {
    title: 'Fast Delivery',
    subtitle: 'Quick delivery',
    icon: '/assets/icons/delivery.png',
    color: '#FFF2E8',
  },
  {
    title: 'Secure Payment',
    subtitle: '100% secure',
    icon: '/assets/icons/security.png',
    color: '#E9FFF3',
  },
  {
    title: '24/7 Support',
    subtitle: 'Always here',
    icon: '/assets/icons/support.png',
    color: '#F3F0FF',
  },
];

export const CATEGORIES: CategoryItem[] = [
  { id: '1', title: 'Electronics', icon: '/assets/icons/electronics.png', color: '#EAF1FF' },
  { id: '2', title: 'Fashion', icon: '/assets/icons/fashion.png', color: '#FFF2E8' },
  { id: '3', title: 'Home', icon: '/assets/icons/sofa.png', color: '#E9FFF3' },
  { id: '4', title: 'Beauty', icon: '/assets/icons/beauty.png', color: '#F3E8FF' },
  { id: '5', title: 'Sports', icon: '/assets/icons/sports.png', color: '#F0FDF4' },
  { id: '6', title: 'More', icon: '/assets/icons/more.png', color: '#F3F5F9' },
];

export const FLASH_DEALS: Product[] = [
  {
    id: 'p1',
    image: '/assets/images/smartwatch.jpg',
    title: 'Smart Watch Series 8',
    price: 'Le 45',
    oldPrice: 'Le 75',
    discount: '-40%',
    timer: '02:45:30',
    description: 'Premium quality product built for everyday use. Designed for comfort, convenience, and a stylish lifestyle experience with trusted performance and modern appeal.',
    rating: 4.8,
    reviewsCount: 1248,
    category: 'Electronics',
  },
  {
    id: 'p2',
    image: '/assets/images/sneaker.jpg',
    title: "Men's Sneakers",
    price: 'Le 21',
    oldPrice: 'Le 30',
    discount: '-30%',
    timer: '01:20:15',
    description: 'Durable and lightweight footwear designed for athletic and casual daily wear. Features high traction soles and breathable upper knit.',
    rating: 4.7,
    reviewsCount: 890,
    category: 'Fashion',
  },
  {
    id: 'p3',
    image: '/assets/images/headphone.jpg',
    title: 'Wireless Headphone',
    price: 'Le 18.75',
    oldPrice: 'Le 25',
    discount: '-25%',
    timer: '03:10:05',
    description: 'High-definition sound with active noise cancellation, ultra-soft ear cushions, and up to 40 hours of playtime on a single charge.',
    rating: 4.9,
    reviewsCount: 2150,
    category: 'Electronics',
  },
  {
    id: 'p4',
    image: '/assets/images/handbag.jpg',
    title: 'Luxury Handbag',
    price: 'Le 32',
    oldPrice: 'Le 50',
    discount: '-35%',
    timer: '02:00:40',
    description: 'Crafted with premium vegan leather, multiple compartments, and elegant metal hardware for sophisticated modern styling.',
    rating: 4.6,
    reviewsCount: 640,
    category: 'Fashion',
  },
];

export const MENU_ITEMS: MenuItemModel[] = [
  { id: 'home', title: 'Home', icon: '/assets/icons/home.gif' },
  { id: 'account', title: 'Account', icon: '/assets/icons/account.gif' },
  { id: 'categories', title: 'Categories', icon: '/assets/icons/categories.png' },
  { id: 'deals', title: 'Deals', icon: '/assets/icons/deals.gif' },
  { id: 'orders', title: 'My Orders', icon: '/assets/icons/myorder.png' },
  { id: 'wishlist', title: 'Wishlist', icon: '/assets/icons/wishlist.gif' },
  { id: 'messages', title: 'Messages', icon: '/assets/icons/message.png' },
  { id: 'notifications', title: 'Notifications', icon: '/assets/icons/notification.gif' },
  { id: 'store', title: 'My Store', icon: '/assets/icons/mystore.gif' },
  { id: 'support', title: 'Help & Support', icon: '/assets/icons/help.gif' },
  { id: 'settings', title: 'Settings', icon: '/assets/icons/setting.gif' },
];

export const ONBOARDING_PAGES: OnboardingItem[] = [
  {
    image: '/assets/images/onboarding1.png',
    title: 'Discover trending deals',
    subtitle: 'Explore handpicked deals from trusted sellers and save more on every purchase.',
  },
  {
    image: '/assets/images/onboarding2.png',
    title: 'Fast delivery, easy checkout',
    subtitle: 'Enjoy smooth shopping with quick delivery and secure payment options in a few taps.',
  },
  {
    image: '/assets/images/onboarding3.png',
    title: 'Sell smarter and grow faster',
    subtitle: 'Launch your store, reach more buyers, and manage sales from one simple mobile experience.',
  },
];
