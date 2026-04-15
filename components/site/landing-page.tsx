import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "./contact-form";
import { GalleryCarousel } from "./gallery-carousel";
import { SideAds } from "./side-ads";
import { PixelCanvas } from "./pixel-canvas";
import { DriftPopups } from "./drift-popups";
import { DriftingCars } from "./drifting-cars";
import styles from "./landing-page.module.css";

const navigation = [
  { id: "azienda", label: "会社" },
  { id: "attivita", label: "活動" },
  { id: "galleria", label: "写真" },
  { id: "contatti", label: "連絡" },
] as const;

const stats = [
  { value: "63", label: "biolche" },
  { value: "8", label: "mezzi" },
  { value: "30", label: "pannelli" },
  { value: "2007", label: "年" },
] as const;

const activities = [
  { title: "Produzione foraggera", text: "Prato stabile, mais, soia, grano e patate: colture coordinate in una regia agronomica chiara.", kanji: "飼料" },
  { title: "Cura del verde",        text: "Sfalci, potature e manutenzioni paesaggistiche con lo stesso ordine applicato ai campi.", kanji: "園芸" },
  { title: "Produzione legna",      text: "Taglio, raccolta e lavorazione come risorsa concreta per il territorio.", kanji: "木材" },
  { title: "Gelsi centenari",       text: "Recupero dei gelsi storici: memoria agricola, presidio ambientale e identità del luogo.", kanji: "桑" },
  { title: "Filiera locale",        text: "Il valore del campo si completa nel collegamento con allevamento, trasformazione e territorio.", kanji: "地元" },
  { title: "Energia integrata",     text: "Fotovoltaico a supporto della continuità operativa e dell'efficienza di gestione.", kanji: "電力" },
] as const;

const spinners = ["★", "✦", "✧", "◆", "◇", "☆", "❂", "❁"];

export function LandingPage() {
  return (
    <div className={styles.page}>
      {/* ── Floating layers ── */}
      <SideAds />
      <DriftPopups />
      <DriftingCars />

      {/* ── Emoji rain strip ── */}
      <div className={styles.emojiRain} aria-hidden>
        {["🏎️","💨","⚡","🌸","⭐","🗾","🍣","🎌","👘","🗼","🍜","🏁","💮","🎮"].map((e, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.35}s` }}>{e}</span>
        ))}
      </div>

      {/* ── Top marquee ── */}
      <div className={styles.topMarquee}>
        <span>
          ★ ようこそ!! WELCOME ★ 最新情報 NEW! ★ 頭文字D APPROVED ★ 東京ドリフト ★
          BEST VIEWED 800×600 ★ CASCINA FONTANA × TOKYO NIGHTS ★ 走り屋 ★ WANGAN ★
          DOWNLOAD NAPSTER.EXE NOW ★ Y2K READY ★ CLICK HERE ★ 歓迎!!! ★
        </span>
      </div>

      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerInner}>
            <Link href="#top" className={styles.brand}>
              <strong>★ CF ★ 農業</strong>
            </Link>
            <nav className={styles.nav}>
              {navigation.map((item) => (
                <Link key={item.id} href={`#${item.id}`} className={styles.navLink}>
                  {item.label}
                </Link>
              ))}
              <span className={`${styles.navLink} ${styles.navBadge}`}>NEW!</span>
            </nav>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* ── Hero ── */}
        <section id="top" className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.tagRow}>
              <span className={styles.jdmTag}>★ JDM ★</span>
              <span className={`${styles.jdmTag} ${styles.jdmTag_cyan}`}>FARM × TOKYO</span>
              <span className={styles.jdmTag}>RODIGO VIBES</span>
              <span className={`${styles.jdmTag} ${styles.jdmTag_cyan}`}>Y2K</span>
              <span className={styles.jdmTag}>頭文字D</span>
            </div>

            <p className={styles.eyebrow}>
              農業システム <span className={styles.jpAccent}>★</span> Rodigo, Mantova · EST. 2007
            </p>

            <h1 className={styles.heroTitle}>CASCINA FONTANA</h1>
            <div className={styles.heroSub}>カシーナ・フォンターナ</div>

            <p className={styles.heroLead}>
              <span className={styles.jpBadge}>新</span>
              Territorio, filiera e sostenibilità dentro una struttura agricola
              chiara, leggibile e contemporanea.
              <span className={styles.blink}>★ NEW ★</span>
            </p>

            <div className={styles.heroBadges}>
              <span className={styles.underConstruction}>⚠ UNDER CONSTRUCTION 工事中 ⚠</span>
              <span className={styles.underConstruction}>★ Y2K COMPLIANT ★</span>
              <span className={styles.underConstruction}>HTML 4.01 ★</span>
            </div>

            <div className={styles.stats}>
              {stats.map((s) => (
                <div key={s.label} className={styles.stat}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>

            <div className={styles.visitorRow}>
              <div className={styles.visitorCounter}>
                <span>VISITORS:</span>
                <span className={styles.counterDigits}>0013337</span>
              </div>
              <div className={styles.visitorCounter}>
                <span>ONLINE:</span>
                <span className={styles.counterDigits}>00042</span>
              </div>
              <div className={styles.visitorCounter}>
                <span>DRIFT:</span>
                <span className={styles.counterDigits}>∞ km</span>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.checkerFlag} aria-hidden />

        <div className={styles.container}>
          <div className={styles.jdmBanner}>
            <span>
              ★ 走り屋 DRIFT NIGHT · 峠 TOUGE · 首都高 WANGAN · 東京 湾岸 · ドリフト ·
              S15 · AE86 · R34 GTR · SUPRA · RX-7 · 初代 · JDM FOREVER · 頭文字D · D1GP ·
              NISMO · MUGEN · SPOON · TRD · HKS · MAZDASPEED · SUBARU STI · EVO ★
            </span>
          </div>
        </div>

        <div className={styles.spinnerRow} aria-hidden>
          {spinners.map((s, i) => (
            <span key={i} className={styles.spinner}>{s}</span>
          ))}
        </div>

        {/* ── Azienda ── */}
        <section id="azienda" className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>L&apos;AZIENDA 会社紹介</h2>
            <div className={styles.aziendaGrid}>
              <div className={styles.aziendaText}>
                <p>
                  <span className={styles.jpBadge}>◆</span>{" "}
                  Cascina Fontana è un&apos;azienda agricola a gestione diretta con sede a Rodigo,
                  nel mantovano. Sessantatré biolche di terreno sotto gestione, otto mezzi operativi,
                  trenta pannelli fotovoltaici e due operatori che coordinano produzione, manutenzione
                  e cura del paesaggio.
                </p>
                <p>
                  Il lavoro quotidiano tiene insieme prato stabile, colture, filiera casearia
                  e territorio — letto come un unico sistema, non come attività separate.
                </p>
                <div className={styles.inlineBadges}>
                  <span className={styles.jpBadge}>DOP</span>
                  <span className={styles.jpBadge}>GRANA PADANO</span>
                  <span className={styles.jpBadge}>ソーラー</span>
                </div>
              </div>
              <div className={styles.aziendaImage}>
                <Image
                  src="/images/capannone.jpg"
                  alt="Strutture di Cascina Fontana"
                  width={600}
                  height={400}
                  className={styles.roundedImage}
                />
              </div>
            </div>
          </div>
        </section>

        <div className={styles.divider}>･ ･ ･ ★ ･ ･ ･ ☆ ･ ･ ･ ★ ･ ･ ･</div>

        {/* ── Attività ── */}
        <section id="attivita" className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>ATTIVITÀ 活動</h2>
            <div className={styles.activitiesGrid}>
              {activities.map((a) => (
                <article key={a.title} className={styles.activityCard}>
                  <div className={styles.activityKanji}>{a.kanji}</div>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className={styles.divider}>･ ･ ･ ◆ ･ ･ ･ ☆ ･ ･ ･ ◆ ･ ･ ･</div>

        {/* ── r/place Pixel canvas ── */}
        <section className={`${styles.section} ${styles.pixelSection}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>PIXEL PLACE · みんなで描こう</h2>
            <PixelCanvas />
          </div>
        </section>

        <div className={styles.divider}>･ ･ ･ ★ ･ ･ ･</div>

        {/* ── Galleria ── */}
        <section id="galleria" className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>GALLERIA 写真</h2>
          </div>
          <GalleryCarousel />
        </section>

        <div className={styles.divider}>･ ･ ･ ♥ ･ ･ ･ ☆ ･ ･ ･ ♥ ･ ･ ･</div>

        {/* ── Contatti ── */}
        <section id="contatti" className={styles.section}>
          <div className={styles.container}>
            <div className={styles.contactPanel}>
              <div className={styles.contactCopy}>
                <h2 className={styles.sectionTitle}>CONTATTI 連絡先</h2>
                <p>
                  <span className={styles.blink}>✉</span> Per visite, collaborazioni
                  o informazioni sull&apos;azienda.
                </p>
                <dl className={styles.contactMeta}>
                  <div><dt>Sede</dt><dd>Rodigo, Mantova</dd></div>
                  <div><dt>Disponibilità</dt><dd>Su appuntamento</dd></div>
                  <div><dt>Fax</dt><dd>1999-0x1337</dd></div>
                  <div><dt>ICQ</dt><dd>#88888888</dd></div>
                </dl>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div className={styles.footerCol}>
              <strong>★ NAVIGATION ★</strong>
              <a href="#top">▶ TOP</a>
              <a href="#azienda">▶ 会社</a>
              <a href="#attivita">▶ 活動</a>
              <a href="#galleria">▶ 写真</a>
              <a href="#contatti">▶ 連絡</a>
            </div>
            <div className={styles.footerCol}>
              <strong>★ JDM LINKS ★</strong>
              <span>▶ 頭文字D</span>
              <span>▶ WANGAN</span>
              <span>▶ DRIFT KING</span>
              <span>▶ TOUGE</span>
              <span>▶ TOKYO XTREME</span>
            </div>
            <div className={styles.footerCol}>
              <strong>★ RINGS ★</strong>
              <span>◀ PREV</span>
              <span>▲ RANDOM</span>
              <span>▶ NEXT</span>
              <span>◆ HUB</span>
              <span>◇ JOIN</span>
            </div>
          </div>
          <p>© {new Date().getFullYear()} Cascina Fontana · Rodigo, Mantova · All rights reserved</p>
          <p className={styles.webring}>[ Best viewed with Netscape Navigator 4.0 @ 800×600 ★ 32bit color ]</p>
          <p className={styles.webring}>★ Powered by HAMSTERS 🐹 · Last updated 04/15/99 ★</p>
        </div>
      </footer>
    </div>
  );
}
