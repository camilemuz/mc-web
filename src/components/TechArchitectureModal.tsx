import React, { useState } from 'react';
import { playUiClick } from '../utils/soundEffects';
import { X, Cpu, Layers, Database, Palette, Sparkles, CheckCircle, Shield, Cloud, CreditCard, MessageSquare } from 'lucide-react';

interface TechArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechArchitectureModal: React.FC<TechArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ui' | 'arch' | 'ux' | 'stack' | 'db' | 'payments'>('ui');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-[#0D0D11] border border-neutral-700 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={() => {
            playUiClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-neutral-800 pb-4 mb-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E6002B] uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4" />
            <span>Documento de Arquitectura Web & Propuesta Senior</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            DOSSIER TÉCNICO: CLUB MC & ESCUELA MARTÍN CAREAGA
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Diseño de concepto, arquitectura de información, interacciones 3D, Cloudinary, pasarelas de pago en Bolivia y WhatsApp.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900/80 border border-neutral-800 rounded-xl mb-6 overflow-x-auto">
          {[
            { id: 'ui', label: '1. Concepto Visual & UI', icon: Palette },
            { id: 'arch', label: '2. Arquitectura de Secciones', icon: Layers },
            { id: 'ux', label: '3. Experiencia UX & 3D', icon: Sparkles },
            { id: 'stack', label: '4. Stack & Cloudinary', icon: Cloud },
            { id: 'db', label: '5. ¿Supabase o Firebase?', icon: Database },
            { id: 'payments', label: '6. Pasarelas Bolivia & WhatsApp', icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playUiClick();
                  setActiveTab(tab.id as any);
                }}
                className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#E6002B] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="overflow-y-auto pr-2 space-y-6 text-xs text-neutral-300 flex-1 leading-relaxed">
          {/* TAB 1: CONCEPTO VISUAL Y UI */}
          {activeTab === 'ui' && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold font-display text-white">
                1. PALETA DE COLORES Y SISTEMA VISUAL (CYBERPUNK DEPORTIVO PREMIUM)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#060608] rounded-xl border border-neutral-800">
                  <div className="w-full h-10 rounded-lg bg-[#060608] border border-neutral-700 mb-2" />
                  <span className="font-bold text-white block">#060608</span>
                  <span className="text-[10px] text-neutral-400">Canvas Base (Negro Carbono)</span>
                </div>
                <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800">
                  <div className="w-full h-10 rounded-lg bg-[#E6002B] mb-2" />
                  <span className="font-bold text-white block">#E6002B</span>
                  <span className="text-[10px] text-neutral-400">Rojo Pasión MC (Acento Primario)</span>
                </div>
                <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800">
                  <div className="w-full h-10 rounded-lg bg-[#FF1A40] mb-2" />
                  <span className="font-bold text-white block">#FF1A40</span>
                  <span className="text-[10px] text-neutral-400">Cyber Glow (Hover & Microestados)</span>
                </div>
                <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800">
                  <div className="w-full h-10 rounded-lg bg-[#FFFFFF] mb-2" />
                  <span className="font-bold text-white block">#FFFFFF</span>
                  <span className="text-[10px] text-neutral-400">Blanco Platino (Titulares Élite)</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">Estilo Visual y Texturas:</h4>
                <p>
                  - <strong>Glassmorphism deportivo sutil:</strong> Fondos oscuros con filtros de desenfoque (<code className="text-red-400">backdrop-blur-md</code>) y bordes hairline de 1px (<code className="text-red-400">border-neutral-800</code>) sin sombras pesadas artificiales.
                </p>
                <p>
                  - <strong>Textura abstracta de estadio y fibra de carbono:</strong> Micro-tramas radiales y cortes de césped geométricos que transmiten la atmósfera nocturna de un partido de copa bajo reflectores.
                </p>
                <p>
                  - <strong>Tipografías recomendadas:</strong> <em>Barlow Condensed / Oswald</em> (imponente, deportiva y condensada para dorsales y titulares) combinada con <em>Plus Jakarta Sans</em> (legibilidad perfecta para cuerpos de texto) y <em>JetBrains Mono</em> para cifras y estadísticas biométricas alineadas.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: ARQUITECTURA */}
          {activeTab === 'arch' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-white">
                2. ARQUITECTURA DE INFORMACIÓN Y SECCIONES ESTRATÉGICAS
              </h3>
              <p>
                La plataforma une armónicamente la exigencia profesional del <strong>Primer Plantel</strong> con el corazón pedagógico de la <strong>Escuela Formativa Martín Careaga</strong>:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 bg-neutral-900/60 rounded-xl border border-neutral-800">
                  <span className="font-bold text-white block">A. Hero Section & Próximo Partido:</span>
                  <span>Atmósfera inmersiva, cuenta regresiva en segundos al próximo encuentro, accesos rápidos a la escuela e indumentaria.</span>
                </div>
                <div className="p-3.5 bg-neutral-900/60 rounded-xl border border-neutral-800">
                  <span className="font-bold text-white block">B. Match Center en Vivo:</span>
                  <span>Pizarra táctica 4-3-3 interactiva con posiciones de jugadores, línea de tiempo minuto a minuto, xG y posesión animada.</span>
                </div>
                <div className="p-3.5 bg-neutral-900/60 rounded-xl border border-neutral-800">
                  <span className="font-bold text-white block">C. Plantilla de Jugadores 3D Tilt:</span>
                  <span>Tarjetas con respuesta giroscópica al mouse, métricas biométricas (velocidad km/h, pases, goles) y selector entre profesionales y cantera.</span>
                </div>
                <div className="p-3.5 bg-neutral-900/60 rounded-xl border border-neutral-800">
                  <span className="font-bold text-white block">D. Tienda Oficial & Simulador 3D:</span>
                  <span>Simulador de camiseta 3D con estampado en vivo de nombre y número, carrito reactivo y pasarela de pago simulada segura.</span>
                </div>
                <div className="p-3.5 bg-neutral-900/60 rounded-xl border border-neutral-800">
                  <span className="font-bold text-white block">E. Escuela de Fútbol Martín Careaga & Calendario:</span>
                  <span>Metodología por edades (Sub-8 a Sub-20), inscripción directa, descarga de agenda en formato .ICS y noticias oficiales.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: UX Y ANIMACIONES */}
          {activeTab === 'ux' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-white">
                3. LAS 3 INTERACCIONES CLAVE QUE DAN VIDA A LA WEB
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 bg-neutral-900/70 border border-neutral-800 rounded-xl">
                  <span className="font-bold text-[#E6002B] text-sm block mb-1">
                    1. Tarjetas 3D Tilt con Specular Glare
                  </span>
                  <p className="text-neutral-400">
                    Cálculo matemático en tiempo real del ángulo del cursor (rotateX / rotateY) con un reflejo radial que simula el brillo holográfico de las cartas de fútbol coleccionables.
                  </p>
                </div>

                <div className="p-4 bg-neutral-900/70 border border-neutral-800 rounded-xl">
                  <span className="font-bold text-[#E6002B] text-sm block mb-1">
                    2. Simulador de Camiseta 3D Flip
                  </span>
                  <p className="text-neutral-400">
                    Rotación isométrica de 180° entre el frente y el dorsal. Al escribir el nombre o cambiar el número, el SVG recalcula instantáneamente sombras, contornos y proporciones.
                  </p>
                </div>

                <div className="p-4 bg-neutral-900/70 border border-neutral-800 rounded-xl">
                  <span className="font-bold text-[#E6002B] text-sm block mb-1">
                    3. Micro-Audio Háptico Sintetizado
                  </span>
                  <p className="text-neutral-400">
                    Efectos de sonido sutiles generados vía Web Audio API nativo (clics futuristas, silbato de inicio y vítores de gol con confeti) con botón de silenciar/activar en la barra superior.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PILA TECNOLÓGICA & CLOUDINARY */}
          {activeTab === 'stack' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-white">
                4. PILA TECNOLÓGICA RECOMENDADA & SUBIDA GRATUITA CON CLOUDINARY
              </h3>

              <div className="space-y-3">
                <p>
                  <strong>Framework Frontend:</strong> <em>Next.js (App Router) o React + Vite</em>. Permite Server-Side Rendering (SSR) esencial para que los fichajes y noticias indexen primero en Google Deportes, con rendimiento Lighthouse de 95+.
                </p>
                <p>
                  <strong>Estilos y Animaciones:</strong> <em>Tailwind CSS v4 + Motion (Framer Motion)</em>. Proporciona aceleración por GPU (<code className="text-red-400">transform, opacity</code>) para garantizar 60/120 FPS sin bloqueos en móviles.
                </p>
                <p>
                  <strong>Subida de Medios 100% Gratis con Cloudinary:</strong>
                </p>
                <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800">
                  <p className="text-neutral-300 mb-2">
                    Cloudinary ofrece un tier gratuito generoso (25 créditos mensuales, ~25.000 transformaciones o 25 GB de almacenamiento gestionado).
                  </p>
                  <p className="text-neutral-400">
                    <strong>Integración recomendada:</strong> Usar el <em>Cloudinary Upload Widget</em> (sin backend requerido) con subidas directas desde el navegador a carpetas prefijadas (<code className="text-red-400">mc-club/jugadores</code>, <code className="text-red-400">mc-club/noticias</code>). Cloudinary comprime automáticamente a formato WebP/AVIF reduciendo el peso de las fotos en un 80%.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SUPABASE VS FIREBASE */}
          {activeTab === 'db' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-white">
                5. ANÁLISIS CRÍTICO: ¿ES MEJOR SUPABASE O FIREBASE PARA EL CLUB MC?
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Firebase Box */}
                <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-amber-400 text-sm">Firebase (Firestore + Auth)</span>
                    <span className="text-[10px] bg-amber-950 text-amber-400 px-1.5 py-0.5 rounded">Recomendado para en vivo</span>
                  </div>
                  <ul className="space-y-1.5 text-neutral-400 list-disc list-inside">
                    <li><strong className="text-neutral-200">Tiempo real nativo:</strong> <code className="text-red-400">onSnapshot()</code> permite que cuando un administrador cargue un gol o un cambio en el partido, los teléfonos de los 5.000 aficionados se actualicen al instante sin recargar la página.</li>
                    <li><strong className="text-neutral-200">Votación Fan Zone:</strong> Incrementos atómicos perfectos para el MVP del partido.</li>
                    <li><strong className="text-neutral-200">Tier gratuito:</strong> Muy amplio (50.000 lecturas diarias gratis).</li>
                  </ul>
                </div>

                {/* Supabase Box */}
                <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-emerald-400 text-sm">Supabase (PostgreSQL)</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded">Recomendado para E-commerce</span>
                  </div>
                  <ul className="space-y-1.5 text-neutral-400 list-disc list-inside">
                    <li><strong className="text-neutral-200">Relacional estricto:</strong> Ideal para stock de la tienda, talles, números de factura, carritos y transacciones financieras ACID.</li>
                    <li><strong className="text-neutral-200">Row Level Security (RLS):</strong> Políticas de seguridad nativas en Postgres.</li>
                    <li><strong className="text-neutral-200">Almacenamiento:</strong> Incluye Supabase Storage con soporte S3.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-[#E6002B]/10 border border-[#E6002B]/30 rounded-xl">
                <span className="font-bold text-white block mb-1">
                  Veredicto del Arquitecto Senior:
                </span>
                <p className="text-neutral-300">
                  <strong>Para este club, la combinación ganadora es:</strong> Usar <strong>Firebase Firestore</strong> si la prioridad número uno es el Match Center en vivo, marcadores en tiempo real y votaciones de los hinchas; o <strong>Supabase</strong> si el club planea procesar miles de transacciones de indumentaria y cuotas de socios con integridad relacional. Ambos cuentan con planes gratuitos de por vida excelentes.
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: PASARELAS DE PAGO EN BOLIVIA & WHATSAPP */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-white">
                6. PASARELAS DE PAGO EN BOLIVIA & NOTIFICACIONES POR WHATSAPP
              </h3>

              <p className="text-neutral-300">
                Para el mercado boliviano, el comercio electrónico tiene particularidades clave: la penetración de tarjetas de crédito internacionales es baja comparada con el uso masivo del <strong>código QR interbancario</strong> y <strong>WhatsApp</strong> como canal de cierre de ventas y soporte.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Gateway 1: QR Simple */}
                <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">1. QR Simple Bolivia (ASOBAN / BCB)</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-bold">El más popular</span>
                  </div>
                  <p className="text-neutral-400">
                    Es el sistema interoperable regulado por el Banco Central de Bolivia y ASFI. Permite transferencias inmediatas de cuenta a cuenta desde cualquier banco (BCP, Banco Unión, BNB, Mercantil Santa Cruz, Bisa, Ganadero, Sol, Fie, EcoFuturo).
                  </p>
                  <p className="text-emerald-400 text-[11px]">
                    ✓ Cero costo de comisión para el comprador. Validación rápida mediante comprobante en la app bancaria.
                  </p>
                </div>

                {/* Gateway 2: Libélula & Red Enlace */}
                <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">2. Libélula (Libelula.bo) & Red Enlace ATC</span>
                    <span className="text-[10px] bg-blue-950 text-blue-400 px-2 py-0.5 rounded font-bold">Pasarela Integral</span>
                  </div>
                  <p className="text-neutral-400">
                    <strong>Libélula</strong> es la pasarela líder de e-commerce en Bolivia: agrupa cobro por QR, tarjetas de débito/crédito habilitadas para compras por internet (Visa/Mastercard) y Tigo Money en una sola integración con webhooks automáticos.
                  </p>
                  <p className="text-blue-400 text-[11px]">
                    ✓ Acreditación a cuentas bancarias en Bolivia en Bolivianos (BOB - Bs.).
                  </p>
                </div>

                {/* Gateway 3: Tigo Money */}
                <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
                  <span className="font-bold text-white text-sm">3. Tigo Money Bolivia</span>
                  <p className="text-neutral-400">
                    Billetera móvil nacional de Tigo. Ideal para pagos rápidos desde celulares y puntos de recarga en barrios y ciudades de todo el país.
                  </p>
                </div>

                {/* Gateway 4: WhatsApp Integration */}
                <div className="p-4 bg-emerald-950/30 border border-emerald-800/60 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-emerald-300 text-sm">4. Flujo de Notificación a WhatsApp</span>
                  </div>
                  <p className="text-neutral-300">
                    Al solicitar o confirmar la compra en la tienda, el sistema genera automáticamente un mensaje estructurado hacia el WhatsApp oficial del club (<strong>+591 76543210</strong>) con:
                  </p>
                  <ul className="list-disc list-inside text-neutral-400 space-y-0.5">
                    <li>Código de Orden único (ej. MC-842918)</li>
                    <li>Lista de productos, tallas y personalizaciones (nombre y dorsal)</li>
                    <li>Total exacto en Bolivianos (Bs. BOB)</li>
                    <li>Datos de entrega del cliente</li>
                  </ul>
                  <p className="text-neutral-400 text-[11px] pt-1">
                    En producción, se puede conectar con la <strong>Meta WhatsApp Cloud API</strong> para enviar el aviso automáticamente tanto al teléfono del club como al del cliente.
                  </p>
                </div>
              </div>

              {/* Media upload gratis */}
              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                <span className="font-bold text-white block">
                  Subida Gratuita de Fotos por Administradores y Marketeros:
                </span>
                <p className="text-neutral-400">
                  En el <strong>Panel de Administración & Marketing (CMS)</strong>, los editores pueden subir imágenes directamente desde su computadora o móvil sin costo alguno. El sistema genera una vista previa instantánea (DataURL en base64) o se enlaza al plan gratuito de Cloudinary (25 GB gratis y compresión WebP sin pagar mensualidad).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-neutral-800 flex justify-end">
          <button
            onClick={() => {
              playUiClick();
              onClose();
            }}
            className="px-5 py-2 bg-[#E6002B] hover:bg-[#FF1A40] text-white font-semibold text-xs rounded-xl cursor-pointer transition-colors"
          >
            Entendido, Explorar la Web Oficial
          </button>
        </div>
      </div>
    </div>
  );
};
