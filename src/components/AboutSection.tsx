import React, { useState } from 'react';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const [imgError, setImgError] = useState(false);
  const founderImageUrl =
    'https://images.unsplash.com/photo-1523381235312-da5941254381?auto=format&fit=crop&w=800&q=80';

  return (
    <section id="about" className="py-24 bg-white border-t border-black/10">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Visual Column */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-sm shadow-xl bg-stone-100 aspect-[4/5] max-h-[580px]">
            {!imgError ? (
              <img
                src={founderImageUrl}
                alt="Shaikh Kamran - Founder & CEO Apparellex"
                className="w-full h-full object-cover object-center filter contrast-[1.03]"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-stone-900 to-stone-800 flex flex-col items-center justify-center p-8 text-center text-white">
                <Sparkles className="w-12 h-12 text-[#FF5757] mb-3" />
                <h4 className="text-xl font-bold font-fashion">Shaikh Kamran</h4>
                <p className="text-xs text-stone-400 uppercase tracking-widest mt-1">
                  Founder & CEO, Apparellex
                </p>
              </div>
            )}

            {/* Subtle Overlay Badge */}
            <div className="absolute bottom-6 left-6 right-6 bg-black/85 backdrop-blur-md text-white p-4 rounded-sm border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#FF5757] font-bold block">
                  Pioneer In Hyper-Fast Luxury
                </span>
                <span className="text-xs font-semibold">10-Minute Micro-Fulfillment Architecture</span>
              </div>
              <Zap className="w-5 h-5 text-[#FF5757] fill-[#FF5757] shrink-0" />
            </div>
          </div>
        </div>

        {/* Narrative Column */}
        <div className="flex flex-col justify-center">
          <span className="text-xs uppercase tracking-[0.4em] text-[#FF5757] font-bold mb-3 block">
            Our Vision
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-fashion mb-6 leading-tight text-[#1a1a1a]">
            REDEFINING THE RETAIL ECOSYSTEM
          </h2>

          <p className="text-black/75 text-base md:text-lg leading-relaxed mb-6 font-light">
            Founded by <strong className="font-bold text-black">Shaikh Kamran</strong>, Apparellex is a high-octane fashion startup designed for the modern disruptor. We noticed a flaw in the world: fashion was either fast and low-quality, or premium and agonizingly slow.
          </p>

          <p className="text-black/75 text-sm md:text-base leading-relaxed mb-8 font-light">
            We bridged the gap. Apparellex combines <strong className="font-semibold text-black">curated luxury</strong> with <strong className="font-semibold text-black">instant gratification</strong>. We don't just sell clothes; we provide a 10-minute gateway to your best self. Every stitch, every delivery, and every digital interaction is engineered to make you feel like the world is your runway.
          </p>

          {/* Adjacency Proof Numbers */}
          <div className="grid grid-cols-3 gap-4 py-6 border-y border-black/10 mb-8">
            <div>
              <span className="text-2xl sm:text-3xl font-black font-fashion text-[#1a1a1a] block tabular-nums">
                10<span className="text-[#FF5757] text-lg font-bold">m</span>
              </span>
              <span className="text-[11px] uppercase tracking-wider text-black/60 font-semibold">
                Guaranteed Delivery
              </span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black font-fashion text-[#1a1a1a] block tabular-nums">
                100<span className="text-[#FF5757] text-lg font-bold">%</span>
              </span>
              <span className="text-[11px] uppercase tracking-wider text-black/60 font-semibold">
                Curated Luxury
              </span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black font-fashion text-[#1a1a1a] block tabular-nums">
                5<span className="text-[#FF5757] text-lg font-bold">m</span>
              </span>
              <span className="text-[11px] uppercase tracking-wider text-black/60 font-semibold">
                Doorstep Fit Check
              </span>
            </div>
          </div>

          {/* Founder Signature Block */}
          <div>
            <h3 className="font-bold text-xl text-[#1a1a1a] font-fashion">Shaikh Kamran</h3>
            <p className="text-xs uppercase tracking-widest text-black/50 font-semibold">
              Founder & CEO, Apparellex
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
