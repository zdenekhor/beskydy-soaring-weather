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
  Camera,
  Info,
  Star,
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
  cloudLayers: string;
  airportConditions: string;
  modelForecast: string;
  quickLinks: string;
  appRating: string;
  disclaimerTitle: string;
  disclaimerText: string;

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
  openWebcam: string;
  checkCurrentWeather: string;

  noSignificantHazards: string;

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

  outsideVfrDay: string;
  outsideVfrNote: string;
  metarSource: string;
  modelSource: string;
  windSource: string;
  metarUnavailable: string;
  metarAvailable: string;

  lowLayer: string;
  middleLayer: string;
  highLayer: string;
  sourceLabel: string;
  modelSurfaceWind: string;
  airportObservedWind: string;
  rateNote: string;
  metarFallbackLabel: string;
  liveLabel: string;
};

const FIELD_ELEVATION_MSL = 439;
const APP_VERSION = "v1.4.0";
const APP_UPDATED = "24 Mar 2026";

const AIRPORT_WEBSITE = "https://www.akfrydlant.cz/";
const AIRPORT_WEBCAM = "https://www.akfrydlant.cz/webkamera/";
const METAR_PAGE = "https://metar-taf.com/metar/LKFR";

const translations: Record<Lang, Translation> = {
  cs: {
    locale: "cs-CZ",
    title: "SPL Počasí LKFR – Beskydy",
    subtitle: "Frýdlant nad Ostravicí • testovací provoz",
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
    weather: "Meteorologické údaje",
    metarInfo: "METAR / letištní informace",
    cloudLayers: "Oblačnost podle vrstev",
    airportConditions: "Aktuální letištní podmínky",
    modelForecast: "Modelová předpověď",
    quickLinks: "Rychlé odkazy",
    appRating: "Ohodnoť aplikaci",
    disclaimerTitle: "Upozornění",
    disclaimerText:
      "Tato aplikace není oficiálním leteckým meteorologickým systémem. Slouží pouze jako orientační pomůcka pro plánování letu. Pilot je vždy odpovědný za ověření aktuálních informací (METAR, TAF, briefing).",

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
    heuristic: "heuristický odhad",

    temperature: "Teplota",
    dewPoint: "Rosný bod",
    clouds: "Celková oblačnost",
    lowMidHigh: "Nízká / střední / vysoká",
    sunHeating: "Krátkovlnné záření",
    precipitation: "Srážky",

    runwayWind: "Dráha / přízemní vítr",
    groundWind: "Přízemní vítr",
    headwind: "Protivítr",
    tailwind: "Zadní vítr",
    crosswind: "Boční vítr",

    openMetar: "Otevřít METAR / TAF",
    openWebsite: "Otevřít web LKFR",
    openWebcam: "Otevřít webkameru",
    checkCurrentWeather: "Kontrola aktuálního počasí a letištní situace LKFR",

    noSignificantHazards: "Bez významných meteorologických rizik",

    go: "🟢 GO",
    caution: "🟡 POZOR",
    noGo: "🔴 NO GO",

    semaphoreGoNote: "Podmínky jsou pro běžné plachtění převážně příznivé.",
    semaphoreCautionNote:
      "Podmínky vyžadují zvýšenou pozornost a úsudek pilota.",
    semaphoreNoGoNote: "Podmínky jsou nevhodné nebo provozně rizikové.",

    weak: "🔴 Slabé",
    usable: "🟡 Použitelné",
    good: "🟢 Dobré",
    strong: "🔵 Silné",

    poor: "🔴 Slabé",
    weakDay: "🟡 Slabé",
    goodDay: "🟢 Dobré",
    xcDay: "🔵 XC den",

    flyingGood: "🟢 Dobré podmínky pro plachtění",
    flyingWeak: "🟡 Hraniční podmínky pro plachtění",
    flyingPoor: "🔴 Nevhodné podmínky pro plachtění",

    low: "Nízký",
    moderate: "Střední",
    xcPotentialGood: "Dobrý",
    xcPotentialDay: "XC den",

    skyLowOvercast: "Nízká deka",
    skyOvercast: "Zataženo",
    skyCuDay: "Kupovitý den",
    skyBlueDay: "Modrý den",
    skyUsable: "Použitelná termická obloha",
    skyMixed: "Smíšený vývoj",
    thermalSkyEstimate: "orientační klasifikace oblohy",

    stormRisk: "Riziko bouřek",
    freezing: "Mrznutí",
    snow: "Sněžení",
    strongWind: "Silný vítr",
    rain: "Srážky",
    lowCloudBase: "Nízká základna",
    overcastRisk: "Riziko zatažení",

    summaryWeak: "Slabý termický den",
    summaryModerate: "Střední termika",
    summaryGood: "Dobrý termický den",
    summaryLowBase: "Nízká základna",
    summaryWindy: "Větrno",
    summaryCu: "Kupovitý vývoj",
    summaryXc: "Přeletový potenciál",

    pilotNoGo: "Den není vhodný pro běžné plachtění",
    pilotFlyable: "Den je létatelný pro plachtařský provoz",
    pilotMarginal:
      "Den je hraniční a vyžaduje pečlivý úsudek pilota",

    pilotConvective:
      "kupovitá oblačnost by měla podporovat použitelnou termiku",
    pilotBlue:
      "převládá modrá termika s omezeným značkováním",
    pilotOvercast:
      "oblačnost omezuje ohřev povrchu a tlumí termiku",
    pilotMixed:
      "vývoj oblohy je smíšený a prostorově nerovnoměrný",

    pilotStrongerClimbs: "očekávaná stoupání kolem",
    pilotUsableClimbs: "použitelná stoupání kolem",
    pilotWeakClimbs: "spíše slabá stoupání kolem",

    pilotBaseGood: "základny vypadají dobře kolem",
    pilotBaseModerate: "základna je střední kolem",
    pilotBaseLow: "základna je spíše nízká kolem",

    pilotBestWindow: "nejvhodnější okno přibližně",
    pilotPeakNear: "maximum kolem",

    pilotWindLight: "přízemní vítr je slabý",
    pilotWindManageable: "přízemní vítr je provozně přijatelný",
    pilotWindCaution: "přízemní vítr vyžaduje zvýšenou pozornost",

    pilotXcVeryGood: "velmi dobrý potenciál pro přelet",
    pilotXcGood: "dobrý potenciál pro přelet",
    pilotXcLocal: "možný kratší místní přelet",
    pilotXcLocalOnly:
      "vhodnější spíše pro místní létání než pro přelet",

    pilotStormMain: "hlavním omezením je riziko bouřkové činnosti",
    pilotShowers: "srážky mohou narušovat průběh dne",
    pilotWatchCloud:
      "sledujte rozšiřování oblačnosti a úbytek slunečního ohřevu",
    pilotWatchWind: "sledujte profil větru a drift",

    pilotRiskHigh: "celkové provozní riziko je vysoké",
    pilotRiskModerate: "celkové provozní riziko je střední",
    pilotRiskManageable: "celkové provozní riziko je přijatelné",

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

    outsideVfrDay: "🔴 Mimo VFR den",
    outsideVfrNote:
      "Mimo VFR den — po západu slunce nebo před východem slunce nelze běžné VFR plachtění provádět.",
    metarSource: "METAR LKFR (LIVE)",
    modelSource: "MODEL (fallback)",
    windSource: "Zdroj větru",
    metarUnavailable: "MODEL (METAR NEDOSTUPNÝ)",
    metarAvailable: "METAR LKFR (LIVE)",

    lowLayer: "Nízká vrstva",
    middleLayer: "Střední vrstva",
    highLayer: "Vysoká vrstva",
    sourceLabel: "Zdroj",
    modelSurfaceWind: "Modelový přízemní vítr",
    airportObservedWind: "Letištní přízemní vítr",
    rateNote:
      "Jednoduché hodnocení. Později můžete napojit na formulář nebo backend.",
    metarFallbackLabel: "MODEL (fallback)",
    liveLabel: "LIVE",
  },

  en: {
    locale: "en-GB",
    title: "SPL Weather LKFR – Beskydy",
    subtitle: "Frýdlant nad Ostravicí • test mode",
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
    weatherRisks: "Weather hazards",
    bestSoaringWindow: "Best soaring window",
    soaringIndex: "Soaring index",
    flyingConditions: "Flying conditions",
    developmentDuringDay: "Day development",
    skyType: "Sky type",
    cloudBaseAgl: "Cloud base AGL",
    cloudBaseMsl: "Cloud base MSL",
    thermalTop: "Thermal top",
    thermalDrift: "Thermal drift",
    spread: "Spread (T − Td)",
    windProfile: "Wind profile",
    weather: "Meteorological data",
    metarInfo: "METAR / aerodrome information",
    cloudLayers: "Cloud layers",
    airportConditions: "Current aerodrome conditions",
    modelForecast: "Model forecast",
    quickLinks: "Quick links",
    appRating: "Rate the app",
    disclaimerTitle: "Disclaimer",
    disclaimerText:
      "This application is not an official aviation meteorological system. It is intended only as a planning aid. The pilot is always responsible for verifying current information (METAR, TAF, briefing).",

    climb: "Climb",
    baseAgl: "Base AGL",
    wind: "Wind",
    xc: "XC",
    potential: "Potential",

    start: "Start",
    peak: "Peak",
    end: "End",
    vfrDay: "VFR day",
    fieldElevation: "Field elevation",
    heuristic: "heuristic estimate",

    temperature: "Temperature",
    dewPoint: "Dew point",
    clouds: "Total cloud cover",
    lowMidHigh: "Low / Mid / High",
    sunHeating: "Shortwave radiation",
    precipitation: "Precipitation",

    runwayWind: "Runway / surface wind",
    groundWind: "Surface wind",
    headwind: "Headwind",
    tailwind: "Tailwind",
    crosswind: "Crosswind",

    openMetar: "Open METAR / TAF",
    openWebsite: "Open LKFR website",
    openWebcam: "Open webcam",
    checkCurrentWeather: "Check current LKFR weather and aerodrome situation",

    noSignificantHazards: "No significant weather hazards",

    go: "🟢 GO",
    caution: "🟡 CAUTION",
    noGo: "🔴 NO GO",

    semaphoreGoNote:
      "Conditions are generally favourable for normal soaring.",
    semaphoreCautionNote:
      "Conditions require increased attention and pilot judgement.",
    semaphoreNoGoNote:
      "Conditions are unsuitable or operationally risky.",

    weak: "🔴 Weak",
    usable: "🟡 Usable",
    good: "🟢 Good",
    strong: "🔵 Strong",

    poor: "🔴 Poor",
    weakDay: "🟡 Weak",
    goodDay: "🟢 Good",
    xcDay: "🔵 XC day",

    flyingGood: "🟢 Good soaring conditions",
    flyingWeak: "🟡 Marginal soaring conditions",
    flyingPoor: "🔴 Unsuitable soaring conditions",

    low: "Low",
    moderate: "Moderate",
    xcPotentialGood: "Good",
    xcPotentialDay: "XC day",

    skyLowOvercast: "Low overcast",
    skyOvercast: "Overcast",
    skyCuDay: "Cu day",
    skyBlueDay: "Blue day",
    skyUsable: "Usable thermal sky",
    skyMixed: "Mixed development",
    thermalSkyEstimate: "approximate sky classification",

    stormRisk: "Thunderstorm risk",
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

    pilotNoGo: "The day is not suitable for normal soaring",
    pilotFlyable: "The day is flyable for gliding operations",
    pilotMarginal:
      "The day is marginal and requires careful pilot judgement",

    pilotConvective:
      "convective cloud field should support usable thermals",
    pilotBlue:
      "blue thermal conditions with limited cloud marking",
    pilotOvercast:
      "cloud cover suppresses surface heating and thermals",
    pilotMixed: "sky development is mixed and uneven",

    pilotStrongerClimbs: "expected climbs around",
    pilotUsableClimbs: "usable climbs around",
    pilotWeakClimbs: "rather weak climbs around",

    pilotBaseGood: "bases look good around",
    pilotBaseModerate: "base is moderate around",
    pilotBaseLow: "base is rather low around",

    pilotBestWindow: "best window roughly",
    pilotPeakNear: "peak near",

    pilotWindLight: "surface wind is light",
    pilotWindManageable: "surface wind is operationally manageable",
    pilotWindCaution: "surface wind deserves caution",

    pilotXcVeryGood: "very good XC potential",
    pilotXcGood: "good XC potential",
    pilotXcLocal: "possible short local XC",
    pilotXcLocalOnly:
      "better suited to local flying than XC",

    pilotStormMain: "the main limitation is thunderstorm risk",
    pilotShowers: "precipitation may interrupt the day",
    pilotWatchCloud:
      "watch for cloud spreading and loss of heating",
    pilotWatchWind: "watch the wind profile and drift",

    pilotRiskHigh: "overall operational risk is high",
    pilotRiskModerate: "overall operational risk is moderate",
    pilotRiskManageable: "overall operational risk is manageable",

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

    outsideVfrDay: "🔴 Outside VFR day",
    outsideVfrNote:
      "Outside VFR day — normal VFR soaring is not possible after sunset or before sunrise.",
    metarSource: "METAR LKFR (LIVE)",
    modelSource: "MODEL (fallback)",
    windSource: "Wind source",
    metarUnavailable: "MODEL (METAR UNAVAILABLE)",
    metarAvailable: "METAR LKFR (LIVE)",

    lowLayer: "Low layer",
    middleLayer: "Middle layer",
    highLayer: "High layer",
    sourceLabel: "Source",
    modelSurfaceWind: "Model surface wind",
    airportObservedWind: "Aerodrome surface wind",
    rateNote:
      "Simple rating. You can later connect it to a form or backend.",
    metarFallbackLabel: "MODEL (fallback)",
    liveLabel: "LIVE",
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

function getWindArrowFrom(deg: number) {
  const d = ((deg % 360) + 360) % 360;
  if (d >= 337 || d < 22) return "↓";
  if (d < 67) return "↙";
  if (d < 112) return "←";
  if (d < 157) return "↖";
  if (d < 202) return "↑";
  if (d < 247) return "↗";
  if (d < 292) return "→";
  return "↘";
}

function kmhToKt(value: number | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.round(value * 0.539957);
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
  if (type === "storm") return "rgba(239,68,68,0.16)";
  if (type === "wind") return "rgba(249,115,22,0.16)";
  if (type === "rain") return "rgba(59,130,246,0.16)";
  if (type === "ice") return "rgba(148,163,184,0.16)";
  if (type === "snow") return "rgba(226,232,240,0.14)";
  if (type === "cloud") return "rgba(148,163,184,0.16)";
  if (type === "overcast") return "rgba(99,102,241,0.16)";
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
  isWithinVfrDay: boolean;
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
    isWithinVfrDay,
  } = params;

  if (!isWithinVfrDay) {
    return t.outsideVfrNote;
  }

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

function getCoverageLabel(value: number, lang: Lang) {
  if (lang === "cs") {
    if (value >= 85) return "zataženo";
    if (value >= 60) return "výrazná oblačnost";
    if (value >= 35) return "proměnlivá oblačnost";
    if (value >= 10) return "malá oblačnost";
    return "skoro jasno";
  }

  if (value >= 85) return "overcast";
  if (value >= 60) return "significant cloud";
  if (value >= 35) return "variable cloud";
  if (value >= 10) return "few clouds";
  return "mostly clear";
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const lang: Lang = params?.lang === "en" ? "en" : "cs";
  const t = translations[lang];

  const data = await getWeather();
  const metarWind = await getMetarWind("LKFR");
  const hasMetar = !!metarWind;

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
  const cloudHigh = safeArrayValue(data.hourly.cloud_cover_high, currentIndex, 0);

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

  const modelSurfaceWindKmh = safeArrayValue(
    data.hourly.wind_speed_10m,
    currentIndex
  );
  const modelSurfaceWindKt = kmhToKt(modelSurfaceWindKmh);

  const modelSurfaceWindDir = safeArrayValue(
    data.hourly.wind_direction_10m,
    currentIndex,
    0
  );

  const airportSurfaceWindKt = hasMetar
    ? metarWind!.speedKt
    : modelSurfaceWindKt;

  const airportSurfaceWindDir = hasMetar
    ? metarWind!.directionDeg
    : modelSurfaceWindDir;

  const airportSurfaceWindArrow = getWindArrowFrom(airportSurfaceWindDir);
  const airportWindSourceLabel = hasMetar ? t.metarSource : t.modelSource;
  const modelSurfaceWindArrow = getWindArrowFrom(modelSurfaceWindDir);

  const runwayHeading = 84;
  const runwayRotation = runwayHeading - 90;
  const angleDiff =
    ((airportSurfaceWindDir - runwayHeading + 540) % 360) - 180;
  const rad = (angleDiff * Math.PI) / 180;

  const headwind = Math.round(airportSurfaceWindKt * Math.cos(rad));
  const crosswind = Math.round(airportSurfaceWindKt * Math.sin(rad));
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
  const wind850Arrow = getWindArrowFrom(wind850Dir);

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
  const wind700Arrow = getWindArrowFrom(wind700Dir);

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
  const windFactor = windSuppressionFactor(modelSurfaceWindKt, wind850, wind700);

  const effectiveThermalScore = Math.round(
    clamp(rawPotential * cloudFactor * rainFactor * windFactor, 0, 100)
  );

  const expectedClimb = Number(
    estimateClimbFromScore(effectiveThermalScore).toFixed(1)
  );

  const thermalDrift = Math.round(modelSurfaceWindKt * 0.4 + wind850 * 0.6);

  const lclArray = data.hourly.temperature_2m.map((temp: number, i: number) => {
    const td = safeArrayValue(data.hourly.dew_point_2m, i);
    return Math.round(Math.max(0, 125 * (temp - td)));
  });

  const thermalArray = data.hourly.temperature_2m.map(
    (temp: number, i: number) => {
      const td = safeArrayValue(data.hourly.dew_point_2m, i);
      const low = safeArrayValue(data.hourly.cloud_cover_low, i, 0);
      const mid = safeArrayValue(data.hourly.cloud_cover_mid, i, 0);
      const high = safeArrayValue(data.hourly.cloud_cover_high, i, 0);
      const radNow = safeArrayValue(data.hourly.shortwave_radiation, i, 0);
      const rain = safeArrayValue(data.hourly.precipitation, i, 0);
      const rainProb = safeArrayValue(
        data.hourly.precipitation_probability,
        i,
        0
      );
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
    }
  );

  const hours = data.hourly.time.map((tStr: string) =>
    new Date(tStr).toLocaleTimeString(t.locale, {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const temperatureAll = data.hourly.temperature_2m;
  const dewPointAll = data.hourly.dew_point_2m;

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

  const cloudLowAll =
    data.hourly.cloud_cover_low?.map((v: number) => Math.round(v)) ??
    Array(hours.length).fill(0);

  const cloudMidAll =
    data.hourly.cloud_cover_mid?.map((v: number) => Math.round(v)) ??
    Array(hours.length).fill(0);

  const cloudHighAll =
    data.hourly.cloud_cover_high?.map((v: number) => Math.round(v)) ??
    Array(hours.length).fill(0);

  const forecastTs = new Date(data.hourly.time[currentIndex]).getTime();
  const isWithinVfrDay =
    sunriseTime !== null &&
    sunsetTime !== null &&
    forecastTs >= sunriseTime.getTime() &&
    forecastTs <= sunsetTime.getTime();

  const soaringIndexRaw = Math.round(
    clamp(
      effectiveThermalScore * 0.75 +
        clamp(lcl / 20, 0, 20) -
        clamp(crosswindAbs * 1.2, 0, 12),
      0,
      100
    )
  );

  const displayedSoaringIndex = isWithinVfrDay ? soaringIndexRaw : 0;

  let soaringRating = t.poor;
  if (soaringIndexRaw > 30) soaringRating = t.weakDay;
  if (soaringIndexRaw > 50) soaringRating = t.goodDay;
  if (soaringIndexRaw > 70) soaringRating = t.xcDay;
  if (!isWithinVfrDay) soaringRating = t.outsideVfrDay;

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

  const hazards: { icon: string; label: string; type: string; severity: number }[] =
    [];

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
    hazards.push({ icon: "🧊", label: t.freezing, type: "ice", severity: 5 });
  }
  if (temperature < 2 && precipitation > 0.2) {
    hazards.push({ icon: "❄", label: t.snow, type: "snow", severity: 5 });
  }
  if (airportSurfaceWindKt > 15 || wind850 > 22 || crosswindAbs > 12) {
    hazards.push({
      icon: "💨",
      label: t.strongWind,
      type: "wind",
      severity: 4,
    });
  }
  if (precipitation > 0.2 || precipitationProbability > 45) {
    hazards.push({ icon: "🌧", label: t.rain, type: "rain", severity: 3 });
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
        clamp(
          airportSurfaceWindKt > 0 ? airportSurfaceWindKt * 1.2 : 0,
          0,
          20
        ) +
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
  if (!isWithinVfrDay) flyingCondition = t.outsideVfrDay;

  let xcPotential = t.low;
  if (effectiveThermalScore >= 40 && lcl > 900) xcPotential = t.moderate;
  if (effectiveThermalScore >= 60 && lcl > 1200 && operationalRisk < 40) {
    xcPotential = t.xcPotentialGood;
  }
  if (
    effectiveThermalScore >= 75 &&
    lcl > 1500 &&
    modelSurfaceWindKt < 12 &&
    operationalRisk < 30
  ) {
    xcPotential = t.xcPotentialDay;
  }
  if (!isWithinVfrDay) xcPotential = t.low;

  let semaphore = t.caution;
  let semaphoreClass = "badgeYellow";
  let semaphoreNote = t.semaphoreCautionNote;

  if (!isWithinVfrDay) {
    semaphore = t.noGo;
    semaphoreClass = "badgeRed";
    semaphoreNote = t.outsideVfrNote;
  } else if (
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

  let semaphoreCardClass = "semaphoreCard warn";
  let semaphoreBadgeClass = "semaphoreBadge warn";

  if (semaphoreClass === "badgeRed") {
    semaphoreCardClass = "semaphoreCard bad";
    semaphoreBadgeClass = "semaphoreBadge bad";
  } else if (semaphoreClass === "badgeGreen") {
    semaphoreCardClass = "semaphoreCard go";
    semaphoreBadgeClass = "semaphoreBadge go";
  }

  const forecastTimeLabel = data.hourly.time[currentIndex]
    ? new Date(data.hourly.time[currentIndex]).toLocaleString(t.locale, {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "n/a";

  let soaringClass = "badgeRed";
  if (displayedSoaringIndex > 30) soaringClass = "badgeYellow";
  if (displayedSoaringIndex > 50) soaringClass = "badgeGreen";
  if (displayedSoaringIndex > 70) soaringClass = "badgeBlue";

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
  if (airportSurfaceWindKt > 12 || crosswindAbs > 10)
    summaryParts.push(t.summaryWindy);
  if (sky.convective) summaryParts.push(t.summaryCu);
  if (xcPotential === t.xcPotentialGood || xcPotential === t.xcPotentialDay) {
    summaryParts.push(t.summaryXc);
  }

  const flightSummary = !isWithinVfrDay
    ? t.outsideVfrNote
    : summaryParts.join(" • ");

  const pilotComment = buildPilotComment({
    semaphore,
    expectedClimb,
    lcl,
    thermalStart,
    thermalMax,
    thermalEnd,
    wind: airportSurfaceWindKt,
    crosswindAbs,
    skyType: sky.label,
    xcPotential,
    operationalRisk,
    hasRain,
    hasStorm,
    hasOvercast,
    hasStrongWind,
    t,
    isWithinVfrDay,
  });

  return (
    <main className="container">
      <div className="topHeaderRow">
        <div>
          <h1>{t.title}</h1>
          <h2>{t.subtitle}</h2>
        </div>

        <div className="langSwitch">
          <span className="langLabel">{t.language}:</span>

          <Link
            href={{ pathname: "/", query: { lang: "cs" } }}
            className={`langButton ${lang === "cs" ? "active" : ""}`}
          >
            CZ
          </Link>

          <Link
            href={{ pathname: "/", query: { lang: "en" } }}
            className={`langButton ${lang === "en" ? "active" : ""}`}
          >
            EN
          </Link>
        </div>
      </div>

      <p className="metaLine">
        {formattedDate} • {t.updated} {formattedTime} {t.local} •{" "}
        {t.forecastHour} {forecastTimeLabel} • {t.version} {APP_VERSION} •{" "}
        {t.appUpdate} {APP_UPDATED}
      </p>

      <div className="statusPills">
        <span className={`sourceBadge ${hasMetar ? "live" : "fallback"}`}>
          {t.sourceLabel}: {airportWindSourceLabel}
        </span>

        <span className="statusPill">
          {hasMetar ? t.metarAvailable : t.metarUnavailable}
        </span>

        <span className="statusPill">
          {t.vfrDay}: {sunriseLabel} – {sunsetLabel}
        </span>
      </div>

      <section className="topStatusCard">
        <div className="topStatusGrid">
          <div className={semaphoreCardClass}>
            <div className="eyebrowLabel">{t.flightSemaphore}</div>

            <div className={semaphoreBadgeClass}>{semaphore}</div>

            <div className="semaphoreTitle">{t.flightSemaphore}</div>

            <p className="semaphoreNote">{semaphoreNote}</p>
          </div>

          <div className="metricGrid">
            <div className="metricCard">
              <div className="metricLabel">{t.climb}</div>
              <div className="metricValue">{expectedClimb.toFixed(1)} m/s</div>
              <div
                className={
                  climbRating === t.strong
                    ? "badgeBlue"
                    : climbRating === t.good
                    ? "badgeGreen"
                    : climbRating === t.usable
                    ? "badgeYellow"
                    : "badgeRed"
                }
              >
                {climbRating}
              </div>
            </div>

            <div className="metricCard">
              <div className="metricLabel">{t.baseAgl}</div>
              <div className="metricValue">{lcl} m</div>
              <div className={sky.className}>{sky.label}</div>
            </div>

            <div className="metricCard">
              <div className="metricLabel">{t.airportObservedWind}</div>
              <div className="metricValue">{airportSurfaceWindKt} kt</div>
              <div className="metricDir">
                {Math.round(airportSurfaceWindDir)}° {airportSurfaceWindArrow}
              </div>
              <div className="metricSub">{airportWindSourceLabel}</div>
            </div>

            <div className="metricCard">
              <div className="metricLabel">{t.xc}</div>
              <div className="metricValueLarge">{xcPotential}</div>
              <div className={xcClass}>{t.potential}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="summaryBox">{flightSummary}</div>

      <div className="card" style={{ marginBottom: "18px" }}>
        <h3>🧭 {t.pilotComment}</h3>
        <p style={{ lineHeight: 1.7, margin: 0 }}>{pilotComment}</p>
      </div>

      <div className="grid" style={{ marginBottom: "18px" }}>
        <div className="card runwayCard">
          <h3>🛬 {t.airportConditions}</h3>

          <div className="runwayVisualWrap">
            <svg viewBox="0 0 360 250" className="runwaySvg">
              <rect
                x="0"
                y="0"
                width="360"
                height="250"
                rx="16"
                fill="rgba(15,23,42,0.35)"
              />

              <text x="180" y="20" className="runwayNorthLabel">
                N
              </text>
              <line x1="180" y1="26" x2="180" y2="46" className="runwayNorthLine" />

              <g transform={`rotate(${runwayRotation} 180 130)`}>
                <rect
                  x="70"
                  y="108"
                  width="220"
                  height="44"
                  rx="8"
                  className="runwayStrip"
                />
                <line
                  x1="90"
                  y1="130"
                  x2="270"
                  y2="130"
                  className="runwayCenterMark"
                />
                <text x="92" y="100" className="runwayLabel">
                  08
                </text>
                <text x="268" y="100" className="runwayLabel">
                  26
                </text>
              </g>

              <g transform={`rotate(${Math.round(airportSurfaceWindDir)} 180 130)`}>
                <line x1="180" y1="48" x2="180" y2="95" className="windArrowLine" />
                <polygon points="180,34 171,52 189,52" className="windArrowHead" />
              </g>

              <circle cx="180" cy="130" r="4.5" className="runwayCenterDot" />

              <text
                x="180"
                y="212"
                textAnchor="middle"
                fontSize="13"
                fill="#e2e8f0"
              >
                {Math.round(airportSurfaceWindDir)}° / {airportSurfaceWindKt} kt
              </text>
            </svg>
          </div>

          <div className="runwayReadout">
            <div>
              <strong>RWY:</strong> 08 / 26
            </div>
            <div>
              <strong>{t.groundWind}:</strong> {Math.round(airportSurfaceWindDir)}° /{" "}
              {airportSurfaceWindKt} kt
            </div>
            <div>
              <strong>{t.sourceLabel}:</strong> {airportWindSourceLabel}
            </div>
            {!hasMetar && (
              <div>
                <strong>Info:</strong> {t.metarUnavailable}
              </div>
            )}
            <div>
              <strong>{headwind >= 0 ? t.headwind : t.tailwind}:</strong>{" "}
              {Math.abs(headwind)} kt
            </div>
            <div
              className={
                crosswindAbs > 12 ? "crossBad" : crosswindAbs > 6 ? "crossWarn" : ""
              }
            >
              <strong>{t.crosswind}:</strong> {crosswindAbs} kt
            </div>
          </div>
        </div>

        <div className="card">
          <h3>⚠️ {t.weatherRisks}</h3>
          {hazards.length === 0 ? (
            <p className="badgeGreen">{t.noSignificantHazards}</p>
          ) : (
            <div className="hazardsWrap">
              {hazards.map((h, i) => (
                <span
                  key={`${h.type}-${i}`}
                  className="hazardPill"
                  style={{ background: getHazardColor(h.type) }}
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
            <strong>{t.start}:</strong> {thermalStart}
          </p>
          <p>
            <strong>{t.peak}:</strong> {thermalMax}
          </p>
          <p>
            <strong>{t.end}:</strong> {thermalEnd}
          </p>
        </div>

        <div className="card">
          <h3>
            <Gauge size={18} /> {t.soaringIndex}
          </h3>
          <p className="big">{displayedSoaringIndex}</p>
          <p className={soaringClass}>{soaringRating}</p>
        </div>

        <div className="card">
          <h3>
            <Plane size={18} /> {t.flyingConditions}
          </h3>
          <p className={flyingClass}>{flyingCondition}</p>
        </div>

        <div className="card">
          <h3>
            <Cloud size={18} /> {t.cloudLayers}
          </h3>

          <div className="cloudLayersGrid">
            {[
              { label: t.lowLayer, value: cloudLow },
              { label: t.middleLayer, value: cloudMid },
              { label: t.highLayer, value: cloudHigh },
            ].map((layer) => (
              <div key={layer.label} className="cloudLayerItem">
                <div className="cloudLayerTop">
                  <strong>{layer.label}</strong>
                  <span>{layer.value} %</span>
                </div>

                <div className="cloudLayerBarWrap">
                  <div
                    className="cloudLayerBarFill"
                    style={{ width: `${Math.max(4, layer.value)}%` }}
                  />
                </div>

                <div className="cloudLayerCaption">
                  {getCoverageLabel(layer.value, lang)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>
            <Wind size={18} /> {t.windProfile}
          </h3>
          <p>
            {t.surface}: {modelSurfaceWindKt} kt {modelSurfaceWindArrow} (
            {Math.round(modelSurfaceWindDir)}°) • {t.modelSource}
          </p>
          <p>
            850 hPa: {wind850} kt {wind850Arrow} ({Math.round(wind850Dir)}°)
          </p>
          <p>
            700 hPa: {wind700} kt {wind700Arrow} ({Math.round(wind700Dir)}°)
          </p>
        </div>
      </div>

      <section className="chartSection" style={{ marginBottom: "18px" }}>
        <div className="chartCard">
          <h3 style={{ marginBottom: "14px" }}>📈 {t.modelForecast}</h3>
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
                dewPoint: t.dewPoint,
                surfaceWind: t.surfaceWind,
                wind850: t.wind850,
                wind700: t.wind700,
                cloudLow: t.lowLayer,
                cloudMid: t.middleLayer,
                cloudHigh: t.highLayer,
              }}
              data={{
                labels: hours,
                lcl: lclArray,
                thermal: thermalArray,
                temperature: temperatureAll,
                dewPoint: dewPointAll,
                windSurface: windSurfaceAll,
                wind850: wind850All,
                wind700: wind700All,
                windSurfaceDir: windSurfaceDirAll,
                wind850Dir: wind850DirAll,
                wind700Dir: wind700DirAll,
                cloudLow: cloudLowAll,
                cloudMid: cloudMidAll,
                cloudHigh: cloudHighAll,
                sunrise: data.daily.sunrise,
                sunset: data.daily.sunset,
                currentIndex,
              }}
            />
          </div>
        </div>
      </section>

      <div className="grid" style={{ marginBottom: "18px" }}>
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
            {t.fieldElevation}: {FIELD_ELEVATION_MSL} m AMSL
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
            <Thermometer size={18} /> {t.weather}
          </h3>
          <p>
            {t.temperature}: {temperature.toFixed(1)} °C
          </p>
          <p>
            {t.dewPoint}: {dewpoint.toFixed(1)} °C
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

          <p style={{ color: "#dbe7fb", marginTop: "8px" }}>
            <strong>{t.sourceLabel}:</strong>{" "}
            {hasMetar ? t.metarSource : t.metarUnavailable}
          </p>

          {hasMetar && metarWind?.rawText ? (
            <p style={{ color: "#dbe7fb", fontSize: "0.85rem" }}>
              <strong>RAW:</strong> {metarWind.rawText}
            </p>
          ) : (
            <p style={{ color: "#cbd5e1", fontSize: "0.9rem" }}>
              {t.metarUnavailable}
            </p>
          )}

          <a
            href={AIRPORT_WEBCAM}
            target="_blank"
            rel="noopener noreferrer"
            className="briefingLink"
            style={{ marginTop: "10px", display: "inline-flex" }}
          >
            📷 Webkamera LKFR
          </a>
        </div>
      </div>

      <div className="grid" style={{ marginBottom: "18px" }}>
        <div className="card">
          <h3>
            <Camera size={18} /> {t.quickLinks}
          </h3>
          <div className="quickLinksColumn">
            <a
              href={METAR_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              className="briefingLink"
            >
              {t.openMetar}
            </a>

            <a
              href={AIRPORT_WEBSITE}
              target="_blank"
              rel="noopener noreferrer"
              className="briefingLink"
            >
              {t.openWebsite}
            </a>

            <a
              href={AIRPORT_WEBCAM}
              target="_blank"
              rel="noopener noreferrer"
              className="briefingLink"
            >
              {t.openWebcam}
            </a>
          </div>
        </div>

        <div className="card">
          <h3>
            <Star size={18} /> {t.appRating}
          </h3>

          <div className="ratingWrap" style={{ marginTop: "10px" }}>
            ⭐ ⭐ ⭐ ⭐ ⭐
          </div>

          <p className="rateNoteText">{t.rateNote}</p>
        </div>
      </div>

      <footer className="card disclaimerCard">
        <h3 className="disclaimerTitleRow">
          <Info size={18} />
          {t.disclaimerTitle}
        </h3>
        <p style={{ margin: 0, lineHeight: 1.7 }}>{t.disclaimerText}</p>
      </footer>
    </main>
  );
}