import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../services/app_state.dart';
import '../widgets/app_scaffold.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController(text: 'Sarah Connor');
  final _phoneController = TextEditingController(text: '+234 802 111 2233');
  final _addressController = TextEditingController(text: '14 Allen Avenue, Ikeja');
  final _cityController = TextEditingController(text: 'Lagos');

  String _deliveryMethod = 'Standard delivery';
  String _paymentMethod = 'Debit / Credit Card';

  @override
  Widget build(BuildContext context) {
    final state = AppState.instance;

    return AppScaffold(
      title: 'Checkout',
      currentRoute: '/checkout',
      body: state.cart.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('No items to checkout.', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 12),
                  ElevatedButton(
                    onPressed: () => Navigator.pushNamed(context, '/shop'),
                    child: const Text('Go to Shop'),
                  ),
                ],
              ),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Section 1: Delivery Information
                    _sectionHeader('1. Delivery Information', Icons.location_on_outlined),
                    Card(
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      child: Padding(
                        padding: const EdgeInsets.all(14),
                        child: Column(
                          children: [
                            TextFormField(
                              controller: _nameController,
                              decoration: const InputDecoration(labelText: 'Full Name', prefixIcon: Icon(Icons.person_outline)),
                              validator: (v) => v!.isEmpty ? 'Please enter recipient name' : null,
                            ),
                            const SizedBox(height: 10),
                            TextFormField(
                              controller: _phoneController,
                              keyboardType: TextInputType.phone,
                              decoration: const InputDecoration(labelText: 'Phone Number', prefixIcon: Icon(Icons.phone_outlined)),
                              validator: (v) => v!.isEmpty ? 'Please enter phone' : null,
                            ),
                            const SizedBox(height: 10),
                            TextFormField(
                              controller: _addressController,
                              decoration: const InputDecoration(labelText: 'Street Address', prefixIcon: Icon(Icons.home_outlined)),
                              validator: (v) => v!.isEmpty ? 'Please enter address' : null,
                            ),
                            const SizedBox(height: 10),
                            TextFormField(
                              controller: _cityController,
                              decoration: const InputDecoration(labelText: 'City / Region', prefixIcon: Icon(Icons.location_city_outlined)),
                              validator: (v) => v!.isEmpty ? 'Please enter city' : null,
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Section 2: Delivery Method
                    _sectionHeader('2. Delivery Method', Icons.local_shipping_outlined),
                    Card(
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      child: Column(
                        children: [
                          RadioListTile<String>(
                            title: const Text('Standard Delivery (24-48 hrs)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                            subtitle: const Text('Reliable door-to-door delivery by JDMart dispatch fleet'),
                            value: 'Standard delivery',
                            groupValue: _deliveryMethod,
                            onChanged: (v) => setState(() => _deliveryMethod = v!),
                          ),
                          RadioListTile<String>(
                            title: const Text('Express Delivery (Same-Day / 3 hrs)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                            subtitle: const Text('Priority rider assigned immediately (+Le 10)'),
                            value: 'Express delivery',
                            groupValue: _deliveryMethod,
                            onChanged: (v) => setState(() => _deliveryMethod = v!),
                          ),
                          RadioListTile<String>(
                            title: const Text('Pickup Station (Computer Village Hub)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                            subtitle: const Text('Collect your order directly from the seller hub (FREE)'),
                            value: 'Pickup station',
                            groupValue: _deliveryMethod,
                            onChanged: (v) => setState(() => _deliveryMethod = v!),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Section 3: Payment Method
                    _sectionHeader('3. Payment Options', Icons.payment_outlined),
                    Card(
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      child: Column(
                        children: [
                          RadioListTile<String>(
                            title: const Text('Debit / Credit Card (Mastercard / Visa / Verve)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                            subtitle: const Text('Instant, secured payment gateway with buyer protection'),
                            value: 'Debit / Credit Card',
                            groupValue: _paymentMethod,
                            onChanged: (v) => setState(() => _paymentMethod = v!),
                          ),
                          RadioListTile<String>(
                            title: const Text('Mobile Money (Airtel / Orange / MTN MoMo)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                            subtitle: const Text('Pay seamlessly from your mobile money wallet'),
                            value: 'Mobile Money',
                            groupValue: _paymentMethod,
                            onChanged: (v) => setState(() => _paymentMethod = v!),
                          ),
                          RadioListTile<String>(
                            title: const Text('Direct Bank Transfer', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                            subtitle: const Text('Automated bank confirmation in 60 seconds'),
                            value: 'Bank Transfer',
                            groupValue: _paymentMethod,
                            onChanged: (v) => setState(() => _paymentMethod = v!),
                          ),
                          RadioListTile<String>(
                            title: const Text('Pay on Delivery (Cash or POS upon arrival)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                            subtitle: const Text('Inspect package before finalizing payment with the rider'),
                            value: 'Pay on Delivery',
                            groupValue: _paymentMethod,
                            onChanged: (v) => setState(() => _paymentMethod = v!),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Order Summary Box
                    _sectionHeader('Order Summary', Icons.receipt_long_outlined),
                    Card(
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          children: [
                            ...state.cart.map((item) => Padding(
                                  padding: const EdgeInsets.only(bottom: 8),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text('${item.quantity}x ${item.product.name}', style: const TextStyle(fontSize: 13)),
                                      Text('Le ${item.subtotal.toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                    ],
                                  ),
                                )),
                            const Divider(height: 20),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text('Subtotal', style: TextStyle(color: AppColors.textSecondary)),
                                Text('Le ${state.cartSubtotal.toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.bold)),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text('Delivery Fee', style: TextStyle(color: AppColors.textSecondary)),
                                Text(state.deliveryFee == 0 ? 'FREE' : 'Le ${state.deliveryFee.toStringAsFixed(2)}',
                                    style: TextStyle(fontWeight: FontWeight.bold, color: state.deliveryFee == 0 ? AppColors.success : null)),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text('Platform Service Fee', style: TextStyle(color: AppColors.textSecondary)),
                                Text('Le ${state.serviceFee.toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.bold)),
                              ],
                            ),
                            const Divider(height: 20),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text('Total', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
                                Text('Le ${state.cartTotal.toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 22, color: AppColors.primary)),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Place Order Button
                    SizedBox(
                      width: double.infinity,
                      height: 54,
                      child: ElevatedButton(
                        onPressed: () {
                          if (_formKey.currentState!.validate()) {
                            final order = state.placeOrder(
                              fullName: _nameController.text.trim(),
                              phone: _phoneController.text.trim(),
                              address: _addressController.text.trim(),
                              city: _cityController.text.trim(),
                              deliveryMethod: _deliveryMethod,
                              paymentMethod: _paymentMethod,
                            );

                            Navigator.pushReplacementNamed(context, '/order-success/${order.id}');
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          elevation: 2,
                        ),
                        child: const Text('Place Order', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                      ),
                    ),
                    const SizedBox(height: 30),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _sectionHeader(String title, IconData icon) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 8),
      child: Row(
        children: [
          Icon(icon, size: 20, color: AppColors.primary),
          const SizedBox(width: 8),
          Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
        ],
      ),
    );
  }
}
