import React, { useState } from 'react';
import { X, MapPin, Zap, CheckCircle2, Clock, Bike, Compass } from 'lucide-react';
import { PincodeDeliveryMap } from './PincodeDeliveryMap';

interface DeliveryCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartShopping: () => void;
}

const POPULAR_ZONES = [
  { code: '400053', label: 'Andheri West (Lokhandwala)' },
  { code: '400058', label: 'Andheri West (Station / SV Rd)' },
  { code: '400061', label: 'Versova Beach' },
  { code: '400049', label: 'Juhu' },
  { code: '400102', label: 'Oshiwara' },
];

export const DeliveryCheckerModal: React.FC<DeliveryCheckerModalProps> = ({
  isOpen,
  onClose,
  onStartShopping,
}) => {
  if (!isOpen) return null;

  const [postalInput, setPostalInput] = useState('400053');
  const [checked, setChecked] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postalInput.trim()) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setChecked(true);
    }, 450);
  };

  const handleSelectZone = (code: string) => {
    setPostalInput(code);
    setChecked(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delivery-checker-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-2xl w-full rounded-sm overflow-hidden shadow-2xl relative border border-black/10 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-black/10 flex items-center justify-between bg-[#111111] text-white">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#FF5757] fill-[#FF5757]" />
            <h2 id="delivery-checker-title" className="text-sm font-black font-fashion uppercase tracking-wider">
              Google Maps 10-Minute Instant Dispatch Radar
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition p-1 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <p className="text-xs text-black/70 leading-relaxed font-light">
              Apparellex operates neighborhood micro-fulfillment pods equipped with precision dark stores and dedicated electric Super73 cargo bike fleets.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-black">
              Enter Your Postal Code or Neighborhood:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-black/40" />
                <input
                  type="text"
                  required
                  value={postalInput}
                  onChange={(e) => {
                    setPostalInput(e.target.value);
                  }}
                  placeholder="e.g. 400053, Lokhandwala, Andheri West, 400058..."
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-black/20 rounded-sm bg-white focus:border-[#FF5757] outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isVerifying}
                className="bg-[#1a1a1a] hover:bg-[#FF5757] text-white px-5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? 'Checking...' : 'Check Zone'}
              </button>
            </div>

            {/* Quick zone chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-black/50 font-bold uppercase tracking-wider">
                Quick Select:
              </span>
              {POPULAR_ZONES.map((zone) => (
                <button
                  key={zone.code}
                  type="button"
                  onClick={() => handleSelectZone(zone.code)}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-xs transition cursor-pointer border ${
                    postalInput === zone.code
                      ? 'bg-[#111111] text-white border-black'
                      : 'bg-white hover:border-[#FF5757] text-black/70 border-black/15'
                  }`}
                >
                  {zone.code} ({zone.label})
                </button>
              ))}
            </div>
          </form>

          {/* Interactive Google Map of Delivery Zone */}
          <PincodeDeliveryMap pincode={postalInput || '10012'} isEligible={checked} />

          {/* Result Card */}
          {checked && (
            <div className="bg-[#FAF8F2] border border-black/15 p-3.5 rounded-sm space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    10-Minute Priority Dispatch Active in "{postalInput}"
                  </h4>
                  <p className="text-[11px] text-emerald-700">
                    Serviced directly by nearest dark store micro-hub with 15-min doorstep try-on.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onStartShopping();
                }}
                className="w-full bg-[#111111] hover:bg-[#FF5757] text-white py-3 rounded-sm text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md"
              >
                Start Shopping Now — Order for 10-Minute Delivery
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
