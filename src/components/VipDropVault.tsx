import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Clock, Zap, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface VipDropVaultProps {
  onNotifyToast: (msg: string) => void;
}

export const VipDropVault: React.FC<VipDropVaultProps> = ({ onNotifyToast }) => {
  // Countdown to next drop (e.g. 14 hours 28 mins 45 secs from now)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 28,
    seconds: 45,
  });

  const [rsvpEmail, setRsvpEmail] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpEmail || !rsvpEmail.includes('@')) return;
    setIsUnlocked(true);
    onNotifyToast('VIP Pass Granted: 10-Minute Priority Slot Reserved for Midnight Tokyo Archive Drop!');
  };

  const previewPieces = [
    {
      name: 'Titanium-Threaded Trench',
      category: 'Secret Archive',
      material: 'Metallic Coated Ripstop',
      run: '25 Pieces Worldwide',
      eta: '10 Mins',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=700&q=80',
    },
    {
      name: 'Obsidian Oversized Kimono Parka',
      category: 'Secret Archive',
      material: '500 GSM Heavy Wool',
      run: '40 Pieces Worldwide',
      eta: '10 Mins',
      image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=700&q=80',
    },
    {
      name: 'Kinetic Pleated Asymmetric Vest',
      category: 'Secret Archive',
      material: 'Bonded Tech Twill',
      run: '18 Pieces Worldwide',
      eta: '9 Mins',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=80',
    },
  ];

  return (
    <section id="vault" className="py-20 bg-[#0E0E0E] text-white border-t border-white/10 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5757]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 text-[#FF5757] text-xs font-bold uppercase tracking-[0.3em] mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Restricted Access Drop</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-fashion tracking-tight text-white">
              THE VIP DROP VAULT
            </h2>
            <p className="text-xs text-white/60 mt-1 max-w-md font-light leading-relaxed">
              Curated by Shaikh Kamran in limited quantities of under 50 pieces. Unlocked early exclusively for VIP members.
            </p>
          </div>

          {/* Live Countdown Counter */}
          <div className="bg-white/5 border border-white/15 px-6 py-3 rounded-sm flex items-center gap-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FF5757]" />
              Drops In:
            </span>
            <div className="flex items-center gap-2 font-mono text-xl sm:text-2xl font-black text-white tabular-nums">
              <span className="bg-black/40 px-2 py-1 rounded-xs">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-black/40 px-2 py-1 rounded-xs">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-black/40 px-2 py-1 rounded-xs text-[#FF5757]">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Vault Pieces Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {previewPieces.map((piece, idx) => (
            <div
              key={idx}
              className="group relative bg-white/5 border border-white/10 rounded-sm overflow-hidden flex flex-col justify-between"
            >
              {/* Image with Blur Lock if not unlocked */}
              <div className="relative aspect-[3/4] bg-stone-900 overflow-hidden">
                <img
                  src={piece.image}
                  alt={piece.name}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    !isUnlocked
                      ? 'filter blur-sm scale-105 contrast-125'
                      : 'filter blur-none scale-100 group-hover:scale-105'
                  }`}
                  referrerPolicy="no-referrer"
                />

                {/* Lock Badge Overlay */}
                {!isUnlocked ? (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-[#FF5757] mb-3 shadow-lg">
                      <Lock className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-white">
                      Vault Encrypted
                    </span>
                    <span className="text-[11px] text-white/60 mt-1">
                      RSVP below to decrypt garment specs
                    </span>
                  </div>
                ) : (
                  <div className="absolute top-3 left-3 bg-[#FF5757] text-white text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-xs flex items-center gap-1 shadow">
                    <Unlock className="w-3 h-3" />
                    <span>Unlocked for You</span>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xs flex items-center justify-between text-[11px] text-white">
                  <span>{piece.run}</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[#FF5757] fill-[#FF5757]" />
                    {piece.eta} Hub Ready
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="text-[11px] uppercase tracking-widest text-[#FF5757] font-bold mb-1">
                  {piece.category}
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  {isUnlocked ? piece.name : 'Classified Archive Piece'}
                </h4>
                <p className="text-xs text-white/60 font-light">
                  {piece.material} · Micro-dyed in small batch
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* RSVP Card */}
        <div className="bg-gradient-to-r from-stone-900 via-neutral-900 to-stone-900 border border-white/20 p-8 rounded-sm max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#FF5757] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Access Pass</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black font-fashion text-white">
            {isUnlocked ? 'YOU HAVE SECURED VAULT ACCESS' : 'RESERVE 10-MINUTE PRIORITY DISPATCH'}
          </h3>

          <p className="text-xs text-white/70 max-w-md mx-auto font-light leading-relaxed">
            {isUnlocked
              ? 'Your private priority pass is activated. When the countdown hits zero, you will receive an immediate SMS with instant checkout priority before general release.'
              : 'Enter your email address to unlock the encrypted garment preview and secure a reserved courier slot at your local micro-hub.'}
          </p>

          {!isUnlocked ? (
            <form onSubmit={handleRSVP} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                value={rsvpEmail}
                onChange={(e) => setRsvpEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-white/10 border border-white/20 px-4 py-3 text-xs text-white placeholder:text-white/40 rounded-sm outline-none focus:border-[#FF5757]"
              />
              <button
                type="submit"
                className="bg-[#FF5757] hover:bg-white hover:text-black text-white px-6 py-3 font-bold text-xs uppercase tracking-widest rounded-sm transition cursor-pointer shrink-0"
              >
                UNLOCK VAULT
              </button>
            </form>
          ) : (
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-sm text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Priority Slot #042 Reserved · Dispatch Ready in ~10m at Launch</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
