import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vat_app/models/accessory.dart';
import 'package:vat_app/models/cart_item.dart';

class CartManager {
  static List<CartItem> _cartItems = [];

  static List<CartItem> get items => _cartItems;

  static double get total {
    return _cartItems.fold(0, (sum, item) => sum + (item.accessory.price * item.quantity));
  }

  static void addItem(Accessory accessory) {
    final existingIndex = _cartItems.indexWhere((item) => item.accessory.id == accessory.id);

    if (existingIndex >= 0) {
      _cartItems[existingIndex].quantity += 1;
    } else {
      _cartItems.add(CartItem(accessory: accessory));
    }
    _saveCart();
  }

  static void removeItem(int accessoryId) {
    _cartItems.removeWhere((item) => item.accessory.id == accessoryId);
    _saveCart();
  }

  static void updateQuantity(int accessoryId, int quantity) {
    final index = _cartItems.indexWhere((item) => item.accessory.id == accessoryId);
    if (index >= 0) {
      if (quantity <= 0) {
        _cartItems.removeAt(index);
      } else {
        _cartItems[index].quantity = quantity;
      }
      _saveCart();
    }
  }

  static void clearCart() {
    _cartItems = [];
    _saveCart();
  }

  static Future<void> _saveCart() async {
    final prefs = await SharedPreferences.getInstance();
    final String cartJson = jsonEncode(_cartItems.map((item) => item.toJson()).toList());
    await prefs.setString('cart', cartJson);
  }

  static Future<void> loadCart() async {
    final prefs = await SharedPreferences.getInstance();
    final String? cartJson = prefs.getString('cart');

    if (cartJson != null) {
      final List<dynamic> cartData = jsonDecode(cartJson);
      _cartItems = cartData.map((item) => CartItem.fromJson(item)).toList();
    }
  }
}