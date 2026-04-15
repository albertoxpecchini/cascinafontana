"use client";

import { motion } from "framer-motion";
import { methodCards } from "./content";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import styles from "./site.module.css";

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.94, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      delay: 0.1 * i,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export function MethodSection() {
  return (
    <section id="metodo" className={styles.section}>
      <div className={styles.sectionInner}>
        <Reveal className={styles.methodIntro} direction="scale">
          <SectionHeading
            eyebrow="Metodo"
            title="Controllo, precisione, efficienza, continuita."
            description="La qualita non e' un effetto. E' il risultato di un sistema che riduce rumore e mantiene costanza."
            centered
          />
        </Reveal>

        <div className={styles.methodGrid}>
          {methodCards.map((card, index) => (
            <motion.article
              key={card.title}
              className={styles.methodCard}
              variants={cardVariants}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
              whileHover={{
                y: -10,
                scale: 1.03,
                boxShadow: "0 28px 56px rgba(97, 131, 61, 0.2)",
                transition: { duration: 0.35 },
              }}
            >
              <span className={styles.methodNumber}>{card.number}</span>
              <p className={styles.methodMicro}>{card.micro}</p>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
