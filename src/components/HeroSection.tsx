import React, { useState, useEffect } from 'react';
import { playUiClick } from '../utils/soundEffects';
import { Calendar, ArrowRight, Sparkles, ChevronRight, Gamepad2 } from 'lucide-react';
import { UPCOMING_MATCHES } from '../data/mockData';
import { SoccerMiniGames } from './SoccerMiniGames';

interface HeroSectionProps {
  onOpenStore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenStore }) => {
  const nextMatch = UPCOMING_MATCHES[0];
  const [heroDisplayMode, setHeroDisplayMode] = useState<'ball3d' | 'countdown'>('ball3d');

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
    <section className="relative min-h-[82vh] flex flex-col justify-center pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Ambient Beams */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#E6002B]/8 dark:bg-[#E6002B]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 carbon-grid opacity-30 pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Marquee Hero Typography */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-neutral-400">
            <span className="text-[#E6002B] font-bold tracking-widest uppercase">
              Club MC Emprender & Cantera
            </span>
            <span aria-hidden="true">·</span>
            <span>Director Técnico Martín Careaga</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 dark:text-neutral-500">Temporada 2026/27</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display text-slate-900 dark:text-white tracking-tight leading-[0.94] uppercase">
            PASIÓN ROJINEGRA. <br />
            <span className="text-[#E6002B]">
              FÚTBOL DE ÉLITE
            </span>{' '}
            Y FORMACIÓN.
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 max-w-xl leading-relaxed">
            El hogar del Primer Plantel MC y la prestigiosa Escuela Formativa de Fútbol de Martín Careaga. Metodología de alta competencia, cantera formativa y la indumentaria oficial más avanzada en Bolivia.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                playUiClick();
                onOpenStore();
              }}
              className="px-6 py-3.5 bg-[#E6002B] hover:bg-[#FF1A40] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#E6002B]/25 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Personalizar Camiseta 3D</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#escuela"
              onClick={playUiClick}
              className="px-6 py-3.5 bg-white hover:bg-slate-100 dark:bg-neutral-900/90 dark:hover:bg-neutral-800 border border-slate-300 dark:border-neutral-700 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Inscripciones Escuela Careaga</span>
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-neutral-800/80 max-w-lg text-xs">
            <div>
              <span className="text-2xl font-black font-display tabular-nums text-slate-900 dark:text-white block">#1</span>
              <span className="text-slate-600 dark:text-neutral-400">Líderes de la Liga</span>
            </div>
            <div>
              <span className="text-2xl font-black font-display tabular-nums text-slate-900 dark:text-white block">+350</span>
              <span className="text-slate-600 dark:text-neutral-400">Canteranos en la Escuela</span>
            </div>
            <div>
              <span className="text-2xl font-black font-display tabular-nums text-[#E6002B] block">30+</span>
              <span className="text-slate-600 dark:text-neutral-400">Promovidos a 1ª División</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Mini-Games Arcade & Next Match Switcher */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between p-1 bg-slate-200/80 dark:bg-neutral-900/80 border border-slate-300 dark:border-neutral-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                playUiClick();
                setHeroDisplayMode('ball3d');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                heroDisplayMode === 'ball3d'
                  ? 'bg-[#E6002B] text-white shadow-sm'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Minijuegos MC</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playUiClick();
                setHeroDisplayMode('countdown');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                heroDisplayMode === 'countdown'
                  ? 'bg-[#E6002B] text-white shadow-sm'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Próximo Partido</span>
            </button>
          </div>

          {heroDisplayMode === 'ball3d' && (
            <div className="bg-white dark:bg-[#0C0C0E]/90 border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md relative overflow-hidden shadow-xl flex flex-col">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#E6002B] to-transparent" />
              <div className="w-full flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-[#E6002B] uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  DESAFÍO CANTERA MC
                </span>
                <span className="text-[11px] text-slate-500 dark:text-neutral-400 font-mono">Récord Guardado</span>
              </div>

              <SoccerMiniGames />
            </div>
          )}

          {heroDisplayMode === 'countdown' && (
            <div className="bg-white dark:bg-[#0C0C0E]/90 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#E6002B] to-transparent" />

              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold text-[#E6002B] uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  PRÓXIMO PARTIDO OFICIAL
                </span>
                <span className="text-xs text-slate-500 dark:text-neutral-400">{nextMatch.competition}</span>
              </div>

              <div className="py-4 border-y border-slate-200 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-neutral-900 border border-[#E6002B] flex items-center justify-center font-display font-black text-xl text-white shadow-md">
                    MC
                  </div>
                  <div>
                    <h4 className="text-lg font-bold font-display text-slate-900 dark:text-white">CLUB MC</h4>
                    <span className="text-[11px] text-slate-500 dark:text-neutral-400">Primer Plantel</span>
                  </div>
                </div>

                <div className="px-3 py-1 bg-slate-100 dark:bg-neutral-900 rounded-lg text-xs font-bold text-slate-600 dark:text-neutral-400">
                  VS
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <h4 className="text-lg font-bold font-display text-slate-900 dark:text-white">DEP. CENTRAL</h4>
                    <span className="text-[11px] text-slate-500 dark:text-neutral-400">Visitante</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 flex items-center justify-center font-display font-black text-xl text-slate-700 dark:text-neutral-300">
                    DCE
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <span className="text-[11px] text-slate-500 dark:text-neutral-400 uppercase tracking-wider block mb-3 font-semibold">
                  Cuenta Regresiva para el Pitazo Inicial:
                </span>

                <div className="grid grid-cols-4 gap-2">
                  <div className="p-2.5 bg-slate-50 dark:bg-neutral-950 rounded-xl border border-slate-200 dark:border-neutral-800">
                    <span className="text-2xl sm:text-3xl font-black font-mono-numbers text-slate-900 dark:text-white block">
                      {String(timeLeft.days).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase text-slate-500 dark:text-neutral-500 font-semibold">Días</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-neutral-950 rounded-xl border border-slate-200 dark:border-neutral-800">
                    <span className="text-2xl sm:text-3xl font-black font-mono-numbers text-slate-900 dark:text-white block">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase text-slate-500 dark:text-neutral-500 font-semibold">Horas</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-neutral-950 rounded-xl border border-slate-200 dark:border-neutral-800">
                    <span className="text-2xl sm:text-3xl font-black font-mono-numbers text-slate-900 dark:text-white block">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase text-slate-500 dark:text-neutral-500 font-semibold">Min</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-neutral-950 rounded-xl border border-slate-200 dark:border-neutral-800">
                    <span className="text-2xl sm:text-3xl font-black font-mono-numbers text-[#E6002B] block">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase text-slate-500 dark:text-neutral-500 font-semibold">Seg</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-neutral-800 flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400">
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
