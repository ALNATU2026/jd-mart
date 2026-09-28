import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../models/models.dart';
import '../services/app_state.dart';
import '../widgets/app_scaffold.dart';

class JobsScreen extends StatefulWidget {
  final String? jobId;
  final bool isSearchMode;

  const JobsScreen({super.key, this.jobId, this.isSearchMode = false});

  @override
  State<JobsScreen> createState() => _JobsScreenState();
}

class _JobsScreenState extends State<JobsScreen> {
  final TextEditingController _searchCtrl = TextEditingController();
  String _selectedType = 'All';
  String _selectedCategory = 'All';

  @override
  Widget build(BuildContext context) {
    if (widget.jobId != null) {
      return _buildJobDetailView(context, widget.jobId!);
    }

    return AnimatedBuilder(
      animation: AppState.instance,
      builder: (context, _) {
        final state = AppState.instance;
        final query = _searchCtrl.text.toLowerCase().trim();

        final filteredJobs = state.jobs.where((j) {
          final matchesQuery = query.isEmpty ||
              j.title.toLowerCase().contains(query) ||
              j.companyName.toLowerCase().contains(query) ||
              j.skills.any((s) => s.toLowerCase().contains(query));

          final matchesType = _selectedType == 'All' || j.employmentType.toLowerCase() == _selectedType.toLowerCase();
          final matchesCat = _selectedCategory == 'All' || j.category.toLowerCase().contains(_selectedCategory.toLowerCase());

          return matchesQuery && matchesType && matchesCat;
        }).toList();

        return AppScaffold(
          title: 'Job Marketplace',
          currentRoute: widget.isSearchMode ? '/jobs/search' : '/jobs',
          body: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Search Header
                Container(
                  color: Colors.white,
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Find Your Next Career Move',
                        style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                      ),
                      const SizedBox(height: 2),
                      const Text(
                        'Connect with leading employers and verified merchants',
                        style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                      ),
                      const SizedBox(height: 12),
                      Container(
                        height: 48,
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        decoration: BoxDecoration(
                          color: AppColors.scaffoldBg,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.search_rounded, color: AppColors.primary, size: 20),
                            const SizedBox(width: 8),
                            Expanded(
                              child: TextField(
                                controller: _searchCtrl,
                                onChanged: (_) => setState(() {}),
                                decoration: const InputDecoration(
                                  hintText: 'Search by title, skill (e.g. Flutter, SEO), or employer...',
                                  hintStyle: TextStyle(fontSize: 12, color: AppColors.textMuted),
                                  border: InputBorder.none,
                                ),
                              ),
                            ),
                            if (_searchCtrl.text.isNotEmpty)
                              IconButton(
                                icon: const Icon(Icons.clear, size: 16),
                                onPressed: () {
                                  _searchCtrl.clear();
                                  setState(() {});
                                },
                              ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                // Employment Type Filter Pills
                Container(
                  color: Colors.white,
                  padding: const EdgeInsets.only(left: 16, bottom: 10),
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: ['All', 'Full-time', 'Part-time', 'Contract', 'Remote'].map((type) {
                        final isSelected = _selectedType == type;
                        return Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: ChoiceChip(
                            label: Text(type),
                            selected: isSelected,
                            onSelected: (_) => setState(() => _selectedType = type),
                            selectedColor: AppColors.primary,
                            backgroundColor: AppColors.scaffoldBg,
                            labelStyle: TextStyle(
                              color: isSelected ? Colors.white : AppColors.textPrimary,
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                              fontSize: 11,
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ),

                // Jobs List
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('${filteredJobs.length} Open Positions', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                          if (state.currentRole == UserRole.employer)
                            ElevatedButton.icon(
                              onPressed: () => Navigator.pushNamed(context, '/employer/jobs/new'),
                              icon: const Icon(Icons.add, size: 16),
                              label: const Text('Post a Job', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                              style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
                            ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      if (filteredJobs.isEmpty)
                        const Center(
                          child: Padding(
                            padding: EdgeInsets.all(32),
                            child: Text('No jobs found matching your criteria.'),
                          ),
                        )
                      else
                        ...filteredJobs.map((job) {
                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            child: InkWell(
                              onTap: () => Navigator.pushNamed(context, '/jobs/${job.id}'),
                              borderRadius: BorderRadius.circular(16),
                              child: Padding(
                                padding: const EdgeInsets.all(16),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Container(
                                          width: 44,
                                          height: 44,
                                          decoration: BoxDecoration(
                                            color: AppColors.primaryLight,
                                            borderRadius: BorderRadius.circular(12),
                                          ),
                                          child: const Icon(Icons.business_rounded, color: AppColors.primary, size: 24),
                                        ),
                                        const SizedBox(width: 12),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(job.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.textPrimary)),
                                              const SizedBox(height: 2),
                                              Text(job.companyName, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12, color: AppColors.primary)),
                                              Text(job.location, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                                            ],
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                          decoration: BoxDecoration(
                                            color: AppColors.secondaryLight,
                                            borderRadius: BorderRadius.circular(6),
                                          ),
                                          child: Text(job.employmentType, style: const TextStyle(color: AppColors.secondary, fontSize: 10, fontWeight: FontWeight.bold)),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 12),
                                    Text(
                                      job.description,
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.3),
                                    ),
                                    const SizedBox(height: 10),
                                    Wrap(
                                      spacing: 6,
                                      runSpacing: 4,
                                      children: job.skills.map((skill) {
                                        return Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                          decoration: BoxDecoration(color: AppColors.scaffoldBg, borderRadius: BorderRadius.circular(6)),
                                          child: Text(skill, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.textSecondary)),
                                        );
                                      }).toList(),
                                    ),
                                    const Divider(height: 20),
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(job.salary, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13, color: AppColors.primary)),
                                        Text('Posted ${job.datePosted}', style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        }),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildJobDetailView(BuildContext context, String jId) {
    final state = AppState.instance;
    JobModel job;
    try {
      job = state.jobs.firstWhere((j) => j.id == jId);
    } catch (_) {
      job = state.jobs.first;
    }

    return AppScaffold(
      title: job.title,
      currentRoute: '/jobs/${job.id}',
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Company Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.borderLight),
              ),
              child: Row(
                children: [
                  Container(
                    width: 52,
                    height: 52,
                    decoration: BoxDecoration(color: AppColors.primaryLight, borderRadius: BorderRadius.circular(12)),
                    child: const Icon(Icons.business_rounded, color: AppColors.primary, size: 28),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(job.title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                        Text(job.companyName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.primary)),
                        Text('${job.location} • ${job.employmentType}', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Salary & Quick Details
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    _jobMetaRow('Offered Salary', job.salary, Icons.payments_outlined),
                    _jobMetaRow('Experience Required', job.experience, Icons.timeline_rounded),
                    _jobMetaRow('Job Category', job.category, Icons.category_outlined),
                    _jobMetaRow('Application Deadline', job.deadline, Icons.calendar_today_outlined),
                    _jobMetaRow('Open Vacancies', '${job.vacancies} positions', Icons.people_outline),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Description
            const Text('Role Overview', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
            const SizedBox(height: 6),
            Text(job.description, style: const TextStyle(fontSize: 13, height: 1.5, color: AppColors.textSecondary)),
            const SizedBox(height: 16),

            // Requirements
            const Text('Key Requirements & Responsibilities', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
            const SizedBox(height: 6),
            Text(job.requirements, style: const TextStyle(fontSize: 13, height: 1.5, color: AppColors.textSecondary)),
            const SizedBox(height: 16),

            // Required Skills
            const Text('Required Skills', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: job.skills.map((s) {
                return Chip(label: Text(s), backgroundColor: AppColors.primaryLight, labelStyle: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 11));
              }).toList(),
            ),
            const SizedBox(height: 24),

            // Actions: Apply Now, Save, Contact
            Row(
              children: [
                Expanded(
                  flex: 2,
                  child: SizedBox(
                    height: 50,
                    child: ElevatedButton(
                      onPressed: () => _showApplyModal(context, state, job),
                      style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
                      child: const Text('Apply Now', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: SizedBox(
                    height: 50,
                    child: OutlinedButton(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Job saved to your bookmarks!')));
                      },
                      style: OutlinedButton.styleFrom(side: const BorderSide(color: AppColors.primary)),
                      child: const Text('Save Job', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _jobMetaRow(String label, String value, IconData icon) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Icon(icon, size: 18, color: AppColors.primary),
          const SizedBox(width: 10),
          Text(label, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
          const Spacer(),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppColors.textPrimary)),
        ],
      ),
    );
  }

  void _showApplyModal(BuildContext context, AppState state, JobModel job) {
    final nameCtrl = TextEditingController(text: state.currentUser.name);
    final emailCtrl = TextEditingController(text: state.currentUser.email);
    final phoneCtrl = TextEditingController(text: state.currentUser.phone);
    final coverCtrl = TextEditingController(text: 'I am interested in this role and have relevant experience.');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
          top: 20,
          left: 20,
          right: 20,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Apply to ${job.title}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            Text(job.companyName, style: const TextStyle(color: AppColors.primary, fontSize: 12, fontWeight: FontWeight.bold)),
            const SizedBox(height: 14),
            TextField(controller: nameCtrl, decoration: const InputDecoration(labelText: 'Full Name', border: OutlineInputBorder())),
            const SizedBox(height: 10),
            TextField(controller: emailCtrl, decoration: const InputDecoration(labelText: 'Email Address', border: OutlineInputBorder())),
            const SizedBox(height: 10),
            TextField(controller: phoneCtrl, decoration: const InputDecoration(labelText: 'Phone Number', border: OutlineInputBorder())),
            const SizedBox(height: 10),
            TextField(controller: coverCtrl, maxLines: 2, decoration: const InputDecoration(labelText: 'Short Cover Note', border: OutlineInputBorder())),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: () {
                  state.applyForJob(
                    job: job,
                    fullName: nameCtrl.text.trim(),
                    email: emailCtrl.text.trim(),
                    phone: phoneCtrl.text.trim(),
                    coverLetter: coverCtrl.text.trim(),
                  );
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Application submitted to ${job.companyName}!')),
                  );
                },
                style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
                child: const Text('Submit Application'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
