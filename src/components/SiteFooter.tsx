import React, { useState } from 'react';
import { FOOTER_COLUMNS } from '../content';
import { playUiClick } from '../utils/soundEffects';
import { Magnetic } from './Magnetic';

interface SiteFooterProps {}

export const SiteFooter: React.FC<SiteFooterProps> = () => {
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
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <img
                  src="/logo-mc-shield.png"
                  alt="Escudo Oficial Club MC Martín Careaga - Cumpliendo Sueños"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(230,0,43,0.5)]"
                />
              </div>
              <div>
                <span className="font-bold font-display text-xl text-white tracking-wide block">
                  MARTÍN CAREAGA (MC)
                </span>
                <span className="text-xs font-mono text-[#E6002B] font-bold uppercase tracking-wider block">
                  CUMPLIENDO SUEÑOS
                </span>
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                  Club MC Emprender & Escuela de Fútbol Formativa
                </span>
                <a
                  href="https://www.google.com/maps/place/Club+Social+y+Deportivo+Litoral/@-16.5398691,-68.100557,18z/data=!4m6!3m5!1s0x915f20d982f7e719:0x9caa6c5f5a817b92!8m2!3d-16.5405556!4d-68.1008333!16s%2Fg%2F1tdygpvq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono text-[#E6002B] hover:underline flex items-center gap-1 mt-0.5"
                >
                  <span>📍 Complejo Deportivo Social Litoral · Bajo Següencoma</span>
                </a>
              </div>
            </div>

            <p className="text-neutral-400 text-sm max-w-md font-sans">
              Formación deportiva de alto impacto desde categorías base hasta el Primer Plantel. Horarios: Sub 7-13 (15:00 a 16:30) y Sub 15-19 (16:30 a 18:00).
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

        {/* Bottom Bar: Copyright & Camilnet Developer Credit */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-neutral-400">
          <div>
            © {new Date().getFullYear()} Club MC Emprender Martín Careaga. Todos los derechos reservados.
          </div>

          {/* Developer Credit with Camilnet Logo */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-cyan-500/40 transition-colors shadow-inner">
            <img
              src="/logo-camilnet.png"
              alt="Camilnet Software Developer Logo"
              className="h-6 w-auto object-contain filter drop-shadow-[0_0_6px_rgba(0,180,216,0.3)]"
            />
            <div className="text-[11px] font-sans">
              Desarrollado por <span className="font-bold text-white tracking-wide">Camilnet</span>{' '}
              <span className="text-cyan-400 font-mono text-[10px] font-bold">SOFTWARE DEVELOPER</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="#squads" className="hover:text-white transition-colors">Aviso Legal</a>
            <a href="#faq" className="hover:text-white transition-colors">Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
