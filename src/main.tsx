import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/dm-serif-display/latin-400-italic.css';
import './i18n';
import './global.css';
import LoadBoundary from './components/LoadBoundary';

const Preview = lazy(() => import('./preview/Preview'));
const Legacy = lazy(() => import('./App'));
const isLegacy = new URLSearchParams(window.location.search).get('preview') === 'legacy';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LoadBoundary>
      <Suspense fallback={null}>{isLegacy ? <Legacy /> : <Preview />}</Suspense>
    </LoadBoundary>
  </React.StrictMode>,
);
