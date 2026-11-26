import React, { useState } from 'react';
import { MVP_POLL_DATA } from '../data/mockData';
import { playUiClick, playGoalCheer } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Vote, Award, Shield, User, Download, Check, Sparkles, CreditCard } from 'lucide-react';

export const FanZoneSection: React.FC = () => {
  const [poll, setPoll] = useState<typeof MVP_POLL_DATA>(() => {
    try {
      const saved = localStorage.getItem('mc_mvp_poll_data_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return MVP_POLL_DATA;
  });
  const [userVoted, setUserVoted] = useState<string | null>(() => {
    try {
      return localStorage.getItem('mc_mvp_poll_voted_v1');
    } catch {
      return null;
    }
  });

  // Digital Member Card Generator State
  const [memberName, setMemberName] = useState('MARTÍN CAREAGA');
  const [memberId] = useState('MC-08429');
  const [memberType, setMemberType] = useState<'socio-pro' | 'socio-escuela' | 'socio-vitalicio'>('socio-pro');
  const [cardGenerated, setCardGenerated] = useState(false);

  const handleVote = (optionId: string) => {
    if (userVoted) return;
    playGoalCheer();
    setUserVoted(optionId);
    setPoll((prev: typeof MVP_POLL_DATA) => {
      const updatedOptions = prev.options.map((opt) =>
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      );
      const nextPoll = {
        ...prev,
        totalVotes: prev.totalVotes + 1,
        options: updatedOptions
      };
      try {
        localStorage.setItem('mc_mvp_poll_data_v1', JSON.stringify(nextPoll));
        localStorage.setItem('mc_mvp_poll_voted_v1', optionId);
      } catch {
        // ignore
      }
      return nextPoll;
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#E6002B', '#FFFFFF', '#000000']
      });
    } catch {
      // Fallback
    }
  };

  const handleDownloadCard = () => {
    playUiClick();
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 625;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Metallic obsidian card background
        const bgGrad = ctx.createLinearGradient(0, 0, 1000, 625);
        bgGrad.addColorStop(0, '#18181F');
        bgGrad.addColorStop(0.5, '#0E0E12');
        bgGrad.addColorStop(1, '#070709');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 1000, 625);

        // Subtle red glow top right
        const glow = ctx.createRadialGradient(860, 110, 10, 860, 110, 320);
        glow.addColorStop(0, 'rgba(230, 0, 43, 0.35)');
        glow.addColorStop(1, 'rgba(230, 0, 43, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, 1000, 625);

        // Border frame
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, 960, 585);

        // Top red bar accent
        ctx.fillStyle = '#E6002B';
        ctx.fillRect(60, 60, 76, 76);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 34px sans-serif';
        ctx.fillText('MC', 73, 110);

        // Club Name
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '800 28px sans-serif';
        ctx.fillText('CLUB MARTÍN CAREAGA', 156, 94);
        ctx.fillStyle = '#A3A3A3';
        ctx.font = '600 16px monospace';
        ctx.fillText('CREDENCIAL OFICIAL DE SOCIO · CUMPLIENDO SUEÑOS', 156, 124);

        // Membership Tier
        const tierLabel =
          memberType === 'socio-pro'
            ? 'SOCIO ACTIVO PRIMER PLANTEL'
            : memberType === 'socio-escuela'
            ? 'FAMILIA ESCUELA MARTÍN CAREAGA'
            : 'SOCIO VITALICIO HONORARIO';
        ctx.fillStyle = '#E6002B';
        ctx.font = '700 18px monospace';
        ctx.fillText(tierLabel, 60, 285);

        // Member Name
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 48px sans-serif';
        ctx.fillText((memberName || 'NOMBRE DE SOCIO').slice(0, 26), 60, 348);

        // ID & Validity
        ctx.fillStyle = '#A3A3A3';
        ctx.font = '600 22px monospace';
        ctx.fillText(`ID: ${memberId}  ·  VÁLIDO 2026/27`, 60, 396);

        // Divider & Footer
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(60, 495);
        ctx.lineTo(940, 495);
        ctx.stroke();

        ctx.fillStyle = '#A3A3A3';
        ctx.font = '500 20px sans-serif';
        ctx.fillText('Complejo Deportivo Social Litoral · Bajo Següencoma, La Paz', 60, 545);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '700 20px monospace';
        ctx.fillText('15% OFF TIENDA', 760, 545);

        const link = document.createElement('a');
        link.download = `Carnet-MC-${(memberName || 'Socio').replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      // ignore fallback
    }
    setCardGenerated(true);
    setTimeout(() => setCardGenerated(false), 3000);
  };

  return (
    <section id="comunidad" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-slate-200 dark:border-neutral-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E6002B] uppercase tracking-wider mb-2">
            <span>Comunidad & Pasión Rojinegra</span>
            <span aria-hidden="true">·</span>
            <span>Experiencia Interactiva</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
            ZONA FAN & SOCIOS MC
          </h2>
          <p className="text-sm text-slate-600 dark:text-neutral-400 mt-1 max-w-xl">
            Vota por las figuras de cada jornada, obtén tu Carnet Digital Oficial y accede a beneficios exclusivos del club.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* MVP Interactive Fan Poll */}
        <div className="lg:col-span-6 bg-white dark:bg-[#0A0A0C] border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-md dark:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Vote className="w-5 h-5 text-[#E6002B]" />
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">{poll.title}</h3>
            </div>
            <span className="text-xs font-mono-numbers text-slate-500 dark:text-neutral-400">
              {poll.totalVotes.toLocaleString()} votos emitidos
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-neutral-400 mb-6">{poll.subtitle}</p>

          <div className="space-y-3">
            {poll.options.map((opt) => {
              const percentage = Math.round((opt.votes / poll.totalVotes) * 100);
              const isSelected = userVoted === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => handleVote(opt.id)}
                  className={`relative p-4 rounded-xl border transition-all cursor-pointer overflow-hidden ${
                    isSelected
                      ? 'border-[#E6002B] bg-[#E6002B]/10 shadow-sm shadow-[#E6002B]/10'
                      : userVoted
                      ? 'border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/40 opacity-85'
                      : 'border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/60 hover:border-slate-300 dark:hover:border-neutral-700'
                  }`}
                >
                  {/* Progress background bar if voted */}
                  {userVoted && (
                    <div
                      className="absolute inset-y-0 left-0 bg-[#E6002B]/15 dark:bg-[#E6002B]/20 transition-all duration-700"
                      style={{ width: `${percentage}%` }}
                    />
                  )}

                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 flex items-center justify-center font-display font-black text-sm text-[#E6002B]">
                        #{opt.number}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white block">{opt.label}</span>
                        <span className="text-xs text-slate-500 dark:text-neutral-400">{opt.sublabel}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {userVoted ? (
                        <div className="text-right">
                          <span className="text-sm font-bold font-mono-numbers text-slate-900 dark:text-white">
                            {percentage}%
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-neutral-500 block font-mono-numbers">
                            {opt.votes} votos
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-transparent hover:bg-[#E6002B] hover:border-[#E6002B] hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          Votar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {userVoted && (
            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-center text-xs text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              <span>¡Gracias por votar! Tu voto se ha registrado en tiempo real.</span>
            </div>
          )}
        </div>

        {/* Digital Member Card Generator */}
        <div className="lg:col-span-6 bg-white dark:bg-[#0A0A0C] border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-md dark:shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#E6002B]" />
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  CARNET DIGITAL DE SOCIO OFICIAL
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-neutral-400">Acceso a Estadio & Descuentos</span>
            </div>

            {/* The 3D Digital Card Visual — intentionally rich dark metallic obsidian in both modes */}
            <div className="relative w-full aspect-[16/10] rounded-2xl p-6 overflow-hidden border border-neutral-700/80 shadow-2xl bg-gradient-to-br from-[#18181F] via-[#0E0E12] to-[#08080A] mb-6">
              {/* Card Holographic Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#E6002B]/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none" />

              <div className="relative z-10 h-full flex flex-col justify-between">
                {/* Top Row: Club Brand & Chip */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#E6002B] flex items-center justify-center font-display font-black text-xl text-white shadow-md">
                      MC
                    </div>
                    <div>
                      <span className="text-sm font-black font-display tracking-wider text-white block">
                        CLUB MARTÍN CAREAGA
                      </span>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-widest">
                        Credencial Oficial de Socio
                      </span>
                    </div>
                  </div>

                  {/* Platinum EMV Chip */}
                  <div className="w-9 h-7 rounded bg-gradient-to-br from-neutral-200 to-neutral-400 border border-white/60 flex flex-col justify-center gap-1 p-1 shadow-sm">
                    <div className="w-full h-0.5 bg-neutral-600/60" />
                    <div className="w-full h-0.5 bg-neutral-600/60" />
                  </div>
                </div>

                {/* Center Member Name & ID */}
                <div className="my-auto pt-3">
                  <span className="text-[10px] uppercase tracking-wider text-[#FF4D6D] font-bold block">
                    {memberType === 'socio-pro'
                      ? 'SOCIO ACTIVO PRIMER PLANTEL'
                      : memberType === 'socio-escuela'
                      ? 'FAMILIA ESCUELA MARTÍN CAREAGA'
                      : 'SOCIO VITALICIO HONORARIO'}
                  </span>
                  <h4 className="text-xl sm:text-2xl font-bold font-display text-white tracking-wide mt-0.5 uppercase truncate">
                    {memberName || 'NOMBRE DE SOCIO'}
                  </h4>
                  <span className="text-xs font-mono-numbers text-neutral-400 block mt-1 tracking-widest">
                    ID: {memberId} · VÁLIDO 2026/27
                  </span>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-[11px] text-neutral-400">
                  <span>Acceso Preferencial a Canchas</span>
                  <span className="font-mono-numbers text-white font-bold">15% OFF TIENDA</span>
                </div>
              </div>
            </div>

            {/* Form Controls to Customize Card */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold uppercase text-slate-600 dark:text-neutral-400 block mb-1">
                  Tu Nombre para el Carnet
                </label>
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#E6002B]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase text-slate-600 dark:text-neutral-400 block mb-1">
                  Categoría de Membresía
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'socio-pro', label: 'Socio Pro' },
                    { id: 'socio-escuela', label: 'Escuela MC' },
                    { id: 'socio-vitalicio', label: 'Vitalicio' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        playUiClick();
                        setMemberType(m.id as any);
                      }}
                      className={`p-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        memberType === m.id
                          ? 'border-[#E6002B] bg-[#E6002B]/10 text-[#E6002B] dark:text-white'
                          : 'border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleDownloadCard}
            className="w-full mt-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-slate-900 dark:border-neutral-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {cardGenerated ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">¡Carnet Digital Guardado!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-[#E6002B]" />
                <span>Descargar Credencial Digital Oficial</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
