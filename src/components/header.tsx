"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import styles from "./site.module.css";

const links = [
  ["/about", "The Trust"],
  ["/committee", "Committee"],
  ["/events", "Events"],
  ["/gallery", "Gallery"],
  ["/partners", "Partners"],
];

export function Header() {
  const pathname = usePathname();
  const menu = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Dynamic scroll condensation
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const drawer = menu.current;
    if (!drawer) return;
    if (!open) {
      if (drawer.open) drawer.close();
      return;
    }
    drawer.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1001px)");
    const onResize = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
      <Link
        href="/#top"
        className={styles.brand}
        aria-label="Golden Aura Trust home"
      >
        <Image
          src="/images/golden-aura-logo.webp"
          alt="Golden Aura Trust"
          width={84}
          height={64}
          priority
        />
      </Link>

      <nav className={styles.desktopNav} aria-label="Main navigation">
        <Link
          href="/#top"
          className={styles.navLink}
          aria-current={pathname === "/" ? "page" : undefined}
        >
          Home
        </Link>
        {links.map(([href, label]) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={styles.navLink}
              aria-current={isActive ? "page" : undefined}
            >
              {label}
            </Link>
          );
        })}
        <Link href="/contact" className={styles.navCta}>
          <span>Get in touch</span>
          <ArrowUpRight size={15} weight="bold" />
        </Link>
      </nav>

      <div className={styles.mobileMenu}>
        <button
          ref={trigger}
          type="button"
          className={styles.menuButton}
          aria-haspopup="dialog"
          aria-controls="mobile-navigation"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span>Menu</span>
          <List size={18} weight="bold" />
        </button>
      </div>

      <dialog
        ref={menu}
        id="mobile-navigation"
        className={styles.mobileDrawer}
        aria-labelledby="mobile-navigation-title"
        onCancel={() => setOpen(false)}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus({ preventScroll: true });
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            const rect = e.currentTarget.getBoundingClientRect();
            if (
              e.clientX < rect.left ||
              e.clientX > rect.right ||
              e.clientY < rect.top ||
              e.clientY > rect.bottom
            )
              setOpen(false);
          }
        }}
      >
        <div className={styles.drawerHeader}>
          <Image
            src="/images/golden-aura-logo.webp"
            alt="Golden Aura Trust"
            width={72}
            height={56}
          />
          <button
            className={styles.drawerClose}
            type="button"
            aria-label="Close menu"
            autoFocus
            onClick={() => setOpen(false)}
          >
            <X size={20} weight="bold" />
          </button>
        </div>
        <h2 id="mobile-navigation-title" className={styles.drawerTitle}>
          Explore.
        </h2>
        <nav
          aria-label="Mobile navigation"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          <Link
            href="/#top"
            aria-current={pathname === "/" ? "page" : undefined}
          >
            Home
          </Link>
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname.startsWith(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
          <Link href="/contact" className={styles.navCta}>
            <span>Get in touch</span>
            <ArrowUpRight size={16} weight="bold" />
          </Link>
        </nav>
      </dialog>
    </header>
  );
}
