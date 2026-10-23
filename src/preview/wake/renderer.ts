import { createWater } from './simulation';

const vertexSource = `
attribute vec2 position;
varying vec2 uv;
void main() { uv = position * .5 + .5; gl_Position = vec4(position, 0., 1.); }
`;
const fragmentSource = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D water;
uniform vec2 texel;
uniform float fade;
uniform float dark;
varying vec2 uv;
float heightAt(vec2 p) {
  vec2 encoded = texture2D(water, p).rg;
  return dot(encoded, vec2(256. / 257., 1. / 257.)) * 4. - 2.;
}
void main() {
  vec2 slope = vec2(
    heightAt(uv + vec2(texel.x, 0.)) - heightAt(uv - vec2(texel.x, 0.)),
    heightAt(uv + vec2(0., texel.y)) - heightAt(uv - vec2(0., texel.y))
  );
  vec3 normal = normalize(vec3(slope * 3.8, 1.));
  vec3 light = normalize(vec3(-.45, .65, 1.));
  float relief = dot(normal, light) - light.z;
  float edge = smoothstep(0., .045, min(min(uv.x, 1. - uv.x), min(uv.y, 1. - uv.y)));
  float alpha = min(abs(relief) * .52 + length(slope) * .08, .13) * fade * edge;
  // Silver ridges on charcoal; graphite ridges on paper. No screen blending in light mode.
  float tone = dark > .5 ? (relief > 0. ? 1. : 0.) : (relief > 0. ? 0. : .55);
  gl_FragColor = vec4(vec3(tone), alpha);
}
`;

export function createWake(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
  });
  if (!gl) return null;
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  const texture = gl.createTexture();
  const vertex = gl.createShader(gl.VERTEX_SHADER);
  const fragment = gl.createShader(gl.FRAGMENT_SHADER);
  function release() {
    gl!.deleteProgram(program);
    gl!.deleteBuffer(buffer);
    gl!.deleteTexture(texture);
    gl!.deleteShader(vertex);
    gl!.deleteShader(fragment);
  }
  if (!program || !buffer || !texture || !vertex || !fragment) {
    release();
    return null;
  }
  gl.shaderSource(vertex, vertexSource);
  gl.shaderSource(fragment, fragmentSource);
  gl.compileShader(vertex);
  gl.compileShader(fragment);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.bindAttribLocation(program, 0, 'position');
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    release();
    return null;
  }
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const texel = gl.getUniformLocation(program, 'texel');
  const fade = gl.getUniformLocation(program, 'fade');
  const dark = gl.getUniformLocation(program, 'dark');
  gl.uniform1i(gl.getUniformLocation(program, 'water'), 0);
  let width = 0,
    height = 0,
    columns = 0,
    rows = 0;
  let water: ReturnType<typeof createWater>;
  let frame = 0,
    previousTime = 0,
    accumulator = 0,
    lastInput = 0;
  let origin: { x: number; y: number } | null = null;
  let pointer: { x: number; y: number } | null = null;
  let disposed = false;

  function clear() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    accumulator = 0;
    origin = pointer = null;
    water?.clear();
    if (!gl!.isContextLost()) gl!.clear(gl!.COLOR_BUFFER_BIT);
  }
  function resize() {
    clear();
    width = Math.max(1, canvas.clientWidth);
    height = Math.max(1, canvas.clientHeight);
    const scale = Math.min(1, 1600 / Math.max(width, height));
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const gridScale = Math.min(1 / 7, 192 / Math.max(width, height));
    columns = Math.max(16, Math.round(width * gridScale));
    rows = Math.max(16, Math.round(height * gridScale));
    water = createWater(columns, rows);
    gl!.viewport(0, 0, canvas.width, canvas.height);
    gl!.uniform2f(texel, 1 / columns, 1 / rows);
    gl!.texImage2D(
      gl!.TEXTURE_2D,
      0,
      gl!.RGBA,
      columns,
      rows,
      0,
      gl!.RGBA,
      gl!.UNSIGNED_BYTE,
      water.texture(),
    );
  }
  function draw(time: number) {
    frame = 0;
    if (disposed || document.hidden || gl!.isContextLost()) {
      clear();
      return;
    }
    const elapsed = previousTime ? Math.min(50, time - previousTime) : 1000 / 60;
    previousTime = time;
    if (origin && pointer) {
      const distance = Math.hypot(pointer.x - origin.x, pointer.y - origin.y);
      if (distance > 0.5 && distance < 250) {
        const strength = Math.min(1, 0.15 + (distance / Math.max(1, elapsed)) * 0.5);
        water.disturb(
          (origin.x / width) * columns,
          (1 - origin.y / height) * rows,
          (pointer.x / width) * columns,
          (1 - pointer.y / height) * rows,
          strength * (elapsed / (1000 / 60)),
        );
        lastInput = time;
      }
      origin = pointer;
    }
    const age = time - lastInput;
    if (age > 2200) {
      clear();
      return;
    }
    accumulator += elapsed;
    while (accumulator >= 1000 / 60) {
      water.step();
      accumulator -= 1000 / 60;
    }
    gl!.texSubImage2D(
      gl!.TEXTURE_2D,
      0,
      0,
      0,
      columns,
      rows,
      gl!.RGBA,
      gl!.UNSIGNED_BYTE,
      water.texture(),
    );
    gl!.uniform1f(fade, Math.min(1, Math.max(0, (2200 - age) / 700)));
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    frame = requestAnimationFrame(draw);
  }
  function move(event: PointerEvent) {
    if (event.pointerType === 'touch' || document.hidden || disposed || gl!.isContextLost()) return;
    pointer = { x: event.clientX, y: event.clientY };
    if (!origin) {
      origin = pointer;
      return;
    }
    if (!frame) {
      previousTime = 0;
      frame = requestAnimationFrame(draw);
    }
  }
  function leave(event: PointerEvent) {
    if (!event.relatedTarget) origin = pointer = null;
  }
  function theme() {
    gl!.uniform1f(dark, document.documentElement.dataset.theme === 'dark' ? 1 : 0);
  }
  // Clearing on navigation/scroll prevents a stale wake from jumping between reading surfaces.
  const observer = new ResizeObserver(resize);
  const themeObserver = new MutationObserver(theme);
  resize();
  theme();
  observer.observe(canvas);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('pointerout', leave, { passive: true });
  window.addEventListener('blur', clear);
  window.addEventListener('scroll', clear, { passive: true });
  window.addEventListener('hashchange', clear);
  document.addEventListener('visibilitychange', clear);

  return () => {
    disposed = true;
    clear();
    observer.disconnect();
    themeObserver.disconnect();
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerout', leave);
    window.removeEventListener('blur', clear);
    window.removeEventListener('scroll', clear);
    window.removeEventListener('hashchange', clear);
    document.removeEventListener('visibilitychange', clear);
    release();
  };
}
