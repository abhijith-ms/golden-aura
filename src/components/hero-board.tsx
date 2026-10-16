"use client";

import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { Path, Shape } from "three";
import { createBoardTextures } from "@/lib/hero-board";

function square(half: number) {
  const shape = new Shape();
  shape.moveTo(-half, -half);
  shape.lineTo(half, -half);
  shape.lineTo(half, half);
  shape.lineTo(-half, half);
  shape.closePath();
  return shape;
}

export function HeroBoard() {
  const { gl } = useThree();
  const textures = useMemo(() => createBoardTextures(gl.capabilities.getMaxAnisotropy()), [gl]);
  const shapes = useMemo(() => {
    const base = square(1.79);
    const trim = square(1.785);
    trim.holes.push(new Path(square(1.775).getPoints()));
    const inlay = square(1.695);
    inlay.holes.push(new Path(square(1.685).getPoints()));
    return { base, trim, inlay };
  }, []);
  useEffect(() => () => { textures.map.dispose(); textures.detail.dispose(); }, [textures]);
  return <group rotation={[-Math.PI / 2, 0, 0]}>
    <mesh position={[0, 0, -0.15]}>
      <extrudeGeometry args={[shapes.base, { depth: 0.11, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 3, steps: 1 }]} />
      <meshStandardMaterial color="#493526" bumpMap={textures.detail} bumpScale={0.004} roughness={0.38} />
    </mesh>
    <mesh position={[0, 0, -0.014]}>
      <shapeGeometry args={[shapes.trim]} />
      <meshStandardMaterial color="#b59a63" metalness={0.7} roughness={0.32} />
    </mesh>
    <mesh position={[0, 0, -0.013]}>
      <shapeGeometry args={[shapes.inlay]} />
      <meshStandardMaterial color="#b59a63" metalness={0.7} roughness={0.32} />
    </mesh>
    <mesh position={[0, 0, -0.011]}>
      <planeGeometry args={[3.36, 3.36]} />
      <meshStandardMaterial map={textures.map} bumpMap={textures.detail} bumpScale={0.002} roughness={0.46} envMapIntensity={0.4} />
    </mesh>
  </group>;
}
