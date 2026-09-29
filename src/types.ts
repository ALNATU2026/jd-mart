export * from './types/index';

import { UserRole } from './types/index';

export type PlatformRole = UserRole;

export type ScreenName =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'home'
  | 'product-detail'
  | string;

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
