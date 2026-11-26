import React, { useState } from 'react';
import { ClubEvent } from '../types';
import { useSiteContent } from '../utils/ContentContext';
import { playUiClick, playGoalCheer } from '../utils/soundEffects';
import { Calendar as CalendarIcon, MapPin, Clock, Download, Check, Bell } from 'lucide-react';

export const CalendarSection: React.FC = () => {
  const { content } = useSiteContent();
  const EVENTS_DATA = content.events;
  const [selectedFilter, setSelectedFilter] = useState<string>('Todos');
  const [remindedEvents, setRemindedEvents] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('mc_event_reminders_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  const filteredEvents = EVENTS_DATA.filter((e) => {
    if (selectedFilter === 'Todos') return true;
    return e.category === selectedFilter;
  });

  const handleToggleReminder = (eventId: string) => {
    playUiClick();
    setRemindedEvents((prev) => {
      const next = { ...prev, [eventId]: !prev[eventId] };
      try {
        localStorage.setItem('mc_event_reminders_v1', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleDownloadIcs = (event: ClubEvent) => {
    playUiClick();
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}00Z`;
    const monthMap: Record<string, string> = {
      ene: '01', feb: '02', mar: '03', abr: '04', may: '05', jun: '06',
      jul: '07', ago: '08', sep: '09', oct: '10', nov: '11', dic: '12',
    };
    const parts = event.date.toLowerCase().split(/\s+/);
    const dayNum = pad(parseInt(parts[0], 10) || 15);
    const monthKey = (parts[1] || 'oct').slice(0, 3);
    const monthNum = monthMap[monthKey] || '10';
    const yearNum = parts[2] || String(now.getFullYear());
    const timeMatch = event.time.match(/(\d{1,2}):(\d{2})/);
    const startHour = pad(timeMatch ? parseInt(timeMatch[1], 10) : 15);
    const startMin = pad(timeMatch ? parseInt(timeMatch[2], 10) : 0);
    const endHour = pad(Math.min(23, (timeMatch ? parseInt(timeMatch[1], 10) : 15) + 2));
    const dtStart = `${yearNum}${monthNum}${dayNum}T${startHour}${startMin}00`;
    const dtEnd = `${yearNum}${monthNum}${dayNum}T${endHour}${startMin}00`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Club MC Martin Careaga//ES',
      'BEGIN:VEVENT',
      `UID:${event.id}@martincareaga.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MC-${event.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <section id="calendario" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-slate-200 dark:border-neutral-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E6002B] uppercase tracking-wider mb-2">
            <span>Agenda Deportiva Oficial</span>
            <span aria-hidden="true">·</span>
            <span>Fixture & Fechas Clave</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
            CALENDARIO DE EVENTOS
          </h2>
          <p className="text-sm text-slate-600 dark:text-neutral-400 mt-1 max-w-xl">
            Partidos del Primer Plantel, jornadas de competencia de la Escuela Martín Careaga, clínicas de fútbol y pruebas de captación.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl overflow-x-auto">
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
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
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
            className="bg-white dark:bg-[#0C0C0E] border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-slate-300 dark:hover:border-neutral-700 shadow-sm dark:shadow-none transition-all"
          >
            {/* Date Box */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-[#E6002B]/40 flex flex-col items-center justify-center text-center shrink-0">
                <span className="text-[10px] text-[#E6002B] font-bold uppercase">
                  {ev.date.split(' ')[1]?.slice(0, 3) || 'OCT'}
                </span>
                <span className="text-2xl font-black font-display text-slate-900 dark:text-white">
                  {ev.date.split(' ')[0]}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold uppercase text-slate-500 dark:text-neutral-400">
                    {ev.category}
                  </span>
                  {ev.registrationOpen && (
                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded">
                      Inscripciones Abiertas
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">{ev.title}</h3>
                <p className="text-xs text-slate-600 dark:text-neutral-400 mt-1 max-w-2xl">{ev.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-neutral-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-400" />
                    {ev.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-400" />
                    {ev.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-neutral-800">
              <button
                onClick={() => handleToggleReminder(ev.id)}
                className={`px-3 py-2 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                  remindedEvents[ev.id]
                    ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-slate-700 dark:text-neutral-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{remindedEvents[ev.id] ? 'Recordatorio Activado' : 'Recordar'}</span>
              </button>

              <button
                onClick={() => handleDownloadIcs(ev)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white bg-white hover:bg-slate-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
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
