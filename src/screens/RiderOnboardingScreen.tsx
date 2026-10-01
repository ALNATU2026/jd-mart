import React, { useState } from 'react';
import {
  Bike,
  UploadCloud,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  User,
  Car,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RiderOnboardingScreen: React.FC = () => {
  const {
    currentUser,
    currentRiderProfile,
    applyAsDispatchRider,
    uploadFile,
    navigate,
    showToast,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [fullName, setFullName] = useState(
    currentRiderProfile?.fullName || currentUser?.name || ''
  );
  const [phone, setPhone] = useState(
    currentRiderProfile?.phoneNumber || currentUser?.phone || ''
  );
  const [address, setAddress] = useState(
    currentRiderProfile?.address || currentUser?.address || '15 Campbell Street'
  );
  const [city, setCity] = useState(
    currentRiderProfile?.city || currentUser?.city || 'Freetown'
  );
  const [idType, setIdType] = useState<'National ID' | 'Passport' | 'Voter ID' | 'Driver License'>(
    currentRiderProfile?.identificationType || 'National ID'
  );
  const [idNumber, setIdNumber] = useState(currentRiderProfile?.idNumber || '');
  const [idDocUrl, setIdDocUrl] = useState(currentRiderProfile?.idDocumentUrl || '');

  // Vehicle & License
  const [vehicleType, setVehicleType] = useState<'Motorcycle' | 'Bicycle' | 'Car' | 'Van'>(
    currentRiderProfile?.vehicleType || 'Motorcycle'
  );
  const [vehicleModel, setVehicleModel] = useState(
    currentRiderProfile?.vehicleModel || 'Bajaj Boxer 150'
  );
  const [vehicleRegNumber, setVehicleRegNumber] = useState(
    currentRiderProfile?.vehicleRegistrationNumber || ''
  );
  const [vehicleDocUrl, setVehicleDocUrl] = useState(
    currentRiderProfile?.vehicleRegistrationDocumentUrl || ''
  );
  const [driverLicenseNumber, setDriverLicenseNumber] = useState(
    currentRiderProfile?.driverLicenseNumber || ''
  );
  const [driverLicenseDocUrl, setDriverLicenseDocUrl] = useState(
    currentRiderProfile?.driverLicenseDocumentUrl || ''
  );

  // Upload progress states
  const [uploadingId, setUploadingId] = useState(false);
  const [uploadingVehicle, setUploadingVehicle] = useState(false);
  const [uploadingLicense, setUploadingLicense] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFileUpload = async (
    file: File,
    type: 'id' | 'vehicle' | 'license'
  ) => {
    try {
      if (type === 'id') setUploadingId(true);
      if (type === 'vehicle') setUploadingVehicle(true);
      if (type === 'license') setUploadingLicense(true);

      const meta = await uploadFile(file, 'seller-document', currentUser?.id || 'rider');
      if (type === 'id') setIdDocUrl(meta.downloadURL);
      if (type === 'vehicle') setVehicleDocUrl(meta.downloadURL);
      if (type === 'license') setDriverLicenseDocUrl(meta.downloadURL);

      showToast(`Document uploaded successfully!`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Upload failed';
      showToast(msg);
    } finally {
      if (type === 'id') setUploadingId(false);
      if (type === 'vehicle') setUploadingVehicle(false);
      if (type === 'license') setUploadingLicense(false);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !vehicleRegNumber || !driverLicenseNumber) {
      showToast('Please complete all required fields and documentation');
      return;
    }
    setSubmitting(true);
    try {
      await applyAsDispatchRider({
        fullName,
        phoneNumber: phone,
        address,
        city,
        identificationType: idType,
        idNumber,
        idDocumentUrl: idDocUrl,
        vehicleType,
        vehicleModel,
        vehicleRegistrationNumber: vehicleRegNumber,
        vehicleRegistrationDocumentUrl: vehicleDocUrl,
        driverLicenseNumber,
        driverLicenseDocumentUrl: driverLicenseDocUrl,
      });
    } catch {
      // handled
    } finally {
      setSubmitting(false);
    }
  };

  // If rider application is already pending or approved
  if (currentRiderProfile?.approvalStatus === 'approved') {
    return (
      <div className="min-h-screen bg-[#F5F7FB] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs text-center space-y-5 animate-in fade-in">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Rider Account Active & Approved!
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Your courier credentials, vehicle registration, and driver license have been verified by JD Mart Admin.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-700 space-y-1 text-left border border-slate-200">
            <p><strong>Courier:</strong> {currentRiderProfile.fullName}</p>
            <p><strong>Vehicle:</strong> {currentRiderProfile.vehicleType} ({currentRiderProfile.vehicleRegistrationNumber})</p>
            <p><strong>License:</strong> {currentRiderProfile.driverLicenseNumber}</p>
            <p><strong>Status:</strong> <span className="text-emerald-600 font-bold">APPROVED & ACTIVE</span></p>
          </div>
          <button
            onClick={() => navigate('/rider')}
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Open Dispatch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (currentRiderProfile?.approvalStatus === 'pending') {
    return (
      <div className="min-h-screen bg-[#F5F7FB] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-amber-200/80 shadow-xs text-center space-y-5 animate-in fade-in">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider">
              Pending Admin Review
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
              Application Under Review
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Thank you for applying to the JD Mart Dispatch Courier Fleet. Our fleet operations team is currently verifying your driver license and vehicle documents.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-700 space-y-1.5 text-left border border-slate-200">
            <p><strong>Applicant Name:</strong> {currentRiderProfile.fullName}</p>
            <p><strong>Phone:</strong> {currentRiderProfile.phoneNumber}</p>
            <p><strong>Vehicle:</strong> {currentRiderProfile.vehicleType} • {currentRiderProfile.vehicleRegistrationNumber}</p>
            <p><strong>License Number:</strong> {currentRiderProfile.driverLicenseNumber}</p>
            <p><strong>Submission Date:</strong> {new Date(currentRiderProfile.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="p-3 bg-blue-50 text-blue-800 rounded-2xl text-xs flex items-center gap-2 text-left">
            <AlertTriangle className="w-4 h-4 shrink-0 text-blue-600" />
            <span>Per platform security policy, dispatches can only be accepted once approved by JD Mart administration.</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
            >
              Back to Marketplace
            </button>
            <button
              onClick={() => showToast('Helpline: +232 76 123456 (JD Mart Dispatch Operations)')}
              className="flex-1 py-2.5 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-2 shadow-inner">
            <Bike className="w-7 h-7" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold uppercase tracking-wider">
            Courier Logistics Network
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Apply as a Dispatch Courier
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Collect verified orders from stores and deliver across Freetown. Applications are subject to admin license review.
          </p>
        </div>

        {/* Steps Progress Bar */}
        <div className="flex items-center justify-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
              step >= 1 ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}
          >
            1
          </div>
          <div className={`h-1 w-12 rounded-full ${step >= 2 ? 'bg-orange-600' : 'bg-slate-200'}`} />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
              step >= 2 ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}
          >
            2
          </div>
          <div className={`h-1 w-12 rounded-full ${step >= 3 ? 'bg-orange-600' : 'bg-slate-200'}`} />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
              step >= 3 ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}
          >
            3
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitApplication} className="space-y-5">
          {/* STEP 1: PERSONAL & IDENTIFICATION */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <User className="w-4 h-4 text-orange-600" />
                <span>Step 1: Courier Information & Identification</span>
              </h3>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Samuel Bangura"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+232 79 334455"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Residential City / Area</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Freetown, Lumley, Kissy"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Residential Street Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 24 Circular Road"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Government ID Type</label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
                  >
                    <option value="National ID">National Identity Card (NCRA)</option>
                    <option value="Passport">Sierra Leone Passport</option>
                    <option value="Voter ID">National Voter Card</option>
                    <option value="Driver License">Driver License</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">ID Document Number</label>
                  <input
                    type="text"
                    required
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="e.g. SL-ID-892401"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Upload ID Document */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Upload Photo of Government ID</p>
                  <p className="text-[10px] text-slate-400">Clear front/back image of your official card</p>
                </div>
                <label className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-xs inline-flex items-center gap-1.5">
                  <UploadCloud className="w-3.5 h-3.5 text-orange-600" />
                  <span>{uploadingId ? 'Uploading...' : idDocUrl ? 'Uploaded ✓' : 'Upload ID'}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'id');
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!fullName || !phone || !idNumber) {
                      showToast('Please enter your full name, phone, and ID number');
                      return;
                    }
                    setStep(2);
                  }}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <span>Continue to Vehicle Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: VEHICLE & LICENSE */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Car className="w-4 h-4 text-orange-600" />
                <span>Step 2: Vehicle & Driver License Verification</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Vehicle Classification</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
                  >
                    <option value="Motorcycle">Motorcycle / Commercial Scooter</option>
                    <option value="Bicycle">Bicycle / Electric Bike</option>
                    <option value="Car">Sedan / Delivery Car</option>
                    <option value="Van">Van / Light Commercial Truck</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Vehicle Model & Make</label>
                  <input
                    type="text"
                    required
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="e.g. Bajaj Boxer 150cc / TVS Star"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">License Plate / Vehicle Registration Number</label>
                <input
                  type="text"
                  required
                  value={vehicleRegNumber}
                  onChange={(e) => setVehicleRegNumber(e.target.value)}
                  placeholder="e.g. SL-AB 2049"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 uppercase"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Commercial Driver / Rider License Number</label>
                <input
                  type="text"
                  required
                  value={driverLicenseNumber}
                  onChange={(e) => setDriverLicenseNumber(e.target.value)}
                  placeholder="e.g. SL-LIC-99482"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 uppercase"
                />
              </div>

              {/* Upload Vehicle Registration */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Vehicle Registration Document</p>
                  <p className="text-[10px] text-slate-400">Logbook / ownership proof or road fitness paper</p>
                </div>
                <label className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-xs inline-flex items-center gap-1.5">
                  <UploadCloud className="w-3.5 h-3.5 text-orange-600" />
                  <span>{uploadingVehicle ? 'Uploading...' : vehicleDocUrl ? 'Uploaded ✓' : 'Upload Document'}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'vehicle');
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Upload Driver License */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Driver License Card / Permit</p>
                  <p className="text-[10px] text-slate-400">Class A commercial motorcycle or vehicle license</p>
                </div>
                <label className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-xs inline-flex items-center gap-1.5">
                  <UploadCloud className="w-3.5 h-3.5 text-orange-600" />
                  <span>{uploadingLicense ? 'Uploading...' : driverLicenseDocUrl ? 'Uploaded ✓' : 'Upload License'}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'license');
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!vehicleRegNumber || !driverLicenseNumber) {
                      showToast('Please enter your license plate and driver license number');
                      return;
                    }
                    setStep(3);
                  }}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <span>Review & Submit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & SUBMIT */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Step 3: Review Application Information
              </h3>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700">
                <p><strong>Courier:</strong> {fullName}</p>
                <p><strong>Contact Phone:</strong> {phone}</p>
                <p><strong>Location:</strong> {address}, {city}</p>
                <p><strong>Identification:</strong> {idType} (#{idNumber})</p>
                <p><strong>Vehicle:</strong> {vehicleType} ({vehicleModel})</p>
                <p><strong>License Plate:</strong> {vehicleRegNumber}</p>
                <p><strong>Driver License:</strong> {driverLicenseNumber}</p>
              </div>

              <div className="p-3 bg-amber-50 text-amber-900 rounded-2xl text-xs border border-amber-200 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Admin Verification Required:</strong> By submitting, you acknowledge that your documents will undergo administrative review. You will be notified once activated.
                </p>
              </div>

              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? 'Submitting Application...' : 'Submit Application for Review'}</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
