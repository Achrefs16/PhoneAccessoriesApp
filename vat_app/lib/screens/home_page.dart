import 'package:flutter/material.dart';
import 'package:vat_app/models/accessory.dart';
import 'package:vat_app/services/api_service.dart';
import 'package:vat_app/services/cart_manager.dart';
import 'package:vat_app/widgets/accessory_search_delegate.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  HomePageState createState() => HomePageState();
}

class HomePageState extends State<HomePage> {
  List<Accessory> accessories = [];
  List<String> categories = ['Coques', 'Écouteurs', 'Chargeurs', 'Protections écran', 'Supports'];
  String selectedCategory = 'Tous';
  String sortOption = 'Prix croissant';
  bool isLoading = true;
  String searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadAccessories();
    CartManager.loadCart();
  }

  Future<void> _loadAccessories() async {
    setState(() {
      isLoading = true;
    });

    try {
      if (selectedCategory == 'Tous') {
        accessories = await ApiService.getAccessories();
      } else {
        accessories = await ApiService.getAccessoriesByCategory(selectedCategory);
      }

      _sortAccessories();

      setState(() {
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
      });
    }
  }

  void _sortAccessories() {
    switch (sortOption) {
      case 'Prix croissant':
        accessories.sort((a, b) => a.price.compareTo(b.price));
        break;
      case 'Prix décroissant':
        accessories.sort((a, b) => b.price.compareTo(a.price));
        break;
      case 'Popularité':
        accessories.sort((a, b) => b.popularity.compareTo(a.popularity));
        break;
    }
  }

  Future<void> searchAccessories(String query) async {
    if (query.isEmpty) {
      _loadAccessories();
      return;
    }

    setState(() {
      isLoading = true;
      searchQuery = query;
    });

    try {
      accessories = await ApiService.searchAccessories(query);
      _sortAccessories();

      setState(() {
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Accessoires Téléphoniques'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              showSearch(
                context: context,
                delegate: AccessorySearchDelegate(
                  onSearch: searchAccessories,
                ),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.shopping_cart),
            onPressed: () {
              Navigator.pushNamed(context, '/cart');
            },
          ),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: <Widget>[
            const DrawerHeader(
              decoration: BoxDecoration(
                color: Colors.blue,
              ),
              child: Text(
                'Menu',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                ),
              ),
            ),
            ListTile(
              title: const Text('Accueil'),
              onTap: () {
                Navigator.pop(context);
              },
            ),
            ListTile(
              title: const Text('Mon Profil'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/profile');
              },
            ),
            ListTile(
              title: const Text('Mon Panier'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/cart');
              },
            ),
            ListTile(
              title: const Text('Mes Commandes'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/orders');
              },
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.all(8),
            child: Row(
              children: [
                FilterChip(
                  label: const Text('Tous'),
                  selected: selectedCategory == 'Tous',
                  onSelected: (selected) {
                    setState(() {
                      selectedCategory = 'Tous';
                    });
                    _loadAccessories();
                  },
                ),
                ...categories.map((category) => Padding(
                  padding: const EdgeInsets.only(left: 8),
                  child: FilterChip(
                    label: Text(category),
                    selected: selectedCategory == category,
                    onSelected: (selected) {
                      setState(() {
                        selectedCategory = category;
                      });
                      _loadAccessories();
                    },
                  ),
                )).toList(),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                const Text('Trier par:'),
                const SizedBox(width: 8),
                DropdownButton<String>(
                  value: sortOption,
                  onChanged: (String? newValue) {
                    if (newValue != null) {
                      setState(() {
                        sortOption = newValue;
                      });
                      _sortAccessories();
                      setState(() {});
                    }
                  },
                  items: <String>['Prix croissant', 'Prix décroissant', 'Popularité']
                      .map<DropdownMenuItem<String>>((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
          Expanded(
            child: isLoading
                ? const Center(child: CircularProgressIndicator())
                : accessories.isEmpty
                ? const Center(child: Text('Aucun accessoire trouvé'))
                : GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.7,
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
              ),
              itemCount: accessories.length,
              itemBuilder: (context, index) {
                final accessory = accessories[index];
                return Card(
                  clipBehavior: Clip.antiAlias,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Container(
                          width: double.infinity,
                          child: Image.network(
                            accessory.image,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return const Center(child: Text('Image non disponible'));
                            },
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              accessory.name,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            Text(
                              '${accessory.price.toStringAsFixed(2)} €',
                              style: const TextStyle(
                                color: Colors.blue,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  accessory.brand,
                                  style: TextStyle(
                                    color: Colors.grey[600],
                                    fontSize: 12,
                                  ),
                                ),
                                InkWell(
                                  onTap: () {
                                    CartManager.addItem(accessory);
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text('${accessory.name} ajouté au panier'),
                                        duration: const Duration(seconds: 1),
                                      ),
                                    );
                                  },
                                  child: const Icon(
                                    Icons.add_shopping_cart,
                                    color: Colors.blue,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}