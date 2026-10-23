import { projectModel } from './project-models';
import type { InstrumentId } from './registry';
export type { InstrumentId } from './registry';
export type Field = 'id' | 'title' | 'note' | 'members';
export const fields: Field[] = ['id', 'title', 'note', 'members'];
export interface Inputs {
  nativeOnly: boolean;
  premium: boolean;
  online: boolean;
  downloaded: boolean;
  narration: number;
  ambience: number;
  health: boolean;
  format: number;
  gameTitle: string;
  choice: number;
  cached: boolean;
  provider: number;
  spoiler: boolean;
  following: boolean;
  authorized: boolean;
  tool: number;
  content: number;
  members: number;
  note: string;
  selected: Field[];
}
export const initialInputs: Inputs = {
  nativeOnly: false,
  premium: true,
  online: true,
  downloaded: false,
  narration: 80,
  ambience: 30,
  health: false,
  format: 0,
  gameTitle: 'Weekend challenge',
  choice: 1,
  cached: false,
  provider: 0,
  spoiler: true,
  following: false,
  authorized: true,
  tool: 0,
  content: 0,
  members: 2,
  note: 'A place to collect ideas.',
  selected: ['id', 'title'],
};
const sampleBoard = {
  id: 'board-demo',
  title: 'Ideas for a new home',
  note: 'Save the places worth a second look.',
  members: [
    { id: 'member-1', name: 'Alex' },
    { id: 'member-2', name: 'Sam' },
  ],
};
export function instrumentModel(id: InstrumentId, step: number, input: Inputs) {
  const phase = Math.max(0, Math.min(2, Math.floor(step)));
  if (id === 'superpowered') {
    const android = input.provider === 0;
    const nativeOnly = android && input.nativeOnly;
    return {
      phase,
      position: phase / 2,
      blocked: false,
      reason: '',
      mask: [1, 1, 1, 1],
      query: '',
      activeFields: 0,
      levels: [1, 0],
      windows: [`platform-${input.provider}`],
      payload: JSON.stringify(
        {
          entry: nativeOnly ? 'Standalone Java test app' : 'React Native JavaScript playback API',
          nativeLayer: android ? 'Java / JNI · Android NDK' : 'Objective-C module',
          audioCore: 'Superpowered C++',
          path: nativeOnly
            ? ['Java test app', 'JNI', 'C++ audio core']
            : ['React Native', android ? 'Java / JNI' : 'Objective-C', 'C++ audio core'],
          state: ['entry selected', 'native boundary', 'audio core'][phase],
          measurement: 'Architecture illustration; no benchmark is running',
        },
        null,
        2,
      ),
    };
  }
  if (id === 'puramente' || id === 'boom' || id === 'seen') {
    const model = projectModel(id, phase, input);
    return {
      ...model,
      phase,
      position: model.blocked ? (phase === 0 ? 0 : 0.25) : phase / 2,
      query: '',
      activeFields: 0,
      levels: [input.narration / 100, input.ambience / 100],
      windows:
        id === 'puramente'
          ? [
              input.premium ? 'source-0' : '',
              input.downloaded ? 'source-1' : '',
              'channel-0',
              'channel-1',
            ]
          : id === 'boom'
            ? [`format-${input.format}`, ...(phase === 2 && !model.blocked ? ['admin'] : [])]
            : [
                ...(input.cached
                  ? ['cache-0', 'cache-1', 'cache-2']
                  : [`adapter-${input.provider}`]),
                ...(input.following ? ['account'] : []),
              ],
    };
  }
  const selected = fields.filter((field) => input.selected.includes(field));
  const blocked =
    (id === 'mcp' && !input.authorized) ||
    (id === 'graphql' && selected.length === 0) ||
    (id === 'boards' && !input.note.trim());
  const position = blocked ? (phase === 0 ? 0 : 0.25) : phase / 2;
  const mask =
    id === 'graphql'
      ? fields.map((field) => Number(selected.includes(field)))
      : id === 'boards'
        ? [0, 1, 2, 3].map((i) => Number(i < input.members))
        : [1, 1, 1, 1];
  const query = selected.length
    ? `query BoardPreview {\n  board(id: "board-demo") {\n${selected.map((field) => `    ${field === 'members' ? 'members { id name }' : field}`).join('\n')}\n  }\n}`
    : '';
  const response = Object.fromEntries(selected.map((field) => [field, sampleBoard[field]]));
  const contentTypes = ['rich-text', 'image', 'markdown', 'link'];
  return {
    phase,
    reason: '',
    levels: [0, 0],
    windows:
      id === 'mcp'
        ? [`tool-${input.tool}`, ...(input.authorized ? ['identity'] : [])]
        : id === 'boards'
          ? [`type-${input.content}`]
          : selected.map((field) => `resolver-${fields.indexOf(field)}`),
    position,
    blocked,
    mask,
    query,
    activeFields: selected.length,
    payload:
      id === 'mcp'
        ? JSON.stringify(
            {
              identity: input.authorized ? 'signed-in demo user' : 'no session',
              gateway: 'shared',
              tool: `demo-tool-${input.tool + 1}`,
              status: blocked ? 'access required' : phase === 2 ? 'returned' : 'ready',
            },
            null,
            2,
          )
        : id === 'boards'
          ? JSON.stringify(
              {
                type: contentTypes[input.content],
                content: input.note,
                sharedWith: input.members,
                state: blocked ? 'empty draft' : ['draft', 'mapped', 'stored'][phase],
              },
              null,
              2,
            )
          : JSON.stringify(
              phase === 2 && !blocked
                ? { data: { board: response } }
                : { fields: selected.map((field) => `Board.${field}`) },
              null,
              2,
            ),
  };
}
