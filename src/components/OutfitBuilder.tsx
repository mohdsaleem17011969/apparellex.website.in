import React, { useState } from 'react';
import { Product, PRODUCTS } from '../data/products';
import { Sparkles, ShoppingBag, Zap, Check, ArrowRight, Layers } from 'lucide-react';

interface OutfitBuilderProps {
  onAddOutfitToBag: (items: { product: Product; size: string; color: { name: string; hex: string } }[]) => void;
  onOpenAiSuggestions?: () => void;
}

interface CuratedLook {
  id: string;
  name: string;
  subtitle: string;
  aesthetic: string;
  topId: string;
  bottomId: string;
  outerId?: string;
  discountPercent: number;
}

const CURATED_LOOKS: CuratedLook[] = [
  {
    id: 'look-1',
    name: 'The Cyber-Utility Drop',
    subtitle: 'Engineered for high-speed metropolitan movement.',
    aesthetic: 'Urban Streetwear',
    topId: 'prod-1', // Heavyweight Raw-Edge Hoodie
    bottomId: 'prod-4', // Modular Technical Cargo Trousers
    outerId: 'prod-6', // Cybernetic Chrome Oversized Bomber
    discountPercent: 15,
  },
  {
    id: 'look-2',
    name: 'Architectural Zen Silhouette',
    subtitle: 'Subtle lines, fluid drape, and organic luxury fibres.',
    aesthetic: 'Minimalist Zen',
    topId: 'prod-2', // Architectural Poplin Relaxed Shirt
    bottomId: 'prod-5', // Pleated Zen Flow Wide Pant
    outerId: 'prod-7', // Heavy Ribbed Cashmere Mockneck
    discountPercent: 15,
  },
  {
    id: 'look-3',
    name: 'Avant-Garde Runway Statement',
    subtitle: 'Dramatic high-fashion volume designed for the fearless.',
    aesthetic: 'Unique Trends',
    topId: 'prod-9', // Draped Kinetic Midi Dress
    bottomId: 'prod-5', // Pleated Zen Flow Wide Pant
    outerId: 'prod-3', // Sculptural Asymmetric Runway Coat
    discountPercent: 15,
  },
];

export const OutfitBuilder: React.FC<OutfitBuilderProps> = ({ onAddOutfitToBag, onOpenAiSuggestions }) => {
  const [selectedLookId, setSelectedLookId] = useState(CURATED_LOOKS[0].id);

  const activeLook = CURATED_LOOKS.find((l) => l.id === selectedLookId) || CURATED_LOOKS[0];

  const topProduct = PRODUCTS.find((p) => p.id === activeLook.topId) || PRODUCTS[0];
  const bottomProduct = PRODUCTS.find((p) => p.id === activeLook.bottomId) || PRODUCTS[3];
  const outerProduct = activeLook.outerId ? PRODUCTS.find((p) => p.id === activeLook.outerId) : undefined;

  const currentOutfitItems = [topProduct, bottomProduct, outerProduct].filter(Boolean) as Product[];

  const rawSubtotal = currentOutfitItems.reduce((acc, p) => acc + p.price, 0);
  const bundleDiscount = Math.round((rawSubtotal * activeLook.discountPercent) / 100);
  const bundlePrice = rawSubtotal - bundleDiscount;

  const handleAddBundle = () => {
    const itemsToAdd = currentOutfitItems.map((prod) => ({
      product: prod,
      size: prod.sizes[0],
      color: prod.colors[0],
    }));
    onAddOutfitToBag(itemsToAdd);
  };

  return (
    <section id="outfit-studio" className="py-24 bg-[#111111] text-white border-t border-white/10">
      <div className="container mx-auto px-6">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 text-[#FF5757] text-xs font-bold uppercase tracking-[0.3em] mb-2">
              <Sparkles className="w-3.5 h-3.5 fill-[#FF5757]" />
              <span>Shaikh Kamran Curated Formulations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-fashion tracking-tight text-white">
              THE OUTFIT STUDIO
            </h2>
            <p className="text-xs text-white/60 mt-1 max-w-lg font-light leading-relaxed">
              Complete looks matched for proportions and textures. Packaged in a single wardrobe pouch with 15% bundled savings and 10-minute dispatch.
            </p>
          </div>

          {/* Look Preset Selector + AI Formulation */}
          <div className="flex flex-wrap items-center gap-2">
            {CURATED_LOOKS.map((look) => (
              <button
                key={look.id}
                onClick={() => setSelectedLookId(look.id)}
                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer ${
                  selectedLookId === look.id
                    ? 'bg-[#FF5757] text-white shadow-md'
                    : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                }`}
              >
                {look.name}
              </button>
            ))}

            {onOpenAiSuggestions && (
              <button
                onClick={onOpenAiSuggestions}
                className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer bg-gradient-to-r from-[#FF5757] to-[#e04545] text-white flex items-center gap-1.5 shadow-lg hover:brightness-110 active:scale-95"
                title="Ask Gemini AI for custom styling formulas"
              >
                <Sparkles className="w-3.5 h-3.5 fill-white" />
                <span>Custom AI Look</span>
              </button>
            )}
          </div>
        </div>

        {/* Studio Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Garments Preview Column (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {currentOutfitItems.map((prod, idx) => (
              <div
                key={prod.id}
                className="bg-white/5 border border-white/10 rounded-sm overflow-hidden flex flex-col justify-between group hover:border-[#FF5757]/50 transition-all"
              >
                {/* Visual */}
                <div className="relative aspect-[3/4] bg-stone-900 overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-xs text-[#FF5757]">
                    Layer 0{idx + 1}
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-md px-2 py-1 rounded-xs flex items-center justify-between text-[11px]">
                    <span className="text-white/70">{prod.categoryLabel}</span>
                    <span className="font-bold text-white tabular-nums">${prod.price}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4">
                  <h4 className="text-xs font-bold text-white line-clamp-1">{prod.name}</h4>
                  <p className="text-[11px] text-white/50 mt-1 line-clamp-2 font-light">
                    {prod.description}
                  </p>
                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60">
                    <span>Default: {prod.sizes[0]}</span>
                    <span className="text-[#FF5757] font-semibold">{prod.colors[0].name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Look Details & Bundle Checkout Card (4 cols) */}
          <div className="lg:col-span-4 bg-white/5 border border-white/15 p-6 sm:p-8 rounded-sm space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-[#FF5757] font-bold uppercase tracking-wider mb-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Curated Wardrobe Bundle</span>
              </div>
              <h3 className="text-2xl font-black font-fashion text-white mb-2">
                {activeLook.name}
              </h3>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                {activeLook.subtitle}
              </p>
            </div>

            {/* Bundle Benefits */}
            <div className="space-y-2.5 pt-2 text-xs text-white/80">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span>All {currentOutfitItems.length} pieces packed in single luxury garment bag</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span>Free 10-minute doorstep try-on with size backups</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span>15% Bundle Discount applied instantly at checkout</span>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-sm space-y-2 text-xs">
              <div className="flex justify-between text-white/60">
                <span>Individual Pieces Total</span>
                <span className="line-through tabular-nums">₹{rawSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Curator Bundle Savings (15%)</span>
                <span className="tabular-nums">-₹{bundleDiscount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-white/10 text-white">
                <span className="font-bold text-sm uppercase tracking-wider">Bundle Total</span>
                <div className="text-right">
                  <span className="text-2xl font-black font-fashion tabular-nums text-white">
                    ₹{bundlePrice.toLocaleString('en-IN')}
                  </span>
                  <span className="block text-[10px] text-emerald-400 font-semibold uppercase">
                    Free 10-Minute Dispatch
                  </span>
                </div>
              </div>
            </div>

            {/* 1-Click Action */}
            <button
              onClick={handleAddBundle}
              className="w-full bg-[#FF5757] hover:bg-white hover:text-black text-white py-4 px-6 rounded-sm text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add Complete Look to Bag (₹{bundlePrice.toLocaleString('en-IN')})</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-white/50 text-center">
              <Zap className="w-3.5 h-3.5 text-[#FF5757] fill-[#FF5757]" />
              <span>Ships immediately from your nearest micro-hub</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
