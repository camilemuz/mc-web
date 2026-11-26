import React, { useState } from 'react';
import { playUiClick, playGoalCheer } from '../utils/soundEffects';
import { useSiteContent } from '../utils/ContentContext';
import { useTheme } from '../utils/ThemeContext';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  CheckCircle,
  Copy,
  Check,
  ExternalLink,
  Navigation
} from 'lucide-react';

import { AcademyLead } from '../types';

interface ContactDirectSectionProps {
  onNewLead?: (lead: AcademyLead) => void;
}

export const ContactDirectSection: React.FC<ContactDirectSectionProps> = ({ onNewLead }) => {
  const { content } = useSiteContent();
  const { theme } = useTheme();
  const clubInfo = content.clubInfo;

  const [submitted, setSubmitted] = useState(false);
  const [copiedMap, setCopiedMap] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Sub 7 a Sub 13 (15:00 a 16:30)',
    message: ''
  });

  const handleCopyLocation = async () => {
    playUiClick();
    try {
      await navigator.clipboard.writeText(clubInfo.mapsUrl);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = clubInfo.mapsUrl;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedMap(true);
    setTimeout(() => setCopiedMap(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playGoalCheer();
    if (onNewLead) {
      onNewLead({
        id: `contact-${Date.now()}`,
        studentName: formData.name.trim(),
        ageCategory: formData.subject,
        parentName: formData.email.trim() ? `${formData.name.trim()} (${formData.email.trim()})` : formData.name.trim(),
        parentPhone: formData.phone.trim(),
        branch: `${clubInfo.complexName}${formData.message.trim() ? ` · "${formData.message.trim().slice(0, 60)}"` : ''}`,
        createdAt: new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'short' }),
        status: 'Pendiente',
      });
    }
    setSubmitted(true);
  };

  const handleResetForm = () => {
    playUiClick();
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'Sub 7 a Sub 13 (15:00 a 16:30)',
      message: '',
    });
    setSubmitted(false);
  };

  return (
    <section id="contacto" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-slate-200 dark:border-neutral-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E6002B] uppercase tracking-wider mb-2">
            <span>Canales Institucionales Oficiales</span>
            <span aria-hidden="true">·</span>
            <span>Atención Inmediata</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
            SEDE DE ENTRENAMIENTO & CONTACTO DIRECTO
          </h2>
          <p className="text-sm text-slate-600 dark:text-neutral-400 mt-1 max-w-xl">
            Comunícate directamente con la secretaría del club, el cuerpo técnico de Martín Careaga o ven a entrenar a nuestro predio deportivo.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Information & Sede Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Sede Card */}
          <div className="bg-white dark:bg-[#0C0C0E] border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 space-y-5 shadow-md dark:shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6002B]/10 dark:bg-[#E6002B]/15 border border-[#E6002B]/30 flex items-center justify-center text-[#E6002B] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#E6002B] font-bold block">
                  Canchas Oficiales
                </span>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  {clubInfo.complexName}
                </h3>
                <span className="text-xs text-slate-500 dark:text-neutral-400 block font-sans">
                  {clubInfo.zone}, La Paz - Bolivia
                </span>
              </div>
            </div>

            {/* Training Schedules Notice */}
            <div className="bg-slate-50 dark:bg-neutral-900/80 rounded-xl p-4 border border-slate-200 dark:border-white/5 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-neutral-300 font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#E6002B]" />
                <span>Horarios de Entrenamiento por Categoría:</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-white dark:bg-neutral-950 p-3 rounded-lg border border-slate-200 dark:border-neutral-800">
                  <span className="text-[#E6002B] font-bold block text-sm">
                    Sub 7 a Sub 13
                  </span>
                  <span className="text-slate-900 dark:text-white font-black text-base block mt-0.5">
                    15:00 a 16:30
                  </span>
                  <span className="text-slate-500 dark:text-neutral-500 text-[10px] block mt-0.5">
                    Iniciación y Formación Base
                  </span>
                </div>

                <div className="bg-white dark:bg-neutral-950 p-3 rounded-lg border border-slate-200 dark:border-neutral-800">
                  <span className="text-[#E6002B] font-bold block text-sm">
                    Sub 15 a Sub 19
                  </span>
                  <span className="text-slate-900 dark:text-white font-black text-base block mt-0.5">
                    16:30 a 18:00
                  </span>
                  <span className="text-slate-500 dark:text-neutral-500 text-[10px] block mt-0.5">
                    Competitivo y Pre-Élite
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 text-xs text-slate-700 dark:text-neutral-300 pt-2 border-t border-slate-200 dark:border-neutral-800/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex items-center justify-center text-[#E6002B] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">WhatsApp de la Escuela</span>
                  <span className="text-slate-600 dark:text-neutral-400">{clubInfo.whatsapp}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex items-center justify-center text-[#E6002B] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">Correo Electrónico Institucional</span>
                  <span className="text-slate-600 dark:text-neutral-400">{clubInfo.email}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons: Copy Location & Open Maps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopyLocation}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-slate-300 dark:border-neutral-700 text-slate-900 dark:text-white font-mono uppercase tracking-wider text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                {copiedMap ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#E6002B]" />
                    <span>Copiar Ubicación</span>
                  </>
                )}
              </button>

              <a
                href={clubInfo.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playUiClick}
                className="py-3 px-4 bg-[#E6002B] hover:bg-[#FF1A40] text-white font-mono uppercase tracking-wider text-xs font-bold rounded-xl transition-all shadow-md shadow-[#E6002B]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Navigation className="w-4 h-4" />
                <span>Abrir en Maps</span>
              </a>
            </div>

            {/* WhatsApp Direct Link */}
            <a
              href={`https://wa.me/${clubInfo.whatsapp.replace(/[^0-9]/g, '')}?text=Hola,%20quisiera%20información%20sobre%20los%20entrenamientos%20en%20el%20Complejo%20Social%20Litoral`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playUiClick}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chatear por WhatsApp con la Escuela</span>
            </a>
          </div>

          {/* Interactive Google Maps Frame */}
          <div className="bg-white dark:bg-[#0C0C0E] border border-slate-200 dark:border-neutral-800 rounded-2xl p-3 overflow-hidden shadow-md dark:shadow-xl">
            <div className="relative w-full h-[240px] rounded-xl overflow-hidden border border-slate-200 dark:border-neutral-800">
              <iframe
                title="Ubicación Complejo Deportivo Social Litoral"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1912.8795552319488!2d-68.1008333!3d-16.5405556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915f20d982f7e719%3A0x9caa6c5f5a817b92!2sClub%20Social%20y%20Deportivo%20Litoral!5e0!3m2!1ses!2sbo!4v1710000000000!5m2!1ses!2sbo"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: theme === 'dark' ? 'invert(90%) hue-rotate(180deg)' : 'none',
                }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="p-2 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-neutral-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E6002B]" />
                <span>Bajo Següencoma, La Paz</span>
              </span>
              <a
                href={clubInfo.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E6002B] hover:underline flex items-center gap-1"
              >
                <span>Ver en pantalla completa</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Direct Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0A0A0C] border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-md dark:shadow-xl">
          <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
            ENVÍANOS TU CONSULTA O INSCRIPCIÓN
          </h3>
          <p className="text-xs text-slate-600 dark:text-neutral-400 mb-6">
            Te responderemos a la brevedad con toda la información sobre inscripciones, pruebas o torneos en el Complejo Social Litoral.
          </p>

          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                ¡Mensaje Enviado con Éxito!
              </h4>
              <p className="text-xs text-slate-600 dark:text-neutral-400 max-w-sm mx-auto">
                Hemos recibido tu solicitud. Nuestro equipo de coordinación técnica te contactará por WhatsApp para confirmar los horarios de tu categoría.
              </p>
              <button
                type="button"
                onClick={handleResetForm}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-xs font-mono text-white rounded-lg transition-colors cursor-pointer"
              >
                Enviar otra consulta
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-600 dark:text-neutral-400 block mb-1.5">
                    Nombre del Alumno o Tutor *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Carlos Mendoza"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-neutral-900/90 border border-slate-300 dark:border-neutral-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-[#E6002B] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-600 dark:text-neutral-400 block mb-1.5">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+591 76543210"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-neutral-900/90 border border-slate-300 dark:border-neutral-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-[#E6002B] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-600 dark:text-neutral-400 block mb-1.5">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tucorreo@ejemplo.com"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-neutral-900/90 border border-slate-300 dark:border-neutral-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-[#E6002B] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-600 dark:text-neutral-400 block mb-1.5">
                    Categoría / Motivo
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-neutral-900/90 border border-slate-300 dark:border-neutral-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#E6002B] transition-colors"
                  >
                    <option value="Sub 7 a Sub 13 (15:00 a 16:30)">Inscripción Sub 7 a Sub 13 (15:00 a 16:30)</option>
                    <option value="Sub 15 a Sub 19 (16:30 a 18:00)">Inscripción Sub 15 a Sub 19 (16:30 a 18:00)</option>
                    <option value="Pruebas de Captación Primer Plantel">Pruebas Primer Plantel</option>
                    <option value="Consulta General">Otra Consulta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-600 dark:text-neutral-400 block mb-1.5">
                  Mensaje o Consulta
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Escribe aquí tu consulta sobre horarios, indumentaria o pruebas..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-neutral-900/90 border border-slate-300 dark:border-neutral-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-[#E6002B] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                onClick={playUiClick}
                className="w-full py-3.5 bg-[#E6002B] hover:bg-[#FF1A40] text-white font-mono uppercase tracking-wider font-bold text-xs rounded-xl transition-all shadow-lg shadow-[#E6002B]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Solicitud a la Secretaría MC</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
