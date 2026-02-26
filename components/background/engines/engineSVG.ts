import type { AnimationEngine, EngineMode } from "@/components/background/types";

type DeviceProfile = "desktop" | "tablet" | "mobile";

type Profile = {
  name: DeviceProfile;
  fallingCount: number;
  restingCount: number;
  sizeMin: number;
  sizeMax: number;
  vyMin: number;
  vyMax: number;
  shadow: boolean;
  dpr: (ratio: number) => number;
  flutterFactor: number;
};

type FallingLeaf = {
  x: number;
  y: number;
  size: number;
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

type RestingLeaf = {
  x: number;
  y: number;
  size: number;
  rotation: number;
  alpha: number;
  colorIndex: number;
  visible: boolean;
};

const SVG_VIEWBOX_SIZE = 32;
const SPRITE_SIZE = 128;
const SPRITE_SCALE = SPRITE_SIZE / SVG_VIEWBOX_SIZE;

const ACCUM_X_MIN = 0.68;
const ACCUM_X_MAX = 0.99;
const ACCUM_Y_MIN = 0.905;
const ACCUM_Y_MAX = 0.99;

const COLOR_HEX = [
  "#A0522D", // sienna
  "#6E1F2A", // wine
  "#D08A2C", // amber
  "#B2872E", // ochre
  "#C85A2D", // orange
  "#70492C", // brown
  "#FFFFFF", // white
  "#F6F0E6", // off-white
  "#111111", // black
  "#2D2D2D", // charcoal
  "#CF212B"  // institutional red
] as const;

const SVG_MAPLE_LEAF_PATH =
  "M16.361,31h-0.72v-6.592l-7.596,0.949c-0.124,0.015-0.245-0.034-0.323-0.129c-0.079-0.096-0.103-0.225-0.063-0.343l0.917-2.753l-7.792-5.845c-0.107-0.081-0.161-0.213-0.14-0.346s0.115-0.242,0.242-0.284l2.606-0.869L1.678,11.16c-0.063-0.126-0.047-0.277,0.041-0.386s0.23-0.16,0.368-0.124l3.677,0.919l0.895-2.684c0.039-0.119,0.137-0.208,0.259-0.237C7.039,8.62,7.167,8.656,7.255,8.744l4.126,4.125L9.649,5.078c-0.028-0.126,0.014-0.259,0.11-0.345c0.097-0.087,0.234-0.115,0.355-0.074l2.727,0.909l2.852-4.752c0.13-0.217,0.487-0.217,0.617,0l2.852,4.752l2.727-0.909c0.126-0.041,0.259-0.013,0.355,0.074c0.097,0.086,0.139,0.219,0.11,0.345l-1.731,7.793l4.125-4.125c0.088-0.088,0.215-0.125,0.338-0.096c0.121,0.029,0.219,0.118,0.259,0.237l0.895,2.684l3.677-0.919c0.133-0.033,0.28,0.014,0.368,0.124c0.088,0.109,0.104,0.26,0.041,0.386L28.51,14.79l2.606,0.869c0.127,0.042,0.22,0.151,0.241,0.284c0.021,0.133-0.032,0.265-0.14,0.346l-7.792,5.844l0.918,2.754c0.039,0.118,0.015,0.247-0.063,0.343c-0.077,0.096-0.192,0.146-0.323,0.129l-7.596-0.949V31z M1.766,16.124l7.451,5.588c0.124,0.093,0.175,0.255,0.125,0.402l-0.819,2.458l7.434-0.93c0.03-0.005,0.06-0.003,0.089,0l7.434,0.93l-0.819-2.458c-0.049-0.147,0.002-0.31,0.126-0.402l7.45-5.588l-2.349-0.783c-0.099-0.033-0.179-0.107-0.219-0.204c-0.039-0.096-0.036-0.206,0.011-0.299l1.65-3.3l-3.241,0.81c-0.185,0.047-0.369-0.058-0.429-0.235l-0.815-2.447l-4.588,4.588c-0.113,0.114-0.29,0.138-0.428,0.061c-0.141-0.077-0.213-0.237-0.179-0.394l1.862-8.379l-2.397,0.799c-0.161,0.055-0.336-0.011-0.423-0.156L16.001,1.7L13.31,6.185c-0.087,0.145-0.264,0.209-0.422,0.156L10.49,5.542l1.863,8.379c0.035,0.156-0.038,0.317-0.178,0.394c-0.141,0.079-0.314,0.052-0.428-0.061L7.158,9.667l-0.816,2.447c-0.059,0.179-0.245,0.282-0.429,0.235l-3.241-0.81l1.65,3.3c0.047,0.093,0.051,0.203,0.011,0.299c-0.04,0.097-0.12,0.171-0.219,0.204L1.766,16.124z";

const PROFILES: Record<DeviceProfile, Profile> = {
  desktop: {
    name: "desktop",
    fallingCount: 70,
    restingCount: 14,
    sizeMin: 18,
    sizeMax: 46,
    vyMin: 0.6,
    vyMax: 2.2,
    shadow: true,
    dpr: (ratio) => Math.min(ratio, 2),
    flutterFactor: 1.0
  },
  tablet: {
    name: "tablet",
    fallingCount: 40,
    restingCount: 8,
    sizeMin: 14,
    sizeMax: 32,
    vyMin: 0.55,
    vyMax: 1.8,
    shadow: false,
    dpr: (ratio) => Math.min(ratio, 2),
    flutterFactor: 0.75
  },
  mobile: {
    name: "mobile",
    fallingCount: 20,
    restingCount: 5,
    sizeMin: 10,
    sizeMax: 22,
    vyMin: 0.45,
    vyMax: 1.2,
    shadow: false,
    dpr: () => 1,
    flutterFactor: 0.48
  }
};

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pickProfile(width: number): Profile {
  if (width < 600) return PROFILES.mobile;
  if (width <= 1024) return PROFILES.tablet;
  return PROFILES.desktop;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3
    ? `${clean[0]}${clean[0]}${clean[1]}${clean[1]}${clean[2]}${clean[2]}`
    : clean;
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export class SVGMapleEngine implements AnimationEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private mode: EngineMode = "animated";

  private width = 0;
  private height = 0;
  private dpr = 1;
  private profile: Profile = PROFILES.desktop;

  private leafPath: Path2D | null = null;
  private falling: FallingLeaf[] = [];
  private resting: RestingLeaf[] = [];
  private sprites: HTMLCanvasElement[] = [];

  private rafId = 0;
  private resizeTimer: number | null = null;
  private simTime = 0;
  private lastTs = 0;

  private onResize = () => {
    if (this.resizeTimer !== null) window.clearTimeout(this.resizeTimer);
    this.resizeTimer = window.setTimeout(() => this.handleResizeNow(), 150);
  };

  private onVisibility = () => {
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
    this.leafPath = new Path2D(SVG_MAPLE_LEAF_PATH);
    this.sprites = this.buildSprites();

    this.setCanvasSize(window.innerWidth, window.innerHeight, this.profile);
    this.rebuildPools(mode === "static");

    if (mode === "static") {
      this.drawStatic();
    } else {
      this.startAnimation();
    }

    window.addEventListener("resize", this.onResize, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  destroy() {
    this.stopAnimation();

    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("visibilitychange", this.onVisibility);

    if (this.resizeTimer !== null) {
      window.clearTimeout(this.resizeTimer);
      this.resizeTimer = null;
    }
    this.falling = [];
    this.resting = [];
    this.sprites = [];
    this.leafPath = null;
    this.canvas = null;
    this.ctx = null;
  }

  private setCanvasSize(nextWidth: number, nextHeight: number, profile: Profile) {
    if (!this.canvas || !this.ctx) return;

    this.width = Math.max(1, Math.round(nextWidth));
    this.height = Math.max(1, Math.round(nextHeight));
    this.dpr = profile.dpr(window.devicePixelRatio || 1);

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(this.dpr, this.dpr);
  }

  private buildSprites() {
    const sprites = new Array<HTMLCanvasElement>(COLOR_HEX.length);
    if (!this.leafPath) return sprites;

    for (let i = 0; i < COLOR_HEX.length; i += 1) {
      const sprite = document.createElement("canvas");
      sprite.width = SPRITE_SIZE;
      sprite.height = SPRITE_SIZE;
      const sctx = sprite.getContext("2d");

      if (!sctx) {
        sprites[i] = sprite;
        continue;
      }

      const rgb = hexToRgb(COLOR_HEX[i]!);
      const darkR = clamp(rgb.r - 48, 0, 255);
      const darkG = clamp(rgb.g - 48, 0, 255);
      const darkB = clamp(rgb.b - 48, 0, 255);
      const lightR = clamp(rgb.r + 18, 0, 255);
      const lightG = clamp(rgb.g + 18, 0, 255);
      const lightB = clamp(rgb.b + 18, 0, 255);

      const grad = sctx.createLinearGradient(12, 8, SPRITE_SIZE - 12, SPRITE_SIZE - 8);
      grad.addColorStop(0, `rgb(${lightR}, ${lightG}, ${lightB})`);
      grad.addColorStop(1, `rgb(${darkR}, ${darkG}, ${darkB})`);

      sctx.clearRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
      sctx.globalAlpha = 1;
      sctx.save();
      sctx.scale(SPRITE_SCALE, SPRITE_SCALE);
      // Fill must be explicit and happen before stroke to avoid hollow-looking sprites.
      sctx.fillStyle = grad;
      sctx.fill(this.leafPath, "nonzero");
      sctx.strokeStyle = `rgba(${darkR}, ${darkG}, ${darkB}, 0.28)`;
      sctx.lineWidth = 0.55;
      sctx.stroke(this.leafPath);
      sctx.restore();

      sprites[i] = sprite;
    }

    return sprites;
  }

  private createFallingLeaf(spawnTop: boolean): FallingLeaf {
    const size = randomBetween(this.profile.sizeMin, this.profile.sizeMax);

    return {
      x: randomBetween(0, this.width),
      y: spawnTop ? randomBetween(-this.height * 0.34, -size) : randomBetween(-size, this.height + size),
      size,
      vy: randomBetween(this.profile.vyMin, this.profile.vyMax),
      vx: randomBetween(-0.22, 0.2),
      rotation: randomBetween(0, Math.PI * 2),
      rotationSpeed: randomBetween(-0.03, 0.03),
      swayPhase: randomBetween(0, Math.PI * 2),
      swayAmp: randomBetween(0.15, 0.62),
      swayFreq: randomBetween(0.35, 1.05),
      alpha: randomBetween(0.72, 0.95),
      colorIndex: Math.floor(randomBetween(0, this.sprites.length)),
      flutter: randomBetween(0.0012, 0.006) * this.profile.flutterFactor,
      flutterFreq: randomBetween(1.2, 2.6)
    };
  }

  private randomRestingLeaf(visible: boolean): RestingLeaf {
    return {
      x: randomBetween(this.width * ACCUM_X_MIN, this.width * ACCUM_X_MAX),
      y: randomBetween(this.height * ACCUM_Y_MIN, this.height * ACCUM_Y_MAX),
      size: randomBetween(this.profile.sizeMin * 0.95, this.profile.sizeMax * 0.95),
      rotation: randomBetween(-0.35, 0.35),
      alpha: randomBetween(0.68, 0.92),
      colorIndex: Math.floor(randomBetween(0, this.sprites.length)),
      visible
    };
  }

  private rebuildPools(staticMode: boolean) {
    const fallingCount = staticMode ? 0 : this.profile.fallingCount;
    const restingCount = staticMode ? 4 : 0;

    this.falling = new Array<FallingLeaf>(fallingCount);
    for (let i = 0; i < fallingCount; i += 1) {
      this.falling[i] = this.createFallingLeaf(true);
    }

    this.resting = new Array<RestingLeaf>(restingCount);
    for (let i = 0; i < restingCount; i += 1) {
      this.resting[i] = this.randomRestingLeaf(staticMode ? i < 4 : true);
    }

  }

  private respawnFalling(leaf: FallingLeaf) {
    leaf.size = randomBetween(this.profile.sizeMin, this.profile.sizeMax);
    leaf.y = -(leaf.size + Math.random() * 80);
    leaf.x = Math.random() * this.width;
    leaf.vy = randomBetween(this.profile.vyMin, this.profile.vyMax);
    leaf.vx = randomBetween(-0.22, 0.2);
    leaf.rotation = randomBetween(0, Math.PI * 2);
    leaf.rotationSpeed = randomBetween(-0.03, 0.03);
    leaf.swayPhase = randomBetween(0, Math.PI * 2);
    leaf.swayAmp = randomBetween(0.15, 0.62);
    leaf.swayFreq = randomBetween(0.35, 1.05);
    leaf.alpha = randomBetween(0.72, 0.95);
    leaf.colorIndex = Math.floor(randomBetween(0, this.sprites.length));
    leaf.flutter = randomBetween(0.0012, 0.006) * this.profile.flutterFactor;
    leaf.flutterFreq = randomBetween(1.2, 2.6);
  }

  private drawScene(advance: boolean, dtFactor: number) {
    if (!this.ctx) return;

    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.width, this.height);

    const wind = Math.sin(this.simTime * 0.12) * 0.28 + Math.sin(this.simTime * 0.041 + 1.04) * 0.17;

    for (let i = 0; i < this.resting.length; i += 1) {
      const leaf = this.resting[i]!;
      if (!leaf.visible) continue;

      const sprite = this.sprites[leaf.colorIndex];
      if (!sprite) continue;

      const half = leaf.size * 0.5;
      ctx.save();
      ctx.globalAlpha = leaf.alpha;
      ctx.translate(leaf.x, leaf.y);
      ctx.rotate(leaf.rotation);
      ctx.drawImage(sprite, -half, -half, leaf.size, leaf.size);
      ctx.restore();
    }

    for (let i = 0; i < this.falling.length; i += 1) {
      const leaf = this.falling[i]!;

      const sway = Math.sin(this.simTime * leaf.swayFreq + leaf.swayPhase) * leaf.swayAmp;

      if (advance) {
        leaf.y += leaf.vy * dtFactor;
        leaf.x += (leaf.vx + wind) * dtFactor;
        leaf.rotation +=
          (leaf.rotationSpeed + Math.sin(this.simTime * leaf.flutterFreq + leaf.swayPhase) * leaf.flutter) * dtFactor;
      }

      let drawX = leaf.x + sway * 10;
      const drawY = leaf.y;

      if (drawY > this.height + leaf.size * 2) {
        this.respawnFalling(leaf);
        continue;
      }

      if (drawX < -leaf.size * 2 || drawX > this.width + leaf.size * 2) {
        this.respawnFalling(leaf);
        continue;
      }

      const sprite = this.sprites[leaf.colorIndex];
      if (!sprite) continue;

      const half = leaf.size * 0.5;
      ctx.save();
      ctx.globalAlpha = leaf.alpha;
      ctx.translate(drawX, drawY);
      ctx.rotate(leaf.rotation);

      if (this.profile.shadow && leaf.size > this.profile.sizeMin * 1.35) {
        ctx.shadowColor = "rgba(40, 15, 5, 0.25)";
        ctx.shadowOffsetY = leaf.size * 0.12;
        ctx.shadowBlur = leaf.size * 0.08;
      }

      ctx.drawImage(sprite, -half, -half, leaf.size, leaf.size);

      ctx.shadowColor = "transparent";
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    ctx.globalAlpha = 1;
  }

  private drawStatic() {
    this.simTime = 0;
    this.drawScene(false, 1);
  }

  private animate = (timestamp: number) => {
    if (this.mode === "static" || document.hidden) {
      this.rafId = 0;
      return;
    }

    if (this.lastTs === 0) this.lastTs = timestamp;
    const dtMs = Math.min(32, timestamp - this.lastTs);
    this.lastTs = timestamp;

    this.simTime += dtMs / 1000;
    const dtFactor = dtMs / 16.666;

    this.drawScene(true, dtFactor);
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
    const prevWidth = this.width;
    const prevHeight = this.height;
    const breakpointChanged = nextProfile.name !== this.profile.name;

    this.profile = nextProfile;
    this.setCanvasSize(window.innerWidth, window.innerHeight, nextProfile);

    if (breakpointChanged) {
      this.rebuildPools(this.mode === "static");
    } else if (prevWidth > 0 && prevHeight > 0) {
      const rx = this.width / prevWidth;
      const ry = this.height / prevHeight;

      for (let i = 0; i < this.falling.length; i += 1) {
        const leaf = this.falling[i]!;
        leaf.x *= rx;
        leaf.y *= ry;
      }

      for (let i = 0; i < this.resting.length; i += 1) {
        const leaf = this.resting[i]!;
        leaf.x *= rx;
        leaf.y *= ry;
      }
    }

    if (this.mode === "static") {
      this.drawStatic();
    }
  }
}
