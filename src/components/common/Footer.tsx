import React from 'react';
import { MessageCircle, ShieldCheck, Heart, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const Footer: React.FC<{ onNavigate: (v: string, p?: string) => void }> = ({ onNavigate }) => {
  const { settings } = useSettings();
  const cleanPhone = String(settings.whatsapp_number || '916354871446').replace(/[^0-9]/g, '');
  const brandName = settings.brand_title || 'Akshar PrintShop Pro';
  const upiId = settings.upi_id || 'aksharstudio-2@okicici';

  return (
    <footer className="bg-[#1E293B] dark:bg-[#0C0B0A] text-slate-300 dark:text-stone-300 pt-16 pb-12 border-t border-slate-800 dark:border-stone-850">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-700/80 dark:border-stone-800">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-full p-1 bg-white border border-slate-700 ring-2 ring-amber-500/40 flex items-center justify-center shrink-0 shadow-lg">
                <img src="/logo.png" alt="Akshar PrintShop Pro Production Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-white tracking-tight">
                  Akshar PrintShop Pro
                </span>
                <span className="block text-[11px] uppercase font-bold tracking-widest text-blue-400">
                  Commercial Digital Printing Hub
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hitesh Bhesaniya Production. High-speed digital offset printing, 100 to 350 GSM paper stocks, thermal gloss/matte lamination, and precision kiss-cutting with instant dynamic UPI verification.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[11px] bg-slate-800 text-blue-300 px-3 py-1 rounded-full font-medium border border-slate-700">
                Studio in Ahmedabad & Una, Gujarat
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white font-serif font-bold text-sm uppercase tracking-wider mb-4">
              Printing & Finishing
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('product', 'PERSONALIZED_PRINT_SERVICE')} className="hover:text-blue-400 transition-colors">
                  Personalized Printing Service (12x18 / 13x19)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'printing')} className="hover:text-blue-400 transition-colors">
                  Custom Die-Cut Sticker Sheets
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'printing')} className="hover:text-blue-400 transition-colors">
                  Visiting Cards & Luxury Hang Tags
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'printing')} className="hover:text-blue-400 transition-colors">
                  Commercial Flyers & Marketing Brochures
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'printing')} className="hover:text-blue-400 transition-colors">
                  Architectural & Fine Art Posters
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'printing')} className="hover:text-blue-400 transition-colors">
                  Packaging Sleeves & Custom Boxes
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-white font-serif font-bold text-sm uppercase tracking-wider mb-4">
              Order & Support
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('track')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5 font-medium text-amber-300">
                  <span>Track Existing Order</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
              <li>
                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${brandName} Team, I need assistance with customization`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp: +{cleanPhone}</span>
                </a>
              </li>
              <li>
                <a href="mailto:support@craftique.in" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>support@craftique.in</span>
                </a>
              </li>
              <li>
                <button onClick={() => onNavigate('track')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Track Your Custom Order
                </button>
              </li>
            </ul>
          </div>

          {/* Verified UPI Payment & Security */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-sm uppercase tracking-wider mb-4">
              Instant UPI Payment
            </h4>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Direct & Verified UPI</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Dynamic QR code generated on checkout to: <br/>
                <span className="font-mono text-amber-300 select-all font-semibold">{upiId}</span>
              </p>
              <p className="text-[10px] text-slate-500">
                Supports Google Pay, PhonePe, Paytm, BHIM and all banking apps.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Akshar PrintShop Pro. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Handcrafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for creators, couples, and homes across India.
          </p>
        </div>

      </div>
    </footer>
  );
};
