import React from 'react';
import { Sliders, UploadCloud, QrCode, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: "01",
      icon: <Sliders className="w-6 h-6 text-blue-600" />,
      title: "Select Paper Media & Size",
      desc: "Choose from 100 to 350 GSM premium cardstock, sticker sheets, or transparent films. Select standard 12×18, 13×19, or A3 sheets."
    },
    {
      num: "02",
      icon: <UploadCloud className="w-6 h-6 text-blue-600" />,
      title: "Thermal Lam & Finishing",
      desc: "Add single or double-sided thermal gloss / velvet matte lamination and CNC digital plotter kiss-cut (half cut) for peel-and-stick labels."
    },
    {
      num: "03",
      icon: <QrCode className="w-6 h-6 text-blue-600" />,
      title: "Upload Artwork & Instant UPI",
      desc: "Attach your CDR, PSD, AI, PDF, or ZIP design files. Pay via dynamic UPI QR code with zero surcharge and instant verification."
    },
    {
      num: "04",
      icon: <Sparkles className="w-6 h-6 text-blue-600" />,
      title: "Fast Production & Dispatch",
      desc: "Hitesh Bhesaniya Production digital presses print, inspect, pack, and prepare your jobs for store counter pickup or courier dispatch."
    }
  ];

  return (
    <section className="py-16 bg-[#FAF7F2] dark:bg-[#121110] border-b border-[#EBE3D5] dark:border-stone-800 transition-colors">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-blue-600 dark:text-blue-400">
            The Akshar PrintShop Pro Experience
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-stone-100">
            How It Works in 4 Simple Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-stone-400">
            Studio-grade commercial printing from your artwork files to completed jobs in hours.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#1A1816] rounded-3xl p-6 border border-[#E8DFD0] dark:border-stone-800 shadow-xs hover:shadow-md transition-all relative space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800 flex items-center justify-center">
                  {s.icon}
                </div>
                <span className="font-serif font-bold text-2xl text-amber-900/20 dark:text-amber-400/20">
                  {s.num}
                </span>
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-stone-100">
                {s.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-stone-400 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
