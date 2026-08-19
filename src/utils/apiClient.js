/**
 * Cliente HTTP unificado y resiliente para la comunicación con APIs externas.
 * Incorpora timeout automático, manejo seguro de errores de red, sanitización de respuestas
 * y purgado automático de datos privados/sensibles antes de exponerlos a la interfaz.
 */

const DEFAULT_TIMEOUT_MS = 10000; // 10 segundos

// Campos sensibles que deben ser despojados automáticamente de las respuestas de API
const BLOCKED_RESPONSE_FIELDS = new Set([
  'password',
  'password_hash',
  'passwd',
  'secret',
  'private_key',
  'token_secret',
  'internal_id',
  'db_id',
  'ssn',
  'credit_card',
  'role_permissions',
  'admin_notes',
  'auth_token'
]);

/**
 * Filtra recursivamente objetos y arreglos devueltos por la API para despojar campos sensibles.
 * @param {any} payload - El payload de la respuesta.
 * @returns {any} - Payload sanitizado y despojado de datos privados.
 */
export function sanitizeApiResponseData(payload) {
  if (payload === null || typeof payload !== 'object') {
    return payload;
  }

  if (Array.isArray(payload)) {
    return payload.map((item) => sanitizeApiResponseData(item));
  }

  const cleanObject = {};
  for (const [key, value] of Object.entries(payload)) {
    if (BLOCKED_RESPONSE_FIELDS.has(key.toLowerCase())) {
      continue; // Despojar campo privado no autorizado
    }
    cleanObject[key] = sanitizeApiResponseData(value);
  }

  return cleanObject;
}

export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Petición fetch envuelta con manejo seguro de excepciones, timeout, aborts y sanitización.
 * @param {string} endpoint - URL o endpoint de destino.
 * @param {RequestInit & { timeout?: number }} options - Opciones de la petición fetch.
 * @returns {Promise<{ data: any, ok: boolean, status: number, error: string | null }>}
 */
export async function secureFetch(endpoint, options = {}) {
  const { timeout = DEFAULT_TIMEOUT_MS, headers = {}, ...customConfig } = options;

  // AbortController para cancelar la petición si excede el tiempo límite (resiliencia)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...headers,
  };

  const config = {
    method: 'GET',
    ...customConfig,
    headers: defaultHeaders,
    signal: controller.signal,
  };

  try {
    const response = await fetch(endpoint, config);
    clearTimeout(timeoutId);

    let parsedData = null;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      try {
        const rawJson = await response.json();
        // Sanitizar payload para eliminar IDs internos, roles no autorizados o datos privados
        parsedData = sanitizeApiResponseData(rawJson);
      } catch {
        parsedData = null;
      }
    } else {
      parsedData = await response.text();
    }

    if (!response.ok) {
      const errorMessage = (parsedData && parsedData.message) 
        ? parsedData.message 
        : `Error en la solicitud HTTP (${response.status}): ${response.statusText}`;

      return {
        data: null,
        ok: false,
        status: response.status,
        error: errorMessage,
      };
    }

    return {
      data: parsedData,
      ok: true,
      status: response.status,
      error: null,
    };
  } catch (err) {
    clearTimeout(timeoutId);

    let errorMsg = 'Error desconocido al conectar con el servidor.';

    if (err.name === 'AbortError') {
      errorMsg = `La petición superó el tiempo máximo de espera (${timeout / 1000}s).`;
    } else if (typeof navigator !== 'undefined' && !navigator.onLine) {
      errorMsg = 'No hay conexión a internet disponible.';
    } else if (err.message) {
      errorMsg = err.message;
    }

    return {
      data: null,
      ok: false,
      status: 0,
      error: errorMsg,
    };
  }
}
