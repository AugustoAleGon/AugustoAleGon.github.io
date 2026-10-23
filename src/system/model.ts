export type Stage = 'request' | 'cache' | 'adapter' | 'normalize' | 'response';
export type Status = 'idle' | 'running' | 'paused' | 'complete';
export interface MachineState {
  status: Status;
  cache: boolean;
  cacheHit: boolean;
  step: number;
  completed: number;
  providerCalls: number;
}
export type MachineAction = { type: 'run' | 'tick' | 'pause' | 'expire' | 'reset' };
export const initialMachine: MachineState = {
  status: 'idle',
  cache: false,
  cacheHit: false,
  step: 0,
  completed: 0,
  providerCalls: 0,
};
export const missStages: Stage[] = ['request', 'cache', 'adapter', 'normalize', 'response'];
export const hitStages: Stage[] = ['request', 'cache', 'response'];
export const stagesOf = (state: MachineState) => (state.cacheHit ? hitStages : missStages);
export const stageOf = (state: MachineState): Stage => stagesOf(state)[state.step] ?? 'response';
export function machineReducer(state: MachineState, action: MachineAction): MachineState {
  if (action.type === 'reset') return { ...initialMachine };
  if (action.type === 'expire')
    return state.status === 'running' || state.status === 'paused'
      ? state
      : { ...state, cache: false, cacheHit: false, status: 'idle', step: 0 };
  if (action.type === 'run')
    return state.status === 'running' || state.status === 'paused'
      ? state
      : { ...state, status: 'running', cacheHit: state.cache, step: 0 };
  if (action.type === 'pause')
    return state.status === 'running'
      ? { ...state, status: 'paused' }
      : state.status === 'paused'
        ? { ...state, status: 'running' }
        : state;
  if (action.type === 'tick' && state.status === 'running') {
    if (state.step >= stagesOf(state).length - 1)
      return { ...state, status: 'complete', cache: true, completed: state.completed + 1 };
    const step = state.step + 1;
    return {
      ...state,
      step,
      providerCalls: state.providerCalls + (stagesOf(state)[step] === 'adapter' ? 1 : 0),
    };
  }
  return state;
}
