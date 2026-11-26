// Default Configuration & Data for Akshar PrintShop Pro

export const INITIAL_CONFIG = {
  businessName: "Akshar PrintShop Pro",
  tagline: "Professional & AI-Enhanced Printing Service",
  upiId: "aksharstudio-2@okicici",
  whatsappNumber: "916354871446",
  scriptUrl: "https://script.google.com/macros/s/AKfycbzRwtwNObuYTQXaZA9sOQW8mfArrfosgT2TqoK-s5w8FtYNYwDl6ZaeauhRD_Nz2cF_/exec",
  adminPin: "1234",
  adminEmails: ["admin@phototoolsai.com", "hitesh@phototoolsai.com", "pixartware@gmail.com"],
  courierCharge: 70,
  minFreeDelivery: 1000,
  announcement: "⚡ Fast Same-Day Dispatch for Orders confirmed before 2:00 PM! High Quality Digital Presses.",
  logoUrl: "https://lh3.googleusercontent.com/d/1FJUX0h-_QW6eqXLZTVb5jqUbsp3IweRQ"
};

export const DEFAULT_PRICING_DATA = [
  {
    id: "m_350gsm",
    media: "350 Gsm",
    description: "Ultra-heavy premium board for visiting cards, luxury hang tags, and rigid covers.",
    badge: "Most Popular",
    sizes: [
      { id: "s_350_1", name: "12x18 (Single)", lamination: 4.5, cutting: null, baseCost: 14 },
      { id: "s_350_2", name: "12x18 (Both side)", lamination: 6, cutting: null, baseCost: 17 },
      { id: "s_350_3", name: "13x19 (Single)", lamination: 4.75, cutting: null, baseCost: 15 },
      { id: "s_350_4", name: "13x19 (Both side)", lamination: 6.5, cutting: null, baseCost: 18 },
    ]
  },
  {
    id: "m_300gsm",
    media: "300 Gsm",
    description: "Standard premium card stock for flyers, brochures, certificates, and table menus.",
    badge: "Recommended",
    sizes: [
      { id: "s_300_1", name: "12x18 (Single)", lamination: 4.5, cutting: null, baseCost: 13 },
      { id: "s_300_2", name: "12x18 (Both side)", lamination: 6, cutting: null, baseCost: 16 },
      { id: "s_300_3", name: "13x19 (Single)", lamination: 4.75, cutting: null, baseCost: 14 },
      { id: "s_300_4", name: "13x19 (Both side)", lamination: 6.5, cutting: null, baseCost: 17 },
    ]
  },
  {
    id: "m_250gsm",
    media: "250 Gsm",
    description: "Stiff yet flexible paper for booklets, pamphlets, fold-outs, and invitations.",
    sizes: [
      { id: "s_250_1", name: "12x18 (Single)", lamination: 4.5, cutting: null, baseCost: 12 },
      { id: "s_250_2", name: "12x18 (Both side)", lamination: 6, cutting: null, baseCost: 15 },
      { id: "s_250_3", name: "13x19 (Single)", lamination: 4.75, cutting: null, baseCost: 13 },
      { id: "s_250_4", name: "13x19 (Both side)", lamination: 6.5, cutting: null, baseCost: 16 },
    ]
  },
  {
    id: "m_210gsm",
    media: "210 Gsm",
    description: "Medium-weight coated sheet for posters, art catalogs, and portfolio prints.",
    sizes: [
      { id: "s_210_1", name: "12x18 (Single)", lamination: 4.5, cutting: null, baseCost: 11.5 },
      { id: "s_210_2", name: "12x18 (Both side)", lamination: 6, cutting: null, baseCost: 14 },
      { id: "s_210_3", name: "13x19 (Single)", lamination: 4.75, cutting: null, baseCost: 12 },
      { id: "s_210_4", name: "13x19 (Both side)", lamination: 6.5, cutting: null, baseCost: 15 },
    ]
  },
  {
    id: "m_170gsm",
    media: "170 Gsm",
    description: "Smooth paper for high-volume promotional leaflets, magazines, and mailers.",
    sizes: [
      { id: "s_170_1", name: "12x18 (Single)", lamination: 4.5, cutting: null, baseCost: 11 },
      { id: "s_170_2", name: "12x18 (Both side)", lamination: 6, cutting: null, baseCost: 14 },
      { id: "s_170_3", name: "13x19 (Single)", lamination: 4.75, cutting: null, baseCost: 12 },
      { id: "s_170_4", name: "13x19 (Both side)", lamination: 6.5, cutting: null, baseCost: 15 },
    ]
  },
  {
    id: "m_100_130gsm",
    media: "100 /130 Gsm",
    description: "Economy light paper for bill books, bulk instruction sheets, and daily office handouts.",
    badge: "Economy",
    sizes: [
      { id: "s_100_1", name: "12x18 (Single)", lamination: 4.5, cutting: null, baseCost: 10 },
      { id: "s_100_2", name: "12x18 (Both side)", lamination: 6, cutting: null, baseCost: 13 },
      { id: "s_100_3", name: "13x19 (Single)", lamination: 4.75, cutting: null, baseCost: 11 },
      { id: "s_100_4", name: "13x19 (Both side)", lamination: 6.5, cutting: null, baseCost: 14 },
    ]
  },
  {
    id: "m_sticker",
    media: "Sticker Sheet",
    description: "Self-adhesive paper sticker with optional precision kiss-cut (half cut).",
    badge: "Sticker Sheet",
    sizes: [
      { id: "s_stk_1", name: "12x18 (Single)", lamination: 4.5, cutting: 8, baseCost: 13 },
      { id: "s_stk_2", name: "13x19 (Single)", lamination: 4.75, cutting: 9, baseCost: 16 },
    ]
  },
  {
    id: "m_translucent",
    media: "OPEQUE / TRANSPRENT",
    description: "Specialty synthetic film (Opaque white or Crystal Clear) for labels and waterproof overlays.",
    sizes: [
      { id: "s_trn_1", name: "12x18 (Single)", lamination: null, cutting: null, baseCost: 17 },
      { id: "s_trn_2", name: "13x19 (Single)", lamination: null, cutting: null, baseCost: 20 },
    ]
  },
  {
    id: "m_letterhead",
    media: "A3 Letter Head",
    description: "Executive bond paper, perfectly suited for official forms, contracts, and letters.",
    sizes: [
      { id: "s_let_1", name: "A3 (Single)", lamination: null, cutting: null, baseCost: 9.5 },
    ]
  },
  {
    id: "m_party",
    media: "PARTY PAPER PRINTING",
    description: "Cost-effective vibrant color printing for announcements, event flyers, and posters.",
    sizes: [
      { id: "s_pty_1", name: "13*19 (Single)", lamination: null, cutting: null, baseCost: 9 },
    ]
  }
];

export const SHOWCASE_GALLERY = [
  {
    id: "showcase-1",
    title: "Custom Printing Showcase",
    subtitle: "Flyers, Cards & Stickers",
    description: "Full spectrum digital offset printing with rich saturated colors, sharp text, and micro-dot alignment.",
    image: "/showcase/custom-printing-showcase.jpg",
    tag: "Showcase"
  },
  {
    id: "showcase-2",
    title: "Sheet Size Comparison",
    subtitle: "12x18 vs 13x19 Inch Sheets",
    description: "Detailed layout comparison to help you maximize your sticker and card imposition per sheet.",
    image: "/showcase/sheet-size-comparison.jpg",
    tag: "Size Guide"
  },
  {
    id: "showcase-3",
    title: "Premium Media & Sticker Guide",
    subtitle: "Paper Weight & Substrate Guide",
    description: "Explore from 100 GSM lightweight to 350 GSM ultra-rigid boards and synthetic vinyls.",
    image: "/showcase/media-sticker-guide.jpg",
    tag: "Substrates"
  },
  {
    id: "showcase-4",
    title: "Lamination Finish Options",
    subtitle: "Thermal Gloss, Matte & Velvet",
    description: "Protect against moisture, tears, and scratches while providing a luxurious tactile finish.",
    image: "/showcase/lamination-options.jpg",
    tag: "Finishes"
  },
  {
    id: "showcase-5",
    title: "Precision Cutting Services",
    subtitle: "Half Cut / Kiss Cut & Die Punching",
    description: "CNC digital contour plotter cutting for peel-and-stick labels, custom shapes, and packaging.",
    image: "/showcase/precision-cutting.jpg",
    tag: "Cutting"
  },
  {
    id: "showcase-6",
    title: "Custom Packaging & Labels",
    subtitle: "Boutique & Retail Ready",
    description: "Complete unboxing branding: product sleeves, pouch seals, bottle labels, and gift tags.",
    image: "/showcase/floral-packaging.jpg",
    tag: "Packaging"
  }
];
