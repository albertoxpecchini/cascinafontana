import { motion } from "framer-motion";
import { productionCards, productionStats } from "./content";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import styles from "./site.module.css";
import { VisualFrame } from "./visual-frame";

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      delay: 0.12 * i,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export function ProductionSection() {
  return (
    <section
      id="produzione"
      className={`${styles.section} ${styles.productionSection}`}
    >
      <div className={styles.sectionInner}>
        <div className={styles.gridTwo}>
          <VisualFrame
            src="/images/campo.jpg"
            alt="Campo di prato stabile con filari di alberi sullo sfondo, pianura mantovana."
            label="Produzione primaria"
            chips={["prato stabile", "irrigazione mirata", "texture naturali"]}
            footer="Campi reali, resa organizzata"
            className={styles.productionVisual}
          />

          <div className={styles.productionList}>
            <Reveal direction="right">
              <SectionHeading
                eyebrow="Produzione"
                title={
                  <>
                    Fieno, mais, soia, grano.
                    <br />
                    Ogni coltura ha una funzione precisa.
                  </>
                }
                description={
                  "La produzione non e' una somma di superfici. E' una sequenza tecnica con obiettivi definiti."
                }
              />
            </Reveal>

            {productionCards.map((item, index) => (
              <motion.article
                key={item.title}
                className={styles.productionCard}
                variants={cardVariants}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.18 }}
                whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.3 } }}
              >
                <span className={styles.cardIndex}>
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardText}>{item.text}</p>
                <div className={styles.badgeRow}>
                  {item.tags.map((tag) => (
                    <span key={tag} className={styles.badge}>
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <motion.div
          className={styles.statStrip}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {productionStats.map((item) => (
            <div key={item.label} className={styles.statItem}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
