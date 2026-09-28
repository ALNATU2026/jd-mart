import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../models/models.dart';
import '../services/app_state.dart';
import '../widgets/app_scaffold.dart';

class SellerOrdersScreen extends StatefulWidget {
  final String? orderId;
  final String mode; // 'orders', 'details', 'dispatch', 'customers', 'earnings', 'reviews', 'settings'

  const SellerOrdersScreen({
    super.key,
    this.orderId,
    this.mode = 'orders',
  });

  @override
  State<SellerOrdersScreen> createState() => _SellerOrdersScreenState();
}

class _SellerOrdersScreenState extends State<SellerOrdersScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<String> _tabs = [
    'All',
    'New',
    'Confirmed',
    'Processing',
    'Ready for Pickup',
    'Completed',
    'Cancelled',
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    if (widget.mode == 'details') return _buildDetailsView(context);
    if (widget.mode == 'dispatch') return _buildDispatchView(context);
    if (widget.mode == 'customers') return _buildCustomersView(context);
    if (widget.mode == 'earnings') return _buildEarningsView(context);
    if (widget.mode == 'reviews') return _buildReviewsView(context);
    if (widget.mode == 'settings') return _buildSettingsView(context);

    return AnimatedBuilder(
      animation: AppState.instance,
      builder: (context, _) {
        final state = AppState.instance;
        final orders = state.sellerOrders;

        return AppScaffold(
          title: 'Seller Orders',
          currentRoute: '/seller/orders',
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
                  tabs: _tabs.map((t) => Tab(text: t)).toList(),
                ),
              ),
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: _tabs.map((tab) {
                    final list = tab == 'All'
                        ? orders
                        : orders.where((o) => o.status.toLowerCase().contains(tab.toLowerCase())).toList();

                    if (list.isEmpty) {
                      return Center(child: Text('No $tab orders found.'));
                    }

                    return ListView.builder(
                      padding: const EdgeInsets.all(14),
                      itemCount: list.length,
                      itemBuilder: (ctx, i) {
                        final o = list[i];
                        return Card(
                          margin: const EdgeInsets.only(bottom: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          child: Padding(
                            padding: const EdgeInsets.all(14),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text('Order #${o.id}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(color: AppColors.primaryLight, borderRadius: BorderRadius.circular(6)),
                                      child: Text(o.status, style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 11)),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Text('Buyer: ${o.buyerName} (${o.buyerPhone})', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                                Text('Destination: ${o.buyerAddress}', style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                                const Divider(height: 16),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text('${o.items.length} item(s) • Total: Le ${o.total.toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.bold)),
                                    ElevatedButton(
                                      onPressed: () => Navigator.pushNamed(context, '/seller/orders/${o.id}'),
                                      style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
                                      child: const Text('Manage Order'),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    );
                  }).toList(),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildDetailsView(BuildContext context) {
    final state = AppState.instance;
    final order = state.getOrderById(widget.orderId ?? '') ?? state.orders.first;

    return AppScaffold(
      title: 'Manage Order #${order.id}',
      currentRoute: '/seller/orders/${order.id}',
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Buyer Information', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                    const SizedBox(height: 8),
                    Text('Name: ${order.buyerName}'),
                    Text('Phone: ${order.buyerPhone}'),
                    Text('Delivery Address: ${order.buyerAddress}, ${order.city}'),
                    Text('Payment: ${order.paymentMethod} (${order.paymentStatus})'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            const Text('Fulfillment Actions', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      state.updateOrderStatus(order.id, 'Processing');
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Order marked as Processing.')));
                    },
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
                    child: const Text('Accept & Process'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      state.updateOrderStatus(order.id, 'Ready for Pickup');
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Order marked Ready for Rider Pickup!')));
                    },
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.secondary, foregroundColor: Colors.white),
                    child: const Text('Ready for Pickup'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () => Navigator.pushNamed(context, '/seller/dispatch'),
                icon: const Icon(Icons.two_wheeler_rounded),
                label: const Text('Request Dispatch Rider'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDispatchView(BuildContext context) {
    final state = AppState.instance;
    return AppScaffold(
      title: 'Dispatch Logistics',
      currentRoute: '/seller/dispatch',
      body: ListView(
        padding: const EdgeInsets.all(14),
        children: [
          const Text('Live Dispatch Coordination', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
          const SizedBox(height: 10),
          ...state.deliveries.map((del) {
            return Card(
              margin: const EdgeInsets.only(bottom: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              child: ListTile(
                leading: CircleAvatar(
                  backgroundColor: del.status == 'Delivered' ? AppColors.successLight : AppColors.primaryLight,
                  child: Icon(Icons.two_wheeler, color: del.status == 'Delivered' ? AppColors.success : AppColors.primary),
                ),
                title: Text('Delivery #${del.id} (${del.orderId})', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                subtitle: Text('To: ${del.deliveryLocation}\nRider: ${del.riderName ?? "Searching nearby riders..."}'),
                trailing: Chip(
                  label: Text(del.status, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildCustomersView(BuildContext context) {
    return AppScaffold(
      title: 'Store Customers',
      currentRoute: '/seller/customers',
      body: ListView(
        padding: const EdgeInsets.all(14),
        children: [
          const Text('Registered Buyers & Store Customers', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
          const SizedBox(height: 10),
          ...['Sarah Connor', 'Emeka Nwosu', 'Fatima Bello', 'John Doe'].map((name) {
            return Card(
              margin: const EdgeInsets.only(bottom: 10),
              child: ListTile(
                leading: const CircleAvatar(child: Icon(Icons.person)),
                title: Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
                subtitle: const Text('Total orders: 3 • Last purchase: Yesterday'),
                trailing: TextButton(
                  onPressed: () => Navigator.pushNamed(context, '/messages'),
                  child: const Text('Message'),
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildEarningsView(BuildContext context) {
    return AppScaffold(
      title: 'Seller Earnings & Payouts',
      currentRoute: '/seller/earnings',
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFF0F172A), Color(0xFF1E293B)]),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Available Payout Balance', style: TextStyle(color: Colors.white70, fontSize: 12)),
                  const SizedBox(height: 6),
                  const Text('Le 94,250.00', style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w900)),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      ElevatedButton(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Payout request of Le 94,250 submitted.')));
                        },
                        style: ElevatedButton.styleFrom(backgroundColor: AppColors.secondary, foregroundColor: Colors.white),
                        child: const Text('Request Payout'),
                      ),
                      const SizedBox(width: 10),
                      Text('Pending: Le 34,250.00', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            const Text('Recent Payout Transactions', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
            const SizedBox(height: 10),
            ...[
              {'ref': 'PAY-8812', 'amount': 'Le 45,000.00', 'date': 'Sep 24, 2026', 'status': 'Completed'},
              {'ref': 'PAY-8811', 'amount': 'Le 62,500.00', 'date': 'Sep 15, 2026', 'status': 'Completed'},
            ].map((p) => Card(
                  margin: const EdgeInsets.only(bottom: 8),
                  child: ListTile(
                    leading: const Icon(Icons.account_balance_wallet_outlined, color: AppColors.success),
                    title: Text(p['ref']!, style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text(p['date']!),
                    trailing: Text(p['amount']!, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.success)),
                  ),
                )),
          ],
        ),
      ),
    );
  }

  Widget _buildReviewsView(BuildContext context) {
    final state = AppState.instance;
    return AppScaffold(
      title: 'Customer Feedback & Reviews',
      currentRoute: '/seller/reviews',
      body: ListView(
        padding: const EdgeInsets.all(14),
        children: state.reviews.map((r) {
          return Card(
            margin: const EdgeInsets.only(bottom: 10),
            child: ListTile(
              leading: const CircleAvatar(child: Icon(Icons.star, color: Colors.amber)),
              title: Text('${r.authorName} on "${r.targetTitle}"', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              subtitle: Text(r.comment),
              trailing: Text('${r.rating} ★', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.amber)),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildSettingsView(BuildContext context) {
    return AppScaffold(
      title: 'Seller Settings',
      currentRoute: '/seller/settings',
      body: ListView(
        padding: const EdgeInsets.all(14),
        children: [
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.store, color: AppColors.primary),
                  title: const Text('Store Profile & Address'),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 14),
                  onTap: () => Navigator.pushNamed(context, '/seller/store'),
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.account_balance, color: AppColors.primary),
                  title: const Text('Bank & Mobile Money Payout Account'),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 14),
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Payout account: Zenith Bank - 1029384756')));
                  },
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.local_shipping, color: AppColors.primary),
                  title: const Text('Delivery Radius & SLA Settings'),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 14),
                  onTap: () {},
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
