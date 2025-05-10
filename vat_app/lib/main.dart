import 'package:flutter/material.dart';
import 'package:vat_app/screens/home_page.dart';
import 'package:vat_app/screens/profile_page.dart';
import 'package:vat_app/screens/cart_page.dart';
import 'package:vat_app/screens/orders_page.dart';

void main() {
  runApp(const PhoneAccessoriesApp());
}

class PhoneAccessoriesApp extends StatelessWidget {
  const PhoneAccessoriesApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Accessoires Téléphoniques',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const HomePage(),
      routes: {
        '/profile': (context) => const ProfilePage(),
        '/cart': (context) => const CartPage(),
        '/orders': (context) => const OrdersPage(),
      },
    );
  }
}