/**
 * Auditoría de variables de entorno (DevSecOps).
 * Verifica en tiempo de ejecución / compilación que ninguna variable pública con prefijo VITE_
 * contenga secretos, llaves privadas, tokens JWT o cadenas de conexión a bases de datos.
 */

// Patrones regex conocidos de llaves y secretos sensibles
const SENSITIVE_PATTERNS = [
  /-----BEGIN (RSA|EC|DSA|OPENSSH|PRIVATE) KEY-----/i,
  /sk_live_[0-9a-zA-Z]{24,}/,
  /aws_secret_access_key/i,
  /postgres:\/\//i,
  /mongodb(\+srv)?:\/\//i,
  /mysql:\/\//i,
  /redis:\/\//i,
  /secret/i,
  /private_key/i,
  /bearer\s+[a-zA-Z0-9_~+/.-]+=*/i
];

/**
 * Audita las variables de entorno de Vite (import.meta.env).
 * Si detecta un patrón sospechoso en desarrollo o producción, emite una advertencia de seguridad.
 * @returns {{ isClean: boolean, warnings: string[] }}
 */
export function auditEnvironmentVars() {
  const warnings = [];
  const envObj = import.meta.env || {};

  Object.entries(envObj).forEach(([key, value]) => {
    if (typeof value !== 'string') return;

    // Solo inspeccionamos variables personalizadas (VITE_*)
    if (key.startsWith('VITE_')) {
      // Validar si la clave sugiere un secreto
      if (/(SECRET|PRIVATE|PASSWORD|DB_PASS|TOKEN_KEY)/i.test(key)) {
        warnings.push(`[Security Risk] La variable pública '${key}' sugiere contener información confidencial.`);
      }

      // Validar si el valor coincide con un patrón sensible conocido
      SENSITIVE_PATTERNS.forEach((pattern) => {
        if (pattern.test(value)) {
          warnings.push(`[Security Risk] El valor de '${key}' coincide con un patrón de secreto privado.`);
        }
      });
    }
  });

  if (warnings.length > 0 && import.meta.env?.DEV) {
    // Solo visible en desarrollo
    warnings.forEach((w) => console.warn(w));
  }

  return {
    isClean: warnings.length === 0,
    warnings,
  };
}
