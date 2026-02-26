"use client";

import { useEffect, useRef } from "react";
import type { AnimationEngine, EngineMode } from "@/components/background/types";
import { SVGMapleEngine as ActiveMapleEngine } from "@/components/background/engines/engineSVG";

export function MapleLeavesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<AnimationEngine | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const mountEngine = (mode: EngineMode) => {
      if (engineRef.current) {
        engineRef.current.destroy();
      }

      // Swap engine by changing the import line above.
      const engine = new ActiveMapleEngine();
      engine.init(canvas, mode);
      engineRef.current = engine;
    };

    const applyMode = () => {
      mountEngine(media.matches ? "static" : "animated");
    };

    const onMediaChange = () => {
      applyMode();
    };

    applyMode();
    media.addEventListener("change", onMediaChange);

    return () => {
      media.removeEventListener("change", onMediaChange);
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none"
      }}
    />
  );
}
