"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ACESFilmicToneMapping, DataTexture, LinearFilter, Mesh, PerspectiveCamera, PMREMGenerator, type Group, type Material, type MeshStandardMaterial, type Texture } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { createHeroQuality, dampHeroAngle, heroPointerTarget, openingKnightPosition, sampleHeroQuality } from "@/lib/hero-policy";
import { HeroPawn, HeroRook } from "./hero-pieces";
import { HeroBoard } from "./hero-board";
import { heroPieceScale } from "@/lib/hero-board";
import { createQueenFlight, queenFlightPose, queenLanding, queenScale } from "@/lib/hero-flight";
import { renderHeroViewport } from "./hero-viewport";
import styles from "./site.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = { frame: RefObject<HTMLDivElement | null>; active: boolean; dprCap: number; playQueen: boolean; onQueenStart: () => void; onQueenComplete: () => void; onReduceQuality: () => void; onReady: () => void; onFailure: () => void };

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

function Sculpture({ frame, layer, active, playQueen, onQueenStart, onQueenComplete, onReduceQuality, onReady, onFailure }: Props & { layer: RefObject<HTMLDivElement | null> }) {
  const { gl, scene, camera, invalidate } = useThree();
  const [models, setModels] = useState<{ knight: Group; queen: Group }>();
  const [presented, setPresented] = useState(false);
  const [prepared, setPrepared] = useState(false);
  const scrollGroup = useRef<Group>(null);
  const pointerGroup = useRef<Group>(null);
  const knightTravel = useRef<Group>(null);
  const knightShadow = useRef<Group>(null);
  const goldPawn = useRef<Group>(null);
  const ivoryRook = useRef<Group>(null);
  const queenTravel = useRef<Group>(null);
  const queenShadow = useRef<Mesh>(null);
  const flying = useRef(false);
  const landing = useRef<MeshStandardMaterial>(null);
  const entrance = useRef<gsap.core.Timeline | null>(null);
  const scrollMotion = useRef<gsap.core.Timeline | null>(null);
  const quality = useRef(createHeroQuality(gl.getPixelRatio()));
  const target = useRef({ yaw: 0, pitch: 0 });
  const activeRef = useRef(active);
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

  useEffect(() => () => shadow.dispose(), [shadow]);
  useEffect(() => {
    activeRef.current = active;
    sampleHeroQuality(quality.current, 0, false);
    target.current = { yaw: 0, pitch: 0 };
    pointerGroup.current?.rotation.set(0, 0, 0);
    if (!active && flying.current) entrance.current?.progress(1);
    entrance.current?.paused(!active);
    if (active) invalidate();
  }, [active, invalidate]);
  useEffect(() => {
    gl.domElement.addEventListener("webglcontextlost", onFailure);
    const previous = gl.debug.onShaderError;
    gl.debug.onShaderError = onFailure;
    return () => { gl.domElement.removeEventListener("webglcontextlost", onFailure); gl.debug.onShaderError = previous; };
  }, [gl, onFailure]);

  useEffect(() => {
    const abort = new AbortController();
    let cancelled = false;
    const owned: Group[] = [];
    async function piece(name: string) {
      const response = await fetch(`/models/${name}.glb`, { signal: abort.signal });
      if (!response.ok) throw new Error("Chess piece unavailable");
      const result = await new GLTFLoader().parseAsync(await response.arrayBuffer(), "");
      owned.push(result.scene);
      if (cancelled) { disposeModel(result.scene); return; }
      return result.scene;
    }
    async function load() {
      try {
        const [knight, queen] = await Promise.all([piece("knight"), piece("queen")]);
        if (!cancelled && knight && queen) setModels({ knight, queen });
      } catch {
        if (!cancelled) onFailure();
      }
    }
    void load();
    return () => {
      cancelled = true;
      abort.abort();
      owned.forEach(disposeModel);
    };
  }, [onFailure]);

  useEffect(() => {
    queenTravel.current?.traverse((object) => object.layers.set(playQueen ? 1 : 0));
    queenShadow.current?.layers.set(playQueen ? 1 : 0);
  }, [models, playQueen]);

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
    if (!models || !active || prepared || !frame.current || !layer.current) return;
    let cancelled = false;
    camera.lookAt(0.15, 0.35, 0);
    async function prepare() {
      try {
        camera.layers.enableAll();
        await gl.compileAsync(scene, camera);
        if (cancelled) return;
        renderHeroViewport(gl, scene, camera as PerspectiveCamera, frame.current!, layer.current!, false);
        setPrepared(true);
        invalidate();
        onReady();
      } catch {
        if (!cancelled) onFailure();
      }
    }
    void prepare();
    return () => { cancelled = true; };
  }, [models, active, prepared, gl, scene, camera, frame, layer, invalidate, onReady, onFailure]);

  useEffect(() => {
    if (!prepared) return;
    const handoff = setTimeout(() => setPresented(true), 450);
    return () => clearTimeout(handoff);
  }, [prepared]);

  useGSAP(() => {
    const artwork = frame.current;
    const hero = artwork?.closest("section");
    if (!presented || !artwork || !hero || !scrollGroup.current) return;
    const hasFlight = playQueen && hero.getBoundingClientRect().top >= -2;
    const motion = { queen: hasFlight ? 0 : 1, knight: 0, camera: 0, gold: 0, rook: 0, scroll: 0 };
    scrollGroup.current.updateWorldMatrix(true, false);
    const flight = createQueenFlight(camera as PerspectiveCamera, artwork.getBoundingClientRect(), layer.current!.getBoundingClientRect(), scrollGroup.current.matrixWorld);
    const requestFrame = () => { if (activeRef.current) invalidate(); };
    const applyMotion = () => {
      const queen = queenFlightPose(flight, motion.queen);
      queenTravel.current?.position.copy(queen.position);
      queenTravel.current?.quaternion.copy(queen.rotation);
      const queenLayer = motion.queen < 1 ? 1 : 0;
      queenTravel.current?.traverse((object) => object.layers.set(queenLayer));
      if (queenShadow.current) {
        queenShadow.current.layers.set(queenLayer);
        (queenShadow.current.material as Material).opacity = Math.max(0, (motion.queen - 0.7) / 0.3);
      }
      const pose = openingKnightPosition(motion.knight);
      knightTravel.current?.position.set(pose.x, pose.y, pose.z);
      knightShadow.current?.position.set(pose.x, 0, pose.z);
      knightShadow.current?.scale.setScalar(1 + pose.y);
      if (goldPawn.current) goldPawn.current.position.z = 1.05 - 0.42 * motion.gold;
      if (ivoryRook.current) ivoryRook.current.position.z = -1.05 + 0.42 * motion.rook;
      if (landing.current) landing.current.opacity = 0.12 + 0.38 * motion.knight;
      scrollGroup.current?.rotation.set(-0.06 * motion.scroll, -0.25 - 0.48 * motion.scroll, 0);
      camera.position.set(2.8 - motion.camera - 0.4 * motion.scroll, 2.1 + 0.15 * motion.camera + 0.6 * motion.scroll, 3.8 + 0.35 * motion.camera - 0.3 * motion.scroll);
      camera.lookAt(0.15, 0.35, 0);
      requestFrame();
    };
    applyMotion();
    entrance.current = gsap.timeline({ paused: !activeRef.current, onUpdate: applyMotion });
    if (hasFlight) entrance.current.to(motion, { queen: 1, duration: 1.3, ease: "none", onStart: () => { flying.current = true; onQueenStart(); }, onComplete: () => { flying.current = false; onQueenComplete(); } }, 0);
    else onQueenComplete();
    const opening = hasFlight ? 1.75 : 0;
    entrance.current
      .to(motion, { camera: 1, duration: 1.4, ease: "power2.inOut" }, opening)
      .to(motion, { knight: 1, duration: 1.2, ease: "power2.inOut" }, opening + 0.08)
      .to(motion, { gold: 1, duration: 0.8, ease: "power3.out" }, opening + 0.2)
      .to(motion, { rook: 1, duration: 0.8, ease: "power3.out" }, opening + 0.4);
    const timeline = gsap.timeline({ scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.35 } });
    scrollMotion.current = timeline;
    timeline.to(motion, { scroll: 1, ease: "none", onUpdate: applyMotion }, 0);
    timeline.to(artwork, { y: 104, scale: 1.04, ease: "none" }, 0);
    timeline.to(hero.querySelector("[data-hero-copy]"), { y: 28, opacity: 0.7, ease: "none" }, 0);
    const intro = hero.nextElementSibling?.querySelector("[data-hero-intro]");
    if (intro) timeline.to(intro, { y: -18, ease: "none" }, 0);

    function reset() {
      if (!target.current.yaw && !target.current.pitch && !pointerGroup.current?.rotation.x && !pointerGroup.current?.rotation.y) return;
      target.current = { yaw: 0, pitch: 0 };
      requestFrame();
    }
    function move(event: PointerEvent) {
      if (flying.current || !activeRef.current || event.pointerType !== "mouse" || event.buttons || window.getSelection()?.isCollapsed === false || (event.target as Element).closest("[data-hero-copy], a, button")) { reset(); return; }
      const rect = artwork!.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) { reset(); return; }
      target.current = heroPointerTarget((event.clientX - rect.left) / rect.width * 2 - 1, (event.clientY - rect.top) / rect.height * 2 - 1);
      requestFrame();
    }
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", reset, { passive: true });
    const finish = () => { if (flying.current) entrance.current?.progress(1); };
    const key = (event: KeyboardEvent) => { if (["Escape", "Enter", "Tab", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End", " "].includes(event.key)) finish(); };
    const control = (event: PointerEvent) => { if ((event.target as Element).closest("a,button")) finish(); };
    window.addEventListener("scroll", finish, { passive: true });
    window.addEventListener("resize", finish);
    window.addEventListener("keydown", key);
    window.addEventListener("pointerdown", control);
    return () => {
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", reset);
      window.removeEventListener("scroll", finish);
      window.removeEventListener("resize", finish);
      window.removeEventListener("keydown", key);
      window.removeEventListener("pointerdown", control);
      entrance.current = null;
      scrollMotion.current = null;
    };
  }, { dependencies: [presented, frame, camera, invalidate, playQueen, onQueenStart, onQueenComplete, layer], revertOnUpdate: true });

  useFrame(() => {
    if (!active || !frame.current || !layer.current) return;
    try {
      renderHeroViewport(gl, scene, camera as PerspectiveCamera, frame.current, layer.current, flying.current);
    }
    catch { onFailure(); }
  }, 1);

  useFrame((_, seconds) => {
    const group = pointerGroup.current;
    if (!active || !presented || !group) return;
    group.rotation.y = dampHeroAngle(group.rotation.y, target.current.yaw, seconds);
    group.rotation.x = dampHeroAngle(group.rotation.x, target.current.pitch, seconds);
    const pointerMoving = group.rotation.y !== target.current.yaw || group.rotation.x !== target.current.pitch;
    if (pointerMoving) invalidate();
    const moving = pointerMoving || !!entrance.current?.isActive() || !!scrollMotion.current?.scrollTrigger?.getTween()?.isActive();
    const adjustment = sampleHeroQuality(quality.current, seconds, moving);
    if (adjustment === "reduced") onReduceQuality();
    else if (adjustment === "static") onFailure();
  });

  return (
    <>
      <ambientLight intensity={0.35} onUpdate={(light) => light.layers.enableAll()} />
      <directionalLight position={[-3, 4, 4]} color="#fff0d7" intensity={4} onUpdate={(light) => light.layers.enableAll()} />
      <directionalLight position={[3, 2, -2]} color="#e4d4ab" intensity={3} onUpdate={(light) => light.layers.enableAll()} />
      <directionalLight position={[2, 1, 3]} color="#dce4e5" intensity={0.7} onUpdate={(light) => light.layers.enableAll()} />
      <group ref={scrollGroup} rotation={[0, -0.25, 0]}>
        <HeroBoard />
        <group ref={queenTravel} position={queenLanding} scale={queenScale}>
          {models && <primitive object={models.queen} dispose={null} />}
        </group>
        <mesh ref={queenShadow} position={[queenLanding.x, -0.003, queenLanding.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.56, 0.56]} />
          <meshBasicMaterial map={shadow} transparent opacity={playQueen ? 0 : 1} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.63, -0.007, 0.21]}>
          <planeGeometry args={[0.41, 0.41]} />
          <meshStandardMaterial ref={landing} color="#c4af78" emissive="#b08c43" emissiveIntensity={0.5} transparent opacity={0.12} depthWrite={false} />
        </mesh>
        <group ref={knightShadow} position={[-0.21, 0, 0.63]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.003, 0]}>
            <planeGeometry args={[0.54, 0.54]} />
            <meshBasicMaterial map={shadow} transparent depthWrite={false} toneMapped={false} />
          </mesh>
        </group>
        <group ref={knightTravel} position={[-0.21, 0, 0.63]}>
          <group ref={pointerGroup}>
            {models && <primitive object={models.knight} rotation={[0, 2.2, 0]} scale={heroPieceScale.knight} dispose={null} />}
          </group>
        </group>
        <group ref={goldPawn} position={[-0.63, 0, 1.05]} scale={heroPieceScale.pawn}>
          <HeroPawn color="#c4a363" />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.003, 0]}><planeGeometry args={[0.65, 0.65]} /><meshBasicMaterial map={shadow} transparent depthWrite={false} toneMapped={false} /></mesh>
        </group>
        <group ref={ivoryRook} position={[-1.05, 0, -1.05]} scale={heroPieceScale.rook}>
          <HeroRook />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.0025, 0]}><planeGeometry args={[0.65, 0.65]} /><meshBasicMaterial map={shadow} transparent depthWrite={false} toneMapped={false} /></mesh>
        </group>
        <group position={[0.63, 0, -0.63]} scale={heroPieceScale.pawn}>
          <HeroPawn color="#18231e" />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.003, 0]}><planeGeometry args={[0.65, 0.65]} /><meshBasicMaterial map={shadow} transparent depthWrite={false} toneMapped={false} /></mesh>
        </group>
      </group>
    </>
  );
}

export default function HeroScene(props: Props) {
  const layer = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const reveal = useCallback(() => { setShown(true); props.onReady(); }, [props.onReady]);
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
  // shortcut: keep one viewport buffer for projection continuity; shrink if device traces show framebuffer pressure.
  return createPortal(
    <div ref={layer} className={styles.heroViewport} aria-hidden="true" data-ready={shown} style={{ visibility: props.active ? "visible" : "hidden" }}>
      <Canvas
        aria-hidden="true"
        style={{ pointerEvents: "none" }}
        frameloop={props.active ? "demand" : "never"}
        dpr={[1, props.dprCap]}
        camera={{ position: [2.8, 2.1, 3.8], fov: 27, near: 0.03, far: 20 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power", toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
        fallback={null}
        onCreated={({ events }) => {
          events.disconnect?.();
        }}
      >
        <Sculpture {...props} layer={layer} onReady={reveal} />
      </Canvas>
    </div>, document.body
  );
}
