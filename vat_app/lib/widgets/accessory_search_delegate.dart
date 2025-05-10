import 'package:flutter/material.dart';
import 'package:vat_app/models/accessory.dart';

typedef SearchAccessoriesCallback = Future<void> Function(String query);

class AccessorySearchDelegate extends SearchDelegate<String> {
  final SearchAccessoriesCallback onSearch;
  final List<String> recentSearches;

  AccessorySearchDelegate({
    required this.onSearch,
    this.recentSearches = const [],
  });

  @override
  List<Widget> buildActions(BuildContext context) {
    return [
      IconButton(
        icon: const Icon(Icons.clear),
        onPressed: () {
          query = '';
        },
      ),
    ];
  }

  @override
  Widget buildLeading(BuildContext context) {
    return IconButton(
      icon: const Icon(Icons.arrow_back),
      onPressed: () {
        close(context, '');
      },
    );
  }

  @override
  Widget buildResults(BuildContext context) {
    onSearch(query);
    close(context, query);
    return Container();
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    return ListView(
      children: query.isEmpty
          ? []
          : ['Coque $query', 'Chargeur $query', 'Écouteurs $query']
          .map((suggestion) => ListTile(
        title: Text(suggestion),
        onTap: () {
          query = suggestion;
          showResults(context);
        },
      ))
          .toList(),
    );
  }
}