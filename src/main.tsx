import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/dm-serif-display/latin-400-italic.css';
import './i18n';
import './global.css';
import App from './App';
import LoadBoundary from './components/LoadBoundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LoadBoundary>
      <App />
    </LoadBoundary>
  </React.StrictMode>,
);
