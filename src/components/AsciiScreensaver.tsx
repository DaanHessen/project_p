import { useEffect, useRef } from "react";
import "./AsciiScreensaver.css";

type BaseCell = {
  char: string;
  alpha: number;
};

type ShadeBand = {
  threshold: number;
  chars: readonly string[];
};

type CloudBlob = {
  cx: number;
  cy: number;
  baseRadiusX: number;
  baseRadiusY: number;
  rotation: number;
  rotationSpeed: number;
  intensity: number;
  velocityX: number;
  velocityY: number;
  wobbleAmplitude: number;
  wobbleSpeed: number;
  wobblePhase: number;
  life: number;
  maxLife: number;
};

type State = {
  columns: number;
  rows: number;
  gridOffsetX: number;
  gridOffsetY: number;
  baseGrid: BaseCell[][];
  noise: number[][];
  blobs: CloudBlob[];
};

const CELL_SIZE = 14;
const FRAME_INTERVAL = 1000 / 18;
const WRAP_MARGIN = 12;

const BACKDROP_CHARACTERS = ["s", ";", ":"] as const;
const SHADE_BANDS: ShadeBand[] = [
  { threshold: 0.18, chars: ["`", ".", ":"] },
  { threshold: 0.36, chars: [":", ";", "~"] },
  { threshold: 0.55, chars: ["*", "+", "="] },
  { threshold: 0.75, chars: ["#", "%", "@"] },
  { threshold: 1, chars: ["@", "&", "$"] },
];

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);
const randomChoice = <T,>(collection: readonly T[]) =>
  collection[Math.floor(Math.random() * collection.length)];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const pickShadeCharacter = (intensity: number, jitter: number) => {
  const adjusted = clamp(intensity + jitter * 0.2, 0, 1);
  const bandIndex = SHADE_BANDS.findIndex((candidate) => adjusted <= candidate.threshold);
  const band =
    bandIndex === -1 ? SHADE_BANDS[SHADE_BANDS.length - 1] : SHADE_BANDS[bandIndex];
  return randomChoice(band.chars);
};

const createBaseGrid = (columns: number, rows: number): BaseCell[][] =>
  Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => ({
      char: randomChoice(BACKDROP_CHARACTERS),
      alpha: randomBetween(0.06, 0.12),
    })),
  );

const createNoiseField = (columns: number, rows: number): number[][] =>
  Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => randomBetween(-0.08, 0.08)),
  );

const createBlob = (columns: number, rows: number): CloudBlob => {
  const radius = randomBetween(20, 38);
  const aspect = randomBetween(0.6, 1.35);
  const radiusX = radius;
  const radiusY = radius * aspect;
  const speed = randomBetween(0.00028, 0.00058);
  const direction = randomBetween(0, Math.PI * 2);

  const life = randomBetween(105000, 165000);

  return {
    cx: randomBetween(-WRAP_MARGIN, columns + WRAP_MARGIN),
    cy: randomBetween(-WRAP_MARGIN, rows + WRAP_MARGIN),
    baseRadiusX: radiusX,
    baseRadiusY: radiusY,
    rotation: randomBetween(0, Math.PI * 2),
    rotationSpeed: randomBetween(-0.00005, 0.00005),
    intensity: randomBetween(0.35, 0.58),
    velocityX: Math.cos(direction) * speed,
    velocityY: Math.sin(direction) * speed,
    wobbleAmplitude: randomBetween(0.08, 0.16),
    wobbleSpeed: randomBetween(0.00035, 0.00085),
    wobblePhase: randomBetween(0, Math.PI * 2),
    life,
    maxLife: life,
  };
};

const resetBlob = (columns: number, rows: number): CloudBlob => createBlob(columns, rows);

const updateBlob = (blob: CloudBlob, delta: number, columns: number, rows: number) => {
  const cx = blob.cx + blob.velocityX * delta;
  const cy = blob.cy + blob.velocityY * delta;
  let wrappedX = cx;
  let wrappedY = cy;

  if (wrappedX > columns + WRAP_MARGIN) {
    wrappedX = -WRAP_MARGIN;
  } else if (wrappedX < -WRAP_MARGIN) {
    wrappedX = columns + WRAP_MARGIN;
  }

  if (wrappedY > rows + WRAP_MARGIN) {
    wrappedY = -WRAP_MARGIN;
  } else if (wrappedY < -WRAP_MARGIN) {
    wrappedY = rows + WRAP_MARGIN;
  }

  return {
    ...blob,
    cx: wrappedX,
    cy: wrappedY,
    rotation: blob.rotation + blob.rotationSpeed * delta,
    life: blob.life - delta,
  };
};

const drawBackdrop = (
  ctx: CanvasRenderingContext2D,
  grid: BaseCell[][],
  columns: number,
  rows: number,
  gridOffsetX: number,
  gridOffsetY: number,
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${CELL_SIZE * 0.78}px "JetBrains Mono", "Fira Code", "Menlo", monospace`;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const cell = grid[row][col];
      ctx.fillStyle = `rgba(255, 255, 255, ${cell.alpha})`;
      const x = gridOffsetX + col * CELL_SIZE + CELL_SIZE / 2;
      const y = gridOffsetY + row * CELL_SIZE + CELL_SIZE / 2;
      ctx.fillText(cell.char, x, y);
    }
  }
};

const drawFrame = (ctx: CanvasRenderingContext2D, state: State, now: number) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${CELL_SIZE * 0.86}px "JetBrains Mono", "Fira Code", "Menlo", monospace`;

  const sinCache = new Map<number, number>();
  const cosCache = new Map<number, number>();

  const resolveSin = (value: number) => {
    let cached = sinCache.get(value);
    if (cached === undefined) {
      cached = Math.sin(value);
      sinCache.set(value, cached);
    }
    return cached;
  };

  const resolveCos = (value: number) => {
    let cached = cosCache.get(value);
    if (cached === undefined) {
      cached = Math.cos(value);
      cosCache.set(value, cached);
    }
    return cached;
  };

  for (let row = 0; row < state.rows; row += 1) {
    const verticalGradient = 0.18 + (1 - row / state.rows) * 0.08;
    for (let col = 0; col < state.columns; col += 1) {
      const jitter = state.noise[row][col];
      let brightness = verticalGradient + jitter * 0.45;

      state.blobs.forEach((blob) => {
        const cos = resolveCos(blob.rotation);
        const sin = resolveSin(blob.rotation);
        const dx = col - blob.cx;
        const dy = row - blob.cy;
        const pulse =
          1 + Math.sin(now * blob.wobbleSpeed + blob.wobblePhase) * blob.wobbleAmplitude;
        const radiusX = Math.max(blob.baseRadiusX * pulse, 12);
        const radiusY = Math.max(blob.baseRadiusY * pulse, 12);

        const localX = (dx * cos - dy * sin) / radiusX;
        const localY = (dx * sin + dy * cos) / radiusY;
        const distanceSq = localX * localX + localY * localY;

        const lifeProgress = 1 - blob.life / blob.maxLife;
        const fadeIn = clamp(lifeProgress / 0.18, 0, 1);
        const fadeOut = clamp(blob.life / (blob.maxLife * 0.25), 0, 1);
        const envelope = fadeIn * fadeOut;

        const influence = Math.exp(-distanceSq * 1.25) * blob.intensity * envelope;
        brightness += influence;
      });

      brightness = clamp(brightness, 0, 1);

      const char = pickShadeCharacter(brightness, jitter);
      const alpha = 0.12 + brightness * 0.82;

      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      const x = state.gridOffsetX + col * CELL_SIZE + CELL_SIZE / 2;
      const y = state.gridOffsetY + row * CELL_SIZE + CELL_SIZE / 2;
      ctx.fillText(char, x, y);
    }
  }
};

const AsciiScreensaver = () => {
  const baseCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>();
  const stateRef = useRef<State | null>(null);
  const lastTimestampRef = useRef<number>(performance.now());
  const lastDrawRef = useRef<number>(performance.now());

  useEffect(() => {
    const baseCanvas = baseCanvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!baseCanvas || !overlayCanvas) {
      return;
    }

    const baseCtx = baseCanvas.getContext("2d");
    const overlayCtx = overlayCanvas.getContext("2d");
    if (!baseCtx || !overlayCtx) {
      return;
    }

    const setupState = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const scale = window.devicePixelRatio || 1;
      const columns = Math.ceil(width / CELL_SIZE) + 6;
      const rows = Math.ceil(height / CELL_SIZE) + 6;
      const gridOffsetX = -CELL_SIZE * 3;
      const gridOffsetY = -CELL_SIZE * 3;

      baseCanvas.style.width = `${width}px`;
      baseCanvas.style.height = `${height}px`;
      baseCanvas.width = Math.floor(width * scale);
      baseCanvas.height = Math.floor(height * scale);
      baseCtx.setTransform(scale, 0, 0, scale, 0, 0);

      overlayCanvas.style.width = `${width}px`;
      overlayCanvas.style.height = `${height}px`;
      overlayCanvas.width = Math.floor(width * scale);
      overlayCanvas.height = Math.floor(height * scale);
      overlayCtx.setTransform(scale, 0, 0, scale, 0, 0);

      const baseGrid = createBaseGrid(columns, rows);
      drawBackdrop(baseCtx, baseGrid, columns, rows, gridOffsetX, gridOffsetY);

      const noise = createNoiseField(columns, rows);
      const blobCount = width < 640 ? 2 : width < 1024 ? 3 : width < 1600 ? 4 : 5;
      const blobs = Array.from({ length: blobCount }, () => createBlob(columns, rows));

      stateRef.current = {
        columns,
        rows,
        gridOffsetX,
        gridOffsetY,
        baseGrid,
        noise,
        blobs,
      };

      lastTimestampRef.current = performance.now();
      lastDrawRef.current = performance.now();
    };

    setupState();

    let resizeTimeout: number | undefined;
    const handleResize = () => {
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout);
      }
      resizeTimeout = window.setTimeout(() => {
        setupState();
      }, 180);
    };

    const tick = (timestamp: number) => {
      const now = timestamp || performance.now();
      const state = stateRef.current;
      if (!state) {
        animationFrameRef.current = requestAnimationFrame(tick);
        return;
      }

      const delta = Math.min(now - lastTimestampRef.current, 120);
      lastTimestampRef.current = now;

      state.blobs = state.blobs.map((blob) => {
        const aliveBlob = blob.life <= 0 ? createBlob(state.columns, state.rows) : blob;
        const updated = updateBlob(aliveBlob, delta, state.columns, state.rows);
        return updated.life <= 0 ? resetBlob(state.columns, state.rows) : updated;
      });

      if (now - lastDrawRef.current >= FRAME_INTERVAL) {
        drawFrame(overlayCtx, state, now);
        lastDrawRef.current = now;
      }

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);
    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", handleResize);
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout);
      }
    };
  }, []);

  return (
    <div className="ascii-screensaver" aria-hidden="true">
      <div className="ascii-screensaver__backdrop"></div>
      <canvas
        ref={baseCanvasRef}
        className="ascii-screensaver__canvas ascii-screensaver__canvas--base"
      />
      <canvas
        ref={overlayCanvasRef}
        className="ascii-screensaver__canvas ascii-screensaver__canvas--overlay"
      />
      <div className="ascii-screensaver__texture"></div>
      <div className="ascii-screensaver__vignette"></div>
    </div>
  );
};

export default AsciiScreensaver;
