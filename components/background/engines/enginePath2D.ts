import type { AnimationEngine, EngineMode } from "@/components/background/types";

type DeviceProfile = "desktop" | "tablet" | "mobile";

type DensityProfile = {
  name: DeviceProfile;
  countMin: number;
  countMax: number;
  scaleMin: number;
  scaleMax: number;
  vyMin: number;
  vyMax: number;
  shadowEnabled: boolean;
  flutterFactor: number;
};

type Leaf = {
  x: number;
  y: number;
  scale: number;
  vy: number;
  vx: number;
  rotation: number;
  rotationSpeed: number;
  swayPhase: number;
  swayAmp: number;
  swayFreq: number;
  alpha: number;
  colorIndex: number;
  flutter: number;
  flutterFreq: number;
};

type ColorVariant = {
  fill: string;
  vein: string;
};

const PROFILES: Record<DeviceProfile, DensityProfile> = {
  desktop: {
    name: "desktop",
    countMin: 28,
    countMax: 40,
    scaleMin: 0.4,
    scaleMax: 1.0,
    vyMin: 0.6,
    vyMax: 2.2,
    shadowEnabled: true,
    flutterFactor: 1.0
  },
  tablet: {
    name: "tablet",
    countMin: 14,
    countMax: 20,
    scaleMin: 0.3,
    scaleMax: 0.75,
    vyMin: 0.5,
    vyMax: 1.8,
    shadowEnabled: false,
    flutterFactor: 0.8
  },
  mobile: {
    name: "mobile",
    countMin: 8,
    countMax: 12,
    scaleMin: 0.2,
    scaleMax: 0.55,
    vyMin: 0.4,
    vyMax: 1.4,
    shadowEnabled: false,
    flutterFactor: 0.5
  }
};

const BASE_COLORS: Array<[number, number, number]> = [
  [207, 33, 43],
  [135, 28, 35],
  [207, 96, 33],
  [183, 130, 39],
  [118, 82, 48]
];

const LEAF_UNIT = 22;
const STATIC_LEAF_COUNT = 6;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pickProfile(width: number): DensityProfile {
  if (width < 600) return PROFILES.mobile;
  if (width <= 1024) return PROFILES.tablet;
  return PROFILES.desktop;
}

function buildMapleLeafPath() {
  const path = new Path2D();
  path.moveTo(0, -1.08);
  path.bezierCurveTo(0.09, -0.96, 0.2, -0.92, 0.28, -0.76);
  path.bezierCurveTo(0.44, -0.98, 0.58, -0.84, 0.66, -0.56);
  path.bezierCurveTo(0.82, -0.7, 0.96, -0.52, 0.9, -0.24);
  path.bezierCurveTo(1.12, -0.16, 1.08, 0.08, 0.86, 0.18);
  path.bezierCurveTo(0.92, 0.42, 0.74, 0.54, 0.52, 0.44);
  path.bezierCurveTo(0.58, 0.68, 0.44, 0.82, 0.24, 0.72);
  path.bezierCurveTo(0.16, 0.9, 0.1, 1.03, 0.06, 1.1);
  path.lineTo(-0.06, 1.1);
  path.bezierCurveTo(-0.1, 1.03, -0.16, 0.9, -0.24, 0.72);
  path.bezierCurveTo(-0.44, 0.82, -0.58, 0.68, -0.52, 0.44);
  path.bezierCurveTo(-0.74, 0.54, -0.92, 0.42, -0.86, 0.18);
  path.bezierCurveTo(-1.08, 0.08, -1.12, -0.16, -0.9, -0.24);
  path.bezierCurveTo(-0.96, -0.52, -0.82, -0.7, -0.66, -0.56);
  path.bezierCurveTo(-0.58, -0.84, -0.44, -0.98, -0.28, -0.76);
  path.bezierCurveTo(-0.2, -0.92, -0.09, -0.96, 0, -1.08);
  path.closePath();
  return path;
}

function buildVeinPath() {
  const path = new Path2D();
  path.moveTo(0, -0.88);
  path.lineTo(0, 0.78);
  path.moveTo(0, -0.56);
  path.lineTo(0.42, -0.56);
  path.moveTo(0, -0.56);
  path.lineTo(-0.42, -0.56);
  path.moveTo(0, -0.28);
  path.lineTo(0.72, -0.18);
  path.moveTo(0, -0.28);
  path.lineTo(-0.72, -0.18);
  path.moveTo(0, 0.04);
  path.lineTo(0.64, 0.2);
  path.moveTo(0, 0.04);
  path.lineTo(-0.64, 0.2);
  path.moveTo(0, 0.3);
  path.lineTo(0.46, 0.44);
  path.moveTo(0, 0.3);
  path.lineTo(-0.46, 0.44);
  return path;
}

function buildColorVariants(): ColorVariant[] {
  const swatch = document.createElement("canvas");
  swatch.width = 28;
  swatch.height = 28;
  const ctx = swatch.getContext("2d");

  if (!ctx) {
    return BASE_COLORS.map(([r, g, b]) => ({
      fill: `rgb(${r} ${g} ${b})`,
      vein: `rgba(${clamp(r - 45, 0, 255)} ${clamp(g - 45, 0, 255)} ${clamp(b - 45, 0, 255)} / 0.45)`
    }));
  }

  return BASE_COLORS.map(([r, g, b]) => {
    ctx.clearRect(0, 0, swatch.width, swatch.height);
    const grad = ctx.createLinearGradient(0, 0, swatch.width, swatch.height);
    grad.addColorStop(0, `rgb(${clamp(r + 16, 0, 255)} ${clamp(g + 10, 0, 255)} ${clamp(b + 10, 0, 255)})`);
    grad.addColorStop(1, `rgb(${clamp(r - 24, 0, 255)} ${clamp(g - 20, 0, 255)} ${clamp(b - 20, 0, 255)})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, swatch.width, swatch.height);
    const a = ctx.getImageData(10, 10, 1, 1).data;
    const bPixel = ctx.getImageData(22, 22, 1, 1).data;

    return {
      fill: `rgb(${a[0]} ${a[1]} ${a[2]})`,
      vein: `rgba(${clamp(bPixel[0] - 40, 0, 255)} ${clamp(bPixel[1] - 40, 0, 255)} ${clamp(bPixel[2] - 40, 0, 255)} / 0.46)`
    };
  });
}

function createLeaf(
  width: number,
  height: number,
  profile: DensityProfile,
  colorCount: number,
  spawnFromTop: boolean
): Leaf {
  const margin = 80;
  return {
    x: randomBetween(-margin, width + margin),
    y: spawnFromTop ? randomBetween(-height * 0.35, -24) : randomBetween(-40, height + 40),
    scale: randomBetween(profile.scaleMin, profile.scaleMax),
    vy: randomBetween(profile.vyMin, profile.vyMax),
    vx: randomBetween(-0.2, 0.2),
    rotation: randomBetween(0, Math.PI * 2),
    rotationSpeed: randomBetween(-0.02, 0.02),
    swayPhase: randomBetween(0, Math.PI * 2),
    swayAmp: randomBetween(0.08, 0.34),
    swayFreq: randomBetween(0.45, 1.05),
    alpha: randomBetween(0.72, 0.95),
    colorIndex: Math.floor(randomBetween(0, colorCount)),
    flutter: randomBetween(0.0012, 0.0052) * profile.flutterFactor,
    flutterFreq: randomBetween(1.3, 2.4)
  };
}

export class Path2DMapleEngine implements AnimationEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private width = 0;
  private height = 0;
  private dpr = 1;
  private profile: DensityProfile = PROFILES.desktop;
  private leaves: Leaf[] = [];
  private colors: ColorVariant[] = [];
  private leafPath: Path2D | null = null;
  private veinPath: Path2D | null = null;
  private rafId = 0;
  private resizeTimer: number | null = null;
  private lastTs = 0;
  private simTime = 0;
  private mode: EngineMode = "animated";

  private onResize = () => {
    if (this.resizeTimer) window.clearTimeout(this.resizeTimer);
    this.resizeTimer = window.setTimeout(() => this.handleResizeNow(), 150);
  };

  private onVisibilityChange = () => {
    if (document.hidden || this.mode === "static") {
      this.stopAnimation();
    } else {
      this.startAnimation();
    }
  };

  init(canvas: HTMLCanvasElement, mode: EngineMode) {
    this.destroy();

    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: true });
    if (!this.ctx) return;

    this.mode = mode;
    this.profile = pickProfile(window.innerWidth);
    this.leafPath = buildMapleLeafPath();
    this.veinPath = buildVeinPath();
    this.colors = buildColorVariants();

    this.setCanvasSize(window.innerWidth, window.innerHeight, this.profile);
    this.rebuildPool(mode === "static");

    if (mode === "static") {
      this.drawFrame(false, 1);
    } else {
      this.startAnimation();
    }

    window.addEventListener("resize", this.onResize, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibilityChange);
  }

  destroy() {
    this.stopAnimation();

    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("visibilitychange", this.onVisibilityChange);

    if (this.resizeTimer) {
      window.clearTimeout(this.resizeTimer);
      this.resizeTimer = null;
    }

    this.leaves = [];
    this.canvas = null;
    this.ctx = null;
    this.leafPath = null;
    this.veinPath = null;
  }

  private setCanvasSize(nextWidth: number, nextHeight: number, nextProfile: DensityProfile) {
    if (!this.canvas || !this.ctx) return;

    this.width = Math.max(1, Math.round(nextWidth));
    this.height = Math.max(1, Math.round(nextHeight));
    this.dpr = nextProfile.name === "mobile" ? 1 : Math.min(window.devicePixelRatio || 1, 2);

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(this.dpr, this.dpr);
  }

  private rebuildPool(staticMode: boolean) {
    const count = staticMode
      ? STATIC_LEAF_COUNT
      : Math.round(randomBetween(this.profile.countMin, this.profile.countMax));

    this.leaves = new Array(count);
    for (let i = 0; i < count; i += 1) {
      this.leaves[i] = createLeaf(this.width, this.height, this.profile, this.colors.length, !staticMode);
    }
  }

  private recycleLeaf(leaf: Leaf) {
    const margin = 90;
    leaf.x = randomBetween(-margin, this.width + margin);
    leaf.y = randomBetween(-this.height * 0.45, -26);
    leaf.scale = randomBetween(this.profile.scaleMin, this.profile.scaleMax);
    leaf.vy = randomBetween(this.profile.vyMin, this.profile.vyMax);
    leaf.vx = randomBetween(-0.2, 0.2);
    leaf.rotation = randomBetween(0, Math.PI * 2);
    leaf.rotationSpeed = randomBetween(-0.02, 0.02);
    leaf.swayPhase = randomBetween(0, Math.PI * 2);
    leaf.swayAmp = randomBetween(0.08, 0.34);
    leaf.swayFreq = randomBetween(0.45, 1.05);
    leaf.alpha = randomBetween(0.72, 0.95);
    leaf.colorIndex = Math.floor(randomBetween(0, this.colors.length));
    leaf.flutter = randomBetween(0.0012, 0.0052) * this.profile.flutterFactor;
    leaf.flutterFreq = randomBetween(1.3, 2.4);
  }

  private drawFrame(advance: boolean, dtFactor: number) {
    if (!this.ctx || !this.leafPath || !this.veinPath) return;

    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.width, this.height);

    const wind = Math.sin(this.simTime * 0.17) * 0.23 + Math.sin(this.simTime * 0.047 + 0.85) * 0.12;

    for (let i = 0; i < this.leaves.length; i += 1) {
      const leaf = this.leaves[i]!;
      const sway = Math.sin(this.simTime * leaf.swayFreq + leaf.swayPhase) * leaf.swayAmp;

      if (advance) {
        leaf.y += leaf.vy * dtFactor;
        leaf.x += (leaf.vx + wind * 0.25) * dtFactor;
        leaf.rotation +=
          (leaf.rotationSpeed + Math.sin(this.simTime * leaf.flutterFreq + leaf.swayPhase) * leaf.flutter) * dtFactor;
      }

      const drawX = leaf.x + sway * 12;
      const drawY = leaf.y;
      const radius = LEAF_UNIT * leaf.scale * 1.35;

      if (drawY - radius > this.height + 80) {
        this.recycleLeaf(leaf);
        continue;
      }

      if (drawX < -120) leaf.x = this.width + 80;
      if (drawX > this.width + 120) leaf.x = -80;

      ctx.save();
      ctx.translate(drawX, drawY);
      ctx.rotate(leaf.rotation);

      if (this.profile.shadowEnabled && leaf.scale > 0.6) {
        ctx.shadowColor = "rgba(40, 15, 5, 0.25)";
        ctx.shadowOffsetY = leaf.scale * 6;
        ctx.shadowBlur = leaf.scale * 4;
      } else {
        ctx.shadowColor = "transparent";
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
      }

      ctx.scale(LEAF_UNIT * leaf.scale, LEAF_UNIT * leaf.scale);
      ctx.globalAlpha = leaf.alpha;
      ctx.fillStyle = this.colors[leaf.colorIndex]!.fill;
      ctx.fill(this.leafPath);

      ctx.shadowColor = "transparent";
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 0;
      ctx.globalAlpha = leaf.alpha * 0.55;
      ctx.strokeStyle = this.colors[leaf.colorIndex]!.vein;
      ctx.lineWidth = 0.06;
      ctx.stroke(this.veinPath);
      ctx.restore();
    }

    ctx.globalAlpha = 1;
  }

  private animate = (ts: number) => {
    if (document.hidden || this.mode === "static") {
      this.rafId = 0;
      return;
    }

    if (this.lastTs === 0) this.lastTs = ts;
    const dtMs = Math.min(48, ts - this.lastTs);
    this.lastTs = ts;
    this.simTime += dtMs / 1000;

    const dtFactor = dtMs / 16.666;
    this.drawFrame(true, dtFactor);

    this.rafId = window.requestAnimationFrame(this.animate);
  };

  private startAnimation() {
    if (this.mode === "static" || document.hidden || this.rafId !== 0) return;
    this.lastTs = 0;
    this.rafId = window.requestAnimationFrame(this.animate);
  }

  private stopAnimation() {
    if (this.rafId !== 0) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  private handleResizeNow() {
    const nextProfile = pickProfile(window.innerWidth);
    const oldWidth = this.width;
    const oldHeight = this.height;
    const profileChanged = nextProfile.name !== this.profile.name;

    this.setCanvasSize(window.innerWidth, window.innerHeight, nextProfile);

    if (profileChanged || this.leaves.length === 0) {
      this.profile = nextProfile;
      this.rebuildPool(this.mode === "static");
    } else if (oldWidth > 0 && oldHeight > 0) {
      const rx = this.width / oldWidth;
      const ry = this.height / oldHeight;
      for (let i = 0; i < this.leaves.length; i += 1) {
        const leaf = this.leaves[i]!;
        leaf.x *= rx;
        leaf.y *= ry;
      }
    }

    if (this.mode === "static") this.drawFrame(false, 1);
  }
}
