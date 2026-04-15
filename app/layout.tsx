import type { Metadata } from "next";
import { DotGothic16, VT323, Press_Start_2P } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const bodyFont = DotGothic16({
  subsets: ["latin"],
  variable: "--font-body",
  weight: "400",
  display: "swap",
});

const displayFont = Press_Start_2P({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
  display: "swap",
});

const monoFont = VT323({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "★ CASCINA FONTANA ★ ようこそ! Welcome to my homepage!! ★",
  description:
    "カシーナ・フォンターナ Official Homepage — Best viewed at 800x600 ★ Under Construction ★",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it" className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
