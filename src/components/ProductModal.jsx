import { useEffect, useMemo, useState } from 'react';
import {
  X,
  Calculator,
  ExternalLink,
  User,
  Lock,
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  ArrowLeft,
} from 'lucide-react';
import { sanitizeUrl, buildWhatsAppLink } from '../utils/security';
import ProductImage from './ProductImage';

export default function ProductModal({ productoModal, onClose, modoDescanso }) {
  const [paqueteIdx, setPaqueteIdx] = useState(0);
  const [precioVentaFicha, setPrecioVentaFicha] = useState(1);
  const [copiado, setCopiado] = useState(null);

  useEffect(() => {
    if (!productoModal) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let closedByPopState = false;

    // Push history state so mobile hardware/gesture back button closes modal instead of exiting page
    window.history.pushState({ modalOpen: true }, '');

    const handlePopState = () => {
      closedByPopState = true;
      onClose();
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', onKeyDown);

      // Clean up history entry if closed programmatically (X button, backdrop click, Escape key, or bottom button)
      if (!closedByPopState && window.history.state?.modalOpen) {
        window.history.back();
      }
    };
  }, [productoModal, onClose]);

  const paquetesActuales = useMemo(() => productoModal?.paquetes || [], [productoModal]);
  const paqueteSel = useMemo(
    () => (productoModal ? paquetesActuales[paqueteIdx] || paquetesActuales[0] : undefined),
    [paqueteIdx, paquetesActuales, productoModal],
  );

  if (!productoModal) return null;

  const precioValido = typeof precioVentaFicha === 'number' && !isNaN(precioVentaFicha) && precioVentaFicha >= 0 ? precioVentaFicha : 0;
  const ingresoEstimado = paqueteSel ? paqueteSel.fichas * precioValido : 0;
  const gananciaNeta = paqueteSel ? ingresoEstimado - paqueteSel.inversion : 0;
  const roi = paqueteSel && paqueteSel.inversion > 0 ? ((gananciaNeta / paqueteSel.inversion) * 100).toFixed(0) : 0;

  const obtenerLinkWhatsApp = () => {
    if (!productoModal) return buildWhatsAppLink('5493815891843');

    if (paqueteSel) {
      const texto = `Hola, me interesa comprar el paquete de $${paqueteSel.inversion.toLocaleString('es-AR')} por ${paqueteSel.fichas.toLocaleString('es-AR')} fichas en ${productoModal.nombre}. (Ganancia estimada: $${gananciaNeta.toLocaleString('es-AR')})`;
      return buildWhatsAppLink('5493815891843', texto);
    }

    return buildWhatsAppLink('5493815891843', `Hola, quisiera consultar sobre ${productoModal.nombre}.`);
  };

  const copiarAlPortapapeles = async (texto, tipo) => {
    const cleanText = sanitizeUrl(texto, '');
    if (!cleanText) return;

    try {
      await navigator.clipboard.writeText(cleanText);
      setCopiado(tipo);
      window.setTimeout(() => setCopiado(null), 2000);
    } catch (error) {
      console.error('No se pudo copiar al portapapeles:', error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={productoModal.nombre}
        onClick={(event) => event.stopPropagation()}
        className={`relative flex flex-col w-[min(100%,680px)] max-h-[90vh] overflow-hidden rounded-[28px] border shadow-[0_25px_60px_-20px_rgba(37,99,235,0.7)] animate-scale-up ${
          modoDescanso
            ? 'border-[#2563EB]/30 bg-[#101827] text-slate-200'
            : 'border-[#2563EB]/30 bg-[#090d16] text-white'
        }`}
      >
        {/* Sticky Header Bar for Mobile and Desktop navigation */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#0d1424]/95 px-4 py-3 backdrop-blur-md sm:px-6 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-200 transition-all hover:bg-white/10 hover:text-white cursor-pointer active:scale-95"
            aria-label="Volver al catálogo"
          >
            <ArrowLeft className="h-4 w-4 text-[#FACC15]" />
            <span>Volver</span>
          </button>

          <span className="text-xs font-black uppercase tracking-wider text-slate-200 truncate max-w-[160px] sm:max-w-xs">
            {productoModal.nombre}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center rounded-full border border-white/15 bg-white/5 p-2 text-slate-300 transition-all hover:bg-white/10 hover:text-white cursor-pointer active:scale-95"
            aria-label="Cerrar modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable content container */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-none">
          <div className="relative">
            <ProductImage
              src={productoModal.imagen}
              alt={productoModal.nombre}
              className="h-32 w-full sm:h-44"
            />
            <span className="absolute bottom-3 left-3 z-20 rounded-full bg-[#2563EB] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
              {productoModal.badge}
            </span>
          </div>

          <div>
            <h3 className="mb-1 min-w-0 wrap-break-word text-2xl font-black leading-tight text-white">{productoModal.nombre}</h3>
            <p className="mb-2 min-w-0 wrap-break-word text-xs font-bold text-[#FACC15]">
              {productoModal.subtitulo}
            </p>
            <p className="min-w-0 wrap-break-word text-xs leading-relaxed text-slate-300">{productoModal.desc}</p>
          </div>

          {paquetesActuales.length > 0 ? (
            <div className={`rounded-2xl border p-4 transition-all ${
              modoDescanso ? 'border-[#2563EB]/20 bg-[#101827]' : 'border-[#2563EB]/20 bg-[#101827]'
            }`}>
              <div className="mb-3 flex min-w-0 items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-200">
                  <Calculator className="h-4 w-4 shrink-0 text-[#FACC15]" />
                  <span className="wrap-break-word">Consultar Inversión y Ganancia</span>
                </span>
                <span className="rounded border border-[#FACC15]/20 bg-[#FACC15]/10 px-2 py-0.5 text-[10px] font-bold text-[#FACC15]">
                  ROI: +{roi}%
                </span>
              </div>

              <div className="mb-3 min-w-0">
                <label className="mb-1 block text-[11px] font-semibold text-slate-400">
                  LISTA MAYORISTA:
                </label>
                <select
                  value={paqueteIdx}
                  onChange={(event) => setPaqueteIdx(Number(event.target.value))}
                  className="w-full cursor-pointer rounded-xl border border-[#2563EB]/25 bg-[#0f172a] p-2.5 text-xs font-bold text-white focus:outline-none"
                >
                  {paquetesActuales.map((pkg, idx) => (
                    <option key={idx} value={idx} className="bg-[#12161f] text-white">
                      ${pkg.inversion.toLocaleString('es-AR')} ➔ {pkg.fichas.toLocaleString('es-AR')} Fichas
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3 flex min-w-0 items-center justify-between gap-2 border-b border-white/5 pb-2.5 text-xs">
                <span className="min-w-0 wrap-break-word text-slate-400">Precio reventa por ficha:</span>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">$</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={precioVentaFicha}
                    onChange={(event) => {
                      const raw = event.target.value;
                      if (raw === '') {
                        setPrecioVentaFicha('');
                      } else {
                        const parsed = parseFloat(raw);
                        setPrecioVentaFicha(isNaN(parsed) ? 0 : parsed);
                      }
                    }}
                    className="w-16 rounded-lg border border-[#2563EB]/25 bg-[#0f172a] px-2 py-1 text-right text-xs font-bold text-white focus:outline-none"
                  />
                </div>
              </div>

              {paqueteSel && (
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="rounded-xl border border-white/5 bg-white/5 p-2">
                    <span className="block text-[9px] font-semibold uppercase text-slate-400">INVERTÍS</span>
                    <span className="wrap-break-word text-xs font-black text-white">${paqueteSel.inversion.toLocaleString('es-AR')}</span>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/5 p-2">
                    <span className="block text-[9px] font-semibold uppercase text-slate-400">FICHAS</span>
                    <span className="wrap-break-word text-xs font-black text-white">
                      {paqueteSel.fichas.toLocaleString('es-AR')}
                    </span>
                  </div>

                  <div className="rounded-xl border border-[#FACC15]/20 bg-[#FACC15]/10 p-2">
                    <span className="block text-[9px] font-semibold uppercase text-[#FACC15]">Ganancia</span>
                    <span className="wrap-break-word text-xs font-black text-[#FACC15]">${gananciaNeta.toLocaleString('es-AR')}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={`p-4 rounded-2xl border transition-all ${
              modoDescanso ? 'bg-[#101827] border-[#2563EB]/20' : 'bg-[#101827] border-[#2563EB]/20'
            }`}>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5 mb-2">
                <Calculator className="w-4 h-4 text-[#FACC15]" />
                Cotización Personalizada
              </span>
              <p className="text-xs text-slate-300">
                Este paquete requiere parametrización según el volumen solicitado. Consultá directamente con nuestro equipo comercial para obtener un presupuesto a medida.
              </p>
            </div>
          )}

          <div className={`rounded-2xl border p-4 ${
            modoDescanso ? 'border-[#2563EB]/20 bg-[#101827]' : 'border-[#2563EB]/20 bg-[#101827]'
          }`}>
            <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white">
              <ExternalLink className="h-3.5 w-3.5 text-[#2563EB]" />
              LINKS DE ACCESO:
            </h4>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {productoModal.linkUsuario && (
                <div className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-[#2563EB]/15 bg-[#0f172a] p-2.5 text-xs">
                  <a
                    href={sanitizeUrl(productoModal.linkUsuario)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mr-2 flex min-w-0 flex-1 items-center gap-2 overflow-hidden font-bold text-slate-200 hover:text-white"
                  >
                    <User className="h-3.5 w-3.5 shrink-0 text-[#2563EB]" />
                    <span className="min-w-0 truncate">Web Jugadores</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => copiarAlPortapapeles(productoModal.linkUsuario, 'user')}
                    className="shrink-0 rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                    title="Copiar Enlace"
                    aria-label="Copiar enlace de usuarios"
                  >
                    {copiado === 'user' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              )}

              {productoModal.linkAdmin && (
                <div className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-[#2563EB]/15 bg-[#0f172a] p-2.5 text-xs">
                  <a
                    href={sanitizeUrl(productoModal.linkAdmin)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mr-2 flex min-w-0 flex-1 items-center gap-2 overflow-hidden font-bold text-slate-200 hover:text-white"
                  >
                    <Lock className="h-3.5 w-3.5 shrink-0 text-[#2563EB]" />
                    <span className="min-w-0 truncate">Panel Admin</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => copiarAlPortapapeles(productoModal.linkAdmin, 'admin')}
                    className="shrink-0 rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                    title="Copiar Enlace"
                    aria-label="Copiar enlace de administración"
                  >
                    {copiado === 'admin' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {productoModal.detalles && (
            <div className="w-full min-w-0">
              <h4 className="mb-2.5 text-xs font-bold text-white">SERVICIOS EXCLUSIVOS:</h4>
              <ul className="space-y-1.5">
                {productoModal.detalles.map((detalle, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FACC15]" />
                    <span className="min-w-0 wrap-break-word leading-relaxed">{detalle}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2 space-y-2.5">
            <a
              href={obtenerLinkWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] px-5 py-3 text-xs font-black text-white shadow-[0_0_18px_rgba(37,99,235,0.25)] transition-all hover:bg-[#1d4ed8] active:scale-[0.985]"
            >
              <MessageCircle className="h-4 w-4 shrink-0 fill-current" />
              <span className="min-w-0 wrap-break-word">Solicitar por WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-bold text-slate-300 transition-all hover:bg-white/10 hover:text-white active:scale-[0.985] cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Volver al menú principal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
