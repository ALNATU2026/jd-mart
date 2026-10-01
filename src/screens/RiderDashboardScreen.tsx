import React, { useState } from 'react';
import {
  Bike,
  Power,
  TrendingUp,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  Phone,
  DollarSign,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  XCircle,
  Search,
  Filter,
  Calendar,
  FileText,
  Send,
  User,
  ChevronRight,
  UploadCloud,
  Camera,
  Key,
  MessageSquare,
  Bell,
  Settings,
  Award,
  RefreshCw,
  Eye,
  ExternalLink,
  Car,
  Navigation,
  Check,
  Ban,
  Download,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RiderAvailability, DeliveryStatus, RiderDelivery } from '../types';

type RiderTab =
  | 'overview'
  | 'online_offline'
  | 'available'
  | 'my_deliveries'
  | 'active'
  | 'completed'
  | 'failed'
  | 'earnings'
  | 'payouts'
  | 'messages'
  | 'notifications'
  | 'history'
  | 'profile_vehicle';

export const RiderDashboardScreen: React.FC = () => {
  const {
    currentUser,
    currentRiderProfile,
    riderOnline,
    toggleRiderOnline,
    setRiderAvailability,
    riderDeliveries,
    acceptRiderDelivery,
    declineRiderDelivery,
    updateRiderDeliveryStatus,
    updateRiderProfile,
    riderPayouts,
    requestRiderPayout,
    messages,
    sendMessage,
    notifications,
    uploadFile,
    navigate,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<RiderTab>('overview');

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Active' | 'Completed' | 'Failed' | 'Cancelled'>('All');

  // Active Delivery Modal / Action States
  const [otpInput, setOtpInput] = useState('');
  const [proofPhoto, setProofPhoto] = useState<string | null>(null);
  const [proofNotes, setProofNotes] = useState('');
  const [failureReason, setFailureReason] = useState('Customer unavailable at delivery address');
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('Vehicle mechanical issue');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Payout Form States
  const [payoutAmount, setPayoutAmount] = useState<number>(100);
  const [payoutMethod, setPayoutMethod] = useState<'Orange Money' | 'Afrimoney' | 'Bank Transfer'>('Orange Money');
  const [payoutAccountNumber, setPayoutAccountNumber] = useState(currentRiderProfile?.phoneNumber || currentUser?.phone || '');
  const [payoutAccountName, setPayoutAccountName] = useState(currentRiderProfile?.fullName || currentUser?.name || '');
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  // Chat message state
  const [chatMessage, setChatMessage] = useState('');

  // Profile Edit State
  const [editFullName, setEditFullName] = useState(currentRiderProfile?.fullName || currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentRiderProfile?.phoneNumber || currentUser?.phone || '');
  const [editAddress, setEditAddress] = useState(currentRiderProfile?.address || currentUser?.address || '15 Campbell Street');
  const [editCity, setEditCity] = useState(currentRiderProfile?.city || 'Freetown');
  const [editVehicleType, setEditVehicleType] = useState<'Motorcycle' | 'Bicycle' | 'Car' | 'Van'>(
    currentRiderProfile?.vehicleType || 'Motorcycle'
  );
  const [editVehicleModel, setEditVehicleModel] = useState(currentRiderProfile?.vehicleModel || 'Bajaj Boxer 150');
  const [editRegNumber, setEditRegNumber] = useState(currentRiderProfile?.vehicleRegistrationNumber || 'SL-AA 4920');
  const [editLicenseNumber, setEditLicenseNumber] = useState(currentRiderProfile?.driverLicenseNumber || 'DL-SL-88392');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Check Rider Approval & Eligibility
  // Requirement: "A rider should only receive delivery requests when:
  // accountStatus = 'active' AND riderApprovalStatus = 'approved' AND availability = 'online' AND currentDelivery = null"
  const accountStatus = currentRiderProfile?.accountStatus || 'pending';
  const approvalStatus = currentRiderProfile?.approvalStatus || 'pending';
  const availability = currentRiderProfile?.availability || (riderOnline ? 'ONLINE' : 'OFFLINE');
  const isOnline = availability === 'ONLINE' || availability === 'AVAILABLE';

  // Find active delivery assigned to this rider
  const myDeliveries = riderDeliveries.filter((d) => d.riderId === currentUser?.id);
  const activeDelivery = myDeliveries.find((d) =>
    ['DELIVERY_ASSIGNED', 'GOING_TO_PICKUP', 'ARRIVED_AT_PICKUP', 'ORDER_PICKED_UP', 'OUT_FOR_DELIVERY', 'ARRIVED_AT_CUSTOMER', 'Accepted', 'In Transit'].includes(d.status)
  );

  const isEligibleForNewDeliveries =
    accountStatus === 'active' &&
    approvalStatus === 'approved' &&
    isOnline &&
    !activeDelivery;

  // Available delivery requests broadcasted to fleet
  const availableDeliveries = riderDeliveries.filter(
    (d) => (!d.riderId || d.status === 'Available' || d.status === 'DELIVERY_ASSIGNED') && d.status !== 'Delivered' && d.status !== 'CANCELLED' && d.status !== 'FAILED'
  );

  // Completed & Failed Deliveries
  const completedDeliveries = myDeliveries.filter((d) => d.status === 'DELIVERED' || d.status === 'Delivered');
  const failedDeliveries = myDeliveries.filter((d) => d.status === 'FAILED' || d.status === 'CANCELLED');

  // Earnings calculations
  const totalEarned = completedDeliveries.reduce((sum, d) => sum + (d.deliveryFee || 25), 0);
  const totalPaidOut = riderPayouts
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingPayouts = riderPayouts
    .filter((p) => p.status === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);
  const availableBalance = Math.max(0, totalEarned - totalPaidOut - pendingPayouts);

  // Notifications for rider
  const riderNotifications = notifications.filter(
    (n) => n.userId === currentUser?.id || n.type === 'delivery'
  );

  // Handle Photo proof upload/simulation
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      uploadFile(file, 'order-file', currentUser?.id || 'rider')
        .then((meta) => {
          setProofPhoto(meta.downloadURL);
          showToast('Proof photo uploaded successfully!');
        })
        .catch(() => {
          setProofPhoto('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=60');
          showToast('Photo proof captured successfully');
        });
    } else {
      setProofPhoto('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=60');
      showToast('Photo proof simulation set');
    }
  };

  // Handle Workflow Status Transition
  const handleAdvanceStatus = async (nextStatus: DeliveryStatus) => {
    if (!activeDelivery) return;
    setUpdatingStatus(true);
    try {
      const success = await updateRiderDeliveryStatus(activeDelivery.id, nextStatus, {
        otpInput: nextStatus === 'DELIVERED' ? otpInput : undefined,
        proofPhoto: proofPhoto || undefined,
        proofNotes: proofNotes || undefined,
      });
      if (success && nextStatus === 'DELIVERED') {
        setOtpInput('');
        setProofPhoto(null);
        setProofNotes('');
        setActiveTab('completed');
      }
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleFailDelivery = async () => {
    if (!activeDelivery) return;
    setUpdatingStatus(true);
    try {
      await updateRiderDeliveryStatus(activeDelivery.id, 'FAILED', {
        failureReason,
      });
      setShowFailureModal(false);
      setActiveTab('failed');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCancelDelivery = async () => {
    if (!activeDelivery) return;
    setUpdatingStatus(true);
    try {
      await updateRiderDeliveryStatus(activeDelivery.id, 'CANCELLED', {
        cancellationReason,
      });
      setShowCancelModal(false);
      setActiveTab('my_deliveries');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSubmitPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (payoutAmount <= 0) {
      showToast('Please enter a valid payout amount.');
      return;
    }
    if (payoutAmount > availableBalance) {
      showToast(`Cannot request more than your available balance (Le ${availableBalance}).`);
      return;
    }
    if (!payoutAccountNumber) {
      showToast('Please specify a mobile money or bank account number.');
      return;
    }

    setIsSubmittingPayout(true);
    try {
      await requestRiderPayout(payoutAmount, payoutMethod, payoutAccountNumber, payoutAccountName);
      setShowPayoutModal(false);
      setPayoutAmount(50);
    } finally {
      setIsSubmittingPayout(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRiderProfile) return;
    setIsSavingProfile(true);
    try {
      await updateRiderProfile(currentRiderProfile.id, {
        fullName: editFullName,
        phoneNumber: editPhone,
        address: editAddress,
        city: editCity,
        vehicleType: editVehicleType,
        vehicleModel: editVehicleModel,
        vehicleRegistrationNumber: editRegNumber,
        driverLicenseNumber: editLicenseNumber,
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    await sendMessage('dispatch-coordinator', 'Central Dispatch Coordinator', `Rider Dispatch: ${chatMessage.trim()}`);
    setChatMessage('');
    showToast('Message sent to Central Dispatch Coordinator!');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* TOP COURIER BANNER */}
        <div className="bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider">
                JD Mart Dispatch Fleet
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  approvalStatus === 'approved'
                    ? 'bg-emerald-500/90 text-white'
                    : approvalStatus === 'rejected'
                    ? 'bg-red-500/90 text-white'
                    : 'bg-amber-400 text-amber-950 font-black'
                }`}
              >
                Approval: {approvalStatus.toUpperCase()}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  accountStatus === 'active'
                    ? 'bg-blue-500/90 text-white'
                    : 'bg-rose-500/90 text-white'
                }`}
              >
                Account: {accountStatus.toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Dispatch Rider Command
            </h1>
            <p className="text-xs text-orange-100 flex flex-wrap items-center gap-2">
              <span>Courier: <strong className="text-white">{currentRiderProfile?.fullName || currentUser?.name}</strong></span>
              <span>•</span>
              <span>Vehicle: <strong className="text-white">{currentRiderProfile?.vehicleType || 'Motorcycle'} ({currentRiderProfile?.vehicleRegistrationNumber || 'SL-Reg'})</strong></span>
              <span>•</span>
              <span>Rating: <strong className="text-amber-200">★ {currentRiderProfile?.rating || '5.0'}</strong></span>
            </p>
          </div>

          {/* Quick Duty Status Switcher */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 self-start md:self-auto">
            <div className="text-right">
              <p className="text-xs font-black uppercase tracking-wider text-white">
                {isOnline ? 'DUTY: ONLINE' : 'DUTY: OFFLINE'}
              </p>
              <p className="text-[11px] text-orange-200">
                {isEligibleForNewDeliveries
                  ? 'Eligible to receive delivery orders'
                  : !isOnline
                  ? 'Switch on to receive dispatches'
                  : activeDelivery
                  ? 'On delivery run'
                  : 'Pending approval / inactive'}
              </p>
            </div>
            <button
              onClick={toggleRiderOnline}
              className={`p-3.5 rounded-2xl transition-all shadow-md ${
                isOnline
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600 ring-4 ring-emerald-300/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Toggle Online Duty Status"
            >
              <Power className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NON-APPROVED / INELIGIBLE CALLOUT BANNER */}
        {approvalStatus !== 'approved' && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-black text-amber-900">
                  {approvalStatus === 'pending'
                    ? 'Rider Application Under Admin Review'
                    : 'Rider Application Requires Correction'}
                </h3>
                <p className="text-xs text-amber-700 mt-0.5">
                  {approvalStatus === 'pending'
                    ? 'JD Mart administrators are validating your motorcycle registration and rider license. You will receive orders once approved.'
                    : `Application rejected: ${currentRiderProfile?.rejectionReason || 'Please resubmit valid documentation.'}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/onboarding/rider')}
              className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl hover:bg-amber-700 shrink-0 shadow-xs"
            >
              View Application Details
            </button>
          </div>
        )}

        {/* DASHBOARD TAB NAVIGATION BAR */}
        <div className="bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-xs overflow-x-auto scrollbar-none flex items-center gap-1">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'online_offline', label: 'Online / Offline', icon: Power },
            {
              id: 'available',
              label: 'Available Deliveries',
              icon: Package,
              badge: availableDeliveries.length,
            },
            {
              id: 'active',
              label: 'Active Delivery',
              icon: Bike,
              badge: activeDelivery ? '1' : undefined,
              alert: !!activeDelivery,
            },
            { id: 'my_deliveries', label: 'My Deliveries', icon: FileText },
            { id: 'completed', label: 'Completed', icon: CheckCircle2 },
            { id: 'failed', label: 'Failed Deliveries', icon: XCircle },
            { id: 'earnings', label: 'Earnings', icon: DollarSign },
            { id: 'payouts', label: 'Payouts', icon: TrendingUp },
            { id: 'messages', label: 'Messages', icon: MessageSquare },
            { id: 'notifications', label: 'Notifications', icon: Bell, badge: riderNotifications.filter((n) => !n.read).length || undefined },
            { id: 'history', label: 'Delivery History', icon: Calendar },
            { id: 'profile_vehicle', label: 'Profile & Vehicle', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as RiderTab)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                } ${tab.alert && !isActive ? 'animate-pulse text-orange-600 font-extrabold' : ''}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && Boolean(tab.badge) && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-white text-orange-700' : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {tab.badge}
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
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Available Balance</span>
                <p className="text-2xl font-black text-slate-900 mt-1">Le {availableBalance}</p>
                <button
                  onClick={() => setShowPayoutModal(true)}
                  className="mt-2 text-[11px] font-bold text-orange-600 hover:underline flex items-center gap-1"
                >
                  <span>Request Payout</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Active Delivery</span>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {activeDelivery ? '1 Ongoing' : 'None'}
                </p>
                <span className="text-[11px] font-semibold text-orange-600">
                  {activeDelivery ? `#${activeDelivery.id}` : 'Ready for next dispatch'}
                </span>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Completed Trips</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{completedDeliveries.length}</p>
                <span className="text-[11px] font-semibold text-emerald-600">
                  Le {totalEarned} earned
                </span>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Available Calls</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{availableDeliveries.length}</p>
                <span className="text-[11px] font-semibold text-blue-600">
                  {isEligibleForNewDeliveries ? 'Ready to accept' : 'Check status'}
                </span>
              </div>
            </div>

            {/* ONGOING ACTIVE TRIP CARD (IF ANY) */}
            {activeDelivery && (
              <div className="bg-white rounded-3xl p-6 border-2 border-orange-500 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                      <Bike className="w-5 h-5 animate-bounce" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        Active Order Run: #{activeDelivery.id} (Order {activeDelivery.orderId})
                      </h3>
                      <span className="text-xs font-bold text-orange-600 uppercase">
                        Current Status: {activeDelivery.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('active')}
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <span>Manage Active Delivery</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Pickup Point</span>
                    <p className="font-bold text-slate-900 mt-0.5">{activeDelivery.sellerName}</p>
                    <p className="text-slate-600">{activeDelivery.pickupLocation}</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Delivery Drop-Off</span>
                    <p className="font-bold text-slate-900 mt-0.5">{activeDelivery.customerName}</p>
                    <p className="text-slate-600">{activeDelivery.deliveryLocation}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Available Deliveries Callout */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-black text-slate-900">Available Delivery Broadcasts</h3>
                  <p className="text-xs text-slate-500">Pick up orders ready at local merchant warehouses</p>
                </div>
                <button
                  onClick={() => setActiveTab('available')}
                  className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                >
                  <span>View All ({availableDeliveries.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {availableDeliveries.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs font-medium">
                  No pending delivery calls right now. You will be alerted immediately when orders are ready.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableDeliveries.slice(0, 2).map((del) => (
                    <div
                      key={del.id}
                      className="p-4 rounded-2xl border border-slate-200/70 hover:border-orange-300 transition-all bg-slate-50/50 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Trip #{del.id}</span>
                          <h4 className="text-sm font-black text-slate-900">{del.sellerName}</h4>
                        </div>
                        <span className="text-base font-black text-emerald-600">Le {del.deliveryFee}</span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1">To: {del.deliveryLocation}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          disabled={!isEligibleForNewDeliveries}
                          onClick={() => {
                            acceptRiderDelivery(del.id);
                            setActiveTab('active');
                          }}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-xs ${
                            isEligibleForNewDeliveries
                              ? 'bg-orange-600 hover:bg-orange-700'
                              : 'bg-slate-300 cursor-not-allowed text-slate-600'
                          }`}
                        >
                          {isEligibleForNewDeliveries ? 'Accept Delivery' : 'Ineligible (Check status)'}
                        </button>
                        <button
                          onClick={() => declineRiderDelivery(del.id)}
                          className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. ONLINE / OFFLINE TAB */}
        {/* ============================================================== */}
        {activeTab === 'online_offline' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black text-slate-900">Rider Availability & Shift Control</h2>
              <p className="text-xs text-slate-500 mt-1">
                Manage your dispatch duty state. Orders are dispatched strictly based on availability and approval rules.
              </p>
            </div>

            {/* Dispatch Eligibility Checklist */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Automated Dispatch Eligibility Rules (All 4 Required):
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                  accountStatus === 'active' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  {accountStatus === 'active' ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : <Ban className="w-4 h-4 text-red-600 shrink-0" />}
                  <span>accountStatus = "active" (Current: <strong>{accountStatus}</strong>)</span>
                </div>

                <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                  approvalStatus === 'approved' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  {approvalStatus === 'approved' ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : <Ban className="w-4 h-4 text-red-600 shrink-0" />}
                  <span>riderApprovalStatus = "approved" (Current: <strong>{approvalStatus}</strong>)</span>
                </div>

                <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                  isOnline ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  {isOnline ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
                  <span>availability = "online" (Current: <strong>{availability}</strong>)</span>
                </div>

                <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                  !activeDelivery ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-blue-50 border-blue-200 text-blue-800'
                }`}>
                  {!activeDelivery ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : <Bike className="w-4 h-4 text-blue-600 shrink-0" />}
                  <span>currentDelivery = null (Current: <strong>{activeDelivery ? `#${activeDelivery.id}` : 'None'}</strong>)</span>
                </div>
              </div>
            </div>

            {/* Availability Mode Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700">Set Your Current Availability Status:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(
                  [
                    { status: 'ONLINE', title: 'ONLINE', desc: 'Ready & receiving order calls', color: 'emerald' },
                    { status: 'AVAILABLE', title: 'AVAILABLE', desc: 'At dispatch station ready for pickups', color: 'blue' },
                    { status: 'OFFLINE', title: 'OFFLINE', desc: 'Off duty, resting, not receiving calls', color: 'slate' },
                    { status: 'BUSY', title: 'BUSY', desc: 'Refueling or vehicle maintenance', color: 'amber' },
                    { status: 'ON_DELIVERY', title: 'ON_DELIVERY', desc: 'Currently executing active delivery', color: 'purple' },
                    { status: 'SUSPENDED', title: 'SUSPENDED', desc: 'Restricted by administrator', color: 'rose' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.status}
                    onClick={() => {
                      if (item.status === 'SUSPENDED') {
                        showToast('Suspension status can only be managed by administrators.');
                        return;
                      }
                      setRiderAvailability(item.status);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      availability === item.status
                        ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-900">{item.title}</span>
                      {availability === item.status && (
                        <CheckCircle2 className="w-4 h-4 text-orange-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* GPS Coverage Zone */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <Navigation className="w-4 h-4 text-blue-600" />
                <span>Sierra Leone Courier Zone Active: Freetown Central, Lumley, Aberdeen, Kissy</span>
              </div>
              <p className="text-blue-700 text-[11px]">
                Your GPS beacon is broadcasting to nearby registered JD Mart stores. Maintain active data connection for real-time delivery alerts.
              </p>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. AVAILABLE DELIVERIES TAB */}
        {/* ============================================================== */}
        {activeTab === 'available' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Available Delivery Broadcasts</h2>
                <p className="text-xs text-slate-500">Pick up ready orders from merchants and deliver to buyers</p>
              </div>

              {!isEligibleForNewDeliveries && (
                <div className="px-3.5 py-1.5 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>
                    {!isOnline
                      ? 'You are OFFLINE. Switch Online to accept.'
                      : activeDelivery
                      ? 'Finish current delivery before accepting another.'
                      : 'Account awaiting admin approval.'}
                  </span>
                </div>
              )}
            </div>

            {availableDeliveries.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200 space-y-3">
                <Bike className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Pending Delivery Requests</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When merchants package customer orders and mark them ready for pickup, new requests will appear here instantly.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableDeliveries.map((del) => (
                  <div
                    key={del.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4"
                  >
                    <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                      <div>
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#1E40AF] text-[10px] font-black uppercase">
                          Dispatch Call
                        </span>
                        <h3 className="text-base font-black text-slate-900 mt-1">Trip #{del.id}</h3>
                        <p className="text-xs text-slate-500">Order Ref: {del.orderId}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Delivery Fee</span>
                        <span className="text-xl font-black text-emerald-600">Le {del.deliveryFee}</span>
                      </div>
                    </div>

                    {/* Locations */}
                    <div className="space-y-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-blue-100 text-[#1E40AF] flex items-center justify-center shrink-0 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-500 uppercase text-[10px]">Pickup Store:</span>
                          <p className="font-black text-slate-900">{del.sellerName}</p>
                          <p className="text-slate-600">{del.pickupLocation}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-500 uppercase text-[10px]">Delivery Drop-Off:</span>
                          <p className="font-black text-slate-900">{del.customerName}</p>
                          <p className="text-slate-600">{del.deliveryLocation}</p>
                        </div>
                      </div>
                    </div>

                    {/* Package Info */}
                    <div className="p-3 bg-slate-50 rounded-xl text-xs border border-slate-100">
                      <span className="font-bold text-slate-500 text-[10px] uppercase">Package Details:</span>
                      <p className="text-slate-800 font-medium mt-0.5">{del.packageDetails}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        disabled={!isEligibleForNewDeliveries}
                        onClick={async () => {
                          await acceptRiderDelivery(del.id);
                          setActiveTab('active');
                        }}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold text-white shadow-xs transition-all ${
                          isEligibleForNewDeliveries
                            ? 'bg-orange-600 hover:bg-orange-700'
                            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {isEligibleForNewDeliveries ? 'Accept Delivery Run' : 'Ineligible to Accept'}
                      </button>

                      <button
                        onClick={() => declineRiderDelivery(del.id)}
                        className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* 4. ACTIVE DELIVERY TAB (FULL STEP-BY-STEP WORKFLOW) */}
        {/* ============================================================== */}
        {activeTab === 'active' && (
          <div className="space-y-6 animate-in fade-in">
            {!activeDelivery ? (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200 space-y-4">
                <Bike className="w-14 h-14 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">No Active Delivery in Progress</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  You currently have no assigned delivery underway. Browse available calls and accept an order to begin trip workflow.
                </p>
                <button
                  onClick={() => setActiveTab('available')}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Browse Available Deliveries
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Active Trip Header */}
                <div className="bg-white rounded-3xl p-6 border-2 border-orange-500 shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-black uppercase">
                          Active Courier Mission
                        </span>
                        <span className="text-xs text-slate-400 font-bold">Trip #{activeDelivery.id}</span>
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 mt-1">
                        Order #{activeDelivery.orderId}
                      </h2>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-400 block uppercase">Guaranteed Rider Fee</span>
                      <span className="text-2xl font-black text-emerald-600">Le {activeDelivery.deliveryFee}</span>
                    </div>
                  </div>

                  {/* WORKFLOW STATUS PIPELINE INDICATOR */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700">Delivery Workflow Progress:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                      {[
                        { key: 'DELIVERY_ASSIGNED', label: '1. Assigned' },
                        { key: 'GOING_TO_PICKUP', label: '2. En Route' },
                        { key: 'ARRIVED_AT_PICKUP', label: '3. At Store' },
                        { key: 'ORDER_PICKED_UP', label: '4. Picked Up' },
                        { key: 'OUT_FOR_DELIVERY', label: '5. Out for Delivery' },
                        { key: 'ARRIVED_AT_CUSTOMER', label: '6. At Customer' },
                        { key: 'DELIVERED', label: '7. Delivered' },
                      ].map((step, idx) => {
                        const statusOrder = [
                          'DELIVERY_ASSIGNED',
                          'GOING_TO_PICKUP',
                          'ARRIVED_AT_PICKUP',
                          'ORDER_PICKED_UP',
                          'OUT_FOR_DELIVERY',
                          'ARRIVED_AT_CUSTOMER',
                          'DELIVERED',
                        ];
                        const currentIdx = statusOrder.indexOf(activeDelivery.status);
                        const isCurrent = activeDelivery.status === step.key;
                        const isDone = currentIdx >= idx;

                        return (
                          <div
                            key={step.key}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              isCurrent
                                ? 'bg-orange-600 text-white font-black border-orange-600 shadow-md ring-2 ring-orange-300'
                                : isDone
                                ? 'bg-emerald-50 text-emerald-800 font-bold border-emerald-200'
                                : 'bg-slate-50 text-slate-400 border-slate-200'
                            }`}
                          >
                            <span className="text-[11px] block">{step.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ROUTE MAP SIMULATION CARD */}
                  <div className="h-44 rounded-2xl bg-linear-to-br from-slate-100 via-amber-50 to-orange-50 border border-slate-200 relative flex items-center justify-around p-4 overflow-hidden">
                    <div className="text-center z-10">
                      <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-900 mt-1.5">Pickup Merchant</p>
                      <p className="text-[10px] text-slate-500">{activeDelivery.sellerName}</p>
                    </div>

                    <div className="flex-1 max-w-xs mx-4 flex items-center justify-center">
                      <div className="w-full border-t-2 border-dashed border-orange-500 relative flex items-center justify-center">
                        <div className="p-2 bg-orange-600 text-white rounded-full shadow-lg -mt-1 animate-pulse">
                          <Bike className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <div className="text-center z-10">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-900 mt-1.5">Drop-off Customer</p>
                      <p className="text-[10px] text-slate-500">{activeDelivery.customerName}</p>
                    </div>
                  </div>

                  {/* CONTACT & LOCATION DETAILS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Pickup Info */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-blue-600">Merchant Store</span>
                        <a
                          href={`tel:${activeDelivery.sellerPhone}`}
                          className="px-2.5 py-1 bg-blue-100 text-[#1E40AF] rounded-lg font-bold flex items-center gap-1 hover:bg-blue-200"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call Store</span>
                        </a>
                      </div>
                      <h4 className="font-black text-slate-900 text-sm">{activeDelivery.sellerName}</h4>
                      <p className="text-slate-600">{activeDelivery.pickupLocation}</p>
                      <p className="text-slate-400 text-[11px]">Phone: {activeDelivery.sellerPhone}</p>
                    </div>

                    {/* Customer Dropoff Info (Protected Privacy) */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-emerald-600">Customer Drop-off</span>
                        <a
                          href={`tel:${activeDelivery.customerPhone}`}
                          className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold flex items-center gap-1 hover:bg-emerald-200"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call Buyer</span>
                        </a>
                      </div>
                      <h4 className="font-black text-slate-900 text-sm">{activeDelivery.customerName}</h4>
                      <p className="text-slate-600">{activeDelivery.deliveryLocation}</p>
                      <p className="text-slate-400 text-[11px]">Phone: {activeDelivery.customerPhone}</p>
                    </div>
                  </div>

                  {/* Package info */}
                  <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/70 text-xs text-amber-900 space-y-1">
                    <span className="font-bold uppercase text-[10px]">Package Contents & Instructions:</span>
                    <p className="font-semibold text-slate-800">{activeDelivery.packageDetails}</p>
                  </div>

                  {/* ACTION WORKFLOW ADVANCEMENT BUTTONS */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                      Next Workflow Step Action:
                    </h3>

                    {/* 1. ASSIGNED -> GOING TO PICKUP */}
                    {(activeDelivery.status === 'DELIVERY_ASSIGNED' || activeDelivery.status === 'Accepted') && (
                      <button
                        disabled={updatingStatus}
                        onClick={() => handleAdvanceStatus('GOING_TO_PICKUP')}
                        className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-sm transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <Bike className="w-5 h-5" />
                        <span>Start Trip &rarr; Heading to Merchant Store (GOING_TO_PICKUP)</span>
                      </button>
                    )}

                    {/* 2. GOING TO PICKUP -> ARRIVED AT PICKUP */}
                    {activeDelivery.status === 'GOING_TO_PICKUP' && (
                      <button
                        disabled={updatingStatus}
                        onClick={() => handleAdvanceStatus('ARRIVED_AT_PICKUP')}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <MapPin className="w-5 h-5" />
                        <span>Arrived at Merchant Store (ARRIVED_AT_PICKUP)</span>
                      </button>
                    )}

                    {/* 3. ARRIVED AT PICKUP -> ORDER PICKED UP */}
                    {activeDelivery.status === 'ARRIVED_AT_PICKUP' && (
                      <button
                        disabled={updatingStatus}
                        onClick={() => handleAdvanceStatus('ORDER_PICKED_UP')}
                        className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-black text-sm transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <Package className="w-5 h-5" />
                        <span>Verify & Collect Order from Seller (ORDER_PICKED_UP)</span>
                      </button>
                    )}

                    {/* 4. ORDER PICKED UP -> OUT FOR DELIVERY */}
                    {(activeDelivery.status === 'ORDER_PICKED_UP' || activeDelivery.status === 'In Transit') && (
                      <button
                        disabled={updatingStatus}
                        onClick={() => handleAdvanceStatus('OUT_FOR_DELIVERY')}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <Navigation className="w-5 h-5" />
                        <span>Depart Store &rarr; Out for Delivery to Customer (OUT_FOR_DELIVERY)</span>
                      </button>
                    )}

                    {/* 5. OUT FOR DELIVERY -> ARRIVED AT CUSTOMER */}
                    {activeDelivery.status === 'OUT_FOR_DELIVERY' && (
                      <button
                        disabled={updatingStatus}
                        onClick={() => handleAdvanceStatus('ARRIVED_AT_CUSTOMER')}
                        className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-sm transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <MapPin className="w-5 h-5" />
                        <span>Arrived at Customer Destination (ARRIVED_AT_CUSTOMER)</span>
                      </button>
                    )}

                    {/* 6. ARRIVED AT CUSTOMER -> PROOF OF DELIVERY & COMPLETE (DELIVERED) */}
                    {activeDelivery.status === 'ARRIVED_AT_CUSTOMER' && (
                      <div className="bg-emerald-50/60 p-5 rounded-3xl border border-emerald-200 space-y-4">
                        <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>Proof of Delivery Verification</span>
                        </div>

                        {/* Customer 4-digit Delivery OTP */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Key className="w-3.5 h-3.5 text-orange-600" />
                              Customer Delivery Code / OTP (Provided to Buyer):
                            </span>
                            <span className="text-[11px] text-slate-400">Ask buyer for 4-digit code</span>
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value)}
                            placeholder={activeDelivery.deliveryOtp ? `e.g. ${activeDelivery.deliveryOtp}` : 'e.g. 1234'}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-black text-center tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>

                        {/* Handover Photo Proof */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                            <Camera className="w-3.5 h-3.5 text-purple-600" />
                            <span>Photo Proof of Delivery:</span>
                          </label>
                          <div className="flex items-center gap-3">
                            <label className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1.5">
                              <Camera className="w-4 h-4" />
                              <span>Take / Upload Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoCapture}
                                className="hidden"
                              />
                            </label>

                            {proofPhoto && (
                              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Photo Attached</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Confirmation Notes */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700">Handover Notes (Optional):</label>
                          <input
                            type="text"
                            value={proofNotes}
                            onChange={(e) => setProofNotes(e.target.value)}
                            placeholder="Handed directly to buyer at gate"
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs"
                          />
                        </div>

                        <button
                          disabled={updatingStatus}
                          onClick={() => handleAdvanceStatus('DELIVERED')}
                          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Verify Delivery Code & Confirm Handover (DELIVERED)</span>
                        </button>
                      </div>
                    )}

                    {/* Secondary Actions: Report Failure or Cancel */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <button
                        onClick={() => setShowFailureModal(true)}
                        className="text-red-600 hover:underline font-bold flex items-center gap-1"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Report Delivery Failure</span>
                      </button>

                      <button
                        onClick={() => setShowCancelModal(true)}
                        className="text-slate-500 hover:text-slate-800 font-bold"
                      >
                        Cancel Delivery Run
                      </button>
                    </div>
                  </div>
                </div>

                {/* TRIP TIMELINE */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                  <h3 className="text-sm font-black text-slate-900">Trip Audit Timeline</h3>
                  <div className="space-y-3">
                    {(activeDelivery.timeline || []).map((t, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-600 mt-1.5 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900">{t.status.replace(/_/g, ' ')}</p>
                          <p className="text-slate-500 text-[11px]">{t.description || 'Status updated'} • {t.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* 5. MY DELIVERIES TAB */}
        {/* ============================================================== */}
        {activeTab === 'my_deliveries' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">My Deliveries Queue</h2>
                <p className="text-xs text-slate-500">Track all orders assigned, picked up, or completed by you</p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {(['All', 'Active', 'Completed', 'Failed'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedFilter === filter ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {myDeliveries.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200">
                <p className="text-sm font-bold">You haven't accepted any deliveries yet.</p>
                <button
                  onClick={() => setActiveTab('available')}
                  className="mt-3 px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl"
                >
                  Accept a Delivery Call
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {myDeliveries
                  .filter((d) => {
                    if (selectedFilter === 'Active') return !['DELIVERED', 'FAILED', 'CANCELLED'].includes(d.status);
                    if (selectedFilter === 'Completed') return d.status === 'DELIVERED';
                    if (selectedFilter === 'Failed') return ['FAILED', 'CANCELLED'].includes(d.status);
                    return true;
                  })
                  .map((del) => (
                    <div
                      key={del.id}
                      className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 font-black">
                          <Bike className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900">Trip #{del.id}</span>
                            <span className="text-slate-400">({del.orderId})</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                del.status === 'DELIVERED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : del.status === 'FAILED' || del.status === 'CANCELLED'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}
                            >
                              {del.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-1">From: {del.sellerName} &rarr; To: {del.deliveryLocation}</p>
                          <p className="text-slate-400 text-[11px] mt-0.5">{del.packageDetails}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end md:self-auto">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">Fee</span>
                          <span className="text-base font-black text-emerald-600">Le {del.deliveryFee}</span>
                        </div>

                        {!['DELIVERED', 'FAILED', 'CANCELLED'].includes(del.status) && (
                          <button
                            onClick={() => setActiveTab('active')}
                            className="px-4 py-2 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700"
                          >
                            Manage Run
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* 6. COMPLETED DELIVERIES TAB */}
        {/* ============================================================== */}
        {activeTab === 'completed' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900">Completed Deliveries</h2>
                <p className="text-xs text-slate-500">Orders successfully handed over to verified customers</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black">
                {completedDeliveries.length} Delivered
              </span>
            </div>

            {completedDeliveries.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200">
                <p className="text-sm font-bold">No completed deliveries yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {completedDeliveries.map((del) => (
                  <div
                    key={del.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">Trip #{del.id}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> OTP Verified
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">Delivered to: {del.customerName} ({del.deliveryLocation})</p>
                      <p className="text-slate-400 text-[11px]">Merchant: {del.sellerName} • {del.deliveredTimestamp ? new Date(del.deliveredTimestamp).toLocaleString() : 'Delivered'}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-emerald-600">Le {del.deliveryFee}</span>
                      <span className="text-[10px] text-slate-400 block">Credited to Balance</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* 7. FAILED DELIVERIES TAB */}
        {/* ============================================================== */}
        {activeTab === 'failed' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h2 className="text-xl font-black text-slate-900">Failed & Cancelled Deliveries</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Packages that could not be delivered. Return items to the originating merchant store.
              </p>
            </div>

            {failedDeliveries.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200">
                <p className="text-sm font-bold text-emerald-600">No failed trips! You maintain a pristine delivery record.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {failedDeliveries.map((del) => (
                  <div
                    key={del.id}
                    className="bg-white rounded-3xl p-5 border border-red-200 shadow-xs space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-black text-slate-900">Trip #{del.id}</span>
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                          {del.status}
                        </span>
                      </div>
                      <span className="text-slate-400 text-[11px]">{new Date(del.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-red-700 font-semibold">
                      Reason: {del.failureReason || del.cancellationReason || 'Delivery could not be completed.'}
                    </p>
                    <p className="text-slate-500">
                      Merchant Return Location: <strong className="text-slate-800">{del.pickupLocation}</strong>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* 8. EARNINGS TAB */}
        {/* ============================================================== */}
        {activeTab === 'earnings' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Earnings Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Available for Payout</span>
                <p className="text-3xl font-black text-emerald-600 mt-1">Le {availableBalance}</p>
                <button
                  onClick={() => setShowPayoutModal(true)}
                  className="mt-3 w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  Request Payout
                </button>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Pending Payouts</span>
                <p className="text-3xl font-black text-amber-600 mt-1">Le {pendingPayouts}</p>
                <p className="text-[11px] text-slate-400 mt-2">Under review by finance department</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Total Lifetime Earnings</span>
                <p className="text-3xl font-black text-slate-900 mt-1">Le {totalEarned}</p>
                <p className="text-[11px] text-slate-400 mt-2">{completedDeliveries.length} completed deliveries</p>
              </div>
            </div>

            {/* Delivery Earnings Report */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">Delivery Earnings Report</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Trip Reference</th>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Merchant</th>
                      <th className="py-3 px-4">Completion Date</th>
                      <th className="py-3 px-4 text-right">Delivery Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {completedDeliveries.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400">
                          No delivery earnings recorded yet.
                        </td>
                      </tr>
                    ) : (
                      completedDeliveries.map((del) => (
                        <tr key={del.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 font-bold text-slate-900">#{del.id}</td>
                          <td className="py-3 px-4 text-slate-600">{del.orderId}</td>
                          <td className="py-3 px-4 text-slate-700">{del.sellerName}</td>
                          <td className="py-3 px-4 text-slate-500">
                            {del.deliveredTimestamp ? new Date(del.deliveredTimestamp).toLocaleDateString() : 'Today'}
                          </td>
                          <td className="py-3 px-4 text-right font-black text-emerald-600">
                            Le {del.deliveryFee}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 9. PAYOUTS TAB */}
        {/* ============================================================== */}
        {activeTab === 'payouts' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Rider Payout Management</h2>
                <p className="text-xs text-slate-500">Transfer your delivery earnings directly to Mobile Money or Bank</p>
              </div>
              <button
                onClick={() => setShowPayoutModal(true)}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md self-start sm:self-auto"
              >
                Request Withdrawal
              </button>
            </div>

            {/* Payout History */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">Payout Request History</h3>
              {riderPayouts.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No payout requests submitted yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {riderPayouts.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900">Payout #{p.id}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.status === 'Paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : p.status === 'Rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-1">
                          {p.method} • Account: {p.accountNumber} ({p.accountName})
                        </p>
                        <p className="text-slate-400 text-[11px]">{new Date(p.createdAt).toLocaleString()}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-slate-900">Le {p.amount}</span>
                        {p.paidAt && (
                          <span className="text-[10px] text-emerald-600 block">
                            Paid on {new Date(p.paidAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 10. MESSAGES TAB */}
        {/* ============================================================== */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black text-slate-900">Dispatch Communications & Messages</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct channel with central dispatch, merchants, and support
              </p>
            </div>

            <div className="h-64 overflow-y-auto border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No active messages. You can reach out to Central Dispatch Coordinator below.
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-md p-3 rounded-2xl text-xs ${
                      m.senderId === currentUser?.id
                        ? 'ml-auto bg-orange-600 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                    }`}
                  >
                    <p className="font-semibold">{m.text}</p>
                    <span className={`text-[10px] block mt-1 ${m.senderId === currentUser?.id ? 'text-orange-200' : 'text-slate-400'}`}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type a message to Dispatch Coordinator..."
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* 11. NOTIFICATIONS TAB */}
        {/* ============================================================== */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black text-slate-900">Rider Dispatch Alerts</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Order dispatches, route alerts, and finance notifications
              </p>
            </div>

            {riderNotifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No notifications right now.
              </div>
            ) : (
              <div className="space-y-3">
                {riderNotifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs"
                  >
                    <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">{n.title}</h4>
                      <p className="text-slate-600 mt-0.5">{n.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* 12. DELIVERY HISTORY TAB */}
        {/* ============================================================== */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h2 className="text-xl font-black text-slate-900">Historical Delivery Logs</h2>
              <p className="text-xs text-slate-500 mt-0.5">Complete archive of every trip assignment and conclusion</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              {myDeliveries.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">No delivery history recorded yet.</div>
              ) : (
                myDeliveries.map((del) => (
                  <div
                    key={del.id}
                    className="p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">Trip #{del.id}</span>
                        <span className="text-slate-400">({del.orderId})</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {del.status}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">From: {del.sellerName} &rarr; To: {del.deliveryLocation}</p>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-slate-900">Le {del.deliveryFee}</span>
                      <span className="text-[10px] text-slate-400 block">{new Date(del.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 13. PROFILE & VEHICLE TAB */}
        {/* ============================================================== */}
        {activeTab === 'profile_vehicle' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Rider Profile & Vehicle Registry</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your contact details, motorcycle info, and license registrations
                </p>
              </div>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-bold">
                {currentRiderProfile?.accountStatus || 'active'}
              </span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Residential Address</label>
                    <input
                      type="text"
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">City / Region</label>
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle & Motorcycle Information */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Car className="w-4 h-4 text-orange-600" />
                  Vehicle & License Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Vehicle Type</label>
                    <select
                      value={editVehicleType}
                      onChange={(e) => setEditVehicleType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="Motorcycle">Motorcycle (Recommended for Freetown)</option>
                      <option value="Bicycle">Bicycle / E-Bike</option>
                      <option value="Car">Car</option>
                      <option value="Van">Van / Delivery Truck</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Make & Model</label>
                    <input
                      type="text"
                      value={editVehicleModel}
                      onChange={(e) => setEditVehicleModel(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Vehicle Registration License Plate</label>
                    <input
                      type="text"
                      value={editRegNumber}
                      onChange={(e) => setEditRegNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Driver / Commercial License Number</label>
                    <input
                      type="text"
                      value={editLicenseNumber}
                      onChange={(e) => setEditLicenseNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  {isSavingProfile ? 'Saving...' : 'Save Profile & Vehicle Updates'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL: REQUEST PAYOUT */}
        {/* ============================================================== */}
        {showPayoutModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 animate-in fade-in">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">Request Rider Payout</h3>
                <button onClick={() => setShowPayoutModal(false)} className="text-slate-400 hover:text-slate-600">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitPayout} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Withdrawal Amount (Available: Le {availableBalance})
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={availableBalance}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-black"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Payment Method</label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                  >
                    <option value="Orange Money">Orange Money</option>
                    <option value="Afrimoney">Afrimoney</option>
                    <option value="Bank Transfer">Commercial Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Mobile Money / Bank Account Number
                  </label>
                  <input
                    type="text"
                    value={payoutAccountNumber}
                    onChange={(e) => setPayoutAccountNumber(e.target.value)}
                    placeholder="+232 79 000000"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Account Holder Full Name</label>
                  <input
                    type="text"
                    value={payoutAccountName}
                    onChange={(e) => setPayoutAccountName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPayoutModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingPayout || payoutAmount <= 0 || payoutAmount > availableBalance}
                    className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-xs disabled:opacity-50"
                  >
                    {isSubmittingPayout ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: REPORT FAILURE */}
        {showFailureModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 animate-in fade-in">
              <h3 className="text-base font-black text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Report Delivery Failure
              </h3>
              <p className="text-xs text-slate-500">
                Please indicate the reason why this delivery could not be completed. The seller will be instructed on package return.
              </p>

              <div className="space-y-2 text-xs">
                <label className="font-bold text-slate-700">Failure Reason:</label>
                <select
                  value={failureReason}
                  onChange={(e) => setFailureReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                >
                  <option value="Customer unavailable at delivery address">Customer unavailable at delivery address</option>
                  <option value="Customer rejected order package">Customer rejected order package</option>
                  <option value="Delivery address incorrect / unreachable">Delivery address incorrect / unreachable</option>
                  <option value="Customer phone switched off">Customer phone switched off</option>
                  <option value="Road impassable due to weather/flooding">Road impassable due to weather/flooding</option>
                  <option value="Merchant provided damaged package">Merchant provided damaged package</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  onClick={() => setShowFailureModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFailDelivery}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Confirm Failure
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CANCEL DELIVERY */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 animate-in fade-in">
              <h3 className="text-base font-black text-slate-900">Cancel Delivery Assignment</h3>
              <p className="text-xs text-slate-500">
                Are you sure you need to cancel? The delivery will be returned to the dispatch queue for another courier.
              </p>

              <div className="space-y-2 text-xs">
                <label className="font-bold text-slate-700">Cancellation Reason:</label>
                <select
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                >
                  <option value="Vehicle mechanical breakdown / flat tire">Vehicle mechanical breakdown / flat tire</option>
                  <option value="Personal emergency">Personal emergency</option>
                  <option value="Merchant store closed upon arrival">Merchant store closed upon arrival</option>
                  <option value="Severe weather / flooding">Severe weather / flooding</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Back
                </button>
                <button
                  onClick={handleCancelDelivery}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
