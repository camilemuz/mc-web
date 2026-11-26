import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, Shield, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import { playUiClick, playGoalCheer } from '../utils/soundEffects';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playUiClick();
    setError(null);

    // Valid passwords
    const trimmed = password.trim();
    if (trimmed === 'careaga2026' || trimmed === 'admin123' || trimmed === '2026') {
      setIsSubmitting(true);
      playGoalCheer();
      try {
        sessionStorage.setItem('mc_admin_authenticated', 'true');
      } catch {
        // Ignore storage error
      }
      setTimeout(() => {
        setIsSubmitting(false);
        setPassword('');
        onSuccess();
      }, 400);
    } else {
      setError('Contraseña incorrecta. Intente con: careaga2026');
    }
  };

  const handleQuickFill = () => {
    playUiClick();
    setPassword('careaga2026');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#0A0A0E] border border-neutral-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Subtle red ambient glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#E6002B]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            playUiClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="relative w-16 h-16 mx-auto mb-3 flex items-center justify-center">
            <img
              src="/logo-mc-shield.png"
              alt="Escudo Oficial MC"
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(230,0,43,0.6)]"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/70 border border-red-800/60 text-[#FF4D6D] text-[11px] font-mono uppercase mb-2">
            <Shield className="w-3 h-3" />
            <span>Acceso Administrativo</span>
          </div>
          <h3 className="text-xl font-extrabold font-display text-white">
            Iniciar Sesión
          </h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
            Panel exclusivo para edición de contenidos, horarios, jugadores y partidos del Club MC.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
              Contraseña de Administrador
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                placeholder="Ingresa la contraseña..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900/90 border border-neutral-700 focus:border-[#E6002B] rounded-xl px-4 py-2.5 pr-11 text-sm text-white placeholder:text-neutral-500 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors p-1"
                title={showPassword ? 'Ocultar' : 'Mostrar'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick autofill helper */}
          <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
            <span className="flex items-center gap-1 font-mono">
              <KeyRound className="w-3 h-3 text-neutral-400" /> Clave por defecto:
            </span>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[#FF4D6D] hover:underline font-mono font-bold cursor-pointer"
            >
              careaga2026
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !password.trim()}
            className="w-full py-3 px-4 bg-[#E6002B] hover:bg-[#FF1A40] disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#E6002B]/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <span>Ingresar al Panel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <p className="text-[10px] text-neutral-500 text-center mt-5 font-mono">
          Sesión protegida · Club MC Emprender © 2026
        </p>
      </div>
    </div>
  );
};
