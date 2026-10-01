import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Drawer } from './components/Drawer';
import { CartDrawer } from './components/CartDrawer';
import { NotificationsModal } from './components/NotificationsModal';
import { Toast } from './components/Toast';
import { ProtectedRoute } from './components/ProtectedRoute';

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
    if (currentPath === '/' || currentPath === '' || currentPath === '/home' || currentPath === '/marketplace') {
      return <HomeScreen />;
    }
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
    if (currentPath === '/checkout') {
      return (
        <ProtectedRoute requiredTitle="Checkout">
          <CheckoutScreen />
        </ProtectedRoute>
      );
    }
    if (currentPath.startsWith('/order-success/')) {
      const id = currentPath.replace('/order-success/', '').split('?')[0];
      return <OrderSuccessScreen orderId={id} />;
    }

    // 3. BUYER PAGES
    if (currentPath === '/dashboard') {
      return (
        <ProtectedRoute requiredTitle="My Account Dashboard">
          <BuyerDashboardScreen />
        </ProtectedRoute>
      );
    }
    if (currentPath === '/orders') {
      return (
        <ProtectedRoute requiredTitle="Orders">
          <OrdersScreen />
        </ProtectedRoute>
      );
    }
    if (currentPath.startsWith('/orders/')) {
      const id = currentPath.replace('/orders/', '').split('?')[0];
      return (
        <ProtectedRoute requiredTitle="Order Details">
          <OrderDetailScreen orderId={id} />
        </ProtectedRoute>
      );
    }
    if (currentPath === '/wishlist') {
      return (
        <ProtectedRoute requiredTitle="Wishlist">
          <WishlistScreen />
        </ProtectedRoute>
      );
    }
    if (currentPath === '/account') {
      return (
        <ProtectedRoute requiredTitle="Profile Settings">
          <AccountScreen />
        </ProtectedRoute>
      );
    }

    // 4. SELLER PAGES
    if (currentPath === '/seller') {
      return (
        <ProtectedRoute allowedRoles={['seller', 'admin']} requiredTitle="Seller Merchant Dashboard">
          <SellerDashboardScreen />
        </ProtectedRoute>
      );
    }
    if (currentPath === '/seller/store') {
      return (
        <ProtectedRoute allowedRoles={['seller', 'admin']} requiredTitle="Store Settings">
          <SellerStoreScreen />
        </ProtectedRoute>
      );
    }
    if (currentPath.startsWith('/store/')) {
      const slug = currentPath.replace('/store/', '').split('?')[0];
      return <PublicStoreScreen slug={slug} />;
    }
    if (currentPath === '/seller/products') {
      return (
        <ProtectedRoute allowedRoles={['seller', 'admin']} requiredTitle="Product Management">
          <SellerProductsScreen />
        </ProtectedRoute>
      );
    }
    if (currentPath === '/seller/products/new') {
      return (
        <ProtectedRoute allowedRoles={['seller', 'admin']} requiredTitle="Add New Product">
          <AddEditProductScreen />
        </ProtectedRoute>
      );
    }
    if (currentPath.startsWith('/seller/products/') && currentPath.endsWith('/edit')) {
      const id = currentPath.replace('/seller/products/', '').replace('/edit', '');
      return (
        <ProtectedRoute allowedRoles={['seller', 'admin']} requiredTitle="Edit Product">
          <AddEditProductScreen productId={id} />
        </ProtectedRoute>
      );
    }
    if (currentPath === '/seller/orders') {
      return (
        <ProtectedRoute allowedRoles={['seller', 'admin']} requiredTitle="Store Orders">
          <SellerOrdersScreen />
        </ProtectedRoute>
      );
    }
    if (currentPath === '/seller/earnings') {
      return (
        <ProtectedRoute allowedRoles={['seller', 'admin']} requiredTitle="Store Earnings">
          <SellerEarningsScreen />
        </ProtectedRoute>
      );
    }
    if (currentPath === '/seller/dispatch') {
      return (
        <ProtectedRoute allowedRoles={['seller', 'admin']} requiredTitle="Courier Dispatch Management">
          <SellerDispatchScreen />
        </ProtectedRoute>
      );
    }

    // 5. RIDER / DELIVERY PAGES
    if (currentPath === '/rider') {
      return (
        <ProtectedRoute allowedRoles={['dispatcher', 'rider', 'dispatch_rider', 'dispatch rider', 'admin']} requiredTitle="Courier Rider Dispatch Dashboard">
          <RiderDashboardScreen />
        </ProtectedRoute>
      );
    }
    if (currentPath === '/rider/deliveries') {
      return (
        <ProtectedRoute allowedRoles={['dispatcher', 'rider', 'dispatch_rider', 'dispatch rider', 'admin']} requiredTitle="Courier Delivery Queue">
          <RiderDeliveriesScreen />
        </ProtectedRoute>
      );
    }
    if (currentPath.startsWith('/rider/deliveries/')) {
      const id = currentPath.replace('/rider/deliveries/', '').split('?')[0];
      return (
        <ProtectedRoute allowedRoles={['dispatcher', 'rider', 'dispatch_rider', 'dispatch rider', 'admin']} requiredTitle="Delivery Trip Details">
          <RiderDeliveryDetailScreen deliveryId={id} />
        </ProtectedRoute>
      );
    }
    if (currentPath === '/rider/earnings') {
      return (
        <ProtectedRoute allowedRoles={['dispatcher', 'rider', 'dispatch_rider', 'dispatch rider', 'admin']} requiredTitle="Courier Earnings">
          <RiderEarningsScreen />
        </ProtectedRoute>
      );
    }

    // 6. JOB MARKETPLACE PAGES
    if (currentPath === '/jobs') return <JobsScreen />;
    if (currentPath.startsWith('/jobs/apply/')) {
      const id = currentPath.replace('/jobs/apply/', '').split('?')[0];
      return (
        <ProtectedRoute requiredTitle="Job Application">
          <JobApplyScreen jobId={id} />
        </ProtectedRoute>
      );
    }
    if (currentPath.startsWith('/jobs/')) {
      const id = currentPath.replace('/jobs/', '').split('?')[0];
      return <JobDetailScreen jobId={id} />;
    }
    if (currentPath === '/employer') {
      return (
        <ProtectedRoute allowedRoles={['employer', 'admin']} requiredTitle="Employer Hiring Portal">
          <EmployerDashboardScreen />
        </ProtectedRoute>
      );
    }
    if (currentPath === '/employer/jobs/new') {
      return (
        <ProtectedRoute allowedRoles={['employer', 'admin']} requiredTitle="Post Vacancy">
          <PostJobScreen />
        </ProtectedRoute>
      );
    }
    if (currentPath === '/job-seeker/dashboard') {
      return (
        <ProtectedRoute allowedRoles={['employee', 'job seeker', 'buyer', 'admin']} requiredTitle="Job Seeker Dashboard">
          <JobSeekerDashboardScreen />
        </ProtectedRoute>
      );
    }

    // 7. AUTHENTICATION & ONBOARDING
    if (currentPath === '/login') return <LoginScreen />;
    if (currentPath === '/register') return <RegisterScreen />;
    if (currentPath === '/forgot-password') return <ForgotPasswordScreen />;
    if (currentPath === '/onboarding/seller') return <SellerOnboardingScreen />;
    if (currentPath === '/onboarding/rider') return <RiderOnboardingScreen />;

    // 8. ADMIN PAGES
    if (currentPath === '/admin') {
      return (
        <ProtectedRoute allowedRoles={['admin']} requiredTitle="JD Mart Administrator Console">
          <AdminDashboardScreen />
        </ProtectedRoute>
      );
    }
    if (currentPath === '/admin/users') {
      return (
        <ProtectedRoute allowedRoles={['admin']} requiredTitle="Admin Users Management">
          <AdminUsersScreen />
        </ProtectedRoute>
      );
    }
    if (currentPath === '/admin/sellers') {
      return (
        <ProtectedRoute allowedRoles={['admin']} requiredTitle="Admin Seller Approvals">
          <AdminSellersScreen />
        </ProtectedRoute>
      );
    }
    if (currentPath === '/admin/riders') {
      return (
        <ProtectedRoute allowedRoles={['admin']} requiredTitle="Admin Rider Fleet">
          <AdminRidersScreen />
        </ProtectedRoute>
      );
    }
    if (currentPath === '/admin/orders') {
      return (
        <ProtectedRoute allowedRoles={['admin']} requiredTitle="Admin Orders & Disputes">
          <AdminOrdersScreen />
        </ProtectedRoute>
      );
    }
    if (currentPath === '/admin/jobs') {
      return (
        <ProtectedRoute allowedRoles={['admin']} requiredTitle="Admin Job Moderation">
          <AdminJobsScreen />
        </ProtectedRoute>
      );
    }

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
