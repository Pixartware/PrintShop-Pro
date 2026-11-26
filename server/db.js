const fs = require('fs');
const path = require('path');

const BUNDLED_DB_FILE = path.join(__dirname, 'data', 'printshop.json');
const DB_FILE = process.env.VERCEL
  ? path.join('/tmp', 'printshop.json')
  : BUNDLED_DB_FILE;

// Default initial state
const INITIAL_SETTINGS = {
  business_name: "Akshar PrintShop Pro",
  brand_title: "Akshar PrintShop Pro",
  tagline: "Commercial Digital Printing & Precision Finishing",
  upi_id: "aksharstudio-2@okicici",
  whatsapp_number: "916354871446",
  script_url: "https://script.google.com/macros/s/AKfycbzRwtwNObuYTQXaZA9sOQW8mfArrfosgT2TqoK-s5w8FtYNYwDl6ZaeauhRD_Nz2cF_/exec",
  admin_emails: ["admin@phototoolsai.com", "hitesh@phototoolsai.com", "pixartware@gmail.com"],
  admin_pin: "1234",

  gst_rate: 18,
  shipping_fee: 70,
  free_shipping_threshold: 1000,
  order_prefix: "APP",
  catalog_source_path: "/Volumes/STUDIO/AKSHAR/AKSHAR 1TB/AKSHAR SALES/|| Akshar PrintShop Pro",
  sync_status: {
    connected: true,
    last_sync: new Date().toISOString(),
    products_found: 10,
    new_products: 1,
    updated_products: 15,
    removed_products: 2,
    images_count: 1436
  }
};

const INITIAL_CATEGORIES = [
  {
    "id": "commercial-printing",
    "name": "Commercial Printing",
    "slug": "commercial-printing",
    "description": "High-speed digital printing on 12x18 & 13x19 sheets across 100 to 350 GSM papers.",
    "icon": "Printer",
    "subcategories": [
      {
        "id": "sheet-printing",
        "name": "Sheet Printing",
        "slug": "sheet-printing"
      },
      {
        "id": "flyers-leaflets",
        "name": "Flyers & Leaflets",
        "slug": "flyers-leaflets"
      },
      {
        "id": "brochures",
        "name": "Brochures",
        "slug": "brochures"
      },
      {
        "id": "posters",
        "name": "Posters",
        "slug": "posters"
      },
      {
        "id": "magazines-books",
        "name": "Magazines & Booklets",
        "slug": "magazines-books"
      }
    ]
  },
  {
    "id": "stickers-labels",
    "name": "Stickers & Labels",
    "slug": "stickers-labels",
    "description": "Precision computer half-cut sticker sheets, vinyl, opaque & transparent prints.",
    "icon": "Sparkles",
    "subcategories": [
      {
        "id": "sticker-sheets",
        "name": "Sticker Sheets (Half Cut)",
        "slug": "sticker-sheets"
      },
      {
        "id": "vinyl-stickers",
        "name": "Vinyl & Waterproof Stickers",
        "slug": "vinyl-stickers"
      },
      {
        "id": "opaque-transparent",
        "name": "Opaque & Transparent Sheets",
        "slug": "opaque-transparent"
      },
      {
        "id": "product-labels",
        "name": "Product & Packaging Labels",
        "slug": "product-labels"
      }
    ]
  },
  {
    "id": "business-stationery",
    "name": "Business Stationery",
    "slug": "business-stationery",
    "description": "Executive visiting cards, letterheads, certificates, envelopes & branded stationery.",
    "icon": "FileText",
    "subcategories": [
      {
        "id": "visiting-cards",
        "name": "Visiting Cards",
        "slug": "visiting-cards"
      },
      {
        "id": "letterheads",
        "name": "A3 & A4 Letterheads",
        "slug": "letterheads"
      },
      {
        "id": "certificates",
        "name": "Certificates",
        "slug": "certificates"
      },
      {
        "id": "envelopes",
        "name": "Envelopes & Folders",
        "slug": "envelopes"
      }
    ]
  },
  {
    "id": "party-specialty",
    "name": "Event & Party Printing",
    "slug": "party-specialty",
    "description": "Party paper printing, custom cutouts, photo backdrops & festival banners.",
    "icon": "Calendar",
    "subcategories": [
      {
        "id": "party-paper",
        "name": "Party Paper Printing",
        "slug": "party-paper"
      },
      {
        "id": "cutouts-props",
        "name": "Party Cutouts & Props",
        "slug": "cutouts-props"
      },
      {
        "id": "photo-prints",
        "name": "Custom Photo Prints",
        "slug": "photo-prints"
      }
    ]
  }
];

const INITIAL_PRODUCTS = [
  {
    "id": "PERSONALIZED_PRINT_SERVICE",
    "sku": "APP_PRINT_SERVICE",
    "name": "Personalized Commercial Print Service",
    "category": "Commercial Printing",
    "category_slug": "commercial-printing",
    "subcategory": "Sheet Printing",
    "subcategory_slug": "sheet-printing",
    "short_description": "High-speed commercial 12x18 & 13x19 sheet digital printing, 100-350 GSM papers, sticker sheets, thermal lamination & precision half-cut.",
    "full_description": "Studio-grade commercial digital printing designed for rapid turnarounds and impeccable sharpness. Choose from 100 GSM, 130 GSM, 170 GSM, 210 GSM, 250 GSM, 300 GSM, and 350 GSM art papers/boards, specialty Gloss/Matte Sticker sheets, and Opaque/Transparent Vinyl films. Configure single or both-side gloss/matte thermal lamination and precision computer half-cut kiss cutting. Upload print-ready files (ZIP, RAR, CDR, PSD, AI, PDF, JPG, PNG) and calculate multi-item costs in real-time.",
    "material": "Art Card / Sticker / Vinyl Substrates",
    "default_size": "12 × 18 inch",
    "width": "12",
    "height": "18",
    "thickness": "0.5 mm",
    "weight": "0.05 kg",
    "base_price": 9,
    "selling_price": 9,
    "mrp": 15,
    "discount": 40,
    "tax": 18,
    "stock": 9999,
    "production_time": "Same Day / 24 Hours",
    "tags": [
      "Sheet Printing",
      "Digital Printing",
      "12x18",
      "13x19",
      "Sticker Sheet",
      "Lamination",
      "Commercial"
    ],
    "keywords": [
      "12x18 digital printing",
      "13x19 print",
      "sticker printing",
      "commercial print shop",
      "lamination",
      "half cut stickers"
    ],
    "images": [
      "/catalog-images/00.%20Personalized%20Print%20Service/01%20Custom%20Printing%20Showcase_%20Flyers%2C%20Cards%20%26%20Stickers-5.jpg",
      "/catalog-images/00.%20Personalized%20Print%20Service/01%20Personalised%20Print%20Services%20Infographic%20Grid.jpg",
      "/catalog-images/00.%20Personalized%20Print%20Service/01%20Personalized%20Print%20Service%20Showcase-1.jpg",
      "/catalog-images/00.%20Personalized%20Print%20Service/01%20Personalized%20Prints%2C%20Stickers%20%26%20Packaging.jpg",
      "/catalog-images/00.%20Personalized%20Print%20Service/02%20Print%20Sheet%20Size%20Comparison-3.jpg",
      "/catalog-images/00.%20Personalized%20Print%20Service/03%20Premium%20Media%20%26%20Sticker%20Guide.jpg",
      "/catalog-images/00.%20Personalized%20Print%20Service/04%20Premium%20Lamination%20Finish%20Options.jpg",
      "/catalog-images/00.%20Personalized%20Print%20Service/05%20Custom%20Floral%20Packaging%20Solutions.jpg",
      "/catalog-images/00.%20Personalized%20Print%20Service/06%20Precision%20Cutting%20Services%20Infographic.jpg",
      "/catalog-images/00.%20Personalized%20Print%20Service/Custom%20Paper%20Prints%20Showcase%20(1).jpg"
    ],
    "customization_available": true,
    "requires_photo": true,
    "required_photos_count": 1,
    "custom_text_allowed": true,
    "active": true,
    "featured": true,
    "new_product": true,
    "best_seller": true,
    "costs": {
      "material_cost": 4,
      "print_cost": 3,
      "labor_cost": 1,
      "packaging_cost": 1,
      "shipping_cost": 0
    },
    "custom_options": {
      "sizes": [
        {
          "name": "12 × 18 inch (Single Side)",
          "price_adj": 0,
          "default": true
        },
        {
          "name": "12 × 18 inch (Both Side)",
          "price_adj": 3
        },
        {
          "name": "13 × 19 inch (Single Side)",
          "price_adj": 1
        },
        {
          "name": "13 × 19 inch (Both Side)",
          "price_adj": 4
        },
        {
          "name": "A3 Single Side",
          "price_adj": 0.5
        }
      ],
      "materials": [
        {
          "name": "300 GSM Premium Art Card",
          "price_adj": 0,
          "default": true
        },
        {
          "name": "350 GSM Heavy Board",
          "price_adj": 1
        },
        {
          "name": "250 GSM Art Card",
          "price_adj": -1
        },
        {
          "name": "210 GSM Art Paper",
          "price_adj": -1.5
        },
        {
          "name": "170 GSM Art Paper",
          "price_adj": -2
        },
        {
          "name": "130 GSM Paper",
          "price_adj": -3
        },
        {
          "name": "Self-Adhesive Sticker Sheet",
          "price_adj": 0
        },
        {
          "name": "Opaque / Transparent Film",
          "price_adj": 4
        }
      ],
      "finishes": [
        {
          "name": "Without Lamination (Natural)",
          "price_adj": 0,
          "default": true
        },
        {
          "name": "Thermal Gloss Lamination",
          "price_adj": 4.5
        },
        {
          "name": "Thermal Matte Lamination",
          "price_adj": 4.5
        },
        {
          "name": "Both Side Gloss Lamination",
          "price_adj": 6
        },
        {
          "name": "Both Side Matte Lamination",
          "price_adj": 6
        }
      ],
      "frames": [],
      "quantity_tiers": [
        {
          "min": 1,
          "max": 24,
          "discount_percent": 0
        },
        {
          "min": 25,
          "max": 99,
          "discount_percent": 5
        },
        {
          "min": 100,
          "max": 499,
          "discount_percent": 10
        },
        {
          "min": 500,
          "max": 9999,
          "discount_percent": 20
        }
      ],
      "extras": [
        {
          "id": "half_cut",
          "name": "Computer Half-Cut Kiss Cutting (Per Sheet)",
          "price_adj": 8
        },
        {
          "id": "full_cut",
          "name": "Guillotine Precision Trimming",
          "price_adj": 2
        }
      ]
    },
    "seo": {
      "title": "Personalized Commercial Print Service | Akshar PrintShop Pro",
      "meta_description": "Order professional 12x18 & 13x19 sheet digital printing, 100-350 GSM papers, sticker sheets, thermal lamination & half-cut.",
      "keywords": "12x18 printing, 13x19 printing, digital print shop, stickers, lamination",
      "slug": "personalized-print-service"
    }
  }
];

const INITIAL_ORDERS = [];

class Database {
  constructor() {
    this.data = {
      settings: INITIAL_SETTINGS,
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      payments: [],
      production_jobs: [],
      qc_records: [],
      shipments: [],
      design_proofs: [],
      customers: [],
      audit_logs: [
        {
          id: "log-1",
          user: "System",
          action: "Initialize Database",
          timestamp: new Date().toISOString()
        }
      ]
    };

    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = { ...this.data, ...parsed };
        return;
      }

      if (fs.existsSync(BUNDLED_DB_FILE)) {
        const raw = fs.readFileSync(BUNDLED_DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = { ...this.data, ...parsed };
        this.save();
        return;
      }

      this.save();
    } catch (err) {
      console.error('Error loading DB file, fallback to defaults:', err);
    }
  }

  save() {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Warning writing database file (handled for read-only environments):', err.message);
    }
  }

  // Master ordered category list for Akshar PrintShop Pro
  static ORDERED_CATEGORIES = [
    "Personalized Print Service",
    "Commercial Printing",
    "Sheet Printing",
    "Stickers & Labels",
    "Business Stationery",
    "Event & Party Printing"
  ];

  // --- Products ---
  getProducts(filters = {}) {
    let list = [...this.data.products];
    if (filters.category) {
      list = list.filter(p => p.category.toLowerCase() === filters.category.toLowerCase() || p.category_slug === filters.category.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
        (p.keywords && p.keywords.some(k => k.toLowerCase().includes(q))) ||
        (p.material && p.material.toLowerCase().includes(q))
      );
    }
    if (filters.featured) {
      list = list.filter(p => p.featured);
    }

    // Sort products by priority categories
    list.sort((a, b) => {
      const idxA = Database.ORDERED_CATEGORIES.findIndex(c => c.toLowerCase() === (a.category || '').toLowerCase());
      const idxB = Database.ORDERED_CATEGORIES.findIndex(c => c.toLowerCase() === (b.category || '').toLowerCase());
      const posA = idxA === -1 ? 999 : idxA;
      const posB = idxB === -1 ? 999 : idxB;
      if (posA !== posB) return posA - posB;
      return (a.name || '').localeCompare(b.name || '');
    });

    return list;
  }

  getProductById(idOrSku) {
    return this.data.products.find(p => p.id === idOrSku || p.sku === idOrSku);
  }

  saveProduct(product) {
    const idx = this.data.products.findIndex(p => p.id === product.id || p.sku === product.sku);
    if (idx >= 0) {
      this.data.products[idx] = { ...this.data.products[idx], ...product, updated_at: new Date().toISOString() };
    } else {
      if (!product.id) product.id = `prod-${Date.now()}`;
      product.created_at = new Date().toISOString();
      this.data.products.unshift(product);
    }
    this.save();
    return product;
  }

  deleteProduct(id) {
    this.data.products = this.data.products.filter(p => p.id !== id && p.sku !== id);
    this.save();
    return true;
  }

  // --- Categories ---
  getCategories() {
    const configuredCategories = this.data.categories || [];
    const prodCategories = [...new Set((this.data.products || []).map(p => p.category).filter(Boolean))];

    const result = [...configuredCategories];
    for (const catName of prodCategories) {
      if (!result.some(c => (c.name || '').toLowerCase() === catName.toLowerCase())) {
        const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        let icon = 'Printer';
        const lower = catName.toLowerCase();
        if (lower.includes('sticker') || lower.includes('label')) icon = 'Tag';
        else if (lower.includes('card') || lower.includes('stationery')) icon = 'FileText';
        else if (lower.includes('party') || lower.includes('event')) icon = 'Calendar';
        result.push({
          id: `cat-${slug}`,
          name: catName,
          slug: slug,
          description: `High-quality ${catName} solutions customized to your specifications.`,
          icon: icon,
          subcategories: []
        });
      }
    }
    return result;
  }

  saveCategory(category) {
    const idx = this.data.categories.findIndex(c => c.id === category.id);
    if (idx >= 0) {
      this.data.categories[idx] = { ...this.data.categories[idx], ...category };
    } else {
      this.data.categories.push(category);
    }
    this.save();
    return category;
  }

  // --- Orders ---
  getOrders(filters = {}) {
    let list = [...this.data.orders];
    if (filters.order_status) {
      list = list.filter(o => o.order_status === filters.order_status);
    }
    if (filters.payment_status) {
      list = list.filter(o => o.payment_status === filters.payment_status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(o =>
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.toLowerCase().includes(q) ||
        o.customer_email.toLowerCase().includes(q) ||
        (o.items && o.items.some(i => i.sku.toLowerCase().includes(q)))
      );
    }
    // Return latest first
    return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }

  getOrderById(idOrNum) {
    if (!idOrNum) return null;
    const clean = String(idOrNum).trim();
    // 1. Check exact order_number or id
    const exact = this.data.orders.find(o => 
      o.id === clean || 
      (o.order_number && o.order_number.toLowerCase() === clean.toLowerCase())
    );
    if (exact) return exact;

    // 2. Check customer phone match (last 10 digits)
    const digitsOnly = clean.replace(/[^0-9]/g, '');
    if (digitsOnly.length >= 10) {
      const targetPhone = digitsOnly.slice(-10);
      const byPhone = this.data.orders.filter(o => 
        o.customer_phone && o.customer_phone.replace(/[^0-9]/g, '').endsWith(targetPhone)
      ).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      if (byPhone.length > 0) return byPhone[0];
    }
    return null;
  }

  getOrdersByCustomerPhone(phone) {
    if (!phone) return [];
    const cleanDigits = String(phone).replace(/[^0-9]/g, '').slice(-10);
    if (!cleanDigits) return [];
    return this.data.orders.filter(o => 
      o.customer_phone && o.customer_phone.replace(/[^0-9]/g, '').endsWith(cleanDigits)
    ).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }


  createOrder(order) {
    if (!order.id) order.id = `ord-${Date.now()}`;
    if (!order.order_number) {
      const d = new Date();
      const dateStr = d.toISOString().slice(0, 10).replace(/-/g, '');
      const count = (this.data.orders.length + 1).toString().padStart(4, '0');
      order.order_number = `${this.data.settings.order_prefix || 'CRQ'}-${dateStr}-${count}`;
    }
    order.created_at = new Date().toISOString();
    order.updated_at = new Date().toISOString();
    order.order_status = order.order_status || 'NEW';
    order.payment_status = order.payment_status || 'Pending';

    // Build timeline
    order.timeline = [
      { status: "NEW", label: "Order Placed", date: order.created_at, completed: true, current: true },
      { status: "PAYMENT PENDING", label: "Payment Verification", completed: false },
      { status: "DESIGN APPROVAL", label: "Artwork Approval", completed: false },
      { status: "PRODUCTION", label: "In Production", completed: false },
      { status: "QUALITY CHECK", label: "Quality Inspection", completed: false },
      { status: "PACKING", label: "Packing & Boxing", completed: false },
      { status: "READY TO DISPATCH", label: "Shipping Manifest Ready", completed: false },
      { status: "DISPATCHED", label: "Dispatched with Tracking", completed: false },
      { status: "DELIVERED", label: "Delivered", completed: false }
    ];

    this.data.orders.unshift(order);

    // Also update/create customer record
    this.upsertCustomer({
      name: order.customer_name,
      email: order.customer_email,
      phone: order.customer_phone,
      amount: order.grand_total,
      address: order.shipping_address
    });

    this.save();
    return order;
  }

  updateOrder(orderNumber, updates) {
    const idx = this.data.orders.findIndex(o => o.order_number === orderNumber || o.id === orderNumber);
    if (idx >= 0) {
      this.data.orders[idx] = {
        ...this.data.orders[idx],
        ...updates,
        updated_at: new Date().toISOString()
      };
      this.save();
      return this.data.orders[idx];
    }
    return null;
  }

  deleteOrder(orderNumber) {
    if (!this.data.orders) return false;
    const clean = String(orderNumber).trim();
    const idx = this.data.orders.findIndex(o => o.order_number === clean || o.id === clean);
    if (idx === -1) return false;
    const deleted = this.data.orders.splice(idx, 1)[0];

    // Remove associated payments, production jobs, and design proofs
    if (this.data.payments) {
      this.data.payments = this.data.payments.filter(
        p => p.order_number !== clean && p.order_id !== deleted.id
      );
    }
    if (this.data.production_jobs) {
      this.data.production_jobs = this.data.production_jobs.filter(
        j => j.order_number !== clean && j.order_id !== deleted.id
      );
    }
    if (this.data.design_proofs) {
      this.data.design_proofs = this.data.design_proofs.filter(
        d => d.order_number !== clean && d.order_id !== deleted.id
      );
    }

    this.save();
    return true;
  }

  deleteCustomer(idOrPhone) {
    if (!this.data.customers) return false;
    const cleanDigits = String(idOrPhone).replace(/[^0-9]/g, '').slice(-10);
    const idx = this.data.customers.findIndex(c => 
      c.id === idOrPhone || 
      (cleanDigits && c.phone && c.phone.replace(/[^0-9]/g, '').endsWith(cleanDigits))
    );
    if (idx === -1) return false;
    this.data.customers.splice(idx, 1);
    this.save();
    return true;
  }

  upsertCustomer({ name, email, phone, amount, address }) {
    if (!this.data.customers) this.data.customers = [];
    const cleanPhone = phone ? String(phone).replace(/[^0-9]/g, '').slice(-10) : '';
    let cust = this.data.customers.find(c => 
      (cleanPhone && c.phone && c.phone.replace(/[^0-9]/g, '').endsWith(cleanPhone)) ||
      (email && c.email && c.email.toLowerCase() === email.toLowerCase())
    );

    if (cust) {
      cust.orders_count = (cust.orders_count || 1) + 1;
      cust.total_spent = (cust.total_spent || 0) + (amount || 0);
      if (name && (!cust.name || cust.name === 'Guest Customer')) cust.name = name;
      if (email && !cust.email) cust.email = email;
      if (address && !cust.saved_address) cust.saved_address = address;
      cust.last_order_at = new Date().toISOString();
    } else {
      cust = {
        id: `cust-${Date.now()}`,
        name: name || (cleanPhone ? `Customer ${cleanPhone.slice(-4)}` : "Guest Customer"),
        email: email || "",
        phone: cleanPhone || phone || "",
        saved_address: address || null,
        orders_count: 1,
        total_spent: amount || 0,
        created_at: new Date().toISOString(),
        last_order_at: new Date().toISOString()
      };
      this.data.customers.push(cust);
    }
    this.save();
    return cust;
  }


  // --- Payments ---
  getPayments() {
    return this.data.payments.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }

  claimPayment({ order_number, utr, screenshot_url, amount }) {
    const payment = {
      id: `pay-${Date.now()}`,
      order_number,
      amount: Number(amount),
      utr: utr || "",
      screenshot_url: screenshot_url || "",
      status: "Customer Claimed Paid",
      created_at: new Date().toISOString()
    };
    this.data.payments.unshift(payment);

    // Update the corresponding order
    this.updateOrder(order_number, {
      payment_status: "Customer Claimed Paid",
      utr: utr,
      payment_screenshot: screenshot_url
    });

    this.save();
    return payment;
  }

  verifyPayment({ payment_id, order_number, verified_by, action, rejection_reason }) {
    const status = action === 'verify' ? 'Verified' : 'Verification Required';
    const pIdx = this.data.payments.findIndex(p => p.id === payment_id || p.order_number === order_number);
    if (pIdx >= 0) {
      this.data.payments[pIdx].status = status;
      this.data.payments[pIdx].verified_by = verified_by;
      this.data.payments[pIdx].verified_at = new Date().toISOString();
      if (rejection_reason) this.data.payments[pIdx].rejection_reason = rejection_reason;
    }

    const orderStatus = action === 'verify' ? 'PAYMENT VERIFIED' : 'PAYMENT PENDING';
    this.updateOrder(order_number, {
      payment_status: status,
      order_status: orderStatus
    });

    this.logAudit({
      user: verified_by,
      action: action === 'verify' ? 'Verified Payment' : 'Rejected Payment',
      entity_type: 'Order',
      entity_id: order_number,
      new_value: status
    });

    this.save();
    return { success: true, status };
  }

  // --- Production & QC & Dispatch ---
  getProductionJobs() {
    return this.data.production_jobs;
  }

  updateProductionJob(id, updates) {
    const idx = this.data.production_jobs.findIndex(j => j.id === id || j.order_number === id);
    if (idx >= 0) {
      this.data.production_jobs[idx] = { ...this.data.production_jobs[idx], ...updates };
      this.save();
      return this.data.production_jobs[idx];
    }
    return null;
  }

  saveQcRecord(record) {
    record.id = record.id || `qc-${Date.now()}`;
    record.passed_at = new Date().toISOString();
    this.data.qc_records.unshift(record);
    this.save();
    return record;
  }

  saveShipment(shipment) {
    shipment.id = shipment.id || `shp-${Date.now()}`;
    shipment.dispatch_date = shipment.dispatch_date || new Date().toISOString();
    this.data.shipments.unshift(shipment);
    this.save();
    return shipment;
  }

  // --- Design Proofs ---
  getDesignProofs(order_number) {
    if (order_number) {
      return this.data.design_proofs.filter(d => d.order_number === order_number);
    }
    return this.data.design_proofs;
  }

  saveDesignProof(proof) {
    const idx = this.data.design_proofs.findIndex(p => p.order_number === proof.order_number);
    if (idx >= 0) {
      this.data.design_proofs[idx] = { ...this.data.design_proofs[idx], ...proof, updated_at: new Date().toISOString() };
    } else {
      proof.id = `proof-${Date.now()}`;
      proof.created_at = new Date().toISOString();
      this.data.design_proofs.unshift(proof);
    }
    this.save();
    return proof;
  }

  // --- Settings ---
  getSettings() {
    return this.data.settings;
  }

  updateSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.save();
    return this.data.settings;
  }

  // --- Audit Logs ---
  logAudit({ user, action, entity_type, entity_id, prev_value, new_value }) {
    const log = {
      id: `log-${Date.now()}`,
      user: user || "Admin",
      action,
      entity_type,
      entity_id,
      prev_value,
      new_value,
      timestamp: new Date().toISOString()
    };
    this.data.audit_logs.unshift(log);
    // Keep max 500 logs
    if (this.data.audit_logs.length > 500) {
      this.data.audit_logs = this.data.audit_logs.slice(0, 500);
    }
    this.save();
  }

  getAuditLogs() {
    return this.data.audit_logs;
  }
}

module.exports = new Database();
