"use client";

import { useEffect, useRef } from "react";

// LKFR – Frýdlant nad Ostravicí
const LKFR_LAT = 49.592;
const LKFR_LNG = 18.359;
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
  convectiveOutlook?: Array<{
    label: string;
    scorePct: number;
    peakThermal: number;
  }>;
  height?: number | string;
  outerRadiusM?: number | null;
  title?: string;
};

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function loadLeaflet(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return;

    const ensureCss = () =>
      new Promise<void>((resolveCss) => {
        const existing = document.getElementById("leaflet-css") as HTMLLinkElement | null;

        if (existing) {
          if (existing.dataset.loaded === "true") {
            resolveCss();
            return;
          }

          existing.addEventListener("load", () => {
            existing.dataset.loaded = "true";
            resolveCss();
          }, { once: true });

          // Fallback for cases when stylesheet is already attached and usable.
          if (existing.sheet) {
            existing.dataset.loaded = "true";
            resolveCss();
          }
          return;
        }

        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        link.addEventListener("load", () => {
          link.dataset.loaded = "true";
          resolveCss();
        }, { once: true });
        document.head.appendChild(link);
      });

    const ensureJs = () =>
      new Promise<void>((resolveJs) => {
        if (window.L) {
          resolveJs();
          return;
        }

        const existing = document.getElementById("leaflet-js") as HTMLScriptElement | null;
        if (existing) {
          existing.addEventListener("load", () => resolveJs(), { once: true });
          return;
        }

        const script = document.createElement("script");
        script.id = "leaflet-js";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.addEventListener("load", () => resolveJs(), { once: true });
        document.head.appendChild(script);
      });

    Promise.all([ensureCss(), ensureJs()]).then(() => resolve());
  });
}

export default function LkfrMap({
  lang,
  score,
  scoreLabel,
  scorePct,
  r,
  g,
  b,
  convectiveOutlook = [],
  height = 320,
  outerRadiusM = null,
  title,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const outerCircleRef = useRef<any>(null);
  const controlRef = useRef<any>(null);
  const controlElementRef = useRef<HTMLDivElement | null>(null);

  // Init map once
  useEffect(() => {
    if (!mapRef.current) return;
    let cancelled = false;

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    let handleResize: (() => void) | null = null;

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

      if (outerRadiusM && outerRadiusM > RADIUS_M) {
        outerCircleRef.current = L.circle([LKFR_LAT, LKFR_LNG], {
          radius: outerRadiusM,
          color: `rgba(${r},${g},${b},0.72)`,
          fillColor: `rgba(${r},${g},${b},0.04)`,
          fillOpacity: 0.03,
          weight: 1.2,
          dashArray: "7 8",
        }).addTo(map);
      }

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
          const div = L.DomUtil.create("div") as HTMLDivElement;
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
          controlElementRef.current = div;
          return div;
        },
      });
      controlRef.current = new ScoreControl().addTo(map);

      const invalidate = () => {
        map.invalidateSize({ pan: false, animate: false });
      };

      handleResize = invalidate;
      requestAnimationFrame(() => requestAnimationFrame(invalidate));
      resizeTimeout = setTimeout(invalidate, 160);
      window.addEventListener("resize", handleResize);

      leafletMapRef.current = map;
    });

    return () => {
      cancelled = true;
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (handleResize) window.removeEventListener("resize", handleResize);
      controlRef.current = null;
      controlElementRef.current = null;
      circleRef.current = null;
      outerCircleRef.current = null;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
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
    if (controlElementRef.current) {
      controlElementRef.current.innerHTML = buildScoreHtml(score, scoreLabel, scorePct, r, g, b, lang);
    }
    if (outerCircleRef.current && outerRadiusM && outerRadiusM > RADIUS_M) {
      outerCircleRef.current.setStyle({
        color,
        fillColor: color,
      });
    }
    if (veilRef.current) {
      veilRef.current.style.background = `rgba(${r},${g},${b},${0.06 + score * 0.12})`;
      veilRef.current.style.boxShadow = `inset 0 0 60px rgba(${r},${g},${b},${0.08 + score * 0.10})`;
    }
  }, [score, scoreLabel, scorePct, r, g, b, lang, outerRadiusM]);

  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{
        fontSize: "0.78rem",
        color: "#7a96b2",
        fontWeight: 600,
        marginBottom: "6px",
      }}>
        {title ?? (lang === "cs" ? "LKFR – Frýdlant nad Ostravicí (okruh 10 km)" : "LKFR – Frýdlant nad Ostravicí (10 km radius)")}
      </div>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: typeof height === "number" ? `${height}px` : height,
          borderRadius: "12px",
          overflow: "hidden",
          border: `1px solid rgba(${r},${g},${b},0.28)`,
          background: "#0f172a",
          position: "relative",
          isolation: "isolate",
        }}
      >
        {/* Colored veil overlay */}
        <div
          ref={veilRef}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "12px",
            pointerEvents: "none",
            zIndex: 400,
            background: `rgba(${r},${g},${b},${0.06 + score * 0.12})`,
            boxShadow: `inset 0 0 60px rgba(${r},${g},${b},${0.08 + score * 0.10})`,
            transition: "background 0.4s ease, box-shadow 0.4s ease",
          }}
        />
      </div>

      {convectiveOutlook.length ? (
        <div
          style={{
            marginTop: "10px",
            border: "1px solid rgba(148, 163, 184, 0.18)",
            borderRadius: "10px",
            padding: "8px 10px",
            background: "rgba(8, 15, 29, 0.62)",
          }}
        >
          <div style={{ fontSize: "0.72rem", color: "#7a96b2", fontWeight: 600, marginBottom: 6 }}>
            {lang === "cs" ? "Konvektivní změna (dnes/zítra/pozítří)" : "Convective change (today/tomorrow/day+2)"}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 8,
            }}
          >
            {convectiveOutlook.slice(0, 3).map((item) => {
              const level = clamp01(item.scorePct / 100);
              const rr = Math.round(160 - level * 120);
              const gg = Math.round(70 + level * 125);
              const bb = Math.round(60 + level * 40);

              return (
                <div
                  key={item.label}
                  style={{
                    borderRadius: 8,
                    padding: "8px",
                    border: `1px solid rgba(${rr}, ${gg}, ${bb}, 0.45)`,
                    background: "rgba(255,255,255,0.03)",
                    display: "grid",
                    gap: 5,
                  }}
                >
                  <div style={{ fontSize: "0.73rem", color: "#dbe7fb", fontWeight: 700 }}>{item.label}</div>
                  <div style={{ fontSize: "0.72rem", color: `rgb(${rr}, ${gg}, ${bb})`, fontWeight: 700 }}>
                    {item.scorePct} %
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "#8fa8c2" }}>{item.peakThermal.toFixed(1)} m/s</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
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
