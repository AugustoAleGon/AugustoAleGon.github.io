export interface Layer {
  gl: WebGLRenderingContext;
  draw(values: Record<string, number | readonly number[]>, time: number): void;
  clear(): void;
}
export function glLayer(options: {
  canvas: HTMLCanvasElement;
  fragment: string;
  view: readonly number[];
  camera: { origin: readonly number[]; k: number; cam: readonly number[] };
  uniforms?: string[];
  maxRatio?: number;
  onError?: (error: unknown) => void;
}): Layer | null;
