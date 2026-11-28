import React, { useState } from 'react';
import { ShoppingBag, Compass, MessageCircle, Menu, X, ArrowRight, User, Sparkles, Printer } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useSettings } from '../../context/SettingsContext';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  onNavigate: (view: string, param?: string) => void;
  currentView: string;
  onSearchChange: (q: string) => void;
  searchQuery: string;
  onOpenCustomerAuth?: () => void;
  onOpenCustomerAccount?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  currentView,
  onSearchChange,
  searchQuery,
  onOpenCustomerAuth,
  onOpenCustomerAccount
}) => {
  const { itemCount, setIsCartOpen } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { customer, isLoggedIn, orders } = useCustomerAuth();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cleanPhone = String(settings.whatsapp_number || '916354871446').replace(/[^0-9]/g, '');
  const brandTitle = settings.brand_title || 'Akshar PrintShop Pro';
  const freeShippingThreshold = settings.free_shipping_threshold || 1000;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 text-center font-medium tracking-wide flex justify-center items-center gap-3">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>Professional Commercial Digital Printing • 100 to 350 GSM Sheets • Thermal Lamination & Precision Kiss-Cut</span>
        </span>
        <a
          href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(brandTitle)}%2C%20I%20have%20an%20enquiry%20about%20custom%20sheet%20printing`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 underline font-semibold ml-2"
        >
          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Support
        </a>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between h-20 sm:h-22 gap-4">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => onNavigate('home')}
            className="cursor-pointer flex items-center gap-3.5 group select-none shrink-0"
          >
            <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl p-1.5 bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 ring-2 ring-blue-600/20 group-hover:scale-105 group-hover:ring-blue-600/40 transition-all shrink-0 flex items-center justify-center">
              <img
                src="/logo-mark.png"
                alt="Akshar PrintShop Pro Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-extrabold text-2xl sm:text-3xl tracking-tight text-slate-900 dark:text-white flex items-center leading-none">
                <span>Akshar</span>
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent ml-1.5">PrintShop</span>
                <span className="text-orange-500 ml-1">Pro</span>
              </div>
              <span className="block text-[11px] sm:text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 mt-1">
                Print Smart. Impress More.
              </span>
            </div>
          </div>

          {/* Quick Header Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-blue-600" />
              <span>Print Configurator</span>
            </button>
            <button
              onClick={() => onNavigate('track')}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'track' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
              }`}
            >
              <Compass className="w-4 h-4 text-orange-500" />
              <span>Track Order</span>
            </button>
            <a
              href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(brandTitle)}%2C%20I%20have%20an%20enquiry%20about%20custom%20printing`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-600 transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              <span>Direct WhatsApp</span>
            </a>
          </nav>

          {/* Actions: Account, Track, Theme, Cart */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Customer Login / My Account */}
            {isLoggedIn && customer ? (
              <button
                type="button"
                onClick={onOpenCustomerAccount}
                className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold py-2 px-3 sm:px-3.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-200 hover:bg-blue-100 transition-all shadow-xs cursor-pointer"
                title="View My Orders and Account"
              >
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold shrink-0">
                  {customer.name ? customer.name[0].toUpperCase() : 'C'}
                </div>
                <span className="hidden sm:inline max-w-[90px] truncate font-bold">
                  {customer.name || customer.phone.slice(-4)}
                </span>
                {orders.length > 0 && (
                  <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {orders.length}
                  </span>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenCustomerAuth}
                className="flex items-center gap-1.5 text-xs font-semibold py-2 px-3.5 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-blue-400 transition-all shadow-xs cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Login</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('track')}
              className={`hidden sm:flex lg:hidden items-center gap-1.5 text-xs font-semibold py-2 px-3.5 rounded-full transition-colors cursor-pointer ${
                currentView === 'track'
                  ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-200 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Compass className="w-4 h-4 text-orange-500" />
              <span>Track</span>
            </button>

            {/* Dark / Light / System Mode Toggle */}
            <ThemeToggle />

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center shadow-xs cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-scale-in">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-blue-600" />
              <span>Custom Printing Configurator</span>
            </button>

            <button
              onClick={() => {
                onNavigate('track');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-orange-500" />
              <span>Track Your Order</span>
            </button>

            <a
              href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(brandTitle)}%2C%20I%20have%20an%20enquiry%20about%20custom%20printing`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-left py-2 px-3 rounded-xl text-sm font-semibold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              <span>WhatsApp Chat (+{cleanPhone})</span>
            </a>
          </div>
        )}
      </div>
    </header>
  );
};
