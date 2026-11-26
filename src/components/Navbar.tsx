import React, { useState, useEffect } from 'react';
import { ShoppingBag, Volume2, VolumeX, Menu, X, Sun, Moon, Lock } from 'lucide-react';
import { playUiClick, isSoundEnabled, setSoundEnabled } from '../utils/soundEffects';
import { useTheme } from '../utils/ThemeContext';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
}

const NAV_LINKS = [
  { label: 'Quiénes Somos', href: '#quienes-somos', id: 'quienes-somos' },
  { label: 'Plantel', href: '#plantilla', id: 'plantilla' },
  { label: 'Escuela MC', href: '#escuela', id: 'escuela' },
  { label: 'Match Center', href: '#match-center', id: 'match-center' },
  { label: 'Tienda 3D', href: '#tienda', id: 'tienda' },
  { label: 'Contacto', href: '#contacto', id: 'contacto' },
];

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenAdmin,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      let current = '';
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            current = link.id;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const toggleSound = () => {
    const newState = !soundOn;
    setSoundOn(newState);
    setSoundEnabled(newState);
    if (newState) playUiClick();
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/92 dark:bg-[#060608]/92 backdrop-blur-md border-b border-slate-200 dark:border-neutral-800/80 shadow-xs dark:shadow-none transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand Wordmark with Official Shield */}
        <a
          href="#home"
          onClick={playUiClick}
          aria-label="Página de inicio - Club MC Martín Careaga, Cumpliendo Sueños"
          className="flex items-center gap-3 text-lg font-black font-display tracking-wider text-slate-900 dark:text-white whitespace-nowrap shrink-0 group"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
            <img
              src="/logo-mc-shield.png"
              alt="Escudo Oficial Club MC Martín Careaga - Cumpliendo Sueños"
              width={40}
              height={40}
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(230,0,43,0.35)] group-hover:scale-105 transition-transform"
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

        {/* Zone 2: Navigation links with active tracking */}
        <nav
          aria-label="Navegación principal"
          className="hidden lg:flex items-center gap-5 xl:gap-6 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-neutral-400"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={playUiClick}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6002B] rounded ${
                  isActive
                    ? 'text-slate-950 dark:text-white font-bold'
                    : 'hover:text-[#E6002B]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#E6002B]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Action Area */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Light / Dark Theme Switcher */}
          <button
            type="button"
            onClick={() => {
              playUiClick();
              toggleTheme();
            }}
            aria-label={theme === 'dark' ? 'Cambiar a Versión Clara' : 'Cambiar a Versión Oscura'}
            className="px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap shrink-0 bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6002B]"
            title={theme === 'dark' ? 'Cambiar a Versión Clara' : 'Cambiar a Versión Oscura'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                <span className="hidden sm:inline font-mono text-[11px]">Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" aria-hidden="true" />
                <span className="hidden sm:inline font-mono text-[11px]">Oscuro</span>
              </>
            )}
          </button>

          {/* Login / Admin Trigger Button */}
          <button
            type="button"
            onClick={() => {
              playUiClick();
              onOpenAdmin();
            }}
            aria-label="Iniciar Sesión de Administrador"
            className="px-2.5 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-900/90 dark:hover:bg-neutral-800 border border-slate-300 dark:border-neutral-700 hover:border-[#E6002B] rounded-lg text-slate-800 dark:text-neutral-200 hover:text-slate-950 dark:hover:text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6002B]"
            title="Panel Administrador"
          >
            <Lock className="w-3.5 h-3.5 text-[#E6002B]" aria-hidden="true" />
            <span className="hidden sm:inline font-sans">Admin</span>
          </button>

          {/* Audio FX Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundOn ? 'Desactivar efectos de sonido' : 'Activar efectos de sonido'}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-100 dark:bg-neutral-900/80 border border-slate-300 dark:border-neutral-800 hover:border-slate-400 dark:hover:border-neutral-700 flex items-center justify-center text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6002B]"
            title={soundOn ? 'Sonido activado' : 'Sonido silenciado'}
          >
            {soundOn ? (
              <Volume2 className="w-4 h-4 text-[#E6002B]" aria-hidden="true" />
            ) : (
              <VolumeX className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            type="button"
            onClick={() => {
              playUiClick();
              onOpenCart();
            }}
            aria-label={`Abrir carrito de compras (${cartCount} productos)`}
            className="relative px-3 sm:px-3.5 py-1.5 sm:py-2 bg-slate-900 hover:bg-slate-800 dark:bg-neutral-900/90 dark:hover:bg-neutral-800 border border-slate-900 dark:border-neutral-700 rounded-lg text-white font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6002B]"
            title="Abrir Carrito"
          >
            <ShoppingBag className="w-4 h-4 text-[#E6002B]" aria-hidden="true" />
            <span className="hidden sm:inline font-bold">Carrito</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#E6002B] text-white text-[10px] font-black font-mono-numbers flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => {
              playUiClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden w-9 h-9 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-800 flex items-center justify-center text-slate-700 dark:text-neutral-300 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6002B]"
            title="Menú"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-neutral-800 bg-white/98 dark:bg-[#060608]/95 backdrop-blur-xl px-4 py-4 space-y-2 shadow-lg">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={() => {
                  playUiClick();
                  setMobileMenuOpen(false);
                }}
                className={`block text-sm font-semibold uppercase tracking-wider py-2 px-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-[#E6002B] bg-slate-100 dark:bg-white/5'
                    : 'text-slate-700 dark:text-neutral-300 hover:text-[#E6002B] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href="#calendario"
            onClick={() => {
              playUiClick();
              setMobileMenuOpen(false);
            }}
            className="block text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-neutral-300 hover:text-[#E6002B] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 py-2 px-2 rounded-lg"
          >
            Calendario
          </a>
          <div className="border-t border-slate-200 dark:border-neutral-800/80 mt-2 pt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                playUiClick();
                toggleTheme();
              }}
              className="flex-1 text-left text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-neutral-200 py-2 px-3 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex items-center gap-2 cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Cambiar a Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span>Cambiar a Oscuro</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                playUiClick();
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex-1 text-left text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-neutral-200 py-2 px-3 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex items-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-[#E6002B]" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
