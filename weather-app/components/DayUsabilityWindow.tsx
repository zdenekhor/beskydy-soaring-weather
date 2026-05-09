"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import LkfrMap from "./LkfrMap";

type Lang = "cs" | "en";

type VisibleSeries = {
  times: number[];
  temperature: number[];
  dewPoint: number[];
  thermal: number[];
  lcl: number[];
  windSurface: number[];
  windSurfaceDir: number[];
  wind850: number[];
  wind850Dir: number[];
  wind700: number[];
  wind700Dir: number[];
  cloudLow: number[];
  cloudMid: number[];
  cloudHigh: number[];
};

type Props = {
  lang: Lang;
  open: boolean;
  onClose: () => void;
  dayLabel: string;
  pickLabels: string[];
  visibleSeries: VisibleSeries;
  activeIndex: number;
  flightDayStartIndex: number;
  flightDayEndIndex: number;
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function tempScore(temp: number) {
  return temp < 8 ? 0 : temp < 18 ? ((temp - 8) / 10) * 0.8 : temp < 32 ? 0.8 + ((temp - 18) / 14) * 0.2 : 1;
}

function thermalScore(thermal: number) {
  return clamp01(thermal / 2);
}

function lclScore(lcl: number) {
  if (lcl < 400) return 0;
  if (lcl < 900) return ((lcl - 400) / 500) * 0.4;
  if (lcl < 1600) return 0.4 + ((lcl - 900) / 700) * 0.4;
  if (lcl < 2600) return 0.8 + ((lcl - 1600) / 1000) * 0.2;
  return 1;
}

function windScore(windSurface: number) {
  if (windSurface <= 8) return 1;
  if (windSurface <= 16) return 1 - ((windSurface - 8) / 8) * 0.55;
  if (windSurface <= 25) return 0.45 - ((windSurface - 16) / 9) * 0.45;
  return 0;
}

function humidityScore(temp: number, dewPoint: number) {
  const spread = temp - dewPoint;
  if (spread < 2) return 0;
  if (spread < 5) return ((spread - 2) / 3) * 0.5;
  if (spread < 12) return 0.5 + ((spread - 5) / 7) * 0.5;
  return 1;
}

function cloudScore(lcl: number, cloudLow: number, cloudMid: number, cloudHigh: number) {
  const coverPenalty = Math.min(1, (cloudLow * 0.55 + cloudMid * 0.3 + cloudHigh * 0.15) / 100);
  return clamp01(lclScore(lcl) * 0.65 + (1 - coverPenalty) * 0.35);
}

function computeSoaringScore(
  temp: number,
  dewPoint: number,
  thermal: number,
  lcl: number,
  windSurface: number
): number {
  return (
    0.35 * thermalScore(thermal) +
    0.25 * lclScore(lcl) +
    0.2 * windScore(windSurface) +
    0.1 * tempScore(temp) +
    0.1 * humidityScore(temp, dewPoint)
  );
}

const SCORE_COLOR_STOPS: Array<[number, [number, number, number]]> = [
  [0.0, [150, 34, 44]],
  [0.12, [183, 52, 40]],
  [0.24, [214, 84, 31]],
  [0.38, [227, 130, 29]],
  [0.52, [224, 182, 36]],
  [0.66, [183, 208, 48]],
  [0.8, [110, 197, 61]],
  [0.9, [65, 191, 82]],
  [1.0, [34, 176, 104]],
];

function scoreToRgb(score: number): [number, number, number] {
  const clamped = Math.min(1, Math.max(0, score));

  for (let i = 1; i < SCORE_COLOR_STOPS.length; i += 1) {
    const [s0, c0] = SCORE_COLOR_STOPS[i - 1];
    const [s1, c1] = SCORE_COLOR_STOPS[i];
    if (clamped <= s1) {
      const t = (clamped - s0) / (s1 - s0);
      return [
        Math.round(c0[0] + t * (c1[0] - c0[0])),
        Math.round(c0[1] + t * (c1[1] - c0[1])),
        Math.round(c0[2] + t * (c1[2] - c0[2])),
      ];
    }
  }

  return SCORE_COLOR_STOPS[SCORE_COLOR_STOPS.length - 1][1];
}

function buildScoreGradient() {
  return `linear-gradient(to right, ${SCORE_COLOR_STOPS.map(([stop, [r, g, b]]) => `rgb(${r},${g},${b}) ${Math.round(stop * 100)}%`).join(", ")})`;
}

function withAlpha(color: string, alpha: number) {
  return color.replace(/rgba\(([^)]+),\s*[^,]+\)$/u, `rgba($1, ${alpha})`);
}

export default function DayUsabilityWindow({
  lang,
  open,
  onClose,
  dayLabel,
  pickLabels,
  visibleSeries,
  activeIndex,
  flightDayStartIndex,
  flightDayEndIndex,
}: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setFocusedIndex(activeIndex);
  }, [activeIndex, open]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(max-width: 720px)");
    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  const currentIndex =
    focusedIndex !== null && focusedIndex >= 0 && focusedIndex < pickLabels.length
      ? focusedIndex
      : activeIndex;

  const rows = useMemo(() => {
    return pickLabels.map((_, index) => {
      const temp = visibleSeries.temperature[index] ?? 0;
      const dewPoint = visibleSeries.dewPoint[index] ?? 0;
      const thermal = visibleSeries.thermal[index] ?? 0;
      const lcl = visibleSeries.lcl[index] ?? 0;
      const wind = visibleSeries.windSurface[index] ?? 0;
      const low = visibleSeries.cloudLow[index] ?? 0;
      const mid = visibleSeries.cloudMid[index] ?? 0;
      const high = visibleSeries.cloudHigh[index] ?? 0;

      const factors = {
        temp: tempScore(temp),
        humidity: humidityScore(temp, dewPoint),
        clouds: cloudScore(lcl, low, mid, high),
        wind: windScore(wind),
        thermal: thermalScore(thermal),
      };
      const overall = computeSoaringScore(temp, dewPoint, thermal, lcl, wind);

      return { factors, overall };
    });
  }, [pickLabels, visibleSeries]);

  // Slice to flight day only
  const dayStart = flightDayStartIndex >= 0 ? flightDayStartIndex : 0;
  const dayEnd = flightDayEndIndex >= 0 ? Math.min(flightDayEndIndex, pickLabels.length - 1) : pickLabels.length - 1;
  const dayLabels = pickLabels.slice(dayStart, dayEnd + 1);
  const dayRows = rows.slice(dayStart, dayEnd + 1);
  const dayCurrentIndex = Math.max(0, Math.min(currentIndex - dayStart, dayLabels.length - 1));

  const activeScore = rows[currentIndex]?.overall ?? 0;
  const activeTemp = visibleSeries.temperature[currentIndex] ?? 0;
  const activeDewPoint = visibleSeries.dewPoint[currentIndex] ?? 0;
  const activeThermal = visibleSeries.thermal[currentIndex] ?? 0;
  const activeLcl = visibleSeries.lcl[currentIndex] ?? 0;
  const activeWind = visibleSeries.windSurface[currentIndex] ?? 0;
  const activeScorePct = Math.round(activeScore * 100);
  const activeScoreLabel =
    activeScore >= 0.72
      ? lang === "cs"
        ? "výborné"
        : "excellent"
      : activeScore >= 0.48
      ? lang === "cs"
        ? "průměrné"
        : "fair"
      : activeScore >= 0.28
      ? lang === "cs"
        ? "slabé"
        : "poor"
      : lang === "cs"
      ? "nevhodné"
      : "unsuitable";
  const [r, g, b] = scoreToRgb(activeScore);

  const mapPanel = (
    <div
      style={{
        borderRadius: "16px",
        border: `1px solid rgba(${r}, ${g}, ${b}, 0.28)`,
        background: "rgba(8, 15, 29, 0.72)",
        padding: isMobile ? "8px" : "12px",
        boxShadow: "0 12px 28px rgba(2, 6, 23, 0.32)",
      }}
    >
      <LkfrMap
        lang={lang}
        score={activeScore}
        scoreLabel={activeScoreLabel}
        scorePct={activeScorePct}
        r={r}
        g={g}
        b={b}
        height={isMobile ? 230 : 420}
        outerRadiusM={20_000}
        title={
          lang === "cs"
            ? "LKFR – Frýdlant nad Ostravicí (okruh 10/20 km)"
            : "LKFR – Frýdlant nad Ostravicí (10/20 km radius)"
        }
      />
    </div>
  );

  const matrixPanel = (
    <div
      style={{
        borderRadius: "16px",
        border: "1px solid rgba(148, 163, 184, 0.18)",
        background: "rgba(8, 15, 29, 0.72)",
        padding: isMobile ? "8px" : "12px",
        overflowX: "auto",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `150px repeat(${dayLabels.length}, minmax(${isMobile ? 24 : 30}px, 1fr))`,
          gap: "4px",
          minWidth: `${150 + dayLabels.length * (isMobile ? 28 : 34)}px`,
          alignItems: "stretch",
        }}
      >
        <div style={matrixHeaderStyle(lang)}>
          {lang === "cs" ? "Faktor / hodina" : "Factor / hour"}
        </div>
        {dayLabels.map((label) => (
          <div
            key={label}
            style={{
              ...matrixHeaderStyle(lang),
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              minHeight: isMobile ? 60 : 76,
            }}
          >
            {label}
          </div>
        ))}

        {[
          { key: "overall", label: lang === "cs" ? "Celkem" : "Overall" },
          { key: "thermal", label: lang === "cs" ? "Termika" : "Thermal" },
          { key: "clouds", label: lang === "cs" ? "Oblačnost" : "Clouds" },
          { key: "humidity", label: lang === "cs" ? "Vlhkost" : "Humidity" },
          { key: "wind", label: lang === "cs" ? "Vítr" : "Wind" },
          { key: "temp", label: lang === "cs" ? "Teplota" : "Temperature" },
        ].map((row) => (
          <FragmentRow
            key={row.key}
            lang={lang}
            label={row.label}
            rowKey={row.key as FragmentRowKey}
            rows={dayRows}
            activeIndex={dayCurrentIndex}
            onFocusIndex={(i) => setFocusedIndex(dayStart + i)}
          />
        ))}
      </div>
    </div>
  );

  const detailStack = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        minHeight: 0,
      }}
    >
      <div
        style={{
          borderRadius: "16px",
          border: `1px solid rgba(${r}, ${g}, ${b}, 0.25)`,
          background: "rgba(8, 15, 29, 0.72)",
          padding: "14px",
        }}
      >
        <div style={{ fontSize: "0.78rem", color: "#9fb3c9", marginBottom: 6 }}>
          {lang === "cs" ? "Aktuální hodnocení" : "Current rating"}
        </div>
        <div style={{ fontSize: isMobile ? "1.55rem" : "1.9rem", fontWeight: 800, color: `rgb(${r}, ${g}, ${b})` }}>
          {activeScorePct} %
        </div>
        <div style={{ fontSize: isMobile ? "0.96rem" : "1rem", fontWeight: 700, color: "#eff6ff", marginTop: 4 }}>
          {activeScoreLabel}
        </div>
        <div
          style={{
            marginTop: 10,
            height: 8,
            borderRadius: 999,
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}
        >
          <div style={{ width: `${activeScorePct}%`, height: "100%", background: `rgb(${r}, ${g}, ${b})` }} />
        </div>
      </div>

      <div
        style={{
          borderRadius: "16px",
          border: "1px solid rgba(148, 163, 184, 0.18)",
          background: "rgba(8, 15, 29, 0.72)",
          padding: isMobile ? "10px" : "14px",
        }}
      >
        <div style={panelTitleStyle()}>{lang === "cs" ? "Současné podmínky" : "Current conditions"}</div>
        <div style={detailGridStyle(isMobile)}>
          <DetailItem label={lang === "cs" ? "Teplota" : "Temperature"} value={`${activeTemp.toFixed(1)} °C`} />
          <DetailItem label={lang === "cs" ? "Rosný bod" : "Dew point"} value={`${activeDewPoint.toFixed(1)} °C`} />
          <DetailItem label={lang === "cs" ? "Termika" : "Thermal"} value={`${activeThermal.toFixed(1)} m/s`} />
          <DetailItem label={lang === "cs" ? "Základna" : "Cloud base"} value={`${Math.round(activeLcl)} m AGL`} />
          <DetailItem label={lang === "cs" ? "Vítr" : "Wind"} value={`${Math.round(activeWind)} kt`} />
          <DetailItem label={lang === "cs" ? "Čas" : "Hour"} value={pickLabels[currentIndex] ?? "-"} />
        </div>
      </div>

      <div
        style={{
          borderRadius: "16px",
          border: "1px solid rgba(148, 163, 184, 0.18)",
          background: "rgba(8, 15, 29, 0.72)",
          padding: isMobile ? "10px" : "14px",
        }}
      >
        <div style={panelTitleStyle()}>{lang === "cs" ? "Legenda" : "Legend"}</div>
        <div style={{ display: "grid", gap: 10 }}>
          <div
            style={{
              height: 8,
              borderRadius: 999,
              background: buildScoreGradient(),
            }}
          />
          {[
            { label: lang === "cs" ? "nevhodné" : "poor", color: "rgb(160,38,38)" },
            { label: lang === "cs" ? "průměrné" : "fair", color: "rgb(215,190,28)" },
            { label: lang === "cs" ? "výborné" : "excellent", color: "rgb(45,195,78)" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  background: item.color,
                  boxShadow: `0 0 0 3px ${withAlpha(item.color, 0.18)}`,
                }}
              />
              <span style={{ color: "#dbe7fb", fontSize: "0.9rem" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={lang === "cs" ? "Využitelnost dne" : "Day usability"}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 70,
        background: "rgba(2, 6, 23, 0.94)",
        padding: isMobile ? "8px" : "12px",
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? "8px" : "12px",
        overflowY: "auto",
        overscrollBehavior: "contain",
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: isMobile ? "stretch" : "center",
          justifyContent: "space-between",
          gap: "12px",
          color: "#eff6ff",
          flexWrap: "wrap",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <div style={{ display: "grid", gap: 4 }}>
          <strong style={{ fontSize: "1rem" }}>
            {lang === "cs" ? "Využitelnost dne" : "Day usability"}
          </strong>
          <span style={{ color: "#9fb3c9", fontSize: "0.85rem" }}>{dayLabel}</span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", width: isMobile ? "100%" : "auto" }}>
          <button
            type="button"
            className="chartToggleButton"
            onClick={onClose}
            style={{ width: isMobile ? "100%" : "auto" }}
          >
            {lang === "cs" ? "Zavřít" : "Close"}
          </button>
        </div>
      </div>

      {isMobile ? (
        <>
          {mapPanel}
          {matrixPanel}
          {detailStack}
        </>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 1.2fr) minmax(320px, 0.8fr)",
            gap: "12px",
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            {mapPanel}
            {matrixPanel}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              minHeight: 0,
              overflowY: "auto",
            }}
          >
            {detailStack}
          </div>
        </div>
      )}
    </div>
  );
}

function matrixHeaderStyle(lang: Lang): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    padding: "8px 10px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.04)",
    color: "#9fb3c9",
    fontSize: lang === "cs" ? "0.76rem" : "0.72rem",
    fontWeight: 700,
    border: "1px solid rgba(148, 163, 184, 0.12)",
    textAlign: "center",
  };
}

function panelTitleStyle(): CSSProperties {
  return {
    fontSize: "0.8rem",
    color: "#9fb3c9",
    fontWeight: 700,
    marginBottom: 10,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  };
}

function detailGridStyle(isMobile = false): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
    gap: isMobile ? 8 : 10,
  };
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        borderRadius: 12,
        padding: "10px 12px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(148, 163, 184, 0.12)",
      }}
    >
      <div style={{ color: "#9fb3c9", fontSize: "0.75rem", marginBottom: 4 }}>{label}</div>
      <div style={{ color: "#eff6ff", fontSize: "0.94rem", fontWeight: 700 }}>{value}</div>
    </div>
  );
}

type FragmentRowKey = "overall" | "thermal" | "clouds" | "humidity" | "wind" | "temp";

type FragmentRowProps = {
  lang: Lang;
  label: string;
  rowKey: FragmentRowKey;
  rows: Array<{ factors: Record<string, number>; overall: number }>;
  activeIndex: number;
  onFocusIndex: (index: number) => void;
};

function FragmentRow({
  lang,
  label,
  rowKey,
  rows,
  activeIndex,
  onFocusIndex,
}: FragmentRowProps) {
  return (
    <>
      <div
        style={{
          ...matrixHeaderStyle(lang),
          justifyContent: "flex-start",
          paddingLeft: 12,
          minHeight: 38,
        }}
      >
        {label}
      </div>
      {rows.map((entry, index) => {
        const value = rowKey === "overall" ? entry.overall : entry.factors[rowKey];
        const [r, g, b] = scoreToRgb(value);
        const isActive = index === activeIndex;

        return (
          <div
            key={`${rowKey}-${index}`}
            title={`${label}: ${Math.round(value * 100)} %`}
            onMouseEnter={() => onFocusIndex(index)}
            onTouchStart={() => onFocusIndex(index)}
            onClick={() => onFocusIndex(index)}
            style={{
              minHeight: rowKey === "overall" ? 48 : 40,
              borderRadius: 10,
              background: `linear-gradient(180deg, rgba(${r}, ${g}, ${b}, 0.92) 0%, rgba(${r}, ${g}, ${b}, 0.72) 100%)`,
              border: isActive
                ? `2px solid rgba(${r}, ${g}, ${b}, 0.98)`
                : "1px solid rgba(148, 163, 184, 0.12)",
              boxShadow: isActive ? `0 0 0 2px rgba(${r}, ${g}, ${b}, 0.16)` : undefined,
              cursor: "pointer",
              transition: "transform 0.12s, border-color 0.12s, box-shadow 0.12s",
              transform: isActive ? "translateY(-1px)" : "none",
            }}
          />
        );
      })}
    </>
  );
}
