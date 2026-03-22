"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  type TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";

const hoverVerticalLinePlugin = {
  id: "hoverVerticalLine",
  afterDraw: (chart: any) => {
    if (!chart?.tooltip?._active?.length) return;

    const ctx = chart.ctx;
    const activePoint = chart.tooltip._active[0];
    const x = activePoint.element.x;
    const topY = chart.chartArea.top;
    const bottomY = chart.chartArea.bottom;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, topY);
    ctx.lineTo(x, bottomY);
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.setLineDash([5, 4]);
    ctx.stroke();
    ctx.restore();
  },
};

const vfrWindowPlugin = {
  id: "vfrWindow",
  beforeDatasetsDraw: (chart: any, _args: any, pluginOptions: any) => {
    const sunriseIndex = pluginOptions?.sunriseIndex ?? -1;
    const sunsetIndex = pluginOptions?.sunsetIndex ?? -1;

    if (sunriseIndex < 0 || sunsetIndex < 0) return;

    const { ctx, chartArea, scales } = chart;
    const xScale = scales?.x;
    if (!xScale || !chartArea) return;

    const left = xScale.getPixelForValue(sunriseIndex);
    const right = xScale.getPixelForValue(sunsetIndex);

    const x1 = Math.min(left, right);
    const x2 = Math.max(left, right);

    ctx.save();
    ctx.fillStyle = "rgba(250, 204, 21, 0.08)";
    ctx.fillRect(x1, chartArea.top, x2 - x1, chartArea.bottom - chartArea.top);
    ctx.restore();
  },
};

const sunMarkersPlugin = {
  id: "sunMarkers",
  afterDraw: (chart: any, _args: any, pluginOptions: any) => {
    const { ctx, chartArea, scales } = chart;
    const xScale = scales?.x;
    if (!xScale || !chartArea) return;

    const drawMarker = (
      index: number,
      color: string,
      label?: string,
      yOffset = -10
    ) => {
      if (index < 0) return;

      const x = xScale.getPixelForValue(index);

      ctx.save();

      ctx.beginPath();
      ctx.moveTo(x, chartArea.top);
      ctx.lineTo(x, chartArea.bottom);
      ctx.lineWidth = 1;
      ctx.strokeStyle = color;
      ctx.setLineDash([3, 3]);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, chartArea.top + 8, 3.5, 0, Math.PI * 2);
      ctx.fill();

      if (label) {
        ctx.font = "11px sans-serif";
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.fillText(label, x, chartArea.top + yOffset);
      }

      ctx.restore();
    };

    drawMarker(
      pluginOptions?.sunriseIndex ?? -1,
      "rgba(251,191,36,0.95)",
      pluginOptions?.sunriseLabel ?? "Sunrise"
    );

    drawMarker(
      pluginOptions?.sunsetIndex ?? -1,
      "rgba(148,163,184,0.95)",
      pluginOptions?.sunsetLabel ?? "Sunset"
    );
  },
};

const currentHourPlugin = {
  id: "currentHourLine",
  afterDraw: (chart: any, _args: any, pluginOptions: any) => {
    const currentIndex = pluginOptions?.currentIndexInDay ?? -1;
    if (currentIndex < 0) return;

    const { ctx, chartArea, scales } = chart;
    const xScale = scales?.x;
    if (!xScale || !chartArea) return;

    const x = xScale.getPixelForValue(currentIndex);

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(x, chartArea.top);
    ctx.lineTo(x, chartArea.bottom);
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = "rgba(255,99,132,0.9)";
    ctx.setLineDash([7, 5]);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(255,99,132,0.95)";
    ctx.beginPath();
    ctx.arc(x, chartArea.top + 10, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },
};

function degToArrow(deg: number) {
  if (deg >= 337 || deg < 22) return "↑";
  if (deg < 67) return "↗";
  if (deg < 112) return "→";
  if (deg < 157) return "↘";
  if (deg < 202) return "↓";
  if (deg < 247) return "↙";
  if (deg < 292) return "←";
  if (deg < 337) return "↖";
  return "·";
}

const windDirectionRowsPlugin = {
  id: "windDirectionRows",
  afterDraw: (chart: any, _args: any, pluginOptions: any) => {
    const { ctx, chartArea, scales } = chart;
    const xScale = scales?.x;
    if (!xScale || !chartArea) return;

    const windSurfaceDir: number[] = pluginOptions?.windSurfaceDir ?? [];
    const wind850Dir: number[] = pluginOptions?.wind850Dir ?? [];
    const wind700Dir: number[] = pluginOptions?.wind700Dir ?? [];
    const showEvery = pluginOptions?.showEvery ?? 2;
    const sfcLabel = pluginOptions?.sfcLabel ?? "SFC";

    const drawRow = (
      dirs: number[],
      y: number,
      label: string,
      color: string
    ) => {
      if (!dirs.length) return;

      ctx.save();
      ctx.font = "10px sans-serif";
      ctx.fillStyle = color;
      ctx.textAlign = "left";
      ctx.fillText(label, chartArea.left + 4, y);

      ctx.textAlign = "center";
      for (let i = 0; i < dirs.length; i++) {
        if (i % showEvery !== 0) continue;
        const x = xScale.getPixelForValue(i);
        const arrow = degToArrow(dirs[i] ?? 0);
        ctx.fillText(arrow, x, y);
      }
      ctx.restore();
    };

    drawRow(
      windSurfaceDir,
      chartArea.top + 14,
      sfcLabel,
      "rgba(239,68,68,0.95)"
    );

    drawRow(
      wind850Dir,
      chartArea.top + 28,
      "850",
      "rgba(167,139,250,0.95)"
    );

    drawRow(
      wind700Dir,
      chartArea.top + 42,
      "700",
      "rgba(244,114,182,0.95)"
    );
  },
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  hoverVerticalLinePlugin,
  vfrWindowPlugin,
  sunMarkersPlugin,
  currentHourPlugin,
  windDirectionRowsPlugin
);

type WeatherChartProps = {
  data: {
    labels: string[];
    lcl: number[];
    thermal: number[];
    temperature: number[];
    windSurface: number[];
    wind850: number[];
    wind700: number[];
    windSurfaceDir: number[];
    wind850Dir: number[];
    wind700Dir: number[];
    sunrise: string[];
    sunset: string[];
    currentIndex: number;
  };
  lang?: "cs" | "en";
  labelsText?: {
    today: string;
    tomorrow: string;
    dayPlus2: string;
    sunrise: string;
    sunset: string;
    currentForecastHour: string;
    cloudBase: string;
    thermal: string;
    temperature: string;
    surfaceWind: string;
    wind850: string;
    wind700: string;
  };
};

function findNearestLabelIndex(labels: string[], timeHHMM: string) {
  if (!timeHHMM) return -1;

  const [targetH, targetM] = timeHHMM.split(":").map(Number);
  const targetMinutes = targetH * 60 + targetM;

  let bestIndex = -1;
  let bestDiff = Infinity;

  labels.forEach((label, index) => {
    const [h, m] = label.split(":").map(Number);
    const minutes = h * 60 + m;
    const diff = Math.abs(minutes - targetMinutes);

    if (diff < bestDiff) {
      bestDiff = diff;
      bestIndex = index;
    }
  });

  return bestIndex;
}

function maxOf(values: number[], fallback: number) {
  const valid = values.filter((v) => Number.isFinite(v));
  if (!valid.length) return fallback;
  return Math.max(...valid);
}

export default function WeatherChart({
  data,
  lang = "en",
  labelsText,
}: WeatherChartProps) {
  const ui = labelsText ?? {
    today: lang === "cs" ? "Dnes" : "Today",
    tomorrow: lang === "cs" ? "Zítra" : "Tomorrow",
    dayPlus2: lang === "cs" ? "Pozítří" : "Day +2",
    sunrise: lang === "cs" ? "Východ slunce" : "Sunrise",
    sunset: lang === "cs" ? "Západ slunce" : "Sunset",
    currentForecastHour:
      lang === "cs" ? "Aktuální hodina předpovědi" : "Current forecast hour",
    cloudBase: lang === "cs" ? "Základna" : "Cloud base",
    thermal: lang === "cs" ? "Termika" : "Thermal strength",
    temperature: lang === "cs" ? "Teplota" : "Temperature",
    surfaceWind: lang === "cs" ? "Přízemní vítr" : "Surface wind",
    wind850: lang === "cs" ? "Vítr 850 hPa" : "Wind 850 hPa",
    wind700: lang === "cs" ? "Vítr 700 hPa" : "Wind 700 hPa",
  };

  const totalDays = Math.max(1, Math.ceil(data.labels.length / 24));
  const currentDayFromIndex = Math.floor(data.currentIndex / 24);
  const safeInitialDay = Math.max(
    0,
    Math.min(totalDays - 1, currentDayFromIndex)
  );

  const [selectedDay, setSelectedDay] = useState(safeInitialDay);
  const [isMobile, setIsMobile] = useState(false);

  const [visible, setVisible] = useState({
    lcl: true,
    thermal: true,
    temperature: true,
    windSurface: true,
    wind850: true,
    wind700: true,
  });

  useEffect(() => {
    setSelectedDay(safeInitialDay);
  }, [safeInitialDay]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const cloudColor = "#60a5fa";
  const thermalColor = "#22c55e";
  const temperatureColor = "#fbbf24";
  const windSurfaceColor = "#ef4444";
  const wind850Color = "#a78bfa";
  const wind700Color = "#f472b6";
  const inactiveColor = "#64748b";

  const start = selectedDay * 24;
  const end = start + 24;

  const dayLabels = [ui.today, ui.tomorrow, ui.dayPlus2];

  const sliced = useMemo(() => {
    return {
      labels: data.labels.slice(start, end),
      lcl: data.lcl.slice(start, end),
      thermal: data.thermal.slice(start, end),
      temperature: data.temperature.slice(start, end),
      windSurface: data.windSurface.slice(start, end),
      wind850: data.wind850.slice(start, end),
      wind700: data.wind700.slice(start, end),
      windSurfaceDir: data.windSurfaceDir.slice(start, end),
      wind850Dir: data.wind850Dir.slice(start, end),
      wind700Dir: data.wind700Dir.slice(start, end),
    };
  }, [data, start, end]);

  const sunriseTime =
    data.sunrise[selectedDay]?.split("T")[1]?.slice(0, 5) ?? "";
  const sunsetTime =
    data.sunset[selectedDay]?.split("T")[1]?.slice(0, 5) ?? "";

  const sunriseIndex = findNearestLabelIndex(sliced.labels, sunriseTime);
  const sunsetIndex = findNearestLabelIndex(sliced.labels, sunsetTime);

  const currentIndexInDay =
    selectedDay === currentDayFromIndex ? data.currentIndex % 24 : -1;

  const lclMax = Math.max(1200, Math.ceil(maxOf(sliced.lcl, 1200) / 200) * 200);
  const thermalMax = Math.max(
    2.5,
    Math.ceil(maxOf(sliced.thermal, 2.5) / 0.5) * 0.5
  );
  const tempMin = Math.floor(Math.min(...sliced.temperature, 0) - 2);
  const tempMax = Math.ceil(Math.max(...sliced.temperature, 20) + 2);
  const windMax = Math.max(
    15,
    Math.ceil(
      maxOf(
        [...sliced.windSurface, ...sliced.wind850, ...sliced.wind700],
        15
      ) / 5
    ) * 5
  );

  const chartData = {
    labels: sliced.labels,
    datasets: [
      {
        label: ui.cloudBase,
        data: sliced.lcl,
        hidden: !visible.lcl,
        borderColor: cloudColor,
        backgroundColor: "rgba(96,165,250,0.18)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: isMobile ? 1 : 2,
        pointHoverRadius: 4,
        yAxisID: "y",
      },
      {
        label: ui.thermal,
        data: sliced.thermal,
        hidden: !visible.thermal,
        borderColor: thermalColor,
        backgroundColor: "rgba(34,197,94,0.18)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: isMobile ? 1 : 2,
        pointHoverRadius: 4,
        yAxisID: "y1",
      },
      {
        label: ui.temperature,
        data: sliced.temperature,
        hidden: !visible.temperature,
        borderColor: temperatureColor,
        backgroundColor: "rgba(251,191,36,0.18)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: isMobile ? 1 : 2,
        pointHoverRadius: 4,
        yAxisID: "y2",
      },
      {
        label: ui.surfaceWind,
        data: sliced.windSurface,
        hidden: !visible.windSurface,
        borderColor: windSurfaceColor,
        backgroundColor: "rgba(239,68,68,0.20)",
        borderWidth: 2.5,
        tension: 0.3,
        pointRadius: isMobile ? 1 : 2,
        pointHoverRadius: 4,
        yAxisID: "y3",
      },
      {
        label: ui.wind850,
        data: sliced.wind850,
        hidden: !visible.wind850,
        borderColor: wind850Color,
        backgroundColor: "rgba(167,139,250,0.18)",
        borderDash: [6, 4],
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 1,
        pointHoverRadius: 4,
        yAxisID: "y3",
      },
      {
        label: ui.wind700,
        data: sliced.wind700,
        hidden: !visible.wind700,
        borderColor: wind700Color,
        backgroundColor: "rgba(244,114,182,0.18)",
        borderDash: [6, 4],
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 1,
        pointHoverRadius: 4,
        yAxisID: "y3",
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    normalized: true,
    layout: {
      padding: {
        top: isMobile ? 46 : 58,
        right: isMobile ? 10 : 18,
        left: isMobile ? 10 : 14,
        bottom: isMobile ? 2 : 4,
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(7,18,38,0.96)",
        titleColor: "#ffffff",
        bodyColor: "#e5eefc",
        borderColor: "rgba(255,255,255,0.12)",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          afterTitle: function (items: TooltipItem<"line">[]) {
            const index = items?.[0]?.dataIndex ?? 0;
            const dsfc = sliced.windSurfaceDir[index] ?? 0;
            const d850 = sliced.wind850Dir[index] ?? 0;
            const d700 = sliced.wind700Dir[index] ?? 0;

            return [
              `${ui.surfaceWind}: ${degToArrow(dsfc)} ${Math.round(dsfc)}°`,
              `850: ${degToArrow(d850)} ${Math.round(d850)}°`,
              `700: ${degToArrow(d700)} ${Math.round(d700)}°`,
            ];
          },
          label: function (context: TooltipItem<"line">) {
            const label = context.dataset.label ?? "";
            const value = context.parsed.y;

            if (label === ui.cloudBase) return `${label}: ${value} m`;
            if (label === ui.thermal) return `${label}: ${(value ?? 0).toFixed(1)} m/s`;
            if (label === ui.temperature) return `${label}: ${value} °C`;
            if (
              label === ui.surfaceWind ||
              label === ui.wind850 ||
              label === ui.wind700
            ) {
              return `${label}: ${value} kt`;
            }

            return `${label}: ${value}`;
          },
        },
        itemSort: function (a: TooltipItem<"line">, b: TooltipItem<"line">) {
          const order: Record<string, number> = {
            [ui.temperature]: 0,
            [ui.cloudBase]: 1,
            [ui.thermal]: 2,
            [ui.surfaceWind]: 3,
            [ui.wind850]: 4,
            [ui.wind700]: 5,
          };

          return (
            (order[a.dataset.label ?? ""] ?? 99) -
            (order[b.dataset.label ?? ""] ?? 99)
          );
        },
      },
      vfrWindow: {
        sunriseIndex,
        sunsetIndex,
      },
      sunMarkers: {
        sunriseIndex,
        sunsetIndex,
        sunriseLabel: ui.sunrise,
        sunsetLabel: ui.sunset,
      },
      currentHourLine: {
        currentIndexInDay,
      },
      windDirectionRows: {
        windSurfaceDir: visible.windSurface ? sliced.windSurfaceDir : [],
        wind850Dir: visible.wind850 ? sliced.wind850Dir : [],
        wind700Dir: visible.wind700 ? sliced.wind700Dir : [],
        showEvery: isMobile ? 3 : 2,
        sfcLabel: lang === "cs" ? "PŘÍZ" : "SFC",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#c7d2fe",
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: isMobile ? 8 : 12,
          font: {
            size: isMobile ? 9 : 11,
            weight: 500,
          },
        },
        grid: {
          color: "rgba(255,255,255,0.06)",
        },
        border: {
          color: "rgba(255,255,255,0.12)",
        },
      },
      y: {
        type: "linear",
        position: "left",
        min: 0,
        max: lclMax,
        ticks: {
          color: cloudColor,
          stepSize: lclMax <= 1600 ? 200 : 400,
          font: {
            size: isMobile ? 9 : 11,
          },
        },
        grid: {
          color: "rgba(255,255,255,0.08)",
        },
        border: {
          color: cloudColor,
        },
      },
      y1: {
        type: "linear",
        position: "right",
        min: 0,
        max: thermalMax,
        ticks: {
          color: thermalColor,
          stepSize: 0.5,
          font: {
            size: isMobile ? 9 : 11,
          },
        },
        grid: {
          drawOnChartArea: false,
        },
        border: {
          color: thermalColor,
        },
      },
      y2: {
        type: "linear",
        position: "right",
        display: false,
        min: tempMin,
        max: tempMax,
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
        grid: {
          display: false,
          drawOnChartArea: false,
        },
      },
      y3: {
        type: "linear",
        position: "right",
        offset: true,
        min: 0,
        max: windMax,
        ticks: {
          color: windSurfaceColor,
          stepSize: 5,
          font: {
            size: isMobile ? 9 : 11,
          },
        },
        grid: {
          drawOnChartArea: false,
        },
        border: {
          color: windSurfaceColor,
        },
      },
    },
  };

  const legendItemStyle = (
    active: boolean,
    color: string
  ): CSSProperties => ({
    color: active ? color : inactiveColor,
    cursor: "pointer",
    userSelect: "none",
    textDecoration: active ? "none" : "line-through",
    opacity: active ? 1 : 0.6,
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "14px",
          flexWrap: "wrap",
        }}
      >
        {dayLabels.slice(0, totalDays).map((label, index) => (
          <button
            key={label}
            onClick={() => setSelectedDay(index)}
            style={{
              padding: isMobile ? "6px 10px" : "8px 12px",
              borderRadius: "10px",
              border:
                selectedDay === index
                  ? "1px solid rgba(255,255,255,0.28)"
                  : "1px solid rgba(255,255,255,0.12)",
              background:
                selectedDay === index
                  ? "rgba(255,255,255,0.10)"
                  : "rgba(255,255,255,0.04)",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: isMobile ? "0.78rem" : "0.9rem",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "10px",
          marginBottom: "10px",
          color: "#cbd5e1",
          fontSize: isMobile ? "0.72rem" : "0.82rem",
        }}
      >
        <span style={{ color: cloudColor }}>{ui.cloudBase} (m)</span>
        <span style={{ color: thermalColor }}>{ui.thermal} (m/s)</span>
        <span style={{ color: windSurfaceColor }}>{ui.surfaceWind} (kt)</span>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: isMobile ? "10px" : "14px",
          marginBottom: "16px",
          fontSize: isMobile ? "0.75rem" : "0.86rem",
          color: "#e5eefc",
          lineHeight: 1.35,
        }}
      >
        <span
          onClick={() => setVisible((v) => ({ ...v, lcl: !v.lcl }))}
          style={legendItemStyle(visible.lcl, cloudColor)}
        >
          ● {ui.cloudBase}
        </span>

        <span
          onClick={() => setVisible((v) => ({ ...v, thermal: !v.thermal }))}
          style={legendItemStyle(visible.thermal, thermalColor)}
        >
          ● {ui.thermal}
        </span>

        <span
          onClick={() =>
            setVisible((v) => ({ ...v, temperature: !v.temperature }))
          }
          style={legendItemStyle(visible.temperature, temperatureColor)}
        >
          ● {ui.temperature}
        </span>

        <span
          onClick={() =>
            setVisible((v) => ({ ...v, windSurface: !v.windSurface }))
          }
          style={legendItemStyle(visible.windSurface, windSurfaceColor)}
        >
          ● {ui.surfaceWind}
        </span>

        <span
          onClick={() => setVisible((v) => ({ ...v, wind850: !v.wind850 }))}
          style={legendItemStyle(visible.wind850, wind850Color)}
        >
          ● {ui.wind850}
        </span>

        <span
          onClick={() => setVisible((v) => ({ ...v, wind700: !v.wind700 }))}
          style={legendItemStyle(visible.wind700, wind700Color)}
        >
          ● {ui.wind700}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: isMobile ? "10px" : "16px",
          marginBottom: isMobile ? "20px" : "24px",
          flexWrap: "wrap",
          color: "#cbd5e1",
          fontSize: isMobile ? "0.76rem" : "0.9rem",
          lineHeight: 1.35,
        }}
      >
        <span>☀ {ui.sunrise}: {sunriseTime || "-"}</span>
        <span>🌙 {ui.sunset}: {sunsetTime || "-"}</span>
        {currentIndexInDay >= 0 && (
          <span>📍 {ui.currentForecastHour}: {sliced.labels[currentIndexInDay]}</span>
        )}
      </div>

      <div
        style={{
          width: "100%",
          height: isMobile ? "280px" : "400px",
        }}
      >
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}