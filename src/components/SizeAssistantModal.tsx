import React, { useState } from 'react';
import { Product } from '../data/products';
import { X, Sparkles, CheckCircle2, ShieldCheck, Ruler, RefreshCw, Zap } from 'lucide-react';

interface SizeAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onApplySize: (recommendedSize: string, backupSize: string | null) => void;
}

export const SizeAssistantModal: React.FC<SizeAssistantModalProps> = ({
  isOpen,
  onClose,
  product,
  onApplySize,
}) => {
  if (!isOpen) return null;

  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(10);
  const [heightCm, setHeightCm] = useState(178);
  const [weightLbs, setWeightLbs] = useState(165);
  const [weightKg, setWeightKg] = useState(75);
  const [bodyType, setBodyType] = useState<'slim' | 'athletic' | 'regular' | 'broad'>('athletic');
  const [fitPreference, setFitPreference] = useState<'oversized' | 'relaxed' | 'tailored'>('oversized');
  const [includeBackupSize, setIncludeBackupSize] = useState(true);

  // Sizing calculation logic
  const calculateSize = (): { primary: string; backup: string; confidence: number } => {
    const totalHeightInches = unit === 'imperial' ? heightFeet * 12 + heightInches : heightCm / 2.54;
    const totalWeight = unit === 'imperial' ? weightLbs : weightKg * 2.20462;

    let score = totalHeightInches * 1.5 + (totalWeight / 150) * 40;
    if (bodyType === 'broad') score += 10;
    if (bodyType === 'slim') score -= 10;
    if (fitPreference === 'oversized') score += 10;
    if (fitPreference === 'tailored') score -= 5;

    let primary = 'M';
    let backup = 'L';

    if (score < 130) {
      primary = 'XS';
      backup = 'S';
    } else if (score < 145) {
      primary = 'S';
      backup = 'M';
    } else if (score < 165) {
      primary = 'M';
      backup = fitPreference === 'oversized' ? 'L' : 'S';
    } else if (score < 185) {
      primary = 'L';
      backup = fitPreference === 'oversized' ? 'XL' : 'M';
    } else {
      primary = 'XL';
      backup = 'L';
    }

    return { primary, backup, confidence: 96 };
  };

  const { primary, backup, confidence } = calculateSize();

  const handleApply = () => {
    onApplySize(primary, includeBackupSize ? backup : null);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-assistant-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-xl w-full rounded-sm overflow-hidden shadow-2xl relative border border-black/10 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-black/10 flex items-center justify-between bg-[#111111] text-white">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#FF5757]" />
            <div>
              <h2 id="size-assistant-title" className="text-sm font-black font-fashion uppercase tracking-wider">
                Apparellex Doorstep Fit Engine
              </h2>
              <p className="text-[11px] text-white/60">
                Precision size matching with complimentary doorstep backup size
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition p-1 cursor-pointer"
            aria-label="Close fit assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {product && (
            <div className="p-3 bg-[#FAF8F2] border border-black/10 rounded-sm flex items-center gap-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-10 h-12 object-cover rounded-xs bg-stone-200 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="text-xs">
                <span className="text-black/50 uppercase font-semibold">Fitting item:</span>
                <h4 className="font-bold text-black">{product.name}</h4>
                <p className="text-[11px] text-black/60">Fit cut: {product.fit}</p>
              </div>
            </div>
          )}

          {/* Unit Toggle */}
          <div className="flex justify-between items-center pb-2 border-b border-black/10">
            <span className="text-xs font-bold uppercase tracking-wider text-black/70">
              Measurement Units:
            </span>
            <div className="flex items-center gap-1 p-0.5 bg-black/5 rounded-sm">
              <button
                type="button"
                onClick={() => setUnit('imperial')}
                className={`px-3 py-1 text-xs font-bold rounded-xs transition ${
                  unit === 'imperial' ? 'bg-black text-white' : 'text-black/60 hover:text-black'
                }`}
              >
                Imperial (ft / lbs)
              </button>
              <button
                type="button"
                onClick={() => setUnit('metric')}
                className={`px-3 py-1 text-xs font-bold rounded-xs transition ${
                  unit === 'metric' ? 'bg-black text-white' : 'text-black/60 hover:text-black'
                }`}
              >
                Metric (cm / kg)
              </button>
            </div>
          </div>

          {/* Height & Weight Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-black/70 mb-1">
                Height
              </label>
              {unit === 'imperial' ? (
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      min={4}
                      max={7}
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(Number(e.target.value))}
                      className="w-full text-xs p-2.5 border border-black/20 rounded-sm bg-white"
                    />
                    <span className="text-[10px] text-black/50 block mt-0.5">feet</span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      min={0}
                      max={11}
                      value={heightInches}
                      onChange={(e) => setHeightInches(Number(e.target.value))}
                      className="w-full text-xs p-2.5 border border-black/20 rounded-sm bg-white"
                    />
                    <span className="text-[10px] text-black/50 block mt-0.5">inches</span>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="number"
                    min={140}
                    max={220}
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-black/20 rounded-sm bg-white"
                  />
                  <span className="text-[10px] text-black/50 block mt-0.5">centimeters</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-black/70 mb-1">
                Weight
              </label>
              {unit === 'imperial' ? (
                <div>
                  <input
                    type="number"
                    min={90}
                    max={350}
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-black/20 rounded-sm bg-white"
                  />
                  <span className="text-[10px] text-black/50 block mt-0.5">pounds (lbs)</span>
                </div>
              ) : (
                <div>
                  <input
                    type="number"
                    min={40}
                    max={160}
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-black/20 rounded-sm bg-white"
                  />
                  <span className="text-[10px] text-black/50 block mt-0.5">kilograms (kg)</span>
                </div>
              )}
            </div>
          </div>

          {/* Build Type */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-black/70 mb-2">
              Body Profile:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'slim', label: 'Slim' },
                { id: 'regular', label: 'Regular' },
                { id: 'athletic', label: 'Athletic' },
                { id: 'broad', label: 'Broad' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBodyType(b.id as any)}
                  className={`py-2 text-xs font-bold rounded-sm border transition cursor-pointer ${
                    bodyType === b.id
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black/70 border-black/15 hover:border-black'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fit Style */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-black/70 mb-2">
              Desired Silhouette & Drape:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'tailored', label: 'True / Tailored' },
                { id: 'relaxed', label: 'Relaxed' },
                { id: 'oversized', label: 'Boxy Oversized' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFitPreference(f.id as any)}
                  className={`py-2 text-xs font-bold rounded-sm border transition cursor-pointer ${
                    fitPreference === f.id
                      ? 'bg-[#FF5757] text-white border-[#FF5757]'
                      : 'bg-white text-black/70 border-black/15 hover:border-black'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recommended Result Banner */}
          <div className="bg-[#1a1a1a] text-white p-5 rounded-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF5757] flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Algorithm Recommendation
              </span>
              <span className="text-xs text-emerald-400 font-bold tabular-nums">
                {confidence}% Match
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black font-fashion text-white">
                Size {primary}
              </span>
              <span className="text-xs text-white/70 font-light">
                Calibrated for your {bodyType} build & {fitPreference} drape preference.
              </span>
            </div>

            {/* Doorstep Backup Size Free Feature */}
            <div className="pt-3 border-t border-white/10">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeBackupSize}
                  onChange={(e) => setIncludeBackupSize(e.target.checked)}
                  className="mt-1 accent-[#FF5757] w-4 h-4 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-[#FF5757]" />
                    Bring Free Backup Size ({backup}) to Doorstep
                  </span>
                  <p className="text-[11px] text-white/60 mt-0.5 leading-relaxed">
                    Our electric courier carries size {backup} in addition to size {primary}. Try both on at your door; hand back whichever you don't keep. $0 extra cost.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-5 bg-[#FAF8F2] border-t border-black/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-black/60">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>5-minute free doorstep fit check guaranteed</span>
          </div>

          <button
            onClick={handleApply}
            className="bg-[#111111] hover:bg-[#FF5757] text-white px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-md"
          >
            Apply Size {primary} {includeBackupSize ? `(+ ${backup} Backup)` : ''}
          </button>
        </div>
      </div>
    </div>
  );
};
