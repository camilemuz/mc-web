import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ASSETS } from '../content';
import { useSiteContent } from '../utils/ContentContext';
import { playUiClick, playGoalCheer, playWhoosh } from '../utils/soundEffects';
import { Shield, ChevronLeft, ChevronRight, Zap, Trophy, Volume2, VolumeX } from 'lucide-react';

interface HeroFigmaStageProps {
  onOpenStore?: () => void;
}

interface StarPlayer {
  id: string;
  name: string;
  nickname: string;
  number: number;
  position: string;
  category: string;
  ovr: number;
  role: string;
  image: string;
  accent: string;
  stats: {
    ritmo: number;
    tiro: number;
    pase: number;
    regated: number;
    defensa: number;
    fisico: number;
  };
}

const STAR_PLAYERS: StarPlayer[] = [
  {
    id: 'p-2',
    name: 'Lucas Benítez',
    nickname: 'El Mago',
    number: 10,
    position: 'Mediocampista',
    category: 'Primer Plantel',
    ovr: 94,
    role: 'Capitán & Creador',
    accent: '#E6002B',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    stats: { ritmo: 89, tiro: 92, pase: 97, regated: 94, defensa: 72, fisico: 86 }
  },
  {
    id: 'p-1',
    name: 'Mateo Valenzuela',
    nickname: 'El Rayo',
    number: 9,
    position: 'Delantero',
    category: 'Primer Plantel',
    ovr: 93,
    role: 'Goleador Implacable',
    accent: '#FF3355',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    stats: { ritmo: 96, tiro: 95, pase: 84, regated: 90, defensa: 45, fisico: 91 }
  },
  {
    id: 'p-3',
    name: 'Joaquín Navarro',
    nickname: 'El Muro',
    number: 2,
    position: 'Defensa',
    category: 'Primer Plantel',
    ovr: 91,
    role: 'Líder de Zaga',
    accent: '#3B82F6',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
    stats: { ritmo: 85, tiro: 62, pase: 84, regated: 79, defensa: 95, fisico: 94 }
  },
  {
    id: 'p-4',
    name: 'Tomás Herrera',
    nickname: 'San Tomás',
    number: 1,
    position: 'Arquero',
    category: 'Primer Plantel',
    ovr: 92,
    role: 'Cerrojo del Arco',
    accent: '#E6002B',
    image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&w=800&q=80',
    stats: { ritmo: 87, tiro: 40, pase: 86, regated: 83, defensa: 96, fisico: 89 }
  }
];

export const HeroFigmaStage: React.FC<HeroFigmaStageProps> = ({ onOpenStore }) => {
  const { content } = useSiteContent();
  const HERO = content.hero;
  const [mounted, setMounted] = useState(false);

  // Interactive Mode Selector: 'players3d' | 'shield3d' | 'film'
  const [showcaseMode, setShowcaseMode] = useState<'players3d' | 'shield3d' | 'film'>('players3d');
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isShieldHovered, setIsShieldHovered] = useState(false);
  const [shieldBurst, setShieldBurst] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // 3D Card mouse tilt physics
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, px: 50, py: 50 });
  const [shieldTilt, setShieldTilt] = useState({ rx: 0, ry: 0 });

  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroPlayers = content.heroPlayers && content.heroPlayers.length > 0 ? content.heroPlayers : STAR_PLAYERS;
  const activePlayer = heroPlayers[currentPlayerIdx] || heroPlayers[0] || STAR_PLAYERS[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Parallax subtle depth planes
  const { scrollY } = useScroll();
  const rawBgY = useTransform(scrollY, [0, 800], [0, 120]);
  const rawMediaY = useTransform(scrollY, [0, 800], [0, -60]);
  const rawTextY = useTransform(scrollY, [0, 800], [0, -30]);

  const springConfig = { stiffness: 140, damping: 25, mass: 0.8 };
  const bgY = useSpring(rawBgY, springConfig);
  const mediaY = useSpring(rawMediaY, springConfig);
  const textY = useSpring(rawTextY, springConfig);

  // Auto-advance player every 7 seconds when not hovered and in players3d mode
  useEffect(() => {
    if (showcaseMode !== 'players3d' || isCardHovered) return;
    const interval = setInterval(() => {
      setCurrentPlayerIdx((prev) => (prev + 1) % heroPlayers.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [showcaseMode, isCardHovered, heroPlayers.length]);

  const handlePrevPlayer = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    playWhoosh();
    setCurrentPlayerIdx((prev) => (prev === 0 ? heroPlayers.length - 1 : prev - 1));
  };

  const handleNextPlayer = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    playWhoosh();
    setCurrentPlayerIdx((prev) => (prev + 1) % heroPlayers.length);
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const rx = ((y - cy) / cy) * -14;
    const ry = ((x - cx) / cx) * 14;
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;

    setTilt({ rx, ry, px, py });
  };

  const handleShieldMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const rx = ((y - cy) / cy) * -18;
    const ry = ((x - cx) / cx) * 18;
    setShieldTilt({ rx, ry });
  };

  const handleShieldClick = () => {
    playGoalCheer();
    setShieldBurst(true);
    setTimeout(() => setShieldBurst(false), 900);
  };

  const scrollToRoster = () => {
    playUiClick();
    const el = document.getElementById('plantilla');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const officialSlogan = (content.clubInfo?.slogan || 'Cumpliendo Sueños').toUpperCase();
  const sloganParts = officialSlogan.split(' ');
  const sloganLine1 = sloganParts[0] || 'CUMPLIENDO';
  const sloganLine2 = sloganParts.slice(1).join(' ') || 'SUEÑOS';

  if (!mounted) {
    return <section className="min-h-screen bg-[#F4F6F8] dark:bg-[#08080A] flex items-center justify-center" />;
  }

  return (
    <section
      ref={heroRef}
      id="home"
      aria-label="Portada Principal y Presentación Oficial Club MC"
      className="relative min-h-[calc(100vh-0.5rem)] w-full flex flex-col justify-center pt-20 sm:pt-24 lg:pt-22 pb-8 sm:pb-12 overflow-hidden bg-gradient-to-b from-white via-[#F6F8FB] to-[#EEF2F6] dark:bg-gradient-to-br dark:from-[#1B0309] dark:via-[#0A0507] dark:to-[#050507] select-none transition-colors duration-300"
    >
      {/* Background Texture & Stadium Atmospheric Lighting */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Dramatic Crimson Stadium Glow Beams in Dark Mode */}
        <div className="hidden dark:block absolute -top-24 left-1/2 -translate-x-1/3 w-[950px] lg:w-[1200px] h-[650px] lg:h-[780px] bg-[#E6002B]/22 rounded-full blur-[160px]" />
        <div className="hidden dark:block absolute top-1/4 right-0 w-[560px] h-[560px] bg-[#E6002B]/28 rounded-full blur-[140px]" />
        <div className="hidden dark:block absolute bottom-0 left-0 w-[420px] h-[420px] bg-red-950/30 rounded-full blur-[120px]" />

        {/* Clean Crisp Light Mode Ambient Depth (zero pink haze) */}
        <div className="dark:hidden absolute -top-24 right-0 w-[680px] h-[680px] bg-gradient-to-bl from-slate-200/75 via-slate-100/35 to-transparent rounded-full blur-3xl" />

        {/* Subtle Carbon Grid Texture */}
        <div className="absolute inset-0 carbon-grid opacity-25 dark:opacity-20" />

        {/* Giant Editorial Ghost Slogan Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden px-6">
          <div className="text-center font-display font-black italic uppercase tracking-tighter leading-[0.82] text-[18vw] sm:text-[13vw] lg:text-[10.5vw] text-slate-900/[0.035] dark:text-white/[0.045] translate-y-6">
            <div>{sloganLine1}</div>
            <div>{sloganLine2}</div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid: 12 Columns */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">

        {/* Left Column: Athletic Typography, Official Slogan, Lede & CTA */}
        <motion.div
          style={{ y: textY }}
          className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center space-y-4 sm:space-y-5"
        >
          {/* Top Athletic Kicker */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-black/70 border border-slate-200 dark:border-white/15 text-[11px] sm:text-xs font-mono text-slate-700 dark:text-neutral-200 w-fit shadow-sm dark:shadow-lg dark:shadow-black/60 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-[#E6002B] animate-pulse shrink-0" aria-hidden="true" />
            <span className="text-[#E6002B] dark:text-[#FF2E50] font-bold tracking-wider uppercase font-mono">
              MC Emprender
            </span>
            <span className="text-slate-300 dark:text-neutral-500">·</span>
            <span className="text-slate-900 dark:text-white font-extrabold tracking-wide">{officialSlogan}</span>
            <span className="text-slate-300 dark:text-neutral-500 hidden sm:inline">·</span>
            <span className="text-slate-500 dark:text-neutral-300 hidden sm:inline">Temporada 2026/27</span>
          </motion.div>

          {/* Primary High-Impact Athletic Headline */}
          <div className="space-y-0 leading-none">
            <h1 className="font-extrabold uppercase font-display italic text-5xl sm:text-6xl md:text-7xl xl:text-[86px] 2xl:text-[104px] flex flex-col leading-[0.86] tracking-tight">
              {HERO.headline.map((word, idx) => {
                const lower = word.toLowerCase();

                let colorClass = 'text-slate-950 dark:text-white dark:drop-shadow-[0_6px_26px_rgba(0,0,0,0.85)]';
                if (lower.includes('pasion') || lower.includes('pasión') || idx === 1) {
                  colorClass =
                    'text-[#E6002B] dark:text-[#FF1A40] dark:drop-shadow-[0_0_32px_rgba(230,0,43,0.55)]';
                } else if (lower.includes('gloria') || lower.includes('sueños') || lower.includes('suenos') || idx === 2) {
                  colorClass =
                    'text-slate-800 dark:text-white dark:drop-shadow-[0_6px_24px_rgba(0,0,0,0.8)]';
                }

                return (
                  <motion.span
                    key={`${word}-${idx}`}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.65,
                      delay: 0.08 * (idx + 1),
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={colorClass}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </h1>
          </div>

          {/* Lede Explanatory Narrative */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="text-sm sm:text-base lg:text-[17px] text-slate-600 dark:text-neutral-200 font-sans leading-relaxed max-w-lg font-normal"
          >
            {HERO.lede}
          </motion.p>

          {/* CTA Actions & Club Slogan Stamp */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-wrap items-center gap-4 pt-1"
          >
            <a
              href="#squads"
              onClick={playUiClick}
              aria-label="Conocer categorías y unirse al Club MC"
              className="px-7 py-3.5 bg-[#E6002B] hover:bg-[#C80025] text-white font-mono uppercase tracking-wider font-bold text-xs sm:text-sm rounded-full transition-all shadow-lg shadow-[#E6002B]/30 hover:shadow-xl hover:shadow-[#E6002B]/40 flex items-center gap-2.5 cursor-pointer active:scale-95 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6002B] focus-visible:ring-offset-2"
            >
              <span>{HERO.cta}</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>

            {onOpenStore && (
              <button
                onClick={() => {
                  playUiClick();
                  onOpenStore();
                }}
                aria-label="Ir a la tienda oficial 3D del Club MC"
                className="px-6 py-3.5 bg-white hover:bg-slate-100 dark:bg-white/[0.08] dark:hover:bg-white/[0.15] border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white font-mono uppercase tracking-wider font-bold text-xs sm:text-sm rounded-full transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-sm dark:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6002B]"
              >
                <span>Tienda Oficial</span>
              </button>
            )}

            <div className="border-l-2 border-[#E6002B]/70 dark:border-white/25 pl-4 py-1 flex flex-col justify-center">
              <span className="text-slate-900 dark:text-white font-extrabold tracking-wide font-display text-sm leading-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E6002B] animate-pulse" />
                <span>{officialSlogan}</span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-neutral-300 font-mono tracking-wider uppercase mt-0.5">
                Formación & Primer Plantel
              </span>
            </div>
          </motion.div>

          {/* Social Proof & Metrics Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-200 dark:border-white/10"
          >
            {/* Learners Card */}
            <div className="px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-black/60 backdrop-blur-md flex items-center gap-3 shadow-sm dark:shadow-lg dark:shadow-black/50">
              <div className="flex -space-x-2">
                {ASSETS.img.avatars.slice(0, 3).map((av, idx) => (
                  <img
                    key={idx}
                    src={av}
                    alt={`Jugador formado en Escuela MC ${idx + 1}`}
                    width={26}
                    height={26}
                    className="w-6.5 h-6.5 rounded-full border-2 border-white dark:border-black object-cover"
                  />
                ))}
              </div>
              <div>
                <span className="font-extrabold font-display text-slate-950 dark:text-white text-sm sm:text-base block leading-none">
                  {HERO.learners.value}
                </span>
                <span className="text-slate-500 dark:text-neutral-300 font-mono text-[10px] uppercase font-semibold">
                  {HERO.learners.label}
                </span>
              </div>
            </div>

            {/* Regional Titles & Matches Card */}
            <div className="px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-black/60 backdrop-blur-md flex items-center gap-3.5 shadow-sm dark:shadow-lg dark:shadow-black/50">
              <div>
                <span className="font-extrabold font-display text-slate-950 dark:text-white text-sm sm:text-base block leading-none">
                  {HERO.sessions.value}
                </span>
                <span className="text-slate-500 dark:text-neutral-300 font-mono text-[10px] uppercase font-semibold">
                  {HERO.sessions.label}
                </span>
              </div>
              <div className="h-5 w-[1px] bg-slate-200 dark:bg-white/20" aria-hidden="true" />
              <div>
                <span className="font-extrabold font-display text-[#E6002B] dark:text-[#FF2E50] text-sm sm:text-base block leading-none">
                  {HERO.dataPoints.value}
                </span>
                <span className="text-slate-500 dark:text-neutral-300 font-mono text-[10px] uppercase font-semibold">
                  {HERO.dataPoints.label}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Open Frameless Orbital 3D Stadium Stage (Cracks 3D / Escudo 3D / Film Estadio) */}
        <motion.div
          style={{ y: mediaY }}
          className="lg:col-span-6 xl:col-span-6 flex flex-col items-center justify-center relative mt-4 lg:mt-0"
        >
          {/* Floating Top Status Pill */}
          <div className="relative z-30 mb-2 pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-black/80 border border-slate-200 dark:border-white/15 backdrop-blur-xl text-[11px] font-mono shadow-md dark:shadow-2xl">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="font-extrabold tracking-wider uppercase text-slate-950 dark:text-white">MC EMPRENDER</span>
              <span className="text-[#E6002B] font-bold">·</span>
              <span className="font-extrabold tracking-wide text-slate-800 dark:text-white">{officialSlogan}</span>
              <span className="text-slate-300 dark:text-neutral-500 hidden sm:inline">·</span>
              <span className="text-slate-500 dark:text-neutral-300 hidden sm:inline">{activePlayer.category || 'Primer Plantel'}</span>
            </div>
          </div>

          {/* Open Frameless Orbital Container */}
          <div className="relative w-full max-w-[490px] h-[390px] sm:h-[430px] lg:h-[450px] 2xl:h-[520px] flex items-center justify-center">
            {/* Ambient Crimson Halo Orb Behind Player */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] rounded-full bg-gradient-to-tr from-[#E6002B]/20 via-[#E6002B]/10 to-transparent dark:from-[#E6002B]/45 dark:via-[#E6002B]/20 dark:to-transparent blur-3xl pointer-events-none" />

            {/* Outer Rotating Dashed Crimson Orbital Ring with Glowing Diamond Nodes */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[310px] h-[310px] sm:w-[375px] sm:h-[375px] lg:w-[405px] lg:h-[405px] 2xl:w-[465px] 2xl:h-[465px] rounded-full border border-dashed border-[#E6002B]/45 dark:border-[#E6002B]/55 pointer-events-none animate-[spin_45s_linear_infinite]">
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-[#E6002B] shadow-[0_0_12px_#E6002B]" />
              <span className="absolute top-1/4 -right-1 w-2.5 h-2.5 rotate-45 bg-[#E6002B] shadow-[0_0_12px_#E6002B]" />
              <span className="absolute bottom-1/4 -left-1 w-2.5 h-2.5 rotate-45 bg-[#E6002B] shadow-[0_0_12px_#E6002B]" />
            </div>

            {/* Inner Subtle Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] sm:w-[305px] sm:h-[305px] lg:w-[330px] lg:h-[330px] 2xl:w-[380px] 2xl:h-[380px] rounded-full border border-[#E6002B]/15 dark:border-[#E6002B]/25 bg-gradient-to-b from-slate-900/[0.04] to-transparent dark:from-[#E6002B]/[0.12] dark:via-[#1C040A]/40 dark:to-transparent pointer-events-none" />

            {/* ------------------------------------------------------------- */}
            {/* VIEW MODE 1: CRACKS 3D DEL PRIMER PLANTEL (FRAMELESS ORBITAL) */}
            {/* ------------------------------------------------------------- */}
            {showcaseMode === 'players3d' && (
              <div
                className="relative w-full h-full flex items-center justify-center perspective-1000 cursor-pointer select-none"
                onMouseMove={handleCardMouseMove}
                onMouseEnter={() => setIsCardHovered(true)}
                onMouseLeave={() => {
                  setIsCardHovered(false);
                  setTilt({ rx: 0, ry: 0, px: 50, py: 50 });
                }}
                onClick={scrollToRoster}
                title="Haz clic para ver la plantilla completa del Club MC"
              >
                {/* Giant Athletic Number Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                  <span className="text-[180px] sm:text-[220px] font-black font-display italic text-slate-900/[0.04] dark:text-white/[0.05] leading-none tracking-tighter">
                    #{activePlayer.number}
                  </span>
                </div>

                {/* Main Player Figure Floating Inside Orbital Ring */}
                <motion.div
                  key={activePlayer.id}
                  initial={{ opacity: 0, scale: 0.92, filter: 'blur(6px)' }}
                  animate={{
                    opacity: 1,
                    filter: 'blur(0px)',
                    scale: isCardHovered ? 1.05 : [1, 1.025, 1],
                    y: [0, -7, 0],
                  }}
                  transition={{
                    scale: {
                      duration: isCardHovered ? 0.35 : 8,
                      repeat: isCardHovered ? 0 : Infinity,
                      ease: 'easeInOut',
                    },
                    y: {
                      duration: 6,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                    opacity: { duration: 0.45 },
                    filter: { duration: 0.45 },
                  }}
                  style={{
                    transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                    transformStyle: 'preserve-3d',
                  }}
                  className="relative z-10 w-[280px] sm:w-[340px] lg:w-[365px] 2xl:w-[410px] h-[340px] sm:h-[385px] lg:h-[405px] 2xl:h-[465px] flex items-end justify-center transition-transform duration-200 ease-out"
                >
                  <img
                    src={activePlayer.image}
                    alt={`Jugador destacado del primer plantel: ${activePlayer.name}`}
                    className="w-full h-full object-contain object-bottom filter drop-shadow-[0_22px_35px_rgba(0,0,0,0.45)] dark:drop-shadow-[0_24px_45px_rgba(0,0,0,0.9)] [mask-image:linear-gradient(to_bottom,black_76%,transparent_100%)] rounded-b-full"
                  />
                </motion.div>

                {/* Bottom Player Identity Plaque */}
                <div className="absolute bottom-1 inset-x-4 flex flex-col items-center text-center z-20 pointer-events-auto">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 dark:bg-black/85 border border-slate-200 dark:border-white/15 backdrop-blur-md text-[11px] font-mono mb-1.5 shadow-md dark:shadow-xl">
                    <span className="w-2 h-2 rounded-full bg-[#E6002B]" />
                    <span className="text-[#E6002B] dark:text-[#FF3355] font-black tracking-wider">#{activePlayer.number}</span>
                    <span className="text-slate-300 dark:text-neutral-600">·</span>
                    <span className="text-slate-900 dark:text-white font-bold uppercase">{activePlayer.position}</span>
                    <span className="text-slate-300 dark:text-neutral-600">·</span>
                    <span className="text-slate-500 dark:text-neutral-300 uppercase text-[10px]">{activePlayer.category}</span>
                  </div>

                  <h3 className="font-extrabold uppercase font-display italic text-3xl sm:text-4xl lg:text-5xl text-slate-950 dark:text-white tracking-wide leading-none drop-shadow-[0_2px_10px_rgba(255,255,255,0.65)] dark:drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)]">
                    {activePlayer.name}
                  </h3>

                  <p className="text-xs font-mono text-slate-600 dark:text-neutral-300 uppercase tracking-widest mt-1 flex items-center gap-2">
                    <span className="text-[#E6002B]">★</span>
                    <span>{activePlayer.nickname}</span>
                    <span className="text-slate-300 dark:text-neutral-600">|</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{activePlayer.role}</span>
                    <span className="text-[#E6002B]">★</span>
                  </p>

                  {/* Player Carousel Pagination Indicators */}
                  <div className="flex items-center gap-2 mt-3">
                    {heroPlayers.map((p, idx) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playWhoosh();
                          setCurrentPlayerIdx(idx);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === currentPlayerIdx
                            ? 'w-8 bg-[#E6002B] shadow-[0_0_12px_#E6002B]'
                            : 'w-2 bg-slate-300 dark:bg-white/35 hover:bg-slate-500 dark:hover:bg-white/80'
                        }`}
                        aria-label={`Ver jugador destacado: ${p.name}`}
                        title={p.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Carousel Side Navigation Buttons */}
                <button
                  type="button"
                  onClick={handlePrevPlayer}
                  aria-label="Ver jugador anterior del primer plantel"
                  className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 dark:bg-black/75 hover:bg-[#E6002B] dark:hover:bg-[#E6002B] border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white hover:text-white flex items-center justify-center transition-all cursor-pointer z-30 shadow-lg hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#E6002B]"
                >
                  <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleNextPlayer}
                  aria-label="Ver siguiente jugador del primer plantel"
                  className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 dark:bg-black/75 hover:bg-[#E6002B] dark:hover:bg-[#E6002B] border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white hover:text-white flex items-center justify-center transition-all cursor-pointer z-30 shadow-lg hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#E6002B]"
                >
                  <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* VIEW MODE 2: ESCUDO 3D OFICIAL                                */}
            {/* ------------------------------------------------------------- */}
            {showcaseMode === 'shield3d' && (
              <div
                className="relative w-full h-full flex flex-col items-center justify-center perspective-1000 cursor-pointer px-6"
                onMouseMove={handleShieldMouseMove}
                onMouseEnter={() => setIsShieldHovered(true)}
                onMouseLeave={() => {
                  setIsShieldHovered(false);
                  setShieldTilt({ rx: 0, ry: 0 });
                }}
                onClick={handleShieldClick}
                title="Haz clic para celebrar el gol y activar la energía del club"
              >
                <motion.div
                  animate={{ y: [-6, 6, -6] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className={`relative w-60 h-60 sm:w-72 sm:h-72 flex items-center justify-center transition-transform duration-300 ${
                    shieldBurst ? 'scale-120' : isShieldHovered ? 'scale-108' : 'scale-100'
                  }`}
                  style={{
                    transform: `rotateX(${shieldTilt.rx}deg) rotateY(${shieldTilt.ry}deg)`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {shieldBurst && (
                    <div className="absolute inset-0 rounded-full bg-[#E6002B] blur-2xl animate-ping opacity-80 pointer-events-none" />
                  )}

                  <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-[#E6002B]/35 via-red-900/15 to-transparent blur-3xl pointer-events-none" />

                  <div className="relative w-52 h-52 sm:w-60 sm:h-60 z-20 flex items-center justify-center filter drop-shadow-[0_12px_28px_rgba(230,0,43,0.45)] dark:drop-shadow-[0_0_32px_rgba(230,0,43,0.75)] transition-all">
                    <img
                      src="/logo-mc-shield.png"
                      alt="Escudo Oficial Club MC Martín Careaga"
                      width={240}
                      height={240}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </motion.div>

                {/* Slogan Pedestal Plate */}
                <div className="mt-5 px-6 py-2.5 rounded-full bg-white/95 dark:bg-black/85 border border-slate-200 dark:border-white/20 backdrop-blur-xl shadow-lg text-center z-20">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-neutral-400 font-bold block">
                    CLUB MARTÍN CAREAGA
                  </span>
                  <span className="text-sm sm:text-base font-extrabold font-display text-slate-950 dark:text-white tracking-widest flex items-center gap-2.5 justify-center">
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#E6002B] shrink-0" />
                    <span>{officialSlogan}</span>
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#E6002B] shrink-0" />
                  </span>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* VIEW MODE 3: FILM ESTADIO                                     */}
            {/* ------------------------------------------------------------- */}
            {showcaseMode === 'film' && (
              <div className="relative w-[320px] h-[320px] sm:w-[410px] sm:h-[410px] rounded-full overflow-hidden border-2 border-[#E6002B]/50 shadow-2xl shadow-black/60 z-10">
                <video
                  ref={videoRef}
                  src={ASSETS.video.film}
                  poster={ASSETS.video.poster}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  aria-label={isMuted ? 'Activar sonido del estadio' : 'Silenciar sonido del estadio'}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/80 border border-white/25 text-white text-xs font-mono z-30 cursor-pointer hover:bg-[#E6002B] transition-colors flex items-center gap-2"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  <span>{isMuted ? 'Activar Audio' : 'Silenciar'}</span>
                </button>
              </div>
            )}
          </div>

          {/* 3D Mode Selector Dock */}
          <nav
            aria-label="Selector de visualización del Hero"
            className="mt-4 flex items-center gap-1.5 sm:gap-2 rounded-full border border-slate-200 dark:border-white/20 px-2.5 sm:px-3 py-1.5 shadow-md dark:shadow-2xl bg-white dark:bg-black/80 backdrop-blur-xl z-20"
          >
            <button
              type="button"
              onClick={() => {
                playUiClick();
                setShowcaseMode('players3d');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
                showcaseMode === 'players3d'
                  ? 'bg-[#E6002B] text-white shadow-sm shadow-[#E6002B]/40'
                  : 'text-slate-700 dark:text-neutral-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <Zap className="w-3.5 h-3.5" aria-hidden="true" />
              <span>01 Cracks 3D</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playUiClick();
                setShowcaseMode('shield3d');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
                showcaseMode === 'shield3d'
                  ? 'bg-[#E6002B] text-white shadow-sm shadow-[#E6002B]/40'
                  : 'text-slate-700 dark:text-neutral-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <Shield className="w-3.5 h-3.5" aria-hidden="true" />
              <span>02 Escudo 3D</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playUiClick();
                setShowcaseMode('film');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
                showcaseMode === 'film'
                  ? 'bg-[#E6002B] text-white shadow-sm shadow-[#E6002B]/40'
                  : 'text-slate-700 dark:text-neutral-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">03 Film Estadio</span>
              <span className="sm:hidden">03 Film</span>
            </button>
          </nav>
        </motion.div>
      </div>
    </section>
  );
};
