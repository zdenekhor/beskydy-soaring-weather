import WeatherChart from "../components/WeatherChart";
import {
  Cloud,
  Wind,
  Plane,
  Gauge,
  TrendingUp,
  Thermometer,
  ArrowUp,
  MapPinned,
  AlertTriangle,
} from "lucide-react";

type ForecastData = {
  hourly: {
    time: string[];
    temperature_2m: number[];
    dew_point_2m: number[];
    cloud_cover: number[];
    cloud_cover_low?: number[];
    cloud_cover_mid?: number[];
    cloud_cover_high?: number[];
    precipitation?: number[];
    precipitation_probability?: number[];
    shortwave_radiation?: number[];
    pressure_msl?: number[];
    wind_speed_10m: number[];
    wind_direction_10m?: number[];
    wind_speed_850hPa?: number[];
    wind_direction_850hPa?: number[];
    wind_speed_700hPa?: number[];
    wind_direction_700hPa?: number[];
  };
  daily: {
    sunrise: string[];
    sunset: string[];
  };
};

const FIELD_ELEVATION_MSL = 439;
const APP_VERSION = "v1.1.0";
const APP_UPDATED = "22 Mar 2026";

async function getWeather(): Promise<ForecastData> {
  const latitude = 49.592;
  const longitude = 18.359;

  const hourlyParams = [
    "temperature_2m",
    "dew_point_2m",
    "cloud_cover",
    "cloud_cover_low",
    "cloud_cover_mid",
    "cloud_cover_high",
    "precipitation",
    "precipitation_probability",
    "shortwave_radiation",
    "pressure_msl",
    "wind_speed_10m",
    "wind_direction_10m",
    "wind_speed_850hPa",
    "wind_direction_850hPa",
    "wind_speed_700hPa",
    "wind_direction_700hPa",
  ].join(",");

  const dailyParams = ["sunrise", "sunset"].join(",");

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&hourly=${hourlyParams}` +
    `&daily=${dailyParams}` +
    `&forecast_days=3` +
    `&timezone=auto`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to load forecast: ${res.status} ${text}`);
  }

  return res.json();
}

async function getMetarWind(icao: string) {
  try {
    const res = await fetch(
      `https://aviationweather.gov/api/data/metar?ids=${icao}&format=json`,
      {
        cache: "no-store",
        headers: {
          "User-Agent": "beskydy-soaring-weather/1.0",
        },
      }
    );

    if (!res.ok) return null;

    const rows = await res.json();
    const metar = Array.isArray(rows) ? rows[0] : null;
    if (!metar) return null;

    const dirRaw = metar.wdir;
    const spdRaw = metar.wspd;

    const directionDeg =
      typeof dirRaw === "number"
        ? dirRaw
        : typeof dirRaw === "string" && dirRaw !== "VRB"
        ? Number(dirRaw)
        : 0;

    const speedKt =
      typeof spdRaw === "number"
        ? spdRaw
        : typeof spdRaw === "string"
        ? Number(spdRaw)
        : 0;

    return {
      speedKt: Number.isFinite(speedKt) ? speedKt : 0,
      directionDeg: Number.isFinite(directionDeg) ? directionDeg : 0,
      rawText: metar.rawOb ?? "",
    };
  } catch {
    return null;
  }
}

function getWindArrow(deg: number) {
  const corrected = (deg + 180) % 360;

  if (corrected >= 337 || corrected < 22) return "⬆";
  if (corrected < 67) return "↗";
  if (corrected < 112) return "➡";
  if (corrected < 157) return "↘";
  if (corrected < 202) return "⬇";
  if (corrected < 247) return "↙";
  if (corrected < 292) return "⬅";
  if (corrected < 337) return "↖";
  return "•";
}

function kmhToKt(value: number | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.round(value * 0.54);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function safeArrayValue(
  arr: number[] | undefined,
  index: number,
  fallback = 0
) {
  if (!arr || index < 0 || index >= arr.length) return fallback;
  const value = arr[index];
  return typeof value === "number" && !Number.isNaN(value) ? value : fallback;
}

function findNearestHourIndex(times: string[]) {
  if (!times.length) return 0;

  const now = Date.now();
  let bestIndex = 0;
  let bestDiff = Infinity;

  for (let i = 0; i < times.length; i++) {
    const ts = new Date(times[i]).getTime();
    const diff = Math.abs(ts - now);

    if (diff < bestDiff) {
      bestDiff = diff;
      bestIndex = i;
    }
  }

  return bestIndex;
}

function formatHourMinute(dateString: string) {
  return new Date(dateString).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDateKey(dateString: string) {
  const d = new Date(dateString);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getHazardColor(type: string) {
  if (type === "storm") return "rgba(239,68,68,0.22)";
  if (type === "wind") return "rgba(249,115,22,0.22)";
  if (type === "rain") return "rgba(59,130,246,0.22)";
  if (type === "ice") return "rgba(148,163,184,0.22)";
  if (type === "snow") return "rgba(226,232,240,0.16)";
  if (type === "cloud") return "rgba(148,163,184,0.18)";
  if (type === "overcast") return "rgba(99,102,241,0.18)";
  return "rgba(255,255,255,0.08)";
}

function rawThermalPotential(
  spread: number,
  radiation: number,
  thermalTop: number
) {
  let score = 0;

  score += clamp(spread * 5, 0, 30);
  score += clamp((radiation - 120) / 10, 0, 35);
  score += clamp((thermalTop - 1100) / 30, 0, 35);

  return clamp(score, 0, 100);
}

function cloudSuppressionFactor(low: number, mid: number, high: number) {
  const penalty = low * 0.0065 + mid * 0.0025 + high * 0.0015;
  return clamp(1 - penalty, 0.12, 1);
}

function precipitationSuppressionFactor(
  precipitation: number,
  precipitationProbability: number
) {
  let factor = 1;

  if (precipitation > 0.1) factor *= 0.65;
  if (precipitation > 0.3) factor *= 0.5;
  if (precipitationProbability > 50) factor *= 0.85;
  if (precipitationProbability > 75) factor *= 0.7;

  return clamp(factor, 0.35, 1);
}

function windSuppressionFactor(
  surfaceWind: number,
  wind850: number,
  wind700: number
) {
  const shear = Math.abs(wind700 - surfaceWind);
  let factor = 1;

  if (surfaceWind > 12) factor *= 0.9;
  if (surfaceWind > 18) factor *= 0.75;
  if (shear > 10) factor *= 0.9;
  if (shear > 18) factor *= 0.75;

  return clamp(factor, 0.5, 1);
}

function estimateClimbFromScore(score: number) {
  if (score < 15) return 0.2;
  if (score < 25) return 0.5;
  if (score < 35) return 0.9;
  if (score < 50) return 1.5;
  if (score < 65) return 2.1;
  if (score < 80) return 2.8;
  return 3.4;
}

export default async function Home() {
  const data = await getWeather();
  const metarWind = await getMetarWind("LKFR");

  const now = new Date();

  const formattedDate = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedTime = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const currentIndex = findNearestHourIndex(data.hourly.time);
  const currentDateKey = getDateKey(data.hourly.time[currentIndex]);

  const dailyIndex = data.daily.sunrise.findIndex(
    (s: string) => getDateKey(s) === currentDateKey
  );

  const sunriseRaw =
    dailyIndex >= 0 ? data.daily.sunrise[dailyIndex] : data.daily.sunrise[0];

  const sunsetRaw =
    dailyIndex >= 0 ? data.daily.sunset[dailyIndex] : data.daily.sunset[0];

  const sunriseTime = sunriseRaw ? new Date(sunriseRaw) : null;
  const sunsetTime = sunsetRaw ? new Date(sunsetRaw) : null;

  const sunriseLabel = sunriseRaw ? formatHourMinute(sunriseRaw) : "-";
  const sunsetLabel = sunsetRaw ? formatHourMinute(sunsetRaw) : "-";

  const temperature = safeArrayValue(data.hourly.temperature_2m, currentIndex);
  const dewpoint = safeArrayValue(data.hourly.dew_point_2m, currentIndex);
  const spread = temperature - dewpoint;

  const clouds = safeArrayValue(data.hourly.cloud_cover, currentIndex);
  const cloudLow = safeArrayValue(data.hourly.cloud_cover_low, currentIndex, 0);
  const cloudMid = safeArrayValue(data.hourly.cloud_cover_mid, currentIndex, 0);
  const cloudHigh = safeArrayValue(
    data.hourly.cloud_cover_high,
    currentIndex,
    0
  );

  const radiation = safeArrayValue(
    data.hourly.shortwave_radiation,
    currentIndex,
    0
  );
  const precipitation = safeArrayValue(
    data.hourly.precipitation,
    currentIndex,
    0
  );
  const precipitationProbability = safeArrayValue(
    data.hourly.precipitation_probability,
    currentIndex,
    0
  );

  const modelWindKmh = safeArrayValue(data.hourly.wind_speed_10m, currentIndex);
  const modelWind = kmhToKt(modelWindKmh);

  const modelWindDirection = safeArrayValue(
    data.hourly.wind_direction_10m,
    currentIndex,
    0
  );

  const wind = metarWind?.speedKt ?? modelWind;
  const windDirection = metarWind?.directionDeg ?? modelWindDirection;
  const windArrow = getWindArrow(windDirection);

  const runwayHeading = 84;
  const runwayRotation = runwayHeading - 90;
  const angleDiff = ((windDirection - runwayHeading + 540) % 360) - 180;
  const rad = (angleDiff * Math.PI) / 180;

  const headwind = Math.round(wind * Math.cos(rad));
  const crosswind = Math.round(wind * Math.sin(rad));
  const crosswindAbs = Math.abs(crosswind);

  const wind850Kmh = safeArrayValue(
    data.hourly.wind_speed_850hPa,
    currentIndex,
    0
  );
  const wind850 = kmhToKt(wind850Kmh);

  const wind850Dir = safeArrayValue(
    data.hourly.wind_direction_850hPa,
    currentIndex,
    0
  );
  const wind850Arrow = getWindArrow(wind850Dir);

  const wind700Kmh = safeArrayValue(
    data.hourly.wind_speed_700hPa,
    currentIndex,
    0
  );
  const wind700 = kmhToKt(wind700Kmh);

  const wind700Dir = safeArrayValue(
    data.hourly.wind_direction_700hPa,
    currentIndex,
    0
  );
  const wind700Arrow = getWindArrow(wind700Dir);

  const lcl = Math.round(Math.max(0, 125 * spread));
  const thermalTop = lcl + 300;
  const cloudBaseMSL = lcl + FIELD_ELEVATION_MSL;

  const rawPotential = rawThermalPotential(spread, radiation, thermalTop);
  const cloudFactor = cloudSuppressionFactor(cloudLow, cloudMid, cloudHigh);
  const rainFactor = precipitationSuppressionFactor(
    precipitation,
    precipitationProbability
  );
  const windFactor = windSuppressionFactor(wind, wind850, wind700);

  const effectiveThermalScore = Math.round(
    clamp(rawPotential * cloudFactor * rainFactor * windFactor, 0, 100)
  );

  const expectedClimb = Number(
    estimateClimbFromScore(effectiveThermalScore).toFixed(1)
  );

  let climbRating = "🔴 Weak";
  if (expectedClimb > 1.2) climbRating = "🟡 Usable";
  if (expectedClimb > 2.0) climbRating = "🟢 Good";
  if (expectedClimb > 3.0) climbRating = "🔵 Strong";

  const thermalDrift = Math.round(wind * 0.4 + wind850 * 0.6);

  const lclArray = data.hourly.temperature_2m.map((temp: number, i: number) => {
    const td = safeArrayValue(data.hourly.dew_point_2m, i);
    return Math.round(Math.max(0, 125 * (temp - td)));
  });

  const thermalArray = data.hourly.temperature_2m.map((temp: number, i: number) => {
    const td = safeArrayValue(data.hourly.dew_point_2m, i);
    const low = safeArrayValue(data.hourly.cloud_cover_low, i, 0);
    const mid = safeArrayValue(data.hourly.cloud_cover_mid, i, 0);
    const high = safeArrayValue(data.hourly.cloud_cover_high, i, 0);
    const radNow = safeArrayValue(data.hourly.shortwave_radiation, i, 0);
    const rain = safeArrayValue(data.hourly.precipitation, i, 0);
    const rainProb = safeArrayValue(data.hourly.precipitation_probability, i, 0);
    const sfcWind = kmhToKt(safeArrayValue(data.hourly.wind_speed_10m, i, 0));
    const w850Now = kmhToKt(
      safeArrayValue(data.hourly.wind_speed_850hPa, i, 0)
    );
    const w700Now = kmhToKt(
      safeArrayValue(data.hourly.wind_speed_700hPa, i, 0)
    );

    const localSpread = temp - td;
    const localLcl = Math.round(Math.max(0, 125 * localSpread));
    const localTop = localLcl + 300;

    const raw = rawThermalPotential(localSpread, radNow, localTop);
    const cf = cloudSuppressionFactor(low, mid, high);
    const rf = precipitationSuppressionFactor(rain, rainProb);
    const wf = windSuppressionFactor(sfcWind, w850Now, w700Now);

    const score = clamp(raw * cf * rf * wf, 0, 100);
    return Number(estimateClimbFromScore(score).toFixed(1));
  });

  const hours = data.hourly.time.map((t: string) => {
    const date = new Date(t);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  });

  const temperatureAll = data.hourly.temperature_2m;

  const windSurfaceAll =
    data.hourly.wind_speed_10m?.map((v: number) => kmhToKt(v)) ??
    Array(hours.length).fill(0);

  const windSurfaceDirAll =
    data.hourly.wind_direction_10m?.map((v: number) => Math.round(v)) ??
    Array(hours.length).fill(0);

  const wind850All =
    data.hourly.wind_speed_850hPa?.map((v: number) => kmhToKt(v)) ??
    Array(hours.length).fill(0);

  const wind700All =
    data.hourly.wind_speed_700hPa?.map((v: number) => kmhToKt(v)) ??
    Array(hours.length).fill(0);

  const wind850DirAll =
    data.hourly.wind_direction_850hPa?.map((v: number) => Math.round(v)) ??
    Array(hours.length).fill(0);

  const wind700DirAll =
    data.hourly.wind_direction_700hPa?.map((v: number) => Math.round(v)) ??
    Array(hours.length).fill(0);

  const thermalNow = safeArrayValue(thermalArray, currentIndex, 0);

  const soaringIndex = Math.round(
    clamp(
      effectiveThermalScore * 0.75 +
        clamp(lcl / 20, 0, 20) -
        clamp(crosswindAbs * 1.2, 0, 12),
      0,
      100
    )
  );

  let soaringRating = "🔴 Poor";
  if (soaringIndex > 30) soaringRating = "🟡 Weak";
  if (soaringIndex > 50) soaringRating = "🟢 Good";
  if (soaringIndex > 70) soaringRating = "🔵 XC day";

  const THERMAL_THRESHOLD = 1.2;

  const sunriseTs = sunriseTime ? sunriseTime.getTime() : null;
  const sunsetTs = sunsetTime ? sunsetTime.getTime() : null;

  const vfrIndices = data.hourly.time
    .map((t: string, i: number) => {
      const ts = new Date(t).getTime();
      const sameDay = getDateKey(t) === currentDateKey;
      const withinVfr =
        sameDay &&
        sunriseTs !== null &&
        sunsetTs !== null &&
        ts >= sunriseTs &&
        ts <= sunsetTs;

      return withinVfr ? i : -1;
    })
    .filter((i: number) => i >= 0);

  const thermalStartIndex =
    vfrIndices.find((i: number) => thermalArray[i] >= THERMAL_THRESHOLD) ?? -1;

  let thermalMaxIndex = -1;
  let bestThermalValue = -1;

  for (const i of vfrIndices) {
    if (thermalArray[i] > bestThermalValue) {
      bestThermalValue = thermalArray[i];
      thermalMaxIndex = i;
    }
  }

  let thermalEndIndex = -1;
  for (let j = vfrIndices.length - 1; j >= 0; j--) {
    const i = vfrIndices[j];
    if (thermalArray[i] > 0.4) {
      thermalEndIndex = i;
      break;
    }
  }

  const thermalStart = thermalStartIndex >= 0 ? hours[thermalStartIndex] : "-";
  const thermalMax = thermalMaxIndex >= 0 ? hours[thermalMaxIndex] : "-";
  const thermalEnd = thermalEndIndex >= 0 ? hours[thermalEndIndex] : "-";

  let skyType = "Mixed sky";
  let skyTypeClass = "badgeYellow";

  if (cloudLow > 75 && radiation < 180) {
    skyType = "Low overcast";
    skyTypeClass = "badgeRed";
  } else if (clouds > 90 && radiation < 150) {
    skyType = "Overcast";
    skyTypeClass = "badgeRed";
  } else if (
    radiation >= 350 &&
    spread >= 4 &&
    cloudLow >= 15 &&
    cloudLow <= 60 &&
    lcl >= 700
  ) {
    skyType = "Cu day";
    skyTypeClass = "badgeGreen";
  } else if (radiation >= 450 && spread >= 6 && cloudLow < 20 && cloudMid < 20) {
    skyType = "Blue day";
    skyTypeClass = "badgeBlue";
  } else if (radiation >= 220 && lcl >= 600) {
    skyType = "Usable thermal sky";
    skyTypeClass = "badgeGreen";
  }

  const hazards: { icon: string; label: string; type: string; severity: number }[] = [];

  if (
    precipitationProbability > 60 &&
    cloudLow > 50 &&
    cloudMid > 50 &&
    expectedClimb > 2.2
  ) {
    hazards.push({ icon: "⛈", label: "Storm risk", type: "storm", severity: 6 });
  }
  if (temperature < 0) {
    hazards.push({ icon: "🧊", label: "Freezing", type: "ice", severity: 5 });
  }
  if (temperature < 2 && precipitation > 0.2) {
    hazards.push({ icon: "❄", label: "Snow", type: "snow", severity: 5 });
  }
  if (wind > 15 || wind850 > 22 || crosswindAbs > 12) {
    hazards.push({ icon: "💨", label: "Strong wind", type: "wind", severity: 4 });
  }
  if (precipitation > 0.2 || precipitationProbability > 45) {
    hazards.push({ icon: "🌧", label: "Rain", type: "rain", severity: 3 });
  }
  if (lcl < 500 || cloudLow > 70) {
    hazards.push({ icon: "☁", label: "Low cloud base", type: "cloud", severity: 2 });
  }
  if (cloudLow > 80 || clouds > 85) {
    hazards.push({ icon: "🌫", label: "Overcast risk", type: "overcast", severity: 1 });
  }

  hazards.sort((a, b) => b.severity - a.severity);

  const operationalRisk = Math.round(
    clamp(
      (hazards.some((h) => h.type === "storm") ? 35 : 0) +
        (hazards.some((h) => h.type === "rain") ? 18 : 0) +
        clamp(crosswindAbs * 2, 0, 20) +
        clamp(wind > 0 ? wind * 1.2 : 0, 0, 20) +
        clamp(cloudLow * 0.18, 0, 18),
      0,
      100
    )
  );

  let flyingCondition = "🟡 Weak soaring conditions";
  if (effectiveThermalScore >= 60 && operationalRisk < 35) {
    flyingCondition = "🟢 Good soaring conditions";
  } else if (effectiveThermalScore < 30 || operationalRisk >= 60) {
    flyingCondition = "🔴 Poor soaring conditions";
  }

  let xcPotential = "Low";
  if (effectiveThermalScore >= 40 && lcl > 900) {
    xcPotential = "Moderate";
  }
  if (effectiveThermalScore >= 60 && lcl > 1200 && operationalRisk < 40) {
    xcPotential = "Good";
  }
  if (
    effectiveThermalScore >= 75 &&
    lcl > 1500 &&
    wind < 12 &&
    operationalRisk < 30
  ) {
    xcPotential = "XC day";
  }

  const forecastTimeLabel = data.hourly.time[currentIndex]
    ? new Date(data.hourly.time[currentIndex]).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "n/a";

  let climbClass = "badgeRed";
  if (expectedClimb > 1.2) climbClass = "badgeYellow";
  if (expectedClimb > 2.0) climbClass = "badgeGreen";
  if (expectedClimb > 3.0) climbClass = "badgeBlue";

  let soaringClass = "badgeRed";
  if (soaringIndex > 30) soaringClass = "badgeYellow";
  if (soaringIndex > 50) soaringClass = "badgeGreen";
  if (soaringIndex > 70) soaringClass = "badgeBlue";

  let flyingClass = "badgeYellow";
  if (flyingCondition.includes("🟢")) flyingClass = "badgeGreen";
  if (flyingCondition.includes("🔴")) flyingClass = "badgeRed";

  let xcClass = "badgeRed";
  if (xcPotential === "Moderate") xcClass = "badgeYellow";
  if (xcPotential === "Good") xcClass = "badgeGreen";
  if (xcPotential === "XC day") xcClass = "badgeBlue";

  let semaphore = "🟡 CAUTION";
  let semaphoreClass = "badgeYellow";
  let semaphoreNote = "Check wind, cloud base and current development.";

  if (
    operationalRisk >= 70 ||
    lcl < 350 ||
    crosswindAbs > 18 ||
    hazards.some((h) => h.type === "storm") ||
    hazards.some((h) => h.type === "ice") ||
    hazards.some((h) => h.type === "snow")
  ) {
    semaphore = "🔴 NO GO";
    semaphoreClass = "badgeRed";
    semaphoreNote = "Unsafe or unsuitable conditions for normal soaring.";
  } else if (
    effectiveThermalScore >= 60 &&
    operationalRisk < 35 &&
    lcl > 800
  ) {
    semaphore = "🟢 GO";
    semaphoreClass = "badgeGreen";
    semaphoreNote = "Favourable soaring setup with manageable risk.";
  }

  const summaryParts: string[] = [];

  if (effectiveThermalScore < 30) {
    summaryParts.push("Weak soaring day");
  } else if (effectiveThermalScore < 60) {
    summaryParts.push("Moderate thermals");
  } else {
    summaryParts.push("Good soaring day");
  }

  if (lcl < 600) summaryParts.push("Low base");
  if (cloudLow > 70 || clouds > 85) summaryParts.push("Overcast risk");
  if (wind > 12 || crosswindAbs > 10) summaryParts.push("Windy");
  if (xcPotential === "Good" || xcPotential === "XC day") {
    summaryParts.push("XC potential");
  }

  const flightSummary = summaryParts.join(" • ");

  return (
    <main className="container">
      <h1>SPL Weather LKFR – Beskydy</h1>
      <h2>Frýdlant nad Ostravicí</h2>

      <p className="metaLine">
        {formattedDate} • Updated {formattedTime} local • Forecast hour{" "}
        {forecastTimeLabel} • Version {APP_VERSION} • App update {APP_UPDATED}
      </p>

      <div className="summaryBox">{flightSummary}</div>

      <div className="grid">
        <div
          className="card"
          style={{
            border:
              semaphore.includes("GO") && !semaphore.includes("NO GO")
                ? "1px solid rgba(34,197,94,0.35)"
                : semaphore.includes("NO GO")
                ? "1px solid rgba(239,68,68,0.35)"
                : "1px solid rgba(250,204,21,0.35)",
            boxShadow:
              semaphore.includes("GO") && !semaphore.includes("NO GO")
                ? "0 0 0 1px rgba(34,197,94,0.08) inset"
                : semaphore.includes("NO GO")
                ? "0 0 0 1px rgba(239,68,68,0.08) inset"
                : "0 0 0 1px rgba(250,204,21,0.08) inset",
          }}
        >
          <h3>
            <AlertTriangle size={18} /> Flight semaphore
          </h3>
          <p
            className={`big ${semaphoreClass}`}
            style={{ fontSize: "1.35rem", fontWeight: 700 }}
          >
            {semaphore}
          </p>
          <p className="small">{semaphoreNote}</p>
        </div>

        <div className="card">
          <h3>
            <Wind size={18} /> Thermal drift
          </h3>
          <p className="big">{thermalDrift} kt</p>
        </div>

        <div className="card">
          <h3>
            <Cloud size={18} /> Sky type
          </h3>
          <p className={`big ${skyTypeClass}`}>{skyType}</p>
          <p className="small">thermal sky estimate</p>
        </div>

        <div className="card">
          <h3>
            <Thermometer size={18} /> Weather
          </h3>
          <p>Temperature: {temperature.toFixed(1)} °C</p>
          <p>Dew point: {dewpoint.toFixed(1)} °C</p>
          <p>Wind: {wind} kt {metarWind ? "(METAR)" : "(model)"}</p>
          <p>Clouds: {clouds} %</p>
          <p>Low / Mid / High: {cloudLow} / {cloudMid} / {cloudHigh} %</p>
          <p>Sun heating: {Math.round(radiation)} W/m²</p>
          <p>Precipitation: {precipitation.toFixed(1)} mm</p>
        </div>

        <div className="card">
          <h3>METAR / Info</h3>
          <p>Check current LKFR weather information</p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginTop: "10px",
            }}
          >
            <a
              href="https://metar-taf.com/metar/LKFR"
              target="_blank"
              rel="noopener noreferrer"
              className="briefingLink"
            >
              Open METAR / TAF
            </a>

            <a
              href="https://www.akfrydlant.cz/"
              target="_blank"
              rel="noopener noreferrer"
              className="briefingLink"
            >
              Open LKFR website
            </a>
          </div>
        </div>

        <div className="card">
          <h3>⚠️ Weather risks</h3>
          {hazards.length === 0 ? (
            <p className="badgeGreen">No significant hazards</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {hazards.map((h, i) => (
                <span
                  key={`${h.type}-${i}`}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "10px",
                    background: getHazardColor(h.type),
                    fontSize: "0.85rem",
                    color: "#e5eefc",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {h.icon} {h.label}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3>
            <Cloud size={18} /> Cloud base AGL
          </h3>
          <p className="big">{lcl} m</p>
        </div>

        <div className="card">
          <h3>
            <MapPinned size={18} /> Cloud base MSL
          </h3>
          <p className="big">{cloudBaseMSL} m</p>
          <p>Field elev: {FIELD_ELEVATION_MSL} m</p>
        </div>

        <div className="card">
          <h3>
            <Wind size={18} /> Wind profile
          </h3>
          <p>
            Surface: {wind} kt {windArrow} ({Math.round(windDirection)}°)
          </p>
          <p>
            850 hPa: {wind850} kt {wind850Arrow} ({Math.round(wind850Dir)}°)
          </p>
          <p>
            700 hPa: {wind700} kt {wind700Arrow} ({Math.round(wind700Dir)}°)
          </p>
        </div>

        <div className="card">
          <h3>🧭 Ground wind</h3>
          <div className="groundWindMain">
            <div className="groundWindSpeed">{wind} kt</div>
            <div className="groundWindDir">{Math.round(windDirection)}°</div>
          </div>
          <div className="groundWindSub">
            {metarWind ? "Live METAR wind from LKFR" : "Model surface wind"}
          </div>
        </div>

        <div className="card runwayCard">
          <h3>🛬 RWY / surface wind</h3>

          <div className="runwayVisualWrap">
            <svg viewBox="0 0 320 220" className="runwaySvg">
              <text x="160" y="18" className="runwayNorthLabel">
                N
              </text>

              <line
                x1="160"
                y1="24"
                x2="160"
                y2="42"
                className="runwayNorthLine"
              />

              <g transform={`rotate(${runwayRotation} 160 110)`}>
                <rect
                  x="60"
                  y="92"
                  width="200"
                  height="36"
                  rx="6"
                  className="runwayStrip"
                />

                <line
                  x1="75"
                  y1="110"
                  x2="245"
                  y2="110"
                  className="runwayCenterMark"
                />

                <text x="82" y="85" className="runwayLabel">
                  08
                </text>

                <text x="238" y="85" className="runwayLabel">
                  26
                </text>
              </g>

              <g
                transform={`rotate(${
                  (Math.round(windDirection) + 180) % 360
                } 160 110)`}
              >
                <line
                  x1="160"
                  y1="30"
                  x2="160"
                  y2="78"
                  className="windArrowLine"
                />
                <polygon
                  points="160,18 152,34 168,34"
                  className="windArrowHead"
                />
              </g>

              <circle cx="160" cy="110" r="4" className="runwayCenterDot" />
            </svg>
          </div>

          <div className="runwayReadout">
            <div>
              <strong>RWY:</strong> 08 / 26
            </div>
            <div>
              <strong>Wind:</strong> {Math.round(windDirection)}° / {wind} kt
            </div>
            <div>
              <strong>{headwind >= 0 ? "Headwind" : "Tailwind"}:</strong>{" "}
              {Math.abs(headwind)} kt
            </div>
            <div>
              <strong>Crosswind:</strong> {crosswindAbs} kt
            </div>
          </div>
        </div>

        <div className="card condition">
          <h3>
            <Plane size={18} /> Flying conditions
          </h3>
          <p className={flyingClass}>{flyingCondition}</p>
        </div>

        <div className="card">
          <h3>
            <Gauge size={18} /> Soaring index
          </h3>
          <p className="big">{soaringIndex}</p>
          <p className={soaringClass}>{soaringRating}</p>
        </div>

        <div className="card">
          <h3>
            <TrendingUp size={18} /> Expected climb
          </h3>
          <p className="big">{expectedClimb} m/s</p>
          <p className={climbClass}>{climbRating}</p>
        </div>

        <div className="card">
          <h3>
            <Thermometer size={18} /> Spread (T − Td)
          </h3>
          <p className="big">{spread.toFixed(1)} °C</p>
        </div>

        <div className="card">
          <h3>Best soaring window</h3>
          <p>VFR day: {sunriseLabel} – {sunsetLabel}</p>
          <p>Start: {thermalStart}</p>
          <p>Peak: {thermalMax}</p>
          <p>End: {thermalEnd}</p>
        </div>

        <div className="card">
          <h3>
            <ArrowUp size={18} /> Thermal top
          </h3>
          <p className="big">{thermalTop} m</p>
          <p className="small">heuristic</p>
        </div>

        <div className="card">
          <h3>XC potential</h3>
          <p className={`big ${xcClass}`}>{xcPotential}</p>
        </div>
      </div>

      <section className="chartSection">
        <div className="chartCard">
          <h3>📈 Development during the day</h3>
          <div className="chartWrap">
            <WeatherChart
              data={{
                labels: hours,
                lcl: lclArray,
                thermal: thermalArray,
                temperature: temperatureAll,
                windSurface: windSurfaceAll,
                wind850: wind850All,
                wind700: wind700All,
                windSurfaceDir: windSurfaceDirAll,
                wind850Dir: wind850DirAll,
                wind700Dir: wind700DirAll,
                sunrise: data.daily.sunrise,
                sunset: data.daily.sunset,
                currentIndex,
              }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}