import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Search, Heart, X, Zap, User, Share2 } from 'lucide-react';
import { Product, PRODUCTS } from '../data/products';
import { TrendingSearchesDropdown } from './TrendingSearchesDropdown';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenProfile: () => void;
  onOpenShare?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectCategory: (category: 'all' | 'urban-street' | 'minimalist-zen' | 'unique-trends') => void;
  onOpenDeliveryChecker: () => void;
  products?: Product[];
  onQuickView?: (product: Product) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenProfile,
  onOpenShare,
  searchQuery,
  setSearchQuery,
  onSelectCategory,
  onOpenDeliveryChecker,
  products,
  onQuickView,
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const handleToggleSearch = () => {
    setShowSearch((prev) => {
      const next = !prev;
      setIsDropdownOpen(next);
      return next;
    });
  };

  return (
    <>
      {/* TOP ANNOUNCEMENT BANNER */}
      {showBanner && (
        <aside aria-label="Announcement" className="bg-[#111111] text-white text-xs py-2 px-4 flex items-center justify-between border-b border-white/10 relative z-50">
          <div className="container mx-auto flex items-center justify-center gap-3 text-center">
            <span className="inline-flex items-center gap-1.5 font-medium tracking-wide">
              <Zap className="w-3.5 h-3.5 text-[#FF5757] fill-[#FF5757]" />
              <span>10-Minute Instant Fashion Delivery Active in Your Zone</span>
            </span>
            <span className="hidden sm:inline text-white/40">|</span>
            <button
              onClick={onOpenDeliveryChecker}
              className="hidden sm:inline-block text-white/90 underline hover:text-[#FF5757] transition-colors cursor-pointer text-xs"
            >
              Verify Postal Code
            </button>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-white/60 hover:text-white transition p-1"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 w-full z-40 bg-[#FEFCF5]/90 backdrop-blur-md border-b border-black/10 transition-all duration-200">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center" aria-label="Main Navigation">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#home"
            className="text-2xl md:text-3xl font-extrabold tracking-tighter font-fashion text-[#1a1a1a] hover:opacity-90 transition select-none"
          >
            APPARELLEX
          </a>

          {/* Zone 2: Clean text navigation links */}
          <div className="hidden lg:flex items-center space-x-8 text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/80">
            <a href="#home" className="hover:text-[#FF5757] transition-colors">
              Home
            </a>
            <a href="#categories" className="hover:text-[#FF5757] transition-colors">
              Categories
            </a>
            <a
              href="#catalog"
              onClick={() => onSelectCategory('all')}
              className="hover:text-[#FF5757] transition-colors"
            >
              Drops & Shop
            </a>
            <a href="#outfit-studio" className="hover:text-[#FF5757] transition-colors">
              Outfit Studio
            </a>
            <a href="#vault" className="hover:text-[#FF5757] transition-colors">
              VIP Vault
            </a>
            <button
              onClick={onOpenDeliveryChecker}
              className="hover:text-[#FF5757] transition-colors uppercase tracking-widest cursor-pointer inline-flex items-center gap-1"
            >
              <span>10-Min Delivery</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5757] animate-pulse"></span>
            </button>
            <button
              onClick={onOpenProfile}
              className="hover:text-[#FF5757] transition-colors uppercase tracking-widest cursor-pointer"
            >
              Orders
            </button>
            <a href="#about" className="hover:text-[#FF5757] transition-colors">
              About Us
            </a>
          </div>

          {/* Zone 3: Functional interactive affordances */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            {/* Search Trigger */}
            <button
              onClick={handleToggleSearch}
              className="p-2 text-[#1a1a1a] hover:text-[#FF5757] transition-colors rounded-full hover:bg-black/5 cursor-pointer"
              aria-label="Search items"
              title="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Share / WhatsApp Button */}
            {onOpenShare && (
              <button
                onClick={onOpenShare}
                className="p-2 text-[#1a1a1a] hover:text-[#FF5757] transition-colors rounded-full hover:bg-black/5 cursor-pointer"
                aria-label="Share on WhatsApp with friends"
                title="Share on WhatsApp"
              >
                <Share2 className="w-5 h-5" />
              </button>
            )}

            {/* Profile & Order History Button */}
            <button
              onClick={onOpenProfile}
              className="p-2 text-[#1a1a1a] hover:text-[#FF5757] transition-colors rounded-full hover:bg-black/5 cursor-pointer"
              aria-label="View profile and order history"
              title="Profile & Orders"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-[#1a1a1a] hover:text-[#FF5757] transition-colors rounded-full hover:bg-black/5 cursor-pointer"
              aria-label="View wishlist"
              title="Saved items"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-[#FF5757] text-[#FF5757]' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#FF5757] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="bg-[#111111] text-white px-4 py-2.5 rounded-full hover:bg-[#FF5757] transition-all duration-200 flex items-center gap-2.5 group cursor-pointer shadow-sm hover:shadow"
              aria-label={`Shopping bag with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Bag</span>
              <span className="bg-white text-black font-extrabold text-xs px-2 py-0.5 rounded-full tabular-nums group-hover:bg-black group-hover:text-white transition-colors">
                {cartCount}
              </span>
            </button>
          </div>
        </nav>

        {/* Expandable Search Input Bar with Trending Searches Dropdown */}
        {showSearch && (
          <div
            ref={searchContainerRef}
            className="border-t border-black/10 bg-white px-6 py-3 shadow-inner relative"
          >
            <div className="container mx-auto flex items-center gap-3">
              <Search className="w-4 h-4 text-black/40" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsDropdownOpen(false);
                    const catalogEl = document.getElementById('catalog');
                    if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                  } else if (e.key === 'Escape') {
                    setIsDropdownOpen(false);
                    setShowSearch(false);
                  }
                }}
                placeholder="Search oversize hoodies, tailored poplin, runway coats..."
                className="w-full text-sm outline-none bg-transparent text-black placeholder:text-black/40 font-light"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsDropdownOpen(true);
                  }}
                  className="text-xs font-semibold text-black/50 hover:text-black uppercase cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowSearch(false);
                  setIsDropdownOpen(false);
                }}
                className="text-black/60 hover:text-black p-1 cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Real-time Trending Searches Dropdown */}
            <TrendingSearchesDropdown
              isOpen={isDropdownOpen}
              searchQuery={searchQuery}
              onSelectQuery={(q) => {
                setSearchQuery(q);
                setIsDropdownOpen(false);
              }}
              onSelectCategory={(cat) => {
                onSelectCategory(cat);
                setIsDropdownOpen(false);
                setShowSearch(false);
              }}
              onSelectProduct={(prod) => {
                if (onQuickView) {
                  onQuickView(prod);
                } else {
                  setSearchQuery(prod.name);
                }
                setIsDropdownOpen(false);
              }}
              products={products || PRODUCTS}
              onClose={() => setIsDropdownOpen(false)}
            />
          </div>
        )}
      </header>
    </>
  );
};
