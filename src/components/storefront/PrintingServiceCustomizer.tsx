import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { 
  Printer, Layers, Scissors, Sparkles, UploadCloud, Check, Plus, 
  Trash2, FileText, Image as ImageIcon, AlertCircle, ShoppingBag, 
  ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, ShieldCheck, 
  HelpCircle, Share2, Smartphone, IndianRupee, Download, Send, X, Lock
} from 'lucide-react';

export interface PrintingServiceCustomizerProps {
  product?: Product;
  onAddedToCart?: () => void;
  onShare?: (product: Product) => void;
  onInstantCheckout?: () => void;
}

// --- CONFIGURATION ---
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRwtwNObuYTQXaZA9sOQW8mfArrfosgT2TqoK-s5w8FtYNYwDl6ZaeauhRD_Nz2cF_/exec";
const UPI_ID = "aksharstudio-2@okicici"; 
const BUSINESS_NAME = "Akshar PrintShop Pro";
const WHATSAPP_NUMBER = "916354871446";

// Complete pricing matrix provided by Akshar PrintShop Pro
export const DEFAULT_PRINTING_PRICING = [
  {
    media: "350 Gsm",
    tagline: "Ultra heavyweight rigid cardstock",
    desc: "Premium luxury cardstock for high-end business cards, invitation cards, luxury wedding stationery, and packaging.",
    sizes: [
      { name: "12x18 (Single)", lamination: 4.5, cutting: null, baseCost: 14 },
      { name: "12x18 (Both side)", lamination: 6, cutting: null, baseCost: 17 },
      { name: "13x19 (Single)", lamination: 4.75, cutting: null, baseCost: 15 },
      { name: "13x19 (Both side)", lamination: 6.5, cutting: null, baseCost: 18 },
    ]
  },
  {
    media: "300 Gsm",
    tagline: "Heavyweight premium cardstock (Most Popular)",
    desc: "Sturdy cardstock with exceptional ink holdout. Ideal for certificate prints, greeting cards, product tags, and menus.",
    sizes: [
      { name: "12x18 (Single)", lamination: 4.5, cutting: null, baseCost: 13 },
      { name: "12x18 (Both side)", lamination: 6, cutting: null, baseCost: 16 },
      { name: "13x19 (Single)", lamination: 4.75, cutting: null, baseCost: 14 },
      { name: "13x19 (Both side)", lamination: 6.5, cutting: null, baseCost: 17 },
    ]
  },
  {
    media: "250 Gsm",
    tagline: "Medium-heavy flexible cardstock",
    desc: "Versatile medium cardstock perfect for photobook covers, corporate folders, flyers, and table tent cards.",
    sizes: [
      { name: "12x18 (Single)", lamination: 4.5, cutting: null, baseCost: 12 },
      { name: "12x18 (Both side)", lamination: 6, cutting: null, baseCost: 15 },
      { name: "13x19 (Single)", lamination: 4.75, cutting: null, baseCost: 13 },
      { name: "13x19 (Both side)", lamination: 6.5, cutting: null, baseCost: 16 },
    ]
  },
  {
    media: "210 Gsm",
    tagline: "Standard cardstock for promotional print",
    desc: "Economical sturdy paper for promotional handouts, brochures, book divider pages, and event programs.",
    sizes: [
      { name: "12x18 (Single)", lamination: 4.5, cutting: null, baseCost: 11.5 },
      { name: "12x18 (Both side)", lamination: 6, cutting: null, baseCost: 14 },
      { name: "13x19 (Single)", lamination: 4.75, cutting: null, baseCost: 12 },
      { name: "13x19 (Both side)", lamination: 6.5, cutting: null, baseCost: 15 },
    ]
  },
  {
    media: "170 Gsm",
    tagline: "Smooth coated paper",
    desc: "Lightweight art paper suitable for multi-page magazine inserts, marketing leaflets, newsletters, and folded flyers.",
    sizes: [
      { name: "12x18 (Single)", lamination: 4.5, cutting: null, baseCost: 11 },
      { name: "12x18 (Both side)", lamination: 6, cutting: null, baseCost: 14 },
      { name: "13x19 (Single)", lamination: 4.75, cutting: null, baseCost: 12 },
      { name: "13x19 (Both side)", lamination: 6.5, cutting: null, baseCost: 15 },
    ]
  },
  {
    media: "100 /130 Gsm",
    tagline: "Budget everyday light paper",
    desc: "Thin, cost-effective sheets for bulk instructional leaflets, daily invoices, parcel inserts, and lightweight posters.",
    sizes: [
      { name: "12x18 (Single)", lamination: 4.5, cutting: null, baseCost: 10 },
      { name: "12x18 (Both side)", lamination: 6, cutting: null, baseCost: 13 },
      { name: "13x19 (Single)", lamination: 4.75, cutting: null, baseCost: 11 },
      { name: "13x19 (Both side)", lamination: 6.5, cutting: null, baseCost: 14 },
    ]
  },
  {
    media: "Sticker Sheet",
    tagline: "Self-adhesive paper & vinyl with optional Half Cut",
    desc: "High-tack self-adhesive label stock. Optional CNC kiss-cut / half-cut lets you easily peel round, square, or custom shapes.",
    sizes: [
      { name: "12x18 (Single)", lamination: 4.5, cutting: 8, baseCost: 13 },
      { name: "13x19 (Single)", lamination: 4.75, cutting: 9, baseCost: 16 },
    ]
  },
  {
    media: "OPEQUE / TRANSPRENT",
    tagline: "Specialty synthetic non-tear film",
    desc: "Waterproof synthetic polymer film in Opaque White or Crystal Clear. Perfect for boutique cosmetic jars, beverage labels, and frost overlays.",
    sizes: [
      { name: "12x18 (Single)", lamination: null, cutting: null, baseCost: 17 },
      { name: "13x19 (Single)", lamination: null, cutting: null, baseCost: 20 },
    ]
  },
  {
    media: "A3 Letter Head",
    tagline: "Executive bond paper",
    desc: "Premium bond sheet specially calibrated for corporate stationery, official contracts, certificates, and header documents.",
    sizes: [
      { name: "A3 (Single)", lamination: null, cutting: null, baseCost: 9.5 },
    ]
  },
  {
    media: "PARTY PAPER PRINTING",
    tagline: "Vibrant high-contrast party banner sheet",
    desc: "Ultra-vibrant color density stock optimized for birthday party decorations, event welcome signage, and photo banners.",
    sizes: [
      { name: "13*19 (Single)", lamination: null, cutting: null, baseCost: 9 },
    ]
  }
];

export const PrintingServiceCustomizer: React.FC<PrintingServiceCustomizerProps> = ({
  product,
  onAddedToCart,
  onShare,
  onInstantCheckout
}) => {
  const { addToCart } = useCart();

  // Workflow Step (1: Form/Specs, 2: UPI Payment, 3: Confirmed / Receipt)
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [orderId, setOrderId] = useState('ORD-DATE-SN');
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    deliveryMode: 'Door Pickup'
  });

  // Print items state (multi-item calculator)
  const [printItems, setPrintItems] = useState([
    {
      id: 1,
      media: DEFAULT_PRINTING_PRICING[0].media,
      size: DEFAULT_PRINTING_PRICING[0].sizes[0].name,
      lamination: false,
      cutting: false,
      qty: 1
    }
  ]);

  const [files, setFiles] = useState<File[]>([]);
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Gallery active index for product showcase images
  const showcaseImages = product?.images && product.images.length > 0 ? product.images : [
    "/catalog-images/00.%20Personalized%20Print%20Service/01%20Custom%20Printing%20Showcase_%20Flyers,%20Cards%20&%20Stickers-5.jpg",
    "/catalog-images/00.%20Personalized%20Print%20Service/01%20Personalised%20Print%20Services%20Infographic%20Grid.jpg",
    "/catalog-images/00.%20Personalized%20Print%20Service/01%20Personalized%20Print%20Service%20Showcase-1.jpg",
    "/catalog-images/00.%20Personalized%20Print%20Service/02%20Print%20Sheet%20Size%20Comparison-3.jpg",
    "/catalog-images/00.%20Personalized%20Print%20Service/03%20Premium%20Media%20&%20Sticker%20Guide.jpg",
    "/catalog-images/00.%20Personalized%20Print%20Service/04%20Premium%20Lamination%20Finish%20Options.jpg"
  ];
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Sequential Order ID Generator YYYYMMDD-001
  useEffect(() => {
    if (step === 1 && orderId === 'ORD-DATE-SN') {
      const now = new Date();
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
      const localSeq = parseInt(localStorage.getItem(`seq_${dateStr}`) || '0', 10) + 1;
      localStorage.setItem(`seq_${dateStr}`, String(localSeq));
      setOrderId(`ORD-${dateStr}-${String(localSeq).padStart(3, '0')}`);
    }
  }, [step, orderId]);

  // Pricing Calculation
  const calculatedItems = printItems.map(item => {
    const mediaDef = DEFAULT_PRINTING_PRICING.find(m => m.media === item.media) || DEFAULT_PRINTING_PRICING[0];
    const sizeDef = mediaDef.sizes.find(s => s.name === item.size) || mediaDef.sizes[0] || { baseCost: 0, lamination: null, cutting: null };

    let unitCost = sizeDef.baseCost;
    if (item.lamination && sizeDef.lamination !== null) unitCost += sizeDef.lamination;
    if (item.cutting && sizeDef.cutting !== null) unitCost += sizeDef.cutting;

    return {
      ...item,
      unitCost,
      total: unitCost * item.qty,
      canLaminate: sizeDef.lamination !== null,
      canCut: sizeDef.cutting !== null,
      mediaDef
    };
  });

  const totalAmount = calculatedItems.reduce((sum, item) => sum + item.total, 0);
  const totalQuantity = calculatedItems.reduce((sum, item) => sum + Number(item.qty), 0);

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(BUSINESS_NAME)}&am=${totalAmount}&cu=INR`;
  const gpayLink = `gpay://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(BUSINESS_NAME)}&am=${totalAmount}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (id: number, field: string, value: any) => {
    setPrintItems(items => items.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === 'media') {
        const newMediaDef = DEFAULT_PRINTING_PRICING.find(m => m.media === value);
        if (newMediaDef && newMediaDef.sizes.length > 0) {
          updated.size = newMediaDef.sizes[0].name;
          updated.lamination = false;
          updated.cutting = false;
        }
      }
      return updated;
    }));
  };

  const addItem = () => {
    setPrintItems([
      ...printItems,
      {
        id: Date.now(),
        media: DEFAULT_PRINTING_PRICING[0].media,
        size: DEFAULT_PRINTING_PRICING[0].sizes[0].name,
        lamination: false,
        cutting: false,
        qty: 1
      }
    ]);
  };

  const removeItem = (id: number) => {
    if (printItems.length > 1) {
      setPrintItems(items => items.filter(item => item.id !== id));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const allowedExtensions = ['.zip', '.rar', '.jpg', '.jpeg', '.pdf', '.cdr', '.psd', '.png', '.ai'];
      
      const validFiles = selectedFiles.filter(f => 
        allowedExtensions.some(ext => f.name.toLowerCase().endsWith(ext))
      );
      
      if (validFiles.length !== selectedFiles.length) {
        setErrorMsg("Some files were skipped. Supported: ZIP, RAR, CDR, PSD, AI, PDF, JPG, PNG.");
      } else {
        setErrorMsg("");
      }
      setFiles(prev => [...prev, ...validFiles]);
    }
    e.target.value = '';
  };

  const removeSelectedFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const validateStep1 = () => {
    if (!formData.name.trim() || !formData.mobile.trim() || !formData.email.trim() || files.length === 0) {
      setErrorMsg("Please fill in customer details and upload at least one design file.");
      return false;
    }
    if (formData.mobile.replace(/\D/g, '').length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return false;
    }
    setErrorMsg('');
    return true;
  };

  // Add to Cart handler
  const handleAddToCart = () => {
    if (!validateStep1()) return;

    calculatedItems.forEach(item => {
      addToCart({
        product: product || {
          id: 'prod-sync-personalized_print_service',
          sku: 'PERSONALIZED_PRINT_SERVICE',
          name: `${item.media} Print Sheet`,
          category: 'Personalized Print Service',
          selling_price: item.unitCost,
          mrp: item.unitCost * 1.4,
          images: showcaseImages,
          tags: ['Printing', item.media]
        } as any,
        selectedSize: { name: item.size, price_adj: 0 },
        selectedMaterial: { name: item.media, price_adj: 0 },
        selectedFinish: item.lamination ? { name: 'Thermal Lamination', price_adj: 0 } : undefined,
        quantity: item.qty,
        uploadedPhotos: files.map(f => ({
          id: f.name,
          previewUrl: URL.createObjectURL(f),
          filename: f.name,
          filesize: f.size
        })),
        customNotes: `Delivery: ${formData.deliveryMode}${item.cutting ? ' • Half Cut enabled' : ''}`,
        calculatedPrice: item.total
      });
    });

    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
    if (onAddedToCart) onAddedToCart();
  };

  // Submit Order via Google Apps Script & UPI Proof
  const submitOrder = async () => {
    if (!paymentScreenshot) {
      setErrorMsg("Please upload your payment screenshot before submitting.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const fileToBase64 = (f: File): Promise<string> => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(f);
        reader.onload = () => resolve(String(reader.result).split(',')[1]);
        reader.onerror = reject;
      });

      const processedFiles = await Promise.all(files.map(async f => ({
        fileName: f.name,
        mimeType: f.type,
        fileBase64: await fileToBase64(f)
      })));

      const screenshotBase64 = await fileToBase64(paymentScreenshot);

      const payload = {
        orderId: orderId,
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        deliveryMode: formData.deliveryMode,
        quantity: totalQuantity,
        orderDetails: JSON.stringify(calculatedItems),
        total: totalAmount,
        files: processedFiles,
        screenshotName: paymentScreenshot.name,
        screenshotMimeType: paymentScreenshot.type,
        screenshotBase64: screenshotBase64
      };

      try {
        await fetch(SCRIPT_URL, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } catch (scriptErr) {
        console.warn("Script endpoint warning:", scriptErr);
      }

      setStep(3);
    } catch (err: any) {
      setErrorMsg(`Error placing order: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // PDF Generation with html2pdf
  const triggerSaveAsPdf = () => {
    const element = document.getElementById('receipt-content');
    if (!element) return;

    setIsGeneratingPdf(true);
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Invoice_${orderId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#FFFFFF' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if ((window as any).html2pdf) {
      (window as any).html2pdf().from(element).set(opt).save().then(() => {
        setIsGeneratingPdf(false);
      }).catch((e: any) => {
        console.error("PDF engine fallback:", e);
        setIsGeneratingPdf(false);
        window.print();
      });
    } else {
      window.print();
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner / Breadcrumb */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-blue-500/30 text-blue-300">
                <Printer size={18} />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-300">Commercial Digital Print Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Personalized Printing Service
            </h1>
            <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-2xl">
              100 to 350 GSM Art Card, Sticker Sheet, Opaque/Clear Vinyl & Party Sheets with Thermal Lamination & CNC Kiss-Cutting.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onShare && product && (
              <button
                type="button"
                onClick={() => onShare(product)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 text-white"
              >
                <Share2 size={14} /> Share
              </button>
            )}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold transition-all text-white flex items-center gap-1.5 shadow-md"
            >
              <Smartphone size={14} /> WhatsApp Assistance
            </a>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Visual Showcase Carousel & Substrate Guide */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <ImageIcon size={15} className="text-blue-600" /> Print Quality & Imposition Standards
            </h3>

            {/* Main Visual Display */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-inner group">
              <img
                src={showcaseImages[activeImageIdx]}
                alt="Print Spec"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white text-xs font-semibold">
                Sheet Comparison & Print Specs ({activeImageIdx + 1} of {showcaseImages.length})
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {showcaseImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIdx === idx ? 'border-blue-600 ring-2 ring-blue-500/20 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Substrate Highlights */}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Standard Sizes: <strong>12×18 Inch</strong> & <strong>13×19 Inch</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Thermal Lamination: <strong>Gloss / Velvet Matte</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Die Finishing: <strong>CNC Plotter Half-Cut (Kiss Cut)</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: The 3-Step Interactive Customizer */}
        <div className="lg:col-span-7 space-y-6">
          
          {errorMsg && (
            <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-2xl flex items-start gap-2.5 text-xs font-semibold shadow-sm animate-in fade-in">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
              <button type="button" onClick={() => setErrorMsg('')} className="ml-auto text-red-500">
                <X size={16} />
              </button>
            </div>
          )}

          {/* ================= STEP 1: CALCULATOR & FILES ================= */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Customer Details Box */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-black">1</span>
                  Customer & Delivery Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Ramesh Patel"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2.5 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">WhatsApp Mobile *</label>
                    <input
                      type="tel"
                      name="mobile"
                      placeholder="10-digit number"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className="w-full p-2.5 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2.5 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex gap-6 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700 dark:text-gray-300">
                    <input
                      type="radio"
                      name="deliveryMode"
                      value="Door Pickup"
                      checked={formData.deliveryMode === 'Door Pickup'}
                      onChange={handleInputChange}
                      className="text-blue-600"
                    />
                    Door Pickup (Store Counter)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700 dark:text-gray-300">
                    <input
                      type="radio"
                      name="deliveryMode"
                      value="Courier"
                      checked={formData.deliveryMode === 'Courier'}
                      onChange={handleInputChange}
                      className="text-blue-600"
                    />
                    Courier Shipping
                  </label>
                </div>
              </div>

              {/* Dynamic Print Items Box */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-black">2</span>
                    Paper & Finishing Specifications
                  </h3>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {printItems.length} item{printItems.length > 1 ? 's' : ''} in queue
                  </span>
                </div>

                <div className="space-y-4">
                  {calculatedItems.map((item, idx) => (
                    <div key={item.id} className="p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700 relative shadow-xs space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-gray-900 text-white dark:bg-gray-800">
                          Item #{idx + 1}
                        </span>
                        {calculatedItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Paper Media</label>
                          <select
                            value={item.media}
                            onChange={(e) => handleItemChange(item.id, 'media', e.target.value)}
                            className="w-full p-2.5 text-xs font-bold rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          >
                            {DEFAULT_PRINTING_PRICING.map(m => (
                              <option key={m.media} value={m.media}>{m.media} - {m.tagline}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Sheet Size</label>
                          <select
                            value={item.size}
                            onChange={(e) => handleItemChange(item.id, 'size', e.target.value)}
                            className="w-full p-2.5 text-xs font-bold rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          >
                            {item.mediaDef.sizes.map(s => (
                              <option key={s.name} value={s.name}>{s.name} (Base ₹{s.baseCost})</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Finishes: Lamination & Half Cut */}
                      <div className="flex flex-wrap gap-4 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-xs">
                        <label className={`flex items-center gap-2 font-bold ${item.canLaminate ? 'text-gray-800 dark:text-gray-200 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}>
                          <input
                            type="checkbox"
                            checked={item.lamination && item.canLaminate}
                            disabled={!item.canLaminate}
                            onChange={(e) => handleItemChange(item.id, 'lamination', e.target.checked)}
                            className="rounded text-blue-600"
                          />
                          Thermal Lamination {!item.canLaminate && <span className="text-[10px] font-normal text-gray-400">(N/A)</span>}
                        </label>

                        <label className={`flex items-center gap-2 font-bold ${item.canCut ? 'text-gray-800 dark:text-gray-200 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}>
                          <input
                            type="checkbox"
                            checked={item.cutting && item.canCut}
                            disabled={!item.canCut}
                            onChange={(e) => handleItemChange(item.id, 'cutting', e.target.checked)}
                            className="rounded text-blue-600"
                          />
                          Half Cut (Kiss Cut) {!item.canCut && <span className="text-[10px] font-normal text-gray-400">(N/A)</span>}
                        </label>
                      </div>

                      {/* Item Total and Quantity */}
                      <div className="grid grid-cols-3 gap-3 items-end pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div>
                          <span className="block text-[10px] font-bold text-gray-400 uppercase">Unit Cost</span>
                          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">₹{item.unitCost.toFixed(2)}</span>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Sheets Qty</label>
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => handleItemChange(item.id, 'qty', parseInt(e.target.value) || 1)}
                            className="w-full p-2 text-xs font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-center"
                          />
                        </div>
                        <div className="text-right">
                          <span className="block text-[10px] font-bold text-blue-600 uppercase">Item Total</span>
                          <span className="text-base font-black text-gray-900 dark:text-white">₹{item.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addItem}
                  className="w-full py-3 border-2 border-dashed border-blue-300 dark:border-gray-700 hover:border-blue-500 rounded-2xl text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center gap-2 bg-blue-50/40 hover:bg-blue-50 transition-colors"
                >
                  <Plus size={16} /> Add Another Paper Media / Size
                </button>
              </div>

              {/* Upload Design Files */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-black">3</span>
                  Upload Design Artwork
                </h3>

                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((f, i) => (
                      <div key={i} className="p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-between text-xs">
                        <span className="font-semibold text-gray-800 dark:text-gray-200 truncate pr-2">{f.name}</span>
                        <button type="button" onClick={() => removeSelectedFile(i)} className="text-red-500 hover:bg-red-100 p-1 rounded">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-blue-400 dark:border-blue-600 rounded-2xl cursor-pointer bg-blue-50/30 hover:bg-blue-50 dark:bg-blue-950/20 transition-colors text-center px-4">
                  <UploadCloud className="text-blue-600 mb-1" size={28} />
                  <p className="text-xs text-gray-900 dark:text-white font-bold">Click to attach design files</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">CDR, PSD, AI, PDF, ZIP, RAR, JPG, PNG</p>
                  <input type="file" multiple accept=".zip,.rar,.jpg,.jpeg,.pdf,.cdr,.psd,.png,.ai" onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              {/* Total Summary Strip & Actions */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-xl space-y-4 border border-gray-700">
                <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                  <div>
                    <span className="text-xs text-gray-400">Total Calculation</span>
                    <div className="text-2xl sm:text-3xl font-black text-green-400 flex items-center">
                      <IndianRupee size={24} /> {totalAmount.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-300">
                    <p><strong>{printItems.length}</strong> Item(s)</p>
                    <p><strong>{totalQuantity}</strong> Total Sheets</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 bg-white hover:bg-gray-100 text-gray-900 font-bold py-3.5 px-6 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ShoppingBag size={16} /> Add to Cart Drawer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep1()) setStep(2);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold py-3.5 px-6 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>Instant UPI Checkout</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                {successToast && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded-xl text-xs flex items-center gap-2 font-bold animate-in fade-in">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span>Print job added to cart! You can continue or checkout.</span>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ================= STEP 2: UPI PAYMENT ================= */}
          {step === 2 && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-xl space-y-6 text-center animate-in zoom-in-95 duration-300">
              <div className="p-4 bg-green-50 dark:bg-green-950/40 rounded-2xl border border-green-200 dark:border-green-800">
                <span className="text-xs font-bold text-green-800 dark:text-green-300 uppercase tracking-widest block">Payable Amount</span>
                <span className="text-3xl font-black text-green-700 dark:text-green-400 flex items-center justify-center mt-0.5">
                  <IndianRupee size={26} /> {totalAmount.toFixed(2)}
                </span>
              </div>

              {/* Dynamic QR with scanning line */}
              <div className="flex justify-center my-4">
                <div className="p-4 bg-white rounded-3xl shadow-lg border border-gray-200 inline-block relative overflow-hidden">
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-blue-500 opacity-60 shadow-[0_0_8px_#3b82f6] animate-scan-line"></div>
                  <img src={qrUrl} alt="UPI QR" className="w-52 h-52 rounded-xl relative z-10" />
                </div>
              </div>

              <p className="text-xs text-gray-500 font-mono">
                UPI ID: <strong>{UPI_ID}</strong>
              </p>

              <div className="grid grid-cols-2 gap-3">
                <a href={gpayLink} className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold hover:bg-gray-100 flex items-center justify-center gap-2">
                  <Smartphone size={16} className="text-blue-500" /> GPay App
                </a>
                <a href={upiLink} className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold hover:bg-gray-100 flex items-center justify-center gap-2">
                  <Smartphone size={16} className="text-purple-600" /> Any UPI App
                </a>
              </div>

              {/* Payment Screenshot */}
              <div className="text-left pt-4 border-t border-gray-100 dark:border-gray-700">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Attach Payment Screenshot *</label>
                <label className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${paymentScreenshot ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900'}`}>
                  <div className="flex flex-col items-center gap-1.5 text-center">
                    {paymentScreenshot ? (
                      <>
                        <CheckCircle2 size={22} className="text-green-500" />
                        <span className="text-xs font-bold text-green-700 dark:text-green-400">{paymentScreenshot.name}</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud size={22} className="text-gray-400" />
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Tap to upload receipt image</span>
                      </>
                    )}
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setPaymentScreenshot(e.target.files?.[0] || null)} />
                </label>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={submitOrder}
                  disabled={isSubmitting || !paymentScreenshot}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? 'Submitting Order...' : <><Check size={18} /> I have Paid, Submit Order</>}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="text-xs text-gray-400 hover:text-gray-700 font-bold uppercase tracking-wider py-2"
                >
                  Wait, Go Back
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: ORDER CONFIRMED / PDF INVOICE ================= */}
          {step === 3 && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-xl space-y-6 text-center animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-950/60 rounded-full flex items-center justify-center mx-auto text-green-500">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Order Confirmed!</h2>
              <p className="text-xs text-gray-500">Your design files are uploaded securely and queued on our digital press.</p>

              {/* Printable Receipt */}
              <div id="receipt-content" className="p-6 bg-white border border-gray-200 text-left rounded-2xl text-gray-900 text-xs space-y-3 shadow-xs">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h3 className="text-base font-black uppercase tracking-tight">{BUSINESS_NAME}</h3>
                    <p className="text-[10px] text-gray-400 uppercase">Print Job Receipt</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-blue-600">{orderId}</span>
                    <span className="block text-[10px] text-gray-400">{new Date().toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Customer</span>
                    <span className="font-bold">{formData.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Mobile</span>
                    <span className="font-bold">{formData.mobile}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100 text-blue-900 font-bold">
                  Delivery: {formData.deliveryMode}
                </div>

                <div className="space-y-1.5 pt-2">
                  {calculatedItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between border-b border-gray-50 pb-1.5">
                      <div>
                        <span>{item.qty}× {item.media} ({item.size})</span>
                        <div className="text-[10px] text-gray-400">
                          {item.lamination && 'Thermal Lam • '}
                          {item.cutting && 'Half Cut'}
                        </div>
                      </div>
                      <span className="font-bold">₹{item.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t-2 border-gray-900 flex justify-between items-center text-sm font-black">
                  <span>Total Paid</span>
                  <span className="text-green-600">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={triggerSaveAsPdf}
                  disabled={isGeneratingPdf}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <Download size={16} /> Save Receipt as PDF
                </button>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`*New Print Order: ${orderId}*\n*Name:* ${formData.name}\n*Amount:* ₹${totalAmount.toFixed(2)}\n\n*Specs:*\n${calculatedItems.map(it => `- ${it.qty}x ${it.media} (${it.size})`).join('\n')}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <Send size={16} /> Send Order Alert on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setFiles([]);
                    setPaymentScreenshot(null);
                    setPrintItems([{ id: 1, media: DEFAULT_PRINTING_PRICING[0].media, size: DEFAULT_PRINTING_PRICING[0].sizes[0].name, lamination: false, cutting: false, qty: 1 }]);
                  }}
                  className="text-xs text-blue-600 font-bold uppercase tracking-wider hover:underline py-2"
                >
                  Configure another job
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
