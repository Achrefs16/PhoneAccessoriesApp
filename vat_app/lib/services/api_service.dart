import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:vat_app/models/accessory.dart';
import 'package:vat_app/models/cart_item.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:3000';

  static Future<List<Accessory>> getAccessories() async {
    final response = await http.get(Uri.parse('$baseUrl/accessories'));

    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.map((json) => Accessory.fromJson(json)).toList();
    } else {
      throw Exception('Échec du chargement des accessoires');
    }
  }

  static Future<List<Accessory>> getAccessoriesByCategory(String category) async {
    final response = await http.get(Uri.parse('$baseUrl/accessories/category/$category'));

    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.map((json) => Accessory.fromJson(json)).toList();
    } else {
      throw Exception('Échec du chargement des accessoires par catégorie');
    }
  }

  static Future<List<Accessory>> searchAccessories(String query) async {
    final response = await http.get(Uri.parse('$baseUrl/accessories/search?q=$query'));

    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.map((json) => Accessory.fromJson(json)).toList();
    } else {
      throw Exception('Échec de la recherche');
    }
  }

  static Future<Map<String, dynamic>> placeOrder(List<CartItem> items, String address) async {
    final response = await http.post(
      Uri.parse('$baseUrl/orders'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, dynamic>{
        'items': items.map((item) => item.toJson()).toList(),
        'address': address,
      }),
    );

    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Échec de la commande');
    }
  }

  static Future<List<dynamic>> getOrderHistory() async {
    final response = await http.get(Uri.parse('$baseUrl/orders/history'));

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Échec de récupération de l\'historique');
    }
  }
}