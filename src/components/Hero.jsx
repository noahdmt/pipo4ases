import { Sparkles, Search, X } from 'lucide-react';

export default function Hero({ busqueda, setBusqueda, modoDescanso }) {
  return (
    <div className="mx-auto mb-3 flex max-w-4xl flex-col items-center px-1 py-3 text-center sm:mb-5 sm:py-4">
      <span
        className={`hero-badge mb-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[8.5px] font-black uppercase tracking-[0.18em] sm:text-[11px] ${
          modoDescanso
            ? 'border-[#FACC15]/35 bg-[#FACC15]/10 text-[#FACC15]'
            : 'border-[#2563EB]/30 bg-[#0f172a]/90 text-[#ffffff]'
        }`}
      >
        <Sparkles className="h-3 w-3" />
        VENTA MAYORISTA
      </span>

      <h1 className="hero-title mb-3 w-full max-w-2xl text-[clamp(1.8rem,5.5vw,3.6rem)] font-black uppercase leading-[1.05] tracking-[-0.03em] text-white">
        <span className="block text-white">4 ASES</span>
        <span className="block text-[#FACC15] drop-shadow-[0_2px_12px_rgba(250,204,21,0.3)]">
          DISTRIBUIDORA DE FICHAS
        </span>
      </h1>

      <p className="mb-4 max-w-2xl text-[0.68rem] font-medium leading-relaxed text-slate-300 sm:text-base lg:text-lg">
        Plataformas de alto rendimiento con activación inmediata.
      </p>

      <div className="relative mx-auto w-full max-w-xs sm:max-w-lg lg:max-w-2xl">
        <label htmlFor="product-search" className="sr-only">
          Buscar Plataformas Disponibles
        </label>
        <div
          className={`flex items-center rounded-full border p-2.5 shadow-[0_12px_28px_-18px_rgba(37,99,235,0.35)] transition-all duration-200 sm:p-3 ${
            modoDescanso
              ? 'border-[#FACC15]/20 bg-[#111827] focus-within:ring-1 focus-within:ring-[#FACC15]'
              : 'border-[#2563EB]/25 bg-[#111827]/80 focus-within:ring-1 focus-within:ring-[#2563EB]'
          }`}
        >
          <Search
            className={`ml-2.5 mr-2 h-4 w-4 shrink-0 sm:h-5 sm:w-5 ${modoDescanso ? 'text-[#FACC15]' : 'text-[#2563EB]'}`}
          />
          <input
            id="product-search"
            type="text"
            aria-label="Buscar productos o servicios"
            placeholder="Buscar plataforma o nombre..."
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            className="hero-input w-full bg-transparent pr-2 text-xs focus:outline-none sm:text-sm lg:text-base"
          />
          {busqueda && (
            <button
              type="button"
              onClick={() => setBusqueda('')}
              className="mr-1 rounded-full border border-white/10 bg-white/5 p-1 text-slate-400 transition-colors hover:text-white cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
