import React from 'react';
import { Product } from '../data/products';
import { X, Heart, ShoppingBag, ArrowRight, Zap } from 'lucide-react';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  products: Product[];
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
  onRemoveFromWishlist: (productId: string) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  products,
  onAddToCart,
  onRemoveFromWishlist,
}) => {
  if (!isOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wishlist-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-xl w-full rounded-sm overflow-hidden shadow-2xl relative border border-black/10 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-black/10 flex items-center justify-between bg-[#111111] text-white">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-[#FF5757] text-[#FF5757]" />
            <h2 id="wishlist-modal-title" className="text-sm font-black font-fashion uppercase tracking-wider">
              Saved Pieces ({wishlistedProducts.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition p-1 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {wishlistedProducts.length === 0 ? (
            <div className="py-12 text-center">
              <Heart className="w-12 h-12 text-black/20 mx-auto mb-3" />
              <h3 className="text-base font-bold font-fashion text-[#1a1a1a]">No items saved yet</h3>
              <p className="text-xs text-black/50 mt-1 max-w-xs mx-auto">
                Tap the heart on any piece in our collections to save it for immediate dispatch.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlistedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-3 bg-[#FAF8F2] border border-black/10 rounded-sm"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-20 object-cover rounded-xs bg-stone-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-black/50 tracking-wider">
                      {product.categoryLabel}
                    </span>
                    <h4 className="text-xs font-bold text-[#1a1a1a] truncate">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-black text-black tabular-nums">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#FF5757] fill-[#FF5757]" />
                        {product.estDeliveryMins}m delivery
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onAddToCart(product, product.sizes[0], product.colors[0]);
                      }}
                      className="bg-[#1a1a1a] hover:bg-[#FF5757] text-white px-3 py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                    <button
                      onClick={() => onRemoveFromWishlist(product.id)}
                      className="text-[10px] text-black/50 hover:text-red-500 font-semibold uppercase text-center transition cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
