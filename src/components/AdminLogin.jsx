import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowLeft, KeyRound, Mail, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminLogin({ config, onLogin, onCancel }) {
  const [authMode, setAuthMode] = useState('pin'); // 'pin' or 'email'
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const adminPin = config?.adminPin || "1234";
  const adminEmails = config?.adminEmails || ["admin@phototoolsai.com", "hitesh@phototoolsai.com", "pixartware@gmail.com"];

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin.trim() === adminPin.trim()) {
      onLogin({ type: 'pin', role: 'admin' });
    } else {
      setError('Incorrect Admin PIN. Please try again.');
      setPin('');
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (adminEmails.some(e => e.toLowerCase() === cleanEmail)) {
      onLogin({ type: 'email', email: cleanEmail, role: 'admin' });
    } else {
      setError('Email not authorized as administrator.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] py-12 px-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 p-8 relative">
        
        {/* Glow decoration */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>
        
        {/* Shield Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 transform -rotate-3 hover:rotate-0 transition-transform">
            <Lock size={36} strokeWidth={2.2} />
          </div>
        </div>

        <h2 className="text-2xl font-black text-center text-gray-900 dark:text-white tracking-tight mb-1">
          Admin Portal Access
        </h2>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mb-6 font-medium">
          Manage products, pricing, orders, customers & settings
        </p>

        {/* Tab switch */}
        <div className="flex bg-gray-100 dark:bg-gray-700/60 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => { setAuthMode('pin'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${authMode === 'pin' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'}`}
          >
            <KeyRound size={14} /> Quick PIN
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('email'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${authMode === 'email' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'}`}
          >
            <Mail size={14} /> Admin Email
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl flex items-center gap-2 border border-red-200 dark:border-red-800/50 animate-shake">
            <AlertCircle size={18} className="shrink-0" />
            <span className="font-semibold text-xs">{error}</span>
          </div>
        )}

        {authMode === 'pin' ? (
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-700 dark:text-gray-300">
                Security PIN Code
              </label>
              <input
                type="password"
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 focus:outline-none bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-center text-2xl tracking-[0.5em] font-mono transition-all"
                placeholder="••••"
                autoFocus
              />
              <div className="mt-2 text-center">
                <span className="text-[11px] text-gray-400 dark:text-gray-500 font-mono">
                  Default PIN: <strong>{adminPin}</strong>
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <ShieldCheck size={20} /> Unlock Dashboard
            </button>
          </form>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-700 dark:text-gray-300">
                Authorized Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 focus:outline-none bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-medium transition-all"
                placeholder="admin@phototoolsai.com"
                autoFocus
              />
              <div className="mt-2 text-[11px] text-gray-400 dark:text-gray-500">
                Allowed: {adminEmails.slice(0, 2).join(', ')}...
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <ShieldCheck size={20} /> Verify & Enter
            </button>
          </form>
        )}

        <button
          onClick={onCancel}
          className="w-full mt-5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-bold transition-colors flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50"
        >
          <ArrowLeft size={14} /> Back to Customer Storefront
        </button>

      </div>
    </div>
  );
}
