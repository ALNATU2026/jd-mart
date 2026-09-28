import 'package:flutter/material.dart';
import '../models/models.dart';

class AppState extends ChangeNotifier {
  static final AppState instance = AppState._internal();
  factory AppState() => instance;
  AppState._internal() {
    _initData();
  }

  // Current authenticated user & role
  UserRole _currentRole = UserRole.buyer;
  UserRole get currentRole => _currentRole;

  UserModel _currentUser = UserModel(
    id: 'user_1',
    name: 'JD Customer',
    email: 'buyer@jdmart.com',
    phone: '+234 812 345 6789',
    role: UserRole.buyer,
    address: 'Block 4, Computer Village, Ikeja, Lagos',
    isVerified: true,
  );
  UserModel get currentUser => _currentUser;

  void setRole(UserRole newRole) {
    _currentRole = newRole;
    switch (newRole) {
      case UserRole.guest:
        _currentUser = UserModel(
          id: 'guest',
          name: 'Guest User',
          email: 'guest@jdmart.com',
          phone: '',
          role: UserRole.guest,
          isVerified: false,
        );
        break;
      case UserRole.buyer:
        _currentUser = UserModel(
          id: 'buyer_1',
          name: 'Sarah Connor',
          email: 'sarah@jdmart.com',
          phone: '+234 802 111 2233',
          role: UserRole.buyer,
          address: '14 Allen Avenue, Ikeja, Lagos',
          isVerified: true,
        );
        break;
      case UserRole.seller:
        _currentUser = UserModel(
          id: 'seller_1',
          name: 'JD SuperStore (Alex)',
          email: 'alex@jdmartstore.com',
          phone: '+234 803 444 5566',
          role: UserRole.seller,
          address: 'Shop 12, Tech Plaza, Ikeja, Lagos',
          isVerified: true,
        );
        break;
      case UserRole.rider:
        _currentUser = UserModel(
          id: 'rider_1',
          name: 'Tunde SpeedRider',
          email: 'tunde@jdmart.com',
          phone: '+234 805 777 8899',
          role: UserRole.rider,
          address: 'Yaba / Ikeja Central, Lagos',
          isVerified: true,
        );
        break;
      case UserRole.jobSeeker:
        _currentUser = UserModel(
          id: 'seeker_1',
          name: 'David Adeyemi',
          email: 'david.dev@jdmart.com',
          phone: '+234 807 888 9900',
          role: UserRole.jobSeeker,
          address: 'Surulere, Lagos',
          isVerified: true,
        );
        break;
      case UserRole.employer:
        _currentUser = UserModel(
          id: 'emp_1',
          name: 'Apex Global Logistics (HR)',
          email: 'hr@apexlogistics.com',
          phone: '+234 809 123 4567',
          role: UserRole.employer,
          address: 'Victoria Island, Lagos',
          isVerified: true,
        );
        break;
      case UserRole.admin:
        _currentUser = UserModel(
          id: 'admin_1',
          name: 'Chief Admin (JDMart)',
          email: 'admin@jdmart.com',
          phone: '+234 800 000 0001',
          role: UserRole.admin,
          address: 'JDMart HQ, Marina, Lagos',
          isVerified: true,
        );
        break;
    }
    notifyListeners();
  }

  void updateUserProfile({String? name, String? phone, String? address, String? email}) {
    _currentUser = _currentUser.copyWith(
      name: name,
      phone: phone,
      address: address,
      email: email,
    );
    notifyListeners();
  }

  // Marketplace Categories
  final List<CategoryModel> _categories = [];
  List<CategoryModel> get categories => List.unmodifiable(_categories);

  // Products
  final List<ProductModel> _products = [];
  List<ProductModel> get products => List.unmodifiable(_products);

  // Cart
  final List<CartItemModel> _cart = [];
  List<CartItemModel> get cart => List.unmodifiable(_cart);

  int get cartCount => _cart.fold(0, (sum, item) => sum + item.quantity);
  double get cartSubtotal => _cart.fold(0.0, (sum, item) => sum + item.subtotal);
  double get deliveryFee => cartSubtotal >= 50.0 || cartSubtotal == 0 ? 0.0 : 5.0;
  double get serviceFee => cartSubtotal > 0 ? 2.0 : 0.0;
  double get cartTotal => cartSubtotal + deliveryFee + serviceFee;

  // Wishlist product IDs
  final Set<String> _wishlist = {};
  Set<String> get wishlist => _wishlist;

  bool isWishlisted(String productId) => _wishlist.contains(productId);

  void toggleWishlist(String productId) {
    if (_wishlist.contains(productId)) {
      _wishlist.remove(productId);
    } else {
      _wishlist.add(productId);
    }
    notifyListeners();
  }

  void addToCart(ProductModel product, [int quantity = 1]) {
    final existingIndex = _cart.indexWhere((item) => item.product.id == product.id);
    if (existingIndex >= 0) {
      _cart[existingIndex].quantity += quantity;
    } else {
      _cart.add(CartItemModel(product: product, quantity: quantity));
    }
    notifyListeners();
  }

  void removeFromCart(String productId) {
    _cart.removeWhere((item) => item.product.id == productId);
    notifyListeners();
  }

  void updateCartQuantity(String productId, int quantity) {
    final index = _cart.indexWhere((item) => item.product.id == productId);
    if (index >= 0) {
      if (quantity <= 0) {
        _cart.removeAt(index);
      } else {
        _cart[index].quantity = quantity;
      }
      notifyListeners();
    }
  }

  void clearCart() {
    _cart.clear();
    notifyListeners();
  }

  // Orders
  final List<OrderModel> _orders = [];
  List<OrderModel> get orders => List.unmodifiable(_orders);

  List<OrderModel> get buyerOrders =>
      _orders.where((o) => o.buyerId == _currentUser.id || _currentRole == UserRole.admin).toList();

  List<OrderModel> get sellerOrders =>
      _orders.where((o) => o.sellerId == 'seller_1' || _currentRole == UserRole.admin).toList();

  OrderModel? getOrderById(String id) {
    try {
      return _orders.firstWhere((o) => o.id == id);
    } catch (_) {
      return null;
    }
  }

  OrderModel placeOrder({
    required String fullName,
    required String phone,
    required String address,
    required String city,
    required String deliveryMethod,
    required String paymentMethod,
  }) {
    final orderId = 'ORD-${1000 + _orders.length + 1}';
    final items = _cart
        .map((c) => OrderItemModel(
              productId: c.product.id,
              productName: c.product.name,
              productImage: c.product.images.isNotEmpty ? c.product.images.first : '',
              price: c.product.price,
              quantity: c.quantity,
              sellerId: c.product.sellerId,
              sellerName: c.product.sellerName,
            ))
        .toList();

    final newOrder = OrderModel(
      id: orderId,
      buyerId: _currentUser.id,
      buyerName: fullName,
      buyerPhone: phone,
      buyerAddress: address,
      city: city,
      deliveryMethod: deliveryMethod,
      items: items,
      subtotal: cartSubtotal,
      deliveryFee: deliveryFee,
      serviceFee: serviceFee,
      total: cartTotal,
      status: 'Processing',
      paymentStatus: 'Paid',
      paymentMethod: paymentMethod,
      sellerId: items.isNotEmpty ? items.first.sellerId : 'seller_1',
      sellerName: items.isNotEmpty ? items.first.sellerName : 'JD SuperStore',
      createdAt: 'Today, Just now',
      estimatedDelivery: 'Tomorrow by 4:00 PM',
      timeline: [
        'Order Placed - Today, Just now',
        'Payment Verified - Today, Just now',
        'Processing at Warehouse - Today, Just now',
      ],
    );

    _orders.insert(0, newOrder);

    // Also register as an available delivery for riders
    _deliveries.insert(
      0,
      RiderDeliveryModel(
        id: 'DEL-${2000 + _deliveries.length + 1}',
        orderId: newOrder.id,
        sellerId: newOrder.sellerId,
        sellerName: newOrder.sellerName,
        pickupLocation: 'Computer Village, Ikeja',
        buyerId: newOrder.buyerId,
        buyerName: newOrder.buyerName,
        buyerPhone: newOrder.buyerPhone,
        deliveryLocation: '${newOrder.buyerAddress}, ${newOrder.city}',
        distance: '4.2 km',
        deliveryFee: 15.0,
        status: 'Available',
        orderSummary: '${newOrder.items.length} item(s) - Le ${newOrder.total.toStringAsFixed(0)}',
        createdAt: 'Just now',
      ),
    );

    // Add payment transaction
    _payments.insert(
      0,
      PaymentTransactionModel(
        id: 'TXN-${3000 + _payments.length + 1}',
        transactionId: 'TXN_REF_${DateTime.now().millisecondsSinceEpoch}',
        userName: fullName,
        orderId: newOrder.id,
        amount: newOrder.total,
        status: 'Successful',
        date: 'Today',
        paymentMethod: paymentMethod,
      ),
    );

    // Clear cart after checkout
    _cart.clear();

    addNotification(
      title: 'Order Confirmed ($orderId)',
      description: 'Your order of Le ${newOrder.total.toStringAsFixed(0)} has been placed and is being prepared.',
      icon: Icons.check_circle_outline,
      iconColor: const Color(0xFF16A34A),
    );

    notifyListeners();
    return newOrder;
  }

  void updateOrderStatus(String orderId, String newStatus) {
    final index = _orders.indexWhere((o) => o.id == orderId);
    if (index >= 0) {
      _orders[index].status = newStatus;
      _orders[index].timeline.add('$newStatus - Today, Just now');

      addNotification(
        title: 'Order $orderId Updated',
        description: 'Status changed to $newStatus.',
        icon: Icons.local_shipping_outlined,
        iconColor: const Color(0xFF1E40AF),
      );

      notifyListeners();
    }
  }

  // Stores
  final List<StoreModel> _stores = [];
  List<StoreModel> get stores => List.unmodifiable(_stores);

  StoreModel? get myStore {
    try {
      return _stores.firstWhere((s) => s.sellerId == 'seller_1');
    } catch (_) {
      return null;
    }
  }

  void updateStore(StoreModel updated) {
    final index = _stores.indexWhere((s) => s.id == updated.id);
    if (index >= 0) {
      _stores[index] = updated;
      notifyListeners();
    }
  }

  // Products Management
  void addProduct(ProductModel product) {
    _products.insert(0, product);
    addAuditLog('Added product: ${product.name}', 'Product Catalog', '', product.name);
    notifyListeners();
  }

  void updateProduct(ProductModel product) {
    final index = _products.indexWhere((p) => p.id == product.id);
    if (index >= 0) {
      final prevName = _products[index].name;
      _products[index] = product;
      addAuditLog('Updated product: ${product.name}', 'Product Catalog', prevName, product.name);
      notifyListeners();
    }
  }

  void deleteProduct(String id) {
    final prod = _products.firstWhere((p) => p.id == id, orElse: () => _products.first);
    _products.removeWhere((p) => p.id == id);
    addAuditLog('Deleted product: ${prod.name}', 'Product Catalog', prod.name, 'Removed');
    notifyListeners();
  }

  void toggleProductActive(String id) {
    final index = _products.indexWhere((p) => p.id == id);
    if (index >= 0) {
      final current = _products[index];
      _products[index] = current.copyWith(isActive: !current.isActive);
      notifyListeners();
    }
  }

  // Categories Management
  void addCategory(CategoryModel category) {
    _categories.add(category);
    addAuditLog('Added category: ${category.name}', 'Category Catalog', '', category.name);
    notifyListeners();
  }

  void deleteCategory(String id) {
    _categories.removeWhere((c) => c.id == id);
    notifyListeners();
  }

  // Deliveries (Rider)
  final List<RiderDeliveryModel> _deliveries = [];
  List<RiderDeliveryModel> get deliveries => List.unmodifiable(_deliveries);

  bool _isRiderOnline = true;
  bool get isRiderOnline => _isRiderOnline;

  void toggleRiderOnline() {
    _isRiderOnline = !_isRiderOnline;
    notifyListeners();
  }

  void acceptDelivery(String deliveryId) {
    final index = _deliveries.indexWhere((d) => d.id == deliveryId);
    if (index >= 0) {
      _deliveries[index].status = 'Accepted';
      _deliveries[index].riderId = _currentUser.id;
      _deliveries[index].riderName = _currentUser.name;

      // Update linked order
      final orderIndex = _orders.indexWhere((o) => o.id == _deliveries[index].orderId);
      if (orderIndex >= 0) {
        _orders[orderIndex].status = 'Out for Delivery';
        _orders[orderIndex].riderId = _currentUser.id;
        _orders[orderIndex].riderName = _currentUser.name;
        _orders[orderIndex].timeline.add('Assigned to Rider (${_currentUser.name}) - Just now');
      }

      addNotification(
        title: 'Delivery Accepted',
        description: 'You accepted delivery for ${_deliveries[index].orderId}.',
        icon: Icons.two_wheeler_rounded,
        iconColor: const Color(0xFF1E40AF),
      );

      notifyListeners();
    }
  }

  void updateDeliveryStatus(String deliveryId, String newStatus) {
    final index = _deliveries.indexWhere((d) => d.id == deliveryId);
    if (index >= 0) {
      _deliveries[index].status = newStatus;

      final orderIndex = _orders.indexWhere((o) => o.id == _deliveries[index].orderId);
      if (orderIndex >= 0) {
        if (newStatus == 'Delivered') {
          _orders[orderIndex].status = 'Delivered';
          _orders[orderIndex].timeline.add('Delivered successfully - Just now');
        } else if (newStatus == 'PickedUp') {
          _orders[orderIndex].timeline.add('Package picked up by rider - Just now');
        }
      }

      notifyListeners();
    }
  }

  // Job Marketplace
  final List<JobModel> _jobs = [];
  List<JobModel> get jobs => List.unmodifiable(_jobs);

  final List<JobApplicationModel> _jobApplications = [];
  List<JobApplicationModel> get jobApplications => List.unmodifiable(_jobApplications);

  void postJob(JobModel job) {
    _jobs.insert(0, job);
    addAuditLog('Posted Job: ${job.title}', 'Job Board', '', job.title);
    notifyListeners();
  }

  void updateJobStatus(String jobId, String status) {
    final index = _jobs.indexWhere((j) => j.id == jobId);
    if (index >= 0) {
      _jobs[index].status = status;
      notifyListeners();
    }
  }

  void applyForJob({
    required JobModel job,
    required String fullName,
    required String email,
    required String phone,
    required String coverLetter,
  }) {
    final application = JobApplicationModel(
      id: 'APP-${5000 + _jobApplications.length + 1}',
      jobId: job.id,
      jobTitle: job.title,
      employerId: job.employerId,
      companyName: job.companyName,
      applicantId: _currentUser.id,
      applicantName: fullName,
      applicantEmail: email,
      applicantPhone: phone,
      coverLetter: coverLetter,
      status: 'Applied',
      appliedDate: 'Today',
    );

    _jobApplications.insert(0, application);

    final jobIndex = _jobs.indexWhere((j) => j.id == job.id);
    if (jobIndex >= 0) {
      _jobs[jobIndex].applicantsCount += 1;
    }

    addNotification(
      title: 'Application Submitted',
      description: 'Your application for "${job.title}" at ${job.companyName} was sent.',
      icon: Icons.work_outline_rounded,
      iconColor: const Color(0xFF16A34A),
    );

    notifyListeners();
  }

  void updateApplicationStatus(String appId, String status, {String? interviewDate, String? note}) {
    final index = _jobApplications.indexWhere((a) => a.id == appId);
    if (index >= 0) {
      _jobApplications[index].status = status;
      if (interviewDate != null) _jobApplications[index].interviewDate = interviewDate;
      if (note != null) _jobApplications[index].interviewNote = note;

      addNotification(
        title: 'Application Status: $status',
        description: 'Application for ${_jobApplications[index].jobTitle} updated to $status.',
        icon: Icons.assignment_turned_in_outlined,
        iconColor: const Color(0xFF1E40AF),
      );

      notifyListeners();
    }
  }

  // Worker Profiles (Find Workers feature)
  final List<WorkerProfileModel> _workers = [];
  List<WorkerProfileModel> get workers => List.unmodifiable(_workers);

  void toggleSaveWorker(String workerId) {
    final index = _workers.indexWhere((w) => w.id == workerId);
    if (index >= 0) {
      _workers[index].isSaved = !_workers[index].isSaved;
      notifyListeners();
    }
  }

  // Messaging (Multi-role Chats)
  final List<ConversationModel> _conversations = [];
  List<ConversationModel> get conversations => List.unmodifiable(_conversations);

  void sendMessage(String conversationId, String text) {
    final index = _conversations.indexWhere((c) => c.id == conversationId);
    if (index >= 0) {
      final msg = ChatMessageModel(
        id: 'msg_${DateTime.now().millisecondsSinceEpoch}',
        senderId: _currentUser.id,
        senderName: _currentUser.name,
        message: text,
        timestamp: 'Just now',
        isMe: true,
      );
      _conversations[index].messages.add(msg);
      _conversations[index] = ConversationModel(
        id: _conversations[index].id,
        otherUserName: _conversations[index].otherUserName,
        otherUserRole: _conversations[index].otherUserRole,
        otherUserAvatar: _conversations[index].otherUserAvatar,
        lastMessage: text,
        lastMessageTime: 'Just now',
        unreadCount: 0,
        messages: _conversations[index].messages,
      );
      notifyListeners();
    }
  }

  // Notifications
  final List<NotificationItemModel> _notifications = [];
  List<NotificationItemModel> get notifications => List.unmodifiable(_notifications);

  int get unreadNotificationsCount => _notifications.where((n) => !n.isRead).length;

  void addNotification({
    required String title,
    required String description,
    IconData icon = Icons.notifications,
    Color iconColor = const Color(0xFF1E40AF),
  }) {
    _notifications.insert(
      0,
      NotificationItemModel(
        id: 'notif_${DateTime.now().millisecondsSinceEpoch}',
        title: title,
        description: description,
        time: 'Just now',
        icon: icon,
        iconColor: iconColor,
        isRead: false,
      ),
    );
    notifyListeners();
  }

  void markNotificationRead(String id) {
    final index = _notifications.indexWhere((n) => n.id == id);
    if (index >= 0) {
      _notifications[index].isRead = true;
      notifyListeners();
    }
  }

  void markAllNotificationsRead() {
    for (var n in _notifications) {
      n.isRead = true;
    }
    notifyListeners();
  }

  // Users List (Admin)
  final List<UserModel> _users = [];
  List<UserModel> get users => List.unmodifiable(_users);

  void toggleUserStatus(String userId) {
    final index = _users.indexWhere((u) => u.id == userId);
    if (index >= 0) {
      final current = _users[index];
      final newStatus = current.status == 'Active' ? 'Suspended' : 'Active';
      _users[index] = current.copyWith(status: newStatus);
      addAuditLog('User status modified', 'User Management', current.status, newStatus);
      notifyListeners();
    }
  }

  void updateUserRole(String userId, UserRole newRole) {
    final index = _users.indexWhere((u) => u.id == userId);
    if (index >= 0) {
      _users[index] = _users[index].copyWith(role: newRole);
      addAuditLog('User role modified', 'User Management', _users[index].role.name, newRole.name);
      notifyListeners();
    }
  }

  // Payments List (Admin)
  final List<PaymentTransactionModel> _payments = [];
  List<PaymentTransactionModel> get payments => List.unmodifiable(_payments);

  // Reviews List
  final List<ReviewItemModel> _reviews = [];
  List<ReviewItemModel> get reviews => List.unmodifiable(_reviews);

  // Reports (Admin)
  final List<ReportItemModel> _reports = [];
  List<ReportItemModel> get reports => List.unmodifiable(_reports);

  void resolveReport(String reportId, String status) {
    final index = _reports.indexWhere((r) => r.id == reportId);
    if (index >= 0) {
      _reports[index].status = status;
      addAuditLog('Resolved report', 'Safety & Trust', 'Pending', status);
      notifyListeners();
    }
  }

  // Audit Logs (Admin)
  final List<AuditLogModel> _auditLogs = [];
  List<AuditLogModel> get auditLogs => List.unmodifiable(_auditLogs);

  void addAuditLog(String action, String target, String previousValue, String newValue) {
    _auditLogs.insert(
      0,
      AuditLogModel(
        id: 'log_${DateTime.now().millisecondsSinceEpoch}',
        adminName: _currentUser.name,
        action: action,
        target: target,
        date: 'Today, Just now',
        previousValue: previousValue,
        newValue: newValue,
      ),
    );
  }

  // Initialize rich sample data
  void _initData() {
    // Categories
    _categories.addAll([
      CategoryModel(id: '1', name: 'Electronics', slug: 'electronics', icon: 'assets/icons/electronics.png', count: 184, color: const Color(0xFFEAF1FF)),
      CategoryModel(id: '2', name: 'Phones & Tablets', slug: 'phones', icon: 'assets/icons/electronics.png', count: 96, color: const Color(0xFFEFF6FF)),
      CategoryModel(id: '3', name: 'Computers', slug: 'computers', icon: 'assets/icons/electronics.png', count: 62, color: const Color(0xFFF3F0FF)),
      CategoryModel(id: '4', name: 'Fashion & Shoes', slug: 'fashion', icon: 'assets/icons/fashion.png', count: 240, color: const Color(0xFFFFF2E8)),
      CategoryModel(id: '5', name: 'Beauty & Health', slug: 'beauty', icon: 'assets/icons/beauty.png', count: 115, color: const Color(0xFFF3E8FF)),
      CategoryModel(id: '6', name: 'Home & Kitchen', slug: 'home', icon: 'assets/icons/sofa.png', count: 140, color: const Color(0xFFE9FFF3)),
      CategoryModel(id: '7', name: 'Furniture', slug: 'furniture', icon: 'assets/icons/sofa.png', count: 48, color: const Color(0xFFECFDF5)),
      CategoryModel(id: '8', name: 'Sports & Outdoors', slug: 'sports', icon: 'assets/icons/sports.png', count: 77, color: const Color(0xFFF0FDF4)),
      CategoryModel(id: '9', name: 'Food & Groceries', slug: 'food', icon: 'assets/icons/categories.png', count: 130, color: const Color(0xFFFFFBEB)),
      CategoryModel(id: '10', name: 'Automotive', slug: 'automotive', icon: 'assets/icons/delivery.png', count: 35, color: const Color(0xFFF8FAFC)),
      CategoryModel(id: '11', name: 'Agriculture', slug: 'agriculture', icon: 'assets/icons/categories.png', count: 52, color: const Color(0xFFF0FDF4)),
      CategoryModel(id: '12', name: 'Services', slug: 'services', icon: 'assets/icons/support.png', count: 88, color: const Color(0xFFEAF1FF)),
      CategoryModel(id: '13', name: 'More Categories', slug: 'other', icon: 'assets/icons/more.png', count: 210, color: const Color(0xFFF3F5F9)),
    ]);

    // Products
    _products.addAll([
      ProductModel(
        id: 'prod_1',
        name: 'Smart Watch Series 8',
        slug: 'smart-watch-series-8',
        description: 'Premium fitness tracking smartwatch with heart rate monitoring, OLED retina display, Bluetooth calls, GPS navigation, and 7-day battery life.',
        price: 45.0,
        oldPrice: 75.0,
        discount: '-40%',
        stock: 24,
        images: ['assets/images/smartwatch.jpg', 'assets/images/Smartwatch.jpg'],
        category: 'Electronics',
        sellerId: 'seller_1',
        sellerName: 'JD SuperStore',
        sellerLocation: 'Computer Village, Ikeja',
        sellerRating: 4.9,
        rating: 4.8,
        reviewsCount: 1248,
        timer: '02:45:30',
      ),
      ProductModel(
        id: 'prod_2',
        name: "Men's Sneakers Pro Runner",
        slug: 'mens-sneakers-pro-runner',
        description: 'Lightweight, ultra-breathable athletic running shoes built with shock-absorbing foam midsoles and high-grip rubber outsoles for casual and workout performance.',
        price: 21.0,
        oldPrice: 30.0,
        discount: '-30%',
        stock: 45,
        images: ['assets/images/sneaker.jpg'],
        category: 'Fashion',
        sellerId: 'seller_1',
        sellerName: 'Urban Kicks Ltd',
        sellerLocation: 'Yaba, Lagos',
        sellerRating: 4.7,
        rating: 4.7,
        reviewsCount: 890,
        timer: '01:20:15',
      ),
      ProductModel(
        id: 'prod_3',
        name: 'Wireless Noise Cancelling Headphone',
        slug: 'wireless-headphone-nc',
        description: 'High-definition stereo over-ear headphones with active noise cancellation, built-in mic, up to 40 hours of playtime, and memory-foam ear cushions.',
        price: 18.75,
        oldPrice: 25.0,
        discount: '-25%',
        stock: 32,
        images: ['assets/images/headphone.jpg'],
        category: 'Electronics',
        sellerId: 'seller_1',
        sellerName: 'Sonic Audio Hub',
        sellerLocation: 'Ikeja, Lagos',
        sellerRating: 4.8,
        rating: 4.9,
        reviewsCount: 2150,
        timer: '03:10:05',
      ),
      ProductModel(
        id: 'prod_4',
        name: 'Luxury Designer Handbag',
        slug: 'luxury-designer-handbag',
        description: 'Handcrafted premium leather shoulder bag featuring multi-compartment interior, golden metallic hardware, adjustable strap, and weather-resistant finish.',
        price: 32.0,
        oldPrice: 50.0,
        discount: '-35%',
        stock: 12,
        images: ['assets/images/handbag.jpg'],
        category: 'Fashion',
        sellerId: 'seller_2',
        sellerName: 'Belle Couture',
        sellerLocation: 'Victoria Island, Lagos',
        sellerRating: 4.6,
        rating: 4.6,
        reviewsCount: 640,
        timer: '02:00:40',
      ),
      ProductModel(
        id: 'prod_5',
        name: 'Ergonomic Executive Office Chair',
        slug: 'ergonomic-office-chair',
        description: 'High-back mesh desk chair with adjustable lumbar support, 3D armrests, tilt mechanism, and heavy-duty chrome base for long hours of comfortable work.',
        price: 85.0,
        oldPrice: 120.0,
        discount: '-29%',
        stock: 15,
        images: ['assets/images/storefront.png'],
        category: 'Furniture',
        sellerId: 'seller_1',
        sellerName: 'Modern Living Spaces',
        sellerLocation: 'Lekki Phase 1, Lagos',
        sellerRating: 4.9,
        rating: 4.8,
        reviewsCount: 310,
        timer: '05:15:20',
      ),
      ProductModel(
        id: 'prod_6',
        name: 'Organic Glow Skincare Set',
        slug: 'organic-glow-skincare',
        description: 'Complete 4-piece beauty routine with facial cleanser, vitamin C brightening serum, hydrating moisturizer, and SPF 50 sunscreen.',
        price: 28.50,
        oldPrice: 40.0,
        discount: '-28%',
        stock: 50,
        images: ['assets/images/illustration.png'],
        category: 'Beauty',
        sellerId: 'seller_2',
        sellerName: 'Glow Wellness Co.',
        sellerLocation: 'Ikeja, Lagos',
        sellerRating: 4.9,
        rating: 4.9,
        reviewsCount: 780,
        timer: '04:45:00',
      ),
    ]);

    // Initial Cart items (matching initial state)
    _cart.addAll([
      CartItemModel(product: _products[0], quantity: 1),
      CartItemModel(product: _products[1], quantity: 1),
    ]);

    // Initial Wishlist
    _wishlist.add('prod_1');

    // Stores
    _stores.addAll([
      StoreModel(
        id: 'store_1',
        sellerId: 'seller_1',
        name: 'JD SuperStore',
        slug: 'jd-superstore',
        description: 'Your premier tech and lifestyle gadget destination with guaranteed manufacturer warranty and instant dispatch.',
        logo: 'assets/icons/store.png',
        location: 'Computer Village, Ikeja, Lagos',
        phone: '+234 801 234 5678',
        email: 'sales@jdsuperstore.com',
        rating: 4.9,
        totalSales: 128500.0,
        productsCount: 24,
      ),
      StoreModel(
        id: 'store_2',
        sellerId: 'seller_2',
        name: 'Belle Couture & Style',
        slug: 'belle-couture',
        description: 'Authentic imported designer apparel, accessories, and shoes for modern trendsetters.',
        logo: 'assets/icons/fashion.png',
        location: 'Victoria Island, Lagos',
        phone: '+234 802 987 6543',
        email: 'info@bellecouture.com',
        rating: 4.7,
        totalSales: 89400.0,
        productsCount: 16,
      ),
    ]);

    // Orders
    _orders.addAll([
      OrderModel(
        id: 'ORD-1001',
        buyerId: 'buyer_1',
        buyerName: 'Sarah Connor',
        buyerPhone: '+234 802 111 2233',
        buyerAddress: '14 Allen Avenue',
        city: 'Ikeja, Lagos',
        items: [
          OrderItemModel(
            productId: 'prod_1',
            productName: 'Smart Watch Series 8',
            productImage: 'assets/images/smartwatch.jpg',
            price: 45.0,
            quantity: 1,
            sellerId: 'seller_1',
            sellerName: 'JD SuperStore',
          ),
          OrderItemModel(
            productId: 'prod_2',
            productName: "Men's Sneakers",
            productImage: 'assets/images/sneaker.jpg',
            price: 21.0,
            quantity: 1,
            sellerId: 'seller_1',
            sellerName: 'JD SuperStore',
          ),
        ],
        subtotal: 66.0,
        deliveryFee: 0.0,
        serviceFee: 2.0,
        total: 68.0,
        status: 'Out for Delivery',
        paymentStatus: 'Paid',
        paymentMethod: 'Credit Card',
        sellerId: 'seller_1',
        sellerName: 'JD SuperStore',
        riderId: 'rider_1',
        riderName: 'Tunde SpeedRider',
        createdAt: 'Yesterday, 2:30 PM',
        timeline: [
          'Order Placed - Yesterday, 2:30 PM',
          'Confirmed by Seller - Yesterday, 3:00 PM',
          'Package Picked Up by Tunde - Today, 10:15 AM',
          'Out for Delivery - Today, 11:30 AM',
        ],
      ),
      OrderModel(
        id: 'ORD-1002',
        buyerId: 'buyer_1',
        buyerName: 'Sarah Connor',
        buyerPhone: '+234 802 111 2233',
        buyerAddress: '14 Allen Avenue',
        city: 'Ikeja, Lagos',
        items: [
          OrderItemModel(
            productId: 'prod_3',
            productName: 'Wireless Noise Cancelling Headphone',
            productImage: 'assets/images/headphone.jpg',
            price: 18.75,
            quantity: 2,
            sellerId: 'seller_1',
            sellerName: 'JD SuperStore',
          ),
        ],
        subtotal: 37.5,
        deliveryFee: 5.0,
        serviceFee: 2.0,
        total: 44.5,
        status: 'Delivered',
        paymentStatus: 'Paid',
        paymentMethod: 'Online Bank Transfer',
        sellerId: 'seller_1',
        sellerName: 'JD SuperStore',
        riderId: 'rider_1',
        riderName: 'Tunde SpeedRider',
        createdAt: '3 days ago',
        timeline: [
          'Order Placed - 3 days ago',
          'Processed - 3 days ago',
          'Delivered to Ikeja - 2 days ago',
        ],
      ),
    ]);

    // Rider Deliveries
    _deliveries.addAll([
      RiderDeliveryModel(
        id: 'DEL-2001',
        orderId: 'ORD-1001',
        sellerId: 'seller_1',
        sellerName: 'JD SuperStore',
        pickupLocation: 'Tech Plaza, Computer Village, Ikeja',
        buyerId: 'buyer_1',
        buyerName: 'Sarah Connor',
        buyerPhone: '+234 802 111 2233',
        deliveryLocation: '14 Allen Avenue, Ikeja, Lagos',
        distance: '2.8 km',
        deliveryFee: 14.50,
        status: 'InTransit',
        riderId: 'rider_1',
        riderName: 'Tunde SpeedRider',
        orderSummary: '2 items (Watch & Sneakers)',
        createdAt: 'Today, 10:00 AM',
      ),
      RiderDeliveryModel(
        id: 'DEL-2002',
        orderId: 'ORD-1003',
        sellerId: 'seller_2',
        sellerName: 'Belle Couture',
        pickupLocation: 'Victoria Island Plaza',
        buyerId: 'buyer_2',
        buyerName: 'Emeka Nwosu',
        buyerPhone: '+234 803 222 9988',
        deliveryLocation: 'Lekki Phase 1, Lagos',
        distance: '5.1 km',
        deliveryFee: 22.00,
        status: 'Available',
        orderSummary: '1 Designer Handbag',
        createdAt: '15 mins ago',
      ),
      RiderDeliveryModel(
        id: 'DEL-2003',
        orderId: 'ORD-1004',
        sellerId: 'seller_1',
        sellerName: 'JD SuperStore',
        pickupLocation: 'Computer Village, Ikeja',
        buyerId: 'buyer_3',
        buyerName: 'Fatima Bello',
        buyerPhone: '+234 809 333 4455',
        deliveryLocation: 'Maryland Mall, Lagos',
        distance: '3.6 km',
        deliveryFee: 16.00,
        status: 'Available',
        orderSummary: '3 Wireless Headphones',
        createdAt: '40 mins ago',
      ),
    ]);

    // Jobs
    _jobs.addAll([
      JobModel(
        id: 'job_1',
        title: 'Full Stack Flutter & Web Developer',
        employerId: 'emp_1',
        companyName: 'Apex Global Logistics',
        category: 'Technology & IT',
        description: 'We are seeking an experienced Flutter and Web Engineer to scale our cross-platform dispatch and inventory marketplace applications.',
        requirements: 'Proven experience building responsive Flutter apps, REST/GraphQL APIs, state management, and real-time WebSocket communication.',
        skills: ['Flutter', 'Dart', 'React', 'REST APIs', 'Git'],
        location: 'Ikeja, Lagos (Hybrid)',
        salary: 'Le 2,500 - 3,800 / month',
        employmentType: 'Full-time',
        experience: '2-4 years',
        deadline: '2026-10-25',
        datePosted: '1 day ago',
        applicantsCount: 12,
        isFeatured: true,
      ),
      JobModel(
        id: 'job_2',
        title: 'Senior Dispatch & Logistics Operations Manager',
        employerId: 'emp_1',
        companyName: 'Apex Global Logistics',
        category: 'Logistics & Supply Chain',
        description: 'Oversee fleet coordination, rider route optimization, delivery SLAs, and regional warehouse dispatch hubs.',
        requirements: 'Demonstrated experience managing dispatch fleet operations, driver onboarding, and CRM logistics tools.',
        skills: ['Fleet Management', 'Operations', 'Dispatch Routing', 'Customer Support'],
        location: 'Victoria Island, Lagos',
        salary: 'Le 1,800 - 2,500 / month',
        employmentType: 'Full-time',
        experience: '3+ years',
        deadline: '2026-11-05',
        datePosted: '3 days ago',
        applicantsCount: 8,
      ),
      JobModel(
        id: 'job_3',
        title: 'Digital Marketing & Merchant Growth Lead',
        employerId: 'emp_2',
        companyName: 'JDMart Merchant Services',
        category: 'Marketing & Sales',
        description: 'Drive seller acquisition campaigns, flash sales promotions, SEO marketing, and buyer engagement across West Africa.',
        requirements: 'Strong track record in e-commerce performance marketing, social ad optimization, and email funnels.',
        skills: ['SEO', 'Google Ads', 'Content Strategy', 'Social Media', 'Analytics'],
        location: 'Remote / Lagos',
        salary: 'Le 1,500 - 2,200 / month',
        employmentType: 'Contract',
        experience: '2+ years',
        deadline: '2026-10-31',
        datePosted: '5 days ago',
        applicantsCount: 15,
      ),
    ]);

    // Job Applications
    _jobApplications.addAll([
      JobApplicationModel(
        id: 'APP-5001',
        jobId: 'job_1',
        jobTitle: 'Full Stack Flutter & Web Developer',
        employerId: 'emp_1',
        companyName: 'Apex Global Logistics',
        applicantId: 'seeker_1',
        applicantName: 'David Adeyemi',
        applicantEmail: 'david.dev@jdmart.com',
        applicantPhone: '+234 807 888 9900',
        coverLetter: 'I am excited to apply for this role. I have built 8+ production Flutter and React web platforms with real-time tracking.',
        status: 'Shortlisted',
        appliedDate: 'Yesterday',
        interviewDate: 'Oct 3, 2026 at 2:00 PM',
        interviewNote: 'Technical interview via Google Meet with the Lead Architect.',
      ),
    ]);

    // Worker Profiles (Employer Find Workers)
    _workers.addAll([
      WorkerProfileModel(
        id: 'worker_1',
        userId: 'seeker_1',
        fullName: 'David Adeyemi',
        professionalTitle: 'Senior Full Stack & Mobile Engineer',
        location: 'Lagos, Nigeria (Open to Remote)',
        bio: 'Passionate software craftsman specializing in Flutter, React, microservices, and mobile-first marketplaces. 5 years building scalable web systems.',
        skills: ['Flutter', 'Dart', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind'],
        experience: '5 years',
        education: 'B.Sc Computer Science, University of Lagos',
        expectedSalary: 'Le 3,000 / month',
        rating: 4.9,
      ),
      WorkerProfileModel(
        id: 'worker_2',
        userId: 'seeker_2',
        fullName: 'Chinwe Okonkwo',
        professionalTitle: 'E-commerce UI/UX Designer & Brand Strategist',
        location: 'Abuja, Nigeria',
        bio: 'Creating human-centered product designs, wireframes, design systems, and conversion-optimized checkout flows.',
        skills: ['Figma', 'UI/UX Design', 'Design Systems', 'User Research', 'Prototyping'],
        experience: '4 years',
        education: 'B.A Creative Arts',
        expectedSalary: 'Le 2,200 / month',
        rating: 4.8,
      ),
      WorkerProfileModel(
        id: 'worker_3',
        userId: 'seeker_3',
        fullName: 'Ibrahim Kamara',
        professionalTitle: 'Warehouse & Dispatch Logistics Supervisor',
        location: 'Freetown & Lagos',
        bio: 'Expert in last-mile delivery dispatching, barcode inventory management, delivery rider onboarding, and dispute resolution.',
        skills: ['Logistics', 'Inventory Control', 'Driver Management', 'ERP Software'],
        experience: '6 years',
        education: 'Diploma in Supply Chain Management',
        expectedSalary: 'Le 1,600 / month',
        rating: 4.7,
      ),
    ]);

    // Conversations
    _conversations.addAll([
      ConversationModel(
        id: 'conv_1',
        otherUserName: 'JD SuperStore (Alex)',
        otherUserRole: 'Seller',
        lastMessage: 'Your Smart Watch Series 8 is packed and rider is arriving!',
        lastMessageTime: '11:15 AM',
        unreadCount: 1,
        messages: [
          ChatMessageModel(id: 'm1', senderId: 'seller_1', senderName: 'JD SuperStore', message: 'Hello! Thanks for your order.', timestamp: '10:00 AM', isMe: false),
          ChatMessageModel(id: 'm2', senderId: 'buyer_1', senderName: 'Sarah', message: 'Hi! When will the delivery arrive in Ikeja?', timestamp: '10:30 AM', isMe: true),
          ChatMessageModel(id: 'm3', senderId: 'seller_1', senderName: 'JD SuperStore', message: 'Your Smart Watch Series 8 is packed and rider is arriving!', timestamp: '11:15 AM', isMe: false),
        ],
      ),
      ConversationModel(
        id: 'conv_2',
        otherUserName: 'Tunde SpeedRider',
        otherUserRole: 'Rider',
        lastMessage: 'I am 5 minutes away from Allen Avenue gate.',
        lastMessageTime: '11:45 AM',
        unreadCount: 1,
        messages: [
          ChatMessageModel(id: 'r1', senderId: 'rider_1', senderName: 'Tunde', message: 'Hello, this is Tunde your JD Mart rider.', timestamp: '11:32 AM', isMe: false),
          ChatMessageModel(id: 'r2', senderId: 'buyer_1', senderName: 'Sarah', message: 'Great, please call when outside.', timestamp: '11:35 AM', isMe: true),
          ChatMessageModel(id: 'r3', senderId: 'rider_1', senderName: 'Tunde', message: 'I am 5 minutes away from Allen Avenue gate.', timestamp: '11:45 AM', isMe: false),
        ],
      ),
      ConversationModel(
        id: 'conv_3',
        otherUserName: 'Apex Global HR',
        otherUserRole: 'Employer',
        lastMessage: 'We have shortlisted your CV for the Flutter role.',
        lastMessageTime: 'Yesterday',
        unreadCount: 0,
        messages: [
          ChatMessageModel(id: 'h1', senderId: 'emp_1', senderName: 'Apex HR', message: 'Dear David, thanks for applying to Apex Global.', timestamp: 'Yesterday', isMe: false),
          ChatMessageModel(id: 'h2', senderId: 'emp_1', senderName: 'Apex HR', message: 'We have shortlisted your CV for the Flutter role.', timestamp: 'Yesterday', isMe: false),
        ],
      ),
    ]);

    // Notifications
    _notifications.addAll([
      NotificationItemModel(
        id: 'n1',
        title: 'Flash Sale Live Now!',
        description: 'Up to 50% discount on electronics and sneakers across the marketplace.',
        time: '10 mins ago',
        icon: Icons.bolt_rounded,
        iconColor: const Color(0xFFF97316),
      ),
      NotificationItemModel(
        id: 'n2',
        title: 'Order ORD-1001 Out for Delivery',
        description: 'Rider Tunde is en route with your items to Allen Avenue, Ikeja.',
        time: '1 hour ago',
        icon: Icons.local_shipping_rounded,
        iconColor: const Color(0xFF1E40AF),
      ),
      NotificationItemModel(
        id: 'n3',
        title: 'Merchant Verification Approved',
        description: 'Your store profile is verified with top seller privileges.',
        time: 'Yesterday',
        icon: Icons.verified_user_rounded,
        iconColor: const Color(0xFF16A34A),
      ),
    ]);

    // Admin Users List
    _users.addAll([
      UserModel(id: 'u1', name: 'Sarah Connor', email: 'sarah@jdmart.com', phone: '+234 802 111 2233', role: UserRole.buyer, status: 'Active', isVerified: true),
      UserModel(id: 'u2', name: 'Alex Johnson (Store)', email: 'alex@jdmartstore.com', phone: '+234 803 444 5566', role: UserRole.seller, status: 'Active', isVerified: true),
      UserModel(id: 'u3', name: 'Tunde SpeedRider', email: 'tunde@jdmart.com', phone: '+234 805 777 8899', role: UserRole.rider, status: 'Active', isVerified: true),
      UserModel(id: 'u4', name: 'David Adeyemi', email: 'david.dev@jdmart.com', phone: '+234 807 888 9900', role: UserRole.jobSeeker, status: 'Active', isVerified: true),
      UserModel(id: 'u5', name: 'Apex Logistics HR', email: 'hr@apexlogistics.com', phone: '+234 809 123 4567', role: UserRole.employer, status: 'Active', isVerified: true),
      UserModel(id: 'u6', name: 'Chief Administrator', email: 'admin@jdmart.com', phone: '+234 800 000 0001', role: UserRole.admin, status: 'Active', isVerified: true),
    ]);

    // Payments
    _payments.addAll([
      PaymentTransactionModel(id: 'p1', transactionId: 'TXN-9021-X', userName: 'Sarah Connor', orderId: 'ORD-1001', amount: 68.0, status: 'Successful', date: 'Yesterday', paymentMethod: 'Card Online'),
      PaymentTransactionModel(id: 'p2', transactionId: 'TXN-9022-Y', userName: 'Sarah Connor', orderId: 'ORD-1002', amount: 44.5, status: 'Successful', date: '3 days ago', paymentMethod: 'Bank Transfer'),
      PaymentTransactionModel(id: 'p3', transactionId: 'TXN-9023-Z', userName: 'Emeka Nwosu', orderId: 'ORD-1003', amount: 32.0, status: 'Pending', date: 'Today', paymentMethod: 'Mobile Money'),
    ]);

    // Reviews
    _reviews.addAll([
      ReviewItemModel(id: 'r1', targetType: 'product', targetId: 'prod_1', targetTitle: 'Smart Watch Series 8', authorName: 'Ifeanyi O.', rating: 5.0, comment: 'Incredible battery life and very fast delivery to Ikeja!', date: '2 days ago'),
      ReviewItemModel(id: 'r2', targetType: 'store', targetId: 'store_1', targetTitle: 'JD SuperStore', authorName: 'Blessing A.', rating: 4.9, comment: 'Legit seller, packaging was neat and intact.', date: '3 days ago'),
      ReviewItemModel(id: 'r3', targetType: 'rider', targetId: 'rider_1', targetTitle: 'Tunde SpeedRider', authorName: 'Sarah C.', rating: 5.0, comment: 'Polite rider, kept me updated during transit.', date: 'Yesterday'),
    ]);

    // Reports
    _reports.addAll([
      ReportItemModel(id: 'rep_1', type: 'Product', reportedId: 'prod_99', reportedName: 'Counterfeit Charger', reason: 'Misleading description on brand', reporterName: 'Kolawole B.', date: 'Yesterday', status: 'Pending'),
      ReportItemModel(id: 'rep_2', type: 'Message', reportedId: 'msg_33', reportedName: 'Spam promotion', reason: 'Unsolicited advertising message', reporterName: 'Grace M.', date: '2 days ago', status: 'Investigating'),
    ]);

    // Audit logs
    _auditLogs.addAll([
      AuditLogModel(id: 'l1', adminName: 'Chief Admin', action: 'Approved Merchant Verification', target: 'JD SuperStore', date: 'Yesterday', previousValue: 'Pending', newValue: 'Verified'),
      AuditLogModel(id: 'l2', adminName: 'Chief Admin', action: 'Approved Job Listing', target: 'Apex Global Logistics', date: '2 days ago', previousValue: 'Draft', newValue: 'Active'),
      AuditLogModel(id: 'l3', adminName: 'Chief Admin', action: 'Platform Settings Updated', target: 'Delivery Radius', date: '3 days ago', previousValue: '15 km', newValue: '25 km'),
    ]);
  }
}
