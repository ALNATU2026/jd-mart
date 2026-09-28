import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../models/models.dart';
import '../services/app_state.dart';
import '../widgets/app_scaffold.dart';

class ProductDetailScreen extends StatefulWidget {
  final String? productId;
  final Map<String, dynamic>? productMap;

  const ProductDetailScreen({super.key, this.productId, this.productMap});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  int _selectedQuantity = 1;
  int _selectedImageIndex = 0;

  @override
  Widget build(BuildContext context) {
    final state = AppState.instance;

    ProductModel product;
    if (widget.productId != null) {
      try {
        product = state.products.firstWhere((p) => p.id == widget.productId);
      } catch (_) {
        product = state.products.first;
      }
    } else if (widget.productMap != null) {
      // Backward compatibility with original screen
      final map = widget.productMap!;
      try {
        product = state.products.firstWhere((p) => p.name == map['title']);
      } catch (_) {
        product = state.products.first;
      }
    } else {
      product = state.products.first;
    }

    final isFav = state.isWishlisted(product.id);
    final related = state.products.where((p) => p.id != product.id && p.category == product.category).toList();

    return AppScaffold(
      title: product.name,
      currentRoute: '/product/${product.id}',
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image Carousel & Gallery
            Stack(
              children: [
                Container(
                  height: 300,
                  width: double.infinity,
                  color: Colors.white,
                  child: Image.asset(
                    product.images.isNotEmpty ? product.images[_selectedImageIndex] : 'assets/images/smartwatch.jpg',
                    fit: BoxFit.contain,
                  ),
                ),
                Positioned(
                  top: 14,
                  left: 14,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(color: Colors.red, borderRadius: BorderRadius.circular(12)),
                    child: Text(product.discount, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                  ),
                ),
                Positioned(
                  top: 14,
                  right: 14,
                  child: Row(
                    children: [
                      CircleAvatar(
                        backgroundColor: Colors.white,
                        child: IconButton(
                          icon: Icon(isFav ? Icons.favorite : Icons.favorite_border, color: isFav ? Colors.red : AppColors.textPrimary),
                          onPressed: () => state.toggleWishlist(product.id),
                        ),
                      ),
                      const SizedBox(width: 8),
                      CircleAvatar(
                        backgroundColor: Colors.white,
                        child: IconButton(
                          icon: const Icon(Icons.share_outlined, color: AppColors.textPrimary),
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Product link copied to clipboard!')),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            // Multiple image thumbnails if available
            if (product.images.length > 1)
              Container(
                color: Colors.white,
                padding: const EdgeInsets.only(bottom: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(product.images.length, (idx) {
                    final isSelected = _selectedImageIndex == idx;
                    return InkWell(
                      onTap: () => setState(() => _selectedImageIndex = idx),
                      child: Container(
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        width: 50,
                        height: 50,
                        decoration: BoxDecoration(
                          border: Border.all(color: isSelected ? AppColors.primary : AppColors.border, width: 2),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.asset(product.images[idx], fit: BoxFit.cover),
                        ),
                      ),
                    );
                  }),
                ),
              ),

            // Product Details Content
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title & Category
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(color: AppColors.primaryLight, borderRadius: BorderRadius.circular(6)),
                        child: Text(product.category.toUpperCase(), style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 10)),
                      ),
                      Text('Stock: ${product.stock} available', style: const TextStyle(color: AppColors.success, fontWeight: FontWeight.bold, fontSize: 12)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(product.name, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
                  const SizedBox(height: 8),

                  // Rating & Reviews Count
                  Row(
                    children: [
                      const Icon(Icons.star_rounded, color: Colors.amber, size: 20),
                      Text(' ${product.rating} ', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      Text('(${product.reviewsCount} verified reviews)', style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Price Row
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      Text(product.priceFormatted, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: AppColors.textPrimary)),
                      const SizedBox(width: 10),
                      Text(product.oldPriceFormatted, style: const TextStyle(fontSize: 16, color: AppColors.textMuted, decoration: TextDecoration.lineThrough)),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Quantity Selector
                  Row(
                    children: [
                      const Text('Quantity:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      const SizedBox(width: 14),
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Row(
                          children: [
                            IconButton(
                              icon: const Icon(Icons.remove, size: 18),
                              onPressed: _selectedQuantity > 1 ? () => setState(() => _selectedQuantity--) : null,
                            ),
                            Text('$_selectedQuantity', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                            IconButton(
                              icon: const Icon(Icons.add, size: 18),
                              onPressed: _selectedQuantity < product.stock ? () => setState(() => _selectedQuantity++) : null,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Seller Info Card
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.borderLight),
                    ),
                    child: Row(
                      children: [
                        const CircleAvatar(
                          backgroundColor: AppColors.primaryLight,
                          child: Icon(Icons.storefront_rounded, color: AppColors.primary),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(product.sellerName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                              Text('${product.sellerLocation} • ${product.sellerRating} ★', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                            ],
                          ),
                        ),
                        OutlinedButton(
                          onPressed: () => Navigator.pushNamed(context, '/messages'),
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: AppColors.primary),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          ),
                          child: const Text('Contact', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Description
                  const Text('Product Description', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 6),
                  Text(product.description, style: const TextStyle(fontSize: 13, height: 1.5, color: AppColors.textSecondary)),
                  const SizedBox(height: 16),

                  // Fast delivery guarantee badge
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.primaryLight,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.local_shipping_rounded, color: AppColors.primary, size: 24),
                        SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Fast Dispatch & Delivery', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary, fontSize: 13)),
                              Text('Free delivery on orders above Le 50. Live tracking enabled.', style: TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Action Buttons: Add to Cart and Buy Now
                  Row(
                    children: [
                      Expanded(
                        child: SizedBox(
                          height: 52,
                          child: OutlinedButton(
                            onPressed: () {
                              state.addToCart(product, _selectedQuantity);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('Added $_selectedQuantity x ${product.name} to cart!'),
                                  action: SnackBarAction(
                                    label: 'VIEW CART',
                                    textColor: AppColors.secondary,
                                    onPressed: () => Navigator.pushNamed(context, '/cart'),
                                  ),
                                ),
                              );
                            },
                            style: OutlinedButton.styleFrom(
                              side: const BorderSide(color: AppColors.primary, width: 2),
                              foregroundColor: AppColors.primary,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            ),
                            child: const Text('Add to Cart', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: SizedBox(
                          height: 52,
                          child: ElevatedButton(
                            onPressed: () {
                              state.addToCart(product, _selectedQuantity);
                              Navigator.pushNamed(context, '/checkout');
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            ),
                            child: const Text('Buy Now', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Report product link
                  Center(
                    child: TextButton.icon(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Report submitted to Trust & Safety team.')),
                        );
                      },
                      icon: const Icon(Icons.flag_outlined, size: 16, color: AppColors.textMuted),
                      label: const Text('Report incorrect product details or suspicious seller', style: TextStyle(color: AppColors.textMuted, fontSize: 11)),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Related Products
                  if (related.isNotEmpty) ...[
                    const Text('Related Products', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
                    const SizedBox(height: 10),
                    SizedBox(
                      height: 180,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: related.length,
                        itemBuilder: (ctx, i) {
                          final rel = related[i];
                          return InkWell(
                            onTap: () => Navigator.pushNamed(context, '/product/${rel.id}'),
                            child: Container(
                              width: 130,
                              margin: const EdgeInsets.only(right: 10),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: AppColors.borderLight),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  ClipRRect(
                                    borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                                    child: Image.asset(rel.images.first, height: 95, width: double.infinity, fit: BoxFit.cover),
                                  ),
                                  Padding(
                                    padding: const EdgeInsets.all(6),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(rel.name, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11)),
                                        Text(rel.priceFormatted, style: const TextStyle(fontWeight: FontWeight.w900, color: AppColors.primary, fontSize: 12)),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
