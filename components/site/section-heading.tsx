import type { ReactNode } from "react";
import styles from "./site.module.css";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  centered?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div
      className={[
        styles.sectionHeading,
        centered ? styles.sectionHeadingCentered : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className={styles.sectionEyebrow}>{eyebrow}</p>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <p className={styles.sectionDescription}>{description}</p>
    </div>
  );
}
