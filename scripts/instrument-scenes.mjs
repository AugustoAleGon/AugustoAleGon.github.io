// Each scene has its own silhouette, mechanism, projection and optical surface.
export const scenes = {
  mcp: {
    bounds: { x: -100, y: -50, w: 200, d: 100 },
    top: 146,
    azimuth: 28,
    elevation: 23,
    build({ box, base, ribs }) {
      base(-100, -50, 200, 100);
      for (const [i, x] of [-88, 80].entries())
        box(`rack-upright-${i}`, x, -30, 8, 45, 0, 136, { panel: true });
      box('rack-roof', -88, -30, 176, 45, 136, 7, { panel: true });
      box('rack-back', -80, -30, 160, 5, 0, 136);
      for (let i = 0; i < 3; i++) {
        const z = 12 + i * 27;
        box(`patch-bank-${i}`, -80, -25, 160, 23, z, 20, { module: '2' });
        for (let j = 0; j < 3; j++) {
          box(`socket-collar-${i}-${j}`, -65 + j * 48, -2, 17, 5, z + 5, 12, { module: '2' });
          box(`socket-${i}-${j}`, -62 + j * 48, 3, 11, 2, z + 8, 6, {
            module: '2',
            window: j === 1 ? `tool-${i}` : undefined,
            tone: 'lo',
          });
        }
      }
      box('optical-monitor', -80, -25, 160, 28, 96, 32, { module: '1', tone: 'lo' });
      box('monitor-top', -76, 3, 152, 3, 124, 3);
      box('monitor-bottom', -76, 3, 152, 3, 99, 3);
      for (const [i, x] of [-76, 73].entries()) box(`monitor-side-${i}`, x, 3, 3, 3, 102, 22);
      box('access-guide', -74, 19, 148, 20, 0, 3, { module: '0', panel: true });
      box('access-shutter', -70, 22, 40, 14, 3, 4, {
        module: '0',
        move: [90, 0, 0],
        driver: 'gate',
        window: 'identity',
      });
      box('access-handle', -57, 25, 14, 8, 7, 3, { module: '0', move: [90, 0, 0], driver: 'gate' });
      ribs('roof-vent', -50, -23, 100, 8, 143);
      return { plane: 'wall', height: 3.1, rect: [-72, 103, 144, 20] };
    },
  },
  boards: {
    bounds: { x: -100, y: -80, w: 200, d: 180 },
    top: 108,
    azimuth: 44,
    elevation: 31,
    build({ box, base, ribs, line, plan, P, k }) {
      base(-100, -80, 200, 180);
      for (const [i, x] of [-76, 68].entries()) {
        box(`press-shoe-${i}`, x - 5, -12, 18, 35, 0, 5, { panel: true });
        box(`press-column-${i}`, x, -7, 8, 25, 5, 88);
      }
      box('crosshead', -76, -7, 152, 25, 93, 10, { panel: true, module: '1' });
      box('platen-guide', -5, -5, 10, 21, 12, 81, { module: '1' });
      box('platen', -62, 16, 124, 43, 45, 7, { module: '1', move: [0, 0, -25], driver: 'press' });
      box('platen-sleeve', -5, 16, 10, 6, 52, 41, {
        module: '1',
        move: [0, 0, -25],
        driver: 'press',
      });
      box('paper-bed', -62, 16, 124, 76, 0, 5, { panel: true, module: '2' });
      const note = box('note-plate', -57, 20, 114, 40, 5, 1, {
        tone: 'hi',
        module: '0',
        move: [0, 28, 0],
        driver: 'sheet',
      });
      note.svg += Array.from(
        { length: 4 },
        (_, i) =>
          `<g data-content="${i}" opacity="${i ? 0 : 1}">${line(k.planOutline(plan(-50, 25, 100, 30, 1), 6, P), 'mid')}${[0, 1, 2].map((j) => line(k.lineOnTop([-45, 30 + j * 8], [38 - i * 8, 30 + j * 8], 6, P), 'hi', true)).join('')}</g>`,
      ).join('');
      for (let i = 0; i < 4; i++) {
        const x = -83 + i * 44;
        box(`type-mount-${i}`, x, -65, 34, 40, 0, 3, { panel: true });
        box(`type-block-${i}`, x + 3, -62, 28, 31, 3, 10, { window: `type-${i}`, module: '0' });
        box(`type-tab-${i}`, x + 10, -35, 14, 3, 13, 2);
      }
      for (let i = 0; i < 3; i++) {
        box(`member-mount-${i}`, 78, 28 + i * 21, 14, 17, 0, 4);
        box(`member-clip-${i}`, 80, 30 + i * 21, 10, 13, 4, 5, { field: i, module: '2' });
        box(`member-handle-${i}`, 79, 34 + i * 21, 12, 3, 9, 2, { field: i, module: '2' });
      }
      ribs('crosshead-ridge', -55, -4, 110, 4, 103);
      return {
        plane: 'floor',
        height: 6.1,
        rect: [-49, 25, 98, 30],
        move: [0, 28],
        driver: 'sheet',
      };
    },
  },
  graphql: {
    bounds: { x: -105, y: -48, w: 210, d: 98 },
    top: 140,
    azimuth: 30,
    elevation: 26,
    build({ box, base, ribs }) {
      base(-105, -48, 210, 98);
      for (const [i, x] of [-91, 83].entries())
        box(`loom-post-${i}`, x, -18, 8, 35, 0, 124, { panel: true });
      box('upper-beam', -91, -18, 182, 35, 124, 8, { panel: true });
      box('lower-beam', -83, -18, 166, 35, 3, 8, { panel: true });
      // A dark backing makes the thin selected strands legible in both themes.
      box('thread-backing', -83, -18, 166, 4, 11, 113, { tone: 'lo' });
      for (let i = 0; i < 4; i++) {
        const x = -66 + i * 44;
        box(`bobbin-${i}`, x - 10, -12, 20, 22, 132, 5, { r: 9, module: '0', field: i });
        box(`bobbin-hub-${i}`, x - 3, -5, 6, 8, 137, 3, { r: 3, module: '0', field: i });
        box(`thread-${i}`, x - 1, -12, 2, 2, 11, 113, { module: '1', field: i, tone: 'hi' });
        box(`resolver-${i}`, x - 12, 18, 24, 20, 0, 8, {
          module: '1',
          field: i,
          window: `resolver-${i}`,
        });
        box(`response-${i}`, x - 8, 22, 16, 12, 8, 2, { module: '2', field: i });
      }
      box('reed-rail', -83, -10, 166, 6, 30, 4, { move: [0, 0, 65], driver: 'reed', module: '1' });
      for (let i = 0; i < 8; i++)
        box(`reed-tooth-${i}`, -78 + i * 21, -10, 3, 6, 34, 9, {
          move: [0, 0, 65],
          driver: 'reed',
          module: '1',
        });
      ribs('beam-tick', -76, -10, 152, 6, 11);
      return { plane: 'wall', height: -9.8, rect: [-78, 14, 156, 105] };
    },
  },
  puramente: {
    bounds: { x: -120, y: -85, w: 240, d: 170 },
    top: 54,
    azimuth: 44,
    elevation: 46,
    build({ box, base, ribs }) {
      base(-120, -85, 240, 170, 25);
      box('scope', -95, -72, 190, 17, 18, 2, { tone: 'lo', panel: true });
      for (let i = 0; i < 2; i++) {
        const x = -60 + i * 120;
        box(`reel-seat-${i}`, x - 30, -40, 60, 60, 18, 3, { r: 29 });
        box(`reel-${i}`, x - 27, -37, 54, 54, 21, 5, { r: 27, module: '2' });
        box(`reel-hub-${i}`, x - 9, -19, 18, 18, 26, 5, { r: 9, module: '2' });
        for (let j = 0; j < 4; j++)
          box(
            `reel-mark-${i}-${j}`,
            x + (j % 2 ? 14 : -17),
            -26 + Math.floor(j / 2) * 28,
            3,
            5,
            26,
            0.6,
            { module: '2' },
          );
        box(`channel-panel-${i}`, x - 30, 30, 60, 43, 18, 2, {
          panel: true,
          window: `channel-${i}`,
          module: '1',
        });
        box(`fader-${i}`, x - 10, 34, 20, 7, 20, 3, {
          fader: i,
          move: [0, 24, 0],
          driver: `level${i}`,
          module: '1',
        });
        box(`source-${i}`, x - 8, 1, 16, 7, 26, 1, { window: `source-${i}`, module: '0' });
        for (let j = 0; j < 5; j++)
          box(`channel-mark-${i}-${j}`, x + 20, 35 + j * 7, 5, 1, 20, 0.4);
      }
      box('tape-head', -14, -25, 28, 35, 18, 11, { panel: true, module: '2' });
      box('health-pad', -14, 48, 28, 17, 18, 2, { field: 3, module: '2', panel: true });
      ribs('speaker', -14, 12, 28, 8, 18);
      return { plane: 'floor', height: 20.1, rect: [-91, -69, 182, 11] };
    },
  },
  boom: {
    bounds: { x: -80, y: -60, w: 160, d: 120 },
    top: 178,
    azimuth: 32,
    elevation: 23,
    build({ box, base, ribs }) {
      base(-80, -60, 160, 120);
      box('cabinet', -68, -50, 136, 85, 0, 153, { panel: true });
      box('marquee', -68, -50, 136, 85, 153, 21, { panel: true, module: '0' });
      box('screen-recess', -58, 35, 116, 3, 68, 75, { tone: 'lo', module: '1' });
      for (const [i, x] of [-62, 58].entries()) box(`bezel-side-${i}`, x, 35, 4, 7, 64, 83);
      for (const [i, z] of [64, 143].entries()) box(`bezel-edge-${i}`, -58, 35, 116, 7, z, 4);
      box('control-shelf', -62, 35, 124, 22, 43, 8, { panel: true });
      for (let i = 0; i < 3; i++) {
        box(`button-seat-${i}`, -48 + i * 40, 40, 16, 12, 51, 2, { r: 5 });
        box(`button-${i}`, -46 + i * 40, 42, 12, 8, 53, 3, {
          r: 4,
          module: '1',
          move: [2, 0, 0],
          driver: `button${i}`,
          window: `format-${i}`,
        });
        box(`cartridge-${i}`, -52 + i * 40, -40, 24, 20, 174, 3, { module: '0' });
      }
      box('coin-slot', -10, 35, 20, 3, 19, 16, { module: '2', window: 'admin' });
      for (let i = 0; i < 9; i++) box(`speaker-rib-${i}`, -49 + i * 12, 35, 3, 2, 8, 9);
      ribs('top-vents', -55, -16, 110, 8, 174);
      return { plane: 'wall', height: 38.1, rect: [-54, 72, 108, 67] };
    },
  },
  seen: {
    bounds: { x: -110, y: -65, w: 220, d: 145 },
    top: 127,
    azimuth: 37,
    elevation: 29,
    build({ box, base, ribs }) {
      base(-110, -65, 220, 145);
      for (const [i, x] of [-99, -25].entries()) box(`cache-wall-${i}`, x, -54, 5, 65, 0, 112);
      box('cache-back', -94, -54, 69, 4, 0, 112);
      box('cache-lid', -99, -54, 79, 65, 112, 6, { panel: true });
      for (let i = 0; i < 3; i++) {
        const z = 5 + i * 35;
        box(`drawer-shelf-${i}`, -94, -50, 69, 61, z, 3);
        box(`cache-drawer-${i}`, -92, -48, 65, 55, z + 3, 24, {
          panel: true,
          module: '1',
          driver: 'cache',
          move: [0, 24, 0],
          window: `cache-${i}`,
        });
        box(`cache-pull-${i}`, -72, 7, 25, 4, z + 11, 6, {
          module: '1',
          driver: 'cache',
          move: [0, 24, 0],
        });
      }
      for (let i = 0; i < 2; i++) {
        box(`provider-base-${i}`, i * 49, -54, 43, 52, 0, 5, { panel: true });
        box(`adapter-${i}`, 4 + i * 49, -50, 35, 44, 5, 35, {
          panel: true,
          module: '1',
          window: `adapter-${i}`,
        });
        box(`provider-plug-${i}`, 13 + i * 49, -6, 17, 4, 15, 12, { module: '1' });
      }
      box('normalizer', 0, 0, 92, 22, 0, 40, { tone: 'lo', module: '1' });
      box('score-tray', 0, 27, 92, 43, 0, 5, { panel: true, module: '2' });
      for (let i = 0; i < 3; i++) {
        box(`score-slat-${i}`, 7 + i * 27, 33, 24, 31, 5, 2, { field: 2, module: '2' });
        box(`privacy-shutter-${i}`, 7 + i * 27, 33, 24, 31, 7, 1, { field: 3, module: '2' });
      }
      box('account', -91, 45, 60, 24, 0, 10, { window: 'account', module: '0', panel: true });
      ribs('cache-vents', -88, -46, 57, 10, 118);
      return { plane: 'floor', height: 40.1, rect: [4, 3, 84, 16] };
    },
  },
  superpowered: {
    bounds: { x: -125, y: -75, w: 250, d: 150 },
    top: 83,
    azimuth: 48,
    elevation: 35,
    build({ box, base, ribs }) {
      base(-125, -75, 250, 150);
      // Two independent native sockets feed the same horizontal audio core.
      for (let i = 0; i < 2; i++) {
        const x = -110 + i * 125;
        box(`platform-pedestal-${i}`, x, -61, 90, 43, 0, 5, { panel: true });
        box(`native-module-${i}`, x + 4, -57, 82, 35, 5, 25, {
          panel: true,
          module: '1',
          window: `platform-${i}`,
        });
        for (let j = 0; j < 6; j++)
          box(`native-pin-${i}-${j}`, x + 10 + j * 12, -22, 4, 5, 14, 5, { module: '1' });
      }
      box('javascript-api', -45, -48, 90, 23, 52, 10, { module: '0', panel: true });
      for (const [i, x] of [-57, 49].entries()) {
        box(`bridge-pier-${i}`, x, -48, 8, 23, 30, 22, { module: '1' });
        box(`bridge-join-${i}`, x < 0 ? -57 : 45, -48, 12, 23, 52, 10, { module: '1' });
      }
      box('shared-core', -110, 0, 220, 57, 0, 20, { module: '2', panel: true });
      box('oscilloscope', -98, 6, 196, 26, 20, 2, { tone: 'lo', module: '2' });
      for (let i = 0; i < 3; i++) {
        box(`core-dial-seat-${i}`, -85 + i * 68, 39, 18, 14, 20, 2, { r: 6 });
        box(`core-dial-${i}`, -81 + i * 68, 42, 10, 8, 22, 4, { r: 4, module: '2' });
      }
      ribs('bridge-vent', -39, -44, 78, 4, 62);
      for (let i = 0; i < 8; i++)
        box(`core-contact-${i}`, -91 + i * 26, 57, 5, 6, 6, 6, { module: '2' });
      return { plane: 'floor', height: 22.1, rect: [-94, 9, 188, 20] };
    },
  },
};
