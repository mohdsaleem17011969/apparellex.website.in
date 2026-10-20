import React from 'react';
import { Zap, Clock, ShieldCheck, RefreshCw } from 'lucide-react';

interface DeliveryMarqueeProps {
  onOpenChecker: () => void;
}

export const DeliveryMarquee: React.FC<DeliveryMarqueeProps> = ({ onOpenChecker }) => {
  const marqueeItems = [
    '10 MINUTE DELIVERY —',
    'TRENDING NOW —',
    'EXCLUSIVELY APPARELLEX —',
    'NO MORE WAITING —',
    'STYLE AT SPEED —',
    'INSTANT TRY-ON AT DOORSTEP —',
  ];

  return (
    <section className="bg-[#FF5757] overflow-hidden border-y border-black/10 select-none">
      {/* Dynamic Continuous Marquee Ticker */}
      <div className="py-6 sm:py-8 flex overflow-hidden">
        <div className="animate-marquee flex items-center space-x-12 sm:space-x-16">
          {marqueeItems.concat(marqueeItems).map((text, idx) => (
            <span
              key={idx}
              className="text-white font-extrabold text-2xl sm:text-3xl md:text-4xl uppercase tracking-tighter whitespace-nowrap drop-shadow-sm"
            >
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* 3 Pillars of Hyper-Fast Fashion */}
      <div className="bg-[#1a1a1a] text-white py-8 px-6 border-t border-black/15">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-[#FF5757] transition-colors">
            <div className="w-10 h-10 rounded-md bg-[#FF5757] text-white flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-white">
                Hyperlocal Dark Store Hubs
              </h3>
              <p className="text-xs text-white/70 mt-1 leading-relaxed">
                Apparellex operates strategically placed micro-depots across metropolitan districts. Orders are packed within 120 seconds.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-[#FF5757] transition-colors">
            <div className="w-10 h-10 rounded-md bg-white text-black flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-white">
                10-Minute Electric Dispatch
              </h3>
              <p className="text-xs text-white/70 mt-1 leading-relaxed">
                Dedicated electric couriers ride direct to your address. Real-time GPS radar tracking from garment rack to your door.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-[#FF5757] transition-colors">
            <div className="w-10 h-10 rounded-md bg-[#FF5757] text-white flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-white">
                Instant Doorstep Fit Check
              </h3>
              <p className="text-xs text-white/70 mt-1 leading-relaxed">
                Try your piece on while our courier waits 5 minutes. Need another size? Instant swap right on the spot.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
