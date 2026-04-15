"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./drift-popups.module.css";

type Popup = {
  id: number;
  title: string;
  sub: string;
  cta: string;
  emoji: string;
  color: "pink" | "cyan" | "yellow" | "purple" | "green" | "red";
  x: number;
  y: number;
};

const POOL: Omit<Popup, "id" | "x" | "y">[] = [
  { title: "頭文字D", sub: "AE86 TRUENO DRIFT CHAMPION — CLAIM YOUR PROJECT CAR!", cta: "DOWNLOAD NOW", emoji: "🏁", color: "pink" },
  { title: "WANGAN MIDNIGHT", sub: "首都高速湾岸線 — BLACKBIRD vs DEVIL Z!! ENTER NOW", cta: "▶ PLAY", emoji: "🌃", color: "cyan" },
  { title: "TOKYO DRIFT CLUB", sub: "東京 ★ ドリフト クラブ — JOIN 5,000,000 MEMBERS!", cta: "SIGN UP FREE", emoji: "🏎️", color: "purple" },
  { title: "★ YOU WON!! ★", sub: "CONGRATULATIONS! FREE NISSAN SKYLINE R34 GTR V-SPEC II!", cta: "CLAIM NOW!!!", emoji: "🎉", color: "yellow" },
  { title: "峠 TOUGE BATTLE", sub: "Mountain pass duel tonight @ midnight — be there or be square!", cta: "BATTLE!", emoji: "⛰️", color: "green" },
  { title: "NEW HIGH SCORE", sub: "User DriftKing99 beat your score 999,999 — strike back!", cta: "REVENGE", emoji: "💀", color: "red" },
  { title: "SUSHI DELIVERED", sub: "寿司 order #1337 ready — $0.99 ALL-YOU-CAN-EAT TONIGHT ONLY!", cta: "ORDER", emoji: "🍣", color: "pink" },
  { title: "HOT SINGLES", sub: "5 catgirls in Rodigo want to meet YOU! Click meow!", cta: "MEOW 🐱", emoji: "💌", color: "cyan" },
  { title: "VIRUS DETECTED!", sub: "Your PC has 32 viruses. Download DriftAntivirus2001 NOW!", cta: "CLEAN NOW", emoji: "⚠️", color: "red" },
  { title: "JDM APPROVED ★", sub: "This homepage certified 100% JDM by the Rodigo Car Club", cta: "VERIFY ✓", emoji: "✅", color: "green" },
  { title: "FREE RINGTONES!!", sub: "Eurobeak × Deja Vu × Running in the 90s — 200 FREE ringtones", cta: "DOWNLOAD", emoji: "📱", color: "yellow" },
  { title: "CASCINA ENERGY", sub: "30 pannelli fotovoltaici ⚡ agricoltura drift-certified", cta: "LEARN", emoji: "☀️", color: "purple" },
];

let uid = 0;

export function DriftPopups() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const spawn = useCallback(() => {
    const base = POOL[Math.floor(Math.random() * POOL.length)];
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    const h = typeof window !== "undefined" ? window.innerHeight : 800;
    const x = Math.max(20, Math.floor(Math.random() * (w - 320)));
    const y = Math.max(80, Math.floor(Math.random() * (h - 260)));
    uid += 1;
    setPopups((cur) => [...cur, { ...base, id: uid, x, y }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setPopups((cur) => cur.filter((p) => p.id !== id));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const kickoff = setTimeout(spawn, 2500);
    const interval = setInterval(() => {
      setPopups((cur) => (cur.length < 4 ? cur : cur.slice(1)));
      spawn();
    }, 7500);
    return () => {
      clearTimeout(kickoff);
      clearInterval(interval);
    };
  }, [mounted, spawn]);

  if (!mounted) return null;

  return (
    <div className={styles.layer} aria-hidden>
      {popups.map((p) => (
        <div
          key={p.id}
          className={`${styles.popup} ${styles[`c_${p.color}`]}`}
          style={{ left: p.x, top: p.y }}
        >
          <div className={styles.bar}>
            <span className={styles.barTitle}>{p.title}</span>
            <button
              type="button"
              className={styles.barClose}
              onClick={() => dismiss(p.id)}
              aria-label="close"
            >
              ×
            </button>
          </div>
          <div className={styles.body}>
            <div className={styles.emoji}>{p.emoji}</div>
            <div className={styles.sub}>{p.sub}</div>
            <button
              type="button"
              className={styles.cta}
              onClick={() => dismiss(p.id)}
            >
              {p.cta}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
