"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  type ActiveElement,
  type ChartData,
  type ChartOptions,
  type Plugin,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

type Lang = "cs" | "en";

type LabelsText = {
  today: string;
  tomorrow: string;
  dayPlus2: string;
  flightDayStart: string;
  flightDayEnd: string;
  sunrise: string;
  sunset: string;
  currentForecastHour: string;
  cloudBase: string;
  thermal: string;
  temperature: string;
  dewPoint: string;
  surfaceWind: string;
  wind850: string;
  wind700: string;
  cloudLow: string;
  cloudMid: string;
  cloudHigh: string;
  axesLegendTitle: string;
};

type ChartInputData = {
  labels: string[];
  times: number[];
  lcl: number[];
  thermal: number[];
  temperature: number[];
  dewPoint: number[];
  windSurface: number[];
  wind850: number[];
  wind700: number[];
  windSurfaceDir: number[];
  wind850Dir: number[];
  wind700Dir: number[];
  cloudLow: number[];
  cloudMid: number[];
  cloudHigh: number[];
  sunrise: number[];
  sunset: number[];
  currentIndex: number;
};

type Props = {
  lang: Lang;
  labelsText: LabelsText;
  data: ChartInputData;
};

const colors = {
  temp: "rgba(199, 167, 108, 0.95)",
  dew: "rgba(122, 156, 176, 0.95)",
  height: "rgba(106, 147, 132, 0.96)",
  thermal: "rgba(122, 160, 112, 0.96)",
  windSurface: "rgba(240, 161, 66, 0.96)",
  wind850: "rgba(76, 175, 210, 0.96)",
  wind700: "rgba(165, 120, 232, 0.96)",
  cloudLow: "rgba(214, 220, 227, 0.72)",
  cloudMid: "rgba(160, 171, 184, 0.82)",
  cloudHigh: "rgba(122, 137, 169, 0.9)",
};

const faded = {
  temp: "rgba(199, 167, 108, 0.24)",
  dew: "rgba(122, 156, 176, 0.24)",
  height: "rgba(106, 147, 132, 0.22)",
  thermal: "rgba(122, 160, 112, 0.22)",
  windSurface: "rgba(240, 161, 66, 0.22)",
  wind850: "rgba(76, 175, 210, 0.22)",
  wind700: "rgba(165, 120, 232, 0.22)",
  cloudLow: "rgba(214, 220, 227, 0.16)",
  cloudMid: "rgba(160, 171, 184, 0.16)",
  cloudHigh: "rgba(122, 137, 169, 0.16)",
};

const LKFR_TIME_ZONE = "Europe/Prague";
const VFR_DAY_START_OFFSET_SEC = 0;
const VFR_DAY_END_OFFSET_SEC = 0;

function getDateKey(timestampSec: number) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: LKFR_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(timestampSec * 1000));
}

function formatHm(timestampSec: number, lang: Lang) {
  return new Date(timestampSec * 1000).toLocaleTimeString(
    lang === "cs" ? "cs-CZ" : "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: LKFR_TIME_ZONE,
    }
  );
}

function formatDir(value: number | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return `${Math.round(value)}°`;
}

function dirToCardinal(deg: number): string {
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  const idx = Math.round(((deg % 360) + 360) % 360 / 22.5) % 16;
  return dirs[idx];
}

function drawWindBarb(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  speedKt: number,
  dirFromDeg: number,
  color: string,
  staffLen = 20
) {
  const spd = Math.round(speedKt);

  // Calm wind: circle
  if (spd < 3) {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    return;
  }

  const pennants = Math.floor(spd / 50);
  let rem = spd % 50;
  const fullBarbs = Math.floor(rem / 10);
  rem = rem % 10;
  const halfBarb = rem >= 5 ? 1 : 0;

  // Meteorological → canvas angle
  // Met: 0=N(up), 90=E(right). Canvas: 0=E(right), +y=down
  // Staff tip points in direction wind comes FROM
  const staffAngle = (dirFromDeg - 90) * (Math.PI / 180);
  const tipX = x + staffLen * Math.cos(staffAngle);
  const tipY = y + staffLen * Math.sin(staffAngle);

  // NH convention: barbs on LEFT when looking from origin toward tip (= wind direction)
  // barbAngle = staffAngle + π/2 ensures barbs sweep to the correct side
  const barbAngle = staffAngle + Math.PI / 2;
  const barbLen = staffLen * 0.65;
  const spacing = staffLen * 0.25;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.4;
  ctx.lineJoin = "round";

  // Staff
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();

  let pos = 0; // distance from tip back along staff

  // Pennants (50 kt each)
  for (let p = 0; p < pennants; p++) {
    const b1x = tipX - pos * Math.cos(staffAngle);
    const b1y = tipY - pos * Math.sin(staffAngle);
    pos += spacing * 2.2;
    const b2x = tipX - pos * Math.cos(staffAngle);
    const b2y = tipY - pos * Math.sin(staffAngle);
    const px = b1x + barbLen * Math.cos(barbAngle);
    const py = b1y + barbLen * Math.sin(barbAngle);
    ctx.beginPath();
    ctx.moveTo(b1x, b1y);
    ctx.lineTo(b2x, b2y);
    ctx.lineTo(px, py);
    ctx.closePath();
    ctx.fill();
  }

  // Full barbs (10 kt each)
  for (let f = 0; f < fullBarbs; f++) {
    const bx = tipX - pos * Math.cos(staffAngle);
    const by = tipY - pos * Math.sin(staffAngle);
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + barbLen * Math.cos(barbAngle), by + barbLen * Math.sin(barbAngle));
    ctx.stroke();
    pos += spacing;
  }

  // Half barb (5 kt)
  if (halfBarb) {
    if (fullBarbs === 0 && pennants === 0) pos += spacing;
    const bx = tipX - pos * Math.cos(staffAngle);
    const by = tipY - pos * Math.sin(staffAngle);
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(
      bx + (barbLen * 0.5) * Math.cos(barbAngle),
      by + (barbLen * 0.5) * Math.sin(barbAngle)
    );
    ctx.stroke();
  }

  ctx.restore();
}

function withAlpha(color: string, alpha: number) {
  return color.replace(/rgba\(([^)]+),\s*[^,]+\)$/u, `rgba($1, ${alpha})`);
}

function findFirstIndexAtOrAfter(values: number[], target: number) {
  if (!values.length) return -1;

  for (let i = 0; i < values.length; i += 1) {
    if (values[i] >= target) return i;
  }

  return values.length - 1;
}

function findLastIndexAtOrBefore(values: number[], target: number) {
  if (!values.length) return -1;

  for (let i = values.length - 1; i >= 0; i -= 1) {
    if (values[i] <= target) return i;
  }

  return 0;
}

const BARB_LEGEND_ITEMS = [0, 5, 10, 15, 20, 25, 30, 50, 60, 100];

function WindBarbSvg({ spd, color = "#a9bbd3" }: { spd: number; color?: string }) {
  const staffLen = 26;
  const barbLen = 14;
  const spacing = 6;
  const w = 44;
  const oy = 28;
  const ox = w - 5;
  const tipX = ox - staffLen;
  const h = oy + 6;

  if (spd < 3) {
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <circle cx={ox} cy={oy} r={5} fill="none" stroke={color} strokeWidth={1.5} />
      </svg>
    );
  }

  const pennants = Math.floor(spd / 50);
  let rem = spd % 50;
  const fullBarbs = Math.floor(rem / 10);
  rem = rem % 10;
  const halfBarb = rem >= 5 ? 1 : 0;

  const els: React.ReactNode[] = [];
  els.push(
    <line key="staff" x1={ox} y1={oy} x2={tipX} y2={oy}
      stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  );

  let pos = 0;

  for (let p = 0; p < pennants; p++) {
    const x1 = tipX + pos;
    const x2 = tipX + pos + spacing * 1.8;
    els.push(
      <polygon key={`p${p}`}
        points={`${x1},${oy} ${x2},${oy} ${x1},${oy - barbLen}`}
        fill={color} />
    );
    pos += spacing * 1.8 + 2;
  }

  for (let f = 0; f < fullBarbs; f++) {
    const bx = tipX + pos;
    els.push(
      <line key={`f${f}`} x1={bx} y1={oy} x2={bx} y2={oy - barbLen}
        stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    );
    pos += spacing;
  }

  if (halfBarb) {
    if (fullBarbs === 0 && pennants === 0) pos += spacing;
    const bx = tipX + pos;
    els.push(
      <line key="h" x1={bx} y1={oy} x2={bx} y2={oy - Math.round(barbLen * 0.5)}
        stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    );
  }

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {els}
    </svg>
  );
}

export default function WeatherChart({ lang, labelsText, data }: Props) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [hoveredAxis, setHoveredAxis] = useState<string | null>(null);
  const [selectedAxis, setSelectedAxis] = useState<string | null>(null);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileGraphOpen, setMobileGraphOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(max-width: 640px)");
    const update = () => {
      setIsMobile(media.matches);
      if (!media.matches) {
        setMobileGraphOpen(false);
      }
    };

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  const dayKeys = useMemo(() => {
    return data.sunrise.map((s) => getDateKey(s));
  }, [data.sunrise]);

  const selectedDayKey = dayKeys[selectedDay] ?? dayKeys[0];

  const visibleIndices = useMemo(() => {
    return data.times
      .map((time, i) => ({ i, key: getDateKey(time) }))
      .filter((row) => row.key === selectedDayKey)
      .map((row) => row.i);
  }, [data.times, selectedDayKey]);

  const pickLabels = useMemo(
    () => visibleIndices.map((i) => data.labels[i]),
    [data.labels, visibleIndices]
  );
  const visibleSeries = useMemo(
    () => ({
      times: visibleIndices.map((i) => data.times[i]),
      lcl: visibleIndices.map((i) => data.lcl[i]),
      thermal: visibleIndices.map((i) => data.thermal[i]),
      temperature: visibleIndices.map((i) => data.temperature[i]),
      dewPoint: visibleIndices.map((i) => data.dewPoint[i]),
      windSurface: visibleIndices.map((i) => data.windSurface[i]),
      wind850: visibleIndices.map((i) => data.wind850[i]),
      wind700: visibleIndices.map((i) => data.wind700[i]),
      windSurfaceDir: visibleIndices.map((i) => data.windSurfaceDir[i]),
      wind850Dir: visibleIndices.map((i) => data.wind850Dir[i]),
      wind700Dir: visibleIndices.map((i) => data.wind700Dir[i]),
      cloudLow: visibleIndices.map((i) => data.cloudLow[i]),
      cloudMid: visibleIndices.map((i) => data.cloudMid[i]),
      cloudHigh: visibleIndices.map((i) => data.cloudHigh[i]),
    }),
    [data, visibleIndices]
  );

  const visibleCurrentIndex = visibleIndices.indexOf(data.currentIndex);

  const activePointIndex =
    hoveredPointIndex !== null
      ? hoveredPointIndex
      : visibleCurrentIndex >= 0
      ? visibleCurrentIndex
      : 0;

  const safeActiveIndex =
    activePointIndex >= 0 && activePointIndex < pickLabels.length ? activePointIndex : 0;

  const activeAxis = selectedAxis ?? hoveredAxis;

  const sunriseTs = data.sunrise[selectedDay];
  const sunsetTs = data.sunset[selectedDay];
  const flightDayStartTs =
    typeof sunriseTs === "number" ? sunriseTs + VFR_DAY_START_OFFSET_SEC : undefined;
  const flightDayEndTs =
    typeof sunsetTs === "number" ? sunsetTs + VFR_DAY_END_OFFSET_SEC : undefined;
  const flightDayStartLabel =
    typeof flightDayStartTs === "number" ? formatHm(flightDayStartTs, lang) : "-";
  const flightDayEndLabel =
    typeof flightDayEndTs === "number" ? formatHm(flightDayEndTs, lang) : "-";

  const flightDayStartIndex =
    typeof flightDayStartTs === "number"
      ? findFirstIndexAtOrAfter(visibleSeries.times, flightDayStartTs)
      : -1;
  const flightDayEndIndex =
    typeof flightDayEndTs === "number"
      ? findLastIndexAtOrBefore(visibleSeries.times, flightDayEndTs)
      : -1;

  const activeTemperature = visibleSeries.temperature[safeActiveIndex] ?? 0;
  const activeDewPoint = visibleSeries.dewPoint[safeActiveIndex] ?? 0;
  const activeLcl = visibleSeries.lcl[safeActiveIndex] ?? 0;
  const activeThermal = visibleSeries.thermal[safeActiveIndex] ?? 0;
  const activeWindSurface = visibleSeries.windSurface[safeActiveIndex] ?? 0;
  const activeWind850 = visibleSeries.wind850[safeActiveIndex] ?? 0;
  const activeWind700 = visibleSeries.wind700[safeActiveIndex] ?? 0;
  const activeWindSurfaceDir = visibleSeries.windSurfaceDir[safeActiveIndex] ?? 0;
  const activeWind850Dir = visibleSeries.wind850Dir[safeActiveIndex] ?? 0;
  const activeWind700Dir = visibleSeries.wind700Dir[safeActiveIndex] ?? 0;
  const activeCloudLow = visibleSeries.cloudLow[safeActiveIndex] ?? 0;
  const activeCloudMid = visibleSeries.cloudMid[safeActiveIndex] ?? 0;
  const activeCloudHigh = visibleSeries.cloudHigh[safeActiveIndex] ?? 0;

  const chartData = useMemo<ChartData<"line">>(
    () => ({
      labels: pickLabels,
      datasets: [
        {
          label: labelsText.temperature,
          data: visibleSeries.temperature,
          yAxisID: "yTemp",
          borderColor: activeAxis && activeAxis !== "temp" ? faded.temp : colors.temp,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: activeAxis === "temp" ? 3.2 : 2.2,
        },
        {
          label: labelsText.dewPoint,
          data: visibleSeries.dewPoint,
          yAxisID: "yTemp",
          borderColor: activeAxis && activeAxis !== "temp" ? faded.dew : colors.dew,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: activeAxis === "temp" ? 2.8 : 2.0,
        },
        {
          label: labelsText.cloudBase,
          data: visibleSeries.lcl,
          yAxisID: "yHeight",
          borderColor: activeAxis && activeAxis !== "height" ? faded.height : colors.height,
          tension: 0.25,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: activeAxis === "height" ? 3.2 : 2.2,
        },
        {
          label: labelsText.thermal,
          data: visibleSeries.thermal,
          yAxisID: "yThermal",
          borderColor: activeAxis && activeAxis !== "thermal" ? faded.thermal : colors.thermal,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: activeAxis === "thermal" ? 3.1 : 2.2,
        },
        {
          label: labelsText.surfaceWind,
          data: visibleSeries.windSurface,
          yAxisID: "yWind",
          borderColor:
            activeAxis && activeAxis !== "wind" ? faded.windSurface : colors.windSurface,
          tension: 0.25,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: activeAxis === "wind" ? 2.8 : 1.9,
        },
        {
          label: labelsText.wind850,
          data: visibleSeries.wind850,
          yAxisID: "yWind",
          borderColor: activeAxis && activeAxis !== "wind" ? faded.wind850 : colors.wind850,
          tension: 0.25,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: activeAxis === "wind" ? 2.8 : 1.9,
        },
        {
          label: labelsText.wind700,
          data: visibleSeries.wind700,
          yAxisID: "yWind",
          borderColor: activeAxis && activeAxis !== "wind" ? faded.wind700 : colors.wind700,
          tension: 0.25,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: activeAxis === "wind" ? 2.8 : 1.9,
        },
        {
          label: labelsText.cloudLow,
          data: visibleSeries.cloudLow,
          yAxisID: "yCloud",
          borderColor: activeAxis && activeAxis !== "cloud" ? faded.cloudLow : colors.cloudLow,
          borderDash: [2, 2],
          tension: 0.25,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: activeAxis === "cloud" ? 2.0 : 1.4,
        },
        {
          label: labelsText.cloudMid,
          data: visibleSeries.cloudMid,
          yAxisID: "yCloud",
          borderColor: activeAxis && activeAxis !== "cloud" ? faded.cloudMid : colors.cloudMid,
          borderDash: [6, 3],
          tension: 0.25,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: activeAxis === "cloud" ? 2.0 : 1.4,
        },
        {
          label: labelsText.cloudHigh,
          data: visibleSeries.cloudHigh,
          yAxisID: "yCloud",
          borderColor:
            activeAxis && activeAxis !== "cloud" ? faded.cloudHigh : colors.cloudHigh,
          borderDash: [10, 4],
          tension: 0.25,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: activeAxis === "cloud" ? 2.0 : 1.4,
        },
      ],
    }),
    [activeAxis, labelsText, pickLabels, visibleSeries]
  );

  const windDirectionPlugin = useMemo<Plugin<"line">>(
    () => ({
      id: "windDirectionArrows",
      beforeDatasetsDraw(chart) {
        const xScale = chart.scales.x;
        const yTop = chart.chartArea.top;
        const yBottom = chart.chartArea.bottom;

        if (!xScale) return;

        const markerTags = {
          start: lang === "cs" ? "START" : "START",
          end: lang === "cs" ? "KONEC" : "END",
          now: lang === "cs" ? "TEĎ" : "NOW",
        };

        const markers = [
          {
            index: flightDayStartIndex,
            color: "rgba(74, 222, 128, 0.62)",
            dash: [] as number[],
            width: 1.4,
            tag: markerTags.start,
          },
          {
            index: flightDayEndIndex,
            color: "rgba(251, 191, 36, 0.62)",
            dash: [] as number[],
            width: 1.4,
            tag: markerTags.end,
          },
          {
            index: visibleCurrentIndex,
            color: "rgba(59, 130, 246, 0.72)",
            dash: [4, 4],
            width: 1.6,
            tag: markerTags.now,
          },
        ].filter((marker) => marker.index >= 0 && marker.index < pickLabels.length);

        const { ctx } = chart;
        ctx.save();

        for (const marker of markers) {
          const x = xScale.getPixelForValue(marker.index);

          ctx.beginPath();
          ctx.setLineDash(marker.dash);
          ctx.lineWidth = marker.width;
          ctx.strokeStyle = marker.color;
          ctx.moveTo(x, yTop);
          ctx.lineTo(x, yBottom);
          ctx.stroke();

          const labelWidth = ctx.measureText(marker.tag).width + 12;
          const tagY = yTop - 20;
          ctx.setLineDash([]);
          ctx.fillStyle = "rgba(15, 23, 42, 0.72)";
          ctx.strokeStyle = marker.color;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.roundRect(x - labelWidth / 2, tagY, labelWidth, 16, 6);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = marker.color;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "600 10px system-ui";
          ctx.fillText(marker.tag, x, tagY + 8);
        }

        ctx.restore();
      },
      afterDatasetsDraw(chart) {
        const { ctx } = chart;

        const step =
          pickLabels.length > 24 ? 4 : pickLabels.length > 16 ? 3 : pickLabels.length > 10 ? 2 : 1;
        const windSeries = [
          {
            datasetIndex: 4,
            speeds: visibleSeries.windSurface,
            dirs: visibleSeries.windSurfaceDir,
            color: activeAxis && activeAxis !== "wind" ? faded.windSurface : colors.windSurface,
          },
          {
            datasetIndex: 5,
            speeds: visibleSeries.wind850,
            dirs: visibleSeries.wind850Dir,
            color: activeAxis && activeAxis !== "wind" ? faded.wind850 : colors.wind850,
          },
          {
            datasetIndex: 6,
            speeds: visibleSeries.wind700,
            dirs: visibleSeries.wind700Dir,
            color: activeAxis && activeAxis !== "wind" ? faded.wind700 : colors.wind700,
          },
        ];

        for (const series of windSeries) {
          const meta = chart.getDatasetMeta(series.datasetIndex);
          if (!meta?.data?.length) continue;

          for (let i = 0; i < meta.data.length; i += step) {
            const point = meta.data[i];
            const dir = series.dirs[i];
            const spd = series.speeds[i];
            if (!point || typeof dir !== "number" || Number.isNaN(dir)) continue;
            if (typeof spd !== "number" || Number.isNaN(spd)) continue;

            drawWindBarb(
              ctx,
              point.x,
              point.y + 28,
              spd,
              dir,
              withAlpha(series.color, 0.95),
              24
            );
          }
        }
      },
    }),
    [
      visibleSeries.wind700Dir,
      visibleSeries.wind850Dir,
      visibleSeries.windSurfaceDir,
      flightDayEndIndex,
      flightDayStartIndex,
      activeAxis,
      lang,
      pickLabels.length,
      visibleCurrentIndex,
    ]
  );

  const options = useMemo<ChartOptions<"line">>(
    () => ({
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 24,
        },
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
      onHover: (_event, activeElements) => {
        const elements = activeElements as ActiveElement[];
        if (elements.length > 0) {
          const nextIndex = elements[0].index;
          setHoveredPointIndex((prev) => (prev === nextIndex ? prev : nextIndex));
        }
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#aeb9c4",
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 12,
            font: {
              size: 11,
              weight: 500,
            },
          },
          grid: {
            color: "rgba(148, 163, 184, 0.055)",
          },
          border: {
            color: "rgba(148, 163, 184, 0.14)",
          },
        },
        yTemp: {
          type: "linear",
          position: "left",
          ticks: {
            color: "#c7a76c",
            font: {
              size: 11,
              weight: 500,
            },
          },
          title: {
            display: false,
          },
          grid: {
            color:
              activeAxis === "temp"
                ? "rgba(199, 167, 108, 0.14)"
                : "rgba(148, 163, 184, 0.045)",
            lineWidth: activeAxis === "temp" ? 1.0 : 0.55,
          },
          border: {
            color: "rgba(148, 163, 184, 0.14)",
          },
        },
        yHeight: {
          type: "linear",
          position: "right",
          ticks: {
            color: "#6a9384",
            font: {
              size: 11,
              weight: 500,
            },
          },
          title: {
            display: false,
          },
          grid: {
            color:
              activeAxis === "height"
                ? "rgba(106, 147, 132, 0.14)"
                : "rgba(148, 163, 184, 0.04)",
            drawOnChartArea: true,
            lineWidth: activeAxis === "height" ? 1.0 : 0.45,
          },
          border: {
            color: "rgba(148, 163, 184, 0.14)",
          },
        },
        yThermal: {
          type: "linear",
          position: "right",
          min: 0,
          suggestedMax: 4,
          ticks: {
            color: "#7aa070",
            font: {
              size: 11,
              weight: 500,
            },
          },
          title: {
            display: false,
          },
          grid: {
            color:
              activeAxis === "thermal"
                ? "rgba(122, 160, 112, 0.14)"
                : "rgba(148, 163, 184, 0.04)",
            drawOnChartArea: true,
            lineWidth: activeAxis === "thermal" ? 1.0 : 0.45,
          },
          border: {
            color: "rgba(148, 163, 184, 0.14)",
          },
        },
        yWind: {
          type: "linear",
          position: "right",
          min: 0,
          ticks: {
            color: "#a87c90",
            font: {
              size: 11,
              weight: 500,
            },
          },
          title: {
            display: false,
          },
          grid: {
            color:
              activeAxis === "wind"
                ? "rgba(168, 124, 144, 0.14)"
                : "rgba(148, 163, 184, 0.04)",
            drawOnChartArea: true,
            lineWidth: activeAxis === "wind" ? 1.0 : 0.45,
          },
          border: {
            color: "rgba(148, 163, 184, 0.14)",
          },
        },
        yCloud: {
          type: "linear",
          position: "right",
          min: 0,
          max: 100,
          ticks: {
            color: "#c8d1da",
            font: {
              size: 11,
              weight: 500,
            },
          },
          title: {
            display: false,
          },
          grid: {
            color:
              activeAxis === "cloud"
                ? "rgba(200, 209, 218, 0.14)"
                : "rgba(148, 163, 184, 0.04)",
            drawOnChartArea: true,
            lineWidth: activeAxis === "cloud" ? 1.0 : 0.45,
          },
          border: {
            color: "rgba(148, 163, 184, 0.14)",
          },
        },
      },
    }),
    [activeAxis]
  );

  const dayButtons = [labelsText.today, labelsText.tomorrow, labelsText.dayPlus2];
  const mobileToggleLabel =
    lang === "cs"
      ? mobileGraphOpen
        ? "Skrýt graf"
        : "Zobrazit graf"
      : mobileGraphOpen
      ? "Hide chart"
      : "Show chart";

  return (
    <div className="weatherChartRoot">
      <div className="chartToolbar">
        <div className="chartDayTabsWrap">
          <div className="chartDayTabs">
            {dayButtons.map((label, i) => (
              <button
                key={label}
                type="button"
                className={`chartDayButton ${selectedDay === i ? "active" : ""}`}
                onClick={() => {
                  setSelectedDay(i);
                  setHoveredPointIndex(null);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="chartMeta">
          <span className="chartMarker currentHour">
            {labelsText.currentForecastHour}: {pickLabels[safeActiveIndex] ?? "-"}
          </span>
          <span className="chartMarker sunrise">
            {labelsText.flightDayStart}: {flightDayStartLabel}
          </span>
          <span className="chartMarker sunset">
            {labelsText.flightDayEnd}: {flightDayEndLabel}
          </span>
        </div>
      </div>

      <div className="chartReadoutCard">
        <div className="chartReadoutHeader">
          <strong>{labelsText.currentForecastHour}:</strong> {pickLabels[safeActiveIndex] ?? "-"}
        </div>

        <div className="chartReadoutGrid">
          <div className="chartReadoutItem chartReadoutTemp">
            <span className="chartReadoutLabel">
              {labelsText.temperature} / {labelsText.dewPoint}
            </span>
            <span className="chartReadoutValue">
              {activeTemperature.toFixed(1)} °C / {activeDewPoint.toFixed(1)} °C
            </span>
          </div>

          <div className="chartReadoutItem chartReadoutHeight">
            <span className="chartReadoutLabel">{labelsText.cloudBase}</span>
            <span className="chartReadoutValue">{Math.round(activeLcl)} m AGL</span>
          </div>

          <div className="chartReadoutItem chartReadoutThermal">
            <span className="chartReadoutLabel">{labelsText.thermal}</span>
            <span className="chartReadoutValue">{activeThermal.toFixed(1)} m/s</span>
          </div>

          <div className="chartReadoutItem chartReadoutWindSurface">
            <span className="chartReadoutLabel">{labelsText.surfaceWind}</span>
            <span className="chartReadoutValue">
              {Math.round(activeWindSurface)} kt {dirToCardinal(activeWindSurfaceDir)} ({formatDir(activeWindSurfaceDir)})
            </span>
          </div>

          <div className="chartReadoutItem chartReadoutWind850">
            <span className="chartReadoutLabel">{labelsText.wind850}</span>
            <span className="chartReadoutValue">
              {Math.round(activeWind850)} kt {dirToCardinal(activeWind850Dir)} ({formatDir(activeWind850Dir)})
            </span>
          </div>

          <div className="chartReadoutItem chartReadoutWind700">
            <span className="chartReadoutLabel">{labelsText.wind700}</span>
            <span className="chartReadoutValue">
              {Math.round(activeWind700)} kt {dirToCardinal(activeWind700Dir)} ({formatDir(activeWind700Dir)})
            </span>
          </div>

          <div className="chartReadoutItem chartReadoutCloud">
            <span className="chartReadoutLabel">
              {labelsText.cloudLow} / {labelsText.cloudMid} / {labelsText.cloudHigh}
            </span>
            <span className="chartReadoutValue">
              {Math.round(activeCloudLow)} % / {Math.round(activeCloudMid)} % /{" "}
              {Math.round(activeCloudHigh)} %
            </span>
          </div>
        </div>
      </div>

      {isMobile ? (
        <div className="chartMobileToggleRow">
          <button
            type="button"
            className={`chartToggleButton ${mobileGraphOpen ? "active" : ""}`}
            onClick={() => setMobileGraphOpen((current) => !current)}
          >
            {mobileToggleLabel}
          </button>
        </div>
      ) : null}

      {!isMobile || mobileGraphOpen ? (
        <>
          <div className="chartAxisLegendBlock">
            <div className="chartAxisLegendTitle">{labelsText.axesLegendTitle}</div>

            <div className="chartAxisLegendTop">
              <button
                type="button"
                className={`axisLegend axisTemp ${activeAxis === "temp" ? "isSelected" : ""}`}
                onClick={() => setSelectedAxis((prev) => (prev === "temp" ? null : "temp"))}
                onMouseEnter={() => setHoveredAxis("temp")}
                onMouseLeave={() => {
                  if (!selectedAxis) setHoveredAxis(null);
                }}
              >
                {labelsText.temperature} / {labelsText.dewPoint} (°C)
              </button>

              <button
                type="button"
                className={`axisLegend axisThermal ${activeAxis === "thermal" ? "isSelected" : ""}`}
                onClick={() => setSelectedAxis((prev) => (prev === "thermal" ? null : "thermal"))}
                onMouseEnter={() => setHoveredAxis("thermal")}
                onMouseLeave={() => {
                  if (!selectedAxis) setHoveredAxis(null);
                }}
              >
                {labelsText.thermal} (m/s)
              </button>

              <button
                type="button"
                className={`axisLegend axisWind ${activeAxis === "wind" ? "isSelected" : ""}`}
                onClick={() => setSelectedAxis((prev) => (prev === "wind" ? null : "wind"))}
                onMouseEnter={() => setHoveredAxis("wind")}
                onMouseLeave={() => {
                  if (!selectedAxis) setHoveredAxis(null);
                }}
              >
                {labelsText.surfaceWind} / {labelsText.wind850} / {labelsText.wind700} (kt)
              </button>

              <button
                type="button"
                className={`axisLegend axisHeight ${activeAxis === "height" ? "isSelected" : ""}`}
                onClick={() => setSelectedAxis((prev) => (prev === "height" ? null : "height"))}
                onMouseEnter={() => setHoveredAxis("height")}
                onMouseLeave={() => {
                  if (!selectedAxis) setHoveredAxis(null);
                }}
              >
                {labelsText.cloudBase} (m AGL)
              </button>

              <button
                type="button"
                className={`axisLegend axisCloud ${activeAxis === "cloud" ? "isSelected" : ""}`}
                onClick={() => setSelectedAxis((prev) => (prev === "cloud" ? null : "cloud"))}
                onMouseEnter={() => setHoveredAxis("cloud")}
                onMouseLeave={() => {
                  if (!selectedAxis) setHoveredAxis(null);
                }}
              >
                {labelsText.cloudLow} / {labelsText.cloudMid} / {labelsText.cloudHigh} (%)
              </button>
            </div>
          </div>

          <div
            className="chartCanvasWrap"
            onMouseLeave={() => setHoveredPointIndex(null)}
            onTouchEnd={() => setHoveredPointIndex(null)}
          >
            <Line data={chartData} options={options} plugins={[windDirectionPlugin]} />
          </div>

          <details className="windBarbLegend" style={{ marginTop: "12px" }}>
            <summary style={{
              cursor: "pointer",
              fontSize: "0.82rem",
              color: "#7a96b2",
              userSelect: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              listStyle: "none",
              padding: "4px 0",
            }}>
              <span style={{
                width: "14px", height: "14px",
                border: "1px solid #4a6a8a",
                borderRadius: "3px",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: "10px", color: "#5a8ab0",
              }}>?</span>
              {lang === "cs" ? "Legenda větrných barbů (WMO)" : "Wind barb legend (WMO)"}
            </summary>

            <div style={{
              marginTop: "10px",
              padding: "12px 14px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "10px",
              border: "1px solid rgba(148,163,184,0.1)",
            }}>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "4px 2px",
              }}>
                {BARB_LEGEND_ITEMS.map((spd) => (
                  <div key={spd} style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "2px",
                    minWidth: "50px",
                    padding: "6px 4px",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "8px",
                  }}>
                    <WindBarbSvg spd={spd} color="#8ab4d4" />
                    <span style={{ fontSize: "0.72rem", color: "#7a96b2", fontVariantNumeric: "tabular-nums" }}>
                      {spd === 0 ? (lang === "cs" ? "klid" : "calm") : `${spd} kt`}
                    </span>
                  </div>
                ))}
              </div>
              <p style={{
                margin: "10px 0 0",
                fontSize: "0.75rem",
                color: "#5a7a96",
                lineHeight: 1.5,
              }}>
                {lang === "cs"
                  ? "Hůlka míří ke zdroji větru. Každý paprsek = 10 kt · půl paprsek = 5 kt · plný klín = 50 kt."
                  : "Staff points toward wind origin. Full barb = 10 kt · half barb = 5 kt · pennant = 50 kt."}
              </p>
            </div>
          </details>
        </>
      ) : null}
    </div>
  );
}