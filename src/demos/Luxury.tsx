import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../components/Icon';
import s from './Demos.module.css';

function House() {
  return (
    <div className={s.house} aria-hidden="true">
      <div className={s.sun} />
      <div className={s.hill} />
      <div className={s.building}>
        <i />
        <i />
        <i />
      </div>
      <span />
    </div>
  );
}

export default function Luxury() {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);
  const [draft, setDraft] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [shared, setShared] = useState(false);
  return (
    <div className={`${s.demo} ${s.luxury}`}>
      <div className={s.luxuryLogo}>
        LUXURY PRESENCE<span>LP</span>
      </div>
      {opened ? (
        <>
          <button className={s.back} onClick={() => setOpened(false)}>
            <Icon name="back" size={14} />
            {t('luxury.return')}
          </button>
          <h3>{t('luxury.board')}</h3>
          <p className={s.small}>{t('luxury.items')}</p>
          <button className={s.share} aria-pressed={shared} onClick={() => setShared(!shared)}>
            <Icon name={shared ? 'check' : 'share'} size={14} />
            {t(shared ? 'luxury.shared' : 'luxury.share')}
          </button>
          <House />
          <p className={s.property}>{t('luxury.property')}</p>
          <p className={s.small}>{t('luxury.detail')}</p>
          <h4 className={s.noteTitle}>
            <Icon name="note" size={14} />
            {t('luxury.note')}
          </h4>
          <p className={s.note}>{t('luxury.initialNote')}</p>
          <div aria-live="polite">
            {notes.map((note, index) => (
              <p className={s.note} key={index}>
                {note}
              </p>
            ))}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (draft.trim()) {
                setNotes([...notes, draft.trim()]);
                setDraft('');
              }
            }}
          >
            <textarea
              aria-label={t('luxury.placeholder')}
              placeholder={t('luxury.placeholder')}
              value={draft}
              maxLength={180}
              onChange={(event) => setDraft(event.target.value)}
            />
            <button className={s.darkButton} disabled={!draft.trim()}>
              {t('luxury.save')}
              <Icon name="plus" size={14} />
            </button>
          </form>
        </>
      ) : (
        <>
          <h3>{t('luxury.title')}</h3>
          <p className={s.sub}>{t('luxury.sub')}</p>
          <button className={s.boardButton} onClick={() => setOpened(true)}>
            <House />
            <span className={s.boardTitle}>
              {t('luxury.board')}
              <Icon name="external" size={17} />
            </span>
            <span className={s.small}>{t('luxury.items')}</span>
          </button>
          <div className={s.boardFooter}>
            <div className={s.avatars}>
              <span>A</span>
              <span>M</span>
            </div>
            <span>{t('luxury.private')}</span>
          </div>
          <div className={s.boardRule} />
          <p className={s.small}>{t('projects.luxury.action')}</p>
        </>
      )}
    </div>
  );
}
