import React, { useState } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight, Download, Sparkles, Check } from 'lucide-react';
import { SHOWCASE_GALLERY } from '../data/defaultPricing';

export default function MediaGuideModal({ isOpen, onClose, initialIndex = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!isOpen) return null;

  const currentItem = SHOWCASE_GALLERY[currentIndex] || SHOWCASE_GALLERY[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : SHOWCASE_GALLERY.length - 1));
    setIsZoomed(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < SHOWCASE_GALLERY.length - 1 ? prev + 1 : 0));
    setIsZoomed(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col">
        
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <Sparkles size={20} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                  {currentItem.title}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  {currentItem.tag}
                </span>
              </div>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                {currentItem.subtitle} ({currentIndex + 1} of {SHOWCASE_GALLERY.length})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              title={isZoomed ? "Zoom Out" : "Zoom In"}
            >
              <ZoomIn size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 text-gray-600 dark:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950/50">
          <div className="relative group max-w-4xl w-full flex items-center justify-center">
            
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-2 z-10 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg text-gray-700 dark:text-gray-200 hover:scale-110 active:scale-95 transition-all border border-gray-200 dark:border-gray-700"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Main Showcase Image */}
            <div className={`transition-all duration-300 flex justify-center items-center overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md ${isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'}`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={currentItem.image}
                alt={currentItem.title}
                className="max-h-[60vh] w-auto object-contain rounded-2xl"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-2 z-10 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg text-gray-700 dark:text-gray-200 hover:scale-110 active:scale-95 transition-all border border-gray-200 dark:border-gray-700"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="mt-4 max-w-2xl text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              {currentItem.description}
            </p>
          </div>

          {/* Thumbnails list */}
          <div className="flex gap-2.5 mt-6 overflow-x-auto max-w-full pb-2 px-2">
            {SHOWCASE_GALLERY.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => { setCurrentIndex(idx); setIsZoomed(false); }}
                className={`relative rounded-xl overflow-hidden shrink-0 w-20 h-16 border-2 transition-all ${currentIndex === idx ? 'border-blue-600 ring-2 ring-blue-500/30 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>Akshar PrintShop Pro • Visual Standards Guide</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
}
