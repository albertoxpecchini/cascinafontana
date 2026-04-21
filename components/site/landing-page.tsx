"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "./contact-form";
import { GalleryCarousel } from "./gallery-carousel";
import styles from "./landing-page.module.css";

const navigation = [
  { id: "azienda", label: "Azienda" },
  { id: "attivita", label: "Attività" },
  { id: "galleria", label: "Galleria" },
  { id: "contatti", label: "Contatti" },
] as const;

const stats = [
  { value: "63", label: "biolche" },
  { value: "8", label: "mezzi" },
  { value: "30", label: "pannelli" },
  { value: "2007", label: "fondazione" },
] as const;

const activities = [
  {
    title: "Produzione foraggera",
    text: "Prato stabile, mais, soia, grano e patate: colture coordinate in una regia agronomica chiara.",
  },
  {
    title: "Cura del verde",
    text: "Sfalci, potature e manutenzioni paesaggistiche con lo stesso ordine applicato ai campi.",
  },
  {
    title: "Produzione legna",
    text: "Taglio, raccolta e lavorazione come risorsa concreta per il territorio.",
  },
  {
    title: "Gelsi centenari",
    text: "Recupero dei gelsi storici: memoria agricola, presidio ambientale e identità del luogo.",
  },
  {
    title: "Filiera locale",
    text: "Il valore del campo si completa nel collegamento con allevamento, trasformazione e territorio.",
  },
  {
    title: "Energia integrata",
    text: "Fotovoltaico a supporto della continuità operativa e dell'efficienza di gestione.",
  },
] as const;

export function LandingPage() {
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const isFinalPhase = progress >= 90;

  useEffect(() => {
    const durationMs = 2000;
    const tickMs = 20;
    const steps = durationMs / tickMs;
    let dismissTimer = 0;

    const timer = window.setInterval(() => {
      setProgress((current) => {
        const next = current + 100 / steps;
        if (next >= 100) {
          window.clearInterval(timer);
          setIsFadingOut(true);
          dismissTimer = window.setTimeout(() => setShowLoader(false), 320);
          return 100;
        }
        return next;
      });
    }, tickMs);

    return () => {
      window.clearInterval(timer);
      if (dismissTimer) {
        window.clearTimeout(dismissTimer);
      }
    };
  }, []);

  useEffect(() => {
    if (!showLoader) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showLoader]);

  return (
    <div className={styles.page}>
      {showLoader && (
        <div
          className={`${styles.loadingScreen} ${isFadingOut ? styles.loadingScreenExit : ""}`}
          role="status"
          aria-live="polite"
          aria-label="Caricamento pagina"
        >
          <p className={styles.loadingTitle}>{isFinalPhase ? "Pronto" : "Caricamento"}</p>
          <div className={styles.loadingTrack} aria-hidden="true">
            <div className={styles.loadingFill} style={{ width: `${Math.round(progress)}%` }} />
          </div>
          <p className={styles.loadingPercent}>{Math.round(progress)}%</p>
        </div>
      )}

      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerInner}>
            <Link href="#top" className={styles.brand}>
              <strong>Cascina Fontana</strong>
            </Link>
            <nav className={styles.nav}>
              {navigation.map((item) => (
                <Link key={item.id} href={`#${item.id}`} className={styles.navLink}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section id="top" className={styles.hero}>
          <div className={styles.heroBg} aria-hidden="true">
            <Image
              src="/images/campo.jpg"
              alt=""
              fill
              className={styles.heroBgImg}
              priority
            />
            <div className={styles.heroOverlay} />
          </div>
          <div className={styles.container}>
            <p className={styles.eyebrow}>Agricoltura di sistema · Rodigo, Mantova</p>
            <h1 className={styles.heroTitle}>Cascina Fontana</h1>
            <p className={styles.heroLead}>
              Territorio, filiera e sostenibilità dentro una struttura agricola
              chiara, leggibile e contemporanea.
            </p>
            <div className={styles.stats}>
              {stats.map((s) => (
                <div key={s.label} className={styles.stat}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Azienda ── */}
        <section id="azienda" className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>L&apos;azienda</h2>
            <div className={styles.aziendaGrid}>
              <div className={styles.aziendaText}>
                <p>
                  Cascina Fontana è un&apos;azienda agricola a gestione diretta con sede a Rodigo,
                  nel mantovano. Sessantatré biolche di terreno sotto gestione, otto mezzi operativi,
                  trenta pannelli fotovoltaici e due operatori che coordinano produzione, manutenzione
                  e cura del paesaggio.
                </p>
                <p>
                  Il lavoro quotidiano tiene insieme prato stabile, colture, filiera casearia
                  e territorio — letto come un unico sistema, non come attività separate.
                </p>
              </div>
              <div className={styles.aziendaImage}>
                <Image
                  src="/images/capannone.jpg"
                  alt="Strutture di Cascina Fontana"
                  width={600}
                  height={400}
                  className={styles.roundedImage}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Attività ── */}
        <section id="attivita" className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Attività</h2>
            <div className={styles.activitiesGrid}>
              {activities.map((a) => (
                <article key={a.title} className={styles.activityCard}>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Galleria ── */}
        <section id="galleria" className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Galleria</h2>
          </div>
          <GalleryCarousel />
        </section>

        {/* ── Contatti ── */}
        <section id="contatti" className={styles.section}>
          <div className={styles.container}>
            <div className={styles.contactPanel}>
              <div className={styles.contactCopy}>
                <h2 className={styles.sectionTitle}>Contatti</h2>
                <p>
                  Per visite, collaborazioni o informazioni sull&apos;azienda.
                </p>
                <dl className={styles.contactMeta}>
                  <div>
                    <dt>Sede</dt>
                    <dd>Rodigo, Mantova</dd>
                  </div>
                  <div>
                    <dt>Disponibilità</dt>
                    <dd>Su appuntamento</dd>
                  </div>
                </dl>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>© {new Date().getFullYear()} Cascina Fontana — Rodigo, Mantova</p>
        </div>
      </footer>
    </div>
  );
}
