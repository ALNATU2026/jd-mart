import React, { useState, useMemo } from 'react';
import {
  Shield,
  Users,
  UserCheck,
  Store,
  Bike,
  Package,
  Briefcase,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileText,
  Bell,
  Activity,
  HardDrive,
  Search,
  Filter,
  Calendar,
  Settings,
  Plus,
  Eye,
  Trash2,
  Edit,
  Send,
  MessageSquare,
  TrendingUp,
  BarChart2,
  ShieldAlert,
  Ban,
  RefreshCw,
  Key,
  ExternalLink,
  Layers,
  CreditCard,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Award,
  Sparkles,
  ShoppingBag,
  Star,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  User,
  UserRole,
  Product,
  Order,
  Store as StoreType,
  RiderDelivery,
  Job,
  JobApplication,
  PaymentRecord,
  AuditLog,
  PlatformComplaint,
  Category,
  RiderProfile,
  EmployerProfile,
} from '../types';

export type AdminTab =
  | 'overview'
  | 'users'
  | 'buyers'
  | 'sellers'
  | 'employers'
  | 'riders'
  | 'products'
  | 'categories'
  | 'orders'
  | 'deliveries'
  | 'payments'
  | 'payouts'
  | 'jobs'
  | 'applications'
  | 'reports'
  | 'complaints'
  | 'notifications'
  | 'messages'
  | 'analytics'
  | 'audit_logs'
  | 'settings';

export const AdminDashboardScreen: React.FC = () => {
  const {
    currentUser,
    users,
    products,
    categories,
    orders,
    stores,
    employerProfiles,
    riderProfiles,
    riderDeliveries,
    jobs,
    applications,
    payments,
    payouts,
    riderPayouts,
    reports,
    complaints,
    messages,
    notifications,
    auditLogs,
    platformSettings,
    approveSellerStore,
    rejectSellerStore,
    approveRiderApplication,
    rejectRiderApplication,
    suspendRiderAccount,
    activateRiderAccount,
    updateUserRolePermissions,
    setUserAccountStatus,
    moderateProduct,
    addCategory,
    deleteCategory,
    resolveComplaint,
    updatePlatformSettings,
    reassignDeliveryRider,
    adminCancelOrder,
    broadcastNotification,
    resolveReport,
    sendMessage,
    navigate,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Selected Modal States
  const [inspectUser, setInspectUser] = useState<User | null>(null);
  const [inspectOrder, setInspectOrder] = useState<Order | null>(null);
  const [inspectDelivery, setInspectDelivery] = useState<RiderDelivery | null>(null);
  const [inspectStore, setInspectStore] = useState<StoreType | null>(null);
  const [inspectRider, setInspectRider] = useState<RiderProfile | null>(null);
  const [inspectReport, setInspectReport] = useState<any | null>(null);

  // Action Reason Modals
  const [reasonInput, setReasonInput] = useState('');
  const [rejectingTarget, setRejectingTarget] = useState<{ id: string; type: 'seller' | 'rider' | 'product' | 'job' | 'order' } | null>(null);
  const [reassigningDeliveryId, setReassigningDeliveryId] = useState<string | null>(null);
  const [selectedNewRiderId, setSelectedNewRiderId] = useState<string>('');

  // Complaint Resolution Modal
  const [resolvingComplaint, setResolvingComplaint] = useState<PlatformComplaint | null>(null);
  const [complaintNotes, setComplaintNotes] = useState('');

  // Add Category Modal
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catIcon, setCatIcon] = useState('📦');
  const [catDesc, setCatDesc] = useState('');

  // Broadcast Notification Form
  const [broadcastTarget, setBroadcastTarget] = useState<'all' | 'sellers' | 'riders' | 'employers' | string>('all');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Send Direct Message
  const [recipientUserId, setRecipientUserId] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [messageText, setMessageText] = useState('');

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState(platformSettings);

  // Computed Metrics
  const totalGMV = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);
  const buyersList = useMemo(
    () => users.filter((u) => !u.role || u.role.toLowerCase() === 'buyer' || u.roles?.includes('BUYER')),
    [users]
  );
  const sellersList = useMemo(
    () => users.filter((u) => u.role?.toLowerCase() === 'seller' || u.roles?.includes('SELLER') || u.storeId),
    [users]
  );
  const ridersList = useMemo(
    () => riderProfiles.length > 0 ? riderProfiles : users.filter((u) => ['dispatcher', 'rider', 'dispatch_rider'].includes(u.role?.toLowerCase() || '') || u.roles?.includes('DISPATCH_RIDER')),
    [riderProfiles, users]
  );
  const employersList = useMemo(
    () => employerProfiles.length > 0 ? employerProfiles : users.filter((u) => u.role?.toLowerCase() === 'employer' || u.roles?.includes('EMPLOYER')),
    [employerProfiles, users]
  );

  const pendingSellersCount = stores.filter((s) => s.status === 'pending').length;
  const pendingRidersCount = riderProfiles.filter((r) => r.approvalStatus === 'pending').length;
  const pendingProductsCount = products.filter((p) => p.status === 'pending').length;
  const openComplaintsCount = complaints.filter((c) => c.status === 'Open').length;
  const openReportsCount = reports.filter((r) => r.status === 'pending' || r.status === 'investigating').length;

  // Handle Role Modification
  const handleToggleRole = async (userId: string, roleToToggle: 'SELLER' | 'EMPLOYER' | 'DISPATCH_RIDER', currentlyHas: boolean) => {
    await updateUserRolePermissions(userId, roleToToggle, !currentlyHas);
    if (inspectUser && inspectUser.id === userId) {
      const updatedUser = users.find((u) => u.id === userId);
      if (updatedUser) setInspectUser(updatedUser);
    }
  };

  // Handle Rejection
  const handleConfirmRejection = async () => {
    if (!rejectingTarget) return;
    const reason = reasonInput.trim() || 'Did not meet platform criteria.';

    if (rejectingTarget.type === 'seller') {
      await rejectSellerStore(rejectingTarget.id, reason);
    } else if (rejectingTarget.type === 'rider') {
      await rejectRiderApplication(rejectingTarget.id, reason);
    } else if (rejectingTarget.type === 'product') {
      await moderateProduct(rejectingTarget.id, 'reject', reason);
    } else if (rejectingTarget.type === 'order') {
      await adminCancelOrder(rejectingTarget.id, reason);
    }

    setRejectingTarget(null);
    setReasonInput('');
  };

  // Handle Reassignment
  const handleConfirmReassign = async () => {
    if (!reassigningDeliveryId || !selectedNewRiderId) {
      showToast('Please choose an active rider.');
      return;
    }
    const rider = riderProfiles.find((r) => r.id === selectedNewRiderId || r.userId === selectedNewRiderId);
    if (!rider) return;

    await reassignDeliveryRider(reassigningDeliveryId, rider.userId, rider.fullName, rider.phoneNumber);
    setReassigningDeliveryId(null);
    setSelectedNewRiderId('');
  };

  // Handle Add Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    await addCategory({
      name: catName.trim(),
      slug: catSlug.trim() || catName.toLowerCase().replace(/\s+/g, '-'),
      icon: catIcon.trim() || '📦',
      description: catDesc.trim(),
    });
    setCatName('');
    setCatSlug('');
    setCatDesc('');
    setShowAddCategoryModal(false);
  };

  // Handle Broadcast Notification
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    await broadcastNotification(broadcastTarget, broadcastTitle.trim(), broadcastMessage.trim());
    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  // Handle Direct Message
  const handleSendDirectMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientUserId || !messageText.trim()) return;
    await sendMessage(recipientUserId, recipientName || 'User', messageText.trim());
    setMessageText('');
    showToast(`Official message sent to ${recipientName || recipientUserId}!`);
  };

  // Handle Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePlatformSettings(settingsForm);
  };

  // Handle Resolve Complaint
  const handleConfirmResolveComplaint = async () => {
    if (!resolvingComplaint) return;
    await resolveComplaint(resolvingComplaint.id, complaintNotes.trim() || 'Issue resolved by administration.');
    setResolvingComplaint(null);
    setComplaintNotes('');
  };

  // Admin Navigation Tree Definition (All 21 sections)
  const navTree: { id: AdminTab; label: string; icon: any; badge?: number; alert?: boolean }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'users', label: 'Users', icon: Users, badge: users.length },
    { id: 'buyers', label: 'Buyers', icon: ShoppingBag, badge: buyersList.length },
    { id: 'sellers', label: 'Sellers', icon: Store, badge: pendingSellersCount > 0 ? pendingSellersCount : undefined, alert: pendingSellersCount > 0 },
    { id: 'employers', label: 'Employers', icon: Briefcase, badge: employerProfiles.length },
    { id: 'riders', label: 'Dispatch Riders', icon: Bike, badge: pendingRidersCount > 0 ? pendingRidersCount : undefined, alert: pendingRidersCount > 0 },
    { id: 'products', label: 'Products', icon: Package, badge: products.length },
    { id: 'categories', label: 'Categories', icon: Layers, badge: categories.length },
    { id: 'orders', label: 'Orders', icon: FileText, badge: orders.length },
    { id: 'deliveries', label: 'Deliveries', icon: NavigationIcon, badge: riderDeliveries.filter((d) => !['DELIVERED', 'FAILED', 'CANCELLED'].includes(d.status)).length || undefined },
    { id: 'payments', label: 'Payments', icon: CreditCard, badge: payments.length },
    { id: 'payouts', label: 'Payouts', icon: DollarSign, badge: payouts.filter((p) => p.status === 'Pending').length + riderPayouts.filter((r) => r.status === 'Pending').length || undefined, alert: true },
    { id: 'jobs', label: 'Jobs', icon: Award, badge: jobs.length },
    { id: 'applications', label: 'Applications', icon: UserCheck, badge: applications.length },
    { id: 'reports', label: 'Reports', icon: ShieldAlert, badge: openReportsCount || undefined, alert: openReportsCount > 0 },
    { id: 'complaints', label: 'Complaints', icon: AlertTriangle, badge: openComplaintsCount || undefined, alert: openComplaintsCount > 0 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'audit_logs', label: 'Audit Logs', icon: Clock, badge: auditLogs.length },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  function NavigationIcon(props: any) {
    return <Bike {...props} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER CONSOLE BANNER */}
        <div className="bg-linear-to-r from-slate-900 via-slate-800 to-[#1E40AF] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                <Shield className="w-3.5 h-3.5" />
                Root Administrator Authority
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-bold text-slate-200">
                JD Mart Core Control
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Administrative Command Console
            </h1>
            <p className="text-xs text-slate-300 flex flex-wrap items-center gap-2">
              <span>Admin: <strong className="text-white">{currentUser?.name || 'Authorized Director'}</strong> ({currentUser?.email})</span>
              <span>•</span>
              <span>RBAC Policy: <strong className="text-emerald-400">Strict Server-Enforced</strong></span>
              <span>•</span>
              <span>Audit Logging: <strong className="text-emerald-400">Active ({auditLogs.length} events)</strong></span>
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 self-start md:self-auto flex items-center gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-300 block uppercase">Platform GMV</span>
              <span className="text-xl font-black text-white">Le {totalGMV.toLocaleString()}</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <span className="text-[10px] font-bold text-slate-300 block uppercase">Active Orders</span>
              <span className="text-xl font-black text-amber-400">{orders.length}</span>
            </div>
          </div>
        </div>

        {/* ADMIN TAB NAVIGATION BAR (Complete 21 Sections) */}
        <div className="bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-xs overflow-x-auto scrollbar-none flex items-center gap-1">
          {navTree.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#1E40AF] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                } ${item.alert && !isActive ? 'text-amber-600 font-black animate-pulse' : ''}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isActive
                        ? 'bg-white text-blue-900'
                        : item.alert
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* 1. OVERVIEW TAB */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Action Alert Callouts */}
            {(pendingSellersCount > 0 || pendingRidersCount > 0 || openComplaintsCount > 0) && (
              <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>Immediate Administrative Attention Required:</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  {pendingSellersCount > 0 && (
                    <button
                      onClick={() => setActiveTab('sellers')}
                      className="px-3 py-1.5 bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold rounded-xl flex items-center gap-1"
                    >
                      <span>{pendingSellersCount} Seller Merchant Applications Pending</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {pendingRidersCount > 0 && (
                    <button
                      onClick={() => setActiveTab('riders')}
                      className="px-3 py-1.5 bg-orange-200 hover:bg-orange-300 text-orange-950 font-bold rounded-xl flex items-center gap-1"
                    >
                      <span>{pendingRidersCount} Dispatch Rider Licenses Pending</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {openComplaintsCount > 0 && (
                    <button
                      onClick={() => setActiveTab('complaints')}
                      className="px-3 py-1.5 bg-red-200 hover:bg-red-300 text-red-950 font-bold rounded-xl flex items-center gap-1"
                    >
                      <span>{openComplaintsCount} Open Customer/Merchant Complaints</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Platform Metrics KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Total Users</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{users.length}</p>
                <span className="text-[11px] font-bold text-blue-600">{buyersList.length} Buyers • {sellersList.length} Sellers</span>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Courier Fleet</span>
                <p className="text-2xl font-black text-orange-600 mt-1">{ridersList.length}</p>
                <span className="text-[11px] font-bold text-emerald-600">{riderDeliveries.length} total deliveries</span>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Products Catalog</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{products.length}</p>
                <span className="text-[11px] font-bold text-slate-400">{categories.length} categories active</span>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Job Marketplace</span>
                <p className="text-2xl font-black text-indigo-600 mt-1">{jobs.length}</p>
                <span className="text-[11px] font-bold text-slate-400">{applications.length} candidate applications</span>
              </div>
            </div>

            {/* Recent Audit Log Feed Preview */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Live Platform Audit Trail Feed
                </h3>
                <button
                  onClick={() => setActiveTab('audit_logs')}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>View Full Log ({auditLogs.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {auditLogs.slice(0, 4).map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-100 text-[#1E40AF] rounded-md font-mono text-[10px] font-black">
                          {log.action}
                        </span>
                        <span className="text-slate-400 text-[11px]">• Target: {log.targetType} (#{log.targetId})</span>
                      </div>
                      <p className="text-slate-700 font-semibold mt-1">{log.description}</p>
                    </div>
                    <span className="text-slate-400 text-[11px] shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. USERS TAB */}
        {/* ============================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">User Directory & Role Governance</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage accounts, grant/revoke permissions (SELLER, EMPLOYER, DISPATCH_RIDER), and enforce security
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="All">All Roles</option>
                  <option value="BUYER">BUYER</option>
                  <option value="SELLER">SELLER</option>
                  <option value="EMPLOYER">EMPLOYER</option>
                  <option value="DISPATCH_RIDER">DISPATCH_RIDER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Phone / City</th>
                      <th className="py-3 px-4">Assigned Roles</th>
                      <th className="py-3 px-4">Account Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users
                      .filter((u) => {
                        const matchesSearch =
                          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.phone.includes(searchTerm);
                        if (!matchesSearch) return false;
                        if (roleFilter === 'All') return true;
                        const userRoles = (u.roles || [u.role]).map((r) => String(r).toUpperCase());
                        return userRoles.includes(roleFilter);
                      })
                      .map((u) => {
                        const rolesArr = (u.roles && u.roles.length > 0 ? u.roles : [u.role]).map((r) =>
                          String(r).toUpperCase()
                        );
                        return (
                          <tr key={u.id} className="hover:bg-slate-50/60">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0">
                                  {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : u.name[0]}
                                </div>
                                <div>
                                  <span className="font-black text-slate-900 block">{u.name}</span>
                                  <span className="text-slate-400 text-[11px]">{u.email}</span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-slate-600">
                              <p>{u.phone || 'No phone'}</p>
                              <p className="text-[11px] text-slate-400">{u.city || 'Sierra Leone'}</p>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex flex-wrap gap-1">
                                {rolesArr.map((r) => (
                                  <span
                                    key={r}
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                                      r === 'ADMIN'
                                        ? 'bg-red-100 text-red-800'
                                        : r === 'SELLER'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : r === 'DISPATCH_RIDER'
                                        ? 'bg-orange-100 text-orange-800'
                                        : r === 'EMPLOYER'
                                        ? 'bg-indigo-100 text-indigo-800'
                                        : 'bg-blue-50 text-[#1E40AF]'
                                    }`}
                                  >
                                    {r}
                                  </span>
                                ))}
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                  u.status === 'active'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : u.status === 'suspended'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {u.status}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setInspectUser(u)}
                                  className="px-3 py-1.5 bg-[#1E40AF] text-white rounded-xl font-bold hover:bg-blue-700"
                                >
                                  Manage Permissions
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. BUYERS TAB */}
        {/* ============================================================== */}
        {activeTab === 'buyers' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900">Buyer Customer Accounts</h2>
                <p className="text-xs text-slate-500">Retail marketplace buyers across Sierra Leone</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-[#1E40AF] rounded-full text-xs font-black">
                {buyersList.length} Buyers
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {buyersList.map((b) => (
                <div key={b.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">{b.name}</h3>
                      <p className="text-slate-400 text-[11px]">{b.email} • {b.phone}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {b.status}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <p className="text-slate-600">Location: {b.address || 'Address on file'}, {b.city || 'Freetown'}</p>
                    <p className="text-slate-400 text-[11px]">Orders placed: {orders.filter((o) => o.buyerId === b.id).length} purchases</p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        const newStatus = b.status === 'suspended' ? 'active' : 'suspended';
                        setUserAccountStatus(b.id, newStatus);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold ${
                        b.status === 'suspended' ? 'bg-emerald-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                    >
                      {b.status === 'suspended' ? 'Reactivate Buyer' : 'Suspend Account'}
                    </button>
                    <button
                      onClick={() => setInspectUser(b)}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
                    >
                      Permissions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 4. SELLERS TAB */}
        {/* ============================================================== */}
        {activeTab === 'sellers' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Seller Merchant Management</h2>
                <p className="text-xs text-slate-500">Approve merchant registrations, review documents, and manage stores</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black">
                  {pendingSellersCount} Pending
                </span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black">
                  {stores.filter((s) => s.status === 'active').length} Active Stores
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black shrink-0 text-base">
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-slate-900">{store.name}</h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            store.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : store.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {store.status}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">{store.category} • Location: {store.location} • Phone: {store.phone}</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">Rating: ★ {store.rating || '5.0'} • Total Sales: Le {store.totalSales || 0}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
                    {store.status === 'pending' && (
                      <>
                        <button
                          onClick={() => approveSellerStore(store.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve Seller</span>
                        </button>
                        <button
                          onClick={() => setRejectingTarget({ id: store.id, type: 'seller' })}
                          className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl font-bold"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {store.status === 'active' && (
                      <button
                        onClick={() => rejectSellerStore(store.id, 'Administrative suspension')}
                        className="px-3.5 py-2 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-xl font-bold"
                      >
                        Suspend Store
                      </button>
                    )}

                    <button
                      onClick={() => setInspectStore(store)}
                      className="px-3.5 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                    >
                      Inspect Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 5. EMPLOYERS TAB */}
        {/* ============================================================== */}
        {activeTab === 'employers' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900">Employer & Hiring Company Directory</h2>
                <p className="text-xs text-slate-500">Corporate and organizational employers seeking workers</p>
              </div>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-black">
                {employerProfiles.length} Registered Employers
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employerProfiles.map((emp) => (
                <div key={emp.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900">{emp.companyName}</h3>
                        <p className="text-slate-500 text-[11px]">{emp.industry} • {emp.companySize}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                      {emp.verificationStatus}
                    </span>
                  </div>

                  <p className="text-slate-600 line-clamp-2">{emp.description || 'Verified enterprise employer on JD Mart.'}</p>
                  <p className="text-slate-400 text-[11px]">Location: {emp.location} • Phone: {emp.phone} • Email: {emp.email}</p>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => showToast(`Employer ${emp.companyName} verified`)}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl font-bold"
                    >
                      Verify Company
                    </button>
                    <button
                      onClick={() => setActiveTab('jobs')}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
                    >
                      View Posted Jobs
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 6. DISPATCH RIDERS TAB */}
        {/* ============================================================== */}
        {activeTab === 'riders' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Courier Fleet Moderation</h2>
                <p className="text-xs text-slate-500">Review motorbike registrations, driver licenses, and approve couriers</p>
              </div>
              <button
                onClick={() => navigate('/admin/riders')}
                className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 shadow-xs"
              >
                Open Full Fleet Manager &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {riderProfiles.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-black shrink-0">
                      <Bike className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-slate-900">{r.fullName}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {r.approvalStatus}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#1E40AF] text-[10px] font-bold">
                          Duty: {r.availability}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">{r.vehicleType} Plate: {r.vehicleRegistrationNumber} • Phone: {r.phoneNumber}</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">License: {r.driverLicenseNumber} • Deliveries: {r.totalDeliveries || 0}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
                    {r.approvalStatus === 'pending' && (
                      <button
                        onClick={() => approveRiderApplication(r.id)}
                        className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl"
                      >
                        Approve Rider
                      </button>
                    )}
                    {r.accountStatus === 'active' ? (
                      <button
                        onClick={() => suspendRiderAccount(r.id)}
                        className="px-3.5 py-2 bg-amber-50 text-amber-800 font-bold rounded-xl"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => activateRiderAccount(r.id)}
                        className="px-3.5 py-2 bg-blue-600 text-white font-bold rounded-xl"
                      >
                        Reactivate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 7. PRODUCTS TAB */}
        {/* ============================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Product Moderation Catalog</h2>
                <p className="text-xs text-slate-500">Review marketplace items, feature listings, or delete policy violations</p>
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-black">
                {products.length} Products Listed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((p) => (
                <div key={p.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 text-xs">
                  <div className="flex items-start gap-3">
                    <img src={p.image} alt="" className="w-14 h-14 rounded-2xl object-cover shrink-0 bg-slate-100" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-black text-slate-900 line-clamp-1">{p.title}</h4>
                        <span className="font-black text-emerald-600 text-sm">Le {p.price}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">Merchant: {p.sellerName} • {p.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                          Status: {p.status}
                        </span>
                        {p.featured && (
                          <span className="px-2 py-0.2 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => moderateProduct(p.id, 'toggleFeatured')}
                      className="px-3 py-1.5 bg-amber-50 text-amber-800 rounded-xl font-bold hover:bg-amber-100"
                    >
                      {p.featured ? 'Unfeature' : 'Feature on Home'}
                    </button>
                    {p.status === 'hidden' ? (
                      <button
                        onClick={() => moderateProduct(p.id, 'unhide')}
                        className="px-3 py-1.5 bg-blue-50 text-[#1E40AF] rounded-xl font-bold"
                      >
                        Unhide
                      </button>
                    ) : (
                      <button
                        onClick={() => moderateProduct(p.id, 'hide')}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
                      >
                        Hide Listing
                      </button>
                    )}
                    <button
                      onClick={() => moderateProduct(p.id, 'delete')}
                      className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl font-bold ml-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 8. CATEGORIES TAB */}
        {/* ============================================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900">Product Categories Governance</h2>
                <p className="text-xs text-slate-500">Organize catalog taxonomies and marketplace filters</p>
              </div>
              <button
                onClick={() => setShowAddCategoryModal(true)}
                className="px-4 py-2 bg-[#1E40AF] text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categories.map((c) => (
                <div key={c.id} className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="text-2xl">{c.icon}</span>
                    <button
                      onClick={() => deleteCategory(c.id)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-black text-slate-900">{c.name}</h4>
                  <p className="text-slate-400 text-[11px] font-mono">/{c.slug}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 9. ORDERS TAB */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900">Master Orders Registry</h2>
                <p className="text-xs text-slate-500">Platform retail transactions, disputes, and fulfillment tracking</p>
              </div>
              <button
                onClick={() => navigate('/admin/orders')}
                className="px-4 py-2 bg-[#1E40AF] text-white rounded-xl text-xs font-bold"
              >
                Open Orders Screen &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900">Order #{o.id}</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#1E40AF] text-[10px] font-bold">
                        {o.orderStatus}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {o.paymentStatus}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1">Buyer: {o.buyerName} ({o.buyerPhone}) &rarr; Merchant: {o.sellerName}</p>
                    <p className="text-slate-400 text-[11px]">Items: {o.items.map((i) => i.title).join(', ')}</p>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-auto">
                    <div className="text-right">
                      <span className="font-black text-slate-900 text-base">Le {o.total}</span>
                      <span className="text-[10px] text-slate-400 block">{new Date(o.createdAt).toLocaleDateString()}</span>
                    </div>
                    {o.orderStatus !== 'Cancelled' && (
                      <button
                        onClick={() => setRejectingTarget({ id: o.id, type: 'order' })}
                        className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl font-bold"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 10. DELIVERIES TAB */}
        {/* ============================================================== */}
        {activeTab === 'deliveries' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900">Live Courier Dispatch Tracking</h2>
                <p className="text-xs text-slate-500">Monitor trip statuses, verify OTPs, and reassign stalled dispatches</p>
              </div>
              <span className="px-3 py-1 bg-orange-100 text-orange-900 rounded-full text-xs font-black">
                {riderDeliveries.length} Total Dispatches
              </span>
            </div>

            <div className="space-y-3">
              {riderDeliveries.map((del) => (
                <div
                  key={del.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-black shrink-0">
                      <Bike className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">Trip #{del.id}</span>
                        <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold">
                          {del.status.replace(/_/g, ' ')}
                        </span>
                        {del.deliveryOtp && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                            OTP: {del.deliveryOtp}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 mt-1">Pickup: {del.sellerName} &rarr; Dropoff: {del.deliveryLocation}</p>
                      <p className="text-slate-400 text-[11px]">Assigned Rider: <strong className="text-slate-700">{del.riderName || 'Unassigned'}</strong> ({del.riderPhone || 'No phone'})</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-auto">
                    <span className="font-black text-emerald-600 text-sm">Le {del.deliveryFee}</span>
                    <button
                      onClick={() => setReassigningDeliveryId(del.id)}
                      className="px-3.5 py-2 bg-blue-50 text-[#1E40AF] hover:bg-blue-100 rounded-xl font-bold"
                    >
                      Reassign Courier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 11. PAYMENTS TAB */}
        {/* ============================================================== */}
        {activeTab === 'payments' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h2 className="text-xl font-black text-slate-900">Financial Payment Transactions & Escrow</h2>
              <p className="text-xs text-slate-500 mt-0.5">Real-time payment settlements through Orange Money, Afrimoney, and Bank</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Transaction Ref</th>
                      <th className="py-3 px-4">Order Ref</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/60">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.transactionRef || p.id}</td>
                        <td className="py-3.5 px-4 text-slate-600">{p.orderId}</td>
                        <td className="py-3.5 px-4 text-slate-700">{p.paymentMethod}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-black text-slate-900">
                          {p.currency} {p.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 12. PAYOUTS TAB */}
        {/* ============================================================== */}
        {activeTab === 'payouts' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900">Payout Requests & Settlements</h2>
                <p className="text-xs text-slate-500">Withdrawal claims submitted by sellers and dispatch couriers</p>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black">
                {payouts.length + riderPayouts.length} Payout Records
              </span>
            </div>

            <div className="space-y-3">
              {[...payouts.map((p) => ({ ...p, role: 'Seller' })), ...riderPayouts.map((r) => ({ ...r, role: 'Courier' }))].map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900">#{item.id}</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {item.role}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1">{item.method} • Account: {item.accountNumber} ({item.accountName || 'Beneficiary'})</p>
                    <p className="text-slate-400 text-[11px]">{new Date(item.createdAt).toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-auto">
                    <span className="font-black text-base text-slate-900">Le {item.amount}</span>
                    {item.status === 'Pending' && (
                      <button
                        onClick={() => showToast(`Payout #${item.id} approved and processed.`)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                      >
                        Approve Payout
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 13. JOBS TAB */}
        {/* ============================================================== */}
        {activeTab === 'jobs' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900">Job Vacancies & Gig Moderation</h2>
                <p className="text-xs text-slate-500">Moderating employment opportunities and labor compliance</p>
              </div>
              <button
                onClick={() => navigate('/employer')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Employer Portal &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((j) => (
                <div key={j.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">{j.title}</h4>
                      <p className="text-slate-500">{j.employerName} • {j.category}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {j.status}
                    </span>
                  </div>

                  <p className="text-slate-600 line-clamp-2">{j.description}</p>
                  <p className="text-indigo-600 font-bold">{j.salary} • Location: {j.location}</p>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <span className="text-slate-400 text-[11px]">{j.applicantCount || 0} applicants</span>
                    <button
                      onClick={() => showToast(`Job ${j.title} marked active`)}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl font-bold ml-auto"
                    >
                      Approve Job
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 14. APPLICATIONS TAB */}
        {/* ============================================================== */}
        {activeTab === 'applications' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h2 className="text-xl font-black text-slate-900">Job Seeker Applications Registry</h2>
              <p className="text-xs text-slate-500 mt-0.5">Auditing job applications across all registered employers</p>
            </div>

            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900">{app.fullName}</span>
                      <span className="text-slate-400">&rarr; {app.jobTitle} ({app.companyName})</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#1E40AF] text-[10px] font-bold">
                        {app.status}
                      </span>
                    </div>
                    <p className="text-slate-500 mt-1">Email: {app.email} • Phone: {app.phone}</p>
                    <p className="text-slate-400 text-[11px]">Applied on {new Date(app.appliedDate).toLocaleDateString()}</p>
                  </div>

                  {app.resumeFileUrl && (
                    <a
                      href={app.resumeFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Resume File</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 15. REPORTS TAB */}
        {/* ============================================================== */}
        {activeTab === 'reports' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900">User, Product & Service Reports</h2>
                <p className="text-xs text-slate-500">Flagged listings, inappropriate conduct, and dispute reports</p>
              </div>
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-black">
                {openReportsCount} Pending Investigation
              </span>
            </div>

            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">{rep.subject}</span>
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold uppercase">
                          {rep.reportType}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {rep.status}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">{rep.description}</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">Submitted by: {rep.buyerName} • {new Date(rep.createdAt).toLocaleString()}</p>
                    </div>

                    {rep.status !== 'resolved' && (
                      <button
                        onClick={() => resolveReport(rep.id, 'Investigation completed. Warning issued.')}
                        className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700"
                      >
                        Resolve Report
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 16. COMPLAINTS TAB */}
        {/* ============================================================== */}
        {activeTab === 'complaints' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900">Customer & Merchant Grievance Center</h2>
                <p className="text-xs text-slate-500">Official dispute tickets, damaged goods, and delivery issues</p>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black">
                {openComplaintsCount} Open Complaints
              </span>
            </div>

            <div className="space-y-3">
              {complaints.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">{c.subject}</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#1E40AF] text-[10px] font-bold">
                          {c.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {c.priority} Priority
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {c.status}
                        </span>
                      </div>
                      <p className="text-slate-700 mt-1">{c.description}</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">Submitter: {c.userName} • {new Date(c.createdAt).toLocaleString()}</p>
                      {c.resolutionNotes && (
                        <div className="mt-2 p-2.5 bg-emerald-50 text-emerald-800 rounded-xl font-semibold">
                          Resolution: {c.resolutionNotes}
                        </div>
                      )}
                    </div>

                    {c.status !== 'Resolved' && (
                      <button
                        onClick={() => setResolvingComplaint(c)}
                        className="px-3.5 py-2 bg-[#1E40AF] text-white rounded-xl font-bold hover:bg-blue-700 shrink-0"
                      >
                        Enter Resolution
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 17. NOTIFICATIONS TAB */}
        {/* ============================================================== */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Broadcast Platform Notification</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Send system notices to all users, specific operational roles, or an individual account
                </p>
              </div>

              <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Audience</label>
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                  >
                    <option value="all">All Platform Users (Global Broadcast)</option>
                    <option value="sellers">All Verified Sellers</option>
                    <option value="riders">All Dispatch Couriers</option>
                    <option value="employers">All Employers</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Notification Title</label>
                  <input
                    type="text"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    placeholder="e.g. Scheduled System Upgrade or Holiday Dispatch Hours"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Message Body</label>
                  <textarea
                    rows={3}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Enter detailed notice content..."
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1E40AF] text-white rounded-xl font-bold hover:bg-blue-700 shadow-md flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Broadcast Alert</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 18. MESSAGES TAB */}
        {/* ============================================================== */}
        {activeTab === 'messages' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Direct Administrative Messaging</h2>
                <p className="text-xs text-slate-500 mt-0.5">Send official platform notices directly to any user account</p>
              </div>

              <form onSubmit={handleSendDirectMessage} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Select User / Recipient</label>
                    <select
                      value={recipientUserId}
                      onChange={(e) => {
                        setRecipientUserId(e.target.value);
                        const sel = users.find((u) => u.id === e.target.value);
                        if (sel) setRecipientName(sel.name);
                      }}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                    >
                      <option value="">Select a user...</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.email}) - {u.role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Recipient Name</label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official Message Text</label>
                  <textarea
                    rows={3}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Write an official advisory or notice..."
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1E40AF] text-white rounded-xl font-bold hover:bg-blue-700 shadow-md flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Direct Message</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 19. ANALYTICS TAB */}
        {/* ============================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Gross Merchandise Value (GMV)</span>
                <p className="text-3xl font-black text-slate-900 mt-1">Le {totalGMV.toLocaleString()}</p>
                <p className="text-xs text-emerald-600 font-bold mt-2">+14.2% month over month</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Platform Commission (5%)</span>
                <p className="text-3xl font-black text-blue-600 mt-1">Le {(totalGMV * 0.05).toLocaleString()}</p>
                <p className="text-xs text-slate-400 mt-2">Calculated net earnings</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Delivery Fulfillment Rate</span>
                <p className="text-3xl font-black text-emerald-600 mt-1">
                  {riderDeliveries.length > 0
                    ? `${Math.round(
                        (riderDeliveries.filter((d) => d.status === 'DELIVERED').length / riderDeliveries.length) * 100
                      )}%`
                    : '100%'}
                </p>
                <p className="text-xs text-slate-400 mt-2">On-time motorbike arrival</p>
              </div>
            </div>

            {/* Visual Breakdown of Categories & Roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-900">User Role Distribution</h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Buyers</span>
                      <span>{buyersList.length}</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(buyersList.length / (users.length || 1)) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Sellers</span>
                      <span>{sellersList.length}</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(sellersList.length / (users.length || 1)) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Couriers</span>
                      <span>{ridersList.length}</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-600 rounded-full" style={{ width: `${(ridersList.length / (users.length || 1)) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-900">Orders Status Pipeline</h3>
                <div className="space-y-2 text-xs">
                  {['Processing', 'Ready for Pickup', 'Out for Delivery', 'Delivered', 'Cancelled'].map((st) => {
                    const count = orders.filter((o) => o.orderStatus === st).length;
                    return (
                      <div key={st} className="flex justify-between items-center p-2 rounded-xl bg-slate-50">
                        <span className="font-bold text-slate-700">{st}</span>
                        <span className="font-black text-slate-900">{count} orders</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 20. AUDIT LOGS TAB */}
        {/* ============================================================== */}
        {activeTab === 'audit_logs' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Administrative Immutable Audit Logs</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete record of sensitive administrative actions across the platform
                </p>
              </div>
              <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-mono font-bold">
                {auditLogs.length} Logged Events
              </span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Action Event</th>
                      <th className="py-3 px-4">Target Type & ID</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Admin</th>
                      <th className="py-3 px-4 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/60">
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 bg-blue-100 text-[#1E40AF] rounded-md font-mono text-[10px] font-black">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-700">
                          {log.targetType} #{log.targetId}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-800 max-w-md">
                          {log.description}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {log.adminName || log.adminId}
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-400 font-mono text-[11px]">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 21. SETTINGS TAB */}
        {/* ============================================================== */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black text-slate-900">Platform Operational Configurations</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Set marketplace commission rates, delivery thresholds, and moderation policies
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Marketplace Sales Commission (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={settingsForm.commissionRate}
                    onChange={(e) => setSettingsForm({ ...settingsForm, commissionRate: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Base Courier Delivery Fee (Le)
                  </label>
                  <input
                    type="number"
                    min={5}
                    value={settingsForm.baseDeliveryFee}
                    onChange={(e) => setSettingsForm({ ...settingsForm, baseDeliveryFee: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Platform Support Helpline Phone
                  </label>
                  <input
                    type="text"
                    value={settingsForm.supportPhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, supportPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Official Admin Email Address
                  </label>
                  <input
                    type="email"
                    value={settingsForm.supportEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.requireSellerVerification}
                    onChange={(e) => setSettingsForm({ ...settingsForm, requireSellerVerification: e.target.checked })}
                    className="w-4 h-4 rounded-sm text-[#1E40AF]"
                  />
                  <span className="font-bold text-slate-800">
                    Mandatory Seller Document Verification before listing products
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.requireJobApproval}
                    onChange={(e) => setSettingsForm({ ...settingsForm, requireJobApproval: e.target.checked })}
                    className="w-4 h-4 rounded-sm text-[#1E40AF]"
                  />
                  <span className="font-bold text-slate-800">
                    Mandatory Job Vacancy Moderation before broadcasting to job seekers
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.allowCashOnDelivery}
                    onChange={(e) => setSettingsForm({ ...settingsForm, allowCashOnDelivery: e.target.checked })}
                    className="w-4 h-4 rounded-sm text-[#1E40AF]"
                  />
                  <span className="font-bold text-slate-800">
                    Allow Cash on Delivery (COD) alongside Mobile Money
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl font-bold shadow-md"
                >
                  Save Platform Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL: MANAGE USER PERMISSIONS (ROLES & STATUS) */}
        {/* ============================================================== */}
        {inspectUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 animate-in fade-in">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">
                  Manage Permissions: {inspectUser.name}
                </h3>
                <button onClick={() => setInspectUser(null)} className="text-slate-400 hover:text-slate-600">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <p><strong>Email:</strong> {inspectUser.email}</p>
                <p><strong>Account Status:</strong> <span className="uppercase font-bold text-[#1E40AF]">{inspectUser.status}</span></p>
                <p><strong>Registered:</strong> {inspectUser.createdAt ? new Date(inspectUser.createdAt).toLocaleDateString() : 'Active'}</p>
              </div>

              {/* Roles Management (SELLER, EMPLOYER, DISPATCH_RIDER) */}
              <div className="space-y-3">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  Permitted Role Assignments:
                </span>

                {(['SELLER', 'EMPLOYER', 'DISPATCH_RIDER'] as const).map((r) => {
                  const userRoles = (inspectUser.roles || [inspectUser.role]).map((item) => String(item).toUpperCase());
                  const hasRole = userRoles.includes(r);
                  return (
                    <div
                      key={r}
                      className="p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{r}</span>
                        <p className="text-[11px] text-slate-400">
                          {r === 'SELLER'
                            ? 'Access to store merchant dashboard & listings'
                            : r === 'EMPLOYER'
                            ? 'Access to hiring portal & job posting'
                            : 'Access to courier dispatch command & pickups'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleRole(inspectUser.id, r, hasRole)}
                        className={`px-3 py-1.5 rounded-xl font-bold ${
                          hasRole ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {hasRole ? 'Revoke' : 'Grant'}
                      </button>
                    </div>
                  );
                })}

                <p className="text-[11px] text-slate-400 italic">
                  Note: The ADMIN role cannot be granted through regular user forms and is strictly reserved.
                </p>
              </div>

              {/* Account Status Switcher */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-700 block">Account Status:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setUserAccountStatus(inspectUser.id, 'active');
                      setInspectUser({ ...inspectUser, status: 'active' });
                    }}
                    className={`flex-1 py-2 rounded-xl font-bold ${
                      inspectUser.status === 'active' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => {
                      setUserAccountStatus(inspectUser.id, 'suspended', 'Administrative sanction');
                      setInspectUser({ ...inspectUser, status: 'suspended' });
                    }}
                    className={`flex-1 py-2 rounded-xl font-bold ${
                      inspectUser.status === 'suspended' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Suspend
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setInspectUser(null)}
                  className="w-full py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: REJECTION REASON */}
        {rejectingTarget && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 animate-in fade-in text-xs">
              <h3 className="text-base font-black text-red-600">
                Reject / Cancel {rejectingTarget.type.toUpperCase()} #{rejectingTarget.id}
              </h3>
              <p className="text-slate-500">
                Please enter the reason for rejection or cancellation. An audit record will be logged.
              </p>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason:</label>
                <textarea
                  rows={3}
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  placeholder="Enter reason..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setRejectingTarget(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRejection}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md"
                >
                  Confirm Action
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: REASSIGN DISPATCH RIDER */}
        {reassigningDeliveryId && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 animate-in fade-in text-xs">
              <h3 className="text-base font-black text-slate-900">
                Reassign Dispatch #{reassigningDeliveryId}
              </h3>
              <p className="text-slate-500">
                Choose another approved courier from the fleet to take over this delivery:
              </p>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Available Rider:</label>
                <select
                  value={selectedNewRiderId}
                  onChange={(e) => setSelectedNewRiderId(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                >
                  <option value="">Select a courier...</option>
                  {riderProfiles
                    .filter((r) => r.approvalStatus === 'approved')
                    .map((r) => (
                      <option key={r.id} value={r.userId}>
                        {r.fullName} ({r.vehicleType} • {r.vehicleRegistrationNumber}) - {r.availability}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setReassigningDeliveryId(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReassign}
                  className="flex-1 py-2.5 bg-[#1E40AF] hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
                >
                  Reassign Courier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: RESOLVE COMPLAINT */}
        {resolvingComplaint && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 animate-in fade-in text-xs">
              <h3 className="text-base font-black text-slate-900">
                Resolve Complaint #{resolvingComplaint.id}
              </h3>
              <p className="text-slate-500">
                Grievance: <strong>{resolvingComplaint.subject}</strong> submitted by {resolvingComplaint.userName}.
              </p>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Resolution Notes:</label>
                <textarea
                  rows={3}
                  value={complaintNotes}
                  onChange={(e) => setComplaintNotes(e.target.value)}
                  placeholder="Specify findings, customer compensation, or merchant advisory..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setResolvingComplaint(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmResolveComplaint}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md"
                >
                  Mark as Resolved
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD CATEGORY */}
        {showAddCategoryModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 animate-in fade-in text-xs">
              <h3 className="text-base font-black text-slate-900">Add Product Category</h3>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category Name</label>
                  <input
                    type="text"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Solar Equipment & Power"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Slug URL</label>
                  <input
                    type="text"
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    placeholder="solar-equipment"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Icon Emoji or Unicode</label>
                  <input
                    type="text"
                    value={catIcon}
                    onChange={(e) => setCatIcon(e.target.value)}
                    placeholder="⚡"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-center text-lg"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Description</label>
                  <input
                    type="text"
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                    placeholder="Solar panels, inverters, and battery systems"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCategoryModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#1E40AF] hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: INSPECT STORE DOCUMENTS */}
        {inspectStore && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">
                  Store Credentials: {inspectStore.name}
                </h3>
                <button
                  onClick={() => setInspectStore(null)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <p><strong>Merchant:</strong> {inspectStore.sellerName || 'Verified Store Owner'}</p>
                  <p><strong>Contact:</strong> {inspectStore.phone}</p>
                  <p><strong>Location:</strong> {inspectStore.location}</p>
                  <p><strong>Category:</strong> {inspectStore.category}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-800 text-xs">
                      Uploaded Business Credential / ID:
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Attached Document
                    </span>
                  </div>

                  {inspectStore.documentUrl ? (
                    <div className="space-y-2">
                      <div className="max-h-56 overflow-hidden rounded-xl border border-slate-200 bg-white flex items-center justify-center p-2">
                        {inspectStore.documentUrl.startsWith('data:image') ||
                        inspectStore.documentUrl.match(/\.(jpeg|jpg|png|webp|gif)($|\?)/i) ? (
                          <img
                            src={inspectStore.documentUrl}
                            alt="Merchant Document"
                            className="max-h-52 max-w-full object-contain rounded"
                          />
                        ) : inspectStore.documentUrl.startsWith('data:application/pdf') ||
                          inspectStore.documentUrl.includes('.pdf') ? (
                          <iframe
                            src={inspectStore.documentUrl}
                            title="PDF Preview"
                            className="w-full h-52 rounded border-0"
                          />
                        ) : (
                          <div className="py-6 text-center space-y-1">
                            <FileText className="w-10 h-10 text-[#1E40AF] mx-auto" />
                            <p className="text-slate-600 font-semibold text-xs">Official Verification Document</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <span className="text-[11px] text-slate-500 truncate max-w-xs font-mono">
                          {inspectStore.documentUrl.substring(0, 45)}...
                        </span>
                        <a
                          href={inspectStore.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View Full Document</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No business document attached for this merchant.</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-[11px] text-slate-500">Verify documents before approval.</span>
                <div className="flex items-center gap-2">
                  {inspectStore.status === 'pending' && (
                    <button
                      onClick={() => {
                        approveSellerStore(inspectStore.id);
                        setInspectStore(null);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify & Approve Store</span>
                    </button>
                  )}
                  <button
                    onClick={() => setInspectStore(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: INSPECT RIDER DOCUMENTS */}
        {inspectRider && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in text-xs max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">
                  Rider Credentials: {inspectRider.fullName}
                </h3>
                <button
                  onClick={() => setInspectRider(null)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <p><strong>Vehicle:</strong> {inspectRider.vehicleType} • Plate: {inspectRider.vehicleRegistrationNumber}</p>
                  <p><strong>License:</strong> {inspectRider.driverLicenseNumber}</p>
                  <p><strong>National ID:</strong> {inspectRider.identificationType} (#{inspectRider.idNumber})</p>
                  <p><strong>Phone:</strong> {inspectRider.phoneNumber}</p>
                </div>

                {/* Document Previews */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-700 block">Uploaded Identification & Licenses:</span>
                  
                  {/* National ID */}
                  <div className="p-3 bg-slate-50 rounded-xl border flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">National ID Document</p>
                      <span className="text-[10px] text-slate-500">{inspectRider.identificationType}</span>
                    </div>
                    {inspectRider.idDocumentUrl ? (
                      <a
                        href={inspectRider.idDocumentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-[#1E40AF] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-2xs"
                      >
                        <ExternalLink className="w-3 h-3" /> View Doc
                      </a>
                    ) : (
                      <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-bold">Pending</span>
                    )}
                  </div>

                  {/* Driver's License */}
                  <div className="p-3 bg-slate-50 rounded-xl border flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">Driver's License (SLRSA)</p>
                      <span className="text-[10px] text-slate-500">{inspectRider.driverLicenseNumber}</span>
                    </div>
                    {inspectRider.driverLicenseDocumentUrl ? (
                      <a
                        href={inspectRider.driverLicenseDocumentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-[#1E40AF] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-2xs"
                      >
                        <ExternalLink className="w-3 h-3" /> View Doc
                      </a>
                    ) : (
                      <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-bold">Pending</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                {inspectRider.approvalStatus === 'pending' && (
                  <button
                    onClick={() => {
                      approveRiderApplication(inspectRider.id);
                      setInspectRider(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify & Approve Rider</span>
                  </button>
                )}
                <button
                  onClick={() => setInspectRider(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold ml-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
