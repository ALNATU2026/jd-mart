import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../models/models.dart';
import '../services/app_state.dart';
import '../widgets/app_scaffold.dart';

class SellerProductsScreen extends StatefulWidget {
  final bool isNewProduct;
  final String? editProductId;

  const SellerProductsScreen({
    super.key,
    this.isNewProduct = false,
    this.editProductId,
  });

  @override
  State<SellerProductsScreen> createState() => _SellerProductsScreenState();
}

class _SellerProductsScreenState extends State<SellerProductsScreen> {
  final TextEditingController _searchCtrl = TextEditingController();

  // Form controllers for new/edit product
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _nameCtrl;
  late TextEditingController _descCtrl;
  late TextEditingController _priceCtrl;
  late TextEditingController _oldPriceCtrl;
  late TextEditingController _discountCtrl;
  late TextEditingController _stockCtrl;
  late TextEditingController _locationCtrl;
  String _selectedCategory = 'Electronics';
  String _selectedCondition = 'Brand New';

  @override
  void initState() {
    super.initState();
    ProductModel? existing;
    if (widget.editProductId != null) {
      try {
        existing = AppState.instance.products.firstWhere((p) => p.id == widget.editProductId);
      } catch (_) {}
    }

    _nameCtrl = TextEditingController(text: existing?.name ?? '');
    _descCtrl = TextEditingController(text: existing?.description ?? '');
    _priceCtrl = TextEditingController(text: existing != null ? '${existing.price}' : '');
    _oldPriceCtrl = TextEditingController(text: existing != null ? '${existing.oldPrice}' : '');
    _discountCtrl = TextEditingController(text: existing?.discount ?? '-20%');
    _stockCtrl = TextEditingController(text: existing != null ? '${existing.stock}' : '10');
    _locationCtrl = TextEditingController(text: existing?.location ?? 'Ikeja, Lagos');
    if (existing != null) {
      _selectedCategory = existing.category;
      _selectedCondition = existing.condition;
    }
  }

  @override
  Widget build(BuildContext context) {
    if (widget.isNewProduct || widget.editProductId != null) {
      return _buildFormScreen(context);
    }

    return AnimatedBuilder(
      animation: AppState.instance,
      builder: (context, _) {
        final state = AppState.instance;
        final query = _searchCtrl.text.toLowerCase().trim();
        final myProducts = state.products.where((p) {
          return query.isEmpty || p.name.toLowerCase().contains(query) || p.category.toLowerCase().contains(query);
        }).toList();

        return AppScaffold(
          title: 'Products Management',
          currentRoute: '/seller/products',
          floatingActionButton: FloatingActionButton.extended(
            onPressed: () => Navigator.pushNamed(context, '/seller/products/new'),
            backgroundColor: AppColors.primary,
            icon: const Icon(Icons.add, color: Colors.white),
            label: const Text('Add Product', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
          body: Column(
            children: [
              // Search & Add Header
              Container(
                color: Colors.white,
                padding: const EdgeInsets.all(12),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _searchCtrl,
                        onChanged: (_) => setState(() {}),
                        decoration: InputDecoration(
                          hintText: 'Search products by name or category...',
                          prefixIcon: const Icon(Icons.search_rounded, size: 20),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.border)),
                          contentPadding: const EdgeInsets.symmetric(vertical: 10),
                          isDense: true,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Product List
              Expanded(
                child: myProducts.isEmpty
                    ? const Center(child: Text('No products found.'))
                    : ListView.builder(
                        padding: const EdgeInsets.all(14),
                        itemCount: myProducts.length,
                        itemBuilder: (ctx, i) {
                          final p = myProducts[i];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            child: Padding(
                              padding: const EdgeInsets.all(12),
                              child: Row(
                                children: [
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(10),
                                    child: Image.asset(p.images.first, width: 65, height: 65, fit: BoxFit.cover),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(p.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13), maxLines: 1),
                                        Text('${p.category} • Stock: ${p.stock}', style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                                        const SizedBox(height: 4),
                                        Row(
                                          children: [
                                            Text(p.priceFormatted, style: const TextStyle(fontWeight: FontWeight.w900, color: AppColors.primary, fontSize: 14)),
                                            const SizedBox(width: 8),
                                            Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                              decoration: BoxDecoration(
                                                color: p.isActive ? AppColors.successLight : AppColors.dangerLight,
                                                borderRadius: BorderRadius.circular(6),
                                              ),
                                              child: Text(
                                                p.isActive ? 'Active' : 'Inactive',
                                                style: TextStyle(color: p.isActive ? AppColors.success : AppColors.danger, fontSize: 10, fontWeight: FontWeight.bold),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                  Column(
                                    children: [
                                      Switch(
                                        value: p.isActive,
                                        activeColor: AppColors.primary,
                                        onChanged: (_) => state.toggleProductActive(p.id),
                                      ),
                                      Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          IconButton(
                                            icon: const Icon(Icons.edit_outlined, size: 20, color: AppColors.primary),
                                            onPressed: () => Navigator.pushNamed(context, '/seller/products/${p.id}/edit'),
                                          ),
                                          IconButton(
                                            icon: const Icon(Icons.delete_outline, size: 20, color: Colors.red),
                                            onPressed: () {
                                              state.deleteProduct(p.id);
                                              ScaffoldMessenger.of(context).showSnackBar(
                                                const SnackBar(content: Text('Product deleted.')),
                                              );
                                            },
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildFormScreen(BuildContext context) {
    final state = AppState.instance;
    final isEditing = widget.editProductId != null;

    return AppScaffold(
      title: isEditing ? 'Edit Product' : 'Add New Product',
      currentRoute: isEditing ? '/seller/products/${widget.editProductId}/edit' : '/seller/products/new',
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextFormField(
                controller: _nameCtrl,
                decoration: const InputDecoration(labelText: 'Product Name', border: OutlineInputBorder()),
                validator: (v) => v!.isEmpty ? 'Please enter product title' : null,
              ),
              const SizedBox(height: 12),

              DropdownButtonFormField<String>(
                value: _selectedCategory,
                decoration: const InputDecoration(labelText: 'Category', border: OutlineInputBorder()),
                items: state.categories.map((c) => DropdownMenuItem(value: c.name, child: Text(c.name))).toList(),
                onChanged: (v) => setState(() => _selectedCategory = v!),
              ),
              const SizedBox(height: 12),

              TextFormField(
                controller: _descCtrl,
                maxLines: 3,
                decoration: const InputDecoration(labelText: 'Description', border: OutlineInputBorder()),
                validator: (v) => v!.isEmpty ? 'Please enter description' : null,
              ),
              const SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _priceCtrl,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'Price (Le)', border: OutlineInputBorder()),
                      validator: (v) => v!.isEmpty ? 'Enter price' : null,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: TextFormField(
                      controller: _oldPriceCtrl,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'Old Price (Le)', border: OutlineInputBorder()),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _discountCtrl,
                      decoration: const InputDecoration(labelText: 'Discount Label', border: OutlineInputBorder()),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: TextFormField(
                      controller: _stockCtrl,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'Stock Units', border: OutlineInputBorder()),
                      validator: (v) => v!.isEmpty ? 'Enter stock count' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      value: _selectedCondition,
                      decoration: const InputDecoration(labelText: 'Condition', border: OutlineInputBorder()),
                      items: ['Brand New', 'Refurbished', 'Open Box', 'Used'].map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                      onChanged: (v) => setState(() => _selectedCondition = v!),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: TextFormField(
                      controller: _locationCtrl,
                      decoration: const InputDecoration(labelText: 'Warehouse Location', border: OutlineInputBorder()),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Product draft saved locally.')),
                        );
                        Navigator.pop(context);
                      },
                      style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14)),
                      child: const Text('Save Draft'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    flex: 2,
                    child: ElevatedButton(
                      onPressed: () {
                        if (_formKey.currentState!.validate()) {
                          final double price = double.tryParse(_priceCtrl.text) ?? 20.0;
                          final double oldPrice = double.tryParse(_oldPriceCtrl.text) ?? price * 1.3;
                          final int stock = int.tryParse(_stockCtrl.text) ?? 10;

                          if (isEditing) {
                            final updated = ProductModel(
                              id: widget.editProductId!,
                              name: _nameCtrl.text.trim(),
                              slug: _nameCtrl.text.trim().toLowerCase().replaceAll(' ', '-'),
                              description: _descCtrl.text.trim(),
                              price: price,
                              oldPrice: oldPrice,
                              discount: _discountCtrl.text.trim(),
                              stock: stock,
                              images: ['assets/images/smartwatch.jpg'],
                              category: _selectedCategory,
                              sellerId: 'seller_1',
                              sellerName: state.myStore?.name ?? 'JD SuperStore',
                              location: _locationCtrl.text.trim(),
                              condition: _selectedCondition,
                            );
                            state.updateProduct(updated);
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Product updated successfully!')),
                            );
                          } else {
                            final newProd = ProductModel(
                              id: 'prod_${DateTime.now().millisecondsSinceEpoch}',
                              name: _nameCtrl.text.trim(),
                              slug: _nameCtrl.text.trim().toLowerCase().replaceAll(' ', '-'),
                              description: _descCtrl.text.trim(),
                              price: price,
                              oldPrice: oldPrice,
                              discount: _discountCtrl.text.trim(),
                              stock: stock,
                              images: ['assets/images/smartwatch.jpg'],
                              category: _selectedCategory,
                              sellerId: 'seller_1',
                              sellerName: state.myStore?.name ?? 'JD SuperStore',
                              location: _locationCtrl.text.trim(),
                              condition: _selectedCondition,
                            );
                            state.addProduct(newProd);
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Product submitted and approved to live shop!')),
                            );
                          }
                          Navigator.pop(context);
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      child: Text(isEditing ? 'Save Changes' : 'Submit for Approval', style: const TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }
}
