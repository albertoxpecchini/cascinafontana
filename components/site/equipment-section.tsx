import { motion } from "framer-motion";
import { equipmentPoints } from "./content";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import styles from "./site.module.css";
import { VisualFrame } from "./visual-frame";

export function EquipmentSection() {
  return (
    <section id="mezzi" className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.gridTwo}>
          <div className={styles.stackLarge}>
            <Reveal direction="left">
              <SectionHeading
                eyebrow="Mezzi"
                title="Strumenti adeguati. Utilizzo mirato."
                description={
                  "Le macchine non sono esposizione. Sono capacita produttiva calibrata sulle fasi reali del lavoro."
                }
              />
            </Reveal>

            <div className={styles.numberRail}>
              <Reveal direction="scale">
                <motion.article
                  className={styles.numberCard}
                  whileHover={{ y: -4, scale: 1.03, transition: { duration: 0.3 } }}
                >
                  <p className={styles.numberValue}>8</p>
                  <p className={styles.numberLabel}>trattori in flotta</p>
                </motion.article>
              </Reveal>
              <Reveal delay={0.1} direction="scale">
                <motion.article
                  className={styles.numberCard}
                  whileHover={{ y: -4, scale: 1.03, transition: { duration: 0.3 } }}
                >
                  <p className={styles.numberValue}>2</p>
                  <p className={styles.numberLabel}>operatori, processi chiari</p>
                </motion.article>
              </Reveal>
            </div>

            <div className={styles.detailList}>
              {equipmentPoints.map((item, index) => (
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
            src="/images/trattori.jpg"
            alt="Due trattori SAME Solaris parcheggiati nel campo verde dell'azienda."
            label="Operativita reale"
            chips={["mezzi adeguati", "attivita reale", "uso massimo delle risorse"]}
            footer="Capacita immediata, non scenografia"
          />
        </div>
      </div>
    </section>
  );
}
