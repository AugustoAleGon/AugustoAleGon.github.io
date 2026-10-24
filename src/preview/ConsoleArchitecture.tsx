import { useEffect, useRef, useState } from 'react';
import Icon from '../components/Icon';
import type { Story, Text } from './content';
import { consoleArt } from './console.generated';
import { createSignal } from './signal';
import { useReducedMotion, useTour } from './useTour';
import '../../vendor/anatomy/iso.css';
import s from './Architecture.module.css';

export default function ConsoleArchitecture({
  story,
  tr,
}: {
  story: Story;
  tr: (text: Text) => string;
}) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const reduced = useReducedMotion();
  const touring = playing && !reduced;
  const pick = (next: number) => {
    setPlaying(false);
    setStep(next);
  };
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  useTour(stage, touring, step, () => setStep((current) => (current + 1) % 3));
  const signal = useRef<ReturnType<typeof createSignal>>(null);
  useEffect(() => {
    if (!canvas.current) return;
    const flow = createSignal(canvas.current);
    signal.current = flow;
    if (stage.current) stage.current.dataset.gl = String(Boolean(flow));
    return () => {
      flow?.dispose();
      signal.current = null;
    };
  }, []);
  useEffect(() => {
    signal.current?.setStep(step);
  }, [step]);
  return (
    <figure className={s.figure}>
      <div className={s.figureHeading}>
        <h2>{tr(['How the pieces connect', 'Cómo se conectan las piezas'])}</h2>
        <span>{tr(['Conceptual walkthrough', 'Recorrido conceptual'])}</span>
      </div>
      <div className={s.figureBody}>
        <div ref={stage} className={`${s.stage} iso`} data-step={step} data-gl="false">
          <svg
            className="iso-svg"
            viewBox={`0 0 ${consoleArt.width} ${consoleArt.height}`}
            // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- Inline SVG carries the accessible figure description.
            role="img"
            aria-label={tr([
              'An isometric console with three connected modules: input, processing and output.',
              'Una consola isométrica con tres módulos conectados: entrada, procesamiento y salida.',
            ])}
            dangerouslySetInnerHTML={{ __html: consoleArt.back }}
          />
          <canvas ref={canvas} className={s.canvas} aria-hidden="true" />
          <svg
            className={`${s.front} iso-svg`}
            viewBox={`0 0 ${consoleArt.width} ${consoleArt.height}`}
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: consoleArt.front }}
          />
        </div>
        <div className={s.readout}>
          <div className={s.stepCount}>
            {tr(['Step', 'Paso'])} {step + 1} / 3
          </div>
          <div aria-live={touring ? 'off' : 'polite'} aria-atomic="true">
            <h3>{tr(story.steps[step].title)}</h3>
            <p>{tr(story.steps[step].detail)}</p>
          </div>
          <div className={s.controls}>
            <button onClick={() => pick((step + 1) % 3)}>
              {tr(
                step === 2 ? ['Start again', 'Volver al inicio'] : ['Next step', 'Siguiente paso'],
              )}
              <Icon name={step === 2 ? 'reset' : 'arrow'} size={16} />
            </button>
            <button
              onClick={() => setPlaying((current) => !current)}
              disabled={reduced}
              aria-pressed={touring}
              title={
                reduced
                  ? tr([
                      'Automatic motion is disabled by your motion preference.',
                      'Tu preferencia de movimiento desactiva el recorrido automático.',
                    ])
                  : undefined
              }
            >
              {tr(
                touring ? ['Pause tour', 'Pausar recorrido'] : ['Play tour', 'Iniciar recorrido'],
              )}
            </button>
          </div>
        </div>
      </div>
      <div className={s.steps} aria-label={tr(['Architecture steps', 'Pasos de la arquitectura'])}>
        {story.steps.map((item, index) => (
          <button key={item.title[0]} aria-pressed={step === index} onClick={() => pick(index)}>
            <span>{index + 1}</span>
            {tr(item.title)}
            <Icon name="arrow" size={15} />
          </button>
        ))}
      </div>
      <figcaption>
        {tr([
          'An explanatory model of the contribution. The physical modules show responsibilities, not production infrastructure.',
          'Un modelo explicativo de la contribución. Los módulos físicos muestran responsabilidades, no infraestructura de producción.',
        ])}
      </figcaption>
    </figure>
  );
}
