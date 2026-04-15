"use client";

import { useEffect, useState } from "react";
import styles from "./side-ads.module.css";

const adsLeft = [
  {
    emoji: "🏎️",
    title: "INITIAL D",
    line1: "峠 DRIFT KING",
    line2: "CLICK HERE!!",
    color: "magenta",
  },
  {
    emoji: "🍜",
    title: "RAMEN",
    line1: "東京 最高",
    line2: "FREE BOWL!",
    color: "orange",
  },
  {
    emoji: "📟",
    title: "TAMAGOTCHI",
    line1: "たまごっち",
    line2: "WIN 1 NOW",
    color: "cyan",
  },
  {
    emoji: "💾",
    title: "WIN98",
    line1: "DOWNLOAD",
    line2: "JUST $9.99",
    color: "blue",
  },
] as const;

const adsRight = [
  {
    emoji: "🗾",
    title: "TOKYO NIGHTS",
    line1: "渋谷 ★ 新宿",
    line2: "VISIT NOW",
    color: "magenta",
  },
  {
    emoji: "🎮",
    title: "SEGA SATURN",
    line1: "セガサターン",
    line2: "BUY TODAY",
    color: "cyan",
  },
  {
    emoji: "🍣",
    title: "SUSHI 24/7",
    line1: "寿司 美味しい",
    line2: "ORDER NOW",
    color: "red",
  },
  {
    emoji: "⛩️",
    title: "KYOTO TOUR",
    line1: "京都 ★ 神社",
    line2: "LIMITED!!",
    color: "yellow",
  },
] as const;

type Ad = {
  emoji: string;
  title: string;
  line1: string;
  line2: string;
  color: string;
};

function AdBox({ ad, index }: { ad: Ad; index: number }) {
  return (
    <div
      className={`${styles.ad} ${styles[`ad_${ad.color}`]}`}
      style={{ animationDelay: `${index * 0.3}s` }}
    >
      <div className={styles.adHeader}>
        <span className={styles.adClose}>×</span>
        <span className={styles.adHeaderText}>AD</span>
      </div>
      <div className={styles.adBody}>
        <div className={styles.adEmoji}>{ad.emoji}</div>
        <div className={styles.adTitle}>{ad.title}</div>
        <div className={styles.adLine}>{ad.line1}</div>
        <div className={styles.adBlink}>{ad.line2}</div>
        <div className={styles.adButton}>▶ CLICK</div>
      </div>
    </div>
  );
}

export function SideAds() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <aside className={`${styles.rail} ${styles.railLeft}`} aria-hidden>
        {adsLeft.map((ad, i) => (
          <AdBox ad={ad} index={i} key={ad.title} />
        ))}
      </aside>
      <aside className={`${styles.rail} ${styles.railRight}`} aria-hidden>
        {adsRight.map((ad, i) => (
          <AdBox ad={ad} index={i} key={ad.title} />
        ))}
      </aside>
    </>
  );
}
