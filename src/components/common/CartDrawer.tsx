import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    tax,
    shipping,
    grandTotal,
    freeShippingThreshold
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingGoal = freeShippingThreshold || 1500;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingGoal) * 100));
  const amountNeeded = Math.max(0, freeShippingGoal - subtotal);


  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">Your Print Cart</h2>
              <span className="text-xs bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full">
                {cart.length} {cart.length === 1 ? 'job' : 'jobs'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-blue-50/70 dark:bg-blue-950/40 px-5 py-3 border-b border-blue-200/50 dark:border-blue-900/40 text-xs">
            {amountNeeded > 0 ? (
              <p className="text-blue-950 dark:text-blue-200 font-medium">
                Add <span className="font-bold text-blue-600 dark:text-blue-400">₹{amountNeeded}</span> more for <span className="font-bold text-emerald-600 dark:text-emerald-400">FREE SHIPPING</span>
              </p>
            ) : (
              <p className="text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> You have unlocked FREE Express Shipping!
              </p>
            )}
            <div className="w-full bg-blue-200/60 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">Your print cart is empty</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Configure custom sheet sizes, lamination, kiss-cut stickers, and digital press jobs.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md shadow-blue-600/25 cursor-pointer"
                >
                  Start Customizing <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cart_item_id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <div className="flex gap-3">
                    {/* Thumbnail Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 relative flex items-center justify-center">
                      <img
                        src={item.customization.photos?.[0]?.url || item.image}
                        alt={item.product_name}
                        className="w-full h-full object-contain p-1"
                      />
                      {item.customization.photos && item.customization.photos.length > 1 && (
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 py-0.2 rounded font-bold">
                          +{item.customization.photos.length - 1} files
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {item.product_name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cart_item_id)}
                          className="text-slate-400 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 space-y-0.5">
                        <p><span className="font-medium text-slate-700 dark:text-slate-300">Size:</span> {item.size}</p>
                        <p><span className="font-medium text-slate-700 dark:text-slate-300">Material:</span> {item.material}</p>
                        {item.customization.photos && item.customization.photos.length > 0 && (
                          <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                            ✓ {item.customization.photos.length} Design Files Attached
                          </p>
                        )}
                        {item.customization.notes && (
                          <p className="text-blue-800 dark:text-blue-300 italic truncate font-medium">
                            "{item.customization.notes}"
                          </p>
                        )}
                      </div>

                      {/* Quantity & Unit Price */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                          <button
                            onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                            className="p-1 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-800 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                            className="p-1 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-extrabold text-sm text-blue-600 dark:text-blue-400">
                          ₹{item.total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                    <span>Volume Discount (5%)</span>
                    <span className="font-semibold">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (18% Included)</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {shipping === 0 ? <span className="text-emerald-700 dark:text-emerald-400 uppercase font-bold">FREE</span> : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Grand Total</span>
                  <span className="text-base text-blue-600 dark:text-blue-400 font-extrabold">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onCheckout();
                }}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all text-sm group cursor-pointer"
              >
                <span>Proceed to Instant UPI Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Zero convenience fee • Direct UPI payment to Akshar PrintShop Pro</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
