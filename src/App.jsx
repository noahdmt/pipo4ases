import { useMemo, useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCatalog from './components/ProductCatalog';
import ProductModal from './components/ProductModal';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';
import { productos } from './data/products';

export default function App() {
  const [categoriaActiva, setCategoriaActiva] = useState('todas');
  const [etiquetaSeleccionada, setEtiquetaSeleccionada] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [productoModal, setProductoModal] = useState(null);
  
  const [modoDescanso, setModoDescanso] = useState(() => {
    try {
      return localStorage.getItem('pipo_modo_descanso') === 'true';
    } catch {
      return false;
    }
  });

  const [favoritos, setFavoritos] = useState(() => {
    try {
      const saved = localStorage.getItem('pipo_favoritos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [soloFavoritos, setSoloFavoritos] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('pipo_modo_descanso', String(modoDescanso));
    } catch (e) {
      console.warn('No se pudo guardar el modo descanso en localStorage', e);
    }
  }, [modoDescanso]);

  useEffect(() => {
    try {
      localStorage.setItem('pipo_favoritos', JSON.stringify(favoritos));
    } catch (e) {
      console.warn('No se pudo guardar favoritos en localStorage', e);
    }
  }, [favoritos]);

  const toggleFavorito = (id, event) => {
    event?.stopPropagation?.();
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id],
    );
  };

  const resetFiltros = () => {
    setCategoriaActiva('todas');
    setBusqueda('');
    setEtiquetaSeleccionada('Todos');
    setSoloFavoritos(false);
  };

  const productosFiltrados = useMemo(() => {
    const textoBusqueda = busqueda.trim().toLowerCase();

    return productos.filter((producto) => {
      const coincideCategoria =
        categoriaActiva === 'todas'
          ? true
          : producto.categoria === categoriaActiva;
      const coincideEtiqueta =
        etiquetaSeleccionada === 'Todos' ||
        producto.badge.toLowerCase() === etiquetaSeleccionada.toLowerCase();
      const coincideBusqueda =
        !textoBusqueda ||
        [producto.nombre, producto.subtitulo, producto.desc]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(textoBusqueda);
      const coincideFavoritos = !soloFavoritos || favoritos.includes(producto.id);

      return coincideCategoria && coincideEtiqueta && coincideBusqueda && coincideFavoritos;
    });
  }, [categoriaActiva, etiquetaSeleccionada, busqueda, favoritos, soloFavoritos]);

  const handleCloseModal = useMemo(() => () => setProductoModal(null), []);

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-300 relative overflow-x-hidden flex flex-col justify-between ${
        modoDescanso ? 'bg-[#0d1728] text-slate-200' : 'bg-[#050b16] text-white'
      }`}
    >
      <Navbar
        categoriaActiva={categoriaActiva}
        setCategoriaActiva={setCategoriaActiva}
        modoDescanso={modoDescanso}
        setModoDescanso={setModoDescanso}
        favoritosCount={favoritos.length}
        soloFavoritos={soloFavoritos}
        setSoloFavoritos={setSoloFavoritos}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-10 relative z-10 w-full flex-1">
        <Hero busqueda={busqueda} setBusqueda={setBusqueda} modoDescanso={modoDescanso} />

        <ProductCatalog
          productosFiltrados={productosFiltrados}
          favoritos={favoritos}
          toggleFavorito={toggleFavorito}
          onSelectProducto={setProductoModal}
          etiquetaSeleccionada={etiquetaSeleccionada}
          setEtiquetaSeleccionada={setEtiquetaSeleccionada}
          soloFavoritos={soloFavoritos}
          setSoloFavoritos={setSoloFavoritos}
          onResetFilters={resetFiltros}
          modoDescanso={modoDescanso}
        />

        <ProductModal
          productoModal={productoModal}
          onClose={handleCloseModal}
          modoDescanso={modoDescanso}
        />

        <WhatsAppButton />
      </main>

      <Footer modoDescanso={modoDescanso} />
    </div>
  );
}