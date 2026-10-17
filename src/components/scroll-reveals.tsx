"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { startScrollReveals } from "@/lib/scroll-reveals";

export function ScrollReveals() {
  const pathname = usePathname();
  useEffect(startScrollReveals, [pathname]);
  return null;
}
