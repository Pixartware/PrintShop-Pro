import React, { useState, useEffect } from 'react';
import CustomerView from './components/CustomerView';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { 
  getStoredPricing, saveStoredPricing, 
  getStoredConfig, saveStoredConfig, 
  getStoredOrders, saveStoredOrder,
  getStoredCustomers,
  auth, db, appId 
} from './utils/storage';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';

export default function App() {
  const [view, setView] = useState('customer'); // 'customer', 'admin_login', 'admin_panel'
  const [pricingData, setPricingData] = useState(getStoredPricing);
  const [config, setConfig] = useState(getStoredConfig);
  const [orders, setOrders] = useState(getStoredOrders);
  const [customers, setCustomers] = useState(getStoredCustomers);
  const [user, setUser] = useState(null);
  const [isDbLoading, setIsDbLoading] = useState(false);

  // Theme management
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('printshop_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('printshop_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('printshop_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Firebase auth & live syncing
  useEffect(() => {
    if (!auth) return;
    
    signInAnonymously(auth).catch((err) => {
      console.warn("Anonymous auth failed, running in offline mode:", err);
    });

    const unsubscribeAuth = onAuthStateChanged(auth, setUser);
    return () => unsubscribeAuth();
  }, []);

  // Firebase pricing sync listener
  useEffect(() => {
    if (!db) return;
    try {
      const pricingDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'pricing', 'latest');
      const unsubscribe = onSnapshot(pricingDocRef, (snap) => {
        if (snap.exists() && snap.data().items) {
          setPricingData(snap.data().items);
          saveStoredPricing(snap.data().items);
        }
      }, (err) => {
        console.warn("Pricing cloud sync note:", err.message);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firebase listener setup:", e);
    }
  }, [user]);

  // Handle new order submission
  const handleOrderSubmitted = (newOrder) => {
    const updated = saveStoredOrder(newOrder);
    if (updated) {
      setOrders(updated);
      setCustomers(getStoredCustomers());
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-950 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
      
      {view === 'customer' && (
        <CustomerView
          pricingData={pricingData}
          config={config}
          orders={orders}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          onAdminClick={() => setView('admin_login')}
          onOrderSubmitted={handleOrderSubmitted}
        />
      )}

      {view === 'admin_login' && (
        <AdminLogin
          config={config}
          onLogin={() => setView('admin_panel')}
          onCancel={() => setView('customer')}
        />
      )}

      {view === 'admin_panel' && (
        <AdminDashboard
          pricingData={pricingData}
          setPricingData={setPricingData}
          config={config}
          setConfig={setConfig}
          orders={orders}
          setOrders={setOrders}
          customers={customers}
          setCustomers={setCustomers}
          onExit={() => setView('customer')}
          isDarkMode={isDarkMode}
        />
      )}

    </div>
  );
}
