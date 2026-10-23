import { glLayer } from '../../vendor/anatomy/gl.mjs';
import { machineArt } from './generated';

const fragment = `
uniform vec2 uA; uniform vec2 uB; uniform vec2 uC; uniform vec2 uD; uniform vec2 uE;
uniform float uStrength;
float stream(vec2 p,vec2 a,vec2 b,float offset){
 vec2 v=b-a; float len=length(v); if(len<0.01)return 0.;
 float t=clamp(dot(p-a,v)/dot(v,v),0.,1.);
 float d=length(p-a-v*t);
 float edge=1.-smoothstep(.45,1.15,d);
 float wave=.65+.35*sin((offset+t*len)*.28-uTime*9.);
 return edge*wave;
}
void main(){
 vec2 p=onFloor(viewOf(gl_FragCoord.xy),1.).xy;
 float ab=length(uB-uA),bc=length(uC-uB),cd=length(uD-uC);
 float f=max(max(stream(p,uA,uB,0.),stream(p,uB,uC,ab)),max(stream(p,uC,uD,ab+bc),stream(p,uD,uE,ab+bc+cd)));
 float a=f*uStrength;
 gl_FragColor=vec4(vec3(.66,.25,.10)*a,a);
}`;

export function createFlow(canvas: HTMLCanvasElement) {
  const layer = glLayer({
    canvas,
    fragment,
    view: [machineArt.width, machineArt.height],
    camera: machineArt.camera,
    uniforms: ['uA', 'uB', 'uC', 'uD', 'uE', 'uStrength'],
    maxRatio: 1.5,
    onError: () => {},
  });
  if (!layer) return null;
  const { gl } = layer;
  const program = gl.getParameter(gl.CURRENT_PROGRAM) as WebGLProgram;
  const buffer = gl.getParameter(gl.ARRAY_BUFFER_BINDING) as WebGLBuffer;
  const shaders = gl.getAttachedShaders(program) ?? [];
  return {
    ...layer,
    dispose() {
      layer.clear();
      shaders.forEach((shader) => gl.deleteShader(shader));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}
