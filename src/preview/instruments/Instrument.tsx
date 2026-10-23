import { memo, useEffect, useRef, useState, useSyncExternalStore, useId } from 'react';
import type { Story, Text } from '../content';
import { copy } from './copy';
import ProjectControls from './ProjectControls';
import { fields, initialInputs, instrumentModel, type Inputs, type InstrumentId } from './model';
import { mountInstrument, type Art, type Pose } from './renderer';
import Icon from '../../components/Icon';
import '../../../vendor/anatomy/iso.css';
import s from './Instrument.module.css';
import { instrumentLoaders } from './registry';
const subscribeMotion = (callback: () => void) => {
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
};
const isReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
type Translate = (text: Text) => string;
const ArtLayer = memo(function ArtLayer({
  art,
  front,
  label,
}: {
  art: Art;
  front?: boolean;
  label: string;
}) {
  return (
    <svg
      className={`iso-svg ${front ? s.front : ''}`}
      viewBox={`0 0 ${art.width} ${art.height}`}
      data-front={front ? '' : undefined}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- The SVG needs its own figure description.
      role={front ? undefined : 'img'}
      aria-label={front ? undefined : label}
      aria-hidden={front ? true : undefined}
      dangerouslySetInnerHTML={{ __html: front ? art.front : art.back }}
    />
  );
});
function Drawing({
  art,
  pose,
  advance,
  stop,
  label,
  theme,
}: {
  art: Art;
  pose: Pose;
  advance: () => void;
  stop: () => void;
  label: string;
  theme: string;
}) {
  const stage = useRef<HTMLDivElement>(null),
    canvas = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<ReturnType<typeof mountInstrument> | null>(null);
  const callbacks = useRef({ advance, stop });
  useEffect(() => {
    callbacks.current = { advance, stop };
  });
  useEffect(() => {
    if (!stage.current || !canvas.current) return;
    const live = mountInstrument(
      stage.current,
      canvas.current,
      art,
      () => callbacks.current.advance(),
      () => callbacks.current.stop(),
    );
    renderer.current = live;
    return () => {
      live.dispose();
      renderer.current = null;
    };
  }, [art]);
  useEffect(() => {
    renderer.current?.set(pose);
  }, [pose]);
  return (
    <div ref={stage} className={`${s.stage} iso`} data-theme={theme} data-gl="false" data-step="0">
      <ArtLayer art={art} label={label} />
      <canvas ref={canvas} aria-hidden="true" className={s.canvas} />
      <ArtLayer art={art} front label={label} />
    </div>
  );
}
export default function Instrument({
  id,
  story,
  tr,
}: {
  id: InstrumentId;
  story: Story;
  tr: Translate;
}) {
  const controlId = useId();
  const text = copy[id];
  const [art, setArt] = useState<Art | null>(null),
    [loadFailed, setLoadFailed] = useState(false);
  const [step, setStep] = useState(0),
    [inputs, setInputs] = useState<Inputs>(() => ({
      ...initialInputs,
      selected: [...initialInputs.selected],
    }));
  const pageTheme = 'dark';
  const [playing, setPlaying] = useState(true);
  const [materialTheme, setTheme] = useState<'dark' | 'light' | null>(null);
  const theme = materialTheme ?? pageTheme;
  useEffect(() => {
    let cancelled = false;
    instrumentLoaders[id]()
      .then((module) => {
        if (!cancelled) setArt(module.default);
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);
  const reduced = useSyncExternalStore(subscribeMotion, isReduced, () => true);
  const touring = playing && !reduced;
  const model = instrumentModel(id, step, inputs);
  const pick = (next: number) => {
    setPlaying(false);
    setStep(next);
  };
  const change = (patch: Partial<Inputs>) => {
    setPlaying(false);
    setInputs((current) => ({ ...current, ...patch }));
  };
  const reset = () => {
    setPlaying(false);
    setStep(0);
    setInputs({ ...initialInputs, selected: [...initialInputs.selected] });
  };
  const pose: Pose = {
    ...model,
    choice:
      id === 'mcp'
        ? inputs.tool
        : id === 'boards'
          ? inputs.content
          : id === 'boom'
            ? inputs.format
            : inputs.provider,
    cached: inputs.cached,
    nativeOnly: inputs.nativeOnly,
    content: inputs.content,
    tool: inputs.tool,
    playing: touring,
    light: theme === 'light',
  };
  const status = model.blocked
    ? tr(
        id === 'mcp'
          ? ['Access required', 'Acceso requerido']
          : id === 'boards'
            ? ['Add note content', 'Añade contenido']
            : id === 'graphql'
              ? ['Select at least one field', 'Selecciona al menos un campo']
              : model.reason === 'premium'
                ? ['Premium access required', 'Se requiere acceso premium']
                : model.reason === 'download'
                  ? [
                      'Download the session or enable the network',
                      'Descarga la sesión o activa la red',
                    ]
                  : ['Add a configuration title', 'Añade un título de configuración'],
      )
    : tr(step === 2 ? ['Complete', 'Completado'] : ['Ready to continue', 'Listo para continuar']);
  return (
    <figure className={s.figure} data-instrument={id}>
      <div className={s.heading}>
        <span>Fig. {Object.keys(instrumentLoaders).indexOf(id) + 1}</span>
        <h2>{tr(text.title)}</h2>
      </div>
      <div className={s.body}>
        <div className={s.visual}>
          <div className={s.material}>
            <span>{tr(text.object)}</span>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-pressed={theme === 'light'}
            >
              {tr(['Paper view', 'Vista en papel'])}
            </button>
          </div>
          {art ? (
            <Drawing
              art={art}
              pose={pose}
              theme={theme}
              label={tr(text.caption)}
              advance={() => setStep((current) => (current + 1) % 3)}
              stop={() => setPlaying(false)}
            />
          ) : (
            <output className={s.loading}>
              {tr(
                loadFailed
                  ? [
                      'The drawing could not load. The controls and explanation are still available.',
                      'No se pudo cargar el dibujo. Los controles y la explicación siguen disponibles.',
                    ]
                  : ['Preparing the instrument…', 'Preparando el instrumento…'],
              )}
            </output>
          )}
          {id === 'superpowered' && (
            <p className={s.signalPath} aria-live="polite">
              {inputs.provider === 0 && inputs.nativeOnly
                ? 'Java test app → JNI → Superpowered C++'
                : inputs.provider === 0
                  ? 'React Native → Java / JNI → Superpowered C++'
                  : 'React Native → Objective-C → Superpowered C++'}
            </p>
          )}
          <div className={s.figureFooter}>
            <p>{tr(text.hint)}</p>
            <span>
              {step + 1} / 3 · {status}
            </span>
          </div>
        </div>
        <div className={s.readout}>
          <div className={s.phase}>
            {tr(['Step', 'Paso'])} {step + 1} / 3
          </div>
          <div aria-live={touring ? 'off' : 'polite'} aria-atomic="true">
            <h3>{tr(story.steps[step].title)}</h3>
            <p>{tr(story.steps[step].detail)}</p>
          </div>
          <div className={s.actions}>
            <button onClick={() => pick((step + 1) % 3)}>
              {tr(
                step === 2 ? ['Start again', 'Volver al inicio'] : ['Next step', 'Siguiente paso'],
              )}
              <Icon name={step === 2 ? 'reset' : 'arrow'} size={16} />
            </button>
            <button
              className={s.quiet}
              onClick={() => setPlaying(!playing)}
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
      <nav className={s.steps} aria-label={tr(['Architecture steps', 'Pasos de la arquitectura'])}>
        {story.steps.map((item, index) => (
          <button key={item.title[0]} aria-pressed={step === index} onClick={() => pick(index)}>
            <span>{index + 1}</span>
            {tr(item.title)}
            <Icon name="arrow" size={15} />
          </button>
        ))}
      </nav>
      <div className={s.workbench}>
        <section className={s.inputs} aria-label={tr(['Try the model', 'Prueba el modelo'])}>
          <div className={s.sectionHeading}>
            <h3>{tr(['Try the model', 'Prueba el modelo'])}</h3>
            <button onClick={reset}>{tr(['Reset', 'Restablecer'])}</button>
          </div>
          {id === 'mcp' ? (
            <>
              <label className={s.check}>
                <input
                  type="checkbox"
                  checked={inputs.authorized}
                  onChange={(event) => change({ authorized: event.target.checked })}
                />
                {tr(['Company SSO session', 'Sesión de SSO de la empresa'])}
              </label>
              <div className={s.select}>
                <label htmlFor={`${controlId}-tool`}>
                  {tr(['Example tool', 'Herramienta de ejemplo'])}
                </label>
                <select
                  id={`${controlId}-tool`}
                  value={inputs.tool}
                  onChange={(event) => change({ tool: Number(event.target.value) })}
                >
                  {[0, 1, 2].map((i) => (
                    <option key={i} value={i}>
                      {tr(['Tool', 'Herramienta'])} {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <p className={s.help}>
                {tr([
                  'One shared entry point for each example tool.',
                  'Una entrada compartida para cada herramienta de ejemplo.',
                ])}
              </p>
            </>
          ) : id === 'boards' ? (
            <>
              <div className={s.select}>
                <label htmlFor={`${controlId}-content`}>
                  {tr(['Content type', 'Tipo de contenido'])}
                </label>
                <select
                  id={`${controlId}-content`}
                  value={inputs.content}
                  onChange={(event) => change({ content: Number(event.target.value) })}
                >
                  {(['Rich text', 'Image', 'Markdown', 'Link'] as const).map((name, i) => (
                    <option key={name} value={i}>
                      {tr([name, ['Texto enriquecido', 'Imagen', 'Markdown', 'Enlace'][i]])}
                    </option>
                  ))}
                </select>
              </div>
              <div className={s.select}>
                <label htmlFor={`${controlId}-note`}>
                  {tr(['Example note', 'Nota de ejemplo'])}
                </label>
                <textarea
                  id={`${controlId}-note`}
                  value={inputs.note}
                  maxLength={180}
                  rows={2}
                  onChange={(event) => change({ note: event.target.value })}
                />
              </div>
              <div className={s.range}>
                <label htmlFor={`${controlId}-members`}>
                  {tr(['People in the example', 'Personas en el ejemplo'])}
                </label>
                <output>{inputs.members}</output>
                <input
                  type="range"
                  id={`${controlId}-members`}
                  min="1"
                  max="3"
                  value={inputs.members}
                  onChange={(event) => change({ members: Number(event.target.value) })}
                />
              </div>
            </>
          ) : id === 'graphql' ? (
            <>
              <fieldset>
                <legend>{tr(['Requested Board fields', 'Campos de Board solicitados'])}</legend>
                <div className={s.fields}>
                  {fields.map((field) => (
                    <label key={field} className={s.check}>
                      <input
                        type="checkbox"
                        checked={inputs.selected.includes(field)}
                        onChange={(event) =>
                          change({
                            selected: event.target.checked
                              ? [...inputs.selected, field]
                              : inputs.selected.filter((value) => value !== field),
                          })
                        }
                      />
                      {field}
                    </label>
                  ))}
                </div>
              </fieldset>
              <p className={s.help}>
                {model.activeFields} / 4{' '}
                {tr([
                  'top-level fields selected. These are not database query counts.',
                  'campos principales seleccionados. No es un conteo de consultas a la base de datos.',
                ])}
              </p>
            </>
          ) : (
            <ProjectControls
              id={id}
              inputs={inputs}
              change={change}
              tr={tr}
              controlId={controlId}
            />
          )}
          <output className={s.status}>{status}</output>
        </section>
        <section className={s.explanation}>
          <h3>{tr(['Under the surface', 'Bajo la superficie'])}</h3>
          <p>{tr(text.details[step])}</p>
          <details className={s.payload}>
            <summary>
              {tr(
                id === 'graphql'
                  ? ['Inspect query & response', 'Inspeccionar consulta y respuesta']
                  : ['Inspect example data', 'Inspeccionar datos de ejemplo'],
              )}
            </summary>
            {id === 'graphql' ? (
              <pre aria-label={tr(['Example query', 'Consulta de ejemplo'])}>
                <code>
                  {model.query ||
                    tr([
                      'Choose a field to build a query.',
                      'Elige un campo para construir una consulta.',
                    ])}
                </code>
              </pre>
            ) : null}
            <pre aria-label={tr(['Example state', 'Estado de ejemplo'])}>
              <code>{model.payload}</code>
            </pre>
          </details>
        </section>
      </div>
      <figcaption>
        <p>{tr(text.caption)}</p>
        <p>
          {tr([
            'Interactive conceptual model with fictional local data. It illustrates responsibilities, not production infrastructure.',
            'Modelo conceptual interactivo con datos locales ficticios. Ilustra responsabilidades, no infraestructura de producción.',
          ])}
        </p>
      </figcaption>
    </figure>
  );
}
