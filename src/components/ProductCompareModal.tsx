import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../data/products';
import { 
  X, 
  ArrowLeftRight, 
  Star, 
  Zap, 
  ShoppingBag, 
  Heart, 
  Check, 
  Sparkles, 
  Layers, 
  RotateCcw, 
  Plus, 
  TrendingUp,
  ShieldCheck,
  Tag,
  ChevronDown,
  Search,
  Eye
} from 'lucide-react';

export interface ProductCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  compareProductIds: string[];
  onSelectProduct: (slot: 'left' | 'right', productId: string) => void;
  onSwapProducts: () => void;
  onClearCompare: () => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  isOpen,
  onClose,
  products,
  compareProductIds,
  onSelectProduct,
  onSwapProducts,
  onClearCompare,
  onAddToCart,
  wishlist,
  onToggleWishlist,
  onQuickView,
}) => {
  const [selectedLeftSize, setSelectedLeftSize] = useState<string>('');
  const [selectedRightSize, setSelectedRightSize] = useState<string>('');
  const [leftSearch, setLeftSearch] = useState('');
  const [rightSearch, setRightSearch] = useState('');
  const [isPickingLeft, setIsPickingLeft] = useState(false);
  const [isPickingRight, setIsPickingRight] = useState(false);
  const [addedLeftNotice, setAddedLeftNotice] = useState(false);
  const [addedRightNotice, setAddedRightNotice] = useState(false);

  const leftProduct = useMemo(
    () => products.find((p) => p.id === compareProductIds[0]) || null,
    [products, compareProductIds]
  );

  const rightProduct = useMemo(
    () => products.find((p) => p.id === compareProductIds[1]) || null,
    [products, compareProductIds]
  );

  // Default size selection when products change
  useEffect(() => {
    if (leftProduct && (!selectedLeftSize || !leftProduct.sizes.includes(selectedLeftSize))) {
      setSelectedLeftSize(leftProduct.sizes[0] || 'M');
    }
  }, [leftProduct, selectedLeftSize]);

  useEffect(() => {
    if (rightProduct && (!selectedRightSize || !rightProduct.sizes.includes(selectedRightSize))) {
      setSelectedRightSize(rightProduct.sizes[0] || 'M');
    }
  }, [rightProduct, selectedRightSize]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPickingLeft) {
          setIsPickingLeft(false);
        } else if (isPickingRight) {
          setIsPickingRight(false);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPickingLeft, isPickingRight, onClose]);

  if (!isOpen) return null;

  // Filter products for dropdown pickers
  const filteredLeftList = products.filter(
    (p) =>
      p.id !== rightProduct?.id &&
      (p.name.toLowerCase().includes(leftSearch.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(leftSearch.toLowerCase()) ||
        p.fabric.toLowerCase().includes(leftSearch.toLowerCase()))
  );

  const filteredRightList = products.filter(
    (p) =>
      p.id !== leftProduct?.id &&
      (p.name.toLowerCase().includes(rightSearch.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(rightSearch.toLowerCase()) ||
        p.fabric.toLowerCase().includes(rightSearch.toLowerCase()))
  );

  // Recommendations for second item if only 1 is selected
  const suggestedProducts = products.filter((p) => {
    if (leftProduct && p.id === leftProduct.id) return false;
    if (rightProduct && p.id === rightProduct.id) return false;
    return true;
  });

  const handleAddLeft = () => {
    if (!leftProduct) return;
    onAddToCart(leftProduct, selectedLeftSize, leftProduct.colors[0]);
    setAddedLeftNotice(true);
    setTimeout(() => setAddedLeftNotice(false), 2200);
  };

  const handleAddRight = () => {
    if (!rightProduct) return;
    onAddToCart(rightProduct, selectedRightSize, rightProduct.colors[0]);
    setAddedRightNotice(true);
    setTimeout(() => setAddedRightNotice(false), 2200);
  };

  // Metrics analysis
  const priceDiff = leftProduct && rightProduct ? Math.abs(leftProduct.price - rightProduct.price) : 0;
  const cheaperProduct =
    leftProduct && rightProduct
      ? leftProduct.price < rightProduct.price
        ? 'left'
        : leftProduct.price > rightProduct.price
        ? 'right'
        : 'tie'
      : null;

  const fasterProduct =
    leftProduct && rightProduct
      ? leftProduct.estDeliveryMins < rightProduct.estDeliveryMins
        ? 'left'
        : leftProduct.estDeliveryMins > rightProduct.estDeliveryMins
        ? 'right'
        : 'tie'
      : null;

  const higherRatedProduct =
    leftProduct && rightProduct
      ? leftProduct.rating > rightProduct.rating
        ? 'left'
        : leftProduct.rating < rightProduct.rating
        ? 'right'
        : 'tie'
      : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#0e0e11] text-stone-100 max-w-5xl w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER BAR */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#141418] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5757]/15 border border-[#FF5757]/30 flex items-center justify-center text-[#FF5757] shrink-0">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h2 id="compare-modal-title" className="text-sm sm:text-base font-black uppercase tracking-wider text-white font-fashion flex items-center gap-2">
                <span>Side-by-Side Product Comparison</span>
                <span className="hidden sm:inline-block text-[10px] bg-white/10 text-stone-300 px-2 py-0.5 rounded font-mono font-normal">
                  2 Items Max
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-400">
                Detailed specs, fabric weight, price deltas, and delivery SLA comparison
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {leftProduct && rightProduct && (
              <button
                onClick={onSwapProducts}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition cursor-pointer"
                title="Swap Product Positions"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-[#FF5757]" />
                <span className="hidden sm:inline">Swap Sides</span>
              </button>
            )}

            {(leftProduct || rightProduct) && (
              <button
                onClick={onClearCompare}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition cursor-pointer"
                title="Reset Comparison"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition border border-white/10 cursor-pointer"
              aria-label="Close comparison modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* COMPARISON BODY: SCROLLABLE VIEWPORT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-stone-800">
          
          {/* PRODUCT SELECTION SLOTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* SLOT LEFT */}
            <div className="p-4 rounded-xl bg-[#141418] border border-white/10 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  Item A (Left Slot)
                </span>
                <button
                  onClick={() => setIsPickingLeft(!isPickingLeft)}
                  className="text-xs text-[#FF5757] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>{leftProduct ? 'Change Item' : 'Select Product'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isPickingLeft ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Dropdown Selector for Slot Left */}
              {isPickingLeft && (
                <div className="mb-4 p-3 rounded-lg bg-black/80 border border-white/10 space-y-2 animate-fadeIn">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search catalogue..."
                      value={leftSearch}
                      onChange={(e) => setLeftSearch(e.target.value)}
                      className="w-full bg-stone-900 border border-white/10 rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#FF5757]"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-stone-700">
                    {filteredLeftList.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectProduct('left', item.id);
                          setIsPickingLeft(false);
                          setLeftSearch('');
                        }}
                        className={`w-full text-left p-2 rounded flex items-center gap-2.5 transition text-xs ${
                          leftProduct?.id === item.id ? 'bg-[#FF5757]/20 text-white font-bold' : 'hover:bg-white/5 text-stone-300'
                        }`}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-7 h-7 object-cover rounded shrink-0 bg-stone-800"
                          referrerPolicy="no-referrer"
                        />
                        <div className="truncate flex-1">
                          <p className="truncate font-semibold">{item.name}</p>
                          <p className="text-[10px] text-stone-400">{item.categoryLabel} · ${item.price}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {leftProduct ? (
                <div className="space-y-4">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-stone-900 group">
                    <img
                      src={leftProduct.image}
                      alt={leftProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      {leftProduct.tag && (
                        <span className="text-[9px] font-black uppercase tracking-widest bg-black/80 backdrop-blur-sm text-white px-2 py-0.5 rounded">
                          {leftProduct.tag}
                        </span>
                      )}
                      {leftProduct.isNewDrop && (
                        <span className="text-[9px] font-black uppercase tracking-widest bg-[#FF5757] text-white px-2 py-0.5 rounded">
                          NEW DROP
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => onToggleWishlist(leftProduct.id)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition cursor-pointer"
                      title="Save to Wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          wishlist.includes(leftProduct.id) ? 'fill-[#FF5757] text-[#FF5757]' : 'text-white'
                        }`}
                      />
                    </button>
                    <div className="absolute bottom-2.5 left-2.5 bg-black/80 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                      <Zap className="w-3 h-3 text-[#FF5757] fill-[#FF5757]" />
                      <span>{leftProduct.estDeliveryMins} mins SLA</span>
                    </div>
                    {onQuickView && (
                      <button
                        onClick={() => onQuickView(leftProduct)}
                        className="absolute bottom-2.5 right-2.5 bg-white/90 hover:bg-white text-black text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition shadow"
                        title="View Full Item Details"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Quick View</span>
                      </button>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                      {leftProduct.categoryLabel} · {leftProduct.gender}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5 line-clamp-1">{leftProduct.name}</h3>
                    <div className="flex items-baseline gap-2.5 mt-1.5">
                      <span className="text-xl font-black text-white tabular-nums">₹{leftProduct.price.toLocaleString('en-IN')}</span>
                      {leftProduct.originalPrice && (
                        <span className="text-xs text-stone-500 line-through tabular-nums">₹{leftProduct.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                      {leftProduct.originalPrice && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          Save ₹{(leftProduct.originalPrice - leftProduct.price).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Size selection & Add to Bag directly from comparison */}
                  <div className="pt-3 border-t border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] text-stone-400">Select Size:</span>
                      <span className="font-bold text-white uppercase text-xs">{selectedLeftSize}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {leftProduct.sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedLeftSize(sz)}
                          className={`py-1 text-xs font-bold rounded transition cursor-pointer ${
                            selectedLeftSize === sz
                              ? 'bg-white text-black'
                              : 'bg-white/5 hover:bg-white/10 text-stone-300'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleAddLeft}
                      className="w-full py-2.5 bg-[#1a1a1e] hover:bg-[#FF5757] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition cursor-pointer shadow active:scale-98 border border-white/10"
                    >
                      {addedLeftNotice ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Added to Bag!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Bag — ₹{leftProduct.price.toLocaleString('en-IN')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-stone-400">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Choose Left Product</p>
                    <p className="text-[11px] text-stone-400">Select an item to begin comparing</p>
                  </div>
                  <button
                    onClick={() => setIsPickingLeft(true)}
                    className="px-4 py-1.5 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold rounded-lg transition cursor-pointer shadow"
                  >
                    Browse Catalog
                  </button>
                </div>
              )}
            </div>

            {/* SLOT RIGHT */}
            <div className="p-4 rounded-xl bg-[#141418] border border-white/10 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  Item B (Right Slot)
                </span>
                <button
                  onClick={() => setIsPickingRight(!isPickingRight)}
                  className="text-xs text-[#FF5757] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>{rightProduct ? 'Change Item' : 'Select Product'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isPickingRight ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Dropdown Selector for Slot Right */}
              {isPickingRight && (
                <div className="mb-4 p-3 rounded-lg bg-black/80 border border-white/10 space-y-2 animate-fadeIn">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search catalogue..."
                      value={rightSearch}
                      onChange={(e) => setRightSearch(e.target.value)}
                      className="w-full bg-stone-900 border border-white/10 rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#FF5757]"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-stone-700">
                    {filteredRightList.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectProduct('right', item.id);
                          setIsPickingRight(false);
                          setRightSearch('');
                        }}
                        className={`w-full text-left p-2 rounded flex items-center gap-2.5 transition text-xs ${
                          rightProduct?.id === item.id ? 'bg-[#FF5757]/20 text-white font-bold' : 'hover:bg-white/5 text-stone-300'
                        }`}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-7 h-7 object-cover rounded shrink-0 bg-stone-800"
                          referrerPolicy="no-referrer"
                        />
                        <div className="truncate flex-1">
                          <p className="truncate font-semibold">{item.name}</p>
                          <p className="text-[10px] text-stone-400">{item.categoryLabel} · ${item.price}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {rightProduct ? (
                <div className="space-y-4">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-stone-900 group">
                    <img
                      src={rightProduct.image}
                      alt={rightProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      {rightProduct.tag && (
                        <span className="text-[9px] font-black uppercase tracking-widest bg-black/80 backdrop-blur-sm text-white px-2 py-0.5 rounded">
                          {rightProduct.tag}
                        </span>
                      )}
                      {rightProduct.isNewDrop && (
                        <span className="text-[9px] font-black uppercase tracking-widest bg-[#FF5757] text-white px-2 py-0.5 rounded">
                          NEW DROP
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => onToggleWishlist(rightProduct.id)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition cursor-pointer"
                      title="Save to Wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          wishlist.includes(rightProduct.id) ? 'fill-[#FF5757] text-[#FF5757]' : 'text-white'
                        }`}
                      />
                    </button>
                    <div className="absolute bottom-2.5 left-2.5 bg-black/80 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                      <Zap className="w-3 h-3 text-[#FF5757] fill-[#FF5757]" />
                      <span>{rightProduct.estDeliveryMins} mins SLA</span>
                    </div>
                    {onQuickView && (
                      <button
                        onClick={() => onQuickView(rightProduct)}
                        className="absolute bottom-2.5 right-2.5 bg-white/90 hover:bg-white text-black text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition shadow"
                        title="View Full Item Details"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Quick View</span>
                      </button>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                      {rightProduct.categoryLabel} · {rightProduct.gender}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5 line-clamp-1">{rightProduct.name}</h3>
                    <div className="flex items-baseline gap-2.5 mt-1.5">
                      <span className="text-xl font-black text-white tabular-nums">₹{rightProduct.price.toLocaleString('en-IN')}</span>
                      {rightProduct.originalPrice && (
                        <span className="text-xs text-stone-500 line-through tabular-nums">₹{rightProduct.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                      {rightProduct.originalPrice && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          Save ₹{(rightProduct.originalPrice - rightProduct.price).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Size selection & Add to Bag directly from comparison */}
                  <div className="pt-3 border-t border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] text-stone-400">Select Size:</span>
                      <span className="font-bold text-white uppercase text-xs">{selectedRightSize}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {rightProduct.sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedRightSize(sz)}
                          className={`py-1 text-xs font-bold rounded transition cursor-pointer ${
                            selectedRightSize === sz
                              ? 'bg-white text-black'
                              : 'bg-white/5 hover:bg-white/10 text-stone-300'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleAddRight}
                      className="w-full py-2.5 bg-[#1a1a1e] hover:bg-[#FF5757] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition cursor-pointer shadow active:scale-98 border border-white/10"
                    >
                      {addedRightNotice ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Added to Bag!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Bag — ₹{rightProduct.price.toLocaleString('en-IN')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-stone-400">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Choose Right Product</p>
                    <p className="text-[11px] text-stone-400">Select a second product to compare side-by-side</p>
                  </div>

                  {/* Quick-Pick Recommended Items */}
                  <div className="w-full pt-1 space-y-2">
                    <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Quick Suggestions</p>
                    <div className="grid grid-cols-2 gap-2 text-left">
                      {suggestedProducts.slice(0, 4).map((sugg) => (
                        <button
                          key={sugg.id}
                          onClick={() => onSelectProduct('right', sugg.id)}
                          className="p-2 rounded bg-black/40 hover:bg-white/10 border border-white/5 flex items-center gap-2 transition text-left cursor-pointer"
                        >
                          <img
                            src={sugg.image}
                            alt={sugg.name}
                            className="w-8 h-8 rounded object-cover shrink-0 bg-stone-800"
                            referrerPolicy="no-referrer"
                          />
                          <div className="truncate">
                            <p className="text-[11px] font-semibold text-white truncate">{sugg.name}</p>
                            <p className="text-[10px] text-stone-400 tabular-nums">${sugg.price}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* DELTA SUMMARY BANNER (When both are selected) */}
          {leftProduct && rightProduct && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-stone-900 via-[#18181d] to-stone-900 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-300">
                <span className="flex items-center gap-1.5 text-white">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Key Matchup Highlights</span>
                </span>
                <span className="text-[11px] text-stone-400 font-mono">
                  Price Delta: ${priceDiff}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Price Verdict */}
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-medium">Price Comparison</span>
                    <span className="font-bold text-white">
                      {cheaperProduct === 'tie'
                        ? 'Identical Price Point'
                        : cheaperProduct === 'left'
                        ? `${leftProduct.name.split(' ')[0]} is $${priceDiff} less`
                        : `${rightProduct.name.split(' ')[0]} is $${priceDiff} less`}
                    </span>
                  </div>
                  <Tag className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>

                {/* Rating Verdict */}
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-medium">Customer Rating</span>
                    <span className="font-bold text-white">
                      {higherRatedProduct === 'tie'
                        ? `Tied at ${leftProduct.rating} ★`
                        : higherRatedProduct === 'left'
                        ? `${leftProduct.name.split(' ')[0]} (${leftProduct.rating} ★)`
                        : `${rightProduct.name.split(' ')[0]} (${rightProduct.rating} ★)`}
                    </span>
                  </div>
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                </div>

                {/* Speed Verdict */}
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-medium">Delivery Speed</span>
                    <span className="font-bold text-white">
                      {fasterProduct === 'tie'
                        ? `Both ${leftProduct.estDeliveryMins} Mins`
                        : fasterProduct === 'left'
                        ? `${leftProduct.name.split(' ')[0]} (${leftProduct.estDeliveryMins} mins)`
                        : `${rightProduct.name.split(' ')[0]} (${rightProduct.estDeliveryMins} mins)`}
                    </span>
                  </div>
                  <Zap className="w-4 h-4 text-[#FF5757] fill-[#FF5757] shrink-0" />
                </div>
              </div>
            </div>
          )}

          {/* DETAILED SPECIFICATIONS COMPARISON TABLE */}
          <div className="rounded-xl border border-white/10 overflow-hidden bg-[#141418]">
            <div className="p-3.5 bg-black/40 border-b border-white/10 font-bold text-xs uppercase tracking-wider text-stone-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FF5757]" />
              <span>Full Specifications & Design Matrix</span>
            </div>

            <div className="divide-y divide-white/5 text-xs">
              
              {/* Row 1: Price & Value */}
              <div className="grid grid-cols-3 p-3.5 hover:bg-white/[0.02] transition items-center">
                <span className="text-stone-400 font-semibold text-[11px] uppercase tracking-wider">
                  Retail Price & Value
                </span>
                <div className="text-stone-200">
                  {leftProduct ? (
                    <div>
                      <span className="text-sm font-bold text-white tabular-nums">₹{leftProduct.price.toLocaleString('en-IN')}</span>
                      {leftProduct.originalPrice && (
                        <span className="text-[11px] text-stone-500 line-through ml-2 tabular-nums">
                          ₹{leftProduct.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-stone-600">—</span>
                  )}
                </div>
                <div className="text-stone-200">
                  {rightProduct ? (
                    <div>
                      <span className="text-sm font-bold text-white tabular-nums">₹{rightProduct.price.toLocaleString('en-IN')}</span>
                      {rightProduct.originalPrice && (
                        <span className="text-[11px] text-stone-500 line-through ml-2 tabular-nums">
                          ₹{rightProduct.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-stone-600">—</span>
                  )}
                </div>
              </div>

              {/* Row 2: Customer Rating & Reviews */}
              <div className="grid grid-cols-3 p-3.5 hover:bg-white/[0.02] transition items-center">
                <span className="text-stone-400 font-semibold text-[11px] uppercase tracking-wider">
                  Rating & Reviews
                </span>
                <div className="text-stone-200">
                  {leftProduct ? (
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-white tabular-nums">{leftProduct.rating}</span>
                      <span className="text-stone-400 text-[11px]">({leftProduct.reviewsCount} verified reviews)</span>
                    </div>
                  ) : (
                    <span className="text-stone-600">—</span>
                  )}
                </div>
                <div className="text-stone-200">
                  {rightProduct ? (
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-white tabular-nums">{rightProduct.rating}</span>
                      <span className="text-stone-400 text-[11px]">({rightProduct.reviewsCount} verified reviews)</span>
                    </div>
                  ) : (
                    <span className="text-stone-600">—</span>
                  )}
                </div>
              </div>

              {/* Row 3: Guaranteed Instant Delivery SLA */}
              <div className="grid grid-cols-3 p-3.5 hover:bg-white/[0.02] transition items-center">
                <span className="text-stone-400 font-semibold text-[11px] uppercase tracking-wider">
                  Courier Delivery SLA
                </span>
                <div className="text-stone-200">
                  {leftProduct ? (
                    <div className="flex items-center gap-1.5 text-white font-medium">
                      <Zap className="w-3.5 h-3.5 text-[#FF5757] fill-[#FF5757]" />
                      <span>{leftProduct.estDeliveryMins} Minutes Guaranteed</span>
                    </div>
                  ) : (
                    <span className="text-stone-600">—</span>
                  )}
                </div>
                <div className="text-stone-200">
                  {rightProduct ? (
                    <div className="flex items-center gap-1.5 text-white font-medium">
                      <Zap className="w-3.5 h-3.5 text-[#FF5757] fill-[#FF5757]" />
                      <span>{rightProduct.estDeliveryMins} Minutes Guaranteed</span>
                    </div>
                  ) : (
                    <span className="text-stone-600">—</span>
                  )}
                </div>
              </div>

              {/* Row 4: Fabric & Material Weight (Specs) */}
              <div className="grid grid-cols-3 p-3.5 hover:bg-white/[0.02] transition items-start">
                <span className="text-stone-400 font-semibold text-[11px] uppercase tracking-wider">
                  Fabric & Material
                </span>
                <div className="text-stone-200 pr-2">
                  {leftProduct ? (
                    <div className="space-y-1">
                      <p className="font-semibold text-white">{leftProduct.fabric}</p>
                      <p className="text-[11px] text-stone-400">Pre-washed, anti-pilling, premium luxury weave</p>
                    </div>
                  ) : (
                    <span className="text-stone-600">—</span>
                  )}
                </div>
                <div className="text-stone-200 pr-2">
                  {rightProduct ? (
                    <div className="space-y-1">
                      <p className="font-semibold text-white">{rightProduct.fabric}</p>
                      <p className="text-[11px] text-stone-400">Pre-washed, anti-pilling, premium luxury weave</p>
                    </div>
                  ) : (
                    <span className="text-stone-600">—</span>
                  )}
                </div>
              </div>

              {/* Row 5: Silhouette & Fit Profile */}
              <div className="grid grid-cols-3 p-3.5 hover:bg-white/[0.02] transition items-center">
                <span className="text-stone-400 font-semibold text-[11px] uppercase tracking-wider">
                  Silhouette & Cut
                </span>
                <div className="text-stone-200">
                  {leftProduct ? (
                    <span className="font-medium text-white bg-white/5 px-2.5 py-1 rounded inline-block">
                      {leftProduct.fit}
                    </span>
                  ) : (
                    <span className="text-stone-600">—</span>
                  )}
                </div>
                <div className="text-stone-200">
                  {rightProduct ? (
                    <span className="font-medium text-white bg-white/5 px-2.5 py-1 rounded inline-block">
                      {rightProduct.fit}
                    </span>
                  ) : (
                    <span className="text-stone-600">—</span>
                  )}
                </div>
              </div>

              {/* Row 6: Sizing Spectrum */}
              <div className="grid grid-cols-3 p-3.5 hover:bg-white/[0.02] transition items-center">
                <span className="text-stone-400 font-semibold text-[11px] uppercase tracking-wider">
                  Available Sizes
                </span>
                <div className="text-stone-200">
                  {leftProduct ? (
                    <div className="flex flex-wrap gap-1">
                      {leftProduct.sizes.map((sz) => (
                        <span key={sz} className="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] font-mono text-stone-300">
                          {sz}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-stone-600">—</span>
                  )}
                </div>
                <div className="text-stone-200">
                  {rightProduct ? (
                    <div className="flex flex-wrap gap-1">
                      {rightProduct.sizes.map((sz) => (
                        <span key={sz} className="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] font-mono text-stone-300">
                          {sz}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-stone-600">—</span>
                  )}
                </div>
              </div>

              {/* Row 7: Colorway Palette */}
              <div className="grid grid-cols-3 p-3.5 hover:bg-white/[0.02] transition items-center">
                <span className="text-stone-400 font-semibold text-[11px] uppercase tracking-wider">
                  Colorways & Tones
                </span>
                <div className="text-stone-200">
                  {leftProduct ? (
                    <div className="flex items-center gap-2">
                      {leftProduct.colors.map((c) => (
                        <div key={c.name} className="flex items-center gap-1.5" title={c.name}>
                          <span
                            className="w-4 h-4 rounded-full border border-white/20 inline-block shadow-sm"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-[10px] text-stone-400 hidden sm:inline">{c.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-stone-600">—</span>
                  )}
                </div>
                <div className="text-stone-200">
                  {rightProduct ? (
                    <div className="flex items-center gap-2">
                      {rightProduct.colors.map((c) => (
                        <div key={c.name} className="flex items-center gap-1.5" title={c.name}>
                          <span
                            className="w-4 h-4 rounded-full border border-white/20 inline-block shadow-sm"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-[10px] text-stone-400 hidden sm:inline">{c.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-stone-600">—</span>
                  )}
                </div>
              </div>

              {/* Row 8: Description & Design Story */}
              <div className="grid grid-cols-3 p-3.5 hover:bg-white/[0.02] transition items-start">
                <span className="text-stone-400 font-semibold text-[11px] uppercase tracking-wider">
                  Design Narrative
                </span>
                <div className="text-stone-300 pr-3">
                  {leftProduct ? (
                    <p className="text-xs leading-relaxed text-stone-300 line-clamp-3">
                      {leftProduct.description}
                    </p>
                  ) : (
                    <span className="text-stone-600">—</span>
                  )}
                </div>
                <div className="text-stone-300 pr-3">
                  {rightProduct ? (
                    <p className="text-xs leading-relaxed text-stone-300 line-clamp-3">
                      {rightProduct.description}
                    </p>
                  ) : (
                    <span className="text-stone-600">—</span>
                  )}
                </div>
              </div>

              {/* Row 9: Guarantee & Doorstep Try-On */}
              <div className="grid grid-cols-3 p-3.5 hover:bg-white/[0.02] transition items-center">
                <span className="text-stone-400 font-semibold text-[11px] uppercase tracking-wider">
                  Try-On Guarantee
                </span>
                <div className="text-stone-200">
                  {leftProduct ? (
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Doorstep Try-On Kept / 10-Min Rider Wait</span>
                    </div>
                  ) : (
                    <span className="text-stone-600">—</span>
                  )}
                </div>
                <div className="text-stone-200">
                  {rightProduct ? (
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Doorstep Try-On Kept / 10-Min Rider Wait</span>
                    </div>
                  ) : (
                    <span className="text-stone-600">—</span>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-white/10 bg-[#141418] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span className="w-2 h-2 rounded-full bg-[#FF5757] animate-pulse" />
            <span>Real-time inventory verified at dark store micro-hubs</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-lg transition cursor-pointer"
            >
              Close Comparison
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
