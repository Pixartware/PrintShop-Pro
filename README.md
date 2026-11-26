# Akshar PrintShop Pro 🖨️✨
> Professional & AI-Enhanced Digital Offset Printing Platform with Advanced Admin Suite

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3-blue)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-cyan)
![Vite](https://img.shields.io/badge/Vite-6.0-purple)

**Akshar PrintShop Pro** is a modern commercial printing platform designed for high-resolution sheet printing, stickers, flyers, business cards, and custom packaging.

---

## 🌟 Key Features

### 🛍️ Customer Storefront (`/printshop`)
1. **Interactive Print Cost Calculator**:
   - Instant calculation across all media types (350 GSM, 300 GSM, 250 GSM, 210 GSM, 170 GSM, 100/130 GSM, Sticker Sheet, Opaque / Transparent films, A3 Letterhead, Party Paper Printing).
   - Dynamic Add-on selection: Thermal Gloss/Matte Lamination, Precision Half-Cutting (Kiss Cut), single & double-sided printing.
2. **Multi-Format Design Upload**:
   - Accepts `.zip`, `.rar`, `.cdr`, `.psd`, `.ai`, `.pdf`, `.jpg`, `.png`.
3. **Instant UPI & QR Code Payments**:
   - Auto-generated dynamic QR code for `aksharstudio-2@okicici` with animated scanner overlay.
   - 1-click deep links for Google Pay, PhonePe, Paytm, and BHIM UPI apps.
4. **Automated Order Slips & Invoices**:
   - Client-side high-resolution PDF Invoice download powered by `html2pdf.js`.
   - 1-Click WhatsApp Order dispatch with pre-filled Gujarati / English job order specs.
5. **Visual Media & Sheet Size Guides**:
   - High-definition infographics detailing 12x18 vs 13x19 inch sheet impositions, GSM thickness comparisons, and precision cutting options.
6. **Live Order Tracking**:
   - Track order progress from "Order Placed" → "In Production" → "Ready for Pickup / Dispatched".

---

### 🛡️ Dedicated Admin Suite
Access via the Lock icon in the header or Admin credentials.
- **Master PIN Code**: `1234` (configurable in store settings)
- **Authorized Emails**: `admin@phototoolsai.com`, `hitesh@phototoolsai.com`, `pixartware@gmail.com`

#### Admin Capabilities:
- 📊 **Overview Analytics**: Real-time sales volume (₹), total print jobs queued, active paper media count, and registered clients.
- 📦 **Product & Substrate Management**: Add, update, or remove paper categories, custom sheet sizes, and add-on rates.
- 💰 **Price Matrix & Bulk Adjuster**: Update base costs, lamination, and cutting rates inline, or apply bulk percentage adjustments (e.g. +5% or -10%) across the entire catalog with one click.
- 👥 **Customer Relationship CRM**: Comprehensive customer database automatically indexed from orders. Track total lifetime spend, orders count, preferred delivery mode, direct 1-click WhatsApp messaging, and export to CSV.
- 📋 **Live Orders & Dispatch Tracking**: Real-time order fulfillment workflow with automated WhatsApp updates ("In Production", "Ready for Pickup", "Dispatched via Courier").
- ⚙️ **Store & Payment Configuration**: Live customization of Business Name, UPI VPA, WhatsApp support number, Google Apps Script endpoint, courier charges, and announcement banner.

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start Vite local development server
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview
```

---

## 🌐 Deployment to Vercel

```bash
# Push to GitHub
git add .
git commit -m "Initial release of Akshar PrintShop Pro with Admin Suite"
git push origin main

# Deploy on Vercel
npx vercel --prod
```

---
*Developed for Hitesh Bhesaniya Production • Akshar PrintShop Pro*
