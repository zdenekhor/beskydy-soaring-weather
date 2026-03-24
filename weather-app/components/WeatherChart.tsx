"use client";

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

function formatShortDay(dateString: string, lang: Lang) {
  return new Date(dateString).toLocaleDateString(lang === "cs" ? "cs-CZ" : "en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

function getDayIndexLabel(index: number, labelsText: LabelsText) {
  if (index === 0) return labelsText.today;
  if (index === 1) return labelsText.tomorrow;
  return labelsText.dayPlus2;
}

export default function WeatherChart({ lang, labelsText, data }: Props) {
  const sunriseMarkers = data.sunrise.map((s, i) => ({
    time: new Date(s).toLocaleTimeString(lang === "cs" ? "cs-CZ" : "en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    label: `${getDayIndexLabel(i, labelsText)} ${labelsText.sunrise}`,
    day: formatShortDay(s, lang),
  }));

  const sunsetMarkers = data.sunset.map((s, i) => ({
    time: new Date(s).toLocaleTimeString(lang === "cs" ? "cs-CZ" : "en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    label: `${getDayIndexLabel(i, labelsText)} ${labelsText.sunset}`,
    day: formatShortDay(s, lang),
  }));

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: labelsText.temperature,
        data: data.temperature,
        yAxisID: "yTemp",
        borderColor: "rgba(251,191,36,0.95)",
        backgroundColor: "rgba(251,191,36,0.18)",
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: labelsText.dewPoint,
        data: data.dewPoint,
        yAxisID: "yTemp",
        borderColor: "rgba(96,165,250,0.95)",
        backgroundColor: "rgba(96,165,250,0.18)",
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: labelsText.cloudBase,
        data: data.lcl,
        yAxisID: "yHeight",
        borderColor: "rgba(148,163,184,0.95)",
        backgroundColor: "rgba(148,163,184,0.15)",
        tension: 0.25,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: labelsText.thermal,
        data: data.thermal,
        yAxisID: "yThermal",
        borderColor: "rgba(34,197,94,0.95)",
        backgroundColor: "rgba(34,197,94,0.15)",
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: labelsText.surfaceWind,
        data: data.windSurface,
        yAxisID: "yWind",
        borderColor: "rgba(244,114,182,0.95)",
        backgroundColor: "rgba(244,114,182,0.15)",
        tension: 0.25,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: labelsText.wind850,
        data: data.wind850,
        yAxisID: "yWind",
        borderColor: "rgba(167,139,250,0.95)",
        backgroundColor: "rgba(167,139,250,0.15)",
        tension: 0.25,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: labelsText.wind700,
        data: data.wind700,
        yAxisID: "yWind",
        borderColor: "rgba(236,72,153,0.95)",
        backgroundColor: "rgba(236,72,153,0.15)",
        tension: 0.25,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: labelsText.cloudLow,
        data: data.cloudLow,
        yAxisID: "yCloud",
        borderColor: "rgba(200,200,255,0.4)",
        borderDash: [2, 2],
        tension: 0.25,
        pointRadius: 0,
        borderWidth: 1.5,
      },
      {
        label: labelsText.cloudMid,
        data: data.cloudMid,
        yAxisID: "yCloud",
        borderColor: "rgba(170,170,220,0.35)",
        borderDash: [4, 3],
        tension: 0.25,
        pointRadius: 0,
        borderWidth: 1.5,
      },
      {
        label: labelsText.cloudHigh,
        data: data.cloudHigh,
        yAxisID: "yCloud",
        borderColor: "rgba(140,140,200,0.3)",
        borderDash: [6, 4],
        tension: 0.25,
        pointRadius: 0,
        borderWidth: 1.5,
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
          usePointStyle: false,
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
          maxTicksLimit: 18,
        },
        grid: {
          color: "rgba(148,163,184,0.08)",
        },
      },
      yTemp: {
        type: "linear" as const,
        position: "left" as const,
        title: {
          display: true,
          text: "°C",
          color: "#cbd5e1",
        },
        ticks: {
          color: "#cbd5e1",
        },
        grid: {
          color: "rgba(148,163,184,0.08)",
        },
      },
      yHeight: {
        type: "linear" as const,
        position: "right" as const,
        title: {
          display: true,
          text: "m AGL",
          color: "#cbd5e1",
        },
        ticks: {
          color: "#cbd5e1",
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
        title: {
          display: true,
          text: "m/s",
          color: "#cbd5e1",
        },
        ticks: {
          color: "#cbd5e1",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      yWind: {
        type: "linear" as const,
        position: "right" as const,
        min: 0,
        title: {
          display: true,
          text: "kt",
          color: "#cbd5e1",
        },
        ticks: {
          color: "#cbd5e1",
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
        title: {
          display: true,
          text: "%",
          color: "#cbd5e1",
        },
        ticks: {
          color: "#cbd5e1",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="weatherChartRoot">
      <div className="chartMarkers">
        <div className="chartMarkerGroup">
          {sunriseMarkers.map((m, idx) => (
            <span key={`sunrise-${idx}`} className="chartMarker sunrise">
              ☀ {m.day} {m.time}
            </span>
          ))}
        </div>

        <div className="chartMarkerGroup">
          {sunsetMarkers.map((m, idx) => (
            <span key={`sunset-${idx}`} className="chartMarker sunset">
              🌙 {m.day} {m.time}
            </span>
          ))}
        </div>
      </div>

      <div className="chartCanvasWrap">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}