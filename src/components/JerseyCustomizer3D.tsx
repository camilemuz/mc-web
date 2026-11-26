import React, { useState } from 'react';
import { RotateCw, Check, Sparkles, ShoppingBag, Shield } from 'lucide-react';
import { Product } from '../types';
import { playUiClick, playWhoosh } from '../utils/soundEffects';

interface JerseyCustomizer3DProps {
  product: Product;
  onAddToCart: (product: Product, size: string, customName?: string, customNumber?: number) => void;
}

export const JerseyCustomizer3D: React.FC<JerseyCustomizer3DProps> = ({ product, onAddToCart }) => {
  const [isBackView, setIsBackView] = useState(true); // Default to back to see name and number immediately
  const [customName, setCustomName] = useState('CAREAGA');
  const [customNumber, setCustomNumber] = useState(10);
  const [kitTheme, setKitTheme] = useState<'home' | 'away' | 'blackout'>('home');
  const [selectedSize, setSelectedSize] = useState('M');
  const [hasSleeveBadge, setHasSleeveBadge] = useState(true);
  const [addedNotice, setAddedNotice] = useState(false);

  const handleFlip = () => {
    playWhoosh();
    setIsBackView(!isBackView);
  };

  const handleAdd = () => {
    playUiClick();
    onAddToCart(product, selectedSize, customName.toUpperCase().trim() || 'MC', customNumber);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2400);
  };

  // Kit color palettes
  const kitStyles = {
    home: {
      name: 'Titular Oficial (Rojo & Negro)',
      primary: '#E6002B',
      secondary: '#0D0D0F',
      stripe: '#E6002B',
      collar: '#FFFFFF',
      textFill: '#FFFFFF',
      textStroke: '#0D0D0F',
      accent: '#FF1A40'
    },
    away: {
      name: 'Suplente Platinum',
      primary: '#F0F2F5',
      secondary: '#1A1A1E',
      stripe: '#E6002B',
      collar: '#E6002B',
      textFill: '#0D0D0F',
      textStroke: '#E6002B',
      accent: '#E6002B'
    },
    blackout: {
      name: 'Edición Cyber Blackout',
      primary: '#111114',
      secondary: '#070708',
      stripe: '#1E1E24',
      collar: '#E6002B',
      textFill: '#E6002B',
      textStroke: '#FFFFFF',
      accent: '#FF2A4D'
    }
  };

  const currentTheme = kitStyles[kitTheme];

  return (
    <div className="bg-white dark:bg-[#0A0A0C] border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 lg:p-8 relative overflow-hidden shadow-md dark:shadow-2xl">
      {/* Background glow — subtle in dark mode */}
      <div className="hidden dark:block absolute top-0 right-0 w-96 h-96 bg-[#E6002B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden dark:block absolute bottom-0 left-0 w-96 h-96 bg-black/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* 3D Canvas / Interactive Jersey Display Area */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#E6002B]">
                Simulador 3D Interactivo
              </span>
              <span className="text-slate-400 dark:text-neutral-500">·</span>
              <span className="text-xs text-slate-500 dark:text-neutral-400">
                {isBackView ? 'Vista Dorsal (Espalda)' : 'Vista Frontal (Pecho)'}
              </span>
            </div>

            <button
              onClick={handleFlip}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-neutral-200 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg transition-all active:scale-95 cursor-pointer"
              title="Girar camiseta 180°"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#E6002B]" />
              <span>Girar Camiseta 180°</span>
            </button>
          </div>

          {/* 3D Container with Card-Flip Perspective */}
          <div className="relative w-full max-w-[420px] aspect-[4/5] perspective-1000 flex items-center justify-center py-2">
            <div
              className={`w-full h-full relative transition-transform duration-700 transform-style-3d ${
                isBackView ? 'rotate-y-180' : ''
              }`}
              style={{
                transform: isBackView ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* FRONT VIEW OF JERSEY */}
              <div
                className="absolute inset-0 w-full h-full flex items-center justify-center backface-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <svg
                  viewBox="0 0 500 560"
                  className="w-full h-full filter drop-shadow-[0_18px_22px_rgba(15,23,42,0.28)] dark:drop-shadow-[0_20px_25px_rgba(0,0,0,0.8)]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="jerseyShadeFront" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
                      <stop offset="50%" stopColor="#000000" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
                    </linearGradient>
                    <clipPath id="frontJerseyClip">
                      <path d="M150 40 L210 70 Q250 85 290 70 L350 40 L450 120 L400 200 L360 170 L360 480 Q250 500 140 480 L140 170 L100 200 L50 120 Z" />
                    </clipPath>
                  </defs>

                  <path
                    d="M150 40 L210 70 Q250 85 290 70 L350 40 L450 120 L400 200 L360 170 L360 480 Q250 500 140 480 L140 170 L100 200 L50 120 Z"
                    fill={currentTheme.primary}
                    stroke="#222"
                    strokeWidth="3"
                  />

                  <g clipPath="url(#frontJerseyClip)">
                    {kitTheme === 'home' && (
                      <>
                        <rect x="140" y="0" width="55" height="520" fill="#0D0D0F" />
                        <rect x="195" y="0" width="55" height="520" fill="#E6002B" />
                        <rect x="250" y="0" width="55" height="520" fill="#0D0D0F" />
                        <rect x="305" y="0" width="55" height="520" fill="#E6002B" />
                        <path d="M50 120 L150 40 L140 170 L100 200 Z" fill="#0D0D0F" />
                        <path d="M450 120 L350 40 L360 170 L400 200 Z" fill="#0D0D0F" />
                      </>
                    )}

                    {kitTheme === 'away' && (
                      <>
                        <polygon points="140,400 360,100 360,160 140,460" fill="#E6002B" opacity="0.9" />
                        <polygon points="140,460 360,160 360,175 140,475" fill="#1A1A1E" opacity="0.8" />
                      </>
                    )}

                    {kitTheme === 'blackout' && (
                      <>
                        <line x1="250" y1="70" x2="250" y2="480" stroke="#FF1A40" strokeWidth="2" strokeDasharray="6 6" />
                        <line x1="200" y1="70" x2="200" y2="480" stroke="#222" strokeWidth="1" />
                        <line x1="300" y1="70" x2="300" y2="480" stroke="#222" strokeWidth="1" />
                      </>
                    )}

                    <rect x="0" y="0" width="500" height="520" fill="url(#jerseyShadeFront)" />
                  </g>

                  <path
                    d="M210 70 Q250 100 290 70 L285 55 Q250 80 215 55 Z"
                    fill={currentTheme.collar}
                    stroke="#111"
                    strokeWidth="1.5"
                  />

                  <g transform="translate(180, 150)">
                    <path
                      d="M0,0 L36,0 L36,36 Q18,52 0,36 Z"
                      fill="#060608"
                      stroke="#E6002B"
                      strokeWidth="2.5"
                    />
                    <path d="M0,0 L18,0 L18,36 Q9,46 0,36 Z" fill="#E6002B" />
                    <text
                      x="18"
                      y="26"
                      fill="#FFFFFF"
                      fontFamily="Barlow Condensed, sans-serif"
                      fontWeight="900"
                      fontSize="17"
                      textAnchor="middle"
                    >
                      MC
                    </text>
                  </g>

                  <g transform="translate(290, 158)">
                    <polygon points="0,15 15,0 30,15" fill={currentTheme.collar} />
                    <circle cx="15" cy="22" r="3" fill="#E6002B" />
                  </g>

                  <g transform="translate(250, 260)">
                    <rect x="-85" y="-18" width="170" height="36" rx="4" fill="#000000" fillOpacity="0.45" />
                    <text
                      x="0"
                      y="7"
                      fill="#FFFFFF"
                      fontFamily="Barlow Condensed, sans-serif"
                      fontWeight="800"
                      fontSize="26"
                      letterSpacing="3"
                      textAnchor="middle"
                    >
                      CAREAGA
                    </text>
                    <text
                      x="0"
                      y="26"
                      fill="#FF1A40"
                      fontFamily="Plus Jakarta Sans, sans-serif"
                      fontWeight="700"
                      fontSize="8"
                      letterSpacing="3"
                      textAnchor="middle"
                    >
                      ESCUELA DE FÚTBOL
                    </text>
                  </g>

                  {hasSleeveBadge && (
                    <g transform="translate(390, 140)">
                      <circle cx="14" cy="14" r="14" fill="#000" stroke="#FFD700" strokeWidth="1.5" />
                      <text x="14" y="18" fill="#FFD700" fontSize="9" fontWeight="bold" textAnchor="middle">
                        LIGA
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              {/* BACK VIEW OF JERSEY (With customized name and number) */}
              <div
                className="absolute inset-0 w-full h-full flex items-center justify-center backface-hidden"
                style={{
                  transform: 'rotateY(180deg)',
                  backfaceVisibility: 'hidden'
                }}
              >
                <svg
                  viewBox="0 0 500 560"
                  className="w-full h-full filter drop-shadow-[0_18px_22px_rgba(15,23,42,0.28)] dark:drop-shadow-[0_20px_25px_rgba(0,0,0,0.8)]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <clipPath id="backJerseyClip">
                      <path d="M150 40 L210 60 Q250 68 290 60 L350 40 L450 120 L400 200 L360 170 L360 480 Q250 500 140 480 L140 170 L100 200 L50 120 Z" />
                    </clipPath>
                    <linearGradient id="jerseyShadeBack" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
                      <stop offset="50%" stopColor="#000000" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M150 40 L210 60 Q250 68 290 60 L350 40 L450 120 L400 200 L360 170 L360 480 Q250 500 140 480 L140 170 L100 200 L50 120 Z"
                    fill={currentTheme.primary}
                    stroke="#222"
                    strokeWidth="3"
                  />

                  <g clipPath="url(#backJerseyClip)">
                    {kitTheme === 'home' && (
                      <>
                        <rect x="140" y="0" width="55" height="520" fill="#0D0D0F" />
                        <rect x="195" y="0" width="55" height="520" fill="#E6002B" />
                        <rect x="250" y="0" width="55" height="520" fill="#0D0D0F" />
                        <rect x="305" y="0" width="55" height="520" fill="#E6002B" />
                        <path d="M50 120 L150 40 L140 170 L100 200 Z" fill="#0D0D0F" />
                        <path d="M450 120 L350 40 L360 170 L400 200 Z" fill="#0D0D0F" />
                        <rect x="160" y="100" width="180" height="280" fill="#0D0D0F" fillOpacity="0.88" rx="10" />
                      </>
                    )}

                    {kitTheme === 'away' && (
                      <polygon points="140,400 360,100 360,160 140,460" fill="#E6002B" opacity="0.9" />
                    )}

                    {kitTheme === 'blackout' && (
                      <rect x="160" y="100" width="180" height="280" fill="#070708" rx="8" />
                    )}

                    <rect x="0" y="0" width="500" height="520" fill="url(#jerseyShadeBack)" />
                  </g>

                  <path
                    d="M210 60 Q250 68 290 60 L285 45 Q250 52 215 45 Z"
                    fill={currentTheme.collar}
                  />

                  {/* Small Bolivia Flag at upper neck */}
                  <g transform="translate(240, 75)">
                    <rect x="0" y="0" width="20" height="6" fill="#D52B1E" />
                    <rect x="0" y="6" width="20" height="6" fill="#F9E300" />
                    <rect x="0" y="12" width="20" height="6" fill="#007934" />
                  </g>

                  {/* DYNAMIC CUSTOM NAME */}
                  <g transform="translate(250, 150)">
                    <text
                      x="2"
                      y="2"
                      fill="#000000"
                      fontFamily="Barlow Condensed, sans-serif"
                      fontWeight="900"
                      fontSize="38"
                      letterSpacing="4"
                      textAnchor="middle"
                      opacity="0.8"
                    >
                      {customName.toUpperCase().trim() || 'MC'}
                    </text>
                    <text
                      x="0"
                      y="0"
                      fill={currentTheme.textFill}
                      fontFamily="Barlow Condensed, sans-serif"
                      fontWeight="900"
                      fontSize="38"
                      letterSpacing="4"
                      textAnchor="middle"
                    >
                      {customName.toUpperCase().trim() || 'MC'}
                    </text>
                  </g>

                  {/* DYNAMIC CUSTOM NUMBER */}
                  <g transform="translate(250, 290)">
                    <text
                      x="5"
                      y="5"
                      fill="#000000"
                      fontFamily="Barlow Condensed, sans-serif"
                      fontWeight="900"
                      fontSize="148"
                      textAnchor="middle"
                      opacity="0.7"
                    >
                      {customNumber}
                    </text>
                    <text
                      x="0"
                      y="0"
                      fill={currentTheme.textFill}
                      stroke={currentTheme.textStroke}
                      strokeWidth="4"
                      fontFamily="Barlow Condensed, sans-serif"
                      fontWeight="900"
                      fontSize="148"
                      textAnchor="middle"
                    >
                      {customNumber}
                    </text>
                    <circle cx="0" cy="18" r="6" fill="#E6002B" />
                  </g>

                  <text
                    x="250"
                    y="435"
                    fill="#9CA3AF"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                    fontWeight="700"
                    fontSize="11"
                    letterSpacing="3"
                    textAnchor="middle"
                  >
                    MARTÍN CAREAGA · CUMPLIENDO SUEÑOS
                  </text>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs text-slate-500 dark:text-neutral-400">
              *Renderizado 3D en tiempo real con dorsal oficial estampado
            </span>
          </div>
        </div>

        {/* Customization Controls Panel */}
        <div className="lg:col-span-5 flex flex-col gap-5 bg-slate-50 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 p-6 rounded-xl">
          <div>
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white tracking-wide">
              PERSONALIZA TU CAMISETA
            </h3>
            <p className="text-xs text-slate-600 dark:text-neutral-400 mt-1">
              Estampa tu nombre y número con la tipografía oficial del Primer Plantel MC.
            </p>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-neutral-300 block mb-2">
              1. Versión de Equipación
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  playUiClick();
                  setKitTheme('home');
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all text-left flex flex-col gap-1 cursor-pointer ${
                  kitTheme === 'home'
                    ? 'border-[#E6002B] bg-[#E6002B]/10 text-[#E6002B] dark:text-white'
                    : 'border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-[#E6002B]" />
                <span className="truncate">Titular Roja/Negra</span>
              </button>

              <button
                onClick={() => {
                  playUiClick();
                  setKitTheme('away');
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all text-left flex flex-col gap-1 cursor-pointer ${
                  kitTheme === 'away'
                    ? 'border-[#E6002B] bg-[#E6002B]/10 text-[#E6002B] dark:text-white'
                    : 'border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-400" />
                <span className="truncate">Suplente Blanca</span>
              </button>

              <button
                onClick={() => {
                  playUiClick();
                  setKitTheme('blackout');
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all text-left flex flex-col gap-1 cursor-pointer ${
                  kitTheme === 'blackout'
                    ? 'border-[#E6002B] bg-[#E6002B]/10 text-[#E6002B] dark:text-white'
                    : 'border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-neutral-950 border border-neutral-600" />
                <span className="truncate">Cyber Blackout</span>
              </button>
            </div>
          </div>

          {/* Name & Number Input */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-neutral-300 block mb-1.5">
                2. Nombre o Apodo
              </label>
              <input
                type="text"
                maxLength={14}
                value={customName}
                onChange={(e) => {
                  setCustomName(e.target.value.toUpperCase());
                  if (!isBackView) setIsBackView(true);
                }}
                placeholder="EJ: CAREAGA"
                className="w-full bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white font-display tracking-widest uppercase focus:outline-none focus:border-[#E6002B]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-neutral-300 block mb-1.5">
                3. Dorsal (1-99)
              </label>
              <input
                type="number"
                min={1}
                max={99}
                value={customNumber}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val >= 1 && val <= 99) {
                    setCustomNumber(val);
                  } else if (e.target.value === '') {
                    setCustomNumber(10);
                  }
                  if (!isBackView) setIsBackView(true);
                }}
                className="w-full bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white font-mono-numbers text-center focus:outline-none focus:border-[#E6002B]"
              />
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-neutral-300 block mb-1.5">
              4. Seleccionar Talla
            </label>
            <div className="flex flex-wrap gap-2">
              {['S', 'M', 'L', 'XL', 'XXL', 'Niño 12', 'Niño 14'].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    playUiClick();
                    setSelectedSize(size);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all cursor-pointer ${
                    selectedSize === size
                      ? 'border-[#E6002B] bg-[#E6002B] text-white shadow-sm'
                      : 'border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-neutral-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Sleeve Badge Toggle */}
          <div className="flex items-center justify-between p-3 bg-white dark:bg-neutral-950 rounded-lg border border-slate-200 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#E6002B]" />
              <div className="text-xs">
                <span className="font-semibold text-slate-900 dark:text-white block">Parche Oficial Liga Élite</span>
                <span className="text-slate-500 dark:text-neutral-500">Termosellado en manga derecha</span>
              </div>
            </div>
            <button
              type="button"
              aria-label="Activar o desactivar parche oficial de liga"
              onClick={() => {
                playUiClick();
                setHasSleeveBadge(!hasSleeveBadge);
              }}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                hasSleeveBadge ? 'bg-[#E6002B]' : 'bg-slate-300 dark:bg-neutral-800'
              }`}
            >
              <span
                className={`block w-4 h-4 bg-white rounded-full transition-transform absolute top-0.5 left-0.5 shadow-sm ${
                  hasSleeveBadge ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Price & Add to Cart Action */}
          <div className="pt-2 border-t border-slate-200 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-neutral-400 block">Precio Total Personalizado</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono-numbers text-slate-900 dark:text-white">
                  Bs. {product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xs line-through text-slate-400 dark:text-neutral-500 font-mono-numbers">
                    Bs. {product.originalPrice}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={addedNotice}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E6002B] hover:bg-[#FF1A40] text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-[#E6002B]/20 active:scale-95 cursor-pointer disabled:opacity-75"
            >
              {addedNotice ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡Añadida al Carrito!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Añadir con mi Dorsal</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
