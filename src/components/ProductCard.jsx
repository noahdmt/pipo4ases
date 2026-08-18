import { Bookmark } from 'lucide-react';
import ProductImage from './ProductImage';

export default function ProductCard({ producto, esFav, toggleFavorito, onSelect, cardTone }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(producto);
    }
  };

  const isBlueTone = cardTone === 'blue' || (!cardTone && producto.esNaranja);
  const isGoldTone = cardTone === 'gold';

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect(producto)}
      onKeyDown={handleKeyDown}
      className={`group relative flex h-full w-full min-h-52 cursor-pointer touch-manipulation select-none flex-col overflow-hidden rounded-[22px] border transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.985] ${
        isBlueTone
          ? 'border-[#2563EB]/70 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.34),rgba(10,14,23,0.98)_58%)] hover:-translate-y-1 hover:border-[#2563EB] hover:shadow-[0_28px_44px_-26px_rgba(37,99,235,0.82)]'
          : isGoldTone
            ? 'border-[#FACC15]/45 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.22),rgba(10,14,23,0.98)_58%)] hover:-translate-y-1 hover:border-[#FACC15]/75 hover:shadow-[0_28px_44px_-26px_rgba(250,204,21,0.5)]'
            : 'border-[#1d2c47] bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.18),rgba(10,14,23,0.98)_58%)] hover:-translate-y-1 hover:border-[#FACC15]/60 hover:shadow-[0_28px_44px_-26px_rgba(250,204,21,0.46)]'
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_55%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#ffffff]/80 to-transparent" />

      <button
        type="button"
        aria-label={esFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
        onClick={(event) => toggleFavorito(producto.id, event)}
        className={`absolute right-2.5 top-2.5 z-20 rounded-full border p-1.25 backdrop-blur-xl transition-all ${
          esFav
            ? 'border-[#FACC15] bg-[#FACC15] text-[#0b0d11] shadow-[0_0_16px_rgba(250,204,21,0.65)]'
            : 'border-white/10 bg-[#0b1018]/75 text-slate-100 hover:border-white/20 hover:bg-[#0b1018]'
        }`}
        title={esFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      >
        <Bookmark className="h-3.5 w-3.5 fill-current" />
      </button>

      <div className="px-3 pt-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.75 text-[9px] font-black uppercase tracking-[0.16em] ${
            isGoldTone
              ? 'border-[#FACC15]/60 bg-[#FACC15]/12 text-[#fff7d0]'
              : 'border-[#2563EB]/35 bg-[#2563EB]/10 text-[#ffffff]'
          }`}>
            <span className="h-1.5 w-1.5 rounded-full bg-[#FACC15] shadow-[0_0_12px_rgba(250,204,21,0.9)]" />
            {producto.badge}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">#{producto.id}</span>
        </div>
      </div>

      <ProductImage
        src={producto.imagen}
        alt={producto.nombre}
        className="mx-3 mt-3 h-24"
        isGoldTone={isGoldTone}
      />

      <div className="flex flex-1 flex-col px-3 pb-3 pt-3">
        <div className="mb-2 min-h-[2.1rem] min-w-0">
          <h3 className="wrap-break-word text-[0.9rem] font-black leading-[1.08] tracking-[-0.04em] text-white sm:text-[1.02rem]">{producto.nombre}</h3>
          <p className="mt-1 wrap-break-word text-[9px] font-bold uppercase tracking-[0.14em] text-slate-300">{producto.subtitulo}</p>
        </div>

        <div className="mt-auto space-y-2.5">
          <div className="grid grid-cols-1 gap-2 border-t border-[#2563EB]/15 pt-2.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div className="min-w-0 overflow-hidden">
              <span className={`block text-[9px] font-bold uppercase tracking-[0.16em] ${
                isGoldTone ? 'text-[#f8e7a3]' : 'text-slate-400'
              }`}>Desde</span>
              <span className="mt-0.5 block text-[0.9rem] font-black leading-none text-white truncate sm:text-[1rem]">
                {producto.precioText.replace(/^Desde\s+/i, '')}
              </span>
            </div>
            <span
              className={`inline-flex w-full items-center justify-center self-center whitespace-nowrap rounded-full border px-3 py-1.25 text-[9px] font-black uppercase tracking-[0.14em] transition-all duration-200 group-hover:-translate-y-px sm:w-28 ${
                isGoldTone
                  ? 'border-[#FACC15] bg-[#FACC15] text-[#0c1220] shadow-[0_8px_20px_rgba(250,204,21,0.24)] group-hover:bg-[#f4c814]'
                  : 'border-[#2563EB] bg-[#2563EB] text-white shadow-[0_8px_20px_rgba(37,99,235,0.2)] group-hover:bg-[#1d4ed8]'
              }`}
            >
              VER MÁS
            </span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#0e1727] ring-1 ring-inset ring-white/5">
            <div
              className="h-full rounded-full bg-[#FACC15] shadow-[0_0_12px_rgba(250,204,21,0.38)]"
              style={{ width: '70%' }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
