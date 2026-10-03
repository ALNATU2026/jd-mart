import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bell,
  Volume2,
  VolumeX,
  Search,
  User as UserIcon,
  Store as StoreIcon,
  Briefcase,
  Bike,
  Shield,
  CheckCheck,
  Sparkles,
  PhoneCall,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playMessageSound, requestNotificationPermission } from '../lib/notificationSounds';
import { ChatMessage } from '../types';

export const ChatMessengerWidget: React.FC = () => {
  const {
    currentUser,
    messages,
    sendMessage,
    activeChatRecipient,
    openChatWithUser,
    closeChatModal,
    isChatDrawerOpen,
    setIsChatDrawerOpen,
    testNotificationAlert,
    stores,
    jobs,
    users,
    showToast,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    return typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default';
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages in active thread
  useEffect(() => {
    if (isChatDrawerOpen && activeChatRecipient) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeChatRecipient, isChatDrawerOpen]);

  // Total unread messages for currentUser
  const unreadCount = useMemo(() => {
    if (!currentUser) return 0;
    return messages.filter(
      (m) => (m.recipientId === currentUser.id || m.receiverId === currentUser.id) && m.senderId !== currentUser.id && !m.read
    ).length;
  }, [messages, currentUser]);

  // Group messages by conversation partner
  const conversations = useMemo(() => {
    if (!currentUser) return [];
    const map = new Map<
      string,
      {
        partnerId: string;
        partnerName: string;
        partnerRole?: string;
        lastMessage: ChatMessage;
        unread: number;
      }
    >();

    messages.forEach((m) => {
      const isSender = m.senderId === currentUser.id;
      const isRecipient = m.recipientId === currentUser.id || m.receiverId === currentUser.id;
      if (!isSender && !isRecipient) return;

      const partnerId = isSender ? m.recipientId : m.senderId;
      const partnerName = isSender ? m.recipientName : m.senderName;
      const partnerRole = isSender ? undefined : m.senderRole;

      const existing = map.get(partnerId);
      if (!existing || new Date(m.createdAt) > new Date(existing.lastMessage.createdAt)) {
        map.set(partnerId, {
          partnerId,
          partnerName: partnerName || 'JD Mart User',
          partnerRole,
          lastMessage: m,
          unread: (existing?.unread || 0) + (!isSender && !m.read ? 1 : 0),
        });
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    );
  }, [messages, currentUser]);

  // Filtered contacts / directory to start new chat
  const directoryContacts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const list: Array<{ id: string; name: string; role: string; type: 'store' | 'employer' | 'user' | 'support' }> = [];

    // Always include Central Support
    list.push({ id: 'jdmart-support', name: 'JD Mart Customer Support', role: 'Support Team', type: 'support' });

    // Stores / Sellers
    stores.forEach((s) => {
      if (s.sellerId !== currentUser?.id) {
        list.push({ id: s.sellerId || s.id, name: s.name, role: 'Verified Merchant', type: 'store' });
      }
    });

    // Employers
    jobs.forEach((j) => {
      if (j.employerId && j.employerId !== currentUser?.id && !list.some((l) => l.id === j.employerId)) {
        list.push({ id: j.employerId, name: j.employerName, role: 'Employer', type: 'employer' });
      }
    });

    // Other Users
    users.forEach((u) => {
      if (u.id !== currentUser?.id && !list.some((l) => l.id === u.id)) {
        list.push({ id: u.id, name: u.name, role: u.role, type: 'user' });
      }
    });

    if (!q) return list.slice(0, 15);
    return list.filter((c) => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q)).slice(0, 20);
  }, [stores, jobs, users, currentUser, searchQuery]);

  // Active chat message thread
  const activeThread = useMemo(() => {
    if (!currentUser || !activeChatRecipient) return [];
    return messages
      .filter((m) => {
        const between =
          (m.senderId === currentUser.id && (m.recipientId === activeChatRecipient.id || m.receiverId === activeChatRecipient.id)) ||
          ((m.recipientId === currentUser.id || m.receiverId === currentUser.id) && m.senderId === activeChatRecipient.id);
        return between;
      })
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [messages, currentUser, activeChatRecipient]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeChatRecipient) return;

    const textToSend = inputText.trim();
    setInputText('');

    if (soundEnabled) {
      playMessageSound();
    }

    await sendMessage(activeChatRecipient.id, activeChatRecipient.name, textToSend);
  };

  const handleRequestPush = async () => {
    const res = await requestNotificationPermission();
    setNotificationPermission(res);
    if (res === 'granted') {
      showToast('Phone notifications enabled! You will receive pop-ups on your device.');
      testNotificationAlert();
    } else {
      showToast('Notification permission was not granted.');
    }
  };

  // If user is not logged in, render minimal login prompt if opened
  if (!currentUser) {
    return (
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={() => showToast('Please sign in to chat with sellers, riders, and employers.')}
          className="flex items-center gap-2 px-4 py-3 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-full shadow-xl transition-transform hover:scale-105"
          title="Sign in to chat"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-xs font-bold hidden sm:inline">Chat with Sellers & Support</span>
        </button>
      </div>
    );
  }

  return (
    <>
      {/* FLOATING ACTION DOCK BUTTON */}
      {!isChatDrawerOpen && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2">
          <button
            onClick={() => setIsChatDrawerOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-linear-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95"
            title="Open Live Chat Messenger"
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5 text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white shadow-xs animate-bounce">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="text-xs font-black tracking-tight hidden sm:inline">
              Chat Flow ({conversations.length})
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>
      )}

      {/* DOCKED CHAT MESSENGER WINDOW */}
      {isChatDrawerOpen && (
        <div
          className={`fixed bottom-0 sm:bottom-6 right-0 sm:right-6 z-50 w-full sm:w-[390px] ${
            isMinimized ? 'h-14' : 'h-[580px] max-h-[90vh]'
          } bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-bottom-6`}
        >
          {/* HEADER */}
          <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-3.5 px-4 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-2.5 min-w-0">
              {activeChatRecipient ? (
                <button
                  onClick={closeChatModal}
                  className="p-1 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
                  title="Back to conversation list"
                >
                  ←
                </button>
              ) : (
                <div className="w-7 h-7 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-blue-300" />
                </div>
              )}

              <div className="min-w-0">
                <h3 className="text-xs font-black truncate flex items-center gap-1.5">
                  <span>{activeChatRecipient ? activeChatRecipient.name : 'JD Mart Live Chat'}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                </h3>
                <p className="text-[10px] text-blue-200/80 truncate">
                  {activeChatRecipient
                    ? activeChatRecipient.role || 'Active User'
                    : 'Instant Sound & Phone Alerts Active'}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setSoundEnabled((prev) => !prev)}
                className={`p-1.5 rounded-lg transition-colors ${
                  soundEnabled ? 'text-emerald-300 hover:bg-white/10' : 'text-slate-400 hover:bg-white/10'
                }`}
                title={soundEnabled ? 'Chime sound is ON' : 'Chime sound is MUTED'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={testNotificationAlert}
                className="p-1.5 text-amber-300 hover:bg-white/10 rounded-lg transition-colors"
                title="Test Sound & Phone Pop-up"
              >
                <Sparkles className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsMinimized((prev) => !prev)}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => {
                  setIsChatDrawerOpen(false);
                  closeChatModal();
                }}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Close chat dock"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* NOTIFICATION PERMISSION BANNER (If not yet granted) */}
              {notificationPermission !== 'granted' && (
                <div className="bg-amber-50 border-b border-amber-200 px-3.5 py-2 flex items-center justify-between text-[11px] text-amber-900 shrink-0">
                  <div className="flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Get sound & pop-ups on your phone</span>
                  </div>
                  <button
                    onClick={handleRequestPush}
                    className="px-2.5 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-[10px] font-bold shrink-0 transition-colors"
                  >
                    Enable
                  </button>
                </div>
              )}

              {/* VIEW 1: ACTIVE CHAT CONVERSATION */}
              {activeChatRecipient ? (
                <div className="flex-1 flex flex-col min-h-0 bg-[#F8FAFC]">
                  {/* Message Stream */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {activeThread.length === 0 ? (
                      <div className="py-12 text-center space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1E40AF] flex items-center justify-center mx-auto">
                          <MessageSquare className="w-6 h-6" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-800">
                          Start chatting with {activeChatRecipient.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 max-w-[220px] mx-auto">
                          Messages are sent in real-time with instant sound alerts and phone push notifications.
                        </p>
                      </div>
                    ) : (
                      activeThread.map((msg) => {
                        const isMe = msg.senderId === currentUser.id;
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                          >
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1">
                              <span className="font-semibold text-slate-600">
                                {isMe ? 'You' : msg.senderName}
                              </span>
                              <span>•</span>
                              <span>
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>

                            <div
                              className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-xs ${
                                isMe
                                  ? 'bg-[#1E40AF] text-white rounded-tr-xs'
                                  : 'bg-white text-slate-900 border border-slate-200/80 rounded-tl-xs'
                              }`}
                            >
                              <p className="break-words">{msg.text}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input Box */}
                  <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={`Message ${activeChatRecipient.name}...`}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E40AF]"
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="p-2.5 bg-[#1E40AF] hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition-all shrink-0 active:scale-95"
                      title="Send message"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              ) : (
                /* VIEW 2: CONVERSATIONS & USER DIRECTORY */
                <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
                  {/* Search Directory Filter */}
                  <div className="p-3 bg-white border-b border-slate-200">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search stores, employers, riders..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-hidden focus:border-[#1E40AF]"
                      />
                    </div>
                  </div>

                  {/* List Container */}
                  <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                    {/* Active Conversation Threads */}
                    {conversations.length > 0 && !searchQuery && (
                      <div className="p-2 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                          Recent Chats
                        </span>
                        {conversations.map((c) => (
                          <button
                            key={c.partnerId}
                            onClick={() => openChatWithUser(c.partnerId, c.partnerName, undefined, c.partnerRole)}
                            className="w-full p-2.5 rounded-2xl bg-white hover:bg-blue-50 border border-slate-200/60 hover:border-blue-200 transition-all flex items-center justify-between text-left group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#1E40AF] flex items-center justify-center font-bold text-xs shrink-0">
                                {c.partnerName.slice(0, 2).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#1E40AF]">
                                  {c.partnerName}
                                </h4>
                                <p className="text-[11px] text-slate-500 truncate">{c.lastMessage.text}</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[10px] text-slate-400 block">
                                {new Date(c.lastMessage.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              {c.unread > 0 && (
                                <span className="inline-block px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[9px] font-black">
                                  {c.unread}
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Directory to start new conversation */}
                    <div className="p-2 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                        {searchQuery ? 'Search Results' : 'Contacts Directory'}
                      </span>
                      {directoryContacts.map((contact) => (
                        <button
                          key={contact.id}
                          onClick={() => openChatWithUser(contact.id, contact.name, undefined, contact.role)}
                          className="w-full p-2.5 rounded-2xl bg-white hover:bg-slate-100/80 border border-slate-200/60 transition-all flex items-center justify-between text-left"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                              {contact.type === 'store' ? (
                                <StoreIcon className="w-4 h-4 text-emerald-600" />
                              ) : contact.type === 'employer' ? (
                                <Briefcase className="w-4 h-4 text-blue-600" />
                              ) : contact.type === 'support' ? (
                                <Shield className="w-4 h-4 text-indigo-600" />
                              ) : (
                                <UserIcon className="w-4 h-4 text-slate-500" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 truncate">{contact.name}</h4>
                              <p className="text-[10px] text-slate-400 truncate">{contact.role}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-[#1E40AF] px-2 py-0.5 bg-blue-50 rounded-lg shrink-0">
                            Chat
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};
