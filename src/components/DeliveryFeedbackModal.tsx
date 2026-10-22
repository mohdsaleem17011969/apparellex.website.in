import React, { useState } from 'react';
import { OrderDetails } from './OrderTracker';
import {
  X,
  Star,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Package,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';

export interface DeliveryFeedback {
  orderId: string;
  speedRating: number;
  qualityRating: number;
  speedTags: string[];
  qualityTags: string[];
  tryOnExperience: 'yes_kept' | 'yes_swapped' | 'no';
  comments: string;
}

interface DeliveryFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderDetails | null;
  onSubmitFeedback: (feedback: DeliveryFeedback) => void;
}

const SPEED_TAG_OPTIONS = [
  '⚡ Arrived under 10 mins',
  'Courteous courier',
  'Live radar was accurate',
  'Steamed & ready-to-wear',
  'Clean garment pouch',
];

const QUALITY_TAG_OPTIONS = [
  'Dense heavyweight fabric',
  'Perfect drape & silhouette',
  'Flawless stitching',
  'Accurate sizing',
  'Premium hardware / zippers',
];

export const DeliveryFeedbackModal: React.FC<DeliveryFeedbackModalProps> = ({
  isOpen,
  onClose,
  order,
  onSubmitFeedback,
}) => {
  if (!isOpen || !order) return null;

  const [speedRating, setSpeedRating] = useState(5);
  const [hoveredSpeedRating, setHoveredSpeedRating] = useState<number | null>(null);

  const [qualityRating, setQualityRating] = useState(5);
  const [hoveredQualityRating, setHoveredQualityRating] = useState<number | null>(null);

  const [selectedSpeedTags, setSelectedSpeedTags] = useState<string[]>([
    '⚡ Arrived under 10 mins',
    'Steamed & ready-to-wear',
  ]);
  const [selectedQualityTags, setSelectedQualityTags] = useState<string[]>([
    'Dense heavyweight fabric',
    'Perfect drape & silhouette',
  ]);

  const [tryOnExperience, setTryOnExperience] = useState<'yes_kept' | 'yes_swapped' | 'no'>('yes_kept');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const activeSpeed = hoveredSpeedRating || speedRating;
  const activeQuality = hoveredQualityRating || qualityRating;

  const getSpeedLabel = (rating: number) => {
    switch (rating) {
      case 5:
        return '⚡ Blazing Fast (Under 10 Mins!)';
      case 4:
        return '⚡ Fast & Timely Delivery';
      case 3:
        return 'Standard Speed';
      case 2:
        return 'Slightly Slower Than 10m';
      case 1:
        return 'Significant Delay';
      default:
        return '';
    }
  };

  const getQualityLabel = (rating: number) => {
    switch (rating) {
      case 5:
        return '🔥 Masterpiece / Luxury Heavyweight';
      case 4:
        return 'High-End Premium Quality';
      case 3:
        return 'Good / Expected Quality';
      case 2:
        return 'Fair / Minor Imperfections';
      case 1:
        return 'Below Expectations';
      default:
        return '';
    }
  };

  const toggleSpeedTag = (tag: string) => {
    setSelectedSpeedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleQualityTag = (tag: string) => {
    setSelectedQualityTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const feedback: DeliveryFeedback = {
      orderId: order.orderId,
      speedRating,
      qualityRating,
      speedTags: selectedSpeedTags,
      qualityTags: selectedQualityTags,
      tryOnExperience,
      comments: comments.trim(),
    };

    onSubmitFeedback(feedback);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
    }, 2200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-xl w-full rounded-sm overflow-hidden shadow-2xl relative border border-black/10 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-black/10 flex items-center justify-between bg-[#111111] text-white">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#FF5757] fill-[#FF5757]" />
            <div>
              <h2 id="feedback-modal-title" className="text-sm font-black font-fashion uppercase tracking-wider">
                10-Minute Drop & Garment Review
              </h2>
              <p className="text-[11px] text-white/60">
                Order #{order.orderId} · Delivered to {order.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition p-1 cursor-pointer"
            aria-label="Close review"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 text-center flex flex-col items-center justify-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black font-fashion text-[#1a1a1a]">
              FEEDBACK RECEIVED
            </h3>
            <p className="text-xs text-black/60 max-w-sm leading-relaxed font-light">
              Thank you for verifying your 10-minute delivery speed and garment craft. Your ratings directly empower our courier team and local micro-hubs.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-sm border border-emerald-200 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified 10m Delivery Record Logged</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* Delivery Speed Rating */}
            <div className="bg-[#FAF8F2] p-4 rounded-sm border border-black/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#1a1a1a] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#FF5757]" />
                  1. Rate 10-Minute Delivery Speed
                </span>
                <span className="text-xs font-bold text-emerald-700 tabular-nums">
                  {activeSpeed}/5 Stars
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSpeedRating(star)}
                    onMouseEnter={() => setHoveredSpeedRating(star)}
                    onMouseLeave={() => setHoveredSpeedRating(null)}
                    className="p-1 cursor-pointer transition hover:scale-110"
                    aria-label={`Rate speed ${star} stars`}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= activeSpeed
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-black/70 ml-2">
                  {getSpeedLabel(activeSpeed)}
                </span>
              </div>

              {/* Speed Tag Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SPEED_TAG_OPTIONS.map((tag) => {
                  const isSelected = selectedSpeedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleSpeedTag(tag)}
                      className={`text-[11px] px-2.5 py-1 rounded-xs border transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#111111] text-white border-black font-semibold'
                          : 'bg-white text-black/70 border-black/15 hover:border-black'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product & Fabric Quality Rating */}
            <div className="bg-[#FAF8F2] p-4 rounded-sm border border-black/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#1a1a1a] flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#FF5757]" />
                  2. Rate Garment & Fabric Quality
                </span>
                <span className="text-xs font-bold text-amber-700 tabular-nums">
                  {activeQuality}/5 Stars
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setQualityRating(star)}
                    onMouseEnter={() => setHoveredQualityRating(star)}
                    onMouseLeave={() => setHoveredQualityRating(null)}
                    className="p-1 cursor-pointer transition hover:scale-110"
                    aria-label={`Rate product quality ${star} stars`}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= activeQuality
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-black/70 ml-2">
                  {getQualityLabel(activeQuality)}
                </span>
              </div>

              {/* Quality Tag Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUALITY_TAG_OPTIONS.map((tag) => {
                  const isSelected = selectedQualityTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleQualityTag(tag)}
                      className={`text-[11px] px-2.5 py-1 rounded-xs border transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#FF5757] text-white border-[#FF5757] font-semibold'
                          : 'bg-white text-black/70 border-black/15 hover:border-black'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Doorstep 5-Min Fit Check Checkbox/Pills */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/70 mb-2">
                3. Doorstep 5-Minute Try-On Experience
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'yes_kept', label: 'Tried on & kept pieces' },
                  { id: 'yes_swapped', label: 'Swapped for backup size' },
                  { id: 'no', label: 'Kept directly without try-on' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTryOnExperience(opt.id as any)}
                    className={`p-2.5 text-xs text-center rounded-sm border transition cursor-pointer ${
                      tryOnExperience === opt.id
                        ? 'bg-[#111111] text-white border-black font-bold'
                        : 'bg-white text-black/70 border-black/15 hover:border-black'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Comments Textarea */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/70 mb-1">
                4. Courier Handover or Style Comments (Optional)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Share your thoughts on the courier speed, garment packaging, or fabric weight..."
                rows={3}
                className="w-full text-xs p-3 border border-black/20 rounded-sm bg-white focus:border-[#FF5757] outline-none"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-black/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 bg-white border border-black/20 hover:border-black text-black rounded-sm text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Skip For Now
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-initial bg-[#111111] hover:bg-[#FF5757] text-white px-6 py-3 rounded-sm text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Submit Verified Feedback</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
