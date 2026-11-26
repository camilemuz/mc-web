import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Product, CartItem } from '../types';
import { PRODUCTS_DATA } from '../data/mockData';
import { JerseyCustomizer3D } from './JerseyCustomizer3D';
import { playUiClick, playWhoosh, playGoalCheer } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  ShoppingBag,
  CreditCard,
  Lock,
  CheckCircle,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  ShieldCheck,
  Truck,
  X,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

interface StoreSectionProps {
  products?: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product, size: string, customName?: string, customNumber?: number) => void;
  onUpdateCartQty: (cartItemId: string, newQty: number) => void;
  onRemoveFromCart: (cartItemId: string) => void;
  onClearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

export const StoreSection: React.FC<StoreSectionProps> = ({
  products: propProducts,
  cart,
  onAddToCart,
  onUpdateCartQty,
  onRemoveFromCart,
  onClearCart,
  isCartOpen,
  setIsCartOpen
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'camisetas' | 'escuela' | 'entrenamiento' | 'accesorios'>('all');
  const [selectedProductForQuickAdd, setSelectedProductForQuickAdd] = useState<Product | null>(null);
  const [quickSize, setQuickSize] = useState<string>('M');

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'processing' | 'success'>('form');
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'card' | 'tigo'>('qr');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('842');
  const [cardHolder, setCardHolder] = useState('Martín Careaga');
  const [customerPhone, setCustomerPhone] = useState('+591 76543210');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  // Close cart or modals on Escape key
  useEffect(() => {
    if (!isCartOpen && !selectedProductForQuickAdd && !isCheckoutOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isCheckoutOpen && checkoutStep !== 'processing') {
          setIsCheckoutOpen(false);
        } else if (selectedProductForQuickAdd) {
          setSelectedProductForQuickAdd(null);
        } else if (isCartOpen) {
          setIsCartOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, selectedProductForQuickAdd, isCheckoutOpen, checkoutStep, setIsCartOpen]);

  const productList = propProducts || PRODUCTS_DATA;
  const filteredProducts = productList.filter(
    (p) => activeCategory === 'all' || p.category === activeCategory
  );

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 300 || subtotal === 0 ? 0 : 20;
  const total = subtotal + shipping;

  const buildWhatsAppMessage = (customOrderCode?: string) => {
    const code = customOrderCode || orderNumber || `MC-${Math.floor(100000 + Math.random() * 900000)}`;
    const itemsText = cart.length > 0
      ? cart
          .map(
            (i, idx) =>
              `${idx + 1}. *${i.product.name}* (x${i.quantity})\n   • Talla: ${i.selectedSize}${
                i.customName ? `\n   • Personalización: "${i.customName}" (#${i.customNumber || 10})` : ''
              }\n   • Precio: Bs. ${i.product.price * i.quantity} BOB`
          )
          .join('\n')
      : '• 1x Camiseta Oficial Titular MC 2026/27 (Talla M)';

    const methodLabel =
      paymentMethod === 'qr'
        ? 'Pago QR Simple Bolivia (ASOBAN / Banco Central)'
        : paymentMethod === 'card'
        ? 'Tarjeta Débito/Crédito (Libélula / Red Enlace)'
        : 'Tigo Money Bolivia';

    const text =
      `🏆 *NUEVO PEDIDO - CLUB MC EMPRENDER & ESCUELA MARTÍN CAREAGA*\n\n` +
      `📦 *Código de Orden:* ${code}\n` +
      `👤 *Cliente:* ${cardHolder || 'Aficionado MC'}\n` +
      `📱 *Teléfono:* ${customerPhone || '+591 76543210'}\n` +
      `📍 *Dirección de Entrega:* ${customerAddress || 'Entrega en Bolivia'}\n` +
      `💳 *Pasarela Seleccionada:* ${methodLabel}\n\n` +
      `📋 *DETALLE DEL PEDIDO:*\n${itemsText}\n\n` +
      `💰 *Subtotal:* Bs. ${subtotal} BOB\n` +
      `🚚 *Envío:* ${shipping === 0 ? 'GRATIS (+Bs. 300)' : `Bs. ${shipping} BOB`}\n` +
      `🔥 *TOTAL A PAGAR:* Bs. ${total} BOB\n\n` +
      `Hola Escuela Martín Careaga, acabo de solicitar mi pedido en la web oficial. Adjunto esta notificación para la confirmación de tallas y despacho inmediato.`;

    return `https://wa.me/59176543210?text=${encodeURIComponent(text)}`;
  };

  const handleStartCheckout = () => {
    playUiClick();
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
    setCheckoutStep('form');
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    playUiClick();
    setCheckoutStep('processing');

    setTimeout(() => {
      const generatedOrder = `MC-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(generatedOrder);
      setCheckoutStep('success');
      playGoalCheer();

      // Launch sports celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E6002B', '#FFFFFF', '#111111']
        });
      } catch {
        // Confetti fallback
      }

      onClearCart();
    }, 1800);
  };

  return (
    <section id="tienda" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-neutral-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E6002B] uppercase tracking-wider mb-2">
            <span>Tienda Oficial MC & Indumentaria Escuela</span>
            <span aria-hidden="true">·</span>
            <span>Envíos Seguros & Garantía de Calidad</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            TIENDA OFICIAL CLUB MC
          </h2>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            Viste los colores del Primer Plantel y equípate con los uniformes oficiales reglamentarios de la Escuela de Fútbol Martín Careaga.
          </p>
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto max-w-full">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'camisetas', label: 'Camisetas Pro' },
            { id: 'escuela', label: 'Escuela Martín Careaga' },
            { id: 'entrenamiento', label: 'Entrenamiento' },
            { id: 'accesorios', label: 'Accesorios' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playUiClick();
                setActiveCategory(cat.id as any);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#E6002B] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* INFORMATIONAL BANNER: BOLIVIAN PAYMENT GATEWAYS & WHATSAPP NOTIFICATIONS */}
      <div className="mb-10 p-4 sm:p-5 bg-gradient-to-r from-neutral-900/90 via-[#0E0E12] to-neutral-900/90 rounded-2xl border border-neutral-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Pasarelas de Pago Seguras en Bolivia & Notificación por WhatsApp
              </span>
              <span className="px-2 py-0.5 rounded bg-[#E6002B]/20 text-[#FF1A40] text-[10px] font-bold">
                Precios en Bs. (BOB)
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Aceptamos <strong className="text-neutral-200">QR Simple Interbancario ASOBAN</strong> (BCP, BNB, Banco Unión, Bisa, FIE), <strong className="text-neutral-200">Tarjetas Visa/Mastercard (Libélula / Red Enlace)</strong> y <strong className="text-neutral-200">Tigo Money</strong>. Al solicitar tu pedido, se emite una alerta instantánea a WhatsApp para preparar tu envío.
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/59176543210?text=Hola%2C%20quisiera%20consultar%20sobre%20la%20indumentaria%20oficial%20de%20la%20Escuela%20de%20F%C3%BAtbol%20Mart%C3%ADn%20Careaga%20y%20m%C3%A9todos%20de%20pago%20en%20Bolivia."
          target="_blank"
          rel="noopener noreferrer"
          onClick={playUiClick}
          className="shrink-0 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <span>Atención WhatsApp (+591 76543210)</span>
        </a>
      </div>

      {/* FEATURED: 3D JERSEY CUSTOMIZER SHOWCASE */}
      <div className="mb-14">
        <JerseyCustomizer3D
          product={PRODUCTS_DATA[0]}
          onAddToCart={onAddToCart}
        />
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-[#0C0C0E] border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-neutral-700 transition-all duration-200 group"
          >
            {/* Product Visual Container */}
            <div className="relative aspect-[4/3] bg-gradient-to-b from-neutral-900 to-[#0A0A0C] flex items-center justify-center p-6 border-b border-neutral-800/80 overflow-hidden">
              {/* Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                  {product.badge}
                </span>
              </div>

              {/* Product Visual Graphic Illustration or Uploaded Image */}
              <div className="relative w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full max-h-48 object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.7)] rounded-lg"
                  />
                ) : product.category === 'camisetas' || product.category === 'escuela' ? (
                  <svg viewBox="0 0 160 160" className="w-36 h-36 filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)]">
                    <path
                      d="M50 20 L70 30 Q80 35 90 30 L110 20 L140 50 L125 75 L115 65 L115 150 L45 150 L45 65 L35 75 L20 50 Z"
                      fill={product.category === 'escuela' ? '#141418' : '#E6002B'}
                      stroke="#2E2E38"
                      strokeWidth="2"
                    />
                    {product.category === 'escuela' ? (
                      <>
                        <rect x="45" y="65" width="25" height="85" fill="#E6002B" />
                        <text x="80" y="95" fill="#FFF" fontSize="12" fontWeight="bold" textAnchor="middle">
                          ESCUELA MC
                        </text>
                      </>
                    ) : (
                      <>
                        <rect x="65" y="30" width="15" height="120" fill="#0D0D0F" />
                        <rect x="95" y="30" width="15" height="120" fill="#0D0D0F" />
                      </>
                    )}
                  </svg>
                ) : (
                  <svg viewBox="0 0 160 160" className="w-32 h-32 filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)]">
                    <rect x="30" y="30" width="100" height="100" rx="16" fill="#18181D" stroke="#333" strokeWidth="2" />
                    <circle cx="80" cy="70" r="24" fill="#0E0E12" stroke="#E6002B" strokeWidth="2" />
                    <text x="80" y="75" fill="#E6002B" fontSize="14" fontWeight="bold" textAnchor="middle">
                      MC
                    </text>
                    <rect x="50" y="105" width="60" height="8" rx="4" fill="#E6002B" />
                  </svg>
                )}
              </div>
            </div>

            {/* Product Body */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                  <span>Stock: {product.stock} unidades</span>
                  <span>★ {product.rating}</span>
                </div>
                <h3 className="text-lg font-bold font-display text-white group-hover:text-[#FF1A40] transition-colors leading-snug">
                  {product.name}
                </h3>
                <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price & Action */}
              <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold font-mono-numbers text-white">
                    Bs. {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs line-through text-neutral-500 font-mono-numbers ml-2">
                      Bs. {product.originalPrice}
                    </span>
                  )}
                </div>

                {product.customizable ? (
                  <button
                    onClick={() => {
                      playUiClick();
                      const element = document.getElementById('tienda');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Personalizar 3D
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      playUiClick();
                      setSelectedProductForQuickAdd(product);
                      setQuickSize(product.sizes[0] || 'M');
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#E6002B] hover:bg-[#FF1A40] rounded-lg transition-colors cursor-pointer"
                  >
                    Comprar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Add Size Modal */}
      {selectedProductForQuickAdd && createPortal(
        <div
          onClick={() => setSelectedProductForQuickAdd(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#101014] border border-neutral-700 rounded-2xl p-6 max-w-sm w-full animate-in fade-in zoom-in-95"
          >
            <h4 className="text-lg font-bold font-display text-white mb-1">
              Seleccionar Talle
            </h4>
            <p className="text-xs text-neutral-400 mb-4">
              {selectedProductForQuickAdd.name}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {selectedProductForQuickAdd.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    playUiClick();
                    setQuickSize(s);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                    quickSize === s
                      ? 'border-[#E6002B] bg-[#E6002B] text-white'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedProductForQuickAdd(null)}
                className="flex-1 py-2 text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-900 rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  playUiClick();
                  onAddToCart(selectedProductForQuickAdd, quickSize);
                  setSelectedProductForQuickAdd(null);
                  setIsCartOpen(true);
                }}
                className="flex-1 py-2 text-xs font-semibold text-white bg-[#E6002B] hover:bg-[#FF1A40] rounded-lg cursor-pointer"
              >
                Añadir al Carrito
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* SLIDE-OVER SHOPPING CART DRAWER */}
      {isCartOpen && createPortal(
        <div
          onClick={() => {
            playUiClick();
            setIsCartOpen(false);
          }}
          className="fixed inset-0 z-[100] overflow-hidden bg-black/70 backdrop-blur-sm"
        >
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-screen max-w-md bg-[#0D0D10] border-l border-neutral-800 shadow-2xl flex flex-col justify-between"
            >
              {/* Cart Header */}
              <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-[#E6002B]" />
                  <h3 className="text-lg font-bold font-display text-white">
                    TU CARRITO ({cart.reduce((s, i) => s + i.quantity, 0)})
                  </h3>
                </div>
                <button
                  type="button"
                  aria-label="Cerrar carrito"
                  onClick={() => {
                    playUiClick();
                    setIsCartOpen(false);
                  }}
                  className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingBag className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
                    <p className="text-sm text-neutral-400 font-medium">El carrito está vacío</p>
                    <p className="text-xs text-neutral-600 mt-1">Explora la tienda o personaliza tu camiseta oficial.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 flex gap-4 items-start"
                    >
                      <div className="w-16 h-16 bg-neutral-950 rounded-lg flex items-center justify-center shrink-0 border border-neutral-800 font-display font-black text-xl text-[#E6002B]">
                        {item.customNumber || 'MC'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{item.product.name}</h4>
                        <div className="text-xs text-neutral-400 mt-1 flex flex-wrap gap-x-2">
                          <span>Talle: {item.selectedSize}</span>
                          {item.customName && (
                            <span>· Estampado: {item.customName} (#{item.customNumber})</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm font-bold font-mono-numbers text-white">
                            Bs. {item.product.price * item.quantity}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                playUiClick();
                                onUpdateCartQty(item.cartItemId, item.quantity - 1);
                              }}
                              className="w-6 h-6 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-mono-numbers font-semibold text-white px-1">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => {
                                playUiClick();
                                onUpdateCartQty(item.cartItemId, item.quantity + 1);
                              }}
                              className="w-6 h-6 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                playUiClick();
                                onRemoveFromCart(item.cartItemId);
                              }}
                              className="ml-2 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer Summary */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-neutral-800 bg-[#09090C] space-y-3">
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>Subtotal</span>
                    <span className="font-mono-numbers text-white">Bs. {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>Envío a toda Bolivia</span>
                    <span className="font-mono-numbers text-white">
                      {shipping === 0 ? 'Gratis (+Bs. 300)' : `Bs. ${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-neutral-800">
                    <span>Total</span>
                    <span className="font-mono-numbers text-[#E6002B] text-lg">Bs. {total}</span>
                  </div>

                  <button
                    onClick={handleStartCheckout}
                    className="w-full mt-3 py-3 bg-[#E6002B] hover:bg-[#FF1A40] text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#E6002B]/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Iniciar Compra Segura</span>
                  </button>

                  <a
                    href={buildWhatsAppMessage()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={playUiClick}
                    className="w-full py-2.5 bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/40 text-emerald-400 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Pedir Directo por WhatsApp</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* SECURE PAYMENT GATEWAY CHECKOUT MODAL */}
      {isCheckoutOpen && createPortal(
        <div
          onClick={() => {
            if (checkoutStep !== 'processing') setIsCheckoutOpen(false);
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-[#0E0E12] border border-neutral-700 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95"
          >
            {checkoutStep !== 'processing' && (
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Step 1: Payment & Shipping Form */}
            {checkoutStep === 'form' && (
              <form onSubmit={handleProcessPayment} className="space-y-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#E6002B] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Pasarela de Pago Segura Cifrada 256-bit</span>
                </div>
                <h3 className="text-2xl font-bold font-display text-white">
                  FINALIZAR PEDIDO OFICIAL
                </h3>

                {/* Total pill */}
                <div className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-800 flex justify-between items-center text-xs">
                  <span className="text-neutral-400">Total a pagar:</span>
                  <span className="font-bold text-white font-mono-numbers text-base">
                    Bs. {total} BOB
                  </span>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold uppercase text-neutral-400 block mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Ej: Martín Careaga"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E6002B]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase text-neutral-400 block mb-1">
                      Teléfono / WhatsApp (Notificaciones)
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+591 76543210"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E6002B]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold uppercase text-neutral-400 block mb-1">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="tu-email@gmail.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E6002B]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold uppercase text-neutral-400 block mb-1">
                      Dirección de Entrega en Bolivia (Ciudad, Zona, Calle)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Santa Cruz de la Sierra / La Paz / Cochabamba, Calle Los Sauces 450"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E6002B]"
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="text-[11px] font-semibold uppercase text-neutral-400 block mb-2">
                    Método de Pago Seguro
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'qr', label: 'Pago QR Simple (Bancos Bolivia)', icon: Lock },
                      { id: 'card', label: 'Tarjeta Débito/Crédito', icon: CreditCard },
                      { id: 'tigo', label: 'Tigo Money / Transferencia', icon: Truck }
                    ].map((m) => {
                      const Icon = m.icon;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            playUiClick();
                            setPaymentMethod(m.id as any);
                          }}
                          className={`p-2.5 rounded-lg border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                            paymentMethod === m.id
                              ? 'border-[#E6002B] bg-[#E6002B]/10 text-white'
                              : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4 text-[#E6002B]" />
                          <span className="text-[11px] font-semibold leading-tight">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* QR Simple visual if QR is selected */}
                {paymentMethod === 'qr' && (
                  <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center gap-4">
                    <div className="w-20 h-20 bg-white p-1 rounded-lg flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <rect x="10" y="10" width="30" height="30" fill="#000" />
                        <rect x="15" y="15" width="20" height="20" fill="#fff" />
                        <rect x="20" y="20" width="10" height="10" fill="#000" />
                        <rect x="60" y="10" width="30" height="30" fill="#000" />
                        <rect x="65" y="15" width="20" height="20" fill="#fff" />
                        <rect x="70" y="20" width="10" height="10" fill="#000" />
                        <rect x="10" y="60" width="30" height="30" fill="#000" />
                        <rect x="15" y="65" width="20" height="20" fill="#fff" />
                        <rect x="20" y="70" width="10" height="10" fill="#000" />
                        <rect x="50" y="50" width="15" height="15" fill="#E6002B" />
                        <rect x="70" y="70" width="20" height="20" fill="#000" />
                      </svg>
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-white block">Código QR Simple Bolivia</span>
                      <span className="text-neutral-400 leading-relaxed block mt-0.5">
                        Escanea desde Banco Unión, BCP, BNB, Banco FIE, Banco Mercantil o tu app bancaria boliviana favorita.
                      </span>
                    </div>
                  </div>
                )}

                {/* Card Fields if Card Selected */}
                {paymentMethod === 'card' && (
                  <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3">
                    <div>
                      <label className="text-[10px] font-semibold uppercase text-neutral-500 block mb-1">
                        Número de Tarjeta (Habilitada para compras por internet)
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-mono-numbers focus:outline-none focus:border-[#E6002B]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-semibold uppercase text-neutral-500 block mb-1">
                          Vencimiento (MM/AA)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-mono-numbers focus:outline-none focus:border-[#E6002B]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold uppercase text-neutral-500 block mb-1">
                          Código CVC / CVV
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-mono-numbers focus:outline-none focus:border-[#E6002B]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-[#E6002B] hover:bg-[#FF1A40] text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#E6002B]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Confirmar y Pagar Bs. {total} BOB</span>
                </button>
              </form>
            )}

            {/* Step 2: Processing Payment State */}
            {checkoutStep === 'processing' && (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 border-4 border-[#E6002B] border-t-transparent rounded-full animate-spin mx-auto" />
                <h4 className="text-xl font-bold font-display text-white">
                  PROCESANDO COMPRA SEGURA...
                </h4>
                <p className="text-xs text-neutral-400">
                  Validando credenciales con la red bancaria y reservando tu indumentaria oficial.
                </p>
              </div>
            )}

            {/* Step 3: Success Confirmation State */}
            {checkoutStep === 'success' && (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold font-display text-white">
                  ¡PAGO REGISTRADO CON ÉXITO!
                </h4>
                <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
                  Tu orden ha sido procesada mediante la pasarela segura para Bolivia ({paymentMethod === 'qr' ? 'QR Simple Interbancario ASOBAN' : paymentMethod === 'card' ? 'Red Enlace ATC / Cybersource' : 'Tigo Money'}).
                </p>

                <div className="p-4 bg-neutral-900/80 rounded-xl border border-neutral-800 text-left space-y-2 max-w-sm mx-auto text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Código de Orden:</span>
                    <span className="font-mono-numbers font-bold text-white">{orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Pasarela Utilizada:</span>
                    <span className="text-emerald-400 font-semibold">
                      {paymentMethod === 'qr' ? 'QR Simple Bolivia' : paymentMethod === 'card' ? 'Tarjeta Débito/Crédito' : 'Tigo Money'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Total Facturado:</span>
                    <span className="font-bold text-white font-mono-numbers">Bs. {total} BOB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Entrega Estimada:</span>
                    <span className="text-white">24 a 48 hs en Bolivia</span>
                  </div>
                </div>

                {/* Direct WhatsApp Order Notification Button */}
                <div className="pt-2 max-w-sm mx-auto space-y-2">
                  <a
                    href={buildWhatsAppMessage(orderNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={playUiClick}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer shadow-emerald-900/30"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Enviar Notificación a WhatsApp (+591 76543210)</span>
                  </a>

                  <p className="text-[11px] text-neutral-400">
                    *Al pulsar el botón se abrirá WhatsApp con el resumen completo de tu pedido (código, tallas, dorsal y dirección) listo para confirmar.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Volver a la Tienda Oficial
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};
