"use client";

import { Vector2 } from "three";

const pawn = [
  [0, 0], [0.14, 0], [0.16, 0.025], [0.16, 0.055], [0.14, 0.08],
  [0.115, 0.1], [0.09, 0.17], [0.055, 0.29], [0.06, 0.31],
  [0.095, 0.32], [0.095, 0.345], [0.055, 0.37],
  ...Array.from({ length: 17 }, (_, i) => {
    const angle = -Math.PI / 2 + i * Math.PI / 16;
    return [Math.max(0, Math.cos(angle) * 0.095), 0.47 + Math.sin(angle) * 0.095];
  }),
].map(([radius, height]) => new Vector2(radius, height));

const rook = [
  [0, 0], [0.17, 0], [0.19, 0.025], [0.19, 0.065], [0.16, 0.09],
  [0.13, 0.13], [0.105, 0.39], [0.15, 0.43], [0.16, 0.46],
  [0.16, 0.53], [0.12, 0.53], [0.12, 0.49], [0, 0.49],
].map(([radius, height]) => new Vector2(radius, height));

export function HeroPawn({ color }: { color: string }) {
  return <mesh>
    <latheGeometry args={[pawn, 48]} />
    <meshStandardMaterial color={color} metalness={0.55} roughness={0.27} />
  </mesh>;
}

export function HeroRook() {
  return <group>
    <mesh>
      <latheGeometry args={[rook, 48]} />
      <meshStandardMaterial color="#b8b4a6" metalness={0.2} roughness={0.35} />
    </mesh>
    {Array.from({ length: 6 }, (_, i) => {
      const angle = i * Math.PI / 3;
      return <mesh key={i} position={[Math.sin(angle) * 0.14, 0.565, Math.cos(angle) * 0.14]} rotation={[0, angle, 0]}>
        <boxGeometry args={[0.085, 0.08, 0.075]} />
        <meshStandardMaterial color="#b8b4a6" metalness={0.2} roughness={0.35} />
      </mesh>;
    })}
  </group>;
}
