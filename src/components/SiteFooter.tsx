import React, { useState } from 'react';
import { FOOTER_COLUMNS } from '../content';
import { playUiClick } from '../utils/soundEffects';
import { Magnetic } from './Magnetic';

interface SiteFooterProps {
  onOpenDossier?: () => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ onOpenDossier }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'subscribed'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    playUiClick();
    setStatus('subscribed');
    setTimeout(() => {
      setEmail('');
    }, 2000);
  };

  return (
    <footer className="relative bg-[#050507] border-t border-white/10 pt-20 pb-12 px-4 sm:px-6 lg:px-8 text-neutral-400 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#e60000]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Lockup & Newsletter Form */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e60000] flex items-center justify-center font-display font-black text-lg text-white shadow-[0_0_15px_rgba(230,0,0,0.5)]">
                MC
              </div>
              <div>
                <span className="font-bold font-display text-xl text-white tracking-wide block">
                  MARTÍN CAREAGA (MC)
                </span>
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                  Club Atlético & Centro de Formación Integral
                </span>
              </div>
            </div>

            <p className="text-neutral-400 text-sm max-w-md font-sans">
              Formación deportiva de alto impacto desde categorías base hasta el Primer Plantel. Proyecto competitivo FBF y BA Cup.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubmit} className="max-w-md space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@dominio.com"
                  required
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#e60000] transition-colors"
                />
                <Magnetic strength={0.15}>
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-[#e60000] hover:bg-[#ff1a1a] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer shadow-[0_0_15px_rgba(230,0,0,0.3)]"
                  >
                    {status === 'subscribed' ? '¡Suscrito!' : 'Únete a MC'}
                  </button>
                </Magnetic>
              </div>
              <p className="text-[11px] font-mono text-neutral-500">
                {status === 'subscribed'
                  ? '¡Gracias por suscribirte al boletín oficial!'
                  : 'Un correo al mes con novedades del club, convocatorias y fixture.'}
              </p>
            </form>
          </div>

          {/* Three Link Columns */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {FOOTER_COLUMNS.map((col, idx) => (
              <div key={idx} className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
                  {col.title}
                </h4>
                <ul className="space-y-2.5 text-xs font-sans">
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a
                        href="#squads"
                        onClick={playUiClick}
                        className="text-neutral-400 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <div>
            © {new Date().getFullYear()} Club Atlético Martín Careaga. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-6">
            <a href="#squads" className="hover:text-white transition-colors">Aviso Legal</a>
            <a href="#faq" className="hover:text-white transition-colors">Privacidad</a>
            {onOpenDossier && (
              <button
                onClick={() => {
                  playUiClick();
                  onOpenDossier();
                }}
                className="text-[#e60000] hover:underline cursor-pointer"
              >
                Dossier Técnico
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
