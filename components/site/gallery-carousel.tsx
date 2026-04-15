"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./landing-page.module.css";

const galleryImages = [
  { src: "/images/campo.jpg", alt: "Campi della cascina" },
  { src: "/images/capannone.jpg", alt: "Strutture agricole" },
  { src: "/images/fontana.JPG", alt: "Cascina Fontana" },
  { src: "/images/trattori.jpg", alt: "Mezzi agricoli" },
];

export function GalleryCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const total = galleryImages.length;

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slides = track.querySelectorAll<HTMLElement>(`.${styles.carouselSlide}`);
    if (!slides[index]) return;
    const slideLeft = slides[index].offsetLeft;
    const slideWidth = slides[index].offsetWidth;
    const trackWidth = track.offsetWidth;
    track.scrollTo({ left: slideLeft - (trackWidth - slideWidth) / 2, behavior: "smooth" });
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const slides = track.querySelectorAll<HTMLElement>(`.${styles.carouselSlide}`);
      const center = track.scrollLeft + track.offsetWidth / 2;
      let closest = 0;
      let minDist = Infinity;
      slides.forEach((slide, i) => {
        const dist = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      setActiveIndex(closest);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.carouselWrapper}>
      <div ref={trackRef} className={styles.carouselTrack}>
        {galleryImages.map((img) => (
          <div key={img.src} className={styles.carouselSlide}>
            <Image
              src={img.src}
              alt={img.alt}
              width={400}
              height={300}
              className={styles.carouselImage}
            />
          </div>
        ))}
      </div>
      <div className={styles.carouselDots}>
        {galleryImages.map((_, i) => (
          <button
            key={i}
            className={styles.carouselDot}
            data-active={i === activeIndex}
            onClick={() => scrollToIndex(i)}
            aria-label={`Foto ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
