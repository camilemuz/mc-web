import React, { useState } from 'react';
import { playUiClick, playWhoosh, playGoalCheer } from '../utils/soundEffects';
import { Award, BookOpen, Shield, Target, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { AcademyLead } from '../types';

interface AcademySectionProps {
  onNewLead?: (lead: AcademyLead) => void;
}

export const AcademySection: React.FC<AcademySectionProps> = ({ onNewLead }) => {
  const [selectedCategory, setSelectedCategory] = useState<'semillero' | 'tecnificacion' | 'elite'>('semillero');
  const [registrationSubmitted, setRegistrationSubmitted] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [selectedAge, setSelectedAge] = useState('Sub-12');
  const [selectedBranch, setSelectedBranch] = useState('Sede Central - Club Deportivo Litoral');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    playGoalCheer();
    setRegistrationSubmitted(true);
    if (onNewLead) {
      onNewLead({
        id: `lead-${Date.now()}`,
        studentName,
        ageCategory: selectedAge,
        parentName,
        parentPhone,
        branch: selectedBranch,
        createdAt: 'Hoy, 2026',
        status: 'Pendiente'
      });
    }
  };

  return (
    <section id="escuela" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-neutral-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E6002B] uppercase tracking-wider mb-2">
            <span>Formación de Futbolistas Integrales</span>
            <span aria-hidden="true">·</span>
            <span>Semillero Oficial MC</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            ESCUELA DE FÚTBOL MARTÍN CAREAGA
          </h2>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            La cantera donde nacen las estrellas. Metodología profesional con valores deportivos, seguimiento académico y proyección directa al Primer Plantel.
          </p>
        </div>

        {/* Quick Quote pill */}
        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl max-w-sm">
          <p className="text-xs text-neutral-300 italic">
            "Enseñar fútbol es educar para la vida: el esfuerzo, el compañerismo y la perseverancia nunca se negocian."
          </p>
          <span className="text-[11px] font-bold text-[#E6002B] block mt-1">
            — Martín Careaga, Director General
          </span>
        </div>
      </div>

      {/* 3 Pillars Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-[#0C0C0E] border border-neutral-800 rounded-2xl p-6 relative overflow-hidden group hover:border-neutral-700 transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#E6002B]/10 border border-[#E6002B]/30 flex items-center justify-center text-[#E6002B] mb-4">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-display text-white mb-2">
            Metodología Careaga Pro
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Ejercicios situacionales con balón, toma de decisiones bajo presión y desarrollo de la técnica individual depurada desde edades tempranas.
          </p>
          <div className="mt-4 pt-4 border-t border-neutral-800/80 text-[11px] text-neutral-500">
            3 entrenamientos semanales + partido de Competencia
          </div>
        </div>

        <div className="bg-[#0C0C0E] border border-neutral-800 rounded-2xl p-6 relative overflow-hidden group hover:border-neutral-700 transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-display text-white mb-2">
            Seguimiento Integral & Valores
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Acompañamiento pedagógico escolar, nutrición deportiva personalizada y apoyo psicológico para potenciar la autoestima y la resiliencia del deportista.
          </p>
          <div className="mt-4 pt-4 border-t border-neutral-800/80 text-[11px] text-neutral-500">
            Gabinete psicopedagógico permanente
          </div>
        </div>

        <div className="bg-[#0C0C0E] border border-neutral-800 rounded-2xl p-6 relative overflow-hidden group hover:border-neutral-700 transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#E6002B]/10 border border-[#E6002B]/30 flex items-center justify-center text-[#FF2E50] mb-4">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-display text-white mb-2">
            Puente al Primer Plantel
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Visorías continuas con el cuerpo técnico de Martín Careaga. Más de 30 futbolistas surgidos de la escuela ya compiten en ligas de primera división.
          </p>
          <div className="mt-4 pt-4 border-t border-neutral-800/80 text-[11px] text-neutral-500">
            Convenios con clubes profesionales
          </div>
        </div>
      </div>

      {/* Categories Details & Direct Enrollment Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Categories Explorer */}
        <div className="lg:col-span-7 bg-[#0A0A0C] border border-neutral-800 rounded-2xl p-6 sm:p-8">
          <h3 className="text-xl font-bold font-display text-white mb-6">
            PROGRAMAS POR EDADES
          </h3>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { id: 'semillero', title: 'Semillero (Sub-6 a Sub-10)' },
              { id: 'tecnificacion', title: 'Desarrollo (Sub-11 a Sub-14)' },
              { id: 'elite', title: 'Alto Rendimiento (Sub-15 a Sub-20)' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  playUiClick();
                  setSelectedCategory(cat.id as any);
                }}
                className={`p-3 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'border-[#E6002B] bg-[#E6002B]/10 text-white'
                    : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {selectedCategory === 'semillero' && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">Etapa Semillero: Sub 7 a Sub 13</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Foco en la psicomotricidad básica, el dominio del balón en espacios reducidos y el amor genuino por el juego. Los niños aprenden a compartir la pelota, respetar las reglas y disfrutar cada entrenamiento.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-neutral-900/70 rounded-lg border border-neutral-800">
                  <span className="text-neutral-500 uppercase text-[10px] block">Horarios Oficiales</span>
                  <span className="font-semibold text-[#E6002B]">15:00 a 16:30 hs</span>
                </div>
                <div className="p-3 bg-neutral-900/70 rounded-lg border border-neutral-800">
                  <span className="text-neutral-500 uppercase text-[10px] block">Canchas & Sede</span>
                  <span className="font-semibold text-white">Complejo Deportivo Social Litoral (Bajo Següencoma)</span>
                </div>
              </div>
            </div>
          )}

          {selectedCategory === 'tecnificacion' && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">Etapa Desarrollo: Sub 11 a Sub 14</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Entrenamiento enfocado en la comprensión posicional, perfiles corporales en la recepción, golpeo con ambas piernas y transiciones rápidas de defensa a ataque.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-neutral-900/70 rounded-lg border border-neutral-800">
                  <span className="text-neutral-500 uppercase text-[10px] block">Horarios Oficiales</span>
                  <span className="font-semibold text-[#E6002B]">15:00 a 16:30 hs</span>
                </div>
                <div className="p-3 bg-neutral-900/70 rounded-lg border border-neutral-800">
                  <span className="text-neutral-500 uppercase text-[10px] block">Canchas & Sede</span>
                  <span className="font-semibold text-white">Complejo Deportivo Social Litoral (Bajo Següencoma)</span>
                </div>
              </div>
            </div>
          )}

          {selectedCategory === 'elite' && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">Alto Rendimiento: Sub 15 a Sub 19</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Régimen similar al Primer Plantel: preparación física con GPS, análisis de video táctico, trabajo específico por puestos y participación en los torneos más competitivos de la región.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-neutral-900/70 rounded-lg border border-neutral-800">
                  <span className="text-neutral-500 uppercase text-[10px] block">Horarios Oficiales</span>
                  <span className="font-semibold text-[#E6002B]">16:30 a 18:00 hs</span>
                </div>
                <div className="p-3 bg-neutral-900/70 rounded-lg border border-neutral-800">
                  <span className="text-neutral-500 uppercase text-[10px] block">Canchas & Sede</span>
                  <span className="font-semibold text-white">Complejo Deportivo Social Litoral (Bajo Següencoma)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Direct Enrollment Form */}
        <div className="lg:col-span-5 bg-[#0C0C0E] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="border-b border-neutral-800 pb-4 mb-5">
            <span className="text-xs uppercase tracking-wider text-[#E6002B] font-semibold block mb-1">
              Admisiones Abiertas
            </span>
            <h3 className="text-xl font-bold font-display text-white">
              INSCRIPCIÓN DIRECTA A LA ESCUELA
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Completa el formulario para reservar una clase de prueba gratuita con los profesores.
            </p>
          </div>

          {registrationSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold font-display text-white">
                ¡Solicitud Registrada en el Club!
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Hemos registrado a <strong className="text-white">{studentName}</strong> ({selectedAge}) para la sede {selectedBranch}.
              </p>

              <div className="pt-2 max-w-sm mx-auto space-y-2">
                <a
                  href={`https://wa.me/59176543210?text=${encodeURIComponent(
                    `⚽ *SOLICITUD DE CLASE DE PRUEBA - ESCUELA MARTÍN CAREAGA*\n\n` +
                    `👤 *Alumno:* ${studentName}\n` +
                    `🎂 *Categoría:* ${selectedAge}\n` +
                    `👨‍👩‍👦 *Tutor:* ${parentName}\n` +
                    `📱 *Teléfono:* ${parentPhone}\n` +
                    `🏟️ *Sede de Preferencia:* ${selectedBranch}\n\n` +
                    `Hola, acabo de registrar la solicitud en la web oficial y deseo confirmar el día y horario del entrenamiento de bienvenida.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playUiClick}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Notificar Inscripción por WhatsApp (+591 76543210)</span>
                </a>
              </div>

              <div>
                <button
                  onClick={() => setRegistrationSubmitted(false)}
                  className="mt-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Inscribir a otro alumno
                </button>
              </div>
            </div> 
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold uppercase text-neutral-400 block mb-1">
                  Nombre y Apellido del Alumno
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Nicolás Gómez"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E6002B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase text-neutral-400 block mb-1">
                    Categoría / Edad
                  </label>
                  <select
                    value={selectedAge}
                    onChange={(e) => setSelectedAge(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E6002B]"
                  >
                    <option value="Sub-8">Sub-8 (6 a 8 años)</option>
                    <option value="Sub-10">Sub-10 (9 a 10 años)</option>
                    <option value="Sub-12">Sub-12 (11 a 12 años)</option>
                    <option value="Sub-14">Sub-14 (13 a 14 años)</option>
                    <option value="Sub-16">Sub-16 (15 a 16 años)</option>
                    <option value="Sub-18">Sub-18 (17 a 18 años)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase text-neutral-400 block mb-1">
                    Sede de Preferencia
                  </label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E6002B]"
                  >
                    <option value="Complejo Deportivo Social Litoral (Bajo Següencoma)">Complejo Social Litoral (Bajo Següencoma)</option>
                    <option value="Sede Central - Cancha 1">Complejo Social Litoral - Cancha Sintética</option>
                    <option value="Sede Central - Cancha 2">Complejo Social Litoral - Cancha Césped Natural</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase text-neutral-400 block mb-1">
                  Nombre del Padre / Madre / Tutor
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Marcelo Gómez"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E6002B]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase text-neutral-400 block mb-1">
                  Teléfono / WhatsApp de Contacto
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+54 9 11 4455-6677"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E6002B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#E6002B] hover:bg-[#FF1A40] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#E6002B]/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Solicitar Clase de Prueba Gratuita</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
