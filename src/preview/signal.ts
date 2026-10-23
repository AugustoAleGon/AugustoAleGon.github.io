import { glLayer } from '../../vendor/anatomy/gl.mjs';
import { consoleArt } from './console.generated';

const fragment = `
uniform float uFirst; uniform float uSecond;
float line(vec2 p,vec2 a,vec2 b){
 vec2 v=b-a; float t=clamp(dot(p-a,v)/dot(v,v),0.,1.);
 float d=length(p-a-v*t);
 return exp(-d*d*.55)*(1.-smoothstep(3.,5.,d));
}
void main(){
 vec2 p=onFloor(viewOf(gl_FragCoord.xy),1.).xy;
 float a=max(max(line(p,vec2(-94.,61.),vec2(-94.,72.)),line(p,vec2(-94.,72.),vec2(0.,72.))),line(p,vec2(0.,72.),vec2(0.,30.)));
 float b=max(max(line(p,vec2(37.,-10.),vec2(48.,-10.)),line(p,vec2(48.,-10.),vec2(48.,38.))),max(line(p,vec2(48.,38.),vec2(96.,38.)),line(p,vec2(96.,38.),vec2(96.,24.))));
 float alpha=1.-exp(-(a*uFirst+b*uSecond)*1.7);
 gl_FragColor=vec4(vec3(.85)*alpha,alpha);
}`;

export function createSignal(canvas: HTMLCanvasElement) {
  const layer = glLayer({
    canvas,
    fragment,
    view: [consoleArt.width, consoleArt.height],
    camera: consoleArt.camera,
    uniforms: ['uFirst', 'uSecond'],
    maxRatio: 1.5,
    onError: () => {},
  });
  if (!layer) return null;
  const { gl } = layer;
  const program = gl.getParameter(gl.CURRENT_PROGRAM) as WebGLProgram;
  const buffer = gl.getParameter(gl.ARRAY_BUFFER_BINDING) as WebGLBuffer;
  const shaders = gl.getAttachedShaders(program) ?? [];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let step = 0,
    first = 0,
    second = 0,
    frame = 0,
    start = 0,
    visible = false;
  function draw(time: number) {
    const targetA = step > 0 ? 1 : 0;
    const targetB = step > 1 ? 1 : 0;
    const done = motion.matches || time - start > 650;
    first = done ? targetA : first + (targetA - first) * 0.16;
    second = done ? targetB : second + (targetB - second) * 0.16;
    layer!.draw({ uFirst: first, uSecond: second }, time / 1000);
    if (!done && visible && !document.hidden) frame = requestAnimationFrame(draw);
  }
  function refresh() {
    cancelAnimationFrame(frame);
    if (!visible || document.hidden) return;
    start = performance.now();
    frame = requestAnimationFrame(draw);
  }
  const resize = new ResizeObserver(refresh);
  resize.observe(canvas);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    refresh();
  });
  observer.observe(canvas);
  document.addEventListener('visibilitychange', refresh);
  motion.addEventListener('change', refresh);
  return {
    setStep(value: number) {
      step = value;
      refresh();
    },
    dispose() {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      document.removeEventListener('visibilitychange', refresh);
      motion.removeEventListener('change', refresh);
      layer.clear();
      shaders.forEach((shader) => gl.deleteShader(shader));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}
