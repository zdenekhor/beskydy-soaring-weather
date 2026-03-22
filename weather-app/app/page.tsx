import Link from "next/link";
import WeatherChart from "../components/WeatherChart";
import {
  Cloud,
  Wind,
  Plane,
  Gauge,
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

type Lang = "cs" | "en";

type Translation = {
  locale: string;
  title: string;
  subtitle: string;
  updated: string;
  forecastHour: string;
  version: string;
  appUpdate: string;
  local: string;

  language: string;
  czech: string;
  english: string;

  flightSemaphore: string;
  pilotComment: string;
  weatherRisks: string;
  bestSoaringWindow: string;
  soaringIndex: string;
  flyingConditions: string;
  developmentDuringDay: string;
  skyType: string;
  cloudBaseAgl: string;
  cloudBaseMsl: string;
  thermalTop: string;
  thermalDrift: string;
  spread: string;
  windProfile: string;
  weather: string;
  metarInfo: string;

  climb: string;
  baseAgl: string;
  wind: string;
  xc: string;
  potential: string;

  start: string;
  peak: string;
  end: string;
  vfrDay: string;
  fieldElevation: string;
  heuristic: string;

  temperature: string;
  dewPoint: string;
  clouds: string;
  lowMidHigh: string;
  sunHeating: string;
  precipitation: string;

  runwayWind: string;
  groundWind: string;
  headwind: string;
  tailwind: string;
  crosswind: string;

  openMetar: string;
  openWebsite: string;
  checkCurrentWeather: string;

  noSignificantHazards: string;

  liveMetarWind: string;
  modelSurfaceWind: string;

  go: string;
  caution: string;
  noGo: string;

  semaphoreGoNote: string;
  semaphoreCautionNote: string;
  semaphoreNoGoNote: string;

  weak: string;
  usable: string;
  good: string;
  strong: string;

  poor: string;
  weakDay: string;
  goodDay: string;
  xcDay: string;

  flyingGood: string;
  flyingWeak: string;
  flyingPoor: string;

  low: string;
  moderate: string;
  xcPotentialGood: string;
  xcPotentialDay: string;

  skyLowOvercast: string;
  skyOvercast: string;
  skyCuDay: string;
  skyBlueDay: string;
  skyUsable: string;
  skyMixed: string;
  thermalSkyEstimate: string;

  stormRisk: string;
  freezing: string;
  snow: string;
  strongWind: string;
  rain: string;
  lowCloudBase: string;
  overcastRisk: string;

  summaryWeak: string;
  summaryModerate: string;
  summaryGood: string;
  summaryLowBase: string;
  summaryWindy: string;
  summaryCu: string;
  summaryXc: string;

  pilotNoGo: string;
  pilotFlyable: string;
  pilotMarginal: string;

  pilotConvective: string;
  pilotBlue: string;
  pilotOvercast: string;
  pilotMixed: string;

  pilotStrongerClimbs: string;
  pilotUsableClimbs: string;
  pilotWeakClimbs: string;

  pilotBaseGood: string;
  pilotBaseModerate: string;
  pilotBaseLow: string;

  pilotBestWindow: string;
  pilotPeakNear: string;

  pilotWindLight: string;
  pilotWindManageable: string;
  pilotWindCaution: string;

  pilotXcVeryGood: string;
  pilotXcGood: string;
  pilotXcLocal: string;
  pilotXcLocalOnly: string;

  pilotStormMain: string;
  pilotShowers: string;
  pilotWatchCloud: string;
  pilotWatchWind: string;

  pilotRiskHigh: string;
  pilotRiskModerate: string;
  pilotRiskManageable: string;

  today: string;
  tomorrow: string;
  dayPlus2: string;

  currentForecastHour: string;
  cloudBaseShort: string;
  thermalShort: string;
  surfaceWind: string;
  wind850: string;
  wind700: string;
  sunrise: string;
  sunset: string;

  surface: string;
};

const FIELD_ELEVATION_MSL = 439;
const APP_VERSION = "v1.3.0";
const APP_UPDATED = "22 Mar 2026";

const translations: Record<Lang, Translation> = {
  cs: {
    locale: "cs-CZ",
    title: "SPL Počasí LKFR – Beskydy",
    subtitle: "Frýdlant nad Ostravicí",
    updated: "Aktualizováno",
    forecastHour: "Hodina předpovědi",
    version: "Verze",
    appUpdate: "Aktualizace aplikace",
    local: "místního času",

    language: "Jazyk",
    czech: "Čeština",
    english: "English",

    flightSemaphore: "Letový semafor",
    pilotComment: "Pilotní komentář",
    weatherRisks: "Meteorologická rizika",
    bestSoaringWindow: "Nejlepší okno pro plachtění",
    soaringIndex: "Soaring index",
    flyingConditions: "Letové podmínky",
    developmentDuringDay: "Vývoj během dne",
    skyType: "Typ oblohy",
    cloudBaseAgl: "Základna AGL",
    cloudBaseMsl: "Základna MSL",
    thermalTop: "Vrchol termiky",
    thermalDrift: "Drift termiky",
    spread: "Rozdíl T − Td",
    windProfile: "Profil větru",
    weather: "Počasí",
    metarInfo: "METAR / Informace",

    climb: "Stoupání",
    baseAgl: "Základna AGL",
    wind: "Vítr",
    xc: "Přelet",
    potential: "Potenciál",

    start: "Začátek",
    peak: "Vrchol",
    end: "Konec",
    vfrDay: "VFR den",
    fieldElevation: "Nadmořská výška letiště",
    heuristic: "heuristika",

    temperature: "Teplota",
    dewPoint: "Rosný bod",
    clouds: "Oblačnost",
    lowMidHigh: "Nízká / Střední / Vysoká",
    sunHeating: "Sluneční ohřev",
    precipitation: "Srážky",

    runwayWind: "RWY / přízemní vítr",
    groundWind: "Přízemní vítr",
    headwind: "Protivítr",
    tailwind: "Zadní vítr",
    crosswind: "Boční vítr",

    openMetar: "Otevřít METAR / TAF",
    openWebsite: "Otevřít web LKFR",
    checkCurrentWeather: "Zkontrolovat aktuální počasí LKFR",

    noSignificantHazards: "Bez významných rizik",

    liveMetarWind: "Aktuální vítr z METARu LKFR",
    modelSurfaceWind: "Modelový přízemní vítr",

    go: "🟢 GO",
    caution: "🟡 POZOR",
    noGo: "🔴 NO GO",

    semaphoreGoNote: "Příznivé podmínky pro plachtění při přijatelném riziku.",
    semaphoreCautionNote: "Zkontrolujte vítr, základnu a aktuální vývoj.",
    semaphoreNoGoNote: "Nevhodné nebo nebezpečné podmínky pro běžné plachtění.",

    weak: "🔴 Slabé",
    usable: "🟡 Použitelné",
    good: "🟢 Dobré",
    strong: "🔵 Silné",

    poor: "🔴 Slabé",
    weakDay: "🟡 Slabé",
    goodDay: "🟢 Dobré",
    xcDay: "🔵 XC den",

    flyingGood: "🟢 Dobré podmínky pro plachtění",
    flyingWeak: "🟡 Slabší podmínky pro plachtění",
    flyingPoor: "🔴 Špatné podmínky pro plachtění",

    low: "Nízký",
    moderate: "Střední",
    xcPotentialGood: "Dobrý",
    xcPotentialDay: "XC den",

    skyLowOvercast: "Nízká deka",
    skyOvercast: "Zataženo",
    skyCuDay: "Kupovitý den",
    skyBlueDay: "Modrý den",
    skyUsable: "Použitelná termická obloha",
    skyMixed: "Smíšená termická obloha",
    thermalSkyEstimate: "odhad termické oblohy",

    stormRisk: "Riziko bouřek",
    freezing: "Mrznutí",
    snow: "Sníh",
    strongWind: "Silný vítr",
    rain: "Déšť",
    lowCloudBase: "Nízká základna",
    overcastRisk: "Riziko zatažení",

    summaryWeak: "Slabý termický den",
    summaryModerate: "Střední termika",
    summaryGood: "Dobrý termický den",
    summaryLowBase: "Nízká základna",
    summaryWindy: "Větrno",
    summaryCu: "Kupovitý vývoj",
    summaryXc: "Potenciál pro přelet",

    pilotNoGo: "Den nevhodný pro běžné plachtění",
    pilotFlyable: "Létatelný termický den",
    pilotMarginal: "Hraniční den, vyžaduje úsudek pilota",

    pilotConvective: "kupovitá oblačnost by měla podporovat použitelnou termiku",
    pilotBlue: "modrá termika s malým množstvím oblačnosti",
    pilotOvercast: "oblačnost tlumí ohřev a stoupání",
    pilotMixed: "smíšená obloha s nerovnoměrným vývojem termiky",

    pilotStrongerClimbs: "silnější stoupání kolem",
    pilotUsableClimbs: "použitelné stoupání kolem",
    pilotWeakClimbs: "slabé stoupání kolem",

    pilotBaseGood: "základny vypadají dobře kolem",
    pilotBaseModerate: "střední základna kolem",
    pilotBaseLow: "spíše nízká základna kolem",

    pilotBestWindow: "nejlepší okno přibližně",
    pilotPeakNear: "vrchol kolem",

    pilotWindLight: "přízemní vítr je slabý",
    pilotWindManageable: "přízemní vítr je přijatelný",
    pilotWindCaution: "přízemní vítr si zaslouží pozornost",

    pilotXcVeryGood: "velmi dobrý potenciál pro přelet",
    pilotXcGood: "dobrý potenciál pro přelet",
    pilotXcLocal: "možný kratší místní přelet",
    pilotXcLocalOnly: "spíše vhodné pro místní létání než přelet",

    pilotStormMain: "hlavním omezujícím faktorem je riziko bouřek",
    pilotShowers: "přeháňky mohou přerušovat den",
    pilotWatchCloud: "hlídejte rozšiřování oblačnosti a ztrátu slunce",
    pilotWatchWind: "hlídejte profil větru a drift",

    pilotRiskHigh: "celkové provozní riziko je vysoké",
    pilotRiskModerate: "celkové riziko je střední",
    pilotRiskManageable: "celkové riziko je přijatelné",

    today: "Dnes",
    tomorrow: "Zítra",
    dayPlus2: "Pozítří",

    currentForecastHour: "Aktuální hodina předpovědi",
    cloudBaseShort: "Základna",
    thermalShort: "Termika",
    surfaceWind: "Přízemní vítr",
    wind850: "Vítr 850 hPa",
    wind700: "Vítr 700 hPa",
    sunrise: "Východ slunce",
    sunset: "Západ slunce",

    surface: "Přízemí",
  },

  en: {
    locale: "en-GB",
    title: "SPL Weather LKFR – Beskydy",
    subtitle: "Frýdlant nad Ostravicí",
    updated: "Updated",
    forecastHour: "Forecast hour",
    version: "Version",
    appUpdate: "App update",
    local: "local time",

    language: "Language",
    czech: "Čeština",
    english: "English",

    flightSemaphore: "Flight semaphore",
    pilotComment: "Pilot comment",
    weatherRisks: "Weather risks",
    bestSoaringWindow: "Best soaring window",
    soaringIndex: "Soaring index",
    flyingConditions: "Flying conditions",
    developmentDuringDay: "Development during the day",
    skyType: "Sky type",
    cloudBaseAgl: "Cloud base AGL",
    cloudBaseMsl: "Cloud base MSL",
    thermalTop: "Thermal top",
    thermalDrift: "Thermal drift",
    spread: "Spread (T − Td)",
    windProfile: "Wind profile",
    weather: "Weather",
    metarInfo: "METAR / Info",

    climb: "Climb",
    baseAgl: "Base AGL",
    wind: "Wind",
    xc: "XC",
    potential: "Potential",

    start: "Start",
    peak: "Peak",
    end: "End",
    vfrDay: "VFR day",
    fieldElevation: "Field elev",
    heuristic: "heuristic",

    temperature: "Temperature",
    dewPoint: "Dew point",
    clouds: "Clouds",
    lowMidHigh: "Low / Mid / High",
    sunHeating: "Sun heating",
    precipitation: "Precipitation",

    runwayWind: "RWY / surface wind",
    groundWind: "Ground wind",
    headwind: "Headwind",
    tailwind: "Tailwind",
    crosswind: "Crosswind",

    openMetar: "Open METAR / TAF",
    openWebsite: "Open LKFR website",
    checkCurrentWeather: "Check current LKFR weather information",

    noSignificantHazards: "No significant hazards",

    liveMetarWind: "Live METAR wind from LKFR",
    modelSurfaceWind: "Model surface wind",

    go: "🟢 GO",
    caution: "🟡 CAUTION",
    noGo: "🔴 NO GO",

    semaphoreGoNote: "Favourable soaring setup with manageable risk.",
    semaphoreCautionNote: "Check wind, cloud base and current development.",
    semaphoreNoGoNote: "Unsafe or unsuitable conditions for normal soaring.",

    weak: "🔴 Weak",
    usable: "🟡 Usable",
    good: "🟢 Good",
    strong: "🔵 Strong",

    poor: "🔴 Poor",
    weakDay: "🟡 Weak",
    goodDay: "🟢 Good",
    xcDay: "🔵 XC day",

    flyingGood: "🟢 Good soaring conditions",
    flyingWeak: "🟡 Weak soaring conditions",
    flyingPoor: "🔴 Poor soaring conditions",

    low: "Low",
    moderate: "Moderate",
    xcPotentialGood: "Good",
    xcPotentialDay: "XC day",

    skyLowOvercast: "Low overcast",
    skyOvercast: "Overcast",
    skyCuDay: "Cu day",
    skyBlueDay: "Blue day",
    skyUsable: "Usable thermal sky",
    skyMixed: "Mixed thermal sky",
    thermalSkyEstimate: "thermal sky estimate",

    stormRisk: "Storm risk",
    freezing: "Freezing",
    snow: "Snow",
    strongWind: "Strong wind",
    rain: "Rain",
    lowCloudBase: "Low cloud base",
    overcastRisk: "Overcast risk",

    summaryWeak: "Weak soaring day",
    summaryModerate: "Moderate thermals",
    summaryGood: "Good soaring day",
    summaryLowBase: "Low base",
    summaryWindy: "Windy",
    summaryCu: "Cu development",
    summaryXc: "XC potential",

    pilotNoGo: "No-go for normal soaring",
    pilotFlyable: "Flyable soaring day",
    pilotMarginal: "Marginal day, needs pilot judgement",

    pilotConvective: "convective cloud field should support usable thermals",
    pilotBlue: "blue thermal conditions with little cloud marking",
    pilotOvercast: "cloud cover suppresses heating and climb",
    pilotMixed: "mixed sky with uneven thermal development",

    pilotStrongerClimbs: "stronger climbs around",
    pilotUsableClimbs: "usable climbs around",
    pilotWeakClimbs: "weak climbs around",

    pilotBaseGood: "bases look good near",
    pilotBaseModerate: "moderate base near",
    pilotBaseLow: "rather low base near",

    pilotBestWindow: "best window roughly",
    pilotPeakNear: "peak near",

    pilotWindLight: "surface wind is light",
    pilotWindManageable: "surface wind is manageable",
    pilotWindCaution: "surface wind deserves caution",

    pilotXcVeryGood: "very good XC potential",
    pilotXcGood: "good XC potential",
    pilotXcLocal: "possible local XC",
    pilotXcLocalOnly: "better suited to local flying than XC",

    pilotStormMain: "storm risk is the main limiting factor",
    pilotShowers: "showers may interrupt the day",
    pilotWatchCloud: "watch for cloud spreading and loss of sun",
    pilotWatchWind: "watch the wind profile and drift",

    pilotRiskHigh: "overall operational risk is high",
    pilotRiskModerate: "overall risk is moderate",
    pilotRiskManageable: "overall risk is manageable",

    today: "Today",
    tomorrow: "Tomorrow",
    dayPlus2: "Day +2",

    currentForecastHour: "Current forecast hour",
    cloudBaseShort: "Cloud base",
    thermalShort: "Thermal",
    surfaceWind: "Surface wind",
    wind850: "Wind 850 hPa",
    wind700: "Wind 700 hPa",
    sunrise: "Sunrise",
    sunset: "Sunset",

    surface: "Surface",
  },
};

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

  const res = await fetch(url, { cache: "no-store" });

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

function formatHourMinute(dateString: string, locale: string) {
  return new Date(dateString).toLocaleTimeString(locale, {
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

function cloudSuppressionFactor(
  low: number,
  mid: number,
  high: number,
  radiation: number,
  spread: number
) {
  const isConvectiveCloudField =
    low >= 20 && low <= 85 && radiation >= 250 && spread >= 3;

  let penalty = low * 0.0065 + mid * 0.0025 + high * 0.0015;

  if (isConvectiveCloudField) penalty -= 0.12;
  if (low > 85 && radiation < 180) penalty += 0.2;

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

function detectSkyType(
  params: {
    cloudLow: number;
    cloudMid: number;
    cloudHigh: number;
    clouds: number;
    radiation: number;
    spread: number;
    lcl: number;
  },
  t: Translation
) {
  const { cloudLow, cloudMid, clouds, radiation, spread, lcl } = params;

  const isOvercast = cloudLow > 80 && radiation < 180 && spread < 7;
  const isLowOvercast = cloudLow > 75 && radiation < 160;
  const isBlueDay =
    radiation >= 430 && spread >= 6 && cloudLow < 20 && cloudMid < 25;
  const isCuDay =
    cloudLow >= 20 &&
    cloudLow <= 85 &&
    radiation >= 260 &&
    spread >= 3.5 &&
    lcl >= 700 &&
    !(cloudLow > 80 && radiation < 180);
  const isUsableThermalSky =
    radiation >= 220 && spread >= 3 && lcl >= 600 && !isOvercast;

  if (isLowOvercast) {
    return {
      label: t.skyLowOvercast,
      className: "badgeRed",
      convective: false,
      overcast: true,
    };
  }

  if (isOvercast || (clouds > 90 && radiation < 150)) {
    return {
      label: t.skyOvercast,
      className: "badgeRed",
      convective: false,
      overcast: true,
    };
  }

  if (isCuDay) {
    return {
      label: t.skyCuDay,
      className: "badgeGreen",
      convective: true,
      overcast: false,
    };
  }

  if (isBlueDay) {
    return {
      label: t.skyBlueDay,
      className: "badgeBlue",
      convective: false,
      overcast: false,
    };
  }

  if (isUsableThermalSky) {
    return {
      label: t.skyUsable,
      className: "badgeGreen",
      convective: false,
      overcast: false,
    };
  }

  return {
    label: t.skyMixed,
    className: "badgeYellow",
    convective: false,
    overcast: false,
  };
}

function buildPilotComment(params: {
  semaphore: string;
  expectedClimb: number;
  lcl: number;
  thermalStart: string;
  thermalMax: string;
  thermalEnd: string;
  wind: number;
  crosswindAbs: number;
  skyType: string;
  xcPotential: string;
  operationalRisk: number;
  hasRain: boolean;
  hasStorm: boolean;
  hasOvercast: boolean;
  hasStrongWind: boolean;
  t: Translation;
}) {
  const {
    semaphore,
    expectedClimb,
    lcl,
    thermalStart,
    thermalMax,
    thermalEnd,
    wind,
    crosswindAbs,
    skyType,
    xcPotential,
    operationalRisk,
    hasRain,
    hasStorm,
    hasOvercast,
    hasStrongWind,
    t,
  } = params;

  const parts: string[] = [];

  if (semaphore.includes("NO GO")) {
    parts.push(t.pilotNoGo);
  } else if (semaphore.includes("GO") || semaphore.includes("🟢")) {
    parts.push(t.pilotFlyable);
  } else {
    parts.push(t.pilotMarginal);
  }

  if (skyType === t.skyCuDay) {
    parts.push(t.pilotConvective);
  } else if (skyType === t.skyBlueDay) {
    parts.push(t.pilotBlue);
  } else if (skyType === t.skyOvercast || skyType === t.skyLowOvercast) {
    parts.push(t.pilotOvercast);
  } else {
    parts.push(t.pilotMixed);
  }

  if (expectedClimb >= 2.8) {
    parts.push(`${t.pilotStrongerClimbs} ${expectedClimb.toFixed(1)} m/s`);
  } else if (expectedClimb >= 1.5) {
    parts.push(`${t.pilotUsableClimbs} ${expectedClimb.toFixed(1)} m/s`);
  } else {
    parts.push(`${t.pilotWeakClimbs} ${expectedClimb.toFixed(1)} m/s`);
  }

  if (lcl >= 1400) {
    parts.push(`${t.pilotBaseGood} ${lcl} m AGL`);
  } else if (lcl >= 900) {
    parts.push(`${t.pilotBaseModerate} ${lcl} m AGL`);
  } else {
    parts.push(`${t.pilotBaseLow} ${lcl} m AGL`);
  }

  if (thermalStart !== "-" && thermalEnd !== "-") {
    parts.push(
      `${t.pilotBestWindow} ${thermalStart}–${thermalEnd}, ${t.pilotPeakNear} ${thermalMax}`
    );
  }

  if (wind <= 8 && crosswindAbs <= 5) {
    parts.push(t.pilotWindLight);
  } else if (wind <= 14 && crosswindAbs <= 10) {
    parts.push(t.pilotWindManageable);
  } else {
    parts.push(t.pilotWindCaution);
  }

  if (xcPotential === t.xcPotentialDay) {
    parts.push(t.pilotXcVeryGood);
  } else if (xcPotential === t.xcPotentialGood) {
    parts.push(t.pilotXcGood);
  } else if (xcPotential === t.moderate) {
    parts.push(t.pilotXcLocal);
  } else {
    parts.push(t.pilotXcLocalOnly);
  }

  if (hasStorm) {
    parts.push(t.pilotStormMain);
  } else if (hasRain) {
    parts.push(t.pilotShowers);
  } else if (hasOvercast) {
    parts.push(t.pilotWatchCloud);
  } else if (hasStrongWind) {
    parts.push(t.pilotWatchWind);
  }

  if (operationalRisk >= 60) {
    parts.push(t.pilotRiskHigh);
  } else if (operationalRisk >= 35) {
    parts.push(t.pilotRiskModerate);
  } else {
    parts.push(t.pilotRiskManageable);
  }

  return parts.join(". ") + ".";
}

export default async function Home({
  searchParams,
}: {
  searchParams?: { lang?: string };
}) {
  const lang: Lang = searchParams?.lang === "en" ? "en" : "cs";
  const t = translations[lang];

  const data = await getWeather();
  const metarWind = await getMetarWind("LKFR");

  const now = new Date();

  const formattedDate = now.toLocaleDateString(t.locale, {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedTime = now.toLocaleTimeString(t.locale, {
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

  const sunriseLabel = sunriseRaw ? formatHourMinute(sunriseRaw, t.locale) : "-";
  const sunsetLabel = sunsetRaw ? formatHourMinute(sunsetRaw, t.locale) : "-";

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
  const cloudFactor = cloudSuppressionFactor(
    cloudLow,
    cloudMid,
    cloudHigh,
    radiation,
    spread
  );
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
    const cf = cloudSuppressionFactor(low, mid, high, radNow, localSpread);
    const rf = precipitationSuppressionFactor(rain, rainProb);
    const wf = windSuppressionFactor(sfcWind, w850Now, w700Now);

    const score = clamp(raw * cf * rf * wf, 0, 100);
    return Number(estimateClimbFromScore(score).toFixed(1));
  });

  const hours = data.hourly.time.map((tStr: string) => {
    const date = new Date(tStr);
    return date.toLocaleTimeString(t.locale, {
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

  const soaringIndex = Math.round(
    clamp(
      effectiveThermalScore * 0.75 +
        clamp(lcl / 20, 0, 20) -
        clamp(crosswindAbs * 1.2, 0, 12),
      0,
      100
    )
  );

  let soaringRating = t.poor;
  if (soaringIndex > 30) soaringRating = t.weakDay;
  if (soaringIndex > 50) soaringRating = t.goodDay;
  if (soaringIndex > 70) soaringRating = t.xcDay;

  let climbRating = t.weak;
  if (expectedClimb > 1.2) climbRating = t.usable;
  if (expectedClimb > 2.0) climbRating = t.good;
  if (expectedClimb > 3.0) climbRating = t.strong;

  const THERMAL_THRESHOLD = 1.2;

  const sunriseTs = sunriseTime ? sunriseTime.getTime() : null;
  const sunsetTs = sunsetTime ? sunsetTime.getTime() : null;

  const vfrIndices = data.hourly.time
    .map((tStr: string, i: number) => {
      const ts = new Date(tStr).getTime();
      const sameDay = getDateKey(tStr) === currentDateKey;
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

  const sky = detectSkyType(
    {
      cloudLow,
      cloudMid,
      cloudHigh,
      clouds,
      radiation,
      spread,
      lcl,
    },
    t
  );

  const hazards: { icon: string; label: string; type: string; severity: number }[] = [];

  if (
    precipitationProbability > 60 &&
    cloudLow > 50 &&
    cloudMid > 50 &&
    expectedClimb > 2.2
  ) {
    hazards.push({
      icon: "⛈",
      label: t.stormRisk,
      type: "storm",
      severity: 6,
    });
  }
  if (temperature < 0) {
    hazards.push({
      icon: "🧊",
      label: t.freezing,
      type: "ice",
      severity: 5,
    });
  }
  if (temperature < 2 && precipitation > 0.2) {
    hazards.push({
      icon: "❄",
      label: t.snow,
      type: "snow",
      severity: 5,
    });
  }
  if (wind > 15 || wind850 > 22 || crosswindAbs > 12) {
    hazards.push({
      icon: "💨",
      label: t.strongWind,
      type: "wind",
      severity: 4,
    });
  }
  if (precipitation > 0.2 || precipitationProbability > 45) {
    hazards.push({
      icon: "🌧",
      label: t.rain,
      type: "rain",
      severity: 3,
    });
  }
  if (lcl < 500 || (cloudLow > 75 && radiation < 180)) {
    hazards.push({
      icon: "☁",
      label: t.lowCloudBase,
      type: "cloud",
      severity: 2,
    });
  }
  if (sky.overcast) {
    hazards.push({
      icon: "🌫",
      label: t.overcastRisk,
      type: "overcast",
      severity: 1,
    });
  }

  hazards.sort((a, b) => b.severity - a.severity);

  const hasStorm = hazards.some((h) => h.type === "storm");
  const hasRain = hazards.some((h) => h.type === "rain");
  const hasStrongWind = hazards.some((h) => h.type === "wind");
  const hasOvercast = hazards.some((h) => h.type === "overcast");
  const hasIce = hazards.some((h) => h.type === "ice");
  const hasSnow = hazards.some((h) => h.type === "snow");

  const operationalRisk = Math.round(
    clamp(
      (hasStorm ? 35 : 0) +
        (hasRain ? 18 : 0) +
        clamp(crosswindAbs * 2, 0, 20) +
        clamp(wind > 0 ? wind * 1.2 : 0, 0, 20) +
        clamp((sky.overcast ? 18 : 0) + (cloudLow > 70 ? 8 : 0), 0, 18),
      0,
      100
    )
  );

  let flyingCondition = t.flyingWeak;
  if (effectiveThermalScore >= 60 && operationalRisk < 35) {
    flyingCondition = t.flyingGood;
  } else if (effectiveThermalScore < 30 || operationalRisk >= 60) {
    flyingCondition = t.flyingPoor;
  }

  let xcPotential = t.low;
  if (effectiveThermalScore >= 40 && lcl > 900) xcPotential = t.moderate;
  if (effectiveThermalScore >= 60 && lcl > 1200 && operationalRisk < 40) {
    xcPotential = t.xcPotentialGood;
  }
  if (
    effectiveThermalScore >= 75 &&
    lcl > 1500 &&
    wind < 12 &&
    operationalRisk < 30
  ) {
    xcPotential = t.xcPotentialDay;
  }

  let semaphore = t.caution;
  let semaphoreClass = "badgeYellow";
  let semaphoreNote = t.semaphoreCautionNote;

  if (
    operationalRisk >= 70 ||
    lcl < 350 ||
    crosswindAbs > 18 ||
    hasStorm ||
    hasIce ||
    hasSnow
  ) {
    semaphore = t.noGo;
    semaphoreClass = "badgeRed";
    semaphoreNote = t.semaphoreNoGoNote;
  } else if (
    effectiveThermalScore >= 60 &&
    operationalRisk < 35 &&
    lcl > 800
  ) {
    semaphore = t.go;
    semaphoreClass = "badgeGreen";
    semaphoreNote = t.semaphoreGoNote;
  }

  const forecastTimeLabel = data.hourly.time[currentIndex]
    ? new Date(data.hourly.time[currentIndex]).toLocaleString(t.locale, {
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
  if (xcPotential === t.moderate) xcClass = "badgeYellow";
  if (xcPotential === t.xcPotentialGood) xcClass = "badgeGreen";
  if (xcPotential === t.xcPotentialDay) xcClass = "badgeBlue";

  const summaryParts: string[] = [];
  if (effectiveThermalScore < 30) summaryParts.push(t.summaryWeak);
  else if (effectiveThermalScore < 60) summaryParts.push(t.summaryModerate);
  else summaryParts.push(t.summaryGood);

  if (lcl < 600) summaryParts.push(t.summaryLowBase);
  if (sky.overcast) summaryParts.push(t.overcastRisk);
  if (wind > 12 || crosswindAbs > 10) summaryParts.push(t.summaryWindy);
  if (sky.convective) summaryParts.push(t.summaryCu);
  if (xcPotential === t.xcPotentialGood || xcPotential === t.xcPotentialDay) {
    summaryParts.push(t.summaryXc);
  }

  const flightSummary = summaryParts.join(" • ");

  const pilotComment = buildPilotComment({
    semaphore,
    expectedClimb,
    lcl,
    thermalStart,
    thermalMax,
    thermalEnd,
    wind,
    crosswindAbs,
    skyType: sky.label,
    xcPotential,
    operationalRisk,
    hasRain,
    hasStorm,
    hasOvercast,
    hasStrongWind,
    t,
  });

  const topStatusBg = semaphore.includes("NO GO")
    ? "linear-gradient(135deg, rgba(127,29,29,0.92), rgba(69,10,10,0.96))"
    : semaphore.includes("GO")
    ? "linear-gradient(135deg, rgba(20,83,45,0.92), rgba(5,46,22,0.96))"
    : "linear-gradient(135deg, rgba(120,53,15,0.92), rgba(68,35,6,0.96))";

  return (
    <main className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 10px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <span style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
            {t.language}:
          </span>

          <Link
            href="?lang=cs"
            style={{
              padding: "4px 8px",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#fff",
              background: lang === "cs" ? "rgba(59,130,246,0.35)" : "transparent",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            CZ
          </Link>

          <Link
            href="?lang=en"
            style={{
              padding: "4px 8px",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#fff",
              background: lang === "en" ? "rgba(59,130,246,0.35)" : "transparent",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            EN
          </Link>
        </div>
      </div>

      <h1>{t.title}</h1>
      <h2>{t.subtitle}</h2>

      <p className="metaLine">
        {formattedDate} • {t.updated} {formattedTime} {t.local} • {t.forecastHour}{" "}
        {forecastTimeLabel} • {t.version} {APP_VERSION} • {t.appUpdate}{" "}
        {APP_UPDATED}
      </p>

      <div
        className="card"
        style={{
          background: topStatusBg,
          border: "1px solid rgba(255,255,255,0.12)",
          marginBottom: "18px",
          padding: "18px",
          borderRadius: "18px",
          boxShadow: "0 14px 34px rgba(0,0,0,0.24)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.82rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                opacity: 0.78,
                marginBottom: "6px",
              }}
            >
              {t.flightSemaphore}
            </div>
            <div
              className={semaphoreClass}
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                lineHeight: 1.1,
              }}
            >
              {semaphore}
            </div>
            <div style={{ marginTop: "8px", color: "#dbe7fb" }}>
              {semaphoreNote}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "12px",
              flex: 1,
              minWidth: "280px",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.09)",
                borderRadius: "14px",
                padding: "12px",
              }}
            >
              <div style={{ fontSize: "0.78rem", opacity: 0.8 }}>{t.climb}</div>
              <div style={{ fontSize: "1.7rem", fontWeight: 800 }}>
                {expectedClimb} m/s
              </div>
              <div className={climbClass}>{climbRating}</div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.09)",
                borderRadius: "14px",
                padding: "12px",
              }}
            >
              <div style={{ fontSize: "0.78rem", opacity: 0.8 }}>{t.baseAgl}</div>
              <div style={{ fontSize: "1.7rem", fontWeight: 800 }}>{lcl} m</div>
              <div className={sky.className}>{sky.label}</div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.09)",
                borderRadius: "14px",
                padding: "12px",
              }}
            >
              <div style={{ fontSize: "0.78rem", opacity: 0.8 }}>{t.wind}</div>
              <div style={{ fontSize: "1.7rem", fontWeight: 800 }}>{wind} kt</div>
              <div style={{ color: "#dbe7fb" }}>
                {Math.round(windDirection)}° {windArrow}
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.09)",
                borderRadius: "14px",
                padding: "12px",
              }}
            >
              <div style={{ fontSize: "0.78rem", opacity: 0.8 }}>{t.xc}</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 800 }}>
                {xcPotential}
              </div>
              <div className={xcClass}>{t.potential}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="summaryBox" style={{ marginBottom: "16px" }}>
        {flightSummary}
      </div>

      <div
        className="card"
        style={{
          marginBottom: "18px",
          borderLeft: "4px solid rgba(96,165,250,0.9)",
          background: "rgba(15,23,42,0.88)",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>📝 {t.pilotComment}</h3>
        <p style={{ lineHeight: 1.7, color: "#dbe7fb", margin: 0 }}>
          {pilotComment}
        </p>
      </div>

      <div className="grid" style={{ marginBottom: "18px" }}>
        <div className="card">
          <h3>⚠️ {t.weatherRisks}</h3>
          {hazards.length === 0 ? (
            <p className="badgeGreen">{t.noSignificantHazards}</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {hazards.map((h, i) => (
                <span
                  key={`${h.type}-${i}`}
                  style={{
                    padding: "7px 11px",
                    borderRadius: "999px",
                    background: getHazardColor(h.type),
                    fontSize: "0.86rem",
                    color: "#e5eefc",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontWeight: 600,
                  }}
                >
                  {h.icon} {h.label}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3>{t.bestSoaringWindow}</h3>
          <p>
            {t.vfrDay}: {sunriseLabel} – {sunsetLabel}
          </p>
          <p>
            {t.start}: {thermalStart}
          </p>
          <p>
            {t.peak}: {thermalMax}
          </p>
          <p>
            {t.end}: {thermalEnd}
          </p>
        </div>

        <div className="card">
          <h3>
            <Gauge size={18} /> {t.soaringIndex}
          </h3>
          <p className="big">{soaringIndex}</p>
          <p className={soaringClass}>{soaringRating}</p>
        </div>

        <div className="card">
          <h3>
            <Plane size={18} /> {t.flyingConditions}
          </h3>
          <p className={flyingClass}>{flyingCondition}</p>
        </div>
      </div>

      <section className="chartSection" style={{ marginBottom: "18px" }}>
        <div
          className="chartCard"
          style={{
            borderRadius: "20px",
            boxShadow: "0 16px 36px rgba(0,0,0,0.18)",
          }}
        >
          <h3 style={{ marginBottom: "14px" }}>📈 {t.developmentDuringDay}</h3>
          <div className="chartWrap">
            <WeatherChart
              lang={lang}
              labelsText={{
                today: t.today,
                tomorrow: t.tomorrow,
                dayPlus2: t.dayPlus2,
                sunrise: t.sunrise,
                sunset: t.sunset,
                currentForecastHour: t.currentForecastHour,
                cloudBase: t.cloudBaseShort,
                thermal: t.thermalShort,
                temperature: t.temperature,
                surfaceWind: t.surfaceWind,
                wind850: t.wind850,
                wind700: t.wind700,
              }}
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

      <div className="grid">
        <div className="card">
          <h3>
            <Cloud size={18} /> {t.skyType}
          </h3>
          <p className={`big ${sky.className}`}>{sky.label}</p>
          <p className="small">{t.thermalSkyEstimate}</p>
        </div>

        <div className="card">
          <h3>
            <Cloud size={18} /> {t.cloudBaseAgl}
          </h3>
          <p className="big">{lcl} m</p>
        </div>

        <div className="card">
          <h3>
            <MapPinned size={18} /> {t.cloudBaseMsl}
          </h3>
          <p className="big">{cloudBaseMSL} m</p>
          <p>
            {t.fieldElevation}: {FIELD_ELEVATION_MSL} m
          </p>
        </div>

        <div className="card">
          <h3>
            <ArrowUp size={18} /> {t.thermalTop}
          </h3>
          <p className="big">{thermalTop} m</p>
          <p className="small">{t.heuristic}</p>
        </div>

        <div className="card">
          <h3>
            <Wind size={18} /> {t.thermalDrift}
          </h3>
          <p className="big">{thermalDrift} kt</p>
        </div>

        <div className="card">
          <h3>
            <Thermometer size={18} /> {t.spread}
          </h3>
          <p className="big">{spread.toFixed(1)} °C</p>
        </div>

        <div className="card">
          <h3>
            <Wind size={18} /> {t.windProfile}
          </h3>
          <p>
            {t.surface}: {wind} kt {windArrow} ({Math.round(windDirection)}°)
          </p>
          <p>
            850 hPa: {wind850} kt {wind850Arrow} ({Math.round(wind850Dir)}°)
          </p>
          <p>
            700 hPa: {wind700} kt {wind700Arrow} ({Math.round(wind700Dir)}°)
          </p>
        </div>

        <div className="card runwayCard">
          <h3>🛬 {t.runwayWind}</h3>

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
                transform={`rotate(${(Math.round(windDirection) + 180) % 360} 160 110)`}
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
              <strong>{t.wind}:</strong> {Math.round(windDirection)}° / {wind} kt
            </div>
            <div>
              <strong>{headwind >= 0 ? t.headwind : t.tailwind}:</strong>{" "}
              {Math.abs(headwind)} kt
            </div>
            <div>
              <strong>{t.crosswind}:</strong> {crosswindAbs} kt
            </div>
          </div>
        </div>

        <div className="card">
          <h3>
            <Thermometer size={18} /> {t.weather}
          </h3>
          <p>
            {t.temperature}: {temperature.toFixed(1)} °C
          </p>
          <p>
            {t.dewPoint}: {dewpoint.toFixed(1)} °C
          </p>
          <p>
            {t.wind}: {wind} kt {metarWind ? "(METAR)" : "(model)"}
          </p>
          <p>
            {t.clouds}: {clouds} %
          </p>
          <p>
            {t.lowMidHigh}: {cloudLow} / {cloudMid} / {cloudHigh} %
          </p>
          <p>
            {t.sunHeating}: {Math.round(radiation)} W/m²
          </p>
          <p>
            {t.precipitation}: {precipitation.toFixed(1)} mm
          </p>
        </div>

        <div className="card">
          <h3>{t.metarInfo}</h3>
          <p>{t.checkCurrentWeather}</p>
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
              {t.openMetar}
            </a>

            <a
              href="https://www.akfrydlant.cz/"
              target="_blank"
              rel="noopener noreferrer"
              className="briefingLink"
            >
              {t.openWebsite}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}