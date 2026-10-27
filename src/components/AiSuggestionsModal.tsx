import React, { useState, useEffect } from 'react';
import { Product, PRODUCTS } from '../data/products';
import {
  Sparkles,
  X,
  Zap,
  ShoppingBag,
  Ruler,
  TrendingUp,
  Compass,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Search,
  Sliders,
  Layers,
  Heart,
  HelpCircle,
  Loader2
} from 'lucide-react';
import {
  OutfitSuggestionResult,
  FitSuggestionResult,
  TrendSuggestionResult,
  SmartSearchResult
} from '../types/ai';

interface AiSuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  initialProduct?: Product | null;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }, qty: number) => void;
  onAddMultipleToCart?: (items: { product: Product; size: string; color: { name: string; hex: string } }[]) => void;
  onOpenQuickView?: (product: Product) => void;
}

type TabType = 'outfit' | 'fit' | 'trends' | 'search';

export const AiSuggestionsModal: React.FC<AiSuggestionsModalProps> = ({
  isOpen,
  onClose,
  products,
  initialProduct,
  onAddToCart,
  onAddMultipleToCart,
  onOpenQuickView,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<TabType>('outfit');

  // 1. Outfit Formulation State
  const [selectedProduct, setSelectedProduct] = useState<Product>(initialProduct || products[0] || PRODUCTS[0]);
  const [occasion, setOccasion] = useState('SoHo Gallery Night & Evening Transit');
  const [outfitGender, setOutfitGender] = useState('unisex');
  const [isGeneratingOutfit, setIsGeneratingOutfit] = useState(false);
  const [outfitResult, setOutfitResult] = useState<OutfitSuggestionResult | null>(null);

  // 2. Fit & Tailoring State
  const [fitHeight, setFitHeight] = useState("5'11\"");
  const [fitWeight, setFitWeight] = useState("170 lbs");
  const [fitBodyType, setFitBodyType] = useState('Athletic');
  const [preferredDrape, setPreferredDrape] = useState('Relaxed Everyday');
  const [isGeneratingFit, setIsGeneratingFit] = useState(false);
  const [fitResult, setFitResult] = useState<FitSuggestionResult | null>(null);

  // 3. Trend Suggestions State
  const [trendVibe, setTrendVibe] = useState('Minimalist Zen & Heavyweight Streetwear');
  const [isGeneratingTrends, setIsGeneratingTrends] = useState(false);
  const [trendResult, setTrendResult] = useState<TrendSuggestionResult | null>(null);

  // 4. Smart Natural Language Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SmartSearchResult | null>(null);

  // Quick occasions
  const OCCASIONS = [
    'SoHo Gallery Night & Evening Transit',
    'Chilly Rainy Commute (Layered Tech)',
    'High-Profile Creative Studio Meeting',
    'Late Night Downtown Dinner & Lounge',
    'Weekend Coffee Run in West Village',
  ];

  const DRAPES = ['Slim Tailored', 'Relaxed Everyday', 'Voluminous Streetwear Drape'];
  const BODY_TYPES = ['Slim / Lean', 'Athletic / Tapered', 'Broad / Solid', 'Tall / Slim'];

  // Catalog summary for server API
  const catalogPayload = products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.categoryLabel,
    price: p.price,
    description: p.description,
  }));

  // Auto-generate outfit suggestions when tab opens or product changes
  useEffect(() => {
    if (activeTab === 'outfit' && !outfitResult) {
      handleGenerateOutfit();
    }
  }, [activeTab]);

  const handleGenerateOutfit = async (targetOccasion = occasion) => {
    setIsGeneratingOutfit(true);
    try {
      const res = await fetch('/api/ai/outfit-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productContext: `${selectedProduct.name} (${selectedProduct.categoryLabel})`,
          occasion: targetOccasion,
          gender: outfitGender,
          catalog: catalogPayload,
        }),
      });
      const data = await res.json();
      setOutfitResult(data);
    } catch {
      // Handled gracefully by server fallback
    } finally {
      setIsGeneratingOutfit(false);
    }
  };

  const handleGenerateFit = async () => {
    setIsGeneratingFit(true);
    try {
      const res = await fetch('/api/ai/fit-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: selectedProduct.name,
          productFit: selectedProduct.fit,
          height: fitHeight,
          weight: fitWeight,
          bodyType: fitBodyType,
          preferredDrape,
        }),
      });
      const data = await res.json();
      setFitResult(data);
    } catch {
      // Handled
    } finally {
      setIsGeneratingFit(false);
    }
  };

  const handleGenerateTrends = async (vibeChoice = trendVibe) => {
    setIsGeneratingTrends(true);
    try {
      const res = await fetch('/api/ai/trend-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vibe: vibeChoice,
          catalog: catalogPayload,
        }),
      });
      const data = await res.json();
      setTrendResult(data);
    } catch {
      // Handled
    } finally {
      setIsGeneratingTrends(false);
    }
  };

  const handleExecuteSmartSearch = async (queryText = searchQuery) => {
    if (!queryText.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch('/api/ai/smart-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          catalog: catalogPayload,
        }),
      });
      const data = await res.json();
      setSearchResult(data);
    } catch {
      // Handled
    } finally {
      setIsSearching(false);
    }
  };

  // Add entire suggested outfit ensemble to bag in 1 click
  const handleAddEnsembleToBag = () => {
    if (!outfitResult) return;
    const itemsToAdd = (outfitResult.recommendedProductIds || [])
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean) as Product[];

    // Include base product if not already there
    if (!itemsToAdd.some((p) => p.id === selectedProduct.id)) {
      itemsToAdd.unshift(selectedProduct);
    }

    if (onAddMultipleToCart) {
      onAddMultipleToCart(
        itemsToAdd.map((p) => ({
          product: p,
          size: p.sizes[0] || 'M',
          color: p.colors[0] || { name: 'Black', hex: '#111111' },
        }))
      );
    } else {
      itemsToAdd.forEach((p) => {
        onAddToCart(p, p.sizes[0] || 'M', p.colors[0] || { name: 'Black', hex: '#111111' }, 1);
      });
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-suggestions-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-4xl w-full rounded-sm overflow-hidden shadow-2xl relative border border-white/20 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-black/10 flex items-center justify-between bg-[#111111] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF5757] text-white flex items-center justify-center shadow-md shrink-0">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="ai-suggestions-title" className="text-base sm:text-lg font-black font-fashion uppercase tracking-wider text-white">
                  Apparellex AI Style Concierge
                </h2>
                <span className="text-[10px] bg-white/10 text-[#FF5757] border border-[#FF5757]/30 px-2 py-0.5 rounded font-black uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5757] animate-pulse" />
                  Gemini 3.8
                </span>
              </div>
              <p className="text-xs text-white/60">
                Personalized outfit formulas, bespoke tailoring advice, and live hyperlocal trend suggestions.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition p-1 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#FAF8F2] border-b border-black/10 px-6 py-2.5 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
          {[
            { id: 'outfit', label: '1. Outfit & Complete Look', icon: Layers },
            { id: 'fit', label: '2. AI Fit & Tailor', icon: Ruler },
            { id: 'trends', label: '3. Hyperlocal Trends', icon: TrendingUp },
            { id: 'search', label: '4. Natural Language Finder', icon: Search },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  if (tab.id === 'fit' && !fitResult) handleGenerateFit();
                  if (tab.id === 'trends' && !trendResult) handleGenerateTrends();
                }}
                className={`px-3 py-2 rounded-sm transition flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'bg-white hover:bg-black/5 text-black/70 border border-black/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FF5757]' : 'text-black/50'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OUTFIT SUGGESTIONS */}
          {activeTab === 'outfit' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Product Anchor & Occasion Picker */}
              <div className="bg-[#FAF8F2] p-4 rounded-sm border border-black/10 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-black/50 block mb-1">
                      Anchor Product for Styling Formula
                    </label>
                    <select
                      value={selectedProduct.id}
                      onChange={(e) => {
                        const p = products.find((prod) => prod.id === e.target.value);
                        if (p) setSelectedProduct(p);
                      }}
                      className="bg-white border border-black/20 text-xs font-bold p-2.5 rounded-sm outline-none w-full sm:w-auto"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — ${p.price} ({p.categoryLabel})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-black/50 block mb-1">
                      Gender Styling Filter
                    </label>
                    <div className="flex items-center gap-1 bg-white p-1 border border-black/20 rounded-sm">
                      {['unisex', 'men', 'women'].map((g) => (
                        <button
                          key={g}
                          onClick={() => setOutfitGender(g)}
                          className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-sm transition cursor-pointer ${
                            outfitGender === g ? 'bg-[#FF5757] text-white' : 'text-black/60 hover:text-black'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Occasions */}
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-black/50 block mb-1.5">
                    Select Target Occasion / Ambient Vibe
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {OCCASIONS.map((occ) => (
                      <button
                        key={occ}
                        onClick={() => {
                          setOccasion(occ);
                          handleGenerateOutfit(occ);
                        }}
                        className={`text-xs px-2.5 py-1.5 rounded-sm border transition cursor-pointer ${
                          occasion === occ
                            ? 'bg-[#111111] text-white border-black'
                            : 'bg-white text-black/80 border-black/15 hover:border-black'
                        }`}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleGenerateOutfit()}
                    disabled={isGeneratingOutfit}
                    className="px-4 py-2 bg-[#FF5757] hover:bg-[#e04545] text-white text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition shadow cursor-pointer disabled:opacity-50"
                  >
                    {isGeneratingOutfit ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Formulating with Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Re-Generate AI Look</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Outfit Suggestions Results Card */}
              {outfitResult && (
                <div className="space-y-4">
                  {/* Stylist Formulation Banner */}
                  <div className="p-4 rounded-sm bg-[#111111] text-white space-y-2 border border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <h3 className="text-sm font-black font-fashion uppercase tracking-wider text-white">
                          {outfitResult.title}
                        </h3>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400">
                        {outfitResult.aesthetic}
                      </span>
                    </div>

                    <p className="text-xs text-white/80 font-light leading-relaxed">
                      {outfitResult.stylistRationale}
                    </p>

                    <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/60">
                      <span><strong>Color Harmony:</strong> {outfitResult.colorHarmony}</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#FF5757] fill-[#FF5757]" />
                        10-Min Doorstep Delivery Eligible
                      </span>
                    </div>
                  </div>

                  {/* Curated Ensemble Pieces Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#1a1a1a]">
                        Suggested Matching Ensemble Pieces ({outfitResult.recommendedProductIds.length})
                      </h4>
                      <span className="text-[11px] text-black/50">Curated from live inventory</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {outfitResult.recommendedProductIds.map((pid) => {
                        const item = products.find((p) => p.id === pid) || products[0];
                        return (
                          <div
                            key={pid}
                            className="bg-white border border-black/15 p-3 rounded-sm flex flex-col justify-between hover:border-black transition group"
                          >
                            <div className="relative aspect-[4/5] bg-stone-100 rounded-xs overflow-hidden mb-2">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                              <span className="absolute top-2 left-2 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                {item.categoryLabel}
                              </span>
                            </div>

                            <div>
                              <h5 className="text-xs font-bold text-black truncate">{item.name}</h5>
                              <p className="text-xs font-black text-black mt-0.5">${item.price}</p>
                            </div>

                            <button
                              onClick={() => onAddToCart(item, item.sizes[0], item.colors[0], 1)}
                              className="w-full mt-3 py-1.5 bg-black hover:bg-[#FF5757] text-white text-[11px] font-bold uppercase tracking-wider rounded-sm transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <ShoppingBag className="w-3 h-3" />
                              <span>Add Piece</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Styling Tips & 1-Click Complete Look Button */}
                  <div className="bg-[#FAF8F2] p-4 rounded-sm border border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-black">
                        Shaikh Kamran's Styling Rules:
                      </h5>
                      <ul className="text-xs text-black/70 list-disc list-inside space-y-0.5">
                        {outfitResult.stylingTips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={handleAddEnsembleToBag}
                      className="px-5 py-3 bg-[#FF5757] hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-sm transition shadow-lg shrink-0 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add Complete AI Look to Bag</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AI FIT & TAILORING SUGGESTIONS */}
          {activeTab === 'fit' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-[#FAF8F2] p-5 rounded-sm border border-black/10 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-black/10">
                  <Ruler className="w-4 h-4 text-[#FF5757]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-black">
                    Your Physical Dimensions & Silhouette Preference
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-black/60 block mb-1">Height</label>
                    <input
                      type="text"
                      value={fitHeight}
                      onChange={(e) => setFitHeight(e.target.value)}
                      placeholder="e.g. 5'11&quot; or 180cm"
                      className="w-full text-xs p-2.5 bg-white border border-black/20 rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-black/60 block mb-1">Weight</label>
                    <input
                      type="text"
                      value={fitWeight}
                      onChange={(e) => setFitWeight(e.target.value)}
                      placeholder="e.g. 170 lbs or 75kg"
                      className="w-full text-xs p-2.5 bg-white border border-black/20 rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-black/60 block mb-1">Body Profile</label>
                    <select
                      value={fitBodyType}
                      onChange={(e) => setFitBodyType(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-black/20 rounded-sm"
                    >
                      {BODY_TYPES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-black/60 block mb-1">Drape Goal</label>
                    <select
                      value={preferredDrape}
                      onChange={(e) => setPreferredDrape(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-black/20 rounded-sm"
                    >
                      {DRAPES.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleGenerateFit}
                    disabled={isGeneratingFit}
                    className="px-4 py-2 bg-[#FF5757] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {isGeneratingFit ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ruler className="w-3.5 h-3.5" />}
                    <span>Calculate Tailor Recommendation</span>
                  </button>
                </div>
              </div>

              {/* Fit Suggestion Card */}
              {fitResult && (
                <div className="bg-white border-2 border-emerald-600/30 p-5 rounded-sm shadow-sm space-y-4 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/10">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                        Confidence: {fitResult.confidenceScore}% Match
                      </span>
                      <h4 className="text-xl font-black font-fashion text-black mt-1">
                        Recommended Size: <span className="text-[#FF5757] text-2xl font-mono">{fitResult.recommendedSize}</span>
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-sm border border-emerald-200">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Includes 5-Min Doorstep Fit Check</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <strong className="text-black font-bold uppercase text-[11px]">Fit & Silhouette Analysis:</strong>
                      <p className="text-black/70 leading-relaxed">{fitResult.fitAnalysis}</p>
                    </div>

                    <div className="space-y-1">
                      <strong className="text-black font-bold uppercase text-[11px]">Fabric Drape On Body:</strong>
                      <p className="text-black/70 leading-relaxed">{fitResult.drapeDescription}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF8F2] rounded-sm border border-black/10 text-xs text-black/70 flex items-start gap-2">
                    <RefreshCw className="w-4 h-4 text-[#FF5757] shrink-0 mt-0.5" />
                    <p>{fitResult.alternativeSizeNote}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HYPERLOCAL TREND RADAR */}
          {activeTab === 'trends' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-[#111111] text-white p-5 rounded-sm border border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#FF5757]" />
                  <h3 className="text-xs font-black uppercase tracking-wider">
                    Lower Manhattan Street Fashion AI Radar
                  </h3>
                </div>
                <p className="text-xs text-white/70">
                  Real-time trend analysis grounded in SoHo, NoHo, and DUMBO fashion circuits with instant delivery.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    'Minimalist Zen & Heavyweight Streetwear',
                    'Cyberpunk Techwear & Weatherproof Shells',
                    'Quiet Luxury Cashmere & Sculpted Wool',
                    'Draped Asymmetric Runway Silhouettes',
                  ].map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        setTrendVibe(v);
                        handleGenerateTrends(v);
                      }}
                      className={`text-xs px-3 py-1.5 rounded-sm border transition cursor-pointer ${
                        trendVibe === v
                          ? 'bg-[#FF5757] text-white border-[#FF5757]'
                          : 'bg-white/10 hover:bg-white/20 text-white/80 border-white/10'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {trendResult && (
                <div className="bg-[#FAF8F2] p-5 rounded-sm border border-black/10 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-black/10">
                    <h4 className="text-sm font-black uppercase tracking-wider text-black">
                      {trendResult.headline}
                    </h4>
                    <span className="text-[10px] text-black/50 font-bold uppercase tracking-wider">
                      NYC Radar Forecast
                    </span>
                  </div>

                  <p className="text-xs text-black/80 leading-relaxed font-light">
                    {trendResult.vibeDescription}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <h5 className="text-[11px] font-bold uppercase text-black mb-1.5">
                        Dominant Micro-Aesthetics:
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {trendResult.trendingAesthetics.map((aes, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-white border border-black/15 px-2.5 py-1 rounded-sm text-black font-medium"
                          >
                            {aes}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-[11px] font-bold uppercase text-black mb-1.5">
                        Key Editorial Rules:
                      </h5>
                      <ul className="text-xs text-black/70 list-disc list-inside space-y-1">
                        {trendResult.keyStylingRules.map((rule, idx) => (
                          <li key={idx}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: NATURAL LANGUAGE WARDROBE FINDER */}
          {activeTab === 'search' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleExecuteSmartSearch()}
                    placeholder="Ask anything: e.g. 'Effortless all-black outfit for an outdoor dinner in 50°F weather'..."
                    className="w-full text-xs pl-10 pr-24 py-3.5 border border-black/20 rounded-sm bg-white focus:border-[#FF5757] outline-none shadow-sm"
                  />
                  <Search className="w-4 h-4 absolute left-3.5 top-4 text-black/40 pointer-events-none" />

                  <button
                    onClick={() => handleExecuteSmartSearch()}
                    disabled={isSearching}
                    className="absolute right-2 top-2 px-3.5 py-2 bg-[#FF5757] hover:bg-black text-white text-xs font-bold uppercase rounded-sm transition cursor-pointer disabled:opacity-50"
                  >
                    {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Ask AI</span>}
                  </button>
                </div>

                {/* Prompt Suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[10px] uppercase font-bold text-black/40 mr-1">Suggestions:</span>
                  {[
                    'Waterproof streetwear for wet city commute',
                    'Minimalist quiet luxury top and wide pant',
                    'Sculptural runway coat for gallery opening',
                    'Cozy heavyweight cotton drop for lounge',
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setSearchQuery(preset);
                        handleExecuteSmartSearch(preset);
                      }}
                      className="px-2.5 py-1 bg-[#FAF8F2] hover:bg-black hover:text-white border border-black/15 text-black/70 rounded-sm text-[11px] transition cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {searchResult && (
                <div className="bg-[#FAF8F2] p-5 rounded-sm border border-black/10 space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FF5757]" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-black">
                      AI Interpretation & Stylist Selection
                    </h4>
                  </div>

                  <p className="text-xs text-black/80 font-medium">
                    {searchResult.stylistNote}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                    {searchResult.matchedProductIds.map((pid) => {
                      const item = products.find((p) => p.id === pid) || products[0];
                      return (
                        <div
                          key={pid}
                          className="bg-white border border-black/15 p-3 rounded-sm flex flex-col justify-between"
                        >
                          <div className="aspect-[4/5] bg-stone-100 rounded-xs overflow-hidden mb-2">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-black truncate">{item.name}</h5>
                            <p className="text-xs font-black text-black mt-0.5">${item.price}</p>
                          </div>
                          <button
                            onClick={() => onAddToCart(item, item.sizes[0], item.colors[0], 1)}
                            className="w-full mt-2.5 py-1.5 bg-[#111111] hover:bg-[#FF5757] text-white text-[11px] font-bold uppercase rounded-sm transition cursor-pointer flex items-center justify-center gap-1"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Add to Bag</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
