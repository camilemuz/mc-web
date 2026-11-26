export interface Player {
  id: string;
  name: string;
  nickname?: string;
  number: number;
  position: 'Arquero' | 'Defensa' | 'Mediocampista' | 'Delantero' | 'Cuerpo Técnico';
  category: 'primer-plantel' | 'escuela-juvenil' | 'staff';
  age: number;
  height: string;
  nationality: string;
  matchesPlayed: number;
  goals: number;
  assists: number;
  topSpeedKmH: number;
  passAccuracy: number;
  stamina: number;
  preferredFoot: 'Derecho' | 'Izquierdo' | 'Ambidiestro';
  bio: string;
  marketValue?: string;
  image?: string;
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'card-yellow' | 'card-red' | 'sub' | 'var';
  team: 'home' | 'away';
  player: string;
  assistOrDetail?: string;
}

export interface Match {
  id: string;
  opponent: string;
  opponentShort: string;
  competition: string;
  date: string;
  time: string;
  venue: string;
  isHome: boolean;
  status: 'upcoming' | 'live' | 'finished';
  scoreHome?: number;
  scoreAway?: number;
  currentMinute?: number;
  timeline: MatchEvent[];
  stats: {
    possessionHome: number;
    possessionAway: number;
    shotsHome: number;
    shotsAway: number;
    shotsOnTargetHome: number;
    shotsOnTargetAway: number;
    passesAccuracyHome: number;
    passesAccuracyAway: number;
    foulsHome: number;
    foulsAway: number;
    cornersHome: number;
    cornersAway: number;
    xGHome: number;
    xGAway: number;
  };
}

export interface Product {
  id: string;
  name: string;
  category: 'camisetas' | 'entrenamiento' | 'escuela' | 'accesorios';
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  sizes: string[];
  customizable: boolean;
  badge: string;
  rating: number;
  stock: number;
  image?: string;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  selectedSize: string;
  customName?: string;
  customNumber?: number;
  quantity: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: 'Primer Plantel' | 'Escuela Formativa' | 'Institucional' | 'Torneos';
  date: string;
  readTime: string;
  author: string;
  summary: string;
  content: string[];
}

export interface ClubEvent {
  id: string;
  title: string;
  category: 'Primer Plantel' | 'Escuela' | 'Clínica' | 'Pruebas';
  date: string;
  time: string;
  location: string;
  description: string;
  registrationOpen: boolean;
}

export interface FanPoll {
  id: string;
  title: string;
  subtitle: string;
  totalVotes: number;
  options: {
    id: string;
    label: string;
    sublabel: string;
    votes: number;
    number?: number;
  }[];
}

export interface AcademyLead {
  id: string;
  studentName: string;
  ageCategory: string;
  parentName: string;
  parentPhone: string;
  branch: string;
  createdAt: string;
  status: 'Pendiente' | 'Contactado' | 'Prueba Asignada' | 'Inscrito';
}
