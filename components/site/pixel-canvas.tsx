"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./pixel-canvas.module.css";

const COLS = 32;
const ROWS = 18;
const PALETTE = [
  "#ffffff",
  "#000000",
  "#e60012",
  "#ff6a00",
  "#ffcc00",
  "#00a651",
  "#00c8ff",
  "#0033aa",
  "#ff0080",
  "#6a3fa0",
  "#8b4513",
  "#c0c0c0",
] as const;

/* ── Initial "art": stylised Japanese rising sun + CF ── */
function buildInitial(): number[] {
  const cells = new Array(COLS * ROWS).fill(0); // white
  const cx = COLS / 2;
  const cy = ROWS / 2;
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const dx = (x + 0.5 - cx) / (COLS / 2);
      const dy = (y + 0.5 - cy) / (ROWS / 2);
      const r = Math.sqrt(dx * dx + dy * dy);
      const a = Math.atan2(dy, dx);
      const ray = Math.floor(((a + Math.PI) / (Math.PI / 8)) % 2);
      if (r < 0.28) cells[y * COLS + x] = 2; // red sun
      else if (r < 0.95 && ray === 0) cells[y * COLS + x] = 3; // orange rays
    }
  }
  return cells;
}

export function PixelCanvas() {
  const [cells, setCells] = useState<number[]>(() => buildInitial());
  const [paint, setPaint] = useState(2);
  const [placements, setPlacements] = useState(1337);
  const drag = useRef(false);

  const setCell = useCallback(
    (i: number) => {
      setCells((prev) => {
        if (prev[i] === paint) return prev;
        const next = prev.slice();
        next[i] = paint;
        return next;
      });
      setPlacements((n) => n + 1);
    },
    [paint],
  );

  useEffect(() => {
    const up = () => (drag.current = false);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
  }, []);

  /* ── Periodic "other users" random paints for live feel ── */
  useEffect(() => {
    const t = setInterval(() => {
      setCells((prev) => {
        const next = prev.slice();
        const hits = 1 + Math.floor(Math.random() * 2);
        for (let k = 0; k < hits; k++) {
          const i = Math.floor(Math.random() * next.length);
          next[i] = Math.floor(Math.random() * PALETTE.length);
        }
        return next;
      });
      setPlacements((n) => n + 1);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>★ r/PLACE · ピクセル キャンバス ★</div>
      <div className={styles.sub}>
        Click pixel to paint · Live grid · <span className={styles.count}>{placements}</span>{" "}
        placements
      </div>

      <div className={styles.palette}>
        {PALETTE.map((c, i) => (
          <button
            key={c}
            type="button"
            aria-label={`color ${i}`}
            className={`${styles.swatch} ${paint === i ? styles.swatchActive : ""}`}
            style={{ background: c }}
            onClick={() => setPaint(i)}
          />
        ))}
      </div>

      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          aspectRatio: `${COLS} / ${ROWS}`,
        }}
        onMouseLeave={() => (drag.current = false)}
      >
        {cells.map((c, i) => (
          <button
            key={i}
            type="button"
            aria-label={`pixel ${i}`}
            className={styles.pixel}
            style={{ background: PALETTE[c] }}
            onMouseDown={() => {
              drag.current = true;
              setCell(i);
            }}
            onMouseEnter={() => {
              if (drag.current) setCell(i);
            }}
            onTouchStart={() => {
              drag.current = true;
              setCell(i);
            }}
          />
        ))}
      </div>

      <div className={styles.footer}>
        ★ 一緒に描こう · Draw together · Cooldown: <span className={styles.blink}>0s</span> ★
      </div>
    </div>
  );
}
