import React, { useMemo } from 'react';
import { Product } from '../data/products';
import { TrendingUp, Zap, Sparkles, ArrowRight, Tag, Clock } from 'lucide-react';

interface TrendingSearchesDropdownProps {
  isOpen: boolean;
  searchQuery: string;
  onSelectQuery: (query: string) => void;
  onSelectCategory: (category: 'all' | 'urban-street' | 'minimalist-zen' | 'unique-trends') => void;
  onSelectProduct?: (product: Product) => void;
  products: Product[];
  onClose: () => void;
}

const POPULAR_SEARCH_TERMS = [
  'Heavyweight Hoodie',
  'Technical Cargo',
  'Runway Coat',
  'Cashmere Mockneck',
  'Chrome Bomber',
  'Pleated Wide Pant',
  'Kinetic Dress',
];

const CATEGORY_META = [
  {
    id: 'urban-street' as const,
    label: 'Urban Street',
    tagline: 'Oversized silhouettes & raw hardware',
    accentColor: '#FF5757',
  },
  {
    id: 'minimalist-zen' as const,
    label: 'Minimalist Zen',
    tagline: 'Compact poplin & organic drape',
    accentColor: '#E5B869',
  },
  {
    id: 'unique-trends' as const,
    label: 'Unique Trends',
    tagline: 'Avant-garde cuts & kinetic tailoring',
    accentColor: '#9333EA',
  },
];

export const TrendingSearchesDropdown: React.FC<TrendingSearchesDropdownProps> = ({
  isOpen,
  searchQuery,
  onSelectQuery,
  onSelectCategory,
  onSelectProduct,
  products,
  onClose,
}) => {
  if (!isOpen) return null;

  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Filter matching categories in real-time
  const matchingCategories = useMemo(() => {
    if (!normalizedQuery) return CATEGORY_META;
    return CATEGORY_META.filter(
      (cat) =>
        cat.label.toLowerCase().includes(normalizedQuery) ||
        cat.tagline.toLowerCase().includes(normalizedQuery) ||
        cat.id.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  // Filter matching products in real-time
  const matchingProducts = useMemo(() => {
    if (!normalizedQuery) {
      // When query is empty, show top 3 trending / new drop items
      return products.slice(0, 3);
    }
    return products
      .filter((p) => {
        return (
          p.name.toLowerCase().includes(normalizedQuery) ||
          p.categoryLabel.toLowerCase().includes(normalizedQuery) ||
          p.fabric.toLowerCase().includes(normalizedQuery) ||
          p.fit.toLowerCase().includes(normalizedQuery) ||
          p.description.toLowerCase().includes(normalizedQuery)
        );
      })
      .slice(0, 4);
  }, [normalizedQuery, products]);

  // Matching search keywords
  const matchingKeywords = useMemo(() => {
    if (!normalizedQuery) return POPULAR_SEARCH_TERMS;
    return POPULAR_SEARCH_TERMS.filter((term) =>
      term.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const handleCategoryClick = (categoryId: 'urban-street' | 'minimalist-zen' | 'unique-trends') => {
    onSelectCategory(categoryId);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
    onClose();
  };

  const handleProductClick = (product: Product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      onSelectQuery(product.name);
      const catalogEl = document.getElementById('catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
    onClose();
  };

  const handleTermClick = (term: string) => {
    onSelectQuery(term);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
    onClose();
  };

  return (
    <div
      role="region"
      aria-label="Trending Searches & Real-time Suggestions"
      className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border-b border-x border-black/15 shadow-2xl rounded-b-sm overflow-hidden animate-fadeIn"
    >
      <div className="container mx-auto px-6 py-5 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Trending Keywords & Categories */}
          <div className="md:col-span-5 space-y-5 border-b md:border-b-0 md:border-r border-black/10 pb-5 md:pb-0 md:pr-6">
            {/* Trending Keywords */}
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#FF5757] mb-2.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{normalizedQuery ? 'Suggested Keywords' : 'Trending Searches'}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matchingKeywords.length > 0 ? (
                  matchingKeywords.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleTermClick(term)}
                      className="px-2.5 py-1 text-xs bg-[#FAF8F2] hover:bg-[#111111] hover:text-white border border-black/10 rounded-xs text-black/80 font-medium transition-all flex items-center gap-1 cursor-pointer group"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-[#FF5757] group-hover:text-white" />
                      <span>{term}</span>
                    </button>
                  ))
                ) : (
                  <button
                    type="button"
                    onClick={() => handleTermClick(searchQuery)}
                    className="px-2.5 py-1 text-xs bg-[#FAF8F2] hover:bg-[#111111] hover:text-white border border-black/10 rounded-xs text-black/80 font-medium transition cursor-pointer"
                  >
                    Search for "{searchQuery}"
                  </button>
                )}
              </div>
            </div>

            {/* Suggested Categories */}
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-black/50 mb-2.5">
                <Tag className="w-3.5 h-3.5" />
                <span>Popular Categories</span>
              </div>
              <div className="space-y-1.5">
                {matchingCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryClick(cat.id)}
                    className="w-full text-left p-2 rounded-xs hover:bg-[#FAF8F2] border border-transparent hover:border-black/10 transition flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <span className="text-xs font-bold text-[#1a1a1a] group-hover:text-[#FF5757] transition-colors">
                        {cat.label}
                      </span>
                      <p className="text-[10px] text-black/50 font-light">{cat.tagline}</p>
                    </div>
                    <ArrowRight className="w-3 h-3 text-black/30 group-hover:text-[#FF5757] group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Suggested Products */}
          <div className="md:col-span-7">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-black/50">
                <Zap className="w-3.5 h-3.5 text-[#FF5757]" />
                <span>
                  {normalizedQuery ? `Matching Garments (${matchingProducts.length})` : 'Popular Drops'}
                </span>
              </div>
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" /> 10-Min Dispatch
              </span>
            </div>

            {matchingProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {matchingProducts.map((prod) => (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => handleProductClick(prod)}
                    className="text-left p-2 rounded-xs bg-[#FAF8F2]/60 hover:bg-[#FAF8F2] border border-black/10 hover:border-[#FF5757]/40 transition flex items-center gap-3 group cursor-pointer"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-12 h-14 object-cover rounded-xs bg-stone-200 shrink-0 group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-[#FF5757] block truncate">
                        {prod.categoryLabel}
                      </span>
                      <h4 className="text-xs font-bold text-[#1a1a1a] truncate group-hover:text-[#FF5757] transition-colors">
                        {prod.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-black text-black tabular-nums">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </span>
                        {prod.originalPrice && (
                          <span className="text-[10px] text-black/40 line-through tabular-nums">
                            ₹{prod.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                        <span className="text-[9px] text-emerald-600 font-semibold ml-auto">
                          ~{prod.estDeliveryMins}m
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-[#FAF8F2] rounded-xs border border-black/10">
                <p className="text-xs font-medium text-black/70">
                  No garments matching "<span className="font-bold text-black">{searchQuery}</span>"
                </p>
                <p className="text-[11px] text-black/50 mt-1">
                  Try searching for <span className="font-semibold text-black">"Hoodie"</span>, <span className="font-semibold text-black">"Cargo"</span>, or browse our curated categories.
                </p>
                <button
                  type="button"
                  onClick={() => onSelectQuery('')}
                  className="mt-3 text-xs font-bold text-[#FF5757] hover:underline"
                >
                  Clear search query
                </button>
              </div>
            )}

            {/* Bottom Direct CTA */}
            {normalizedQuery && (
              <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs">
                <span className="text-black/50 text-[11px]">
                  Press <kbd className="px-1.5 py-0.5 bg-black/5 border border-black/20 rounded text-[10px] font-mono">Enter</kbd> to view full catalog results
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const catalogEl = document.getElementById('catalog');
                    if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                    onClose();
                  }}
                  className="text-xs font-bold text-black hover:text-[#FF5757] inline-flex items-center gap-1 transition"
                >
                  <span>Explore Results in Drops & Shop</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
