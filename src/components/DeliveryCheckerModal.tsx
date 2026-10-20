import React, { useState } from 'react';
import { X, MapPin, Zap, CheckCircle2, Clock, Bike } from 'lucide-react';

interface DeliveryCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartShopping: () => void;
}

export const DeliveryCheckerModal: React.FC<DeliveryCheckerModalProps> = ({
  isOpen,
  onClose,
  onStartShopping,
}) => {
  if (!isOpen) return null;

  const [postalInput, setPostalInput] = useState('');
  const [checked, setChecked] = useState(false);
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delivery-checker-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-lg w-full rounded-sm overflow-hidden shadow-2xl relative border border-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-black/10 flex items-center justify-between bg-[#111111] text-white">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#FF5757] fill-[#FF5757]" />
            <h2 id="delivery-checker-title" className="text-sm font-black font-fashion uppercase tracking-wider">
              Verify 10-Minute Instant Dispatch Zone
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
        <div className="p-6 space-y-6">
          <div>
            <p className="text-xs text-black/70 leading-relaxed font-light">
              Apparellex operates neighborhood micro-fulfillment pods equipped with precision dark stores and dedicated electric bike fleets.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-black">
              Enter Your Postal Code or Neighborhood:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="w-4 h-4 absolute left-3 top-3.5 text-black/40" />
                <input
                  type="text"
                  required
                  value={postalInput}
                  onChange={(e) => {
                    setPostalInput(e.target.value);
                    setChecked(false);
                  }}
                  placeholder="e.g. 10001, SoHo, 90210, Camden..."
                  className="w-full text-xs pl-9 pr-3 py-3 border border-black/20 rounded-sm bg-white focus:border-[#FF5757] outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isVerifying}
                className="bg-[#1a1a1a] hover:bg-[#FF5757] text-white px-5 py-3 rounded-sm text-xs font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? 'Checking...' : 'Check Zone'}
              </button>
            </div>
          </form>

          {/* Result Card */}
          {checked && (
            <div className="bg-[#FAF8F2] border border-black/15 p-4 rounded-sm space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    10-Minute Dispatch Active in "{postalInput}"
                  </h4>
                  <p className="text-[11px] text-emerald-700">
                    Nearest Pod: <strong>Apparellex Central Hub #04</strong> (0.8 mi)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-black/10 text-center">
                <div className="bg-white p-2 rounded-xs border border-black/5">
                  <span className="text-[10px] text-black/50 uppercase block font-semibold">Average ETA</span>
                  <span className="text-xs font-black text-black flex items-center justify-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-[#FF5757]" /> 8-11 Mins
                  </span>
                </div>
                <div className="bg-white p-2 rounded-xs border border-black/5">
                  <span className="text-[10px] text-black/50 uppercase block font-semibold">Pack Speed</span>
                  <span className="text-xs font-black text-black mt-0.5 block">118 Secs</span>
                </div>
                <div className="bg-white p-2 rounded-xs border border-black/5">
                  <span className="text-[10px] text-black/50 uppercase block font-semibold">Couriers On Duty</span>
                  <span className="text-xs font-black text-black flex items-center justify-center gap-1 mt-0.5">
                    <Bike className="w-3 h-3 text-emerald-600" /> 7 Active
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onStartShopping();
                }}
                className="w-full bg-[#111111] hover:bg-[#FF5757] text-white py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition mt-2 cursor-pointer"
              >
                Shop Available 10-Min Drops
              </button>
            </div>
          )}

          {!checked && (
            <div className="bg-stone-50 p-3 rounded-sm border border-stone-200 text-[11px] text-black/60 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FF5757] shrink-0" />
              <span>We currently cover top metropolitan fashion districts with 10-minute instant delivery guarantees.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
