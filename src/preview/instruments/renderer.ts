import { glLayer, type Layer } from '../../../vendor/anatomy/gl.mjs';
import { instrumentFragment } from './effects';
export interface Art {
  width: number;
  height: number;
  parts: number;
  kind: string;
  camera: { origin: readonly number[]; k: number; cam: readonly number[] };
  back: string;
  front: string;
  items: readonly {
    name: string;
    key: number;
    lift: number;
    moving: boolean;
    delta: readonly number[];
    driver: string;
  }[];
  effect: {
    plane: string;
    height: number;
    rect: readonly number[];
    move?: readonly number[];
    driver?: string;
  };
}
export interface Pose {
  levels: number[];
  choice: number;
  cached: boolean;
  nativeOnly: boolean;
  windows: string[];
  position: number;
  phase: number;
  blocked: boolean;
  mask: number[];
  content: number;
  tool: number;
  playing: boolean;
  light: boolean;
}
export function mountInstrument(
  stage: HTMLDivElement,
  canvas: HTMLCanvasElement,
  art: Art,
  onReduced: () => void,
) {
  const front = stage;
  const nodes = art.items.map((item) => ({
    ...item,
    node: front.querySelector<SVGGElement>(`[data-item="${item.name}"]`)!,
  }));
  const contentNodes = [...front.querySelectorAll<SVGGElement>('[data-content]')];
  const fields = [...front.querySelectorAll<SVGGElement>('[data-field]')];
  const windows = [...front.querySelectorAll<SVGGElement>('[data-window]')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let pose: Pose = {
    levels: [0, 0],
    choice: 0,
    cached: false,
    nativeOnly: false,
    windows: [],
    position: 0,
    phase: 0,
    blocked: false,
    mask: [1, 1, 1, 1],
    content: 0,
    tool: 0,
    playing: false,
    light: false,
  };
  let layer: Layer | null = null;
  let releaseGL = () => {};
  const levels = [0, 0];
  const drivers: Record<string, number> = {};
  const mask = [1, 1, 1, 1];
  let choice = 0,
    cache = 0,
    light = 0;
  let position = 0,
    power = 0,
    last = 0,
    frame = 0,
    visible = false,
    disposed = false,
    order = '';
  const renderFallback = () => {
    stage.dataset.gl = String(Boolean(layer));
  };
  function setupGL() {
    layer = glLayer({
      canvas,
      fragment: instrumentFragment(art.kind, art.effect.plane),
      view: [art.width, art.height],
      camera: art.camera,
      uniforms: [
        'uPosition',
        'uPower',
        'uLight',
        'uHeight',
        'uRect',
        'uChoice',
        'uMask',
        'uLevels',
        'uCache',
      ],
      maxRatio: 1.5,
      onError: () => {},
    });
    renderFallback();
    if (!layer) return;
    const gl = layer.gl;
    const program = gl.getParameter(gl.CURRENT_PROGRAM) as WebGLProgram;
    const buffer = gl.getParameter(gl.ARRAY_BUFFER_BINDING) as WebGLBuffer;
    const shaders = gl.getAttachedShaders(program) ?? [];
    releaseGL = () => {
      shaders.forEach((shader) => gl.deleteShader(shader));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }
  setupGL();
  function draw(now: number) {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
    last = now;
    const weight = motion.matches ? 1 : 1 - Math.exp(-dt / 0.19);
    const targetPower = pose.blocked ? 0.16 : 1;
    position += (pose.position - position) * weight;
    power += (targetPower - power) * weight;
    levels.forEach((level, i) => {
      levels[i] = level + ((pose.levels[i] ?? 0) - level) * weight;
    });
    const targets: Record<string, number> = {
      position: pose.position,
      gate: pose.blocked ? 0 : Math.min(1, pose.phase),
      press: !pose.blocked && pose.phase === 1 ? 1 : 0,
      sheet: !pose.blocked && pose.phase === 2 ? 1 : 0,
      reed: pose.position,
      level0: pose.levels[0] ?? 0,
      level1: pose.levels[1] ?? 0,
      cache: pose.cached && pose.phase > 0 ? 1 : 0,
      button0: pose.choice === 0 && pose.phase > 0 ? 1 : 0,
      button1: pose.choice === 1 && pose.phase > 0 ? 1 : 0,
      button2: pose.choice === 2 && pose.phase > 0 ? 1 : 0,
    };
    for (const key of Object.keys(targets)) {
      drivers[key] ??= 0;
      drivers[key] += (targets[key] - drivers[key]) * weight;
      if (Math.abs(drivers[key] - targets[key]) < 0.0002) drivers[key] = targets[key];
    }
    mask.forEach((v, i) => (mask[i] = v + ((pose.mask[i] ?? 0) - v) * weight));
    choice += (pose.choice - choice) * weight;
    cache += (Number(pose.cached) - cache) * weight;
    light += (Number(pose.light) - light) * weight;
    const settled =
      Object.keys(targets).every((key) => drivers[key] === targets[key]) &&
      mask.every((v, i) => Math.abs(v - (pose.mask[i] ?? 0)) < 0.0002) &&
      Math.abs(choice - pose.choice) < 0.0002 &&
      Math.abs(cache - Number(pose.cached)) < 0.0002 &&
      Math.abs(light - Number(pose.light)) < 0.0002 &&
      levels.every((level, i) => Math.abs(level - (pose.levels[i] ?? 0)) < 0.0002) &&
      Math.abs(position - pose.position) < 0.0002 &&
      Math.abs(power - targetPower) < 0.0002;
    if (settled) {
      position = pose.position;
      power = targetPower;
    }
    nodes
      .filter((item) => item.moving)
      .forEach(({ node, delta, driver }) => {
        const value = drivers[driver] ?? 0;
        node.setAttribute('transform', `translate(${delta[0] * value} ${delta[1] * value})`);
      });
    const share = (item: (typeof nodes)[number]) => drivers[item.driver] ?? 0;
    const sorted = nodes.toSorted(
      (a, b) => a.key + a.lift * share(a) - (b.key + b.lift * share(b)),
    );
    const nextOrder = sorted.map((item) => item.name).join('|');
    if (order !== nextOrder) {
      sorted.forEach(({ node }) => node.parentElement!.append(node));
      order = nextOrder;
    }
    stage.dataset.position = position.toFixed(4);
    layer?.draw(
      {
        uPosition: position,
        uPower: power,
        uLight: light,
        uHeight: art.effect.height,
        uRect: art.effect.rect.map((v, i) =>
          i < 2
            ? v + (art.effect.move?.[i] ?? 0) * (drivers[art.effect.driver ?? 'position'] ?? 0)
            : v,
        ),
        uChoice: choice,
        uMask: mask,
        uLevels: levels,
        uCache: cache,
      },
      motion.matches ? 0.8 : now / 1000,
    );
    const liveAudio =
      layer !== null &&
      (art.kind === 'puramente' || art.kind === 'superpowered') &&
      pose.phase === 2 &&
      !pose.blocked &&
      !motion.matches;
    if (!settled || liveAudio) frame = requestAnimationFrame(draw);
  }
  function refresh() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    last = 0;
    frame = requestAnimationFrame(draw);
  }
  const observer = new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1].isIntersecting;
    refresh();
  });
  observer.observe(stage);
  const resize = new ResizeObserver(refresh);
  resize.observe(stage);
  const changeMotion = () => {
    if (motion.matches) onReduced();
    refresh();
  };
  const contextLost = (event: Event) => {
    event.preventDefault();
    layer = null;
    renderFallback();
  };
  const contextRestored = () => {
    releaseGL();
    setupGL();
    refresh();
  };
  canvas.addEventListener('webglcontextlost', contextLost);
  canvas.addEventListener('webglcontextrestored', contextRestored);
  document.addEventListener('visibilitychange', refresh);
  motion.addEventListener('change', changeMotion);
  if (motion.matches) onReduced();
  return {
    set(next: Pose) {
      pose = next;
      stage.dataset.step = String(pose.phase);
      stage.dataset.nativeOnly = String(pose.nativeOnly && pose.choice === 0);
      stage.dataset.platform = String(pose.choice);
      stage.dataset.blocked = String(pose.blocked);
      contentNodes.forEach((node) =>
        node.setAttribute('opacity', Number(node.dataset.content) === pose.content ? '1' : '0'),
      );
      fields.forEach(
        (node) => (node.dataset.active = String(Boolean(pose.mask[Number(node.dataset.field)]))),
      );
      windows.forEach(
        (node) => (node.dataset.active = String(pose.windows.includes(node.dataset.window ?? ''))),
      );
      refresh();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      motion.removeEventListener('change', changeMotion);
      document.removeEventListener('visibilitychange', refresh);
      canvas.removeEventListener('webglcontextlost', contextLost);
      canvas.removeEventListener('webglcontextrestored', contextRestored);
      layer?.clear();
      releaseGL();
    },
  };
}
