import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../models/models.dart';
import '../services/app_state.dart';
import '../widgets/app_scaffold.dart';

class MessagesScreen extends StatefulWidget {
  final String? initialConversationId;

  const MessagesScreen({super.key, this.initialConversationId});

  @override
  State<MessagesScreen> createState() => _MessagesScreenState();
}

class _MessagesScreenState extends State<MessagesScreen> {
  final TextEditingController _msgInputCtrl = TextEditingController();
  final TextEditingController _searchCtrl = TextEditingController();
  String? _activeConvId;

  @override
  void initState() {
    super.initState();
    _activeConvId = widget.initialConversationId ?? (AppState.instance.conversations.isNotEmpty ? AppState.instance.conversations.first.id : null);
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: AppState.instance,
      builder: (context, _) {
        final state = AppState.instance;
        final conversations = state.conversations;

        ConversationModel? activeConv;
        if (_activeConvId != null) {
          try {
            activeConv = conversations.firstWhere((c) => c.id == _activeConvId);
          } catch (_) {
            activeConv = conversations.isNotEmpty ? conversations.first : null;
          }
        }

        return AppScaffold(
          title: 'Messages & Live Chat',
          currentRoute: '/messages',
          body: Row(
            children: [
              // Left: Conversation List (or full width if mobile and no active chat opened)
              Container(
                width: MediaQuery.of(context).size.width > 600 ? 320 : double.infinity,
                decoration: const BoxDecoration(
                  color: Colors.white,
                  border: Border(right: BorderSide(color: AppColors.border, width: 0.5)),
                ),
                child: Column(
                  children: [
                    // Search Conversations
                    Padding(
                      padding: const EdgeInsets.all(12),
                      child: TextField(
                        controller: _searchCtrl,
                        onChanged: (_) => setState(() {}),
                        decoration: InputDecoration(
                          hintText: 'Search chats...',
                          prefixIcon: const Icon(Icons.search, size: 20),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.border)),
                          contentPadding: const EdgeInsets.symmetric(vertical: 8),
                          isDense: true,
                        ),
                      ),
                    ),
                    const Divider(height: 1),

                    // Conversations
                    Expanded(
                      child: ListView.builder(
                        itemCount: conversations.length,
                        itemBuilder: (ctx, i) {
                          final c = conversations[i];
                          final isSelected = c.id == _activeConvId;

                          return ListTile(
                            selected: isSelected,
                            selectedTileColor: AppColors.primaryLight.withAlpha(100),
                            leading: CircleAvatar(
                              backgroundColor: AppColors.primaryLight,
                              child: Text(c.otherUserName.substring(0, 1), style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary)),
                            ),
                            title: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(child: Text(c.otherUserName, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13))),
                                Text(c.lastMessageTime, style: const TextStyle(fontSize: 10, color: AppColors.textMuted)),
                              ],
                            ),
                            subtitle: Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                                  margin: const EdgeInsets.only(right: 6),
                                  decoration: BoxDecoration(color: AppColors.scaffoldBg, borderRadius: BorderRadius.circular(4)),
                                  child: Text(c.otherUserRole, style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: AppColors.primary)),
                                ),
                                Expanded(child: Text(c.lastMessage, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 11))),
                              ],
                            ),
                            onTap: () {
                              setState(() => _activeConvId = c.id);
                              if (MediaQuery.of(context).size.width <= 600) {
                                _openMobileChatSheet(context, state, c);
                              }
                            },
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),

              // Right: Chat thread (Desktop view)
              if (MediaQuery.of(context).size.width > 600 && activeConv != null)
                Expanded(
                  child: _buildChatThread(context, state, activeConv),
                ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildChatThread(BuildContext context, AppState state, ConversationModel conv) {
    return Container(
      color: AppColors.scaffoldBg,
      child: Column(
        children: [
          // Chat Top Header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            color: Colors.white,
            child: Row(
              children: [
                CircleAvatar(
                  backgroundColor: AppColors.primaryLight,
                  child: Text(conv.otherUserName.substring(0, 1), style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary)),
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(conv.otherUserName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                    Text('${conv.otherUserRole} • Online', style: const TextStyle(color: AppColors.success, fontSize: 11, fontWeight: FontWeight.w600)),
                  ],
                ),
                const Spacer(),
                IconButton(
                  icon: const Icon(Icons.phone_outlined),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Calling ${conv.otherUserName}...')));
                  },
                ),
              ],
            ),
          ),
          const Divider(height: 1),

          // Messages Bubble list
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: conv.messages.length,
              itemBuilder: (ctx, i) {
                final msg = conv.messages[i];
                return Align(
                  alignment: msg.isMe ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.45),
                    decoration: BoxDecoration(
                      color: msg.isMe ? AppColors.primary : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 2, offset: Offset(0, 1))],
                    ),
                    child: Column(
                      crossAxisAlignment: msg.isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                      children: [
                        Text(
                          msg.message,
                          style: TextStyle(color: msg.isMe ? Colors.white : AppColors.textPrimary, fontSize: 13),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          msg.timestamp,
                          style: TextStyle(color: msg.isMe ? Colors.white70 : AppColors.textMuted, fontSize: 9),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          // Input Bar
          Container(
            padding: const EdgeInsets.all(12),
            color: Colors.white,
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    decoration: BoxDecoration(color: AppColors.scaffoldBg, borderRadius: BorderRadius.circular(20)),
                    child: TextField(
                      controller: _msgInputCtrl,
                      decoration: const InputDecoration(hintText: 'Type a message...', border: InputBorder.none),
                      onSubmitted: (text) {
                        if (text.trim().isNotEmpty) {
                          state.sendMessage(conv.id, text.trim());
                          _msgInputCtrl.clear();
                        }
                      },
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                CircleAvatar(
                  backgroundColor: AppColors.primary,
                  child: IconButton(
                    icon: const Icon(Icons.send_rounded, color: Colors.white, size: 18),
                    onPressed: () {
                      if (_msgInputCtrl.text.trim().isNotEmpty) {
                        state.sendMessage(conv.id, _msgInputCtrl.text.trim());
                        _msgInputCtrl.clear();
                      }
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

  void _openMobileChatSheet(BuildContext context, AppState state, ConversationModel conv) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) => SizedBox(
          height: MediaQuery.of(context).size.height * 0.85,
          child: _buildChatThread(context, state, conv),
        ),
      ),
    );
  }
}
