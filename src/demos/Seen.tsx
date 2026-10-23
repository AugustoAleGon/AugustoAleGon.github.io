import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../components/Icon';
import s from './Demos.module.css';

const matches = {
  WNBA: [
    {
      id: 'w1',
      a: 'Brooklyn Orbit',
      b: 'Seattle Current',
      score: '82 — 76',
      letters: ['BO', 'SC'],
    },
    { id: 'w2', a: 'Chicago Comets', b: 'Austin Sol', score: '64 — 59', letters: ['CC', 'AS'] },
  ],
  NWSL: [
    { id: 'n1', a: 'Portland Pines', b: 'Bay City FC', score: '2 — 1', letters: ['PP', 'BC'] },
    { id: 'n2', a: 'Coastal United', b: 'Denver Bloom', score: '0 — 0', letters: ['CU', 'DB'] },
  ],
};

export default function Seen() {
  const { t } = useTranslation();
  const [league, setLeague] = useState<'WNBA' | 'NWSL'>('WNBA');
  const [day, setDay] = useState('today');
  const [shield, setShield] = useState(true);
  const [revealed, setRevealed] = useState<string[]>([]);
  function chooseLeague(value: 'WNBA' | 'NWSL') {
    setLeague(value);
    setRevealed([]);
  }
  return (
    <div className={`${s.demo} ${s.seen}`}>
      <header className={s.seenHeader}>
        <span className={s.seenLogo}>
          SEE<span>N</span>
          <span className={s.logoDot} />
        </span>
        <button
          className={s.iconButton}
          aria-label={t('phone.shield')}
          aria-pressed={shield}
          onClick={() => {
            setShield(!shield);
            setRevealed([]);
          }}
        >
          <Icon name="shield" />
        </button>
      </header>
      <div className={s.seenHeading}>
        <h3>{t('phone.scores')}</h3>
        <span>{t('phone.demo')}</span>
      </div>
      <div className={s.sports}>
        <button aria-pressed={league === 'WNBA'} onClick={() => chooseLeague('WNBA')}>
          <Icon name="ball" size={15} />
          {t('phone.basketball')}
        </button>
        <button aria-pressed={league === 'NWSL'} onClick={() => chooseLeague('NWSL')}>
          {t('phone.soccer')}
        </button>
      </div>
      <div className={s.leagueBar}>
        <span>{league}</span>
        <span className={s.shieldState}>
          <Icon name="shield" size={12} />
          {t(shield ? 'phone.shieldOn' : 'phone.shieldOff')}
        </span>
      </div>
      <div className={s.days}>
        {['yesterday', 'today', 'tomorrow'].map((value) => (
          <button
            key={value}
            aria-pressed={day === value}
            onClick={() => {
              setDay(value);
              setRevealed([]);
            }}
          >
            {t(`phone.${value}`)}
          </button>
        ))}
      </div>
      <div className={s.games}>
        {matches[league].map((match, i) => {
          const hidden = shield && day !== 'tomorrow' && !revealed.includes(match.id);
          return (
            <article key={match.id} className={s.game}>
              <div className={s.gameStatus}>
                <span className={s.liveDot} />
                {t(
                  day === 'tomorrow'
                    ? 'phone.upcoming'
                    : i === 0 || day === 'yesterday'
                      ? 'phone.final'
                      : 'phone.live',
                )}
                <span>{league}</span>
              </div>
              <div className={s.team}>
                <span>{match.letters[0]}</span>
                <strong>{match.a}</strong>
              </div>
              <div className={s.team}>
                <span>{match.letters[1]}</span>
                <strong>{match.b}</strong>
              </div>
              <div className={s.scoreArea}>
                {hidden ? (
                  <button
                    className={s.concealed}
                    aria-label={`${t('phone.reveal')}: ${match.a}`}
                    onClick={() => setRevealed([...revealed, match.id])}
                  >
                    <Icon name="shield" size={14} />
                    <span>{t('phone.hidden')}</span>
                    <Icon name="plus" size={14} />
                  </button>
                ) : (
                  <div className={s.score} aria-live="polite">
                    {day === 'tomorrow' ? '19:00' : match.score}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
