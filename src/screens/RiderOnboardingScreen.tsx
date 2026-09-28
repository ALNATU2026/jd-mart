import React, { useState } from 'react';
import { Bike, UploadCloud, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RiderOnboardingScreen: React.FC = () => {
  const { switchRole, navigate, showToast } = useApp();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState<'motorbike' | 'bicycle' | 'car' | 'van'>('motorbike');
  const [licensePlate, setLicensePlate] = useState('');
  const [licenseDoc, setLicenseDoc] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      showToast('Please fill out all rider fields');
      return;
    }

    switchRole('Rider');
    showToast('Rider profile onboarded! Welcome to the dispatch courier fleet.');
    navigate('/rider');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-2">
            <Bike className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Join the JD Mart Rider Fleet
          </h1>
          <p className="text-xs text-slate-500">
            Earn daily payouts delivering groceries, food, tech, and retail orders across Freetown
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Samuel Bangura"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
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
                placeholder="+232 79 000000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Vehicle Classification</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
              >
                <option value="motorbike">Motorbike / Scooter</option>
                <option value="bicycle">Bicycle</option>
                <option value="car">Car</option>
                <option value="van">Van / Light Truck</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Vehicle Registration / Plate Number</label>
            <input
              type="text"
              required
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              placeholder="e.g. SL-AB 2049"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
            />
          </div>

          {/* Rider License / ID upload simulation */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Sierra Leone Rider Driver's License or National ID</label>
            <div
              onClick={() => {
                setLicenseDoc(true);
                showToast('Driver license document attached!');
              }}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-700">
                {licenseDoc ? '✓ Class A Driver License Attached' : 'Click to attach valid driver license or national card'}
              </p>
              <span className="text-[10px] text-slate-400">Clear camera photo or scan</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            Submit Rider Verification & Launch Fleet App
          </button>
        </form>
      </div>
    </div>
  );
};
