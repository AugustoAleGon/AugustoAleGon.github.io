import { Component, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import s from './LoadBoundary.module.css';

class Boundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function LoadBoundary({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation();
  return (
    <Boundary
      fallback={
        <div className={s.failure} lang={i18n.resolvedLanguage}>
          <p role="alert">{t('recovery.message')}</p>
          <button type="button" onClick={() => window.location.reload()}>
            {t('recovery.reload')}
          </button>
        </div>
      }
    >
      {children}
    </Boundary>
  );
}
