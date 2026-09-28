export type UserRole = 'Guest' | 'Buyer' | 'Seller' | 'Rider' | 'Job Seeker' | 'Employer' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  address?: string;
  city?: string;
  status: 'active' | 'suspended' | 'pending';
  verified: boolean;
  storeId?: string;
  vehicleType?: 'motorbike' | 'bicycle' | 'car' | 'van';
  licensePlate?: string;
  walletBalance: number;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  image: string;
  category: string;
  description: string;
  stock: number;
  sellerId: string;
  sellerName: string;
  sellerLocation: string;
  sellerRating: number;
  condition: 'Brand New' | 'Refurbished' | 'Fair';
  rating: number;
  reviewsCount: number;
  featured?: boolean;
  status: 'active' | 'inactive' | 'pending';
  deliveryAvailable: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  itemCount: number;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Ready for Pickup'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  sellerId: string;
  sellerName: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  buyerCity: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  deliveryMethod: 'Standard' | 'Express' | 'Pickup';
  paymentStatus: 'Paid' | 'Pending Cash on Delivery';
  orderStatus: OrderStatus;
  sellerId: string;
  sellerName: string;
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    description: string;
  }[];
  createdAt: string;
  estimatedDelivery: string;
  rating?: number;
  issueReported?: string;
}

export interface Store {
  id: string;
  sellerId: string;
  name: string;
  slug: string;
  logo: string;
  banner?: string;
  description: string;
  location: string;
  phone: string;
  email: string;
  status: 'active' | 'pending' | 'suspended';
  verified: boolean;
  rating: number;
  totalSales: number;
  totalProducts: number;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    momoNumber?: string;
  };
}

export interface RiderDelivery {
  id: string;
  orderId: string;
  riderId?: string;
  pickupLocation: string;
  deliveryLocation: string;
  sellerName: string;
  sellerPhone: string;
  customerName: string;
  customerPhone: string;
  packageDetails: string;
  deliveryFee: number;
  status: 'Available' | 'Accepted' | 'In Transit' | 'Delivered';
  createdAt: string;
  proofOfDeliveryPhoto?: string;
  proofNotes?: string;
}

export interface Job {
  id: string;
  employerId: string;
  employerName: string;
  employerLogo?: string;
  title: string;
  category: string;
  type: 'Full-time' | 'Part-time' | 'Gig / Contract';
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  status: 'active' | 'closed' | 'pending';
  applicantCount: number;
  postedDate: string;
  featured?: boolean;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  applicantId: string;
  fullName: string;
  email: string;
  phone: string;
  coverNote: string;
  resumeSummary: string;
  status: 'Applied' | 'Reviewed' | 'Shortlisted' | 'Rejected';
  appliedDate: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'delivery' | 'job' | 'system' | 'promo';
}
