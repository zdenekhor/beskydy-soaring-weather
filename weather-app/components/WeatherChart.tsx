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

  const colors = {
    temp: "rgba(199, 167, 108, 0.95)",
    dew: "rgba(122, 156, 176, 0.95)",
    height: "rgba(106, 147, 132, 0.96)",
    thermal: "rgba(122, 160, 112, 0.96)",
    windSurface: "rgba(168, 124, 144, 0.95)",
    wind850: "rgba(134, 123, 164, 0.95)",
    wind700: "rgba(156, 110, 110, 0.95)",
    cloudLow: "rgba(214, 220, 227, 0.72)",
    cloudMid: "rgba(160, 171, 184, 0.82)",
    cloudHigh: "rgba(122, 137, 169, 0.9)",
  };

  const faded = {
    temp: "rgba(199, 167, 108, 0.24)",
    dew: "rgba(122, 156, 176, 0.24)",
    height: "rgba(106, 147, 132, 0.22)",
    thermal: "rgba(122, 160, 112, 0.22)",
    windSurface: "rgba(168, 124, 144, 0.2)",
    wind850: "rgba(134, 123, 164, 0.2)",
    wind700: "rgba(156, 110, 110, 0.2)",
    cloudLow: "rgba(214, 220, 227, 0.16)",
    cloudMid: "rgba(160, 171, 184, 0.16)",
    cloudHigh: "rgba(122, 137, 169, 0.16)",
  };

  const chartData = useMemo<ChartData<"line">>(
    () => ({
      labels: pickLabels,
      datasets: [
        {
          label: labelsText.temperature,
          data: pick(data.temperature),
          yAxisID: "yTemp",
          borderColor: hoveredAxis && hoveredAxis !== "temp" ? faded.temp : colors.temp,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: hoveredAxis === "temp" ? 3.2 : 2.2,
        },
        {
          label: labelsText.dewPoint,
          data: pick(data.dewPoint),
          yAxisID: "yTemp",
          borderColor: hoveredAxis && hoveredAxis !== "temp" ? faded.dew : colors.dew,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: hoveredAxis === "temp" ? 2.8 : 2.0,
        },
        {
          label: labelsText.cloudBase,
          data: pick(data.lcl),
          yAxisID: "yHeight",
          borderColor: hoveredAxis && hoveredAxis !== "height" ? faded.height : colors.height,
          tension: 0.25,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: hoveredAxis === "height" ? 3.2 : 2.2,
        },
        {
          label: labelsText.thermal,
          data: pick(data.thermal),
          yAxisID: "yThermal",
          borderColor: hoveredAxis && hoveredAxis !== "thermal" ? faded.thermal : colors.thermal,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: hoveredAxis === "thermal" ? 3.1 : 2.2,
        },
        {
          label: labelsText.surfaceWind,
          data: pick(data.windSurface),
          yAxisID: "yWind",
          borderColor:
            hoveredAxis && hoveredAxis !== "wind" ? faded.windSurface : colors.windSurface,
          tension: 0.25,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: hoveredAxis === "wind" ? 2.8 : 1.9,
        },
        {
          label: labelsText.wind850,
          data: pick(data.wind850),
          yAxisID: "yWind",
          borderColor: hoveredAxis && hoveredAxis !== "wind" ? faded.wind850 : colors.wind850,
          tension: 0.25,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: hoveredAxis === "wind" ? 2.8 : 1.9,
        },
        {
          label: labelsText.wind700,
          data: pick(data.wind700),
          yAxisID: "yWind",
          borderColor: hoveredAxis && hoveredAxis !== "wind" ? faded.wind700 : colors.wind700,
          tension: 0.25,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: hoveredAxis === "wind" ? 2.8 : 1.9,
        },
        {
          label: labelsText.cloudLow,
          data: pick(data.cloudLow),
          yAxisID: "yCloud",
          borderColor: hoveredAxis && hoveredAxis !== "cloud" ? faded.cloudLow : colors.cloudLow,
          borderDash: [2, 2],
          tension: 0.25,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: hoveredAxis === "cloud" ? 2.0 : 1.4,
        },
        {
          label: labelsText.cloudMid,
          data: pick(data.cloudMid),
          yAxisID: "yCloud",
          borderColor: hoveredAxis && hoveredAxis !== "cloud" ? faded.cloudMid : colors.cloudMid,
          borderDash: [6, 3],
          tension: 0.25,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: hoveredAxis === "cloud" ? 2.0 : 1.4,
        },
        {
          label: labelsText.cloudHigh,
          data: pick(data.cloudHigh),
          yAxisID: "yCloud",
          borderColor:
            hoveredAxis && hoveredAxis !== "cloud" ? faded.cloudHigh : colors.cloudHigh,
          borderDash: [10, 4],
          tension: 0.25,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: hoveredAxis === "cloud" ? 2.0 : 1.4,
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
              hoveredAxis === "temp"
                ? "rgba(199, 167, 108, 0.14)"
                : "rgba(148, 163, 184, 0.045)",
            lineWidth: hoveredAxis === "temp" ? 1.0 : 0.55,
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
              hoveredAxis === "height"
                ? "rgba(106, 147, 132, 0.14)"
                : "rgba(148, 163, 184, 0.04)",
            drawOnChartArea: true,
            lineWidth: hoveredAxis === "height" ? 1.0 : 0.45,
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
              hoveredAxis === "thermal"
                ? "rgba(122, 160, 112, 0.14)"
                : "rgba(148, 163, 184, 0.04)",
            drawOnChartArea: true,
            lineWidth: hoveredAxis === "thermal" ? 1.0 : 0.45,
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
              hoveredAxis === "wind"
                ? "rgba(168, 124, 144, 0.14)"
                : "rgba(148, 163, 184, 0.04)",
            drawOnChartArea: true,
            lineWidth: hoveredAxis === "wind" ? 1.0 : 0.45,
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
              hoveredAxis === "cloud"
                ? "rgba(200, 209, 218, 0.14)"
                : "rgba(148, 163, 184, 0.04)",
            drawOnChartArea: true,
            lineWidth: hoveredAxis === "cloud" ? 1.0 : 0.45,
          },
          border: {
            color: "rgba(148, 163, 184, 0.14)",
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