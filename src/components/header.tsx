"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./site.module.css";

const links = [
  ["/about", "The Trust"],
  ["/events", "Events"],
  ["/gallery", "Gallery"],
  ["/partners", "Partners"],
];
export function Header() {
  const pathname = usePathname();
  const menu = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

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
    const desktop = window.matchMedia("(min-width: 761px)");
    const onResize = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);
  const items = (
    <>
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
        Get in touch <span aria-hidden="true">↗</span>
      </Link>
    </>
  );
  return (
    <header className={`${styles.header} ${pathname === "/" ? styles.headerDark : ""}`}>
      <a
        href="/#top"
        className={styles.brand}
        aria-label="Golden Aura Trust home"
      >
        <Image
          src="/images/golden-aura-logo.webp"
          alt=""
          width={66}
          height={52}
          priority
        />
      </a>
      <nav className={styles.desktopNav} aria-label="Main navigation">
        {items}
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
          Menu <span aria-hidden="true">＋</span>
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
            if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) setOpen(false);
          }
        }}
      >
        <div className={styles.drawerHeader}>
          <Image src="/images/golden-aura-logo.webp" alt="Golden Aura Trust" width={66} height={52} />
          <button className={styles.drawerClose} type="button" aria-label="Close menu" autoFocus onClick={() => setOpen(false)}>×</button>
        </div>
        <h2 id="mobile-navigation-title" className={styles.drawerTitle}>Explore.</h2>
        <nav
          aria-label="Mobile navigation"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          <a href="/#top" aria-current={pathname === "/" ? "page" : undefined}>Home</a>
          {items}
        </nav>
      </dialog>
    </header>
  );
}
