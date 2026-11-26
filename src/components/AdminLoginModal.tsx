import React, { useState, useEffect } from 'react';
import { X, Shield, AlertCircle, CheckCircle2, Cloud } from 'lucide-react';
import { playUiClick, playGoalCheer } from '../utils/soundEffects';
import { useAuth } from '../utils/AuthContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { signInWithGoogle, authError, clearAuthError, isAdmin } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Only clear previous auth errors when the modal is freshly opened
  useEffect(() => {
    if (isOpen) {
      clearAuthError();
    }
  }, [isOpen, clearAuthError]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && isAdmin) {
      onSuccess();
    }
  }, [isOpen, isAdmin, onSuccess]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    playUiClick();
    setIsSubmitting(true);
    const ok = await signInWithGoogle();
    setIsSubmitting(false);
    if (ok) {
      playGoalCheer();
      onSuccess();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white dark:bg-[#0A0A0E] border border-slate-200 dark:border-neutral-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden"
      >
        <div className="hidden dark:block absolute -top-16 -right-16 w-36 h-36 bg-[#E6002B]/20 rounded-full blur-3xl pointer-events-none" />

        <button
          type="button"
          aria-label="Cerrar inicio de sesión"
          onClick={() => {
            playUiClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:text-slate-950 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
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
              className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(230,0,43,0.35)]"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-800/60 text-[#E6002B] dark:text-[#FF4D6D] text-[11px] font-mono uppercase mb-2">
            <Shield className="w-3 h-3" />
            <span>Acceso Administrativo Cloud</span>
          </div>
          <h3 className="text-xl font-extrabold font-display text-slate-900 dark:text-white">
            Panel CMS en Tiempo Real
          </h3>
          <p className="text-xs text-slate-600 dark:text-neutral-400 mt-1 max-w-xs mx-auto leading-relaxed">
            Inicia sesión con tu cuenta de Google autorizada para publicar cambios instantáneos en todos los dispositivos.
          </p>
        </div>

        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80 text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#E6002B] dark:text-red-400 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        <div className="mb-5 p-3.5 rounded-xl bg-slate-50 dark:bg-neutral-900/70 border border-slate-200 dark:border-neutral-800 space-y-2 text-xs text-slate-600 dark:text-neutral-300">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-[#E6002B] shrink-0" />
            <span>Sincronización instantánea con Firebase Firestore</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Actualizaciones en vivo sin borrar caché del navegador</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-[#E6002B] hover:bg-[#FF1A40] disabled:bg-slate-200 dark:disabled:bg-neutral-800 disabled:text-slate-400 dark:disabled:text-neutral-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#E6002B]/25 flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M21.35 11.1h-9.18v2.92h5.27c-.23 1.48-1.69 4.35-5.27 4.35-3.17 0-5.76-2.62-5.76-5.87s2.59-5.87 5.76-5.87c1.81 0 3.01.77 3.7 1.43l2.52-2.43C16.77 4.13 14.67 3.2 12.17 3.2 7.1 3.2 3 7.3 3 12.5s4.1 9.3 9.17 9.3c5.3 0 8.81-3.72 8.81-8.97 0-.6-.06-1.06-.15-1.73z"
            />
          </svg>
          <span>{isSubmitting ? 'Verificando acceso...' : 'Continuar con Google'}</span>
        </button>

        <p className="text-[10px] text-slate-500 dark:text-neutral-500 text-center mt-5 font-mono">
          Autenticación verificada Firebase · Club MC Martín Careaga © 2026
        </p>
      </div>
    </div>
  );
};
