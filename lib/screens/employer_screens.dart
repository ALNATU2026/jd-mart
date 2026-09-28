import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../models/models.dart';
import '../services/app_state.dart';
import '../widgets/app_scaffold.dart';

class EmployerScreens extends StatefulWidget {
  final String mode; // 'dashboard', 'jobs', 'new_job', 'job_details', 'workers', 'worker_profile', 'applicants', 'saved_workers', 'company'
  final String? targetId;

  const EmployerScreens({super.key, required this.mode, this.targetId});

  @override
  State<EmployerScreens> createState() => _EmployerScreensState();
}

class _EmployerScreensState extends State<EmployerScreens> {
  // Post Job form controllers
  final _postJobKey = GlobalKey<FormState>();
  final _titleCtrl = TextEditingController();
  final _categoryCtrl = TextEditingController(text: 'Technology & IT');
  final _descCtrl = TextEditingController();
  final _reqCtrl = TextEditingController();
  final _skillsCtrl = TextEditingController(text: 'Flutter, React, APIs');
  final _locationCtrl = TextEditingController(text: 'Ikeja, Lagos (Hybrid)');
  final _salaryCtrl = TextEditingController(text: 'Le 2,500 - 3,500 / month');
  final _empTypeCtrl = TextEditingController(text: 'Full-time');

  // Find workers filter
  final _workerSearchCtrl = TextEditingController();
  String _selectedSkill = 'All';

  @override
  Widget build(BuildContext context) {
    if (widget.mode == 'new_job') return _buildPostJobScreen(context);
    if (widget.mode == 'jobs') return _buildMyJobsScreen(context);
    if (widget.mode == 'workers') return _buildFindWorkersScreen(context);
    if (widget.mode == 'worker_profile') return _buildWorkerProfileScreen(context, widget.targetId);
    if (widget.mode == 'applicants') return _buildApplicantsScreen(context);
    if (widget.mode == 'saved_workers') return _buildSavedWorkersScreen(context);
    if (widget.mode == 'company') return _buildCompanyScreen(context);

    // Default: Employer Dashboard
    return _buildDashboardScreen(context);
  }

  Widget _buildDashboardScreen(BuildContext context) {
    return AnimatedBuilder(
      animation: AppState.instance,
      builder: (context, _) {
        final state = AppState.instance;

        return AppScaffold(
          title: 'Employer Dashboard',
          currentRoute: '/employer',
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Welcome card
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF4F46E5), Color(0xFF6366F1)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    children: [
                      const CircleAvatar(radius: 26, backgroundColor: Colors.white24, child: Icon(Icons.business_rounded, color: Colors.white, size: 28)),
                      const SizedBox(width: 14),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Apex Global Logistics', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                            SizedBox(height: 2),
                            Text('Enterprise Employer • 3 Active Openings', style: TextStyle(color: Colors.white70, fontSize: 12)),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.settings, color: Colors.white),
                        onPressed: () => Navigator.pushNamed(context, '/employer/company'),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Metrics
                Row(
                  children: [
                    _empMetric('Active Jobs', '${state.jobs.length}', Icons.work_outline, AppColors.primaryLight, AppColors.primary),
                    const SizedBox(width: 10),
                    _empMetric('Applicants', '${state.jobApplications.length}', Icons.people_outline, AppColors.secondaryLight, AppColors.secondary),
                    const SizedBox(width: 10),
                    _empMetric('Interviews', '1', Icons.event_available, AppColors.successLight, AppColors.success),
                  ],
                ),
                const SizedBox(height: 18),

                // Shortcuts: Post Job & Find Workers
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () => Navigator.pushNamed(context, '/employer/jobs/new'),
                        icon: const Icon(Icons.add, size: 18),
                        label: const Text('Post a Job', style: TextStyle(fontWeight: FontWeight.bold)),
                        style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(vertical: 12)),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () => Navigator.pushNamed(context, '/employer/workers'),
                        icon: const Icon(Icons.person_search_rounded, size: 18),
                        label: const Text('Find Workers', style: TextStyle(fontWeight: FontWeight.bold)),
                        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6366F1), foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(vertical: 12)),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Recent applicants
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Recent Job Applicants', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                    TextButton(
                      onPressed: () => Navigator.pushNamed(context, '/employer/applicants'),
                      child: const Text('View All', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary)),
                    ),
                  ],
                ),
                ...state.jobApplications.take(3).map((app) {
                  return Card(
                    margin: const EdgeInsets.only(bottom: 10),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    child: ListTile(
                      leading: const CircleAvatar(child: Icon(Icons.person)),
                      title: Text(app.applicantName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                      subtitle: Text('Applied for "${app.jobTitle}" • ${app.appliedDate}'),
                      trailing: Chip(label: Text(app.status, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold))),
                      onTap: () => Navigator.pushNamed(context, '/employer/applicants'),
                    ),
                  );
                }),
                const SizedBox(height: 16),

                // Recommended Workers preview
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Top Recommended Talent', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                    TextButton(
                      onPressed: () => Navigator.pushNamed(context, '/employer/workers'),
                      child: const Text('Browse All Workers', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary)),
                    ),
                  ],
                ),
                ...state.workers.take(2).map((w) {
                  return Card(
                    margin: const EdgeInsets.only(bottom: 10),
                    child: ListTile(
                      leading: const CircleAvatar(child: Icon(Icons.badge)),
                      title: Text(w.fullName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                      subtitle: Text('${w.professionalTitle} • ${w.experience}'),
                      trailing: ElevatedButton(
                        onPressed: () => Navigator.pushNamed(context, '/workers/${w.id}'),
                        style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
                        child: const Text('View'),
                      ),
                    ),
                  );
                }),
                const SizedBox(height: 30),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildFindWorkersScreen(BuildContext context) {
    return AnimatedBuilder(
      animation: AppState.instance,
      builder: (context, _) {
        final state = AppState.instance;
        final query = _workerSearchCtrl.text.toLowerCase().trim();

        final filteredWorkers = state.workers.where((w) {
          final matchesQuery = query.isEmpty ||
              w.fullName.toLowerCase().contains(query) ||
              w.professionalTitle.toLowerCase().contains(query) ||
              w.skills.any((s) => s.toLowerCase().contains(query));

          final matchesSkill = _selectedSkill == 'All' || w.skills.any((s) => s.toLowerCase() == _selectedSkill.toLowerCase());

          return matchesQuery && matchesSkill;
        }).toList();

        return AppScaffold(
          title: 'Find & Hire Workers',
          currentRoute: '/employer/workers',
          body: Column(
            children: [
              // Search Input
              Container(
                color: Colors.white,
                padding: const EdgeInsets.all(12),
                child: TextField(
                  controller: _workerSearchCtrl,
                  onChanged: (_) => setState(() {}),
                  decoration: InputDecoration(
                    hintText: 'Search by worker name, title, or skills (Flutter, UI/UX)...',
                    prefixIcon: const Icon(Icons.person_search_rounded, size: 20),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.border)),
                    contentPadding: const EdgeInsets.symmetric(vertical: 10),
                  ),
                ),
              ),

              // Skill Chips
              Container(
                color: Colors.white,
                padding: const EdgeInsets.only(left: 12, bottom: 8),
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: ['All', 'Flutter', 'UI/UX Design', 'Logistics', 'React', 'Node.js'].map((sk) {
                      final isSelected = _selectedSkill == sk;
                      return Padding(
                        padding: const EdgeInsets.only(right: 6),
                        child: ChoiceChip(
                          label: Text(sk),
                          selected: isSelected,
                          onSelected: (_) => setState(() => _selectedSkill = sk),
                          selectedColor: AppColors.primary,
                          backgroundColor: AppColors.scaffoldBg,
                          labelStyle: TextStyle(color: isSelected ? Colors.white : AppColors.textPrimary, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ),

              // Workers list
              Expanded(
                child: filteredWorkers.isEmpty
                    ? const Center(child: Text('No workers found matching your search.'))
                    : ListView.builder(
                        padding: const EdgeInsets.all(14),
                        itemCount: filteredWorkers.length,
                        itemBuilder: (ctx, i) {
                          final w = filteredWorkers[i];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            child: Padding(
                              padding: const EdgeInsets.all(14),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      CircleAvatar(
                                        radius: 26,
                                        backgroundColor: AppColors.primaryLight,
                                        child: Text(w.fullName.substring(0, 1), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppColors.primary)),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Row(
                                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                              children: [
                                                Text(w.fullName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                                                Row(
                                                  children: [
                                                    const Icon(Icons.star_rounded, color: Colors.amber, size: 16),
                                                    Text(' ${w.rating}'),
                                                  ],
                                                ),
                                              ],
                                            ),
                                            Text(w.professionalTitle, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12, color: AppColors.primary)),
                                            Text('${w.location} • ${w.experience}', style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 10),
                                  Text(w.bio, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12, height: 1.3)),
                                  const SizedBox(height: 8),
                                  Wrap(
                                    spacing: 6,
                                    children: w.skills.map((s) => Chip(label: Text(s, style: const TextStyle(fontSize: 10)))).toList(),
                                  ),
                                  const Divider(height: 16),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(w.expectedSalary, style: const TextStyle(fontWeight: FontWeight.w900, color: AppColors.primary, fontSize: 13)),
                                      Row(
                                        children: [
                                          IconButton(
                                            icon: Icon(w.isSaved ? Icons.bookmark : Icons.bookmark_border, color: AppColors.primary),
                                            onPressed: () => state.toggleSaveWorker(w.id),
                                          ),
                                          ElevatedButton(
                                            onPressed: () => Navigator.pushNamed(context, '/workers/${w.id}'),
                                            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
                                            child: const Text('View Profile'),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildWorkerProfileScreen(BuildContext context, String? wId) {
    final state = AppState.instance;
    WorkerProfileModel worker;
    try {
      worker = state.workers.firstWhere((w) => w.id == wId);
    } catch (_) {
      worker = state.workers.first;
    }

    return AppScaffold(
      title: worker.fullName,
      currentRoute: '/workers/${worker.id}',
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    CircleAvatar(
                      radius: 36,
                      backgroundColor: AppColors.primaryLight,
                      child: Text(worker.fullName.substring(0, 1), style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: AppColors.primary)),
                    ),
                    const SizedBox(height: 10),
                    Text(worker.fullName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                    Text(worker.professionalTitle, style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.w700)),
                    Text('${worker.location} • Rating ${worker.rating} ★', style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        ElevatedButton.icon(
                          onPressed: () => Navigator.pushNamed(context, '/messages'),
                          icon: const Icon(Icons.chat_bubble_outline, size: 16),
                          label: const Text('Contact Worker'),
                          style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
                        ),
                        const SizedBox(width: 8),
                        OutlinedButton(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Invited ${worker.fullName} to apply for your opening.')));
                          },
                          child: const Text('Invite to Job'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            _infoCard('Professional Bio', worker.bio),
            const SizedBox(height: 12),

            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Key Skills', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    const SizedBox(height: 8),
                    Wrap(spacing: 6, children: worker.skills.map((s) => Chip(label: Text(s))).toList()),
                    const Divider(height: 20),
                    Text('Experience: ${worker.experience}'),
                    Text('Education: ${worker.education}'),
                    Text('Certifications: ${worker.certifications}'),
                    Text('Availability: ${worker.availability}'),
                    Text('Expected Salary: ${worker.expectedSalary}'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _infoCard(String title, String content) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 6),
            Text(content, style: const TextStyle(fontSize: 13, height: 1.4)),
          ],
        ),
      ),
    );
  }

  Widget _buildPostJobScreen(BuildContext context) {
    final state = AppState.instance;

    return AppScaffold(
      title: 'Post a New Job',
      currentRoute: '/employer/jobs/new',
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _postJobKey,
          child: Column(
            children: [
              TextFormField(controller: _titleCtrl, decoration: const InputDecoration(labelText: 'Job Title', border: OutlineInputBorder()), validator: (v) => v!.isEmpty ? 'Enter title' : null),
              const SizedBox(height: 10),
              TextFormField(controller: _categoryCtrl, decoration: const InputDecoration(labelText: 'Category', border: OutlineInputBorder())),
              const SizedBox(height: 10),
              TextFormField(controller: _descCtrl, maxLines: 3, decoration: const InputDecoration(labelText: 'Job Description', border: OutlineInputBorder()), validator: (v) => v!.isEmpty ? 'Enter description' : null),
              const SizedBox(height: 10),
              TextFormField(controller: _reqCtrl, maxLines: 2, decoration: const InputDecoration(labelText: 'Requirements', border: OutlineInputBorder())),
              const SizedBox(height: 10),
              TextFormField(controller: _skillsCtrl, decoration: const InputDecoration(labelText: 'Skills (comma-separated)', border: OutlineInputBorder())),
              const SizedBox(height: 10),
              TextFormField(controller: _locationCtrl, decoration: const InputDecoration(labelText: 'Location / Work Policy', border: OutlineInputBorder())),
              const SizedBox(height: 10),
              TextFormField(controller: _salaryCtrl, decoration: const InputDecoration(labelText: 'Salary Range', border: OutlineInputBorder())),
              const SizedBox(height: 18),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: () {
                    if (_postJobKey.currentState!.validate()) {
                      final job = JobModel(
                        id: 'job_${DateTime.now().millisecondsSinceEpoch}',
                        title: _titleCtrl.text.trim(),
                        employerId: state.currentUser.id,
                        companyName: 'Apex Global Logistics',
                        category: _categoryCtrl.text.trim(),
                        description: _descCtrl.text.trim(),
                        requirements: _reqCtrl.text.trim(),
                        skills: _skillsCtrl.text.split(',').map((s) => s.trim()).toList(),
                        location: _locationCtrl.text.trim(),
                        salary: _salaryCtrl.text.trim(),
                      );
                      state.postJob(job);
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Job posted and live on marketplace!')));
                      Navigator.pop(context);
                    }
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
                  child: const Text('Publish Job Listing'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMyJobsScreen(BuildContext context) {
    final state = AppState.instance;
    return AppScaffold(
      title: 'My Job Postings',
      currentRoute: '/employer/jobs',
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.pushNamed(context, '/employer/jobs/new'),
        child: const Icon(Icons.add),
      ),
      body: ListView(
        padding: const EdgeInsets.all(14),
        children: state.jobs.map((j) {
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              title: Text(j.title, style: const TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text('${j.location} • ${j.applicantsCount} applicants'),
              trailing: Chip(label: Text(j.status)),
              onTap: () => Navigator.pushNamed(context, '/jobs/${j.id}'),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildApplicantsScreen(BuildContext context) {
    final state = AppState.instance;
    return AppScaffold(
      title: 'Job Applicants',
      currentRoute: '/employer/applicants',
      body: ListView(
        padding: const EdgeInsets.all(14),
        children: state.jobApplications.map((app) {
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(app.applicantName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                      Chip(label: Text(app.status)),
                    ],
                  ),
                  Text('Applied for: ${app.jobTitle}'),
                  Text('Email: ${app.applicantEmail} • Phone: ${app.applicantPhone}'),
                  const SizedBox(height: 6),
                  Text('Cover: "${app.coverLetter}"', style: const TextStyle(fontStyle: FontStyle.italic, fontSize: 12)),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      ElevatedButton(
                        onPressed: () {
                          state.updateApplicationStatus(app.id, 'Shortlisted');
                          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Applicant shortlisted!')));
                        },
                        child: const Text('Shortlist'),
                      ),
                      const SizedBox(width: 8),
                      OutlinedButton(
                        onPressed: () {
                          state.updateApplicationStatus(app.id, 'Interview', interviewDate: 'Tomorrow at 11:00 AM');
                          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Interview invitation sent!')));
                        },
                        child: const Text('Invite to Interview'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildSavedWorkersScreen(BuildContext context) {
    final state = AppState.instance;
    final saved = state.workers.where((w) => w.isSaved).toList();

    return AppScaffold(
      title: 'Saved Talent & Workers',
      currentRoute: '/employer/saved-workers',
      body: saved.isEmpty
          ? const Center(child: Text('No saved workers yet.'))
          : ListView(
              padding: const EdgeInsets.all(14),
              children: saved.map((w) {
                return Card(
                  child: ListTile(
                    leading: const CircleAvatar(child: Icon(Icons.person)),
                    title: Text(w.fullName, style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text(w.professionalTitle),
                    trailing: ElevatedButton(
                      onPressed: () => Navigator.pushNamed(context, '/workers/${w.id}'),
                      child: const Text('View'),
                    ),
                  ),
                );
              }).toList(),
            ),
    );
  }

  Widget _buildCompanyScreen(BuildContext context) {
    return AppScaffold(
      title: 'Company Profile',
      currentRoute: '/employer/company',
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text('Apex Global Logistics', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                SizedBox(height: 4),
                Text('Industry: Supply Chain, E-commerce Logistics, Freight'),
                Text('Headquarters: Victoria Island, Lagos'),
                Text('Phone: +234 809 123 4567'),
                Text('Email: hr@apexlogistics.com'),
                Text('Verification: Verified Enterprise Employer'),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _empMetric(String label, String val, IconData icon, Color bg, Color iconColor) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.borderLight),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(8)),
              child: Icon(icon, color: iconColor, size: 18),
            ),
            const SizedBox(height: 8),
            Text(val, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: AppColors.textPrimary)),
            Text(label, style: const TextStyle(fontSize: 10, color: AppColors.textSecondary)),
          ],
        ),
      ),
    );
  }
}
