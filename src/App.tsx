import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PRODUCTS, Product, CartItem } from './data/products';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DeliveryMarquee } from './components/DeliveryMarquee';
import { Categories } from './components/Categories';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { DeliveryCheckerModal } from './components/DeliveryCheckerModal';
import { WishlistModal } from './components/WishlistModal';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { CheckCircle2, Zap, Bike, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { OrderDetails } from './components/OrderTracker';
import { UserProfileModal, PastOrderRecord } from './components/UserProfileModal';
import { OutfitBuilder } from './components/OutfitBuilder';
import { VipDropVault } from './components/VipDropVault';
import { CommunityReviews } from './components/CommunityReviews';
import { SizeAssistantModal } from './components/SizeAssistantModal';
import { ShareModal } from './components/ShareModal';
import { AdminPanel } from './components/AdminPanel';
import { AdminRouteGuard } from './components/AdminRouteGuard';
import { SiteSettings, DEFAULT_SITE_SETTINGS } from './data/siteSettings';

const STORAGE_KEY = 'apparellex-products-v1';
const SETTINGS_STORAGE_KEY = 'apparellex-site-settings-v1';
const ADMIN_QUERY_KEY = 'admin';
const MAX_SEARCH_LENGTH = 80;

const sanitizeSearchValue = (value: string): string =>
  value.replace(/[<>]/g, '').trim().slice(0, MAX_SEARCH_LENGTH);

const isAdminRouteRequested = (): boolean => {
  if (typeof window === 'undefined') return false;

  const params = new URLSearchParams(window.location.search);
  return params.get(ADMIN_QUERY_KEY) === '1' || window.location.hash === '#admin';
};

const getSavedProducts = (): Product[] => {
  if (typeof window === 'undefined') return PRODUCTS;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return PRODUCTS;

    const parsed = JSON.parse(saved) as Product[];
    if (!Array.isArray(parsed) || parsed.length === 0) return PRODUCTS;

    return parsed;
  } catch {
    return PRODUCTS;
  }
};

const getSavedSettings = (): SiteSettings => {
  if (typeof window === 'undefined') return DEFAULT_SITE_SETTINGS;

  try {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!saved) return DEFAULT_SITE_SETTINGS;

    const parsed = JSON.parse(saved) as SiteSettings;
    if (!parsed || typeof parsed !== 'object') return DEFAULT_SITE_SETTINGS;

    return { ...DEFAULT_SITE_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
};

const INITIAL_PAST_ORDERS: PastOrderRecord[] = [
  {
    orderId: 'APX-928104',
    name: 'Shaikh Kamran',
    phone: '+1 (555) 019-2834',
    address: '742 Evergreen Terrace, Apt 4B',
    postalCode: '10001',
    paymentMethod: 'card',
    totalAmount: 245,
    formattedDate: 'Sep 28, 2026 · 04:15 PM',
    statusText: 'Delivered (8 Mins)',
    statusType: 'delivered',
    deliveredInMinutes: 8,
    createdAt: new Date('2026-09-28T16:15:00'),
    items: [
      {
        product: PRODUCTS[0],
        selectedSize: 'L',
        selectedColor: PRODUCTS[0].colors[0],
        quantity: 1,
      },
      {
        product: PRODUCTS[3],
        selectedSize: 'M',
        selectedColor: PRODUCTS[3].colors[0],
        quantity: 1,
      },
    ],
  },
  {
    orderId: 'APX-814920',
    name: 'Shaikh Kamran',
    phone: '+1 (555) 019-2834',
    address: '108 Mercer Street, Floor 3, SoHo',
    postalCode: '10012',
    paymentMethod: 'cod',
    totalAmount: 95,
    formattedDate: 'Sep 14, 2026 · 02:30 PM',
    statusText: 'Doorstep Try-On Kept',
    statusType: 'try_on_kept',
    deliveredInMinutes: 9,
    createdAt: new Date('2026-09-14T14:30:00'),
    items: [
      {
        product: PRODUCTS[1],
        selectedSize: 'M',
        selectedColor: PRODUCTS[1].colors[0],
        quantity: 1,
      },
    ],
  },
  {
    orderId: 'APX-762019',
    name: 'Shaikh Kamran',
    phone: '+1 (555) 019-2834',
    address: '742 Evergreen Terrace, Apt 4B',
    postalCode: '10001',
    paymentMethod: 'card',
    totalAmount: 240,
    formattedDate: 'Aug 30, 2026 · 06:45 PM',
    statusText: 'Delivered (10 Mins)',
    statusType: 'delivered',
    deliveredInMinutes: 10,
    createdAt: new Date('2026-08-30T18:45:00'),
    items: [
      {
        product: PRODUCTS[2],
        selectedSize: 'S',
        selectedColor: PRODUCTS[2].colors[0],
        quantity: 1,
      },
    ],
  },
];

function AppContent() {
  const [products, setProducts] = useState<Product[]>(getSavedProducts);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getSavedSettings);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['prod-1', 'prod-3']);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'urban-street' | 'minimalist-zen' | 'unique-trends'>('all');
  const [activeGender, setActiveGender] = useState<'all' | 'men' | 'women' | 'unisex'>('all');
  const [activeOrder, setActiveOrder] = useState<OrderDetails | null>(null);
  const [orderHistory, setOrderHistory] = useState<PastOrderRecord[]>(INITIAL_PAST_ORDERS);

  const safeSearchQuery = useMemo(() => sanitizeSearchValue(searchQuery), [searchQuery]);
  const toastTimeoutRef = useRef<number | null>(null);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDeliveryCheckerOpen, setIsDeliveryCheckerOpen] = useState(false);
  const [isSizeAssistantOpen, setIsSizeAssistantOpen] = useState(false);
  const [sizeAssistantProduct, setSizeAssistantProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      } catch {
        // Ignore quota/storage issues gracefully.
      }
    }
  }, [products]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(siteSettings));
      } catch {
        // Ignore quota/storage issues gracefully.
      }
    }
  }, [siteSettings]);

  useEffect(() => {
    if (isAdminRouteRequested()) {
      setAdminUnlocked(true);
      setIsAdminOpen(true);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      setIsAdminOpen(false);
      setAdminUnlocked(false);
      syncAdminRoute(false);
      setQuickViewProduct(null);
      setIsCartOpen(false);
      setIsCheckoutOpen(false);
      setIsWishlistOpen(false);
      setIsProfileOpen(false);
      setIsShareOpen(false);
      setIsDeliveryCheckerOpen(false);
      setIsSizeAssistantOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    const safeMessage = sanitizeSearchValue(msg);

    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    setToastMessage(safeMessage);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const syncAdminRoute = (open: boolean) => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);

    if (open) {
      params.set(ADMIN_QUERY_KEY, '1');
    } else {
      params.delete(ADMIN_QUERY_KEY);
    }

    const queryString = params.toString();
    const nextUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ''}${window.location.hash}`;
    window.history.replaceState({}, '', nextUrl);
  };

  const handleAdminButtonClick = () => {
    const shouldOpen = !adminUnlocked || !isAdminOpen;

    if (shouldOpen) {
      setAdminUnlocked(true);
      setIsAdminOpen(true);
      syncAdminRoute(true);
      showToast('Admin access enabled');
      return;
    }

    setIsAdminOpen(false);
    setAdminUnlocked(false);
    syncAdminRoute(false);
    showToast('Admin closed');
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    setAdminUnlocked(false);
    syncAdminRoute(false);
    showToast('Admin panel closed');
  };

  const handleUpdateSiteSettings = (updated: SiteSettings) => {
    setSiteSettings(updated);
    showToast('Company & administration details saved');
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast('Product added successfully');
  };

  const handleUpdateProduct = (id: string, updatedProduct: Product) => {
    setProducts((prev) => prev.map((item) => (item.id === id ? updatedProduct : item)));
    showToast('Product updated successfully');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    showToast('Product removed');
  };

  const handleResetProducts = () => {
    setProducts(PRODUCTS);
    showToast('Catalog reset to default sample items');
  };

  const handleAddOutfitToBag = (
    items: { product: Product; size: string; color: { name: string; hex: string } }[]
  ) => {
    items.forEach((item) => {
      handleAddToCart(item.product, item.size, item.color, 1);
    });
    setIsCartOpen(true);
    showToast(`Added complete 3-piece look to bag with 15% curator discount!`);
  };

  const handleApplySizeFromAssistant = (primarySize: string, backupSize: string | null) => {
    if (backupSize) {
      showToast(`Selected Size ${primarySize} with free doorstep backup Size ${backupSize}`);
    } else {
      showToast(`Selected Size ${primarySize}`);
    }
  };

  const handleAddToCart = (
    product: Product,
    selectedSize: string,
    selectedColor: { name: string; hex: string },
    qty = 1
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor.name === selectedColor.name
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += qty;
        return next;
      }
      return [...prev, { product, selectedSize, selectedColor, quantity: qty }];
    });

    showToast(`Added "${product.name}" (${selectedSize}) to bag`);
  };

  const handleUpdateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCart((prev) => {
      const next = [...prev];
      next[index].quantity = quantity;
      return next;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToast('Item removed from bag');
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from saved pieces');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your wishlist');
        return [...prev, productId];
      }
    });
  };

  const handleShopMen = () => {
    setActiveGender('men');
    setActiveCategory('all');
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShopWomen = () => {
    setActiveGender('women');
    setActiveCategory('all');
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectCategoryFromHero = (
    category: 'urban-street' | 'minimalist-zen' | 'unique-trends'
  ) => {
    setActiveCategory(category);
    setActiveGender('all');
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOrderComplete = (order: OrderDetails) => {
    setActiveOrder(order);
    setCart([]);
    const now = new Date();
    const formattedDate = `Today, Oct 04, 2026 · ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newPastRecord: PastOrderRecord = {
      ...order,
      formattedDate,
      statusText: 'In Transit (10-Min Dispatch)',
      statusType: 'in_transit',
      deliveredInMinutes: 9,
    };
    setOrderHistory((prev) => [newPastRecord, ...prev]);
    showToast('Order confirmed! Added to your Order History.');
  };

  const handleTrackOrderFromProfile = (order: OrderDetails) => {
    setActiveOrder(order);
    setIsProfileOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleReorderFromProfile = (items: CartItem[]) => {
    items.forEach((item) => {
      handleAddToCart(item.product, item.selectedSize, item.selectedColor, item.quantity);
    });
    setIsProfileOpen(false);
    setIsCartOpen(true);
    showToast(`Re-added ${items.length} pieces to your bag`);
  };

  const totalCartItemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity * item.product.price, 0),
    [cart]
  );

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }),
    []
  );

  return (
    <div className="min-h-screen bg-[#FEFCF5] text-[#1a1a1a] flex flex-col font-sans selection:bg-[#FF5757] selection:text-white">
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white px-5 py-3 rounded-sm shadow-2xl border border-white/10 flex items-center gap-3 text-xs font-semibold animate-slideUp"
        >
          <Zap className="w-4 h-4 text-[#FF5757] fill-[#FF5757] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Header
        settings={siteSettings}
        cartCount={totalCartItemCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        searchQuery={safeSearchQuery}
        setSearchQuery={setSearchQuery}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenDeliveryChecker={() => setIsDeliveryCheckerOpen(true)}
      />

      <main className="flex-1">
        <Hero
          onShopMen={handleShopMen}
          onShopWomen={handleShopWomen}
          onOpenDeliveryChecker={() => setIsDeliveryCheckerOpen(true)}
        />

        <DeliveryMarquee onOpenChecker={() => setIsDeliveryCheckerOpen(true)} />

        <section className="mx-auto max-w-7xl px-4 pb-8 pt-2">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: 'Secure checkout',
                caption: 'Encrypted transactions and protected payment flow.',
              },
              {
                icon: Sparkles,
                title: 'Smart curation',
                caption: 'AI-inspired styling suggestions for faster discovery.',
              },
              {
                icon: Truck,
                title: 'Fast delivery',
                caption: `Protected dispatch for ${currencyFormatter.format(cartTotal || 0)} total basket value`,
              },
            ].map(({ icon: Icon, title, caption }) => (
              <div key={title} className="feature-card rounded-2xl border border-[#1a1a1a]/10 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#FF5757]/10 text-[#FF5757]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1 text-sm font-black uppercase tracking-[0.18em] text-[#1a1a1a]">{title}</h3>
                <p className="text-sm text-[#4a4a4a]">{caption}</p>
              </div>
            ))}
          </div>
        </section>

        <Categories onSelectCategory={handleSelectCategoryFromHero} />

        <ProductCatalog
          products={products}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          activeGender={activeGender}
          setActiveGender={setActiveGender}
          searchQuery={safeSearchQuery}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={(prod) => setQuickViewProduct(prod)}
          onAddToCart={handleAddToCart}
        />

        <OutfitBuilder onAddOutfitToBag={handleAddOutfitToBag} />

        <VipDropVault onNotifyToast={showToast} />

        <CommunityReviews onNotifyToast={showToast} />

        <AboutSection settings={siteSettings} />
      </main>

      <button
        onClick={handleAdminButtonClick}
        className="fixed bottom-6 left-6 z-40 bg-[#1a1a1a] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm shadow-lg hover:bg-[#FF5757] transition"
      >
        {adminUnlocked ? (isAdminOpen ? 'Close Admin' : 'Admin') : 'Admin'}
      </button>

      {adminUnlocked && isAdminOpen && (
        <AdminPanel
          products={products}
          settings={siteSettings}
          orders={orderHistory}
          onUpdateOrderHistory={setOrderHistory}
          onClose={handleCloseAdmin}
          onUpdateSiteSettings={handleUpdateSiteSettings}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onResetDefaultProducts={handleResetProducts}
        />
      )}

      <Footer settings={siteSettings} />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onOpenFitAssistant={() => {
          setSizeAssistantProduct(quickViewProduct);
          setIsSizeAssistantOpen(true);
        }}
      />

      <SizeAssistantModal
        isOpen={isSizeAssistantOpen}
        onClose={() => setIsSizeAssistantOpen(false)}
        product={sizeAssistantProduct}
        onApplySize={handleApplySizeFromAssistant}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderComplete={handleOrderComplete}
        existingOrder={activeOrder}
      />

      {activeOrder && !isCheckoutOpen && (
        <aside
          aria-label="Active delivery tracker shortcut"
          className="fixed bottom-6 left-6 z-40 bg-[#111111] text-white px-4 py-3 rounded-sm shadow-2xl border border-[#FF5757]/40 flex items-center gap-3 backdrop-blur-md cursor-pointer hover:bg-[#1a1a1a]"
          onClick={() => setIsCheckoutOpen(true)}
        >
          <div className="w-8 h-8 rounded-full bg-[#FF5757] flex items-center justify-center text-white shrink-0">
            <Bike className="w-4 h-4" />
          </div>
          <div className="text-left pr-2">
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#FF5757] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5757] animate-pulse" />
              10-Min Delivery in Progress
            </p>
            <p className="text-xs font-bold text-white">
              Order #{activeOrder.orderId} · View Progress Bar
            </p>
          </div>
        </aside>
      )}

      <DeliveryCheckerModal
        isOpen={isDeliveryCheckerOpen}
        onClose={() => setIsDeliveryCheckerOpen(false)}
        onStartShopping={() => {
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        products={products}
        onAddToCart={(prod, sz, col) => {
          handleAddToCart(prod, sz, col);
          setIsWishlistOpen(false);
          setIsCartOpen(true);
        }}
        onRemoveFromWishlist={handleToggleWishlist}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        orders={orderHistory}
        onTrackOrder={handleTrackOrderFromProfile}
        onReorder={handleReorderFromProfile}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        onNotifyToast={showToast}
      />
    </div>
  );
}

export default function App() {
  return (
    <AdminRouteGuard>
      <AppContent />
    </AdminRouteGuard>
  );
}
