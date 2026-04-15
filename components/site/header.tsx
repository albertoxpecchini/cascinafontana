"use client";

import { useCallback, useEffect, useEffectEvent, useState } from "react";
import Link from "next/link";
import { navigation } from "./content";
import styles from "./site.module.css";

const headerLinkIds = new Set(["sistema", "attivita", "produzione", "filiera", "strutture", "fontana"]);

const headerLinks = navigation
  .filter((item) => headerLinkIds.has(item.id))
  .map((item) => ({
    href: `#${item.id}`,
    label: item.label,
    featured: item.id === "fontana",
  }));

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const syncScrollState = useEffectEvent(() => {
    const nextScrolled = window.scrollY > 24;
    setScrolled((current) => (current === nextScrolled ? current : nextScrolled));
  });

  useEffect(() => {
    let frame = 0;

    syncScrollState();

    const onScroll = () => {
      if (frame !== 0) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        syncScrollState();
        frame = 0;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <header className={[styles.header, scrolled ? styles.headerScrolled : ""].filter(Boolean).join(" ")}>
      <div className={`${styles.headerInner} ${menuOpen ? styles.headerOpen : ""}`}>
        <Link href="#top" className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true" />
          <span className={styles.brandText}>
            <strong>SOCIETA&apos; AGRICOLA CASCINA FONTANA</strong>
            <small>Rodigo | sistema agricolo di precisione</small>
          </span>
        </Link>

        <button
          className={[styles.menuToggle, menuOpen ? styles.menuToggleOpen : ""].filter(Boolean).join(" ")}
          onClick={() => setMenuOpen((v) => !v)}
          aria-controls="site-primary-nav"
          aria-label="Menu navigazione"
        >
          <span className={styles.menuBar} />
          <span className={styles.menuBar} />
          <span className={styles.menuBar} />
        </button>

        <nav id="site-primary-nav" className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`} aria-label="Sezioni principali">
          {headerLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={[styles.navLink, item.featured ? styles.navLinkFeatured : ""].filter(Boolean).join(" ")}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
