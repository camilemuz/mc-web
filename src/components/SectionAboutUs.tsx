import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Eye, Heart, Shield, Users, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSiteContent } from '../utils/ContentContext';
import { Spotlight } from './Spotlight';
import { playUiClick } from '../utils/soundEffects';

type AboutTab = 'overview' | 'mision' | 'vision' | 'pilares';

const PILLAR_ICONS = [Shield, Heart, Sparkles, Users];

export const SectionAboutUs: React.FC = () => {
  const { content } = useSiteContent();
  const about = content.aboutUs;
  const [activeTab, setActiveTab] = useState<AboutTab>('overview');

  const tabs: { id: AboutTab; label: string }[] = [
    { id: 'overview', label: 'Identidad MC' },
    { id: 'mision', label: 'Misión' },
    { id: 'vision', label: 'Visión' },
    { id: 'pilares', label: 'Pilares Formativos' },
  ];

  return (
    <section
      id="quienes-somos"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden scroll-mt-20"
    >
      {/* Subtle ambient depth glow */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#E6002B]/8 dark:bg-[#E6002B]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 border-b border-slate-200 dark:border-white/10 pb-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#E6002B] uppercase font-semibold mb-2">
            <span>Quiénes Somos</span>
            <span aria-hidden="true">·</span>
            <span>{about.kicker}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white [text-wrap:balance]">
            {about.title}
          </h2>
          <p className="text-slate-600 dark:text-neutral-400 text-sm sm:text-base mt-3 leading-relaxed font-sans max-w-xl">
            {about.subtitle}
          </p>
        </div>

        {/* Interactive Segmented Tab Switcher */}
        <div
          role="tablist"
          aria-label="Secciones de Quiénes Somos"
          className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-neutral-900/90 border border-slate-300/80 dark:border-white/10 rounded-xl overflow-x-auto shrink-0"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  playUiClick();
                  setActiveTab(tab.id);
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#E6002B] text-white shadow-sm'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* Mission & Vision Editorial Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Mission Card */}
              <Spotlight className="lg:col-span-6 glass rounded-2xl p-7 sm:p-9 hover:border-[#E6002B]/40 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#E6002B]/10 dark:bg-[#E6002B]/15 border border-[#E6002B]/25 dark:border-[#E6002B]/30 flex items-center justify-center text-[#E6002B] shrink-0">
                        <Compass className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-neutral-400 block">01. Propósito</span>
                        <h3 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
                          {about.missionTitle}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-base sm:text-lg text-slate-700 dark:text-neutral-200 leading-relaxed font-sans">
                    {about.missionBody}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-neutral-400">
                  <span className="text-[#E6002B] font-semibold">Formación Integral</span>
                  <span aria-hidden="true">·</span>
                  <span>Deportivo</span>
                  <span aria-hidden="true">·</span>
                  <span>Emocional</span>
                  <span aria-hidden="true">·</span>
                  <span>Espiritual</span>
                  <span aria-hidden="true">·</span>
                  <span>Social</span>
                </div>
              </Spotlight>

              {/* Vision Card */}
              <Spotlight className="lg:col-span-6 glass rounded-2xl p-7 sm:p-9 hover:border-[#E6002B]/40 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/15 flex items-center justify-center text-[#E6002B] shrink-0">
                        <Eye className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-neutral-400 block">02. Proyección Nacional</span>
                        <h3 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
                          {about.visionTitle}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-base sm:text-lg text-slate-700 dark:text-neutral-200 leading-relaxed font-sans">
                    {about.visionBody}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-neutral-400">
                  <span className="text-[#E6002B] font-semibold">Referente en Bolivia</span>
                  <span aria-hidden="true">·</span>
                  <span>Proyección Profesional</span>
                  <span aria-hidden="true">·</span>
                  <span>Representación Nacional</span>
                </div>
              </Spotlight>
            </div>

            {/* 4 Integral Development Pillars + Club Identity Footer Row */}
            <div className="bg-white dark:bg-[#0C0C0E] border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-xs dark:shadow-none">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-4">
                  <img
                    src="/logo-mc-shield.png"
                    alt="Escudo Oficial Club MC Martín Careaga"
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain shrink-0"
                  />
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white">
                      Los 4 Pilares de Nuestra Formación Integral
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-neutral-400">
                      Cada entrenamiento une rendimiento deportivo con valores humanos para la vida.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href="#escuela"
                    onClick={playUiClick}
                    className="px-4 py-2.5 rounded-xl bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Sumarme a la Escuela</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="#staff"
                    onClick={playUiClick}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-neutral-200 hover:text-slate-950 dark:hover:text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
                  >
                    Cuerpo Técnico
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {about.pillars.map((pillar, idx) => {
                  const Icon = PILLAR_ICONS[idx % PILLAR_ICONS.length];
                  return (
                    <div
                      key={pillar.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 hover:border-[#E6002B]/40 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono tabular-nums text-[#E6002B] font-bold">
                          0{idx + 1}
                        </span>
                        <Icon className="w-4 h-4 text-slate-500 dark:text-neutral-400" />
                      </div>
                      <h5 className="text-base font-bold font-display text-slate-900 dark:text-white mb-1.5">
                        {pillar.title}
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'mision' && (
          <motion.div
            key="mision"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="glass rounded-2xl p-8 sm:p-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-5">
                <span className="text-xs font-mono uppercase tracking-widest text-[#E6002B] font-semibold block">
                  01 · Razón de Ser del Club MC
                </span>
                <h3 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white">
                  {about.missionTitle}
                </h3>
                <blockquote className="text-xl sm:text-2xl text-slate-800 dark:text-neutral-100 leading-relaxed font-sans font-medium">
                  "{about.missionBody}"
                </blockquote>
                <div className="pt-4 flex flex-wrap gap-3">
                  <a
                    href="#escuela"
                    onClick={playUiClick}
                    className="px-5 py-3 rounded-xl bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors"
                  >
                    <span>Reservar Clase de Prueba Gratuita</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      playUiClick();
                      setActiveTab('vision');
                    }}
                    className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Ver Nuestra Visión</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl p-6 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-neutral-400 block">
                  Ejes de la Misión
                </span>
                {about.pillars.map((p) => (
                  <div key={p.id} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-[#E6002B] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{p.title}:</span>{' '}
                      <span className="text-slate-600 dark:text-neutral-400">{p.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'vision' && (
          <motion.div
            key="vision"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="glass rounded-2xl p-8 sm:p-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-5">
                <span className="text-xs font-mono uppercase tracking-widest text-[#E6002B] font-semibold block">
                  02 · Horizonte Institucional en Bolivia
                </span>
                <h3 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white">
                  {about.visionTitle}
                </h3>
                <blockquote className="text-xl sm:text-2xl text-slate-800 dark:text-neutral-100 leading-relaxed font-sans font-medium">
                  "{about.visionBody}"
                </blockquote>
                <div className="pt-4 flex flex-wrap gap-3">
                  <a
                    href="#squads"
                    onClick={playUiClick}
                    className="px-5 py-3 rounded-xl bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors"
                  >
                    <span>Explorar Categorías y Proyección</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      playUiClick();
                      setActiveTab('mision');
                    }}
                    className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Volver a Misión</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl p-6 space-y-4 text-center">
                <img
                  src="/logo-mc-shield.png"
                  alt="Club MC Martín Careaga"
                  className="w-20 h-20 object-contain mx-auto"
                />
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#E6002B] font-bold block">
                    {content.clubInfo.slogan}
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {content.clubInfo.complexName}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-neutral-400 mt-0.5">
                    {content.clubInfo.zone}, La Paz · Bolivia
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'pilares' && (
          <motion.div
            key="pilares"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {about.pillars.map((pillar, idx) => {
              const Icon = PILLAR_ICONS[idx % PILLAR_ICONS.length];
              return (
                <Spotlight
                  key={pillar.id}
                  className="glass rounded-2xl p-7 hover:border-[#E6002B]/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-11 h-11 rounded-xl bg-[#E6002B]/10 dark:bg-[#E6002B]/15 border border-[#E6002B]/25 dark:border-[#E6002B]/30 flex items-center justify-center text-[#E6002B]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-2xl font-black font-display tabular-nums text-slate-300 dark:text-white/20">
                        0{idx + 1}
                      </span>
                    </div>
                    <h4 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-2">
                      Desarrollo {pillar.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-neutral-300 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </Spotlight>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
