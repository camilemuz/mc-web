import React from 'react';
import { playUiClick } from '../utils/soundEffects';

interface FooterProps {
  // Clean footer props
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-[#050507] border-t border-neutral-900 py-12 px-4 sm:px-6 lg:px-8 text-xs text-neutral-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
            <img
              src="/logo-mc-shield.png"
              alt="Escudo Oficial Club MC Martín Careaga - Cumpliendo Sueños"
              width={36}
              height={36}
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(230,0,43,0.4)]"
            />
          </div>
          <div>
            <span className="font-bold text-neutral-300 block">
              Club MC Emprender & Escuela de Fútbol Martín Careaga
            </span>
            <span className="text-[10px] font-mono text-[#E6002B] font-bold tracking-wider block">
              CUMPLIENDO SUEÑOS
            </span>
            <span className="text-neutral-400">
              Complejo Social Litoral · Bajo Següencoma, La Paz
            </span>
          </div>
        </div>

        {/* Quiet Links */}
        <div className="flex flex-wrap items-center gap-6">
          <a href="#plantilla" onClick={playUiClick} className="hover:text-neutral-300 transition-colors">
            Plantilla
          </a>
          <a href="#match-center" onClick={playUiClick} className="hover:text-neutral-300 transition-colors">
            Match Center
          </a>
          <a href="#escuela" onClick={playUiClick} className="hover:text-neutral-300 transition-colors">
            Escuela Formativa
          </a>
          <a href="#tienda" onClick={playUiClick} className="hover:text-neutral-300 transition-colors">
            Tienda Oficial
          </a>
          <a href="#contacto" onClick={playUiClick} className="hover:text-neutral-300 transition-colors">
            Contacto
          </a>
        </div>

        {/* Camilnet Developer & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800">
            <img src="/logo-camilnet.png" alt="Camilnet Logo" className="h-4 w-auto object-contain" />
            <span className="text-[10px] text-neutral-400">
              Desarrollado por <strong className="text-white">Camilnet</strong>
            </span>
          </div>
          <p>© {new Date().getFullYear()} Club MC Martín Careaga.</p>
        </div>
      </div>
    </footer>
  );
};
