import 'package:flutter/material.dart';
import 'package:vat_app/services/api_service.dart';
import 'package:vat_app/services/cart_manager.dart';

class CartPage extends StatefulWidget {
  const CartPage({Key? key}) : super(key: key);

  @override
  _CartPageState createState() => _CartPageState();
}

class _CartPageState extends State<CartPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mon Panier'),
      ),
      body: CartManager.items.isEmpty
          ? const Center(
        child: Text('Votre panier est vide'),
      )
          : Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: CartManager.items.length,
              itemBuilder: (context, index) {
                final item = CartManager.items[index];
                return Card(
                  margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                  child: ListTile(
                    leading: Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        image: DecorationImage(
                          image: NetworkImage(item.accessory.image),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                    title: Text(item.accessory.name),
                    subtitle: Text('${item.accessory.price.toStringAsFixed(2)} €'),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.remove),
                          onPressed: () {
                            if (item.quantity > 1) {
                              CartManager.updateQuantity(item.accessory.id, item.quantity - 1);
                              setState(() {});
                            } else {
                              CartManager.removeItem(item.accessory.id);
                              setState(() {});
                            }
                          },
                        ),
                        Text('${item.quantity}'),
                        IconButton(
                          icon: const Icon(Icons.add),
                          onPressed: () {
                            CartManager.updateQuantity(item.accessory.id, item.quantity + 1);
                            setState(() {});
                          },
                        ),
                        IconButton(
                          icon: const Icon(Icons.delete),
                          onPressed: () {
                            CartManager.removeItem(item.accessory.id);
                            setState(() {});
                          },
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          Container(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Total:',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      '${CartManager.total.toStringAsFixed(2)} €',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.blue,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    child: const Text('Passer la commande'),
                    onPressed: CartManager.items.isEmpty
                        ? null
                        : () {
                      _showCheckoutDialog(context);
                    },
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showCheckoutDialog(BuildContext context) {
    final addressController = TextEditingController();

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Finaliser la commande'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('Veuillez entrer votre adresse de livraison:'),
                const SizedBox(height: 8),
                TextField(
                  controller: addressController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: 'Adresse complète',
                  ),
                  maxLines: 3,
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              child: const Text('Annuler'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text('Confirmer'),
              onPressed: () async {  // Added async keyword here
                if (addressController.text.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Veuillez entrer une adresse valide'),
                    ),
                  );
                  return;
                }

                try {
                  await ApiService.placeOrder(
                    CartManager.items,
                    addressController.text,
                  );

                  CartManager.clearCart();

                  Navigator.of(context).pop();
                  Navigator.of(context).pushReplacementNamed('/orders');

                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Commande passée avec succès!'),
                    ),
                  );
                } catch (e) {
                  Navigator.of(context).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Erreur lors de la commande. Veuillez réessayer.'),
                    ),
                  );
                }
              },
            ),
          ],
        );
      },
    );
  }
}