import React from 'react';
import { playUiClick } from '../utils/soundEffects';

interface FooterProps {
  onOpenDossier: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDossier }) => {
  return (
    <footer className="bg-[#050507] border-t border-neutral-900 py-12 px-4 sm:px-6 lg:px-8 text-xs text-neutral-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-[#E6002B] flex items-center justify-center font-display font-black text-xs text-white">
            MC
          </div>
          <div>
            <span className="font-bold text-neutral-300 block">
              Club Atlético MC & Escuela de Fútbol Martín Careaga
            </span>
            <span>Institución Deportiva Oficial · Afiliada a la Liga Pro</span>
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
          <button
            onClick={() => {
              playUiClick();
              onOpenDossier();
            }}
            className="text-[#E6002B] hover:underline cursor-pointer"
          >
            Dossier Arquitectura
          </button>
        </div>

        {/* Copyright */}
        <div className="text-right">
          <p>© {new Date().getFullYear()} Club MC Martín Careaga. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
