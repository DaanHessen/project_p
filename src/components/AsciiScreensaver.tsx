import { useEffect, useRef } from "react";
import "./AsciiScreensaver.css";

type BaseCell = {
  char: string;
  alpha: number;
};

type CellNoise = {
  jitter: number;
  paletteBias: number;
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
  noise: CellNoise[][];
  blobs: CloudBlob[];
  revealDelays: number[][];
};

const CELL_SIZE = 14;
const FRAME_INTERVAL = 1000 / 22;
const WRAP_MARGIN = 8;
const REVEAL_DURATION = 1000;
const REVEAL_FADE = 520;

const ASCII_PALETTE = [" ", "`", ".", ":", ";", "~", "+", "=", "*", "#", "%", "@"] as const;

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const pickShadeCharacter = (intensity: number, noise: CellNoise, palette: readonly string[]) => {
  const adjusted = clamp(intensity + noise.jitter, 0, 1);
  const paletteSize = palette.length;
  const scaled = adjusted * (paletteSize - 1);
  const biased = scaled + noise.paletteBias * 0.6;
  const index = Math.max(0, Math.min(paletteSize - 1, Math.round(biased)));
  return palette[index];
};

const createBaseGrid = (columns: number, rows: number): BaseCell[][] =>
  Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => ({
      char: " ",
      alpha: 0,
    })),
  );

const createNoiseField = (columns: number, rows: number): CellNoise[][] =>
  Array.from({ length: rows }, () =>
    Array.from(
      { length: columns },
      () =>
        ({
          jitter: randomBetween(-0.05, 0.05),
          paletteBias: Math.random() - 0.5,
        }) satisfies CellNoise,
    ),
  );

const createRevealDelays = (columns: number, rows: number): number[][] => {
  const total = columns * rows;
  const indices = Array.from({ length: total }, (_, idx) => idx);

  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const step = REVEAL_DURATION / Math.max(total, 1);
  const delays = Array.from({ length: rows }, () => Array(columns).fill(0));

  indices.forEach((index, order) => {
    const row = Math.floor(index / columns);
    const col = index % columns;
    const baseDelay = order * step;
    const jitter = randomBetween(-step * 0.35, step * 0.35);
    delays[row][col] = Math.max(0, baseDelay + jitter);
  });

  return delays;
};

const createBlob = (columns: number, rows: number, bias?: { x: number; y: number }): CloudBlob => {
  const radius = randomBetween(30, 56);
  const aspect = randomBetween(0.75, 1.35);
  const radiusX = radius;
  const radiusY = radius * aspect;
  const speed = randomBetween(0.0018, 0.0032);
  const direction = randomBetween(0, Math.PI * 2);

  const lifeSpan = randomBetween(105000, 165000);
  const life = lifeSpan - randomBetween(0, lifeSpan * 0.4);

  return {
    cx: bias ? clamp(bias.x + randomBetween(-4, 4), -WRAP_MARGIN, columns + WRAP_MARGIN) : randomBetween(-WRAP_MARGIN, columns + WRAP_MARGIN),
    cy: bias ? clamp(bias.y + randomBetween(-4, 4), -WRAP_MARGIN, rows + WRAP_MARGIN) : randomBetween(-WRAP_MARGIN, rows + WRAP_MARGIN),
    baseRadiusX: radiusX,
    baseRadiusY: radiusY,
    rotation: randomBetween(0, Math.PI * 2),
    rotationSpeed: randomBetween(-0.00005, 0.00005),
    intensity: randomBetween(0.24, 0.45),
    velocityX: Math.cos(direction) * speed,
    velocityY: Math.sin(direction) * speed,
    wobbleAmplitude: randomBetween(0.08, 0.18),
    wobbleSpeed: randomBetween(0.00025, 0.0006),
    wobblePhase: randomBetween(0, Math.PI * 2),
    life,
    maxLife: lifeSpan,
  };
};

const resetBlob = (columns: number, rows: number): CloudBlob => createBlob(columns, rows);

const updateBlob = (
  blob: CloudBlob,
  delta: number,
  columns: number,
  rows: number,
  now: number,
) => {
  const driftMod =
    1 + Math.sin(now * 0.00002 + blob.wobblePhase * 0.5) * 0.2 + Math.cos(now * 0.000015) * 0.1;
  const cx = blob.cx + blob.velocityX * delta * driftMod;
  const cy = blob.cy + blob.velocityY * delta * driftMod;

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

const drawFrame = (
  ctx: CanvasRenderingContext2D,
  state: State,
  now: number,
  characterLUT: string[],
  revealElapsed: number,
) => {
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
    const verticalGradient = 0.14 + (1 - row / state.rows) * 0.06;
    for (let col = 0; col < state.columns; col += 1) {
      const cellNoise = state.noise[row][col];
      const revealDelay = state.revealDelays[row][col];
      const revealProgressRaw = (revealElapsed - revealDelay) / REVEAL_FADE;
      const revealProgress = clamp(revealProgressRaw, 0, 1);
      if (revealProgress <= 0) {
        continue;
      }
      const easedReveal = revealProgress * revealProgress * (3 - 2 * revealProgress);
      let brightness = verticalGradient + cellNoise.jitter * 0.12;

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

        const influence = Math.exp(-distanceSq * 1.05) * blob.intensity * envelope;
        brightness += influence;
      });

      brightness = clamp(brightness * easedReveal, 0, 1);

      const char = pickShadeCharacter(brightness, cellNoise, characterLUT);
      const alpha = (0.1 + brightness * 0.56) * easedReveal;

      ctx.fillStyle = `rgba(186, 194, 209, ${alpha})`;
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
  const revealStartRef = useRef<number>(performance.now());

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

    const characterLUT = Array.from({ length: ASCII_PALETTE.length }, (_, index) => {
      const baseIndex = index;
      const bias = randomBetween(-0.2, 0.2);
      const adjusted = clamp(baseIndex + bias, 0, ASCII_PALETTE.length - 1);
      return ASCII_PALETTE[Math.round(adjusted)];
    });

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
      const revealDelays = createRevealDelays(columns, rows);
      const blobCount = width < 640 ? 2 : width < 1024 ? 3 : width < 1600 ? 4 : 5;
      const blobs = Array.from({ length: blobCount }, (_, index) =>
        index === 0
          ? createBlob(columns, rows, { x: columns / 2, y: rows / 2 })
          : createBlob(columns, rows),
      );

      stateRef.current = {
        columns,
        rows,
        gridOffsetX,
        gridOffsetY,
        baseGrid,
        noise,
        blobs,
        revealDelays,
      };

      revealStartRef.current = performance.now();
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

      const revealElapsed = Math.max(0, now - revealStartRef.current);
      const movementFactor = clamp(revealElapsed / REVEAL_DURATION, 0, 1);
      const effectiveDelta = delta * movementFactor;

      state.blobs = state.blobs.map((blob) => {
        const aliveBlob =
          blob.life <= 0 ? createBlob(state.columns, state.rows) : blob;
        const updated = updateBlob(aliveBlob, effectiveDelta, state.columns, state.rows, now);
        return updated.life <= 0 ? resetBlob(state.columns, state.rows) : updated;
      });

      if (now - lastDrawRef.current >= FRAME_INTERVAL) {
        drawFrame(overlayCtx, state, now, characterLUT, revealElapsed);
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
