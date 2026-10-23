import { lazy, Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProjectId } from '../content/projects';
import { projects } from '../content/projects';
import Icon from './Icon';
import LoadBoundary from './LoadBoundary';
import s from './Phone.module.css';

const Seen = lazy(() => import('../demos/Seen'));
const Luxury = lazy(() => import('../demos/Luxury'));
const Chat = lazy(() => import('../demos/Chat'));
const Meditation = lazy(() => import('../demos/Meditation'));
const demos = { seen: Seen, luxury: Luxury, steadymd: Chat, puramente: Meditation };

export default function Phone({
  selected,
  onSelect,
}: {
  selected: ProjectId;
  onSelect: (id: ProjectId) => void;
}) {
  const { t } = useTranslation();
  const [home, setHome] = useState(false);
  const [generation, setGeneration] = useState(0);
  const Demo = demos[selected];
  const project = projects.find((p) => p.id === selected)!;
  function open(id: ProjectId) {
    onSelect(id);
    setHome(false);
  }
  return (
    <div className={s.presentation}>
      <div className={s.caption}>
        <span className={s.dot} />
        {t('hero.phoneHint')}
        <Icon name="down" size={16} />
      </div>
      <div className={s.hardware}>
        <div className={s.screen} data-project={home ? 'home' : selected}>
          <div className={s.status}>
            <span>9:41</span>
            <div className={s.island} />
            <div className={s.indicators}>
              <svg aria-hidden="true" viewBox="0 0 18 12" width="15">
                <path d="M1 12V9h2v3h2V6h2v6h2V3h2v9h2V0h2v12" fill="currentColor" />
              </svg>
              <Icon name="wifi" size={14} />
              <span className={s.battery} />
            </div>
          </div>
          <section className={s.viewport} aria-label={t('phone.appLabel', { name: project.name })}>
            {home ? (
              <div className={s.launcher}>
                <h3>{t('phone.homeTitle')}</h3>
                <p>{t('phone.homeSub')}</p>
                <div className={s.apps}>
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => open(p.id)}
                      aria-label={t('phone.openProject', { name: p.name })}
                    >
                      <span data-brand={p.id}>{p.monogram}</span>
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <LoadBoundary key={`${selected}-${generation}`}>
                <Suspense fallback={<div className={s.loading}>{t('hero.loading')}</div>}>
                  <Demo key={`${selected}-${generation}`} />
                </Suspense>
              </LoadBoundary>
            )}
          </section>
          <div className={s.homeIndicator} />
        </div>
      </div>
      <div className={s.controls}>
        <button onClick={() => setHome((value) => !value)}>
          <Icon name={home ? 'back' : 'home'} size={15} />
          {t(home ? 'phone.back' : 'phone.home')}
        </button>
        <span />
        <button
          onClick={() => {
            setGeneration((n) => n + 1);
            setHome(false);
          }}
        >
          <Icon name="reset" size={15} />
          {t('phone.reset')}
        </button>
      </div>
      <p className={s.disclaimer}>{t('hero.sample')}</p>
    </div>
  );
}
