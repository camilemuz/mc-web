import React, { useState, useEffect } from 'react';
import { playUiClick, playWhoosh } from '../utils/soundEffects';
import { Calendar, ArrowRight, Shield, Sparkles, ChevronRight, Volume2, Trophy, RotateCw } from 'lucide-react';
import { UPCOMING_MATCHES } from '../data/mockData';
import { ThreeSoccerBallHero } from './ThreeSoccerBallHero';

interface HeroSectionProps {
  onOpenStore: () => void;
  onOpenDossier: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenStore, onOpenDossier }) => {
  const nextMatch = UPCOMING_MATCHES[0];
  const [heroDisplayMode, setHeroDisplayMode] = useState<'ball3d' | 'countdown'>('ball3d');

  // Real-time Countdown timer state (target date in 6 days)
  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Stadium Atmosphere with Red & Black Ambient Beams */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#E6002B]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-red-950/25 rounded-full blur-[120px] pointer-events-none" />

      {/* Cyber Grid Texture Overlay */}
      <div className="absolute inset-0 carbon-grid opacity-30 pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Marquee Hero Typography */}
        <div className="lg:col-span-7 space-y-6">
          {/* Unboxed Metadata Kicker */}
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span className="text-[#E6002B] font-bold tracking-widest uppercase">
              Club Atlético MC & Cantera
            </span>
            <span aria-hidden="true">·</span>
            <span>Director Técnico Martín Careaga</span>
            <span aria-hidden="true">·</span>
            <span className="text-neutral-500">Temporada 2026/27</span>
          </div>

          {/* Primary Athletic Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display text-white tracking-tight leading-[0.92] uppercase">
            PASIÓN ROJINEGRA. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-[#E6002B]">
              FÚTBOL DE ÉLITE
            </span>{' '}
            Y FORMACIÓN.
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 max-w-xl leading-relaxed">
            El hogar del Primer Plantel MC y la prestigiosa Escuela Formativa de Fútbol de Martín Careaga. Metodología de alta competencia, cantera formativa y la indumentaria oficial más avanzada en Bolivia.
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#tienda"
              onClick={playUiClick}
              className="px-6 py-3.5 bg-[#E6002B] hover:bg-[#FF1A40] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#E6002B]/25 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Personalizar Camiseta 3D</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#escuela"
              onClick={playUiClick}
              className="px-6 py-3.5 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Inscripciones Escuela Careaga</span>
            </a>

            <button
              onClick={() => {
                playUiClick();
                onOpenDossier();
              }}
              className="px-4 py-3.5 text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E6002B]" />
              <span>Ver Propuesta de Diseño</span>
            </button>
          </div>

          {/* Trust Metrics Adjacency */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-800/80 max-w-lg text-xs">
            <div>
              <span className="text-2xl font-black font-display text-white block">#1</span>
              <span className="text-neutral-400">Líderes de la Liga</span>
            </div>
            <div>
              <span className="text-2xl font-black font-display text-white block">+350</span>
              <span className="text-neutral-400">Canteranos en la Escuela</span>
            </div>
            <div>
              <span className="text-2xl font-black font-display text-[#E6002B] block">30+</span>
              <span className="text-neutral-400">Promovidos a 1ª División</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D WebGL Ball & Next Match Switcher */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Segmented Mode Switcher */}
          <div className="flex items-center justify-between p-1 bg-neutral-900/80 border border-neutral-800 rounded-xl">
            <button
              onClick={() => {
                playUiClick();
                setHeroDisplayMode('ball3d');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                heroDisplayMode === 'ball3d'
                  ? 'bg-[#E6002B] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Balón 3D Interactivo</span>
            </button>
            <button
              onClick={() => {
                playUiClick();
                setHeroDisplayMode('countdown');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                heroDisplayMode === 'countdown'
                  ? 'bg-[#E6002B] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Próximo Partido</span>
            </button>
          </div>

          {/* 3D WebGL Ball View */}
          {heroDisplayMode === 'ball3d' && (
            <div className="bg-[#0C0C0E]/90 border border-neutral-800 rounded-2xl p-4 sm:p-6 backdrop-blur-md relative overflow-hidden shadow-2xl flex flex-col items-center">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#E6002B] to-transparent" />
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#E6002B] uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  GRÁFICOS 3D WEBGL EN TIEMPO REAL
                </span>
                <span className="text-[11px] text-neutral-400">Shader Físico & Iluminación</span>
              </div>

              <ThreeSoccerBallHero />
            </div>
          )}

          {/* Countdown Card View */}
          {heroDisplayMode === 'countdown' && (
            <div className="bg-[#0C0C0E]/90 border border-neutral-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
              {/* Top Glow Edge */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#E6002B] to-transparent" />

              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold text-[#E6002B] uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  PRÓXIMO PARTIDO OFICIAL
                </span>
                <span className="text-xs text-neutral-400">{nextMatch.competition}</span>
              </div>

              {/* Duel Presentation */}
              <div className="py-4 border-y border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-[#E6002B] flex items-center justify-center font-display font-black text-xl text-white shadow-md">
                    MC
                  </div>
                  <div>
                    <h4 className="text-lg font-bold font-display text-white">CLUB MC</h4>
                    <span className="text-[11px] text-neutral-400">Primer Plantel</span>
                  </div>
                </div>

                <div className="px-3 py-1 bg-neutral-900 rounded-lg text-xs font-bold text-neutral-400">
                  VS
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <h4 className="text-lg font-bold font-display text-white">DEP. CENTRAL</h4>
                    <span className="text-[11px] text-neutral-400">Visitante</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center font-display font-black text-xl text-neutral-300">
                    DCE
                  </div>
                </div>
              </div>

              {/* Countdown Clock (Days, Hours, Minutes, Seconds) */}
              <div className="mt-6 text-center">
                <span className="text-[11px] text-neutral-400 uppercase tracking-wider block mb-3 font-semibold">
                  Cuenta Regresiva para el Pitazo Inicial:
                </span>

                <div className="grid grid-cols-4 gap-2">
                  <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800">
                    <span className="text-2xl sm:text-3xl font-black font-mono-numbers text-white block">
                      {String(timeLeft.days).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase text-neutral-500 font-semibold">Días</span>
                  </div>
                  <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800">
                    <span className="text-2xl sm:text-3xl font-black font-mono-numbers text-white block">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase text-neutral-500 font-semibold">Horas</span>
                  </div>
                  <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800">
                    <span className="text-2xl sm:text-3xl font-black font-mono-numbers text-white block">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase text-neutral-500 font-semibold">Min</span>
                  </div>
                  <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800">
                    <span className="text-2xl sm:text-3xl font-black font-mono-numbers text-[#E6002B] block">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase text-neutral-500 font-semibold">Seg</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                <span>{nextMatch.venue}</span>
                <a
                  href="#match-center"
                  onClick={playUiClick}
                  className="text-[#E6002B] hover:text-[#FF1A40] font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Ver Match Center</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
