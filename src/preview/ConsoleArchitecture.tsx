import { useEffect, useRef, useState } from 'react';
import Icon from '../components/Icon';
import type { Story, Text } from './content';
import { consoleArt } from './console.generated';
import { createSignal } from './signal';
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
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
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
          <div aria-live="polite" aria-atomic="true">
            <h3>{tr(story.steps[step].title)}</h3>
            <p>{tr(story.steps[step].detail)}</p>
          </div>
          <div className={s.controls}>
            <button onClick={() => setStep((step + 1) % 3)}>
              {tr(
                step === 2 ? ['Start again', 'Volver al inicio'] : ['Next step', 'Siguiente paso'],
              )}
              <Icon name={step === 2 ? 'reset' : 'arrow'} size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className={s.steps} aria-label={tr(['Architecture steps', 'Pasos de la arquitectura'])}>
        {story.steps.map((item, index) => (
          <button key={item.title[0]} aria-pressed={step === index} onClick={() => setStep(index)}>
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
