import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteContent } from '../utils/ContentContext';
import { playUiClick } from '../utils/soundEffects';

export const SectionFaq: React.FC = () => {
  const { content } = useSiteContent();
  const FAQ_DATA = content.faq;
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    playUiClick();
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden scroll-mt-20">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-[#E6002B]/8 dark:bg-[#e60000]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Sticky Title & Description */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#E6002B] uppercase font-semibold mb-2">
            <span>05</span>
            <span className="w-6 h-[1px] bg-[#E6002B]" />
            <span>Preguntas</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white mb-4">
            DUDAS FRECUENTES
          </h2>
          <p className="text-slate-600 dark:text-neutral-400 text-sm leading-relaxed font-sans mb-8">
            Todo lo que necesitas conocer sobre nuestros procesos de admisión, entrenamientos, indumentaria oficial y competiciones.
          </p>

          <div className="p-4 rounded-xl glass hidden sm:block">
            <span className="text-xs font-mono text-slate-500 dark:text-neutral-400 block mb-1">¿Tienes otra consulta?</span>
            <a
              href="#contacto"
              onClick={playUiClick}
              className="text-[#E6002B] hover:text-[#FF1A40] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
            >
              <span>Escríbenos directamente a WhatsApp</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right Column: Accordion */}
        <div className="lg:col-span-7 divide-y divide-slate-200 dark:divide-white/10 border-y border-slate-200 dark:border-white/10">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="py-6">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between text-left group cursor-pointer"
                >
                  <span className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white group-hover:text-[#E6002B] transition-colors pr-4">
                    {item.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      isOpen
                        ? 'border-[#E6002B] bg-[#E6002B] text-white rotate-45'
                        : 'border-slate-300 dark:border-white/20 bg-white dark:bg-white/5 text-slate-600 dark:text-neutral-400 group-hover:border-slate-400 dark:group-hover:border-white/40'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-slate-600 dark:text-neutral-300 text-sm leading-relaxed font-sans pr-8">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
