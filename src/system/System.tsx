import { useEffect, useReducer, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../components/Icon';
import { initialMachine, machineReducer, stageOf, type Stage } from './model';
import { useReducedMotion, useVisible } from './useVisible';
import { createFlow } from './flow';
import { machineArt } from './generated';
import '../../vendor/anatomy/iso.css';
import s from './System.module.css';

const components: Stage[] = ['request', 'cache', 'adapter', 'normalize', 'response'];
export default function System() {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(machineReducer, initialMachine);
  const [selected, setSelected] = useState<Stage>('request');
  const [fallback, setFallback] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const flow = useRef<ReturnType<typeof createFlow>>(null);
  const visible = useVisible(root);
  const reduced = useReducedMotion();
  const stage = stageOf(state);
  const busy = state.status === 'running' || state.status === 'paused';
  const route = stage === 'cache' && state.cacheHit ? 'hit' : stage === 'response' ? null : stage;

  useEffect(() => {
    const listener = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', listener);
    return () => document.removeEventListener('visibilitychange', listener);
  }, []);
  useEffect(() => {
    if (state.status !== 'running' || !visible || !pageVisible) return;
    const timer = window.setTimeout(() => dispatch({ type: 'tick' }), reduced ? 80 : 950);
    return () => window.clearTimeout(timer);
  }, [state.status, state.step, visible, pageVisible, reduced]);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const lost = (event: Event) => {
      event.preventDefault();
      flow.current = null;
      setFallback(true);
    };
    const restore = () => {
      flow.current = createFlow(element);
      setFallback(!flow.current);
    };
    restore();
    element.addEventListener('webglcontextlost', lost);
    element.addEventListener('webglcontextrestored', restore);
    return () => {
      element.removeEventListener('webglcontextlost', lost);
      element.removeEventListener('webglcontextrestored', restore);
      flow.current?.dispose();
      flow.current = null;
    };
  }, []);
  useEffect(() => {
    const layer = flow.current;
    if (!layer) return;
    if (!route || state.status !== 'running' || !visible || !pageVisible || reduced) {
      layer.clear();
      return;
    }
    const points = machineArt.worldRoutes[route];
    const last = points[points.length - 1];
    const uniforms = Object.fromEntries(
      ['uA', 'uB', 'uC', 'uD', 'uE'].map((key, index) => [
        key,
        (points[index] ?? last).slice(0, 2),
      ]),
    );
    let frame = 0;
    let start: number | undefined;
    function draw(time: number) {
      start ??= time;
      const elapsed = time - start;
      const envelope = Math.min(1, elapsed / 120) * Math.min(1, Math.max(0, (950 - elapsed) / 150));
      layer!.draw({ ...uniforms, uStrength: envelope }, time / 1000);
      frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      layer.clear();
    };
  }, [route, state.status, visible, pageVisible, reduced, fallback]);

  const current = busy ? stage : selected;
  const statusKey = { idle: 'ready', running: 'running', paused: 'paused', complete: 'complete' }[
    state.status
  ];
  return (
    <div ref={root} className={s.instrument}>
      <div className={s.topline}>
        <span>
          <span className={s.statusDot} />
          {t('system.caption')}
        </span>
        <span>SEEN / API</span>
      </div>
      <div
        className={`${s.stage} iso`}
        data-theme="light"
        data-stage={current}
        data-route={busy ? route : undefined}
        data-gl={!fallback && !reduced}
        data-testid="machine-art"
      >
        <svg
          className="iso-svg"
          viewBox={`0 0 ${machineArt.width} ${machineArt.height}`}
          aria-label={t('system.title')}
          dangerouslySetInnerHTML={{ __html: machineArt.back }}
        />
        <canvas ref={canvas} className={s.canvas} aria-hidden="true" />
        <svg
          className={s.front}
          viewBox={`0 0 ${machineArt.width} ${machineArt.height}`}
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: machineArt.front }}
        />
      </div>
      <div className={s.controls}>
        <button className={s.run} disabled={busy} onClick={() => dispatch({ type: 'run' })}>
          <Icon name="play" size={16} />
          {t(state.completed ? 'system.repeat' : 'system.run')}
        </button>
        <button disabled={!busy} onClick={() => dispatch({ type: 'pause' })}>
          <Icon name={state.status === 'paused' ? 'play' : 'pause'} size={15} />
          {t(state.status === 'paused' ? 'system.resume' : 'system.pause')}
        </button>
        <button disabled={busy || !state.cache} onClick={() => dispatch({ type: 'expire' })}>
          {t('system.expire')}
        </button>
        <button onClick={() => dispatch({ type: 'reset' })}>
          <Icon name="reset" size={15} />
          {t('system.reset')}
        </button>
      </div>
      <div className={s.readouts} aria-live="polite" aria-atomic="true">
        <div>
          <span>{t('system.stage')}</span>
          <strong>{t(`system.${statusKey}`)}</strong>
        </div>
        <div>
          <span>{t('system.cache')}</span>
          <strong>
            {busy || state.status === 'complete'
              ? t(state.cacheHit ? 'system.cacheHit' : 'system.cacheMiss')
              : t(state.cache ? 'system.cacheReady' : 'system.cacheEmpty')}
          </strong>
        </div>
        <div>
          <span>{t('system.requests')}</span>
          <strong data-testid="requests">{state.completed.toString().padStart(2, '0')}</strong>
        </div>
        <div>
          <span>{t('system.calls')}</span>
          <strong data-testid="provider-calls">
            {state.providerCalls.toString().padStart(2, '0')}
          </strong>
        </div>
      </div>
      <p className={s.caption}>
        {t('system.sample')}
        {fallback ? ` · ${t('system.fallback')}` : ''}
      </p>
      <div className={s.inspector}>
        <div className={s.componentList} aria-label={t('system.steps')}>
          {components.map((name, index) => (
            <button key={name} aria-pressed={selected === name} onClick={() => setSelected(name)}>
              <span>{(index + 1).toString().padStart(2, '0')}</span>
              {t(`system.${name}`)}
              <Icon name="arrow" size={15} />
            </button>
          ))}
        </div>
        <div className={s.explanation}>
          <h3>{t(`system.${selected}`)}</h3>
          <p>{t(`system.${selected}Text`)}</p>
          <span>{t('system.implementation')}</span>
        </div>
      </div>
      <div className={s.secondary}>
        <h3>{t('system.more')}</h3>
        <div>
          <h4>{t('system.preferences')}</h4>
          <p>{t('system.preferencesText')}</p>
        </div>
        <div>
          <h4>{t('system.notifications')}</h4>
          <p>{t('system.notificationsText')}</p>
        </div>
      </div>
    </div>
  );
}
