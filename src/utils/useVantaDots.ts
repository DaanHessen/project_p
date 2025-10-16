import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

declare global {
  interface Window {
    THREE?: typeof THREE;
  }
}

type VantaOptions = Record<string, unknown>;

type UseVantaDotsConfig = {
  respectReducedMotion?: boolean;
};

type VantaInstance = {
  destroy?: () => void;
  setOptions?: (options: Record<string, unknown>) => void;
};

type VantaDotsInstance = VantaInstance & {
  camera?: {
    position: { x: number; y: number; z: number } & {
      set?: (x: number, y: number, z: number) => unknown;
    };
    tx?: number;
    ty?: number;
    tz?: number;
  };
  starField?: {
    position: { x: number; y: number; z: number } & {
      set?: (x: number, y: number, z: number) => unknown;
    };
    scale: { x: number; y: number; z: number } & {
      set?: (x: number, y: number, z: number) => unknown;
    };
  };
  options?: { spacing?: number };
};

const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const adjustDotsLayout = (
  effect: VantaDotsInstance,
  element?: HTMLElement | null
) => {
  if (!effect?.starField || !effect.camera) return;

  const spacing =
    (effect as unknown as { options?: { spacing?: number } }).options
      ?.spacing ?? 20;
  const rect = element?.getBoundingClientRect();
  const width = rect?.width ?? window.innerWidth;
  const height = rect?.height ?? window.innerHeight;
  const baseSpan = spacing * 60;
  const widthFactor = Math.max(1, width / baseSpan);
  const heightFactor = Math.max(1, height / baseSpan);

  const scaleX = 3.4 + widthFactor * 1.9;
  const scaleZ = 4.8 + heightFactor * 2.4;

  effect.starField.scale.set?.(scaleX, 1, scaleZ);
  effect.starField.position.set?.(0, -spacing * 32, -spacing * 34 * scaleZ);

  const material = (effect.starField as unknown as { material?: unknown })
    ?.material as any;
  if (material) {
    const colorHex =
      (effect as unknown as { options?: { color?: number } }).options
        ?.color ?? 0x3b82f6;
    material.color = new THREE.Color(colorHex);
    const baseSize =
      (effect as unknown as { options?: { size?: number } }).options?.size ??
      1.0;
    material.size = baseSize * 1.2;
    material.transparent = true;
    material.opacity = 0.96;
    material.blending = THREE.AdditiveBlending;
    material.depthWrite = false;
    material.needsUpdate = true;
  }

  const cameraY = 180 + heightFactor * 30;
  const cameraZ = 260 + heightFactor * 55;
  effect.camera.position.y = cameraY;
  effect.camera.position.z = cameraZ;
  effect.camera.tx = 0;
  effect.camera.ty = cameraY * 0.58;
  effect.camera.tz = cameraZ + scaleZ * 22;
};

const useVantaDots = (
  options: VantaOptions = {},
  { respectReducedMotion = true }: UseVantaDotsConfig = {}
) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const effectRef = useRef<VantaInstance | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (effectRef.current) return;
    if (typeof window === "undefined") return;
    if (respectReducedMotion && prefersReducedMotion()) return;

    let cancelled = false;

    const handleResize = () => {
      if (effectRef.current && containerRef.current) {
        adjustDotsLayout(
          effectRef.current as VantaDotsInstance,
          containerRef.current
        );
      }
    };

    const init = async () => {
      try {
        if (!window.THREE) {
          window.THREE = THREE;
        }

        const { default: DOTS } = await import("vanta/dist/vanta.dots.min");

        if (cancelled || !containerRef.current) return;

        const effect = DOTS({
          el: containerRef.current,
          THREE,
          mouseControls: false,
          touchControls: false,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0x0a0c14,
          color: 0x3b82f6,
          color2: 0x1d4ed8,
          spacing: 4.5,
          size: 1.25,
          showLines: false,
          ...options,
        }) as VantaDotsInstance;

        adjustDotsLayout(effect, containerRef.current);
        effectRef.current = effect;

        setIsActive(true);
        handleResize();
      } catch (error) {
        console.error("Failed to initialize Vanta DOTS", error);
      }
    };

    init();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      effectRef.current?.destroy?.();
      effectRef.current = null;
      setIsActive(false);
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [respectReducedMotion]);

  useEffect(() => {
    if (!effectRef.current) return;
    const effect = effectRef.current as VantaDotsInstance;
    effect.setOptions?.(options);
    adjustDotsLayout(effect, containerRef.current);
  }, [options]);

  return { containerRef, isActive };
};

export default useVantaDots;
