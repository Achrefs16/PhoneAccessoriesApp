import 'package:vat_app/models/cart_item.dart';

class Order {
  final String id;
  final List<CartItem> items;
  final String status;
  final DateTime date;
  final double total;

  Order({
    required this.id,
    required this.items,
    required this.status,
    required this.date,
    required this.total,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'],
      items: (json['items'] as List)
          .map((item) => CartItem.fromJson(item))
          .toList(),
      status: json['status'],
      date: DateTime.parse(json['date']),
      total: json['total'].toDouble(),
    );
  }
}