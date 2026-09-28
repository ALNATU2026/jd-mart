import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Drawer } from './components/Drawer';
import { CartDrawer } from './components/CartDrawer';
import { NotificationsModal } from './components/NotificationsModal';
import { Toast } from './components/Toast';

// Screens
import { HomeScreen } from './screens/HomeScreen';
import { ShopScreen } from './screens/ShopScreen';
import { ProductDetailScreen } from './screens/ProductDetailScreen';
import { CategoriesScreen } from './screens/CategoriesScreen';
import { CategoryDetailScreen } from './screens/CategoryDetailScreen';
import { SearchScreen } from './screens/SearchScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { OrderSuccessScreen } from './screens/OrderSuccessScreen';
import { BuyerDashboardScreen } from './screens/BuyerDashboardScreen';
import { OrdersScreen } from './screens/OrdersScreen';
import { OrderDetailScreen } from './screens/OrderDetailScreen';
import { WishlistScreen } from './screens/WishlistScreen';
import { AccountScreen } from './screens/AccountScreen';
import { SellerDashboardScreen } from './screens/SellerDashboardScreen';
import { SellerStoreScreen, PublicStoreScreen } from './screens/SellerStoreScreen';
import { SellerProductsScreen } from './screens/SellerProductsScreen';
import { AddEditProductScreen } from './screens/AddEditProductScreen';
import { SellerOrdersScreen } from './screens/SellerOrdersScreen';
import { SellerEarningsScreen } from './screens/SellerEarningsScreen';
import { SellerDispatchScreen } from './screens/SellerDispatchScreen';
import { RiderDashboardScreen } from './screens/RiderDashboardScreen';
import { RiderDeliveriesScreen } from './screens/RiderDeliveriesScreen';
import { RiderDeliveryDetailScreen } from './screens/RiderDeliveryDetailScreen';
import { RiderEarningsScreen } from './screens/RiderEarningsScreen';
import { JobsScreen } from './screens/JobsScreen';
import { JobDetailScreen } from './screens/JobDetailScreen';
import { JobApplyScreen } from './screens/JobApplyScreen';
import { EmployerDashboardScreen } from './screens/EmployerDashboardScreen';
import { PostJobScreen } from './screens/PostJobScreen';
import { JobSeekerDashboardScreen } from './screens/JobSeekerDashboardScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { ForgotPasswordScreen } from './screens/ForgotPasswordScreen';
import { SellerOnboardingScreen } from './screens/SellerOnboardingScreen';
import { RiderOnboardingScreen } from './screens/RiderOnboardingScreen';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';
import { AdminUsersScreen } from './screens/AdminUsersScreen';
import { AdminSellersScreen } from './screens/AdminSellersScreen';
import { AdminRidersScreen } from './screens/AdminRidersScreen';
import { AdminOrdersScreen } from './screens/AdminOrdersScreen';
import { AdminJobsScreen } from './screens/AdminJobsScreen';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';

const RouterView: React.FC = () => {
  const { currentPath, navigate } = useApp();

  // Special full-screen states
  if (currentPath === '/splash') {
    return <SplashScreen onFinish={() => navigate('/')} />;
  }
  if (currentPath === '/onboarding') {
    return <OnboardingScreen onFinish={() => navigate('/')} />;
  }

  // Helper matching
  const renderScreen = () => {
    // 1. PUBLIC WEBSITE & SHOP PAGES
    if (currentPath === '/' || currentPath === '') return <HomeScreen />;
    if (currentPath === '/shop') return <ShopScreen />;
    if (currentPath.startsWith('/product/')) {
      const id = currentPath.replace('/product/', '').split('?')[0];
      return <ProductDetailScreen productId={id} />;
    }
    if (currentPath === '/categories') return <CategoriesScreen />;
    if (currentPath.startsWith('/category/')) {
      const slug = currentPath.replace('/category/', '').split('?')[0];
      return <CategoryDetailScreen slug={slug} />;
    }
    if (currentPath.startsWith('/search')) return <SearchScreen />;

    // 2. CART & CHECKOUT
    if (currentPath === '/cart') return <CartScreen />;
    if (currentPath === '/checkout') return <CheckoutScreen />;
    if (currentPath.startsWith('/order-success/')) {
      const id = currentPath.replace('/order-success/', '').split('?')[0];
      return <OrderSuccessScreen orderId={id} />;
    }

    // 3. BUYER PAGES
    if (currentPath === '/dashboard') return <BuyerDashboardScreen />;
    if (currentPath === '/orders') return <OrdersScreen />;
    if (currentPath.startsWith('/orders/')) {
      const id = currentPath.replace('/orders/', '').split('?')[0];
      return <OrderDetailScreen orderId={id} />;
    }
    if (currentPath === '/wishlist') return <WishlistScreen />;
    if (currentPath === '/account') return <AccountScreen />;

    // 4. SELLER PAGES
    if (currentPath === '/seller') return <SellerDashboardScreen />;
    if (currentPath === '/seller/store') return <SellerStoreScreen />;
    if (currentPath.startsWith('/store/')) {
      const slug = currentPath.replace('/store/', '').split('?')[0];
      return <PublicStoreScreen slug={slug} />;
    }
    if (currentPath === '/seller/products') return <SellerProductsScreen />;
    if (currentPath === '/seller/products/new') return <AddEditProductScreen />;
    if (currentPath.startsWith('/seller/products/') && currentPath.endsWith('/edit')) {
      const id = currentPath.replace('/seller/products/', '').replace('/edit', '');
      return <AddEditProductScreen productId={id} />;
    }
    if (currentPath === '/seller/orders') return <SellerOrdersScreen />;
    if (currentPath === '/seller/earnings') return <SellerEarningsScreen />;
    if (currentPath === '/seller/dispatch') return <SellerDispatchScreen />;

    // 5. RIDER / DELIVERY PAGES
    if (currentPath === '/rider') return <RiderDashboardScreen />;
    if (currentPath === '/rider/deliveries') return <RiderDeliveriesScreen />;
    if (currentPath.startsWith('/rider/deliveries/')) {
      const id = currentPath.replace('/rider/deliveries/', '').split('?')[0];
      return <RiderDeliveryDetailScreen deliveryId={id} />;
    }
    if (currentPath === '/rider/earnings') return <RiderEarningsScreen />;

    // 6. JOB MARKETPLACE PAGES
    if (currentPath === '/jobs') return <JobsScreen />;
    if (currentPath.startsWith('/jobs/apply/')) {
      const id = currentPath.replace('/jobs/apply/', '').split('?')[0];
      return <JobApplyScreen jobId={id} />;
    }
    if (currentPath.startsWith('/jobs/')) {
      const id = currentPath.replace('/jobs/', '').split('?')[0];
      return <JobDetailScreen jobId={id} />;
    }
    if (currentPath === '/employer') return <EmployerDashboardScreen />;
    if (currentPath === '/employer/jobs/new') return <PostJobScreen />;
    if (currentPath === '/job-seeker/dashboard') return <JobSeekerDashboardScreen />;

    // 7. AUTHENTICATION & ONBOARDING
    if (currentPath === '/login') return <LoginScreen />;
    if (currentPath === '/register') return <RegisterScreen />;
    if (currentPath === '/forgot-password') return <ForgotPasswordScreen />;
    if (currentPath === '/onboarding/seller') return <SellerOnboardingScreen />;
    if (currentPath === '/onboarding/rider') return <RiderOnboardingScreen />;

    // 8. ADMIN PAGES
    if (currentPath === '/admin') return <AdminDashboardScreen />;
    if (currentPath === '/admin/users') return <AdminUsersScreen />;
    if (currentPath === '/admin/sellers') return <AdminSellersScreen />;
    if (currentPath === '/admin/riders') return <AdminRidersScreen />;
    if (currentPath === '/admin/orders') return <AdminOrdersScreen />;
    if (currentPath === '/admin/jobs') return <AdminJobsScreen />;

    // Fallback to Home
    return <HomeScreen />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {renderScreen()}
      </main>
      <Footer />
      <Drawer />
      <CartDrawer />
      <NotificationsModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <RouterView />
    </AppProvider>
  );
}
