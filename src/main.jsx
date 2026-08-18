import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

// Manejador global de excepciones no capturadas (window.onerror)
window.addEventListener('error', (event) => {
  // Evitar romper la interfaz y registrar silenciosamente
  if (import.meta.env?.DEV) {
    console.warn('[Global Exception Captured]:', event.message, event.error);
  }
});

// Manejador global de promesas rechazadas no capturadas (unhandledrejection)
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