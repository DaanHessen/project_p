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

const fadeInCanvas = (canvas: HTMLCanvasElement | null | undefined) => {
  if (!canvas) return;
  if (canvas.dataset.vantaFadeApplied === "true") {
    canvas.style.opacity = "1";
    return;
  }

  canvas.style.opacity = "0";
  canvas.style.transition = "opacity 1.4s ease";
  canvas.style.willChange = "opacity";
  canvas.dataset.vantaFadeApplied = "true";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      canvas.style.opacity = "1";
    });
  });
};

const applyRendererFade = (effect: VantaDotsInstance) => {
  const canvas =
    (effect as unknown as { renderer?: { domElement?: HTMLCanvasElement } })
      .renderer?.domElement ?? null;
  fadeInCanvas(canvas);
};

const ensureDepthFadeShader = (
  material: THREE.PointsMaterial,
  distance: number,
) => {
  const pointsMaterial = material as THREE.PointsMaterial & {
    userData: {
      vantaDepthFade?:
        | {
            range: { value: number };
            strength: { value: number };
          }
        | undefined;
      vantaDepthFadeCompiled?: boolean;
    };
  };

  pointsMaterial.userData = pointsMaterial.userData ?? {};
  if (!pointsMaterial.userData.vantaDepthFade) {
    pointsMaterial.userData.vantaDepthFade = {
      range: { value: distance },
      strength: { value: 0.65 },
    };
  }

  const fadeUniforms = pointsMaterial.userData.vantaDepthFade;
  fadeUniforms.range.value = Math.max(distance, 180) * 1.25;
  fadeUniforms.strength.value = 0.75;

  if (!pointsMaterial.userData.vantaDepthFadeCompiled) {
    pointsMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uFadeRange = fadeUniforms.range;
      shader.uniforms.uFadeStrength = fadeUniforms.strength;
      shader.fragmentShader = shader.fragmentShader.replace(
        "void main() {",
        `
uniform float uFadeRange;
uniform float uFadeStrength;
void main() {
`
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        "gl_FragColor = vec4( color, alpha );",
        `
float depthRatio = clamp((gl_FragCoord.z / gl_FragCoord.w) / uFadeRange, 0.0, 1.0);
float fadeFactor = mix(1.0, 1.0 - uFadeStrength, depthRatio);
gl_FragColor = vec4( color, alpha * fadeFactor );
`
      );
    };
    pointsMaterial.userData.vantaDepthFadeCompiled = true;
    pointsMaterial.needsUpdate = true;
  }
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
  const baseSpan = spacing * 80;
  const widthFactor = Math.max(1, width / baseSpan);
  const heightFactor = Math.max(1, height / baseSpan);

  const scaleX = 4.9 + widthFactor * 2.6;
  const scaleZ = 5.6 + heightFactor * 2.8;

  effect.starField.scale.set?.(scaleX, 1, scaleZ);
  const verticalShift = spacing * (22 + heightFactor * 4.8);
  const depthShift = spacing * (34 + heightFactor * 7.2);
  effect.starField.position.set?.(0, -verticalShift, -depthShift);

  const material = effect.starField.material as THREE.PointsMaterial | undefined;
  if (material) {
    const baseSize =
      typeof options.size === "number" ? options.size : 1.0;
    material.size = baseSize * 1.4;

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
    } else {
      (material.color as { set?: (color: THREE.Color) => void })?.set?.(
        mixedColor,
      );
    }

    material.transparent = true;
    material.opacity = 0.42;
    material.depthWrite = false;
    material.blending = THREE.AdditiveBlending;
    material.fog = true;
    material.needsUpdate = true;

    ensureDepthFadeShader(material, depthShift + 260);
  }

  const cameraY = 190 + heightFactor * 30;
  const cameraZ = depthShift + 260;
  effect.camera.position.y = cameraY;
  effect.camera.position.z = cameraZ;
  effect.camera.tx = effect.camera.position.x;
  effect.camera.ty = effect.camera.position.y;
  effect.camera.tz = effect.camera.position.z;
  const cameraLookAt = (effect.camera as { lookAt?: (x: number, y: number, z: number) => void }).lookAt;
  if (typeof cameraLookAt === "function") {
    cameraLookAt.call(effect.camera, 0, -verticalShift * 0.18, 0);
  }

  applyRendererFade(effect);

  const effectWithTime = effect as { t?: number; t2?: number };
  if (typeof effectWithTime.t === "number") {
    effectWithTime.t = 1800;
  }
  if (typeof effectWithTime.t2 === "number") {
    effectWithTime.t2 = 1800;
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
        applyRendererFade(effect);
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
    fadeInCanvas(containerRef.current?.querySelector("canvas") as HTMLCanvasElement | null);
  }, [options]);

  return { containerRef, isActive };
};

export default useVantaDots;
