"use client";

import styles from "./site.module.css";

// ─── Icon components ──────────────────────────────────────────────────────────

function IconBee({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="14" rx="5" ry="6.5" fill="currentColor" fillOpacity="0.45" />
      <ellipse cx="8.5" cy="9" rx="4" ry="2.2" transform="rotate(-25 8.5 9)" fill="currentColor" fillOpacity="0.28" />
      <ellipse cx="15.5" cy="9" rx="4" ry="2.2" transform="rotate(25 15.5 9)" fill="currentColor" fillOpacity="0.28" />
      <line x1="9.5" y1="12" x2="14.5" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
      <path d="M11 7.5 L12 6 L13 7.5" fill="none" />
    </svg>
  );
}

function IconButterfly({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 12 C10 9 5 5 3 8 C1 11 5 16 12 12Z" fill="currentColor" fillOpacity="0.45" />
      <path d="M12 12 C14 9 19 5 21 8 C23 11 19 16 12 12Z" fill="currentColor" fillOpacity="0.45" />
      <path d="M12 10 C11 13 11 17 12 19" fill="none" />
      <path d="M12 10 L11 8" fill="none" />
      <path d="M12 10 L13 8" fill="none" />
    </svg>
  );
}

function IconBird({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M2 8 C5 6 7 8 12 6 C17 4 19 6 22 8" />
    </svg>
  );
}

function IconFlower({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.7" />
      <ellipse cx="12" cy="5" rx="2.2" ry="3.5" fill="currentColor" fillOpacity="0.38" />
      <ellipse cx="12" cy="19" rx="2.2" ry="3.5" fill="currentColor" fillOpacity="0.38" />
      <ellipse cx="5" cy="12" rx="3.5" ry="2.2" fill="currentColor" fillOpacity="0.38" />
      <ellipse cx="19" cy="12" rx="3.5" ry="2.2" fill="currentColor" fillOpacity="0.38" />
      <ellipse cx="7.3" cy="7.3" rx="2.2" ry="3.5" transform="rotate(45 7.3 7.3)" fill="currentColor" fillOpacity="0.32" />
      <ellipse cx="16.7" cy="7.3" rx="2.2" ry="3.5" transform="rotate(-45 16.7 7.3)" fill="currentColor" fillOpacity="0.32" />
      <ellipse cx="7.3" cy="16.7" rx="2.2" ry="3.5" transform="rotate(-45 7.3 16.7)" fill="currentColor" fillOpacity="0.32" />
      <ellipse cx="16.7" cy="16.7" rx="2.2" ry="3.5" transform="rotate(45 16.7 16.7)" fill="currentColor" fillOpacity="0.32" />
    </svg>
  );
}

function IconSprout({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="22" x2="12" y2="10" />
      <path d="M12 14 C12 14 15 11 19 12 C19 12 18 16 12 16" fill="currentColor" fillOpacity="0.4" />
      <path d="M12 10 C12 10 9 7 5 8 C5 8 6 12 12 12" fill="currentColor" fillOpacity="0.4" />
    </svg>
  );
}

function IconClover({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="4" fill="currentColor" fillOpacity="0.4" />
      <circle cx="15" cy="9" r="4" fill="currentColor" fillOpacity="0.4" />
      <circle cx="12" cy="14" r="4" fill="currentColor" fillOpacity="0.4" />
      <line x1="12" y1="14" x2="12" y2="22" />
    </svg>
  );
}

function IconLadybug({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21 C7 21 4 17 4 13 C4 9 7 6 12 6 C17 6 20 9 20 13 C20 17 17 21 12 21Z" fill="currentColor" fillOpacity="0.5" />
      <circle cx="9" cy="11" r="1.5" fill="currentColor" fillOpacity="0.8" />
      <circle cx="15" cy="11" r="1.5" fill="currentColor" fillOpacity="0.8" />
      <circle cx="9" cy="16" r="1.5" fill="currentColor" fillOpacity="0.8" />
      <circle cx="15" cy="16" r="1.5" fill="currentColor" fillOpacity="0.8" />
      <line x1="12" y1="6" x2="12" y2="21" />
      <circle cx="12" cy="4" r="2.5" fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}

function IconWateringCan({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10 L3 19 L16 19 L16 10 Z" fill="currentColor" fillOpacity="0.4" />
      <path d="M16 14 C18 14 20 12 21 9" fill="none" />
      <path d="M21 9 C19 7 16 8 16 10" fill="none" />
      <path d="M8 10 L6 5 L14 5 L16 10" fill="currentColor" fillOpacity="0.3" />
      <line x1="17" y1="19" x2="18" y2="22" />
      <line x1="19" y1="19" x2="20" y2="22" />
      <line x1="21" y1="19" x2="22" y2="22" />
    </svg>
  );
}

function IconFig({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22 C8 22 5 18 5 14 C5 9 8 5 12 5 C16 5 19 9 19 14 C19 18 16 22 12 22Z" fill="currentColor" fillOpacity="0.45" />
      <line x1="12" y1="5" x2="12" y2="2" />
      <path d="M10 3 C8 1 6 2 6 4" fill="none" />
    </svg>
  );
}

function IconCherries({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="18" r="4" fill="currentColor" fillOpacity="0.5" />
      <circle cx="17" cy="18" r="4" fill="currentColor" fillOpacity="0.5" />
      <path d="M8 14 L12 7 L17 14" fill="none" />
      <path d="M12 7 L12 4" />
      <path d="M12 4 C14 2 17 3 17 6" fill="none" />
    </svg>
  );
}

function IconBlackberry({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="2.4" fill="currentColor" fillOpacity="0.5" />
      <circle cx="8" cy="12" r="2.4" fill="currentColor" fillOpacity="0.5" />
      <circle cx="16" cy="12" r="2.4" fill="currentColor" fillOpacity="0.5" />
      <circle cx="10" cy="16" r="2.4" fill="currentColor" fillOpacity="0.5" />
      <circle cx="14" cy="16" r="2.4" fill="currentColor" fillOpacity="0.5" />
      <circle cx="12" cy="19" r="2.4" fill="currentColor" fillOpacity="0.4" />
      <path d="M12 7 L12 4" />
      <path d="M12 4 C10 2 8 3 8 5" fill="none" />
    </svg>
  );
}

function IconBamboo({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="2" width="4" height="6" rx="2" fill="currentColor" fillOpacity="0.45" />
      <rect x="10" y="9" width="4" height="6" rx="2" fill="currentColor" fillOpacity="0.45" />
      <rect x="10" y="16" width="4" height="6" rx="2" fill="currentColor" fillOpacity="0.45" />
      <path d="M14 4 C17 3 19 5 18 8" fill="none" />
      <path d="M10 11 C7 10 5 12 6 15" fill="none" />
    </svg>
  );
}

function IconPeach({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21 C7.5 21 4 17.5 4 13 C4 8.5 7.5 5 12 5 C16.5 5 20 8.5 20 13 C20 17.5 16.5 21 12 21Z" fill="currentColor" fillOpacity="0.45" />
      <line x1="12" y1="5" x2="13" y2="2" />
      <path d="M13 2 C15 0 18 1 17 4" fill="none" />
    </svg>
  );
}

function IconPersimmon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 12 C6 7 8.5 4 12 4 C15.5 4 18 7 18 12 C18 17 15.5 21 12 21 C8.5 21 6 17 6 12Z" fill="currentColor" fillOpacity="0.45" />
      <path d="M9 4 C8 2 9 0 11 1" fill="none" />
      <path d="M12 4 C12 2 13 0 15 1" fill="none" />
      <path d="M15 4 C16 2 18 2 18 4" fill="none" />
    </svg>
  );
}

function IconPear({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22 C7 22 4 18 4 14 C4 10 7 8 9 8 L9 5 C9 3 10.5 2 12 2 C13.5 2 15 3 15 5 L15 8 C17 8 20 10 20 14 C20 18 17 22 12 22Z" fill="currentColor" fillOpacity="0.45" />
    </svg>
  );
}

function IconPlum({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="13" rx="7" ry="8" fill="currentColor" fillOpacity="0.45" />
      <line x1="12" y1="5" x2="12" y2="2" />
      <path d="M11 3 C9 1 7 2 7 4" fill="none" />
      <line x1="12" y1="13" x2="12" y2="21" strokeOpacity="0.5" />
    </svg>
  );
}

// ─── Icon catalogue ───────────────────────────────────────────────────────────

type IconComponent = React.ComponentType<{ size: number }>;

const ICONS: Array<{
  id: string; Icon: IconComponent; size: number;
  x: string; y: string; color: string; anim: string; dur: string; delay: string;
}> = [
  { id: "bee1",     Icon: IconBee,        size: 36, x: "7%",  y: "1%",  color: "#22c55e", anim: styles.float2,    dur: "7.5s",  delay: "0.3s"  },
  { id: "pear1",    Icon: IconPear,       size: 44, x: "88%", y: "2%",  color: "#4ade80", anim: styles.float3,    dur: "8.2s",  delay: "1.8s"  },
  { id: "bird1",    Icon: IconBird,       size: 40, x: "44%", y: "3%",  color: "#86efac", anim: styles.float1,    dur: "9.5s",  delay: "0.8s"  },
  { id: "plum1",    Icon: IconPlum,       size: 38, x: "23%", y: "5%",  color: "#15803d", anim: styles.float4,    dur: "7s",    delay: "2.3s"  },
  { id: "btf1",     Icon: IconButterfly,  size: 42, x: "67%", y: "6%",  color: "#16a34a", anim: styles.floatSpin, dur: "10s",   delay: "1.2s"  },
  { id: "fig1",     Icon: IconFig,        size: 40, x: "3%",  y: "13%", color: "#166534", anim: styles.float3,    dur: "8.8s",  delay: "0.5s"  },
  { id: "flower1",  Icon: IconFlower,     size: 46, x: "78%", y: "14%", color: "#4ade80", anim: styles.float1,    dur: "9s",    delay: "3.1s"  },
  { id: "cherry1",  Icon: IconCherries,   size: 44, x: "52%", y: "17%", color: "#15803d", anim: styles.float2,    dur: "7.8s",  delay: "1.6s"  },
  { id: "sprout1",  Icon: IconSprout,     size: 38, x: "31%", y: "20%", color: "#22c55e", anim: styles.float4,    dur: "8.5s",  delay: "0s"    },
  { id: "peach1",   Icon: IconPeach,      size: 42, x: "93%", y: "22%", color: "#bbf7d0", anim: styles.float3,    dur: "6.5s",  delay: "2.8s"  },
  { id: "bb1",      Icon: IconBlackberry, size: 40, x: "13%", y: "27%", color: "#166534", anim: styles.float1,    dur: "9.2s",  delay: "1.4s"  },
  { id: "bamboo1",  Icon: IconBamboo,     size: 44, x: "62%", y: "28%", color: "#16a34a", anim: styles.float2,    dur: "8s",    delay: "0.7s"  },
  { id: "lady1",    Icon: IconLadybug,    size: 36, x: "85%", y: "32%", color: "#22c55e", anim: styles.float4,    dur: "7.2s",  delay: "3.5s"  },
  { id: "clover1",  Icon: IconClover,     size: 42, x: "37%", y: "35%", color: "#4ade80", anim: styles.float3,    dur: "10.5s", delay: "2s"    },
  { id: "persist1", Icon: IconPersimmon,  size: 40, x: "5%",  y: "37%", color: "#86efac", anim: styles.floatSpin, dur: "8.5s",  delay: "1s"    },
  { id: "bee2",     Icon: IconBee,        size: 32, x: "72%", y: "40%", color: "#15803d", anim: styles.float1,    dur: "6.8s",  delay: "4.1s"  },
  { id: "pear2",    Icon: IconPear,       size: 36, x: "20%", y: "43%", color: "#4ade80", anim: styles.float2,    dur: "9.8s",  delay: "0.4s"  },
  { id: "wcan1",    Icon: IconWateringCan,size: 46, x: "48%", y: "46%", color: "#16a34a", anim: styles.float3,    dur: "7.5s",  delay: "2.6s"  },
  { id: "bird2",    Icon: IconBird,       size: 38, x: "89%", y: "49%", color: "#86efac", anim: styles.float4,    dur: "11s",   delay: "1.9s"  },
  { id: "fig2",     Icon: IconFig,        size: 34, x: "9%",  y: "51%", color: "#166534", anim: styles.float1,    dur: "8.2s",  delay: "3.7s"  },
  { id: "cherry2",  Icon: IconCherries,   size: 40, x: "56%", y: "54%", color: "#15803d", anim: styles.float2,    dur: "7s",    delay: "0.2s"  },
  { id: "flower2",  Icon: IconFlower,     size: 44, x: "28%", y: "57%", color: "#22c55e", anim: styles.floatSpin, dur: "9.5s",  delay: "1.3s"  },
  { id: "plum2",    Icon: IconPlum,       size: 38, x: "78%", y: "60%", color: "#166534", anim: styles.float3,    dur: "8.8s",  delay: "2.1s"  },
  { id: "sprout2",  Icon: IconSprout,     size: 42, x: "4%",  y: "63%", color: "#22c55e", anim: styles.float4,    dur: "7.8s",  delay: "0.9s"  },
  { id: "peach2",   Icon: IconPeach,      size: 36, x: "43%", y: "65%", color: "#bbf7d0", anim: styles.float1,    dur: "6.2s",  delay: "3.3s"  },
  { id: "bb2",      Icon: IconBlackberry, size: 44, x: "91%", y: "68%", color: "#166534", anim: styles.float2,    dur: "10.2s", delay: "1.7s"  },
  { id: "btf2",     Icon: IconButterfly,  size: 40, x: "17%", y: "71%", color: "#16a34a", anim: styles.float3,    dur: "8s",    delay: "4.4s"  },
  { id: "bamboo2",  Icon: IconBamboo,     size: 38, x: "64%", y: "74%", color: "#16a34a", anim: styles.floatSpin, dur: "9s",    delay: "0.6s"  },
  { id: "lady2",    Icon: IconLadybug,    size: 34, x: "35%", y: "77%", color: "#22c55e", anim: styles.float4,    dur: "7.5s",  delay: "2.9s"  },
  { id: "persist2", Icon: IconPersimmon,  size: 42, x: "82%", y: "79%", color: "#86efac", anim: styles.float1,    dur: "8.5s",  delay: "1.1s"  },
  { id: "clover2",  Icon: IconClover,     size: 40, x: "6%",  y: "82%", color: "#4ade80", anim: styles.float2,    dur: "9.2s",  delay: "3.6s"  },
  { id: "wcan2",    Icon: IconWateringCan,size: 44, x: "50%", y: "85%", color: "#16a34a", anim: styles.float3,    dur: "7.2s",  delay: "0.3s"  },
  { id: "bee3",     Icon: IconBee,        size: 38, x: "73%", y: "88%", color: "#15803d", anim: styles.float1,    dur: "8s",    delay: "2.2s"  },
  { id: "flower3",  Icon: IconFlower,     size: 46, x: "25%", y: "91%", color: "#22c55e", anim: styles.float4,    dur: "10s",   delay: "1.5s"  },
  { id: "cherry3",  Icon: IconCherries,   size: 42, x: "92%", y: "93%", color: "#15803d", anim: styles.floatSpin, dur: "8.8s",  delay: "0.8s"  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function FloatingIcons() {
  return (
    <div className={styles.floatingIconsLayer} aria-hidden="true">
      {ICONS.map((cfg) => (
        <span
          key={cfg.id}
          className={`${styles.floatIcon} ${cfg.anim}`}
          style={{
            left: cfg.x,
            top: cfg.y,
            color: cfg.color,
            animationDuration: cfg.dur,
            animationDelay: cfg.delay,
          }}
        >
          <cfg.Icon size={cfg.size} />
        </span>
      ))}
    </div>
  );
}
