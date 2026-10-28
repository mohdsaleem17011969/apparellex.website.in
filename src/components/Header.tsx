import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Search, Heart, X, Zap, User, Share2, Sparkles } from 'lucide-react';
import { Product, PRODUCTS } from '../data/products';
import { TrendingSearchesDropdown } from './TrendingSearchesDropdown';
import { SiteSettings } from '../data/siteSettings';

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
  settings?: SiteSettings;
  currentUser?: { name: string; email: string; avatar?: string; isVip?: boolean } | null;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  onOpenAiSuggestions?: () => void;
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
  settings,
  currentUser,
  onOpenAuth,
  onOpenAiSuggestions,
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

  const isBannerVisible = showBanner && (settings?.showAnnouncementBar !== false);
  const bannerMessage = settings?.announcementBarText || '10-Minute Instant Fashion Delivery Active in Your Zone';
  const brandTitle = settings?.companyName ? settings.companyName.toUpperCase() : 'APPARELLEX';

  return (
    <>
      {/* TOP ANNOUNCEMENT BANNER */}
      {isBannerVisible && (
        <aside aria-label="Announcement" className="bg-[#111111] text-white text-xs py-2 px-4 flex items-center justify-between border-b border-white/10 relative z-50">
          <div className="container mx-auto flex items-center justify-center gap-3 text-center">
            <span className="inline-flex items-center gap-1.5 font-medium tracking-wide">
              <Zap className="w-3.5 h-3.5 text-[#FF5757] fill-[#FF5757]" />
              <span>{bannerMessage}</span>
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
        <nav className="w-full px-4 sm:px-6 md:px-8 py-3.5 flex justify-between items-center" aria-label="Main Navigation">
          {/* Zone 1: Single text element wordmark placed at extreme left side */}
          <div className="flex-shrink-0">
            <a
              href="#home"
              className="text-2xl md:text-3xl font-extrabold tracking-tighter font-fashion text-[#1a1a1a] hover:opacity-90 transition select-none"
            >
              {brandTitle}
            </a>
          </div>

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
          <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3">
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
                className="p-2 text-[#1a1a1a] hover:text-[#FF5757] transition-colors rounded-full hover:bg-black/5 cursor-pointer hidden md:flex items-center justify-center"
                aria-label="Share on WhatsApp with friends"
                title="Share on WhatsApp"
              >
                <Share2 className="w-5 h-5" />
              </button>
            )}

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

            {/* High-Converting Auth / Sign In Trigger (Single clear button, no extra symbol) */}
            {onOpenAuth && !currentUser && (
              <button
                onClick={() => onOpenAuth('login')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/20 hover:border-[#FF5757] hover:text-[#FF5757] hover:bg-black/5 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                title="Sign in to your account"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Profile & Order History Button (ONLY shown when logged in) */}
            {currentUser && (
              <button
                onClick={onOpenProfile}
                className="p-1.5 text-[#1a1a1a] hover:text-[#FF5757] transition-colors rounded-full hover:bg-black/5 cursor-pointer flex items-center justify-center"
                aria-label={`Profile of ${currentUser.name}`}
                title={`${currentUser.name} (VIP Member)`}
              >
                {currentUser?.avatar ? (
                  <div className="relative">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-6 h-6 rounded-full object-cover border-2 border-[#FF5757]"
                    />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-1 ring-white" />
                  </div>
                ) : (
                  <User className="w-5 h-5" />
                )}
              </button>
            )}

            {/* AI Suggestions Action Button - Sleek black pill placed harmoniously beside Bag */}
            {onOpenAiSuggestions && (
              <button
                onClick={onOpenAiSuggestions}
                className="bg-[#111111] text-white px-3.5 py-2.5 rounded-full hover:bg-[#FF5757] transition-all duration-200 flex items-center gap-1.5 sm:gap-2 group cursor-pointer shadow-sm hover:shadow"
                title="Open AI Suggestions & Style Concierge"
              >
                <Sparkles className="w-4 h-4 text-[#FF5757] fill-[#FF5757] group-hover:text-white group-hover:fill-white transition-colors" />
                <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">AI Suggestions</span>
                <span className="text-xs font-bold uppercase tracking-wider sm:hidden">AI</span>
              </button>
            )}

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
            className="border-t border-black/10 bg-white px-4 sm:px-6 md:px-8 py-3 shadow-inner relative"
          >
            <div className="w-full flex items-center gap-3">
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
