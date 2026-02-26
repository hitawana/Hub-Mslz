export type EngineMode = "animated" | "static";

export interface AnimationEngine {
  init(canvas: HTMLCanvasElement, mode: EngineMode): void;
  destroy(): void;
}
