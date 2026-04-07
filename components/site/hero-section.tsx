"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { heroMetrics, heroSignals } from "./content";
import { Reveal } from "./reveal";
import styles from "./site.module.css";

// ─── Icone SVG ────────────────────────────────────────────────────────────────

function IconWheat({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="22" x2="12" y2="6" />
      <path d="M9 10 C9 10 12 7 15 10" fill="currentColor" fillOpacity="0.4" />
      <path d="M8 14 C8 14 12 11 16 14" fill="currentColor" fillOpacity="0.4" />
      <path d="M9 18 C9 18 12 15 15 18" fill="currentColor" fillOpacity="0.4" />
      <line x1="12" y1="6" x2="11" y2="3" />
    </svg>
  );
}

function IconSun({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.5" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" />
      <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" />
      <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" />
      <line x1="16.95" y1="7.05" x2="19.07" y2="4.93" />
    </svg>
  );
}

function IconLeaf({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8 C8 10 5 15 5 20 C8 16 13 12 17 8Z" fill="currentColor" fillOpacity="0.45" />
      <path d="M5 20 C5 20 9 18 12 14" fill="none" />
    </svg>
  );
}

function IconDrop({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 C12 2 5 11 5 15 C5 18.87 8.13 22 12 22 C15.87 22 19 18.87 19 15 C19 11 12 2 12 2Z" fill="currentColor" fillOpacity="0.45" />
    </svg>
  );
}

function IconCorn({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 C10 2 8 4 8 7 L8 17 C8 20 10 22 12 22 C14 22 16 20 16 17 L16 7 C16 4 14 2 12 2Z" fill="currentColor" fillOpacity="0.4" />
      <line x1="10" y1="8" x2="14" y2="8" />
      <line x1="10" y1="12" x2="14" y2="12" />
      <line x1="10" y1="16" x2="14" y2="16" />
      <line x1="10" y1="2" x2="12" y2="0" />
      <line x1="14" y1="2" x2="12" y2="0" />
    </svg>
  );
}

type IconComponent = React.ComponentType<{ size: number }>;

const ICONS: Array<{
  id: string; Icon: IconComponent; size: number;
  x: string; y: string; color: string; anim: string; dur: string; delay: string;
}> = [
  { id: "w1", Icon: IconWheat, size: 52, x: "6%",  y: "7%",  color: "#d4a017", anim: styles.float1,    dur: "6.5s", delay: "0s"   },
  { id: "s1", Icon: IconSun,   size: 64, x: "78%", y: "5%",  color: "#f5c800", anim: styles.floatSpin, dur: "9s",   delay: "1.3s" },
  { id: "l1", Icon: IconLeaf,  size: 44, x: "22%", y: "18%", color: "#5aaa28", anim: styles.float2,    dur: "7.5s", delay: "0.7s" },
  { id: "d1", Icon: IconDrop,  size: 38, x: "60%", y: "11%", color: "#3a9fd4", anim: styles.float3,    dur: "5.8s", delay: "2.1s" },
  { id: "w2", Icon: IconWheat, size: 46, x: "87%", y: "32%", color: "#d4a017", anim: styles.float2,    dur: "7s",   delay: "1.9s" },
  { id: "c1", Icon: IconCorn,  size: 48, x: "44%", y: "7%",  color: "#e8b830", anim: styles.float4,    dur: "8.2s", delay: "0.4s" },
  { id: "l2", Icon: IconLeaf,  size: 36, x: "12%", y: "44%", color: "#5aaa28", anim: styles.float1,    dur: "9.5s", delay: "3.2s" },
  { id: "s2", Icon: IconSun,   size: 34, x: "54%", y: "38%", color: "#f5c800", anim: styles.floatSpin, dur: "7s",   delay: "1.1s" },
  { id: "w3", Icon: IconWheat, size: 40, x: "34%", y: "52%", color: "#d4a017", anim: styles.float3,    dur: "8.5s", delay: "2.6s" },
  { id: "d2", Icon: IconDrop,  size: 32, x: "71%", y: "48%", color: "#3a9fd4", anim: styles.float2,    dur: "6s",   delay: "0.9s" },
  { id: "c2", Icon: IconCorn,  size: 38, x: "91%", y: "15%", color: "#e8b830", anim: styles.float1,    dur: "8s",   delay: "2s"   },
  { id: "l3", Icon: IconLeaf,  size: 58, x: "2%",  y: "24%", color: "#5aaa28", anim: styles.float4,    dur: "11s",  delay: "1.5s" },
  { id: "w4", Icon: IconWheat, size: 36, x: "65%", y: "24%", color: "#d4a017", anim: styles.float3,    dur: "7.2s", delay: "3.8s" },
  { id: "s3", Icon: IconSun,   size: 28, x: "37%", y: "34%", color: "#f5c800", anim: styles.floatSpin, dur: "6.8s", delay: "0.2s" },
  { id: "d3", Icon: IconDrop,  size: 30, x: "49%", y: "58%", color: "#3a9fd4", anim: styles.float1,    dur: "7.5s", delay: "4s"   },
];

// ─── Componente ───────────────────────────────────────────────────────────────

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const copyY = useTransform(scrollYProgress, [0, 0.4, 1], [34, 0, -4]);
  const panelY = useTransform(scrollYProgress, [0, 0.4, 1], [28, 0, -16]);

  return (
    <section id="top" ref={sectionRef} className={`${styles.section} ${styles.heroSection}`}>
      <div className={styles.heroViewport}>

        {/* ── Icone fluttuanti ── */}
        <div className={styles.heroIconLayer}>
          {ICONS.map((cfg) => (
            <span
              key={cfg.id}
              className={`${styles.heroFloatIcon} ${cfg.anim}`}
              style={{
                left: cfg.x,
                top: cfg.y,
                color: cfg.color,
                animationDuration: cfg.dur,
                animationDelay: cfg.delay,
              }}
            >
              <cfg.Icon size={cfg.size} />
            </span>
          ))}
        </div>

        <div className={styles.heroContentShell}>
          <div className={styles.heroLayout}>
            <motion.div style={{ y: copyY }}>
              <Reveal className={styles.heroCopy}>
                <p className={styles.heroKicker}>
                  Rodigo, Mantova | azienda agricola familiare | dal 2007
                </p>
                <h1 className={styles.heroTitle}>
                  <span>SOCIETA&apos; AGRICOLA</span>
                  <span>CASCINA FONTANA</span>
                </h1>
                <p className={styles.heroLead}>Produzione agricola gestita con precisione.</p>
                <p className={styles.bodyText}>
                  Materia prima critica per una filiera di qualita. Ogni intervento
                  e&apos; programmato, monitorato e verificato.
                </p>
                <div className={styles.heroActions}>
                  <Link href="#sistema" className={`${styles.heroButton} ${styles.heroButtonPrimary}`}>
                    Scopri l&apos;azienda
                  </Link>
                  <Link href="#produzione" className={`${styles.heroButton} ${styles.heroButtonSecondary}`}>
                    I nostri prodotti
                  </Link>
                </div>
                <div className={styles.badgeRow}>
                  {heroSignals.map((signal) => (
                    <span key={signal} className={styles.badge}>
                      {signal}
                    </span>
                  ))}
                </div>
              </Reveal>
            </motion.div>

            <motion.div style={{ y: panelY }}>
              <Reveal className={styles.heroAside} delay={0.16}>
                <div className={styles.heroPanel}>
                  <div className={styles.panelHeader}>
                    <span className={styles.panelEyebrow}>Output critico</span>
                    <p className={styles.panelTitle}>
                      Supporto diretto alla filiera lattiero-casearia per Grana
                      Padano DOP.
                    </p>
                  </div>

                  <div className={styles.heroMetricGrid}>
                    {heroMetrics.map((metric) => (
                      <article key={metric.label} className={styles.heroMetricCard}>
                        <p className={styles.metricValue}>
                          {metric.value}
                          <span>{metric.unit}</span>
                        </p>
                        <p className={styles.metricLabel}>{metric.label}</p>
                      </article>
                    ))}
                  </div>

                  <div className={styles.heroFoot}>
                    <div className={styles.heroFootItem}>
                      <span>Produzione</span>
                      <strong>Fieno / prato stabile</strong>
                    </div>
                    <div className={styles.heroFootItem}>
                      <span>Colture</span>
                      <strong>Mais, soia, grano, patate</strong>
                    </div>
                    <div className={styles.heroFootItem}>
                      <span>Servizio</span>
                      <strong>Produzione conto terzi</strong>
                    </div>
                  </div>
                </div>
              </Reveal>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
