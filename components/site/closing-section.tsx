"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { closingMarks } from "./content";
import { Reveal } from "./reveal";
import styles from "./site.module.css";

export function ClosingSection() {
  return (
    <section className={`${styles.section} ${styles.closingSection}`}>
      <div className={styles.sectionInner}>
        <Reveal direction="scale">
          <motion.div
            className={styles.closingSurface}
            whileHover={{ scale: 1.005, transition: { duration: 0.5 } }}
          >
            <div className={styles.closingMedia}>
              <Image
                src="/images/campo.jpg"
                alt="Campo di prato stabile della Cascina Fontana, pianura padana mantovana."
                fill
                sizes="100vw"
                className={styles.visualImage}
              />
              <div className={styles.heroShade} />
            </div>

            <div className={styles.closingContent}>
              <motion.p
                className={styles.sectionEyebrow}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                Chiusura
              </motion.p>
              <motion.h2
                className={styles.closingTitle}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                Costanza. Controllo. Risultato.
              </motion.h2>
              <motion.p
                className={styles.bodyText}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.35 }}
              >
                SOCIETA&apos; AGRICOLA CASCINA FONTANA S.S. opera a Rodigo come
                azienda agricola familiare strutturata per garantire continuita
                produttiva e qualita stabile nel tempo.
              </motion.p>

              <motion.div
                className={styles.badgeRow}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {closingMarks.map((mark) => (
                  <span key={mark} className={styles.badge}>
                    {mark}
                  </span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
