import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SQUADS_DATA, SquadItem } from '../content';
import { Spotlight } from './Spotlight';
import { playUiClick } from '../utils/soundEffects';

export const SectionSquads: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(SQUADS_DATA[0].id);
  const activeSquad = SQUADS_DATA.find((s) => s.id === selectedId) || SQUADS_DATA[0];

  return (
    <section id="squads" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background ambient red glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#e60000]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#e60000] uppercase mb-2">
            <span>01</span>
            <span className="w-6 h-[1px] bg-[#e60000]" />
            <span>Categorías</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-white">
            NUESTROS PLANTELES
          </h2>
        </div>
        <p className="text-neutral-400 text-sm max-w-md mt-4 md:mt-0 font-sans">
          Desde las primeras etapas de iniciación psicomotriz y futsal indoor hasta el salto de alta competencia y primer equipo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 8-Row Squads Selector */}
        <div className="lg:col-span-7">
          <ul className="flex flex-col divide-y divide-white/5 border-y border-white/10">
            {SQUADS_DATA.map((squad) => {
              const isSelected = squad.id === selectedId;
              return (
                <li key={squad.id} className="relative">
                  <button
                    onClick={() => {
                      playUiClick();
                      setSelectedId(squad.id);
                    }}
                    className={`w-full py-4 px-4 sm:px-6 flex items-center justify-between text-left transition-colors relative cursor-pointer group ${
                      isSelected ? 'text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {/* Active highlight background */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeSquadIndicator"
                        className="absolute inset-0 bg-white/[0.04] border-l-2 border-[#e60000]"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}

                    <div className="relative z-10 flex items-center gap-4 sm:gap-6">
                      <span className="font-mono text-xs text-neutral-500 group-hover:text-[#e60000] transition-colors">
                        {squad.id.replace('sub', 'SUB-').toUpperCase()}
                      </span>
                      <span className="text-lg sm:text-xl font-bold font-display">
                        {squad.name}
                      </span>
                    </div>

                    <div className="relative z-10 flex items-center gap-4 sm:gap-6 text-xs font-mono">
                      <span className="px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/5">
                        {squad.minutes} min
                      </span>
                      <span className="text-[#e60000] font-semibold hidden sm:inline">
                        {squad.level}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isSelected ? 'rotate-90 text-[#e60000]' : 'text-neutral-600'
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right Column: Live Glass Card with details */}
        <div className="lg:col-span-5 sticky top-24">
          <Spotlight className="glass rounded-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden border border-white/10 shadow-2xl">
            {/* Top red laser highlight */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#e60000] to-transparent" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSquad.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#e60000] bg-[#e60000]/10 px-2.5 py-1 rounded-full border border-[#e60000]/20">
                    {activeSquad.level}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    {activeSquad.minutes} min / sesión
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                    {activeSquad.name}
                  </h3>
                  <p className="text-neutral-300 text-sm mt-3 leading-relaxed font-sans">
                    {activeSquad.blurb}
                  </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                  {activeSquad.metrics.map((m, idx) => (
                    <div key={idx} className="glass-tile rounded-xl p-3 border border-white/5">
                      <span className="text-lg font-black font-mono-numbers text-white block">
                        {m.value}
                      </span>
                      <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <a
                    href="#memberships"
                    onClick={playUiClick}
                    className="w-full py-3 px-4 rounded-xl bg-[#e60000] hover:bg-[#ff1a1a] text-white text-xs font-bold uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(230,0,0,0.35)]"
                  >
                    <span>Inscribirse en {activeSquad.name}</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </Spotlight>
        </div>
      </div>
    </section>
  );
};
