import { describe, expect, it } from 'vitest';
import { createWater } from './simulation';

function energy(water: ReturnType<typeof createWater>) {
  const texture = water.texture();
  let total = 0;
  for (let i = 0; i < texture.length; i += 4) {
    const height = (texture[i] * 256 + texture[i + 1]) / 16383.75 - 2;
    total += height * height;
  }
  return total;
}

describe('water simulation', () => {
  it('spreads a disturbance and dissipates after movement stops', () => {
    const water = createWater(64, 48);
    water.disturb(28, 24, 36, 24, 1);
    for (let i = 0; i < 25; i++) water.step();
    const active = energy(water);
    expect(active).toBeGreaterThan(1);
    for (let i = 0; i < 300; i++) water.step();
    expect(energy(water)).toBeLessThan(active * 0.01);
  });

  it('stays bounded during sustained overlapping movement and clears completely', () => {
    const water = createWater(40, 40);
    for (let i = 0; i < 600; i++) {
      water.disturb(10, 10, 30, 30, 1);
      water.disturb(30, 10, 10, 30, 1);
      water.step();
    }
    expect(energy(water)).toBeGreaterThan(1);
    expect(energy(water)).toBeLessThan(40 * 40 * 4);
    water.clear();
    expect(energy(water)).toBeLessThan(0.00001);
  });
});
