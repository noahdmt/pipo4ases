import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { initBrowserProtection } from './utils/browserProtection.js'
import { auditEnvironmentVars } from './utils/envAuditor.js'
import './index.css'

// 1. Inicializar protección contra inspección del navegador y click derecho
initBrowserProtection();

// 2. Ejecutar auditoría DevSecOps de variables de entorno públicas
auditEnvironmentVars();

// 3. Manejador global de excepciones no capturadas (window.onerror)
window.addEventListener('error', (event) => {
  if (import.meta.env?.DEV) {
    console.warn('[Global Exception Captured]:', event.message, event.error);
  }
});

// 4. Manejador global de promesas rechazadas no capturadas (unhandledrejection)
window.addEventListener('unhandledrejection', (event) => {
  if (import.meta.env?.DEV) {
    console.warn('[Unhandled Rejection Captured]:', event.reason);
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)