"use client";

import type { ReactNode, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { motion, useDragControls, useReducedMotion } from "framer-motion";
import styles from "./site.module.css";

type SystemWindowProps = {
  baseLayer: number;
  className?: string;
  constraintsRef: RefObject<HTMLDivElement | null>;
  label: string;
  title: string;
  children: ReactNode;
};

const FLOAT_DURATION_CLASSES = [
  styles.floatDuration7,
  styles.floatDuration8,
  styles.floatDuration9,
] as const;

const FLOAT_DELAY_CLASSES = [
  styles.floatDelay0,
  styles.floatDelay35,
  styles.floatDelay70,
  styles.floatDelay105,
] as const;

const BASE_LAYER_CLASSES: Record<number, string> = {
  13: styles.systemLayer13,
  14: styles.systemLayer14,
  15: styles.systemLayer15,
  16: styles.systemLayer16,
  17: styles.systemLayer17,
  18: styles.systemLayer18,
};

let windowLayer = 18;

export function SystemWindow({
  baseLayer,
  className,
  constraintsRef,
  label,
  title,
  children,
}: SystemWindowProps) {
  const dragControls = useDragControls();
  const reduceMotion = useReducedMotion();
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [canDrag, setCanDrag] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const floatDurationClassName = FLOAT_DURATION_CLASSES[label.length % FLOAT_DURATION_CLASSES.length];
  const floatDelayClassName = FLOAT_DELAY_CLASSES[title.length % FLOAT_DELAY_CLASSES.length];
  const baseLayerClassName = BASE_LAYER_CLASSES[baseLayer] ?? styles.systemLayer13;

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

    if (nodeRef.current) {
      nodeRef.current.style.zIndex = String(windowLayer);
    }
  };

  return (
    <motion.div
      ref={nodeRef}
      className={[styles.systemNode, baseLayerClassName, className].filter(Boolean).join(" ")}
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
      whileDrag={
        canDrag && !reduceMotion
          ? {
              scale: 1.02,
              boxShadow: "0 34px 80px rgba(0, 0, 0, 0.42)",
            }
          : undefined
      }
    >
      <div
        className={[
          styles.systemWindowShell,
          floatDurationClassName,
          floatDelayClassName,
        ].join(" ")}
      >
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
