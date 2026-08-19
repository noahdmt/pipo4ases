/**
 * Módulo de utilidades de seguridad para la aplicación Frontend.
 * Proporciona funciones de sanitización contra inyecciones XSS, neutralización de SQLi en búsquedas,
 * escape HTML y validación de esquemas y orígenes URI.
 */

/**
 * Escapa caracteres HTML especiales para prevenir inyecciones XSS en renderizados dinámicos.
 * @param {string} str - Cadena de texto a escapar.
 * @returns {string} - Texto con caracteres HTML escapados.
 */
export function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitiza y neutraliza patrones sospechosos de inyección SQL (SQLi) e inyecciones de comandos en búsquedas.
 * @param {string} query - Término de búsqueda ingresado por el usuario.
 * @returns {string} - Término de búsqueda limpio y seguro.
 */
export function sanitizeSearchQuery(query) {
  if (typeof query !== 'string') return '';
  
  // 1. Eliminar caracteres de control ASCII
  // eslint-disable-next-line no-control-regex
  let clean = query.replace(/[\x00-\x1F\x7F]/g, '');

  // 2. Neutralizar comentarios SQL y metacaracteres peligrosos (--; /* */; ' OR '1'='1)
  clean = clean.replace(/(--|\/\*|\*\/|;|'|"|\\)/g, '');

  // 3. Recortar espacios y limitar la longitud a un máximo razonable (100 caracteres)
  return clean.trim().slice(0, 100);
}

/**
 * Sanitiza y valida una URL para evitar ataques XSS por esquemas maliciosos (ej. javascript:, data:, vbscript:).
 * @param {string} url - La URL a sanitizar.
 * @param {string} fallback - La URL de respaldo en caso de invalidez (por defecto '#').
 * @returns {string} - URL segura sanitizada.
 */
export function sanitizeUrl(url, fallback = '#') {
  if (!url || typeof url !== 'string') {
    return fallback;
  }

  const trimmedUrl = url.trim();
  // eslint-disable-next-line no-control-regex
  const normalizedUrl = trimmedUrl.replace(/[\x00-\x1F\x7F]/g, '');

  if (!normalizedUrl) {
    return fallback;
  }

  // Bloquear esquemas peligrosos conocidos (case-insensitive)
  const isDangerousScheme = /^(javascript|data|vbscript|file):/i.test(normalizedUrl);
  if (isDangerousScheme) {
    if (import.meta.env?.DEV) {
      console.warn(`[Security Alert] Esquema URI no seguro bloqueado: ${normalizedUrl.slice(0, 30)}...`);
    }
    return fallback;
  }

  // Permitir protocolos seguros estándar
  const isAllowedScheme = /^(https?:|mailto:|tel:|\/|#)/i.test(normalizedUrl);
  if (!isAllowedScheme) {
    if (import.meta.env?.DEV) {
      console.warn(`[Security Alert] Enlace rechazado por protocolo no permitido: ${normalizedUrl.slice(0, 30)}...`);
    }
    return fallback;
  }

  return normalizedUrl;
}

/**
 * Sanitiza una cadena de texto eliminando caracteres de control no imprimibles.
 * @param {string} input - El texto a sanitizar.
 * @returns {string} - Texto limpio.
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return '';
  }
  // eslint-disable-next-line no-control-regex
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
}

/**
 * Genera un enlace de WhatsApp codificado de manera segura.
 * @param {string} phone - Número de teléfono en formato internacional.
 * @param {string} message - Mensaje a enviar.
 * @returns {string} - URL de WhatsApp sanitizada.
 */
export function buildWhatsAppLink(phone, message = '') {
  const cleanPhone = String(phone).replace(/[^\d]/g, '').slice(0, 15);
  if (!cleanPhone) return '#';

  const baseUrl = `https://wa.me/${cleanPhone}`;
  if (!message) return baseUrl;

  const encodedMessage = encodeURIComponent(sanitizeInput(message));
  return sanitizeUrl(`${baseUrl}?text=${encodedMessage}`);
}

/**
 * Verifica si un origen URL dado cumple con la política CORS y lista blanca de dominios permitidos.
 * @param {string} origin - El origen a validar (ej. https://wa.me).
 * @param {string[]} allowedOrigins - Lista de dominios/orígenes autorizados.
 * @returns {boolean} - true si el origen es válido.
 */
export function isAllowedOrigin(origin, allowedOrigins = ['wa.me', 'whatsapp.com', 'fonts.googleapis.com']) {
  if (!origin || typeof origin !== 'string') return false;

  try {
    const parsed = new URL(origin.startsWith('http') ? origin : `https://${origin}`);
    return allowedOrigins.some((domain) => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}
