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
  const scaleX = Math.max(2.6, (width / baseSpan) * 2.2);
  const scaleZ = Math.max(3.2, (height / baseSpan) * 2.6);

  effect.starField.scale.set?.(scaleX, 1, scaleZ);
  effect.starField.position.set?.(0, scaleZ * 32, -scaleZ * 75);

  effect.camera.position.y = scaleZ * 44;
  effect.camera.position.z = scaleZ * 68;
  effect.camera.ty = effect.camera.position.y * 0.75;
  effect.camera.tz = effect.camera.position.z + scaleZ * 28;
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
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0x0a0c14,
          color: 0x3b82f6,
          color2: 0x1d4ed8,
          spacing: 6.0,
          size: 1.15,
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
