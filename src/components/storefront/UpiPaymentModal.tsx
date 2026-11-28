import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, ShieldCheck, ArrowRight, UploadCloud, MessageCircle, AlertCircle, Sparkles, Smartphone } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface UpiPaymentModalProps {
  orderNumber: string;
  amount: number;
  customerName: string;
  customerPhone?: string;
  onPaymentSubmitted: () => void;
  onClose?: () => void;
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  orderNumber,
  amount,
  customerName,
  customerPhone,
  onPaymentSubmitted,
  onClose
}) => {
  const { settings } = useSettings();
  const UPI_ID = settings.upi_id || "aksharstudio-2@okicici";
  const BUSINESS_NAME = settings.business_name || "Akshar PrintShop Pro";
  const cleanAmount = Math.round(amount);

  // Exact UPI URI according to specification:
  // upi://pay?pa=aksharstudio-2@okicici&pn=Akshar PrintShop Pro&am=1230&cu=INR&tn=CRQ-20260913-0001
  const upiUri = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(BUSINESS_NAME)}&am=${cleanAmount}&cu=INR&tn=${encodeURIComponent(orderNumber)}`;


  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Generate dynamic QR code in browser
  useEffect(() => {
    QRCode.toDataURL(upiUri, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Error generating QR:', err));
  }, [upiUri]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshotFile(e.target.files[0]);
    }
  };

  const handleSubmitClaim = async () => {
    setErrorMsg(null);
    if (!utrNumber.trim() && !screenshotFile) {
      setErrorMsg('Please enter your 12-digit UPI UTR number or upload a payment screenshot.');
      return;
    }

    setSubmitting(true);
    try {
      let screenshotUrl = '';
      if (screenshotFile) {
        const formData = new FormData();
        formData.append('screenshot', screenshotFile);
        const uploadRes = await fetch('/api/upload-payment-screenshot', {
          method: 'POST',
          body: formData
        });
        if (uploadRes.ok) {
          const upData = await uploadRes.json();
          screenshotUrl = upData.url;
        }
      }

      // Submit payment claim to backend
      const claimRes = await fetch('/api/payment/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_number: orderNumber,
          utr: utrNumber.trim(),
          screenshot_url: screenshotUrl,
          amount: cleanAmount
        })
      });

      if (claimRes.ok) {
        onPaymentSubmitted();
      } else {
        const data = await claimRes.json();
        setErrorMsg(data.error || 'Failed to submit payment claim.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error occurred while submitting payment proof.');
    } finally {
      setSubmitting(false);
    }
  };

  // WhatsApp helper
  const cleanPhone = String(settings.whatsapp_number || '916354871446').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello ${BUSINESS_NAME},\n\nI have placed Order ${orderNumber} for ₹${cleanAmount.toLocaleString('en-IN')}.\nPayment Status: Verification Pending\nCustomer: ${customerName}`
  )}`;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden my-8 animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-6 text-center relative">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-xl p-1 bg-white border border-blue-300 ring-2 ring-blue-400/40 shadow-xs shrink-0 flex items-center justify-center">
              <img src="/logo-mark.png" alt="Akshar PrintShop Pro" className="w-full h-full object-contain" />
            </div>
            <div className="inline-flex items-center gap-1.5 bg-blue-600/70 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold text-blue-100">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
              Akshar PrintShop Pro Official UPI Gateway
            </div>
          </div>
          <h2 className="font-extrabold text-3xl">
            Pay ₹{cleanAmount.toLocaleString('en-IN')}
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            Order Reference: <span className="font-mono font-bold tracking-wider">{orderNumber}</span>
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {!isClaiming ? (
            /* STEP 1: QR & Payment Info */
            <div className="space-y-6">
              {/* Dynamic QR Display */}
              <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mx-auto max-w-[280px] text-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Akshar PrintShop Pro Dynamic UPI QR"
                    className="w-full h-auto mx-auto rounded-lg"
                  />
                ) : (
                  <div className="w-60 h-60 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-400">
                    Generating dynamic UPI QR...
                  </div>
                )}
                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <Smartphone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Scan with GPay, PhonePe, Paytm, or BHIM</span>
                </div>
              </div>

              {/* UPI ID Copy Box */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Payee Name:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{BUSINESS_NAME}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Direct UPI ID:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-950 dark:text-blue-200 text-sm select-all">
                      {UPI_ID}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="p-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                      title="Copy UPI ID"
                    >
                      {copiedUpi ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                {copiedUpi && (
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold text-right">
                    ✓ UPI ID copied to clipboard!
                  </p>
                )}
              </div>

              {/* Mobile UPI Intent Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`tez://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(BUSINESS_NAME)}&am=${cleanAmount}&cu=INR&tn=${encodeURIComponent(orderNumber)}`}
                  className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 p-2.5 rounded-xl text-center text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs flex flex-col items-center justify-center gap-1"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Google Pay
                </a>
                <a
                  href={`phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent(BUSINESS_NAME)}&am=${cleanAmount}&cu=INR&tn=${encodeURIComponent(orderNumber)}`}
                  className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 p-2.5 rounded-xl text-center text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs flex flex-col items-center justify-center gap-1"
                >
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  PhonePe
                </a>
                <a
                  href={`paytmmp://pay?pa=${UPI_ID}&pn=${encodeURIComponent(BUSINESS_NAME)}&am=${cleanAmount}&cu=INR&tn=${encodeURIComponent(orderNumber)}`}
                  className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 p-2.5 rounded-xl text-center text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs flex flex-col items-center justify-center gap-1"
                >
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  Paytm
                </a>
              </div>

              {/* Primary Claim Trigger Button */}
              <button
                type="button"
                onClick={() => setIsClaiming(true)}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
              >
                <span>I HAVE PAID (SUBMIT PROOF / UTR)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-1 font-medium"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  WhatsApp payment confirmation to studio
                </a>
              </div>
            </div>
          ) : (
            /* STEP 2: Claim Verification Form */
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/60 p-3.5 rounded-xl border border-blue-200/80 dark:border-blue-900/60 text-xs text-blue-950 dark:text-blue-200">
                <p className="font-semibold">Almost done! Submit your UTR or Screenshot</p>
                <p className="text-[11px] text-blue-800 dark:text-blue-300 mt-0.5">
                  Our studio verifies all direct UPI transactions before initiating printing and production.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  12-Digit UPI Transaction ID / UTR Number:
                </label>
                <input
                  type="text"
                  placeholder="e.g. 627192847192 or 42189..."
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Upload Payment Screenshot (Optional but recommended):
                </label>
                <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center bg-slate-50 dark:bg-slate-950 relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium block">
                    {screenshotFile ? screenshotFile.name : 'Click to select screenshot image'}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">PNG, JPG, or WEBP up to 15MB</span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsClaiming(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Back to QR
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmitClaim}
                  className="flex-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 disabled:bg-slate-400 text-white font-extrabold py-3 px-4 rounded-xl text-xs shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {submitting ? 'Verifying...' : 'Submit Payment for Verification'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
