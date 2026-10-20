import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#0D0D0D] text-white pt-20 pb-12 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-white/10">
          {/* Brand & Newsletter Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-3xl sm:text-4xl font-black font-fashion tracking-tighter text-white">
              APPARELLEX
            </h4>
            <p className="text-white/60 text-xs sm:text-sm max-w-md leading-relaxed font-light">
              Join the fast-fashion luxury revolution. Subscribe to get immediate notification of limited drops, VIP private vault access, and seasonal style lookbooks.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubscribe} className="pt-2 max-w-md">
              <div className="flex">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-white/10 border border-white/20 px-4 py-3 text-xs w-full outline-none focus:border-[#FF5757] text-white placeholder:text-white/40 rounded-l-sm"
                />
                <button
                  type="submit"
                  className="bg-[#FF5757] hover:bg-white hover:text-black text-white px-6 py-3 font-bold text-xs uppercase tracking-widest transition-all rounded-r-sm cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  <span>JOIN</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1.5 font-medium animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Welcome to the Apparellex VIP list. First drop code sent!</span>
                </p>
              )}
            </form>
          </div>

          {/* Connect Column */}
          <div>
            <h5 className="font-bold text-xs uppercase tracking-widest text-white/90 mb-4 font-fashion">
              Connect
            </h5>
            <ul className="text-white/60 text-xs space-y-3 font-medium">
              <li>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    'Check out Apparellex — 10-minute luxury fashion delivered to your doorstep! https://ais-pre-nymurarspls3yqnu5ugsbj-563741178923.asia-southeast1.run.app'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-white transition-colors font-semibold flex items-center gap-1.5"
                >
                  <span>Share on WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FF5757] transition-colors"
                >
                  Instagram (@Apparellex)
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FF5757] transition-colors"
                >
                  Twitter / X
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FF5757] transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="mailto:Apparellexsk@gmail.com"
                  className="hover:text-[#FF5757] transition-colors inline-flex items-center gap-1.5 pt-1"
                >
                  <Mail className="w-3 h-3 text-[#FF5757]" />
                  <span>Apparellexsk@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h5 className="font-bold text-xs uppercase tracking-widest text-white/90 mb-4 font-fashion">
              Legal & Support
            </h5>
            <ul className="text-white/60 text-xs space-y-3 font-medium">
              <li>
                <a href="#about" className="hover:text-[#FF5757] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#FF5757] transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#FF5757] transition-colors">
                  10-Min Delivery Terms & SLA
                </a>
              </li>
              <li>
                <a href="mailto:Apparellexsk@gmail.com" className="hover:text-[#FF5757] transition-colors">
                  Direct Founder Desk
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-white/40 text-xs gap-4">
          <p>© 2024 APPARELLEX. All Rights Reserved. Created by Shaikh Kamran.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>10-Minute Dispatch System</span>
            <span>·</span>
            <span>Curated Luxury</span>
            <span>·</span>
            <span>Urban Aesthetics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
