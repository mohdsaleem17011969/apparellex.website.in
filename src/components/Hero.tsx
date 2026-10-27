import React, { useState } from 'react';
import { ArrowRight, Clock, ShieldCheck, Sparkles, MapPin } from 'lucide-react';

interface HeroProps {
  onShopMen: () => void;
  onShopWomen: () => void;
  onOpenDeliveryChecker: () => void;
  onOpenAiSuggestions?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onShopMen,
  onShopWomen,
  onOpenDeliveryChecker,
  onOpenAiSuggestions,
}) => {
  const [bgFailed, setBgFailed] = useState(false);
  const heroImageUrl =
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1920&q=80';

  return (
    <section
      id="home"
      className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center text-white text-center px-4 overflow-hidden"
    >
      {/* Background Image with Fallback */}
      <div className="absolute inset-0 z-0">
        {!bgFailed ? (
          <img
            src={heroImageUrl}
            alt="Apparellex Fashion Editorial"
            className="w-full h-full object-cover object-center filter brightness-[0.7] contrast-[1.05]"
            referrerPolicy="no-referrer"
            onError={() => setBgFailed(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#121212] via-[#241a1a] to-[#121212]" />
        )}
        {/* Measured Scrim for WCAG AA Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/35" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto py-24 md:py-32 flex flex-col items-center">
        {/* Top Micro-Header */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-[0.3em] text-[#FEFCF5]">
          <Clock className="w-3.5 h-3.5 text-[#FF5757]" />
          <span>The Future of Wardrobe</span>
          <span className="text-white/40">·</span>
          <span className="text-[#FF5757] font-bold">10-Min Delivery</span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black font-fashion mb-6 leading-[0.95] tracking-tight text-white drop-shadow-sm">
          STYLE AT THE
          <br />
          <span className="text-[#FF5757]">SPEED OF LIGHT</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light text-white/90 leading-relaxed">
          Why wait for days? Get trending, hand-picked fashion delivered to your doorstep in minutes. Powered by Apparellex micro-fulfillment hubs.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onShopMen}
            className="w-full sm:w-auto bg-white text-black px-8 py-4 font-bold text-sm uppercase tracking-wider rounded-sm hover:bg-[#FF5757] hover:text-white transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
          >
            SHOP MEN
          </button>
          <button
            onClick={onShopWomen}
            className="w-full sm:w-auto bg-transparent border-2 border-white text-white px-8 py-4 font-bold text-sm uppercase tracking-wider rounded-sm hover:bg-white hover:text-black transition-all duration-200 cursor-pointer active:scale-95"
          >
            SHOP WOMEN
          </button>
          {onOpenAiSuggestions && (
            <button
              onClick={onOpenAiSuggestions}
              className="w-full sm:w-auto bg-[#FF5757] hover:bg-white hover:text-black text-white px-7 py-4 font-bold text-sm uppercase tracking-wider rounded-sm transition-all duration-200 cursor-pointer shadow-xl active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>AI Suggestions</span>
            </button>
          )}
        </div>

        {/* Live Postal Checker Quick Affordance */}
        <div className="mt-12 pt-8 border-t border-white/15 w-full max-w-md">
          <button
            onClick={onOpenDeliveryChecker}
            className="group flex items-center justify-between w-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 hover:border-[#FF5757] px-4 py-3 rounded-lg transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FF5757]/20 flex items-center justify-center text-[#FF5757]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white">
                  Check 10-Minute Dispatch Radius
                </p>
                <p className="text-[11px] text-white/60">
                  Tap to verify instant courier coverage in your area
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/70 group-hover:text-[#FF5757] group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        {/* Adjacency Proof Points */}
        <div className="mt-10 grid grid-cols-3 gap-6 sm:gap-12 text-white/80 text-xs uppercase tracking-wider">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5757]" />
            <span>Curated Drops</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#FF5757]" />
            <span>10-Min Doorstep</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF5757]" />
            <span>Instant Size Swap</span>
          </div>
        </div>
      </div>
    </section>
  );
};
