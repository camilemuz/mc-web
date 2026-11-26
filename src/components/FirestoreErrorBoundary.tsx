import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class FirestoreErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error?.message || 'Ocurrió un error inesperado al sincronizar los datos.',
    };
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F4F6F8] dark:bg-[#08080A] text-slate-900 dark:text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-[#101014] border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 text-center shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 flex items-center justify-center mx-auto mb-4 text-[#E6002B]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-extrabold font-display uppercase mb-2">
              Error de Sincronización
            </h2>
            <p className="text-xs text-slate-600 dark:text-neutral-400 mb-5 break-words">
              {this.state.errorMessage.slice(0, 260)}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recargar Página</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
