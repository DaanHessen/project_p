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
    position: {
      x: number;
      y: number;
      z: number;
    };
    tx?: number;
    ty?: number;
    tz?: number;
  };
  starField?: {
    position?: {
      x: number;
      y: number;
      z: number;
    };
    scale?: {
      set: (x: number, y: number, z: number) => void;
    };
  };
};

const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const adjustDotsLayout = (effect: VantaDotsInstance) => {
  if (!effect?.starField?.scale || !effect.camera) return;

  effect.starField.scale.set(1.6, 1, 2.4);
  effect.starField.position?.set?.(0, 40, -80);

  effect.camera.position.y = 120;
  effect.camera.position.z = 200;
  effect.camera.ty = 90;
  effect.camera.tz = 280;
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
          spacing: 22.0,
          size: 1.6,
          showLines: false,
          ...options,
        }) as VantaDotsInstance;

        adjustDotsLayout(effect);
        effectRef.current = effect;

        setIsActive(true);
      } catch (error) {
        console.error("Failed to initialize Vanta DOTS", error);
      }
    };

    init();

    return () => {
      cancelled = true;
      effectRef.current?.destroy?.();
      effectRef.current = null;
      setIsActive(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [respectReducedMotion]);

  useEffect(() => {
    if (!effectRef.current) return;
    const effect = effectRef.current as VantaDotsInstance;
    effect.setOptions?.(options);
    adjustDotsLayout(effect);
  }, [options]);

  return { containerRef, isActive };
};

export default useVantaDots;
