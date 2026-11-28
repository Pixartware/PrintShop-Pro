import React from 'react';
import { MessageCircle, ShieldCheck, Heart, MapPin, Mail, Phone, ExternalLink, Printer, Share2 } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const Footer: React.FC<{ 
  onNavigate: (v: string, p?: string) => void;
  onOpenShareModal?: () => void;
}> = ({ onNavigate, onOpenShareModal }) => {
  const { settings } = useSettings();
  const cleanPhone = String(settings.whatsapp_number || '916354871446').replace(/[^0-9]/g, '');
  const brandName = settings.brand_title || 'Akshar PrintShop Pro';
  const upiId = settings.upi_id || 'aksharstudio-2@okicici';

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-850">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl p-1 bg-white border border-slate-700 ring-2 ring-blue-500/40 flex items-center justify-center shrink-0 shadow-lg">
                <img src="/logo-mark.png" alt="Akshar PrintShop Pro Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="font-extrabold text-2xl text-white tracking-tight leading-none">
                  <span>Akshar</span>
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent ml-1">PrintShop</span>
                  <span className="text-orange-500 ml-1">Pro</span>
                </div>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">
                  Print Smart. Impress More.
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hitesh Bhesaniya Production. Commercial-grade digital presses, 100 to 350 GSM substrates, thermal lamination, computer kiss-cut sticker finishing & dynamic UPI verification.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] bg-slate-900 text-blue-400 px-3 py-1 rounded-full font-medium border border-slate-800">
                Studio in Ahmedabad & Una, Gujarat
              </span>
            </div>
          </div>

          {/* Quick Services */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Printing Capabilities
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-blue-400 transition-colors cursor-pointer">
                  12×18 & 13×19 Sheet Digital Printing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-blue-400 transition-colors cursor-pointer">
                  100 GSM to 350 GSM Art Papers & Boards
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-blue-400 transition-colors cursor-pointer">
                  Thermal Gloss & Velvet Matte Lamination
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-blue-400 transition-colors cursor-pointer">
                  Precision Computer Kiss-Cut Stickers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-blue-400 transition-colors cursor-pointer">
                  Opaque & Transparent Waterproof Vinyl
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Order & Tracking
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('track')} className="hover:text-orange-400 transition-colors flex items-center gap-1.5 font-medium text-orange-400 cursor-pointer">
                  <span>Track Existing Order Status</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
              {onOpenShareModal && (
                <li>
                  <button onClick={onOpenShareModal} className="hover:text-blue-400 transition-colors flex items-center gap-1.5 font-medium text-blue-400 cursor-pointer">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Social Media Banners & Flyers</span>
                  </button>
                </li>
              )}
              <li>
                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${brandName} Team, I need assistance with my print job`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp: +{cleanPhone}</span>
                </a>
              </li>
              <li className="text-[11px] text-slate-400">
                Official UPI: <span className="font-mono text-slate-200">{upiId}</span>
              </li>
              <li className="text-[11px] text-slate-400">
                Operating Hours: 10:00 AM – 8:00 PM (Mon–Sat)
              </li>
            </ul>
          </div>

          {/* Trust Guarantees */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-2">
              Studio Assurance
            </h4>
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white block">Pre-Print Inspection</span>
                <span className="text-[11px] text-slate-400">
                  Artwork color profiles and bleeds inspected before pressing.
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <Printer className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white block">Accurate Live Pricing</span>
                <span className="text-[11px] text-slate-400">
                  Transparent Unit Cost × Quantity pricing with zero hidden surcharges.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {brandName} • Hitesh Bhesaniya Production. All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Engineered for high-volume commercial digital printing.
          </p>
        </div>
      </div>
    </footer>
  );
};
