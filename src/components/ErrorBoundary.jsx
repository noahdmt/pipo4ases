import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Componente ErrorBoundary para capturar cualquier excepción no controlada en el árbol de renderizado de React,
 * evitando que la aplicación quede en pantalla blanca.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para mostrar la UI de contingencia
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Se captura la información del error sin exponer detalles sensibles al usuario
    this.setState({ errorInfo });
    
    // Registrar el error silenciosamente para análisis en producción (si existiera un servicio de telemetry)
    if (import.meta.env?.DEV) {
      console.error('[ErrorBoundary caught error]:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0d11] text-white flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-[#161922] border border-red-500/30 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
            {/* Glow de advertencia */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 text-red-500">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-black uppercase tracking-tight mb-2 text-white">
              Algo no salió como esperábamos
            </h2>

            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Ocurrió un inconveniente temporal al procesar la vista. Tu sesión y datos están seguros.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#2563EB]/20"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reintentar Cargar</span>
              </button>

              <button
                onClick={() => { window.location.href = '/'; }}
                className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 border border-white/10 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Volver al Inicio</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
