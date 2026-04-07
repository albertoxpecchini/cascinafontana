import type { CSSProperties, ReactNode, RefObject } from "react";
import { useEffect, useMemo, useState } from "react";
import { motion, useDragControls, useReducedMotion } from "framer-motion";
import styles from "./site.module.css";

type SystemWindowProps = {
  className?: string;
  constraintsRef: RefObject<HTMLDivElement | null>;
  label: string;
  title: string;
  children: ReactNode;
};

let windowLayer = 12;

export function SystemWindow({
  className,
  constraintsRef,
  label,
  title,
  children,
}: SystemWindowProps) {
  const dragControls = useDragControls();
  const reduceMotion = useReducedMotion();
  const [canDrag, setCanDrag] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [zIndex, setZIndex] = useState(() => {
    windowLayer += 1;
    return windowLayer;
  });

  const floatStyle = useMemo(() => {
    const duration = `${7 + (label.length % 3)}s`;
    const delay = `${(title.length % 4) * 0.35}s`;

    return {
      "--float-duration": duration,
      "--float-delay": delay,
    } as CSSProperties;
  }, [label.length, title.length]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanDrag(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  const bringToFront = () => {
    windowLayer += 1;
    setZIndex(windowLayer);
  };

  return (
    <motion.div
      className={[styles.systemNode, className].filter(Boolean).join(" ")}
      drag={canDrag}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0.16}
      dragConstraints={constraintsRef}
      data-dragging={isDragging}
      onPointerDown={bringToFront}
      onDragStart={() => {
        bringToFront();
        setIsDragging(true);
      }}
      onDragEnd={() => setIsDragging(false)}
      style={{ zIndex }}
      whileDrag={
        canDrag && !reduceMotion
          ? {
              scale: 1.02,
              boxShadow: "0 34px 80px rgba(0, 0, 0, 0.42)",
            }
          : undefined
      }
    >
      <div className={styles.systemWindowShell} style={floatStyle}>
        <div
          className={styles.systemWindowBar}
          onPointerDown={(event) => {
            if (!canDrag) {
              return;
            }

            bringToFront();
            dragControls.start(event);
          }}
        >
          <div className={styles.systemWindowDots} aria-hidden="true">
            <span className={styles.systemWindowDot} />
            <span className={styles.systemWindowDot} />
            <span className={styles.systemWindowDot} />
          </div>
          <span className={styles.systemWindowGrip}>trascina</span>
        </div>

        <div className={styles.systemWindowContent}>
          <span className={styles.systemNodeTag}>{label}</span>
          <h3>{title}</h3>
          <div>{children}</div>
        </div>
      </div>
    </motion.div>
  );
}
