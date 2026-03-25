"use client";

import { useMemo, useState } from "react";
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
  sunrise: string[];
  sunset: string[];
  currentIndex: number;
};

type Props = {
  lang: Lang;
  labelsText: LabelsText;
  data: ChartInputData;
};

function getDateKey(dateString: string) {
  const d = new Date(dateString);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatShortDay(dateString: string, lang: Lang) {
  return new Date(dateString).toLocaleDateString(
    lang === "cs" ? "cs-CZ" : "en-GB",
    {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    }
  );
}

export default function WeatherChart({ lang, labelsText, data }: Props) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [hoveredAxis, setHoveredAxis] = useState<string | null>(null);

  const dayKeys = useMemo(() => {
    return data.sunrise.map((s) => getDateKey(s));
  }, [data.sunrise]);

  const selectedDayKey = dayKeys[selectedDay] ?? dayKeys[0];

  const filteredIndices = useMemo(() => {
    return data.labels
      .map((_, i) => i)
      .filter((i) => {
        const src = data.sunrise[0]
          ? data.sunrise.find((_, idx) => {
              const dayStart = dayKeys[idx];
              const currentHourDate = data.sunrise[idx]
                ? getDateKey(data.sunrise[idx])
                : "";
              return dayStart === currentHourDate;
            })
          : null;

        return true;
      });
  }, [data.labels, data.sunrise, dayKeys]);

  const hourlyDateKeys = useMemo(() => {
    const expanded: string[] = [];
    let sunriseIndex = 0;

    for (let i = 0; i < data.labels.length; i++) {
      const sunriseRef = data.sunrise[Math.min(sunriseIndex, data.sunrise.length - 1)];
      expanded.push(getDateKey(sunriseRef));

      const currentHour = Number(data.labels[i].slice(0, 2));
      const nextHour = i < data.labels.length - 1 ? Number(data.labels[i + 1].slice(0, 2)) : null;

      if (nextHour !== null && nextHour < currentHour) {
        sunriseIndex += 1;
      }
    }

    return expanded;
  }, [data.labels, data.sunrise]);

  const visibleIndices = hourlyDateKeys
    .map((key, i) => ({ key, i }))
    .filter((item) => item.key === selectedDayKey)
    .map((item) => item.i);

  const pick = (arr: number[]) => visibleIndices.map((i) => arr[i]);
  const pickLabels = visibleIndices.map((i) => data.labels[i]);

  const currentVisibleIndex = visibleIndices.indexOf(data.currentIndex);

  const sunriseLabel = data.sunrise[selectedDay]
    ? new Date(data.sunrise[selectedDay]).toLocaleTimeString(
        lang === "cs" ? "cs-CZ" : "en-GB",
        { hour: "2-digit", minute: "2-digit" }
      )
    : "-";

  const sunsetLabel = data.sunset[selectedDay]
    ? new Date(data.sunset[selectedDay]).toLocaleTimeString(
        lang === "cs" ? "cs-CZ" : "en-GB",
        { hour: "2-digit", minute: "2-digit" }
      )
    : "-";

  const chartData = {
    labels: pickLabels,
    datasets: [
     {
  label: labelsText.temperature,
  data: pick(data.temperature),
  yAxisID: "yTemp",
  borderColor:
    hoveredAxis && hoveredAxis !== "temp"
      ? "rgba(251,191,36,0.28)"
      : "rgba(251,191,36,1)",
  tension: 0.3,
  pointRadius: 0,
  borderWidth: hoveredAxis === "temp" ? 3.6 : 2.5,
},
    {
  label: labelsText.dewPoint,
  data: pick(data.dewPoint),
  yAxisID: "yTemp",
  borderColor:
    hoveredAxis && hoveredAxis !== "temp"
      ? "rgba(56,189,248,0.28)"
      : "rgba(56,189,248,1)",
  tension: 0.3,
  pointRadius: 0,
  borderWidth: hoveredAxis === "temp" ? 3.1 : 2.2,
},
     {
  label: labelsText.cloudBase,
  data: pick(data.lcl),
  yAxisID: "yHeight",
  borderColor:
    hoveredAxis && hoveredAxis !== "height"
      ? "rgba(45,212,191,0.25)"
      : "rgba(45,212,191,1)",
  tension: 0.25,
  pointRadius: 0,
  borderWidth: hoveredAxis === "height" ? 3.6 : 2.4,
},
    {
  label: labelsText.thermal,
  data: pick(data.thermal),
  yAxisID: "yThermal",
  borderColor:
    hoveredAxis && hoveredAxis !== "thermal"
      ? "rgba(34,197,94,0.25)"
      : "rgba(34,197,94,1)",
  tension: 0.3,
  pointRadius: 0,
  borderWidth: hoveredAxis === "thermal" ? 3.5 : 2.4,
},
     {
  label: labelsText.surfaceWind,
  data: pick(data.windSurface),
  yAxisID: "yWind",
  borderColor:
    hoveredAxis && hoveredAxis !== "wind"
      ? "rgba(244,114,182,0.22)"
      : "rgba(244,114,182,1)",
  tension: 0.25,
  pointRadius: 0,
  borderWidth: hoveredAxis === "wind" ? 3.1 : 2,
},
     {
  label: labelsText.wind850,
  data: pick(data.wind850),
  yAxisID: "yWind",
  borderColor:
    hoveredAxis && hoveredAxis !== "wind"
      ? "rgba(168,85,247,0.22)"
      : "rgba(168,85,247,1)",
  tension: 0.25,
  pointRadius: 0,
  borderWidth: hoveredAxis === "wind" ? 3.1 : 2,
},
      {
  label: labelsText.wind700,
  data: pick(data.wind700),
  yAxisID: "yWind",
  borderColor:
    hoveredAxis && hoveredAxis !== "wind"
      ? "rgba(239,68,68,0.22)"
      : "rgba(239,68,68,1)",
  tension: 0.25,
  pointRadius: 0,
  borderWidth: hoveredAxis === "wind" ? 3.1 : 2,
},
     {
  label: labelsText.cloudLow,
  data: pick(data.cloudLow),
  yAxisID: "yCloud",
  borderColor:
    hoveredAxis && hoveredAxis !== "cloud"
      ? "rgba(255,255,255,0.18)"
      : "rgba(255,255,255,0.78)",
  borderDash: [2, 2],
  tension: 0.25,
  pointRadius: 0,
  borderWidth: hoveredAxis === "cloud" ? 2.2 : 1.5,
},
    {
  label: labelsText.cloudMid,
  data: pick(data.cloudMid),
  yAxisID: "yCloud",
  borderColor:
    hoveredAxis && hoveredAxis !== "cloud"
      ? "rgba(148,163,184,0.18)"
      : "rgba(148,163,184,0.95)",
  borderDash: [6, 3],
  tension: 0.25,
  pointRadius: 0,
  borderWidth: hoveredAxis === "cloud" ? 2.2 : 1.5,
},
    {
  label: labelsText.cloudHigh,
  data: pick(data.cloudHigh),
  yAxisID: "yCloud",
  borderColor:
    hoveredAxis && hoveredAxis !== "cloud"
      ? "rgba(99,102,241,0.18)"
      : "rgba(99,102,241,0.95)",
  borderDash: [10, 4],
  tension: 0.25,
  pointRadius: 0,
  borderWidth: hoveredAxis === "cloud" ? 2.2 : 1.5,
},
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        labels: {
          color: "#e2e8f0",
          boxWidth: 14,
        },
      },
      tooltip: {
        backgroundColor: "rgba(15,23,42,0.96)",
        titleColor: "#f8fafc",
        bodyColor: "#e2e8f0",
        borderColor: "rgba(148,163,184,0.25)",
        borderWidth: 1,
        callbacks: {
          title: (items: TooltipItem<"line">[]) => {
            const item = items[0];
            return `${labelsText.currentForecastHour}: ${item.label}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#cbd5e1",
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 12,
        },
        grid: {
          color: "rgba(148,163,184,0.08)",
        },
      },
     yTemp: {
  type: "linear" as const,
  position: "left" as const,
  ticks: {
    color: hoveredAxis === "temp" ? "#fde68a" : "#fcd34d",
  },
        title: {
          display: false,
        },
        grid: {
          color: "rgba(148,163,184,0.08)",
        },
      },
      yHeight: {
  type: "linear" as const,
  position: "right" as const,
  ticks: {
    color: hoveredAxis === "height" ? "#99f6e4" : "#5eead4",
  },
        title: {
          display: false,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
     yThermal: {
  type: "linear" as const,
  position: "right" as const,
  min: 0,
  suggestedMax: 4,
  ticks: {
    color: hoveredAxis === "thermal" ? "#bbf7d0" : "#86efac",
  },
        title: {
          display: false,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
     yWind: {
  type: "linear" as const,
  position: "right" as const,
  min: 0,
  ticks: {
    color: hoveredAxis === "wind" ? "#fbcfe8" : "#f9a8d4",
  },
        title: {
          display: false,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
     yCloud: {
  type: "linear" as const,
  position: "right" as const,
  min: 0,
  max: 100,
  ticks: {
    color: hoveredAxis === "cloud" ? "#e2e8f0" : "#cbd5e1",
  },
        title: {
          display: false,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const dayButtons = [
    labelsText.today,
    labelsText.tomorrow,
    labelsText.dayPlus2,
  ];

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
          onClick={() => setSelectedDay(i)}
        >
          {label}
        </button>
      ))}
    </div>
  </div>

  <div className="chartMeta">
    <span className="chartMarker sunrise">
      ☀ {labelsText.sunrise}: {sunriseLabel}
    </span>
    <span className="chartMarker sunset">
      🌙 {labelsText.sunset}: {sunsetLabel}
    </span>
  </div>
</div>

<div className="chartAxisLegendTop">
  <span className="axisLegend axisTemp">
    {labelsText.temperature} / {labelsText.dewPoint} (°C)
  </span>

  <span className="axisLegend axisThermal">
    {labelsText.thermal} (m/s)
  </span>

  <span className="axisLegend axisWind">
    {labelsText.surfaceWind} / {labelsText.wind850} / {labelsText.wind700} (kt)
  </span>

  <span className="axisLegend axisHeight">
    {labelsText.cloudBase} (m AGL)
  </span>

  <span className="axisLegend axisCloud">
    {labelsText.cloudLow} / {labelsText.cloudMid} / {labelsText.cloudHigh} (%)
  </span>
</div>

      <div className="chartCanvasWrap">
        <Line data={chartData} options={options} />
      </div>

      {currentVisibleIndex >= 0 ? (
        <div className="chartCurrentHint">
          {labelsText.currentForecastHour}: {pickLabels[currentVisibleIndex]}
        </div>
      ) : null}
    </div>
  );
}