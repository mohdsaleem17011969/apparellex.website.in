import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CartItem } from '../data/products';
import {
  CheckCircle2,
  Clock,
  Package,
  Bike,
  Home,
  ShieldCheck,
  PhoneCall,
  MapPin,
  RefreshCw,
  Zap,
  Sparkles,
  ArrowRight,
  Play,
  RotateCcw,
  Star
} from 'lucide-react';
import { LiveOrderRouteMap } from './LiveOrderRouteMap';

export interface OrderDetails {
  orderId: string;
  name: string;
  phone: string;
  address: string;
  postalCode: string;
  city?: string;
  coordinates?: { lat: number; lng: number };
  paymentMethod: 'cod' | 'card' | 'upi';
  totalAmount: number;
  items: CartItem[];
  createdAt: Date;
}

interface OrderTrackerProps {
  order: OrderDetails;
  onClose: () => void;
  onReturnToShop: () => void;
  onOpenFeedback?: (order: OrderDetails) => void;
}

export type TrackingStage = 'received' | 'preparing' | 'out_for_delivery' | 'arrived';

interface StageMeta {
  key: TrackingStage;
  label: string;
  subtitle: string;
  icon: React.ElementType;
  estimatedMinute: number;
}

const STAGES: StageMeta[] = [
  {
    key: 'received',
    label: 'Order Received',
    subtitle: 'Verified by central dispatch engine',
    icon: CheckCircle2,
    estimatedMinute: 0,
  },
  {
    key: 'preparing',
    label: 'Preparing',
    subtitle: 'Steamed & packed in luxury pouch',
    icon: Package,
    estimatedMinute: 2,
  },
  {
    key: 'out_for_delivery',
    label: 'Out for Delivery',
    subtitle: 'Courier Tariq on electric Super73',
    icon: Bike,
    estimatedMinute: 5,
  },
  {
    key: 'arrived',
    label: 'Arrived',
    subtitle: 'At your doorstep — 5-min fit check',
    icon: Home,
    estimatedMinute: 10,
  },
];

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  order,
  onClose,
  onReturnToShop,
  onOpenFeedback,
}) => {
  // 10-minute countdown in seconds (600 seconds total)
  const [secondsRemaining, setSecondsRemaining] = useState(600);
  const [isSimulatingFast, setIsSimulatingFast] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasPromptedFeedback, setHasPromptedFeedback] = useState(false);

  const trackerRootRef = useRef<HTMLDivElement>(null);

  // Smooth GSAP entrance animation when the Active Delivery Tracker first appears
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Top banner drops in smoothly with momentum
      tl.from('.tracker-banner', {
        y: -35,
        opacity: 0,
        duration: 0.7,
      })
      // 2. 10-Minute Guaranteed delivery timer springs into view with high-energy pop
      .from('.tracker-timer', {
        scale: 0.72,
        opacity: 0,
        rotation: -3,
        duration: 0.75,
        ease: 'back.out(1.8)',
      }, '-=0.45')
      // 3. 10-Minute promise radar badge glides into position
      .from('.tracker-promise-pill', {
        x: -25,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.5')
      // 4. Progress bar section rises up
      .from('.tracker-progress-card', {
        y: 25,
        opacity: 0,
        duration: 0.65,
      }, '-=0.35')
      // 5. Staggered 4 milestone stage cards
      .from('.tracker-stage-item', {
        y: 20,
        opacity: 0,
        scale: 0.95,
        stagger: 0.08,
        duration: 0.45,
        ease: 'power2.out',
      }, '-=0.3')
      // 6. Live Google Maps dispatch radar container expands into view
      .from('.tracker-map-wrapper', {
        opacity: 0,
        y: 20,
        scale: 0.98,
        duration: 0.7,
        ease: 'power2.out',
      }, '-=0.25')
      // 7. Bottom courier and service guarantee details cards
      .from('.tracker-info-box', {
        y: 25,
        opacity: 0,
        stagger: 0.1,
        duration: 0.55,
        ease: 'power2.out',
      }, '-=0.3');

      // Continuous subtle ambient glow pulsing on the 10-minute timer badge
      gsap.to('.tracker-timer-glow', {
        opacity: 0.5,
        scale: 1.05,
        repeat: -1,
        yoyo: true,
        duration: 1.4,
        ease: 'sine.inOut',
      });
    }, trackerRootRef);

    return () => ctx.revert();
  }, []);

  // Compute stage index (0 to 3) based on seconds remaining
  // Total 600s:
  // 600s - 540s (1 min elapsed): received (0)
  // 540s - 300s (1 to 5 min elapsed): preparing (1)
  // 300s - 30s (5 to 9.5 min elapsed): out_for_delivery (2)
  // 30s - 0s: arrived (3)
  const elapsed = 600 - secondsRemaining;
  const currentStageIndex =
    elapsed < 60 ? 0 : elapsed < 300 ? 1 : elapsed < 570 ? 2 : 3;

  // Real-time timer ticker
  useEffect(() => {
    if (isPaused || secondsRemaining <= 0) return;

    const intervalRate = isSimulatingFast ? 100 : 1000;
    const stepSize = isSimulatingFast ? 5 : 1;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - stepSize));
    }, intervalRate);

    return () => clearInterval(interval);
  }, [secondsRemaining, isPaused, isSimulatingFast]);

  // Prompt feedback survey automatically when order arrives at stage 3 / delivered
  useEffect(() => {
    if (currentStageIndex === 3 && !hasPromptedFeedback) {
      const timer = setTimeout(() => {
        setHasPromptedFeedback(true);
        if (onOpenFeedback) {
          onOpenFeedback(order);
        }
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [currentStageIndex, hasPromptedFeedback, onOpenFeedback, order]);

  // Percentage for the continuous progress bar:
  // 0% at stage 0 start, smoothly up to 100% at stage 3
  const progressPercent = Math.min(100, Math.max(5, (elapsed / 600) * 100));

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleNextStage = () => {
    if (currentStageIndex === 0) setSecondsRemaining(530);
    else if (currentStageIndex === 1) setSecondsRemaining(290);
    else if (currentStageIndex === 2) setSecondsRemaining(20);
    else setSecondsRemaining(0);
  };

  const handleResetTimer = () => {
    setSecondsRemaining(600);
    setIsPaused(false);
  };

  return (
    <div ref={trackerRootRef} className="w-full flex flex-col space-y-6">
      {/* Top Banner Status */}
      <div className="tracker-banner bg-[#111111] text-white p-6 rounded-sm border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF5757] animate-ping" />
            <span className="tracker-promise-pill text-[11px] font-bold uppercase tracking-widest text-[#FF5757]">
              Live 10-Minute Hyperlocal Radar
            </span>
            <span className="text-white/40">·</span>
            <span className="text-xs text-white/70 font-mono">
              #{order.orderId}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-fashion tracking-tight text-white">
            {currentStageIndex === 0 && 'Order Verified & Queued'}
            {currentStageIndex === 1 && 'Garment Steaming & Luxury Pack'}
            {currentStageIndex === 2 && 'Courier En Route On Super73 E-Bike'}
            {currentStageIndex === 3 && 'Courier Arrived At Your Doorstep!'}
          </h2>
          <p className="text-xs text-white/70 mt-1 max-w-lg font-light">
            {currentStageIndex === 0 &&
              'Order confirmed by our automated dark store. Item reserved from rack 4B.'}
            {currentStageIndex === 1 &&
              'Associate has packed your garment in an anti-static Apparellex wardrobe bag.'}
            {currentStageIndex === 2 &&
              'Courier Tariq is moving at 22 mph. Direct line to your address with zero stops.'}
            {currentStageIndex === 3 &&
              'Your courier is at the entrance. Complimentary 5-minute doorstep try-on is ready.'}
          </p>
        </div>

        {/* Live Timer Display with GSAP Entrance & Glow */}
        <div className="tracker-timer relative overflow-hidden bg-black/75 border border-white/20 px-6 py-4 rounded-sm flex flex-col items-center justify-center shrink-0 min-w-[170px] shadow-lg">
          <span className="tracker-timer-glow absolute inset-0 bg-[#FF5757]/15 rounded-sm pointer-events-none" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-white/70 mb-0.5 flex items-center gap-1 relative z-10">
            <Clock className="w-3 h-3 text-[#FF5757]" />
            Time to Doorstep
          </span>
          <span className="text-4xl sm:text-5xl font-black font-fashion text-[#FF5757] tabular-nums tracking-wider relative z-10 drop-shadow">
            {formatTimer(secondsRemaining)}
          </span>
          <span className="text-[10px] text-white/60 mt-1 uppercase font-semibold relative z-10 flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#FF5757] fill-[#FF5757]" />
            {secondsRemaining === 0 ? 'Delivered' : 'Guaranteed 10m SLA'}
          </span>
        </div>
      </div>

      {/* Post-Delivery Rate & Feedback Callout Banner when Arrived */}
      {currentStageIndex === 3 && (
        <div className="bg-gradient-to-r from-[#111111] via-[#1c1c1c] to-[#111111] border border-[#FF5757]/40 text-white p-5 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF5757] text-white flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5757]">
                  Order Delivered
                </span>
                <span className="text-white/40">·</span>
                <span className="text-[11px] text-emerald-400 font-bold">10-Min SLA Met</span>
              </div>
              <h4 className="text-sm font-bold text-white">How was your 10-minute delivery & garment fit?</h4>
              <p className="text-xs text-white/60 font-light">
                Rate our delivery speed and the craftsmanship of your pieces.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenFeedback?.(order)}
            className="w-full sm:w-auto bg-[#FF5757] hover:bg-white hover:text-black text-white px-5 py-2.5 rounded-sm text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow shrink-0"
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Rate Delivery & Quality</span>
          </button>
        </div>
      )}

      {/* Real-Time Progress Bar & Milestones Section */}
      <div className="tracker-progress-card bg-[#FAF8F2] border border-black/10 p-6 md:p-8 rounded-sm shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#FF5757] fill-[#FF5757]" />
            <h3 className="text-xs font-black uppercase tracking-widest text-[#1a1a1a]">
              Progress Tracker ({Math.round(progressPercent)}%)
            </h3>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSimulatingFast(!isSimulatingFast)}
              className={`text-[11px] font-bold px-3 py-1 rounded-sm border transition-colors cursor-pointer flex items-center gap-1 ${
                isSimulatingFast
                  ? 'bg-[#FF5757] text-white border-[#FF5757]'
                  : 'bg-white text-black/70 border-black/15 hover:border-black'
              }`}
              title="Fast forward simulation"
            >
              <Zap className="w-3 h-3" />
              <span>{isSimulatingFast ? 'Fast Mode (Active)' : 'Speed Up (10x)'}</span>
            </button>

            {currentStageIndex < 3 && (
              <button
                onClick={handleNextStage}
                className="text-[11px] font-bold px-3 py-1 rounded-sm bg-[#1a1a1a] hover:bg-[#FF5757] text-white transition-colors cursor-pointer flex items-center gap-1"
                title="Advance to next stage"
              >
                <span>Next Stage</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            <button
              onClick={handleResetTimer}
              className="p-1 rounded-sm text-black/40 hover:text-black hover:bg-black/5 transition"
              title="Reset simulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Visual Progress Bar Track */}
        <div className="relative mb-8 h-10 flex items-center">
          {/* Background Bar */}
          <div className="absolute left-4 right-4 h-2 bg-black/10 rounded-full overflow-hidden z-0">
            {/* Animated Dynamic Fill Bar */}
            <div
              className="h-full bg-gradient-to-r from-[#1a1a1a] via-[#FF5757] to-[#FF5757] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Node Checkpoints along the line */}
          <div className="relative z-10 w-full flex justify-between">
            {STAGES.map((st, idx) => {
              const isPast = currentStageIndex > idx;
              const isCurrent = currentStageIndex === idx;
              const Icon = st.icon;

              return (
                <button
                  key={st.key}
                  type="button"
                  onClick={() => {
                    if (idx === 0) setSecondsRemaining(590);
                    else if (idx === 1) setSecondsRemaining(450);
                    else if (idx === 2) setSecondsRemaining(200);
                    else setSecondsRemaining(0);
                  }}
                  className="flex flex-col items-center group cursor-pointer focus:outline-none"
                  title={`Jump to ${st.label}`}
                >
                  {/* Node Circle */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                      isPast
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-[#FF5757] text-white ring-4 ring-[#FF5757]/25 scale-110'
                        : 'bg-white text-black/40 border-2 border-black/15 group-hover:border-black/40'
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Stages Detailed Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {STAGES.map((st, idx) => {
            const isPast = currentStageIndex > idx;
            const isCurrent = currentStageIndex === idx;

            return (
              <div
                key={st.key}
                className={`tracker-stage-item p-3.5 rounded-sm border transition-all ${
                  isCurrent
                    ? 'bg-white border-[#FF5757] shadow-sm'
                    : isPast
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-black/[0.02] border-black/5 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider ${
                      isCurrent
                        ? 'text-[#FF5757]'
                        : isPast
                        ? 'text-emerald-700'
                        : 'text-black/40'
                    }`}
                  >
                    Stage {idx + 1}
                  </span>
                  <span className="text-[10px] text-black/40 font-mono">
                    ~{st.estimatedMinute}m
                  </span>
                </div>
                <h4
                  className={`text-xs font-bold ${
                    isCurrent
                      ? 'text-black'
                      : isPast
                      ? 'text-emerald-900'
                      : 'text-black/50'
                  }`}
                >
                  {st.label}
                </h4>
                <p className="text-[11px] text-black/60 mt-0.5 leading-snug">
                  {st.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Google Maps GPS Courier Radar & Route Navigation with GSAP Wrapper */}
      <div className="tracker-map-wrapper">
        <LiveOrderRouteMap order={order} secondsRemaining={secondsRemaining} />
      </div>

      {/* Courier & Dark Store Dispatch Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Courier Profile */}
        <div className="tracker-info-box bg-white border border-black/10 p-5 rounded-sm flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between text-xs text-black/50 uppercase tracking-widest font-semibold mb-3">
              <span>Electric Courier</span>
              <span className="text-emerald-700 font-bold">Active SLA</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-lg font-black font-fashion">
                TM
              </div>
              <div>
                <h4 className="text-sm font-bold text-black">Tariq M.</h4>
                <p className="text-xs text-black/60">Dedicated Apparellex Rider</p>
                <div className="flex items-center gap-1.5 text-[11px] text-black/50 mt-0.5">
                  <Bike className="w-3.5 h-3.5 text-[#FF5757]" />
                  <span>Super73 RX Electric Cargo</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-black/10 flex items-center justify-between">
            <span className="text-[11px] text-black/60">Direct GPS route active</span>
            <a
              href={`tel:${order.phone}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5757] hover:underline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Contact Courier</span>
            </a>
          </div>
        </div>

        {/* Doorstep Try-On Guarantee */}
        <div className="tracker-info-box bg-white border border-black/10 p-5 rounded-sm flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between text-xs text-black/50 uppercase tracking-widest font-semibold mb-3">
              <span>Electric Courier</span>
              <span className="text-emerald-700 font-bold">Active SLA</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-lg font-black font-fashion">
                TM
              </div>
              <div>
                <h4 className="text-sm font-bold text-black">Tariq M.</h4>
                <p className="text-xs text-black/60">Dedicated Apparellex Rider</p>
                <div className="flex items-center gap-1.5 text-[11px] text-black/50 mt-0.5">
                  <Bike className="w-3.5 h-3.5 text-[#FF5757]" />
                  <span>Super73 RX Electric Cargo</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-black/10 flex items-center justify-between">
            <span className="text-[11px] text-black/60">Direct GPS route active</span>
            <a
              href={`tel:${order.phone}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5757] hover:underline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Contact Courier</span>
            </a>
          </div>
        </div>

        {/* Doorstep Try-On Guarantee */}
        <div className="bg-white border border-black/10 p-5 rounded-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-black/50 uppercase tracking-widest font-semibold mb-3">
              <span>Apparellex Guarantee</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>

            <h4 className="text-sm font-bold text-black mb-1">
              5-Minute Complimentary Fit Check
            </h4>
            <p className="text-xs text-black/70 leading-relaxed font-light">
              When courier Tariq arrives, you have 5 minutes to try your pieces on in your home. If a different size is needed, courier carries immediate size swap backups.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-black/10 flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
            <span className="flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              Free Instant Size Swap
            </span>
            <span>Zero Return Hassle</span>
          </div>
        </div>

        {/* Delivery Address & Payment */}
        <div className="tracker-info-box bg-white border border-black/10 p-5 rounded-sm flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between text-xs text-black/50 uppercase tracking-widest font-semibold mb-3">
              <span>Dispatch Address</span>
              <MapPin className="w-4 h-4 text-[#FF5757]" />
            </div>

            <p className="text-xs font-bold text-black">{order.name}</p>
            <p className="text-xs text-black/70 mt-0.5">{order.address}</p>
            <p className="text-xs text-black/70">{order.postalCode}</p>
            <p className="text-xs text-black/50 mt-1">{order.phone}</p>
          </div>

          <div className="mt-4 pt-4 border-t border-black/10 flex items-center justify-between text-xs">
            <span className="text-black/60 font-medium">Payment:</span>
            <span className="font-bold text-black">
              {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : order.paymentMethod === 'upi' ? 'UPI / NetBanking' : 'Card Charged'} — ₹{order.totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Itemized Order Package Details */}
      <div className="bg-[#FAF8F2] border border-black/10 p-5 rounded-sm">
        <h4 className="text-xs font-bold uppercase tracking-wider text-black/70 mb-3">
          Garments in Delivery Pouch ({order.items.reduce((a, b) => a + b.quantity, 0)})
        </h4>

        <div className="divide-y divide-black/10">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-10 h-12 object-cover rounded-xs bg-stone-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h5 className="font-bold text-black">{item.product.name}</h5>
                  <div className="flex items-center gap-2 text-[11px] text-black/60">
                    <span>Size: <strong className="text-black">{item.selectedSize}</strong></span>
                    <span>·</span>
                    <span>Qty: <strong className="text-black">{item.quantity}</strong></span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      Color:
                      <span
                        className="w-2 h-2 rounded-full border border-black/20"
                        style={{ backgroundColor: item.selectedColor.hex }}
                      />
                    </span>
                  </div>
                </div>
              </div>
              <span className="font-black text-black tabular-nums">
                ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="text-xs text-black/50">
          Need help? Our micro-hub dispatch manager is monitoring order #{order.orderId}.
        </p>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onReturnToShop}
            className="w-full sm:w-auto bg-[#1a1a1a] hover:bg-[#FF5757] text-white px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-wider transition cursor-pointer"
          >
            Explore More Drops
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-white border border-black/20 hover:border-black text-black px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-wider transition cursor-pointer"
          >
            Dismiss Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
