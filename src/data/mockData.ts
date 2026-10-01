import {
  Category,
  Product,
  Store,
  Job,
  Order,
  RiderDelivery,
  User,
  AppNotification,
  UserReview,
  UserReport,
  ChatMessage,
  PaymentRecord,
  SellerPayout,
  WorkerProfile,
  EmployerProfile,
  RiderProfile,
  InterviewSchedule,
  RiderPayout,
} from '../types';

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
  role: 'ADMIN',
  roles: ['ADMIN', 'BUYER', 'SELLER', 'EMPLOYER', 'DISPATCH_RIDER'],
  avatar: '/assets/icons/setting.gif',
  address: 'JD Mart HQ, Freetown',
  city: 'Freetown',
  status: 'active',
  verified: true,
  walletBalance: 0,
};

// Clean initial arrays
export const INITIAL_PRODUCTS: Product[] = [];
export const INITIAL_STORES: Store[] = [];
export const INITIAL_JOBS: Job[] = [];
export const INITIAL_USERS: User[] = [SYSTEM_ADMIN_USER];
export const INITIAL_ORDERS: Order[] = [];
export const INITIAL_RIDER_DELIVERIES: RiderDelivery[] = [];
export const INITIAL_NOTIFICATIONS: AppNotification[] = [];
export const INITIAL_REVIEWS: UserReview[] = [];
export const INITIAL_REPORTS: UserReport[] = [];
export const INITIAL_MESSAGES: ChatMessage[] = [];
export const INITIAL_PAYMENTS: PaymentRecord[] = [];
export const INITIAL_PAYOUTS: SellerPayout[] = [];

export const INITIAL_WORKER_PROFILES: WorkerProfile[] = [];

export const INITIAL_EMPLOYER_PROFILES: EmployerProfile[] = [
  {
    id: 'emp-profile-1',
    userId: 'admin-master',
    companyName: 'JD Mart Logistics & Retail Ltd',
    logo: '/assets/logos/jdmart_logo.png',
    description: 'Premier e-commerce marketplace and express dispatch distribution network operating across Sierra Leone.',
    phone: '+232 76 123456',
    email: 'careers@jdmart.sl',
    location: '15 Siaka Stevens Street, Freetown',
    website: 'https://jdmart.sl',
    industry: 'E-commerce & Express Logistics',
    companySize: '50-100 Employees',
    companyInfo: 'Founded in Freetown to empower local merchants and deliver everyday essentials with speed and reliability.',
    verificationStatus: 'verified',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_RIDER_PROFILES: RiderProfile[] = [
  {
    id: 'rdr-prof-1',
    userId: 'rider-user-1',
    fullName: 'Samuel Bangura',
    profilePhoto: '/assets/icons/delivery.png',
    phoneNumber: '+232 79 334455',
    address: '24 Circular Road',
    city: 'Freetown',
    identificationType: 'National ID',
    idNumber: 'NID-SL-908124',
    vehicleType: 'Motorcycle',
    vehicleModel: 'Bajaj Boxer 150cc',
    vehicleRegistrationNumber: 'SL-AB 2049',
    driverLicenseNumber: 'SL-LIC-99482',
    approvalStatus: 'approved',
    accountStatus: 'active',
    availability: 'ONLINE',
    rating: 4.9,
    totalDeliveries: 142,
    activeSince: '2025-01-10',
    createdAt: '2025-01-10T08:00:00.000Z',
  },
  {
    id: 'rdr-prof-2',
    userId: 'rider-user-2',
    fullName: 'Alpha Bah',
    profilePhoto: '/assets/icons/delivery.png',
    phoneNumber: '+232 77 119922',
    address: '12 Campbell Street',
    city: 'Freetown',
    identificationType: 'Driver License',
    idNumber: 'SL-DL-88392',
    vehicleType: 'Motorcycle',
    vehicleModel: 'TVS Star HLX',
    vehicleRegistrationNumber: 'SL-CD 1032',
    driverLicenseNumber: 'SL-LIC-88392',
    approvalStatus: 'approved',
    accountStatus: 'active',
    availability: 'AVAILABLE',
    rating: 4.8,
    totalDeliveries: 89,
    activeSince: '2025-02-14',
    createdAt: '2025-02-14T09:30:00.000Z',
  },
  {
    id: 'rdr-prof-3',
    userId: 'rider-user-3',
    fullName: 'Alhaji Kamara',
    profilePhoto: '/assets/icons/delivery.png',
    phoneNumber: '+232 30 442211',
    address: '58 Wilkinson Road',
    city: 'Freetown',
    identificationType: 'Voter ID',
    idNumber: 'VID-2023-44109',
    vehicleType: 'Motorcycle',
    vehicleModel: 'Haojue 125cc',
    vehicleRegistrationNumber: 'SL-EF 4021',
    driverLicenseNumber: 'SL-LIC-40210',
    approvalStatus: 'pending',
    accountStatus: 'pending',
    availability: 'OFFLINE',
    rating: 5.0,
    totalDeliveries: 0,
    createdAt: '2025-09-28T14:20:00.000Z',
  },
];

export const INITIAL_INTERVIEWS: InterviewSchedule[] = [];
export const INITIAL_RIDER_PAYOUTS: RiderPayout[] = [];

