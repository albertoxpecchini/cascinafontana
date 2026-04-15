"use client";

import { useRef } from "react";
import { systemNodes, type SystemSlot } from "./content";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { SystemWindow } from "./system-window";
import styles from "./site.module.css";

const slotClassMap: Record<SystemSlot, string> = {
  north: styles.slotNorth,
  west: styles.slotWest,
  east: styles.slotEast,
  south: styles.slotSouth,
  northwest: styles.slotNorthWest,
};

export function SystemSection() {
  const matrixRef = useRef<HTMLDivElement | null>(null);

  return (
    <section id="sistema" className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.gridTwo}>
          <Reveal className={styles.stackLarge}>
            <SectionHeading
              eyebrow="Sistema"
              title={
                <>
                  Non e&apos; solo produzione.
                  <br />
                  E&apos; gestione coordinata.
                </>
              }
              description={
                "Campi, strutture, mezzi, energia e acqua operano come un unico schema decisionale."
              }
            />

            <div className={styles.surface}>
              <p className={styles.bodyLarge}>
                L&apos;azienda e&apos; impostata come infrastruttura: ogni parte esiste
                per mantenere stabilita, continuita e precisione nel tempo.
              </p>
              <div className={styles.badgeRow}>
                <span className={styles.badge}>Sequenze chiare.</span>
                <span className={styles.badge}>Risorse sincronizzate.</span>
                <span className={styles.badge}>Decisioni misurabili.</span>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div ref={matrixRef} className={styles.systemMatrix}>
              <svg
                viewBox="0 0 100 100"
                className={styles.systemConnector}
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <path d="M50 50 L50 20" />
                <path d="M50 50 L20 50" />
                <path d="M50 50 L80 50" />
                <path d="M50 50 L50 82" />
                <path d="M50 50 L22 24" />
              </svg>

              <SystemWindow
                baseLayer={13}
                className={styles.slotCenter}
                constraintsRef={matrixRef}
                label="Nucleo"
                title="Gestione operativa"
              >
                <p>Tempistiche, controllo, priorita e continuita produttiva.</p>
              </SystemWindow>

              {systemNodes.map((node, index) => (
                <SystemWindow
                  key={node.title}
                  baseLayer={14 + index}
                  className={slotClassMap[node.slot]}
                  constraintsRef={matrixRef}
                  label={node.title}
                  title={node.title}
                >
                  <p>{node.text}</p>
                </SystemWindow>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
