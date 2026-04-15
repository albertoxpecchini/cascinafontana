"use client";

import { gelsiShowcase } from "./content";
import { Reveal } from "./reveal";
import styles from "./site.module.css";

export function GelsiSection() {
  return (
    <section className={`${styles.section} ${styles.gelsiSection}`}>
      <div className={styles.sectionInner}>
        <div className={styles.gelsiLayout}>
          <Reveal className={styles.gelsiContent}>
            <p className={styles.sectionEyebrow}>{gelsiShowcase.eyebrow}</p>
            <h2 className={styles.sectionTitle}>{gelsiShowcase.title}</h2>
            <p className={styles.gelsiLead}>{gelsiShowcase.lead}</p>
            <p className={styles.bodyText}>{gelsiShowcase.text}</p>
            <div className={styles.badgeRow}>
              {gelsiShowcase.marks.map((mark) => (
                <span key={mark} className={styles.badge}>
                  {mark}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.12} className={styles.gelsiVisual}>
            <div className={styles.gelsiEmoji}>🌿</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
