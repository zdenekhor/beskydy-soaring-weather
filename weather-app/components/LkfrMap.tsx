"use client";

import { useEffect, useRef } from "react";

// LKFR – Frýdlant nad Ostravicí
const LKFR_LAT = 49.5591;
const LKFR_LNG = 18.3536;
const RADIUS_M = 10_000;

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    L: any;
  }
}

type Props = {
  lang: "cs" | "en";
  score: number;          // 0–1 current soaring score
  scoreLabel: string;     // e.g. "výborné"
  scorePct: number;       // 0–100
  r: number; g: number; b: number; // RGB of score colour
};

function loadLeaflet(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return;
    if (window.L) { resolve(); return; }

    // CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

export default function LkfrMap({ lang, score, scoreLabel, scorePct, r, g, b }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const controlRef = useRef<any>(null);

  // Init map once
  useEffect(() => {
    if (!mapRef.current) return;
    let cancelled = false;

    loadLeaflet().then(() => {
      if (cancelled || !mapRef.current || leafletMapRef.current) return;
      const L = window.L;

      const map = L.map(mapRef.current, {
        center: [LKFR_LAT, LKFR_LNG],
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // 10 km circle
      circleRef.current = L.circle([LKFR_LAT, LKFR_LNG], {
        radius: RADIUS_M,
        color: `rgb(${r},${g},${b})`,
        fillColor: `rgb(${r},${g},${b})`,
        fillOpacity: 0.08,
        weight: 2,
      }).addTo(map);

      // Airport marker
      const airportIcon = L.divIcon({
        className: "",
        html: `<div style="
          width:32px;height:32px;
          background:rgba(30,40,60,0.92);
          border:2px solid rgba(${r},${g},${b},0.9);
          border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          font-size:16px;
          box-shadow:0 2px 8px rgba(0,0,0,0.5);
        ">✈</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      L.marker([LKFR_LAT, LKFR_LNG], { icon: airportIcon })
        .addTo(map)
        .bindPopup(`<b>LKFR</b><br>Frýdlant nad Ostravicí`);

      // Soaring score control
      const ScoreControl = L.Control.extend({
        options: { position: "topright" },
        onAdd() {
          const div = L.DomUtil.create("div");
          div.id = "lkfr-score-ctrl";
          div.innerHTML = buildScoreHtml(score, scoreLabel, scorePct, r, g, b, lang);
          div.style.cssText = `
            background:rgba(10,18,32,0.88);
            border:1px solid rgba(${r},${g},${b},0.45);
            border-radius:10px;
            padding:8px 12px;
            font-family:system-ui,sans-serif;
            min-width:130px;
            box-shadow:0 2px 10px rgba(0,0,0,0.5);
          `;
          L.DomEvent.disableClickPropagation(div);
          return div;
        },
      });
      controlRef.current = new ScoreControl().addTo(map);

      leafletMapRef.current = map;
    });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update circle colour + score badge when score changes
  useEffect(() => {
    if (!leafletMapRef.current) return;
    const color = `rgb(${r},${g},${b})`;
    if (circleRef.current) {
      circleRef.current.setStyle({
        color,
        fillColor: color,
      });
    }
    const el = document.getElementById("lkfr-score-ctrl");
    if (el) el.innerHTML = buildScoreHtml(score, scoreLabel, scorePct, r, g, b, lang);
  }, [score, scoreLabel, scorePct, r, g, b, lang]);

  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{
        fontSize: "0.78rem",
        color: "#7a96b2",
        fontWeight: 600,
        marginBottom: "6px",
      }}>
        {lang === "cs" ? "LKFR – Frýdlant nad Ostravicí (okruh 10 km)" : "LKFR – Frýdlant nad Ostravicí (10 km radius)"}
      </div>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "320px",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid rgba(148,163,184,0.12)",
          background: "#0f172a",
        }}
      />
    </div>
  );
}

function buildScoreHtml(
  score: number,
  label: string,
  pct: number,
  r: number, g: number, b: number,
  lang: "cs" | "en"
): string {
  const barW = Math.round(score * 100);
  const title = lang === "cs" ? "Plachtění" : "Soaring";
  return `
    <div style="font-size:0.72rem;color:#7a96b2;margin-bottom:4px;">${title}</div>
    <div style="font-size:1.05rem;font-weight:700;color:rgb(${r},${g},${b});margin-bottom:5px;">${label}</div>
    <div style="width:100%;height:5px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">
      <div style="width:${barW}%;height:100%;background:rgb(${r},${g},${b});border-radius:3px;"></div>
    </div>
    <div style="font-size:0.68rem;color:#5a7a96;margin-top:3px;text-align:right;">${pct} %</div>
  `;
}
