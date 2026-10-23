import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../components/Icon';
import s from './Demos.module.css';

export default function Meditation() {
  const { t } = useTranslation();
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(30);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState(false);
  const [volume, setVolume] = useState(0.35);
  useEffect(() => {
    if (audio.current) audio.current.volume = volume;
  }, [volume]);
  async function toggle() {
    if (!audio.current) return;
    if (playing) audio.current.pause();
    else {
      try {
        await audio.current.play();
        setError(false);
      } catch {
        setError(true);
      }
    }
  }
  const time = (seconds: number) => `0:${Math.floor(seconds).toString().padStart(2, '0')}`;
  return (
    <div className={`${s.demo} ${s.meditation}`}>
      <div className={s.puraLogo}>
        <Icon name="leaf" size={18} />
        pura mente
      </div>
      <h3>{t('meditation.title')}</h3>
      <p className={s.sub}>{t('meditation.sub')}</p>
      <div className={s.landscape} aria-hidden="true">
        <div className={s.orb} />
        <div className={s.ridgeOne} />
        <div className={s.ridgeTwo} />
        <div className={s.ridgeThree} />
        <span />
      </div>
      <div className={s.session}>
        <h4>{t('meditation.session')}</h4>
        <p>{t('meditation.type')}</p>
      </div>
      <audio
        ref={audio}
        src="/audio/ambient.wav"
        preload="auto"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setPosition(event.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => setError(true)}
      >
        <track
          kind="captions"
          src="/audio/ambient.vtt"
          srcLang="en"
          label="Ambient audio description"
        />
      </audio>
      <input
        className={s.seek}
        type="range"
        min="0"
        max={duration}
        step="0.1"
        value={position}
        aria-label={t('meditation.seek')}
        onChange={(event) => {
          const value = Number(event.target.value);
          if (audio.current) audio.current.currentTime = value;
          setPosition(value);
        }}
      />
      <div className={s.times}>
        <span>{time(position)}</span>
        <span>{time(duration)}</span>
      </div>
      <button
        className={s.playButton}
        onClick={() => void toggle()}
        aria-label={t(playing ? 'meditation.pause' : 'meditation.play')}
      >
        <Icon name={playing ? 'pause' : 'play'} size={23} />
      </button>
      <label className={s.volume}>
        <Icon name="sound" size={15} />
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          aria-label={t('meditation.volume')}
          onChange={(event) => setVolume(Number(event.target.value))}
        />
      </label>
      <button
        className={s.offlineSwitch}
        aria-label={t('meditation.offline')}
        aria-pressed={offline}
        onClick={() => setOffline(!offline)}
      >
        <Icon name={offline ? 'check' : 'wifi'} size={14} />
        {t(offline ? 'meditation.offlineOn' : 'meditation.offlineOff')}
      </button>
      {error && (
        <p role="alert" className={s.audioError}>
          {t('meditation.error')}
        </p>
      )}
      <p className={s.audioNote}>{t('meditation.description')}</p>
    </div>
  );
}
