import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NAV } from '../content';
import { playUiClick } from '../utils/soundEffects';

interface SiteChromeProps {
  onOpenDossier?: () => void;
}

export const SiteChrome: React.FC<SiteChromeProps> = ({ onOpenDossier }) => {
  // EFFECT-16: Sticky header reveal past 75vh
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  // EFFECT-17: Menu overlay state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // EFFECT-18: Active section tracking
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const trigger = window.innerHeight * 0.75;
      setShowStickyHeader(scrollY > trigger);

      // Section tracking
      const sections = ['home', 'squads', 'method', 'staff', 'memberships', 'faq'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll lock when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.setAttribute('data-locked', 'true');
    } else {
      document.body.removeAttribute('data-locked');
    }
  }, [isMenuOpen]);

  return (
    <>
      {/* EFFECT-16: Sticky Header that takes over past 75vh */}
      <AnimatePresence>
        {showStickyHeader && (
          <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 inset-x-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between"
          >
            {/* Wordmark */}
            <a
              href="#home"
              onClick={playUiClick}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-[#e60000] flex items-center justify-center font-display font-black text-xs text-white shadow-sm">
                MC
              </div>
              <span className="font-bold font-display text-white text-base tracking-wide group-hover:text-[#e60000] transition-colors">
                Martín Careaga
              </span>
            </a>

            {/* Desktop Navigation Links with Active Tracking */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-mono">
              {NAV.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={playUiClick}
                    className={`transition-colors py-1 relative ${
                      isActive ? 'text-[#e60000] font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#e60000]" />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Right Action: Contáctanos CTA & Burger */}
            <div className="flex items-center gap-3">
              <a
                href="#memberships"
                onClick={playUiClick}
                className="hidden sm:inline-flex px-4 py-2 rounded-full bg-[#e60000] hover:bg-[#ff1a1a] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(230,0,0,0.3)]"
              >
                Contáctanos
              </a>

              {/* Burger Menu Button */}
              <button
                onClick={() => {
                  playUiClick();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white cursor-pointer"
                aria-label="Abrir menú"
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span
                    className={`h-0.5 bg-white transition-all ${
                      isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                    }`}
                  />
                  <span
                    className={`h-0.5 bg-white transition-all ${
                      isMenuOpen ? 'opacity-0' : ''
                    }`}
                  />
                  <span
                    className={`h-0.5 bg-white transition-all ${
                      isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                    }`}
                  />
                </div>
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Top Navbar when at very top of hero (SECTION-05) */}
      {!showStickyHeader && (
        <header className="absolute top-0 inset-x-0 z-30 px-6 sm:px-12 py-6 flex items-center justify-between">
          <a href="#home" onClick={playUiClick} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e60000] flex items-center justify-center font-display font-black text-sm text-white shadow-md">
              MC
            </div>
            <span className="font-bold font-display text-white text-lg tracking-wide">
              Martín Careaga
            </span>
          </a>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono">
            {NAV.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={playUiClick}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#memberships"
              onClick={playUiClick}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-semibold transition-colors"
            >
              Contáctanos
            </a>

            <button
              onClick={() => {
                playUiClick();
                setIsMenuOpen(true);
              }}
              className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </header>
      )}

      {/* EFFECT-17: Menu Overlay (Burger Morph & Staggered Panel) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-12 overflow-y-auto"
          >
            {/* Top Bar inside Overlay */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#e60000] flex items-center justify-center font-display font-black text-sm text-white">
                  MC
                </div>
                <span className="font-bold font-display text-white text-lg">
                  Martín Careaga
                </span>
              </div>

              <button
                onClick={() => {
                  playUiClick();
                  setIsMenuOpen(false);
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Staggered Navigation Links */}
            <div className="py-12 space-y-4">
              {NAV.map((link, idx) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx, duration: 0.3 }}
                >
                  <a
                    href={`#${link.id}`}
                    onClick={() => {
                      playUiClick();
                      setIsMenuOpen(false);
                    }}
                    className="text-3xl sm:text-5xl font-black font-display text-white hover:text-[#e60000] transition-colors block py-2"
                  >
                    {link.label}
                  </a>
                </motion.div>
              ))}
            </div>

            {/* Bottom Info inside Overlay */}
            <div className="border-t border-white/10 pt-6 space-y-4">
              <p className="text-xs text-neutral-400 font-sans max-w-md leading-relaxed">
                Formación integral y acondicionamiento físico desde categorías base hasta el Primer Plantel. Prepárate para ligas regionales y nuestro camino a la BA Cup.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-500">
                <span>© {new Date().getFullYear()} Martín Careaga</span>
                {onOpenDossier && (
                  <button
                    onClick={() => {
                      playUiClick();
                      setIsMenuOpen(false);
                      onOpenDossier();
                    }}
                    className="text-[#e60000] hover:underline cursor-pointer"
                  >
                    Dossier de Arquitectura
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
