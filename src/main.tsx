import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/dm-serif-display/latin-400-italic.css';
import './i18n';
import './global.css';
import App from './App';
import LoadBoundary from './components/LoadBoundary';

const Preview = lazy(() => import('./preview/Preview'));
const isPreview = new URLSearchParams(window.location.search).get('preview') === 'revision';
document.documentElement.classList.toggle('revision-preview', isPreview);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LoadBoundary>
      {isPreview ? (
        <Suspense fallback={null}>
          <Preview />
        </Suspense>
      ) : (
        <App />
      )}
    </LoadBoundary>
  </React.StrictMode>,
);
