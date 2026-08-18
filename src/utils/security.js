/**
 * Módulo de utilidades de seguridad para la aplicación Frontend.
 * Proporciona funciones de sanitización contra inyecciones XSS y validación de esquemas URI.
 */

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
    console.warn(`[Security Alert] Esquema URI no seguro bloqueado: ${normalizedUrl.slice(0, 30)}...`);
    return fallback;
  }

  // Permitir protocolos seguros estándar
  const isAllowedScheme = /^(https?:|mailto:|tel:|\/|#)/i.test(normalizedUrl);
  if (!isAllowedScheme) {
    console.warn(`[Security Alert] Enlace rechazado por protocolo no permitido: ${normalizedUrl.slice(0, 30)}...`);
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
