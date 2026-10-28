import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Clock,
  RotateCcw,
  Zap,
  ShieldCheck,
  ChevronDown,
  Search,
  MessageCircle,
  Truck,
  Sparkles,
  CheckCircle2,
  MapPin,
  ArrowRight,
} from 'lucide-react';

export interface FaqItem {
  id: string;
  category: 'dispatch' | 'delivery' | 'returns' | 'quality';
  question: string;
  answer: string;
  highlight?: string;
  badge?: string;
  actionText?: string;
  actionType?: 'delivery-checker' | 'whatsapp' | 'email';
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'dispatch',
    question: 'How is a 10-minute fashion delivery even possible?',
    answer:
      'We operate proprietary hyper-local micro-fulfillment dark stores situated within a 2.5 km radius of core delivery hubs (like Andheri West, Oshiwara, Versova, and Lokhandwala in Mumbai). When you place an order, our automated RF-guided pickers bag the garment in under 90 seconds. A dedicated Super73 electric bike courier receives the order immediately and navigates priority arterial routes directly to your doorstep.',
    highlight: 'Average dispatch from rack to courier is under 90 seconds.',
    badge: '10-Min Promise',
    actionText: 'Check Your Pincode',
    actionType: 'delivery-checker',
  },
  {
    id: 'faq-2',
    category: 'dispatch',
    question: 'What happens if my 10-minute delivery arrives late?',
    answer:
      'Our 10-minute promise is backed by a strict SLA guarantee. If a verified 10-minute hyper-express order takes longer than 10 minutes due to unexpected traffic or heavy weather, we automatically credit ₹250 directly to your Apparellex store wallet with zero questions asked, plus your delivery fee is fully waived.',
    highlight: '₹250 automatic store credit guarantee if we are ever late.',
    badge: 'Guaranteed SLA',
  },
  {
    id: 'faq-3',
    category: 'delivery',
    question: 'Which areas and pincodes are currently covered for 10-minute delivery?',
    answer:
      'Our instant 10-minute fulfillment network is live across Andheri West, Oshiwara, Lokhandwala Complex, Versova, DN Nagar, and 4 Bungalows (Pincodes 400053, 400058, 400061). Surrounding Mumbai suburbs (Bandra, Juhu, Goregaon) receive 30–45 minute rush delivery, while standard metro addresses across India enjoy swift 24–48 hour express air shipping.',
    highlight: 'Active Mumbai Zone: Oshiwara Mega Mall hub (Pincode 400053).',
    actionText: 'Verify Your Postal Code',
    actionType: 'delivery-checker',
  },
  {
    id: 'faq-4',
    category: 'delivery',
    question: 'How can I track my courier in real time?',
    answer:
      'The moment your order is accepted, your screen displays live Google Maps telemetry tracking your assigned rider, bike plate, real-time GPS coordinate updates, traffic heatmaps, and a countdown timer ticking down from 10:00 to 00:00. You also receive SMS and WhatsApp ping updates.',
    badge: 'Live GPS',
  },
  {
    id: 'faq-5',
    category: 'returns',
    question: 'What is your return & exchange policy?',
    answer:
      'We offer an ultra-flexible 7-day doorstep return and exchange window. If the garment does not fit the way you envisioned, you can initiate a return or exchange in one tap from your Orders tab. A courier will collect the piece directly from your address at no added cost.',
    highlight: '7 days no-hassle return window with free doorstep pickup.',
    badge: 'Doorstep Pickup',
  },
  {
    id: 'faq-6',
    category: 'returns',
    question: 'Can I try items on while the courier waits (Doorstep Try & Buy)?',
    answer:
      'Yes! For all 10-minute micro-zone orders, our rider will happily wait up to 5 minutes outside your door while you inspect and try on the piece. If you want a different size or change your mind, hand it right back to the courier immediately for instant zero-paperwork return processing.',
    highlight: 'Try & Buy: 5-minute courier standby in hyper-local zones.',
    badge: 'Try & Buy',
  },
  {
    id: 'faq-7',
    category: 'returns',
    question: 'How fast do I receive my refund?',
    answer:
      'For returns handed back to the courier or scanned at our dark store, UPI and Net Banking refunds are processed instantaneously (typically within 15–30 minutes). Credit card and debit card refunds post back to your issuing bank statement in 2–4 business days.',
    highlight: 'Instant UPI refunds processed in under 30 minutes.',
  },
  {
    id: 'faq-8',
    category: 'quality',
    question: 'How do you guarantee fabric quality and authenticity?',
    answer:
      'Every Apparellex piece is crafted using premium heavyweight French terry cotton (380–500 GSM), high-density poplin, or luxury technical nylon. We maintain a zero-counterfeit policy with laser-etched internal authenticity tags, pre-shipment double-stitched QA inspections, and weather-sealed designer garment dust bags.',
    highlight: 'Heavyweight 380–500 GSM fabrics with certified QA inspection.',
    badge: 'Atelier QA',
  },
  {
    id: 'faq-9',
    category: 'quality',
    question: 'What if I am unsure about sizing before ordering?',
    answer:
      'Every product card features our interactive AI Size & Fit Assistant. Enter your height, weight, and preferred fit (Oversized, Relaxed, or Tailored) to get an exact recommendation with 98.4% fit accuracy, calibrated from over 12,000 satisfied customer orders.',
    highlight: 'AI Size Assistant with 98.4% fit accuracy on every piece.',
  },
];

interface FaqSectionProps {
  onOpenDeliveryChecker?: () => void;
  onNotifyToast?: (msg: string) => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  onOpenDeliveryChecker,
  onNotifyToast,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'dispatch', label: '10-Min Dispatch Promise', icon: Zap },
    { id: 'delivery', label: 'Delivery & Coverage', icon: Truck },
    { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw },
    { id: 'quality', label: 'Quality & Sizing', icon: ShieldCheck },
  ];

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        (item.highlight && item.highlight.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleAction = (item: FaqItem) => {
    if (item.actionType === 'delivery-checker' && onOpenDeliveryChecker) {
      onOpenDeliveryChecker();
    } else if (item.actionType === 'whatsapp') {
      window.open(
        'https://api.whatsapp.com/send?phone=919820192834&text=Hi%20Apparellex%2C%20I%20have%20a%20question%20about%20my%20order',
        '_blank'
      );
    }
  };

  return (
    <section id="faq" className="py-20 bg-[#FEFCF5] border-t border-black/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 border border-black/10 text-xs font-bold uppercase tracking-widest text-[#FF5757] mb-3">
            <Zap className="w-3.5 h-3.5 fill-[#FF5757]" />
            <span>Customer Trust & Clarity</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-fashion tracking-tight text-[#1a1a1a]">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="mt-3 text-sm sm:text-base text-black/60 font-light leading-relaxed">
            Everything you need to know about our 10-minute dispatch promise, delivery coverage in Mumbai, hassle-free returns, and atelier quality.
          </p>
        </div>

        {/* 4 Trust Guarantee Value Props */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12">
          <div className="p-4 rounded-2xl bg-white border border-black/10 shadow-xs flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-[#FF5757]/10 flex items-center justify-center text-[#FF5757] mb-2.5">
              <Zap className="w-5 h-5 fill-[#FF5757]" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]">
              10-Min Dispatch SLA
            </h3>
            <p className="text-[11px] text-black/60 mt-1 leading-snug">
              ₹250 instant credit if late in covered zones
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-black/10 shadow-xs flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-2.5">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]">
              7-Day Doorstep Returns
            </h3>
            <p className="text-[11px] text-black/60 mt-1 leading-snug">
              Free pickup & instant 30-min UPI refund
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-black/10 shadow-xs flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-2.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]">
              100% Authentic Quality
            </h3>
            <p className="text-[11px] text-black/60 mt-1 leading-snug">
              Heavyweight 380–500 GSM luxury fabrics
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-black/10 shadow-xs flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-2.5">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]">
              Live GPS Telemetry
            </h3>
            <p className="text-[11px] text-black/60 mt-1 leading-snug">
              Real-time map and courier countdown
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 text-black/40 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g., returns, 10 minutes, refund, try & buy, pincode)..."
            className="w-full bg-white border border-black/10 rounded-full pl-11 pr-10 py-3 text-xs sm:text-sm text-[#1a1a1a] placeholder:text-black/40 focus:outline-none focus:border-[#FF5757] shadow-xs transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-black/40 hover:text-black cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar scroll-smooth">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'bg-white text-black/70 border border-black/10 hover:border-black/30 hover:text-black'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FF5757]' : 'text-black/50'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-black/10 p-8">
              <HelpCircle className="w-10 h-10 text-black/30 mx-auto mb-3" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#1a1a1a]">
                No matching answers found
              </h4>
              <p className="text-xs text-black/60 mt-1 max-w-sm mx-auto">
                Try searching with different terms or contact our concierge directly on WhatsApp.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-4 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#FF5757] transition cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'border-[#FF5757]/40 shadow-sm ring-1 ring-[#FF5757]/20'
                      : 'border-black/10 hover:border-black/20'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {item.badge && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FF5757]/10 text-[#FF5757]">
                            {item.badge}
                          </span>
                        )}
                        <span className="text-[10px] uppercase tracking-widest text-black/40 font-semibold">
                          {item.category === 'dispatch'
                            ? 'Dispatch & Speed'
                            : item.category === 'delivery'
                            ? 'Coverage & Tracking'
                            : item.category === 'returns'
                            ? 'Returns & Policy'
                            : 'Authenticity & Fit'}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-[#1a1a1a] tracking-tight">
                        {item.question}
                      </h3>
                    </div>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center bg-black/5 text-[#1a1a1a] shrink-0 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 bg-[#FF5757] text-white' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-black/70 leading-relaxed border-t border-black/5 animate-in fade-in duration-150">
                      <p>{item.answer}</p>
                      {item.highlight && (
                        <div className="mt-3 p-3 rounded-xl bg-black/[0.03] border border-black/5 flex items-center gap-2 text-[#1a1a1a] font-medium text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{item.highlight}</span>
                        </div>
                      )}
                      {item.actionText && (
                        <div className="mt-3 pt-2">
                          <button
                            onClick={() => handleAction(item)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5757] hover:text-black transition cursor-pointer"
                          >
                            <span>{item.actionText}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Trust & Direct Concierge Helpdesk Card */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#111111] text-white relative overflow-hidden shadow-lg">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-[#FF5757]/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-lg space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FF5757] text-xs font-bold uppercase tracking-wider">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Mumbai Live Concierge Desk</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-fashion tracking-tight">
                Have a specific question before ordering?
              </h3>
              <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                Our local Mumbai styling & logistics desk is online 7 days a week from 8:00 AM to 11:00 PM IST. Get human answers in under 60 seconds.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://api.whatsapp.com/send?phone=919820192834&text=Hi%20Apparellex%2C%20I%20have%20a%20question%20about%20orders%20and%2010-min%20delivery"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-full inline-flex items-center gap-2 transition shadow-sm hover:shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Desk</span>
              </a>
              {onOpenDeliveryChecker && (
                <button
                  onClick={onOpenDeliveryChecker}
                  className="bg-white/10 hover:bg-white hover:text-black text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-full inline-flex items-center gap-2 transition cursor-pointer border border-white/20"
                >
                  <MapPin className="w-4 h-4 text-[#FF5757]" />
                  <span>Verify Pincode</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
