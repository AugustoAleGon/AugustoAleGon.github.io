import { writeFileSync } from 'node:fs';
import * as k from '../vendor/anatomy/iso-kit.mjs';
import * as A from '../vendor/anatomy/audit.mjs';
import * as G from '../vendor/anatomy/lathe.mjs';
import { glCamera } from '../vendor/anatomy/gl.mjs';

// Figure: an input console, a rotary access gate and an output patch bank.
// Parts: deck, four feet, four bolts; three mounts with four bolts each;
// terminal, bezel, display, twelve keys; gate base, collar, dial, grip;
// three output housings with inset tops and four connectors each.
const width = 850,
  height = 450;
const plate = { x: -155, y: -91, w: 310, d: 182, r: 10 };
const P = k.fitProjection(k.boxCorners(plate, -14, 65), width, height, {
  pad: 44,
  azimuth: 53,
  elevation: 33,
});
const R = A.recorder(P);
const at = (point) => k.iso(point, P);
const L = (d, tone = 'lo') => k.lineSvg(d, { tone });
function box(name, plan, z, h, component, extra = '') {
  const shape = R.solid(
    A.box([plan.x, plan.y, z], [plan.x + plan.w, plan.y + plan.d, z + h], {
      name,
      ground: name.startsWith('foot'),
    }),
  );
  R.put({
    name,
    component,
    at: [plan.x + plan.w / 2, plan.y + plan.d / 2, z + h / 2],
    shapes: [shape],
    svg: k.solidSvg(k.slabOf(plan, z, h, P, 8, 0.4), { tone: 'mid' }) + extra,
  });
}
function round(name, x, y, r, z, h, component, extra = '') {
  const shape = R.solid(
    A.disc(G.frameAlong([x, y, 0], [0, 0, 1]), z, z + h, r, {
      name,
      ground: name.startsWith('foot'),
    }),
  );
  R.put({
    name,
    component,
    at: [x, y, z + h / 2],
    shapes: [shape],
    svg: k.solidSvg(k.cylinder(x, y, r, z, h, P, 48, 0.3), { tone: 'mid' }) + extra,
  });
}
for (const [i, [x, y]] of k.corners(plate, 17).entries())
  round(`foot-${i}`, x, y, 7, -14, 7, 'base');
box('deck', plate, -7, 7, 'base', L(k.planOutline(k.insetPlan(plate, 5), 0, P)));
for (const [i, [x, y]] of k.corners(plate, 10).entries())
  round(
    `deck-bolt-${i}`,
    x,
    y,
    2,
    0,
    1,
    'base',
    L(k.pathOf([at([x - 1, y, 1]), at([x + 1, y, 1])], false)),
  );
const mounts = [
  { x: -129, y: -20, w: 71, d: 81, r: 4 },
  { x: -37, y: -53, w: 74, d: 83, r: 4 },
  { x: 62, y: -64, w: 69, d: 88, r: 4 },
];
mounts.forEach((plan, i) => {
  box(`mount-${i}`, plan, 0, 4, `${i}`);
  for (const [j, [x, y]] of k.corners(plan, 5).entries())
    round(`mount-${i}-bolt-${j}`, x, y, 1.4, 4, 1, `${i}`);
});
box(
  'terminal-case',
  { x: -122, y: -13, w: 57, d: 66, r: 4 },
  4,
  22,
  '0',
  L(k.planOutline({ x: -119, y: -10, w: 51, d: 60, r: 3 }, 26, P)),
);
box('terminal-bezel', { x: -116, y: -7, w: 45, d: 31, r: 2 }, 26, 3, '0');
box(
  'terminal-display',
  { x: -113, y: -4, w: 39, d: 25, r: 1 },
  29,
  0.5,
  '0',
  L(k.planOutline({ x: -110, y: -1, w: 33, d: 19, r: 1 }, 29.5, P), 'hi'),
);
for (let row = 0; row < 3; row++)
  for (let col = 0; col < 4; col++)
    box(
      `key-${row}-${col}`,
      { x: -116 + col * 11, y: 31 + row * 6, w: 8, d: 4.5, r: 0.7 },
      26,
      2,
      '0',
    );
round('gate-base', 0, -10, 29, 4, 7, '1');
round('gate-body', 0, -10, 25, 11, 27, '1');
round('gate-collar', 0, -10, 29, 38, 4, '1', L(k.ring(0, -10, 26, 42, P, 64)));
round('gate-dial', 0, -10, 22, 42, 6, '1', L(k.ring(0, -10, 18, 48, P, 64), 'hi'));
box('gate-grip', { x: -3, y: -26, w: 6, d: 32, r: 2 }, 48, 5, '1');
for (let n = 0; n < 16; n++) {
  const a = (n * Math.PI) / 8;
  const x = Math.cos(a) * 26,
    y = -10 + Math.sin(a) * 26;
  // These are etched scale marks, on the collar's top face.
  const path = L(
    k.pathOf([at([x, y, 42]), at([Math.cos(a) * 28, -10 + Math.sin(a) * 28, 42])], false),
  );
  R.items.find((item) => item.name === 'gate-collar').svg += path;
}
for (let i = 0; i < 3; i++) {
  const z = 4 + i * 16;
  box(`rack-${i}`, { x: 68, y: -58, w: 57, d: 75, r: 3 }, z, 16, '2');
  // Inset outline is an engraved seam; it introduces no intersecting solid.
  const top = L(k.planOutline({ x: 72, y: -54, w: 49, d: 67, r: 2 }, z + 16, P));
  R.items.find((item) => item.name === `rack-${i}`).svg += top;
}
for (let col = 0; col < 4; col++)
  for (let row = 0; row < 3; row++)
    round(
      `jack-${row}-${col}`,
      78 + col * 12,
      -43 + row * 19,
      3,
      52,
      2,
      '2',
      L(k.ring(78 + col * 12, -43 + row * 19, 1.5, 54, P, 24), 'hi'),
    );
// Signals occupy etched channels on the deck, clear of the housings.
const worldRoutes = [
  [
    [-94, 61, 1],
    [-94, 72, 1],
    [0, 72, 1],
    [0, 30, 1],
  ],
  [
    [37, -10, 1],
    [48, -10, 1],
    [48, 38, 1],
    [96, 38, 1],
    [96, 24, 1],
  ],
];
const channels = worldRoutes
  .map(
    (points, i) =>
      `<path data-signal="${i}" d="${k.pathOf(points.map(at), false)}" fill="none" stroke="#494949" stroke-width="2.5" stroke-linejoin="round"/>`,
  )
  .join('');
A.settle(R, P);
A.auditOrExit(R, P);
const sorted = R.items.toSorted((a, b) => a.key - b.key);
const markup = (item) => `<g data-module="${item.component}">${item.svg}</g>`;
const camera = glCamera(P);
// Trigonometric results vary in their last bits across macOS and Linux.
// Keep generated constants stable at a precision well above WebGL's float32 uniforms.
camera.k = Number(camera.k.toFixed(12));
camera.cam = camera.cam.map((value) => Number(value.toFixed(12)));
const art = {
  width,
  height,
  back:
    sorted
      .filter((item) => item.component === 'base')
      .map(markup)
      .join('') + channels,
  front: sorted
    .filter((item) => item.component !== 'base')
    .map(markup)
    .join(''),
  worldRoutes,
  camera,
  parts: R.solids.length,
};
writeFileSync(
  'src/preview/console.generated.ts',
  `// Generated by scripts/build-console.mjs.\nexport const consoleArt = ${JSON.stringify(art)} as const;\n`,
);
writeFileSync(
  'docs/console-parts.json',
  JSON.stringify(
    R.solids.map(({ name, kind }) => ({ name, kind })),
    null,
    2,
  ) + '\n',
);
console.log(`Access console: ${R.solids.length} audited solids.`);
