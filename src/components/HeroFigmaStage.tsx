import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { HERO, ASSETS } from '../content';
import { playUiClick } from '../utils/soundEffects';

interface HeroFigmaStageProps {
  onOpenStore?: () => void;
  onOpenDossier?: () => void;
}

export const HeroFigmaStage: React.FC<HeroFigmaStageProps> = ({ onOpenStore }) => {
  // EFFECT-02: matchMedia fork with mounted gate
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // EFFECT-06: still-film handover (01 / 02 pager)
  const [activeMedia, setActiveMedia] = useState<'still' | 'film'>('still');
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
    const mql = window.matchMedia('(max-width: 768px)');
    setIsMobile(mql.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Handover logic: When returning to still, write currentTime to 0 once
  const handleToggleMedia = (mode: 'still' | 'film') => {
    playUiClick();
    if (mode === 'still' && videoRef.current) {
      videoRef.current.currentTime = 0;
    }
    setActiveMedia(mode);
  };

  // EFFECT-03: hero-scroll-parallax (five spring-smoothed depth planes)
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // 5 depth planes (rates: plane 1 slowest -> plane 5 fastest)
  const rawY1 = useTransform(scrollY, [0, 800], [0, -40]);
  const rawY2 = useTransform(scrollY, [0, 800], [0, -90]);
  const rawY3 = useTransform(scrollY, [0, 800], [0, -150]);
  const rawY4 = useTransform(scrollY, [0, 800], [0, -220]);
  const rawY5 = useTransform(scrollY, [0, 800], [0, -300]);

  const springConfig = { stiffness: 180, damping: 28, mass: 0.8 };
  const plane1Y = useSpring(rawY1, springConfig);
  const plane2Y = useSpring(rawY2, springConfig);
  const plane3Y = useSpring(rawY3, springConfig);
  const plane4Y = useSpring(rawY4, springConfig);
  const plane5Y = useSpring(rawY5, springConfig);

  if (!mounted) {
    return <section className="h-svh bg-[#0a0a0a] flex items-center justify-center" />;
  }

  // EFFECT-01: One --u design-pixel scalar derived from whichever axis runs out first
  // Desktop canvas: 1440 x 810 (ar: 16/9 = 1.77777, cols: 1440)
  // Mobile canvas: 440 x 956 (ar: 440/956 = 0.46025, cols: 440)
  const stageCols = isMobile ? 440 : 1440;
  const stageAr = isMobile ? '440 / 956' : '1440 / 810';

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative h-svh w-full flex items-center justify-center overflow-hidden bg-[#0a0a0a] select-none"
      style={
        {
          '--stage-cols': stageCols,
          '--stage-ar': stageAr,
        } as React.CSSProperties
      }
    >
      <div className="stage-frame w-full h-full flex items-center justify-center">
        <div className="stage">
          {/* PLANE 1 (Deepest): Arc, Glow, and Stadium backdrop */}
          <motion.div
            style={{ y: plane1Y }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Ambient Red Glow */}
            <div
              className="absolute rounded-full blur-[120px] pointer-events-none"
              style={{
                left: `calc(720 * var(--u))`,
                top: `calc(405 * var(--u))`,
                width: isMobile ? `calc(320 * var(--u))` : `calc(680 * var(--u))`,
                height: isMobile ? `calc(320 * var(--u))` : `calc(680 * var(--u))`,
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(204, 0, 0, 0.22)',
              }}
            />

            {/* Blurred "Careaga" background flourish watermark */}
            <div
              className="absolute font-black tracking-tighter uppercase font-display pointer-events-none select-none text-center"
              style={{
                left: isMobile ? `calc(220 * var(--u))` : `calc(720 * var(--u))`,
                top: isMobile ? `calc(420 * var(--u))` : `calc(360 * var(--u))`,
                transform: 'translate(-50%, -50%)',
                fontSize: isMobile ? `calc(84 * var(--u))` : `calc(200 * var(--u))`,
                color: 'transparent',
                backgroundImage: 'linear-gradient(180deg, rgba(230,0,0,0.2) 0%, rgba(204,0,0,0.02) 100%)',
                WebkitBackgroundClip: 'text',
                filter: 'blur(2px)',
                opacity: 0.6,
                width: '100%',
              }}
            >
              Careaga
            </div>
          </motion.div>

          {/* PLANE 2: Rotating Dashed Ring & Optical Centre Media (Stadium Still / Film Video) */}
          <motion.div
            style={{ y: plane2Y }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div
              className="relative flex items-center justify-center"
              style={{
                left: isMobile ? `calc(220 * var(--u))` : `calc(860 * var(--u))`,
                top: isMobile ? `calc(480 * var(--u))` : `calc(405 * var(--u))`,
                transform: 'translate(-50%, -50%)',
                width: isMobile ? `calc(340 * var(--u))` : `calc(520 * var(--u))`,
                height: isMobile ? `calc(340 * var(--u))` : `calc(520 * var(--u))`,
              }}
            >
              {/* Outer Rotating Dashed Ring */}
              <div
                className="absolute inset-0 rounded-full border border-dashed border-[#e60000]/40 animate-spin"
                style={{ animationDuration: '45s' }}
              />

              {/* Inner Decorative Accent Ring */}
              <div
                className="absolute rounded-full border border-white/10"
                style={{
                  inset: `calc(16 * var(--u))`,
                }}
              />

              {/* EFFECT-06: Masked soft circle for still / film handover */}
              <div
                className="relative rounded-full overflow-hidden pointer-events-auto shadow-[0_0_50px_rgba(230,0,0,0.3)] border border-white/10"
                style={{
                  width: isMobile ? `calc(280 * var(--u))` : `calc(440 * var(--u))`,
                  height: isMobile ? `calc(280 * var(--u))` : `calc(440 * var(--u))`,
                }}
              >
                {/* 01: Stadium Still Render */}
                <img
                  src={ASSETS.img.stadium}
                  alt="Estadio MC"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                    activeMedia === 'still' ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  }`}
                />

                {/* 02: Looping Match Film */}
                <video
                  ref={videoRef}
                  src={ASSETS.video.film}
                  poster={ASSETS.video.poster}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                    activeMedia === 'film' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                />

                {/* Dark Vignette Overlay for Dramatic Contrast */}
                <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60 pointer-events-none" />
              </div>
            </div>
          </motion.div>

          {/* PLANE 3: Hero Headline & CTA Pill */}
          <motion.div
            style={{ y: plane3Y }}
            className="absolute inset-0 pointer-events-none"
          >
            <div
              className="absolute pointer-events-auto"
              style={{
                left: isMobile ? `calc(32 * var(--u))` : `calc(110 * var(--u))`,
                top: isMobile ? `calc(160 * var(--u))` : `calc(210 * var(--u))`,
                maxWidth: isMobile ? `calc(376 * var(--u))` : `calc(660 * var(--u))`,
              }}
            >
              {/* Masked Headline Lines */}
              <div className="space-y-0 leading-none">
                {HERO.headline.map((word, idx) => (
                  <div key={idx} className="overflow-hidden">
                    <motion.div
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1 * idx, ease: [0.16, 1, 0.3, 1] }}
                      className="font-black uppercase tracking-tight font-display"
                      style={{
                        fontSize: isMobile ? `calc(48 * var(--u))` : `calc(92 * var(--u))`,
                        ...(word === 'Táctica'
                          ? {
                              backgroundImage: 'linear-gradient(180deg, #cc0000 89.759%, rgba(204,0,0,0) 132.46%)',
                              WebkitBackgroundClip: 'text',
                              color: 'transparent',
                            }
                          : { color: '#ffffff' }),
                      }}
                    >
                      {word}
                    </motion.div>
                  </div>
                ))}
              </div>

              {/* Lede text */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                className="text-neutral-300 font-sans leading-relaxed"
                style={{
                  fontSize: isMobile ? `calc(14 * var(--u))` : `calc(17 * var(--u))`,
                  marginTop: isMobile ? `calc(18 * var(--u))` : `calc(28 * var(--u))`,
                  maxWidth: isMobile ? `calc(360 * var(--u))` : `calc(480 * var(--u))`,
                }}
              >
                {HERO.lede}
              </motion.p>

              {/* CTA Pill & Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-center gap-4"
                style={{
                  marginTop: isMobile ? `calc(22 * var(--u))` : `calc(32 * var(--u))`,
                }}
              >
                <a
                  href="#squads"
                  onClick={playUiClick}
                  className="rounded-full bg-[#e60000] hover:bg-[#ff1a1a] text-white font-mono uppercase tracking-wider font-bold transition-all shadow-[0_0_30px_rgba(230,0,0,0.5)] flex items-center justify-center gap-2 cursor-pointer"
                  style={{
                    padding: isMobile
                      ? `calc(10 * var(--u)) calc(22 * var(--u))`
                      : `calc(14 * var(--u)) calc(30 * var(--u))`,
                    fontSize: isMobile ? `calc(12 * var(--u))` : `calc(14 * var(--u))`,
                  }}
                >
                  <span>{HERO.cta}</span>
                  <svg
                    style={{
                      width: isMobile ? `calc(14 * var(--u))` : `calc(16 * var(--u))`,
                      height: isMobile ? `calc(14 * var(--u))` : `calc(16 * var(--u))`,
                    }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>

                {/* Badge Lockup */}
                <div
                  className="border-l border-white/20 flex flex-col justify-center text-neutral-400 font-mono leading-tight"
                  style={{
                    paddingLeft: `calc(12 * var(--u))`,
                    fontSize: isMobile ? `calc(10 * var(--u))` : `calc(11 * var(--u))`,
                  }}
                >
                  <span className="text-[#e60000] font-bold">{HERO.badge[0]}</span>
                  <span>{HERO.badge[1]} {HERO.badge[2]}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* PLANE 4: Hero Cards (Learners strip, Stats gauge, Tactical insights) */}
          <motion.div
            style={{ y: plane4Y }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Learners Card */}
            <div
              className="absolute glass rounded-2xl border border-white/10 backdrop-blur-md flex items-center pointer-events-auto shadow-xl"
              style={{
                left: isMobile ? `calc(24 * var(--u))` : `calc(110 * var(--u))`,
                bottom: isMobile ? `calc(140 * var(--u))` : `calc(75 * var(--u))`,
                padding: isMobile ? `calc(10 * var(--u)) calc(14 * var(--u))` : `calc(12 * var(--u)) calc(20 * var(--u))`,
                gap: `calc(12 * var(--u))`,
              }}
            >
              <div className="flex -space-x-2">
                {ASSETS.img.avatars.slice(0, 3).map((av, idx) => (
                  <img
                    key={idx}
                    src={av}
                    alt="Player"
                    className="rounded-full border border-black object-cover"
                    style={{
                      width: isMobile ? `calc(26 * var(--u))` : `calc(32 * var(--u))`,
                      height: isMobile ? `calc(26 * var(--u))` : `calc(32 * var(--u))`,
                    }}
                  />
                ))}
              </div>
              <div>
                <span
                  className="font-black font-display text-white block leading-none"
                  style={{ fontSize: isMobile ? `calc(18 * var(--u))` : `calc(22 * var(--u))` }}
                >
                  {HERO.learners.value}
                </span>
                <span
                  className="text-neutral-400 font-mono uppercase"
                  style={{ fontSize: isMobile ? `calc(9 * var(--u))` : `calc(10 * var(--u))` }}
                >
                  {HERO.learners.label}
                </span>
              </div>
            </div>

            {/* Tactical Insight Card (Desktop & Mobile) */}
            {!isMobile && (
              <div
                className="absolute glass rounded-2xl border border-white/10 backdrop-blur-md p-4 pointer-events-auto shadow-xl flex items-center gap-3"
                style={{
                  right: `calc(90 * var(--u))`,
                  top: `calc(220 * var(--u))`,
                  padding: `calc(12 * var(--u)) calc(18 * var(--u))`,
                  gap: `calc(14 * var(--u))`,
                }}
              >
                <div
                  className="rounded-xl overflow-hidden border border-white/10 shrink-0"
                  style={{
                    width: `calc(44 * var(--u))`,
                    height: `calc(44 * var(--u))`,
                  }}
                >
                  <img src={ASSETS.img.tacticalThumb} alt="Tactical" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#e60000] block">
                    {HERO.insight.kicker}
                  </span>
                  <span className="font-bold font-display text-white text-base">
                    {HERO.insight.title}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00cc44]" />
                    <span className="text-[10px] font-mono text-neutral-400">{HERO.avgScore.value} {HERO.avgScore.label}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Gauge Tile (Right side bottom) */}
            {!isMobile && (
              <div
                className="absolute glass rounded-2xl border border-white/10 backdrop-blur-md p-4 pointer-events-auto shadow-xl"
                style={{
                  right: `calc(90 * var(--u))`,
                  bottom: `calc(85 * var(--u))`,
                  padding: `calc(14 * var(--u)) calc(20 * var(--u))`,
                }}
              >
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-black font-display text-white">
                    {HERO.sessions.value}
                  </span>
                  <span className="text-xs font-mono text-neutral-400 uppercase">
                    {HERO.sessions.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 pt-2 border-t border-white/10 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#e60000] font-bold">{HERO.dataPoints.value}</span>
                    <span className="text-neutral-400">{HERO.dataPoints.label}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* PLANE 5: Signature 01 / 02 Pager & Sound Toggle Control */}
          <motion.div
            style={{ y: plane5Y }}
            className="absolute inset-0 pointer-events-none"
          >
            <div
              className="absolute pointer-events-auto flex items-center gap-3 glass rounded-full border border-white/15 px-3 py-1.5 shadow-2xl backdrop-blur-lg"
              style={{
                left: isMobile ? `calc(220 * var(--u))` : `calc(860 * var(--u))`,
                bottom: isMobile ? `calc(60 * var(--u))` : `calc(60 * var(--u))`,
                transform: 'translateX(-50%)',
              }}
            >
              {/* 01: Stadium Still Button */}
              <button
                onClick={() => handleToggleMedia('still')}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  activeMedia === 'still'
                    ? 'bg-[#e60000] text-white font-bold shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                01 Estático
              </button>

              <span className="text-neutral-600 font-mono text-xs">——</span>

              {/* 02: Match Film Button */}
              <button
                onClick={() => handleToggleMedia('film')}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  activeMedia === 'film'
                    ? 'bg-[#e60000] text-white font-bold shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                02 Film Match
              </button>

              {/* Sound Toggle (only active in film mode) */}
              {activeMedia === 'film' && (
                <button
                  onClick={() => {
                    playUiClick();
                    setIsMuted(!isMuted);
                  }}
                  className="ml-1 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title={isMuted ? 'Activar sonido' : 'Silenciar'}
                >
                  {isMuted ? (
                    <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 text-[#00cc44]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
