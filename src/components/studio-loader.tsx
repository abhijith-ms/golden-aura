"use client";
import dynamic from "next/dynamic";
const Studio = dynamic(() => import("./studio"), {
  ssr: false,
  loading: () => (
    <p style={{ padding: 32 }}>Loading the Trust’s editing workspace…</p>
  ),
});
export default Studio;
