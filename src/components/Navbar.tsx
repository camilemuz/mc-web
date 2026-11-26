import React, { useState } from 'react';
import { ShoppingBag, Volume2, VolumeX, Menu, X, Sparkles, Settings, Sun, Moon } from 'lucide-react';
import { playUiClick, isSoundEnabled, setSoundEnabled } from '../utils/soundEffects';
import { useTheme } from '../utils/ThemeContext';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenDossier: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenDossier,
  onOpenAdmin
}) => {
  const { theme, toggleTheme } = useTheme();
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const newState = !soundOn;
    setSoundOn(newState);
    setSoundEnabled(newState);
    if (newState) playUiClick();
  };

  const navLinks = [
    { label: 'Plantel', href: '#plantilla' },
    { label: 'Match Center', href: '#match-center' },
    { label: 'Escuela MC', href: '#escuela' },
    { label: 'Tienda 3D', href: '#tienda' },
    { label: 'Calendario', href: '#calendario' },
  ];

  return (
    <header className="theme-header fixed top-0 inset-x-0 z-40 bg-[#060608]/90 backdrop-blur-md border-b border-neutral-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single Element Brand Wordmark */}
        <a
          href="#"
          onClick={playUiClick}
          className="flex items-center gap-3 text-lg font-black font-display tracking-wider text-white dark:text-white html-light:text-neutral-900 whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#E6002B] group-hover:bg-[#FF1A40] flex items-center justify-center font-display font-black text-sm text-white shadow-md shadow-[#E6002B]/20 transition-colors">
            MC
          </div>
          <span className="group-hover:text-[#E6002B] transition-colors font-black tracking-wide">
            MARTÍN CAREAGA
          </span>
        </a>

        {/* Zone 2: 4-5 Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={playUiClick}
              className="hover:text-[#E6002B] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              playUiClick();
              onOpenDossier();
            }}
            className="text-[#E6002B] hover:text-[#FF1A40] transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1 cursor-pointer font-bold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dossier</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Area */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Day / Night Theme Switcher (Campo de Entrenamiento vs. Estadio Noche) */}
          <button
            onClick={() => {
              playUiClick();
              toggleTheme();
            }}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              theme === 'light'
                ? 'bg-emerald-50 text-emerald-950 border-emerald-300 hover:bg-emerald-100'
                : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-neutral-500 hover:text-white'
            }`}
            title={theme === 'dark' ? 'Cambiar a Modo Día (Campo de Entrenamiento)' : 'Cambiar a Modo Noche (Estadio Nocturno)'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="hidden sm:inline font-mono text-[11px]">Día</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-700" />
                <span className="hidden sm:inline font-mono text-[11px] text-emerald-900">Noche</span>
              </>
            )}
          </button>

          {/* Admin & Marketing CMS Trigger Button */}
          <button
            onClick={() => {
              playUiClick();
              onOpenAdmin();
            }}
            className="px-2.5 sm:px-3 py-1.5 bg-[#E6002B]/10 hover:bg-[#E6002B]/20 border border-[#E6002B]/40 hover:border-[#E6002B] rounded-lg text-neutral-200 hover:text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Abrir Panel de Administración y Marketing"
          >
            <Settings className="w-3.5 h-3.5 text-[#E6002B]" />
            <span className="hidden md:inline">Admin CMS</span>
          </button>

          {/* Audio FX Toggle */}
          <button
            onClick={toggleSound}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title={soundOn ? 'Sonido activado (clic para silenciar)' : 'Sonido silenciado'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-[#E6002B]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={() => {
              playUiClick();
              onOpenCart();
            }}
            className="relative px-3 sm:px-3.5 py-1.5 sm:py-2 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 rounded-lg text-white font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            title="Abrir Carrito"
          >
            <ShoppingBag className="w-4 h-4 text-[#E6002B]" />
            <span className="hidden sm:inline">Carrito</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#E6002B] text-white text-[10px] font-bold flex items-center justify-center font-mono-numbers shadow-sm shadow-[#E6002B]/40">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0C] border-b border-neutral-800 px-6 py-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <span className="text-xs uppercase text-neutral-400 font-bold">Modo de Visualización:</span>
            <button
              onClick={() => {
                playUiClick();
                toggleTheme();
              }}
              className="flex items-center gap-1.5 px-3 py-1 bg-neutral-800 rounded-lg text-xs font-semibold text-neutral-200"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
              <span>{theme === 'dark' ? 'Activar Modo Día (Cancha)' : 'Activar Modo Noche (Estadio)'}</span>
            </button>
          </div>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => {
                playUiClick();
                setMobileMenuOpen(false);
              }}
              className="block text-sm font-semibold uppercase tracking-wider text-neutral-300 hover:text-white py-1"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              playUiClick();
              setMobileMenuOpen(false);
              onOpenAdmin();
            }}
            className="w-full text-left text-sm font-semibold uppercase tracking-wider text-emerald-400 py-1 flex items-center gap-2 cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>Panel de Admin & Marketing CMS</span>
          </button>
          <button
            onClick={() => {
              playUiClick();
              setMobileMenuOpen(false);
              onOpenDossier();
            }}
            className="w-full text-left text-sm font-semibold uppercase tracking-wider text-[#E6002B] py-1 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ver Dossier Técnico & Arquitectura</span>
          </button>
        </div>
      )}
    </header>
  );
};
