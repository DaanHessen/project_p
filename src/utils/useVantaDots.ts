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
    material?: unknown;
  };
  options?: { spacing?: number; color?: number; color2?: number; size?: number };
};

const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const adjustDotsLayout = (
  effect: VantaDotsInstance,
  element: HTMLElement | null | undefined,
) => {
  if (!effect?.starField || !effect.camera) return;

  const options = effect.options ?? {};
  const spacing = typeof options.spacing === "number" ? options.spacing : 20;
  const rect = element?.getBoundingClientRect();
  const width = rect?.width ?? window.innerWidth;
  const height = rect?.height ?? window.innerHeight;
  const baseSpan = spacing * 60;
  const widthFactor = Math.max(1, width / baseSpan);
  const heightFactor = Math.max(1, height / baseSpan);

  const scaleX = 4.2 + widthFactor * 2.6;
  const scaleZ = 6.1 + heightFactor * 2.9;

  effect.starField.scale.set?.(scaleX, 1, scaleZ);
  effect.starField.position.set?.(0, -spacing * 30, -spacing * 32 * scaleZ);

  const material = effect.starField.material as any;
  if (material) {
    const baseSize =
      typeof options.size === "number" ? options.size : 1.0;
    if (typeof baseSize === "number") {
      material.size = baseSize * 2.2;
    }

    const primaryColor =
      typeof options.color === "number" ? options.color : 0x3b82f6;
    const secondaryColor =
      typeof options.color2 === "number" ? options.color2 : 0x60a5fa;
    const mixedColor = new THREE.Color(primaryColor).lerp(
      new THREE.Color(secondaryColor),
      0.25,
    );

    if (material.color instanceof THREE.Color) {
      material.color.copy(mixedColor);
    } else if (material.color && typeof material.color === "object" && "set" in material.color) {
      (material.color.set as (color: unknown) => void)?.(mixedColor);
    }

    material.transparent = true;
    material.opacity = 0.9;
    material.depthWrite = false;
    material.blending = THREE.AdditiveBlending;
    material.fog = true;
    material.needsUpdate = true;
  }

  const cameraY = 190 + heightFactor * 36;
  const cameraZ = 280 + heightFactor * 60;
  effect.camera.position.y = cameraY;
  effect.camera.position.z = cameraZ;
  effect.camera.tx = 0;
  effect.camera.ty = cameraY;
  effect.camera.tz = cameraZ;
  effect.camera.lookAt?.(0, 0, 0);

  const effectWithTime = effect as {
    t?: number;
    t2?: number;
  };
  if (typeof effectWithTime.t === "number") {
    effectWithTime.t = Math.max(effectWithTime.t, 600);
  }
  if (typeof effectWithTime.t2 === "number") {
    effectWithTime.t2 = Math.max(effectWithTime.t2, 600);
  }
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
          containerRef.current,
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
