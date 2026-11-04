"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./site.module.css";

export function CommitteeNav({ groups }: { groups: string[] }) {
  const nav = useRef<HTMLElement>(null);
  const [active, setActive] = useState("");
  useEffect(() => {
    const links = Array.from(nav.current?.querySelectorAll("a") ?? []);
    const sections = links.map((link) => document.getElementById(link.hash.slice(1))).filter((node): node is HTMLElement => !!node);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: "-110px 0px -45% 0px" });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [groups]);
  return (
    <nav ref={nav} className={`${styles.sectionCompact} ${styles.committeeNav}`} aria-label="Committee groups">
      {groups.map((group) => {
        const id = group.toLowerCase().replaceAll(" ", "-");
        return <a key={group} href={`#${id}`} aria-current={active === id ? "location" : undefined} onClick={() => setActive(id)}>{group}</a>;
      })}
    </nav>
  );
}
