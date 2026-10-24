import React from 'react';
import { Product } from '../data/products';
import { ArrowLeftRight, X, Plus } from 'lucide-react';

export interface ProductCompareDockProps {
  products: Product[];
  compareProductIds: string[];
  onOpenCompareModal: () => void;
  onRemoveFromCompare: (productId: string) => void;
  onClearCompare: () => void;
}

export const ProductCompareDock: React.FC<ProductCompareDockProps> = ({
  products,
  compareProductIds,
  onOpenCompareModal,
  onRemoveFromCompare,
  onClearCompare,
}) => {
  if (compareProductIds.length === 0) return null;

  const product1 = products.find((p) => p.id === compareProductIds[0]);
  const product2 = products.find((p) => p.id === compareProductIds[1]);

  return (
    <aside
      aria-label="Product comparison dock"
      className="fixed bottom-6 right-6 z-40 max-w-md w-[calc(100vw-3rem)] sm:w-auto bg-[#141418]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-3 shadow-2xl text-white animate-slideUp flex flex-col sm:flex-row items-center gap-3"
    >
      {/* Products Row */}
      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
        {/* Product 1 */}
        {product1 ? (
          <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/10 relative group">
            <img
              src={product1.image}
              alt={product1.name}
              className="w-10 h-10 object-cover rounded-lg bg-stone-800 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="max-w-[90px] truncate text-left pr-1">
              <p className="text-[11px] font-bold text-white truncate">{product1.name}</p>
              <p className="text-[10px] text-stone-400 font-mono">${product1.price}</p>
            </div>
            <button
              onClick={() => onRemoveFromCompare(product1.id)}
              className="w-4 h-4 rounded-full bg-stone-800 hover:bg-[#FF5757] text-white flex items-center justify-center transition absolute -top-1 -right-1 cursor-pointer"
              title="Remove item"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center text-stone-500">
            <Plus className="w-4 h-4" />
          </div>
        )}

        {/* VS Indicator */}
        <span className="text-[10px] font-black uppercase text-[#FF5757] tracking-wider font-mono">
          VS
        </span>

        {/* Product 2 */}
        {product2 ? (
          <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/10 relative group">
            <img
              src={product2.image}
              alt={product2.name}
              className="w-10 h-10 object-cover rounded-lg bg-stone-800 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="max-w-[90px] truncate text-left pr-1">
              <p className="text-[11px] font-bold text-white truncate">{product2.name}</p>
              <p className="text-[10px] text-stone-400 font-mono">${product2.price}</p>
            </div>
            <button
              onClick={() => onRemoveFromCompare(product2.id)}
              className="w-4 h-4 rounded-full bg-stone-800 hover:bg-[#FF5757] text-white flex items-center justify-center transition absolute -top-1 -right-1 cursor-pointer"
              title="Remove item"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-xl border border-dashed border-white/20 text-stone-400 text-[10px] pr-2.5">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-stone-400">
              <Plus className="w-4 h-4" />
            </div>
            <span className="hidden sm:inline">Pick 2nd piece</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button
          onClick={onOpenCompareModal}
          className="flex-1 sm:flex-initial px-4 py-2 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>{compareProductIds.length === 2 ? 'Compare Now' : 'Compare (1/2)'}</span>
        </button>

        <button
          onClick={onClearCompare}
          className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition cursor-pointer"
          title="Clear comparison"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
