// A damped height field. Fixed 60 Hz steps keep its speed independent of the display.
export function createWater(width: number, height: number) {
  const size = width * height;
  const surface = new Float32Array(size);
  const velocity = new Float32Array(size);
  const pixels = new Uint8Array(size * 4);

  function disturb(ax: number, ay: number, bx: number, by: number, strength: number) {
    const radius = 4;
    const dx = bx - ax;
    const dy = by - ay;
    const lengthSquared = dx * dx + dy * dy;
    for (
      let y = Math.max(1, Math.floor(Math.min(ay, by) - radius * 2));
      y < Math.min(height - 1, Math.ceil(Math.max(ay, by) + radius * 2));
      y++
    ) {
      for (
        let x = Math.max(1, Math.floor(Math.min(ax, bx) - radius * 2));
        x < Math.min(width - 1, Math.ceil(Math.max(ax, bx) + radius * 2));
        x++
      ) {
        const t = lengthSquared
          ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / lengthSquared))
          : 0;
        const distance = (x - ax - dx * t) ** 2 + (y - ay - dy * t) ** 2;
        const index = y * width + x;
        velocity[index] = Math.min(
          0.18,
          velocity[index] + Math.exp(-distance / (radius * radius)) * strength * 0.065,
        );
      }
    }
  }

  function step() {
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = y * width + x;
        const laplacian =
          surface[i - 1] +
          surface[i + 1] +
          surface[i - width] +
          surface[i + width] -
          4 * surface[i];
        // Absorb waves near the boundary instead of reflecting off the viewport.
        const edge = Math.min(1, Math.min(x, y, width - 1 - x, height - 1 - y) / 8);
        velocity[i] = (velocity[i] + laplacian * 0.24) * (0.85 + edge * 0.105);
      }
    }
    for (let i = 0; i < size; i++)
      surface[i] = Math.max(-2, Math.min(2, (surface[i] + velocity[i]) * 0.994));
  }

  function texture() {
    for (let i = 0; i < size; i++) {
      // Two byte channels preserve small waves without requiring float-texture extensions.
      const value = Math.round((surface[i] + 2) * 16383.75);
      pixels[i * 4] = value >> 8;
      pixels[i * 4 + 1] = value & 255;
      pixels[i * 4 + 3] = 255;
    }
    return pixels;
  }

  return {
    disturb,
    step,
    texture,
    clear() {
      surface.fill(0);
      velocity.fill(0);
    },
  };
}
