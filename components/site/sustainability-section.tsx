import { motion } from "framer-motion";
import { sustainabilityMetrics } from "./content";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import styles from "./site.module.css";
import { VisualFrame } from "./visual-frame";

export function SustainabilitySection() {
  return (
    <section
      id="sostenibilita"
      className={`${styles.section} ${styles.sustainabilitySection}`}
    >
      <div className={styles.sectionInner}>
        <div className={styles.gridTwo}>
          <VisualFrame
            src="/images/capannone.jpg"
            alt="Capannone agricolo con pannelli solari sul tetto al tramonto, Rodigo Mantova."
            label="Sostenibilita operativa"
            chips={["fotovoltaico", "bamboo system", "impatto presidiato"]}
            footer="Applicata, non dichiarata"
            ratio="portrait"
            className={styles.sustainabilityVisual}
          />

          <div className={styles.stackLarge}>
            <Reveal direction="right">
              <SectionHeading
                eyebrow="Sostenibilita"
                title="Sostenibilita operativa. Applicata, non dichiarata."
                description={
                  "Energia e trattamento naturale non sono una narrazione parallela. Sono parte del modo in cui il sistema resta efficiente."
                }
              />
            </Reveal>

            <div className={styles.inlineMetricGrid}>
              {sustainabilityMetrics.map((item, index) => (
                <Reveal key={item.label} delay={0.1 * index} direction="scale">
                  <motion.article
                    className={styles.inlineMetric}
                    whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.3 } }}
                  >
                    <p className={styles.inlineMetricValue}>{item.value}</p>
                    <p className={styles.inlineMetricLabel}>{item.label}</p>
                    <p className={styles.inlineMetricText}>{item.text}</p>
                  </motion.article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <div className={styles.surface}>
                <p className={styles.bodyLarge}>
                  Riduzione sprechi, uso massimo delle risorse, effetti sotto
                  controllo.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
