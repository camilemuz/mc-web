import React, { useState } from 'react';
import { Match, Product, Player, NewsArticle, AcademyLead, MatchEvent } from '../types';
import { playUiClick, playGoalCheer } from '../utils/soundEffects';
import {
  X,
  Settings,
  Radio,
  ShoppingBag,
  FileText,
  Users,
  GraduationCap,
  Cloud,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  Flame,
  ArrowUpRight,
  ExternalLink,
  MessageCircle,
  Download
} from 'lucide-react';

interface AdminCMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Match state & updater
  liveMatch: Match;
  onUpdateLiveMatch: (updated: Match) => void;
  // Products state & updater
  products: Product[];
  onUpdateProducts: (updated: Product[]) => void;
  // News state & updater
  news: NewsArticle[];
  onUpdateNews: (updated: NewsArticle[]) => void;
  // Players state & updater
  players: Player[];
  onUpdatePlayers: (updated: Player[]) => void;
  // Leads
  leads: AcademyLead[];
  onUpdateLeadStatus: (leadId: string, status: AcademyLead['status']) => void;
}

export const AdminCMSModal: React.FC<AdminCMSModalProps> = ({
  isOpen,
  onClose,
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
  const [activeTab, setActiveTab] = useState<'match' | 'store' | 'news' | 'players' | 'leads' | 'cloudinary'>('match');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // New Event Form State
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
  const [newProductImage, setNewProductImage] = useState<string>('');

  // New News Form State
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsCategory, setNewNewsCategory] = useState<NewsArticle['category']>('Primer Plantel');
  const [newNewsSummary, setNewNewsSummary] = useState('');
  const [newNewsContent, setNewNewsContent] = useState('');

  if (!isOpen) return null;

  const triggerSaveNotification = (msg: string) => {
    playGoalCheer();
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 2500);
  };

  // Match handlers
  const handleScoreChange = (team: 'home' | 'away', delta: number) => {
    playUiClick();
    const updated = { ...liveMatch };
    if (team === 'home') {
      updated.scoreHome = Math.max(0, (updated.scoreHome || 0) + delta);
    } else {
      updated.scoreAway = Math.max(0, (updated.scoreAway || 0) + delta);
    }
    onUpdateLiveMatch(updated);
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

    // If it's a goal, increment score automatically
    if (newEventType === 'goal') {
      if (newEventTeam === 'home') {
        updated.scoreHome = (updated.scoreHome || 0) + 1;
      } else {
        updated.scoreAway = (updated.scoreAway || 0) + 1;
      }
    }

    onUpdateLiveMatch(updated);
    triggerSaveNotification('¡Evento añadido a la línea de tiempo en vivo!');
    setNewEventDetail('');
  };

  const handleRemoveEvent = (idx: number) => {
    playUiClick();
    const updatedTimeline = liveMatch.timeline.filter((_, i) => i !== idx);
    onUpdateLiveMatch({ ...liveMatch, timeline: updatedTimeline });
  };

  // Products handlers
  const handleProductFieldChange = (id: string, field: keyof Product, value: any) => {
    const updated = products.map((p) => (p.id === id ? { ...p, [field]: value } : p));
    onUpdateProducts(updated);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProductName,
      category: newProductCategory,
      price: Number(newProductPrice),
      stock: Number(newProductStock),
      description: newProductDesc || 'Producto oficial del Club MC Martín Careaga.',
      features: ['Tejido transpirable de alta resistencia', 'Licencia oficial del club'],
      sizes: ['S', 'M', 'L', 'XL'],
      customizable: newProductCategory === 'camisetas',
      badge: 'Nuevo Lanzamiento',
      rating: 5.0,
      image: newProductImage || undefined
    };
    onUpdateProducts([newProd, ...products]);
    setIsAddingProduct(false);
    triggerSaveNotification('¡Nuevo producto añadido con foto oficial!');
    setNewProductName('');
    setNewProductImage('');
  };

  // News handlers
  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    const newArticle: NewsArticle = {
      id: `news-${Date.now()}`,
      title: newNewsTitle,
      category: newNewsCategory,
      date: 'Hoy, 2026',
      readTime: '3 min de lectura',
      author: 'Equipo de Marketing MC',
      summary: newNewsSummary,
      content: newNewsContent.split('\n\n').filter((p) => p.trim().length > 0)
    };
    onUpdateNews([newArticle, ...news]);
    setIsAddingNews(false);
    triggerSaveNotification('¡Noticia publicada en el sitio oficial!');
    setNewNewsTitle('');
    setNewNewsSummary('');
    setNewNewsContent('');
  };

  const handleDeleteNews = (id: string) => {
    playUiClick();
    onUpdateNews(news.filter((n) => n.id !== id));
    triggerSaveNotification('Noticia eliminada');
  };

  // Players handler
  const handlePlayerFieldChange = (id: string, field: keyof Player, value: any) => {
    const updated = players.map((p) => (p.id === id ? { ...p, [field]: value } : p));
    onUpdatePlayers(updated);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-[#0B0B0E] border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-neutral-800 flex items-center justify-between gap-4 bg-[#08080A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6002B] flex items-center justify-center text-white font-display font-black text-lg shadow-md">
              MC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-display text-white">
                  PANEL DE ADMINISTRACIÓN & MARKETING
                </h3>
                <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-[10px] font-bold text-emerald-400 uppercase">
                  CMS Activo
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Control editorial, gestión de partidos en vivo, tienda oficial y prospección de la Escuela Careaga.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {savedNotice && (
              <div className="px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-400 flex items-center gap-1.5 animate-pulse">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{savedNotice}</span>
              </div>
            )}
            <button
              onClick={() => {
                playUiClick();
                onClose();
              }}
              className="w-9 h-9 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-2 bg-neutral-950 border-b border-neutral-800 overflow-x-auto">
          {[
            { id: 'match', label: 'Match Center en Vivo', icon: Radio },
            { id: 'store', label: 'Tienda & Stock', icon: ShoppingBag },
            { id: 'news', label: 'Noticias & Blog', icon: FileText },
            { id: 'players', label: 'Plantel & Fichajes', icon: Users },
            { id: 'leads', label: `Alumnos & Leads (${leads.length})`, icon: GraduationCap },
            { id: 'cloudinary', label: 'Cloudinary Hub', icon: Cloud }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playUiClick();
                  setActiveTab(tab.id as any);
                }}
                className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#E6002B] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: MATCH CENTER EN VIVO */}
          {activeTab === 'match' && (
            <div className="space-y-6">
              <div className="p-5 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#E6002B] block">
                  1. Control de Marcador y Minuto en Vivo
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  {/* Home Score */}
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
                    <span className="text-xs text-neutral-400 block mb-1">Goles Club MC (Local)</span>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleScoreChange('home', -1)}
                        className="w-8 h-8 rounded bg-neutral-900 text-white hover:bg-neutral-800 text-lg font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-4xl font-black font-mono-numbers text-white">
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

                  {/* Match Status & Minute */}
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center space-y-2">
                    <span className="text-xs text-neutral-400 block">Minuto de Juego</span>
                    <div className="flex items-center justify-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={120}
                        value={liveMatch.currentMinute || 74}
                        onChange={(e) =>
                          onUpdateLiveMatch({ ...liveMatch, currentMinute: Number(e.target.value) })
                        }
                        className="w-20 bg-neutral-900 border border-neutral-700 text-white font-mono-numbers font-bold text-center text-xl rounded-lg py-1 focus:border-[#E6002B]"
                      />
                      <span className="text-xs text-neutral-400">min</span>
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
                          {st === 'live' ? 'En Vivo' : st === 'upcoming' ? 'Próximo' : 'Finalizado'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Away Score */}
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
                    <span className="text-xs text-neutral-400 block mb-1">
                      Goles {liveMatch.opponentShort || 'Rival'}
                    </span>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleScoreChange('away', -1)}
                        className="w-8 h-8 rounded bg-neutral-900 text-white hover:bg-neutral-800 text-lg font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-4xl font-black font-mono-numbers text-white">
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
              </div>

              {/* Add Event Form */}
              <form onSubmit={handleAddMatchEvent} className="p-5 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#E6002B] block">
                  2. Publicar Incidencia en Tiempo Real (Minuto a Minuto)
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
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-neutral-400 block mb-1">Tipo de Evento</label>
                    <select
                      value={newEventType}
                      onChange={(e) => setNewEventType(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="goal">GOL</option>
                      <option value="card-yellow">Tarjeta Amarilla</option>
                      <option value="card-red">Tarjeta Roja</option>
                      <option value="sub">Cambio / Sustitución</option>
                      <option value="var">Revisión VAR</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-neutral-400 block mb-1">Equipo</label>
                    <select
                      value={newEventTeam}
                      onChange={(e) => setNewEventTeam(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="home">Club MC Martín Careaga</option>
                      <option value="away">Equipo Rival</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-neutral-400 block mb-1">Jugador</label>
                    <input
                      type="text"
                      required
                      value={newEventPlayer}
                      onChange={(e) => setNewEventPlayer(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase text-neutral-400 block mb-1">Detalle / Asistencia</label>
                  <input
                    type="text"
                    placeholder="Ej: Tiro libre al ángulo o Asistencia de Lucas Benítez"
                    value={newEventDetail}
                    onChange={(e) => setNewEventDetail(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publicar Jugada en el Match Center</span>
                </button>
              </form>

              {/* Existing Events List */}
              <div>
                <span className="text-xs font-semibold text-neutral-300 block mb-2">
                  Línea de Tiempo Actual ({liveMatch.timeline.length} eventos):
                </span>
                <div className="space-y-2">
                  {liveMatch.timeline.map((ev, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 font-mono-numbers font-bold text-[#E6002B]">{ev.minute}'</span>
                        <span className="font-bold text-white uppercase">{ev.type}</span>
                        <span className="text-neutral-300">· {ev.player}</span>
                        {ev.assistOrDetail && (
                          <span className="text-neutral-500 italic">({ev.assistOrDetail})</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveEvent(idx)}
                        className="text-neutral-500 hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TIENDA & PRODUCTOS */}
          {activeTab === 'store' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Catálogo de Productos Oficiales</h4>
                  <p className="text-xs text-neutral-400">Modifica precios, stock y badges en tiempo real.</p>
                </div>
                <button
                  onClick={() => setIsAddingProduct(!isAddingProduct)}
                  className="px-3 py-1.5 bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingProduct ? 'Cancelar' : 'Nuevo Producto'}</span>
                </button>
              </div>

              {/* Add Product Subform */}
              {isAddingProduct && (
                <form
                  onSubmit={handleCreateProduct}
                  className="p-5 bg-neutral-900 rounded-xl border border-neutral-700 space-y-4"
                >
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                    Registrar Nuevo Artículo
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] uppercase text-neutral-400 block mb-1">Nombre</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Conjunto de Invierno MC"
                        value={newProductName}
                        onChange={(e) => setNewProductName(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-neutral-400 block mb-1">Categoría</label>
                      <select
                        value={newProductCategory}
                        onChange={(e) => setNewProductCategory(e.target.value as any)}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white"
                      >
                        <option value="camisetas">Camisetas</option>
                        <option value="escuela">Escuela Martín Careaga</option>
                        <option value="entrenamiento">Entrenamiento</option>
                        <option value="accesorios">Accesorios</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-neutral-400 block mb-1">Precio (Bs.)</label>
                      <input
                        type="number"
                        step="1"
                        required
                        value={newProductPrice}
                        onChange={(e) => setNewProductPrice(Number(e.target.value))}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-neutral-400 block mb-1">Stock Disponible</label>
                      <input
                        type="number"
                        required
                        value={newProductStock}
                        onChange={(e) => setNewProductStock(Number(e.target.value))}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="text-[10px] uppercase text-neutral-400 block mb-1">Descripción</label>
                      <input
                        type="text"
                        placeholder="Descripción corta para la ficha del producto"
                        value={newProductDesc}
                        onChange={(e) => setNewProductDesc(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    {/* PHOTO UPLOAD INPUT */}
                    <div className="sm:col-span-3 p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                      <label className="text-[10px] uppercase font-bold text-[#E6002B] block mb-1.5">
                        Foto Real del Producto (Subir desde tu dispositivo o Cloudinary)
                      </label>
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setNewProductImage(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full text-xs text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#E6002B] file:text-white hover:file:bg-[#FF1A40] cursor-pointer"
                        />
                        {newProductImage && (
                          <div className="flex items-center gap-2 shrink-0">
                            <img
                              src={newProductImage}
                              alt="Vista previa"
                              className="w-12 h-12 object-cover rounded-lg border border-[#E6002B]"
                            />
                            <button
                              type="button"
                              onClick={() => setNewProductImage('')}
                              className="text-neutral-500 hover:text-red-400 text-xs cursor-pointer"
                            >
                              Quitar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Guardar y Publicar en Tienda
                  </button>
                </form>
              )}

              {/* Products Table */}
              <div className="space-y-3">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs"
                  >
                    <div className="sm:col-span-4 flex items-center gap-3">
                      {prod.image ? (
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-10 h-10 object-cover rounded-lg border border-neutral-700 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#E6002B] font-display font-bold text-sm shrink-0">
                          MC
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-white block">{prod.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-neutral-500 uppercase">{prod.category}</span>
                          <label className="text-[10px] text-[#E6002B] hover:underline cursor-pointer">
                            Cambiar foto
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    handleProductFieldChange(prod.id, 'image', reader.result as string);
                                    triggerSaveNotification(`¡Foto actualizada para ${prod.name}!`);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-neutral-400 block mb-1">Precio (Bs.)</label>
                      <input
                        type="number"
                        step="1"
                        value={prod.price}
                        onChange={(e) => handleProductFieldChange(prod.id, 'price', Number(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded p-1 text-white font-mono-numbers"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-neutral-400 block mb-1">Stock</label>
                      <input
                        type="number"
                        value={prod.stock}
                        onChange={(e) => handleProductFieldChange(prod.id, 'stock', Number(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded p-1 text-white font-mono-numbers"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[10px] text-neutral-400 block mb-1">Etiqueta Badge</label>
                      <input
                        type="text"
                        value={prod.badge}
                        onChange={(e) => handleProductFieldChange(prod.id, 'badge', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded p-1 text-white"
                      />
                    </div>

                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        onClick={() => {
                          onUpdateProducts(products.filter((p) => p.id !== prod.id));
                          triggerSaveNotification('Producto eliminado');
                        }}
                        className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: NOTICIAS & BLOG */}
          {activeTab === 'news' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Artículos y Comunicados de Prensa</h4>
                  <p className="text-xs text-neutral-400">Publica notas institucionales de la escuela o primer plantel.</p>
                </div>
                <button
                  onClick={() => setIsAddingNews(!isAddingNews)}
                  className="px-3 py-1.5 bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingNews ? 'Cancelar' : 'Nueva Noticia'}</span>
                </button>
              </div>

              {isAddingNews && (
                <form onSubmit={handleCreateNews} className="p-5 bg-neutral-900 rounded-xl border border-neutral-700 space-y-3">
                  <div>
                    <label className="text-[10px] uppercase text-neutral-400 block mb-1">Título</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Nuevo convenio internacional de la Escuela Martín Careaga"
                      value={newNewsTitle}
                      onChange={(e) => setNewNewsTitle(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase text-neutral-400 block mb-1">Categoría</label>
                      <select
                        value={newNewsCategory}
                        onChange={(e) => setNewNewsCategory(e.target.value as any)}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white"
                      >
                        <option value="Primer Plantel">Primer Plantel</option>
                        <option value="Escuela Formativa">Escuela Formativa</option>
                        <option value="Institucional">Institucional</option>
                        <option value="Torneos">Torneos</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-neutral-400 block mb-1">Resumen Breve</label>
                      <input
                        type="text"
                        required
                        placeholder="1 o 2 oraciones para la tarjeta"
                        value={newNewsSummary}
                        onChange={(e) => setNewNewsSummary(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-neutral-400 block mb-1">Cuerpo del Artículo (Párrafos)</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Separa los párrafos con saltos de línea..."
                      value={newNewsContent}
                      onChange={(e) => setNewNewsContent(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Publicar Noticia Oficial
                  </button>
                </form>
              )}

              <div className="space-y-3">
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[#E6002B] font-bold">{item.category}</span>
                        <span className="text-neutral-500">· {item.date}</span>
                      </div>
                      <span className="font-bold text-white text-sm block">{item.title}</span>
                    </div>

                    <button
                      onClick={() => handleDeleteNews(item.id)}
                      className="text-neutral-500 hover:text-red-400 p-2 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PLANTEL & FICHAJES */}
          {activeTab === 'players' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">Telemetría y Rendimiento de Jugadores</h4>
              <p className="text-xs text-neutral-400">Actualiza las métricas físicas y estadísticas que alimentan las tarjetas 3D.</p>

              <div className="space-y-3">
                {players.map((pl) => (
                  <div
                    key={pl.id}
                    className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs"
                  >
                    <div className="sm:col-span-4">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-black text-base text-[#E6002B]">#{pl.number}</span>
                        <span className="font-bold text-white">{pl.name}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400">{pl.position} ({pl.category})</span>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-neutral-500 block">Goles</label>
                      <input
                        type="number"
                        value={pl.goals}
                        onChange={(e) => handlePlayerFieldChange(pl.id, 'goals', Number(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded p-1 text-white font-mono-numbers"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-neutral-500 block">Velocidad (km/h)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={pl.topSpeedKmH}
                        onChange={(e) => handlePlayerFieldChange(pl.id, 'topSpeedKmH', Number(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded p-1 text-white font-mono-numbers"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-neutral-500 block">Pases (%)</label>
                      <input
                        type="number"
                        value={pl.passAccuracy}
                        onChange={(e) => handlePlayerFieldChange(pl.id, 'passAccuracy', Number(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded p-1 text-white font-mono-numbers"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-neutral-500 block">Cotización</label>
                      <input
                        type="text"
                        value={pl.marketValue || '€ 1.0M'}
                        onChange={(e) => handlePlayerFieldChange(pl.id, 'marketValue', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded p-1 text-white text-[11px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: LEADS Y PROSPECTOS ESCUELA */}
          {activeTab === 'leads' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Solicitudes de Inscripción (Escuela Careaga)</h4>
                  <p className="text-xs text-neutral-400">Padres y alumnos que completaron el formulario público.</p>
                </div>
                <button
                  onClick={handleExportLeadsCsv}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar CSV</span>
                </button>
              </div>

              {leads.length === 0 ? (
                <div className="text-center py-12 text-xs text-neutral-500">
                  No hay solicitudes registradas todavía. Envía una desde la sección Escuela para probar.
                </div>
              ) : (
                <div className="space-y-3">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-white text-sm">{lead.studentName}</span>
                          <span className="text-neutral-400">({lead.ageCategory})</span>
                          <span className="text-[10px] text-neutral-500">· Sede: {lead.branch}</span>
                        </div>
                        <div className="text-neutral-400">
                          Tutor: <span className="text-neutral-200">{lead.parentName}</span> · Tel:{' '}
                          <span className="text-[#E6002B] font-mono-numbers">{lead.parentPhone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Status selector */}
                        <select
                          value={lead.status}
                          onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as any)}
                          className="bg-neutral-900 border border-neutral-700 text-white text-xs rounded px-2 py-1"
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="Contactado">Contactado</option>
                          <option value="Prueba Asignada">Prueba Asignada</option>
                          <option value="Inscrito">Inscrito</option>
                        </select>

                        {/* WhatsApp Contact Action */}
                        <a
                          href={`https://wa.me/${lead.parentPhone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(
                            lead.parentName
                          )},%20te%20escribimos%20de%20la%20Escuela%20de%20F%C3%BAtbol%20Mart%C3%ADn%20Careaga%20para%20coordinar%20la%20clase%20de%20prueba%20de%20${encodeURIComponent(
                            lead.studentName
                          )}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs flex items-center gap-1 font-semibold"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: CLOUDINARY HUB */}
          {activeTab === 'cloudinary' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">Centro de Medios & Cloudinary (Subidas Gratuitas)</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Para que los redactores y marketeros suban fotografías de partidos, productos o carnets sin costo de almacenamiento en el servidor, recomendamos el flujo directo con <strong>Cloudinary Upload Widget</strong>:
              </p>

              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3 text-xs">
                <span className="text-emerald-400 font-bold block">
                  ✓ Ventajas del plan gratuito de Cloudinary:
                </span>
                <ul className="list-disc list-inside space-y-1 text-neutral-400">
                  <li>25 créditos mensuales (~25 GB de fotos en la nube + 25.000 transformaciones).</li>
                  <li>Conversión automática a WebP y AVIF reduciendo hasta un 80% el peso de carga móvil.</li>
                  <li>Subidas seguras sin backend mediante <code className="text-red-400">Unsigned Upload Presets</code>.</li>
                </ul>
              </div>

              <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 space-y-2">
                <span className="text-xs font-semibold text-white block">Código de Ejemplo para Marketeros:</span>
                <pre className="p-3 bg-black/60 rounded-lg text-[11px] font-mono text-emerald-300 overflow-x-auto">
{`// Cloudinary Upload Widget (Insertar en tu panel o página)
const myWidget = cloudinary.createUploadWidget({
    cloudName: 'tu_cloud_name', 
    uploadPreset: 'mc_club_fotos',
    folder: 'escuela-martin-careaga',
    cropping: true
  }, (error, result) => { 
    if (!error && result.event === "success") { 
      console.log('URL de la foto optimizada:', result.info.secure_url);
      // Pega esta URL en cualquier noticia o producto
    }
});`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-[#08080A] flex justify-between items-center text-xs">
          <span className="text-neutral-500">
            *Todos los cambios se aplican y sincronizan de forma reactiva en el sitio.
          </span>
          <button
            onClick={() => {
              playUiClick();
              onClose();
            }}
            className="px-5 py-2 bg-[#E6002B] hover:bg-[#FF1A40] text-white font-semibold rounded-lg cursor-pointer transition-colors"
          >
            Cerrar Panel y Ver Cambios
          </button>
        </div>
      </div>
    </div>
  );
};
