import 'package:flutter/material.dart';

enum UserRole {
  guest,
  buyer,
  seller,
  rider,
  jobSeeker,
  employer,
  admin;

  String get displayName {
    switch (this) {
      case UserRole.guest:
        return 'Guest';
      case UserRole.buyer:
        return 'Buyer';
      case UserRole.seller:
        return 'Seller';
      case UserRole.rider:
        return 'Rider';
      case UserRole.jobSeeker:
        return 'Job Seeker';
      case UserRole.employer:
        return 'Employer';
      case UserRole.admin:
        return 'Admin';
    }
  }
}

class UserModel {
  final String id;
  final String name;
  final String email;
  final String phone;
  final UserRole role;
  final String avatar;
  final String address;
  final bool isVerified;
  final String status;
  final String createdAt;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.role,
    this.avatar = '',
    this.address = 'Ikeja, Lagos',
    this.isVerified = true,
    this.status = 'Active',
    this.createdAt = '2026-01-15',
  });

  UserModel copyWith({
    String? name,
    String? email,
    String? phone,
    UserRole? role,
    String? avatar,
    String? address,
    bool? isVerified,
    String? status,
  }) {
    return UserModel(
      id: id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      role: role ?? this.role,
      avatar: avatar ?? this.avatar,
      address: address ?? this.address,
      isVerified: isVerified ?? this.isVerified,
      status: status ?? this.status,
      createdAt: createdAt,
    );
  }
}

class CategoryModel {
  final String id;
  final String name;
  final String slug;
  final String icon;
  final int count;
  final Color color;

  CategoryModel({
    required this.id,
    required this.name,
    required this.slug,
    required this.icon,
    this.count = 42,
    this.color = const Color(0xFFEAF1FF),
  });
}

class ProductModel {
  final String id;
  final String name;
  final String slug;
  final String description;
  final double price;
  final double oldPrice;
  final String discount;
  final int stock;
  final List<String> images;
  final String category;
  final String sellerId;
  final String sellerName;
  final String sellerLocation;
  final double sellerRating;
  final double rating;
  final int reviewsCount;
  final bool isApproved;
  final bool isActive;
  final String condition;
  final String location;
  final bool deliveryAvailable;
  final String timer;

  ProductModel({
    required this.id,
    required this.name,
    required this.slug,
    required this.description,
    required this.price,
    required this.oldPrice,
    required this.discount,
    required this.stock,
    required this.images,
    required this.category,
    required this.sellerId,
    required this.sellerName,
    this.sellerLocation = 'Ikeja, Lagos',
    this.sellerRating = 4.8,
    this.rating = 4.8,
    this.reviewsCount = 120,
    this.isApproved = true,
    this.isActive = true,
    this.condition = 'Brand New',
    this.location = 'Lagos, Nigeria',
    this.deliveryAvailable = true,
    this.timer = '02:45:30',
  });

  String get priceFormatted => 'Le ${price.toStringAsFixed(price.truncateToDouble() == price ? 0 : 2)}';
  String get oldPriceFormatted => 'Le ${oldPrice.toStringAsFixed(oldPrice.truncateToDouble() == oldPrice ? 0 : 2)}';

  ProductModel copyWith({
    String? name,
    String? description,
    double? price,
    double? oldPrice,
    String? discount,
    int? stock,
    List<String>? images,
    String? category,
    bool? isApproved,
    bool? isActive,
    String? condition,
    String? location,
  }) {
    return ProductModel(
      id: id,
      name: name ?? this.name,
      slug: slug,
      description: description ?? this.description,
      price: price ?? this.price,
      oldPrice: oldPrice ?? this.oldPrice,
      discount: discount ?? this.discount,
      stock: stock ?? this.stock,
      images: images ?? this.images,
      category: category ?? this.category,
      sellerId: sellerId,
      sellerName: sellerName,
      sellerLocation: sellerLocation,
      sellerRating: sellerRating,
      rating: rating,
      reviewsCount: reviewsCount,
      isApproved: isApproved ?? this.isApproved,
      isActive: isActive ?? this.isActive,
      condition: condition ?? this.condition,
      location: location ?? this.location,
      deliveryAvailable: deliveryAvailable,
      timer: timer,
    );
  }
}

class CartItemModel {
  final ProductModel product;
  int quantity;

  CartItemModel({
    required this.product,
    this.quantity = 1,
  });

  double get subtotal => product.price * quantity;
}

class OrderItemModel {
  final String productId;
  final String productName;
  final String productImage;
  final double price;
  final int quantity;
  final String sellerId;
  final String sellerName;

  OrderItemModel({
    required this.productId,
    required this.productName,
    required this.productImage,
    required this.price,
    required this.quantity,
    required this.sellerId,
    required this.sellerName,
  });

  double get subtotal => price * quantity;
}

class OrderModel {
  final String id;
  final String buyerId;
  final String buyerName;
  final String buyerPhone;
  final String buyerAddress;
  final String city;
  final String deliveryMethod;
  final List<OrderItemModel> items;
  final double subtotal;
  final double deliveryFee;
  final double serviceFee;
  final double total;
  String status; // Pending, Processing, Ready for Pickup, Out for Delivery, Delivered, Cancelled, Refunded
  String paymentStatus; // Paid, Pending, Failed, Refunded
  final String paymentMethod;
  final String sellerId;
  final String sellerName;
  String? riderId;
  String? riderName;
  final String createdAt;
  final String estimatedDelivery;
  List<String> timeline;

  OrderModel({
    required this.id,
    required this.buyerId,
    required this.buyerName,
    required this.buyerPhone,
    required this.buyerAddress,
    this.city = 'Lagos',
    this.deliveryMethod = 'Standard delivery',
    required this.items,
    required this.subtotal,
    required this.deliveryFee,
    this.serviceFee = 2.0,
    required this.total,
    this.status = 'Processing',
    this.paymentStatus = 'Paid',
    this.paymentMethod = 'Online Payment',
    required this.sellerId,
    required this.sellerName,
    this.riderId,
    this.riderName,
    required this.createdAt,
    this.estimatedDelivery = 'Tomorrow by 4:00 PM',
    required this.timeline,
  });
}

class StoreModel {
  final String id;
  final String sellerId;
  final String name;
  final String slug;
  final String description;
  final String logo;
  final String location;
  final String phone;
  final String email;
  final String status;
  final bool isVerified;
  final double rating;
  final double totalSales;
  final int productsCount;

  StoreModel({
    required this.id,
    required this.sellerId,
    required this.name,
    required this.slug,
    required this.description,
    this.logo = 'assets/icons/store.png',
    this.location = 'Computer Village, Ikeja, Lagos',
    this.phone = '+234 801 234 5678',
    this.email = 'store@jdmart.com',
    this.status = 'Active',
    this.isVerified = true,
    this.rating = 4.9,
    this.totalSales = 128500.0,
    this.productsCount = 18,
  });
}

class RiderDeliveryModel {
  final String id;
  final String orderId;
  final String sellerId;
  final String sellerName;
  final String pickupLocation;
  final String buyerId;
  final String buyerName;
  final String buyerPhone;
  final String deliveryLocation;
  final String distance;
  final double deliveryFee;
  String status; // Available, Accepted, ArrivedAtPickup, PickedUp, InTransit, Delivered, Cancelled
  String? riderId;
  String? riderName;
  final String orderSummary;
  final String createdAt;

  RiderDeliveryModel({
    required this.id,
    required this.orderId,
    required this.sellerId,
    required this.sellerName,
    required this.pickupLocation,
    required this.buyerId,
    required this.buyerName,
    required this.buyerPhone,
    required this.deliveryLocation,
    required this.distance,
    required this.deliveryFee,
    this.status = 'Available',
    this.riderId,
    this.riderName,
    required this.orderSummary,
    required this.createdAt,
  });
}

class JobModel {
  final String id;
  final String title;
  final String employerId;
  final String companyName;
  final String companyLogo;
  final String category;
  final String description;
  final String requirements;
  final List<String> skills;
  final String location;
  final String salary;
  final String employmentType; // Full-time, Part-time, Contract, Remote
  final String experience; // Entry, Mid, Senior
  final int vacancies;
  final String deadline;
  final String datePosted;
  String status; // Draft, Pending, Active, Paused, Closed, Expired
  final bool isFeatured;
  int applicantsCount;

  JobModel({
    required this.id,
    required this.title,
    required this.employerId,
    required this.companyName,
    this.companyLogo = 'assets/logos/applogo.png',
    required this.category,
    required this.description,
    required this.requirements,
    required this.skills,
    required this.location,
    required this.salary,
    this.employmentType = 'Full-time',
    this.experience = '1-3 years',
    this.vacancies = 2,
    this.deadline = '2026-10-30',
    this.datePosted = '2 days ago',
    this.status = 'Active',
    this.isFeatured = true,
    this.applicantsCount = 7,
  });
}

class JobApplicationModel {
  final String id;
  final String jobId;
  final String jobTitle;
  final String employerId;
  final String companyName;
  final String applicantId;
  final String applicantName;
  final String applicantEmail;
  final String applicantPhone;
  final String applicantCvUrl;
  final String coverLetter;
  String status; // Applied, Under Review, Shortlisted, Interview, Accepted, Rejected
  final String appliedDate;
  String? interviewDate;
  String? interviewNote;

  JobApplicationModel({
    required this.id,
    required this.jobId,
    required this.jobTitle,
    required this.employerId,
    required this.companyName,
    required this.applicantId,
    required this.applicantName,
    required this.applicantEmail,
    required this.applicantPhone,
    this.applicantCvUrl = 'resume_jdmart.pdf',
    required this.coverLetter,
    this.status = 'Applied',
    required this.appliedDate,
    this.interviewDate,
    this.interviewNote,
  });
}

class WorkerProfileModel {
  final String id;
  final String userId;
  final String fullName;
  final String professionalTitle;
  final String location;
  final String bio;
  final List<String> skills;
  final String experience;
  final String education;
  final String certifications;
  final String portfolio;
  final String cvUrl;
  final String availability;
  final String expectedSalary;
  final double rating;
  bool isSaved;

  WorkerProfileModel({
    required this.id,
    required this.userId,
    required this.fullName,
    required this.professionalTitle,
    required this.location,
    required this.bio,
    required this.skills,
    this.experience = '4 years',
    this.education = 'B.Sc Computer Science',
    this.certifications = 'Google Certified Associate',
    this.portfolio = 'https://portfolio.jdmart.com',
    this.cvUrl = 'cv_worker.pdf',
    this.availability = 'Available Immediately',
    this.expectedSalary = 'Le 150 - 250 / hr',
    this.rating = 4.9,
    this.isSaved = false,
  });
}

class ChatMessageModel {
  final String id;
  final String senderId;
  final String senderName;
  final String message;
  final String timestamp;
  final bool isMe;

  ChatMessageModel({
    required this.id,
    required this.senderId,
    required this.senderName,
    required this.message,
    required this.timestamp,
    required this.isMe,
  });
}

class ConversationModel {
  final String id;
  final String otherUserName;
  final String otherUserRole;
  final String otherUserAvatar;
  final String lastMessage;
  final String lastMessageTime;
  int unreadCount;
  final List<ChatMessageModel> messages;

  ConversationModel({
    required this.id,
    required this.otherUserName,
    required this.otherUserRole,
    this.otherUserAvatar = '',
    required this.lastMessage,
    required this.lastMessageTime,
    this.unreadCount = 0,
    required this.messages,
  });
}

class NotificationItemModel {
  final String id;
  final String title;
  final String description;
  final String time;
  final IconData icon;
  final Color iconColor;
  bool isRead;

  NotificationItemModel({
    required this.id,
    required this.title,
    required this.description,
    required this.time,
    this.icon = Icons.notifications,
    this.iconColor = const Color(0xFF1E40AF),
    this.isRead = false,
  });
}

class AuditLogModel {
  final String id;
  final String adminName;
  final String action;
  final String target;
  final String date;
  final String previousValue;
  final String newValue;

  AuditLogModel({
    required this.id,
    required this.adminName,
    required this.action,
    required this.target,
    required this.date,
    required this.previousValue,
    required this.newValue,
  });
}

class ReportItemModel {
  final String id;
  final String type; // User, Product, Seller, Rider, Job, Employer, Message
  final String reportedId;
  final String reportedName;
  final String reason;
  final String reporterName;
  final String date;
  String status; // Pending, Investigating, Resolved, Dismissed

  ReportItemModel({
    required this.id,
    required this.type,
    required this.reportedId,
    required this.reportedName,
    required this.reason,
    required this.reporterName,
    required this.date,
    this.status = 'Pending',
  });
}

class ReviewItemModel {
  final String id;
  final String targetType; // product, store, rider
  final String targetId;
  final String targetTitle;
  final String authorName;
  final double rating;
  final String comment;
  final String date;

  ReviewItemModel({
    required this.id,
    required this.targetType,
    required this.targetId,
    required this.targetTitle,
    required this.authorName,
    required this.rating,
    required this.comment,
    required this.date,
  });
}

class PaymentTransactionModel {
  final String id;
  final String transactionId;
  final String userName;
  final String orderId;
  final double amount;
  String status; // Successful, Pending, Failed, Refunded
  final String date;
  final String paymentMethod;

  PaymentTransactionModel({
    required this.id,
    required this.transactionId,
    required this.userName,
    required this.orderId,
    required this.amount,
    this.status = 'Successful',
    required this.date,
    this.paymentMethod = 'Online Card',
  });
}
