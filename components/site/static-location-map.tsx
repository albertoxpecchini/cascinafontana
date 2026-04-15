"use client";

import * as turf from "@turf/turf";
import { useEffect, useRef, useState } from "react";
import type { Map as MapboxMapInstance, Marker as MapboxMarkerInstance } from "mapbox-gl";
import styles from "./location-map.module.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim();
const MAP_CENTER: [number, number] = [10.665, 45.175];
const MAP_ZOOM = 13.5;
const TRACTOR_DURATION = 4.2;
const MILK_DURATION = 3.8;
const MILK_STAGGER = 0.3;
const MILK_COUNT = 6;
const CHEESE_BURST_DURATION = 2.6;
const LOOP_PAUSE = 1.1;

const LOCATIONS = [
  {
    id: "prato",
    name: "Prato",
    emoji: "🌿",
    coords: [10.661036, 45.177692] as [number, number],
    color: "#72963f",
    markerClassName: styles.stationPrato,
    anchor: "left" as const,
    offset: [0, 0] as [number, number],
  },
  {
    id: "allevamento",
    name: "Allevamento",
    emoji: "🥛",
    coords: [10.670727, 45.186568] as [number, number],
    color: "#c1854f",
    markerClassName: styles.stationAllevamento,
    anchor: "left" as const,
    offset: [0, 0] as [number, number],
  },
  {
    id: "caseificio",
    name: "Caseificio",
    emoji: "🧀",
    coords: [10.663782, 45.162946] as [number, number],
    color: "#d9ab2b",
    markerClassName: styles.stationCaseificio,
    anchor: "left" as const,
    offset: [0, 0] as [number, number],
  },
] as const;

const CHEESE_MARKERS = [
  { offset: [-58, -18] as [number, number], delay: 0.04 },
  { offset: [-26, -42] as [number, number], delay: 0.14 },
  { offset: [10, -48] as [number, number], delay: 0.24 },
  { offset: [44, -26] as [number, number], delay: 0.34 },
  { offset: [34, 14] as [number, number], delay: 0.46 },
  { offset: [-8, 32] as [number, number], delay: 0.58 },
  { offset: [-44, 12] as [number, number], delay: 0.7 },
] as const;

type MapStatus = "loading" | "live" | "fallback";
type RouteFeature = {
  type: "Feature";
  properties: Record<string, never>;
  geometry: {
    type: "LineString";
    coordinates: [number, number][];
  };
};
type RouteSource = {
  setData: (data: RouteFeature) => void;
};

function buildDenseRoute(coords: [number, number][]): [number, number][] {
  if (coords.length <= 2) {
    return coords;
  }

  const line = turf.lineString(coords);
  const length = turf.length(line, { units: "kilometers" });

  if (!Number.isFinite(length) || length === 0) {
    return coords;
  }

  const steps = Math.min(240, Math.max(90, Math.round(length * 95)));

  return Array.from({ length: steps + 1 }, (_, index) => {
    const point = turf.along(line, (length * index) / steps, { units: "kilometers" });
    return point.geometry.coordinates as [number, number];
  });
}

function toLineCoordinates(coords: [number, number][]): [number, number][] {
  if (coords.length === 0) {
    return [MAP_CENTER, MAP_CENTER];
  }

  if (coords.length === 1) {
    return [coords[0], coords[0]];
  }

  return coords;
}

function createRouteFeature(coords: [number, number][]): RouteFeature {
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: toLineCoordinates(coords),
    },
  };
}

async function fetchRoute(
  from: [number, number],
  to: [number, number],
  token: string
): Promise<[number, number][]> {
  try {
    const url =
      `https://api.mapbox.com/directions/v5/mapbox/driving/${from[0]},${from[1]};${to[0]},${to[1]}` +
      `?geometries=geojson&overview=full&steps=false&access_token=${token}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("route fetch failed");
    }

    const data = await response.json();
    const coords = data.routes?.[0]?.geometry?.coordinates;

    if (Array.isArray(coords) && coords.length > 1) {
      return buildDenseRoute(coords as [number, number][]);
    }
  } catch {
    return buildDenseRoute([from, to]);
  }

  return buildDenseRoute([from, to]);
}

function sampleRoute(route: [number, number][], progress: number): [number, number] {
  if (route.length === 1) {
    return route[0];
  }

  const clamped = Math.max(0, Math.min(1, progress));
  const index = clamped * (route.length - 1);
  const lower = Math.floor(index);
  const upper = Math.min(lower + 1, route.length - 1);
  const fraction = index - lower;

  return [
    route[lower][0] + (route[upper][0] - route[lower][0]) * fraction,
    route[lower][1] + (route[upper][1] - route[lower][1]) * fraction,
  ];
}

function sliceRoute(route: [number, number][], progress: number): [number, number][] {
  if (route.length <= 1) {
    return route;
  }

  const clamped = Math.max(0, Math.min(1, progress));

  if (clamped <= 0) {
    return [route[0]];
  }

  if (clamped >= 1) {
    return route;
  }

  const index = clamped * (route.length - 1);
  const completedSegments = Math.floor(index);
  const point = sampleRoute(route, clamped);

  return [...route.slice(0, completedSegments + 1), point];
}

function updateRouteSource(map: MapboxMapInstance, sourceId: string, coords: [number, number][]) {
  const source = map.getSource(sourceId) as RouteSource | undefined;
  source?.setData(createRouteFeature(coords));
}

function createStationMarkerElement(location: (typeof LOCATIONS)[number]) {
  const root = document.createElement("div");
  root.className = `${styles.stationLabel} ${location.markerClassName}`;
  root.setAttribute("aria-label", location.name);

  const dot = document.createElement("span");
  dot.className = styles.stationDot;

  const text = document.createElement("span");
  text.className = styles.stationText;
  text.textContent = location.name;

  root.append(dot, text);

  return root;
}

function createMovingMarkerElement(emoji: string, variantClassName: string) {
  const shell = document.createElement("div");
  shell.className = styles.movingMarkerShell;
  shell.setAttribute("aria-hidden", "true");

  const inner = document.createElement("div");
  inner.className = `${styles.movingMarker} ${variantClassName}`;
  inner.textContent = emoji;

  shell.append(inner);
  return { shell, inner };
}

function createCheesePopupElement() {
  const shell = document.createElement("div");
  shell.className = styles.cheesePopupShell;
  shell.setAttribute("aria-hidden", "true");

  const inner = document.createElement("div");
  inner.className = styles.cheesePopup;
  inner.textContent = "🧀";
  shell.append(inner);
  return { shell, inner };
}

function addRouteLayers(
  map: MapboxMapInstance,
  id: string,
  coords: [number, number][]
) {
  map.addSource(`route-${id}`, {
    type: "geojson",
    data: createRouteFeature(coords),
  });

  map.addSource(`route-${id}-active`, {
    type: "geojson",
    data: createRouteFeature([coords[0]]),
  });

  map.addLayer({
    id: `route-${id}-track`,
    type: "line",
    source: `route-${id}`,
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "rgba(34, 197, 94, 0.18)",
      "line-width": 5,
      "line-opacity": 0.72,
    },
  });

  map.addLayer({
    id: `route-${id}-active-glow`,
    type: "line",
    source: `route-${id}-active`,
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "rgba(34, 197, 94, 0.2)",
      "line-width": 10,
      "line-opacity": 0.36,
      "line-blur": 1.4,
    },
  });

  map.addLayer({
    id: `route-${id}-active`,
    type: "line",
    source: `route-${id}-active`,
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#22c55e",
      "line-width": 5,
      "line-opacity": 0.98,
    },
  });
}

function updateAnimatedElement(
  element: HTMLDivElement,
  options: { opacity: number; scale: number; y: number; rotate?: number }
) {
  element.style.opacity = String(options.opacity);
  element.style.transform = `translate3d(0, ${options.y}px, 0) scale(${options.scale}) rotate(${options.rotate ?? 0}deg)`;
}

function MapHud({ mapStatus }: { mapStatus: MapStatus }) {
  const badgeText =
    mapStatus === "live"
      ? "MAPBOX LIVE"
      : mapStatus === "loading"
        ? "CARICAMENTO"
        : "MAPBOX OFFLINE";

  const statusText =
    mapStatus === "live"
      ? "Percorso reale su strada, tre punti chiari e una UI che non disturba la lettura della mappa."
      : mapStatus === "loading"
        ? "Sto caricando il routing reale tra prato, allevamento e caseificio."
        : "La struttura della filiera resta visibile, ma senza il routing live di Mapbox.";

  return (
    <div className={styles.mapOverlay}>
      <div className={styles.mapHud}>
        <div className={styles.mapCopy}>
          <div className={styles.mapCopyBody}>
            <div className={styles.mapTopline}>
              <p className={styles.mapEyebrow}>Mappa della filiera</p>
            </div>

            <p className={styles.mapHeadline}>
              Dal prato al caseificio, una filiera leggibile su strada reale.
            </p>
            <p className={styles.mapLead}>{statusText}</p>
          </div>

          <div className={styles.mapCopyAside}>
            <span
              className={[
                styles.mapModeBadge,
                mapStatus === "live"
                  ? styles.mapModeLive
                  : mapStatus === "loading"
                    ? styles.mapModeLoading
                    : styles.mapModeFallback,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {badgeText}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.mapLegend}>
        <div className={styles.legendList}>
          <article className={styles.legendItem}>
            <span className={styles.legendIndex}>01</span>
            <span className={styles.legendGlyph}>🌿</span>
            <div className={styles.legendBody}>
              <p className={styles.legendItemTitle}>Prato</p>
              <p className={styles.legendItemText}>
                Punto di partenza del percorso e base agricola della filiera.
              </p>
            </div>
          </article>

          <article className={styles.legendItem}>
            <span className={styles.legendIndex}>02</span>
            <span className={styles.legendGlyph}>🥛</span>
            <div className={styles.legendBody}>
              <p className={styles.legendItemTitle}>Allevamento</p>
              <p className={styles.legendItemText}>
                Il latte prosegue su un asse leggibile e senza passaggi inutili.
              </p>
            </div>
          </article>

          <article className={styles.legendItem}>
            <span className={styles.legendIndex}>03</span>
            <span className={styles.legendGlyph}>🧀</span>
            <div className={styles.legendBody}>
              <p className={styles.legendItemTitle}>Caseificio</p>
              <p className={styles.legendItemText}>
                La chiusura del percorso rende il flusso completo in un colpo d'occhio.
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

export function MapboxMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapStatus, setMapStatus] = useState<MapStatus>(MAPBOX_TOKEN ? "loading" : "fallback");

  useEffect(() => {
    if (!MAPBOX_TOKEN || !containerRef.current) {
      setMapStatus("fallback");
      return;
    }

    let cancelled = false;
    let animationFrame = 0;
    let resizeObserver: ResizeObserver | null = null;
    let map: MapboxMapInstance | null = null;

    const initMap = async () => {
      try {
        const mapboxgl = (await import("mapbox-gl")).default;

        if (cancelled || !containerRef.current) {
          return;
        }

        mapboxgl.accessToken = MAPBOX_TOKEN;

        const nextMap = new mapboxgl.Map({
          container: containerRef.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: MAP_CENTER,
          zoom: MAP_ZOOM,
          pitch: 18,
          bearing: -8,
          attributionControl: false,
        });

        nextMap.dragRotate.disable();
        nextMap.touchZoomRotate.disableRotation();
        nextMap.addControl(
          new mapboxgl.NavigationControl({ showCompass: false }),
          "top-right"
        );

        resizeObserver = new ResizeObserver(() => {
          nextMap.resize();
        });
        resizeObserver.observe(containerRef.current);

        nextMap.once("load", async () => {
          if (cancelled) {
            return;
          }

          nextMap
            .getStyle()
            .layers?.filter((layer) => layer.type === "symbol")
            .forEach((layer) => {
              nextMap.setLayoutProperty(layer.id, "visibility", "none");
            });

          const tractorRoute = await fetchRoute(LOCATIONS[0].coords, LOCATIONS[1].coords, MAPBOX_TOKEN);
          const milkRoute = await fetchRoute(LOCATIONS[1].coords, LOCATIONS[2].coords, MAPBOX_TOKEN);

          if (cancelled) {
            return;
          }

          addRouteLayers(nextMap, "tractor", tractorRoute);
          addRouteLayers(nextMap, "milk", milkRoute);

          const stationMarkers = LOCATIONS.map((location) =>
            new mapboxgl.Marker({
              element: createStationMarkerElement(location),
              anchor: location.anchor,
              offset: location.offset,
            })
              .setLngLat(location.coords)
              .addTo(nextMap)
          );

          const tractorDom = createMovingMarkerElement("🚜", styles.movingMarkerTractor);
          const tractorMarker = new mapboxgl.Marker({
            element: tractorDom.shell,
            anchor: "center",
          })
            .setLngLat(tractorRoute[0])
            .addTo(nextMap);

          const milkMarkers = Array.from({ length: MILK_COUNT }, () => {
            const dom = createMovingMarkerElement("🥛", styles.movingMarkerMilk);
            const marker = new mapboxgl.Marker({
              element: dom.shell,
              anchor: "center",
            })
              .setLngLat(milkRoute[0])
              .addTo(nextMap);

            return {
              marker,
              inner: dom.inner,
            };
          });

          const cheeseMarkers = CHEESE_MARKERS.map((entry) => {
            const dom = createCheesePopupElement();
            const marker = new mapboxgl.Marker({
              element: dom.shell,
              anchor: "center",
              offset: entry.offset,
            })
              .setLngLat(LOCATIONS[2].coords)
              .addTo(nextMap);

            return {
              marker,
              inner: dom.inner,
              delay: entry.delay,
            };
          });

          const bounds = LOCATIONS.reduce(
            (accumulator, location) => accumulator.extend(location.coords),
            new mapboxgl.LngLatBounds(LOCATIONS[0].coords, LOCATIONS[0].coords)
          );
          const compactViewport = (containerRef.current?.clientWidth ?? 0) < 720;

          nextMap.fitBounds(bounds, {
            padding: compactViewport
              ? { top: 80, right: 44, bottom: 64, left: 56 }
              : { top: 160, right: 120, bottom: 88, left: 156 },
            duration: 0,
            maxZoom: MAP_ZOOM,
          });

          setMapStatus("live");

          const milkSequenceEnd =
            TRACTOR_DURATION + MILK_DURATION + MILK_STAGGER * (MILK_COUNT - 1);
          const cycleDuration = milkSequenceEnd + CHEESE_BURST_DURATION + LOOP_PAUSE;
          const cycleStart = performance.now();

          const step = (now: number) => {
            if (cancelled) {
              return;
            }

            const elapsed = ((now - cycleStart) / 1000) % cycleDuration;
            const tractorLineProgress = Math.min(elapsed / TRACTOR_DURATION, 1);
            const milkLineProgress =
              elapsed <= TRACTOR_DURATION
                ? 0
                : Math.min((elapsed - TRACTOR_DURATION) / (milkSequenceEnd - TRACTOR_DURATION), 1);

            updateRouteSource(nextMap, "route-tractor-active", sliceRoute(tractorRoute, tractorLineProgress));
            updateRouteSource(nextMap, "route-milk-active", sliceRoute(milkRoute, milkLineProgress));

            if (elapsed <= TRACTOR_DURATION) {
              const progress = elapsed / TRACTOR_DURATION;
              const point = sampleRoute(tractorRoute, progress);
              const bob = Math.sin(progress * Math.PI * 6) * -3;

              tractorMarker.setLngLat(point);
              updateAnimatedElement(tractorDom.inner, {
                opacity: 1,
                scale: 1.03,
                y: bob,
                rotate: Math.sin(progress * Math.PI * 4) * -3,
              });
            } else {
              updateAnimatedElement(tractorDom.inner, {
                opacity: 0,
                scale: 0.84,
                y: 10,
              });
            }

            milkMarkers.forEach((entry, index) => {
              const start = TRACTOR_DURATION + index * MILK_STAGGER;
              const end = start + MILK_DURATION;

              if (elapsed >= start && elapsed <= end) {
                const progress = (elapsed - start) / MILK_DURATION;
                const point = sampleRoute(milkRoute, progress);
                const bob = Math.sin(progress * Math.PI * 7 + index) * -2.5;

                entry.marker.setLngLat(point);
                updateAnimatedElement(entry.inner, {
                  opacity: 1,
                  scale: 1,
                  y: bob,
                  rotate: Math.sin(progress * Math.PI * 5 + index) * 2,
                });
              } else {
                updateAnimatedElement(entry.inner, {
                  opacity: 0,
                  scale: 0.82,
                  y: 10,
                });
              }
            });

            cheeseMarkers.forEach((entry) => {
              const local = elapsed - (milkSequenceEnd + entry.delay);

              if (local < 0 || local > CHEESE_BURST_DURATION) {
                updateAnimatedElement(entry.inner, {
                  opacity: 0,
                  scale: 0.72,
                  y: 18,
                });
                return;
              }

              let opacity = 1;
              let scale = 1;
              let y = -8;

              if (local < 0.3) {
                const progress = local / 0.3;
                opacity = progress;
                scale = 0.72 + progress * 0.42;
                y = 16 - progress * 24;
              } else if (local < 1.1) {
                const progress = (local - 0.3) / 0.8;
                opacity = 1;
                scale = 1.14 - progress * 0.1;
                y = -8 - progress * 8;
              } else {
                const progress = (local - 1.1) / (CHEESE_BURST_DURATION - 1.1);
                opacity = 1 - progress;
                scale = 1.04 - progress * 0.16;
                y = -16 - progress * 16;
              }

              updateAnimatedElement(entry.inner, {
                opacity,
                scale,
                y,
              });
            });

            animationFrame = window.requestAnimationFrame(step);
          };

          animationFrame = window.requestAnimationFrame(step);

          const disposableMarkers: MapboxMarkerInstance[] = [
            ...stationMarkers,
            tractorMarker,
            ...milkMarkers.map((entry) => entry.marker),
            ...cheeseMarkers.map((entry) => entry.marker),
          ];

          if (!cancelled) {
            nextMap.once("remove", () => {
              disposableMarkers.forEach((marker) => marker.remove());
            });
          }
        });

        map = nextMap;
      } catch {
        if (!cancelled) {
          setMapStatus("fallback");
        }
      }
    };

    void initMap();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      map?.remove();
    };
  }, []);

  return (
    <div className={styles.mapShell}>
      <MapHud mapStatus={mapStatus} />

      <div className={styles.mapContainer}>
        <div className={styles.mapBackdrop} aria-hidden="true">
          <div className={styles.mapBackdropGlow} />
        </div>
        {MAPBOX_TOKEN ? <div ref={containerRef} className={styles.mapCanvas} /> : null}
        <div className={styles.mapVignette} aria-hidden="true" />
      </div>
    </div>
  );
}
