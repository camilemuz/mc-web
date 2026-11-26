import React from 'react';
import { useSiteContent } from '../utils/ContentContext';
import { AnimatedCounter } from './AnimatedCounter';
import { Spotlight } from './Spotlight';

export const SectionMethod: React.FC = () => {
  const { content } = useSiteContent();
  const METHOD_STEPS = content.methodSteps;
  const METHOD_METRICS = content.methodMetrics;
  return (
    <section id="method" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Scroll drift light orb */}
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-[#e60000]/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#e60000] uppercase mb-2">
            <span>02</span>
            <span className="w-6 h-[1px] bg-[#e60000]" />
            <span>Metodología</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-white">
            TÁCTICA, TÉCNICA, FÍSICO
          </h2>
        </div>
        <p className="text-neutral-400 text-sm max-w-md mt-4 md:mt-0 font-sans">
          Un modelo de preparación deportiva estructurado sobre directrices formativas de la FBF y metodologías internacionales.
        </p>
      </div>

      {/* Three Step Column Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {METHOD_STEPS.map((step) => (
          <Spotlight
            key={step.step}
            className="glass rounded-2xl p-6 sm:p-8 backdrop-blur-md border border-white/10 flex flex-col justify-between h-full relative group hover:border-[#e60000]/40 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-black font-display text-white/20 group-hover:text-[#e60000] transition-colors">
                  {step.step}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#e60000] shadow-[0_0_8px_#e60000]" />
              </div>
              <h3 className="text-xl font-bold font-display text-white mb-3">
                {step.title}
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed font-sans">
                {step.body}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs font-mono text-[#e60000]">
              <span>FASE ACTIVA</span>
            </div>
          </Spotlight>
        ))}
      </div>

      {/* Four Counters (Animated on view) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 glass rounded-2xl border border-white/10">
        {METHOD_METRICS.map((metric, idx) => (
          <div key={idx} className="text-center p-4">
            <div className="text-4xl sm:text-5xl font-black font-display text-white mb-1">
              <AnimatedCounter to={metric.value} suffix={metric.suffix} />
            </div>
            <div className="text-xs uppercase tracking-widest text-neutral-400 font-mono">
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
