// Light is constrained to a real monitor, paper or thread plane in each instrument.
// No scene uses the former shared left-to-right inspection rail.
const fields: Record<string, string> = {
  mcp: `
    float lane=(uChoice+.5)/3.;
    float trunk=stroke(p.y,.5,.055)*(1.-smoothstep(.32,.36,p.x));
    float branch=stroke(p.y,mix(.5,lane,smoothstep(.30,.65,p.x)),.045)*smoothstep(.28,.34,p.x);
    float contact=exp(-60.*length(p-vec2(.89,lane)));
    energy=(trunk+branch+contact)*(.25+.75*uPosition);
  `,
  boards: `
    float row=floor(p.y*5.);
    float margin=.75-.08*mod(row+uChoice,3.);
    float ink=stroke(fract(p.y*5.),.5,.12)*step(.1,p.x)*(1.-smoothstep(margin,margin+.04,p.x));
    float imageBox=stroke(length((p-vec2(.5))*vec2(1.,.8)),.25,.025);
    energy=mix(ink,imageBox,step(.5,uChoice)* (1.-step(1.5,uChoice)))*uPosition;
  `,
  graphql: `
    for(int i=0;i<4;i++) {
      float enabled=i==0?uMask.x:i==1?uMask.y:i==2?uMask.z:uMask.w;
      float x=(float(i)+.5)/4.;
      float thread=stroke(p.x,x,.012);
      float knot=exp(-pow((p.y-(.12+.76*uPosition))*20.,2.));
      energy+=thread*enabled*(.25+knot);
    }
  `,
  puramente: `
    float waveA=.22*sin(p.x*54.-uTime*2.)*uLevels.x;
    float waveB=.19*sin(p.x*21.+uTime)*uLevels.y;
    energy=stroke(p.y,.5+waveA+waveB,.035)*(.2+.8*uPosition);
    energy+=.13*(stroke(p.y,.5+waveA,.015)+stroke(p.y,.5+waveB,.015));
  `,
  boom: `
    if(uChoice<.5){
      vec2 cell=fract(p*vec2(2.,3.));
      energy=(1.-smoothstep(.28,.34,length(cell-.5)))*(.25+.6*uPosition);
    }else if(uChoice<1.5){
      float arc=.15+2.5*p.x*(1.-p.x);
      energy=stroke(p.y,arc,.025)*(.3+.7*uPosition);
      energy+=.4*stroke(p.y,.12,.015);
    }else{
      float bar=floor(p.x*4.);
      float top=.22+.17*mod(bar+uPosition*2.,4.);
      energy=step(.2,fract(p.x*4.))*(1.-step(.8,fract(p.x*4.)))*step(.1,p.y)*(1.-smoothstep(top,top+.03,p.y));
    }
  `,
  seen: `
    float incoming=mix(.28,.72,uChoice);
    float route=mix(incoming,.5,smoothstep(.1,.7,p.x));
    float normalize=stroke(p.y,route,.05);
    float reuse=stroke(p.y,.5,.05);
    energy=mix(normalize,reuse,uCache)*(.25+.75*uPosition);
    energy+=stroke(p.x,.72,.018)*.4*(1.-uCache);
  `,
  superpowered: `
    float amplitude=.14+.08*uPosition;
    float wave=.5+amplitude*sin(p.x*48.-uTime*3.)+.055*sin(p.x*95.-uTime*6.);
    energy=stroke(p.y,wave,.025)*(.2+.8*uPosition);
    // Native-only and bridged paths share the same illustrative output signal.
    energy+=.12*stroke(p.y,.5,.012);
  `,
};
export function instrumentFragment(kind: string, plane: string) {
  return `
    uniform float uPosition; uniform float uPower; uniform float uLight;
    uniform float uHeight; uniform vec4 uRect; uniform float uChoice;
    uniform vec4 uMask; uniform vec2 uLevels; uniform float uCache;
    float stroke(float x,float center,float width){return 1.-smoothstep(width*.35,width,abs(x-center));}
    void main(){
      vec2 world=${plane === 'wall' ? 'onWallY(viewOf(gl_FragCoord.xy),uHeight).xz' : 'onFloor(viewOf(gl_FragCoord.xy),uHeight).xy'};
      vec2 p=(world-uRect.xy)/uRect.zw;
      vec2 fade=smoothstep(vec2(0.),vec2(.035),p)*(1.-smoothstep(vec2(.965),vec2(1.),p));
      float energy=0.;
      ${fields[kind] ?? fields.superpowered}
      float a=tonemap(vec3(max(0.,energy)*uPower),1.2).r*fade.x*fade.y;
      gl_FragColor=mix(vec4(vec3(a),a),vec4(vec3(.12)*a*.85,a*.85),uLight);
    }`;
}
