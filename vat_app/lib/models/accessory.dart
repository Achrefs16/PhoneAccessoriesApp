class Accessory {
  final int id;
  final String name;
  final String description;
  final double price;
  final String image;
  final String brand;
  final int popularity;
  final String category;

  Accessory({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.image,
    required this.brand,
    required this.popularity,
    required this.category,
  });

  factory Accessory.fromJson(Map<String, dynamic> json) {
    return Accessory(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      price: json['price'].toDouble(),
      image: json['image'],
      brand: json['brand'],
      popularity: json['popularity'],
      category: json['category'],
    );
  }
}