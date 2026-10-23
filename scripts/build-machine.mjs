import { writeFileSync } from 'node:fs';
import * as k from '../vendor/anatomy/iso-kit.mjs';
import * as A from '../vendor/anatomy/audit.mjs';
import * as G from '../vendor/anatomy/lathe.mjs';
import { glCamera } from '../vendor/anatomy/gl.mjs';

const W = 800,
  H = 430;
const plate = { x: -145, y: -83, w: 290, d: 166, r: 9 };
const P = k.fitProjection([...k.boxCorners(plate, -14, 68)], W, H, {
  pad: 42,
  azimuth: 35,
  elevation: 32,
});
const R = A.recorder(P);
const S = (paths, options = {}) => k.solidSvg(paths, { tone: 'mid', ...options });
const L = (d, tone = 'lo') => k.lineSvg(d, { tone });
const at = (point) => k.iso(point, P);

function box(name, plan, z, height, component = 'frame', extra = '') {
  const shape = R.solid(
    A.box([plan.x, plan.y, z], [plan.x + plan.w, plan.y + plan.d, z + height], {
      name,
      ground: name.startsWith('stand.'),
    }),
  );
  R.put({
    name,
    component,
    at: [plan.x + plan.w / 2, plan.y + plan.d / 2, z + height / 2],
    shapes: [shape],
    svg: S(k.slabOf(plan, z, height, P, 6, 0.5)) + extra,
  });
}
function cylinder(name, x, y, radius, z, height, component = 'frame', extra = '', lit = false) {
  const F = G.frameAlong([x, y, 0], [0, 0, 1]);
  const shape = R.solid(
    A.disc(F, z, z + height, radius, { name, ground: name.startsWith('stand.') }),
  );
  R.put({
    name,
    component,
    at: [x, y, z + height / 2],
    shapes: [shape],
    svg: S(k.cylinder(x, y, radius, z, height, P, 48, 0.3), { tone: 'hi', lit }) + extra,
  });
}

for (const [i, [x, y]] of k.corners(plate, 18).entries()) {
  cylinder(`stand.foot-${i}`, x, y, 6, -14, 6);
}
box('stand.deck', plate, -8, 8, 'frame', L(k.planOutline(k.insetPlan(plate, 5), 0, P)));
for (const [i, [x, y]] of k.corners(plate, 10).entries())
  cylinder(`deck-bolt-${i}`, x, y, 1.8, 0, 1);

const centers = {
  request: [-105, 34],
  cache: [-73, -39],
  adapter: [18, -39],
  normalize: [100, -23],
  response: [85, 47],
};
const nodes = {};
for (const [name, [x, y]] of Object.entries(centers)) {
  box(`${name}.mount`, { x: x - 20, y: y - 19, w: 40, d: 38, r: 3 }, 0, 3, name);
  for (const [i, [dx, dy]] of [
    [-16, -15],
    [16, -15],
    [-16, 15],
    [16, 15],
  ].entries())
    cylinder(`${name}.bolt-${i}`, x + dx, y + dy, 1.4, 3, 1, name);
  nodes[name] = at([x, y, 42]);
}

// Each housing meets its mount. The clear channels carry the simulated response.
{
  const [x, y] = centers.request;
  cylinder('request.housing', x, y, 13, 3, 12, 'request');
  cylinder('request.collar', x, y, 7, 15, 5, 'request');
  cylinder('request.stem', x, y, 2.5, 20, 18, 'request');
  cylinder(
    'request.button',
    x,
    y,
    10,
    38,
    5,
    'request',
    L(k.ring(x, y, 7, 43, P, 40), 'mid'),
    true,
  );
}
{
  const [x, y] = centers.cache;
  cylinder('cache.base', x, y, 16, 3, 4, 'cache');
  cylinder('cache.reservoir', x, y, 13, 7, 35, 'cache');
  cylinder('cache.lid', x, y, 16, 42, 4, 'cache', L(k.ring(x, y, 12, 46, P, 48)));
  cylinder('cache.neck', x, y, 4, 46, 5, 'cache');
  cylinder('cache.valve', x, y, 9, 51, 3, 'cache', L(k.ring(x, y, 6, 54, P, 32)));
  for (let i = 0; i < 4; i++) {
    const y1 = y + 13;
    box(`cache.level-${i}`, { x: x - 7, y: y1, w: 14, d: 1, r: 0.2 }, 11 + i * 7, 1, 'cache');
  }
}
{
  const [x, y] = centers.adapter;
  cylinder('adapter.base', x, y, 17, 3, 5, 'adapter');
  cylinder('adapter.selector', x, y, 13, 8, 14, 'adapter');
  cylinder('adapter.dial', x, y, 17, 22, 4, 'adapter', L(k.ring(x, y, 14, 26, P, 48)));
  cylinder('adapter.hub', x, y, 3, 26, 3, 'adapter');
  const ticks = k.radialTicks(x, y, 13, 24, 4, 26, [1.7, 3.4], P);
  R.items.at(-2).svg += L(ticks.minor) + L(ticks.major, 'mid');
}
{
  const [x, y] = centers.normalize;
  cylinder('normalize.foot', x, y, 16, 3, 5, 'normalize');
  cylinder('normalize.chamber', x, y, 12, 8, 25, 'normalize');
  cylinder('normalize.flange', x, y, 16, 33, 4, 'normalize', L(k.ring(x, y, 13, 37, P, 48)));
  cylinder('normalize.motor', x, y, 8, 37, 18, 'normalize');
  cylinder('normalize.cap', x, y, 9, 55, 3, 'normalize');
}
{
  const [x, y] = centers.response;
  box('response.plinth', { x: x - 17, y: y - 13, w: 34, d: 26, r: 2 }, 3, 7, 'response');
  box('response.case', { x: x - 17, y: y - 13, w: 34, d: 26, r: 2 }, 10, 18, 'response');
  box('response.face', { x: x - 14, y: y - 10, w: 28, d: 20, r: 1 }, 28, 0.8, 'response');
  for (let i = 0; i < 3; i++)
    box(
      `response.display-${i}`,
      { x: x - 10, y: y - 7 + i * 5, w: 20 - i * 4, d: 1.4, r: 0.1 },
      28.8,
      0.3,
      'response',
    );
}

const worldRoutes = {
  request: [
    [-105, 15, 1],
    [-105, -4, 1],
    [-73, -4, 1],
    [-73, -20, 1],
  ],
  cache: [
    [-53, -39, 1],
    [-2, -39, 1],
  ],
  adapter: [
    [38, -39, 1],
    [61, -39, 1],
    [61, -23, 1],
    [80, -23, 1],
  ],
  normalize: [
    [100, -4, 1],
    [100, 14, 1],
    [85, 14, 1],
    [85, 28, 1],
  ],
  hit: [
    [-73, -20, 1],
    [-73, 6, 1],
    [10, 6, 1],
    [10, 47, 1],
    [65, 47, 1],
  ],
};
let channelMarkup = '';
for (const [id, points] of Object.entries(worldRoutes)) {
  const d = k.pathOf(points.map(at), false);
  channelMarkup += `<path d="${d}" fill="none" stroke="#777b6b" stroke-width="6" stroke-linejoin="round"/><path data-route="${id}" d="${d}" fill="none" stroke="#e6e7dd" stroke-width="3.7" stroke-linejoin="round"/>`;
}

A.settle(R, P);
A.auditOrExit(R, P);
const sorted = R.items.toSorted((a, b) => a.key - b.key);
const wrap = (item) => `<g data-component="${item.component}">${item.svg}</g>`;
const back =
  sorted
    .filter((item) => item.component === 'frame')
    .map(wrap)
    .join('') + channelMarkup;
const front = sorted
  .filter((item) => item.component !== 'frame')
  .map(wrap)
  .join('');
const routes = Object.fromEntries(
  Object.entries(worldRoutes).map(([id, points]) => [id, points.map(at)]),
);
writeFileSync(
  'src/system/generated.ts',
  `// Generated by scripts/build-machine.mjs.\nexport const machineArt = ${JSON.stringify({ width: W, height: H, back, front, nodes, routes, worldRoutes, camera: glCamera(P), parts: R.solids.length })} as const;\n`,
);
writeFileSync(
  'docs/machine-parts.json',
  JSON.stringify(
    R.solids.map(({ name, kind }) => ({ name, kind })),
    null,
    2,
  ) + '\n',
);
console.log(`Machine: ${R.solids.length} audited solids.`);
