// Content module for Martín Careaga (MC) Club Landing
export const ASSETS = {
  video: {
    film: 'https://assets.mixkit.co/videos/preview/mixkit-playing-a-game-of-soccer-41221-large.mp4',
    poster: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
  },
  img: {
    stadium: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
    glow: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
    tacticalThumb: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
    shieldBadge: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?auto=format&fit=crop&w=400&q=80',
    logoMark: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=400&q=80',
    avatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    ],
  },
} as const;

export const HERO = {
  headline: ['Fútbol', 'Pasión', 'Táctica', 'Total'] as const,
  lede: 'Preparando talentos desde la base hasta el primer plantel. Dirección técnica certificada para futsal y fútbol 11.',
  cta: 'Únete a MC',
  badge: ['Sangre', 'Roja y', 'Negra'] as const,
  learners: { value: '120+', label: 'Jugadores Activos' },
  sessions: { value: '345', label: 'partidos jugados' },
  dataPoints: { value: '18', label: 'títulos regionales' },
  avgScore: { value: '85%', label: 'victorias' },
  insight: { kicker: 'Análisis', title: 'Táctico' },
} as const;

export const NAV = [
  { id: 'home', label: 'Inicio' },
  { id: 'squads', label: 'Categorías' },
  { id: 'method', label: 'Metodología' },
  { id: 'staff', label: 'Cuerpo Técnico' },
  { id: 'memberships', label: 'Membresías' },
  { id: 'faq', label: 'FAQ' },
] as const;

export const DOMAINS = [
  'Futsal Indoor',
  'Fútbol 11',
  'Preparación Física',
  'Análisis Táctico',
] as const;

export const CLAIMS = [
  'Competitivo',
  'Táctico',
  'Formativo',
  'Ganador',
] as const;

export interface SquadItem {
  id: string;
  name: string;
  minutes: number;
  level: string;
  blurb: string;
  metrics: { value: string; label: string }[];
}

export const SQUADS_DATA: SquadItem[] = [
  {
    id: 'sub7',
    name: 'Sub 7',
    minutes: 45,
    level: 'Iniciación',
    blurb: 'Desarrollo psicomotriz, coordinación y primeros contactos divertidos con el balón.',
    metrics: [
      { value: 'Base', label: 'enfoque' },
      { value: 'Indoor', label: 'superficie' },
    ],
  },
  {
    id: 'sub9',
    name: 'Sub 9',
    minutes: 50,
    level: 'Iniciación',
    blurb: 'Fundamentos técnicos básicos, pases cortos y entendimiento del espacio en la cancha.',
    metrics: [
      { value: 'Técnica', label: 'enfoque' },
      { value: 'Indoor', label: 'superficie' },
    ],
  },
  {
    id: 'sub11',
    name: 'Sub 11',
    minutes: 60,
    level: 'Formativo',
    blurb: 'Introducción a los conceptos tácticos, posicionamiento y juego en equipo.',
    metrics: [
      { value: 'Táctico', label: 'enfoque' },
      { value: 'Mixto', label: 'superficie' },
    ],
  },
  {
    id: 'sub13',
    name: 'Sub 13',
    minutes: 60,
    level: 'Formativo',
    blurb: 'Transiciones rápidas, toma de decisiones y aumento de la exigencia física.',
    metrics: [
      { value: 'Físico', label: 'enfoque' },
      { value: 'Mixto', label: 'superficie' },
    ],
  },
  {
    id: 'sub15',
    name: 'Sub 15',
    minutes: 75,
    level: 'Competitivo',
    blurb: 'Preparación para torneos, sistemas de juego estructurados y mentalidad competitiva.',
    metrics: [
      { value: 'Torneos', label: 'enfoque' },
      { value: 'Mixto', label: 'superficie' },
    ],
  },
  {
    id: 'sub17',
    name: 'Sub 17',
    minutes: 90,
    level: 'Pre-Élite',
    blurb: 'Alta intensidad, perfeccionamiento táctico y fogueo para el salto a categorías mayores.',
    metrics: [
      { value: 'Intenso', label: 'ritmo' },
      { value: 'Césped', label: 'superficie' },
    ],
  },
  {
    id: 'sub19',
    name: 'Sub 19',
    minutes: 90,
    level: 'Proyección',
    blurb: 'Reserva directa del primer equipo. Exigencia profesional, análisis de video y rendimiento.',
    metrics: [
      { value: 'Élite', label: 'ritmo' },
      { value: 'Césped', label: 'superficie' },
    ],
  },
  {
    id: 'primer-plantel',
    name: 'Primer Plantel',
    minutes: 90,
    level: 'Élite',
    blurb: 'Selección oficial del club. Competición al más alto nivel en ligas regionales y BA Cup.',
    metrics: [
      { value: 'Absoluta', label: 'categoría' },
      { value: 'Pro', label: 'nivel' },
    ],
  },
];

export const METHOD_STEPS = [
  {
    step: '01',
    title: 'Evaluación',
    body: 'Análisis del rendimiento físico y técnico del jugador para asignarlo al nivel y categoría correspondiente.',
  },
  {
    step: '02',
    title: 'Táctica',
    body: 'Ejercicios adaptados según la normativa FBF. Perfeccionamiento de toma de decisiones y memoria muscular.',
  },
  {
    step: '03',
    title: 'Competencia',
    body: 'Poner a prueba lo aprendido en torneos regionales y fogueos previos a campeonatos internacionales como la BA Cup.',
  },
];

export const METHOD_METRICS = [
  { value: 120, suffix: '+', label: 'jugadores' },
  { value: 18, suffix: '', label: 'títulos' },
  { value: 345, suffix: '', label: 'partidos' },
  { value: 100, suffix: '%', label: 'pasión' },
];

export const STAFF_DATA = [
  {
    name: 'DT Principal Martín Careaga',
    role: 'Licencia C y B - FBF',
    line: 'Dirección técnica oficial certificada por la Federación Boliviana de Fútbol. Lidera el proyecto deportivo MC.',
    badge: 'Director Técnico',
  },
  {
    name: 'Prep. Físico',
    role: 'Acondicionamiento',
    line: 'Especialista en resistencia y prevención de lesiones adaptado a cada categoría.',
    badge: 'Preparador Físico',
  },
  {
    name: 'Asistente Táctico',
    role: 'Análisis de Video',
    line: 'Monitorea el rendimiento utilizando principios de Football for Friendship Academy.',
    badge: 'Analista Táctico',
  },
  {
    name: 'Entrenador Arqueros',
    role: 'Especialista',
    line: 'Trabajo de reacción, reflejos y juego con los pies para todas las edades.',
    badge: 'Arqueros',
  },
];

export const MEMBERSHIPS_DATA = [
  {
    id: 'base',
    name: 'Base (Sub 7 - Sub 11)',
    monthly: 150,
    annual: 1200,
    tagline: 'Para iniciar y aprender.',
    features: [
      '2 entrenamientos por semana',
      'Futsal y motricidad',
      'Indumentaria de práctica',
    ],
    cta: 'Inscribirse',
    featured: false,
  },
  {
    id: 'formativo',
    name: 'Formativo (Sub 13 - Sub 17)',
    monthly: 200,
    annual: 1800,
    tagline: 'Desarrollo y torneos.',
    features: [
      '3 entrenamientos por semana',
      'Futsal y Fútbol 11',
      'Convocatoria a partidos',
    ],
    cta: 'Inscribirse',
    featured: true,
  },
  {
    id: 'elite',
    name: 'Proyección y 1er Plantel',
    monthly: 300,
    annual: 2800,
    tagline: 'Rendimiento absoluto.',
    features: [
      'Entrenamiento intensivo',
      'Preparación táctica FBF',
      'Proyecto BA Cup',
      'Análisis de rendimiento',
    ],
    cta: 'Postular',
    featured: false,
  },
];

export const FAQ_DATA = [
  {
    q: '¿A partir de qué edad pueden ingresar?',
    a: 'Recibimos niños desde la categoría Sub 7, enfocándonos en un aprendizaje lúdico, motriz y divertido antes de pasar a la exigencia formativa.',
  },
  {
    q: '¿En qué consiste la preparación para la BA Cup?',
    a: 'Es un macrociclo de entrenamiento táctico y físico para nuestras categorías mayores y el Primer Plantel, diseñado para llegar al tope de rendimiento en Diciembre.',
  },
  {
    q: '¿Las prácticas son solo físicas?',
    a: 'No. Nuestro cuerpo técnico, certificado con Licencias de la FBF, prioriza la inteligencia táctica, la técnica con el balón y la toma de decisiones rápidas en todas las categorías.',
  },
  {
    q: '¿Dónde entrenan?',
    a: 'Alternamos entre canchas de césped para táctica de Fútbol 11 y coliseos cerrados para la dinámica rápida del Futsal, dependiendo de la categoría.',
  },
];

export const FOOTER_COLUMNS = [
  {
    title: 'Categorías',
    links: [
      'Base (Sub 7-11)',
      'Formativo (Sub 13-17)',
      'Juveniles (Sub 19)',
      'Primer Plantel',
    ],
  },
  {
    title: 'El Club',
    links: ['Historia', 'Cuerpo Técnico', 'Instalaciones', 'Contacto'],
  },
  {
    title: 'Soporte',
    links: ['Inscripciones', 'Reglamento', 'Privacidad'],
  },
];
