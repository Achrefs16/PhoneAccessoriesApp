import 'package:flutter/material.dart';
import 'package:vat_app/models/order.dart';
import 'package:vat_app/services/api_service.dart';

class OrdersPage extends StatefulWidget {
  const OrdersPage({Key? key}) : super(key: key);

  @override
  _OrdersPageState createState() => _OrdersPageState();
}

class _OrdersPageState extends State<OrdersPage> {
  List<Order> orders = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadOrders();
  }

  void _loadOrders() async {
    setState(() {
      isLoading = true;
    });

    try {
      final orderHistory = await ApiService.getOrderHistory();
      setState(() {
        orders = orderHistory.map((order) => Order.fromJson(order)).toList();
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Erreur lors du chargement des commandes'),
        ),
      );
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'En attente':
        return Colors.orange;
      case 'Expédiée':
        return Colors.blue;
      case 'Livrée':
        return Colors.green;
      case 'Annulée':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mes Commandes'),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : orders.isEmpty
          ? const Center(child: Text('Aucune commande trouvée'))
          : ListView.builder(
        itemCount: orders.length,
        itemBuilder: (context, index) {
          final order = orders[index];
          return Card(
            margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
            child: ExpansionTile(
              title: Text('Commande #${order.id}'),
              subtitle: Row(
                children: [
                  Text(_formatDate(order.date)),
                  const SizedBox(width: 16),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getStatusColor(order.status),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      order.status,
                      style: const TextStyle(color: Colors.white),
                    ),
                  ),
                ],
              ),
              trailing: Text(
                '${order.total.toStringAsFixed(2)} €',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              children: [
                const Divider(),
                ...order.items.map((item) => ListTile(
                  leading: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      image: DecorationImage(
                        image: NetworkImage(item.accessory.image),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  title: Text(item.accessory.name),
                  subtitle: Text('Quantité: ${item.quantity}'),
                  trailing: Text(
                    '${(item.accessory.price * item.quantity).toStringAsFixed(2)} €',
                  ),
                )),
                const Padding(
                  padding: EdgeInsets.all(16),
                  child: Text('Détails de livraison:'),
                ),
                const Padding(
                  padding: EdgeInsets.only(left: 16, right: 16, bottom: 16),
                  child: LinearProgressIndicator(value: 0.7),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}