import { Sun, Moon, Bookmark, MessageCircle } from 'lucide-react';
import logoPipo from '../assets/pipo4ases.webp';
import { menuSidebar } from '../data/products';
import { buildWhatsAppLink } from '../utils/security';

export default function Navbar({
  categoriaActiva,
  setCategoriaActiva,
  modoDescanso,
  setModoDescanso,
  favoritosCount,
  soloFavoritos,
  setSoloFavoritos,
}) {
  const handleCategoriaChange = (categoriaId) => {
    setCategoriaActiva(categoriaId);
    setSoloFavoritos(false);
  };

  return (
    <header
      className={`sticky top-0 z-30 mx-auto w-full border-b backdrop-blur-xl transition-all duration-300 ${
        modoDescanso
          ? 'border-slate-800/80 bg-[#0d1728]/95 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
          : 'border-[#2563EB]/20 bg-[#050b16]/95 shadow-[0_4px_25px_rgba(37,99,235,0.15)]'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3.5">
        {/* LOGO & BRAND */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <div
            className="group relative cursor-pointer"
            onClick={() => handleCategoriaChange('todas')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCategoriaChange('todas')}
          >
            <div className="absolute -inset-1 rounded-full bg-linear-to-r from-[#2563EB] to-[#FACC15] opacity-40 blur-md transition duration-300 group-hover:opacity-80"></div>
            <img
              src={logoPipo}
              alt="Logo Pipo 4 Ases"
              className="relative h-10 w-10 shrink-0 rounded-full object-contain transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-12"
            />
          </div>
          <div
            className="flex cursor-pointer flex-col justify-center"
            onClick={() => handleCategoriaChange('todas')}
          >
            <span className="text-[0.75rem] font-black uppercase leading-tight tracking-[0.12em] sm:text-base sm:tracking-[0.2em]">
              PIPO <span className={modoDescanso ? 'text-white' : 'text-[#FACC15] drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]'}>4 ASES</span>
            </span>
            <span className="text-[8.5px] font-bold uppercase tracking-widest text-slate-400 sm:text-[10px] sm:tracking-[0.18em]">
              4 AÑOS EN EL MERCADO
            </span>
          </div>
        </div>

        {/* CATEGORY NAV */}
        <nav
          aria-label="Categorías de productos"
          className={`hidden items-center gap-1 rounded-full border p-1 transition-colors sm:flex ${
            modoDescanso
              ? 'border-slate-700/60 bg-[#101b2d]'
              : 'border-[#2563EB]/20 bg-[#0d1728]/80'
          }`}
        >
          {menuSidebar.map((categoria) => {
            const isActive = categoriaActiva === categoria.id && !soloFavoritos;
            const Icon = categoria.icon;

            return (
              <button
                key={categoria.id}
                type="button"
                aria-pressed={isActive}
                aria-label={`Ver ${categoria.nombre}`}
                onClick={() => handleCategoriaChange(categoria.id)}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold transition-all sm:px-4 sm:py-1.5 sm:text-xs ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-[0_0_16px_rgba(37,99,235,0.4)]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {Icon && <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                <span>{categoria.nombre}</span>
              </button>
            );
          })}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            type="button"
            aria-label={modoDescanso ? 'Activar modo noche' : 'Activar modo descanso'}
            onClick={() => setModoDescanso(!modoDescanso)}
            title={modoDescanso ? 'Modo Alto Contraste' : 'Modo Descanso Visual'}
            className={`flex items-center gap-1.5 rounded-full border p-2 text-xs transition-all ${
              modoDescanso
                ? 'border-[#FACC15]/30 bg-[#1a2942] text-[#FACC15] hover:bg-[#1f3357]'
                : 'border-[#2563EB]/20 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            {modoDescanso ? <Sun className="h-4 w-4 text-[#FACC15]" /> : <Moon className="h-4 w-4 text-slate-300" />}
            <span className="hidden text-[10px] font-bold lg:inline">
              {modoDescanso ? 'Modo Suave' : 'Modo Noche'}
            </span>
          </button>

          <button
            type="button"
            aria-label="Ver favoritos guardados"
            aria-pressed={soloFavoritos}
            onClick={() => setSoloFavoritos(!soloFavoritos)}
            className={`flex items-center gap-1.5 rounded-full border p-2 text-xs transition-all ${
              soloFavoritos
                ? 'border-[#FACC15] bg-[#FACC15]/15 text-[#FACC15]'
                : 'border-[#2563EB]/20 bg-white/5 text-slate-400 hover:text-white'
            }`}
            title="Ver Favoritos Guardados"
          >
            <Bookmark className={`h-4 w-4 ${favoritosCount > 0 ? 'fill-current text-[#FACC15]' : ''}`} />
            {favoritosCount > 0 && (
              <span className="rounded-full bg-[#FACC15] px-1.5 py-0.2 text-[10px] font-black text-[#08111b]">
                {favoritosCount}
              </span>
            )}
          </button>

          <a
            href={buildWhatsAppLink('5493815891843', 'Hola, quisiera información sobre sus servicios.')}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp"
            className={`flex items-center gap-2 rounded-full border border-[#2563EB] bg-[#2563EB] px-3 py-2 text-[10px] font-black text-white shadow-[0_0_18px_rgba(37,99,235,0.25)] transition-all hover:bg-[#1d4ed8] sm:px-4 sm:text-xs ${
              modoDescanso ? 'border-[#FACC15]/40' : ''
            }`}
          >
            <MessageCircle className="h-3.5 w-3.5 fill-current" />
            <span className="hidden sm:inline">Contacto</span>
          </a>
        </div>
      </div>
    </header>
  );
}