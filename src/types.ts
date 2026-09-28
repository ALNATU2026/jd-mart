export type PlatformRole = 'Buyer' | 'Seller' | 'Rider' | 'Job Seeker' | 'Employer' | 'Admin';

export type ScreenName =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'home'
  | 'product-detail';

export interface Product {
  id: string;
  image: string;
  title: string;
  price: string;
  oldPrice: string;
  discount: string;
  timer: string;
  description?: string;
  rating?: number;
  reviewsCount?: number;
  category?: string;
}

export interface MenuItemModel {
  id: string;
  title: string;
  icon: string;
}

export interface FeatureItem {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
}

export interface CategoryItem {
  id: string;
  title: string;
  icon: string;
  color: string;
}

export interface OnboardingItem {
  image: string;
  title: string;
  subtitle: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
