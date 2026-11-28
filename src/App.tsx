import React, { useState, useEffect } from 'react';
import { Product, Category, Order } from './types';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { Hero } from './components/storefront/Hero';
import { CategoryGrid } from './components/storefront/CategoryGrid';
import { CategorySidebar } from './components/storefront/CategorySidebar';
import { ProductCard } from './components/storefront/ProductCard';
import { ProductCustomizer } from './components/storefront/ProductCustomizer';
import { PrintingServiceCustomizer } from './components/storefront/PrintingServiceCustomizer';
import { HowItWorks } from './components/storefront/HowItWorks';
import { CheckoutModal } from './components/storefront/CheckoutModal';
import { UpiPaymentModal } from './components/storefront/UpiPaymentModal';
import { OrderSuccessModal } from './components/storefront/OrderSuccessModal';
import { OrderTrackingView } from './components/storefront/OrderTrackingView';
import { CustomerAuthModal } from './components/storefront/CustomerAuthModal';
import { CustomerOrdersModal } from './components/storefront/CustomerOrdersModal';
import { ShareProductModal } from './components/storefront/ShareProductModal';

// Admin components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { OrdersManager } from './components/admin/OrdersManager';
import { PaymentVerification } from './components/admin/PaymentVerification';
import { ProductionPanel } from './components/admin/ProductionPanel';
import { QualityControlPanel } from './components/admin/QualityControlPanel';
import { DispatchPanel } from './components/admin/DispatchPanel';
import { DesignApprovalPanel } from './components/admin/DesignApprovalPanel';
import { ProductAdmin } from './components/admin/ProductAdmin';
import { CategoryAdmin } from './components/admin/CategoryAdmin';
import { CatalogSyncPanel } from './components/admin/CatalogSyncPanel';
import { ReportsAnalytics } from './components/admin/ReportsAnalytics';
import { AdminSettings } from './components/admin/AdminSettings';

import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import { ArrowLeft, Filter, Heart, MessageCircle, Share2 } from 'lucide-react';

const ORDERED_CATEGORIES = [
  "Personalized Print Service",
  "Commercial Sheet Printing",
  "Personalized Stickers",
  "Personalized Labels",
  "Personalized Business Cards",
  "Personalized Invitation Cards",
  "Flyers & Brochures",
  "Posters & Wall Prints",
  "Packaging Sleeves & Boxes",
  "Photo Albums",
  "Magazine Albums",
  "Certificates",
  "Corporate Stationery"
];

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'product-detail' | 'track' | 'admin'>('home');
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceFilter, setPriceFilter] = useState<number>(3000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string>('');

  // Modals
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeCreatedOrder, setActiveCreatedOrder] = useState<Order | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [isCustomerOrdersOpen, setIsCustomerOrdersOpen] = useState(false);
  const [sharingProduct, setSharingProduct] = useState<Product | null>(null);

  // Products and Categories data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const { setIsCartOpen } = useCart();
  const { role } = useAuth();

  const sortCategories = (cats: Category[]) => {
    return [...cats].sort((a, b) => {
      const idxA = ORDERED_CATEGORIES.findIndex(c => c.toLowerCase() === a.name.toLowerCase() || c.toLowerCase().replace(/[^a-z0-9]+/g, '-') === a.slug);
      const idxB = ORDERED_CATEGORIES.findIndex(c => c.toLowerCase() === b.name.toLowerCase() || c.toLowerCase().replace(/[^a-z0-9]+/g, '-') === b.slug);
      const posA = idxA === -1 ? 999 : idxA;
      const posB = idxB === -1 ? 999 : idxB;
      return posA - posB;
    });
  };

  const loadData = async () => {
    try {
      const buster = `?t=${Date.now()}`;
      const [pRes, cRes] = await Promise.all([
        fetch(`/api/products${buster}`, { cache: 'no-store' }).then(r => r.json()).catch(() => null),
        fetch(`/api/categories${buster}`, { cache: 'no-store' }).then(r => r.json()).catch(() => null)
      ]);
      if (pRes?.data && pRes.data.length > 0) {
        setProducts(pRes.data);
      } else {
        const staticData = await fetch(`/data/catalog.json${buster}`, { cache: 'no-store' }).then(r => r.json()).catch(() => null);
        if (staticData?.products) setProducts(staticData.products);
      }

      if (cRes?.data && cRes.data.length > 0) {
        setCategories(sortCategories(cRes.data));
      } else {
        const staticData = await fetch(`/data/catalog.json${buster}`, { cache: 'no-store' }).then(r => r.json()).catch(() => null);
        if (staticData?.categories) setCategories(sortCategories(staticData.categories));
      }
    } catch (e) {
      console.error('Error loading initial data, fetching static backup:', e);
      try {
        const staticData = await fetch(`/data/catalog.json?t=${Date.now()}`, { cache: 'no-store' }).then(r => r.json());
        if (staticData?.products) setProducts(staticData.products);
        if (staticData?.categories) setCategories(sortCategories(staticData.categories));
      } catch (err) {
        console.error('Static backup failed:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Check URL query parameters or path for secret admin access (e.g. ?portal=admin)
    const params = new URLSearchParams(window.location.search);
    if (
      window.location.pathname === '/admin' ||
      params.get('portal') === 'admin' ||
      params.get('view') === 'admin' ||
      params.has('admin')
    ) {
      setCurrentView('admin');
    }

    // Owner shortcut: Ctrl+Shift+A or Cmd+Shift+A toggles admin gate
    const handleAdminKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setCurrentView(prev => (prev === 'admin' ? 'home' : 'admin'));
      }
    };
    window.addEventListener('keydown', handleAdminKey);
    return () => window.removeEventListener('keydown', handleAdminKey);
  }, []);

  // Deep-link routing for /p/<sku>, /product/<sku>, or ?product=<sku>
  useEffect(() => {
    if (products.length > 0 && currentView !== 'admin') {
      const params = new URLSearchParams(window.location.search);
      let prodParam = params.get('product') || params.get('p') || params.get('sku');

      if (!prodParam && window.location.pathname) {
        const segments = window.location.pathname.split('/').filter(Boolean);
        if (segments.length >= 2 && (segments[0] === 'p' || segments[0] === 'product' || segments[0] === 'share')) {
          prodParam = decodeURIComponent(segments[1]);
        }
      }

      if (prodParam) {
        const needle = prodParam.toLowerCase();
        const matched = products.find(p => 
          p.sku?.toLowerCase() === needle ||
          p.id?.toLowerCase() === needle ||
          p.category_slug?.toLowerCase() === needle ||
          p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(needle.replace(/[^a-z0-9]+/g, '-'))
        );
        if (matched) {
          setSelectedProduct(matched);
          setCurrentView('product-detail');
        }
      }
    }
  }, [products]);

  // Handle browser back & forward navigation smoothly
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      let prodParam = params.get('product') || params.get('p') || params.get('sku');

      if (!prodParam && window.location.pathname) {
        const segments = window.location.pathname.split('/').filter(Boolean);
        if (segments.length >= 2 && (segments[0] === 'p' || segments[0] === 'product' || segments[0] === 'share')) {
          prodParam = decodeURIComponent(segments[1]);
        }
      }

      if (prodParam && products.length > 0) {
        const needle = prodParam.toLowerCase();
        const matched = products.find(p => 
          p.sku?.toLowerCase() === needle ||
          p.id?.toLowerCase() === needle ||
          p.category_slug?.toLowerCase() === needle
        );
        if (matched) {
          setSelectedProduct(matched);
          setCurrentView('product-detail');
          return;
        }
      }
      if (!prodParam && currentView === 'product-detail') {
        setCurrentView('home');
        setSelectedProduct(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products, currentView]);

  const handleBackToCollections = () => {
    setCurrentView('home');
    setSelectedProduct(null);
    try {
      window.history.pushState({}, '', '/');
    } catch (e) {
      // Ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: string, param?: string) => {
    if (view === 'category') {
      setSelectedCategorySlug(param || 'all');
      handleBackToCollections();
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } else if (view === 'track') {
      if (param) setTrackingOrderNumber(param);
      setCurrentView('track');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'admin') {
      if (param) setAdminTab(param);
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'home') {
      handleBackToCollections();
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    try {
      window.history.pushState({ sku: product.sku }, '', `/p/${encodeURIComponent(product.sku)}`);
    } catch (e) {
      // Ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderCreated = (order: Order) => {
    setIsCheckoutOpen(false);
    setActiveCreatedOrder(order);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmitted = () => {
    setShowPaymentModal(false);
    setShowSuccessModal(true);
  };

  // Filter & sort products for storefront
  const filteredProducts = products
    .filter(p => {
      if (selectedCategorySlug !== 'all') {
        const pCatSlug = p.category_slug || p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const matchCat = pCatSlug === selectedCategorySlug ||
                         p.category.toLowerCase() === selectedCategorySlug.toLowerCase() ||
                         p.category.toLowerCase().includes(selectedCategorySlug.toLowerCase().replace(/-/g, ' '));
        if (!matchCat) return false;
      }
      if (priceFilter < 3000) {
        if (p.selling_price > priceFilter) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        const matchTags = p.tags?.some(t => t.toLowerCase().includes(q));
        return matchName || matchSku || matchCat || matchTags;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.selling_price - b.selling_price;
      if (sortBy === 'price-desc') return b.selling_price - a.selling_price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      // 'featured' / default: strictly sort by the 15 categories in sequence 01 to 15!
      const idxA = ORDERED_CATEGORIES.findIndex(c => c.toLowerCase() === (a.category || '').toLowerCase());
      const idxB = ORDERED_CATEGORIES.findIndex(c => c.toLowerCase() === (b.category || '').toLowerCase());
      const posA = idxA === -1 ? 999 : idxA;
      const posB = idxB === -1 ? 999 : idxB;
      if (posA !== posB) return posA - posB;
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (a.name || '').localeCompare(b.name || '');
    });

  const handleResetFilters = () => {
    setSelectedCategorySlug('all');
    setPriceFilter(3000);
    setSortBy('featured');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] flex flex-col text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* If in Admin view, render AdminLayout */}
      {currentView === 'admin' ? (
        <AdminLayout
          currentTab={adminTab}
          onTabChange={setAdminTab}
          onExitAdmin={() => setCurrentView('home')}
        >
          {adminTab === 'dashboard' && <AdminDashboard onNavigateTab={(t, p) => { setAdminTab(t); }} />}
          {adminTab === 'orders' && <OrdersManager />}
          {adminTab === 'payments' && <PaymentVerification />}
          {adminTab === 'production' && <ProductionPanel />}
          {adminTab === 'qc' && <QualityControlPanel />}
          {adminTab === 'dispatch' && <DispatchPanel />}
          {adminTab === 'design' && <DesignApprovalPanel />}
          {adminTab === 'products' && <ProductAdmin />}
          {adminTab === 'categories' && <CategoryAdmin />}
          {adminTab === 'sync' && <CatalogSyncPanel />}
          {adminTab === 'reports' && <ReportsAnalytics />}
          {adminTab === 'settings' && <AdminSettings />}
        </AdminLayout>
      ) : (
        /* Storefront View */
        <>
          <Navbar
            currentView={currentView}
            onNavigate={handleNavigate}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenCustomerAuth={() => setIsCustomerAuthOpen(true)}
            onOpenCustomerAccount={() => setIsCustomerOrdersOpen(true)}
          />

          <main className="flex-1">
            {currentView === 'home' && (
              <>
                {/* Top Announcement Bar */}
                <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50 to-slate-50 dark:from-[#0B1528] dark:via-[#0B0F19] dark:to-[#0B0F19] py-4 border-b border-slate-200/80 dark:border-slate-800/80">
                  <div className="w-full max-w-[1880px] 2xl:max-w-[2200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                    <div className="space-y-1">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Commercial Digital <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500 bg-clip-text text-transparent">Sheet Printing Hub</span>
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
                        Studio-grade 100 to 350 GSM cardstock, precision CNC kiss-cut stickers, visiting cards, flyers, and boutique packaging with live real-time price calculation and instant dynamic UPI checkout.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Dedicated Custom Printing Configurator Workspace */}
                <section id="customizer-section" className="w-full max-w-[1880px] 2xl:max-w-[2200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8">
                  <PrintingServiceCustomizer
                    product={products.find(p => p.sku === 'PERSONALIZED_PRINT_SERVICE') || products[0]}
                    onAddedToCart={() => {}}
                    onShare={(prod) => setSharingProduct(prod)}
                    onInstantCheckout={() => setIsCheckoutOpen(true)}
                  />
                </section>

                {/* How It Works & Workflow Guide */}
                <HowItWorks />
              </>
            )}

            {/* Product Customizer Detail View */}
            {currentView === 'product-detail' && selectedProduct && (
              <div className="w-full max-w-[1880px] 2xl:max-w-[2200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={handleBackToCollections}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-full transition-colors cursor-pointer shadow-xs"
                  >
                    <ArrowLeft className="w-4 h-4 text-blue-600" />
                    <span>Back to Configurator</span>
                  </button>

                  <button
                    onClick={() => setSharingProduct(selectedProduct)}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700/80 px-4 py-2 rounded-full transition-all cursor-pointer shadow-xs hover:shadow-sm"
                  >
                    <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Share This Service</span>
                    <span className="hidden sm:inline text-[11px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-medium">WhatsApp / Link</span>
                  </button>
                </div>

                <ProductCustomizer
                  product={selectedProduct}
                  onAddedToCart={() => {
                    // Drawer automatically opens via CartContext
                  }}
                  onShare={(prod) => setSharingProduct(prod)}
                  onInstantCheckout={() => {
                    setIsCheckoutOpen(true);
                  }}
                />
              </div>
            )}

            {/* Order Tracking View */}
            {currentView === 'track' && (
              <OrderTrackingView
                initialOrderNumber={trackingOrderNumber}
                onNavigateHome={() => setCurrentView('home')}
              />
            )}
          </main>

          <Footer onNavigate={handleNavigate} />
        </>
      )}

      {/* Cart Drawer */}
      <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderCreated={handleOrderCreated}
          onOpenCustomerAuth={() => setIsCustomerAuthOpen(true)}
        />
      )}

      {/* Dynamic UPI Payment Modal */}
      {showPaymentModal && activeCreatedOrder && (
        <UpiPaymentModal
          orderNumber={activeCreatedOrder.order_number}
          amount={activeCreatedOrder.grand_total}
          customerName={activeCreatedOrder.customer_name}
          customerPhone={activeCreatedOrder.customer_phone}
          onPaymentSubmitted={handlePaymentSubmitted}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {/* Order Success & Celebration Modal */}
      {showSuccessModal && activeCreatedOrder && (
        <OrderSuccessModal
          order={activeCreatedOrder}
          onTrackOrder={(num) => {
            setShowSuccessModal(false);
            setTrackingOrderNumber(num);
            setCurrentView('track');
          }}
          onClose={() => {
            setShowSuccessModal(false);
            setCurrentView('home');
          }}
        />
      )}

      {/* Customer Mobile OTP Auth Modal */}
      <CustomerAuthModal
        isOpen={isCustomerAuthOpen}
        onClose={() => setIsCustomerAuthOpen(false)}
        onSuccess={() => {
          setIsCustomerAuthOpen(false);
          setIsCustomerOrdersOpen(true);
        }}
      />

      {/* Customer Account & Order History Modal */}
      <CustomerOrdersModal
        isOpen={isCustomerOrdersOpen}
        onClose={() => setIsCustomerOrdersOpen(false)}
        onTrackOrder={(num) => {
          setIsCustomerOrdersOpen(false);
          setTrackingOrderNumber(num);
          setCurrentView('track');
        }}
        onStartShopping={() => {
          setIsCustomerOrdersOpen(false);
          setCurrentView('home');
          setSelectedCategorySlug('all');
        }}
      />

      {/* Share Product & Promo Banners Modal */}
      <ShareProductModal
        isOpen={Boolean(sharingProduct)}
        product={sharingProduct}
        onClose={() => setSharingProduct(null)}
      />
    </div>
  );
};
