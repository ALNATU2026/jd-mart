import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../models/models.dart';
import '../services/app_state.dart';
import '../widgets/app_scaffold.dart';

class RiderScreens extends StatelessWidget {
  final String mode; // 'dashboard', 'requests', 'delivery', 'history', 'earnings', 'profile'
  final String? deliveryId;

  const RiderScreens({super.key, required this.mode, this.deliveryId});

  @override
  Widget build(BuildContext context) {
    if (mode == 'requests') return _buildRequestsScreen(context);
    if (mode == 'delivery') return _buildActiveDeliveryScreen(context);
    if (mode == 'history') return _buildHistoryScreen(context);
    if (mode == 'earnings') return _buildEarningsScreen(context);
    if (mode == 'profile') return _buildProfileScreen(context);

    // Dashboard
    return _buildDashboardScreen(context);
  }

  Widget _buildDashboardScreen(BuildContext context) {
    return AnimatedBuilder(
      animation: AppState.instance,
      builder: (context, _) {
        final state = AppState.instance;
        final available = state.deliveries.where((d) => d.status == 'Available').toList();
        final active = state.deliveries.cast<RiderDeliveryModel?>().firstWhere(
              (d) => d?.riderId == state.currentUser.id && d?.status != 'Delivered',
              orElse: () => null,
            );

        return AppScaffold(
          title: 'Rider Dashboard',
          currentRoute: '/rider',
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Online/Offline switch banner
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: state.isRiderOnline ? AppColors.successLight : AppColors.dangerLight,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: state.isRiderOnline ? AppColors.success : AppColors.danger),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(
                            state.isRiderOnline ? Icons.radar_rounded : Icons.pause_circle_outline,
                            color: state.isRiderOnline ? AppColors.success : AppColors.danger,
                            size: 26,
                          ),
                          const SizedBox(width: 10),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                state.isRiderOnline ? 'You Are ONLINE & Active' : 'You Are OFFLINE',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: state.isRiderOnline ? AppColors.success : AppColors.danger,
                                  fontSize: 14,
                                ),
                              ),
                              Text(
                                state.isRiderOnline ? 'Receiving delivery broadcast trips nearby' : 'Go online to receive nearby pickup jobs',
                                style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                              ),
                            ],
                          ),
                        ],
                      ),
                      Switch(
                        value: state.isRiderOnline,
                        activeColor: AppColors.success,
                        onChanged: (_) => state.toggleRiderOnline(),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Metrics Grid
                Row(
                  children: [
                    _metricItem("Today's Trips", '6 trips', Icons.two_wheeler_rounded, AppColors.primaryLight, AppColors.primary),
                    const SizedBox(width: 10),
                    _metricItem("Today's Earnings", 'Le 118.50', Icons.payments_outlined, AppColors.secondaryLight, AppColors.secondary),
                    const SizedBox(width: 10),
                    _metricItem("Rider Rating", '4.9 ★', Icons.star_rounded, const Color(0xFFFEF3C7), Colors.amber.shade800),
                  ],
                ),
                const SizedBox(height: 20),

                // Active delivery card if assigned
                if (active != null) ...[
                  const Text('Current Active Delivery', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.primary, width: 1.5),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Trip #${active.id}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(color: AppColors.primaryLight, borderRadius: BorderRadius.circular(6)),
                              child: Text(active.status, style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 11)),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Text('Pickup: ${active.pickupLocation}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                        Text('Destination: ${active.deliveryLocation}', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                        const SizedBox(height: 12),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: () => Navigator.pushNamed(context, '/rider/delivery/${active.id}'),
                            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
                            child: const Text('Open Navigation & Delivery Steps'),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                ],

                // Delivery Requests header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Available Trips (${available.length})', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                    TextButton(
                      onPressed: () => Navigator.pushNamed(context, '/rider/requests'),
                      child: const Text('View All', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary)),
                    ),
                  ],
                ),
                if (available.isEmpty)
                  const Padding(padding: EdgeInsets.all(24), child: Center(child: Text('No new delivery requests right now.')))
                else
                  ...available.map((del) {
                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      child: Padding(
                        padding: const EdgeInsets.all(14),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text('Trip #${del.id} • ${del.distance}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                                Text('Fee: Le ${del.deliveryFee.toStringAsFixed(2)}',
                                    style: const TextStyle(fontWeight: FontWeight.w900, color: AppColors.success, fontSize: 14)),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                const Icon(Icons.circle, color: AppColors.primary, size: 10),
                                const SizedBox(width: 8),
                                Expanded(child: Text('From: ${del.pickupLocation}', style: const TextStyle(fontSize: 12))),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                const Icon(Icons.location_on, color: Colors.red, size: 12),
                                const SizedBox(width: 8),
                                Expanded(child: Text('To: ${del.deliveryLocation}', style: const TextStyle(fontSize: 12))),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                Expanded(
                                  child: ElevatedButton(
                                    onPressed: () {
                                      state.acceptDelivery(del.id);
                                      Navigator.pushNamed(context, '/rider/delivery/${del.id}');
                                    },
                                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
                                    child: const Text('Accept Delivery'),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    );
                  }),
                const SizedBox(height: 30),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildRequestsScreen(BuildContext context) {
    final state = AppState.instance;
    final available = state.deliveries.where((d) => d.status == 'Available').toList();

    return AppScaffold(
      title: 'Delivery Requests',
      currentRoute: '/rider/requests',
      body: available.isEmpty
          ? const Center(child: Text('No delivery requests right now.'))
          : ListView.builder(
              padding: const EdgeInsets.all(14),
              itemCount: available.length,
              itemBuilder: (ctx, i) {
                final del = available[i];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(del.sellerName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                            Text('Le ${del.deliveryFee.toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.w900, color: AppColors.success, fontSize: 16)),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(del.orderSummary, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                        const Divider(height: 16),
                        Text('Pickup: ${del.pickupLocation}'),
                        Text('Dropoff: ${del.deliveryLocation}'),
                        Text('Est. Distance: ${del.distance}'),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: ElevatedButton(
                                onPressed: () {
                                  state.acceptDelivery(del.id);
                                  Navigator.pushNamed(context, '/rider/delivery/${del.id}');
                                },
                                style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
                                child: const Text('Accept'),
                              ),
                            ),
                            const SizedBox(width: 10),
                            OutlinedButton(
                              onPressed: () {
                                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Request dismissed.')));
                              },
                              child: const Text('Decline'),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }

  Widget _buildActiveDeliveryScreen(BuildContext context) {
    return AnimatedBuilder(
      animation: AppState.instance,
      builder: (context, _) {
        final state = AppState.instance;
        RiderDeliveryModel del;
        try {
          del = state.deliveries.firstWhere((d) => d.id == deliveryId);
        } catch (_) {
          del = state.deliveries.first;
        }

        return AppScaffold(
          title: 'Active Delivery: #${del.id}',
          currentRoute: '/rider/delivery/${del.id}',
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Simulated Route Map Card
                Container(
                  height: 160,
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Stack(
                    children: [
                      Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.map_rounded, color: Colors.white54, size: 48),
                            const SizedBox(height: 6),
                            Text('GPS Navigation Active • ${del.distance}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                            Text('Routing to ${del.deliveryLocation}', style: const TextStyle(color: Colors.white70, fontSize: 11)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Trip Status Banner
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(color: AppColors.primaryLight, borderRadius: BorderRadius.circular(14)),
                  child: Row(
                    children: [
                      const Icon(Icons.two_wheeler_rounded, color: AppColors.primary, size: 24),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Current Trip State: ${del.status}', style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary, fontSize: 13)),
                            const Text('Update steps as you progress with the delivery.', style: TextStyle(fontSize: 11)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Seller & Buyer contacts
                Card(
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: Padding(
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      children: [
                        ListTile(
                          contentPadding: EdgeInsets.zero,
                          leading: const CircleAvatar(child: Icon(Icons.store)),
                          title: Text('Pickup: ${del.sellerName}'),
                          subtitle: Text(del.pickupLocation),
                          trailing: IconButton(
                            icon: const Icon(Icons.phone, color: AppColors.primary),
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Calling seller...')));
                            },
                          ),
                        ),
                        const Divider(),
                        ListTile(
                          contentPadding: EdgeInsets.zero,
                          leading: const CircleAvatar(child: Icon(Icons.person)),
                          title: Text('Recipient: ${del.buyerName}'),
                          subtitle: Text('${del.deliveryLocation} • ${del.buyerPhone}'),
                          trailing: IconButton(
                            icon: const Icon(Icons.phone, color: AppColors.primary),
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Calling buyer at ${del.buyerPhone}...')));
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Delivery Actions Workflow: Accept -> Arrived at Pickup -> Picked Up -> Start Delivery -> Delivered
                const Text('Update Trip Workflow', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                const SizedBox(height: 10),
                Wrap(
                  spacing: 10,
                  runSpacing: 10,
                  children: [
                    ElevatedButton(
                      onPressed: () {
                        state.updateDeliveryStatus(del.id, 'ArrivedAtPickup');
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Status updated: Arrived at Pickup store.')));
                      },
                      style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
                      child: const Text('Arrived at Pickup'),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        state.updateDeliveryStatus(del.id, 'PickedUp');
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Status updated: Package Picked Up.')));
                      },
                      style: ElevatedButton.styleFrom(backgroundColor: AppColors.secondary, foregroundColor: Colors.white),
                      child: const Text('Picked Up'),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        state.updateDeliveryStatus(del.id, 'InTransit');
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Status updated: In Transit to Buyer.')));
                      },
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.blue.shade700, foregroundColor: Colors.white),
                      child: const Text('Start Delivery'),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        state.updateDeliveryStatus(del.id, 'Delivered');
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Delivery Completed! Earnings credited to wallet.')));
                        Navigator.pushReplacementNamed(context, '/rider/history');
                      },
                      style: ElevatedButton.styleFrom(backgroundColor: AppColors.success, foregroundColor: Colors.white),
                      child: const Text('Mark Delivered'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildHistoryScreen(BuildContext context) {
    final state = AppState.instance;
    return AppScaffold(
      title: 'Delivery History',
      currentRoute: '/rider/history',
      body: ListView(
        padding: const EdgeInsets.all(14),
        children: state.deliveries.map((d) {
          return Card(
            margin: const EdgeInsets.only(bottom: 10),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            child: ListTile(
              leading: const CircleAvatar(backgroundColor: AppColors.successLight, child: Icon(Icons.check, color: AppColors.success)),
              title: Text('Trip #${d.id} • ${d.orderSummary}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              subtitle: Text('Delivered to ${d.buyerName} • ${d.createdAt}'),
              trailing: Text('Le ${d.deliveryFee.toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.w900, color: AppColors.success)),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildEarningsScreen(BuildContext context) {
    return AppScaffold(
      title: 'Rider Earnings',
      currentRoute: '/rider/earnings',
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFF0F172A), Color(0xFF1E3A8A)]),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                children: [
                  const Text('Total Rider Wallet Balance', style: TextStyle(color: Colors.white70, fontSize: 12)),
                  const SizedBox(height: 6),
                  const Text('Le 420.50', style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w900)),
                  const SizedBox(height: 14),
                  ElevatedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Instant withdrawal request submitted.')));
                    },
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.secondary, foregroundColor: Colors.white),
                    child: const Text('Withdraw to Mobile Money'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Column(
                children: const [
                  ListTile(title: Text("Today's Earnings"), trailing: Text('Le 118.50', style: TextStyle(fontWeight: FontWeight.bold))),
                  Divider(height: 1),
                  ListTile(title: Text("This Week's Earnings"), trailing: Text('Le 650.00', style: TextStyle(fontWeight: FontWeight.bold))),
                  Divider(height: 1),
                  ListTile(title: Text("This Month's Earnings"), trailing: Text('Le 2,420.00', style: TextStyle(fontWeight: FontWeight.bold))),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileScreen(BuildContext context) {
    final user = AppState.instance.currentUser;
    return AppScaffold(
      title: 'Rider Profile',
      currentRoute: '/rider/profile',
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    const CircleAvatar(radius: 36, child: Icon(Icons.two_wheeler, size: 40)),
                    const SizedBox(height: 10),
                    Text(user.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                    const Text('Certified JDMart Dispatch Rider', style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                    const Divider(height: 24),
                    _profileLine('Phone', user.phone),
                    _profileLine('Vehicle', 'Honda ACE 125 Motorcycle'),
                    _profileLine('Plate Number', 'LAG-892-KJ'),
                    _profileLine('Operating Hub', 'Ikeja / Yaba Zone'),
                    _profileLine('Verification', 'Verified & Insured'),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _profileLine(String label, String val) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: AppColors.textSecondary)),
          Text(val, style: const TextStyle(fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _metricItem(String label, String val, IconData icon, Color bg, Color iconColor) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.borderLight),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(8)),
              child: Icon(icon, color: iconColor, size: 18),
            ),
            const SizedBox(height: 8),
            Text(val, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15, color: AppColors.textPrimary)),
            Text(label, style: const TextStyle(fontSize: 10, color: AppColors.textSecondary)),
          ],
        ),
      ),
    );
  }
}
