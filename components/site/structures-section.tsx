"use client";

import { motion } from "framer-motion";
import { structurePoints } from "./content";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import styles from "./site.module.css";
import { VisualFrame } from "./visual-frame";

export function StructuresSection() {
  return (
    <section id="strutture" className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.gridTwo}>
          <div className={styles.stackLarge}>
            <Reveal direction="left">
              <SectionHeading
                eyebrow="Strutture"
                title="Ordine, pulizia, funzionalita."
                description={
                  "L'architettura aziendale non cerca immagine. Cerca continuita operativa, accesso chiaro e manutenzione semplice."
                }
              />
            </Reveal>

            <div className={styles.detailList}>
              {structurePoints.map((item, index) => (
                <Reveal key={item.title} delay={0.08 * index} direction="left">
                  <motion.article
                    className={styles.detailItem}
                    whileHover={{ x: 6, scale: 1.01, transition: { duration: 0.3 } }}
                  >
                    <span className={styles.detailIndex}>
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <div className={styles.detailContent}>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </motion.article>
                </Reveal>
              ))}
            </div>
          </div>

          <VisualFrame
            src="/images/capannone.jpg"
            alt="Capannone agricolo della Cascina Fontana con pannelli solari, luce serale."
            label="Strutture nuove e organizzate"
            chips={["layout modulare", "ordine visivo", "integrazione territoriale"]}
            footer="Spazi al servizio del processo"
          />
        </div>
      </div>
    </section>
  );
}
