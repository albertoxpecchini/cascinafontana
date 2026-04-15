"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./site.module.css";

type VisualFrameProps = {
  src: string;
  alt: string;
  label: string;
  chips?: readonly string[];
  footer?: string;
  ratio?: "wide" | "landscape" | "portrait";
  priority?: boolean;
  sizes?: string;
  className?: string;
};

const ratioClasses = {
  wide: styles.ratioWide,
  landscape: styles.ratioLandscape,
  portrait: styles.ratioPortrait,
} as const;

const frameVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      staggerChildren: 0.1,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const chipVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.05 * i,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export function VisualFrame({
  src,
  alt,
  label,
  chips,
  footer,
  ratio = "landscape",
  priority = false,
  sizes = "(min-width: 1100px) 46vw, 100vw",
  className,
}: VisualFrameProps) {
  return (
    <motion.div
      className={[styles.visualFrame, ratioClasses[ratio], className]
        .filter(Boolean)
        .join(" ")}
      variants={frameVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
    >
      <div className={styles.visualMedia}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={styles.visualImage}
        />
        <div className={styles.visualShade} />
      </div>

      <div className={styles.visualInfo}>
        <motion.p className={styles.visualLabel} variants={childVariants}>
          {label}
        </motion.p>

        {chips?.length ? (
          <motion.div className={styles.visualChips} variants={childVariants}>
            {chips.map((chip, i) => (
              <motion.span
                key={chip}
                className={styles.visualChip}
                variants={chipVariants}
                custom={i}
              >
                {chip}
              </motion.span>
            ))}
          </motion.div>
        ) : null}

        {footer ? (
          <motion.p className={styles.visualFooter} variants={childVariants}>
            {footer}
          </motion.p>
        ) : null}
      </div>
    </motion.div>
  );
}
