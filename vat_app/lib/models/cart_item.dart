import 'package:vat_app/models/accessory.dart';

class CartItem {
  final Accessory accessory;
  int quantity;

  CartItem({
    required this.accessory,
    this.quantity = 1,
  });

  Map<String, dynamic> toJson() {
    return {
      'accessory': {
        'id': accessory.id,
        'name': accessory.name,
        'price': accessory.price,
        'image': accessory.image,
      },
      'quantity': quantity,
    };
  }

  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      accessory: Accessory(
        id: json['accessory']['id'],
        name: json['accessory']['name'],
        description: '',
        price: json['accessory']['price'].toDouble(),
        image: json['accessory']['image'],
        brand: '',
        popularity: 0,
        category: '',
      ),
      quantity: json['quantity'],
    );
  }
}