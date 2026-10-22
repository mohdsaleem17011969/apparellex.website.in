import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Mail, Phone, MapPin, ShieldCheck, Globe } from 'lucide-react';
import { CompanyInfo, SocialLinks, INITIAL_COMPANY_INFO, INITIAL_SOCIAL_LINKS } from '../data/adminStore';

interface FooterProps {
  companyInfo?: CompanyInfo;
  socialLinks?: SocialLinks;
}

export const Footer: React.FC<FooterProps> = ({
  companyInfo = INITIAL_COMPANY_INFO,
  socialLinks = INITIAL_SOCIAL_LINKS,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    socialLinks.whatsapp.message ||
      `Check out ${companyInfo.brandName} — 10-minute luxury fashion delivered to your doorstep! https://ais-pre-nymurarspls3yqnu5ugsbj-563741178923.asia-southeast1.run.app`
  )}`;

  return (
    <footer className="bg-[#0D0D0D] text-white pt-20 pb-12 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-white/10">
          {/* Brand & Corporate Details Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-3xl sm:text-4xl font-black font-fashion tracking-tighter text-white">
              {companyInfo.brandName}
            </h4>
            <p className="text-white/60 text-xs sm:text-sm max-w-md leading-relaxed font-light">
              {companyInfo.missionStatement}
            </p>

            <div className="text-[11px] text-white/50 space-y-1.5 pt-1">
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF5757]" />
                <span>{companyInfo.legalName} · Reg: {companyInfo.registrationNumber}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-white/40" />
                <span>HQ: {companyInfo.headquarters}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-white/40" />
                <span>Hotline: {companyInfo.hotlinePhone} ({companyInfo.operatingHours})</span>
              </p>
            </div>

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

          {/* Connect & Social Channels Column */}
          <div>
            <h5 className="font-bold text-xs uppercase tracking-widest text-white/90 mb-4 font-fashion">
              Digital Channels
            </h5>
            <ul className="text-white/60 text-xs space-y-3 font-medium">
              {socialLinks.whatsapp.enabled && (
                <li>
                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-white transition-colors font-semibold flex items-center gap-1.5"
                  >
                    <span>WhatsApp Instant Share</span>
                  </a>
                </li>
              )}
              {socialLinks.instagram.enabled && (
                <li>
                  <a
                    href={socialLinks.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#FF5757] transition-colors"
                  >
                    Instagram ({socialLinks.instagram.handle})
                  </a>
                </li>
              )}
              {socialLinks.twitter.enabled && (
                <li>
                  <a
                    href={socialLinks.twitter.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#FF5757] transition-colors"
                  >
                    Twitter / X ({socialLinks.twitter.handle})
                  </a>
                </li>
              )}
              {socialLinks.facebook.enabled && (
                <li>
                  <a
                    href={socialLinks.facebook.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#FF5757] transition-colors"
                  >
                    Facebook ({socialLinks.facebook.handle})
                  </a>
                </li>
              )}
              {socialLinks.tiktok.enabled && (
                <li>
                  <a
                    href={socialLinks.tiktok.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#FF5757] transition-colors"
                  >
                    TikTok ({socialLinks.tiktok.handle})
                  </a>
                </li>
              )}
              {socialLinks.discord.enabled && (
                <li>
                  <a
                    href={socialLinks.discord.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#FF5757] transition-colors"
                  >
                    Discord ({socialLinks.discord.handle})
                  </a>
                </li>
              )}
              <li>
                <a
                  href={`mailto:${companyInfo.supportEmail}`}
                  className="hover:text-[#FF5757] transition-colors inline-flex items-center gap-1.5 pt-1"
                >
                  <Mail className="w-3 h-3 text-[#FF5757]" />
                  <span>{companyInfo.supportEmail}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Corporate Governance Column */}
          <div>
            <h5 className="font-bold text-xs uppercase tracking-widest text-white/90 mb-4 font-fashion">
              Legal & Executive
            </h5>
            <ul className="text-white/60 text-xs space-y-3 font-medium">
              <li>
                <a href="#about" className="hover:text-[#FF5757] transition-colors">
                  Board & Executive Governance
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#FF5757] transition-colors">
                  Privacy Policy & Disclosures
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#FF5757] transition-colors">
                  Terms of Service & SLAs
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#FF5757] transition-colors">
                  10-Minute Dark-Store Dispatch Terms
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${companyInfo.founderEmail}`}
                  className="hover:text-[#FF5757] transition-colors text-white/80 font-bold"
                >
                  Founder Desk ({companyInfo.founderAndCeo})
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-white/40 text-xs gap-4">
          <p>
            © {companyInfo.yearFounded} {companyInfo.brandName}. All Rights Reserved. Founder & CEO: {companyInfo.founderAndCeo}.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>10-Minute Micro-Hub Network</span>
            <span>·</span>
            <span>{companyInfo.taxIdentification}</span>
            <span>·</span>
            <span>Zero-Emission Super73 Fleet</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
