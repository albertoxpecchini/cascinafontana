"use client";

import { useEffect, useRef } from "react";
import styles from "./location-map.module.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const LOCATIONS = [
  {
    id: "prato",
    name: "Prato stabile",
    coords: [10.661036, 45.177692] as [number, number],
    color: "#5aaa28",
  },
  {
    id: "allevamento",
    name: "Allevamento",
    coords: [10.670727, 45.186568] as [number, number],
    color: "#8B6F47",
  },
  {
    id: "caseificio",
    name: "Caseificio",
    coords: [10.663782, 45.162946] as [number, number],
    color: "#d4a017",
  },
];

async function fetchRoute(
  from: [number, number],
  to: [number, number],
  token: string
): Promise<[number, number][]> {
  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${from[0]},${from[1]};${to[0]},${to[1]}?geometries=geojson&access_token=${token}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.routes?.[0]?.geometry?.coordinates) {
      return data.routes[0].geometry.coordinates;
    }
  } catch {
    /* fallback */
  }
  return [from, to];
}

function makeEmojiEl(emoji: string, size: number): HTMLDivElement {
  const el = document.createElement("div");
  el.innerText = emoji;
  el.style.fontSize = `${size}px`;
  el.style.lineHeight = "1";
  el.style.filter = "drop-shadow(0 0 6px rgba(255,255,255,0.6))";
  el.style.pointerEvents = "none";
  el.style.willChange = "transform";
  return el;
}

/** Interpolate position along a route at fraction t (0..1) */
function lerpRoute(
  route: [number, number][],
  t: number
): [number, number] {
  const clamped = Math.max(0, Math.min(1, t));
  const idx = clamped * (route.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, route.length - 1);
  const frac = idx - lo;
  return [
    route[lo][0] + (route[hi][0] - route[lo][0]) * frac,
    route[lo][1] + (route[hi][1] - route[lo][1]) * frac,
  ];
}

export function MapboxMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let animFrame = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let map: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allMarkers: any[] = [];
    const timeouts: number[] = [];

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;

      if (cancelled || !containerRef.current) return;

      mapboxgl.accessToken = MAPBOX_TOKEN;

      map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [10.665, 45.174],
        zoom: 12.6,
        pitch: 0,
        attributionControl: false,
      });

      map.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        "top-right"
      );

      /* ── Location markers ── */
      for (const loc of LOCATIONS) {
        const el = document.createElement("div");
        el.style.cssText = `
          width: 14px; height: 14px; border-radius: 50%;
          background: ${loc.color}; border: 2.5px solid rgba(0,0,0,0.6);
          box-shadow: 0 0 12px ${loc.color}, 0 2px 6px rgba(0,0,0,0.5);
          cursor: pointer;
        `;
        const m = new mapboxgl.Marker(el)
          .setLngLat(loc.coords)
          .setPopup(
            new mapboxgl.Popup({ offset: 20, closeButton: false }).setHTML(
              `<strong style="font-size:13px;color:#e4ebe0">${loc.name}</strong>`
            )
          )
          .addTo(map);
        allMarkers.push(m);
      }

      map.on("load", async () => {
        if (cancelled) return;

        /* ── Labels ── */
        map.addSource("labels", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: LOCATIONS.map((loc) => ({
              type: "Feature" as const,
              properties: { name: loc.name },
              geometry: { type: "Point" as const, coordinates: loc.coords },
            })),
          },
        });

        map.addLayer({
          id: "location-labels",
          type: "symbol",
          source: "labels",
          layout: {
            "text-field": ["get", "name"],
            "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
            "text-size": 13,
            "text-offset": [0, -1.8],
            "text-anchor": "bottom",
          },
          paint: {
            "text-color": "#3a2a10",
            "text-halo-color": "rgba(255,255,255,0.9)",
            "text-halo-width": 1.5,
          },
        });

        /* ── Fetch routes ── */
        const tractorRoute = await fetchRoute(
          LOCATIONS[0].coords,
          LOCATIONS[1].coords,
          MAPBOX_TOKEN
        );
        if (cancelled) return;

        const milkRoute = await fetchRoute(
          LOCATIONS[1].coords,
          LOCATIONS[2].coords,
          MAPBOX_TOKEN
        );
        if (cancelled) return;

        /* ── Draw dashed route lines ── */
        const addRouteLine = (
          id: string,
          coords: [number, number][],
          color: string
        ) => {
          map.addSource(`route-${id}`, {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: { type: "LineString", coordinates: coords },
            },
          });
          map.addLayer({
            id: `route-line-${id}`,
            type: "line",
            source: `route-${id}`,
            layout: { "line-cap": "round", "line-join": "round" },
            paint: {
              "line-color": color,
              "line-width": 3,
              "line-opacity": 0.5,
              "line-dasharray": [2, 2],
            },
          });
        };

        addRouteLine("tractor", tractorRoute, "#6b8e23");
        addRouteLine("milk", milkRoute, "#b0b0b0");

        /* =============================================================
         *  🚜 TRACTOR — 1 solo, Prato → Allevamento in 8 secondi
         * ============================================================= */
        const tractorEl = makeEmojiEl("🚜", 24);
        tractorEl.style.opacity = "0";
        const tractorMarker = new mapboxgl.Marker({ element: tractorEl })
          .setLngLat(tractorRoute[0])
          .addTo(map);
        allMarkers.push(tractorMarker);

        /* =============================================================
         *  🥛 MILK — 5 emoji sfalsati, Allevamento → Caseificio in 12s
         * ============================================================= */
        const MILK_COUNT = 5;
        const MILK_STAGGER = 1.5; // secondi tra ogni partenza
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const milkMarkers: { marker: any; el: HTMLDivElement }[] = [];

        for (let i = 0; i < MILK_COUNT; i++) {
          const el = makeEmojiEl("🥛", 22);
          el.style.opacity = "0";
          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat(milkRoute[0])
            .addTo(map);
          milkMarkers.push({ marker, el });
          allMarkers.push(marker);
        }

        /* =============================================================
         *  🧀 CHEESE — 5 popup vicino al Caseificio (raggio 100m)
         * ============================================================= */
        const CHEESE_COUNT = 6;
        const CHEESE_STAGGER = 0.4;

        function showCheesePopups() {
          if (cancelled) return;
          const casLng = LOCATIONS[2].coords[0];
          const casLat = LOCATIONS[2].coords[1];
          const LNG_PER_M = 1 / 78800;
          const LAT_PER_M = 1 / 111000;

          for (let i = 0; i < CHEESE_COUNT; i++) {
            const t = window.setTimeout(() => {
              if (cancelled) return;

              const angle = (Math.PI * 2 * i) / CHEESE_COUNT;
              const dist = 250 + Math.random() * 250; // 250-500m — visible at zoom 12.6
              const lng = casLng + Math.cos(angle) * dist * LNG_PER_M;
              const lat = casLat + Math.sin(angle) * dist * LAT_PER_M;

              // Outer: Mapbox controls its transform for positioning
              const outer = document.createElement("div");
              outer.style.pointerEvents = "none";

              // Inner: WE control its transform for scale animation
              const inner = document.createElement("div");
              inner.innerText = "🧀";
              inner.style.fontSize = "40px";
              inner.style.lineHeight = "1";
              inner.style.textAlign = "center";
              inner.style.filter = "drop-shadow(0 0 18px rgba(255,200,0,0.9))";
              inner.style.opacity = "0";
              inner.style.transform = "scale(0)";
              inner.style.transition =
                "opacity 0.4s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)";
              outer.appendChild(inner);

              const m = new mapboxgl.Marker({ element: outer, anchor: "center" })
                .setLngLat([lng, lat])
                .addTo(map);
              allMarkers.push(m);

              // pop in
              const t1 = window.setTimeout(() => {
                inner.style.opacity = "1";
                inner.style.transform = "scale(1.3)";
              }, 60);
              timeouts.push(t1);

              // settle
              const t2 = window.setTimeout(() => {
                inner.style.transform = "scale(1)";
              }, 650);
              timeouts.push(t2);

              // pop out
              const t3 = window.setTimeout(() => {
                inner.style.opacity = "0";
                inner.style.transform = "scale(0)";
              }, 3500);
              timeouts.push(t3);

              // remove
              const t4 = window.setTimeout(() => {
                m.remove();
              }, 4200);
              timeouts.push(t4);
            }, i * CHEESE_STAGGER * 1000);
            timeouts.push(t);
          }
        }

        /* =============================================================
         *  🔄 TIME-BASED ANIMATION LOOP
         *
         *  Timeline (loops):
         *    0s–8s   : tractor moves Prato → Allevamento
         *    8s–20s  : 5 milk move Allevamento → Caseificio (staggered)
         *    ~20s    : 5 cheese popups near Caseificio
         *    22s     : pause, then restart
         * ============================================================= */
        const TRACTOR_DUR = 5;       // seconds
        const MILK_DUR = 5;         // seconds per milk emoji
        const CHEESE_ANIM_DUR = 6;  // seconds for cheese to play out
        const PAUSE_AFTER = 2;      // seconds pause before loop

        let cycleStart = performance.now();
        let cheeseTriggered = false;

        function animate(now: number) {
          if (cancelled) return;

          const elapsed = (now - cycleStart) / 1000;

          /* ── 🚜 Tractor: 0s → 5s ── */
          if (elapsed < TRACTOR_DUR) {
            const t = elapsed / TRACTOR_DUR;
            tractorMarker.setLngLat(lerpRoute(tractorRoute, t));
            tractorEl.style.opacity = "1";
          } else {
            tractorEl.style.opacity = "0";
          }

          /* ── 🥛 Milk: starts after tractor arrives ── */
          let allMilkDone = true;
          for (let i = 0; i < MILK_COUNT; i++) {
            const milkStart = TRACTOR_DUR + i * MILK_STAGGER;
            const milkEnd = milkStart + MILK_DUR;

            if (elapsed >= milkStart && elapsed < milkEnd) {
              const t = (elapsed - milkStart) / MILK_DUR;
              milkMarkers[i].marker.setLngLat(lerpRoute(milkRoute, t));
              milkMarkers[i].el.style.opacity = "1";
              allMilkDone = false;
            } else if (elapsed >= milkEnd) {
              milkMarkers[i].el.style.opacity = "0";
            } else {
              milkMarkers[i].el.style.opacity = "0";
              allMilkDone = false;
            }
          }

          /* ── 🧀 Cheese: once when last milk finishes ── */
          const lastMilkEnd =
            TRACTOR_DUR + (MILK_COUNT - 1) * MILK_STAGGER + MILK_DUR;

          if (!cheeseTriggered && elapsed >= lastMilkEnd) {
            cheeseTriggered = true;
            showCheesePopups();
          }

          /* ── Loop reset ── */
          const cycleDur = lastMilkEnd + CHEESE_ANIM_DUR + PAUSE_AFTER;
          if (allMilkDone && cheeseTriggered && elapsed >= cycleDur) {
            cycleStart = now;
            cheeseTriggered = false;
          }

          animFrame = requestAnimationFrame(animate);
        }

        animFrame = requestAnimationFrame(animate);
      });
    })();

    const cleanupRef = { current: null as (() => void) | null };

    cleanupRef.current = () => {
      cancelled = true;
      cancelAnimationFrame(animFrame);
      timeouts.forEach((t) => clearTimeout(t));
      allMarkers.forEach((m) => m.remove());
      map?.remove();
    };

    return () => cleanupRef.current?.();
  }, []);

  return <div ref={containerRef} className={styles.mapContainer} />;
}
