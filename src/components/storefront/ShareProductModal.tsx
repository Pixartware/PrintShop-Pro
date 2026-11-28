import React, { useState } from 'react';
import { Product } from '../../types';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  ExternalLink, 
  Send, 
  Mail,
  Sparkles,
  Download,
  Image as ImageIcon,
  CheckCircle2,
  Maximize2,
  Layers
} from 'lucide-react';

interface ShareProductModalProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'banners' | 'link';
}

export const ShareProductModal: React.FC<ShareProductModalProps> = ({
  product,
  isOpen,
  onClose,
  initialTab = 'banners'
}) => {
  const [activeTab, setActiveTab] = useState<'banners' | 'link'>(product ? initialTab : 'banners');
  const [bannerType, setBannerType] = useState<'landscape' | 'square'>('landscape');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedImgLink, setCopiedImgLink] = useState(false);

  if (!isOpen) return null;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://printshop-pro.vercel.app';
  const shareUrl = product ? `${baseUrl}/p/${encodeURIComponent(product.sku)}` : baseUrl;
  
  const landscapeBannerUrl = `${baseUrl}/og-banner.jpg`;
  const squareBannerUrl = `${baseUrl}/social-square.jpg`;
  const currentBannerUrl = bannerType === 'landscape' ? landscapeBannerUrl : squareBannerUrl;
  const currentBannerDownloadName = bannerType === 'landscape' 
    ? 'Akshar-PrintShop-Pro-Social-Banner.jpg' 
    : 'Akshar-PrintShop-Pro-Instagram-Status.jpg';

  const primaryImg = product?.images?.[0] || '/catalog-images/00 Personalized Print Service/01 Custom Printing Showcase_ Flyers, Cards & Stickers-5.jpg';

  // Format WhatsApp Share Message
  const whatsappMessage = product
    ? `✨ *Akshar PrintShop Pro Commercial Printing* ✨\n\n🖨️ *${product.name}*\n🏷️ Category: ${product.category}\n💰 Starting at: *₹${product.selling_price.toLocaleString('en-IN')}*\n\n👉 *Configure & Order Online:*\n${shareUrl}\n\n💬 *Direct WhatsApp:* +91 63548 71446`
    : `✨ *Akshar PrintShop Pro — Commercial Digital Printing* ✨\n\n🖨️ 100 to 350 GSM Papers • Gloss & Velvet Matte Lamination\n🏷️ Precision Kiss-Cut Vinyl Stickers & Labels\n📦 Boutique Packaging, Visiting Cards, Flyers & Booklets\n⚡ Instant Online Customizer & Dynamic UPI QR\n\n👉 *Configure & Order Online:*\n${baseUrl}\n\n💬 *WhatsApp Inquiries:* +91 63548 71446`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(product ? `Check out ${product.name} at Akshar PrintShop Pro!` : 'Check out Akshar PrintShop Pro — Commercial Digital Printing!')}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(product ? `Check out ${product.name} at Akshar PrintShop Pro` : 'Akshar PrintShop Pro — Commercial Digital Printing')}&body=${encodeURIComponent(whatsappMessage)}`;

  const copyToClipboard = async (text: string, setCopiedState: (v: boolean) => void) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2500);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownloadBanner = () => {
    const link = document.createElement('a');
    link.href = currentBannerUrl;
    link.download = currentBannerDownloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product ? `${product.name} | Akshar PrintShop Pro` : 'Akshar PrintShop Pro — Commercial Digital Printing',
          text: product ? `Check out ${product.name} on Akshar PrintShop Pro (Starting at ₹${product.selling_price}):` : 'Akshar PrintShop Pro — Commercial Digital Printing & Finishing',
          url: shareUrl,
        });
      } catch (err) {
        // user cancelled
      }
    } else {
      copyToClipboard(shareUrl, setCopiedLink);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scale-in my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-900/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white leading-tight">
                Social Media Sharing & Banners
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official promotional posters, flyers & instant WhatsApp links
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('banners')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'banners'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/90 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Studio Promo Banners</span>
            <span className="text-[10px] bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 font-bold px-1.5 py-0.2 rounded-full">
              HD
            </span>
          </button>

          {product && (
            <button
              type="button"
              onClick={() => setActiveTab('link')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'link'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/90 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Direct Product Link</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {activeTab === 'banners' ? (
            /* TAB 1: STUDIO PROMO BANNERS */
            <div className="space-y-4">
              {/* Aspect Ratio Switcher */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Select Banner Format:
                </span>
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setBannerType('landscape')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      bannerType === 'landscape'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>16:9 Landscape (1200×630)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBannerType('square')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      bannerType === 'square'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>1:1 Square (1080×1080)</span>
                  </button>
                </div>
              </div>

              {/* Banner Visual Preview Box */}
              <div className="relative group rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-950 shadow-lg">
                <img
                  src={currentBannerUrl}
                  alt="Akshar PrintShop Pro Social Media Sharing Banner"
                  className={`w-full object-contain transition-transform duration-300 group-hover:scale-[1.01] ${
                    bannerType === 'square' ? 'max-h-[340px]' : 'max-h-[260px]'
                  }`}
                />
                <a
                  href={currentBannerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-3 right-3 bg-black/80 hover:bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-xl backdrop-blur-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>View Full HD</span>
                </a>
              </div>

              {/* Banner Details & Tags */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                <span>
                  Format: <strong className="text-slate-800 dark:text-slate-200">{bannerType === 'landscape' ? '1200 × 630 px (OpenGraph Standard)' : '1080 × 1080 px (Square Post)'}</strong>
                </span>
                <span>
                  Ready for: <strong className="text-blue-600 dark:text-blue-400">WhatsApp, Instagram & Facebook</strong>
                </span>
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* 1. Download HD Banner */}
                <button
                  type="button"
                  onClick={handleDownloadBanner}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-2xl transition-all shadow-md shadow-blue-900/20 cursor-pointer text-xs sm:text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download HD Banner</span>
                </button>

                {/* 2. Share Directly on WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-bold py-3 px-4 rounded-2xl transition-all shadow-md cursor-pointer text-xs sm:text-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                  <span>Share on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-75 ml-auto" />
                </a>
              </div>

              {/* Quick Image CDN Link Copy */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Public Banner URL (For Social Posts & Ads)
                  </span>
                  <span className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate block">
                    {currentBannerUrl}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(currentBannerUrl, setCopiedImgLink)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    copiedImgLink
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {copiedImgLink ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Image Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Gujarati guidance */}
              <div className="p-3 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-950 dark:text-blue-200/90 leading-relaxed flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-900 dark:text-blue-300">
                    સોશિયલ મીડિયા સ્ટેટસ અને ગ્રૂપ શેરિંગ માટે:
                  </p>
                  <p className="mt-0.5 text-[11px] text-blue-800/90 dark:text-blue-200/80">
                    તમે આ HD બેનર ડાઉનલોડ કરીને WhatsApp સ્ટેટસ, Instagram સ્ટોરી, Facebook કે ગ્રાહકોને મોકલી શકો છો. WhatsApp પર લિંક શેર કરતાં જ આ બેનર ઓટોમેટિક પ્રિવ્યૂમાં પણ દેખાશે!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: DIRECT PRODUCT LINK */
            product && (
              <div className="space-y-4">
                {/* Product Card Preview */}
                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                  <img 
                    src={primaryImg} 
                    alt={product.name} 
                    className="w-16 h-16 rounded-xl object-contain border border-slate-200 dark:border-slate-700 shrink-0 bg-white dark:bg-slate-800 p-1" 
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {product.category}
                    </span>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-200">
                        ₹{product.selling_price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        • SKU: {product.sku}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Action 1: WhatsApp Share */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-bold py-3.5 px-5 rounded-2xl transition-all shadow-md hover:shadow-lg cursor-pointer text-sm sm:text-base"
                >
                  <MessageCircle className="w-5 h-5 fill-white stroke-none" />
                  <span>Share Product on WhatsApp</span>
                  <ExternalLink className="w-4 h-4 opacity-75 ml-auto" />
                </a>

                {/* Primary Action 2: Direct URL Copy Box */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Product Deep Link (Direct Page)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-xl px-3.5 py-2.5 font-mono select-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(shareUrl, setCopiedLink)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                        copiedLink
                          ? 'bg-emerald-600 text-white border border-emerald-600'
                          : 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600'
                      }`}
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Alternative Platforms */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer text-center"
                  >
                    <Share2 className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-1" />
                    <span className="text-[11px] font-semibold">More Apps</span>
                  </button>

                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer text-center"
                  >
                    <Send className="w-4 h-4 text-sky-500 mb-1" />
                    <span className="text-[11px] font-semibold">Telegram</span>
                  </a>

                  <a
                    href={emailUrl}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer text-center"
                  >
                    <Mail className="w-4 h-4 text-rose-500 mb-1" />
                    <span className="text-[11px] font-semibold">Email</span>
                  </a>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
