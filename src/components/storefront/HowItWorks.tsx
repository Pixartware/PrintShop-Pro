import React from 'react';
import { Sliders, UploadCloud, QrCode, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: "01",
      icon: <Sliders className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "Select Paper Media & Size",
      desc: "Choose from 100 to 350 GSM premium cardstock, sticker sheets, or transparent films. Select standard 12×18, 13×19, or A3 sheets."
    },
    {
      num: "02",
      icon: <UploadCloud className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Thermal Lam & Finishing",
      desc: "Add single or double-sided thermal gloss / velvet matte lamination and CNC digital plotter kiss-cut (half cut) for peel-and-stick labels."
    },
    {
      num: "03",
      icon: <QrCode className="w-6 h-6 text-orange-500" />,
      title: "Upload Artwork & Instant UPI",
      desc: "Attach your CDR, PSD, AI, PDF, or ZIP design files. Pay via dynamic UPI QR code with zero surcharge and instant verification."
    },
    {
      num: "04",
      icon: <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Fast Production & Dispatch",
      desc: "Hitesh Bhesaniya Production digital presses print, inspect, pack, and prepare your jobs for store counter pickup or express courier dispatch."
    }
  ];

  return (
    <section className="py-16 bg-slate-100/70 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            Streamlined Printing Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How It Works in 4 Simple Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Studio-grade commercial printing from your artwork files to completed jobs in hours.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all relative space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  {s.icon}
                </div>
                <span className="font-extrabold text-2xl text-slate-300 dark:text-slate-700">
                  {s.num}
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                {s.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
