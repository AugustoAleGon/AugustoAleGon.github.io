import type { Text } from '../content';
import type { Inputs, InstrumentId } from './model';
import s from './Instrument.module.css';
type Props = {
  id: InstrumentId;
  inputs: Inputs;
  change: (patch: Partial<Inputs>) => void;
  tr: (text: Text) => string;
  controlId: string;
};
export default function ProjectControls({ id, inputs, change, tr, controlId }: Props) {
  const check = (
    key:
      | 'premium'
      | 'online'
      | 'downloaded'
      | 'health'
      | 'cached'
      | 'spoiler'
      | 'following'
      | 'nativeOnly',
    label: Text,
  ) => (
    <label className={s.check} key={key}>
      <input
        type="checkbox"
        checked={inputs[key]}
        onChange={(e) => change({ [key]: e.target.checked })}
      />
      {tr(label)}
    </label>
  );
  const select = (key: 'format' | 'provider' | 'choice', label: Text, options: Text[]) => (
    <div className={s.select}>
      <label htmlFor={`${controlId}-${key}`}>{tr(label)}</label>
      <select
        id={`${controlId}-${key}`}
        value={inputs[key]}
        onChange={(e) => change({ [key]: Number(e.target.value) })}
      >
        {options.map((option, i) => (
          <option key={option[0]} value={i}>
            {tr(option)}
          </option>
        ))}
      </select>
    </div>
  );
  if (id === 'superpowered')
    return (
      <>
        {select(
          'provider',
          ['Native platform', 'Plataforma nativa'],
          [
            ['Android · Java / JNI', 'Android · Java / JNI'],
            ['iOS · Objective-C', 'iOS · Objective-C'],
          ],
        )}
        {inputs.provider === 0 &&
          check('nativeOnly', [
            'Use the native-only Android harness',
            'Usar la prueba nativa de Android',
          ])}
        <p className={s.help}>
          {tr([
            'Compare the documented paths into the same C++ core. The waveform is illustrative; this page does not run the SDK or report performance measurements.',
            'Compara las rutas documentadas hacia el mismo núcleo C++. La onda es ilustrativa; esta página no ejecuta el SDK ni mide el rendimiento.',
          ])}
        </p>
      </>
    );
  if (id === 'puramente')
    return (
      <>
        {check('premium', ['Premium access', 'Acceso premium'])}
        {check('online', ['Network available', 'Red disponible'])}
        {check('downloaded', ['Session downloaded', 'Sesión descargada'])}
        {(['narration', 'ambience'] as const).map((key) => (
          <div className={s.range} key={key}>
            <label htmlFor={`${controlId}-${key}`}>
              {tr(
                key === 'narration'
                  ? ['Narration level', 'Nivel de narración']
                  : ['Background level', 'Nivel de fondo'],
              )}
            </label>
            <output>{inputs[key]}%</output>
            <input
              id={`${controlId}-${key}`}
              type="range"
              min="0"
              max="100"
              value={inputs[key]}
              onChange={(e) => change({ [key]: Number(e.target.value) })}
            />
          </div>
        ))}
        {check('health', ['Record completion in HealthKit', 'Registrar finalización en HealthKit'])}
        <p className={s.help}>
          {tr([
            'Levels move the two faders. This architecture model plays no audio and writes no health data.',
            'Los niveles mueven los dos faders. Este modelo no reproduce audio ni escribe datos de salud.',
          ])}
        </p>
      </>
    );
  if (id === 'boom')
    return (
      <>
        {select(
          'format',
          ['Example game format', 'Formato de juego de ejemplo'],
          [
            ['Quiz', 'Cuestionario'],
            ['Prediction', 'Predicción'],
            ['Poll', 'Encuesta'],
          ],
        )}
        <div className={s.select}>
          <label htmlFor={`${controlId}-title`}>
            {tr(['Configuration title', 'Título de configuración'])}
          </label>
          <input
            id={`${controlId}-title`}
            type="text"
            value={inputs.gameTitle}
            maxLength={80}
            onChange={(e) => change({ gameTitle: e.target.value })}
          />
        </div>
        {select(
          'choice',
          ['Example selection', 'Selección de ejemplo'],
          [
            ['Option A', 'Opción A'],
            ['Option B', 'Opción B'],
            ['Option C', 'Opción C'],
          ],
        )}
        <p className={s.help}>
          {tr([
            'Fictional formats demonstrate the factory pattern, event boundary and admin-managed configuration.',
            'Los formatos ficticios muestran el patrón factory, el límite de eventos y la configuración administrada.',
          ])}
        </p>
      </>
    );
  return (
    <>
      {check('cached', ['Use cached response', 'Usar respuesta en caché'])}
      {select(
        'provider',
        ['Example provider', 'Proveedor de ejemplo'],
        [
          ['Provider 1 · flat fields', 'Proveedor 1 · campos planos'],
          ['Provider 2 · team list', 'Proveedor 2 · lista de equipos'],
        ],
      )}
      {check('spoiler', ['Spoiler Shield', 'Spoiler Shield'])}
      {check('following', ['Follow a team', 'Seguir un equipo'])}
      <p className={s.help}>
        {tr([
          'A cache hit skips the provider. Spoiler Shield hides the displayed score; the normalized response still contains it.',
          'Un acierto de caché evita consultar al proveedor. Spoiler Shield oculta el marcador mostrado; la respuesta normalizada lo conserva.',
        ])}
      </p>
    </>
  );
}
