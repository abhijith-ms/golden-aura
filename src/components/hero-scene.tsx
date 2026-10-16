"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ACESFilmicToneMapping, DataTexture, LinearFilter, Mesh, NearestFilter, PMREMGenerator, SRGBColorSpace, type Group, type Material, type Texture } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { dampHeroAngle, heroPointerTarget } from "@/lib/hero-policy";
import styles from "./site.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = { frame: RefObject<HTMLDivElement | null>; active: boolean; onReady: () => void; onFailure: () => void };

function disposeModel(model: Group) {
  const materials = new Set<Material>();
  const textures = new Set<Texture>();
  model.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    object.geometry.dispose();
    (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => materials.add(material));
  });
  materials.forEach((material) => {
    Object.values(material).forEach((value) => { if (value?.isTexture) textures.add(value); });
    material.dispose();
  });
  textures.forEach((texture) => texture.dispose());
}

function Sculpture({ frame, active, onReady, onFailure }: Props) {
  const { gl, scene, camera, invalidate } = useThree();
  const [model, setModel] = useState<Group>();
  const [presented, setPresented] = useState(false);
  const [prepared, setPrepared] = useState(false);
  const scrollGroup = useRef<Group>(null);
  const pointerGroup = useRef<Group>(null);
  const target = useRef({ yaw: 0, pitch: 0 });
  const activeRef = useRef(active);
  const board = useMemo(() => {
    const pixels = new Uint8Array(4 * 4 * 4);
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
      pixels.set((x + y) % 2 ? [111, 96, 69, 255] : [30, 37, 32, 255], (y * 4 + x) * 4);
    }
    const texture = new DataTexture(pixels, 4, 4);
    texture.colorSpace = SRGBColorSpace;
    texture.magFilter = texture.minFilter = NearestFilter;
    texture.needsUpdate = true;
    return texture;
  }, []);
  const shadow = useMemo(() => {
    const pixels = new Uint8Array(64 * 64 * 4);
    for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
      const radius = ((x - 31.5) / 31.5) ** 2 + ((y - 31.5) / 31.5) ** 2;
      pixels[(y * 64 + x) * 4 + 3] = Math.round(160 * Math.exp(-radius * 5) * Math.max(0, 1 - radius));
    }
    const texture = new DataTexture(pixels, 64, 64);
    texture.magFilter = texture.minFilter = LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }, []);

  useEffect(() => () => { shadow.dispose(); board.dispose(); }, [shadow, board]);
  useEffect(() => {
    activeRef.current = active;
    target.current = { yaw: 0, pitch: 0 };
    pointerGroup.current?.rotation.set(0, 0, 0);
    if (active) invalidate();
  }, [active, invalidate]);
  useEffect(() => {
    gl.domElement.addEventListener("webglcontextlost", onFailure);
    return () => gl.domElement.removeEventListener("webglcontextlost", onFailure);
  }, [gl, onFailure]);

  useEffect(() => {
    const abort = new AbortController();
    let cancelled = false;
    let owned: Group | undefined;
    async function load() {
      try {
        const response = await fetch("/models/knight.glb", { signal: abort.signal });
        if (!response.ok) throw new Error("Knight unavailable");
        const result = await new GLTFLoader().parseAsync(await response.arrayBuffer(), "");
        owned = result.scene;
        if (cancelled) disposeModel(owned);
        else setModel(owned);
      } catch {
        if (!cancelled) onFailure();
      }
    }
    void load();
    return () => {
      cancelled = true;
      abort.abort();
      if (owned) disposeModel(owned);
    };
  }, [onFailure]);

  useEffect(() => {
    const environment = new RoomEnvironment();
    const generator = new PMREMGenerator(gl);
    const target = generator.fromScene(environment, 0.04);
    scene.environment = target.texture;
    scene.environmentIntensity = 0.65;
    environment.dispose();
    generator.dispose();
    return () => { scene.environment = null; target.dispose(); };
  }, [gl, scene]);

  useEffect(() => {
    if (!model || !active || prepared) return;
    let cancelled = false;
    camera.lookAt(0, 0.36, 0);
    async function prepare() {
      try {
        await gl.compileAsync(scene, camera);
        if (cancelled) return;
        gl.render(scene, camera);
        setPrepared(true);
        invalidate();
        onReady();
      } catch {
        if (!cancelled) onFailure();
      }
    }
    void prepare();
    return () => { cancelled = true; };
  }, [model, active, prepared, gl, scene, camera, invalidate, onReady, onFailure]);

  useEffect(() => {
    if (!prepared) return;
    const handoff = setTimeout(() => setPresented(true), 450);
    return () => clearTimeout(handoff);
  }, [prepared]);

  useGSAP(() => {
    const artwork = frame.current;
    const hero = artwork?.closest("section");
    if (!presented || !artwork || !hero || !scrollGroup.current) return;
    const progress = { value: 0 };
    const requestFrame = () => { if (activeRef.current) invalidate(); };
    const timeline = gsap.timeline({ scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.35 } });
    timeline.to(progress, { value: 1, ease: "none", onUpdate: () => {
      if (!scrollGroup.current) return;
      scrollGroup.current.rotation.set(-0.045 * progress.value, Math.PI * 16 / 180 * progress.value, 0);
      camera.position.y = 1.05 + 0.18 * progress.value;
      camera.lookAt(0, 0.36, 0);
      requestFrame();
    } }, 0);
    timeline.to(artwork, { y: 88, scale: 1.035, ease: "none" }, 0);
    timeline.to(hero.querySelector("[data-hero-copy]"), { y: 28, opacity: 0.7, ease: "none" }, 0);
    const intro = hero.nextElementSibling?.querySelector("[data-hero-intro]");
    if (intro) timeline.to(intro, { y: -18, ease: "none" }, 0);

    function reset() {
      if (!target.current.yaw && !target.current.pitch && !pointerGroup.current?.rotation.x && !pointerGroup.current?.rotation.y) return;
      target.current = { yaw: 0, pitch: 0 };
      requestFrame();
    }
    function move(event: PointerEvent) {
      if (!activeRef.current || event.pointerType !== "mouse" || event.buttons || window.getSelection()?.isCollapsed === false || (event.target as Element).closest("[data-hero-copy], a, button")) { reset(); return; }
      const rect = artwork!.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) { reset(); return; }
      target.current = heroPointerTarget((event.clientX - rect.left) / rect.width * 2 - 1, (event.clientY - rect.top) / rect.height * 2 - 1);
      requestFrame();
    }
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", reset, { passive: true });
    return () => {
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", reset);
      scrollGroup.current?.rotation.set(0, 0, 0);
      camera.position.y = 1.05;
      camera.lookAt(0, 0.36, 0);
    };
  }, { dependencies: [presented, frame, camera, invalidate], revertOnUpdate: true });

  useFrame((_, seconds) => {
    const group = pointerGroup.current;
    if (!active || !presented || !group) return;
    group.rotation.y = dampHeroAngle(group.rotation.y, target.current.yaw, seconds);
    group.rotation.x = dampHeroAngle(group.rotation.x, target.current.pitch, seconds);
    if (group.rotation.y !== target.current.yaw || group.rotation.x !== target.current.pitch) invalidate();
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[-3, 4, 4]} color="#fff0d7" intensity={4} />
      <directionalLight position={[3, 2, -2]} color="#e4d4ab" intensity={3} />
      <directionalLight position={[2, 1, 3]} color="#dce4e5" intensity={0.7} />
      <group ref={scrollGroup}>
        <group rotation={[0, -0.22, 0]}>
          <mesh position={[0, -0.038, 0]}>
            <boxGeometry args={[1.08, 0.05, 1.08]} />
            <meshStandardMaterial color="#171d19" roughness={0.45} />
          </mesh>
          <mesh position={[0, -0.015, 0]}>
            <boxGeometry args={[1.07, 0.006, 1.07]} />
            <meshStandardMaterial color="#a18a58" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.011, 0]}>
            <planeGeometry args={[1.03, 1.03]} />
            <meshStandardMaterial map={board} roughness={0.5} />
          </mesh>
        </group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.003, 0]}>
          <planeGeometry args={[0.9, 0.9]} />
          <meshBasicMaterial map={shadow} transparent depthWrite={false} toneMapped={false} />
        </mesh>
        <group ref={pointerGroup}>
          {model && <primitive object={model} rotation={[0, 2.2, 0]} dispose={null} />}
        </group>
      </group>
    </>
  );
}

export default function HeroScene(props: Props) {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true, syncTouch: false, stopInertiaOnNavigate: true, allowNestedScroll: true, prevent: (node) => node.matches("dialog") });
    const tick = (time: number) => lenis.raf(time * 1000);
    const interrupt = () => { lenis.stop(); lenis.start(); };
    const keydown = (event: KeyboardEvent) => {
      if (["Tab", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) interrupt();
    };
    const update = () => {
      gsap.ticker.remove(tick);
      if (document.visibilityState === "visible") gsap.ticker.add(tick);
    };
    lenis.on("scroll", ScrollTrigger.update);
    document.addEventListener("visibilitychange", update);
    window.addEventListener("keydown", keydown);
    window.addEventListener("click", interrupt);
    update();
    return () => {
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("click", interrupt);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return (
    <div className={styles.heroCanvas}>
      <Canvas
        aria-hidden="true"
        style={{ pointerEvents: "none" }}
        frameloop={props.active ? "demand" : "never"}
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.05, 2.7], fov: 30, near: 0.1, far: 20 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power", toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
        fallback={null}
        onCreated={({ events }) => {
          events.disconnect?.();
        }}
      >
        <Sculpture {...props} />
      </Canvas>
    </div>
  );
}
