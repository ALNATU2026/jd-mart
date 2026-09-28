import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../models/models.dart';
import '../services/app_state.dart';
import '../widgets/app_scaffold.dart';

class AdminScreen extends StatefulWidget {
  final String? initialTab;
  const AdminScreen({super.key, this.initialTab});

  @override
  State<AdminScreen> createState() => _AdminScreenState();
}

class _AdminScreenState extends State<AdminScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 6, vsync: this);
    if (widget.initialTab != null) {
      if (widget.initialTab == 'users') _tabController.index = 1;
      else if (widget.initialTab == 'sellers') _tabController.index = 2;
      else if (widget.initialTab == 'riders') _tabController.index = 3;
      else if (widget.initialTab == 'orders') _tabController.index = 4;
      else if (widget.initialTab == 'jobs') _tabController.index = 5;
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: AppState.instance,
      builder: (context, _) {
        final state = AppState.instance;

        return AppScaffold(
          title: 'JD Mart Admin Center',
          currentRoute: '/admin',
          body: Column(
            children: [
              Container(
                color: Colors.white,
                child: TabBar(
                  controller: _tabController,
                  isScrollable: true,
                  labelColor: AppColors.primary,
                  unselectedLabelColor: AppColors.textSecondary,
                  indicatorColor: AppColors.primary,
                  indicatorWeight: 3,
                  labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                  tabs: const [
                    Tab(text: 'Overview'),
                    Tab(text: 'Users'),
                    Tab(text: 'Sellers'),
                    Tab(text: 'Riders'),
                    Tab(text: 'Orders & Disputes'),
                    Tab(text: 'Jobs Moderation'),
                  ],
                ),
              ),
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    _buildOverviewTab(context, state),
                    _buildUsersTab(context, state),
                    _buildSellersTab(context, state),
                    _buildRidersTab(context, state),
                    _buildOrdersTab(context, state),
                    _buildJobsTab(context, state),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildOverviewTab(BuildContext context, AppState state) {
    final totalRevenue = 492000;
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Banner
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF881337), Color(0xFF0F172A)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white.withAlpha(40),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.shield_rounded, color: Colors.white, size: 28),
                ),
                const SizedBox(width: 14),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'SUPER ADMINISTRATOR CONSOLE',
                        style: TextStyle(color: Color(0xFFFDA4AF), fontWeight: FontWeight.bold, fontSize: 11),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'Platform Moderation & Security',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 18),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Metrics Grid
          GridView.count(
            crossAxisCount: 2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.6,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            children: [
              _metricTile('Total Platform Users', '${state.users.length + 420}', Icons.people_rounded, AppColors.primary),
              _metricTile('Total Marketplace Orders', '${state.orders.length + 1840}', Icons.receipt_long_rounded, Colors.purple),
              _metricTile('Gross Merchandise Volume', 'Le $totalRevenue', Icons.payments_rounded, Colors.emerald),
              _metricTile('Active Couriers', '48 Online', Icons.two_wheeler_rounded, const Color(0xFFF97316)),
              _metricTile('Open Job Vacancies', '${state.jobs.length} Listings', Icons.work_rounded, Colors.indigo),
              _metricTile('Escrow Disputes', '1 Pending', Icons.report_problem_rounded, Colors.red),
            ],
          ),

          const SizedBox(height: 24),
          const Text(
            'Quick Administrative Operations',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
          ),
          const SizedBox(height: 12),
          _actionTile(context, Icons.people_outline_rounded, 'Audit & Verify Users', 'Inspect accounts and KYC', () {
            _tabController.animateTo(1);
          }),
          _actionTile(context, Icons.storefront_outlined, 'Merchant Store Verifications', 'Inspect store documentation', () {
            _tabController.animateTo(2);
          }),
          _actionTile(context, Icons.two_wheeler_outlined, 'Rider License Compliance', 'Approve courier licenses', () {
            _tabController.animateTo(3);
          }),
          _actionTile(context, Icons.gavel_rounded, 'Resolve Escrow Disputes', 'Release funds or issue refunds', () {
            _tabController.animateTo(4);
          }),
        ],
      ),
    );
  }

  Widget _buildUsersTab(BuildContext context, AppState state) {
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: state.users.length,
      separatorBuilder: (_, __) => const SizedBox(height: 10),
      itemBuilder: (context, index) {
        final u = state.users[index];
        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              CircleAvatar(
                backgroundColor: AppColors.primaryLight,
                child: Text(u.name.substring(0, 1), style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary)),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(u.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    Text('${u.email} • ${u.role.displayName}', style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                    const SizedBox(height: 4),
                    Text('Status: ${u.status}', style: TextStyle(color: u.status == 'Active' ? Colors.green : Colors.red, fontWeight: FontWeight.bold, fontSize: 11)),
                  ],
                ),
              ),
              PopupMenuButton<String>(
                onSelected: (val) {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Action $val applied to ${u.name}')));
                },
                itemBuilder: (ctx) => [
                  PopupMenuItem(value: 'verify', child: Text(u.isVerified ? 'Revoke Verification' : 'Verify User')),
                  PopupMenuItem(value: 'suspend', child: Text(u.status == 'Active' ? 'Suspend Account' : 'Reactivate Account')),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSellersTab(BuildContext context, AppState state) {
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: state.stores.length,
      separatorBuilder: (_, __) => const SizedBox(height: 10),
      itemBuilder: (context, index) {
        final s = state.stores[index];
        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(color: AppColors.scaffoldBg, borderRadius: BorderRadius.circular(10)),
                child: Image.asset(s.logo, fit: BoxFit.contain, errorBuilder: (_, __, ___) => const Icon(Icons.store)),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(s.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                        if (s.isVerified) ...[
                          const SizedBox(width: 4),
                          const Icon(Icons.verified_rounded, color: Colors.blue, size: 14),
                        ],
                      ],
                    ),
                    Text(s.location, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                    Text('${s.totalSales} Sales • ★ ${s.rating}', style: const TextStyle(color: AppColors.primary, fontSize: 11, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
              ElevatedButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Verification updated for ${s.name}')));
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: s.isVerified ? Colors.red.shade50 : AppColors.primaryLight,
                  foregroundColor: s.isVerified ? Colors.red : AppColors.primary,
                  elevation: 0,
                  visualDensity: VisualDensity.compact,
                ),
                child: Text(s.isVerified ? 'Revoke' : 'Approve'),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildRidersTab(BuildContext context, AppState state) {
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: state.riders.length,
      separatorBuilder: (_, __) => const SizedBox(height: 10),
      itemBuilder: (context, index) {
        final r = state.riders[index];
        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(color: const Color(0xFFFFF7ED), borderRadius: BorderRadius.circular(12)),
                child: const Icon(Icons.two_wheeler_rounded, color: Color(0xFFF97316)),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(r.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    Text('${r.vehicleType} (${r.licensePlate}) • ${r.phone}', style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                    Text('License: ${r.licenseNumber}', style: const TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                  ],
                ),
              ),
              ElevatedButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('License status verified for ${r.name}')));
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: r.isApproved ? Colors.green.shade50 : AppColors.primary,
                  foregroundColor: r.isApproved ? Colors.green.shade800 : Colors.white,
                  elevation: 0,
                  visualDensity: VisualDensity.compact,
                ),
                child: Text(r.isApproved ? 'Approved' : 'Verify'),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildOrdersTab(BuildContext context, AppState state) {
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: state.orders.length,
      separatorBuilder: (_, __) => const SizedBox(height: 10),
      itemBuilder: (context, index) {
        final o = state.orders[index];
        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Order #${o.id}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(color: AppColors.primaryLight, borderRadius: BorderRadius.circular(8)),
                    child: Text(o.status.displayName, style: const TextStyle(color: AppColors.primary, fontSize: 11, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text('Buyer: ${o.buyerName} • Store: ${o.storeName}', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
              Text('Total: Le ${o.total.toStringAsFixed(0)} • Method: ${o.deliveryMethod}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppColors.primary)),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () {
                      state.updateOrderStatus(o.id, OrderStatus.delivered);
                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Order #${o.id} forced to Delivered')));
                    },
                    child: const Text('Force Delivered', style: TextStyle(fontSize: 11, color: Colors.green)),
                  ),
                  TextButton(
                    onPressed: () {
                      state.updateOrderStatus(o.id, OrderStatus.refunded);
                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Order #${o.id} refunded')));
                    },
                    child: const Text('Refund Buyer', style: TextStyle(fontSize: 11, color: Colors.red)),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildJobsTab(BuildContext context, AppState state) {
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: state.jobs.length,
      separatorBuilder: (_, __) => const SizedBox(height: 10),
      itemBuilder: (context, index) {
        final j = state.jobs[index];
        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(j.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    Text('${j.companyName} • ${j.location}', style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                    Text('Salary: ${j.salaryRange} • ${j.employmentType}', style: const TextStyle(color: AppColors.primary, fontSize: 11, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.delete_outline, color: Colors.red),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Job #${j.id} moderated & removed')));
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _metricTile(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              Icon(icon, color: color, size: 20),
              const SizedBox(width: 6),
              Expanded(child: Text(label, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary, fontWeight: FontWeight.w600), maxLines: 1)),
            ],
          ),
          const SizedBox(height: 6),
          Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.textPrimary)),
        ],
      ),
    );
  }

  Widget _actionTile(BuildContext context, IconData icon, String title, String subtitle, VoidCallback onTap) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: ListTile(
        leading: Icon(icon, color: AppColors.primary),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
        subtitle: Text(subtitle, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
        trailing: const Icon(Icons.chevron_right, size: 18),
        onTap: onTap,
      ),
    );
  }
}
