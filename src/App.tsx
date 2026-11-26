import React, { useState, useEffect } from 'react';
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

export default function App() {
  const { content } = useSiteContent();
  // Live Match State (editable via CMS)
  const [liveMatch, setLiveMatch] = useState<Match>(() => {
    try {
      const saved = localStorage.getItem('mc_live_match');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return CURRENT_LIVE_MATCH;
  });

  // Products State (editable via CMS)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('mc_products');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return PRODUCTS_DATA;
  });

  // News State (editable via CMS)
  const [news, setNews] = useState<NewsArticle[]>(() => {
    try {
      const saved = localStorage.getItem('mc_news');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return NEWS_DATA;
  });

  // Players State (editable via CMS)
  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const saved = localStorage.getItem('mc_players');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return PLAYERS_DATA;
  });

  // Academy Leads State (editable and populated via registration form)
  const [leads, setLeads] = useState<AcademyLead[]>(() => {
    try {
      const saved = localStorage.getItem('mc_leads');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return [
      {
        id: 'lead-1',
        studentName: 'Alejandro Morales',
        ageCategory: 'Sub-12',
        parentName: 'Carlos Morales',
        parentPhone: '+591 76543210',
        branch: 'Sede Central - Estadio MC',
        createdAt: 'Ayer',
        status: 'Contactado'
      },
      {
        id: 'lead-2',
        studentName: 'Mateo Fernández',
        ageCategory: 'Sub-10',
        parentName: 'Valeria Fernández',
        parentPhone: '+591 71234567',
        branch: 'Sede Norte',
        createdAt: 'Hoy',
        status: 'Prueba Asignada'
      }
    ];
  });

  // Cart state with localStorage persistence in Bolivianos (Bs.)
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
        product: PRODUCTS_DATA[0], // Bs. 250
        selectedSize: 'M',
        customName: 'CAREAGA',
        customNumber: 10,
        quantity: 1
      }
    ];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('mc_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'admin'>(() => {
    try {
      const isAuth = sessionStorage.getItem('mc_admin_authenticated') === 'true';
      if (typeof window !== 'undefined' && window.location.hash === '#admin' && isAuth) {
        return 'admin';
      }
    } catch {
      // Ignore
    }
    return 'home';
  });

  // Listen to hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        const isAuth = sessionStorage.getItem('mc_admin_authenticated') === 'true';
        if (isAuth) {
          setCurrentView('admin');
        } else {
          setIsLoginOpen(true);
        }
      } else if (window.location.hash !== '#admin') {
        setCurrentView('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mc_cart', JSON.stringify(cart));
      localStorage.setItem('mc_live_match', JSON.stringify(liveMatch));
      localStorage.setItem('mc_products', JSON.stringify(products));
      localStorage.setItem('mc_news', JSON.stringify(news));
      localStorage.setItem('mc_players', JSON.stringify(players));
      localStorage.setItem('mc_leads', JSON.stringify(leads));
    } catch {
      // Ignore
    }
  }, [cart, liveMatch, products, news, players, leads]);

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
          cartItemId: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          product,
          selectedSize,
          customName,
          customNumber,
          quantity: 1
        }
      ];
    });
  };

  const handleUpdateCartQty = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleUpdateLeadStatus = (leadId: string, status: AcademyLead['status']) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status } : l))
    );
  };

  const handleNewLead = (newLead: AcademyLead) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      window.location.hash = 'admin';
      setCurrentView('admin');
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsLoginOpen(false);
    window.location.hash = 'admin';
    setCurrentView('admin');
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('mc_admin_authenticated');
    } catch {
      // Ignore
    }
    setIsAdminAuthenticated(false);
    window.location.hash = '';
    setCurrentView('home');
  };

  const handleBackToSite = () => {
    window.location.hash = '';
    setCurrentView('home');
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // If in Admin view, render ONLY the dedicated Admin Page
  if (currentView === 'admin') {
    return (
      <AdminCMSModal
        isOpen={true}
        onClose={handleBackToSite}
        onLogout={handleLogout}
        liveMatch={liveMatch}
        onUpdateLiveMatch={setLiveMatch}
        products={products}
        onUpdateProducts={setProducts}
        news={news}
        onUpdateNews={setNews}
        players={players}
        onUpdatePlayers={setPlayers}
        leads={leads}
        onUpdateLeadStatus={handleUpdateLeadStatus}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8] dark:bg-[#08080A] text-slate-900 dark:text-white relative selection:bg-[#E6002B] selection:text-white transition-colors duration-300">
      {/* Scroll Progress Bar at very top */}
      <ScrollProgress />

      {/* Lenis Smooth Scroll Engine */}
      <SmoothScroll />

      {/* Top Bar with Admin login trigger & active section tracking */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={handleOpenAdmin}
      />

      <main className="relative z-10">
        {/* SECTION-03 & 04: The Figma 2-Artboard Hero Stage with Still/Film Handover & 5 Depth Planes */}
        <HeroFigmaStage
          onOpenStore={() => {
            const el = document.getElementById('tienda');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* QUIÉNES SOMOS: Misión, Visión y Pilares Formativos */}
        <SectionAboutUs />

        {/* SECTION-09: Squads (Eight-row selector against a live glass card) */}
        <SectionSquads />

        {/* SECTION-10: Velocity Marquee Band 1 (DOMAINS) */}
        <VelocityMarquee words={[...content.domains]} baseVelocity={-0.28} />

        {/* SECTION-11: Method (Sticky intro, 3 steps, 4 counters) */}
        <SectionMethod />

        {/* SECTION-12: Technical Staff (4-card grid) */}
        <SectionStaff />

        {/* SECTION-10: Velocity Marquee Band 2 (CLAIMS) */}
        <VelocityMarquee words={[...content.claims]} baseVelocity={0.28} />

        {/* SECTION-13: Memberships (Monthly/Annual switch, 3 plans) */}
        <SectionMemberships />

        {/* SECTION-14: FAQ (4-item accordion) */}
        <SectionFaq />

        {/* Additional Interactive Experience Features: 3D Interactive Center, Match Center & Official Store */}
        <div className="border-t border-slate-200 dark:border-white/10 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E6002B] font-bold inline-block mb-2">
              Ecosistema Digital Club MC
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white">
              PARTIDOS EN VIVO, PLANTILLA Y TIENDA 3D
            </h3>
          </div>

          {/* 3D WebGL Ball & Duel Countdown */}
          <HeroSection
            onOpenStore={() => {
              const el = document.getElementById('tienda');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Live Match Center */}
          <MatchCenterSection match={liveMatch} />

          {/* 3D Interactive Players Roster */}
          <PlayersRosterSection players={players} />

          {/* Official Store with 3D Jersey Customizer in Bolivianos (Bs.) and QR payment */}
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

          {/* Escuela Formativa Lead Capture */}
          <AcademySection onNewLead={handleNewLead} />

          {/* Fixture Calendar */}
          <CalendarSection />

          {/* Fan Zone */}
          <FanZoneSection />

          {/* News & Press */}
          <NewsSection news={news} />

          {/* Direct Contact */}
          <ContactDirectSection onNewLead={handleNewLead} />
        </div>
      </main>

      {/* SECTION-15: Site Footer */}
      <SiteFooter />

      {/* Admin Login Gate Modal */}
      <AdminLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
