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
  type TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";

const hoverVerticalLinePlugin = {
  id: "hoverVerticalLine",
  afterDraw: (chart: any) => {
    if (chart.tooltip?._active?.length) {
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
    }
  },
};

const vfrWindowPlugin = {
  id: "vfrWindow",
  beforeDatasetsDraw: (chart: any, _args: any, pluginOptions: any) => {
    const sunriseIndex = pluginOptions?.sunriseIndex ?? -1;
    const sunsetIndex = pluginOptions?.sunsetIndex ?? -1;

    if (sunriseIndex < 0 || sunsetIndex < 0) return;

    const { ctx, chartArea, scales } = chart;
    const xScale = scales.x;
    if (!xScale) return;

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
    const xScale = scales.x;

    if (!xScale) return;

    const drawMarker = (
      index: number,
      color: string,
      label?: string,
      yOffset = -8
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
      "rgba(251,191,36,0.9)",
      "Sunrise"
    );

    drawMarker(
      pluginOptions?.sunsetIndex ?? -1,
      "rgba(148,163,184,0.95)",
      "Sunset"
    );
  },
};

const currentHourPlugin = {
  id: "currentHourLine",
  afterDraw: (chart: any, _args: any, pluginOptions: any) => {
    const currentIndex = pluginOptions?.currentIndexInDay ?? -1;
    if (currentIndex < 0) return;

    const { ctx, chartArea, scales } = chart;
    const xScale = scales.x;
    if (!xScale) return;

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
    const xScale = scales.x;
    if (!xScale) return;

    const wind850Dir: number[] = pluginOptions?.wind850Dir ?? [];
    const wind700Dir: number[] = pluginOptions?.wind700Dir ?? [];
    const showEvery = pluginOptions?.showEvery ?? 2;

    const drawRow = (
      dirs: number[],
      y: number,
      label: string,
      color: string
    ) => {
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
      wind850Dir,
      chartArea.top + 14,
      "●",
      "rgba(167,139,250,0.95)"
    );

    drawRow(
      wind700Dir,
      chartArea.top + 26,
      "●",
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
    wind850: number[];
    wind700: number[];
    wind850Dir: number[];
    wind700Dir: number[];
    sunrise: string[];
    sunset: string[];
    currentIndex: number;
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

export default function WeatherChart({ data }: WeatherChartProps) {
  const totalDays = Math.max(1, Math.ceil(data.labels.length / 24));
  const currentDayFromIndex = Math.floor(data.currentIndex / 24);
  const safeInitialDay = Math.max(0, Math.min(totalDays - 1, currentDayFromIndex));

  const [selectedDay, setSelectedDay] = useState(safeInitialDay);
  const [isMobile, setIsMobile] = useState(false);

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
  const wind850Color = "#a78bfa";
  const wind700Color = "#f472b6";

  const start = selectedDay * 24;
  const end = start + 24;

  const dayLabels = ["Today", "Tomorrow", "Day +2"];

  const sliced = useMemo(() => {
    return {
      labels: data.labels.slice(start, end),
      lcl: data.lcl.slice(start, end),
      thermal: data.thermal.slice(start, end),
      temperature: data.temperature.slice(start, end),
      wind850: data.wind850.slice(start, end),
      wind700: data.wind700.slice(start, end),
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

  const chartData = {
    labels: sliced.labels,
    datasets: [
      {
        label: "Cloud base",
        data: sliced.lcl,
        borderColor: cloudColor,
        backgroundColor: "rgba(96,165,250,0.18)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: isMobile ? 1 : 2,
        pointHoverRadius: 4,
        yAxisID: "y",
      },
      {
        label: "Thermal strength",
        data: sliced.thermal,
        borderColor: thermalColor,
        backgroundColor: "rgba(34,197,94,0.18)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: isMobile ? 1 : 2,
        pointHoverRadius: 4,
        yAxisID: "y1",
      },
      {
        label: "Temperature",
        data: sliced.temperature,
        borderColor: temperatureColor,
        backgroundColor: "rgba(251,191,36,0.18)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: isMobile ? 1 : 2,
        pointHoverRadius: 4,
        yAxisID: "y2",
      },
      {
        label: "Wind 850 hPa",
        data: sliced.wind850,
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
        label: "Wind 700 hPa",
        data: sliced.wind700,
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
    layout: {
      padding: {
        top: isMobile ? 20 : 26,
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#e5eefc",
          usePointStyle: true,
          pointStyle: "circle",
          padding: isMobile ? 10 : 16,
          boxWidth: 8,
          boxHeight: 8,
          font: {
            size: isMobile ? 10 : 12,
            weight: 500,
          },
        },
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
            const d850 = sliced.wind850Dir[index] ?? 0;
            const d700 = sliced.wind700Dir[index] ?? 0;

            return [
              `850 dir: ${degToArrow(d850)} ${Math.round(d850)}°`,
              `700 dir: ${degToArrow(d700)} ${Math.round(d700)}°`,
            ];
          },
          label: function (context: TooltipItem<"line">) {
            const label = context.dataset.label ?? "";
            const value = context.parsed.y;

            if (label === "Cloud base") {
              return `${label}: ${value} m`;
            }

            if (label === "Thermal strength") {
              return `${label}: ${(value ?? 0).toFixed(1)} m/s`;
            }

            if (label === "Temperature") {
              return `${label}: ${value} °C`;
            }

            if (label === "Wind 850 hPa" || label === "Wind 700 hPa") {
              return `${label}: ${value} kt`;
            }

            return `${label}: ${value}`;
          },
        },
        itemSort: function (a: TooltipItem<"line">, b: TooltipItem<"line">) {
          const order: Record<string, number> = {
            Temperature: 0,
            "Cloud base": 1,
            "Thermal strength": 2,
            "Wind 850 hPa": 3,
            "Wind 700 hPa": 4,
          };

          const aOrder = order[a.dataset.label ?? ""] ?? 99;
          const bOrder = order[b.dataset.label ?? ""] ?? 99;

          return aOrder - bOrder;
        },
      },
      vfrWindow: {
        sunriseIndex,
        sunsetIndex,
      },
      sunMarkers: {
        sunriseIndex,
        sunsetIndex,
      },
      currentHourLine: {
        currentIndexInDay,
      },
      windDirectionRows: {
        wind850Dir: sliced.wind850Dir,
        wind700Dir: sliced.wind700Dir,
        showEvery: isMobile ? 3 : 2,
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
      },
      y: {
        type: "linear",
        position: "left",
        title: {
          display: false,
        },
        ticks: {
          color: cloudColor,
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
        title: {
          display: false,
        },
        ticks: {
          color: thermalColor,
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
        ticks: {
          display: false,
        },
        title: {
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
        title: {
          display: false,
        },
        ticks: {
          color: wind850Color,
          font: {
            size: isMobile ? 9 : 11,
          },
        },
        grid: {
          drawOnChartArea: false,
        },
        border: {
          color: wind850Color,
        },
      },
    },
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "12px",
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
          gap: isMobile ? "10px" : "16px",
          marginBottom: "10px",
          flexWrap: "wrap",
          color: "#cbd5e1",
          fontSize: isMobile ? "0.76rem" : "0.9rem",
          lineHeight: 1.3,
        }}
      >
        <span>☀ Sunrise: {sunriseTime || "-"}</span>
        <span>🌙 Sunset: {sunsetTime || "-"}</span>
        {currentIndexInDay >= 0 && (
          <span>📍 Current forecast hour: {sliced.labels[currentIndexInDay]}</span>
        )}
      </div>

      <div
        style={{
          width: "100%",
          height: isMobile ? "220px" : "320px",
        }}
      >
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}