import type { Art } from './renderer';

export const instrumentLoaders = {
  mcp: () => import('./mcp.generated'),
  boards: () => import('./boards.generated'),
  graphql: () => import('./graphql.generated'),
  puramente: () => import('./puramente.generated'),
  boom: () => import('./boom.generated'),
  seen: () => import('./seen.generated'),
  superpowered: () => import('./superpowered.generated'),
} satisfies Record<string, () => Promise<{ default: Art }>>;

export type InstrumentId = keyof typeof instrumentLoaders;

export function isInstrumentId(id: string): id is InstrumentId {
  return Object.hasOwn(instrumentLoaders, id);
}
