
export default function Footer({ modoDescanso }) {
  return (
    <footer className={`max-w-7xl mx-auto px-6 py-4 border-t text-center text-xs font-light relative z-10 w-full ${
      modoDescanso ? 'border-slate-800 text-slate-500' : 'border-white/5 text-slate-500'
    }`}>
      © {new Date().getFullYear()} Pipo 4 Ases Distribuidor Mayorista. Todos los derechos reservados 2026.
    </footer>
  );
}
