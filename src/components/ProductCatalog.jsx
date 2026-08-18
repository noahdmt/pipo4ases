import { useRef } from 'react';
import { Zap, Filter, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { etiquetasFiltro } from '../data/products';

export default function ProductCatalog({
  productosFiltrados,
  favoritos,
  toggleFavorito,
  onSelectProducto,
  etiquetaSeleccionada,
  setEtiquetaSeleccionada,
  soloFavoritos,
  onResetFilters,
  modoDescanso,
}) {
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;
    const amount = window.innerWidth * 0.72;
    carouselRef.current.scrollBy({
      left: direction === 'next' ? amount : -amount,
      behavior: 'smooth',
    });
  };

  return (
    <section id="catalogo" className="pt-0">
      <div className="mb-3 flex flex-col items-center gap-2.5 text-center md:flex-row md:items-center md:justify-between md:text-left">
        <h2 className="flex items-center justify-center gap-2 text-base font-black uppercase tracking-[-0.04em] text-white sm:text-xl">
          <Zap className="h-4 w-4 text-[#FACC15]" />
          {soloFavoritos ? 'Tus Favoritos Guardados' : 'Catálogo Premium'}
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-1.5 overflow-x-auto pb-1 scrollbar-none md:justify-end">
          <span className="mr-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            <Filter className="h-3 w-3" /> Filtrar
          </span>
          {etiquetasFiltro.map((tag) => {
            const isActive = etiquetaSeleccionada === tag;

            return (
              <button
                key={tag}
                type="button"
                aria-pressed={isActive}
                onClick={() => setEtiquetaSeleccionada(tag)}
                className={`cursor-pointer whitespace-nowrap rounded-full px-2.5 py-1.25 text-[10px] font-bold tracking-[0.08em] transition-all ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-[0_0_12px_rgba(37,99,235,0.25)]'
                    : modoDescanso
                      ? 'border border-slate-700 bg-[#1c2433] text-slate-400 hover:text-white'
                      : 'border border-[#2563EB]/20 bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {productosFiltrados.length === 0 ? (
        <div
          className={`mx-auto max-w-md rounded-[28px] border p-8 text-center ${
            modoDescanso ? 'border-slate-700 bg-[#18202e]' : 'industrial-card'
          }`}
        >
          <AlertCircle className="mx-auto mb-3 h-10 w-10 text-[#FACC15]" />
          <h3 className="mb-1 text-base font-bold text-white">Sin resultados</h3>
          <p className="mb-4 text-xs text-slate-400">
            No se encontraron opciones ajustadas a los filtros actuales.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="cursor-pointer rounded-full bg-[#2563EB] px-5 py-1.5 text-xs font-bold text-white transition-all hover:bg-[#1d4ed8]"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between md:hidden">
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Desliza</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Ver productos anteriores"
                onClick={() => scrollCarousel('prev')}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#0b1220]/90 text-slate-200 shadow-[0_8px_18px_rgba(0,0,0,0.26)] transition-all duration-300 ease-out hover:border-[#FACC15]/40 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Ver más productos"
                onClick={() => scrollCarousel('next')}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#0b1220]/90 text-slate-200 shadow-[0_8px_18px_rgba(0,0,0,0.26)] transition-all duration-300 ease-out hover:border-[#FACC15]/40 hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mx-auto w-full md:hidden">
            <div
              ref={carouselRef}
              className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-2 pl-1 pr-1 scrollbar-none"
            >
              {productosFiltrados.map((producto, index) => (
                <div
                  key={producto.id}
                  className="h-full shrink-0 snap-start"
                  style={{ width: 'min(68vw, 270px)' }}
                >
                  <ProductCard
                    producto={producto}
                    esFav={favoritos.includes(producto.id)}
                    toggleFavorito={toggleFavorito}
                    onSelect={onSelectProducto}
                    modoDescanso={modoDescanso}
                    cardTone={index % 2 === 0 ? 'blue' : 'gold'}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:grid md:grid-cols-2 md:items-stretch md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {productosFiltrados.map((producto, index) => (
              <div key={producto.id} className="h-full">
                <ProductCard
                  producto={producto}
                  esFav={favoritos.includes(producto.id)}
                  toggleFavorito={toggleFavorito}
                  onSelect={onSelectProducto}
                  modoDescanso={modoDescanso}
                  cardTone={index % 2 === 0 ? 'blue' : 'gold'}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
