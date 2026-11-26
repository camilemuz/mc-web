import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  HERO as DEFAULT_HERO,
  SQUADS_DATA as DEFAULT_SQUADS,
  METHOD_STEPS as DEFAULT_METHOD_STEPS,
  METHOD_METRICS as DEFAULT_METHOD_METRICS,
  STAFF_DATA as DEFAULT_STAFF,
  MEMBERSHIPS_DATA as DEFAULT_MEMBERSHIPS,
  FAQ_DATA as DEFAULT_FAQ,
  DOMAINS as DEFAULT_DOMAINS,
  CLAIMS as DEFAULT_CLAIMS,
  SquadItem,
} from '../content';
export type { SquadItem };
import { EVENTS_DATA as DEFAULT_EVENTS } from '../data/mockData';
import { ClubEvent } from '../types';

export interface HeroData {
  headline: string[];
  lede: string;
  cta: string;
  badge: [string, string, string];
  learners: { value: string; label: string };
  sessions: { value: string; label: string };
  dataPoints: { value: string; label: string };
  avgScore: { value: string; label: string };
  insight: { kicker: string; title: string };
}

export interface MethodStep {
  step: string;
  title: string;
  body: string;
}

export interface MethodMetric {
  value: number;
  suffix: string;
  label: string;
}

export interface StaffMember {
  name: string;
  role: string;
  line: string;
  badge: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  monthly: number;
  annual: number;
  tagline: string;
  features: string[];
  cta: string;
  featured: boolean;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ClubInfo {
  clubName: string;
  coachName: string;
  season: string;
  slogan: string;
  whatsapp: string;
  phone: string;
  email: string;
  complexName: string;
  zone: string;
  address: string;
  scheduleGroup1: string;
  scheduleGroup2: string;
  schedule: string;
  mapsUrl: string;
  instagram: string;
  facebook: string;
}

export interface AboutPillar {
  id: string;
  title: string;
  description: string;
}

export interface AboutUsData {
  kicker: string;
  title: string;
  subtitle: string;
  missionTitle: string;
  missionBody: string;
  visionTitle: string;
  visionBody: string;
  pillars: AboutPillar[];
}

export const DEFAULT_ABOUT_US: AboutUsData = {
  kicker: 'Identidad Institucional · Club MC',
  title: 'FORMAMOS PERSONAS, PROYECTAMOS TALENTOS',
  subtitle:
    'Más que una escuela de fútbol: una comunidad formativa en Bolivia que acompaña el crecimiento integral de cada niño y joven hacia el fútbol profesional.',
  missionTitle: 'Misión',
  missionBody:
    'Formar integralmente a niños y jóvenes a través del deporte, potenciando sus habilidades deportivas junto con su desarrollo emocional, espiritual y social.',
  visionTitle: 'Visión',
  visionBody:
    'Consolidarnos como un club referente en Bolivia que proyecte a jóvenes talentos hacia la máxima categoría del fútbol profesional, brindándoles las herramientas necesarias para representar al país mientras crecemos y evolucionamos junto a ellos.',
  pillars: [
    {
      id: 'deportivo',
      title: 'Deportivo',
      description:
        'Metodología táctica y técnica avalada por la FBF para maximizar el potencial competitivo desde la base hasta la élite.',
    },
    {
      id: 'emocional',
      title: 'Emocional',
      description:
        'Acompañamiento para fortalecer la confianza, el autocontrol, la disciplina y la resiliencia dentro y fuera de la cancha.',
    },
    {
      id: 'espiritual',
      title: 'Espiritual',
      description:
        'Formación en valores, propósito de vida, humildad en la victoria y gratitud en cada etapa del proceso formativo.',
    },
    {
      id: 'social',
      title: 'Social',
      description:
        'Trabajo en equipo, respeto mutuo y sentido de pertenencia junto a familias comprometidas con el sueño de cada jugador.',
    },
  ],
};

export interface HeroPlayer {
  id: string;
  name: string;
  nickname: string;
  number: number;
  position: string;
  category: string;
  role: string;
  image: string;
}

export const DEFAULT_HERO_PLAYERS: HeroPlayer[] = [
  {
    id: 'p-2',
    name: 'Lucas Benítez',
    nickname: 'El Mago',
    number: 10,
    position: 'Mediocampista',
    category: 'Primer Plantel',
    role: 'Capitán & Creador',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-1',
    name: 'Mateo Valenzuela',
    nickname: 'El Rayo',
    number: 9,
    position: 'Delantero',
    category: 'Primer Plantel',
    role: 'Goleador Implacable',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-3',
    name: 'Joaquín Navarro',
    nickname: 'El Muro',
    number: 2,
    position: 'Defensa',
    category: 'Primer Plantel',
    role: 'Líder de Zaga',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-4',
    name: 'Tomás Herrera',
    nickname: 'San Tomás',
    number: 1,
    position: 'Arquero',
    category: 'Primer Plantel',
    role: 'Cerrojo del Arco',
    image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&w=800&q=80',
  },
];

export interface SiteContentState {
  hero: HeroData;
  aboutUs: AboutUsData;
  heroPlayers: HeroPlayer[];
  squads: SquadItem[];
  methodSteps: MethodStep[];
  methodMetrics: MethodMetric[];
  staff: StaffMember[];
  memberships: MembershipPlan[];
  faq: FaqItem[];
  domains: string[];
  claims: string[];
  clubInfo: ClubInfo;
  events: ClubEvent[];
}

export const DEFAULT_CLUB_INFO: ClubInfo = {
  clubName: 'Club MC Emprender & Escuela de Fútbol Martín Careaga',
  coachName: 'Martín Careaga',
  season: 'Temporada 2026/27',
  slogan: 'Cumpliendo Sueños',
  whatsapp: '+591 76543210',
  phone: '+591 2 2456789',
  email: 'contacto@martincareaga.com',
  complexName: 'Complejo Deportivo Social Litoral',
  zone: 'Bajo Següencoma',
  address: 'Complejo Deportivo Social Litoral, Bajo Següencoma, La Paz, Bolivia',
  scheduleGroup1: 'Sub 7 a Sub 13: 15:00 a 16:30',
  scheduleGroup2: 'Sub 15 a Sub 19: 16:30 a 18:00',
  schedule: 'Sub 7 a Sub 13: 15:00 a 16:30 | Sub 15 a Sub 19: 16:30 a 18:00',
  mapsUrl: 'https://www.google.com/maps/place/Club+Social+y+Deportivo+Litoral/@-16.5398691,-68.100557,18z/data=!4m6!3m5!1s0x915f20d982f7e719:0x9caa6c5f5a817b92!8m2!3d-16.5405556!4d-68.1008333!16s%2Fg%2F1tdygpvq',
  instagram: 'https://instagram.com/clubcareagamc',
  facebook: 'https://facebook.com/clubcareagamc',
};

const INITIAL_CONTENT: SiteContentState = {
  hero: {
    headline: [...DEFAULT_HERO.headline],
    lede: DEFAULT_HERO.lede,
    cta: DEFAULT_HERO.cta,
    badge: [...DEFAULT_HERO.badge] as [string, string, string],
    learners: { ...DEFAULT_HERO.learners },
    sessions: { ...DEFAULT_HERO.sessions },
    dataPoints: { ...DEFAULT_HERO.dataPoints },
    avgScore: { ...DEFAULT_HERO.avgScore },
    insight: { ...DEFAULT_HERO.insight },
  },
  aboutUs: {
    ...DEFAULT_ABOUT_US,
    pillars: DEFAULT_ABOUT_US.pillars.map((p) => ({ ...p })),
  },
  heroPlayers: DEFAULT_HERO_PLAYERS.map((p) => ({ ...p })),
  squads: DEFAULT_SQUADS.map((s) => ({ ...s, metrics: s.metrics.map((m) => ({ ...m })) })),
  methodSteps: DEFAULT_METHOD_STEPS.map((s) => ({ ...s })),
  methodMetrics: DEFAULT_METHOD_METRICS.map((m) => ({ ...m })),
  staff: DEFAULT_STAFF.map((st) => ({ ...st })),
  memberships: DEFAULT_MEMBERSHIPS.map((mem) => ({ ...mem, features: [...mem.features] })),
  faq: DEFAULT_FAQ.map((f) => ({ ...f })),
  domains: [...DEFAULT_DOMAINS],
  claims: [...DEFAULT_CLAIMS],
  clubInfo: { ...DEFAULT_CLUB_INFO },
  events: DEFAULT_EVENTS.map((e) => ({ ...e })),
};

const STORAGE_KEY = 'mc_site_content_dynamic_v6';

interface ContentContextType {
  content: SiteContentState;
  updateHero: (hero: Partial<HeroData>) => void;
  updateAboutUs: (about: Partial<AboutUsData>) => void;
  updateHeroPlayers: (players: HeroPlayer[]) => void;
  updateSquads: (squads: SquadItem[]) => void;
  updateMethodSteps: (steps: MethodStep[]) => void;
  updateMethodMetrics: (metrics: MethodMetric[]) => void;
  updateStaff: (staff: StaffMember[]) => void;
  updateMemberships: (memberships: MembershipPlan[]) => void;
  updateFaq: (faq: FaqItem[]) => void;
  updateDomains: (domains: string[]) => void;
  updateClaims: (claims: string[]) => void;
  updateClubInfo: (info: Partial<ClubInfo>) => void;
  updateEvents: (events: ClubEvent[]) => void;
  resetAllContent: () => void;
  exportContentJson: () => string;
  importContentJson: (jsonString: string) => boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContentState>(() => {
    try {
      // Clean up legacy keys that contain obsolete headline
      ['mc_site_content', 'mc_site_content_dynamic_v1', 'mc_site_content_dynamic_v2', 'mc_site_content_dynamic_v3'].forEach(k => {
        try { localStorage.removeItem(k); } catch { /* ignore */ }
      });

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const heroMerged = { ...INITIAL_CONTENT.hero, ...(parsed.hero || {}) };
        
        // Sanitize any outdated headline containing 'Táctica'
        if (heroMerged.headline && heroMerged.headline.some((w: string) => w.toLowerCase().includes('táctica') || w.toLowerCase().includes('tactica'))) {
          heroMerged.headline = [...INITIAL_CONTENT.hero.headline];
        }

        // Ensure heroPlayers and 200 Bs memberships are always present
        const heroPlayersMerged = (parsed.heroPlayers && parsed.heroPlayers.length > 0)
          ? parsed.heroPlayers
          : INITIAL_CONTENT.heroPlayers;

        const membershipsMerged = (parsed.memberships && parsed.memberships.length > 0)
          ? parsed.memberships.map((m: any) => ({ ...m, monthly: 200, features: m.features || [] }))
          : INITIAL_CONTENT.memberships;

        return {
          ...INITIAL_CONTENT,
          ...parsed,
          hero: heroMerged,
          aboutUs: {
            ...INITIAL_CONTENT.aboutUs,
            ...(parsed.aboutUs || {}),
            pillars:
              parsed.aboutUs?.pillars && parsed.aboutUs.pillars.length > 0
                ? parsed.aboutUs.pillars
                : INITIAL_CONTENT.aboutUs.pillars,
          },
          heroPlayers: heroPlayersMerged,
          memberships: membershipsMerged,
          clubInfo: { ...INITIAL_CONTENT.clubInfo, ...(parsed.clubInfo || {}), clubName: 'Club MC Emprender & Escuela de Fútbol Martín Careaga', slogan: 'Cumpliendo Sueños' },
        };
      }
    } catch {
      // fallback to initial
    }
    return INITIAL_CONTENT;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {
      // storage quota or disabled
    }
  }, [content]);

  const updateHero = (patch: Partial<HeroData>) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...patch },
    }));
  };

  const updateAboutUs = (patch: Partial<AboutUsData>) => {
    setContent((prev) => ({
      ...prev,
      aboutUs: { ...prev.aboutUs, ...patch },
    }));
  };

  const updateHeroPlayers = (heroPlayers: HeroPlayer[]) => {
    setContent((prev) => ({ ...prev, heroPlayers }));
  };

  const updateSquads = (squads: SquadItem[]) => {
    setContent((prev) => ({ ...prev, squads }));
  };

  const updateMethodSteps = (methodSteps: MethodStep[]) => {
    setContent((prev) => ({ ...prev, methodSteps }));
  };

  const updateMethodMetrics = (methodMetrics: MethodMetric[]) => {
    setContent((prev) => ({ ...prev, methodMetrics }));
  };

  const updateStaff = (staff: StaffMember[]) => {
    setContent((prev) => ({ ...prev, staff }));
  };

  const updateMemberships = (memberships: MembershipPlan[]) => {
    setContent((prev) => ({ ...prev, memberships }));
  };

  const updateFaq = (faq: FaqItem[]) => {
    setContent((prev) => ({ ...prev, faq }));
  };

  const updateDomains = (domains: string[]) => {
    setContent((prev) => ({ ...prev, domains }));
  };

  const updateClaims = (claims: string[]) => {
    setContent((prev) => ({ ...prev, claims }));
  };

  const updateClubInfo = (patch: Partial<ClubInfo>) => {
    setContent((prev) => ({
      ...prev,
      clubInfo: { ...prev.clubInfo, ...patch },
    }));
  };

  const updateEvents = (events: ClubEvent[]) => {
    setContent((prev) => ({ ...prev, events }));
  };

  const resetAllContent = () => {
    setContent(INITIAL_CONTENT);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const exportContentJson = () => {
    return JSON.stringify(content, null, 2);
  };

  const importContentJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      setContent((prev) => ({
        ...prev,
        ...parsed,
        hero: { ...prev.hero, ...(parsed.hero || {}) },
        clubInfo: { ...prev.clubInfo, ...(parsed.clubInfo || {}) },
      }));
      return true;
    } catch {
      return false;
    }
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        updateHero,
        updateAboutUs,
        updateHeroPlayers,
        updateSquads,
        updateMethodSteps,
        updateMethodMetrics,
        updateStaff,
        updateMemberships,
        updateFaq,
        updateDomains,
        updateClaims,
        updateClubInfo,
        updateEvents,
        resetAllContent,
        exportContentJson,
        importContentJson,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a ContentProvider');
  }
  return context;
};
