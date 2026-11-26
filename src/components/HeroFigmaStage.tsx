import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ASSETS } from '../content';
import { useSiteContent } from '../utils/ContentContext';
import { playUiClick, playGoalCheer, playWhoosh } from '../utils/soundEffects';
import { Shield, Sparkles, ChevronLeft, ChevronRight, Zap, Trophy, Volume2, VolumeX, ArrowUpRight } from 'lucide-react';

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

  if (!mounted) {
    return <section className="min-h-screen bg-[#060608] flex items-center justify-center" />;
  }

  return (
    <section
      ref={heroRef}
      id="home"
      aria-label="Portada Principal y Presentación Oficial Club MC"
      className="relative min-h-screen w-full flex flex-col justify-center pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-24 overflow-hidden bg-[#060608] select-none"
    >
      {/* Background Watermark & Atmospheric Glows */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Ambient Red Glow Beams */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] lg:w-[950px] h-[450px] lg:h-[650px] bg-[#E6002B]/18 rounded-full blur-[150px]" />
        <div className="absolute top-1/4 right-10 w-[450px] h-[450px] bg-red-950/25 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-[#E6002B]/10 rounded-full blur-[110px]" />

        {/* Cyber Carbon Grid Texture */}
        <div className="absolute inset-0 carbon-grid opacity-25" />

        {/* Giant Athletic Typography Watermark: Slogan & Brand - Stacked & Scaled to never clip letters */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.04]">
          <span className="font-extrabold uppercase font-display italic tracking-widest text-[11vw] sm:text-[9vw] leading-[0.8] text-white">
            ALIMENTANDO
          </span>
          <span className="font-extrabold uppercase font-display italic tracking-widest text-[11vw] sm:text-[9vw] leading-[0.8] text-[#E6002B]">
            SUEÑOS
          </span>
        </div>
      </motion.div>

      {/* Main Content Grid: 12 Columns */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        
        {/* Left Column: Athletic Typography, Official Slogan, Lede & CTA */}
        <motion.div
          style={{ y: textY }}
          className="lg:col-span-7 flex flex-col justify-center space-y-6 sm:space-y-7"
        >
          {/* Top Athletic Kicker with Slogan - Clear clearance below navbar */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/75 border border-white/20 text-xs font-mono text-neutral-200 w-fit backdrop-blur-md shadow-lg shadow-black/60 mb-1"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#E6002B] animate-pulse" aria-hidden="true" />
            <span className="text-[#FF2E50] font-bold tracking-wider uppercase font-mono">
              MC Emprender
            </span>
            <span className="text-neutral-500">·</span>
            <span className="text-white font-extrabold tracking-wide">ALIMENTANDO SUEÑOS</span>
            <span className="text-neutral-500 hidden sm:inline">·</span>
            <span className="text-neutral-300 hidden sm:inline">Temporada 2026/27</span>
          </motion.div>

          {/* Primary High-Impact Athletic Headline */}
          <div className="space-y-0 leading-none">
            <h1 className="font-extrabold uppercase font-display italic text-5xl sm:text-7xl md:text-8xl xl:text-9xl flex flex-col leading-[0.88] tracking-tight">
              {HERO.headline.map((word, idx) => {
                const lower = word.toLowerCase();
                const isHighlight =
                  lower.includes('pasion') ||
                  lower.includes('pasión') ||
                  lower.includes('gloria') ||
                  lower.includes('sueños') ||
                  lower.includes('suenos');

                let colorClass = 'text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]';
                if (lower.includes('pasion') || lower.includes('pasión') || idx === 1) {
                  colorClass = 'text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E50] via-[#E6002B] to-[#B3001E] drop-shadow-[0_0_40px_rgba(230,0,43,0.7)]';
                } else if (lower.includes('gloria') || lower.includes('sueños') || lower.includes('suenos') || idx === 2) {
                  colorClass = 'text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-300 drop-shadow-[0_4px_24px_rgba(255,255,255,0.4)]';
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
            className="text-base sm:text-lg lg:text-xl text-neutral-200 font-sans leading-relaxed max-w-xl font-normal"
          >
            {HERO.lede}
          </motion.p>

          {/* CTA Actions & Club Slogan Badge */}
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
              className="px-7 py-3.5 bg-[#E6002B] hover:bg-[#FF1A40] text-white font-mono uppercase tracking-wider font-bold text-xs sm:text-sm rounded-full transition-all shadow-[0_0_35px_rgba(230,0,43,0.5)] hover:shadow-[0_0_45px_rgba(230,0,43,0.7)] flex items-center gap-2.5 cursor-pointer active:scale-95 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
                className="px-6 py-3.5 bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white font-mono uppercase tracking-wider font-bold text-xs sm:text-sm rounded-full transition-all flex items-center gap-2 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6002B]"
              >
                <span>Tienda Oficial</span>
              </button>
            )}

            <div className="border-l border-white/25 pl-4 py-1 flex flex-col justify-center">
              <span className="text-white font-extrabold tracking-wide font-display text-sm leading-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E6002B] animate-pulse" />
                <span>ALIIMENTANDO SUEÑOS</span>
              </span>
              <span className="text-[11px] text-neutral-300 font-mono tracking-wider uppercase mt-0.5">
                Formación & Primer Plantel
              </span>
            </div>
          </motion.div>

          {/* Social Proof & Metrics Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="flex flex-wrap items-center gap-4 pt-3 border-t border-white/10"
          >
            {/* Learners Card */}
            <div className="glass px-4 py-2.5 rounded-2xl border border-white/15 bg-black/60 backdrop-blur-md flex items-center gap-3 shadow-lg shadow-black/50">
              <div className="flex -space-x-2">
                {ASSETS.img.avatars.slice(0, 3).map((av, idx) => (
                  <img
                    key={idx}
                    src={av}
                    alt={`Jugador formado en Escuela MC ${idx + 1}`}
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full border-2 border-black object-cover"
                  />
                ))}
              </div>
              <div>
                <span className="font-extrabold font-display text-white text-base block leading-none">
                  {HERO.learners.value}
                </span>
                <span className="text-neutral-300 font-mono text-[11px] uppercase font-semibold">
                  {HERO.learners.label}
                </span>
              </div>
            </div>

            {/* Regional Titles & Matches Card */}
            <div className="glass px-4 py-2.5 rounded-2xl border border-white/15 bg-black/60 backdrop-blur-md flex items-center gap-4 shadow-lg shadow-black/50">
              <div>
                <span className="font-extrabold font-display text-white text-base block leading-none">
                  {HERO.sessions.value}
                </span>
                <span className="text-neutral-300 font-mono text-[11px] uppercase font-semibold">
                  {HERO.sessions.label}
                </span>
              </div>
              <div className="h-6 w-[1px] bg-white/20" aria-hidden="true" />
              <div>
                <span className="font-extrabold font-display text-[#FF2E50] text-base block leading-none">
                  {HERO.dataPoints.value}
                </span>
                <span className="text-neutral-300 font-mono text-[11px] uppercase font-semibold">
                  {HERO.dataPoints.label}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: High-Impact 3D Showcase (Escudo 3D / Cracks en Aumento / Film Estadio) */}
        <motion.div
          style={{ y: mediaY }}
          className="lg:col-span-5 flex flex-col items-center justify-center relative mt-6 lg:mt-0"
        >
          {/* Main 3D Container Stage Frame */}
          <div className="relative w-[320px] h-[360px] sm:w-[420px] sm:h-[450px] md:w-[460px] md:h-[480px] lg:w-[470px] lg:h-[500px] xl:w-[520px] xl:h-[540px] flex items-center justify-center">
            
            {/* EFFECT 1: Layered Neon Red Flare & Ambient Aura */}
            <div className="absolute -inset-10 sm:-inset-14 rounded-full bg-gradient-to-tr from-[#E6002B]/45 via-[#E6002B]/20 to-transparent blur-[75px] pointer-events-none animate-pulse" />
            <div className="absolute -inset-16 rounded-full bg-[#E6002B]/15 blur-[100px] pointer-events-none" />

            {/* EFFECT 2: Live Conic Sweep Light Radar */}
            <div
              className="absolute -inset-6 sm:-inset-8 rounded-full pointer-events-none animate-[spin_10s_linear_infinite] opacity-60"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0deg, rgba(230,0,43,0) 50deg, rgba(230,0,43,0.7) 110deg, transparent 140deg)',
                filter: 'blur(3px)',
              }}
            />

            {/* EFFECT 3: Outer Rotating Dashed Neon Ring with Cardinal Diamond Markers */}
            <div className="absolute -inset-6 sm:-inset-8 rounded-full border-2 border-dashed border-[#E6002B]/60 animate-[spin_35s_linear_infinite] pointer-events-none">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-[#E6002B] shadow-[0_0_12px_#E6002B]" />
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-[#E6002B] shadow-[0_0_12px_#E6002B]" />
              <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-[#E6002B] shadow-[0_0_12px_#E6002B]" />
              <span className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-[#E6002B] shadow-[0_0_12px_#E6002B]" />
            </div>

            {/* EFFECT 4: Inner Counter-Rotating Reticle */}
            <div className="absolute -inset-3 sm:-inset-4 rounded-full border border-white/20 animate-[spin_55s_linear_infinite_reverse] pointer-events-none" />

            {/* ------------------------------------------------------------- */}
            {/* VIEW MODE 1: CRACKS 3D DEL PRIMER PLANTEL (SILUETA RECORTADA + ZOOM 3D) */}
            {/* ------------------------------------------------------------- */}
            {showcaseMode === 'players3d' && (
              <div
                className="relative w-full h-[400px] sm:h-[480px] md:h-[520px] flex items-center justify-center perspective-1000 cursor-pointer overflow-hidden select-none"
                onMouseMove={handleCardMouseMove}
                onMouseEnter={() => setIsCardHovered(true)}
                onMouseLeave={() => {
                  setIsCardHovered(false);
                  setTilt({ rx: 0, ry: 0, px: 50, py: 50 });
                }}
                onClick={scrollToRoster}
                title="Haz clic para ver la plantilla completa del Club MC"
              >
                {/* Atmospheric Stadium Backdrop: Radial Glow + Red Neon Beam */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[300px] sm:w-[420px] h-[300px] sm:h-[420px] rounded-full bg-radial from-[#E6002B]/40 via-[#E6002B]/10 to-transparent blur-3xl animate-pulse" />
                  <div className="absolute w-[220px] sm:w-[320px] h-[380px] sm:h-[460px] rounded-full bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                </div>

                {/* Giant Athletic Number Watermark behind player */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                  <span className="text-[180px] sm:text-[260px] font-black font-display text-white/[0.04] leading-none tracking-tighter">
                    #{activePlayer.number}
                  </span>
                </div>

                {/* Main Player Cutout Silhouette with 3D Mouse Tilt + Continuous Slow Zoom ("agrandando de a poco") */}
                <motion.div
                  key={activePlayer.id}
                  initial={{ opacity: 0, scale: 0.94, filter: 'blur(8px)' }}
                  animate={{
                    opacity: 1,
                    filter: 'blur(0px)',
                    scale: isCardHovered ? 1.15 : [1, 1.10, 1.02],
                    y: [0, -8, 0],
                  }}
                  transition={{
                    scale: {
                      duration: isCardHovered ? 0.4 : 8,
                      repeat: isCardHovered ? 0 : Infinity,
                      ease: 'easeInOut',
                    },
                    y: {
                      duration: 6,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                    opacity: { duration: 0.6 },
                    filter: { duration: 0.6 },
                  }}
                  style={{
                    transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                    transformStyle: 'preserve-3d',
                  }}
                  className="relative z-10 h-full flex flex-col items-center justify-center transition-transform duration-200 ease-out"
                >
                  {/* Cutout Player Figure with Seamless Bottom Gradient Mask */}
                  <div className="relative h-[340px] sm:h-[420px] md:h-[470px] flex items-center justify-center">
                    <img
                      src={activePlayer.image}
                      alt={`Jugador estrella del primer plantel: ${activePlayer.name}`}
                      className="h-full w-auto max-w-[280px] sm:max-w-[360px] md:max-w-[400px] object-cover object-top filter contrast-110 drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)]"
                      style={{
                        WebkitMaskImage: 'linear-gradient(to bottom, black 68%, transparent 98%)',
                        maskImage: 'linear-gradient(to bottom, black 68%, transparent 98%)',
                      }}
                    />
                    {/* Subtle red rim light reflection */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  </div>
                </motion.div>

                {/* Floating Minimalist Player Identity Plaque at the bottom */}
                <div className="absolute bottom-3 inset-x-2 sm:inset-x-4 flex flex-col items-center text-center z-20 pointer-events-auto">
                  {/* Dorsal & Position Tag */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/85 border border-white/20 backdrop-blur-md shadow-xl text-xs font-mono mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#E6002B] animate-pulse" />
                    <span className="text-[#FF2E50] font-black tracking-wider">#{activePlayer.number}</span>
                    <span className="text-neutral-500">·</span>
                    <span className="text-white font-bold uppercase">{activePlayer.position}</span>
                    <span className="text-neutral-500">·</span>
                    <span className="text-neutral-300 uppercase font-mono text-[10px]">{activePlayer.category}</span>
                  </div>

                  {/* Big Athletic Name */}
                  <h3 className="font-extrabold uppercase font-display italic text-3xl sm:text-4xl md:text-5xl text-white tracking-wide leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                    {activePlayer.name}
                  </h3>

                  {/* Nickname & Role */}
                  <p className="text-xs sm:text-sm font-mono text-neutral-300 uppercase tracking-widest mt-1 flex items-center gap-2">
                    <span className="text-[#E6002B]">★</span>
                    <span>{activePlayer.nickname}</span>
                    <span className="text-neutral-600">|</span>
                    <span className="text-white font-semibold">{activePlayer.role}</span>
                    <span className="text-[#E6002B]">★</span>
                  </p>

                  {/* Player Carousel Pagination Indicators */}
                  <div className="flex items-center gap-2 mt-3">
                    {STAR_PLAYERS.map((p, idx) => (
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
                            : 'w-2 bg-white/30 hover:bg-white/60'
                        }`}
                        aria-label={`Ver crack del primer plantel: ${p.name}`}
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
                  className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/80 hover:bg-[#E6002B] border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-30 shadow-xl hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#E6002B]"
                >
                  <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleNextPlayer}
                  aria-label="Ver siguiente jugador del primer plantel"
                  className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/80 hover:bg-[#E6002B] border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-30 shadow-xl hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#E6002B]"
                >
                  <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* VIEW MODE 2: ESCUDO 3D POTENCIADO (ESCUDO OFICIAL HOLOGRÁFICO) */}
            {/* ------------------------------------------------------------- */}
            {showcaseMode === 'shield3d' && (
              <div
                className="relative w-full h-full flex flex-col items-center justify-center perspective-1000 cursor-pointer"
                onMouseMove={handleShieldMouseMove}
                onMouseEnter={() => setIsShieldHovered(true)}
                onMouseLeave={() => {
                  setIsShieldHovered(false);
                  setShieldTilt({ rx: 0, ry: 0 });
                }}
                onClick={handleShieldClick}
                title="Haz clic para celebrar el gol y activar la energía del club"
              >
                {/* 3D Floating Shield Unit */}
                <motion.div
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className={`relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center transition-transform duration-300 ${
                    shieldBurst ? 'scale-125' : isShieldHovered ? 'scale-110' : 'scale-100'
                  }`}
                  style={{
                    transform: `rotateX(${shieldTilt.rx}deg) rotateY(${shieldTilt.ry}deg)`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Energy burst on click */}
                  {shieldBurst && (
                    <div className="absolute inset-0 rounded-full bg-[#E6002B] blur-2xl animate-ping opacity-80 pointer-events-none" />
                  )}

                  {/* Concentric Platinum and Crimson Halo Glow */}
                  <div className="absolute -inset-8 rounded-full bg-gradient-to-tr from-[#E6002B] via-red-900/30 to-transparent blur-3xl opacity-70 pointer-events-none" />
                  
                  {/* High-Definition Official Shield */}
                  <div className="relative w-48 h-48 sm:w-60 sm:h-60 z-20 flex items-center justify-center filter drop-shadow-[0_0_25px_rgba(230,0,43,0.8)] hover:drop-shadow-[0_0_40px_rgba(230,0,43,1)] transition-all">
                    <img
                      src="/logo-mc-shield.png"
                      alt="Escudo Oficial Club MC Emprender Martín Careaga - Aimentando Sueños"
                      width={240}
                      height={240}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </motion.div>

                {/* Slogan Pedestal Plate - Clean, fully visible, zero collisions */}
                <div className="mt-4 px-6 py-2.5 rounded-full bg-black/90 border-2 border-white/20 backdrop-blur-xl shadow-[0_0_35px_rgba(230,0,43,0.35)] text-center z-20">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold block">
                    CLUB MC EMPRENDER
                  </span>
                  <span className="text-sm sm:text-base font-extrabold font-display text-white tracking-widest flex items-center gap-2.5 justify-center">
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#E6002B] shadow-[0_0_8px_#E6002B] shrink-0" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-300">
                      ALIMENTANDO SUEÑOS
                    </span>
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#E6002B] shadow-[0_0_8px_#E6002B] shrink-0" />
                  </span>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* VIEW MODE 3: FILM ESTADIO (VIDEO CINEMATOGRÁFICO)             */}
            {/* ------------------------------------------------------------- */}
            {showcaseMode === 'film' && (
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/25 shadow-[0_0_60px_rgba(230,0,43,0.45)] ring-4 ring-[#E6002B]/35">
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
                <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/80 pointer-events-none" />
                
                {/* Audio Button for Film */}
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  aria-label={isMuted ? 'Activar sonido del estadio' : 'Silenciar sonido del estadio'}
                  className="absolute bottom-5 right-5 p-2 rounded-full bg-black/80 border border-white/20 text-white z-30 cursor-pointer hover:bg-[#E6002B] transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>
            )}

            {/* Broadcast Live Status Pill - Positioned safely at top-left of stage, avoiding all cards & pedestals */}
            <div className="absolute -top-3.5 left-2 sm:-top-4 sm:left-2 glass rounded-full border border-white/20 bg-black/85 backdrop-blur-xl px-4 py-1.5 shadow-2xl flex items-center gap-2.5 z-30 pointer-events-auto">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00cc44] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00cc44]" />
              </span>
              <span className="text-xs font-extrabold font-display uppercase tracking-wider text-white">
                MC EMPRENDER
              </span>
              <span className="text-[#E6002B] font-bold">·</span>
              <span className="text-xs font-bold font-mono text-white">
                ALIMENTANDO SUEÑOS
              </span>
              <span className="text-neutral-500 hidden sm:inline">·</span>
              <span className="text-[11px] font-mono text-neutral-300 hidden sm:inline">
                Primer Plantel
              </span>
            </div>
          </div>

          {/* 3D Mode Selector Dock */}
          <nav
            aria-label="Selector de visualización del Hero"
            className="mt-8 sm:mt-10 flex items-center gap-2 sm:gap-3 glass rounded-full border border-white/20 px-3 sm:px-4 py-2 shadow-2xl bg-black/80 backdrop-blur-xl z-20"
          >
            <button
              type="button"
              onClick={() => {
                playUiClick();
                setShowcaseMode('players3d');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
                showcaseMode === 'players3d'
                  ? 'bg-[#E6002B] text-white shadow-[0_0_18px_rgba(230,0,43,0.7)]'
                  : 'text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-white" aria-hidden="true" />
              <span>01 Cracks 3D (Aumento)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playUiClick();
                setShowcaseMode('shield3d');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
                showcaseMode === 'shield3d'
                  ? 'bg-gradient-to-r from-[#E6002B] to-[#99001D] text-white shadow-[0_0_18px_rgba(230,0,43,0.7)]'
                  : 'text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-white" aria-hidden="true" />
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
                  ? 'bg-[#E6002B] text-white shadow-[0_0_18px_rgba(230,0,43,0.7)]'
                  : 'text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-white" aria-hidden="true" />
              <span className="hidden sm:inline">03 Film Estadio</span>
              <span className="sm:hidden">03 Film</span>
            </button>
          </nav>
        </motion.div>
      </div>
    </section>
  );
};
