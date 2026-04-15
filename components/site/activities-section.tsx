"use client";

import { activityCards } from "./content";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import styles from "./site.module.css";

export function ActivitiesSection() {
  return (
    <section id="attivita" className={styles.section}>
      <div className={styles.sectionInner}>
        <Reveal>
          <SectionHeading
            eyebrow="Attivita"
            title="Il nostro lavoro, ogni giorno"
            description="Oltre la produzione agricola, ci prendiamo cura del territorio con interventi concreti e costanti."
          />
        </Reveal>

        <div className={styles.activitiesGrid}>
          {activityCards.map((card, i) => (
            <Reveal key={card.title} delay={0.08 * i}>
              <div className={styles.activityCard}>
                <span className={styles.activityIcon}>{card.icon}</span>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.bodyText}>{card.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
