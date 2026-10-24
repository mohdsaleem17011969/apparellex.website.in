import React, { useState } from 'react';
import { Product } from '../data/products';
import { X, Star, Zap, ShieldCheck, RefreshCw, ShoppingBag, Heart, Ruler, ArrowLeftRight } from 'lucide-react';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }, qty: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onOpenFitAssistant?: () => void;
  onOpenCompare?: (product: Product) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  onOpenFitAssistant,
  onOpenCompare,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-4xl w-full rounded-sm overflow-hidden shadow-2xl relative border border-black/10 flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 text-black hover:bg-black hover:text-white transition flex items-center justify-center cursor-pointer shadow-sm"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Image Column */}
        <div className="w-full md:w-1/2 bg-[#F5F2EB] relative flex items-center justify-center min-h-[300px] md:min-h-full">
          {!imgError ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover max-h-[460px] md:max-h-full"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="p-8 text-center">
              <ShoppingBag className="w-12 h-12 text-stone-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-stone-600 uppercase">{product.name}</p>
            </div>
          )}

          {/* 10-Minute Dispatch Badge */}
          <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-sm flex items-center gap-1.5 shadow">
            <Zap className="w-3.5 h-3.5 text-[#FF5757] fill-[#FF5757]" />
            <span>Arrives in ~{product.estDeliveryMins} mins</span>
          </div>
        </div>

        {/* Product Details & Purchase Module */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Header: Category & Wishlist */}
            <div className="flex items-center justify-between text-xs text-black/50 uppercase tracking-widest font-semibold mb-2">
              <span>
                {product.categoryLabel} · {product.gender}
              </span>
              <button
                onClick={() => onToggleWishlist(product.id)}
                className="text-xs flex items-center gap-1 hover:text-[#FF5757] transition cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? 'fill-[#FF5757] text-[#FF5757]' : 'text-black/60'
                  }`}
                />
                <span className="font-bold">{isWishlisted ? 'Saved' : 'Wishlist'}</span>
              </button>
            </div>

            {/* Product Name */}
            <h2 id="quick-view-title" className="text-2xl md:text-3xl font-black font-fashion text-[#1a1a1a] mb-2 leading-tight">
              {product.name}
            </h2>

            {/* Price & Rating */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#1a1a1a] tabular-nums">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-black/40 line-through tabular-nums">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-amber-700 text-xs font-semibold">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span className="tabular-nums">{product.rating}</span>
                <span className="text-amber-600/70">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-black/70 leading-relaxed mb-6 font-light">
              {product.description}
            </p>

            {/* Fabric & Fit Details */}
            <div className="bg-[#FAF8F2] p-3 rounded-sm border border-black/10 text-xs space-y-1 mb-6">
              <p className="flex justify-between">
                <span className="font-semibold text-black/60">Material:</span>
                <span className="font-medium text-black">{product.fabric}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold text-black/60">Fit Spec:</span>
                <span className="font-medium text-black">{product.fit}</span>
              </p>
            </div>

            {/* Color Selector */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-black/60 mb-2">
                Colorway: <span className="text-black font-semibold">{selectedColor.name}</span>
              </label>
              <div className="flex items-center gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: color.hex }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                      selectedColor.name === color.name
                        ? 'border-[#FF5757] scale-110 shadow-sm'
                        : 'border-black/20 hover:scale-105'
                    }`}
                    title={color.name}
                    aria-label={`Select ${color.name} color`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-black/60">
                  Select Size
                </label>
                {onOpenFitAssistant && (
                  <button
                    type="button"
                    onClick={onOpenFitAssistant}
                    className="text-[11px] text-[#FF5757] font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>Fit Predictor & Backup Size</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 text-xs font-bold rounded-sm border transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-[#1a1a1a] text-white border-black'
                        : 'bg-white text-black/80 border-black/20 hover:border-black'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Module */}
          <div className="pt-4 border-t border-black/10">
            {onOpenCompare && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCompare(product);
                }}
                className="w-full mb-3 py-2 px-3 border border-black/15 hover:border-black/30 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition text-black/80 hover:text-black cursor-pointer bg-black/[0.02]"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-[#FF5757]" />
                <span>Compare Side-by-Side</span>
              </button>
            )}

            <div className="flex items-center gap-3 mb-3">
              {/* Quantity */}
              <div className="flex items-center border border-black/20 rounded-sm bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-xs font-bold hover:bg-black/5 cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 py-2 text-xs font-bold tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-xs font-bold hover:bg-black/5 cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAdd}
                className="flex-1 bg-[#1a1a1a] hover:bg-[#FF5757] text-white py-3 px-6 rounded-sm text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag — ${(product.price * quantity).toFixed(0)}</span>
              </button>
            </div>

            {/* Courier Micro Guarantee */}
            <div className="flex items-center justify-between text-[11px] text-black/50 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                100% Authentic Luxury
              </span>
              <span className="flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5 text-[#FF5757]" />
                Doorstep Fit & Return
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
