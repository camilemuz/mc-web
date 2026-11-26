import React, { useState } from 'react';
import { ShoppingBag, Volume2, VolumeX, Menu, X, Settings, Sun, Moon, Lock } from 'lucide-react';
import { playUiClick, isSoundEnabled, setSoundEnabled } from '../utils/soundEffects';
import { useTheme } from '../utils/ThemeContext';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
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
    { label: 'Contacto', href: '#contacto' },
  ];

  return (
    <header className="theme-header fixed top-0 inset-x-0 z-40 bg-[#060608]/90 backdrop-blur-md border-b border-neutral-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark with Official Shield & Slogan */}
        <a
          href="#"
          onClick={playUiClick}
          aria-label="Página de inicio - Club MC Martín Careaga, Cumpliendo Sueños"
          className="flex items-center gap-3 text-lg font-black font-display tracking-wider text-white dark:text-white html-light:text-neutral-900 whitespace-nowrap shrink-0 group"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
            <img
              src="/logo-mc-shield.png"
              alt="Escudo Oficial Club MC Martín Careaga - Cumpliendo Sueños"
              width={40}
              height={40}
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(230,0,43,0.5)] group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="flex flex-col">
            <span className="group-hover:text-[#E6002B] transition-colors font-black tracking-wide leading-tight">
              MARTÍN CAREAGA
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#E6002B] uppercase font-bold leading-none">
              CUMPLIENDO SUEÑOS
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation links */}
        <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={playUiClick}
              className="hover:text-[#E6002B] transition-colors whitespace-nowrap shrink-0 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6002B] rounded"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Action Area */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Day / Night Theme Switcher */}
          <button
            onClick={() => {
              playUiClick();
              toggleTheme();
            }}
            aria-label={theme === 'dark' ? 'Cambiar a Modo Día' : 'Cambiar a Modo Noche'}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6002B] ${
              theme === 'light'
                ? 'bg-emerald-50 text-emerald-950 border-emerald-300 hover:bg-emerald-100'
                : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-neutral-500 hover:text-white'
            }`}
            title={theme === 'dark' ? 'Cambiar a Modo Día' : 'Cambiar a Modo Noche'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" aria-hidden="true" />
                <span className="hidden sm:inline font-mono text-[11px]">Día</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-700" aria-hidden="true" />
                <span className="hidden sm:inline font-mono text-[11px] text-emerald-900">Noche</span>
              </>
            )}
          </button>

          {/* Login / Admin Trigger Button */}
          <button
            onClick={() => {
              playUiClick();
              onOpenAdmin();
            }}
            aria-label="Iniciar Sesión de Administrador"
            className="px-2.5 sm:px-3 py-1.5 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 hover:border-[#E6002B] rounded-lg text-neutral-200 hover:text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6002B]"
            title="Iniciar Sesión de Administrador"
          >
            <Lock className="w-3.5 h-3.5 text-[#E6002B]" aria-hidden="true" />
            <span className="hidden sm:inline font-sans">Iniciar Sesión</span>
          </button>

          {/* Audio FX Toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundOn ? 'Desactivar efectos de sonido' : 'Activar efectos de sonido'}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6002B]"
            title={soundOn ? 'Sonido activado' : 'Sonido silenciado'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-[#E6002B]" aria-hidden="true" /> : <VolumeX className="w-4 h-4" aria-hidden="true" />}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={() => {
              playUiClick();
              onOpenCart();
            }}
            aria-label={`Abrir carrito de compras (${cartCount} productos)`}
            className="relative px-3 sm:px-3.5 py-1.5 sm:py-2 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 rounded-lg text-white font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6002B]"
            title="Abrir Carrito"
          >
            <ShoppingBag className="w-4 h-4 text-[#E6002B]" aria-hidden="true" />
            <span className="hidden sm:inline font-bold">Carrito</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#E6002B] text-white text-[10px] font-black font-mono-numbers flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6002B]"
            title="Menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-[#060608]/95 backdrop-blur-xl px-4 py-4 space-y-3">
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
            className="w-full text-left text-sm font-semibold uppercase tracking-wider text-neutral-200 hover:text-white py-2 flex items-center gap-2 cursor-pointer border-t border-neutral-800/80 pt-3"
          >
            <Lock className="w-4 h-4 text-[#E6002B]" />
            <span>Iniciar Sesión (Admin)</span>
          </button>
        </div>
      )}
    </header>
  );
};
