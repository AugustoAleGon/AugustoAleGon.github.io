import { describe, expect, it } from 'vitest';
import { initialMachine, machineReducer, stageOf, type MachineState } from './model';

function finish(state: MachineState) {
  for (let i = 0; i < 5; i++) state = machineReducer(state, { type: 'tick' });
  return state;
}
describe('Seen request model', () => {
  it('fetches on a miss, then bypasses the provider on a hit', () => {
    let state = finish(machineReducer(initialMachine, { type: 'run' }));
    expect(state).toMatchObject({
      completed: 1,
      providerCalls: 1,
      cache: true,
      status: 'complete',
    });
    state = machineReducer(state, { type: 'run' });
    expect(state.cacheHit).toBe(true);
    state = machineReducer(state, { type: 'tick' });
    expect(stageOf(state)).toBe('cache');
    state = machineReducer(state, { type: 'tick' });
    expect(stageOf(state)).toBe('response');
    state = finish(state);
    expect(state).toMatchObject({ completed: 2, providerCalls: 1 });
  });
  it('fetches again after explicit expiration', () => {
    let state = finish(machineReducer(initialMachine, { type: 'run' }));
    state = machineReducer(state, { type: 'expire' });
    expect(state).toMatchObject({ status: 'idle', cache: false, cacheHit: false });
    state = finish(machineReducer(state, { type: 'run' }));
    expect(state).toMatchObject({ completed: 2, providerCalls: 2, cacheHit: false });
  });
  it('preserves an in-flight request while paused and ignores concurrent starts', () => {
    let state = machineReducer(initialMachine, { type: 'run' });
    state = machineReducer(state, { type: 'tick' });
    state = machineReducer(state, { type: 'pause' });
    expect(machineReducer(state, { type: 'tick' })).toEqual(state);
    expect(machineReducer(state, { type: 'run' })).toEqual(state);
    expect(machineReducer(state, { type: 'expire' })).toEqual(state);
    state = finish(machineReducer(state, { type: 'pause' }));
    expect(state).toMatchObject({ status: 'complete', completed: 1 });
    expect(machineReducer(state, { type: 'reset' })).toEqual(initialMachine);
  });
});
