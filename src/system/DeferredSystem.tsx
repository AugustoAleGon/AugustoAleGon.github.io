import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import s from '../App.module.css';
import LoadBoundary from '../components/LoadBoundary';

const System = lazy(() => import('./System'));

export default function DeferredSystem() {
  const { t } = useTranslation();
  const root = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setReady(true);
        observer.disconnect();
      },
      { rootMargin: '300px' },
    );
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  const placeholder = <div className={s.systemLoading}>{t('system.loading')}</div>;
  return (
    <div ref={root}>
      {ready ? (
        <LoadBoundary>
          <Suspense fallback={placeholder}>
            <System />
          </Suspense>
        </LoadBoundary>
      ) : (
        placeholder
      )}
    </div>
  );
}
