# ♠️ PIPO 4 ASES - Distribuidor Mayorista

Bienvenido a la documentación técnica oficial de **PIPO 4 ASES**. Este documento ha sido diseñado como una guía completa y detallada para desarrolladores que necesiten mantener, modificar o extender esta plataforma en el futuro.

---

## 📋 Tabla de Contenidos
1. [Visión General del Proyecto](#-visión-general-del-proyecto)
2. [Stack Tecnológico](#-stack-tecnológico)
3. [Estructura del Proyecto](#-estructura-del-proyecto)
4. [Gestión Centralizada de Links de Plataformas (`platformLinks.js`)](#-gestión-centralizada-de-links-de-plataformas-platformlinksjs)
5. [Gestión del Catálogo y Productos (`products.js`)](#-gestión-del-catálogo-y-productos-productsjs)
6. [Componentes del Sistema (Detalle y Modificación)](#-componentes-del-sistema-detalle-y-modificación)
7. [Módulo de Seguridad (`security.js`)](#-módulo-de-seguridad-securityjs)
8. [Modo Descanso y Favoritos (Estado Global)](#-modo-descanso-y-favoritos-estado-global)
9. [Imágenes, Favicon y Vistas Previas en WhatsApp](#-imágenes-favicon-y-vistas-previas-en-whatsapp)
10. [Despliegue en Vercel mediante Git](#-despliegue-en-vercel-mediante-git)

---

## 🌟 Visión General del Proyecto

La aplicación es una **Landing Page & Catálogo Interactivo de Alto Rendimiento** orientada a la venta mayorista de fichas de casino y gestión de plataformas digitales.

### Características Clave:
- **Catálogo Dinámico Responsivo**: Vista en Grid para Desktop y Carrusel táctil snap con navegación en Mobile.
- **Calculadora de Ganancias e Inversión**: Modal interactivo que calcula en tiempo real el ingreso estimado, ganancia neta y porcentaje de ROI (+%) según el precio de reventa introducido por el cliente.
- **Centralización de Dominios**: Sistema en un solo lugar para actualizar URLs de usuarios y administradores cuando los casinos cambian de dominio.
- **Modo Descanso Visual / Alto Contraste**: Selector de tema con persistencia automática en `localStorage`.
- **Favoritos**: Guardado de plataformas de interés en el almacenamiento local del cliente.
- **Sanitización XSS y Seguridad**: Protección en la construcción de enlaces salientes y mensajes de WhatsApp.

---

## 🛠️ Stack Tecnológico

- **Core**: React 18+ (Hooks: `useState`, `useEffect`, `useMemo`, `useRef`, `useCallback`)
- **Bundler / Build Tool**: Vite 8+
- **Estilos**: Tailwind CSS v4 (Sintaxis nativa y utilidades modernas)
- **Iconografía**: Lucide React
- **Alojamiento & CI/CD**: Vercel conectado a repositorio GitHub (`main`)

---

## 📁 Estructura del Proyecto

```text
landing-casino/
├── public/
│   ├── favicon.png         # Icono PNG optimizado para pestaña (300x300)
│   ├── favicon.webp        # Icono WebP alternativo
│   ├── og-image.jpg        # Imagen JPEG optimizada (<100KB) para vistas previas en WhatsApp
│   ├── pipo4ases.webp      # Emblem oficial
│   └── _headers            # Reglas de caché y headers de seguridad para el servidor
├── src/
│   ├── assets/             # Imágenes WebP de cada plataforma (ej. argenbet.webp, konabet.webp)
│   ├── components/         # Componentes modulares UI
│   │   ├── ErrorBoundary.jsx  # Capturador global de errores en React
│   │   ├── Footer.jsx         # Pie de página responsivo
│   │   ├── Hero.jsx           # Encabezado principal y buscador
│   │   ├── Navbar.jsx         # Barra de navegación superior sticky
│   │   ├── ProductCard.jsx    # Tarjeta individual de producto/plataforma
│   │   ├── ProductCatalog.jsx # Contenedor principal de catálogo (Grid / Carrusel)
│   │   ├── ProductImage.jsx   # Carga progresiva con loader y placeholder
│   │   ├── ProductModal.jsx   # Ventana emergente con calculadora y enlaces
│   │   └── WhatsAppButton.jsx # Botón flotante inferior de contacto
│   ├── data/
│   │   ├── platformLinks.js  # CENTRALIZACIÓN: Único lugar para editar URLs de plataformas
│   │   └── products.js       # Lista de productos, combos y resolución de imágenes
│   ├── utils/
│   │   └── security.js       # Sanitización XSS y generador seguro de enlaces WhatsApp
│   ├── App.jsx               # Componente raíz y orquestador de estado global
│   ├── index.css             # Configuración de Tailwind y variables CSS de marca
│   └── main.jsx              # Punto de entrada principal de React DOM
├── index.html                # Plantilla HTML5 con meta etiquetas Open Graph
├── package.json              # Dependencias y scripts del proyecto
├── vercel.json               # Configuración de ruteo y cabeceras Vercel
└── vite.config.js            # Configuración de Vite
```

---

## ⚡ Gestión Centralizada de Links de Plataformas (`platformLinks.js`)

**Ubicación**: [src/data/platformLinks.js](file:///c:/Users/Usuario/Desktop/Otra%20landing/landing-casino/src/data/platformLinks.js)

### ¿Cómo funciona?
Las URLs de las plataformas de juegos y sus paneles administrativos cambian con frecuencia. Para evitar modificar código en múltiples componentes o tarjetas, **todos los enlaces están definidos en este único archivo**.

### ¿Cómo actualizar una URL en el futuro?
1. Abre [src/data/platformLinks.js](file:///c:/Users/Usuario/Desktop/Otra%20landing/landing-casino/src/data/platformLinks.js).
2. Localiza la plataforma por su ID o Nombre (ejemplo `Konabet` o ID `2`).
3. Modifica `linkUsuario` o `linkAdmin`:

```javascript
  2: {
    nombre: 'Konabet',
    linkUsuario: 'https://www.nuevo-dominio-konabet.ws/', // 👈 Editar enlace de jugador
    linkAdmin: 'https://www.admin.online/',               // 👈 Editar enlace de admin
  },
```

4. Guarda el archivo y realiza `git push`. **¡Listo!** El cambio se aplicará automáticamente en todas las tarjetas y modales del sitio.

---

## 📦 Gestión del Catálogo y Productos (`products.js`)

**Ubicación**: [src/data/products.js](file:///c:/Users/Usuario/Desktop/Otra%20landing/landing-casino/src/data/products.js)

### Estructura de un Producto en `rawProductos`:
```javascript
{
  id: 1,
  categoria: 'plataformas',
  nombre: 'ArgenBet',
  subtitulo: 'Gestión exclusiva 24/7', // Opcional
  badge: 'Popular',                   // Etiquetas: Popular, Destacado, Top Venta, CLASICO, VIP, Oferta
  precioText: 'Desde $30.000',
  esNaranja: true,                    // true = Tonalidad azul/naranja, false = Tonalidad azul/dorada
  paquetes: [
    { inversion: 40000, fichas: 195000 },
    { inversion: 52000, fichas: 260000 },
    { inversion: 104000, fichas: 544000 },
  ]
}
```

### ¿Cómo agregar una nueva plataforma?
1. Sube la imagen WebP de la plataforma a `src/assets/` con el nombre en minúsculas (ej. `miplataforma.webp`).
2. Agrega el nuevo objeto en `rawProductos` en [src/data/products.js](file:///c:/Users/Usuario/Desktop/Otra%20landing/landing-casino/src/data/products.js) asignándole un `id` único.
3. Agrega las URLs de la nueva plataforma en [src/data/platformLinks.js](file:///c:/Users/Usuario/Desktop/Otra%20landing/landing-casino/src/data/platformLinks.js) usando el mismo `id`.
4. El sistema mapeará automáticamente la imagen por coincidencia de nombre (`getImageByProductName`) y resolverá los enlaces.

---

## 🧩 Componentes del Sistema (Detalle y Modificación)

### 1. `App.jsx`
- **Función**: Orquestador principal de la aplicación.
- **Estado Manejado**:
  - `categoriaActiva`: Categoría seleccionada (`'todas'`, `'plataformas'`).
  - `etiquetaSeleccionada`: Filtro de badge (`'Todos'`, `'Popular'`, etc.).
  - `busqueda`: Texto ingresado en el buscador del Hero.
  - `productoModal`: Objeto del producto activo para mostrar el modal emergente (o `null`).
  - `modoDescanso`: Booleano para el tema visual (guardado en `localStorage`).
  - `favoritos`: Array de IDs de productos guardados en `localStorage`.
- **Modificaciones futuras**: Para agregar nuevos filtros globales o integrar un backend, gestiona los estados en este archivo.

### 2. `Navbar.jsx`
- **Función**: Encabezado superior *sticky* con desenfoque de fondo (*glassmorphism*).
- **Elementos**: Emblem oficial `pipo4ases.webp` con animación glow, marca, botones de categorías, conmutador de tema, botón de favoritos guardados y acceso rápido a WhatsApp.
- **Modificaciones futuras**: Para modificar las categorías del menú, edita `menuSidebar` en [products.js](file:///c:/Users/Usuario/Desktop/Otra%20landing/landing-casino/src/data/products.js).

### 3. `Hero.jsx`
- **Función**: Sección principal superior de impacto visual.
- **Elementos**: Icono de la marca `pipo4ases.webp` integrado junto al texto en el título `4 ASES DISTRIBUIDORA DE FICHAS` y campo de búsqueda con botón de limpieza.

### 4. `ProductCatalog.jsx`
- **Función**: Contenedor responsivo del catálogo.
- **Lógica Responsiva**:
  - **Desktop (`md:` en adelante)**: Renderiza una cuadrícula (*Grid*) adaptable de 2 a 4 columnas.
  - **Mobile (`< md`)**: Renderiza un carrusel con ajuste magnético (*snap*) y controles laterales de avance/retroceso por scroll suave.

### 5. `ProductCard.jsx`
- **Función**: Renderiza cada tarjeta individual del catálogo.
- **Estilos**: Soporta tonalidades dinámicas `blue` y `gold` para crear ritmo visual alternado en las tarjetas.
- **Acciones**: Clic en la tarjeta abre el modal; clic en el marcador (*Bookmark*) alterna el producto en la lista de favoritos sin disparar el modal (`event.stopPropagation()`).

### 6. `ProductModal.jsx`
- **Función**: Ventana emergente para consultar paquetes y cotizaciones.
- **Mecanismos clave**:
  - **Calculadora interactiva**: Permite seleccionar un paquete y ajustar el "Precio reventa por ficha" para calcular ganancia estimada e índice ROI.
  - **Estabilidad de Historial**: Utiliza `onCloseRef` (`useRef`) para que el botón "Atrás" de teléfonos móviles y la tecla `Escape` cierren el modal sin recargar la página.
  - **Copia al Portapapeles**: Botones para copiar los enlaces de Web Jugadores y Panel Admin.

### 7. `ProductImage.jsx`
- **Función**: Encargado de la carga eficiente de imágenes.
- **Elementos**: Spinner de carga mientras decodifica la imagen y pantalla de "IMAGEN NO DISPONIBLE" si el archivo no existe en `assets`.

### 8. `WhatsAppButton.jsx`
- **Función**: Botón flotante persistente en la esquina inferior derecha con badge de aviso.
- **Modificación**: Para cambiar el número por defecto o el mensaje inicial, edita la constante `whatsappUrl` en este archivo.

### 9. `ErrorBoundary.jsx`
- **Función**: Atrapa errores no controlados de Javascript para prevenir pantallas blancas y ofrecer un botón de recarga limpia.

---

## 🔒 Módulo de Seguridad (`security.js`)

**Ubicación**: [src/utils/security.js](file:///c:/Users/Usuario/Desktop/Otra%20landing/landing-casino/src/utils/security.js)

### Funciones Exportadas:
1. `sanitizeUrl(url, fallback)`: Previene ataques XSS validando esquemas permitidos (`http`, `https`, `mailto`, `tel`). Bloquea esquemas peligrosos como `javascript:`, `data:` o `file:`.
2. `sanitizeInput(input)`: Remueve caracteres de control no imprimibles.
3. `buildWhatsAppLink(phone, message)`: Sanitiza el número telefónico (dejando sólo dígitos) y codifica el mensaje con `encodeURIComponent`.

---

## 🌓 Modo Descanso y Favoritos (Estado Global)

Los estados de preferencias del usuario se persisten de forma transparente en el navegador:
- `pipo_modo_descanso`: `'true'` | `'false'`
- `pipo_favoritos`: Array JSON con los IDs de las plataformas marcadas (ej. `[1, 3, 14]`).

---

## 🖼️ Imágenes, Favicon y Vistas Previas en WhatsApp

Para garantizar que el enlace se vea profesional al ser compartido por **WhatsApp, Facebook y Telegram**, se han configurado los siguientes archivos en `public/`:

- **Favicon de pestaña**: `public/favicon.png` (300x300 PNG) y `public/pipo4ases.webp`.
- **Vista previa WhatsApp (`og:image`)**: `public/og-image.jpg` (JPEG optimizado de 600x600 px y peso **< 100 KB**).

> ⚠️ **Nota importante**: WhatsApp no admite imágenes en formato `.webp` ni archivos mayores a 300 KB para vistas previas de enlaces (`og:image`). Por ello se debe mantener siempre la versión `og-image.jpg` en la carpeta `public/`.

---

## 🚀 Despliegue en Vercel mediante Git

El proyecto está configurado para desplegarse automáticamente cada vez que se sube un commit a la rama principal `main` en GitHub.

### Comandos para subir actualizaciones:
```bash
# 1. Preparar archivos modificados
git add .

# 2. Registrar el mensaje de cambio
git commit -m "Descripción de la actualización realizada"

# 3. Enviar a GitHub y Vercel
git push origin main
```

---
*Documentación creada para el equipo de desarrollo de PIPO 4 ASES.*
