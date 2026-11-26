import React, { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { Product, CartItem, Match, NewsArticle, Player, AcademyLead } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HeroFigmaStage } from './components/HeroFigmaStage';
import { SectionAboutUs } from './components/SectionAboutUs';
import { SectionSquads } from './components/SectionSquads';
import { SectionMethod } from './components/SectionMethod';
import { SectionStaff } from './components/SectionStaff';
import { SectionMemberships } from './components/SectionMemberships';
import { SectionFaq } from './components/SectionFaq';
import { SiteFooter } from './components/SiteFooter';
import { VelocityMarquee } from './components/VelocityMarquee';
import { ScrollProgress } from './components/ScrollProgress';
import { SmoothScroll } from './components/SmoothScroll';
import { MatchCenterSection } from './components/MatchCenterSection';
import { PlayersRosterSection } from './components/PlayersRosterSection';
import { StoreSection } from './components/StoreSection';
import { AcademySection } from './components/AcademySection';
import { CalendarSection } from './components/CalendarSection';
import { FanZoneSection } from './components/FanZoneSection';
import { NewsSection } from './components/NewsSection';
import { ContactDirectSection } from './components/ContactDirectSection';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminCMSModal } from './components/AdminCMSModal';
import { PRODUCTS_DATA, CURRENT_LIVE_MATCH, NEWS_DATA, PLAYERS_DATA } from './data/mockData';
import { useSiteContent } from './utils/ContentContext';
import { useAuth } from './utils/AuthContext';
import {
  db,
  auth,
  OperationType,
  handleFirestoreError,
  sanitizeId,
  stripUndefined,
} from './firebase';

const VALID_PRODUCT_CATEGORIES = ['camisetas', 'escuela', 'entrenamiento', 'accesorios'] as const;
const VALID_PLAYER_POSITIONS = [
  'Arquero',
  'Defensa',
  'Mediocampista',
  'Delantero',
  'Cuerpo Técnico',
] as const;
const VALID_PLAYER_CATEGORIES = [
  'primer-plantel',
  'escuela-juvenil',
  'staff',
  'sub-19',
  'sub-17',
  'sub-15',
  'sub-13',
  'sub-11',
  'sub-9',
  'sub-7',
] as const;
const VALID_FEET = ['Derecho', 'Izquierdo', 'Ambidiestro'] as const;
const VALID_NEWS_CATEGORIES = [
  'Primer Plantel',
  'Escuela Formativa',
  'Institucional',
  'Club & Institucional',
  'Torneos',
] as const;

function sanitizeProductPayload(p: Product) {
  const id = sanitizeId(p.id, 'prod');
  const category = VALID_PRODUCT_CATEGORIES.includes(p.category) ? p.category : 'camisetas';
  const sizes =
    Array.isArray(p.sizes) && p.sizes.length > 0
      ? p.sizes.slice(0, 15).map((s) => String(s).slice(0, 20))
      : ['M'];
  const docData: Record<string, unknown> = {
    id,
    name: String(p.name || 'Producto MC').slice(0, 160),
    category,
    price: Math.max(0, Math.min(100000, Number(p.price) || 0)),
    description: String(p.description || '').slice(0, 1200),
    sizes,
    stock: Math.max(0, Math.min(100000, Number(p.stock) || 0)),
    rating: Math.max(0, Math.min(5, Number(p.rating) || 5)),
    updatedAt: serverTimestamp(),
  };
  if (typeof p.originalPrice === 'number' && p.originalPrice >= 0) {
    docData.originalPrice = Math.min(100000, p.originalPrice);
  }
  if (p.badge) docData.badge = String(p.badge).slice(0, 64);
  if (typeof p.customizable === 'boolean') docData.customizable = p.customizable;
  if (p.image && p.image.length <= 500000) docData.image = p.image;
  return { id, docData };
}

function sanitizePlayerPayload(pl: Player) {
  const id = sanitizeId(pl.id, 'player');
  const position = VALID_PLAYER_POSITIONS.includes(pl.position) ? pl.position : 'Mediocampista';
  const category = VALID_PLAYER_CATEGORIES.includes(pl.category) ? pl.category : 'primer-plantel';
  const preferredFoot = VALID_FEET.includes(pl.preferredFoot) ? pl.preferredFoot : 'Derecho';
  const docData: Record<string, unknown> = {
    id,
    name: String(pl.name || 'Jugador MC').slice(0, 120),
    number: Math.max(0, Math.min(99, Number(pl.number) || 10)),
    position,
    category,
    age: Math.max(4, Math.min(65, Number(pl.age) || 18)),
    height: String(pl.height || '1.75m').slice(0, 32),
    nationality: String(pl.nationality || 'Bolivia').slice(0, 64),
    preferredFoot,
    matchesPlayed: Math.max(0, Math.min(2000, Number(pl.matchesPlayed) || 0)),
    goals: Math.max(0, Math.min(2000, Number(pl.goals) || 0)),
    assists: Math.max(0, Math.min(2000, Number(pl.assists) || 0)),
    topSpeedKmH: Math.max(0, Math.min(50, Number(pl.topSpeedKmH) || 28)),
    passAccuracy: Math.max(0, Math.min(100, Number(pl.passAccuracy) || 85)),
    stamina: Math.max(0, Math.min(100, Number(pl.stamina) || 85)),
    bio: String(pl.bio || '').slice(0, 1200),
    updatedAt: serverTimestamp(),
  };
  if (pl.nickname) docData.nickname = String(pl.nickname).slice(0, 80);
  if (pl.image && pl.image.length <= 500000) docData.image = pl.image;
  return { id, docData };
}

function sanitizeNewsPayload(n: NewsArticle) {
  const id = sanitizeId(n.id, 'news');
  const category = VALID_NEWS_CATEGORIES.includes(n.category) ? n.category : 'Primer Plantel';
  const paragraphs =
    Array.isArray(n.content) && n.content.length > 0
      ? n.content.slice(0, 40).map((c) => String(c).slice(0, 4000))
      : [String(n.summary || n.title || 'Noticia oficial Club MC').slice(0, 4000)];
  const docData: Record<string, unknown> = {
    id,
    title: String(n.title || 'Noticia Club MC').slice(0, 220),
    category,
    date: String(n.date || 'Hoy').slice(0, 64),
    readTime: String(n.readTime || '3 min lectura').slice(0, 48),
    summary: String(n.summary || '').slice(0, 600),
    content: paragraphs,
    author: String(n.author || 'Prensa Club MC').slice(0, 100),
    updatedAt: serverTimestamp(),
  };
  return { id, docData };
}

export default function App() {
  const { content } = useSiteContent();
  const { isAdmin, authReady, signOutAdmin } = useAuth();

  // Live Match State (real-time synced with Firestore site_config/live_match)
  const [liveMatch, setLiveMatch] = useState<Match>(CURRENT_LIVE_MATCH);

  // Products State (real-time synced with Firestore products collection)
  const [products, setProducts] = useState<Product[]>(PRODUCTS_DATA);

  // News State (real-time synced with Firestore news collection)
  const [news, setNews] = useState<NewsArticle[]>(NEWS_DATA);

  // Players State (real-time synced with Firestore players collection)
  const [players, setPlayers] = useState<Player[]>(PLAYERS_DATA);

  // Academy Leads State (PII-isolated: synced ONLY when verified Admin is logged in)
  const [leads, setLeads] = useState<AcademyLead[]>([]);

  // Cart state (personal per-visitor shopping cart in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mc_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore storage error
    }
    return [
      {
        cartItemId: 'init-1',
        product: PRODUCTS_DATA[0],
        selectedSize: 'M',
        customName: 'CAREAGA',
        customNumber: 10,
        quantity: 1,
      },
    ];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'admin'>('home');

  // Persist visitor shopping cart locally
  useEffect(() => {
    try {
      localStorage.setItem('mc_cart', JSON.stringify(cart));
    } catch {
      // Ignore storage error
    }
  }, [cart]);

  // 1. Real-time Firestore listener: Live Match Center
  useEffect(() => {
    const ref = doc(db, 'site_config', 'live_match');
    return onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data?.payload && typeof data.payload === 'object') {
            setLiveMatch(data.payload as Match);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'site_config/live_match', false);
      }
    );
  }, []);

  // 2. Real-time Firestore listener: Store Products
  useEffect(() => {
    const colRef = collection(db, 'products');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteProducts = snapshot.docs.map((d) => ({
            ...(d.data() as Product),
            id: d.id,
          }));
          setProducts(remoteProducts);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'products', false);
      }
    );
  }, []);

  // 3. Real-time Firestore listener: Players Roster
  useEffect(() => {
    const colRef = collection(db, 'players');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const remotePlayers = snapshot.docs.map((d) => ({
            ...(d.data() as Player),
            id: d.id,
          }));
          setPlayers(remotePlayers);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'players', false);
      }
    );
  }, []);

  // 4. Real-time Firestore listener: Club News
  useEffect(() => {
    const colRef = collection(db, 'news');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteNews = snapshot.docs.map((d) => ({
            ...(d.data() as NewsArticle),
            id: d.id,
          }));
          setNews(remoteNews);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'news', false);
      }
    );
  }, []);

  // 5. Real-time Firestore listener: Academy Leads (ADMIN ONLY — PII strictly protected)
  useEffect(() => {
    if (!authReady || !isAdmin) {
      setLeads([]);
      return;
    }
    const colRef = collection(db, 'leads');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const remoteLeads: AcademyLead[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            studentName: String(data.studentName || ''),
            ageCategory: String(data.ageCategory || ''),
            parentName: String(data.parentName || ''),
            parentPhone: String(data.parentPhone || ''),
            branch: String(data.branch || ''),
            createdAt: String(data.createdAtLabel || 'Reciente'),
            status: (data.status as AcademyLead['status']) || 'Nuevo',
          };
        });
        setLeads(remoteLeads);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'leads', false);
      }
    );
  }, [authReady, isAdmin]);

  // Hash navigation synced with real Firebase Admin Auth state
  useEffect(() => {
    if (!authReady) return;
    if (window.location.hash === '#admin') {
      if (isAdmin) {
        setCurrentView('admin');
      } else {
        setCurrentView('home');
        setIsLoginOpen(true);
      }
    }

    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        if (isAdmin) {
          setCurrentView('admin');
        } else {
          setIsLoginOpen(true);
        }
      } else {
        setCurrentView('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [authReady, isAdmin]);

  // Firestore Write: Update Live Match
  const handleUpdateLiveMatch = useCallback(async (updated: Match) => {
    setLiveMatch(updated);
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    try {
      await setDoc(doc(db, 'site_config', 'live_match'), {
        kind: 'live_match',
        payload: stripUndefined(updated),
        updatedBy: uid,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'site_config/live_match', false);
    }
  }, []);

  // Firestore Write: Sync Products Catalog
  const handleUpdateProducts = useCallback(
    async (updatedList: Product[]) => {
      const prevIds = new Set(products.map((p) => sanitizeId(p.id, 'prod')));
      const nextIds = new Set(updatedList.map((p) => sanitizeId(p.id, 'prod')));
      setProducts(updatedList);
      if (!auth.currentUser) return;

      try {
        const batch = writeBatch(db);
        updatedList.forEach((prod) => {
          const { id, docData } = sanitizeProductPayload(prod);
          batch.set(doc(db, 'products', id), docData);
        });
        prevIds.forEach((oldId) => {
          if (!nextIds.has(oldId)) {
            batch.delete(doc(db, 'products', oldId));
          }
        });
        await batch.commit();
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'products', false);
      }
    },
    [products]
  );

  // Firestore Write: Sync Players Roster
  const handleUpdatePlayers = useCallback(
    async (updatedList: Player[]) => {
      const prevIds = new Set(players.map((p) => sanitizeId(p.id, 'player')));
      const nextIds = new Set(updatedList.map((p) => sanitizeId(p.id, 'player')));
      setPlayers(updatedList);
      if (!auth.currentUser) return;

      try {
        const batch = writeBatch(db);
        updatedList.forEach((pl) => {
          const { id, docData } = sanitizePlayerPayload(pl);
          batch.set(doc(db, 'players', id), docData);
        });
        prevIds.forEach((oldId) => {
          if (!nextIds.has(oldId)) {
            batch.delete(doc(db, 'players', oldId));
          }
        });
        await batch.commit();
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'players', false);
      }
    },
    [players]
  );

  // Firestore Write: Sync News Articles
  const handleUpdateNews = useCallback(
    async (updatedList: NewsArticle[]) => {
      const prevIds = new Set(news.map((n) => sanitizeId(n.id, 'news')));
      const nextIds = new Set(updatedList.map((n) => sanitizeId(n.id, 'news')));
      setNews(updatedList);
      if (!auth.currentUser) return;

      try {
        const batch = writeBatch(db);
        updatedList.forEach((art) => {
          const { id, docData } = sanitizeNewsPayload(art);
          batch.set(doc(db, 'news', id), docData);
        });
        prevIds.forEach((oldId) => {
          if (!nextIds.has(oldId)) {
            batch.delete(doc(db, 'news', oldId));
          }
        });
        await batch.commit();
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'news', false);
      }
    },
    [news]
  );

  // Firestore Write: Admin updates Lead Status
  const handleUpdateLeadStatus = useCallback(
    async (leadId: string, status: AcademyLead['status']) => {
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status } : l)));
      if (!auth.currentUser) return;
      const safeId = sanitizeId(leadId, 'lead');
      try {
        await updateDoc(doc(db, 'leads', safeId), {
          status,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `leads/${safeId}`, false);
      }
    },
    []
  );

  // Firestore Write: Public visitor submits new Academy/Contact Lead
  const handleNewLead = useCallback(async (newLead: AcademyLead) => {
    const safeId = sanitizeId(newLead.id || `lead-${Date.now()}`, 'lead');
    const cleanLead = {
      id: safeId,
      studentName: String(newLead.studentName || 'Postulante').trim().slice(0, 120) || 'Postulante',
      ageCategory: String(newLead.ageCategory || 'Consulta General').trim().slice(0, 64) || 'General',
      parentName: String(newLead.parentName || 'Tutor').trim().slice(0, 120) || 'Tutor',
      parentPhone: String(newLead.parentPhone || '+591 00000000').trim().slice(0, 40) || '+591 00000000',
      branch: String(newLead.branch || 'Complejo Deportivo Social Litoral').trim().slice(0, 160),
      createdAtLabel: String(newLead.createdAt || 'Hoy').slice(0, 64),
      status: 'Nuevo',
      createdAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'leads', safeId), cleanLead);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `leads/${safeId}`, false);
    }
  }, []);

  // Cart Handlers
  const handleAddToCart = (
    product: Product,
    selectedSize: string,
    customName?: string,
    customNumber?: number
  ) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) =>
          i.product.id === product.id &&
          i.selectedSize === selectedSize &&
          i.customName === customName &&
          i.customNumber === customNumber
      );

      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }

      return [
        ...prev,
        {
          cartItemId: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          product,
          selectedSize,
          customName,
          customNumber,
          quantity: 1,
        },
      ];
    });
  };

  const handleUpdateCartQty = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Admin Navigation Handlers
  const handleOpenAdmin = () => {
    if (isAdmin) {
      window.location.hash = 'admin';
      setCurrentView('admin');
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    window.location.hash = 'admin';
    setCurrentView('admin');
  };

  const handleLogout = async () => {
    await signOutAdmin();
    window.location.hash = '';
    setCurrentView('home');
  };

  const handleBackToSite = () => {
    window.location.hash = '';
    setCurrentView('home');
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // If in Admin view and verified, render dedicated Admin CMS Page
  if (currentView === 'admin' && isAdmin) {
    return (
      <AdminCMSModal
        isOpen={true}
        onClose={handleBackToSite}
        onLogout={handleLogout}
        liveMatch={liveMatch}
        onUpdateLiveMatch={handleUpdateLiveMatch}
        products={products}
        onUpdateProducts={handleUpdateProducts}
        news={news}
        onUpdateNews={handleUpdateNews}
        players={players}
        onUpdatePlayers={handleUpdatePlayers}
        leads={leads}
        onUpdateLeadStatus={handleUpdateLeadStatus}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8] dark:bg-[#08080A] text-slate-900 dark:text-white relative selection:bg-[#E6002B] selection:text-white transition-colors duration-300">
      <ScrollProgress />
      <SmoothScroll />

      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={handleOpenAdmin}
      />

      <main className="relative z-10">
        <HeroFigmaStage
          onOpenStore={() => {
            const el = document.getElementById('tienda');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <SectionAboutUs />
        <SectionSquads />
        <VelocityMarquee words={[...content.domains]} baseVelocity={-0.28} />
        <SectionMethod />
        <SectionStaff />
        <VelocityMarquee words={[...content.claims]} baseVelocity={0.28} />
        <SectionMemberships />
        <SectionFaq />

        <div className="border-t border-slate-200 dark:border-white/10 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E6002B] font-bold inline-block mb-2">
              Ecosistema Digital Club MC
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white">
              PARTIDOS EN VIVO, PLANTILLA Y TIENDA 3D
            </h3>
          </div>

          <HeroSection
            onOpenStore={() => {
              const el = document.getElementById('tienda');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          <MatchCenterSection match={liveMatch} />
          <PlayersRosterSection players={players} />

          <StoreSection
            products={products}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
          />

          <AcademySection onNewLead={handleNewLead} />
          <CalendarSection />
          <FanZoneSection />
          <NewsSection news={news} />
          <ContactDirectSection onNewLead={handleNewLead} />
        </div>
      </main>

      <SiteFooter />

      <AdminLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
