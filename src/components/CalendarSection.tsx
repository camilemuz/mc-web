import React, { useState } from 'react';
import { EVENTS_DATA } from '../data/mockData';
import { ClubEvent } from '../types';
import { playUiClick, playGoalCheer } from '../utils/soundEffects';
import { Calendar as CalendarIcon, MapPin, Clock, Download, Check, Bell } from 'lucide-react';

export const CalendarSection: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('Todos');
  const [remindedEvents, setRemindedEvents] = useState<Record<string, boolean>>({});

  const filteredEvents = EVENTS_DATA.filter((e) => {
    if (selectedFilter === 'Todos') return true;
    return e.category === selectedFilter;
  });

  const handleToggleReminder = (eventId: string) => {
    playUiClick();
    setRemindedEvents((prev) => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  const handleDownloadIcs = (event: ClubEvent) => {
    playUiClick();
    // Generate .ics calendar file
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Club MC Martin Careaga//ES',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      `STATUS:CONFIRMED`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `MC-${event.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="calendario" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-neutral-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E6002B] uppercase tracking-wider mb-2">
            <span>Agenda Deportiva Oficial</span>
            <span aria-hidden="true">·</span>
            <span>Fixture & Fechas Clave</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            CALENDARIO DE EVENTOS
          </h2>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            Partidos del Primer Plantel, jornadas de competencia de la Escuela Martín Careaga, clínicas de fútbol y pruebas de captación.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto">
          {['Todos', 'Primer Plantel', 'Escuela', 'Clínica', 'Pruebas'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playUiClick();
                setSelectedFilter(cat);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedFilter === cat
                  ? 'bg-[#E6002B] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Timeline / List */}
      <div className="space-y-4">
        {filteredEvents.map((ev) => (
          <div
            key={ev.id}
            className="bg-[#0C0C0E] border border-neutral-800 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-neutral-700 transition-all"
          >
            {/* Date Box */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-neutral-900 border border-[#E6002B]/40 flex flex-col items-center justify-center text-center shrink-0">
                <span className="text-[10px] text-[#E6002B] font-bold uppercase">
                  {ev.date.split(' ')[1]?.slice(0, 3) || 'OCT'}
                </span>
                <span className="text-2xl font-black font-display text-white">
                  {ev.date.split(' ')[0]}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold uppercase text-neutral-400">
                    {ev.category}
                  </span>
                  {ev.registrationOpen && (
                    <span className="text-[10px] bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold px-2 py-0.5 rounded">
                      Inscripciones Abiertas
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold font-display text-white">{ev.title}</h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-2xl">{ev.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    {ev.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    {ev.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-neutral-800">
              <button
                onClick={() => handleToggleReminder(ev.id)}
                className={`px-3 py-2 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                  remindedEvents[ev.id]
                    ? 'border-emerald-700 bg-emerald-950/60 text-emerald-300'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{remindedEvents[ev.id] ? 'Recordatorio Activado' : 'Recordar'}</span>
              </button>

              <button
                onClick={() => handleDownloadIcs(ev)}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Descargar archivo de calendario .ics"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Agendar .ICS</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
