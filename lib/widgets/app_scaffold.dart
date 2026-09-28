import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../models/models.dart';
import '../services/app_state.dart';

class AppScaffold extends StatelessWidget {
  final Widget body;
  final String title;
  final String currentRoute;
  final Widget? floatingActionButton;
  final bool showBottomNav;

  const AppScaffold({
    super.key,
    required this.body,
    this.title = 'JDMart',
    required this.currentRoute,
    this.floatingActionButton,
    this.showBottomNav = true,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: AppState.instance,
      builder: (context, _) {
        final state = AppState.instance;
        final role = state.currentRole;

        return Scaffold(
          backgroundColor: AppColors.scaffoldBg,
          appBar: _buildAppBar(context, state, role),
          drawer: _buildDrawer(context, state, role),
          body: Column(
            children: [
              _buildRoleSwitcherBar(context, state),
              Expanded(child: body),
            ],
          ),
          bottomNavigationBar: showBottomNav ? _buildBottomNavBar(context, state, role) : null,
          floatingActionButton: floatingActionButton,
        );
      },
    );
  }

  PreferredSizeWidget _buildAppBar(BuildContext context, AppState state, UserRole role) {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 0.5,
      automaticallyImplyLeading: false,
      titleSpacing: 0,
      title: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14),
        child: Row(
          children: [
            // Drawer toggle button
            Builder(
              builder: (ctx) => InkWell(
                onTap: () => Scaffold.of(ctx).openDrawer(),
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: AppColors.primaryLight,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.menu_rounded, color: AppColors.primary, size: 22),
                ),
              ),
            ),
            const SizedBox(width: 10),

            // Logo
            InkWell(
              onTap: () => Navigator.pushNamed(context, '/'),
              child: Image.asset(
                'assets/logos/appBarlogo.png',
                height: 32,
                fit: BoxFit.contain,
              ),
            ),
            const Spacer(),

            // Search Icon
            IconButton(
              onPressed: () => Navigator.pushNamed(context, '/search'),
              icon: const Icon(Icons.search_rounded, color: AppColors.textPrimary, size: 24),
              tooltip: 'Search',
            ),

            // Notifications with Badge
            Stack(
              clipBehavior: Clip.none,
              children: [
                IconButton(
                  onPressed: () => Navigator.pushNamed(context, '/notifications'),
                  icon: const Icon(Icons.notifications_none_rounded, color: AppColors.textPrimary, size: 24),
                  tooltip: 'Notifications',
                ),
                if (state.unreadNotificationsCount > 0)
                  Positioned(
                    right: 8,
                    top: 8,
                    child: Container(
                      width: 9,
                      height: 9,
                      decoration: const BoxDecoration(
                        color: Colors.red,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
              ],
            ),

            // Cart with Count (Buyer / Guest)
            Stack(
              clipBehavior: Clip.none,
              children: [
                IconButton(
                  onPressed: () => Navigator.pushNamed(context, '/cart'),
                  icon: const Icon(Icons.shopping_cart_outlined, color: AppColors.textPrimary, size: 24),
                  tooltip: 'Cart',
                ),
                if (state.cartCount > 0)
                  Positioned(
                    right: 6,
                    top: 6,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                      decoration: BoxDecoration(
                        color: AppColors.secondary,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        '${state.cartCount}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
              ],
            ),

            // User Role Avatar / Quick Access
            const SizedBox(width: 4),
            InkWell(
              onTap: () {
                if (role == UserRole.guest) {
                  Navigator.pushNamed(context, '/login');
                } else if (role == UserRole.seller) {
                  Navigator.pushNamed(context, '/seller');
                } else if (role == UserRole.rider) {
                  Navigator.pushNamed(context, '/rider');
                } else if (role == UserRole.jobSeeker) {
                  Navigator.pushNamed(context, '/job-seeker');
                } else if (role == UserRole.employer) {
                  Navigator.pushNamed(context, '/employer');
                } else if (role == UserRole.admin) {
                  Navigator.pushNamed(context, '/admin');
                } else {
                  Navigator.pushNamed(context, '/account');
                }
              },
              borderRadius: BorderRadius.circular(20),
              child: Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      _getRoleColor(role),
                      _getRoleColor(role).withAlpha(180),
                    ],
                  ),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(
                    role.displayName.substring(0, 1),
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRoleSwitcherBar(BuildContext context, AppState state) {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              margin: const EdgeInsets.only(right: 6),
              decoration: BoxDecoration(
                color: AppColors.secondaryLight,
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.swap_horiz_rounded, size: 14, color: AppColors.secondary),
                  SizedBox(width: 3),
                  Text(
                    'ROLE:',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      color: AppColors.secondary,
                    ),
                  ),
                ],
              ),
            ),
            ...UserRole.values.map((r) {
              final isSelected = state.currentRole == r;
              return Padding(
                padding: const EdgeInsets.only(right: 6),
                child: ChoiceChip(
                  label: Text(r.displayName),
                  selected: isSelected,
                  onSelected: (_) {
                    state.setRole(r);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Switched navigation perspective to ${r.displayName}'),
                        duration: const Duration(seconds: 1),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                    _navigateForRole(context, r);
                  },
                  selectedColor: AppColors.primary,
                  backgroundColor: AppColors.scaffoldBg,
                  labelStyle: TextStyle(
                    fontSize: 11,
                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                    color: isSelected ? Colors.white : AppColors.textPrimary,
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 0),
                  visualDensity: VisualDensity.compact,
                ),
              );
            }),
          ],
        ),
      ),
    );
  }

  void _navigateForRole(BuildContext context, UserRole r) {
    switch (r) {
      case UserRole.guest:
        Navigator.pushReplacementNamed(context, '/');
        break;
      case UserRole.buyer:
        Navigator.pushReplacementNamed(context, '/');
        break;
      case UserRole.seller:
        Navigator.pushReplacementNamed(context, '/seller');
        break;
      case UserRole.rider:
        Navigator.pushReplacementNamed(context, '/rider');
        break;
      case UserRole.jobSeeker:
        Navigator.pushReplacementNamed(context, '/job-seeker');
        break;
      case UserRole.employer:
        Navigator.pushReplacementNamed(context, '/employer');
        break;
      case UserRole.admin:
        Navigator.pushReplacementNamed(context, '/admin');
        break;
    }
  }

  Color _getRoleColor(UserRole role) {
    switch (role) {
      case UserRole.admin:
        return Colors.purple;
      case UserRole.seller:
        return const Color(0xFFF97316);
      case UserRole.rider:
        return const Color(0xFF10B981);
      case UserRole.jobSeeker:
        return const Color(0xFF06B6D4);
      case UserRole.employer:
        return const Color(0xFF6366F1);
      case UserRole.buyer:
      case UserRole.guest:
      default:
        return AppColors.primary;
    }
  }

  Widget _buildDrawer(BuildContext context, AppState state, UserRole role) {
    return Drawer(
      backgroundColor: Colors.white,
      child: Column(
        children: [
          // Drawer Header
          Container(
            width: double.infinity,
            padding: const EdgeInsets.only(top: 50, bottom: 20, left: 20, right: 20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [AppColors.primary, _getRoleColor(role)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Image.asset('assets/logos/appBarlogo.png', height: 42, fit: BoxFit.contain),
                    IconButton(
                      icon: const Icon(Icons.close, color: Colors.white),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  state.currentUser.name,
                  style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 2),
                Text(
                  'Role: ${role.displayName}',
                  style: TextStyle(color: Colors.white.withAlpha(220), fontSize: 12, fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ),

          // Drawer Links
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(vertical: 8),
              children: _getDrawerItemsForRole(context, role),
            ),
          ),

          const Divider(height: 1),
          ListTile(
            leading: const Icon(Icons.logout_rounded, color: Colors.red),
            title: const Text('Sign Out / Reset to Guest', style: TextStyle(color: Colors.red, fontWeight: FontWeight.w600)),
            onTap: () {
              Navigator.pop(context);
              state.setRole(UserRole.guest);
              Navigator.pushNamedAndRemoveUntil(context, '/', (route) => false);
            },
          ),
          const SizedBox(height: 12),
        ],
      ),
    );
  }

  List<Widget> _getDrawerItemsForRole(BuildContext context, UserRole role) {
    switch (role) {
      case UserRole.guest:
        return [
          _drawerTile(context, Icons.home_rounded, 'Home', '/'),
          _drawerTile(context, Icons.storefront_rounded, 'Shop Marketplace', '/shop'),
          _drawerTile(context, Icons.grid_view_rounded, 'Categories', '/categories'),
          _drawerTile(context, Icons.work_rounded, 'Job Marketplace', '/jobs'),
          _drawerTile(context, Icons.store_mall_directory_rounded, 'Become a Seller', '/become-seller'),
          _drawerTile(context, Icons.two_wheeler_rounded, 'Become a Rider', '/become-rider'),
          _drawerTile(context, Icons.business_center_rounded, 'Hire Workers (Employer)', '/become-employer'),
          _drawerTile(context, Icons.login_rounded, 'Login', '/login'),
          _drawerTile(context, Icons.person_add_rounded, 'Register', '/register'),
        ];

      case UserRole.buyer:
        return [
          _drawerTile(context, Icons.home_rounded, 'Home', '/'),
          _drawerTile(context, Icons.dashboard_rounded, 'Buyer Dashboard', '/dashboard'),
          _drawerTile(context, Icons.storefront_rounded, 'Shop', '/shop'),
          _drawerTile(context, Icons.local_mall_outlined, 'My Orders', '/orders'),
          _drawerTile(context, Icons.favorite_border_rounded, 'Wishlist', '/wishlist'),
          _drawerTile(context, Icons.shopping_cart_outlined, 'Cart', '/cart'),
          _drawerTile(context, Icons.work_outline_rounded, 'Jobs Marketplace', '/jobs'),
          _drawerTile(context, Icons.chat_bubble_outline_rounded, 'Messages', '/messages'),
          _drawerTile(context, Icons.notifications_none_rounded, 'Notifications', '/notifications'),
          _drawerTile(context, Icons.person_outline_rounded, 'Account Profile', '/account'),
        ];

      case UserRole.seller:
        return [
          _drawerTile(context, Icons.dashboard_rounded, 'Seller Dashboard', '/seller'),
          _drawerTile(context, Icons.store_rounded, 'My Store Profile', '/seller/store'),
          _drawerTile(context, Icons.inventory_2_outlined, 'Products Management', '/seller/products'),
          _drawerTile(context, Icons.add_circle_outline_rounded, 'Add New Product', '/seller/products/new'),
          _drawerTile(context, Icons.receipt_long_rounded, 'Orders Management', '/seller/orders'),
          _drawerTile(context, Icons.local_shipping_outlined, 'Dispatch Coordination', '/seller/dispatch'),
          _drawerTile(context, Icons.people_outline_rounded, 'Customer Base', '/seller/customers'),
          _drawerTile(context, Icons.account_balance_wallet_outlined, 'Earnings & Payouts', '/seller/earnings'),
          _drawerTile(context, Icons.star_border_rounded, 'Reviews & Feedback', '/seller/reviews'),
          _drawerTile(context, Icons.chat_bubble_outline_rounded, 'Messages', '/messages'),
          _drawerTile(context, Icons.settings_outlined, 'Seller Settings', '/seller/settings'),
        ];

      case UserRole.rider:
        return [
          _drawerTile(context, Icons.dashboard_rounded, 'Rider Dashboard', '/rider'),
          _drawerTile(context, Icons.notification_important_outlined, 'Delivery Requests', '/rider/requests'),
          _drawerTile(context, Icons.two_wheeler_rounded, 'Active Delivery', '/rider/delivery/DEL-2001'),
          _drawerTile(context, Icons.history_rounded, 'Delivery History', '/rider/history'),
          _drawerTile(context, Icons.account_balance_wallet_outlined, 'Rider Earnings', '/rider/earnings'),
          _drawerTile(context, Icons.chat_bubble_outline_rounded, 'Messages', '/messages'),
          _drawerTile(context, Icons.person_outline_rounded, 'Rider Profile', '/rider/profile'),
        ];

      case UserRole.jobSeeker:
        return [
          _drawerTile(context, Icons.dashboard_rounded, 'Job Seeker Dashboard', '/job-seeker'),
          _drawerTile(context, Icons.search_rounded, 'Find Jobs', '/jobs'),
          _drawerTile(context, Icons.assignment_outlined, 'My Applications', '/job-seeker/applications'),
          _drawerTile(context, Icons.bookmark_border_rounded, 'Saved Jobs', '/job-seeker/saved-jobs'),
          _drawerTile(context, Icons.description_outlined, 'My CV & Documents', '/job-seeker/cv'),
          _drawerTile(context, Icons.badge_outlined, 'Candidate Profile', '/job-seeker/profile'),
          _drawerTile(context, Icons.chat_bubble_outline_rounded, 'Messages', '/messages'),
        ];

      case UserRole.employer:
        return [
          _drawerTile(context, Icons.dashboard_rounded, 'Employer Dashboard', '/employer'),
          _drawerTile(context, Icons.work_outline_rounded, 'My Job Postings', '/employer/jobs'),
          _drawerTile(context, Icons.post_add_rounded, 'Post a New Job', '/employer/jobs/new'),
          _drawerTile(context, Icons.people_alt_outlined, 'Applicants', '/employer/applicants'),
          _drawerTile(context, Icons.person_search_rounded, 'Find Workers (Talent)', '/employer/workers'),
          _drawerTile(context, Icons.bookmark_outline_rounded, 'Saved Workers', '/employer/saved-workers'),
          _drawerTile(context, Icons.business_rounded, 'Company Profile', '/employer/company'),
          _drawerTile(context, Icons.chat_bubble_outline_rounded, 'Messages', '/messages'),
        ];

      case UserRole.admin:
        return [
          _drawerTile(context, Icons.admin_panel_settings_rounded, 'Admin Overview', '/admin'),
          _drawerTile(context, Icons.group_rounded, 'Manage Users', '/admin/users'),
          _drawerTile(context, Icons.storefront_rounded, 'Manage Sellers', '/admin/sellers'),
          _drawerTile(context, Icons.shopping_bag_outlined, 'Manage Products', '/admin/products'),
          _drawerTile(context, Icons.category_rounded, 'Manage Categories', '/admin/categories'),
          _drawerTile(context, Icons.receipt_long_rounded, 'Manage Orders', '/admin/orders'),
          _drawerTile(context, Icons.two_wheeler_rounded, 'Manage Riders', '/admin/riders'),
          _drawerTile(context, Icons.local_shipping_rounded, 'Manage Deliveries', '/admin/deliveries'),
          _drawerTile(context, Icons.business_rounded, 'Manage Employers', '/admin/employers'),
          _drawerTile(context, Icons.badge_rounded, 'Manage Job Seekers', '/admin/job-seekers'),
          _drawerTile(context, Icons.work_rounded, 'Manage Jobs', '/admin/jobs'),
          _drawerTile(context, Icons.assignment_rounded, 'Manage Applications', '/admin/applications'),
          _drawerTile(context, Icons.payment_rounded, 'Manage Payments', '/admin/payments'),
          _drawerTile(context, Icons.star_rounded, 'Manage Reviews', '/admin/reviews'),
          _drawerTile(context, Icons.report_problem_rounded, 'Reports & Disputes', '/admin/reports'),
          _drawerTile(context, Icons.campaign_rounded, 'Platform Broadcasts', '/admin/notifications'),
          _drawerTile(context, Icons.security_rounded, 'Audit Logs', '/admin/audit-logs'),
          _drawerTile(context, Icons.settings_rounded, 'Admin Settings', '/admin/settings'),
        ];
    }
  }

  Widget _drawerTile(BuildContext context, IconData icon, String title, String route) {
    final isCurrent = currentRoute == route;
    return ListTile(
      leading: Icon(icon, color: isCurrent ? AppColors.primary : AppColors.textSecondary, size: 22),
      title: Text(
        title,
        style: TextStyle(
          fontWeight: isCurrent ? FontWeight.w700 : FontWeight.w500,
          color: isCurrent ? AppColors.primary : AppColors.textPrimary,
          fontSize: 14,
        ),
      ),
      dense: true,
      selected: isCurrent,
      onTap: () {
        Navigator.pop(context);
        if (currentRoute != route) {
          Navigator.pushNamed(context, route);
        }
      },
    );
  }

  Widget _buildBottomNavBar(BuildContext context, AppState state, UserRole role) {
    switch (role) {
      case UserRole.seller:
        return _bottomBar([
          _navItem(context, Icons.dashboard_rounded, 'Dashboard', '/seller'),
          _navItem(context, Icons.store_rounded, 'Store', '/seller/store'),
          _navItem(context, Icons.inventory_2_outlined, 'Products', '/seller/products'),
          _navItem(context, Icons.receipt_long_rounded, 'Orders', '/seller/orders'),
          _navItem(context, Icons.settings_outlined, 'Settings', '/seller/settings'),
        ]);

      case UserRole.rider:
        return _bottomBar([
          _navItem(context, Icons.dashboard_rounded, 'Dashboard', '/rider'),
          _navItem(context, Icons.list_alt_rounded, 'Requests', '/rider/requests'),
          _navItem(context, Icons.two_wheeler_rounded, 'Active', '/rider/delivery/DEL-2001'),
          _navItem(context, Icons.account_balance_wallet_outlined, 'Earnings', '/rider/earnings'),
          _navItem(context, Icons.person_outline_rounded, 'Profile', '/rider/profile'),
        ]);

      case UserRole.jobSeeker:
        return _bottomBar([
          _navItem(context, Icons.dashboard_rounded, 'Dashboard', '/job-seeker'),
          _navItem(context, Icons.search_rounded, 'Jobs', '/jobs'),
          _navItem(context, Icons.assignment_outlined, 'Applied', '/job-seeker/applications'),
          _navItem(context, Icons.bookmark_border_rounded, 'Saved', '/job-seeker/saved-jobs'),
          _navItem(context, Icons.person_outline_rounded, 'Profile', '/job-seeker/profile'),
        ]);

      case UserRole.employer:
        return _bottomBar([
          _navItem(context, Icons.dashboard_rounded, 'Dashboard', '/employer'),
          _navItem(context, Icons.work_outline_rounded, 'Jobs', '/employer/jobs'),
          _navItem(context, Icons.post_add_rounded, 'Post', '/employer/jobs/new'),
          _navItem(context, Icons.person_search_rounded, 'Workers', '/employer/workers'),
          _navItem(context, Icons.business_rounded, 'Company', '/employer/company'),
        ]);

      case UserRole.admin:
        return _bottomBar([
          _navItem(context, Icons.dashboard_rounded, 'Dashboard', '/admin'),
          _navItem(context, Icons.people_outline_rounded, 'Users', '/admin/users'),
          _navItem(context, Icons.inventory_2_outlined, 'Products', '/admin/products'),
          _navItem(context, Icons.receipt_long_rounded, 'Orders', '/admin/orders'),
          _navItem(context, Icons.settings_outlined, 'Settings', '/admin/settings'),
        ]);

      case UserRole.guest:
        return _bottomBar([
          _navItem(context, Icons.home_rounded, 'Home', '/'),
          _navItem(context, Icons.storefront_rounded, 'Shop', '/shop'),
          _navItem(context, Icons.work_outline_rounded, 'Jobs', '/jobs'),
          _navItem(context, Icons.login_rounded, 'Login', '/login'),
          _navItem(context, Icons.person_add_rounded, 'Register', '/register'),
        ]);

      case UserRole.buyer:
      default:
        return _bottomBar([
          _navItem(context, Icons.home_rounded, 'Home', '/'),
          _navItem(context, Icons.storefront_rounded, 'Shop', '/shop'),
          _navItem(context, Icons.local_mall_outlined, 'Orders', '/orders'),
          _navItem(context, Icons.chat_bubble_outline_rounded, 'Messages', '/messages'),
          _navItem(context, Icons.person_outline_rounded, 'Account', '/account'),
        ]);
    }
  }

  Widget _bottomBar(List<Widget> items) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: AppColors.border, width: 0.5)),
        boxShadow: [
          BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, -2)),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 4),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: items,
          ),
        ),
      ),
    );
  }

  Widget _navItem(BuildContext context, IconData icon, String label, String route) {
    final isSelected = currentRoute == route;
    return InkWell(
      onTap: () {
        if (currentRoute != route) {
          Navigator.pushNamed(context, route);
        }
      },
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 22,
              color: isSelected ? AppColors.primary : AppColors.textSecondary,
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                color: isSelected ? AppColors.primary : AppColors.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
