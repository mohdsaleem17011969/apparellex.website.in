import React, { useState, useMemo } from 'react';
import { Product } from '../data/products';
import {
  Heart,
  Eye,
  ShoppingBag,
  Zap,
  Star,
  Filter,
  ArrowUpDown,
  ArrowLeftRight,
  SlidersHorizontal,
  Check,
  X,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  activeCategory: string;
  setActiveCategory: (cat: 'all' | 'urban-street' | 'minimalist-zen' | 'unique-trends') => void;
  activeGender: 'all' | 'men' | 'women' | 'unisex';
  setActiveGender: (gender: 'all' | 'men' | 'women' | 'unisex') => void;
  searchQuery: string;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
  compareProductIds?: string[];
  onToggleCompare?: (productId: string) => void;
  onOpenCompareModal?: () => void;
}

export interface ColorFilterOption {
  id: string;
  label: string;
  hex: string;
  border?: boolean;
  matchWords: string[];
}

export const COLOR_FILTER_OPTIONS: ColorFilterOption[] = [
  { id: 'black', label: 'Black & Onyx', hex: '#111111', matchWords: ['black', 'charcoal', 'onyx', 'obsidian', 'night'] },
  { id: 'white', label: 'White & Cream', hex: '#FAF9F6', border: true, matchWords: ['white', 'chalk', 'bone', 'cream', 'ivory'] },
  { id: 'red', label: 'Signature Red & Coral', hex: '#FF5757', matchWords: ['red', 'crimson', 'coral'] },
  { id: 'olive', label: 'Military Olive', hex: '#4A5340', matchWords: ['olive', 'military', 'green'] },
  { id: 'taupe', label: 'Sand & Taupe', hex: '#C2B8A3', matchWords: ['taupe', 'sand', 'dune', 'oatmeal'] },
  { id: 'silver', label: 'Gunmetal & Silver', hex: '#9E9E9E', matchWords: ['silver', 'grey', 'smoke', 'gunmetal'] },
  { id: 'indigo', label: 'Acid Indigo & Denim', hex: '#4B6584', matchWords: ['indigo', 'blue', 'denim'] },
];

export const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const;

export type PricePreset = 'all' | 'under-3000' | '3000-4500' | 'above-4500' | 'custom';

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  activeCategory,
  setActiveCategory,
  activeGender,
  setActiveGender,
  searchQuery,
  wishlist,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  compareProductIds = [],
  onToggleCompare,
  onOpenCompareModal,
}) => {
  // Sort State
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc' | 'delivery'>('featured');

  // Filter States
  const [selectedSizesFilter, setSelectedSizesFilter] = useState<string[]>([]);
  const [selectedColorsFilter, setSelectedColorsFilter] = useState<string[]>([]);
  const [pricePreset, setPricePreset] = useState<PricePreset>('all');
  const [customMinPrice, setCustomMinPrice] = useState<number>(2000);
  const [customMaxPrice, setCustomMaxPrice] = useState<number>(6500);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(true);

  // Per-card selections
  const [selectedSizes, setSelectedSizes] = useState<{ [productId: string]: string }>({});
  const [imgErrors, setImgErrors] = useState<{ [id: string]: boolean }>({});

  const handleImgError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Dynamic price limits across the product list
  const catalogMinPrice = useMemo(() => {
    return products.length > 0 ? Math.min(...products.map((p) => p.price)) : 2000;
  }, [products]);

  const catalogMaxPrice = useMemo(() => {
    return products.length > 0 ? Math.max(...products.map((p) => p.price)) : 6500;
  }, [products]);

  // Size toggle handler
  const handleToggleSizeFilter = (size: string) => {
    setSelectedSizesFilter((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Color toggle handler
  const handleToggleColorFilter = (colorId: string) => {
    setSelectedColorsFilter((prev) =>
      prev.includes(colorId) ? prev.filter((c) => c !== colorId) : [...prev, colorId]
    );
  };

  // Reset all filters
  const handleResetAllFilters = () => {
    setActiveCategory('all');
    setActiveGender('all');
    setSelectedSizesFilter([]);
    setSelectedColorsFilter([]);
    setPricePreset('all');
    setCustomMinPrice(catalogMinPrice);
    setCustomMaxPrice(catalogMaxPrice);
  };

  // Total active filter count for badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (activeCategory !== 'all') count++;
    if (activeGender !== 'all') count++;
    count += selectedSizesFilter.length;
    count += selectedColorsFilter.length;
    if (pricePreset !== 'all') count++;
    return count;
  }, [activeCategory, activeGender, selectedSizesFilter, selectedColorsFilter, pricePreset]);

  // Filter products
  const filteredProducts = products.filter((prod) => {
    // Category match
    if (activeCategory !== 'all' && prod.category !== activeCategory) {
      return false;
    }
    // Gender match
    if (activeGender !== 'all') {
      if (activeGender === 'men' && prod.gender !== 'men' && prod.gender !== 'unisex') return false;
      if (activeGender === 'women' && prod.gender !== 'women' && prod.gender !== 'unisex') return false;
      if (activeGender === 'unisex' && prod.gender !== 'unisex') return false;
    }
    // Size match (multi-select: product has any of the selected sizes)
    if (selectedSizesFilter.length > 0) {
      const matchesSize = selectedSizesFilter.some((sz) => prod.sizes.includes(sz));
      if (!matchesSize) return false;
    }
    // Color match (multi-select: product matches any of the selected color families)
    if (selectedColorsFilter.length > 0) {
      const matchesColor = selectedColorsFilter.some((colorId) => {
        const option = COLOR_FILTER_OPTIONS.find((c) => c.id === colorId);
        if (!option) return false;
        return prod.colors.some((col) => {
          const colNameLower = col.name.toLowerCase();
          return option.matchWords.some((w) => colNameLower.includes(w));
        });
      });
      if (!matchesColor) return false;
    }
    // Price range match
    if (pricePreset === 'under-3000' && prod.price > 3000) return false;
    if (pricePreset === '3000-4500' && (prod.price < 3000 || prod.price > 4500)) return false;
    if (pricePreset === 'above-4500' && prod.price < 4500) return false;
    if (pricePreset === 'custom') {
      if (prod.price < customMinPrice || prod.price > customMaxPrice) return false;
    }
    // Search query match
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchCat = prod.categoryLabel.toLowerCase().includes(q);
      const matchFabric = prod.fabric.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchFabric) return false;
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'newest') {
      const timeB = b.releaseDate ? new Date(b.releaseDate).getTime() : (b.isNewDrop ? 2 : 1);
      const timeA = a.releaseDate ? new Date(a.releaseDate).getTime() : (a.isNewDrop ? 2 : 1);
      return timeB - timeA;
    }
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'delivery') return a.estDeliveryMins - b.estDeliveryMins;
    return 0; // featured default
  });

  const getActiveSize = (product: Product) => {
    return selectedSizes[product.id] || product.sizes[0];
  };

  const setProductSize = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  // Helper counts for UI badges
  const sizeCounts = useMemo(() => {
    const counts: { [size: string]: number } = {};
    AVAILABLE_SIZES.forEach((sz) => {
      counts[sz] = products.filter((p) => p.sizes.includes(sz)).length;
    });
    return counts;
  }, [products]);

  const colorCounts = useMemo(() => {
    const counts: { [id: string]: number } = {};
    COLOR_FILTER_OPTIONS.forEach((colOpt) => {
      counts[colOpt.id] = products.filter((p) =>
        p.colors.some((col) => {
          const colLower = col.name.toLowerCase();
          return colOpt.matchWords.some((w) => colLower.includes(w));
        })
      ).length;
    });
    return counts;
  }, [products]);

  return (
    <section id="catalog" className="py-20 bg-[#FAF8F2] border-t border-black/10">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-black/10">
          <div>
            <div className="inline-flex items-center gap-2 text-[#FF5757] text-xs font-bold uppercase tracking-[0.3em] mb-2">
              <Zap className="w-3.5 h-3.5 fill-[#FF5757]" />
              <span>Instant Wardrobe Dispatch</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-fashion tracking-tight text-[#1a1a1a]">
              CURATED DROPS
            </h2>
            <p className="text-xs text-black/60 mt-1">
              Guaranteed delivery in 10 minutes or less directly to your location in Andheri West, Mumbai.
            </p>
          </div>

          {/* Controls: Filter Toggle, Compare Shortcut, & Sort Dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Panel Toggle Button */}
            <button
              onClick={() => setIsFilterPanelOpen((prev) => !prev)}
              className={`px-3.5 py-2 text-xs font-bold rounded-sm border flex items-center gap-2 transition cursor-pointer ${
                isFilterPanelOpen || activeFiltersCount > 0
                  ? 'bg-[#1a1a1a] text-white border-black shadow-sm'
                  : 'bg-white text-black/80 border-black/15 hover:border-black/30'
              }`}
              title="Toggle Size, Color, and Price Range Filters"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF5757]" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-[#FF5757] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
              {isFilterPanelOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-white/60 ml-0.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-black/60 ml-0.5" />
              )}
            </button>

            {/* Compare Shortcut */}
            {onOpenCompareModal && (
              <button
                onClick={onOpenCompareModal}
                className={`px-3 py-2 text-xs font-bold rounded-sm border flex items-center gap-1.5 transition cursor-pointer ${
                  compareProductIds.length > 0
                    ? 'bg-[#FF5757] text-white border-[#FF5757] shadow-sm'
                    : 'bg-white text-black/70 border-black/15 hover:border-black/30'
                }`}
                title="Open Side-by-Side Product Comparison"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Compare {compareProductIds.length > 0 ? `(${compareProductIds.length}/2)` : ''}</span>
              </button>
            )}

            {/* Sort Controller Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-black/15 rounded-sm px-2.5 py-1.5 shadow-2xs">
              <span className="text-xs uppercase tracking-wider text-black/60 font-semibold flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#FF5757]" />
                <span className="hidden sm:inline">Sort:</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-[#1a1a1a] outline-none cursor-pointer pr-1"
                aria-label="Sort products"
              >
                <option value="featured">Featured Drops</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="delivery">⚡ Fastest Delivery</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Tabs & Gender Selector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          {/* Category Tabs (Segmented Buttons) */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Collections' },
              { id: 'urban-street', label: 'Urban Street' },
              { id: 'minimalist-zen', label: 'Minimalist Zen' },
              { id: 'unique-trends', label: 'Unique Trends' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all duration-150 cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-[#1a1a1a] text-white shadow-sm'
                    : 'bg-white text-black/70 hover:text-black border border-black/10 hover:border-black/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Gender Filter Pills & Quick Sort Pills */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Sort Shortcuts */}
            <div className="hidden xl:flex items-center gap-1 text-[11px] font-semibold text-black/60 bg-white border border-black/10 rounded-sm p-1">
              <span className="px-2 uppercase text-[10px] text-black/40 font-bold tracking-wider">Quick Sort:</span>
              {[
                { id: 'newest', label: 'Newest' },
                { id: 'price-asc', label: 'Price: Low to High' },
                { id: 'price-desc', label: 'Price: High to Low' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSortBy(s.id as any)}
                  className={`px-2.5 py-1 rounded-xs transition cursor-pointer text-xs ${
                    sortBy === s.id
                      ? 'bg-[#1a1a1a] text-white font-bold'
                      : 'text-black/70 hover:text-black hover:bg-black/5'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Gender Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-white border border-black/10 rounded-sm self-start lg:self-auto">
              <span className="text-[11px] font-semibold text-black/50 px-2 uppercase tracking-wider">
                Wear:
              </span>
              {[
                { id: 'all', label: 'All' },
                { id: 'men', label: 'Men' },
                { id: 'women', label: 'Women' },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActiveGender(g.id as any)}
                  className={`px-3 py-1 text-xs font-bold tracking-wide rounded-sm transition-colors cursor-pointer ${
                    activeGender === g.id
                      ? 'bg-[#FF5757] text-white'
                      : 'text-black/70 hover:text-black hover:bg-black/5'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* EXPANDABLE FILTER & REFINE PANEL (Size, Color, and Price Range) */}
        {isFilterPanelOpen && (
          <div className="bg-white border border-black/10 rounded-sm p-5 sm:p-6 mb-8 shadow-sm transition-all animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 divide-y md:divide-y-0 md:divide-x divide-black/10">
              
              {/* 1. SIZE FILTER */}
              <div className="md:col-span-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#1a1a1a] flex items-center gap-1.5">
                    <span>1. Filter by Size</span>
                    {selectedSizesFilter.length > 0 && (
                      <span className="text-[10px] bg-[#FF5757] text-white font-bold px-1.5 py-0.2 rounded-full">
                        {selectedSizesFilter.length}
                      </span>
                    )}
                  </span>
                  {selectedSizesFilter.length > 0 && (
                    <button
                      onClick={() => setSelectedSizesFilter([])}
                      className="text-[10px] text-red-600 hover:text-red-800 font-bold underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {AVAILABLE_SIZES.map((sz) => {
                    const isSelected = selectedSizesFilter.includes(sz);
                    const count = sizeCounts[sz] || 0;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleToggleSizeFilter(sz)}
                        className={`py-2 px-1 text-xs font-bold rounded-sm border flex flex-col items-center justify-center transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#1a1a1a] text-white border-black shadow-sm'
                            : 'bg-[#FAF8F2] hover:bg-white text-black/80 border-black/10 hover:border-black/30'
                        }`}
                        title={`Filter by size ${sz} (${count} pieces)`}
                      >
                        <span className="font-fashion text-xs font-black">{sz}</span>
                        <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-white/70' : 'text-black/40'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-black/50 leading-tight">
                  Click to select one or multiple sizes. Showing pieces in stock at micro-hubs.
                </p>
              </div>

              {/* 2. COLOR FILTER */}
              <div className="md:col-span-5 pt-5 md:pt-0 md:pl-6 lg:pl-8 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#1a1a1a] flex items-center gap-1.5">
                    <span>2. Filter by Color</span>
                    {selectedColorsFilter.length > 0 && (
                      <span className="text-[10px] bg-[#FF5757] text-white font-bold px-1.5 py-0.2 rounded-full">
                        {selectedColorsFilter.length}
                      </span>
                    )}
                  </span>
                  {selectedColorsFilter.length > 0 && (
                    <button
                      onClick={() => setSelectedColorsFilter([])}
                      className="text-[10px] text-red-600 hover:text-red-800 font-bold underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COLOR_FILTER_OPTIONS.map((col) => {
                    const isSelected = selectedColorsFilter.includes(col.id);
                    const count = colorCounts[col.id] || 0;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => handleToggleColorFilter(col.id)}
                        className={`p-2 rounded-sm border text-left flex items-center gap-2 transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#1a1a1a] text-white border-black shadow-sm ring-1 ring-black'
                            : 'bg-[#FAF8F2] hover:bg-white text-black/80 border-black/10 hover:border-black/30'
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs ${
                            col.border ? 'border border-black/30' : ''
                          }`}
                          style={{ backgroundColor: col.hex }}
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-bold block truncate leading-tight">
                            {col.label}
                          </span>
                          <span className={`text-[9px] block ${isSelected ? 'text-white/70' : 'text-black/40'}`}>
                            {count} piece{count !== 1 ? 's' : ''}
                          </span>
                        </div>
                        {isSelected && <Check className="w-3 h-3 text-[#FF5757] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. PRICE RANGE FILTER */}
              <div className="md:col-span-4 pt-5 md:pt-0 md:pl-6 lg:pl-8 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#1a1a1a] flex items-center gap-1.5">
                    <span>3. Price Range (₹)</span>
                    {pricePreset !== 'all' && (
                      <span className="text-[10px] bg-[#FF5757] text-white font-bold px-1.5 py-0.2 rounded-full">
                        Active
                      </span>
                    )}
                  </span>
                  {pricePreset !== 'all' && (
                    <button
                      onClick={() => {
                        setPricePreset('all');
                        setCustomMinPrice(catalogMinPrice);
                        setCustomMaxPrice(catalogMaxPrice);
                      }}
                      className="text-[10px] text-red-600 hover:text-red-800 font-bold underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Preset Chips */}
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'all' as PricePreset, label: 'All Prices' },
                    { id: 'under-3000' as PricePreset, label: 'Under ₹3,000' },
                    { id: '3000-4500' as PricePreset, label: '₹3,000 – ₹4,500' },
                    { id: 'above-4500' as PricePreset, label: 'Above ₹4,500' },
                  ].map((preset) => {
                    const isSelected = pricePreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setPricePreset(preset.id)}
                        className={`py-1.5 px-2 text-[11px] font-bold rounded-sm border transition text-center cursor-pointer ${
                          isSelected
                            ? 'bg-[#1a1a1a] text-white border-black shadow-sm'
                            : 'bg-[#FAF8F2] hover:bg-white text-black/80 border-black/10 hover:border-black/30'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Range Slider & Inputs */}
                <div className="pt-2 border-t border-black/10 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-black/50 font-semibold">Custom Range:</span>
                    <span className="font-bold tabular-nums text-black">
                      ₹{pricePreset === 'custom' ? customMinPrice.toLocaleString('en-IN') : catalogMinPrice.toLocaleString('en-IN')} – ₹{pricePreset === 'custom' ? customMaxPrice.toLocaleString('en-IN') : catalogMaxPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Dual Sliders / Max Slider */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min={catalogMinPrice}
                      max={catalogMaxPrice}
                      step={100}
                      value={pricePreset === 'custom' ? customMaxPrice : catalogMaxPrice}
                      onChange={(e) => {
                        setPricePreset('custom');
                        setCustomMaxPrice(Number(e.target.value));
                      }}
                      className="w-full accent-[#FF5757] cursor-pointer"
                      title="Adjust maximum price threshold"
                    />
                    <div className="flex items-center justify-between text-[10px] text-black/50 tabular-nums">
                      <span>Min: ₹{catalogMinPrice.toLocaleString('en-IN')}</span>
                      <span>Max: ₹{catalogMaxPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Min / Max Inputs */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-black/40 mb-0.5">Min (₹)</label>
                      <input
                        type="number"
                        min={0}
                        max={customMaxPrice}
                        step={100}
                        value={pricePreset === 'custom' ? customMinPrice : catalogMinPrice}
                        onChange={(e) => {
                          setPricePreset('custom');
                          setCustomMinPrice(Math.max(0, Number(e.target.value)));
                        }}
                        className="w-full bg-[#FAF8F2] border border-black/15 text-xs font-bold px-2 py-1 rounded-sm text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-black/40 mb-0.5">Max (₹)</label>
                      <input
                        type="number"
                        min={customMinPrice}
                        max={100000}
                        step={100}
                        value={pricePreset === 'custom' ? customMaxPrice : catalogMaxPrice}
                        onChange={(e) => {
                          setPricePreset('custom');
                          setCustomMaxPrice(Math.max(customMinPrice, Number(e.target.value)));
                        }}
                        className="w-full bg-[#FAF8F2] border border-black/15 text-xs font-bold px-2 py-1 rounded-sm text-black"
                      />
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Reset & Close Footer */}
            <div className="mt-5 pt-4 border-t border-black/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-black/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium">
                  Showing <strong className="text-black tabular-nums">{filteredProducts.length}</strong> of{' '}
                  <span className="tabular-nums">{products.length}</span> luxury pieces
                </span>
              </div>

              <div className="flex items-center gap-3">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleResetAllFilters}
                    className="text-xs font-bold text-black/70 hover:text-[#FF5757] flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                )}
                <button
                  onClick={() => setIsFilterPanelOpen(false)}
                  className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-black text-white text-xs font-bold rounded-sm transition cursor-pointer"
                >
                  Apply & Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE FILTER TAGS ROW */}
        {activeFiltersCount > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2 p-3 bg-white border border-black/10 rounded-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-black/50 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#FF5757]" />
              <span>Active Filters:</span>
            </span>

            {/* Category Tag */}
            {activeCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-black/5 text-[#1a1a1a] text-xs font-semibold px-2.5 py-1 rounded-sm border border-black/10">
                <span>Collection: {activeCategory}</span>
                <button
                  onClick={() => setActiveCategory('all')}
                  className="hover:text-[#FF5757] cursor-pointer"
                  title="Remove category filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Gender Tag */}
            {activeGender !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-black/5 text-[#1a1a1a] text-xs font-semibold px-2.5 py-1 rounded-sm border border-black/10">
                <span>Wear: {activeGender}</span>
                <button
                  onClick={() => setActiveGender('all')}
                  className="hover:text-[#FF5757] cursor-pointer"
                  title="Remove gender filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Size Tags */}
            {selectedSizesFilter.map((sz) => (
              <span
                key={sz}
                className="inline-flex items-center gap-1.5 bg-black text-white text-xs font-semibold px-2.5 py-1 rounded-sm"
              >
                <span>Size: {sz}</span>
                <button
                  onClick={() => handleToggleSizeFilter(sz)}
                  className="hover:text-[#FF5757] cursor-pointer"
                  title={`Remove size ${sz} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Color Tags */}
            {selectedColorsFilter.map((colId) => {
              const opt = COLOR_FILTER_OPTIONS.find((c) => c.id === colId);
              return (
                <span
                  key={colId}
                  className="inline-flex items-center gap-1.5 bg-[#1a1a1a] text-white text-xs font-semibold px-2.5 py-1 rounded-sm"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: opt?.hex || '#000' }}
                  />
                  <span>Color: {opt?.label || colId}</span>
                  <button
                    onClick={() => handleToggleColorFilter(colId)}
                    className="hover:text-[#FF5757] cursor-pointer"
                    title="Remove color filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}

            {/* Price Tag */}
            {pricePreset !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-[#FF5757]/10 text-[#FF5757] text-xs font-bold px-2.5 py-1 rounded-sm border border-[#FF5757]/30">
                <span>
                  Price:{' '}
                  {pricePreset === 'under-3000'
                    ? 'Under ₹3,000'
                    : pricePreset === '3000-4500'
                    ? '₹3,000 – ₹4,500'
                    : pricePreset === 'above-4500'
                    ? 'Above ₹4,500'
                    : `₹${customMinPrice.toLocaleString('en-IN')} – ₹${customMaxPrice.toLocaleString('en-IN')}`}
                </span>
                <button
                  onClick={() => {
                    setPricePreset('all');
                    setCustomMinPrice(catalogMinPrice);
                    setCustomMaxPrice(catalogMaxPrice);
                  }}
                  className="hover:text-black cursor-pointer"
                  title="Remove price filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Clear All Button */}
            <button
              onClick={handleResetAllFilters}
              className="ml-auto text-xs font-bold text-red-600 hover:text-red-800 underline cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Active Query Indicator */}
        {searchQuery && (
          <div className="mb-6 flex items-center gap-2 text-xs text-black/70">
            <span>Showing results matching "{searchQuery}"</span>
            <span className="text-black/40">·</span>
            <span className="font-semibold text-black tabular-nums">{sortedProducts.length} items</span>
          </div>
        )}

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-sm border border-black/10 p-8 shadow-sm">
            <Filter className="w-8 h-8 text-black/30 mx-auto mb-3" />
            <h3 className="text-lg font-bold font-fashion text-[#1a1a1a]">No matching pieces found</h3>
            <p className="text-xs text-black/60 mt-1 max-w-sm mx-auto">
              We couldn't find any garments matching your exact combination of size, color, and price filters.
            </p>
            <button
              onClick={handleResetAllFilters}
              className="mt-4 px-5 py-2.5 bg-[#1a1a1a] hover:bg-[#FF5757] text-white text-xs font-bold uppercase rounded-sm transition cursor-pointer shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map((product) => {
              const currentSize = getActiveSize(product);
              const isWishlisted = wishlist.includes(product.id);
              const isCompared = compareProductIds.includes(product.id);

              return (
                <article
                  key={product.id}
                  className="group bg-white border border-black/10 rounded-sm overflow-hidden flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  {/* Image Presentation (65-75% visual weight) */}
                  <div className="relative aspect-[3/4] bg-[#F2EFE9] overflow-hidden">
                    {!imgErrors[product.id] ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        referrerPolicy="no-referrer"
                        onError={() => handleImgError(product.id)}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300 p-6 text-center">
                        <ShoppingBag className="w-10 h-10 text-stone-400 mb-2" />
                        <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                          {product.name}
                        </span>
                      </div>
                    )}

                    {/* Top Row Indicators: Tag & Action Buttons (Wishlist & Compare) */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      {product.tag ? (
                        <span className="text-[10px] font-extrabold uppercase tracking-widest bg-black/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-sm pointer-events-auto">
                          {product.tag}
                        </span>
                      ) : (
                        <div />
                      )}

                      <div className="flex items-center gap-1.5 pointer-events-auto">
                        {onToggleCompare && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleCompare(product.id);
                            }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition hover:scale-110 cursor-pointer ${
                              isCompared
                                ? 'bg-[#FF5757] text-white shadow-md shadow-[#FF5757]/30 ring-2 ring-white'
                                : 'bg-white/90 hover:bg-white text-black'
                            }`}
                            aria-label={isCompared ? 'Remove from comparison' : 'Compare product'}
                            title={isCompared ? 'In comparison (click to remove)' : 'Add to side-by-side comparison'}
                          >
                            <ArrowLeftRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(product.id);
                          }}
                          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-black flex items-center justify-center shadow-sm transition hover:scale-110 cursor-pointer"
                          aria-label="Add to wishlist"
                          title="Save to wishlist"
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              isWishlisted ? 'fill-[#FF5757] text-[#FF5757]' : 'text-black/80'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Delivery ETA Chip */}
                    <div className="absolute bottom-3 left-3 bg-[#111111]/90 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-sm flex items-center gap-1.5 shadow-sm">
                      <Zap className="w-3 h-3 text-[#FF5757] fill-[#FF5757]" />
                      <span>{product.estDeliveryMins} mins away</span>
                    </div>

                    {/* Quick View Floating Button */}
                    <button
                      onClick={() => onQuickView(product)}
                      className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-black p-2 rounded-sm shadow-md transition hover:scale-105 cursor-pointer flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider"
                      title="Quick View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Details</span>
                    </button>
                  </div>

                  {/* Product Card Details */}
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Clean Metadata */}
                      <div className="flex items-center gap-2 text-[11px] text-black/50 uppercase tracking-widest font-semibold mb-1">
                        <span>{product.categoryLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span>{product.gender}</span>
                      </div>

                      {/* Product Title */}
                      <h3
                        onClick={() => onQuickView(product)}
                        className="text-base font-bold text-[#1a1a1a] hover:text-[#FF5757] transition-colors cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      {/* Rating & Fabric Teaser */}
                      <div className="flex items-center gap-2 mt-1 text-xs text-black/60">
                        <div className="flex items-center text-amber-500">
                          <Star className="w-3 h-3 fill-amber-500" />
                          <span className="ml-1 text-[11px] font-bold text-black tabular-nums">
                            {product.rating}
                          </span>
                        </div>
                        <span aria-hidden="true" className="text-black/30">·</span>
                        <span className="text-[11px] text-black/60 truncate max-w-[180px]">
                          {product.fabric}
                        </span>
                      </div>
                    </div>

                    {/* Size Selector Strip */}
                    <div className="mt-4 pt-3 border-t border-black/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-black/50">
                          Select Size:
                        </span>
                        <span className="text-[10px] font-bold text-black uppercase">
                          {currentSize}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {product.sizes.map((sz) => (
                          <button
                            key={sz}
                            onClick={() => setProductSize(product.id, sz)}
                            className={`py-1 text-xs font-bold rounded-xs transition-colors cursor-pointer ${
                              currentSize === sz
                                ? 'bg-black text-white'
                                : 'bg-black/5 text-black/70 hover:bg-black/10'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price & Add to Bag CTA */}
                    <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-black text-[#1a1a1a] tabular-nums">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-black/40 line-through tabular-nums">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-emerald-700 font-semibold block">
                          Instant dispatch ready
                        </span>
                      </div>

                      <button
                        onClick={() => onAddToCart(product, currentSize, product.colors[0])}
                        className="bg-[#1a1a1a] hover:bg-[#FF5757] text-white px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-150 cursor-pointer active:scale-95 shadow-sm"
                        aria-label={`Add ${product.name} to bag`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
