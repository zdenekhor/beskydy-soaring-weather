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
const APP_VERSION = "v1.0.0";
const APP_UPDATED = "21 Mar 2026";

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
  const cloudBaseMSL = lcl + FIELD_ELEVATION_MSL;

  let expectedClimb = spread / 2.5;
  if (clouds > 70) expectedClimb *= 0.85;
  if (clouds > 85) expectedClimb *= 0.7;
  if (wind > 15) expectedClimb *= 0.85;
  expectedClimb = Number(Math.max(0, expectedClimb).toFixed(1));

  let climbRating = "🔴 Weak";
  if (expectedClimb > 2) climbRating = "🟡 Good";
  if (expectedClimb > 3) climbRating = "🟢 Very good";
  if (expectedClimb > 4) climbRating = "🔵 XC thermal";

  const thermalDrift = Math.round(wind * 0.4 + wind850 * 0.6);
  const thermalTop = lcl + 300;

  const lclArray = data.hourly.temperature_2m.map((temp: number, i: number) => {
    const td = safeArrayValue(data.hourly.dew_point_2m, i);
    return Math.round(Math.max(0, 125 * (temp - td)));
  });

  const thermalArray = data.hourly.temperature_2m.map(
    (temp: number, i: number) => {
      const td = safeArrayValue(data.hourly.dew_point_2m, i);
      const cc = safeArrayValue(data.hourly.cloud_cover, i);
      let thermal = (temp - td) / 4;

      if (cc > 70) thermal *= 0.85;
      if (cc > 85) thermal *= 0.7;

      return Math.max(0, Number(thermal.toFixed(1)));
    }
  );

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

  let soaringIndex = thermalNow * 25 + lcl / 120 - wind * 2 - clouds * 0.15;
  soaringIndex = Math.round(clamp(soaringIndex, 0, 100));

  let soaringRating = "🔴 Poor";
  if (soaringIndex > 30) soaringRating = "🟡 Weak";
  if (soaringIndex > 50) soaringRating = "🟢 Good";
  if (soaringIndex > 70) soaringRating = "🔵 XC day";

  const THERMAL_THRESHOLD = 1.5;

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
    vfrIndices.find((i: number) => thermalArray[i] > THERMAL_THRESHOLD) ?? -1;

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

  let flyingCondition = "🟡 Weak soaring conditions";
  if (wind < 8 && lcl > 800 && clouds < 60) {
    flyingCondition = "🟢 Good soaring conditions";
  }
  if (wind > 15 || clouds > 90 || lcl < 400) {
    flyingCondition = "🔴 Poor soaring conditions";
  }

  let xcPotential = "Low";
  if (expectedClimb > 2 && lcl > 800) {
    xcPotential = "Moderate";
  }
  if (expectedClimb > 3 && lcl > 1200) {
    xcPotential = "Good";
  }
  if (expectedClimb > 4 && lcl > 1500 && wind < 10) {
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
  if (expectedClimb > 2) climbClass = "badgeYellow";
  if (expectedClimb > 3) climbClass = "badgeGreen";
  if (expectedClimb > 4) climbClass = "badgeBlue";

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

  let skyType = "Mixed sky";
  let skyTypeClass = "badgeYellow";

  if (radiation < 120 && clouds < 80) {
    skyType = "Morning stable";
    skyTypeClass = "badgeYellow";
  }

  if (clouds > 90 && radiation < 150) {
    skyType = "Overcast";
    skyTypeClass = "badgeRed";
  } else if (
    radiation >= 350 &&
    spread >= 4 &&
    clouds >= 20 &&
    clouds <= 70 &&
    lcl >= 700
  ) {
    skyType = "Cu day";
    skyTypeClass = "badgeGreen";
  } else if (radiation >= 450 && spread >= 6 && clouds < 25) {
    skyType = "Blue day";
    skyTypeClass = "badgeBlue";
  } else if (
    radiation >= 250 &&
    clouds >= 20 &&
    clouds <= 50 &&
    lcl >= 600
  ) {
    skyType = "Possible Cu";
    skyTypeClass = "badgeGreen";
  }

  const hazards: { icon: string; label: string; type: string; severity: number }[] = [];

  if (radiation > 400 && clouds > 70 && spread > 5 && expectedClimb > 2.5) {
    hazards.push({ icon: "⛈", label: "Storm risk", type: "storm", severity: 6 });
  }
  if (temperature < 0) {
    hazards.push({ icon: "🧊", label: "Freezing", type: "ice", severity: 5 });
  }
  if (temperature < 2 && precipitation > 0.2) {
    hazards.push({ icon: "❄", label: "Snow", type: "snow", severity: 5 });
  }
  if (wind > 15 || wind850 > 22) {
    hazards.push({ icon: "💨", label: "Strong wind", type: "wind", severity: 4 });
  }
  if (precipitation > 0.2 || precipitationProbability > 45) {
    hazards.push({ icon: "🌧", label: "Rain", type: "rain", severity: 3 });
  }
  if (lcl < 500) {
    hazards.push({ icon: "☁", label: "Low cloud base", type: "cloud", severity: 2 });
  }
  if (clouds > 85) {
    hazards.push({ icon: "🌫", label: "Overcast risk", type: "overcast", severity: 1 });
  }

  hazards.sort((a, b) => b.severity - a.severity);

  let semaphore = "🟡 CAUTION";
  let semaphoreClass = "badgeYellow";
  let semaphoreNote = "Check wind, cloud base and current development.";

  const hasStorm = hazards.some((h) => h.type === "storm");
  const hasRain = hazards.some((h) => h.type === "rain");
  const hasStrongWind = hazards.some((h) => h.type === "wind");
  const hasLowBase = hazards.some((h) => h.type === "cloud");
  const hasOvercast = hazards.some((h) => h.type === "overcast");
  const hasIce = hazards.some((h) => h.type === "ice");
  const hasSnow = hazards.some((h) => h.type === "snow");

  if (
    hasStorm ||
    hasIce ||
    hasSnow ||
    wind > 22 ||
    lcl < 350 ||
    (hasRain && clouds > 85)
  ) {
    semaphore = "🔴 NO GO";
    semaphoreClass = "badgeRed";
    semaphoreNote = "Unsafe or unsuitable conditions for normal soaring.";
  } else if (
    expectedClimb > 2.5 &&
    lcl > 800 &&
    wind < 12 &&
    clouds < 70 &&
    !hasRain &&
    !hasStrongWind &&
    !hasLowBase &&
    !hasOvercast
  ) {
    semaphore = "🟢 GO";
    semaphoreClass = "badgeGreen";
    semaphoreNote = "Favourable soaring setup with manageable risk.";
  }

  const summaryParts: string[] = [];

  if (expectedClimb < 1.5) {
    summaryParts.push("Weak soaring day");
  } else if (expectedClimb < 3) {
    summaryParts.push("Moderate thermals");
  } else {
    summaryParts.push("Good soaring day");
  }

  if (lcl < 600) {
    summaryParts.push("Low base");
  }

  if (clouds > 80) {
    summaryParts.push("Overcast risk");
  }

  if (wind > 12) {
    summaryParts.push("Stronger wind");
  }

  if (expectedClimb > 3 && lcl > 1200) {
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
              semaphore.includes("GO")
                ? "1px solid rgba(34,197,94,0.35)"
                : semaphore.includes("NO GO")
                ? "1px solid rgba(239,68,68,0.35)"
                : "1px solid rgba(250,204,21,0.35)",
            boxShadow: semaphore.includes("GO")
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
      href="https://www.lkfr.cz/"
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