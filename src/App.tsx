import React, { useEffect, useState } from 'react';
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
import { CheckCircle2, Zap, Bike } from 'lucide-react';
import { OrderDetails } from './components/OrderTracker';
import { UserProfileModal, PastOrderRecord } from './components/UserProfileModal';
import { OutfitBuilder } from './components/OutfitBuilder';
import { VipDropVault } from './components/VipDropVault';
import { CommunityReviews } from './components/CommunityReviews';
import { SizeAssistantModal } from './components/SizeAssistantModal';
import { ShareModal } from './components/ShareModal';
import { AdminPanel } from './components/AdminPanel';

const STORAGE_KEY = 'apparellex-products-v1';

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

export default function App() {
  const [products, setProducts] = useState<Product[]>(getSavedProducts);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['prod-1', 'prod-3']);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'urban-street' | 'minimalist-zen' | 'unique-trends'>('all');
  const [activeGender, setActiveGender] = useState<'all' | 'men' | 'women' | 'unisex'>('all');
  const [activeOrder, setActiveOrder] = useState<OrderDetails | null>(null);
  const [orderHistory, setOrderHistory] = useState<PastOrderRecord[]>(INITIAL_PAST_ORDERS);

  // Modals & Drawers state
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }
  }, [products]);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
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

  const totalCartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FEFCF5] text-[#1a1a1a] flex flex-col font-sans selection:bg-[#FF5757] selection:text-white">
      {/* Toast Notification */}
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

      {/* Header & Sticky Top Bar */}
      <Header
        cartCount={totalCartItemCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenDeliveryChecker={() => setIsDeliveryCheckerOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onShopMen={handleShopMen}
          onShopWomen={handleShopWomen}
          onOpenDeliveryChecker={() => setIsDeliveryCheckerOpen(true)}
        />

        {/* Delivery Promise Marquee & Micro-Hub Pillars */}
        <DeliveryMarquee onOpenChecker={() => setIsDeliveryCheckerOpen(true)} />

        {/* Categories Section */}
        <Categories onSelectCategory={handleSelectCategoryFromHero} />

        {/* Interactive Curated Drops Catalog */}
        <ProductCatalog
          products={products}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          activeGender={activeGender}
          setActiveGender={setActiveGender}
          searchQuery={searchQuery}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={(prod) => setQuickViewProduct(prod)}
          onAddToCart={handleAddToCart}
        />

        {/* Mix & Match Outfit Studio */}
        <OutfitBuilder onAddOutfitToBag={handleAddOutfitToBag} />

        {/* VIP Secret Drop Vault */}
        <VipDropVault onNotifyToast={showToast} />

        {/* Street Cred & Verified 10-Minute Reviews */}
        <CommunityReviews onNotifyToast={showToast} />

        {/* About Us & Shaikh Kamran Narrative */}
        <AboutSection />
      </main>

      {/* Floating Admin Button */}
      <button
        onClick={() => setIsAdminOpen((prev) => !prev)}
        className="fixed bottom-6 left-6 z-40 bg-[#1a1a1a] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm shadow-lg hover:bg-[#FF5757] transition"
      >
        {isAdminOpen ? 'Close Admin' : 'Admin'}
      </button>

      {isAdminOpen && (
        <AdminPanel
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onResetDefaultProducts={handleResetProducts}
        />
      )}

      {/* Footer */}
      <Footer />

      {/* Slide-Over Cart Drawer */}
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

      {/* Product Quick View Modal */}
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

      {/* Doorstep Fit Engine & Backup Size Modal */}
      <SizeAssistantModal
        isOpen={isSizeAssistantOpen}
        onClose={() => setIsSizeAssistantOpen(false)}
        product={sizeAssistantProduct}
        onApplySize={handleApplySizeFromAssistant}
      />

      {/* Instant Checkout & Live 10-Minute Radar Tracker Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderComplete={handleOrderComplete}
        existingOrder={activeOrder}
      />

      {/* Floating Active Order Live Tracker Shortcut */}
      {activeOrder && !isCheckoutOpen && (
        <aside
          aria-label="Active delivery tracker shortcut"
          className="fixed bottom-6 left-6 z-40 bg-[#111111] text-white px-4 py-3 rounded-sm shadow-2xl border border-[#FF5757]/40 flex items-center gap-3 backdrop-blur-md cursor-pointer hover:bg-[#1b1b1b]"
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

      {/* Delivery Zone Checker Modal */}
      <DeliveryCheckerModal
        isOpen={isDeliveryCheckerOpen}
        onClose={() => setIsDeliveryCheckerOpen(false)}
        onStartShopping={() => {
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Wishlist Modal */}
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

      {/* User Profile & Order History Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        orders={orderHistory}
        onTrackOrder={handleTrackOrderFromProfile}
        onReorder={handleReorderFromProfile}
      />

      {/* Share With Friends / WhatsApp Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        onNotifyToast={showToast}
      />
    </div>
  );
}
