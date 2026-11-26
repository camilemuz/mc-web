import React, { useState } from 'react';
import { Player } from '../types';
import { PLAYERS_DATA } from '../data/mockData';
import { playUiClick, playWhoosh } from '../utils/soundEffects';
import { Zap, Shield, Target, Award, ArrowUpRight, X, Activity } from 'lucide-react';

interface PlayerCard3DProps {
  player: Player;
  onSelect: (player: Player) => void;
}

const PlayerCard3D: React.FC<PlayerCard3DProps> = ({ player, onSelect }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -12;
    const rY = ((x - centerX) / centerX) * 12;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  // Position color accent
  const getPositionAccent = () => {
    switch (player.position) {
      case 'Delantero': return '#E6002B';
      case 'Mediocampista': return '#FF5500';
      case 'Defensa': return '#3B82F6';
      case 'Arquero': return '#EAB308';
      default: return '#A855F7';
    }
  };

  return (
    <div
      className="perspective-1000 cursor-pointer select-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        playUiClick();
        onSelect(player);
      }}
    >
      <div
        className="relative h-[430px] rounded-2xl bg-[#0C0C0E] border border-neutral-800 transition-all duration-200 overflow-hidden group shadow-lg"
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
          transformStyle: 'preserve-3d',
          boxShadow: isHovered
            ? '0 25px 40px -15px rgba(230, 0, 43, 0.25), 0 0 15px 1px rgba(230, 0, 43, 0.15)'
            : '0 10px 25px -5px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Dynamic Sheen / Specular Glare */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
          style={{
            background: `radial-gradient(circle at ${50 + rotateY * 2}% ${50 - rotateX * 2}%, rgba(255, 255, 255, 0.12) 0%, transparent 65%)`
          }}
        />

        {/* Diagonal Cyber Lines in Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#E6002B_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Top Info Bar: Number & Position */}
        <div className="relative z-20 p-5 flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-4xl font-black font-display tracking-tight text-white/90 group-hover:text-white transition-colors">
              #{player.number === 0 ? 'DT' : player.number}
            </span>
            <span
              className="text-xs font-semibold uppercase tracking-wider mt-0.5"
              style={{ color: getPositionAccent() }}
            >
              {player.position}
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-xs text-neutral-400 font-mono-numbers">{player.nationality}</span>
            <span className="text-[11px] text-neutral-500 mt-0.5">
              {player.age} años · {player.height}
            </span>
          </div>
        </div>

        {/* Player Silhouette / Artistic Vector Presentation */}
        <div className="absolute inset-0 flex items-center justify-center pt-8 z-10 pointer-events-none">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Ambient Aura behind player */}
            <div
              className="absolute w-44 h-44 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"
              style={{ backgroundColor: getPositionAccent() }}
            />

            {player.image ? (
              <img
                src={player.image}
                alt={player.name}
                className="w-48 h-64 object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.85)] z-10 pointer-events-none"
              />
            ) : (
              /* Stylized Player Silhouette Graphic */
              <svg
                viewBox="0 0 200 240"
                className="w-48 h-56 transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Head */}
                <circle cx="100" cy="50" r="26" fill="#1C1C22" stroke="#2E2E38" strokeWidth="2" />
                {/* Torso in Club Colors */}
                <path
                  d="M55,100 L75,85 L125,85 L145,100 L140,190 L60,190 Z"
                  fill="#121216"
                  stroke="#2A2A35"
                  strokeWidth="2"
                />
                {/* Stripes */}
                <rect x="85" y="86" width="14" height="104" fill="#E6002B" />
                <rect x="110" y="86" width="14" height="104" fill="#E6002B" />
                {/* Player Number in Chest/Back */}
                <text
                  x="100"
                  y="145"
                  fill="#FFFFFF"
                  fontFamily="Barlow Condensed, sans-serif"
                  fontWeight="900"
                  fontSize="32"
                  textAnchor="middle"
                  opacity="0.8"
                >
                  {player.number === 0 ? 'MC' : player.number}
                </text>
              </svg>
            )}
          </div>
        </div>

        {/* Bottom Card Footer: Player Name & Micro Stats HUD */}
        <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-[#060608] via-[#0C0C0E]/95 to-transparent z-20">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <h4 className="text-xl font-bold font-display text-white group-hover:text-[#FF1A40] transition-colors leading-tight">
                {player.name}
              </h4>
              {player.nickname && (
                <span className="text-xs text-neutral-400 italic">"{player.nickname}"</span>
              )}
            </div>

            <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-neutral-300 group-hover:border-[#E6002B] group-hover:text-white transition-colors">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Key Stat Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800/80">
            {player.position !== 'Cuerpo Técnico' ? (
              <>
                <div className="text-center">
                  <span className="text-[10px] text-neutral-500 uppercase block font-medium">Goles</span>
                  <span className="text-sm font-bold font-mono-numbers text-white">{player.goals}</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-neutral-500 uppercase block font-medium">Velocidad</span>
                  <span className="text-sm font-bold font-mono-numbers text-[#E6002B]">
                    {player.topSpeedKmH} <span className="text-[9px] text-neutral-400">km/h</span>
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-neutral-500 uppercase block font-medium">Pases</span>
                  <span className="text-sm font-bold font-mono-numbers text-white">{player.passAccuracy}%</span>
                </div>
              </>
            ) : (
              <>
                <div className="text-center col-span-3">
                  <span className="text-[10px] text-neutral-500 uppercase block font-medium">Rol Estratégico</span>
                  <span className="text-xs font-semibold text-white">Director Técnico & Formador</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface PlayersRosterSectionProps {
  players?: Player[];
}

export const PlayersRosterSection: React.FC<PlayersRosterSectionProps> = ({ players: propPlayers }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'primer-plantel' | 'escuela-juvenil' | 'staff'>('all');
  const [positionFilter, setPositionFilter] = useState<string>('Todos');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const playerList = propPlayers || PLAYERS_DATA;
  const filteredPlayers = playerList.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesPosition = positionFilter === 'Todos' || p.position === positionFilter;
    return matchesCategory && matchesPosition;
  });

  return (
    <section id="plantilla" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-neutral-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E6002B] uppercase tracking-wider mb-2">
            <span>Plantel de Élite & Cantera</span>
            <span aria-hidden="true">·</span>
            <span>Temporada 2026/27</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            PLANTILLA OFICIAL MC
          </h2>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            Desde las figuras consagradas del Primer Plantel hasta las jóvenes promesas forjadas en la Escuela de Fútbol Martín Careaga.
          </p>
        </div>

        {/* Category Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
          <button
            onClick={() => {
              playUiClick();
              setActiveCategory('all');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeCategory === 'all' ? 'bg-[#E6002B] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => {
              playUiClick();
              setActiveCategory('primer-plantel');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeCategory === 'primer-plantel' ? 'bg-[#E6002B] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Primer Plantel
          </button>
          <button
            onClick={() => {
              playUiClick();
              setActiveCategory('escuela-juvenil');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeCategory === 'escuela-juvenil' ? 'bg-[#E6002B] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Cantera Martín Careaga
          </button>
          <button
            onClick={() => {
              playUiClick();
              setActiveCategory('staff');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeCategory === 'staff' ? 'bg-[#E6002B] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Cuerpo Técnico
          </button>
        </div>
      </div>

      {/* Position Sub-Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="text-xs text-neutral-500 mr-2 uppercase tracking-wider font-semibold">Posición:</span>
        {['Todos', 'Arquero', 'Defensa', 'Mediocampista', 'Delantero', 'Cuerpo Técnico'].map((pos) => (
          <button
            key={pos}
            onClick={() => {
              playUiClick();
              setPositionFilter(pos);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md border transition-all cursor-pointer ${
              positionFilter === pos
                ? 'border-[#E6002B] bg-[#E6002B]/10 text-white'
                : 'border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:text-white'
            }`}
          >
            {pos}
          </button>
        ))}
      </div>

      {/* 3D Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlayers.map((player) => (
          <PlayerCard3D key={player.id} player={player} onSelect={setSelectedPlayer} />
        ))}
      </div>

      {/* Detailed Player Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#0E0E12] border border-neutral-700 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => {
                playUiClick();
                setSelectedPlayer(null);
              }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-800/80 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
              <div className="flex items-center gap-4">
                {selectedPlayer.image ? (
                  <div className="w-16 h-16 rounded-xl bg-neutral-900 border border-neutral-700 p-1 flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={selectedPlayer.image}
                      alt={selectedPlayer.name}
                      className="w-full h-full object-contain filter drop-shadow-md"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center font-display font-black text-3xl text-[#E6002B] shrink-0">
                    #{selectedPlayer.number === 0 ? 'DT' : selectedPlayer.number}
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold font-display text-white">{selectedPlayer.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                    <span className="text-[#E6002B] font-semibold uppercase">{selectedPlayer.position}</span>
                    <span>·</span>
                    <span>{selectedPlayer.nationality}</span>
                    <span>·</span>
                    <span>Pie {selectedPlayer.preferredFoot}</span>
                  </div>
                </div>
              </div>

              {selectedPlayer.marketValue && (
                <div className="bg-neutral-900 border border-neutral-800 px-3.5 py-1.5 rounded-lg text-right">
                  <span className="text-[10px] text-neutral-500 uppercase block font-medium">Cotización / Rol</span>
                  <span className="text-sm font-bold font-mono-numbers text-white">{selectedPlayer.marketValue}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="py-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Perfil Deportivo & Trayectoria
              </h4>
              <p className="text-sm text-neutral-300 leading-relaxed">{selectedPlayer.bio}</p>
            </div>

            {/* In-depth Stats Radar/Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-neutral-800/80 bg-neutral-950/40 p-4 rounded-xl">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block font-medium">Partidos Jugados</span>
                <span className="text-lg font-bold font-mono-numbers text-white">{selectedPlayer.matchesPlayed}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block font-medium">Goles / Asistencias</span>
                <span className="text-lg font-bold font-mono-numbers text-[#E6002B]">
                  {selectedPlayer.goals} / {selectedPlayer.assists}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block font-medium">Velocidad Máxima</span>
                <span className="text-lg font-bold font-mono-numbers text-white">
                  {selectedPlayer.topSpeedKmH} <span className="text-xs text-neutral-400">km/h</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block font-medium">Precisión de Pase</span>
                <span className="text-lg font-bold font-mono-numbers text-emerald-400">
                  {selectedPlayer.passAccuracy}%
                </span>
              </div>
            </div>

            {/* Performance Bar Metrology */}
            <div className="mt-5 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-400">Resistencia Física (Stamina)</span>
                  <span className="font-mono-numbers text-white font-bold">{selectedPlayer.stamina}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-[#E6002B] rounded-full transition-all duration-500"
                    style={{ width: `${selectedPlayer.stamina}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-400">Eficiencia Táctica en Campo</span>
                  <span className="font-mono-numbers text-white font-bold">{selectedPlayer.passAccuracy}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-neutral-600 to-white rounded-full transition-all duration-500"
                    style={{ width: `${selectedPlayer.passAccuracy}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Footer action */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  playUiClick();
                  setSelectedPlayer(null);
                }}
                className="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Cerrar Ficha Técnica
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
