import React from 'react';
import { CartItem } from '../data/products';
import { X, Trash2, ArrowRight, Zap, ShoppingBag, ShieldCheck } from 'lucide-react';
import { LoyaltyTracker } from './LoyaltyTracker';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 100;
  const deliveryFee = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : 7;
  const total = subtotal + deliveryFee;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <aside
          aria-label="Shopping bag drawer"
          className="w-screen max-w-md bg-white border-l border-black/10 shadow-2xl flex flex-col justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-black/10 flex items-center justify-between bg-[#FAF8F2]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#1a1a1a]" />
              <h2 id="cart-drawer-title" className="text-lg font-bold font-fashion uppercase tracking-wider text-[#1a1a1a]">
                Your Wardrobe Bag
              </h2>
              <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full font-bold tabular-nums">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-black/60 hover:text-black hover:bg-black/5 transition cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 10-Min Delivery Tracker Guarantee & Free Shipping Progress */}
          <div className="px-6 py-3 bg-[#111111] text-white text-xs">
            <div className="flex items-center justify-between mb-1.5 font-semibold">
              <span className="flex items-center gap-1.5 text-[#FF5757]">
                <Zap className="w-3.5 h-3.5 fill-[#FF5757]" />
                10-Minute Dark Store Dispatch
              </span>
              <span className="tabular-nums text-white/80">
                {subtotal >= freeShippingThreshold
                  ? 'FREE Priority Express'
                  : `$${(freeShippingThreshold - subtotal).toFixed(0)} away from FREE delivery`}
              </span>
            </div>
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#FF5757] h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Itemized List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <ShoppingBag className="w-12 h-12 text-black/20 mb-3" />
                <h3 className="text-base font-bold font-fashion text-[#1a1a1a]">Your bag is empty</h3>
                <p className="text-xs text-black/50 mt-1 max-w-xs leading-relaxed">
                  Explore our limited drops in Urban Street, Minimalist Zen, and Unique Trends.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2.5 bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#FF5757] transition cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}-${index}`}
                  className="flex gap-4 p-3 bg-[#FAF8F2] rounded-sm border border-black/5 relative group"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-xs bg-stone-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-[#1a1a1a] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(index)}
                          className="text-black/40 hover:text-red-500 transition cursor-pointer p-0.5"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-black/60 mt-1">
                        <span>Size: <strong className="text-black">{item.selectedSize}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          Color:
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block border border-black/20"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5">
                      <div className="flex items-center border border-black/15 bg-white rounded-xs">
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs font-bold text-black/70 hover:bg-black/5 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs font-bold text-black/70 hover:bg-black/5 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-black text-[#1a1a1a] tabular-nums">
                        ${(item.product.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout Button */}
          {items.length > 0 && (
            <div className="p-6 bg-[#FAF8F2] border-t border-black/10 space-y-3">
              <div className="space-y-1.5 text-xs text-black/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-black tabular-nums">${subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[#FF5757] fill-[#FF5757]" />
                    10-Min Ultra-Fast Dispatch
                  </span>
                  <span className="font-semibold text-black tabular-nums">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase text-[11px]">FREE</span>
                    ) : (
                      `$${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-[#1a1a1a] pt-2 border-t border-black/10">
                  <span>Estimated Total</span>
                  <span className="tabular-nums">${total.toFixed(0)}</span>
                </div>
              </div>

              {/* Compact Loyalty Rewards Earning Preview */}
              <LoyaltyTracker cartTotal={total} mode="compact" />

              <button
                onClick={onProceedToCheckout}
                className="w-full bg-[#111111] hover:bg-[#FF5757] text-white py-3.5 px-6 rounded-sm text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
              >
                <span>Instant 10-Min Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-black/50 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Encrypted & Direct
                </span>
                <span>·</span>
                <span>Cash on Delivery & Card Supported</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
