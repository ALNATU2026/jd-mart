import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../services/app_state.dart';
import '../widgets/app_scaffold.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: AppState.instance,
      builder: (context, _) {
        final state = AppState.instance;
        final list = state.notifications;

        return AppScaffold(
          title: 'Notifications',
          currentRoute: '/notifications',
          body: Column(
            children: [
              // Header with mark all as read
              Container(
                color: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${state.unreadNotificationsCount} Unread Notifications',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.textSecondary),
                    ),
                    TextButton.icon(
                      onPressed: () {
                        state.markAllNotificationsRead();
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('All notifications marked as read.')),
                        );
                      },
                      icon: const Icon(Icons.done_all, size: 16),
                      label: const Text('Mark all as read'),
                    ),
                  ],
                ),
              ),

              Expanded(
                child: list.isEmpty
                    ? const Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.notifications_off_outlined, size: 54, color: AppColors.textMuted),
                            SizedBox(height: 12),
                            Text('No notifications', style: TextStyle(fontWeight: FontWeight.bold)),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(12),
                        itemCount: list.length,
                        itemBuilder: (ctx, i) {
                          final n = list[i];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 8),
                            color: n.isRead ? Colors.white : AppColors.primaryLight.withAlpha(80),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            child: ListTile(
                              leading: CircleAvatar(
                                backgroundColor: n.iconColor.withAlpha(30),
                                child: Icon(n.icon, color: n.iconColor, size: 20),
                              ),
                              title: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(child: Text(n.title, style: TextStyle(fontWeight: n.isRead ? FontWeight.w600 : FontWeight.bold, fontSize: 13))),
                                  Text(n.time, style: const TextStyle(fontSize: 10, color: AppColors.textMuted)),
                                ],
                              ),
                              subtitle: Padding(
                                padding: const EdgeInsets.only(top: 4),
                                child: Text(n.description, style: const TextStyle(fontSize: 12, height: 1.3)),
                              ),
                              onTap: () {
                                state.markNotificationRead(n.id);
                              },
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
}
