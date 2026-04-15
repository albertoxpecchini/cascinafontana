"use client";

import dynamic from "next/dynamic";

const MapboxMap = dynamic(
  () => import("./static-location-map").then((m) => m.MapboxMap),
  { ssr: false }
);

export function LocationMap() {
  return <MapboxMap />;
}
