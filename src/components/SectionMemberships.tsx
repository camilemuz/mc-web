import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteContent } from '../utils/ContentContext';
import { Spotlight } from './Spotlight';
import { Magnetic } from './Magnetic';
import { playUiClick } from '../utils/soundEffects';

export const SectionMemberships: React.FC = () => {
  const { content } = useSiteContent();
  const MEMBERSHIPS_DATA = content.memberships;
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <section id="memberships" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden scroll-mt-20">
      {/* Background ambient red glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#E6002B]/8 dark:bg-[#e60000]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#E6002B] uppercase font-semibold mb-2">
            <span>04</span>
            <span className="w-6 h-[1px] bg-[#E6002B]" />
            <span>Membresías</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white">
            ÚNETE AL CLUB
          </h2>
        </div>

        {/* Monthly / Annual Switcher */}
        <div className="mt-6 md:mt-0 flex items-center gap-3">
          <span className={`text-xs font-mono ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 dark:text-neutral-500'}`}>
            Mensual
          </span>
          <div className="p-1 bg-slate-200 dark:bg-neutral-900 border border-slate-300 dark:border-white/10 rounded-xl flex items-center relative">
            <button
              type="button"
              onClick={() => {
                playUiClick();
                setBillingCycle('monthly');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors relative z-10 cursor-pointer ${
                billingCycle === 'monthly' ? 'text-white' : 'text-slate-600 dark:text-neutral-400'
              }`}
            >
              Mes
            </button>
            <button
              type="button"
              onClick={() => {
                playUiClick();
                setBillingCycle('annual');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors relative z-10 cursor-pointer ${
                billingCycle === 'annual' ? 'text-white' : 'text-slate-600 dark:text-neutral-400'
              }`}
            >
              Anual (-20%)
            </button>

            <motion.div
              layoutId="cycleSwitch"
              className="absolute top-1 bottom-1 rounded-lg bg-[#E6002B]"
              style={{
                left: billingCycle === 'monthly' ? '4px' : 'calc(50% + 2px)',
                width: 'calc(50% - 6px)',
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          </div>
          <span className={`text-xs font-mono ${billingCycle === 'annual' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 dark:text-neutral-500'}`}>
            Anual
          </span>
        </div>
      </div>

      {/* Three Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {MEMBERSHIPS_DATA.map((plan) => {
          const price = billingCycle === 'monthly' ? plan.monthly : plan.annual;
          const period = billingCycle === 'monthly' ? '/mes' : '/año';

          return (
            <Spotlight
              key={plan.id}
              className={`glass rounded-2xl p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between relative transition-all duration-300 ${
                plan.featured
                  ? '!border-[#E6002B] shadow-[0_12px_35px_rgba(230,0,43,0.16)] scale-[1.02]'
                  : 'hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-md bg-[#E6002B] text-white text-[10px] font-mono uppercase tracking-widest font-black shadow-md">
                  Recomendado
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-slate-600 dark:text-neutral-400 text-xs font-sans mb-6">
                  {plan.tagline}
                </p>

                {/* Animated Price Counter / Switch */}
                <div className="mb-6 pb-6 border-b border-slate-200 dark:border-white/10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-mono text-slate-500 dark:text-neutral-400">Bs.</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={price}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="text-4xl sm:text-5xl font-black font-display tabular-nums text-slate-900 dark:text-white"
                      >
                        {price}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-xs font-mono text-slate-500 dark:text-neutral-400">{period}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-neutral-500 font-mono mt-1 block">
                    {billingCycle === 'annual' ? 'Facturado anualmente (ahorro directo)' : 'Cuota mensual estándar'}
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-xs text-slate-700 dark:text-neutral-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E6002B] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Magnetic strength={0.2} className="w-full">
                  <a
                    href="#contacto"
                    onClick={playUiClick}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      plan.featured
                        ? 'bg-[#E6002B] hover:bg-[#FF1A40] text-white shadow-[0_8px_20px_rgba(230,0,43,0.3)]'
                        : 'bg-slate-900 hover:bg-slate-800 dark:bg-white/10 dark:hover:bg-white/20 text-white'
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </Magnetic>
              </div>
            </Spotlight>
          );
        })}
      </div>
    </section>
  );
};
