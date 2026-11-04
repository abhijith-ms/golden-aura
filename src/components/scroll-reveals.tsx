"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { startReveals } from "@/lib/reveal-motion";

export function ScrollReveals() {
  const pathname = usePathname();
  useEffect(() => {
    // Browser history owns restored positions; never replay an introduction over them.
    return startReveals(document.querySelector("main") ?? document, window.scrollY < 40);
  }, [pathname]);
  return null;
}
