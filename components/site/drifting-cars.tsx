"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./drifting-cars.module.css";

type Car = {
  id: number;
  emoji: string;
  dir: "ltr" | "rtl";
  lane: number; // top offset %
  speed: number; // seconds
  size: number;
};

const EMOJIS = ["🏎️", "🚗", "🚙", "🚕", "🚓", "🏁", "🛻"];

let uid = 0;

function makeCar(): Car {
  uid += 1;
  const dir = Math.random() > 0.5 ? "ltr" : "rtl";
  return {
    id: uid,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    dir,
    lane: 8 + Math.random() * 76,
    speed: 3 + Math.random() * 2.5,
    size: 2 + Math.random() * 1.6,
  };
}

export function DriftingCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [mounted, setMounted] = useState(false);
  const lastScroll = useRef(0);
  const cooldown = useRef(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = Math.abs(y - lastScroll.current);
      lastScroll.current = y;
      if (delta < 40) return;
      const now = Date.now();
      if (now - cooldown.current < 280) return;
      cooldown.current = now;
      const car = makeCar();
      setCars((cur) => [...cur.slice(-5), car]);
      setTimeout(() => {
        setCars((cur) => cur.filter((c) => c.id !== car.id));
      }, car.speed * 1000 + 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className={styles.stage} aria-hidden>
      {cars.map((c) => (
        <div
          key={c.id}
          className={`${styles.car} ${c.dir === "rtl" ? styles.rtl : styles.ltr}`}
          style={{
            top: `${c.lane}%`,
            fontSize: `${c.size}rem`,
            animationDuration: `${c.speed}s`,
          }}
        >
          <span className={styles.trail}>
            <span className={styles.puff} style={{ animationDelay: "0s" }}>💨</span>
            <span className={styles.puff} style={{ animationDelay: "0.1s" }}>💨</span>
            <span className={styles.puff} style={{ animationDelay: "0.2s" }}>💨</span>
          </span>
          <span className={styles.body}>{c.emoji}</span>
          <span className={styles.spark}>★</span>
        </div>
      ))}
    </div>
  );
}
