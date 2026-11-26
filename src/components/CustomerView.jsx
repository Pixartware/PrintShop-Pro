import React, { useState, useEffect } from 'react';
import { 
  UploadCloud, CheckCircle, IndianRupee, QrCode, Smartphone, Send, 
  AlertCircle, X, Plus, Trash2, Printer, Moon, Sun, Settings, Lock, 
  FileText, Download, Sparkles, HelpCircle, Layers, Image as ImageIcon, 
  Search, Clock, Truck, CheckCircle2, ChevronRight, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SHOWCASE_GALLERY } from '../data/defaultPricing';
import MediaGuideModal from './MediaGuideModal';

export default function CustomerView({ 
  pricingData, 
  config, 
  onAdminClick, 
  isDarkMode, 
  toggleTheme, 
  onOrderSubmitted,
  orders = []
}) {
  const [storeTab, setStoreTab] = useState('order'); // 'order', 'pricing_guide', 'showcase', 'track'
  
  // Ordering State
  const [orderId, setOrderId] = useState('ORD-DATE-SN');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', mobile: '', email: '', deliveryMode: 'Door Pickup' });
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  const [printItems, setPrintItems] = useState([
    { id: 1, media: pricingData[0]?.media || '350 Gsm', size: pricingData[0]?.sizes[0]?.name || '12x18 (Single)', lamination: false, cutting: false, qty: 1 }
  ]);
  
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Showcase Modal State
  const [showcaseModalOpen, setShowcaseModalOpen] = useState(false);
  const [showcaseInitialIndex, setShowcaseInitialIndex] = useState(0);

  // Tracking State
  const [trackInput, setTrackInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackSearched, setTrackSearched] = useState(false);

  // Configuration constants with defaults
  const SCRIPT_URL = config?.scriptUrl || "https://script.google.com/macros/s/AKfycbzRwtwNObuYTQXaZA9sOQW8mfArrfosgT2TqoK-s5w8FtYNYwDl6ZaeauhRD_Nz2cF_/exec";
  const UPI_ID = config?.upiId || "aksharstudio-2@okicici"; 
  const BUSINESS_NAME = config?.businessName || "Akshar PrintShop Pro";
  const WHATSAPP_NUMBER = config?.whatsappNumber || "916354871446";

  // Calculate pricing
  const calculatedItems = printItems.map(item => {
    const mediaDef = pricingData.find(m => m.media === item.media) || pricingData[0] || { sizes: [] };
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

  // Sequential Order ID generation
  const getTodayDateStr = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  useEffect(() => {
    if (step === 1 && orderId === 'ORD-DATE-SN') {
      const today = getTodayDateStr();
      const localSeq = parseInt(localStorage.getItem(`seq_${today}`) || '0', 10) + 1;
      localStorage.setItem(`seq_${today}`, localSeq);
      setOrderId(`ORD-${today}-${String(localSeq).padStart(3, '0')}`);
    }
  }, [step, orderId]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleItemChange = (id, field, value) => {
    setPrintItems(items => items.map(item => {
      if (item.id !== id) return item;
      const updatedItem = { ...item, [field]: value };
      if (field === 'media') {
        const newMediaDef = pricingData.find(m => m.media === value);
        if (newMediaDef && newMediaDef.sizes.length > 0) {
          updatedItem.size = newMediaDef.sizes[0].name;
          updatedItem.lamination = false;
          updatedItem.cutting = false;
        }
      }
      return updatedItem;
    }));
  };

  const addItem = () => {
    setPrintItems([
      ...printItems, 
      { id: Date.now(), media: pricingData[0]?.media || '', size: pricingData[0]?.sizes[0]?.name || '', lamination: false, cutting: false, qty: 1 }
    ]);
  };

  const removeItem = (id) => {
    if (printItems.length > 1) setPrintItems(items => items.filter(item => item.id !== id));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const allowedExtensions = ['.zip', '.rar', '.jpg', '.jpeg', '.pdf', '.cdr', '.psd', '.png', '.ai'];
      
      const validFiles = selectedFiles.filter(f => 
        allowedExtensions.some(ext => f.name.toLowerCase().endsWith(ext))
      );
      
      if (validFiles.length !== selectedFiles.length) {
        setErrorMsg("Some file types are not supported. Allowed: ZIP, RAR, JPG, PDF, CDR, PSD, PNG, AI.");
      } else {
        setErrorMsg("");
      }
      
      setFiles(prev => [...prev, ...validFiles]);
    }
    e.target.value = null; 
  };

  const removeSelectedFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const validateStep1 = () => {
    if (!formData.name.trim() || !formData.mobile.trim() || !formData.email.trim() || files.length === 0) {
      setErrorMsg("Please fill in all customer details and upload at least one design file.");
      return false;
    }
    if (formData.mobile.replace(/\D/g, '').length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  const submitOrder = async () => {
    if (!paymentScreenshot) {
      setErrorMsg("Please upload your payment screenshot before submitting.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const finalOrderId = orderId;

      const fileToBase64 = (f) => new Promise((resolve, reject) => {
        if (!f) return resolve(null);
        const reader = new FileReader();
        reader.readAsDataURL(f);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = () => reject(new Error("Failed to read file"));
      });

      const filePromises = files.map(async (f) => {
        const b64 = await fileToBase64(f);
        return {
          fileName: f.name,
          mimeType: f.type,
          fileBase64: b64
        };
      });

      const processedFiles = await Promise.all(filePromises);
      const screenshotBase64 = await fileToBase64(paymentScreenshot);

      const payload = {
        orderId: finalOrderId,
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

      // Try Google Apps Script submission
      let apiSuccess = false;
      try {
        const response = await fetch(SCRIPT_URL, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        const textResponse = await response.text();
        const result = JSON.parse(textResponse);
        if (result.status === 'success') {
          apiSuccess = true;
        }
      } catch (scriptErr) {
        console.warn("Script endpoint warning (local order capture will proceed):", scriptErr);
      }

      // Record local order in state and storage
      const newOrderRecord = {
        orderId: finalOrderId,
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        deliveryMode: formData.deliveryMode,
        totalAmount: totalAmount,
        totalQty: totalQuantity,
        items: calculatedItems,
        status: "Pending",
        createdAt: new Date().toISOString(),
        paymentScreenshotName: paymentScreenshot.name,
        filesCount: files.length
      };

      if (onOrderSubmitted) {
        onOrderSubmitted(newOrderRecord);
      }

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setStep(3);
    } catch (error) {
      setErrorMsg(`Submission note: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // High-Fidelity Client-Side PDF Generation Method
  const triggerSaveAsPdf = () => {
    const element = document.getElementById('receipt-content');
    if (!element) return;

    setIsGeneratingPdf(true);

    const opt = {
      margin:       [10, 10, 10, 10],
      filename:     `Invoice_${orderId}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { 
        scale: 2, 
        useCORS: true,
        backgroundColor: '#FFFFFF',
        letterRendering: true
      },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (window.html2pdf) {
      window.html2pdf().from(element).set(opt).save().then(() => {
        setIsGeneratingPdf(false);
      }).catch(err => {
        console.error("PDF engine crash, fallback to print:", err);
        setIsGeneratingPdf(false);
        window.print();
      });
    } else {
      window.print();
      setIsGeneratingPdf(false);
    }
  };

  // Handle Order Tracking Search
  const handleTrackSearch = (e) => {
    e.preventDefault();
    setTrackSearched(true);
    const query = trackInput.trim().toLowerCase();
    if (!query) {
      setTrackedOrder(null);
      return;
    }
    const found = orders.find(o => 
      o.orderId?.toLowerCase() === query || 
      o.mobile?.replace(/\D/g, '') === query.replace(/\D/g, '')
    );
    setTrackedOrder(found || null);
  };

  return (
    <div className="flex flex-col items-center py-4 md:py-8 px-3 md:px-6">
      
      {/* Visual Showcase Modal */}
      <MediaGuideModal
        isOpen={showcaseModalOpen}
        onClose={() => setShowcaseModalOpen(false)}
        initialIndex={showcaseInitialIndex}
      />

      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        
        {/* Announcement Ticker */}
        {config?.announcement && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold px-4 py-2 text-center flex items-center justify-center gap-2">
            <Sparkles size={14} className="animate-spin-slow shrink-0" />
            <span>{config.announcement}</span>
          </div>
        )}

        {/* Store Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left transition-colors duration-300">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <img 
              src={config?.logoUrl || "https://lh3.googleusercontent.com/d/1FJUX0h-_QW6eqXLZTVb5jqUbsp3IweRQ"} 
              alt={BUSINESS_NAME} 
              className="h-16 md:h-20 w-auto object-contain drop-shadow-sm"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.style.display = 'none';
              }}
            />
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  {BUSINESS_NAME}
                </h1>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  AI Enhanced
                </span>
              </div>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
                {config?.tagline || "Professional Printing • Fast Same-Day Dispatch"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button 
              onClick={toggleTheme} 
              className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" 
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button 
              onClick={onAdminClick} 
              className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center" 
              title="Admin Portal"
            >
              <Lock size={18} />
            </button>

            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}`} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center justify-center gap-1.5 text-xs font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-4 py-2.5 rounded-full border border-green-200 dark:border-green-800 hover:bg-green-100 transition-colors shadow-sm"
            >
              <Smartphone size={16} /> WhatsApp Support
            </a>
          </div>
        </div>

        {/* Store Front Tabs */}
        <div className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-700 px-4 md:px-8 flex overflow-x-auto gap-2">
          {[
            { id: 'order', label: 'Place Print Order', icon: Printer },
            { id: 'pricing_guide', label: 'Rate Card / Prices', icon: IndianRupee },
            { id: 'showcase', label: 'Visual Showcase & Guides', icon: ImageIcon },
            { id: 'track', label: 'Track My Order', icon: Search },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = storeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStoreTab(tab.id)}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition-all ${
                  isActive 
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Step Progress Bar (when on order tab) */}
        {storeTab === 'order' && (
          <div className="flex bg-gray-100 dark:bg-gray-700 h-1.5 transition-colors">
            <div 
              className={`h-full bg-blue-600 transition-all duration-500 ease-in-out ${
                step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'
              }`}
            ></div>
          </div>
        )}

        <div className="p-4 md:p-8">
          
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-2xl flex items-start gap-3 text-sm border border-red-200 dark:border-red-800 shadow-sm animate-in fade-in">
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
              <span className="font-medium text-sm">{errorMsg}</span>
              <button onClick={() => setErrorMsg("")} className="ml-auto p-1 hover:bg-red-100 rounded-md">
                <X size={18} />
              </button>
            </div>
          )}

          {/* ================= STORE TAB 1: ORDER FLOW ================= */}
          {storeTab === 'order' && (
            <div>
              {/* STEP 1: Specs and Files */}
              {step === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                    
                    {/* Customer Details Box */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
                      <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span> 
                        Customer Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold mb-1.5 text-gray-700 dark:text-gray-300">Full Name *</label>
                          <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleInputChange} 
                            className="w-full p-2.5 text-xs border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" 
                            placeholder="e.g. Ramesh Patel" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1.5 text-gray-700 dark:text-gray-300">WhatsApp Mobile *</label>
                          <input 
                            type="tel" 
                            name="mobile" 
                            value={formData.mobile} 
                            onChange={handleInputChange} 
                            className="w-full p-2.5 text-xs border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" 
                            placeholder="10-digit number" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1.5 text-gray-700 dark:text-gray-300">Email Address *</label>
                          <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleInputChange} 
                            className="w-full p-2.5 text-xs border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" 
                            placeholder="email@example.com" 
                          />
                        </div>
                        <div className="md:col-span-3 pt-3 border-t border-gray-100 dark:border-gray-700 mt-1">
                          <label className="block text-xs font-bold mb-2 text-gray-700 dark:text-gray-300">Delivery Preference</label>
                          <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-800 dark:text-gray-200">
                              <input 
                                type="radio" 
                                name="deliveryMode" 
                                value="Door Pickup" 
                                checked={formData.deliveryMode === 'Door Pickup'} 
                                onChange={handleInputChange} 
                                className="w-4 h-4 text-blue-600" 
                              />
                              Door Pickup (Store Counter)
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-800 dark:text-gray-200">
                              <input 
                                type="radio" 
                                name="deliveryMode" 
                                value="Courier" 
                                checked={formData.deliveryMode === 'Courier'} 
                                onChange={handleInputChange} 
                                className="w-4 h-4 text-blue-600" 
                              />
                              Courier Delivery
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Print Items Calculator */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                          <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span> 
                          Printing Specifications
                        </h3>
                        <button
                          type="button"
                          onClick={() => { setShowcaseInitialIndex(1); setShowcaseModalOpen(true); }}
                          className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                        >
                          <HelpCircle size={14} /> Size & GSM Guide
                        </button>
                      </div>

                      <div className="space-y-4">
                        {calculatedItems.map((item, index) => (
                          <div key={item.id} className="p-4 md:p-5 border border-gray-200 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-700/30 relative shadow-sm">
                            <div className="absolute -top-3 left-4 bg-gray-900 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                              Item #{index + 1}
                            </div>
                            {calculatedItems.length > 1 && (
                              <button 
                                onClick={() => removeItem(item.id)} 
                                className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                              <div>
                                <label className="block text-[11px] font-bold mb-1 text-gray-600 dark:text-gray-400 uppercase">
                                  Print Media / GSM
                                </label>
                                <select 
                                  value={item.media} 
                                  onChange={(e) => handleItemChange(item.id, 'media', e.target.value)} 
                                  className="w-full p-2.5 text-xs font-semibold border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                >
                                  {pricingData.map(m => (
                                    <option key={m.media} value={m.media}>
                                      {m.media} {m.badge ? `(${m.badge})` : ''}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold mb-1 text-gray-600 dark:text-gray-400 uppercase">
                                  Paper Size / Sides
                                </label>
                                <select 
                                  value={item.size} 
                                  onChange={(e) => handleItemChange(item.id, 'size', e.target.value)} 
                                  className="w-full p-2.5 text-xs font-semibold border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                >
                                  {item.mediaDef.sizes.map(s => (
                                    <option key={s.name} value={s.name}>{s.name}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-600 mt-4">
                              <label className={`flex items-center gap-2 text-xs font-bold ${item.canLaminate ? 'text-gray-800 dark:text-gray-200 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}>
                                <input 
                                  type="checkbox" 
                                  checked={item.lamination && item.canLaminate} 
                                  disabled={!item.canLaminate} 
                                  onChange={(e) => handleItemChange(item.id, 'lamination', e.target.checked)} 
                                  className="rounded text-blue-600 w-4 h-4" 
                                />
                                Thermal Lamination {!item.canLaminate && <span className="text-[10px] font-normal text-gray-400">(N/A)</span>}
                              </label>
                              <label className={`flex items-center gap-2 text-xs font-bold ${item.canCut ? 'text-gray-800 dark:text-gray-200 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}>
                                <input 
                                  type="checkbox" 
                                  checked={item.cutting && item.canCut} 
                                  disabled={!item.canCut} 
                                  onChange={(e) => handleItemChange(item.id, 'cutting', e.target.checked)} 
                                  className="rounded text-blue-600 w-4 h-4" 
                                />
                                Half Cut (Kiss Cut) {!item.canCut && <span className="text-[10px] font-normal text-gray-400">(N/A)</span>}
                              </label>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-end mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                              <div>
                                <label className="block text-[11px] font-bold mb-1 text-gray-400 uppercase">Unit Cost</label>
                                <div className="p-2 text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 rounded-lg">
                                  ₹{item.unitCost.toFixed(2)}
                                </div>
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold mb-1 text-gray-600 dark:text-gray-400 uppercase">Quantity</label>
                                <input 
                                  type="number" 
                                  min="1" 
                                  value={item.qty} 
                                  onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)} 
                                  className="w-full p-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 font-bold text-center" 
                                />
                              </div>
                              <div className="col-span-2 md:col-span-1 text-right bg-blue-50 dark:bg-blue-900/30 p-2 rounded-xl border border-blue-100 dark:border-blue-800">
                                <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block">Item Total</span>
                                <span className="text-base font-black text-gray-900 dark:text-white">₹{item.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={addItem} 
                        className="w-full mt-4 py-3 border-2 border-dashed border-blue-300 dark:border-gray-600 hover:border-blue-500 rounded-xl text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center gap-2 bg-blue-50/40 hover:bg-blue-50 transition-colors"
                      >
                        <Plus size={16} /> Add Another Paper / Size Specification
                      </button>
                    </div>

                  </div>

                  {/* Right Column: Files & Summary */}
                  <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                    <div className="sticky top-6 space-y-6">
                      
                      {/* Upload Files Box */}
                      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
                        <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span> 
                          Upload Design Files
                        </h3>
                        
                        <div className="space-y-2 mb-3">
                          {files.length > 0 && files.map((f, index) => (
                            <div key={index} className="flex items-center justify-between p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl text-xs">
                              <span className="font-semibold text-gray-800 dark:text-gray-200 truncate pr-2">{f.name}</span>
                              <button onClick={() => removeSelectedFile(index)} className="text-red-500 hover:bg-red-100 p-1 rounded">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>

                        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-blue-400 dark:border-blue-600 rounded-2xl cursor-pointer bg-blue-50/30 hover:bg-blue-50 dark:bg-blue-950/20 transition-colors text-center px-4">
                          <UploadCloud className="text-blue-600 mb-1" size={28} />
                          <p className="text-xs text-gray-800 dark:text-gray-200 font-bold">Click to select design files</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">ZIP, RAR, CDR, PSD, PDF, AI, JPG, PNG</p>
                          <input type="file" accept=".zip,.rar,.jpg,.jpeg,.pdf,.cdr,.psd,.png,.ai" multiple className="hidden" onChange={handleFileChange} />
                        </label>
                      </div>

                      {/* Checkout Summary Box */}
                      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-xl p-6 text-white border border-gray-700">
                        <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
                          <h3 className="text-base font-bold flex items-center gap-2">
                            <Printer size={18} className="text-blue-400" /> Order Summary
                          </h3>
                          <span className="bg-blue-900/60 text-blue-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border border-blue-800">
                            {orderId}
                          </span>
                        </div>

                        <div className="space-y-2.5 text-xs text-gray-300 mb-6">
                          <div className="flex justify-between">
                            <span>Total Items</span>
                            <span className="font-bold text-white">{printItems.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Sheets / Quantity</span>
                            <span className="font-bold text-white">{totalQuantity} Prints</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Delivery Mode</span>
                            <span className="font-bold text-white">{formData.deliveryMode}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-700 flex justify-between items-end mb-6">
                          <span className="text-xs text-gray-400 uppercase font-semibold">Total Payable</span>
                          <span className="text-2xl font-black text-green-400 flex items-center">
                            <IndianRupee size={22} /> {totalAmount.toFixed(2)}
                          </span>
                        </div>

                        <button 
                          onClick={() => { if (validateStep1()) setStep(2); }} 
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          Proceed to Payment <ArrowRight size={16} />
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: UPI Payment and Screenshot */}
              {step === 2 && (
                <div className="max-w-md mx-auto space-y-6 text-center animate-in zoom-in-95 duration-500 bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl">
                  <div className="p-4 bg-green-50 dark:bg-green-950/40 rounded-2xl border border-green-200 dark:border-green-800">
                    <p className="text-xs text-green-800 dark:text-green-400 font-bold uppercase tracking-wider mb-0.5">Amount to Pay</p>
                    <h2 className="text-3xl font-black text-green-700 dark:text-green-400 flex justify-center items-center">
                      <IndianRupee size={28} /> {totalAmount.toFixed(2)}
                    </h2>
                  </div>

                  {/* QR Code Container with Scan Animation */}
                  <div className="flex justify-center my-4">
                    <div className="p-4 bg-white rounded-3xl shadow-lg border border-gray-200 inline-block relative overflow-hidden">
                      <div className="absolute top-4 left-4 right-4 h-0.5 bg-blue-500 opacity-60 shadow-[0_0_8px_#3b82f6] animate-scan-line"></div>
                      <img src={qrUrl} alt="UPI QR" className="w-52 h-52 rounded-xl relative z-10" />
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 font-mono">
                    UPI ID: <strong>{UPI_ID}</strong>
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <a 
                      href={gpayLink} 
                      className="flex items-center justify-center gap-2 py-3 px-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors shadow-sm"
                    >
                      <Smartphone size={18} className="text-blue-500" /> GPay App
                    </a>
                    <a 
                      href={upiLink} 
                      className="flex items-center justify-center gap-2 py-3 px-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors shadow-sm"
                    >
                      <Smartphone size={18} className="text-purple-600" /> Any UPI App
                    </a>
                  </div>

                  {/* Attach Payment Proof */}
                  <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700 text-left">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Attach Payment Screenshot *
                    </label>
                    <label className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${paymentScreenshot ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900'}`}>
                      <div className="flex flex-col items-center gap-1.5 text-center">
                        {paymentScreenshot ? (
                          <>
                            <CheckCircle size={22} className="text-green-500" />
                            <span className="text-xs font-bold text-green-700 dark:text-green-400">{paymentScreenshot.name}</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud size={22} className="text-gray-400" />
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Tap to upload receipt image</span>
                          </>
                        )}
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => setPaymentScreenshot(e.target.files[0] || null)} />
                    </label>
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={submitOrder} 
                      disabled={isSubmitting || !paymentScreenshot} 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> 
                          Submitting Order...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={18} /> I have Paid, Submit Order
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => setStep(1)} 
                      disabled={isSubmitting} 
                      className="mt-4 text-xs text-gray-400 hover:text-gray-700 font-bold uppercase tracking-wide"
                    >
                      Wait, Go Back
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Invoice and Confirmation */}
              {step === 3 && (
                <div className="max-w-lg mx-auto text-center py-6 animate-in zoom-in-95 duration-500">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-950/60 rounded-full mb-4 shadow-inner no-print">
                    <CheckCircle size={40} className="text-green-500" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 no-print">Order Placed Successfully!</h2>
                  <p className="text-xs text-gray-500 mb-6 no-print">Your order is queued in our production line.</p>
                  
                  {/* Clean Receipt for PDF generation */}
                  <div id="receipt-content" className="p-6 bg-white border border-gray-200 text-left mb-6 shadow-sm rounded-2xl text-gray-900">
                    <div className="flex justify-between items-center mb-4 border-b-2 border-gray-100 pb-3">
                      <div>
                        <h1 className="text-lg font-black text-gray-900 uppercase tracking-tight">{BUSINESS_NAME}</h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tax / Cash Receipt</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-black text-blue-600 block">{orderId}</span>
                        <span className="text-[10px] text-gray-400">{new Date().toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase block">Customer</span>
                          <span className="font-bold text-gray-900">{formData.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-gray-400 uppercase block">Mobile</span>
                          <span className="font-bold text-gray-900">{formData.mobile}</span>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                        <span className="text-[10px] font-bold text-blue-500 uppercase block">Delivery Mode</span>
                        <span className="font-bold text-blue-900 flex items-center gap-1.5 mt-0.5">
                          <CheckCircle size={14} className="text-blue-600" /> {formData.deliveryMode}
                        </span>
                      </div>
                      
                      <div className="mt-4">
                        <h5 className="text-[10px] font-bold text-gray-400 uppercase mb-2 pb-1 border-b border-gray-100">Job Specifications</h5>
                        <div className="space-y-2">
                          {calculatedItems.map((item, i) => (
                            <div key={i} className="border-b border-gray-50 pb-2 last:border-0">
                              <div className="flex justify-between items-start font-medium">
                                <div className="font-bold text-gray-800">{item.media} ({item.size})</div>
                                <div className="font-black text-gray-900">₹{item.total.toFixed(2)}</div>
                              </div>
                              <div className="text-gray-500 text-[10px] mt-0.5 flex gap-2">
                                <span>Qty: <strong>{item.qty}</strong></span>
                                {item.lamination && <span>• Lamination: <strong>Yes</strong></span>}
                                {item.cutting && <span>• Half Cut: <strong>Yes</strong></span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t-2 border-gray-900 flex justify-between items-center">
                        <span className="font-black text-gray-900 uppercase">Total Amount Paid</span>
                        <span className="text-xl font-black text-green-600">₹{totalAmount.toFixed(2)}</span>
                      </div>

                      <div className="mt-6 text-center border-t border-gray-100 pt-3 text-[10px] text-gray-400">
                        <p>Thank you for printing with {BUSINESS_NAME}.</p>
                        <p className="text-[8px] font-bold mt-0.5 uppercase tracking-widest">Hitesh Bhesaniya Production</p>
                      </div>
                    </div>
                  </div>

                  <div className="no-print flex flex-col gap-3">
                    <button 
                      onClick={triggerSaveAsPdf}
                      disabled={isGeneratingPdf}
                      className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg transition-all"
                    >
                      {isGeneratingPdf ? 'Generating PDF...' : <><Download size={18} /> Save Receipt as PDF</>}
                    </button>
                    
                    <a 
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`*New Print Order: ${orderId}*\n*Name:* ${formData.name}\n*Delivery:* ${formData.deliveryMode}\n*Amount:* ₹${totalAmount.toFixed(2)}\n\n*Print Summary:*\n${calculatedItems.map(item => `- ${item.qty}x ${item.media} (${item.size})`).join('\n')}\n\n_Payment screenshot & files attached in system._`)}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-sm py-3.5 rounded-xl shadow-lg transition-all"
                    >
                      <Send size={18} /> Send Order Alert on WhatsApp
                    </a>

                    <button 
                      onClick={() => { 
                        setOrderId('ORD-DATE-SN'); 
                        setStep(1); 
                        setFiles([]); 
                        setPaymentScreenshot(null); 
                        setFormData({ name:'', mobile:'', email: '', deliveryMode: 'Door Pickup' }); 
                        setPrintItems([{ id: 1, media: pricingData[0]?.media || '', size: pricingData[0]?.sizes[0]?.name || '', lamination: false, cutting: false, qty: 1 }]); 
                      }} 
                      className="mt-3 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider hover:underline"
                    >
                      Place another order
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= STORE TAB 2: PRICING GUIDE ================= */}
          {storeTab === 'pricing_guide' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center max-w-xl mx-auto mb-6">
                <h2 className="text-xl font-black text-gray-900 dark:text-white">Commercial Print Rate Card</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Transparent sheet pricing with thermal gloss/matte lamination and digital half-cut options.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pricingData.map((media) => (
                  <div key={media.media} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-base font-black text-gray-900 dark:text-white">{media.media}</h3>
                        <p className="text-[11px] text-gray-500 mt-0.5">{media.description}</p>
                      </div>
                      {media.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 shrink-0">
                          {media.badge}
                        </span>
                      )}
                    </div>

                    <div className="overflow-x-auto mt-3">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-100 dark:border-gray-700 text-gray-400 uppercase text-[10px]">
                            <th className="pb-2">Size</th>
                            <th className="pb-2 text-right">Base</th>
                            <th className="pb-2 text-right">Lam.</th>
                            <th className="pb-2 text-right">Cut</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 font-medium">
                          {media.sizes.map(s => (
                            <tr key={s.name}>
                              <td className="py-2 text-gray-700 dark:text-gray-300 font-semibold">{s.name}</td>
                              <td className="py-2 text-right font-bold text-gray-900 dark:text-white">₹{s.baseCost}</td>
                              <td className="py-2 text-right text-gray-500">{s.lamination !== null ? `+₹${s.lamination}` : '—'}</td>
                              <td className="py-2 text-right text-gray-500">{s.cutting !== null ? `+₹${s.cutting}` : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <button
                      onClick={() => {
                        setPrintItems([{
                          id: Date.now(),
                          media: media.media,
                          size: media.sizes[0]?.name || '',
                          lamination: false,
                          cutting: false,
                          qty: 1
                        }]);
                        setStoreTab('order');
                        setStep(1);
                      }}
                      className="w-full mt-4 py-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      Order {media.media} <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= STORE TAB 3: VISUAL SHOWCASE & GUIDES ================= */}
          {storeTab === 'showcase' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center max-w-xl mx-auto mb-6">
                <h2 className="text-xl font-black text-gray-900 dark:text-white">Visual Standards & Substrate Guides</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Click on any infographic guide to view high-resolution specs, size comparisons, and paper thickness details.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {SHOWCASE_GALLERY.map((item, idx) => (
                  <div 
                    key={item.id}
                    onClick={() => { setShowcaseInitialIndex(idx); setShowcaseModalOpen(true); }}
                    className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-900">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm">
                        {item.tag}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs font-bold text-blue-600 dark:text-blue-400">
                        <span>Inspect Specs</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= STORE TAB 4: TRACK ORDER ================= */}
          {storeTab === 'track' && (
            <div className="max-w-xl mx-auto py-6 animate-in fade-in duration-300">
              <div className="text-center mb-6">
                <h2 className="text-xl font-black text-gray-900 dark:text-white">Track Your Print Order</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Enter your Order ID (e.g. ORD-20261126-001) or WhatsApp Phone Number.
                </p>
              </div>

              <form onSubmit={handleTrackSearch} className="flex gap-2 mb-6">
                <input
                  type="text"
                  placeholder="Order ID or 10-digit Mobile..."
                  value={trackInput}
                  onChange={(e) => setTrackInput(e.target.value)}
                  className="flex-1 p-3 text-xs border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <Search size={14} /> Search
                </button>
              </form>

              {trackSearched && !trackedOrder && (
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500">
                  <AlertCircle size={24} className="mx-auto text-gray-400 mb-2" />
                  No order record found for "{trackInput}". Please double-check your Order ID or contact support.
                </div>
              )}

              {trackedOrder && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 shadow-xl animate-in zoom-in-95">
                  <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-700 pb-4 mb-4">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Order Status</span>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white mt-0.5">{trackedOrder.orderId}</h3>
                      <p className="text-xs text-gray-500">{trackedOrder.name} ({trackedOrder.mobile})</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                      {trackedOrder.status || 'Pending Verification'}
                    </span>
                  </div>

                  {/* Visual Status Steps */}
                  <div className="space-y-4 my-6">
                    {[
                      { title: 'Order Placed & Queued', desc: 'Payment screenshot uploaded', done: true },
                      { title: 'In Production', desc: 'Digital presses running', done: trackedOrder.status === 'In Production' || trackedOrder.status === 'Ready for Pickup' || trackedOrder.status === 'Completed' },
                      { title: 'Ready for Pickup / Dispatched', desc: trackedOrder.deliveryMode === 'Courier' ? 'Courier airway bill generated' : 'Available at store counter', done: trackedOrder.status === 'Ready for Pickup' || trackedOrder.status === 'Completed' },
                      { title: 'Completed', desc: 'Delivered to customer', done: trackedOrder.status === 'Completed' }
                    ].map((stepItem, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${stepItem.done ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                          {stepItem.done ? '✓' : sIdx + 1}
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${stepItem.done ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                            {stepItem.title}
                          </p>
                          <p className="text-[11px] text-gray-400">{stepItem.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs">
                    <span className="text-gray-500">Order Amount</span>
                    <span className="font-black text-gray-900 dark:text-white text-base">₹{Number(trackedOrder.totalAmount || 0).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      <div className="mt-8 mb-2 text-center text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest no-print">
        Hitesh Bhesaniya Production • Akshar PrintShop Pro
      </div>

    </div>
  );
}
