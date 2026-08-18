import { useState } from 'react';
import { Loader2, ImageOff } from 'lucide-react';

export default function ProductImage({ src, alt, className = '', isGoldTone = false }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const showPlaceholder = !src || error;

  return (
    <div
      className={`relative overflow-hidden rounded-[18px] border bg-[#07111d] shadow-inner ${
        isGoldTone ? 'border-[#FACC15]/25 shadow-[#FACC15]/10' : 'border-[#2563EB]/20 shadow-[#2563EB]/10'
      } ${className}`}
    >
      {showPlaceholder ? (
        <div className="flex h-full w-full flex-col items-center justify-center bg-linear-to-br from-[#0d1728] via-[#09101d] to-[#050b16] p-2 text-center select-none">
          <div className="mb-1 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#FACC15]">
            <ImageOff className="h-3.5 w-3.5" />
          </div>
          <span className="text-[8.5px] font-black uppercase tracking-[0.12em] text-slate-200">
            IMAGEN NO DISPONIBLE
          </span>
          <span className="mt-0.5 text-[7.5px] font-bold uppercase tracking-widest text-slate-400">
            por el momento
          </span>
        </div>
      ) : (
        <>
          {!loaded && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#07111d] text-center select-none">
              <Loader2 className="h-5 w-5 animate-spin text-[#FACC15] mb-1" />
              <span className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
                Cargando...
              </span>
            </div>
          )}
          <img
            src={src}
            alt={alt}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            className={`h-full w-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.04] ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#050b16] via-transparent to-[#11213d]/10 pointer-events-none" />
        </>
      )}
    </div>
  );
}
