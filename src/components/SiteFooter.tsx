import React, { useState, useEffect } from 'react';
import { FOOTER_COLUMNS } from '../content';
import { useSiteContent } from '../utils/ContentContext';
import { playUiClick } from '../utils/soundEffects';
import { Magnetic } from './Magnetic';
import { X } from 'lucide-react';

interface SiteFooterProps {}

export const SiteFooter: React.FC<SiteFooterProps> = () => {
  const { content } = useSiteContent();
  const clubInfo = content.clubInfo;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'subscribed' | 'duplicate'>('idle');
  const [legalModal, setLegalModal] = useState<'legal' | 'privacy' | null>(null);

  useEffect(() => {
    if (!legalModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLegalModal(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [legalModal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = email.trim().toLowerCase();
    if (!cleaned) return;
    playUiClick();

    try {
      const existing: string[] = JSON.parse(localStorage.getItem('mc_newsletter_emails') || '[]');
      if (existing.includes(cleaned)) {
        setStatus('duplicate');
      } else {
        localStorage.setItem('mc_newsletter_emails', JSON.stringify([...existing, cleaned]));
        setStatus('subscribed');
      }
    } catch {
      setStatus('subscribed');
    }

    setEmail('');
    setTimeout(() => {
      setStatus('idle');
    }, 4000);
  };

  return (
    <footer className="relative bg-white dark:bg-[#050507] border-t border-slate-200 dark:border-white/10 pt-20 pb-12 px-4 sm:px-6 lg:px-8 text-slate-600 dark:text-neutral-400 overflow-hidden transition-colors">
      {/* Background radial glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#E6002B]/5 dark:bg-[#e60000]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-slate-200 dark:border-white/10">
          {/* Brand Lockup & Newsletter Form */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <img
                  src="/logo-mc-shield.png"
                  alt="Escudo Oficial Club MC Martín Careaga - Cumpliendo Sueños"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(230,0,43,0.35)]"
                />
              </div>
              <div>
                <span className="font-bold font-display text-xl text-slate-900 dark:text-white tracking-wide block">
                  MARTÍN CAREAGA (MC)
                </span>
                <span className="text-xs font-mono text-[#E6002B] font-bold uppercase tracking-wider block">
                  {clubInfo.slogan}
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-neutral-400 uppercase tracking-wider block">
                  {clubInfo.clubName}
                </span>
                <a
                  href={clubInfo.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playUiClick}
                  className="text-[11px] font-mono text-[#E6002B] hover:underline flex items-center gap-1 mt-0.5"
                >
                  <span>{clubInfo.complexName} · {clubInfo.zone}</span>
                </a>
              </div>
            </div>

            <p className="text-slate-600 dark:text-neutral-400 text-sm max-w-md font-sans">
              Formación deportiva integral desde categorías base hasta el Primer Plantel. Horarios: {clubInfo.scheduleGroup1} y {clubInfo.scheduleGroup2}.
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
                  className="flex-1 bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-[#E6002B] transition-colors"
                />
                <Magnetic strength={0.15}>
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer shadow-[0_6px_15px_rgba(230,0,43,0.25)]"
                  >
                    {status === 'subscribed' ? '¡Suscrito!' : 'Únete a MC'}
                  </button>
                </Magnetic>
              </div>
              <p className={`text-[11px] font-mono ${status === 'subscribed' ? 'text-emerald-600 dark:text-emerald-400' : status === 'duplicate' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-neutral-500'}`}>
                {status === 'subscribed'
                  ? '¡Gracias por suscribirte al boletín oficial del Club MC!'
                  : status === 'duplicate'
                  ? 'Este correo ya está registrado en nuestro boletín oficial.'
                  : 'Un correo al mes con novedades del club, convocatorias y fixture.'}
              </p>
            </form>
          </div>

          {/* Three Link Columns */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {FOOTER_COLUMNS.map((col, idx) => (
              <div key={idx} className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-slate-900 dark:text-white font-bold">
                  {col.title}
                </h4>
                <ul className="space-y-2.5 text-xs font-sans">
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a
                        href={link.href}
                        onClick={playUiClick}
                        className="text-slate-600 dark:text-neutral-400 hover:text-[#E6002B] dark:hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Camilnet Developer Credit */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-slate-500 dark:text-neutral-400">
          <div>
            © {new Date().getFullYear()} Club MC Emprender Martín Careaga. Todos los derechos reservados.
          </div>

          {/* Developer Credit with Camilnet Logo */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 hover:border-cyan-500/40 transition-colors">
            <img
              src="/logo-camilnet.png"
              alt="Camilnet Software Developer Logo"
              className="h-6 w-auto object-contain"
            />
            <div className="text-[11px] font-sans text-slate-600 dark:text-neutral-300">
              Desarrollado por <span className="font-bold text-slate-900 dark:text-white tracking-wide">Camilnet</span>{' '}
              <span className="text-cyan-700 dark:text-cyan-400 font-mono text-[10px] font-bold">SOFTWARE DEVELOPER</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => {
                playUiClick();
                setLegalModal('legal');
              }}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Aviso Legal
            </button>
            <button
              type="button"
              onClick={() => {
                playUiClick();
                setLegalModal('privacy');
              }}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Privacidad
            </button>
          </div>
        </div>
      </div>

      {/* Legal / Privacy Info Modal */}
      {legalModal && (
        <div
          onClick={() => setLegalModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white dark:bg-[#0E0E12] border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4"
          >
            <button
              type="button"
              onClick={() => setLegalModal(null)}
              aria-label="Cerrar ventana"
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 flex items-center justify-center text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              {legalModal === 'legal' ? 'Aviso Legal · Club MC Martín Careaga' : 'Política de Privacidad'}
            </h3>
            {legalModal === 'legal' ? (
              <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed font-sans">
                Este sitio web pertenece a {clubInfo.clubName} con sede en {clubInfo.address}. Todos los escudos, fotografías, programas deportivos e indumentaria oficial mostrados son propiedad institucional del Club MC.
              </p>
            ) : (
              <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed font-sans">
                Los datos proporcionados en los formularios de inscripción, pruebas deportivas y contacto directo se utilizan exclusivamente para coordinar horarios, pruebas de admisión y comunicaciones oficiales con padres, tutores y deportistas. Para consultas escribe a {clubInfo.email}.
              </p>
            )}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="px-4 py-2 rounded-lg bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-bold cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
