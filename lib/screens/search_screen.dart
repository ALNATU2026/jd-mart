import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../services/app_state.dart';
import '../widgets/app_scaffold.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> with SingleTickerProviderStateMixin {
  final TextEditingController _controller = TextEditingController();
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    final state = AppState.instance;
    final query = _controller.text.toLowerCase().trim();

    final matchedProducts = state.products.where((p) =>
        query.isEmpty ||
        p.name.toLowerCase().contains(query) ||
        p.category.toLowerCase().contains(query)).toList();

    final matchedStores = state.stores.where((s) =>
        query.isEmpty ||
        s.name.toLowerCase().contains(query) ||
        s.description.toLowerCase().contains(query)).toList();

    final matchedCategories = state.categories.where((c) =>
        query.isEmpty || c.name.toLowerCase().contains(query)).toList();

    final matchedJobs = state.jobs.where((j) =>
        query.isEmpty ||
        j.title.toLowerCase().contains(query) ||
        j.companyName.toLowerCase().contains(query) ||
        j.skills.any((s) => s.toLowerCase().contains(query))).toList();

    return AppScaffold(
      title: 'Search JDMart',
      currentRoute: '/search',
      body: Column(
        children: [
          // Search Input Header
          Container(
            color: Colors.white,
            padding: const EdgeInsets.all(12),
            child: Container(
              height: 48,
              padding: const EdgeInsets.symmetric(horizontal: 14),
              decoration: BoxDecoration(
                color: AppColors.scaffoldBg,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                children: [
                  const Icon(Icons.search_rounded, color: AppColors.primary, size: 22),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      autofocus: true,
                      onChanged: (_) => setState(() {}),
                      decoration: const InputDecoration(
                        hintText: 'Search products, stores, categories, jobs...',
                        hintStyle: TextStyle(fontSize: 13, color: AppColors.textMuted),
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                  if (_controller.text.isNotEmpty)
                    IconButton(
                      icon: const Icon(Icons.clear, size: 18),
                      onPressed: () {
                        _controller.clear();
                        setState(() {});
                      },
                    ),
                ],
              ),
            ),
          ),

          // Tabs
          Container(
            color: Colors.white,
            child: TabBar(
              controller: _tabController,
              labelColor: AppColors.primary,
              unselectedLabelColor: AppColors.textSecondary,
              indicatorColor: AppColors.primary,
              labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
              tabs: [
                Tab(text: 'Products (${matchedProducts.length})'),
                Tab(text: 'Stores (${matchedStores.length})'),
                Tab(text: 'Jobs (${matchedJobs.length})'),
                Tab(text: 'Categories (${matchedCategories.length})'),
              ],
            ),
          ),

          // Tab views
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // Products Tab
                matchedProducts.isEmpty
                    ? _buildEmpty('No products matching "$query"')
                    : ListView.builder(
                        padding: const EdgeInsets.all(12),
                        itemCount: matchedProducts.length,
                        itemBuilder: (ctx, i) {
                          final p = matchedProducts[i];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 8),
                            child: ListTile(
                              leading: ClipRRect(
                                borderRadius: BorderRadius.circular(8),
                                child: Image.asset(p.images.first, width: 48, height: 48, fit: BoxFit.cover),
                              ),
                              title: Text(p.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                              subtitle: Text('${p.category} • ${p.sellerName}'),
                              trailing: Text(p.priceFormatted, style: const TextStyle(fontWeight: FontWeight.w900, color: AppColors.primary)),
                              onTap: () => Navigator.pushNamed(context, '/product/${p.id}'),
                            ),
                          );
                        },
                      ),

                // Stores Tab
                matchedStores.isEmpty
                    ? _buildEmpty('No stores matching "$query"')
                    : ListView.builder(
                        padding: const EdgeInsets.all(12),
                        itemCount: matchedStores.length,
                        itemBuilder: (ctx, i) {
                          final s = matchedStores[i];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 8),
                            child: ListTile(
                              leading: CircleAvatar(child: Image.asset(s.logo)),
                              title: Text(s.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                              subtitle: Text(s.location),
                              trailing: const Icon(Icons.arrow_forward_ios, size: 14),
                              onTap: () => Navigator.pushNamed(context, '/store/${s.slug}'),
                            ),
                          );
                        },
                      ),

                // Jobs Tab
                matchedJobs.isEmpty
                    ? _buildEmpty('No jobs matching "$query"')
                    : ListView.builder(
                        padding: const EdgeInsets.all(12),
                        itemCount: matchedJobs.length,
                        itemBuilder: (ctx, i) {
                          final j = matchedJobs[i];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 8),
                            child: ListTile(
                              leading: const CircleAvatar(backgroundColor: AppColors.primaryLight, child: Icon(Icons.work, color: AppColors.primary)),
                              title: Text(j.title, style: const TextStyle(fontWeight: FontWeight.bold)),
                              subtitle: Text('${j.companyName} • ${j.location}'),
                              trailing: Text(j.salary, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: AppColors.primary)),
                              onTap: () => Navigator.pushNamed(context, '/jobs/${j.id}'),
                            ),
                          );
                        },
                      ),

                // Categories Tab
                matchedCategories.isEmpty
                    ? _buildEmpty('No categories matching "$query"')
                    : ListView.builder(
                        padding: const EdgeInsets.all(12),
                        itemCount: matchedCategories.length,
                        itemBuilder: (ctx, i) {
                          final c = matchedCategories[i];
                          return ListTile(
                            leading: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(color: c.color, shape: BoxShape.circle),
                              child: Image.asset(c.icon, width: 24, height: 24),
                            ),
                            title: Text(c.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                            trailing: Text('${c.count} items', style: const TextStyle(color: AppColors.textSecondary)),
                            onTap: () => Navigator.pushNamed(context, '/category/${c.slug}'),
                          );
                        },
                      ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmpty(String msg) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.search_off, size: 48, color: AppColors.textMuted),
          const SizedBox(height: 8),
          Text(msg, style: const TextStyle(color: AppColors.textSecondary)),
        ],
      ),
    );
  }
}
