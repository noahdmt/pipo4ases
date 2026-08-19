# Arquitectura DevSecOps & Guía de Blindaje de Seguridad - PIPO 4 ASES

Este documento detalla las políticas de seguridad, controles de mitigación de infraestructura, auditorías de datos y mecanismos de protección del navegador implementados en la plataforma web **PIPO 4 ASES**.

---

## 1. Protección contra Ataques & Resiliencia Infraestructural

### A. Configuración de Cloudflare WAF & Mitigación DDoS
Para proteger la infraestructura frente a ataques de denegación de servicio (DDoS L3/L4 y L7) y bots maliciosos:
1. **Proxy Inverso Nivel CDN (Cloudflare)**:
   - Activar **Under Attack Mode** en caso de picos inusuales de tráfico.
   - Configurar **WAF Managed Rules**: Habilitar *OWASP Core Ruleset* para bloqueo automático de SQLi, XSS y LFI/RFI.
   - **Bot Management**: Activar *JS Challenge* / *Turnstile* para peticiones sospechosas dirigidas a enlaces de WhatsApp o formularios.
2. **CORS & Dominios Autorizados**:
   - Se restringen las peticiones entrantes únicamente a orígenes autorizados (`https://wa.me`, `https://api.tudominio.com`).

### B. Rate Limiting (Limitación de Tasa por IP)
* **Nginx Level**: En [`nginx.conf`](file:///c:/Users/Usuario/Desktop/Otra%20landing/landing-casino/nginx.conf) se implementan las directivas `limit_req_zone`:
  - `general_limit`: Máximo **30 peticiones/segundo** con ráfaga permitida de 20.
  - `api_limit`: Máximo **10 peticiones/segundo** para endpoints interactivos.
* **Vercel / Cloudflare Level**: Regla de Rate Limiting activa de 100 peticiones por minuto por IP en la capa perimetral.

### C. Cabeceras de Seguridad HTTP Requeridas
Ambas configuraciones de servidor ([`nginx.conf`](file:///c:/Users/Usuario/Desktop/Otra%20landing/landing-casino/nginx.conf) y [`vercel.json`](file:///c:/Users/Usuario/Desktop/Otra%20landing/landing-casino/vercel.json)) inyectan las siguientes cabeceras en cada respuesta:
* **Content-Security-Policy (CSP)**: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https://wa.me https://*.wa.me; object-src 'none'; frame-ancestors 'none';`
* **Strict-Transport-Security (HSTS)**: `max-age=31536000; includeSubDomains; preload`
* **X-Frame-Options**: `DENY` (Previene ataques de Clickjacking).
* **X-Content-Type-Options**: `nosniff` (Previene MIME-type sniffing).
* **Referrer-Policy**: `strict-origin-when-cross-origin`
* **Permissions-Policy**: Deshabilita cámara, micrófono, geolocalización y pagos no autorizados.

### D. Monitoreo de Uptime y Reinicio Automático
* **Health Check Endpoint**: La ruta `/healthz` devuelve un estado `200 OK` HTTP puro sin overhead.
* **Auto-Restart Service (Docker / Systemd / Kubernetes)**:
  - En Docker: `restart: always` con `healthcheck` apuntando a `http://localhost/healthz`.
  - En Kubernetes: Liveness and Readiness probes configuradas contra `/healthz` con umbral de fallo de 3 reintentos.

---

## 2. Auditoría & Purgado de Datos Sensibles

### A. Eliminación Total de Logs en Producción
* [`vite.config.js`](file:///c:/Users/Usuario/Desktop/Otra%20landing/landing-casino/vite.config.js): Configurado con `esbuild: { drop: ['console', 'debugger'] }` y `oxc: { drop: ['console', 'debugger'] }`.
* Durante la compilación `npm run build`, se remueven el 100% de llamadas a `console.log`, `console.warn`, `console.error` y `debugger`.

### B. Auditoría de Variables de Entorno
* [`envAuditor.js`](file:///c:/Users/Usuario/Desktop/Otra%20landing/landing-casino/src/utils/envAuditor.js): Escanea `import.meta.env` en búsqueda de patrones de claves privadas, cadenas de conexión Postgres/MongoDB/MySQL/Redis, o tokens JWT expuestos en variables `VITE_*`.

### C. Sanitización de Respuestas API
* [`apiClient.js`](file:///c:/Users/Usuario/Desktop/Otra%20landing/landing-casino/src/utils/apiClient.js): Implementa la función `sanitizeApiResponseData()`, la cual despoja recursivamente cualquier campo privado o no autorizado (como `password_hash`, `internal_id`, `ssn`, `role_permissions`) proveniente de respuestas HTTP externas.

---

## 3. Restricciones y Protección en el Navegador

### A. Bloqueo de Inspección Casual y DevTools
* [`browserProtection.js`](file:///c:/Users/Usuario/Desktop/Otra%20landing/landing-casino/src/utils/browserProtection.js):
  1. Deshabilita el **Menú Contextual** (click derecho) en la interfaz gráfica.
  2. Bloquea las combinaciones de teclas de DevTools: `F12`, `Ctrl+Shift+I`, `Ctrl+Shift+J`, `Ctrl+Shift+C`, `Ctrl+U`, `Ctrl+S`, `Cmd+Opt+I`, `Cmd+Opt+J`, `Cmd+Opt+C`, `Cmd+Opt+U`, `Cmd+S`.
  3. Previene el arrastre (`dragstart`) de imágenes y gráficos.

### B. Protección por CSS
* [`index.css`](file:///c:/Users/Usuario/Desktop/Otra%20landing/landing-casino/src/index.css): Aplica `user-select: none` y `-webkit-user-drag: none` en la interfaz global, habilitando `user-select: text` únicamente en campos de entrada (`input`, `textarea`).
