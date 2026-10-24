import React, { useState } from 'react';
import { Product } from '../data/products';
import { Heart, Eye, ShoppingBag, Zap, Star, Filter, ArrowUpDown, ArrowLeftRight } from 'lucide-react';

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
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'delivery'>('featured');
  const [selectedSizes, setSelectedSizes] = useState<{ [productId: string]: string }>({});
  const [imgErrors, setImgErrors] = useState<{ [id: string]: boolean }>({});

  const handleImgError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

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
    // Search match
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

  return (
    <section id="catalog" className="py-20 bg-[#FAF8F2] border-t border-black/10">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-black/10">
          <div>
            <div className="inline-flex items-center gap-2 text-[#FF5757] text-xs font-bold uppercase tracking-[0.3em] mb-2">
              <Zap className="w-3.5 h-3.5 fill-[#FF5757]" />
              <span>Instant Wardrobe Dispatch</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-fashion tracking-tight text-[#1a1a1a]">
              CURATED DROPS
            </h2>
            <p className="text-xs text-black/60 mt-1">
              Guaranteed delivery in 10 minutes or less directly to your location.
            </p>
          </div>

          {/* Compare Shortcut & Sort Controller */}
          <div className="flex items-center gap-3">
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

            <span className="text-xs uppercase tracking-wider text-black/60 font-semibold flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-black/15 text-xs font-semibold px-3 py-2 rounded-sm outline-none cursor-pointer focus:border-[#FF5757]"
            >
              <option value="featured">Featured Drops</option>
              <option value="delivery">⚡ Fastest Delivery</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
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
          <div className="py-20 text-center bg-white rounded-sm border border-black/10 p-8">
            <Filter className="w-8 h-8 text-black/30 mx-auto mb-3" />
            <h3 className="text-lg font-bold font-fashion text-[#1a1a1a]">No matching pieces found</h3>
            <p className="text-xs text-black/60 mt-1 max-w-sm mx-auto">
              Try adjusting your category or clearing search filters to see all available drops.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveGender('all');
              }}
              className="mt-4 px-5 py-2 bg-[#1a1a1a] text-white text-xs font-bold uppercase rounded-sm hover:bg-[#FF5757] transition"
            >
              Reset Filters
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
                      {/* Zero-Pill Clean Metadata */}
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
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-black/40 line-through tabular-nums">
                              ${product.originalPrice}
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
