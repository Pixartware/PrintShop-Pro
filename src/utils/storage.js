// Firebase & LocalStorage Unified Layer for Akshar PrintShop Pro
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, getDoc, collection, getDocs } from 'firebase/firestore';
import { DEFAULT_PRICING_DATA, INITIAL_CONFIG } from '../data/defaultPricing';

let app = null;
let auth = null;
let db = null;

const STORAGE_KEYS = {
  PRICING: 'printshop_pricing_v2',
  CONFIG: 'printshop_config_v2',
  ORDERS: 'printshop_orders_v2',
  CUSTOMERS: 'printshop_customers_v2',
  ADMIN_SESSION: 'printshop_admin_session'
};

// Initialize Firebase safely
try {
  const firebaseConfig = typeof window !== 'undefined' && window.__firebase_config
    ? (typeof window.__firebase_config === 'string' ? JSON.parse(window.__firebase_config) : window.__firebase_config)
    : null;

  if (firebaseConfig && firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (err) {
  console.warn("Running in local offline-first mode:", err.message);
}

const appId = typeof window !== 'undefined' && window.__app_id ? window.__app_id : 'akshar-printshop-pro';

export { app, auth, db, appId };

// LocalStorage helpers
export const getStoredPricing = () => {
  if (typeof window === 'undefined') return DEFAULT_PRICING_DATA;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRICING);
    return data ? JSON.parse(data) : DEFAULT_PRICING_DATA;
  } catch (e) {
    return DEFAULT_PRICING_DATA;
  }
};

export const saveStoredPricing = (pricing) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(pricing));
  } catch (e) {
    console.error("Failed to save pricing to local storage", e);
  }
};

export const getStoredConfig = () => {
  if (typeof window === 'undefined') return INITIAL_CONFIG;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return data ? { ...INITIAL_CONFIG, ...JSON.parse(data) } : INITIAL_CONFIG;
  } catch (e) {
    return INITIAL_CONFIG;
  }
};

export const saveStoredConfig = (config) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save config to local storage", e);
  }
};

export const getStoredOrders = () => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!data) {
      // Return a couple of initial seed sample orders so the admin panel looks populated and ready immediately
      const initialSampleOrders = [
        {
          orderId: "ORD-20261126-001",
          name: "Ramesh Patel",
          mobile: "9876543210",
          email: "ramesh.patel@gmail.com",
          deliveryMode: "Door Pickup",
          status: "Ready for Pickup",
          items: [
            { media: "350 Gsm", size: "12x18 (Both side)", lamination: true, cutting: false, qty: 100, unitCost: 23, total: 2300 }
          ],
          totalAmount: 2300,
          totalQty: 100,
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          paymentStatus: "Verified",
          screenshotName: "gpay_ramesh.jpg",
          notes: "Gloss thermal lamination on both sides"
        },
        {
          orderId: "ORD-20261126-002",
          name: "Pooja Studio & Events",
          mobile: "9428123456",
          email: "poojastudio@yahoo.com",
          deliveryMode: "Courier",
          status: "In Production",
          items: [
            { media: "Sticker Sheet", size: "13x19 (Single)", lamination: true, cutting: true, qty: 50, unitCost: 29.75, total: 1487.5 }
          ],
          totalAmount: 1487.5,
          totalQty: 50,
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          paymentStatus: "Verified",
          screenshotName: "upi_pooja.png",
          notes: "Round kiss-cut 2-inch diameter stickers"
        }
      ];
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialSampleOrders));
      return initialSampleOrders;
    }
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const saveStoredOrder = (newOrder) => {
  if (typeof window === 'undefined') return;
  try {
    const currentOrders = getStoredOrders();
    const updated = [newOrder, ...currentOrders];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));

    // Update customer index
    syncCustomerFromOrder(newOrder);
    return updated;
  } catch (e) {
    console.error("Failed to save order to local storage", e);
  }
};

export const updateStoredOrderStatus = (orderId, newStatus, trackingNotes = '') => {
  if (typeof window === 'undefined') return;
  try {
    const currentOrders = getStoredOrders();
    const updated = currentOrders.map(o => {
      if (o.orderId === orderId) {
        return {
          ...o,
          status: newStatus,
          notes: trackingNotes || o.notes,
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    });
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to update order status", e);
  }
};

export const getStoredCustomers = () => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (!data) {
      const orders = getStoredOrders();
      const map = {};
      orders.forEach(o => {
        const key = o.mobile || o.email;
        if (!key) return;
        if (!map[key]) {
          map[key] = {
            id: key,
            name: o.name,
            mobile: o.mobile,
            email: o.email,
            deliveryMode: o.deliveryMode,
            orderCount: 1,
            totalSpent: o.totalAmount,
            firstOrderDate: o.createdAt,
            lastOrderDate: o.createdAt
          };
        } else {
          map[key].orderCount += 1;
          map[key].totalSpent += o.totalAmount;
          map[key].lastOrderDate = o.createdAt;
        }
      });
      const customerList = Object.values(map);
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customerList));
      return customerList;
    }
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const syncCustomerFromOrder = (order) => {
  try {
    const customers = getStoredCustomers();
    const key = order.mobile || order.email;
    if (!key) return;

    const existingIndex = customers.findIndex(c => c.mobile === order.mobile || (order.email && c.email === order.email));

    if (existingIndex >= 0) {
      customers[existingIndex].name = order.name || customers[existingIndex].name;
      customers[existingIndex].orderCount += 1;
      customers[existingIndex].totalSpent += Number(order.totalAmount || 0);
      customers[existingIndex].lastOrderDate = order.createdAt || new Date().toISOString();
      customers[existingIndex].deliveryMode = order.deliveryMode || customers[existingIndex].deliveryMode;
    } else {
      customers.push({
        id: key,
        name: order.name,
        mobile: order.mobile,
        email: order.email,
        deliveryMode: order.deliveryMode,
        orderCount: 1,
        totalSpent: Number(order.totalAmount || 0),
        firstOrderDate: order.createdAt || new Date().toISOString(),
        lastOrderDate: order.createdAt || new Date().toISOString()
      });
    }

    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  } catch (e) {
    console.error("Failed to sync customer", e);
  }
};
