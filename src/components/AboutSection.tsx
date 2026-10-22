import React, { useState } from 'react';
import { Sparkles, Zap, ShieldCheck, Mail, Linkedin, Users } from 'lucide-react';
import { CompanyInfo, Director, INITIAL_COMPANY_INFO, INITIAL_DIRECTORS } from '../data/adminStore';

interface AboutSectionProps {
  companyInfo?: CompanyInfo;
  directors?: Director[];
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  companyInfo = INITIAL_COMPANY_INFO,
  directors = INITIAL_DIRECTORS,
}) => {
  const [imgError, setImgError] = useState(false);
  const founder = directors.find((d) => d.name.toLowerCase().includes('shaikh')) || directors[0];

  return (
    <section id="about" className="py-24 bg-white border-t border-black/10">
      <div className="container mx-auto px-6 space-y-20">
        {/* Top Story & Founder Showcase */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Visual Column */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-sm shadow-xl bg-stone-100 aspect-[4/5] max-h-[580px]">
              {!imgError ? (
                <img
                  src={founder.image}
                  alt={`${companyInfo.founderAndCeo} - Founder & CEO`}
                  className="w-full h-full object-cover object-center filter contrast-[1.03]"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-stone-900 to-stone-800 flex flex-col items-center justify-center p-8 text-center text-white">
                  <Sparkles className="w-12 h-12 text-[#FF5757] mb-3" />
                  <h4 className="text-xl font-bold font-fashion">{companyInfo.founderAndCeo}</h4>
                  <p className="text-xs text-stone-400 uppercase tracking-widest mt-1">
                    Founder & CEO, {companyInfo.brandName}
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
              Founded by <strong className="font-bold text-black">{companyInfo.founderAndCeo}</strong>, {companyInfo.brandName} is a high-octane luxury startup designed for the modern disruptor. We noticed a fundamental flaw in the retail landscape: fashion was either fast and disposable, or premium and agonizingly slow.
            </p>

            <p className="text-black/75 text-sm md:text-base leading-relaxed mb-8 font-light">
              {companyInfo.missionStatement}
            </p>

            {/* Adjacency Proof Numbers */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-black/10 mb-8">
              <div>
                <span className="text-2xl sm:text-3xl font-black font-fashion text-[#1a1a1a] block tabular-nums">
                  10<span className="text-[#FF5757] text-lg font-bold">m</span>
                </span>
                <span className="text-[11px] uppercase tracking-wider text-black/60 font-semibold">
                  Guaranteed SLA
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
              <h3 className="font-bold text-xl text-[#1a1a1a] font-fashion">{companyInfo.founderAndCeo}</h3>
              <p className="text-xs uppercase tracking-widest text-black/50 font-semibold">
                Founder & Chief Executive Officer, {companyInfo.brandName}
              </p>
              <p className="text-[11px] text-black/40 mt-1">
                {companyInfo.legalName} · {companyInfo.registrationNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Board of Directors & Leadership Grid */}
        <div className="pt-12 border-t border-black/10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#FF5757] font-bold block mb-2">
                Corporate Governance
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-fashion uppercase text-[#1a1a1a]">
                Board of Directors & Executive Leadership
              </h3>
            </div>
            <p className="text-xs text-black/50 max-w-md font-light">
              Governed under {companyInfo.legalName}. Engineered by leaders across runway haute couture, autonomous dark-store logistics, and electric fleet telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {directors.map((d) => (
              <div
                key={d.id}
                className="bg-[#FAF8F2] p-5 rounded-sm border border-black/10 flex flex-col justify-between group hover:border-black transition"
              >
                <div>
                  <div className="aspect-square w-full rounded-xs overflow-hidden mb-4 bg-stone-200">
                    <img
                      src={d.image}
                      alt={d.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF5757]">
                      {d.department}
                    </span>
                    <span className="text-[10px] text-black/40 font-mono">
                      Tenure: {d.appointedYear}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-black font-fashion">{d.name}</h4>
                  <p className="text-xs font-semibold text-black/70 mt-0.5">{d.role}</p>
                  <p className="text-xs text-black/60 font-light mt-2 leading-relaxed">
                    {d.bio}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-black/10 flex items-center justify-between text-xs text-black/50">
                  {d.email && (
                    <a
                      href={`mailto:${d.email}`}
                      className="hover:text-[#FF5757] transition flex items-center gap-1 text-[11px]"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Contact</span>
                    </a>
                  )}
                  {d.linkedin && (
                    <a
                      href={d.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#FF5757] transition flex items-center gap-1 text-[11px]"
                    >
                      <Linkedin className="w-3 h-3" />
                      <span>Executive Brief</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
