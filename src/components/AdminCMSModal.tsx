import React, { useState, useEffect } from 'react';
import { Match, Product, Player, NewsArticle, AcademyLead, MatchEvent, ClubEvent } from '../types';
import { playUiClick, playGoalCheer } from '../utils/soundEffects';
import { useSiteContent, SquadItem, MethodStep, MethodMetric, StaffMember, MembershipPlan, FaqItem, ClubInfo, HeroPlayer } from '../utils/ContentContext';
import { useTheme } from '../utils/ThemeContext';
import { compressImageFile } from '../firebase';
import {
  X,
  Settings,
  Radio,
  ShoppingBag,
  FileText,
  Users,
  GraduationCap,
  Sparkles,
  Trophy,
  Calendar,
  CreditCard,
  HelpCircle,
  Phone,
  Layers,
  MapPin,
  Clock,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  ExternalLink,
  Download,
  Upload,
  RotateCcw,
  Search,
  ChevronRight,
  Shield,
  Activity,
  LogOut,
  Maximize2,
  Camera,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Compass,
  Sun,
  Moon
} from 'lucide-react';

interface AdminCMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
  liveMatch: Match;
  onUpdateLiveMatch: (updated: Match) => void;
  products: Product[];
  onUpdateProducts: (updated: Product[]) => void;
  news: NewsArticle[];
  onUpdateNews: (updated: NewsArticle[]) => void;
  players: Player[];
  onUpdatePlayers: (updated: Player[]) => void;
  leads: AcademyLead[];
  onUpdateLeadStatus: (leadId: string, status: AcademyLead['status']) => void;
}

type CMSTab =
  | 'hero'
  | 'about'
  | 'squads'
  | 'match'
  | 'method'
  | 'staff'
  | 'memberships'
  | 'location'
  | 'calendar'
  | 'store'
  | 'players'
  | 'news'
  | 'faq'
  | 'leads'
  | 'backup';

export const AdminCMSModal: React.FC<AdminCMSModalProps> = ({
  isOpen,
  onClose,
  onLogout,
  liveMatch,
  onUpdateLiveMatch,
  products,
  onUpdateProducts,
  news,
  onUpdateNews,
  players,
  onUpdatePlayers,
  leads,
  onUpdateLeadStatus
}) => {
  const {
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
    importContentJson
  } = useSiteContent();

  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<CMSTab>('hero');
  const [searchTerm, setSearchTerm] = useState('');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Ensure window scroll is enabled for this dedicated page
  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.body.style.overscrollBehavior = 'auto';
    return () => {
      document.body.style.overflow = '';
      document.body.style.overscrollBehavior = '';
    };
  }, []);

  // New Event Form State (Match)
  const [newEventMinute, setNewEventMinute] = useState<number>(75);
  const [newEventType, setNewEventType] = useState<MatchEvent['type']>('goal');
  const [newEventTeam, setNewEventTeam] = useState<'home' | 'away'>('home');
  const [newEventPlayer, setNewEventPlayer] = useState('Mateo Valenzuela (9)');
  const [newEventDetail, setNewEventDetail] = useState('Remate potente al primer palo');

  // New Product Form State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<Product['category']>('camisetas');
  const [newProductPrice, setNewProductPrice] = useState(250);
  const [newProductStock, setNewProductStock] = useState(50);
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductImage, setNewProductImage] = useState('');

  // New News Form State
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsCategory, setNewNewsCategory] = useState<NewsArticle['category']>('Primer Plantel');
  const [newNewsDate, setNewNewsDate] = useState('12 Octubre, 2026');
  const [newNewsReadTime, setNewNewsReadTime] = useState('3 min lectura');
  const [newNewsAuthor, setNewNewsAuthor] = useState('Prensa Club MC');
  const [newNewsSummary, setNewNewsSummary] = useState('');
  const [newNewsContent, setNewNewsContent] = useState('');

  // New Calendar Event Form State
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<ClubEvent['category']>('Primer Plantel');
  const [newEventDate, setNewEventDate] = useState('24 Octubre, 2026');
  const [newEventTime, setNewEventTime] = useState('15:30');
  const [newEventLocation, setNewEventLocation] = useState('Complejo Deportivo Social Litoral, Bajo Següencoma');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventRegOpen, setNewEventRegOpen] = useState(true);

  // Hero Players (3D Figures) Form State
  const [isAddingHeroPlayer, setIsAddingHeroPlayer] = useState(false);
  const [newHeroName, setNewHeroName] = useState('');
  const [newHeroNickname, setNewHeroNickname] = useState('');
  const [newHeroNumber, setNewHeroNumber] = useState<number>(10);
  const [newHeroPosition, setNewHeroPosition] = useState('Delantero');
  const [newHeroRole, setNewHeroRole] = useState('Goleador Implacable');
  const [newHeroCategory, setNewHeroCategory] = useState('Primer Plantel');
  const [newHeroImage, setNewHeroImage] = useState('');

  // New Player Form State
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerNickname, setNewPlayerNickname] = useState('');
  const [newPlayerNumber, setNewPlayerNumber] = useState<number>(10);
  const [newPlayerPosition, setNewPlayerPosition] = useState<Player['position']>('Delantero');
  const [newPlayerCategory, setNewPlayerCategory] = useState<Player['category']>('primer-plantel');
  const [newPlayerAge, setNewPlayerAge] = useState<number>(19);
  const [newPlayerHeight, setNewPlayerHeight] = useState('1.78m');
  const [newPlayerFoot, setNewPlayerFoot] = useState<Player['preferredFoot']>('Derecho');
  const [newPlayerNationality, setNewPlayerNationality] = useState('Bolivia');
  const [newPlayerBio, setNewPlayerBio] = useState('');
  const [newPlayerImage, setNewPlayerImage] = useState('');
  const [playerCategoryFilter, setPlayerCategoryFilter] = useState<string>('todos');

  // Hero Players Handlers
  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, playerId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 760, 0.82);
      if (playerId) {
        const updated = (content.heroPlayers || []).map((hp) =>
          hp.id === playerId ? { ...hp, image: dataUrl } : hp
        );
        updateHeroPlayers(updated);
        triggerSaveNotification('¡Foto PNG 3D actualizada en la nube!');
      } else {
        setNewHeroImage(dataUrl);
      }
    } catch {
      triggerSaveNotification('Error al procesar la imagen');
    }
  };

  const handleAddHeroPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeroName.trim()) return;
    playUiClick();
    const newHero: HeroPlayer = {
      id: `hp-${Date.now()}`,
      name: newHeroName.trim(),
      nickname: newHeroNickname.trim() || 'Crack',
      number: newHeroNumber,
      position: newHeroPosition,
      category: newHeroCategory,
      role: newHeroRole || 'Figura Destacada',
      image: newHeroImage || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80'
    };
    updateHeroPlayers([...(content.heroPlayers || []), newHero]);
    setNewHeroName('');
    setNewHeroNickname('');
    setNewHeroRole('');
    setNewHeroImage('');
    setIsAddingHeroPlayer(false);
    triggerSaveNotification('¡Jugador 3D añadido a la portada!');
  };

  const handleDeleteHeroPlayer = (id: string) => {
    playUiClick();
    if ((content.heroPlayers || []).length <= 1) {
      triggerSaveNotification('Debe haber al menos 1 jugador en la portada 3D');
      return;
    }
    const updated = (content.heroPlayers || []).filter((hp) => hp.id !== id);
    updateHeroPlayers(updated);
    triggerSaveNotification('Jugador 3D eliminado del Hero');
  };

  // Player Image Upload Handler
  const handlePlayerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, playerId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 640, 0.8);
      if (playerId) {
        const updated = players.map((p) =>
          p.id === playerId ? { ...p, image: dataUrl } : p
        );
        onUpdatePlayers(updated);
        triggerSaveNotification('¡Foto de jugador actualizada en la nube!');
      } else {
        setNewPlayerImage(dataUrl);
      }
    } catch {
      triggerSaveNotification('Error al procesar la imagen');
    }
  };

  if (!isOpen) return null;

  const triggerSaveNotification = (msg: string) => {
    playGoalCheer();
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 2500);
  };

  // Calendar Event Handlers
  const handleAddCalendarEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    playUiClick();
    const newEv: ClubEvent = {
      id: `ev-${Date.now()}`,
      title: newEventTitle.trim(),
      category: newEventCategory,
      date: newEventDate,
      time: newEventTime,
      location: newEventLocation,
      description: newEventDesc || 'Evento deportivo oficial del Club MC.',
      registrationOpen: newEventRegOpen
    };
    updateEvents([newEv, ...content.events]);
    setNewEventTitle('');
    setNewEventDesc('');
    setIsAddingEvent(false);
    triggerSaveNotification('¡Evento añadido a la agenda!');
  };

  const handleDeleteCalendarEvent = (id: string) => {
    playUiClick();
    const updated = content.events.filter((e) => e.id !== id);
    updateEvents(updated);
    triggerSaveNotification('Evento eliminado de la agenda');
  };

  // Player Handlers
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;
    playUiClick();
    const newPl: Player = {
      id: `player-${Date.now()}`,
      name: newPlayerName.trim(),
      nickname: newPlayerNickname.trim() || undefined,
      number: newPlayerNumber,
      position: newPlayerPosition,
      category: newPlayerCategory,
      age: newPlayerAge,
      height: newPlayerHeight,
      nationality: newPlayerNationality,
      preferredFoot: newPlayerFoot,
      matchesPlayed: 0,
      goals: 0,
      assists: 0,
      topSpeedKmH: 29.5,
      passAccuracy: 85,
      stamina: 88,
      bio: newPlayerBio || 'Jugador en formación deportiva integral con el Club MC.',
      image: newPlayerImage || undefined
    };
    onUpdatePlayers([...players, newPl]);
    setNewPlayerName('');
    setNewPlayerNickname('');
    setNewPlayerBio('');
    setNewPlayerImage('');
    setIsAddingPlayer(false);
    triggerSaveNotification('¡Jugador añadido a la plantilla!');
  };

  const handleDeletePlayer = (id: string) => {
    playUiClick();
    const updated = players.filter((p) => p.id !== id);
    onUpdatePlayers(updated);
    triggerSaveNotification('Jugador eliminado');
  };

  // News Handlers
  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsTitle.trim()) return;
    playUiClick();
    const newArt: NewsArticle = {
      id: `art-${Date.now()}`,
      title: newNewsTitle.trim(),
      category: newNewsCategory,
      date: newNewsDate,
      readTime: newNewsReadTime,
      author: newNewsAuthor,
      summary: newNewsSummary || newNewsTitle,
      content: newNewsContent.trim() ? newNewsContent.split('\n\n') : [newNewsSummary]
    };
    onUpdateNews([newArt, ...news]);
    setNewNewsTitle('');
    setNewNewsSummary('');
    setNewNewsContent('');
    setIsAddingNews(false);
    triggerSaveNotification('¡Noticia publicada con éxito!');
  };

  const handleDeleteNews = (id: string) => {
    playUiClick();
    const updated = news.filter((n) => n.id !== id);
    onUpdateNews(updated);
    triggerSaveNotification('Noticia eliminada');
  };

  const scrollToSection = (id: string) => {
    playUiClick();
    onClose();
    setTimeout(() => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  // Match score handlers
  const handleScoreChange = (team: 'home' | 'away', delta: number) => {
    playUiClick();
    const updated = { ...liveMatch };
    if (team === 'home') {
      updated.scoreHome = Math.max(0, (updated.scoreHome || 0) + delta);
    } else {
      updated.scoreAway = Math.max(0, (updated.scoreAway || 0) + delta);
    }
    onUpdateLiveMatch(updated);
    triggerSaveNotification('Marcador actualizado');
  };

  const handleAddMatchEvent = (e: React.FormEvent) => {
    e.preventDefault();
    playUiClick();
    const event: MatchEvent = {
      minute: newEventMinute,
      type: newEventType,
      team: newEventTeam,
      player: newEventPlayer,
      assistOrDetail: newEventDetail
    };
    const updated = {
      ...liveMatch,
      currentMinute: Math.max(liveMatch.currentMinute || 0, newEventMinute),
      timeline: [event, ...liveMatch.timeline]
    };
    if (newEventType === 'goal') {
      if (newEventTeam === 'home') updated.scoreHome = (updated.scoreHome || 0) + 1;
      else updated.scoreAway = (updated.scoreAway || 0) + 1;
    }
    onUpdateLiveMatch(updated);
    triggerSaveNotification('¡Evento añadido en vivo!');
    setNewEventDetail('');
  };

  // Export Leads to CSV
  const handleExportLeadsCsv = () => {
    playUiClick();
    const headers = 'ID,Alumno,Categoria,Tutor,Telefono,Sede,Estado,Fecha\n';
    const rows = leads
      .map(
        (l) =>
          `"${l.id}","${l.studentName}","${l.ageCategory}","${l.parentName}","${l.parentPhone}","${l.branch}","${l.status}","${l.createdAt}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Prospectos_Escuela_MC_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // Backup handlers
  const handleDownloadBackup = () => {
    playUiClick();
    const json = exportContentJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MC_Web_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    triggerSaveNotification('Copia de seguridad descargada');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const contentStr = event.target?.result as string;
      if (contentStr) {
        const success = importContentJson(contentStr);
        if (success) triggerSaveNotification('¡Copia de seguridad restaurada con éxito!');
        else triggerSaveNotification('Error: El archivo JSON no tiene un formato válido');
      }
    };
    reader.readAsText(file);
  };

  const tabsConfig: { id: CMSTab; label: string; icon: any; category: string }[] = [
    { id: 'hero', label: 'Hero & Portada', icon: Sparkles, category: 'Diseño & Textos' },
    { id: 'about', label: 'Quiénes Somos (Misión/Visión)', icon: Compass, category: 'Diseño & Textos' },
    { id: 'location', label: 'Sede & Horarios', icon: MapPin, category: 'Diseño & Textos' },
    { id: 'squads', label: 'Categorías & Plantel', icon: Trophy, category: 'Deportes' },
    { id: 'match', label: 'Match Center en Vivo', icon: Radio, category: 'Deportes' },
    { id: 'calendar', label: 'Agenda & Calendario', icon: Calendar, category: 'Deportes' },
    { id: 'players', label: 'Fichas de Jugadores', icon: Users, category: 'Deportes' },
    { id: 'method', label: 'Metodología', icon: Layers, category: 'Formación' },
    { id: 'staff', label: 'Cuerpo Técnico', icon: Shield, category: 'Formación' },
    { id: 'memberships', label: 'Membresías & Cuotas', icon: CreditCard, category: 'Comercial' },
    { id: 'store', label: 'Tienda 3D & Stock', icon: ShoppingBag, category: 'Comercial' },
    { id: 'news', label: 'Noticias & Blog', icon: FileText, category: 'Comercial' },
    { id: 'leads', label: `Alumnos & Leads (${leads.length})`, icon: GraduationCap, category: 'Comercial' },
    { id: 'faq', label: 'Preguntas Frecuentes', icon: HelpCircle, category: 'Ajustes' },
    { id: 'backup', label: 'Copia de Seguridad JSON', icon: Settings, category: 'Ajustes' },
  ];

  const filteredTabs = tabsConfig.filter(
    (t) =>
      t.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#070709] text-white flex flex-col">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 px-4 sm:px-6 py-3 border-b border-neutral-800 flex items-center justify-between gap-4 bg-[#060608]/95 backdrop-blur-md shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playUiClick();
              onClose();
            }}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-500 text-neutral-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
            title="Volver a la Página Principal"
          >
            <ArrowLeft className="w-4 h-4 text-[#E6002B]" />
            <span className="hidden sm:inline">Volver a la Web</span>
          </button>
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
            <img
              src="/logo-mc-shield.png"
              alt="Escudo Oficial MC"
              className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(230,0,43,0.5)]"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold font-display text-white">
                PANEL ADMINISTRADOR & CMS TOTAL
              </h3>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 text-[10px] font-bold text-emerald-400 uppercase hidden sm:inline-flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-emerald-400" />
                <span>Página Dedicada</span>
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-400">
              Edita textos, horarios, categorías, resultados, jugadores, noticias y mapa en tiempo real.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {savedNotice && (
            <div className="px-3 py-1 rounded-lg bg-emerald-950/90 border border-emerald-800 text-xs text-emerald-400 flex items-center gap-1.5 animate-pulse">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{savedNotice}</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              playUiClick();
              toggleTheme();
              triggerSaveNotification(theme === 'dark' ? 'Sitio web cambiado a Modo Claro' : 'Sitio web cambiado a Modo Oscuro');
            }}
            className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-500 text-neutral-200 hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title={theme === 'dark' ? 'Cambiar sitio web a Modo Claro' : 'Cambiar sitio web a Modo Oscuro'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Web: Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden md:inline">Web: Oscuro</span>
              </>
            )}
          </button>
          {onLogout && (
            <button
              onClick={() => {
                playUiClick();
                onLogout();
              }}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-red-950/60 border border-neutral-700 hover:border-red-800 text-neutral-300 hover:text-red-300 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Cerrar Sesión de Administrador"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          )}
          <button
            onClick={() => {
              playUiClick();
              onClose();
            }}
            className="w-9 h-9 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors border border-neutral-800"
            title="Volver al Sitio Web"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Body: Sticky Sidebar + Native Scrolling Content */}
      <div className="flex-1 flex flex-row">
        
        {/* Left Sidebar Navigation - Sticky */}
        <aside className="w-64 sm:w-72 bg-[#060608] border-r border-neutral-800/80 shrink-0 sticky top-[61px] h-[calc(100vh-61px)] flex flex-col">
          {/* Search Filter */}
          <div className="p-3 border-b border-neutral-800/60 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar sección o campo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#E6002B]"
              />
            </div>
          </div>

          {/* Tabs List */}
          <div className="p-2 overflow-y-auto flex-1 space-y-1">
            {filteredTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playUiClick();
                    setActiveTab(tab.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#E6002B] text-white shadow-md shadow-[#E6002B]/25'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#E6002B]'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                </button>
              );
            })}
          </div>

          {/* Quick Sede Location Preview Pill in Sidebar */}
          <div className="p-3 border-t border-neutral-800/80 bg-neutral-950/60 text-[11px] font-mono shrink-0">
            <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
              <MapPin className="w-3.5 h-3.5 text-[#E6002B]" />
              <span className="text-white font-bold">Complejo Social Litoral</span>
            </div>
            <span className="text-neutral-500 text-[10px] block">
              Bajo Següencoma · Sub 7-13 & Sub 15-19
            </span>
          </div>
        </aside>

        {/* Right Main Content Pane - Native Window Scroll */}
        <main className="flex-1 min-w-0 p-4 sm:p-8 bg-[#0B0B0E] space-y-6">

            {/* TAB 1: HERO & PORTADA */}
            {activeTab === 'hero' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div>
                    <h4 className="text-lg font-bold font-display text-white">
                      1. Titular Principal & Palabras Clave
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Edita las 4 palabras de impacto del titular y la narrativa de presentación.
                    </p>
                  </div>
                  <button
                    onClick={() => scrollToSection('home')}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 border border-neutral-800"
                  >
                    <span>Ver en la página</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 4 Headline Words */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-neutral-900/60 p-4 rounded-xl border border-neutral-800">
                  {content.hero.headline.map((word, idx) => (
                    <div key={idx}>
                      <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                        Palabra {idx + 1}
                      </label>
                      <input
                        type="text"
                        value={word}
                        onChange={(e) => {
                          const updated = [...content.hero.headline];
                          updated[idx] = e.target.value;
                          updateHero({ headline: updated });
                        }}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm font-bold text-white uppercase focus:border-[#E6002B]"
                      />
                    </div>
                  ))}
                </div>

                {/* Lede & CTA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-800 space-y-2">
                    <label className="text-xs font-mono uppercase text-[#E6002B] font-bold block">
                      Texto Narrativo (Lede)
                    </label>
                    <textarea
                      rows={3}
                      value={content.hero.lede}
                      onChange={(e) => updateHero({ lede: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-3 text-xs text-white focus:border-[#E6002B] resize-none"
                    />
                  </div>

                  <div className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-800 space-y-3">
                    <div>
                      <label className="text-xs font-mono uppercase text-neutral-300 font-bold block mb-1">
                        Texto del Botón Principal
                      </label>
                      <input
                        type="text"
                        value={content.hero.cta}
                        onChange={(e) => updateHero({ cta: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:border-[#E6002B]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono uppercase text-neutral-300 font-bold block mb-1">
                        Insignia de Club (3 Palabras)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {content.hero.badge.map((b, bIdx) => (
                          <input
                            key={bIdx}
                            type="text"
                            value={b}
                            onChange={(e) => {
                              const newBadge = [...content.hero.badge] as [string, string, string];
                              newBadge[bIdx] = e.target.value;
                              updateHero({ badge: newBadge });
                            }}
                            className="bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-1.5 text-xs text-white text-center"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero Metrics Strip */}
                <div className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-800 space-y-3">
                  <h5 className="text-xs font-mono uppercase text-[#E6002B] font-bold">
                    Estadísticas Destacadas de Portada
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-1">Jugadores Activos</label>
                      <input
                        type="text"
                        value={content.hero.learners.value}
                        onChange={(e) =>
                          updateHero({ learners: { ...content.hero.learners, value: e.target.value } })
                        }
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-1">Partidos Jugados</label>
                      <input
                        type="text"
                        value={content.hero.sessions.value}
                        onChange={(e) =>
                          updateHero({ sessions: { ...content.hero.sessions, value: e.target.value } })
                        }
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-1">Títulos Regionales</label>
                      <input
                        type="text"
                        value={content.hero.dataPoints.value}
                        onChange={(e) =>
                          updateHero({ dataPoints: { ...content.hero.dataPoints, value: e.target.value } })
                        }
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-[#E6002B] font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-1">% Victorias</label>
                      <input
                        type="text"
                        value={content.hero.avgScore.value}
                        onChange={(e) =>
                          updateHero({ avgScore: { ...content.hero.avgScore, value: e.target.value } })
                        }
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* HERO PLAYERS (3D FIGURES & CAROUSEL) */}
                <div className="space-y-4 pt-4 border-t border-neutral-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-bold font-display text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#E6002B]" />
                        <span>2. Figuras 3D del Hero / Portada ({(content.heroPlayers || []).length})</span>
                      </h4>
                      <p className="text-xs text-neutral-400">
                        Gestiona los futbolistas del primer plantel con silueta en aumento 3D continuo.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddingHeroPlayer(!isAddingHeroPlayer)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#E6002B] hover:bg-[#FF1A40] text-xs font-mono font-bold text-white flex items-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAddingHeroPlayer ? 'Cancelar' : 'Añadir Figura 3D'}</span>
                    </button>
                  </div>

                  {/* Informational Guidance Alert for Transparent PNGs */}
                  <div className="p-3.5 bg-neutral-900/80 border border-neutral-800 rounded-xl text-xs text-neutral-300 flex items-start gap-3">
                    <span className="text-lg">💡</span>
                    <div className="space-y-1">
                      <span className="font-bold text-white block">Regla para imágenes PNG sin fondo:</span>
                      <p className="text-neutral-400 text-[11px] leading-relaxed">
                        Sube imágenes en formato <strong>PNG con fondo transparente (recortadas)</strong>. El sistema 3D de la portada las proyecta directamente sobre la atmósfera del estadio y los halos rojinegros <strong>sin ningún fondo blanco ni recuadros</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Add New Hero Player Form */}
                  {isAddingHeroPlayer && (
                    <form onSubmit={handleAddHeroPlayer} className="p-5 bg-neutral-900/90 border border-[#E6002B]/40 rounded-2xl space-y-4 animate-in fade-in">
                      <h5 className="text-sm font-bold text-white flex items-center gap-2">
                        <Plus className="w-4 h-4 text-[#E6002B]" />
                        <span>Nueva Figura para el Hero 3D</span>
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Nombre Completo</label>
                          <input
                            type="text"
                            required
                            placeholder="Ej: Marcelo Martins"
                            value={newHeroName}
                            onChange={(e) => setNewHeroName(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Apodo / Sobrenombre</label>
                          <input
                            type="text"
                            placeholder="Ej: El Matador"
                            value={newHeroNickname}
                            onChange={(e) => setNewHeroNickname(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Dorsal</label>
                          <input
                            type="number"
                            required
                            value={newHeroNumber}
                            onChange={(e) => setNewHeroNumber(Number(e.target.value))}
                            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Posición</label>
                          <input
                            type="text"
                            value={newHeroPosition}
                            onChange={(e) => setNewHeroPosition(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Rol / Especialidad</label>
                          <input
                            type="text"
                            value={newHeroRole}
                            onChange={(e) => setNewHeroRole(e.target.value)}
                            placeholder="Ej: Goleador Histórico"
                            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Categoría</label>
                          <input
                            type="text"
                            value={newHeroCategory}
                            onChange={(e) => setNewHeroCategory(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>

                      {/* Image Upload / URL Input */}
                      <div className="space-y-2 pt-2 border-t border-neutral-800">
                        <label className="text-[10px] font-mono uppercase text-neutral-400 block">
                          Imagen PNG Sin Fondo (Recortada)
                        </label>
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          <input
                            type="text"
                            placeholder="https://... o sube un archivo PNG"
                            value={newHeroImage}
                            onChange={(e) => setNewHeroImage(e.target.value)}
                            className="flex-1 w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                          />
                          <label className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shrink-0 transition-colors border border-neutral-700">
                            <Upload className="w-3.5 h-3.5 text-[#E6002B]" />
                            <span>Subir Archivo PNG</span>
                            <input
                              type="file"
                              accept="image/png,image/webp,image/jpeg"
                              onChange={(e) => handleHeroImageUpload(e)}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {newHeroImage && (
                          <div className="mt-2 flex items-center gap-3 p-2 bg-neutral-950 rounded-lg border border-neutral-800">
                            <div className="w-16 h-16 rounded bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:8px_8px] flex items-center justify-center p-1 overflow-hidden">
                              <img src={newHeroImage} alt="Preview" className="w-full h-full object-contain filter drop-shadow-md" />
                            </div>
                            <span className="text-xs text-emerald-400 font-mono">✓ Previsualización del recorte transparente</span>
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-mono font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Agregar Figura al Hero</span>
                      </button>
                    </form>
                  )}

                  {/* List of Existing Hero Players */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(content.heroPlayers || []).map((hp) => (
                      <div
                        key={hp.id}
                        className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-3 hover:border-neutral-700 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {/* Miniature Cutout Display with transparent grid indicator */}
                          <div className="w-16 h-20 rounded-lg bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:8px_8px] border border-neutral-800 flex items-center justify-center overflow-hidden shrink-0 relative group">
                            {hp.image ? (
                              <img
                                src={hp.image}
                                alt={hp.name}
                                className="w-full h-full object-contain filter drop-shadow-md transition-transform group-hover:scale-110"
                              />
                            ) : (
                              <Users className="w-6 h-6 text-neutral-600" />
                            )}
                            <label
                              className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white font-mono cursor-pointer transition-opacity text-center p-1"
                              title="Cambiar foto PNG"
                            >
                              <span>Cambiar PNG</span>
                              <input
                                type="file"
                                accept="image/png,image/webp,image/jpeg"
                                onChange={(e) => handleHeroImageUpload(e, hp.id)}
                                className="hidden"
                              />
                            </label>
                          </div>

                          {/* Quick Edit Inputs */}
                          <div className="flex-1 space-y-1.5 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                <span className="w-6 h-6 rounded bg-[#E6002B]/20 text-[#E6002B] text-xs font-black font-mono flex items-center justify-center shrink-0">
                                  #{hp.number}
                                </span>
                                <input
                                  type="text"
                                  value={hp.name}
                                  onChange={(e) => {
                                    const updated = (content.heroPlayers || []).map((p) =>
                                      p.id === hp.id ? { ...p, name: e.target.value } : p
                                    );
                                    updateHeroPlayers(updated);
                                  }}
                                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-2 py-0.5 text-xs font-bold text-white"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteHeroPlayer(hp.id)}
                                className="w-7 h-7 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-900/60 text-red-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                                title="Eliminar del Hero"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-1.5">
                              <input
                                type="text"
                                placeholder="Apodo"
                                value={hp.nickname}
                                onChange={(e) => {
                                  const updated = (content.heroPlayers || []).map((p) =>
                                    p.id === hp.id ? { ...p, nickname: e.target.value } : p
                                  );
                                  updateHeroPlayers(updated);
                                }}
                                className="bg-neutral-950 border border-neutral-800 rounded px-2 py-0.5 text-[11px] text-neutral-300 font-mono"
                              />
                              <input
                                type="number"
                                placeholder="Dorsal"
                                value={hp.number}
                                onChange={(e) => {
                                  const updated = (content.heroPlayers || []).map((p) =>
                                    p.id === hp.id ? { ...p, number: Number(e.target.value) } : p
                                  );
                                  updateHeroPlayers(updated);
                                }}
                                className="bg-neutral-950 border border-neutral-800 rounded px-2 py-0.5 text-[11px] text-white font-mono"
                              />
                            </div>

                            <input
                              type="text"
                              placeholder="Rol (ej: Capitán & Creador)"
                              value={hp.role}
                              onChange={(e) => {
                                const updated = (content.heroPlayers || []).map((p) =>
                                  p.id === hp.id ? { ...p, role: e.target.value } : p
                                );
                                updateHeroPlayers(updated);
                              }}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-0.5 text-[11px] text-[#E6002B]"
                            />
                          </div>
                        </div>

                        {/* Image URL input with direct change */}
                        <div className="pt-2 border-t border-neutral-800/80 flex items-center gap-2">
                          <label className="text-[9px] font-mono text-neutral-500 uppercase shrink-0">PNG URL:</label>
                          <input
                            type="text"
                            value={hp.image}
                            onChange={(e) => {
                              const updated = (content.heroPlayers || []).map((p) =>
                                p.id === hp.id ? { ...p, image: e.target.value } : p
                              );
                              updateHeroPlayers(updated);
                            }}
                            className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-2 py-0.5 text-[10px] text-neutral-400 font-mono"
                          />
                          <label className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-[10px] font-mono cursor-pointer shrink-0 transition-colors">
                            <span>Subir</span>
                            <input
                              type="file"
                              accept="image/png,image/webp,image/jpeg"
                              onChange={(e) => handleHeroImageUpload(e, hp.id)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => triggerSaveNotification('¡Portada guardada con éxito!')}
                  className="px-6 py-2.5 bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-mono font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios de Portada</span>
                </button>
              </div>
            )}

            {/* TAB 2: SEDE & HORARIOS (BAJO SEGUENCOMA) */}
            {activeTab === 'location' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div>
                    <h4 className="text-lg font-bold font-display text-white">
                      Sede Oficial de Entrenamiento & Horarios
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Gestiona la ubicación en Bajo Següencoma, los enlaces de Google Maps y los turnos de entrenamiento.
                    </p>
                  </div>
                  <button
                    onClick={() => scrollToSection('contacto')}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 border border-neutral-800"
                  >
                    <span>Ver en la página</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-neutral-900/60 p-5 rounded-xl border border-neutral-800 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                        Nombre del Complejo Deportivo
                      </label>
                      <input
                        type="text"
                        value={content.clubInfo.complexName}
                        onChange={(e) => updateClubInfo({ complexName: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-bold focus:border-[#E6002B]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                        Zona / Barrio
                      </label>
                      <input
                        type="text"
                        value={content.clubInfo.zone}
                        onChange={(e) => updateClubInfo({ zone: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:border-[#E6002B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                      Dirección Completa
                    </label>
                    <input
                      type="text"
                      value={content.clubInfo.address}
                      onChange={(e) => updateClubInfo({ address: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:border-[#E6002B]"
                    />
                  </div>

                  {/* Schedules Sub 7-13 & Sub 15-19 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-800">
                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                      <span className="text-xs font-mono uppercase text-[#E6002B] font-bold block mb-1">
                        Horario Grupo 1: Sub 7 a Sub 13
                      </span>
                      <input
                        type="text"
                        value={content.clubInfo.scheduleGroup1}
                        onChange={(e) => updateClubInfo({ scheduleGroup1: e.target.value })}
                        placeholder="Sub 7 a Sub 13: 15:00 a 16:30"
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-bold"
                      />
                      <span className="text-[10px] text-neutral-500 block mt-1">
                        Iniciación motriz y formación base.
                      </span>
                    </div>

                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                      <span className="text-xs font-mono uppercase text-[#E6002B] font-bold block mb-1">
                        Horario Grupo 2: Sub 15 a Sub 19
                      </span>
                      <input
                        type="text"
                        value={content.clubInfo.scheduleGroup2}
                        onChange={(e) => updateClubInfo({ scheduleGroup2: e.target.value })}
                        placeholder="Sub 15 a Sub 19: 16:30 a 18:00"
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-bold"
                      />
                      <span className="text-[10px] text-neutral-500 block mt-1">
                        Alto rendimiento y pre-élite competitivo.
                      </span>
                    </div>
                  </div>

                  {/* Google Maps URL */}
                  <div>
                    <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                      Enlace de Google Maps (Ubicación Compartible)
                    </label>
                    <input
                      type="url"
                      value={content.clubInfo.mapsUrl}
                      onChange={(e) => updateClubInfo({ mapsUrl: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-cyan-400 font-mono focus:border-[#E6002B]"
                    />
                    <span className="text-[10px] text-neutral-500 block mt-1">
                      Este es el enlace que los padres copiarán con el botón "Copiar Ubicación".
                    </span>
                  </div>

                  {/* WhatsApp & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-800">
                    <div>
                      <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                        WhatsApp Oficial de la Escuela
                      </label>
                      <input
                        type="text"
                        value={content.clubInfo.whatsapp}
                        onChange={(e) => updateClubInfo({ whatsapp: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                        Correo Institucional
                      </label>
                      <input
                        type="email"
                        value={content.clubInfo.email}
                        onChange={(e) => updateClubInfo({ email: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => triggerSaveNotification('¡Sede y horarios actualizados!')}
                  className="px-6 py-2.5 bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-mono font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Datos de Sede y Horarios</span>
                </button>
              </div>
            )}

            {/* TAB 3: CATEGORÍAS & PLANTELES */}
            {activeTab === 'squads' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div>
                    <h4 className="text-lg font-bold font-display text-white">
                      Planteles y Categorías Formativas ({content.squads.length})
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Desde Sub-7 hasta Primer Plantel. Edita nombres, minutos de práctica, niveles y descripciones.
                    </p>
                  </div>
                  <button
                    onClick={() => scrollToSection('squads')}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 border border-neutral-800"
                  >
                    <span>Ver en la página</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {content.squads.map((squad, sIdx) => (
                    <div
                      key={squad.id}
                      className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1">
                          <input
                            type="text"
                            value={squad.name}
                            onChange={(e) => {
                              const updated = [...content.squads];
                              updated[sIdx].name = e.target.value;
                              updateSquads(updated);
                            }}
                            className="bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-sm font-bold text-white max-w-[180px]"
                          />
                          <input
                            type="text"
                            value={squad.level}
                            onChange={(e) => {
                              const updated = [...content.squads];
                              updated[sIdx].level = e.target.value;
                              updateSquads(updated);
                            }}
                            placeholder="Nivel (ej: Formativo)"
                            className="bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-neutral-300 max-w-[140px]"
                          />
                          <div className="flex items-center gap-1 text-xs text-neutral-400">
                            <input
                              type="number"
                              value={squad.minutes}
                              onChange={(e) => {
                                const updated = [...content.squads];
                                updated[sIdx].minutes = Number(e.target.value);
                                updateSquads(updated);
                              }}
                              className="w-16 bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-1.5 text-xs text-white text-center"
                            />
                            <span>min/sesión</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            playUiClick();
                            const updated = content.squads.filter((_, i) => i !== sIdx);
                            updateSquads(updated);
                            triggerSaveNotification('Categoría eliminada');
                          }}
                          className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                          title="Eliminar Categoría"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <input
                          type="text"
                          value={squad.blurb}
                          onChange={(e) => {
                            const updated = [...content.squads];
                            updated[sIdx].blurb = e.target.value;
                            updateSquads(updated);
                          }}
                          placeholder="Descripción formativa de la categoría..."
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    playUiClick();
                    const newSquad: SquadItem = {
                      id: `squad-${Date.now()}`,
                      name: 'Nueva Categoría',
                      minutes: 60,
                      level: 'Formativo',
                      blurb: 'Entrenamientos en Complejo Social Litoral.',
                      metrics: [{ value: 'Mixto', label: 'enfoque' }]
                    };
                    updateSquads([...content.squads, newSquad]);
                    triggerSaveNotification('Nueva categoría añadida');
                  }}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-mono text-white rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#E6002B]" />
                  <span>Añadir Otra Categoría</span>
                </button>
              </div>
            )}

            {/* TAB 4: MATCH CENTER EN VIVO */}
            {activeTab === 'match' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div>
                    <h4 className="text-lg font-bold font-display text-white">
                      Match Center: Marcador & Incidencias en Vivo
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Controla el resultado en directo, el minuto de juego y publica goles en tiempo real.
                    </p>
                  </div>
                  <button
                    onClick={() => scrollToSection('match-center')}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 border border-neutral-800"
                  >
                    <span>Ver en la página</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-5 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    {/* Home Score */}
                    <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
                      <span className="text-xs text-neutral-400 block mb-1 font-mono">Goles Club MC (Local)</span>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleScoreChange('home', -1)}
                          className="w-8 h-8 rounded bg-neutral-900 text-white hover:bg-neutral-800 text-lg font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-4xl font-black font-mono text-white">
                          {liveMatch.scoreHome || 0}
                        </span>
                        <button
                          onClick={() => handleScoreChange('home', 1)}
                          className="w-8 h-8 rounded bg-[#E6002B] text-white hover:bg-[#FF1A40] text-lg font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Minute & Status */}
                    <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center space-y-2">
                      <span className="text-xs text-neutral-400 block font-mono">Minuto de Juego</span>
                      <div className="flex items-center justify-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={120}
                          value={liveMatch.currentMinute || 74}
                          onChange={(e) =>
                            onUpdateLiveMatch({ ...liveMatch, currentMinute: Number(e.target.value) })
                          }
                          className="w-20 bg-neutral-900 border border-neutral-700 text-white font-mono font-bold text-center text-xl rounded-lg py-1 focus:border-[#E6002B]"
                        />
                        <span className="text-xs text-neutral-400 font-mono">min</span>
                      </div>

                      <div className="pt-2 flex justify-center gap-1">
                        {(['upcoming', 'live', 'finished'] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => {
                              playUiClick();
                              onUpdateLiveMatch({ ...liveMatch, status: st });
                            }}
                            className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase cursor-pointer ${
                              liveMatch.status === st
                                ? 'bg-[#E6002B] text-white'
                                : 'bg-neutral-900 text-neutral-400'
                            }`}
                          >
                            {st === 'live' ? 'En Vivo' : st === 'upcoming' ? 'Próximo' : 'Final'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Away Score */}
                    <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
                      <span className="text-xs text-neutral-400 block mb-1 font-mono">
                        Goles {liveMatch.opponentShort || 'Rival'}
                      </span>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleScoreChange('away', -1)}
                          className="w-8 h-8 rounded bg-neutral-900 text-white hover:bg-neutral-800 text-lg font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-4xl font-black font-mono text-white">
                          {liveMatch.scoreAway || 0}
                        </span>
                        <button
                          onClick={() => handleScoreChange('away', 1)}
                          className="w-8 h-8 rounded bg-neutral-800 text-white hover:bg-neutral-700 text-lg font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-1 font-mono">Rival</label>
                      <input
                        type="text"
                        value={liveMatch.opponent}
                        onChange={(e) => onUpdateLiveMatch({ ...liveMatch, opponent: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-1 font-mono">Competición</label>
                      <input
                        type="text"
                        value={liveMatch.competition}
                        onChange={(e) => onUpdateLiveMatch({ ...liveMatch, competition: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-1 font-mono">Estadio / Predio</label>
                      <input
                        type="text"
                        value={liveMatch.venue}
                        onChange={(e) => onUpdateLiveMatch({ ...liveMatch, venue: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Add Event Form */}
                <form
                  onSubmit={handleAddMatchEvent}
                  className="p-5 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-4"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#E6002B] block">
                    Publicar Incidencia en Tiempo Real
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[10px] uppercase text-neutral-400 block mb-1">Minuto</label>
                      <input
                        type="number"
                        min={1}
                        max={120}
                        value={newEventMinute}
                        onChange={(e) => setNewEventMinute(Number(e.target.value))}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-neutral-400 block mb-1">Tipo</label>
                      <select
                        value={newEventType}
                        onChange={(e) => setNewEventType(e.target.value as any)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white"
                      >
                        <option value="goal">⚽ Gol</option>
                        <option value="card-yellow">🟨 Tarjeta Amarilla</option>
                        <option value="card-red">🟥 Tarjeta Roja</option>
                        <option value="sub">🔄 Cambio / Sustitución</option>
                        <option value="var">🖥️ Revisión VAR</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-neutral-400 block mb-1">Equipo</label>
                      <select
                        value={newEventTeam}
                        onChange={(e) => setNewEventTeam(e.target.value as any)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white"
                      >
                        <option value="home">Club MC (Local)</option>
                        <option value="away">{liveMatch.opponentShort || 'Rival'}</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-neutral-400 block mb-1">Jugador</label>
                      <input
                        type="text"
                        value={newEventPlayer}
                        onChange={(e) => setNewEventPlayer(e.target.value)}
                        placeholder="Nombre y Dorsal"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-neutral-400 block mb-1">Detalle o Asistencia</label>
                    <input
                      type="text"
                      value={newEventDetail}
                      onChange={(e) => setNewEventDetail(e.target.value)}
                      placeholder="Ej: Remate de cabeza tras tiro de esquina"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-mono font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publicar Incidencia en Vivo</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB: AGENDA & CALENDARIO */}
            {activeTab === 'calendar' && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
                  <div>
                    <h4 className="text-xl font-bold font-display text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#E6002B]" />
                      <span>Agenda Deportiva & Calendario ({content.events.length})</span>
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Configura partidos oficiales, entrenamientos y pruebas en el Complejo Deportivo Social Litoral.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => scrollToSection('calendario')}
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 border border-neutral-800"
                    >
                      <span>Ver en la página</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsAddingEvent(!isAddingEvent)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#E6002B] hover:bg-[#FF1A40] text-xs font-mono font-bold text-white flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAddingEvent ? 'Cancelar' : 'Añadir Evento'}</span>
                    </button>
                  </div>
                </div>

                {/* Form to add new event */}
                {isAddingEvent && (
                  <form onSubmit={handleAddCalendarEvent} className="p-5 bg-neutral-900/80 border border-[#E6002B]/40 rounded-2xl space-y-4 animate-in fade-in">
                    <h5 className="text-sm font-bold text-white flex items-center gap-2">
                      <Plus className="w-4 h-4 text-[#E6002B]" />
                      <span>Nuevo Evento en la Agenda</span>
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Título del Evento</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej: Clásico Juvenil Sub-17 vs Bolívar"
                          value={newEventTitle}
                          onChange={(e) => setNewEventTitle(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Categoría</label>
                        <select
                          value={newEventCategory}
                          onChange={(e) => setNewEventCategory(e.target.value as any)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                        >
                          <option value="Primer Plantel">Primer Plantel</option>
                          <option value="Escuela">Escuela</option>
                          <option value="Clínica">Clínica</option>
                          <option value="Pruebas">Pruebas</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Fecha</label>
                        <input
                          type="text"
                          placeholder="Ej: 24 Octubre, 2026"
                          value={newEventDate}
                          onChange={(e) => setNewEventDate(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Horario</label>
                        <input
                          type="text"
                          placeholder="Ej: 15:30"
                          value={newEventTime}
                          onChange={(e) => setNewEventTime(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Lugar / Sede</label>
                        <input
                          type="text"
                          value={newEventLocation}
                          onChange={(e) => setNewEventLocation(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Descripción</label>
                        <textarea
                          rows={2}
                          placeholder="Detalles sobre el partido o jornada deportiva..."
                          value={newEventDesc}
                          onChange={(e) => setNewEventDesc(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-3 text-xs text-white resize-none"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="newRegOpen"
                          checked={newEventRegOpen}
                          onChange={(e) => setNewEventRegOpen(e.target.checked)}
                          className="rounded border-neutral-700 bg-neutral-950 text-[#E6002B]"
                        />
                        <label htmlFor="newRegOpen" className="text-xs text-neutral-300">Convocatoria / Registro Abierto</label>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-mono font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Guardar Nuevo Evento</span>
                    </button>
                  </form>
                )}

                {/* List of events */}
                <div className="space-y-4">
                  {content.events.map((event, idx) => (
                    <div
                      key={event.id}
                      className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-3 hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800/80">
                        <div className="flex-1 flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-400 flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={event.title}
                            onChange={(e) => {
                              const updated = content.events.map((ev) =>
                                ev.id === event.id ? { ...ev, title: e.target.value } : ev
                              );
                              updateEvents(updated);
                            }}
                            className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-bold text-white"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={event.category}
                            onChange={(e) => {
                              const updated = content.events.map((ev) =>
                                ev.id === event.id ? { ...ev, category: e.target.value as any } : ev
                              );
                              updateEvents(updated);
                            }}
                            className="bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#E6002B]"
                          >
                            <option value="Primer Plantel">Primer Plantel</option>
                            <option value="Escuela">Escuela</option>
                            <option value="Clínica">Clínica</option>
                            <option value="Pruebas">Pruebas</option>
                          </select>
                          <button
                            onClick={() => handleDeleteCalendarEvent(event.id)}
                            className="w-8 h-8 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-900/60 text-red-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                            title="Eliminar evento"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[9px] font-mono uppercase text-neutral-500 block mb-1">Fecha</label>
                          <input
                            type="text"
                            value={event.date}
                            onChange={(e) => {
                              const updated = content.events.map((ev) =>
                                ev.id === event.id ? { ...ev, date: e.target.value } : ev
                              );
                              updateEvents(updated);
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono uppercase text-neutral-500 block mb-1">Horario</label>
                          <input
                            type="text"
                            value={event.time}
                            onChange={(e) => {
                              const updated = content.events.map((ev) =>
                                ev.id === event.id ? { ...ev, time: e.target.value } : ev
                              );
                              updateEvents(updated);
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono uppercase text-neutral-500 block mb-1">Lugar</label>
                          <input
                            type="text"
                            value={event.location}
                            onChange={(e) => {
                              const updated = content.events.map((ev) =>
                                ev.id === event.id ? { ...ev, location: e.target.value } : ev
                              );
                              updateEvents(updated);
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-mono uppercase text-neutral-500 block mb-1">Descripción</label>
                        <textarea
                          rows={2}
                          value={event.description}
                          onChange={(e) => {
                            const updated = content.events.map((ev) =>
                              ev.id === event.id ? { ...ev, description: e.target.value } : ev
                            );
                            updateEvents(updated);
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-neutral-300 resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => triggerSaveNotification('¡Agenda y calendario guardados!')}
                  className="px-6 py-2.5 bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-mono font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Toda la Agenda</span>
                </button>
              </div>
            )}

            {/* TAB: FICHAS DE JUGADORES */}
            {activeTab === 'players' && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
                  <div>
                    <h4 className="text-xl font-bold font-display text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#E6002B]" />
                      <span>Fichas de Jugadores & Plantel ({players.length})</span>
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Edita dorsales, nombres, posiciones, estadísticas clave y biografías deportivas.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => scrollToSection('plantilla')}
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 border border-neutral-800"
                    >
                      <span>Ver en la página</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsAddingPlayer(!isAddingPlayer)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#E6002B] hover:bg-[#FF1A40] text-xs font-mono font-bold text-white flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAddingPlayer ? 'Cancelar' : 'Añadir Jugador'}</span>
                    </button>
                  </div>
                </div>

                {/* Form to add new player */}
                {isAddingPlayer && (
                  <form onSubmit={handleAddPlayer} className="p-5 bg-neutral-900/80 border border-[#E6002B]/40 rounded-2xl space-y-4 animate-in fade-in">
                    <h5 className="text-sm font-bold text-white flex items-center gap-2">
                      <Plus className="w-4 h-4 text-[#E6002B]" />
                      <span>Nuevo Jugador para el Plantel</span>
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Nombre Completo</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej: Marcelo Martins"
                          value={newPlayerName}
                          onChange={(e) => setNewPlayerName(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Apodo / Nombre Deportivo</label>
                        <input
                          type="text"
                          placeholder="Ej: El Matador"
                          value={newPlayerNickname}
                          onChange={(e) => setNewPlayerNickname(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Dorsal (Número)</label>
                        <input
                          type="number"
                          value={newPlayerNumber}
                          onChange={(e) => setNewPlayerNumber(Number(e.target.value))}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Posición</label>
                        <select
                          value={newPlayerPosition}
                          onChange={(e) => setNewPlayerPosition(e.target.value as any)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                        >
                          <option value="Delantero">Delantero</option>
                          <option value="Mediocampista">Mediocampista</option>
                          <option value="Defensa">Defensa</option>
                          <option value="Arquero">Arquero</option>
                          <option value="Cuerpo Técnico">Cuerpo Técnico</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Categoría</label>
                        <select
                          value={newPlayerCategory}
                          onChange={(e) => setNewPlayerCategory(e.target.value as any)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                        >
                          <option value="primer-plantel">Primer Plantel</option>
                          <option value="escuela-juvenil">Escuela Juvenil</option>
                          <option value="staff">Staff / Técnico</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Edad</label>
                        <input
                          type="number"
                          value={newPlayerAge}
                          onChange={(e) => setNewPlayerAge(Number(e.target.value))}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Estatura</label>
                        <input
                          type="text"
                          value={newPlayerHeight}
                          onChange={(e) => setNewPlayerHeight(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Pie Hábil</label>
                        <select
                          value={newPlayerFoot}
                          onChange={(e) => setNewPlayerFoot(e.target.value as any)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                        >
                          <option value="Derecho">Derecho</option>
                          <option value="Izquierdo">Izquierdo</option>
                          <option value="Ambidiestro">Ambidiestro</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Nacionalidad</label>
                        <input
                          type="text"
                          value={newPlayerNationality}
                          onChange={(e) => setNewPlayerNationality(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Biografía / Perfil Deportivo</label>
                        <textarea
                          rows={2}
                          placeholder="Trayectoria o descripción técnica del jugador..."
                          value={newPlayerBio}
                          onChange={(e) => setNewPlayerBio(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-3 text-xs text-white resize-none"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">
                          Foto / Imagen PNG (Sin fondo recomendada)
                        </label>
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                          <input
                            type="text"
                            placeholder="https://... o sube un archivo PNG sin fondo"
                            value={newPlayerImage}
                            onChange={(e) => setNewPlayerImage(e.target.value)}
                            className="flex-1 w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                          />
                          <label className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shrink-0 transition-colors border border-neutral-700">
                            <Upload className="w-3.5 h-3.5 text-[#E6002B]" />
                            <span>Subir PNG</span>
                            <input
                              type="file"
                              accept="image/png,image/webp,image/jpeg"
                              onChange={(e) => handlePlayerImageUpload(e)}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {newPlayerImage && (
                          <div className="mt-2 flex items-center gap-3 p-2 bg-neutral-950 rounded-lg border border-neutral-800">
                            <div className="w-12 h-12 rounded bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:6px_6px] flex items-center justify-center p-1 overflow-hidden">
                              <img src={newPlayerImage} alt="Preview" className="w-full h-full object-contain filter drop-shadow-md" />
                            </div>
                            <span className="text-[11px] text-emerald-400 font-mono">✓ Previsualización del recorte sin fondo</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-mono font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar Jugador al Plantel</span>
                    </button>
                  </form>
                )}

                {/* Filter Selector */}
                <div className="flex flex-wrap items-center gap-2 pb-2">
                  {[
                    { id: 'todos', label: 'Todos' },
                    { id: 'primer-plantel', label: 'Primer Plantel' },
                    { id: 'escuela-juvenil', label: 'Escuela Juvenil' },
                    { id: 'staff', label: 'Cuerpo Técnico' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setPlayerCategoryFilter(f.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                        playerCategoryFilter === f.id
                          ? 'bg-[#E6002B] text-white font-bold'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* List of Players */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {players
                    .filter((p) =>
                      playerCategoryFilter === 'todos' ? true : p.category === playerCategoryFilter
                    )
                    .map((player) => (
                      <div
                        key={player.id}
                        className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-3 hover:border-neutral-700 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5 flex-1">
                            {/* Miniature player photo or number */}
                            <div className="relative w-12 h-14 rounded-lg bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:6px_6px] border border-neutral-800 flex items-center justify-center overflow-hidden shrink-0 group">
                              {player.image ? (
                                <img src={player.image} alt={player.name} className="w-full h-full object-contain filter drop-shadow-sm" />
                              ) : (
                                <span className="text-sm font-black font-mono text-[#E6002B]">#{player.number}</span>
                              )}
                              <label className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] text-white font-mono cursor-pointer transition-opacity text-center p-0.5">
                                <span>PNG</span>
                                <input
                                  type="file"
                                  accept="image/png,image/webp,image/jpeg"
                                  onChange={(e) => handlePlayerImageUpload(e, player.id)}
                                  className="hidden"
                                />
                              </label>
                            </div>
                            <div className="flex-1">
                              <input
                                type="text"
                                value={player.name}
                                onChange={(e) => {
                                  const updated = players.map((p) =>
                                    p.id === player.id ? { ...p, name: e.target.value } : p
                                  );
                                  onUpdatePlayers(updated);
                                }}
                                className="w-full bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1 text-xs font-bold text-white mb-1"
                              />
                              <input
                                type="text"
                                placeholder="Apodo"
                                value={player.nickname || ''}
                                onChange={(e) => {
                                  const updated = players.map((p) =>
                                    p.id === player.id ? { ...p, nickname: e.target.value } : p
                                  );
                                  onUpdatePlayers(updated);
                                }}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-0.5 text-[11px] text-neutral-400 font-mono"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeletePlayer(player.id)}
                            className="w-8 h-8 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-900/60 text-red-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                            title="Eliminar jugador"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[9px] font-mono text-neutral-500 block">Dorsal</label>
                            <input
                              type="number"
                              value={player.number}
                              onChange={(e) => {
                                const updated = players.map((p) =>
                                  p.id === player.id ? { ...p, number: Number(e.target.value) } : p
                                );
                                onUpdatePlayers(updated);
                              }}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-xs text-white font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-mono text-neutral-500 block">Posición</label>
                            <select
                              value={player.position}
                              onChange={(e) => {
                                const updated = players.map((p) =>
                                  p.id === player.id ? { ...p, position: e.target.value as any } : p
                                );
                                onUpdatePlayers(updated);
                              }}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-xs text-white"
                            >
                              <option value="Delantero">Delantero</option>
                              <option value="Mediocampista">Mediocampista</option>
                              <option value="Defensa">Defensa</option>
                              <option value="Arquero">Arquero</option>
                              <option value="Cuerpo Técnico">Cuerpo Técnico</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[9px] font-mono text-neutral-500 block">Categoría</label>
                            <select
                              value={player.category}
                              onChange={(e) => {
                                const updated = players.map((p) =>
                                  p.id === player.id ? { ...p, category: e.target.value as any } : p
                                );
                                onUpdatePlayers(updated);
                              }}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-xs text-white"
                            >
                              <option value="primer-plantel">1er Plantel</option>
                              <option value="escuela-juvenil">Escuela</option>
                              <option value="staff">Staff</option>
                            </select>
                          </div>
                        </div>

                        {/* Player Stats Grid */}
                        <div className="grid grid-cols-4 gap-2 pt-1 border-t border-neutral-800/60 text-center">
                          <div>
                            <label className="text-[9px] font-mono text-neutral-500 block">Partidos</label>
                            <input
                              type="number"
                              value={player.matchesPlayed}
                              onChange={(e) => {
                                const updated = players.map((p) =>
                                  p.id === player.id ? { ...p, matchesPlayed: Number(e.target.value) } : p
                                );
                                onUpdatePlayers(updated);
                              }}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded px-1.5 py-0.5 text-xs text-white font-mono text-center"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-mono text-neutral-500 block">Goles</label>
                            <input
                              type="number"
                              value={player.goals}
                              onChange={(e) => {
                                const updated = players.map((p) =>
                                  p.id === player.id ? { ...p, goals: Number(e.target.value) } : p
                                );
                                onUpdatePlayers(updated);
                              }}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded px-1.5 py-0.5 text-xs text-emerald-400 font-mono font-bold text-center"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-mono text-neutral-500 block">Asistencias</label>
                            <input
                              type="number"
                              value={player.assists}
                              onChange={(e) => {
                                const updated = players.map((p) =>
                                  p.id === player.id ? { ...p, assists: Number(e.target.value) } : p
                                );
                                onUpdatePlayers(updated);
                              }}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded px-1.5 py-0.5 text-xs text-cyan-400 font-mono font-bold text-center"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-mono text-neutral-500 block">Edad</label>
                            <input
                              type="number"
                              value={player.age}
                              onChange={(e) => {
                                const updated = players.map((p) =>
                                  p.id === player.id ? { ...p, age: Number(e.target.value) } : p
                                );
                                onUpdatePlayers(updated);
                              }}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded px-1.5 py-0.5 text-xs text-white font-mono text-center"
                            />
                          </div>
                        </div>

                        <textarea
                          rows={2}
                          value={player.bio}
                          onChange={(e) => {
                            const updated = players.map((p) =>
                              p.id === player.id ? { ...p, bio: e.target.value } : p
                            );
                            onUpdatePlayers(updated);
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-neutral-300 resize-none"
                        />

                        {/* Player Photo Input & Upload */}
                        <div className="flex items-center gap-2 pt-1 border-t border-neutral-800/80">
                          <label className="text-[9px] font-mono text-neutral-500 uppercase shrink-0">Foto PNG:</label>
                          <input
                            type="text"
                            placeholder="URL o sube PNG..."
                            value={player.image || ''}
                            onChange={(e) => {
                              const updated = players.map((p) =>
                                p.id === player.id ? { ...p, image: e.target.value } : p
                              );
                              onUpdatePlayers(updated);
                            }}
                            className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-2 py-0.5 text-[10px] text-neutral-400 font-mono"
                          />
                          <label className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-[10px] font-mono cursor-pointer shrink-0 transition-colors">
                            <span>Subir</span>
                            <input
                              type="file"
                              accept="image/png,image/webp,image/jpeg"
                              onChange={(e) => handlePlayerImageUpload(e, player.id)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                </div>

                <button
                  onClick={() => triggerSaveNotification('¡Plantilla de jugadores actualizada!')}
                  className="px-6 py-2.5 bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-mono font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Plantel de Jugadores</span>
                </button>
              </div>
            )}

            {/* TAB: METODOLOGÍA */}
            {activeTab === 'method' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div>
                    <h4 className="text-xl font-bold font-display text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#E6002B]" />
                      <span>Metodología Formativa & Indicadores de Rendimiento</span>
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Edita las 3 fases del modelo (Táctica, Técnica, Físico) y los 4 contadores estadísticos de la web.
                    </p>
                  </div>
                  <button
                    onClick={() => scrollToSection('method')}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 border border-neutral-800"
                  >
                    <span>Ver en la página</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 3 Step Cards */}
                <div className="space-y-4">
                  <h5 className="text-xs font-mono uppercase text-[#E6002B] font-bold">
                    Las 3 Fases Metodológicas
                  </h5>
                  <div className="grid grid-cols-1 gap-4">
                    {content.methodSteps.map((step, idx) => (
                      <div
                        key={step.step}
                        className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-[#E6002B]/20 text-[#E6002B] font-black font-display flex items-center justify-center text-sm border border-[#E6002B]/30">
                            {step.step}
                          </span>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => {
                              const updated = [...content.methodSteps];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              updateMethodSteps(updated);
                            }}
                            className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-bold text-white uppercase"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={step.body}
                          onChange={(e) => {
                            const updated = [...content.methodSteps];
                            updated[idx] = { ...updated[idx], body: e.target.value };
                            updateMethodSteps(updated);
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-300 resize-none leading-relaxed"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4 Performance Counters */}
                <div className="space-y-4 pt-2">
                  <h5 className="text-xs font-mono uppercase text-[#E6002B] font-bold">
                    Los 4 Contadores & Métricas Numéricas
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {content.methodMetrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <label className="text-[9px] font-mono text-neutral-500 block">Valor</label>
                            <input
                              type="number"
                              value={metric.value}
                              onChange={(e) => {
                                const updated = [...content.methodMetrics];
                                updated[idx] = { ...updated[idx], value: Number(e.target.value) };
                                updateMethodMetrics(updated);
                              }}
                              className="w-full bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-sm font-bold text-white text-center font-mono"
                            />
                          </div>
                          <div className="w-14">
                            <label className="text-[9px] font-mono text-neutral-500 block">Sufijo</label>
                            <input
                              type="text"
                              value={metric.suffix}
                              onChange={(e) => {
                                const updated = [...content.methodMetrics];
                                updated[idx] = { ...updated[idx], suffix: e.target.value };
                                updateMethodMetrics(updated);
                              }}
                              className="w-full bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-sm font-bold text-[#E6002B] text-center font-mono"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[9px] font-mono text-neutral-500 block">Etiqueta</label>
                          <input
                            type="text"
                            value={metric.label}
                            onChange={(e) => {
                              const updated = [...content.methodMetrics];
                              updated[idx] = { ...updated[idx], label: e.target.value };
                              updateMethodMetrics(updated);
                            }}
                            className="w-full bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-xs text-neutral-300 font-mono text-center"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => triggerSaveNotification('¡Metodología e indicadores actualizados!')}
                  className="px-6 py-2.5 bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-mono font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Metodología & Indicadores</span>
                </button>
              </div>
            )}

            {/* TAB 5: MEMBRESÍAS & CUOTAS */}
            {activeTab === 'memberships' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div>
                    <h4 className="text-lg font-bold font-display text-white">
                      Membresías & Planes Formativos en Bolivianos (Bs.)
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Edita las cuotas mensuales, anuales y los beneficios incluidos en cada plan.
                    </p>
                  </div>
                  <button
                    onClick={() => scrollToSection('memberships')}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 border border-neutral-800"
                  >
                    <span>Ver en la página</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {content.memberships.map((plan, pIdx) => (
                    <div
                      key={plan.id}
                      className="p-5 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={plan.name}
                            onChange={(e) => {
                              const updated = [...content.memberships];
                              updated[pIdx].name = e.target.value;
                              updateMemberships(updated);
                            }}
                            className="bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1 text-sm font-bold text-white w-full mr-2"
                          />
                          <button
                            onClick={() => {
                              const updated = [...content.memberships];
                              updated[pIdx].featured = !updated[pIdx].featured;
                              updateMemberships(updated);
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold shrink-0 ${
                              plan.featured ? 'bg-[#E6002B] text-white' : 'bg-neutral-800 text-neutral-400'
                            }`}
                          >
                            {plan.featured ? 'Destacado' : 'Normal'}
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-neutral-400 block font-mono">Mensual (Bs.)</label>
                            <input
                              type="number"
                              value={plan.monthly}
                              onChange={(e) => {
                                const updated = [...content.memberships];
                                updated[pIdx].monthly = Number(e.target.value);
                                updateMemberships(updated);
                              }}
                              className="w-full bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-xs text-white font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-neutral-400 block font-mono">Anual (Bs.)</label>
                            <input
                              type="number"
                              value={plan.annual}
                              onChange={(e) => {
                                const updated = [...content.memberships];
                                updated[pIdx].annual = Number(e.target.value);
                                updateMemberships(updated);
                              }}
                              className="w-full bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-xs text-white font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-400 block font-mono mb-1">Frase / Tagline</label>
                          <input
                            type="text"
                            value={plan.tagline}
                            onChange={(e) => {
                              const updated = [...content.memberships];
                              updated[pIdx].tagline = e.target.value;
                              updateMemberships(updated);
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-300"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-400 block font-mono mb-1">Beneficios (1 por línea)</label>
                          <textarea
                            rows={3}
                            value={plan.features.join('\n')}
                            onChange={(e) => {
                              const updated = [...content.memberships];
                              updated[pIdx].features = e.target.value.split('\n').filter((f) => f.trim().length > 0);
                              updateMemberships(updated);
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-neutral-300 font-mono resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => triggerSaveNotification('¡Planes y precios guardados!')}
                  className="px-6 py-2.5 bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-mono font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Precios de Membresías</span>
                </button>
              </div>
            )}

            {/* TAB 6: CUERPO TÉCNICO (STAFF) */}
            {activeTab === 'staff' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div>
                    <h4 className="text-lg font-bold font-display text-white">
                      Cuerpo Técnico y Entrenadores ({content.staff.length})
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Profesionales al mando de la metodología, preparación física y formación técnica.
                    </p>
                  </div>
                  <button
                    onClick={() => scrollToSection('staff')}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 border border-neutral-800"
                  >
                    <span>Ver en la página</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {content.staff.map((st, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={st.name}
                          onChange={(e) => {
                            const updated = [...content.staff];
                            updated[idx].name = e.target.value;
                            updateStaff(updated);
                          }}
                          className="bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-bold text-white flex-1"
                        />
                        <input
                          type="text"
                          value={st.badge}
                          onChange={(e) => {
                            const updated = [...content.staff];
                            updated[idx].badge = e.target.value;
                            updateStaff(updated);
                          }}
                          className="bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-1 text-[11px] text-[#E6002B] font-mono font-bold max-w-[120px] text-center"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={st.role}
                          onChange={(e) => {
                            const updated = [...content.staff];
                            updated[idx].role = e.target.value;
                            updateStaff(updated);
                          }}
                          placeholder="Licencia o Especialidad"
                          className="bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-300 font-mono"
                        />
                      </div>

                      <textarea
                        rows={2}
                        value={st.line}
                        onChange={(e) => {
                          const updated = [...content.staff];
                          updated[idx].line = e.target.value;
                          updateStaff(updated);
                        }}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-neutral-300 resize-none"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => triggerSaveNotification('¡Cuerpo técnico actualizado!')}
                  className="px-6 py-2.5 bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-mono font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cuerpo Técnico</span>
                </button>
              </div>
            )}

            {/* TAB 7: PREGUNTAS FRECUENTES (FAQ) */}
            {activeTab === 'faq' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div>
                    <h4 className="text-lg font-bold font-display text-white">
                      Preguntas Frecuentes ({content.faq.length})
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Resuelve las dudas de los padres de familia sobre inscripciones, canchas y torneos.
                    </p>
                  </div>
                  <button
                    onClick={() => scrollToSection('faq')}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 border border-neutral-800"
                  >
                    <span>Ver en la página</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {content.faq.map((item, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          value={item.q}
                          onChange={(e) => {
                            const updated = [...content.faq];
                            updated[fIdx].q = e.target.value;
                            updateFaq(updated);
                          }}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-bold text-white"
                        />
                        <button
                          onClick={() => {
                            playUiClick();
                            const updated = content.faq.filter((_, i) => i !== fIdx);
                            updateFaq(updated);
                            triggerSaveNotification('Pregunta eliminada');
                          }}
                          className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <textarea
                        rows={2}
                        value={item.a}
                        onChange={(e) => {
                          const updated = [...content.faq];
                          updated[fIdx].a = e.target.value;
                          updateFaq(updated);
                        }}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-xs text-neutral-300 resize-none"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    playUiClick();
                    const newFaq: FaqItem = {
                      q: '¿Nueva Pregunta Frecuente?',
                      a: 'Respuesta detallada con información para los alumnos y padres.'
                    };
                    updateFaq([...content.faq, newFaq]);
                    triggerSaveNotification('Pregunta añadida');
                  }}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-mono text-white rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#E6002B]" />
                  <span>Añadir Otra Pregunta Frecuente</span>
                </button>
              </div>
            )}

            {/* TAB 8: TIENDA 3D & STOCK */}
            {activeTab === 'store' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div>
                    <h4 className="text-lg font-bold font-display text-white">
                      Catálogo de la Tienda Oficial en Bolivianos (Bs.)
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Actualiza precios, inventario y productos personalizables en 3D.
                    </p>
                  </div>
                  <button
                    onClick={() => scrollToSection('tienda')}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 border border-neutral-800"
                  >
                    <span>Ver en la página</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={prod.name}
                            onChange={(e) => {
                              const updated = products.map((p) =>
                                p.id === prod.id ? { ...p, name: e.target.value } : p
                              );
                              onUpdateProducts(updated);
                            }}
                            className="w-full bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1 text-xs font-bold text-white mb-1"
                          />
                          <span className="text-[10px] font-mono text-[#E6002B] uppercase font-bold">
                            {prod.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div>
                            <label className="text-[9px] text-neutral-500 font-mono block">Precio (Bs.)</label>
                            <input
                              type="number"
                              value={prod.price}
                              onChange={(e) => {
                                const updated = products.map((p) =>
                                  p.id === prod.id ? { ...p, price: Number(e.target.value) } : p
                                );
                                onUpdateProducts(updated);
                              }}
                              className="w-20 bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-xs font-bold text-white text-right"
                            />
                          </div>

                          <div>
                            <label className="text-[9px] text-neutral-500 font-mono block">Stock</label>
                            <input
                              type="number"
                              value={prod.stock}
                              onChange={(e) => {
                                const updated = products.map((p) =>
                                  p.id === prod.id ? { ...p, stock: Number(e.target.value) } : p
                                );
                                onUpdateProducts(updated);
                              }}
                              className="w-16 bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-xs text-white text-right"
                            />
                          </div>
                        </div>
                      </div>

                      <textarea
                        rows={2}
                        value={prod.description}
                        onChange={(e) => {
                          const updated = products.map((p) =>
                            p.id === prod.id ? { ...p, description: e.target.value } : p
                          );
                          onUpdateProducts(updated);
                        }}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-neutral-300 resize-none"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => triggerSaveNotification('¡Catálogo de productos actualizado!')}
                  className="px-6 py-2.5 bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-mono font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Inventario de Tienda</span>
                </button>
              </div>
            )}

            {/* TAB: NOTICIAS & BLOG */}
            {activeTab === 'news' && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
                  <div>
                    <h4 className="text-xl font-bold font-display text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#E6002B]" />
                      <span>Noticias, Comunicados & Prensa Oficial ({news.length})</span>
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Publica artículos del Primer Plantel, informes de la escuela y comunicados oficiales.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => scrollToSection('noticias')}
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 border border-neutral-800"
                    >
                      <span>Ver en la página</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsAddingNews(!isAddingNews)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#E6002B] hover:bg-[#FF1A40] text-xs font-mono font-bold text-white flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAddingNews ? 'Cancelar' : 'Nueva Noticia'}</span>
                    </button>
                  </div>
                </div>

                {/* Form to add new article */}
                {isAddingNews && (
                  <form onSubmit={handleAddNews} className="p-5 bg-neutral-900/80 border border-[#E6002B]/40 rounded-2xl space-y-4 animate-in fade-in">
                    <h5 className="text-sm font-bold text-white flex items-center gap-2">
                      <Plus className="w-4 h-4 text-[#E6002B]" />
                      <span>Publicar Nueva Noticia o Comunicado</span>
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Titular de la Noticia</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej: Victoria histórica en el Complejo Social Litoral"
                          value={newNewsTitle}
                          onChange={(e) => setNewNewsTitle(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Categoría</label>
                        <select
                          value={newNewsCategory}
                          onChange={(e) => setNewNewsCategory(e.target.value as any)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                        >
                          <option value="Primer Plantel">Primer Plantel</option>
                          <option value="Escuela Formativa">Escuela Formativa</option>
                          <option value="Institucional">Institucional</option>
                          <option value="Torneos">Torneos</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Fecha de Publicación</label>
                        <input
                          type="text"
                          value={newNewsDate}
                          onChange={(e) => setNewNewsDate(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Tiempo de Lectura</label>
                        <input
                          type="text"
                          value={newNewsReadTime}
                          onChange={(e) => setNewNewsReadTime(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Autor</label>
                        <input
                          type="text"
                          value={newNewsAuthor}
                          onChange={(e) => setNewNewsAuthor(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Resumen Breve (Bajada)</label>
                        <textarea
                          rows={2}
                          placeholder="Resumen introductorio que aparece en la tarjeta..."
                          value={newNewsSummary}
                          onChange={(e) => setNewNewsSummary(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-3 text-xs text-white resize-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Cuerpo Completo del Artículo (Separar párrafos con doble enter)</label>
                        <textarea
                          rows={4}
                          placeholder="Texto completo de la crónica o comunicado..."
                          value={newNewsContent}
                          onChange={(e) => setNewNewsContent(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-3 text-xs text-white resize-none leading-relaxed"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-mono font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Publicar Artículo</span>
                    </button>
                  </form>
                )}

                {/* List of articles */}
                <div className="space-y-4">
                  {news.map((art) => (
                    <div
                      key={art.id}
                      className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-3 hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800/80">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={art.title}
                            onChange={(e) => {
                              const updated = news.map((n) =>
                                n.id === art.id ? { ...n, title: e.target.value } : n
                              );
                              onUpdateNews(updated);
                            }}
                            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-bold text-white mb-1"
                          />
                          <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
                            <span className="text-[#E6002B] font-bold uppercase">{art.category}</span>
                            <span>·</span>
                            <span>{art.date}</span>
                            <span>·</span>
                            <span>{art.readTime}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={art.category}
                            onChange={(e) => {
                              const updated = news.map((n) =>
                                n.id === art.id ? { ...n, category: e.target.value as any } : n
                              );
                              onUpdateNews(updated);
                            }}
                            className="bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-white"
                          >
                            <option value="Primer Plantel">Primer Plantel</option>
                            <option value="Escuela Formativa">Escuela Formativa</option>
                            <option value="Institucional">Institucional</option>
                            <option value="Torneos">Torneos</option>
                          </select>
                          <button
                            onClick={() => handleDeleteNews(art.id)}
                            className="w-8 h-8 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-900/60 text-red-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                            title="Eliminar noticia"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[9px] font-mono uppercase text-neutral-500 block mb-1">Fecha</label>
                          <input
                            type="text"
                            value={art.date}
                            onChange={(e) => {
                              const updated = news.map((n) =>
                                n.id === art.id ? { ...n, date: e.target.value } : n
                              );
                              onUpdateNews(updated);
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono uppercase text-neutral-500 block mb-1">Tiempo de Lectura</label>
                          <input
                            type="text"
                            value={art.readTime}
                            onChange={(e) => {
                              const updated = news.map((n) =>
                                n.id === art.id ? { ...n, readTime: e.target.value } : n
                              );
                              onUpdateNews(updated);
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono uppercase text-neutral-500 block mb-1">Autor</label>
                          <input
                            type="text"
                            value={art.author}
                            onChange={(e) => {
                              const updated = news.map((n) =>
                                n.id === art.id ? { ...n, author: e.target.value } : n
                              );
                              onUpdateNews(updated);
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-mono uppercase text-neutral-500 block mb-1">Resumen</label>
                        <textarea
                          rows={2}
                          value={art.summary}
                          onChange={(e) => {
                            const updated = news.map((n) =>
                              n.id === art.id ? { ...n, summary: e.target.value } : n
                            );
                            onUpdateNews(updated);
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-neutral-300 resize-none"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-mono uppercase text-neutral-500 block mb-1">Párrafos de Contenido</label>
                        <textarea
                          rows={3}
                          value={art.content.join('\n\n')}
                          onChange={(e) => {
                            const updated = news.map((n) =>
                              n.id === art.id ? { ...n, content: e.target.value.split('\n\n') } : n
                            );
                            onUpdateNews(updated);
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-neutral-300 resize-none leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => triggerSaveNotification('¡Noticias y comunicados guardados!')}
                  className="px-6 py-2.5 bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-mono font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Noticias & Prensa</span>
                </button>
              </div>
            )}

            {/* TAB 9: LEADS & ALUMNOS PROSPECTOS */}
            {activeTab === 'leads' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div>
                    <h4 className="text-lg font-bold font-display text-white">
                      Registro de Prospectos de la Escuela ({leads.length})
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Alumnos interesados registrados en el sitio web para pruebas o inscripción.
                    </p>
                  </div>
                  <button
                    onClick={handleExportLeadsCsv}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-mono font-bold text-white flex items-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exportar CSV</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900/40">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-950/80 text-neutral-400 font-mono text-[10px] uppercase border-b border-neutral-800">
                      <tr>
                        <th className="p-3">Alumno</th>
                        <th className="p-3">Categoría</th>
                        <th className="p-3">Tutor / Teléfono</th>
                        <th className="p-3">Sede</th>
                        <th className="p-3">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60 font-sans">
                      {leads.map((l) => (
                        <tr key={l.id} className="hover:bg-neutral-900/60 transition-colors">
                          <td className="p-3 font-semibold text-white">{l.studentName}</td>
                          <td className="p-3 font-mono text-[#E6002B]">{l.ageCategory}</td>
                          <td className="p-3 text-neutral-300">
                            <div>{l.parentName}</div>
                            <div className="text-[10px] font-mono text-neutral-500">{l.parentPhone}</div>
                          </td>
                          <td className="p-3 text-neutral-400 text-[11px]">{l.branch}</td>
                          <td className="p-3">
                            <select
                              value={l.status}
                              onChange={(e) => onUpdateLeadStatus(l.id, e.target.value as any)}
                              className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-[11px] text-white"
                            >
                              <option value="Pendiente">Pendiente</option>
                              <option value="Contactado">Contactado</option>
                              <option value="Prueba Asignada">Prueba Asignada</option>
                              <option value="Inscrito">Inscrito</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 10: BACKUP & RESTAURACIÓN JSON */}
            {activeTab === 'backup' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div>
                    <h4 className="text-lg font-bold font-display text-white">
                      Copia de Seguridad & Restauración Total
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Descarga un archivo JSON con todos los datos y textos de la web, o restaura la configuración de fábrica.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Export */}
                  <div className="p-5 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-3">
                    <h5 className="text-sm font-bold text-white flex items-center gap-2">
                      <Download className="w-4 h-4 text-[#E6002B]" />
                      <span>Descargar Copia de Seguridad JSON</span>
                    </h5>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Genera un respaldo instantáneo con todos tus textos, horarios en Bajo Següencoma, precios y partidos.
                    </p>
                    <button
                      onClick={handleDownloadBackup}
                      className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-mono font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar Archivo JSON</span>
                    </button>
                  </div>

                  {/* Import */}
                  <div className="p-5 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-3">
                    <h5 className="text-sm font-bold text-white flex items-center gap-2">
                      <Upload className="w-4 h-4 text-cyan-400" />
                      <span>Restaurar desde Archivo JSON</span>
                    </h5>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Sube un archivo de copia de seguridad previamente exportado para recuperar todos los datos.
                    </p>
                    <label className="inline-flex px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-mono font-bold rounded-xl items-center gap-2 transition-all cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>Subir y Cargar JSON</span>
                      <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Reset to Factory Defaults */}
                <div className="p-5 bg-red-950/20 border border-red-900/40 rounded-xl space-y-3">
                  <h5 className="text-sm font-bold text-red-400 flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    <span>Restablecer Valores Predeterminados</span>
                  </h5>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Si deseas volver a la configuración original de fábrica con los horarios oficiales del Complejo Social Litoral, presiona este botón.
                  </p>
                  <button
                    onClick={() => {
                      resetAllContent();
                      triggerSaveNotification('Valores de fábrica restaurados');
                    }}
                    className="px-5 py-2 bg-red-950 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Restablecer de Fábrica
                  </button>
                </div>
              </div>
            )}

            {/* TAB: QUIÉNES SOMOS (MISIÓN, VISIÓN & PILARES) */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="border-b border-neutral-800 pb-4">
                  <h4 className="text-xl font-bold font-display text-white flex items-center gap-2">
                    <Compass className="w-5 h-5 text-[#E6002B]" />
                    <span>Quiénes Somos · Misión, Visión y Pilares</span>
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Edita la identidad institucional, la Misión, la Visión y los 4 pilares de formación integral visibles en la sección Quiénes Somos.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1.5">
                      Subtítulo Superior (Kicker)
                    </label>
                    <input
                      type="text"
                      value={content.aboutUs.kicker}
                      onChange={(e) => {
                        updateAboutUs({ kicker: e.target.value });
                        triggerSaveNotification('Identidad actualizada');
                      }}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#E6002B]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1.5">
                      Titular Principal
                    </label>
                    <input
                      type="text"
                      value={content.aboutUs.title}
                      onChange={(e) => {
                        updateAboutUs({ title: e.target.value });
                        triggerSaveNotification('Titular actualizado');
                      }}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#E6002B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1.5">
                    Descripción Introductoria
                  </label>
                  <textarea
                    rows={2}
                    value={content.aboutUs.subtitle}
                    onChange={(e) => {
                      updateAboutUs({ subtitle: e.target.value });
                      triggerSaveNotification('Descripción actualizada');
                    }}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#E6002B] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-3">
                    <label className="text-xs font-mono uppercase text-[#E6002B] font-bold block">
                      01 · Misión del Club
                    </label>
                    <textarea
                      rows={4}
                      value={content.aboutUs.missionBody}
                      onChange={(e) => {
                        updateAboutUs({ missionBody: e.target.value });
                        triggerSaveNotification('Misión actualizada');
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white leading-relaxed focus:outline-none focus:border-[#E6002B]"
                    />
                  </div>

                  <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-3">
                    <label className="text-xs font-mono uppercase text-[#E6002B] font-bold block">
                      02 · Visión del Club
                    </label>
                    <textarea
                      rows={4}
                      value={content.aboutUs.visionBody}
                      onChange={(e) => {
                        updateAboutUs({ visionBody: e.target.value });
                        triggerSaveNotification('Visión actualizada');
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white leading-relaxed focus:outline-none focus:border-[#E6002B]"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase text-neutral-400 font-bold block">
                    Pilares de Desarrollo Integral
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content.aboutUs.pillars.map((pillar, idx) => (
                      <div key={pillar.id} className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl space-y-2">
                        <input
                          type="text"
                          value={pillar.title}
                          onChange={(e) => {
                            const updated = content.aboutUs.pillars.map((p, i) =>
                              i === idx ? { ...p, title: e.target.value } : p
                            );
                            updateAboutUs({ pillars: updated });
                            triggerSaveNotification('Pilar actualizado');
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-[#E6002B]"
                        />
                        <textarea
                          rows={2}
                          value={pillar.description}
                          onChange={(e) => {
                            const updated = content.aboutUs.pillars.map((p, i) =>
                              i === idx ? { ...p, description: e.target.value } : p
                            );
                            updateAboutUs({ pillars: updated });
                            triggerSaveNotification('Descripción del pilar actualizada');
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-[#E6002B] resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
        </main>
      </div>
    </div>
  );
};
