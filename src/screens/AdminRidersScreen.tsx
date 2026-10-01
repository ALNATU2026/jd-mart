import React, { useState } from 'react';
import {
  ArrowLeft,
  Bike,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertTriangle,
  Search,
  Filter,
  FileText,
  ExternalLink,
  Phone,
  MapPin,
  Car,
  User,
  Ban,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RiderProfile } from '../types';

export const AdminRidersScreen: React.FC = () => {
  const {
    riderProfiles,
    approveRiderApplication,
    rejectRiderApplication,
    suspendRiderAccount,
    activateRiderAccount,
    navigate,
    showToast,
  } = useApp();

  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected' | 'Suspended'>('All');
  const [search, setSearch] = useState('');
  const [rejectingRider, setRejectingRider] = useState<RiderProfile | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Incomplete driver license documentation or expired vehicle registration');
  const [inspectingRider, setInspectingRider] = useState<RiderProfile | null>(null);

  // Fallback demo fleet if firestore is empty
  const defaultFleet: RiderProfile[] = [
    {
      id: 'rider-demo-1',
      userId: 'user-r1',
      fullName: 'Samuel Bangura',
      phoneNumber: '+232 79 334455',
      address: '14 Circular Road',
      city: 'Freetown',
      identificationType: 'National ID',
      idNumber: 'SL-NID-99201',
      vehicleType: 'Motorcycle',
      vehicleModel: 'Bajaj Boxer 150',
      vehicleRegistrationNumber: 'SL-AB 2049',
      driverLicenseNumber: 'Class A Commercial #SL-99482',
      approvalStatus: 'approved',
      accountStatus: 'active',
      availability: 'ONLINE',
      rating: 4.9,
      totalDeliveries: 142,
      createdAt: '2026-01-15T09:00:00Z',
    },
    {
      id: 'rider-demo-2',
      userId: 'user-r2',
      fullName: 'Alpha Bah',
      phoneNumber: '+232 77 119922',
      address: '8 Wilkinson Road',
      city: 'Freetown',
      identificationType: 'Driver License',
      idNumber: 'DL-SL-88392',
      vehicleType: 'Motorcycle',
      vehicleModel: 'Honda Ace 125',
      vehicleRegistrationNumber: 'SL-CD 1032',
      driverLicenseNumber: 'Class A Commercial #SL-88392',
      approvalStatus: 'approved',
      accountStatus: 'active',
      availability: 'ONLINE',
      rating: 4.8,
      totalDeliveries: 89,
      createdAt: '2026-02-10T11:30:00Z',
    },
    {
      id: 'rider-demo-3',
      userId: 'user-r3',
      fullName: 'Alhaji Kamara',
      phoneNumber: '+232 30 442211',
      address: '22 Regent Road, Lumley',
      city: 'Freetown',
      identificationType: 'Voter ID',
      idNumber: 'VTR-SL-40291',
      vehicleType: 'Motorcycle',
      vehicleModel: 'TVS HLX 150',
      vehicleRegistrationNumber: 'SL-EF 4021',
      driverLicenseNumber: 'SL-LIC-40219-PENDING',
      approvalStatus: 'pending',
      accountStatus: 'pending',
      availability: 'OFFLINE',
      rating: 5.0,
      totalDeliveries: 0,
      createdAt: '2026-03-28T14:15:00Z',
    },
  ];

  const allRiders: RiderProfile[] =
    riderProfiles.length > 0
      ? riderProfiles
      : defaultFleet;

  const pendingCount = allRiders.filter((r) => r.approvalStatus === 'pending').length;
  const approvedCount = allRiders.filter((r) => r.approvalStatus === 'approved').length;
  const suspendedCount = allRiders.filter((r) => r.accountStatus === 'suspended' || r.approvalStatus === 'rejected').length;

  const filteredRiders = allRiders.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.phoneNumber.includes(search) ||
      r.vehicleRegistrationNumber.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'Pending') return r.approvalStatus === 'pending';
    if (filter === 'Approved') return r.approvalStatus === 'approved' && r.accountStatus !== 'suspended';
    if (filter === 'Rejected') return r.approvalStatus === 'rejected';
    if (filter === 'Suspended') return r.accountStatus === 'suspended';
    return true;
  });

  const handleConfirmReject = async () => {
    if (!rejectingRider) return;
    await rejectRiderApplication(rejectingRider.id, rejectionReason);
    setRejectingRider(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Admin Console</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dispatch Rider Fleet & Licensing Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review applicant identities, validate motorbike registration and driver licenses, and approve courier accounts
          </p>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Total Fleet</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{allRiders.length}</p>
            <span className="text-[11px] font-semibold text-slate-400">Registered applicants</span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Pending Approvals</span>
            <p className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</p>
            <span className="text-[11px] font-semibold text-amber-600">Requires verification</span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Active & Licensed</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">{approvedCount}</p>
            <span className="text-[11px] font-semibold text-emerald-600">Eligible to receive dispatches</span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Suspended / Rejected</span>
            <p className="text-2xl font-black text-rose-600 mt-1">{suspendedCount}</p>
            <span className="text-[11px] font-semibold text-rose-600">Restricted accounts</span>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by courier name, phone, or license plate..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(['All', 'Pending', 'Approved', 'Rejected', 'Suspended'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  filter === st
                    ? 'bg-[#1E40AF] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
                {st === 'Pending' && pendingCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 bg-amber-400 text-amber-950 rounded-full text-[10px] font-black">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* RIDERS LIST */}
        <div className="space-y-4">
          {filteredRiders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200">
              <p className="text-sm font-bold">No dispatch riders found matching the filter criteria.</p>
            </div>
          ) : (
            filteredRiders.map((rider) => (
              <div
                key={rider.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-black shrink-0">
                      <Bike className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-black text-slate-900">{rider.fullName}</h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            rider.approvalStatus === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rider.approvalStatus === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          Approval: {rider.approvalStatus}
                        </span>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            rider.accountStatus === 'active'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          Account: {rider.accountStatus}
                        </span>

                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                          Duty: {rider.availability}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                        <span>Phone: <strong className="text-slate-800">{rider.phoneNumber}</strong></span>
                        <span>•</span>
                        <span>Location: {rider.address}, {rider.city}</span>
                        <span>•</span>
                        <span>Deliveries: <strong className="text-slate-800">{rider.totalDeliveries || 0}</strong></span>
                        <span>•</span>
                        <span>Rating: <strong className="text-amber-500">★ {rider.rating || '5.0'}</strong></span>
                      </p>
                    </div>
                  </div>

                  {/* ADMIN ACTION CONTROLS */}
                  <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
                    {rider.approvalStatus === 'pending' && (
                      <>
                        <button
                          onClick={() => approveRiderApplication(rider.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve & Activate Rider</span>
                        </button>

                        <button
                          onClick={() => setRejectingRider(rider)}
                          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {rider.approvalStatus === 'approved' && rider.accountStatus === 'active' && (
                      <button
                        onClick={() => suspendRiderAccount(rider.id)}
                        className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold flex items-center gap-1"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Suspend Account</span>
                      </button>
                    )}

                    {rider.accountStatus === 'suspended' && (
                      <button
                        onClick={() => activateRiderAccount(rider.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Reactivate Account</span>
                      </button>
                    )}

                    <button
                      onClick={() => setInspectingRider(rider)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review Documents</span>
                    </button>
                  </div>
                </div>

                {/* VEHICLE & LICENSE AUDIT GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="font-bold text-slate-400 uppercase text-[10px] block">Vehicle Specs</span>
                    <p className="font-black text-slate-800 mt-0.5">{rider.vehicleType} • {rider.vehicleModel || 'Standard'}</p>
                    <p className="text-slate-500 font-mono text-[11px]">Plate: {rider.vehicleRegistrationNumber}</p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-400 uppercase text-[10px] block">Driver's License</span>
                    <p className="font-black text-slate-800 mt-0.5">{rider.driverLicenseNumber}</p>
                    <span className="text-[11px] text-emerald-600 font-semibold">Commercial Motorbike Class</span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-400 uppercase text-[10px] block">National Identification</span>
                    <p className="font-black text-slate-800 mt-0.5">{rider.identificationType}</p>
                    <p className="text-slate-500 font-mono text-[11px]">{rider.idNumber || 'Verified'}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODAL: DOCUMENT INSPECTION */}
        {inspectingRider && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 animate-in fade-in">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">
                  Rider Credentials: {inspectingRider.fullName}
                </h3>
                <button onClick={() => setInspectingRider(null)} className="text-slate-400 hover:text-slate-600">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
                {/* 1. National ID */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-500 uppercase text-[10px]">National ID Document</span>
                      <p className="font-bold text-slate-800 mt-0.5">{inspectingRider.identificationType} (#{inspectingRider.idNumber})</p>
                    </div>
                    {inspectingRider.idDocumentUrl ? (
                      <a
                        href={inspectingRider.idDocumentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-[#1E40AF] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-2xs hover:bg-blue-700"
                      >
                        <ExternalLink className="w-3 h-3" /> View Doc
                      </a>
                    ) : (
                      <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-bold">Pending Upload</span>
                    )}
                  </div>

                  {inspectingRider.idDocumentUrl && (
                    <div className="mt-2 bg-white rounded-xl border p-1 max-h-40 overflow-hidden flex items-center justify-center">
                      {inspectingRider.idDocumentUrl.startsWith('data:image') ||
                      inspectingRider.idDocumentUrl.match(/\.(jpeg|jpg|png|webp|gif)($|\?)/i) ? (
                        <img
                          src={inspectingRider.idDocumentUrl}
                          alt="National ID"
                          className="max-h-36 object-contain rounded"
                        />
                      ) : (
                        <div className="py-4 text-center">
                          <FileText className="w-8 h-8 text-[#1E40AF] mx-auto" />
                          <span className="text-[11px] text-slate-600 font-semibold">National ID Credential Attached</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Vehicle Registration */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-500 uppercase text-[10px]">Vehicle Registration Certificate</span>
                      <p className="font-bold text-slate-800 mt-0.5">{inspectingRider.vehicleType} Plate: {inspectingRider.vehicleRegistrationNumber}</p>
                    </div>
                    {inspectingRider.vehicleRegistrationDocumentUrl ? (
                      <a
                        href={inspectingRider.vehicleRegistrationDocumentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-[#1E40AF] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-2xs hover:bg-blue-700"
                      >
                        <ExternalLink className="w-3 h-3" /> View Doc
                      </a>
                    ) : (
                      <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-bold">Pending Upload</span>
                    )}
                  </div>

                  {inspectingRider.vehicleRegistrationDocumentUrl && (
                    <div className="mt-2 bg-white rounded-xl border p-1 max-h-40 overflow-hidden flex items-center justify-center">
                      {inspectingRider.vehicleRegistrationDocumentUrl.startsWith('data:image') ||
                      inspectingRider.vehicleRegistrationDocumentUrl.match(/\.(jpeg|jpg|png|webp|gif)($|\?)/i) ? (
                        <img
                          src={inspectingRider.vehicleRegistrationDocumentUrl}
                          alt="Vehicle Registration"
                          className="max-h-36 object-contain rounded"
                        />
                      ) : (
                        <div className="py-4 text-center">
                          <FileText className="w-8 h-8 text-[#1E40AF] mx-auto" />
                          <span className="text-[11px] text-slate-600 font-semibold">Vehicle Registration Certificate Attached</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. Driver's License */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-500 uppercase text-[10px]">Driver's License (SLRSA)</span>
                      <p className="font-bold text-slate-800 mt-0.5">{inspectingRider.driverLicenseNumber}</p>
                    </div>
                    {inspectingRider.driverLicenseDocumentUrl ? (
                      <a
                        href={inspectingRider.driverLicenseDocumentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-[#1E40AF] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-2xs hover:bg-blue-700"
                      >
                        <ExternalLink className="w-3 h-3" /> View Doc
                      </a>
                    ) : (
                      <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-bold">Pending Upload</span>
                    )}
                  </div>

                  {inspectingRider.driverLicenseDocumentUrl && (
                    <div className="mt-2 bg-white rounded-xl border p-1 max-h-40 overflow-hidden flex items-center justify-center">
                      {inspectingRider.driverLicenseDocumentUrl.startsWith('data:image') ||
                      inspectingRider.driverLicenseDocumentUrl.match(/\.(jpeg|jpg|png|webp|gif)($|\?)/i) ? (
                        <img
                          src={inspectingRider.driverLicenseDocumentUrl}
                          alt="Driver License"
                          className="max-h-36 object-contain rounded"
                        />
                      ) : (
                        <div className="py-4 text-center">
                          <FileText className="w-8 h-8 text-[#1E40AF] mx-auto" />
                          <span className="text-[11px] text-slate-600 font-semibold">Driver's License Credential Attached</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    approveRiderApplication(inspectingRider.id);
                    setInspectingRider(null);
                  }}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Documents & Approve</span>
                </button>
                <button
                  onClick={() => setInspectingRider(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: REJECT RIDER REASON */}
        {rejectingRider && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 animate-in fade-in">
              <h3 className="text-base font-black text-red-600">
                Reject Rider Application
              </h3>
              <p className="text-xs text-slate-500">
                Please specify the reason why <strong>{rejectingRider.fullName}</strong> cannot be approved into the dispatch fleet.
              </p>

              <div className="space-y-2 text-xs">
                <label className="font-bold text-slate-700">Reason for Rejection:</label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setRejectingRider(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
