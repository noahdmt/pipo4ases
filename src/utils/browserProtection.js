/**
 * Módulo de disuasión y protección en el navegador.
 * Deshabilita el menú contextual (click derecho), intercepta atajos de DevTools y previene
 * el arrastre de imágenes u otros recursos gráficos.
 */

/**
 * Inicializa los listeners globales de protección en el objeto window y document.
 * Debe ser ejecutado al arrancar la aplicación.
 */
export function initBrowserProtection() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  // 1. Bloquear el menú contextual (click derecho)
  document.addEventListener('contextmenu', (event) => {
    // Permitir click derecho solo si se trata de un elemento editable explícito (si aplica)
    const isInput = ['INPUT', 'TEXTAREA'].includes(event.target.tagName) || event.target.isContentEditable;
    if (!isInput) {
      event.preventDefault();
      return false;
    }
  });

  // 2. Bloquear atajos de teclado para herramientas de desarrollo y guardado de página
  document.addEventListener('keydown', (event) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const metaOrCtrl = isMac ? event.metaKey : event.ctrlKey;
    const key = event.key.toUpperCase();
    const code = event.code;

    // F12 key
    if (key === 'F12' || code === 'F12') {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }

    // Ctrl+Shift+I / Cmd+Opt+I (Inspector)
    // Ctrl+Shift+J / Cmd+Opt+J (Consola)
    // Ctrl+Shift+C / Cmd+Opt+C (Inspector de elementos)
    // Ctrl+U / Cmd+Opt+U (Ver código fuente)
    // Ctrl+S / Cmd+S (Guardar página)
    if (metaOrCtrl) {
      if (
        (event.shiftKey && ['I', 'J', 'C'].includes(key)) ||
        (isMac && event.altKey && ['I', 'J', 'C', 'U'].includes(key)) ||
        key === 'U' ||
        key === 'S'
      ) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }
  }, true);

  // 3. Bloquear el arrastre de imágenes y elementos gráficos
  document.addEventListener('dragstart', (event) => {
    if (event.target.tagName === 'IMG' || event.target.tagName === 'SVG') {
      event.preventDefault();
      return false;
    }
  });
}
