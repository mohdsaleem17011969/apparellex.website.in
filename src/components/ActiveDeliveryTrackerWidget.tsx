import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Bike, Zap, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { OrderDetails } from './OrderTracker';

interface ActiveDeliveryTrackerWidgetProps {
  order: OrderDetails;
  onClick: () => void;
}

export const ActiveDeliveryTrackerWidget: React.FC<ActiveDeliveryTrackerWidgetProps> = ({
  order,
  onClick,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLParagraphElement>(null);
  const glowRingRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Spring entrance from bottom with gentle bounce
      tl.from(containerRef.current, {
        y: 60,
        opacity: 0,
        scale: 0.86,
        duration: 0.8,
        ease: 'back.out(1.6)',
      })
      // Staggered icon pop and slight rotation
      .from(iconRef.current, {
        scale: 0,
        rotation: -45,
        duration: 0.5,
        ease: 'back.out(2)',
      }, '-=0.4')
      // Pulse text entrance
      .from(badgeRef.current, {
        x: -15,
        opacity: 0,
        duration: 0.4,
      }, '-=0.3');

      // Continuous subtle ambient beacon pulse on the 10-minute promise
      if (glowRingRef.current) {
        gsap.to(glowRingRef.current, {
          scale: 2.2,
          opacity: 0,
          duration: 1.6,
          repeat: -1,
          ease: 'power1.out',
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <aside
      ref={containerRef}
      aria-label="Active 10-Minute Delivery Tracker"
      onClick={onClick}
      className="fixed bottom-6 left-6 z-40 bg-[#111111]/95 text-white pl-3.5 pr-4 py-3 rounded-sm shadow-2xl border border-[#FF5757]/50 flex items-center gap-3 backdrop-blur-md cursor-pointer hover:border-[#FF5757] hover:bg-black transition-all group select-none max-w-sm"
    >
      {/* Animated Courier Bike Icon with Beacon */}
      <div className="relative shrink-0">
        <div
          ref={iconRef}
          className="w-10 h-10 rounded-full bg-[#FF5757] flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform"
        >
          <Bike className="w-5 h-5" />
        </div>
        <span
          ref={glowRingRef}
          className="absolute inset-0 rounded-full bg-[#FF5757]/50 pointer-events-none"
        />
      </div>

      {/* 10-Minute Delivery Status and Live Order Tag */}
      <div className="text-left pr-1">
        <p
          ref={badgeRef}
          className="text-[10px] uppercase font-black tracking-widest text-[#FF5757] flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5757] animate-ping" />
          <span className="inline-flex items-center gap-1">
            <Zap className="w-3 h-3 fill-[#FF5757]" />
            10-Min Dispatch Active
          </span>
        </p>
        <p className="text-xs font-black text-white mt-0.5 group-hover:text-[#FAF8F2] transition-colors flex items-center gap-1.5">
          <span>Order #{order.orderId}</span>
          <span className="text-white/40">·</span>
          <span className="text-[11px] font-medium text-white/80">Live GPS Radar</span>
          <ArrowRight className="w-3 h-3 text-[#FF5757] group-hover:translate-x-1 transition-transform" />
        </p>
      </div>
    </aside>
  );
};
