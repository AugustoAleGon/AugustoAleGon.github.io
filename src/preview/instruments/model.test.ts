import { describe, expect, it } from 'vitest';
import { fields, initialInputs, instrumentModel } from './model';
describe('contribution instrument models', () => {
  it('keeps a blocked identity before the shared access boundary at every step', () => {
    for (const step of [0, 1, 2]) {
      const denied = instrumentModel('mcp', step, { ...initialInputs, authorized: false });
      expect(denied.blocked).toBe(true);
      expect(denied.position).toBeLessThan(0.5);
      expect(JSON.parse(denied.payload).status).toBe('access required');
    }
    expect(instrumentModel('mcp', 2, initialInputs).position).toBe(1);
  });
  it('keeps note content, selected type and audience consistent with the storage state', () => {
    const model = instrumentModel('boards', 2, {
      ...initialInputs,
      note: 'A shared note',
      content: 2,
      members: 3,
    });
    expect(JSON.parse(model.payload)).toEqual({
      type: 'markdown',
      content: 'A shared note',
      sharedWith: 3,
      state: 'stored',
    });
    expect(model.mask).toEqual([1, 1, 1, 0]);
    expect(instrumentModel('boards', 2, { ...initialInputs, note: '   ' }).blocked).toBe(true);
  });
  it('returns exactly the selected fields for every possible selection set', () => {
    for (let bits = 0; bits < 16; bits++) {
      const selected = fields.filter((_, index) => Boolean(bits & (1 << index)));
      const model = instrumentModel('graphql', 2, { ...initialInputs, selected });
      expect(model.activeFields).toBe(selected.length);
      expect(model.blocked).toBe(!bits);
      if (bits) expect(Object.keys(JSON.parse(model.payload).data.board)).toEqual(selected);
      else expect(model.query).toBe('');
      expect(model.query.includes('members { id name }')).toBe(selected.includes('members'));
    }
  });
});

describe('additional project responsibilities', () => {
  it('requires eligibility and an available audio source for every network/download combination', () => {
    for (const premium of [false, true])
      for (const online of [false, true])
        for (const downloaded of [false, true]) {
          const model = instrumentModel('puramente', 2, {
            ...initialInputs,
            premium,
            online,
            downloaded,
            narration: 17,
            ambience: 93,
          });
          expect(model.blocked).toBe(!premium || (!online && !downloaded));
          expect(model.levels).toEqual([0.17, 0.93]);
          expect(JSON.parse(model.payload).playback).toBe(model.blocked ? 'blocked' : 'playing');
        }
  });
  it('selects a matching component and keeps invalid game configuration out of storage', () => {
    for (const format of [0, 1, 2]) {
      const data = JSON.parse(
        instrumentModel('boom', 2, { ...initialInputs, format, choice: 2 }).payload,
      );
      expect(data.configuration.component).toBe(`${data.configuration.format}View`);
      expect(data.event.choice).toBe(2);
    }
    const blank = instrumentModel('boom', 2, { ...initialInputs, gameTitle: '   ' });
    expect(blank.blocked).toBe(true);
    expect(JSON.parse(blank.payload).storage).toBe('draft');
    expect(JSON.parse(blank.payload).event).toBeNull();
  });
  it('normalizes both provider shapes, bypasses providers on hits, and masks display only', () => {
    for (const provider of [0, 1])
      for (const cached of [false, true])
        for (const spoiler of [false, true]) {
          const data = JSON.parse(
            instrumentModel('seen', 2, { ...initialInputs, provider, cached, spoiler }).payload,
          );
          expect(data.providerConsulted).toBe(!cached);
          expect(data.response).toEqual({ home: 'Harbor', away: 'Summit', score: [2, 1] });
          expect(data.display.score).toEqual(spoiler ? 'hidden by Spoiler Shield' : [2, 1]);
          if (cached) expect(data.raw).toBeNull();
        }
  });
});
