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
  type ActiveElement,
  type ChartData,
  type ChartOptions,
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
  times: string[];
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

function formatHm(dateString: string, lang: Lang) {
  return new Date(dateString).toLocaleTimeString(
    lang === "cs" ? "cs-CZ" : "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function formatDir(value: number | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return `${Math.round(value)}°`;
}

export default function WeatherChart({ lang, labelsText, data }: Props) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [hoveredAxis, setHoveredAxis] = useState<string | null>(null);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

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

  const pick = (arr: number[]) => visibleIndices.map((i) => arr[i]);
  const pickLabels = visibleIndices.map((i) => data.labels[i]);

  const visibleCurrentIndex = visibleIndices.indexOf(data.currentIndex);

  const activePointIndex =
    hoveredPointIndex !== null
      ? hoveredPointIndex
      : visibleCurrentIndex >= 0
      ? visibleCurrentIndex
      : 0;

  const safeActiveIndex =
    activePointIndex >= 0 && activePointIndex < pickLabels.length ? activePointIndex : 0;

  const sunriseLabel = data.sunrise[selectedDay]
    ? formatHm(data.sunrise[selectedDay], lang)
    : "-";

  const sunsetLabel = data.sunset[selectedDay]
    ? formatHm(data.sunset[selectedDay], lang)
    : "-";

  const activeTemperature = pick(data.temperature)[safeActiveIndex] ?? 0;
  const activeDewPoint = pick(data.dewPoint)[safeActiveIndex] ?? 0;
  const activeLcl = pick(data.lcl)[safeActiveIndex] ?? 0;
  const activeThermal = pick(data.thermal)[safeActiveIndex] ?? 0;
  const activeWindSurface = pick(data.windSurface)[safeActiveIndex] ?? 0;
  const activeWind850 = pick(data.wind850)[safeActiveIndex] ?? 0;
  const activeWind700 = pick(data.wind700)[safeActiveIndex] ?? 0;
  const activeWindSurfaceDir = pick(data.windSurfaceDir)[safeActiveIndex] ?? 0;
  const activeWind850Dir = pick(data.wind850Dir)[safeActiveIndex] ?? 0;
  const activeWind700Dir = pick(data.wind700Dir)[safeActiveIndex] ?? 0;
  const activeCloudLow = pick(data.cloudLow)[safeActiveIndex] ?? 0;
  const activeCloudMid = pick(data.cloudMid)[safeActiveIndex] ?? 0;
  const activeCloudHigh = pick(data.cloudHigh)[safeActiveIndex] ?? 0;

  const chartData = useMemo<ChartData<"line">>(
    () => ({
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
          pointHoverRadius: 4,
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
          pointHoverRadius: 4,
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
          pointHoverRadius: 4,
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
          pointHoverRadius: 4,
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
          pointHoverRadius: 4,
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
          pointHoverRadius: 4,
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
          pointHoverRadius: 4,
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
          pointHoverRadius: 4,
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
          pointHoverRadius: 4,
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
          pointHoverRadius: 4,
          borderWidth: hoveredAxis === "cloud" ? 2.2 : 1.5,
        },
      ],
    }),
    [data, hoveredAxis, labelsText, pickLabels, visibleIndices]
  );

  const options = useMemo<ChartOptions<"line">>(
    () => ({
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      onHover: (_event, activeElements) => {
        const elements = activeElements as ActiveElement[];
        if (elements.length > 0) {
          setHoveredPointIndex(elements[0].index);
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
          type: "linear",
          position: "left",
          ticks: {
            color: "#fcd34d",
          },
          title: {
            display: false,
          },
          grid: {
            color:
              hoveredAxis === "temp"
                ? "rgba(251,191,36,0.25)"
                : "rgba(148,163,184,0.06)",
            lineWidth: hoveredAxis === "temp" ? 1.2 : 0.6,
          },
        },
        yHeight: {
          type: "linear",
          position: "right",
          ticks: {
            color: "#5eead4",
          },
          title: {
            display: false,
          },
          grid: {
            color:
              hoveredAxis === "height"
                ? "rgba(45,212,191,0.22)"
                : "rgba(148,163,184,0.05)",
            drawOnChartArea: true,
            lineWidth: hoveredAxis === "height" ? 1.2 : 0.5,
          },
        },
        yThermal: {
          type: "linear",
          position: "right",
          min: 0,
          suggestedMax: 4,
          ticks: {
            color: "#86efac",
          },
          title: {
            display: false,
          },
          grid: {
            color:
              hoveredAxis === "thermal"
                ? "rgba(34,197,94,0.22)"
                : "rgba(148,163,184,0.05)",
            drawOnChartArea: true,
            lineWidth: hoveredAxis === "thermal" ? 1.2 : 0.5,
          },
        },
        yWind: {
          type: "linear",
          position: "right",
          min: 0,
          ticks: {
            color: "#f9a8d4",
          },
          title: {
            display: false,
          },
          grid: {
            color:
              hoveredAxis === "wind"
                ? "rgba(244,114,182,0.22)"
                : "rgba(148,163,184,0.05)",
            drawOnChartArea: true,
            lineWidth: hoveredAxis === "wind" ? 1.2 : 0.5,
          },
        },
        yCloud: {
          type: "linear",
          position: "right",
          min: 0,
          max: 100,
          ticks: {
            color: "#cbd5e1",
          },
          title: {
            display: false,
          },
          grid: {
            color:
              hoveredAxis === "cloud"
                ? "rgba(203,213,225,0.25)"
                : "rgba(148,163,184,0.05)",
            drawOnChartArea: true,
            lineWidth: hoveredAxis === "cloud" ? 1.2 : 0.5,
          },
        },
      },
    }),
    [hoveredAxis]
  );

  const dayButtons = [labelsText.today, labelsText.tomorrow, labelsText.dayPlus2];

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
          <span className="chartMarker sunrise">
            ☀ {labelsText.sunrise}: {sunriseLabel}
          </span>
          <span className="chartMarker sunset">
            🌙 {labelsText.sunset}: {sunsetLabel}
          </span>
        </div>
      </div>

      <div className="chartAxisLegendBlock">
        <div className="chartAxisLegendTitle">{labelsText.axesLegendTitle}</div>

        <div className="chartAxisLegendTop">
          <button
            type="button"
            className={`axisLegend axisTemp ${hoveredAxis === "temp" ? "isHovered" : ""}`}
            onMouseEnter={() => setHoveredAxis("temp")}
            onMouseLeave={() => setHoveredAxis(null)}
          >
            {labelsText.temperature} / {labelsText.dewPoint} (°C)
          </button>

          <button
            type="button"
            className={`axisLegend axisThermal ${hoveredAxis === "thermal" ? "isHovered" : ""}`}
            onMouseEnter={() => setHoveredAxis("thermal")}
            onMouseLeave={() => setHoveredAxis(null)}
          >
            {labelsText.thermal} (m/s)
          </button>

          <button
            type="button"
            className={`axisLegend axisWind ${hoveredAxis === "wind" ? "isHovered" : ""}`}
            onMouseEnter={() => setHoveredAxis("wind")}
            onMouseLeave={() => setHoveredAxis(null)}
          >
            {labelsText.surfaceWind} / {labelsText.wind850} / {labelsText.wind700} (kt)
          </button>

          <button
            type="button"
            className={`axisLegend axisHeight ${hoveredAxis === "height" ? "isHovered" : ""}`}
            onMouseEnter={() => setHoveredAxis("height")}
            onMouseLeave={() => setHoveredAxis(null)}
          >
            {labelsText.cloudBase} (m AGL)
          </button>

          <button
            type="button"
            className={`axisLegend axisCloud ${hoveredAxis === "cloud" ? "isHovered" : ""}`}
            onMouseEnter={() => setHoveredAxis("cloud")}
            onMouseLeave={() => setHoveredAxis(null)}
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
        <Line data={chartData} options={options} />
      </div>

      <div className="chartReadoutCard">
        <div className="chartReadoutHeader">
          <strong>{labelsText.currentForecastHour}:</strong> {pickLabels[safeActiveIndex] ?? "-"}
        </div>

        <div className="chartReadoutGrid">
          <div className="chartReadoutItem">
            <span className="chartReadoutLabel">
              {labelsText.temperature} / {labelsText.dewPoint}
            </span>
            <span className="chartReadoutValue">
              {activeTemperature.toFixed(1)} °C / {activeDewPoint.toFixed(1)} °C
            </span>
          </div>

          <div className="chartReadoutItem">
            <span className="chartReadoutLabel">{labelsText.cloudBase}</span>
            <span className="chartReadoutValue">{Math.round(activeLcl)} m AGL</span>
          </div>

          <div className="chartReadoutItem">
            <span className="chartReadoutLabel">{labelsText.thermal}</span>
            <span className="chartReadoutValue">{activeThermal.toFixed(1)} m/s</span>
          </div>

          <div className="chartReadoutItem">
            <span className="chartReadoutLabel">{labelsText.surfaceWind}</span>
            <span className="chartReadoutValue">
              {Math.round(activeWindSurface)} kt ({formatDir(activeWindSurfaceDir)})
            </span>
          </div>

          <div className="chartReadoutItem">
            <span className="chartReadoutLabel">{labelsText.wind850}</span>
            <span className="chartReadoutValue">
              {Math.round(activeWind850)} kt ({formatDir(activeWind850Dir)})
            </span>
          </div>

          <div className="chartReadoutItem">
            <span className="chartReadoutLabel">{labelsText.wind700}</span>
            <span className="chartReadoutValue">
              {Math.round(activeWind700)} kt ({formatDir(activeWind700Dir)})
            </span>
          </div>

          <div className="chartReadoutItem">
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
    </div>
  );
}