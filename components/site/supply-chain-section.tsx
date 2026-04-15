"use client";

import { motion } from "framer-motion";
import { chainSteps } from "./content";
import { LocationMap } from "./location-map";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import styles from "./site.module.css";

const chainItemVariants = {
  hidden: { opacity: 0, y: 36, scale: 0.95 },
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

export function SupplyChainSection() {
  return (
    <section id="filiera" className={styles.section}>
      <div className={styles.sectionInner}>
        <Reveal direction="scale">
          <SectionHeading
            eyebrow="Filiera"
            title={
              <>
                Il risultato finale non e&apos; visibile qui.
                <br />
                Ma inizia da qui.
              </>
            }
            description={
              "Dal campo al Grana Padano: una linea continua, senza elementi decorativi e senza passaggi superflui."
            }
          />
        </Reveal>

        <div className={styles.chainRail}>
          <motion.div
            className={styles.chainProgress}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />

          {chainSteps.map((step, index) => (
            <motion.article
              key={step.title}
              className={styles.chainItem}
              variants={chainItemVariants}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.22 }}
            >
              <span className={styles.chainIndex}>
                {(index + 1).toString().padStart(2, "0")}
              </span>
              <motion.div
                className={styles.chainCard}
                whileHover={{
                  y: -8,
                  scale: 1.04,
                  boxShadow: "0 24px 48px rgba(97, 131, 61, 0.18)",
                  transition: { duration: 0.3 },
                }}
              >
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </motion.div>
            </motion.article>
          ))}
        </div>

        <Reveal delay={0.2}>
          <LocationMap />
        </Reveal>
      </div>
    </section>
  );
}
