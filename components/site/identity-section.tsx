import { motion } from "framer-motion";
import { identitySignals } from "./content";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import styles from "./site.module.css";
import { VisualFrame } from "./visual-frame";

export function IdentitySection() {
  return (
    <section id="fontana" className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.identitySurface}>
          <VisualFrame
            src="/images/fontana.JPG"
            alt="La fontana della Cascina Fontana con getto d'acqua attivo, campi verdi sullo sfondo."
            label="Elemento identitario"
            chips={identitySignals}
            footer="Un segno. Non decorazione."
            ratio="wide"
          />

          <Reveal className={styles.stackLarge} direction="right">
            <SectionHeading
              eyebrow="Fontana"
              title="Un segno. Non decorazione."
              description={
                "La fontana resta dentro l'ordine del sistema: presenza riconoscibile, movimento minimo, identita misurata."
              }
            />

            <motion.div
              className={styles.surface}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <p className={styles.identityQuote}>
                Costanza visiva. Presenza controllata. Radicamento reale.
              </p>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
