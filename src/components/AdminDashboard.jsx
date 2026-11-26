import React, { useState, useMemo } from 'react';
import { 
  Settings, Save, LogOut, RefreshCw, Plus, Trash2, X, Check, AlertCircle, 
  Users, IndianRupee, ShoppingBag, Eye, TrendingUp, Search, Download, 
  Filter, Phone, Mail, ExternalLink, Shield, KeyRound, Sparkles, 
  Smartphone, FileText, CheckCircle2, Clock, Truck, PackageCheck, 
  Percent, ArrowUpDown, ChevronDown, ChevronRight
} from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db, appId, saveStoredPricing, saveStoredConfig, updateStoredOrderStatus } from '../utils/storage';
import { DEFAULT_PRICING_DATA } from '../data/defaultPricing';

export default function AdminDashboard({ 
  pricingData, 
  setPricingData, 
  config, 
  setConfig, 
  orders, 
  setOrders, 
  customers, 
  setCustomers,
  onExit, 
  isDarkMode 
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'pricing', 'customers', 'orders', 'settings'
  const [data, setData] = useState(() => JSON.parse(JSON.stringify(pricingData)));
  const [storeConfig, setStoreConfig] = useState(() => ({ ...config }));
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  
  // Orders filter & search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Customer search
  const [customerSearch, setCustomerSearch] = useState('');

  // Bulk Price Update Tool state
  const [bulkPercent, setBulkPercent] = useState('');
  const [bulkTarget, setBulkTarget] = useState('all'); // 'all', 'base', 'lamination', 'cutting'

  // Metric Computations
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  }, [orders]);

  const activeMediaCount = data.length;
  const totalSizesCount = data.reduce((sum, m) => sum + (m.sizes?.length || 0), 0);

  const pendingOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'In Production').length;

  // Save all changes to Cloud (Firestore) and LocalStorage
  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveSuccessMsg('');
    try {
      // 1. Update React state
      setPricingData(data);
      setConfig(storeConfig);

      // 2. Save to LocalStorage
      saveStoredPricing(data);
      saveStoredConfig(storeConfig);

      // 3. Save to Firebase Firestore if connected
      if (db) {
        try {
          const pricingDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'pricing', 'latest');
          await setDoc(pricingDocRef, { items: data }, { merge: true });

          const configDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'config', 'latest');
          await setDoc(configDocRef, storeConfig, { merge: true });
        } catch (firebaseErr) {
          console.warn("Firestore save warning (offline mode fallback active):", firebaseErr);
        }
      }

      setSaveSuccessMsg('All changes saved and synchronized successfully!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      alert("Failed to save: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset Pricing to Factory Defaults
  const handleResetPricing = () => {
    if (window.confirm("Reset all prices back to default factory rates? Any unsaved edits will be lost.")) {
      const defaults = JSON.parse(JSON.stringify(DEFAULT_PRICING_DATA));
      setData(defaults);
      setPricingData(defaults);
      saveStoredPricing(defaults);
      setSaveSuccessMsg("Prices reset to defaults. Click 'Save Live' to push to cloud.");
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    }
  };

  // Product Operations
  const handleAddMedia = () => {
    const newMedia = {
      id: `m_${Date.now()}`,
      media: "New Media Type",
      description: "Description of paper finish and recommended uses",
      badge: "",
      sizes: [
        { id: `s_${Date.now()}_1`, name: "12x18 (Single)", lamination: 4.5, cutting: null, baseCost: 15 },
        { id: `s_${Date.now()}_2`, name: "13x19 (Single)", lamination: 4.75, cutting: null, baseCost: 16 }
      ]
    };
    setData([...data, newMedia]);
  };

  const handleRemoveMedia = (mIndex) => {
    if (window.confirm(`Delete media category "${data[mIndex].media}" and all its sizes?`)) {
      setData(data.filter((_, i) => i !== mIndex));
    }
  };

  const handleUpdateMedia = (mIndex, field, value) => {
    const updated = [...data];
    updated[mIndex][field] = value;
    setData(updated);
  };

  const handleAddSize = (mIndex) => {
    const updated = [...data];
    updated[mIndex].sizes.push({
      id: `s_${Date.now()}`,
      name: "New Size (Single)",
      lamination: null,
      cutting: null,
      baseCost: 10
    });
    setData(updated);
  };

  const handleRemoveSize = (mIndex, sIndex) => {
    const updated = [...data];
    updated[mIndex].sizes = updated[mIndex].sizes.filter((_, i) => i !== sIndex);
    setData(updated);
  };

  const handleUpdateSize = (mIndex, sIndex, field, value) => {
    const updated = [...data];
    updated[mIndex].sizes[sIndex][field] = value;
    setData(updated);
  };

  // Bulk Price Adjuster
  const handleApplyBulkPrice = () => {
    const percent = parseFloat(bulkPercent);
    if (isNaN(percent) || percent === 0) {
      alert("Please enter a valid percentage (e.g. 5 for +5%, or -10 for -10%).");
      return;
    }

    const factor = 1 + percent / 100;
    const roundHalf = (val) => Math.round(val * 2) / 2; // round to nearest 0.50

    const updated = data.map(media => ({
      ...media,
      sizes: media.sizes.map(size => {
        const newSize = { ...size };
        if (bulkTarget === 'all' || bulkTarget === 'base') {
          newSize.baseCost = roundHalf(newSize.baseCost * factor);
        }
        if ((bulkTarget === 'all' || bulkTarget === 'lamination') && newSize.lamination !== null) {
          newSize.lamination = roundHalf(newSize.lamination * factor);
        }
        if ((bulkTarget === 'all' || bulkTarget === 'cutting') && newSize.cutting !== null) {
          newSize.cutting = roundHalf(newSize.cutting * factor);
        }
        return newSize;
      })
    }));

    setData(updated);
    setBulkPercent('');
    setSaveSuccessMsg(`Applied ${percent > 0 ? '+' : ''}${percent}% to ${bulkTarget} prices. Click 'Save Live' to apply.`);
    setTimeout(() => setSaveSuccessMsg(''), 5000);
  };

  // Order status update
  const handleOrderStatusChange = (orderId, newStatus) => {
    const updated = updateStoredOrderStatus(orderId, newStatus);
    if (updated) {
      setOrders(updated);
      if (selectedOrder && selectedOrder.orderId === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    }
  };

  // Export Customers to CSV
  const handleExportCustomersCSV = () => {
    if (customers.length === 0) {
      alert("No customers available to export.");
      return;
    }
    const headers = ["Customer Name", "Mobile Number", "Email", "Total Orders", "Total Spent (INR)", "Preferred Delivery", "Last Order Date"];
    const rows = customers.map(c => [
      `"${c.name || ''}"`,
      `"${c.mobile || ''}"`,
      `"${c.email || ''}"`,
      c.orderCount || 0,
      c.totalSpent || 0,
      `"${c.deliveryMode || ''}"`,
      `"${c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customers_akshar_printshop_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = !orderSearch || 
        o.orderId?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.mobile?.includes(orderSearch);
      const matchStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Filtered customers list
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      return !customerSearch ||
        c.name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.mobile?.includes(customerSearch) ||
        c.email?.toLowerCase().includes(customerSearch.toLowerCase());
    });
  }, [customers, customerSearch]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-100 font-sans pb-16">
      
      {/* Top Navbar */}
      <header className="bg-gray-900 text-white sticky top-0 z-30 shadow-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <Settings className="text-white" size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight">{storeConfig.businessName}</h1>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Admin Control Suite
                </span>
              </div>
              <p className="text-xs text-gray-400">Complete Management: Products • Pricing • Orders • Customers</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <button
              onClick={handleResetPricing}
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-gray-700 hover:bg-gray-800 text-gray-300 transition-colors flex items-center gap-1.5"
              title="Reset Prices"
            >
              <RefreshCw size={14} /> Reset
            </button>
            <button
              onClick={onExit}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors flex items-center gap-1.5"
            >
              <Eye size={14} /> Store View
            </button>
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/50 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSaving ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span> : <Save size={15} />}
              {isSaving ? 'Saving...' : 'Save Live Changes'}
            </button>
            <button
              onClick={onExit}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              title="Log Out"
            >
              <LogOut size={18} />
            </button>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-800 flex overflow-x-auto gap-1">
          {[
            { id: 'overview', label: 'Dashboard', icon: TrendingUp },
            { id: 'products', label: 'Products & Media', icon: ShoppingBag, count: activeMediaCount },
            { id: 'pricing', label: 'Price Matrix & Bulk', icon: IndianRupee },
            { id: 'orders', label: 'Orders & Dispatch', icon: PackageCheck, badge: pendingOrdersCount },
            { id: 'customers', label: 'Customers CRM', icon: Users, count: customers.length },
            { id: 'settings', label: 'Store & Payment', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition-all ${isActive ? 'border-blue-500 text-blue-400 bg-gray-800/40' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700'}`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-gray-800 text-gray-400">
                    {tab.count}
                  </span>
                )}
                {tab.badge > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-600 text-white font-extrabold animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Save Success Banner */}
      {saveSuccessMsg && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="p-3.5 bg-green-50 dark:bg-green-950/60 border border-green-200 dark:border-green-800/80 rounded-xl text-green-700 dark:text-green-300 text-sm font-semibold flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-600" />
              <span>{saveSuccessMsg}</span>
            </div>
            <button onClick={() => setSaveSuccessMsg('')} className="text-green-600 hover:text-green-800">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* ================= TAB 1: OVERVIEW DASHBOARD ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Sales Volume</p>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1 flex items-center">
                      <IndianRupee size={22} /> {totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </h3>
                  </div>
                  <span className="p-3 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                    <TrendingUp size={20} />
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-3 font-medium">From {orders.length} orders recorded</p>
              </div>

              <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Orders</p>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                      {orders.length}
                    </h3>
                  </div>
                  <span className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    <PackageCheck size={20} />
                  </span>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-3 font-semibold">
                  {pendingOrdersCount} orders needing fulfillment
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Products</p>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                      {activeMediaCount} <span className="text-sm font-semibold text-gray-400">({totalSizesCount} sizes)</span>
                    </h3>
                  </div>
                  <span className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                    <ShoppingBag size={20} />
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-3">GSMs & Specialty Films active</p>
              </div>

              <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Registered Clients</p>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                      {customers.length}
                    </h3>
                  </div>
                  <span className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                    <Users size={20} />
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-3">Direct WhatsApp contact available</p>
              </div>
            </div>

            {/* Quick Actions & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Recent Orders */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">Recent Print Jobs</h3>
                    <p className="text-xs text-gray-500">Live order queue and payment verification</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    View All Orders <ChevronRight size={14} />
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-sm">No orders recorded yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 uppercase tracking-wider">
                          <th className="pb-3 font-bold">Order ID</th>
                          <th className="pb-3 font-bold">Customer</th>
                          <th className="pb-3 font-bold">Amount</th>
                          <th className="pb-3 font-bold">Status</th>
                          <th className="pb-3 font-bold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-medium">
                        {orders.slice(0, 5).map(o => (
                          <tr key={o.orderId} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                            <td className="py-3 font-mono font-bold text-blue-600 dark:text-blue-400">{o.orderId}</td>
                            <td className="py-3">
                              <div className="font-semibold text-gray-900 dark:text-white">{o.name}</div>
                              <div className="text-[11px] text-gray-400">{o.mobile}</div>
                            </td>
                            <td className="py-3 font-bold text-green-600 dark:text-green-400">
                              ₹{Number(o.totalAmount || 0).toFixed(2)}
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                o.status === 'Ready for Pickup' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' :
                                o.status === 'In Production' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                                o.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
                                'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                              }`}>
                                {o.status || 'Pending'}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => { setSelectedOrder(o); setActiveTab('orders'); }}
                                className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 text-xs font-semibold"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Right Col: Quick Store Stats & Shortcuts */}
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">Quick Shortcuts</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveTab('pricing')}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-left border border-gray-100 dark:border-gray-800 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <Percent size={18} className="text-blue-600" />
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">Bulk Price Adjuster</p>
                          <p className="text-[11px] text-gray-400">Increase / decrease all paper rates</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>

                    <button
                      onClick={() => setActiveTab('products')}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-left border border-gray-100 dark:border-gray-800 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <Plus size={18} className="text-green-600" />
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">Add New Paper Category</p>
                          <p className="text-[11px] text-gray-400">Create new media, sticker or sheet</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>

                    <button
                      onClick={() => setActiveTab('settings')}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-left border border-gray-100 dark:border-gray-800 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <Smartphone size={18} className="text-purple-600" />
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">Payment & UPI Setup</p>
                          <p className="text-[11px] text-gray-400">Manage QR UPI ID & WhatsApp alerts</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center gap-2 mb-2 text-blue-300">
                    <Sparkles size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Hitesh Bhesaniya Production</span>
                  </div>
                  <h4 className="text-lg font-bold">High Precision Digital Offset</h4>
                  <p className="text-xs text-blue-200 mt-1 leading-relaxed">
                    Changes made here sync in real-time with customer pricing screens and order forms.
                  </p>
                  <div className="mt-4 pt-3 border-t border-blue-800/60 flex justify-between items-center text-xs">
                    <span className="text-blue-300">UPI ID:</span>
                    <span className="font-mono font-bold">{storeConfig.upiId}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB 2: PRODUCTS & MEDIA MANAGEMENT ================= */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <ShoppingBag className="text-blue-600" size={20} /> Media & Paper Substrates
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Configure paper stock GSM, descriptions, badges, and permissible sheet sizes.
                </p>
              </div>
              <button
                onClick={handleAddMedia}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md shadow-blue-500/20"
              >
                <Plus size={16} /> Add Media Category
              </button>
            </div>

            {/* Media Items */}
            <div className="space-y-5">
              {data.map((media, mIndex) => (
                <div key={media.id || mIndex} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                  
                  {/* Media Header */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Media Name</label>
                        <input
                          type="text"
                          value={media.media}
                          onChange={(e) => handleUpdateMedia(mIndex, 'media', e.target.value)}
                          className="w-full font-bold text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Badge (Optional)</label>
                        <input
                          type="text"
                          value={media.badge || ''}
                          placeholder="e.g. Most Popular / Economy"
                          onChange={(e) => handleUpdateMedia(mIndex, 'badge', e.target.value)}
                          className="w-full text-xs bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Description</label>
                        <input
                          type="text"
                          value={media.description || ''}
                          placeholder="Short description for customer"
                          onChange={(e) => handleUpdateMedia(mIndex, 'description', e.target.value)}
                          className="w-full text-xs bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveMedia(mIndex)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors ml-auto md:ml-0"
                      title="Delete Media Category"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Sizes Table */}
                  <div className="p-4 overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left text-xs">
                      <thead>
                        <tr className="text-gray-400 uppercase tracking-wider text-[11px] border-b border-gray-100 dark:border-gray-800">
                          <th className="pb-2.5 px-2 w-1/3">Paper Size / Spec</th>
                          <th className="pb-2.5 px-2 w-1/5">Base Print Cost (₹)</th>
                          <th className="pb-2.5 px-2 w-1/5">Thermal Lam (₹)</th>
                          <th className="pb-2.5 px-2 w-1/5">Half Cut (₹)</th>
                          <th className="pb-2.5 px-2 text-center w-12">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium">
                        {media.sizes.map((size, sIndex) => (
                          <tr key={size.id || sIndex} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                            <td className="py-2.5 px-2">
                              <input
                                type="text"
                                value={size.name}
                                onChange={(e) => handleUpdateSize(mIndex, sIndex, 'name', e.target.value)}
                                className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-semibold"
                              />
                            </td>
                            <td className="py-2.5 px-2">
                              <div className="relative">
                                <span className="absolute left-2.5 top-2.5 text-gray-400 font-bold">₹</span>
                                <input
                                  type="number"
                                  step="0.25"
                                  min="0"
                                  value={size.baseCost}
                                  onChange={(e) => handleUpdateSize(mIndex, sIndex, 'baseCost', parseFloat(e.target.value) || 0)}
                                  className="w-full p-2 pl-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold"
                                />
                              </div>
                            </td>
                            <td className="py-2.5 px-2">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={size.lamination !== null}
                                  onChange={(e) => handleUpdateSize(mIndex, sIndex, 'lamination', e.target.checked ? 4.5 : null)}
                                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                                  title="Enable Lamination"
                                />
                                {size.lamination !== null ? (
                                  <input
                                    type="number"
                                    step="0.25"
                                    min="0"
                                    value={size.lamination}
                                    onChange={(e) => handleUpdateSize(mIndex, sIndex, 'lamination', parseFloat(e.target.value) || 0)}
                                    className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-semibold"
                                  />
                                ) : (
                                  <span className="text-gray-400 italic text-[11px]">N/A</span>
                                )}
                              </div>
                            </td>
                            <td className="py-2.5 px-2">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={size.cutting !== null}
                                  onChange={(e) => handleUpdateSize(mIndex, sIndex, 'cutting', e.target.checked ? 8 : null)}
                                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                                  title="Enable Half Cut"
                                />
                                {size.cutting !== null ? (
                                  <input
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    value={size.cutting}
                                    onChange={(e) => handleUpdateSize(mIndex, sIndex, 'cutting', parseFloat(e.target.value) || 0)}
                                    className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-semibold"
                                  />
                                ) : (
                                  <span className="text-gray-400 italic text-[11px]">N/A</span>
                                )}
                              </div>
                            </td>
                            <td className="py-2.5 px-2 text-center">
                              <button
                                onClick={() => handleRemoveSize(mIndex, sIndex)}
                                className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors"
                                title="Remove Size"
                              >
                                <X size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 bg-gray-50/70 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800">
                    <button
                      onClick={() => handleAddSize(mIndex)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <Plus size={14} /> Add Sheet Size / Variation
                    </button>
                  </div>

                </div>
              ))}
            </div>

            <button
              onClick={handleAddMedia}
              className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 rounded-2xl text-gray-500 hover:text-blue-600 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={18} /> Add Another Paper Stock / Media Category
            </button>
          </div>
        )}

        {/* ================= TAB 3: PRICE MATRIX & BULK TOOL ================= */}
        {activeTab === 'pricing' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Bulk Adjuster Box */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-black flex items-center gap-2">
                    <Percent size={20} className="text-blue-300" /> Bulk Rate Adjuster
                  </h3>
                  <p className="text-xs text-blue-200 mt-1">
                    Quickly increase or decrease prices across all products by percentage (e.g. +5% for inflation, or -10% for festive promo).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2 bg-blue-950/60 p-1.5 rounded-xl border border-blue-700/50">
                    <select
                      value={bulkTarget}
                      onChange={(e) => setBulkTarget(e.target.value)}
                      className="bg-transparent text-white text-xs font-semibold outline-none px-2 py-1 cursor-pointer"
                    >
                      <option value="all" className="bg-gray-900">All Charges</option>
                      <option value="base" className="bg-gray-900">Base Cost Only</option>
                      <option value="lamination" className="bg-gray-900">Lamination Only</option>
                      <option value="cutting" className="bg-gray-900">Half Cut Only</option>
                    </select>

                    <div className="flex items-center">
                      <input
                        type="number"
                        placeholder="e.g. 5 or -10"
                        value={bulkPercent}
                        onChange={(e) => setBulkPercent(e.target.value)}
                        className="w-24 p-1.5 bg-white text-gray-900 rounded-lg text-xs font-bold text-center outline-none"
                      />
                      <span className="text-sm font-bold ml-1.5 mr-1">%</span>
                    </div>
                  </div>

                  <button
                    onClick={handleApplyBulkPrice}
                    className="px-4 py-2.5 bg-white text-blue-900 hover:bg-blue-50 font-black text-xs rounded-xl transition-all shadow-md active:scale-95"
                  >
                    Apply Percentage
                  </button>
                </div>
              </div>
            </div>

            {/* Complete Rate Card Matrix */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Active Rate Card Matrix</h3>
                  <p className="text-xs text-gray-500">Edit base prices, lamination, and cutting fees in real time</p>
                </div>
                <button
                  onClick={handleResetPricing}
                  className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1"
                >
                  <RefreshCw size={12} /> Reset to Defaults
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 uppercase tracking-wider text-[11px]">
                      <th className="pb-3 px-3">Media Category</th>
                      <th className="pb-3 px-3">Size Specification</th>
                      <th className="pb-3 px-3">Base Cost (₹)</th>
                      <th className="pb-3 px-3">Thermal Lamination (₹)</th>
                      <th className="pb-3 px-3">Half Cut (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {data.flatMap((media, mIndex) => 
                      media.sizes.map((size, sIndex) => (
                        <tr key={`${mIndex}-${sIndex}`} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                          {sIndex === 0 && (
                            <td rowSpan={media.sizes.length} className="py-3 px-3 font-bold text-gray-900 dark:text-white border-r border-gray-100 dark:border-gray-800 align-top bg-gray-50/50 dark:bg-gray-900/50">
                              <div>{media.media}</div>
                              {media.badge && (
                                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold">
                                  {media.badge}
                                </span>
                              )}
                            </td>
                          )}
                          <td className="py-2.5 px-3 font-medium text-gray-700 dark:text-gray-300">
                            {size.name}
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              step="0.25"
                              value={size.baseCost}
                              onChange={(e) => handleUpdateSize(mIndex, sIndex, 'baseCost', parseFloat(e.target.value) || 0)}
                              className="w-24 p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 font-bold text-gray-900 dark:text-white"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            {size.lamination !== null ? (
                              <input
                                type="number"
                                step="0.25"
                                value={size.lamination}
                                onChange={(e) => handleUpdateSize(mIndex, sIndex, 'lamination', parseFloat(e.target.value) || 0)}
                                className="w-24 p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 font-semibold text-gray-900 dark:text-white"
                              />
                            ) : (
                              <span className="text-gray-400 italic">N/A</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            {size.cutting !== null ? (
                              <input
                                type="number"
                                step="0.5"
                                value={size.cutting}
                                onChange={(e) => handleUpdateSize(mIndex, sIndex, 'cutting', parseFloat(e.target.value) || 0)}
                                className="w-24 p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 font-semibold text-gray-900 dark:text-white"
                              />
                            ) : (
                              <span className="text-gray-400 italic">N/A</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: ORDERS & DISPATCH ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Filter and Search Bar */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto flex-1">
                <div className="relative w-full max-w-sm">
                  <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Order ID, Customer, or Phone..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Status Pills */}
              <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
                {['ALL', 'Pending', 'In Production', 'Ready for Pickup', 'Completed'].map(status => (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${orderStatusFilter === status ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-400 uppercase tracking-wider text-[11px] border-b border-gray-100 dark:border-gray-800">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Order ID</th>
                      <th className="py-3.5 px-4 font-bold">Date & Time</th>
                      <th className="py-3.5 px-4 font-bold">Customer Details</th>
                      <th className="py-3.5 px-4 font-bold">Delivery</th>
                      <th className="py-3.5 px-4 font-bold">Job Specs</th>
                      <th className="py-3.5 px-4 font-bold">Total</th>
                      <th className="py-3.5 px-4 font-bold">Status</th>
                      <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/70 font-medium">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-gray-400">
                          No matching orders found.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => (
                        <tr key={order.orderId} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-black text-blue-600 dark:text-blue-400">
                            {order.orderId}
                          </td>
                          <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                            {order.createdAt ? new Date(order.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Recent'}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-gray-900 dark:text-white">{order.name}</div>
                            <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                              <a href={`https://wa.me/${order.mobile?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-green-600 hover:underline flex items-center gap-0.5">
                                <Phone size={10} /> {order.mobile}
                              </a>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${order.deliveryMode === 'Courier' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                              {order.deliveryMode === 'Courier' ? <Truck size={12} /> : <Check size={12} />}
                              {order.deliveryMode}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs truncate text-gray-600 dark:text-gray-300 text-[11px]">
                            {Array.isArray(order.items) ? (
                              order.items.map((it, idx) => (
                                <span key={idx} className="block truncate">
                                  {it.qty}x {it.media} ({it.size})
                                </span>
                              ))
                            ) : (
                              <span>{order.quantity || 1} prints</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-black text-green-600 dark:text-green-400">
                            ₹{Number(order.totalAmount || order.total || 0).toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={order.status || 'Pending'}
                              onChange={(e) => handleOrderStatusChange(order.orderId, e.target.value)}
                              className={`text-[11px] font-bold rounded-lg px-2 py-1 outline-none border cursor-pointer ${
                                order.status === 'Ready for Pickup' ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300' :
                                order.status === 'In Production' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300' :
                                order.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300' :
                                'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Production">In Production</option>
                              <option value="Ready for Pickup">Ready for Pickup</option>
                              <option value="Dispatched via Courier">Dispatched</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold text-xs rounded-xl transition-colors"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Order Details Modal */}
            {selectedOrder && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-gray-200 dark:border-gray-800 shadow-2xl relative">
                  
                  <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                    <div>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Job Specification Sheet</span>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white mt-0.5">{selectedOrder.orderId}</h3>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <span className="text-gray-400 font-bold block mb-1">CUSTOMER</span>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{selectedOrder.name}</p>
                      <p className="text-gray-500 mt-0.5">{selectedOrder.mobile}</p>
                      <p className="text-gray-500">{selectedOrder.email}</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <span className="text-gray-400 font-bold block mb-1">DISPATCH METHOD</span>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{selectedOrder.deliveryMode}</p>
                      <span className="inline-block mt-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                        Status: {selectedOrder.status || 'Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Print specifications */}
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Print Items Breakdown</h4>
                    <div className="space-y-2">
                      {Array.isArray(selectedOrder.items) && selectedOrder.items.map((it, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-gray-900 dark:text-white">{it.media} ({it.size})</span>
                            <div className="text-[11px] text-gray-400 mt-0.5 flex gap-2">
                              <span>Qty: {it.qty}</span>
                              {it.lamination && <span>• Thermal Lam</span>}
                              {it.cutting && <span>• Half Cut</span>}
                            </div>
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white text-sm">
                            ₹{Number(it.total || 0).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* WhatsApp Quick Actions */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Send WhatsApp Update to Customer</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <a
                        href={`https://wa.me/${selectedOrder.mobile?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${selectedOrder.name},\nYour order *${selectedOrder.orderId}* is currently IN PRODUCTION on our digital press. We are processing your job.\n\n- ${storeConfig.businessName}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold rounded-xl text-center text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Clock size={14} /> Send "In Production" Alert
                      </a>
                      <a
                        href={`https://wa.me/${selectedOrder.mobile?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${selectedOrder.name},\nGreat news! Your print order *${selectedOrder.orderId}* is READY FOR ${selectedOrder.deliveryMode === 'Courier' ? 'DISPATCH' : 'PICKUP'}.\nTotal: ₹${selectedOrder.totalAmount}\n\n- ${storeConfig.businessName}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold rounded-xl text-center text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 size={14} /> Send "Ready for Pickup" Alert
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 5: CUSTOMERS CRM ================= */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="text-blue-600" size={20} /> Client & Customer Directory
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Direct database of verified customers, order history, and lifetime spending.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, phone, email..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleExportCustomersCSV}
                  className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Download size={14} /> Export CSV
                </button>
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-400 uppercase tracking-wider text-[11px] border-b border-gray-100 dark:border-gray-800">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Customer Name</th>
                      <th className="py-3.5 px-4 font-bold">WhatsApp Contact</th>
                      <th className="py-3.5 px-4 font-bold">Email</th>
                      <th className="py-3.5 px-4 font-bold text-center">Orders</th>
                      <th className="py-3.5 px-4 font-bold">Lifetime Spent</th>
                      <th className="py-3.5 px-4 font-bold">Pref. Delivery</th>
                      <th className="py-3.5 px-4 font-bold text-right">Connect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/70 font-medium">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-gray-400">
                          No customer records found.
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map(customer => (
                        <tr key={customer.id || customer.mobile} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">
                            {customer.name}
                          </td>
                          <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300">
                            {customer.mobile}
                          </td>
                          <td className="py-3.5 px-4 text-gray-500">
                            {customer.email || '—'}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold">
                              {customer.orderCount || 1}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-black text-green-600 dark:text-green-400">
                            ₹{Number(customer.totalSpent || 0).toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4 text-gray-500">
                            {customer.deliveryMode || 'Door Pickup'}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <a
                              href={`https://wa.me/${customer.mobile?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${customer.name}, greetings from ${storeConfig.businessName}! How can we help you with your next print project?`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 font-bold hover:bg-green-100 transition-colors"
                            >
                              <Smartphone size={13} /> WhatsApp
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: STORE & PAYMENT SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                <Settings className="text-blue-600" size={18} /> Store Identity & Payment Parameters
              </h2>
              <p className="text-xs text-gray-500 mb-6">
                Configure your UPI payment handle, WhatsApp notification routing, and Admin security credentials.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Store Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Store / Business Name
                  </label>
                  <input
                    type="text"
                    value={storeConfig.businessName}
                    onChange={(e) => setStoreConfig({ ...storeConfig, businessName: e.target.value })}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Tagline */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Store Tagline
                  </label>
                  <input
                    type="text"
                    value={storeConfig.tagline || ''}
                    onChange={(e) => setStoreConfig({ ...storeConfig, tagline: e.target.value })}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* UPI ID */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    UPI ID (VPA for QR Code & Payments)
                  </label>
                  <input
                    type="text"
                    value={storeConfig.upiId}
                    onChange={(e) => setStoreConfig({ ...storeConfig, upiId: e.target.value })}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-mono font-bold text-blue-600 dark:text-blue-400 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">Default: aksharstudio-2@okicici</span>
                </div>

                {/* WhatsApp Support Number */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    WhatsApp Order Notifications Number
                  </label>
                  <input
                    type="tel"
                    value={storeConfig.whatsappNumber}
                    onChange={(e) => setStoreConfig({ ...storeConfig, whatsappNumber: e.target.value })}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">With country code, e.g. 916354871446</span>
                </div>

                {/* Admin Master PIN */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                    <KeyRound size={14} className="text-amber-500" /> Admin Access PIN
                  </label>
                  <input
                    type="text"
                    value={storeConfig.adminPin}
                    onChange={(e) => setStoreConfig({ ...storeConfig, adminPin: e.target.value })}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-mono font-black text-gray-900 dark:text-white tracking-widest outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Google Apps Script Endpoint */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Google Apps Script Webhook URL
                  </label>
                  <input
                    type="text"
                    value={storeConfig.scriptUrl}
                    onChange={(e) => setStoreConfig({ ...storeConfig, scriptUrl: e.target.value })}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs font-mono text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Announcement Banner */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Store Notice Banner
                  </label>
                  <input
                    type="text"
                    value={storeConfig.announcement || ''}
                    onChange={(e) => setStoreConfig({ ...storeConfig, announcement: e.target.value })}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

              </div>

              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <button
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  <Save size={16} /> Save Configuration Live
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

    </div>
  );
}
