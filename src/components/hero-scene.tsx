"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ACESFilmicToneMapping, DataTexture, LinearFilter, Mesh, PMREMGenerator, type Group, type Material, type Texture } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import styles from "./site.module.css";

type Props = { active: boolean; onReady: () => void; onFailure: () => void };

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

function Sculpture({ active, onReady, onFailure }: Props) {
  const { gl, scene, camera, invalidate } = useThree();
  const [model, setModel] = useState<Group>();
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
    if (!model || !active) return;
    let cancelled = false;
    camera.lookAt(0, 0.46, 0);
    async function prepare() {
      try {
        await gl.compileAsync(scene, camera);
        if (cancelled) return;
        gl.render(scene, camera);
        invalidate();
        onReady();
      } catch {
        if (!cancelled) onFailure();
      }
    }
    void prepare();
    return () => { cancelled = true; };
  }, [model, active, gl, scene, camera, invalidate, onReady, onFailure]);

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[-3, 4, 4]} color="#fff0d7" intensity={4} />
      <directionalLight position={[3, 2, -2]} color="#e4d4ab" intensity={3} />
      <directionalLight position={[2, 1, 3]} color="#dce4e5" intensity={0.7} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.003, 0]}>
        <planeGeometry args={[0.9, 0.9]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      {model && <primitive object={model} rotation={[0, 2.2, 0]} dispose={null} />}
    </>
  );
}

export default function HeroScene(props: Props) {
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
