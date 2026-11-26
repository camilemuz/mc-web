import { Player, Match, Product, NewsArticle, ClubEvent, FanPoll } from '../types';

export const PLAYERS_DATA: Player[] = [
  // CUERPO TÉCNICO
  {
    id: 'staff-1',
    name: 'Martín Careaga',
    nickname: 'El Profe',
    number: 0,
    position: 'Cuerpo Técnico',
    category: 'staff',
    age: 46,
    height: '1.82 m',
    nationality: 'Argentina',
    matchesPlayed: 142,
    goals: 0,
    assists: 0,
    topSpeedKmH: 0,
    passAccuracy: 95,
    stamina: 90,
    preferredFoot: 'Derecho',
    bio: 'Fundador de la Escuela Formativa de Fútbol MC y Director Técnico del Primer Plantel. Exjugador profesional con licencia PRO Conmebol. Formador de más de 30 futbolistas en ligas profesionales.',
    marketValue: 'Director Técnico'
  },
  // PRIMER PLANTEL
  {
    id: 'p-1',
    name: 'Mateo Valenzuela',
    nickname: 'El Rayo',
    number: 9,
    position: 'Delantero',
    category: 'primer-plantel',
    age: 23,
    height: '1.86 m',
    nationality: 'Argentina',
    matchesPlayed: 24,
    goals: 18,
    assists: 7,
    topSpeedKmH: 34.8,
    passAccuracy: 84,
    stamina: 92,
    preferredFoot: 'Derecho',
    bio: 'Goleador letal surgido del semillero de la Escuela Martín Careaga. Potencia física, desmarque en diagonal y definición quirúrgica dentro del área.',
    marketValue: '€ 1.8M'
  },
  {
    id: 'p-2',
    name: 'Lucas Benítez',
    nickname: 'El Mago',
    number: 10,
    position: 'Mediocampista',
    category: 'primer-plantel',
    age: 26,
    height: '1.75 m',
    nationality: 'Uruguay',
    matchesPlayed: 26,
    goals: 8,
    assists: 14,
    topSpeedKmH: 31.2,
    passAccuracy: 91,
    stamina: 89,
    preferredFoot: 'Izquierdo',
    bio: 'Capitán y cerebro organizador del equipo. Visión panorámica 360°, control orientado y especialista absoluto en tiros libres.',
    marketValue: '€ 2.2M'
  },
  {
    id: 'p-3',
    name: 'Joaquín Navarro',
    nickname: 'El Muro',
    number: 2,
    position: 'Defensa',
    category: 'primer-plantel',
    age: 27,
    height: '1.89 m',
    nationality: 'Chile',
    matchesPlayed: 25,
    goals: 3,
    assists: 1,
    topSpeedKmH: 32.5,
    passAccuracy: 88,
    stamina: 94,
    preferredFoot: 'Derecho',
    bio: 'Líder de la zaga central. Anticipación impecable en el juego aéreo y salida limpia con el balón desde el fondo.',
    marketValue: '€ 1.5M'
  },
  {
    id: 'p-4',
    name: 'Emiliano Santoro',
    nickname: 'El Candado',
    number: 1,
    position: 'Arquero',
    category: 'primer-plantel',
    age: 28,
    height: '1.93 m',
    nationality: 'Argentina',
    matchesPlayed: 26,
    goals: 0,
    assists: 2,
    topSpeedKmH: 26.4,
    passAccuracy: 81,
    stamina: 90,
    preferredFoot: 'Derecho',
    bio: 'Valla menos vencida del torneo. Reflejos bajo los tres postes y notable capacidad para iniciar contragolpes con saques largos teledirigidos.',
    marketValue: '€ 1.4M'
  },
  {
    id: 'p-5',
    name: 'Santiago Morales',
    nickname: 'El Motor',
    number: 8,
    position: 'Mediocampista',
    category: 'primer-plantel',
    age: 22,
    height: '1.78 m',
    nationality: 'Colombia',
    matchesPlayed: 22,
    goals: 5,
    assists: 6,
    topSpeedKmH: 33.1,
    passAccuracy: 89,
    stamina: 96,
    preferredFoot: 'Ambidiestro',
    bio: 'Mediocampista box-to-box incansable. Presión alta tras pérdida y llegada constante a posiciones de remate.',
    marketValue: '€ 1.6M'
  },
  {
    id: 'p-6',
    name: 'Franco Barrientos',
    nickname: 'El Toro',
    number: 4,
    position: 'Defensa',
    category: 'primer-plantel',
    age: 24,
    height: '1.83 m',
    nationality: 'Paraguay',
    matchesPlayed: 21,
    goals: 2,
    assists: 4,
    topSpeedKmH: 33.9,
    passAccuracy: 86,
    stamina: 93,
    preferredFoot: 'Derecho',
    bio: 'Lateral derecho de recorrido vertiginoso. Solidez en el 1 vs 1 defensivo y centros venenosos al área rival.',
    marketValue: '€ 1.2M'
  },
  // JOVENES PROMESAS - ESCUELA FORMATIVA
  {
    id: 'p-7',
    name: 'Thiago Careaga',
    nickname: 'Joyita',
    number: 11,
    position: 'Delantero',
    category: 'escuela-juvenil',
    age: 17,
    height: '1.79 m',
    nationality: 'Argentina',
    matchesPlayed: 18,
    goals: 15,
    assists: 9,
    topSpeedKmH: 34.2,
    passAccuracy: 86,
    stamina: 91,
    preferredFoot: 'Izquierdo',
    bio: 'Extremo picante de la Sub-18 de la Escuela Martín Careaga ya convocado al banco del Primer Plantel. Regate impredecible en velocidad.',
    marketValue: 'Cantera Élite'
  },
  {
    id: 'p-8',
    name: 'Bruno Almada',
    nickname: 'El Pulpo',
    number: 5,
    position: 'Mediocampista',
    category: 'escuela-juvenil',
    age: 18,
    height: '1.81 m',
    nationality: 'Argentina',
    matchesPlayed: 19,
    goals: 4,
    assists: 8,
    topSpeedKmH: 32.0,
    passAccuracy: 92,
    stamina: 95,
    preferredFoot: 'Derecho',
    bio: 'Pivote defensivo formado desde los 9 años en la academia. Recuperación táctica inteligente e inicio de jugadas.',
    marketValue: 'Cantera Élite'
  },
  {
    id: 'p-9',
    name: 'Facundo Quiroga',
    nickname: 'Muralla Jr.',
    number: 6,
    position: 'Defensa',
    category: 'escuela-juvenil',
    age: 17,
    height: '1.87 m',
    nationality: 'Argentina',
    matchesPlayed: 16,
    goals: 2,
    assists: 1,
    topSpeedKmH: 31.8,
    passAccuracy: 87,
    stamina: 90,
    preferredFoot: 'Izquierdo',
    bio: 'Marcador central zurdo de gran temperamento y liderazgo en la categoría juvenil. Gran proyección física y técnica.',
    marketValue: 'Cantera Élite'
  }
];

export const CURRENT_LIVE_MATCH: Match = {
  id: 'match-live-1',
  opponent: 'Atlético Metropolitano',
  opponentShort: 'MET',
  competition: 'Liga Pro Élite - Fecha 12',
  date: '2026-10-18',
  time: '20:30',
  venue: 'Estadio Metropolitano MC (Sede Central)',
  isHome: true,
  status: 'live',
  scoreHome: 2,
  scoreAway: 1,
  currentMinute: 74,
  timeline: [
    { minute: 14, type: 'goal', team: 'home', player: 'Mateo Valenzuela (9)', assistOrDetail: 'Asistencia de Lucas Benítez con pase entre líneas' },
    { minute: 32, type: 'card-yellow', team: 'away', player: 'Ramiro Godoy (6)', assistOrDetail: 'Infracción táctica sobre Santiago Morales' },
    { minute: 48, type: 'goal', team: 'away', player: 'Carlos Herrera (11)', assistOrDetail: 'Remate cruzado tras contraataque' },
    { minute: 61, type: 'sub', team: 'home', player: 'Thiago Careaga (11)', assistOrDetail: 'Entra por Franco Barrientos (reajuste ofensivo)' },
    { minute: 68, type: 'goal', team: 'home', player: 'Lucas Benítez (10)', assistOrDetail: 'Golazo de tiro libre al ángulo superior izquierdo' },
    { minute: 71, type: 'var', team: 'away', player: 'Revisión VAR', assistOrDetail: 'Posible penal desestimado tras chequeo en campo' }
  ],
  stats: {
    possessionHome: 61,
    possessionAway: 39,
    shotsHome: 14,
    shotsAway: 6,
    shotsOnTargetHome: 7,
    shotsOnTargetAway: 3,
    passesAccuracyHome: 89,
    passesAccuracyAway: 78,
    foulsHome: 9,
    foulsAway: 15,
    cornersHome: 8,
    cornersAway: 2,
    xGHome: 2.34,
    xGAway: 0.95
  }
};

export const UPCOMING_MATCHES: Match[] = [
  {
    id: 'match-up-1',
    opponent: 'Deportivo Central',
    opponentShort: 'DCE',
    competition: 'Copa Nacional - Cuartos de Final',
    date: '2026-10-24',
    time: '19:00',
    venue: 'Estadio José María Careaga',
    isHome: true,
    status: 'upcoming',
    timeline: [],
    stats: {
      possessionHome: 50, possessionAway: 50,
      shotsHome: 0, shotsAway: 0,
      shotsOnTargetHome: 0, shotsOnTargetAway: 0,
      passesAccuracyHome: 0, passesAccuracyAway: 0,
      foulsHome: 0, foulsAway: 0,
      cornersHome: 0, cornersAway: 0,
      xGHome: 0, xGAway: 0
    }
  },
  {
    id: 'match-up-2',
    opponent: 'Unión Porteña',
    opponentShort: 'UPO',
    competition: 'Liga Pro Élite - Fecha 13',
    date: '2026-11-01',
    time: '17:30',
    venue: 'Estadio La Fortaleza Porteña',
    isHome: false,
    status: 'upcoming',
    timeline: [],
    stats: {
      possessionHome: 50, possessionAway: 50,
      shotsHome: 0, shotsAway: 0,
      shotsOnTargetHome: 0, shotsOnTargetAway: 0,
      passesAccuracyHome: 0, passesAccuracyAway: 0,
      foulsHome: 0, foulsAway: 0,
      cornersHome: 0, cornersAway: 0,
      xGHome: 0, xGAway: 0
    }
  }
];

export const PRODUCTS_DATA: Product[] = [
  {
    id: 'prod-1',
    name: 'Camiseta Oficial Titular MC 2026/27',
    category: 'camisetas',
    price: 250,
    originalPrice: 290,
    description: 'La piel oficial del club. Diseño a franjas verticales Rojo Pasión y Negro Carbono con microrrelieve tecnológico en tejido AeroDry Pro transpirable.',
    features: ['Tejido 100% poliéster reciclado AeroDry', 'Escudo bordado en alta definición 3D', 'Personalizable con tu nombre y dorsal oficial', 'Corte atlético ergonómico'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'Niño 12', 'Niño 14'],
    customizable: true,
    badge: 'Más Vendida',
    rating: 4.9,
    stock: 85
  },
  {
    id: 'prod-2',
    name: 'Camiseta Suplente Cyber Platinum MC',
    category: 'camisetas',
    price: 240,
    originalPrice: 280,
    description: 'Camiseta de visita en blanco platino con banda transversal rojo carmesí y detalles en carbono mate. Elegancia vanguardista en cada partido.',
    features: ['Inserciones de ventilación láser en axilas', 'Parche termosellado con relieve', 'Tratamiento anti-olor NanoFresh', 'Personalizable con número oficial'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    customizable: true,
    badge: 'Edición Pro',
    rating: 4.8,
    stock: 60
  },
  {
    id: 'prod-3',
    name: 'Conjunto Oficial Escuela Martín Careaga (Juvenil/Infantil)',
    category: 'escuela',
    price: 220,
    originalPrice: 260,
    description: 'Kit completo de entrenamiento reglamentario para los alumnos de la Escuela formativa MC. Incluye camiseta técnica, pantalón corto y medias deportivas reforzadas.',
    features: ['Homologado para entrenamientos y torneos de la academia', 'Resistente a rozaduras en césped sintético y natural', 'Logo oficial Escuela Martín Careaga', 'Espacio para rotulado de nombre'],
    sizes: ['Sub-8 (8 años)', 'Sub-10 (10 años)', 'Sub-12 (12 años)', 'Sub-14 (14 años)', 'Sub-16 (16 años)'],
    customizable: true,
    badge: 'Obligatorio Escuela',
    rating: 5.0,
    stock: 120
  },
  {
    id: 'prod-4',
    name: 'Campera de Concentración Cyber Storm MC',
    category: 'entrenamiento',
    price: 320,
    originalPrice: 380,
    description: 'Campera técnica impermeable y cortavientos con capucha anatómica, bolsillos termosellados con cremallera y líneas reflectantes rojas.',
    features: ['Membrana StormShield repelente al agua', 'Forro interior micropolar térmico ultraligero', 'Cremalleras selladas YKK', 'Ajuste elástico en puños y cintura'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    customizable: false,
    badge: 'Invierno Pro',
    rating: 4.9,
    stock: 45
  },
  {
    id: 'prod-5',
    name: 'Pantalón Largo de Entrenamiento Pro Fit',
    category: 'entrenamiento',
    price: 180,
    originalPrice: 210,
    description: 'Pantalón cónico ajustado al tobillo con cremallera lateral para fácil cambio sin quitar los botines. Tejido de alta elasticidad multidireccional.',
    features: ['Flexibilidad 4-way stretch', 'Cremalleras invisibles en tobillos', 'Cintura elástica con cordón de ajuste', 'Bolsillos con cierre seguro'],
    sizes: ['S', 'M', 'L', 'XL'],
    customizable: false,
    badge: 'Bestseller',
    rating: 4.7,
    stock: 70
  },
  {
    id: 'prod-6',
    name: 'Mochila Deportiva MC Élite 35L',
    category: 'accesorios',
    price: 150,
    originalPrice: 180,
    description: 'Mochila espaciosa con compartimento ventilado inferior especial para botines sucios o botellas, bolsillo acolchado para notebook y correas ergonómicas.',
    features: ['Compartimento inferior para calzado', 'Fondo impermeable reforzado', 'Capacidad de 35 Litros', 'Escudo MC siliconado'],
    sizes: ['Talle Único'],
    customizable: false,
    badge: 'Accesorio Élite',
    rating: 4.8,
    stock: 95
  }
];

export const NEWS_DATA: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Martín Careaga: "Formamos personas antes que futbolistas de élite"',
    category: 'Escuela Formativa',
    date: '10 Octubre 2026',
    readTime: '4 min de lectura',
    author: 'Prensa Oficial MC',
    summary: 'En una conferencia con directores deportivos, el fundador de la escuela detalló las claves del método de alta competencia que llevó a 5 canteranos al primer equipo.',
    content: [
      'El proyecto deportivo de Martín Careaga sigue consolidándose como uno de los modelos pedagógicos más admirados del fútbol regional. Durante la charla en el auditorio central, Martín explicó cómo el club fusiona la preparación técnica depurada con el seguimiento académico y psicológico de cada alumno.',
      '"Un jugador que comprende el juego en el aula es el que toma decisiones correctas en una fracción de segundo dentro de la cancha", enfatizó Careaga.',
      'Actualmente, más de 350 chicos y chicas entrenan en las 4 sedes de la academia, compitiendo en ligas federadas y torneos internacionales con un índice de promoción récord hacia las divisiones profesionales.'
    ]
  },
  {
    id: 'news-2',
    title: 'Victoria vibrante ante Metropolitano y liderato absoluto de la Liga Pro',
    category: 'Primer Plantel',
    date: '8 Octubre 2026',
    readTime: '3 min de lectura',
    author: 'Dpto. de Fútbol Profesional',
    summary: 'Con goles de Mateo Valenzuela y un tiro libre magistral del capitán Lucas Benítez, el equipo rojinegro sumó tres puntos vitales ante más de 18.000 aficionados.',
    content: [
      'Una noche inolvidable en el Estadio Central. El conjunto dirigido por Martín Careaga desplegó una intensidad asfixiante desde el pitazo inicial, recuperando el balón en campo contrario y generando peligro continuo.',
      'El ingreso del canterano Thiago Careaga en el segundo tiempo cambió el ritmo del partido con desbordes desequilibrantes por banda izquierda.',
      'Con este triunfo, el club MC alcanza 28 puntos y se posiciona en lo más alto de la tabla de posiciones con solo tres fechas restantes para el cierre de la fase regular.'
    ]
  },
  {
    id: 'news-3',
    title: 'Abren inscripciones para el Torneo Internacional de Verano MC Cup 2027',
    category: 'Torneos',
    date: '4 Octubre 2026',
    readTime: '5 min de lectura',
    author: 'Coordinación Juvenil',
    summary: 'El certamen reunirá a más de 48 academias de 5 países en las categorías Sub-10, Sub-12, Sub-14 y Sub-16 en nuestras canchas de césped híbrido.',
    content: [
      'La quinta edición de la MC Cup promete ser la más competitiva de la historia. Del 15 al 22 de enero, las mejores promesas de Sudamérica se darán cita en la sede deportiva del club.',
      'Los equipos contarán con transmisiones por streaming en directo, registro estadístico digital de cada partido y visores internacionales de clubes de primera división.',
      'Los cupos son limitados por categoría para garantizar la máxima calidad organizativa y alojamiento deportivo.'
    ]
  }
];

export const EVENTS_DATA: ClubEvent[] = [
  {
    id: 'ev-1',
    title: 'Primer Plantel vs Atlético Metropolitano',
    category: 'Primer Plantel',
    date: '18 Octubre 2026',
    time: '20:30 hs',
    location: 'Estadio Metropolitano MC (Sede Central)',
    description: 'Fecha 12 del Torneo Clausura. Entrada libre para socios con carnet digital al día.',
    registrationOpen: false
  },
  {
    id: 'ev-2',
    title: 'Pruebas de Captación Abiertas - Categorías 2011 a 2015',
    category: 'Pruebas',
    date: '25 Octubre 2026',
    time: '09:00 a 13:00 hs',
    location: 'Predio Deportivo Formativo Martín Careaga (Cancha 2)',
    description: 'Jornada de evaluación técnica y física dirigida por Martín Careaga y el cuerpo de captadores del club. Asistencia sin costo con inscripción previa.',
    registrationOpen: true
  },
  {
    id: 'ev-3',
    title: 'Clínica Táctica de Definición y Desmarque con Martín Careaga',
    category: 'Clínica',
    date: '31 Octubre 2026',
    time: '16:00 a 19:30 hs',
    location: 'Centro de Alto Rendimiento MC',
    description: 'Masterclass intensiva práctica para delanteros y extremos: toma de decisiones en el último tercio, golpeo de balón y juego sin pelota.',
    registrationOpen: true
  },
  {
    id: 'ev-4',
    title: 'Final del Torneo Clausura Juvenil Sub-16',
    category: 'Escuela',
    date: '08 Noviembre 2026',
    time: '11:00 hs',
    location: 'Cancha Principal Predio Formativo',
    description: 'Nuestra categoría Sub-16 disputa el título de campeones del torneo regional juvenil.',
    registrationOpen: false
  }
];

export const MVP_POLL_DATA: FanPoll = {
  id: 'mvp-poll-1',
  title: 'Jugador del Partido (MVP Fans)',
  subtitle: 'Vota en tiempo real por el jugador más determinante de la jornada',
  totalVotes: 1420,
  options: [
    { id: 'opt-1', label: 'Lucas Benítez', sublabel: 'Gol de tiro libre + Asistencia clave', votes: 720, number: 10 },
    { id: 'opt-2', label: 'Mateo Valenzuela', sublabel: 'Gol de apertura + 4 remates al arco', votes: 410, number: 9 },
    { id: 'opt-3', label: 'Emiliano Santoro', sublabel: '3 atajadas decisivas bajo los tres palos', votes: 210, number: 1 },
    { id: 'opt-4', label: 'Thiago Careaga', sublabel: 'Ingreso electrizante y desequilibrio', votes: 80, number: 11 }
  ]
};
