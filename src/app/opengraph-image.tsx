import { ImageResponse } from "next/og";

export const alt = "Golden Aura Trust — Chess for everyone";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", background: "#111312", color: "#faf7f0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 22, letterSpacing: 5, marginBottom: 24 }}>GOLDEN AURA TRUST / BENGALURU</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: 96, lineHeight: 1, fontWeight: 700 }}><span>CHESS FOR</span><span style={{ color: "#c4af78" }}>EVERYONE.</span></div>
      <div style={{ display: "flex", marginTop: 48, flexWrap: "wrap", width: 800, height: 160 }}>{Array.from({ length: 32 }, (_, i) => <div key={i} style={{ width: 100, height: 40, background: (Math.floor(i / 8) + i % 8) % 2 ? "#30322b" : "#c4af78" }} />)}</div>
    </div>, size,
  );
}
