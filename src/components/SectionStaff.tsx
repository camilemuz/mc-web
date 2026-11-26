import React from 'react';
import { useSiteContent } from '../utils/ContentContext';
import { Spotlight } from './Spotlight';

export const SectionStaff: React.FC = () => {
  const { content } = useSiteContent();
  const STAFF_DATA = content.staff;
  return (
    <section id="staff" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#e60000]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#e60000] uppercase mb-2">
            <span>03</span>
            <span className="w-6 h-[1px] bg-[#e60000]" />
            <span>Cuerpo Técnico</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-white">
            QUIENES DIRIGEN EL JUEGO
          </h2>
        </div>
        <p className="text-neutral-400 text-sm max-w-md mt-4 md:mt-0 font-sans">
          Profesionales titulados dedicados al alto rendimiento, la pedagogía táctica y la formación del futbolista moderno.
        </p>
      </div>

      {/* 4-Card Staff Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAFF_DATA.map((staff, idx) => (
          <Spotlight
            key={idx}
            className="glass rounded-2xl p-6 backdrop-blur-md border border-white/10 flex flex-col justify-between group hover:border-[#e60000]/50 transition-all hover:-translate-y-1 duration-300"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center font-display font-black text-xl text-white mb-6 group-hover:border-[#e60000] transition-colors shadow-lg">
                <span className="text-[#e60000]">MC</span>
              </div>

              <span className="text-[11px] font-mono uppercase tracking-wider text-[#e60000] bg-[#e60000]/10 px-2 py-0.5 rounded border border-[#e60000]/20 inline-block mb-3">
                {staff.badge}
              </span>

              <h3 className="text-xl font-bold font-display text-white mb-1">
                {staff.name}
              </h3>
              <p className="text-xs font-mono text-neutral-400 mb-4">
                {staff.role}
              </p>
              <p className="text-neutral-300 text-xs leading-relaxed font-sans">
                {staff.line}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>Club MC</span>
              <span className="text-[#e60000]">OFICIAL</span>
            </div>
          </Spotlight>
        ))}
      </div>
    </section>
  );
};
