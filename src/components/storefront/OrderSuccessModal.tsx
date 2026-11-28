import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Order } from '../../types';
import { CheckCircle2, Copy, MessageCircle, ExternalLink, ShieldCheck, FolderCheck } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface OrderSuccessModalProps {
  order: Order;
  onTrackOrder: (orderNumber: string) => void;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onTrackOrder,
  onClose
}) => {
  const { settings } = useSettings();
  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const [copied, setCopied] = React.useState(false);

  const copyOrder = () => {
    navigator.clipboard.writeText(order.order_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanPhone = String(settings.whatsapp_number || '916354871446').replace(/[^0-9]/g, '');
  const brandName = settings.business_name || settings.brand_title || 'Akshar PrintShop Pro';
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello ${brandName}, I have placed Order ${order.order_number} for ₹${order.grand_total.toLocaleString('en-IN')}. Please confirm production.`
  )}`;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden my-8 animate-scale-in text-center p-8 space-y-6">
        <div className="flex items-center justify-center gap-4">
          <div className="w-18 h-18 rounded-2xl p-2 bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-800 ring-2 ring-blue-500/20 shadow-md flex items-center justify-center">
            <img src="/logo-mark.png" alt="Akshar PrintShop Pro Production Logo" className="w-full h-full object-contain" />
          </div>
          <div className="w-18 h-18 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>
        </div>

        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            Order Successfully Placed
          </span>
          <h2 className="font-extrabold text-3xl text-slate-900 dark:text-white mt-3">
            Thank you, {order.customer_name}!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Your customized print job has been received by our digital press studio.
          </p>
        </div>

        {/* Order Reference Box */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Your Unique Order Reference:</p>
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono text-xl font-bold text-blue-950 dark:text-blue-300 tracking-wider">
              {order.order_number}
            </span>
            <button
              onClick={copyOrder}
              className="p-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              title="Copy Order Number"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {copied && <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold block">✓ Copied to clipboard!</span>}

          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <FolderCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Google Drive Order Storage: {order.google_drive_folder || 'Akshar PrintShop Pro Orders/2026/09/29/' + order.order_number}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => onTrackOrder(order.order_number)}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold py-3.5 px-4 rounded-xl text-sm shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Track Order & Review Design Proof</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Notify Akshar PrintShop Pro on WhatsApp (+91 63548 71446)</span>
          </a>

          <button
            onClick={onClose}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium pt-2 block mx-auto underline cursor-pointer"
          >
            Return to Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
