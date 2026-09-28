import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../models/models.dart';
import '../services/app_state.dart';
import '../widgets/app_scaffold.dart';

class JobSeekerScreens extends StatelessWidget {
  final String mode; // 'dashboard', 'applications', 'saved', 'cv', 'profile'
  final String? appId;

  const JobSeekerScreens({super.key, required this.mode, this.appId});

  @override
  Widget build(BuildContext context) {
    if (mode == 'applications') return _buildApplicationsScreen(context);
    if (mode == 'saved') return _buildSavedJobsScreen(context);
    if (mode == 'cv') return _buildCvScreen(context);
    if (mode == 'profile') return _buildProfileScreen(context);

    return _buildDashboardScreen(context);
  }

  Widget _buildDashboardScreen(BuildContext context) {
    return AnimatedBuilder(
      animation: AppState.instance,
      builder: (context, _) {
        final state = AppState.instance;
        final myApps = state.jobApplications.where((a) => a.applicantId == state.currentUser.id).toList();

        return AppScaffold(
          title: 'Job Seeker Dashboard',
          currentRoute: '/job-seeker',
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Header Card
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF0284C7), Color(0xFF0EA5E9)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    children: [
                      const CircleAvatar(radius: 26, backgroundColor: Colors.white24, child: Icon(Icons.person, color: Colors.white, size: 28)),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(state.currentUser.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                            const SizedBox(height: 2),
                            const Text('Full Stack & Mobile Engineer', style: TextStyle(color: Colors.white70, fontSize: 12)),
                            const SizedBox(height: 6),
                            const Text('Profile Completion: 90%', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 11)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Fast Stats
                Row(
                  children: [
                    _seekerStat('Applications', '${myApps.length}', Icons.assignment_outlined, AppColors.primaryLight, AppColors.primary),
                    const SizedBox(width: 10),
                    _seekerStat('Shortlisted', '${myApps.where((a) => a.status == "Shortlisted" || a.status == "Interview").length}', Icons.check_circle_outline, AppColors.successLight, AppColors.success),
                    const SizedBox(width: 10),
                    _seekerStat('Saved Jobs', '4', Icons.bookmark_outline, AppColors.secondaryLight, AppColors.secondary),
                  ],
                ),
                const SizedBox(height: 20),

                // Quick Navigation Actions
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () => Navigator.pushNamed(context, '/jobs'),
                        icon: const Icon(Icons.search, size: 16),
                        label: const Text('Find Jobs'),
                        style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () => Navigator.pushNamed(context, '/job-seeker/cv'),
                        icon: const Icon(Icons.description_outlined, size: 16),
                        label: const Text('My CV'),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // My Applications preview
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Recent Applications', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                    TextButton(
                      onPressed: () => Navigator.pushNamed(context, '/job-seeker/applications'),
                      child: const Text('View All', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary)),
                    ),
                  ],
                ),
                if (myApps.isEmpty)
                  const Padding(padding: EdgeInsets.all(16), child: Text('No applications submitted yet.'))
                else
                  ...myApps.take(2).map((app) {
                    return Card(
                      margin: const EdgeInsets.only(bottom: 10),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      child: ListTile(
                        leading: const CircleAvatar(child: Icon(Icons.work)),
                        title: Text(app.jobTitle, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                        subtitle: Text('${app.companyName} • Applied ${app.appliedDate}'),
                        trailing: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(color: AppColors.successLight, borderRadius: BorderRadius.circular(6)),
                          child: Text(app.status, style: const TextStyle(color: AppColors.success, fontWeight: FontWeight.bold, fontSize: 10)),
                        ),
                      ),
                    );
                  }),
                const SizedBox(height: 20),

                // Recommended Jobs
                const Text('Recommended for Your Skills', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                const SizedBox(height: 10),
                ...state.jobs.take(2).map((j) {
                  return Card(
                    margin: const EdgeInsets.only(bottom: 10),
                    child: ListTile(
                      title: Text(j.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                      subtitle: Text('${j.companyName} • ${j.salary}'),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () => Navigator.pushNamed(context, '/jobs/${j.id}'),
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

  Widget _buildApplicationsScreen(BuildContext context) {
    final state = AppState.instance;
    final apps = state.jobApplications;

    return AppScaffold(
      title: 'My Applications',
      currentRoute: '/job-seeker/applications',
      body: apps.isEmpty
          ? const Center(child: Text('No job applications found.'))
          : ListView.builder(
              padding: const EdgeInsets.all(14),
              itemCount: apps.length,
              itemBuilder: (ctx, i) {
                final app = apps[i];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  child: Padding(
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(app.jobTitle, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(color: AppColors.primaryLight, borderRadius: BorderRadius.circular(6)),
                              child: Text(app.status, style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 11)),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(app.companyName, style: const TextStyle(color: AppColors.primary, fontSize: 12, fontWeight: FontWeight.w600)),
                        Text('Applied Date: ${app.appliedDate}', style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                        if (app.interviewDate != null) ...[
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(color: AppColors.successLight, borderRadius: BorderRadius.circular(8)),
                            child: Row(
                              children: [
                                const Icon(Icons.event, color: AppColors.success, size: 18),
                                const SizedBox(width: 8),
                                Text('Interview: ${app.interviewDate}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppColors.success)),
                              ],
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }

  Widget _buildSavedJobsScreen(BuildContext context) {
    final state = AppState.instance;
    return AppScaffold(
      title: 'Saved Jobs',
      currentRoute: '/job-seeker/saved-jobs',
      body: ListView(
        padding: const EdgeInsets.all(14),
        children: state.jobs.take(2).map((j) {
          return Card(
            margin: const EdgeInsets.only(bottom: 10),
            child: ListTile(
              title: Text(j.title, style: const TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text('${j.companyName} • ${j.location}'),
              trailing: ElevatedButton(
                onPressed: () => Navigator.pushNamed(context, '/jobs/${j.id}'),
                style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
                child: const Text('Apply'),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildCvScreen(BuildContext context) {
    return AppScaffold(
      title: 'My Curriculum Vitae (CV)',
      currentRoute: '/job-seeker/cv',
      body: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          children: [
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    const Icon(Icons.picture_as_pdf, color: Colors.red, size: 54),
                    const SizedBox(height: 12),
                    const Text('David_Adeyemi_Senior_Engineer_CV.pdf', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    const Text('Uploaded on Sep 20, 2026 • 240 KB', style: TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        ElevatedButton.icon(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Downloading CV...')));
                          },
                          icon: const Icon(Icons.download, size: 16),
                          label: const Text('Download'),
                          style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
                        ),
                        const SizedBox(width: 10),
                        OutlinedButton.icon(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Select new CV file from device storage.')));
                          },
                          icon: const Icon(Icons.upload_file, size: 16),
                          label: const Text('Replace CV'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileScreen(BuildContext context) {
    final state = AppState.instance;
    return AppScaffold(
      title: 'Candidate Profile',
      currentRoute: '/job-seeker/profile',
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
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(state.currentUser.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                    const Text('Full Stack Mobile & Web Architect', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 13)),
                    const SizedBox(height: 12),
                    const Text('Skills:', style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 6),
                    Wrap(
                      spacing: 6,
                      children: ['Flutter', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'GCP'].map((s) => Chip(label: Text(s, style: const TextStyle(fontSize: 10)))).toList(),
                    ),
                    const Divider(height: 24),
                    const Text('Education: B.Sc Computer Science'),
                    const Text('Experience: 5+ years building production applications'),
                    const Text('Expected Salary: Le 3,000 / month'),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _seekerStat(String label, String val, IconData icon, Color bg, Color iconColor) {
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
