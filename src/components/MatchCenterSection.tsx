import React, { useState } from 'react';
import { CURRENT_LIVE_MATCH } from '../data/mockData';
import { Match, MatchEvent } from '../types';
import { playUiClick, playWhoosh, playGoalCheer } from '../utils/soundEffects';
import { Radio, Clock, ShieldAlert, Award, ChevronRight, Activity, Users, Flame } from 'lucide-react';

interface TacticalPlayer {
  id: string;
  number: number;
  name: string;
  role: string;
  x: number; // percentage on pitch
  y: number; // percentage on pitch
  instruction: string;
}

const TACTICAL_STARTERS: TacticalPlayer[] = [
  { id: 't-1', number: 1, name: 'Santoro', role: 'Arquero Líbero', x: 50, y: 88, instruction: 'Salida rápida con pie y cobertura del área grande' },
  { id: 't-2', number: 4, name: 'Barrientos', role: 'Lateral Ofensivo', x: 84, y: 68, instruction: 'Desdoble por banda derecha y centro al primer palo' },
  { id: 't-3', number: 2, name: 'Navarro (C)', role: 'Central Tapón', x: 62, y: 72, instruction: 'Anticipación aérea y liderazgo de la última línea' },
  { id: 't-4', number: 6, name: 'Quiroga', role: 'Central Salidor', x: 38, y: 72, instruction: 'Pase filtrado progresivo y corte en cobertura' },
  { id: 't-5', number: 3, name: 'Delgado', role: 'Lateral Marcador', x: 16, y: 68, instruction: 'Cierre de pasillo interno y equilibrio defensivo' },
  { id: 't-6', number: 5, name: 'Almada', role: 'Pivote Organizador', x: 50, y: 52, instruction: 'Voz de mando táctica, recepción entre líneas rivales' },
  { id: 't-7', number: 8, name: 'Morales', role: 'Interior Mixto', x: 70, y: 42, instruction: 'Presión alta tras pérdida e incursión al área' },
  { id: 't-8', number: 10, name: 'Benítez', role: 'Enganche Creador', x: 30, y: 40, instruction: 'Libertad creativa, tiros libres y último pase' },
  { id: 't-9', number: 7, name: 'Ríos', role: 'Extremo Derecho', x: 80, y: 24, instruction: 'Desborde en velocidad 1v1 y diagonales al arco' },
  { id: 't-10', number: 9, name: 'Valenzuela', role: 'Centrodelantero', x: 50, y: 16, instruction: 'Referencia en área rival, remate a un toque y presión al central' },
  { id: 't-11', number: 11, name: 'Careaga Jr.', role: 'Extremo Invertido', x: 20, y: 24, instruction: 'Recorte hacia adentro para tiro con perfil cambiado' },
];

interface MatchCenterSectionProps {
  match?: Match;
}

export const MatchCenterSection: React.FC<MatchCenterSectionProps> = ({ match: propMatch }) => {
  const [matchTab, setMatchTab] = useState<'lineup' | 'timeline' | 'stats'>('lineup');
  const [pitch3D, setPitch3D] = useState(true);
  const [selectedTacticalPlayer, setSelectedTacticalPlayer] = useState<TacticalPlayer>(TACTICAL_STARTERS[7]); // Benítez default
  const match = propMatch || CURRENT_LIVE_MATCH;

  return (
    <section id="match-center" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Tag & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-200 dark:border-neutral-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E6002B] uppercase tracking-wider mb-2">
            <span>Centro de Partidos Oficial</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              MINUTO {match.currentMinute}' EN DIRECTO
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
            MATCH CENTER EN VIVO
          </h2>
          <p className="text-sm text-slate-600 dark:text-neutral-400 mt-1 max-w-xl">
            Sigue la pizarra táctica de Martín Careaga, la línea de tiempo jugada a jugada y las estadísticas biométricas en tiempo real.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl">
          <button
            onClick={() => {
              playUiClick();
              setMatchTab('lineup');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              matchTab === 'lineup' ? 'bg-[#E6002B] text-white shadow-sm' : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Alineación Táctica 4-3-3
          </button>
          <button
            onClick={() => {
              playUiClick();
              setMatchTab('timeline');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              matchTab === 'timeline' ? 'bg-[#E6002B] text-white shadow-sm' : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Línea de Tiempo
          </button>
          <button
            onClick={() => {
              playUiClick();
              setMatchTab('stats');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              matchTab === 'stats' ? 'bg-[#E6002B] text-white shadow-sm' : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Estadísticas Avanzadas
          </button>
        </div>
      </div>

      {/* Scoreboard Marquee Card */}
      <div className="bg-white dark:bg-[#0A0A0C] border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-md dark:shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#E6002B] to-transparent" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Home Team (MC) */}
          <div className="md:col-span-4 flex items-center justify-start md:justify-end gap-4 order-1 md:order-1">
            <div className="text-left md:text-right">
              <h3 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white tracking-wide">
                MC MARTÍN CAREAGA
              </h3>
              <span className="text-xs text-slate-500 dark:text-neutral-400">Primer Plantel Élite (Local)</span>
            </div>
            <div className="w-16 h-16 rounded-xl bg-slate-900 dark:bg-neutral-900 border border-[#E6002B] flex items-center justify-center text-white font-display font-black text-2xl shadow-lg shadow-[#E6002B]/20 shrink-0">
              MC
            </div>
          </div>

          {/* Central Live Score Display */}
          <div className="md:col-span-4 flex flex-col items-center justify-center order-3 md:order-2 py-2">
            <div className="flex items-center gap-4">
              <span className="text-5xl sm:text-6xl font-black font-mono-numbers text-slate-950 dark:text-white">
                {match.scoreHome}
              </span>
              <span className="text-2xl font-light text-slate-400 dark:text-neutral-600">:</span>
              <span className="text-5xl sm:text-6xl font-mono-numbers font-black text-slate-400 dark:text-neutral-400">
                {match.scoreAway}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
                MIN {match.currentMinute}'
              </span>
              <span className="text-xs text-slate-600 dark:text-neutral-400">{match.competition}</span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-neutral-500 mt-1">{match.venue}</span>
          </div>

          {/* Away Team */}
          <div className="md:col-span-4 flex items-center justify-start gap-4 order-2 md:order-3">
            <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 flex items-center justify-center text-slate-700 dark:text-neutral-300 font-display font-black text-2xl shrink-0">
              MET
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black font-display text-slate-700 dark:text-neutral-200 tracking-wide">
                ATL. METROPOLITANO
              </h3>
              <span className="text-xs text-slate-500 dark:text-neutral-500">Visitante</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Content Display */}
      {matchTab === 'lineup' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tactical Pitch Canvas */}
          <div className="lg:col-span-8 bg-white dark:bg-[#08080A] border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-md dark:shadow-xl relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                  Esquema Táctico Martín Careaga: 4-3-3 Ofensivo
                </span>
                <span className="text-slate-400 dark:text-neutral-500">·</span>
                <span className="text-xs text-slate-500 dark:text-neutral-400">Toca un jugador para ver rol táctico</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playUiClick();
                    setPitch3D(!pitch3D);
                  }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    pitch3D
                      ? 'border-[#E6002B] bg-[#E6002B]/10 text-[#E6002B] dark:text-white'
                      : 'border-slate-300 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400'
                  }`}
                  title="Conmutar entre perspectiva 3D e isométrica o vista plana 2D"
                >
                  {pitch3D ? 'Perspectiva 3D Activa' : 'Vista Plana 2D'}
                </button>
                <button
                  onClick={() => {
                    playGoalCheer();
                  }}
                  className="text-xs text-[#E6002B] hover:text-[#FF1A40] flex items-center gap-1 transition-colors cursor-pointer font-semibold"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Simular Pitazo</span>
                </button>
              </div>
            </div>

            {/* Tactical Pitch Visual (Interactive SVG with grass cut stripes & 3D gradient) */}
            <div
              className={`relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-300 dark:border-neutral-800 bg-[#0A1A0F] transition-all duration-700 ${
                pitch3D
                  ? 'perspective-1000 shadow-[0_25px_50px_rgba(0,0,0,0.45)] dark:shadow-[0_25px_50px_rgba(0,0,0,0.85)] ring-1 ring-[#E6002B]/30'
                  : ''
              }`}
              style={
                pitch3D
                  ? {
                      transform: 'perspective(900px) rotateX(18deg) scale(0.96)',
                      transformOrigin: 'center bottom',
                    }
                  : undefined
              }
            >
              <svg viewBox="0 0 800 600" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Grass Cut Striping */}
                <defs>
                  <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="100%">
                    <stop offset="0%" stopColor="#0B1C10" />
                    <stop offset="100%" stopColor="#07120A" />
                  </linearGradient>
                  <pattern id="turfPattern" width="800" height="100" patternUnits="userSpaceOnUse">
                    <rect width="800" height="50" fill="#0B1C10" />
                    <rect y="50" width="800" height="50" fill="#0D2214" />
                  </pattern>
                </defs>

                <rect width="800" height="600" fill="url(#turfPattern)" />

                {/* Pitch Markings (White Lines) */}
                <g stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.35" fill="none">
                  {/* Outer Boundary */}
                  <rect x="40" y="30" width="720" height="540" />
                  {/* Halfway Line */}
                  <line x1="40" y1="300" x2="760" y2="300" />
                  {/* Center Circle */}
                  <circle cx="400" cy="300" r="75" />
                  <circle cx="400" cy="300" r="3" fill="#ffffff" fillOpacity="0.6" />

                  {/* Top Penalty Area (Rival) */}
                  <rect x="220" y="30" width="360" height="130" />
                  <rect x="310" y="30" width="180" height="45" />
                  <circle cx="400" cy="110" r="3" fill="#ffffff" fillOpacity="0.6" />
                  <path d="M 330 160 A 75 75 0 0 0 470 160" />

                  {/* Bottom Penalty Area (MC) */}
                  <rect x="220" y="440" width="360" height="130" />
                  <rect x="310" y="525" width="180" height="45" />
                  <circle cx="400" cy="490" r="3" fill="#ffffff" fillOpacity="0.6" />
                  <path d="M 330 440 A 75 75 0 0 1 470 440" />
                </g>

                {/* Interactive Tactical Player Dots */}
                {TACTICAL_STARTERS.map((tp) => {
                  const isSelected = selectedTacticalPlayer.id === tp.id;
                  const pixelX = (tp.x / 100) * 800;
                  const pixelY = (tp.y / 100) * 600;

                  return (
                    <g
                      key={tp.id}
                      transform={`translate(${pixelX}, ${pixelY})`}
                      className="cursor-pointer transition-transform"
                      onClick={() => {
                        playUiClick();
                        setSelectedTacticalPlayer(tp);
                      }}
                    >
                      {isSelected && (
                        <circle cx="0" cy="0" r="28" fill="#E6002B" opacity="0.35" />
                      )}

                      <circle
                        cx="0"
                        cy="0"
                        r="18"
                        fill={isSelected ? '#E6002B' : '#0F0F12'}
                        stroke={isSelected ? '#FFFFFF' : '#E6002B'}
                        strokeWidth="2.5"
                      />

                      <text
                        x="0"
                        y="5"
                        fill="#FFFFFF"
                        fontFamily="Barlow Condensed, sans-serif"
                        fontWeight="900"
                        fontSize="14"
                        textAnchor="middle"
                      >
                        {tp.number}
                      </text>

                      <rect
                        x="-38"
                        y="22"
                        width="76"
                        height="18"
                        rx="4"
                        fill="#060608"
                        fillOpacity="0.88"
                        stroke={isSelected ? '#E6002B' : '#333'}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="34"
                        fill={isSelected ? '#FF4D6D' : '#F3F4F6'}
                        fontFamily="Plus Jakarta Sans, sans-serif"
                        fontWeight="600"
                        fontSize="10"
                        textAnchor="middle"
                      >
                        {tp.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Tactical Player Details & Strategy Inspector */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0A0A0C] border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 shadow-md dark:shadow-xl flex flex-col gap-5">
            <div className="border-b border-slate-200 dark:border-neutral-800 pb-4">
              <span className="text-xs uppercase tracking-wider text-[#E6002B] font-semibold block mb-1">
                Instrucción Táctica Personalizada
              </span>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-neutral-900 border border-[#E6002B] flex items-center justify-center text-white font-display font-black text-2xl">
                  #{selectedTacticalPlayer.number}
                </div>
                <div>
                  <h4 className="text-xl font-bold font-display text-slate-900 dark:text-white">{selectedTacticalPlayer.name}</h4>
                  <span className="text-xs text-slate-500 dark:text-neutral-400 font-medium">{selectedTacticalPlayer.role}</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400 mb-2">
                Pauta Táctica de Martín Careaga:
              </h5>
              <div className="p-4 bg-slate-50 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 rounded-xl text-sm text-slate-700 dark:text-neutral-200 leading-relaxed italic">
                "{selectedTacticalPlayer.instruction}"
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-neutral-400">Intensidad de Presión</span>
                <span className="font-mono-numbers text-slate-900 dark:text-white font-bold">Alta (Zonificación 1/3)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-neutral-400">Distancia Media Recorrida</span>
                <span className="font-mono-numbers text-[#E6002B] font-bold">9.4 km</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-neutral-400">Tasa de Duelos Ganados</span>
                <span className="font-mono-numbers text-emerald-600 dark:text-emerald-400 font-bold">78%</span>
              </div>
            </div>

            <div className="mt-2 pt-4 border-t border-slate-200 dark:border-neutral-800">
              <span className="text-[11px] text-slate-500 dark:text-neutral-500 block leading-tight">
                *Datos transmitidos por el sistema de telemetría GPS del cuerpo técnico del Club MC.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Match Timeline Content */}
      {matchTab === 'timeline' && (
        <div className="bg-white dark:bg-[#0A0A0C] border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-md dark:shadow-xl">
          <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-6">
            LÍNEA DE TIEMPO · MINUTO A MINUTO
          </h3>

          <div className="relative pl-6 sm:pl-8 border-l border-slate-200 dark:border-neutral-800 space-y-6">
            {match.timeline.map((event: MatchEvent, idx: number) => (
              <div key={idx} className="relative group">
                {/* Minute Marker Badge */}
                <div
                  className={`absolute -left-[35px] sm:-left-[43px] w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono-numbers border shadow-md ${
                    event.type === 'goal'
                      ? 'bg-[#E6002B] border-[#FF1A40] text-white shadow-[#E6002B]/40'
                      : event.type === 'card-yellow'
                      ? 'bg-amber-400 border-amber-300 text-black'
                      : 'bg-white dark:bg-neutral-900 border-slate-300 dark:border-neutral-700 text-slate-700 dark:text-neutral-300'
                  }`}
                >
                  {event.minute}'
                </div>

                <div className="bg-slate-50 dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800/80 rounded-xl p-4 transition-all group-hover:border-slate-300 dark:group-hover:border-neutral-700">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {event.type === 'goal' && <Flame className="w-4 h-4 text-[#E6002B]" />}
                      {event.player}
                    </span>
                    <span className="text-xs uppercase font-semibold text-slate-500 dark:text-neutral-400">
                      {event.team === 'home' ? 'MC Martín Careaga' : 'Atl. Metropolitano'}
                    </span>
                  </div>
                  {event.assistOrDetail && (
                    <p className="text-xs text-slate-600 dark:text-neutral-400 mt-0.5">{event.assistOrDetail}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Advanced Match Stats */}
      {matchTab === 'stats' && (
        <div className="bg-white dark:bg-[#0A0A0C] border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-md dark:shadow-xl">
          <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-6">
            COMPARADOR DE RENDIMIENTO EN VIVO
          </h3>

          <div className="space-y-6">
            {/* Possession */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-slate-900 dark:text-white font-mono-numbers text-sm">{match.stats.possessionHome}%</span>
                <span className="text-slate-500 dark:text-neutral-400 uppercase tracking-wider">Posesión de Balón</span>
                <span className="text-slate-500 dark:text-neutral-400 font-mono-numbers text-sm">{match.stats.possessionAway}%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 dark:bg-neutral-900 rounded-full flex overflow-hidden">
                <div
                  className="bg-[#E6002B] h-full transition-all duration-700"
                  style={{ width: `${match.stats.possessionHome}%` }}
                />
                <div
                  className="bg-slate-400 dark:bg-neutral-600 h-full transition-all duration-700"
                  style={{ width: `${match.stats.possessionAway}%` }}
                />
              </div>
            </div>

            {/* Shots Total */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-slate-900 dark:text-white font-mono-numbers text-sm">{match.stats.shotsHome}</span>
                <span className="text-slate-500 dark:text-neutral-400 uppercase tracking-wider">Tiros Totales</span>
                <span className="text-slate-500 dark:text-neutral-400 font-mono-numbers text-sm">{match.stats.shotsAway}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 dark:bg-neutral-900 rounded-full flex overflow-hidden">
                <div
                  className="bg-[#E6002B] h-full"
                  style={{
                    width: `${(match.stats.shotsHome / (match.stats.shotsHome + match.stats.shotsAway)) * 100}%`
                  }}
                />
                <div
                  className="bg-slate-400 dark:bg-neutral-600 h-full"
                  style={{
                    width: `${(match.stats.shotsAway / (match.stats.shotsHome + match.stats.shotsAway)) * 100}%`
                  }}
                />
              </div>
            </div>

            {/* Shots On Target */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-slate-900 dark:text-white font-mono-numbers text-sm">{match.stats.shotsOnTargetHome}</span>
                <span className="text-slate-500 dark:text-neutral-400 uppercase tracking-wider">Tiros al Arco</span>
                <span className="text-slate-500 dark:text-neutral-400 font-mono-numbers text-sm">{match.stats.shotsOnTargetAway}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 dark:bg-neutral-900 rounded-full flex overflow-hidden">
                <div
                  className="bg-[#E6002B] h-full"
                  style={{
                    width: `${(match.stats.shotsOnTargetHome / (match.stats.shotsOnTargetHome + match.stats.shotsOnTargetAway)) * 100}%`
                  }}
                />
                <div
                  className="bg-slate-400 dark:bg-neutral-600 h-full"
                  style={{
                    width: `${(match.stats.shotsOnTargetAway / (match.stats.shotsOnTargetHome + match.stats.shotsOnTargetAway)) * 100}%`
                  }}
                />
              </div>
            </div>

            {/* xG (Expected Goals) */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-slate-900 dark:text-white font-mono-numbers text-sm">{match.stats.xGHome}</span>
                <span className="text-slate-500 dark:text-neutral-400 uppercase tracking-wider">Goles Esperados (xG)</span>
                <span className="text-slate-500 dark:text-neutral-400 font-mono-numbers text-sm">{match.stats.xGAway}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 dark:bg-neutral-900 rounded-full flex overflow-hidden">
                <div
                  className="bg-[#E6002B] h-full"
                  style={{
                    width: `${(match.stats.xGHome / (match.stats.xGHome + match.stats.xGAway)) * 100}%`
                  }}
                />
                <div
                  className="bg-slate-400 dark:bg-neutral-600 h-full"
                  style={{
                    width: `${(match.stats.xGAway / (match.stats.xGHome + match.stats.xGAway)) * 100}%`
                  }}
                />
              </div>
            </div>

            {/* Corners & Fouls */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-neutral-800 text-center">
              <div className="p-3 bg-slate-50 dark:bg-neutral-900/60 rounded-xl border border-slate-200 dark:border-neutral-800">
                <span className="text-[10px] text-slate-500 dark:text-neutral-500 uppercase block">Tiros de Esquina</span>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="font-bold text-slate-900 dark:text-white font-mono-numbers">{match.stats.cornersHome}</span>
                  <span className="text-xs text-slate-400 dark:text-neutral-500">vs</span>
                  <span className="font-bold text-slate-500 dark:text-neutral-400 font-mono-numbers">{match.stats.cornersAway}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-neutral-900/60 rounded-xl border border-slate-200 dark:border-neutral-800">
                <span className="text-[10px] text-slate-500 dark:text-neutral-500 uppercase block">Faltas Cometidas</span>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="font-bold text-slate-900 dark:text-white font-mono-numbers">{match.stats.foulsHome}</span>
                  <span className="text-xs text-slate-400 dark:text-neutral-500">vs</span>
                  <span className="font-bold text-slate-500 dark:text-neutral-400 font-mono-numbers">{match.stats.foulsAway}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
