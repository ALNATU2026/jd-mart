import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../models/models.dart';
import '../services/app_state.dart';
import '../widgets/app_scaffold.dart';

class SellerStoreScreen extends StatelessWidget {
  final String? storeSlug;
  final bool isOwnerView;

  const SellerStoreScreen({super.key, this.storeSlug, this.isOwnerView = false});

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: AppState.instance,
      builder: (context, _) {
        final state = AppState.instance;

        StoreModel store;
        if (storeSlug != null) {
          try {
            store = state.stores.firstWhere((s) => s.slug == storeSlug);
          } catch (_) {
            store = state.stores.first;
          }
        } else {
          store = state.myStore ?? state.stores.first;
        }

        final storeProducts = state.products.where((p) => p.sellerId == store.sellerId).toList();
        final storeReviews = state.reviews.where((r) => r.targetType == 'store' || r.targetId == store.id).toList();

        return AppScaffold(
          title: store.name,
          currentRoute: storeSlug != null ? '/store/$storeSlug' : '/seller/store',
          body: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Store Banner Cover
                Container(
                  height: 140,
                  width: double.infinity,
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Color(0xFF1E3A8A), Color(0xFF3B82F6)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  child: Stack(
                    children: [
                      Positioned(
                        bottom: 12,
                        left: 16,
                        child: Row(
                          children: [
                            Container(
                              width: 64,
                              height: 64,
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 8)],
                              ),
                              child: Image.asset(store.logo, fit: BoxFit.contain),
                            ),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(store.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 18)),
                                    const SizedBox(width: 6),
                                    if (store.isVerified) const Icon(Icons.verified, color: Colors.amber, size: 18),
                                  ],
                                ),
                                Text('${store.location} • ${store.rating} ★', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                              ],
                            ),
                          ],
                        ),
                      ),
                      if (isOwnerView || state.currentRole == UserRole.seller)
                        Positioned(
                          top: 12,
                          right: 12,
                          child: ElevatedButton.icon(
                            onPressed: () => _editStoreModal(context, state, store),
                            icon: const Icon(Icons.edit, size: 16),
                            label: const Text('Edit Store'),
                            style: ElevatedButton.styleFrom(backgroundColor: Colors.white, foregroundColor: AppColors.primary),
                          ),
                        ),
                    ],
                  ),
                ),

                // Store info section
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('About Store', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                      const SizedBox(height: 4),
                      Text(store.description, style: const TextStyle(fontSize: 13, height: 1.4, color: AppColors.textSecondary)),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          const Icon(Icons.phone_outlined, size: 16, color: AppColors.textSecondary),
                          const SizedBox(width: 6),
                          Text(store.phone, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                          const SizedBox(width: 16),
                          const Icon(Icons.email_outlined, size: 16, color: AppColors.textSecondary),
                          const SizedBox(width: 6),
                          Text(store.email, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Store Stats
                      Row(
                        children: [
                          _statBox('${store.productsCount}', 'Products Listed'),
                          const SizedBox(width: 10),
                          _statBox('${store.rating} / 5', 'Rating'),
                          const SizedBox(width: 10),
                          _statBox('Le ${store.totalSales.toStringAsFixed(0)}', 'Total Volume'),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Store Products
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Products by ${store.name}', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                          Text('${storeProducts.length} items', style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                        ],
                      ),
                      const SizedBox(height: 12),

                      if (storeProducts.isEmpty)
                        const Center(child: Padding(padding: EdgeInsets.all(24), child: Text('No products currently listed.')))
                      else
                        GridView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            childAspectRatio: 0.68,
                            crossAxisSpacing: 10,
                            mainAxisSpacing: 10,
                          ),
                          itemCount: storeProducts.length,
                          itemBuilder: (ctx, i) {
                            final p = storeProducts[i];
                            return InkWell(
                              onTap: () => Navigator.pushNamed(context, '/product/${p.id}'),
                              child: Card(
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    ClipRRect(
                                      borderRadius: const BorderRadius.vertical(top: Radius.circular(14)),
                                      child: Image.asset(p.images.first, height: 120, width: double.infinity, fit: BoxFit.cover),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.all(8),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(p.name, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                                          Text(p.priceFormatted, style: const TextStyle(fontWeight: FontWeight.w900, color: AppColors.primary)),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                      const SizedBox(height: 24),

                      // Customer Reviews
                      const Text('Store Reviews & Buyer Feedback', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                      const SizedBox(height: 8),
                      if (storeReviews.isEmpty)
                        const Padding(padding: EdgeInsets.all(12), child: Text('No reviews yet.'))
                      else
                        ...storeReviews.map((r) => Card(
                              margin: const EdgeInsets.only(bottom: 8),
                              child: ListTile(
                                leading: const CircleAvatar(child: Icon(Icons.person)),
                                title: Text(r.authorName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                subtitle: Text(r.comment),
                                trailing: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(Icons.star_rounded, color: Colors.amber, size: 16),
                                    Text(' ${r.rating}'),
                                  ],
                                ),
                              ),
                            )),
                      const SizedBox(height: 30),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _statBox(String val, String lbl) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.borderLight),
        ),
        child: Column(
          children: [
            Text(val, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15, color: AppColors.primary)),
            const SizedBox(height: 2),
            Text(lbl, style: const TextStyle(fontSize: 10, color: AppColors.textSecondary)),
          ],
        ),
      ),
    );
  }

  void _editStoreModal(BuildContext context, AppState state, StoreModel current) {
    final nameCtrl = TextEditingController(text: current.name);
    final descCtrl = TextEditingController(text: current.description);
    final locCtrl = TextEditingController(text: current.location);
    final phoneCtrl = TextEditingController(text: current.phone);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
          top: 20,
          left: 20,
          right: 20,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Edit Store Profile', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 14),
            TextField(controller: nameCtrl, decoration: const InputDecoration(labelText: 'Store Name', border: OutlineInputBorder())),
            const SizedBox(height: 10),
            TextField(controller: descCtrl, maxLines: 2, decoration: const InputDecoration(labelText: 'Description', border: OutlineInputBorder())),
            const SizedBox(height: 10),
            TextField(controller: locCtrl, decoration: const InputDecoration(labelText: 'Location / Hub', border: OutlineInputBorder())),
            const SizedBox(height: 10),
            TextField(controller: phoneCtrl, decoration: const InputDecoration(labelText: 'Customer Support Phone', border: OutlineInputBorder())),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: () {
                  final updated = StoreModel(
                    id: current.id,
                    sellerId: current.sellerId,
                    name: nameCtrl.text.trim(),
                    slug: current.slug,
                    description: descCtrl.text.trim(),
                    logo: current.logo,
                    location: locCtrl.text.trim(),
                    phone: phoneCtrl.text.trim(),
                    email: current.email,
                    status: current.status,
                    isVerified: current.isVerified,
                    rating: current.rating,
                    totalSales: current.totalSales,
                    productsCount: current.productsCount,
                  );
                  state.updateStore(updated);
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Store settings saved!')),
                  );
                },
                style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
                child: const Text('Save Store Changes'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
