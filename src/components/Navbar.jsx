import { Box, Sun, Moon, Bookmark, MessageCircle } from 'lucide-react';
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
     className={`relative z-20 mx-auto w-full max-w-7xl border-b px-3 py-2.5 backdrop-blur-md transition-colors sm:px-6 sm:py-4 ${
       modoDescanso ? 'border-slate-800 bg-[#0d1728]/80' : 'border-[#2563EB]/20 bg-[#050b16]/80'
      }`}
    >
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2.5 sm:gap-0">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
         <div
           className={`flex h-8 w-8 items-center justify-center rounded-xl shadow-[0_0_18px_rgba(37,99,235,0.32)] transition-transform hover:scale-[1.02] sm:h-11 sm:w-11 ${
             modoDescanso ? 'bg-[#2563EB] text-white ring-1 ring-[#FACC15]/40' : 'bg-[#2563EB] text-white ring-1 ring-[#FACC15]/30'
           }`}
         >
           <Box className="h-4 w-4 sm:h-5 sm:w-5" />
         </div>
         <div className="min-w-0">
           <span className="block text-[0.67rem] font-black uppercase leading-none tracking-[0.14em] sm:text-lg sm:tracking-[0.24em]">
             PIPO <span className={modoDescanso ? 'text-[#ffffff]' : 'text-[#FACC15]'}>4 ASES</span>
           </span>
            <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:tracking-[0.2em]">
              4 AÑOS EN EL MERCADO
            </span>
         </div>
       </div>

       <nav
         aria-label="Categorías de productos"
         className={`order-3 hidden sm:flex min-w-0 w-full items-center justify-center gap-1 rounded-full border p-1 sm:order-0 sm:w-auto ${
           modoDescanso ? 'border-slate-700/60 bg-[#101b2d]' : 'border-[#2563EB]/20 bg-[#0d1728]'
         }`}
       >
         {menuSidebar.map((categoria) => {
           const isActive = categoriaActiva === categoria.id && !soloFavoritos;

           return (
             <button
               key={categoria.id}
               type="button"
               aria-pressed={isActive}
               aria-label={`Ver ${categoria.nombre}`}
               onClick={() => handleCategoriaChange(categoria.id)}
               className={`rounded-full px-2.5 py-1.25 text-[9px] font-bold transition-all sm:px-4 sm:text-xs ${
                 isActive
                   ? 'bg-[#2563EB] text-white shadow-[0_0_18px_rgba(37,99,235,0.25)]'
                   : 'text-slate-400 hover:bg-white/5 hover:text-white'
               }`}
             >
               {categoria.nombre}
             </button>
           );
         })}
       </nav>

       <div className="flex items-center gap-2 sm:gap-3">
         <button
           type="button"
           aria-label={modoDescanso ? 'Activar modo noche' : 'Activar modo descanso'}
           onClick={() => setModoDescanso(!modoDescanso)}
           title={modoDescanso ? 'Modo Alto Contraste' : 'Modo Descanso Visual'}
           className={`flex items-center gap-1.5 rounded-full border p-2 text-xs transition-all ${
             modoDescanso
               ? 'border-[#FACC15]/25 bg-[#1a2942] text-[#FACC15] hover:bg-[#1f3357]'
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
