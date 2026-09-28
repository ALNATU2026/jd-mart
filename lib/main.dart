import 'package:flutter/material.dart';
import 'constants/app_colors.dart';
import 'screens/account_screen.dart';
import 'screens/admin_screen.dart';
import 'screens/buyer_dashboard_screen.dart';
import 'screens/cart_screen.dart';
import 'screens/categories_screen.dart';
import 'screens/checkout_screen.dart';
import 'screens/employer_screens.dart';
import 'screens/forgot_password_screen.dart';
import 'screens/home_screen.dart';
import 'screens/job_seeker_screens.dart';
import 'screens/jobs_screen.dart';
import 'screens/login_screen.dart';
import 'screens/messages_screen.dart';
import 'screens/notifications_screen.dart';
import 'screens/onboarding_screen.dart';
import 'screens/order_details_screen.dart';
import 'screens/order_success_screen.dart';
import 'screens/orders_screen.dart';
import 'screens/product_detail_screen.dart';
import 'screens/public_home_screen.dart';
import 'screens/rider_screens.dart';
import 'screens/search_screen.dart';
import 'screens/seller_dashboard_screen.dart';
import 'screens/seller_orders_screen.dart';
import 'screens/seller_products_screen.dart';
import 'screens/seller_store_screen.dart';
import 'screens/shop_screen.dart';
import 'screens/signup_screen.dart';
import 'screens/splash_screen.dart';
import 'screens/wishlist_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'JDMart',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        scaffoldBackgroundColor: const Color(0xFFF5F7FB),
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF1E40AF)),
        fontFamily: 'Poppins',
        useMaterial3: true,
      ),
      initialRoute: '/',
      onGenerateRoute: (settings) {
        final uri = Uri.parse(settings.name ?? '/');
        final path = uri.path;

        Widget page;

        // 1. PUBLIC WEBSITE & HOME PAGES
        if (path == '/' || path.isEmpty) {
          page = const PublicHomeScreen();
        } else if (path == '/mobile-home') {
          page = const HomeScreen();
        } else if (path == '/splash') {
          page = const SplashScreen();
        } else if (path == '/onboarding') {
          page = const OnboardingScreen();
        }

        // 2. SHOP & PRODUCT PAGES
        else if (path == '/shop') {
          final cat = uri.queryParameters['category'];
          page = ShopScreen(initialCategory: cat);
        } else if (path.startsWith('/product/')) {
          final id = path.replaceFirst('/product/', '');
          page = ProductDetailScreen(productId: id);
        } else if (path == '/categories') {
          page = const CategoriesScreen();
        } else if (path.startsWith('/category/')) {
          final slug = path.replaceFirst('/category/', '');
          page = CategoriesScreen(categorySlug: slug);
        } else if (path.startsWith('/search')) {
          page = const SearchScreen();
        }

        // 3. CART & CHECKOUT
        else if (path == '/cart') {
          page = const CartScreen();
        } else if (path == '/checkout') {
          page = const CheckoutScreen();
        } else if (path.startsWith('/order-success/')) {
          final id = path.replaceFirst('/order-success/', '');
          page = OrderSuccessScreen(orderId: id);
        }

        // 4. BUYER PAGES
        else if (path == '/dashboard') {
          page = const BuyerDashboardScreen();
        } else if (path == '/orders') {
          page = const OrdersScreen();
        } else if (path.startsWith('/orders/')) {
          final id = path.replaceFirst('/orders/', '');
          page = OrderDetailsScreen(orderId: id);
        } else if (path == '/wishlist') {
          page = const WishlistScreen();
        } else if (path == '/account') {
          page = const AccountScreen();
        } else if (path == '/messages') {
          page = const MessagesScreen();
        } else if (path == '/notifications') {
          page = const NotificationsScreen();
        }

        // 5. SELLER PAGES
        else if (path == '/seller') {
          page = const SellerDashboardScreen();
        } else if (path == '/seller/store') {
          page = const SellerStoreScreen(isOwnerView: true);
        } else if (path.startsWith('/store/')) {
          final slug = path.replaceFirst('/store/', '');
          page = SellerStoreScreen(storeSlug: slug, isOwnerView: false);
        } else if (path == '/seller/products') {
          page = const SellerProductsScreen();
        } else if (path == '/seller/products/new') {
          page = const SellerProductsScreen(isNewProduct: true);
        } else if (path.startsWith('/seller/products/') && path.endsWith('/edit')) {
          final id = path.replaceAll('/seller/products/', '').replaceAll('/edit', '');
          page = SellerProductsScreen(editProductId: id);
        } else if (path == '/seller/orders') {
          page = const SellerOrdersScreen();
        } else if (path == '/seller/dispatch' || path == '/seller/customers' || path == '/seller/earnings' || path == '/seller/reviews') {
          page = const SellerDashboardScreen();
        } else if (path == '/seller/settings') {
          page = const SellerStoreScreen(isOwnerView: true);
        }

        // 6. RIDER / DELIVERY PAGES
        else if (path == '/rider') {
          page = const RiderScreens(mode: 'dashboard');
        } else if (path == '/rider/requests' || path == '/rider/deliveries') {
          page = const RiderScreens(mode: 'requests');
        } else if (path.startsWith('/rider/delivery/') || path.startsWith('/rider/deliveries/')) {
          final id = path.replaceFirst('/rider/delivery/', '').replaceFirst('/rider/deliveries/', '');
          page = RiderScreens(mode: 'delivery', deliveryId: id);
        } else if (path == '/rider/history') {
          page = const RiderScreens(mode: 'history');
        } else if (path == '/rider/earnings') {
          page = const RiderScreens(mode: 'earnings');
        } else if (path == '/rider/profile') {
          page = const RiderScreens(mode: 'profile');
        }

        // 7. JOB MARKETPLACE PAGES
        else if (path == '/jobs') {
          page = const JobsScreen();
        } else if (path.startsWith('/jobs/')) {
          final id = path.replaceFirst('/jobs/', '');
          page = JobsScreen(jobId: id);
        } else if (path == '/employer') {
          page = const EmployerScreens(mode: 'dashboard');
        } else if (path == '/employer/jobs') {
          page = const EmployerScreens(mode: 'jobs');
        } else if (path == '/employer/jobs/new') {
          page = const EmployerScreens(mode: 'new_job');
        } else if (path == '/employer/applicants') {
          page = const EmployerScreens(mode: 'applicants');
        } else if (path == '/employer/workers') {
          page = const EmployerScreens(mode: 'workers');
        } else if (path == '/employer/company') {
          page = const EmployerScreens(mode: 'company');
        } else if (path == '/job-seeker' || path == '/job-seeker/dashboard') {
          page = const JobSeekerScreens(mode: 'dashboard');
        } else if (path == '/job-seeker/applications') {
          page = const JobSeekerScreens(mode: 'applications');
        } else if (path == '/job-seeker/saved-jobs') {
          page = const JobSeekerScreens(mode: 'saved');
        } else if (path == '/job-seeker/cv') {
          page = const JobSeekerScreens(mode: 'cv');
        } else if (path == '/job-seeker/profile') {
          page = const JobSeekerScreens(mode: 'profile');
        }

        // 8. AUTHENTICATION & ONBOARDING
        else if (path == '/login') {
          page = const LoginScreen();
        } else if (path == '/register' || path == '/signup') {
          page = const SignupScreen();
        } else if (path == '/forgot-password') {
          page = const ForgotPasswordScreen();
        } else if (path == '/become-seller' || path == '/onboarding/seller') {
          page = const SignupScreen();
        } else if (path == '/become-rider' || path == '/onboarding/rider') {
          page = const SignupScreen();
        } else if (path == '/become-employer') {
          page = const SignupScreen();
        }

        // 9. ADMIN PAGES
        else if (path == '/admin') {
          page = const AdminScreen();
        } else if (path == '/admin/users') {
          page = const AdminScreen(initialTab: 'users');
        } else if (path == '/admin/sellers') {
          page = const AdminScreen(initialTab: 'sellers');
        } else if (path == '/admin/riders') {
          page = const AdminScreen(initialTab: 'riders');
        } else if (path == '/admin/orders') {
          page = const AdminScreen(initialTab: 'orders');
        } else if (path == '/admin/jobs') {
          page = const AdminScreen(initialTab: 'jobs');
        }

        // Fallback
        else {
          page = const PublicHomeScreen();
        }

        return MaterialPageRoute(builder: (_) => page, settings: settings);
      },
    );
  }
}
