import React, { useState } from 'react';
import { playUiClick, playGoalCheer } from '../utils/soundEffects';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle } from 'lucide-react';

export const ContactDirectSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Escuela Formativa Martín Careaga',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playGoalCheer();
    setSubmitted(true);
  };

  return (
    <section id="contacto" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-neutral-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E6002B] uppercase tracking-wider mb-2">
            <span>Canales Institucionales Oficiales</span>
            <span aria-hidden="true">·</span>
            <span>Atención Inmediata</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            CONTACTO DIRECTO & SEDES
          </h2>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            Comunícate directamente con la secretaría del club, el cuerpo técnico de Martín Careaga o el área de atención al socio.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Information & Sede Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0C0C0E] border border-neutral-800 rounded-2xl p-6 space-y-5">
            <h3 className="text-xl font-bold font-display text-white">
              SEDE CENTRAL & PREDIO DEPORTIVO
            </h3>

            <div className="space-y-4 text-xs text-neutral-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#E6002B] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Complejo Deportivo Martín Careaga</span>
                  <span className="text-neutral-400">Av. de los Deportes 1940, Campo de Entrenamiento 1, 2 y 3</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#E6002B] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">WhatsApp de la Escuela</span>
                  <span className="text-neutral-400">+54 9 11 5566-7788 (Atención de 09:00 a 20:00 hs)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#E6002B] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Correo Electrónico Institucional</span>
                  <span className="text-neutral-400">contacto@clubmartincareaga.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#E6002B] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Horarios de Secretaría</span>
                  <span className="text-neutral-400">Lunes a Sábados de 08:30 a 20:30 hs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Action Button */}
          <a
            href="https://wa.me/5491155667788?text=Hola,%20quisiera%20información%20sobre%20la%20Escuela%20de%20Fútbol%20Martín%20Careaga"
            target="_blank"
            rel="noopener noreferrer"
            onClick={playUiClick}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chatear por WhatsApp con la Escuela</span>
          </a>
        </div>

        {/* Direct Contact Form */}
        <div className="lg:col-span-7 bg-[#0A0A0C] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <h3 className="text-xl font-bold font-display text-white mb-2">
            ENVÍANOS TU CONSULTA
          </h3>
          <p className="text-xs text-neutral-400 mb-6">
            Te responderemos a la brevedad con toda la información sobre inscripciones, pruebas o torneos.
          </p>

          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold font-display text-white">
                ¡Mensaje Enviado con Éxito!
              </h4>
              <p className="text-xs text-neutral-300 max-w-sm mx-auto">
                Gracias {formData.name}, nos pondremos en contacto contigo vía correo electrónico o teléfono.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold uppercase text-neutral-400 block mb-1">
                    Tu Nombre y Apellido
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Marcelo Rossi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E6002B]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase text-neutral-400 block mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@correo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E6002B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold uppercase text-neutral-400 block mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+54 9 11..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E6002B]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase text-neutral-400 block mb-1">
                    Motivo de Consulta
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E6002B]"
                  >
                    <option value="Escuela Formativa Martín Careaga">Inscripción a Escuela de Fútbol</option>
                    <option value="Pruebas de Jugadores">Pruebas y Captación de Talentos</option>
                    <option value="Primer Plantel y Entradas">Primer Plantel & Entradas de Partido</option>
                    <option value="Tienda Oficial y Pedidos">Tienda Oficial & Envíos</option>
                    <option value="Prensa y Patrocinios">Prensa, Sponsors & Institucional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase text-neutral-400 block mb-1">
                  Mensaje o Detalle
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Escribe aquí tu consulta detallada..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E6002B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#E6002B] hover:bg-[#FF1A40] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#E6002B]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar Consulta Directa</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
