import Link from "next/link";
import Script from "next/script";
import AppRating from "../components/AppRating";

import LivePragueDateTime from "../components/LivePragueDateTime";
import Vpl4Viewer from "../components/vpl4-viewer";
import WeatherChart from "../components/WeatherChart";
import {
  Cloud,
  Wind,
  Plane,
  Gauge,
  Thermometer,
  Camera,
  Info,
  NotebookPen,
  Star,
} from "lucide-react";

type ForecastData = {
  hourly: {
    time: number[];
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
    sunrise: number[];
    sunset: number[];
  };
};

type Lang = "cs" | "en";

type MetarCloudLayer = {
  cover: string;
  baseFtAgl: number;
  cloudType?: string | null;
};

type MetarObservation = {
  speedKt: number;
  gustKt: number | null;
  directionDeg: number;
  rawText: string;
  temperatureC: number | null;
  dewPointC: number | null;
  cloudLayers: MetarCloudLayer[];
  ceilingFtAgl: number | null;
  qnhHpa: number | null;
  visibilityM: number | null;
  weatherCodes: string[];
};

type TafBriefing = {
  sourceIcao: string;
  rawTaf: string;
  hasWindshear: boolean;
};

type OfficialAirportBriefing = {
  category: string | null;
  operation: string | null;
  frequency: string | null;
  circuitAltitude: string | null;
  circuitDirections: string[];
  runwayWarnings: string[];
};

type Translation = {
  locale: string;
  title: string;
  subtitle: string;
  updated: string;
  forecastHour: string;
  version: string;
  appUpdate: string;
  local: string;
  allTimesUtc: string;

  language: string;
  czech: string;
  english: string;
  forecastUnavailable: string;

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
  officialBriefing: string;
  operationalBriefing: string;
  modelForecast: string;
  quickLinks: string;
  appRating: string;
  layoutEditor: string;
  layoutReset: string;
  layoutMoveEarlier: string;
  layoutMoveLater: string;
  layoutPickCard: string;
  layoutPlaceBefore: string;
  layoutCardSelected: string;
  layoutDragAndDrop: string;
  layoutSizeSmall: string;
  layoutSizeMedium: string;
  layoutSizeLarge: string;
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
  openSplTrainer: string;
  openOfficialManual: string;
  openOfficialBriefing: string;
  openOfficialTextPdf: string;
  vpl4DocumentTitle: string;
  vpl4Expand: string;
  vpl4Collapse: string;
  vpl4OpenFullscreen: string;
  vpl4CloseFullscreen: string;
  vpl4Missing: string;
  checkCurrentWeather: string;

  airportCategoryLabel: string;
  airportOperationLabel: string;
  airportFrequencyLabel: string;
  trafficCircuitLabel: string;
  circuitAltitudeLabel: string;
  officialRunwayStatusLabel: string;
  recentRainLabel: string;
  officialSourceNote: string;
  currentNoticesLabel: string;
  atisStatusLabel: string;
  atisUnavailableNote: string;
  radioInfoLabel: string;
  officialBriefingLead: string;
  runwayWetRisk: string;
  runwayWetNote: string;
  runwaySnowNote: string;
  runwayNoSofteningSign: string;
  gustsLabel: string;
  infoLabel: string;
  windLimitLabel: string;
  windLimitNote: string;
  lkfrTrainingLimitsTitle: string;
  lkfrCrosswindLimitText: string;
  lkfrVfrGoodText: string;
  lkfrWetRunwayWarningText: string;
  lkfrWetRunwayCriticalText: string;
  lkfrDataSourceLabel: string;
  meteoDataSourceNote: string;
  windShearInTaf: string;
  yes: string;
  no: string;
  liProxyLabel: string;
  cloudCoverageLabel: string;
  cloudTypeLabel: string;
  verticalDevelopmentLabel: string;
  riskLabel: string;
  lowRiskLabel: string;
  verticalDevelopmentRiskNote: string;
  verticalDevelopmentLowNote: string;
  chartAxesLegendTitle: string;
  phenomenaLabel: string;
  webcamLinkLabel: string;
  vfrSuitable: string;
  vfrMarginal: string;
  vfrNotSuitable: string;
  crosswindDemanding: string;
  crosswindCaution: string;
  crosswindSuitable: string;
  overdevelopmentLabel: string;
  highCloudHeatingReducedLabel: string;
  hazardOccurrenceLow: string;
  hazardOccurrenceCountLabel: string;
  occurrenceRiskHigh: string;
  occurrenceRiskMedium: string;
  occurrenceRiskLow: string;
  gaforLikeNote: string;
  instabilityStrong: string;
  instabilitySlight: string;
  instabilityStable: string;
  verticalDevelopmentTag: string;
  streetsLabel: string;
  blueThermalsLabel: string;
  weakCuLabel: string;
  highCloudLabel: string;
  dayDecayLabel: string;

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

  skyLowStratus: string;
  skyLowOvercast: string;
  skyOvercast: string;
  skyBlueWeak: string;
  skyBlueDay: string;
  skyBlueThermal: string;
  skyWeakCu: string;
  skyCuDay: string;
  skyCuStreets: string;
  skyUsable: string;
  skyMixed: string;
  skyOverdeveloped: string;
  skyHighCloudShield: string;
  skyDecaying: string;
  thermalSkyEstimate: string;

  pilotLowStratus: string;
  pilotBlueWeak: string;
  pilotBlueThermal: string;
  pilotWeakCu: string;
  pilotCuStreets: string;
  pilotOverdeveloped: string;
  pilotHighCloudShield: string;
  pilotDecaying: string;

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
  flightDayStart: string;
  flightDayEnd: string;
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
  observedLabel: string;
  forecastLabel: string;
  priorityLabel: string;
  metarFirstLabel: string;
  qnh: string;
  visibility: string;
  ceilingLabel: string;
  modelSurfaceWind: string;
  airportObservedWind: string;
  rateNote: string;
  metarFallbackLabel: string;
  liveLabel: string;
  tafLabel: string;
  gaforLikeLabel: string;
};

const FIELD_ELEVATION_MSL = 439;
const APP_VERSION = "v1.5.0";
const APP_UPDATED = "10 Apr 2026";
const LKFR_TIME_ZONE = "Europe/Prague";
const VFR_DAY_START_OFFSET_SEC = 0;
const VFR_DAY_END_OFFSET_SEC = 0;
const DEFAULT_FETCH_TIMEOUT_MS = 9000;

type NextFetchInit = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

async function fetchWithTimeout(
  input: string,
  init: NextFetchInit = {},
  timeoutMs = DEFAULT_FETCH_TIMEOUT_MS
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

const studentProfileCfg = {
  thermalWindowThreshold: 1.4,
  noGoCrosswind: 9,
  noGoSurfaceWind: 13,
  noGoOperationalRisk: 52,
  goMinThermalScore: 60,
  goMaxOperationalRisk: 26,
  goMinLcl: 800,
};

const LKFR_LIMITS = {
  // LKFR: travnatá RWY + SPL výcvik, konzervativnější limity
  runwayWet6hWarnMm: 1.5,
  runwayWet12hWarnMm: 3,
  runwayWet6hBadMm: 3,
  runwayWet12hBadMm: 6,
  vfrVisibilityGoodM: 8000,
  vfrVisibilityMarginalM: 5000,
  vfrCloudBaseGoodM: 600,
  vfrCloudBaseMarginalM: 450,
  vfrSurfaceWindMaxKt: 14,
  vfrCrosswindMaxKt: 10,
  strongWindSurfaceKt: 13,
  strongWind850Kt: 20,
  strongWindCrosswindKt: 10,
  compassLimitSurfaceKt: 13,
  compassLimitCrosswindKt: 9,
  compassLimitGustKt: 18,
} as const;

const AIRPORT_WEBSITE = "https://www.akfrydlant.cz/";
const METAR_PAGE = "https://metar-taf.com/metar/LKFR";
const AIM_VFR_MANUAL_URL = "https://aim.rlp.cz/vfrmanual/actual/lkfr_text_cz.html";
const AIM_VFR_TEXT_PDF_URL = "https://aim.rlp.cz/vfrmanual/actual/pdf/ad-lkfr_text_cz.pdf";
const AISVIEW_URL = "https://aisview.rlp.cz/";
const SPL_TRAINER_URL = "https://zdenekhor.github.io/SPL-TRAINER/";

const translations: Record<Lang, Translation> = {
  cs: {
    locale: "cs-CZ",
    title: "Počasí LKFR",
    subtitle: "Frýdlant nad Ostravicí • testovací provoz",
    updated: "Aktualizováno",
    forecastHour: "Hodina předpovědi",
    version: "Verze",
    appUpdate: "Aktualizace aplikace",
    local: "místního času",
    allTimesUtc: "Všechny časy v předpovědi jsou v místním čase",

    language: "Jazyk",
    czech: "Čeština",
    english: "English",
    forecastUnavailable: "Modelová předpověď je dočasně nedostupná. Zkuste stránku za chvíli obnovit.",

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
    officialBriefing: "Oficiální briefing LKFR",
    operationalBriefing: "NOTAM / SNOWTAM / ATIS briefing",
    modelForecast: "Modelová předpověď",
    quickLinks: "Rychlé odkazy",
    appRating: "Ohodnoť aplikaci",
    layoutEditor: "Rozložení aplikace",
    layoutReset: "Obnovit výchozí",
    layoutMoveEarlier: "Posunout dříve",
    layoutMoveLater: "Posunout později",
    layoutPickCard: "Vybrat kartu",
    layoutPlaceBefore: "Vložit před tuto",
    layoutCardSelected: "Karta je vybraná",
    layoutDragAndDrop: "Přetáhnout kartu",
    layoutSizeSmall: "Malá karta",
    layoutSizeMedium: "Střední karta",
    layoutSizeLarge: "Velká karta",
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
    openSplTrainer: "Otevřít SPL-TRAINER",
    openOfficialManual: "Otevřít VFR příručku LKFR",
    openOfficialBriefing: "Otevřít AIS View / NOTAM briefing",
    openOfficialTextPdf: "Otevřít PDF text LKFR",
    vpl4DocumentTitle: "Dokument VPL-4",
    vpl4Expand: "Zobrazit dokument",
    vpl4Collapse: "Minimalizovat dokument",
    vpl4OpenFullscreen: "Otevřít na celou obrazovku",
    vpl4CloseFullscreen: "Zavřít dokument",
    vpl4Missing: "Soubor nebyl nalezen. Nahraj prosím weather-app/public/vpl4.pdf.",
    checkCurrentWeather: "Kontrola aktuálního počasí a letištní situace LKFR",

    airportCategoryLabel: "Zařazení letiště",
    airportOperationLabel: "Typ provozu",
    airportFrequencyLabel: "Oficiální kmitočet",
    trafficCircuitLabel: "Letištní okruhy",
    circuitAltitudeLabel: "Výška okruhu",
    officialRunwayStatusLabel: "Odhad stavu travnaté RWY",
    recentRainLabel: "Srážky za posledních 6 / 12 h",
    officialSourceNote:
      "Zdroj: oficiální text AD LKFR ve VFR příručce ŘLP ČR. NOTAM, SNOWTAM a další provozní informace vždy ověř v AIS View.",
    currentNoticesLabel: "Aktuální provozní informace",
    atisStatusLabel: "ATIS",
    atisUnavailableNote:
      "Na LKFR se standardní ATIS běžně nepublikuje. Pro aktuální provoz sleduj AIS View, METAR/TAF a provozní informaci na Frýdlant RADIO.",
    radioInfoLabel: "Provozní informace / rádio",
    officialBriefingLead:
      "Samostatný briefing pro provozní omezení a stav letiště. Tady ověřuj NOTAM, SNOWTAM, publikované údaje LKFR i návazné aktuální informace.",
    runwayWetRisk: "Mokrá / měkká travnatá RWY",
    runwayWetNote:
      "Travnatá RWY LKFR je po vydatnějších srážkách provozně citlivá. Ověř aktuální použitelnost v oficiálním briefingu.",
    runwaySnowNote:
      "V zimních podmínkách LKFR nemá zajištěné odstraňování sněhu z pohybových ploch. Před letem ověř SNOWTAM / oficiální briefing.",
    runwayNoSofteningSign:
      "Bez modelového náznaku rozbahnění; přesto ověř oficiální briefing.",
    gustsLabel: "Nárazy",
    infoLabel: "Info",
    windLimitLabel: "Mezní vítr",
    windLimitNote:
      "blíží se/meze pro výcvik SPL, zvýšená opatrnost při startu a přistání",
    lkfrTrainingLimitsTitle: "Limity LKFR pro SPL výcvik",
    lkfrCrosswindLimitText: "Crosswind max {crosswind} kt, surface wind max {surfaceWind} kt.",
    lkfrVfrGoodText: "VFR good: dohlednost min {visibilityKm} km, základna min {cloudBase} m AGL.",
    lkfrWetRunwayWarningText: "Mokrá RWY varování: {rain6h} mm/6h nebo {rain12h} mm/12h.",
    lkfrWetRunwayCriticalText: "Mokrá RWY kritické: {rain6h} mm/6h nebo {rain12h} mm/12h.",
    lkfrDataSourceLabel: "Zdroj dat LKFR:",
    meteoDataSourceNote:
      "Zdroj meteo dat: AviationWeather (METAR/TAF) + Open-Meteo (model). Výcvikové prahy jsou konzervativní interní nastavení aplikace pro LKFR/SPL.",
    windShearInTaf: "Wind shear v TAF",
    yes: "ano",
    no: "ne",
    liProxyLabel: "LI proxy",
    cloudCoverageLabel: "pokrytí",
    cloudTypeLabel: "Druh",
    verticalDevelopmentLabel: "Vertikální vývoj",
    riskLabel: "riziko",
    lowRiskLabel: "nízké",
    verticalDevelopmentRiskNote:
      "Přítomné podmínky podporují přerůstání oblačnosti (bouřky/CB).",
    verticalDevelopmentLowNote: "Bez výrazného signálu přerůstání oblačnosti.",
    chartAxesLegendTitle: "Osy a datové vrstvy grafu",
    phenomenaLabel: "Jevy",
    webcamLinkLabel: "Webkamera LKFR",
    vfrSuitable: "VFR: vyhovuje",
    vfrMarginal: "VFR: hraniční",
    vfrNotSuitable: "VFR: nevyhovuje",
    crosswindDemanding: "Náročné",
    crosswindCaution: "Pozor",
    crosswindSuitable: "Vhodné",
    overdevelopmentLabel: "Přerůstání oblačnosti",
    highCloudHeatingReducedLabel: "Útlum ohřevu vysokou oblačností",
    hazardOccurrenceLow: "Výskyt významných jevů: nízký",
    hazardOccurrenceCountLabel: "Výskyt jevů: {count}",
    occurrenceRiskHigh: "Riziko výskytu: vysoké",
    occurrenceRiskMedium: "Riziko výskytu: střední",
    occurrenceRiskLow: "Riziko výskytu: nízké",
    gaforLikeNote:
      "Lokální GAFOR-like odhad z viditelnosti, základny, srážek a větru. Není to oficiální GAFOR produkt.",
    instabilityStrong: "výrazně nestabilní",
    instabilitySlight: "mírně nestabilní",
    instabilityStable: "stabilnější",
    verticalDevelopmentTag: "Vertikální vývoj",
    streetsLabel: "Streets",
    blueThermalsLabel: "Modrá termika",
    weakCuLabel: "Slabé Cu",
    highCloudLabel: "Vysoká oblačnost",
    dayDecayLabel: "Vyhasínání dne",

    noSignificantHazards: "Bez významných meteorologických rizik",

    go: "🟢 GO",
    caution: "🟡 POZOR",
    noGo: "🔴 NO GO",

    semaphoreGoNote: "Podmínky jsou pro plachtění převážně příznivé.",
    semaphoreCautionNote:
      "Podmínky vyžadují zvýšenou pozornost a úsudek pilota.",
    semaphoreNoGoNote: "Podmínky jsou nevhodné nebo provozně nepřijatelné.",

    weak: "🔴 Slabé",
    usable: "🟡 Použitelné",
    good: "🟢 Dobré",
    strong: "🔵 Silné",

    poor: "🔴 Slabé",
    weakDay: "🟡 Slabé",
    goodDay: "🟢 Dobré",
    xcDay: "🔵 XC den",

    flyingGood: "🟢 Dobré podmínky pro let",
    flyingWeak: "🟡 Hraniční podmínky pro let",
    flyingPoor: "🔴 Nevhodné podmínky pro let",

    low: "Nízký",
    moderate: "Střední",
    xcPotentialGood: "Dobrý",
    xcPotentialDay: "XC den",

    skyLowStratus: "Nízký stratus / mlha",
    skyLowOvercast: "Nízká zatažená vrstva",
    skyOvercast: "Zataženo / souvislá oblačnost",
    skyBlueWeak: "Slabý modrý den",
    skyBlueDay: "Modrý den",
    skyBlueThermal: "Modrá termika",
    skyWeakCu: "Slabá kupovitá oblačnost",
    skyCuDay: "Kupovitý vývoj",
    skyCuStreets: "Kupovitá oblačnost v řadách",
    skyUsable: "Použitelný termický režim",
    skyMixed: "Proměnlivý vývoj oblačnosti",
    skyOverdeveloped: "Přerůstající oblačnost",
    skyHighCloudShield: "Vysoká oblačnost tlumící ohřev",
    skyDecaying: "Vyhasínající termika",
    thermalSkyEstimate: "orientační plachtařské hodnocení oblohy",

    pilotLowStratus:
      "nízká vrstvená oblačnost nebo mlha prakticky znemožňují bezpečný let",
    pilotBlueWeak:
      "termika se může vytvářet, bude však slabá a bez spolehlivého značkování",
    pilotBlueThermal:
      "očekává se modrá termika bez kupovité oblačnosti; vyhledávání stoupání bude obtížnější",
    pilotWeakCu:
      "slabá kupovitá oblačnost bude pravděpodobně značit jen slabší a méně pravidelnou termiku",
    pilotCuStreets:
      "kupovitá oblačnost v řadách může výrazně podpořit přeletové podmínky",
    pilotOverdeveloped:
      "oblačnost přerůstá a může omezovat ohřev povrchu nebo přecházet v přeháňky a bouřky",
    pilotHighCloudShield:
      "vysoká oblačnost omezuje sluneční ohřev, a tím i rozvoj termiky",
    pilotDecaying:
      "termika již slábne nebo se rozpadá a podmínky budou dále slábnout",

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

    pilotNoGo: "Podmínky nejsou vhodné pro plachtařský provoz",
    pilotFlyable: "Podmínky jsou vhodné pro plachtařský provoz",
    pilotMarginal: "Podmínky jsou hraniční a vyžadují velmi pečlivé rozhodování pilota",

    pilotConvective:
      "kupovitá oblačnost by měla podporovat využitelnou termiku",
    pilotBlue: "převládá modrá termika s omezeným značkováním",
    pilotOvercast: "souvislá oblačnost omezuje ohřev povrchu a potlačuje termiku",
    pilotMixed: "vývoj oblačnosti je proměnlivý a místy nerovnoměrný",

    pilotStrongerClimbs: "očekávaná stoupání",
    pilotUsableClimbs: "využitelná stoupání",
    pilotWeakClimbs: "spíše slabá stoupání",

    pilotBaseGood: "základny se jeví příznivě, kolem",
    pilotBaseModerate: "základna bude střední, kolem",
    pilotBaseLow: "základna bude spíše nízká, kolem",

    pilotBestWindow: "nejvhodnější letové okno",
    pilotPeakNear: "maximum se očekává kolem",

    pilotWindLight: "přízemní vítr je slabý",
    pilotWindManageable: "přízemní vítr je provozně přijatelný",
    pilotWindCaution: "přízemní vítr vyžaduje zvýšenou pozornost při vzletu i přistání",

    pilotXcVeryGood: "potenciál pro přelet je velmi dobrý",
    pilotXcGood: "potenciál pro přelet je dobrý",
    pilotXcLocal: "možný je kratší místní přelet",
    pilotXcLocalOnly:
      "podmínky jsou vhodnější spíše pro místní létání než pro přelet",

    pilotStormMain: "hlavním omezením je riziko bouřkové činnosti",
    pilotShowers: "srážky mohou zhoršovat využitelnost dne",
    pilotWatchCloud:
      "sledujte rozšiřování oblačnosti a úbytek slunečního ohřevu",
    pilotWatchWind: "sledujte profil větru a drift termiky",

    pilotRiskHigh: "celkové provozní riziko je vysoké",
    pilotRiskModerate: "celkové provozní riziko je střední",
    pilotRiskManageable: "celkové provozní riziko je přijatelné",

    today: "Dnes",
    tomorrow: "Zítra",
    dayPlus2: "Pozítří",

    currentForecastHour: "Aktuální hodina modelu",
    flightDayStart: "Začátek letového dne",
    flightDayEnd: "Konec letového dne",
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
      "Mimo VFR den — mimo interval letového dne (orientačně podle civilního soumraku) nelze let VFR provádět.",
    metarSource: "METAR LKFR (LIVE)",
    modelSource: "MODEL (fallback)",
    windSource: "Zdroj větru",
    metarUnavailable: "MODEL (METAR NEDOSTUPNÝ)",
    metarAvailable: "METAR LKFR (LIVE)",

    lowLayer: "Nízká vrstva",
    middleLayer: "Střední vrstva",
    highLayer: "Vysoká vrstva",
    sourceLabel: "Zdroj",
    observedLabel: "Pozorováno",
    forecastLabel: "Předpověď",
    priorityLabel: "Priorita",
    metarFirstLabel: "LKFR METAR, poté modelový fallback",
    qnh: "QNH",
    visibility: "Dohlednost",
    ceilingLabel: "Základna / ceiling",
    modelSurfaceWind: "Modelový přízemní vítr",
    airportObservedWind: "Letištní přízemní vítr",
    rateNote:
      "Jednoduché hodnocení aplikace. V budoucnu je možné jej rozšířit o formulář nebo další backendové zpracování.",
    metarFallbackLabel: "MODEL (fallback)",
    liveLabel: "LIVE",
    tafLabel: "TAF",
    gaforLikeLabel: "GAFOR-like:",
  },

  en: {
    locale: "en-GB",
    title: "Počasí LKFR",
    subtitle: "Frýdlant nad Ostravicí • test mode",
    updated: "Updated",
    forecastHour: "Forecast hour",
    version: "Version",
    appUpdate: "App update",
    local: "local time",
    allTimesUtc: "All forecast times are in local time",

    language: "Language",
    czech: "Čeština",
    english: "English",
    forecastUnavailable: "Model forecast is temporarily unavailable. Please refresh the page in a moment.",

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
    officialBriefing: "Official LKFR briefing",
    operationalBriefing: "NOTAM / SNOWTAM / ATIS briefing",
    modelForecast: "Model forecast",
    quickLinks: "Quick links",
    appRating: "Rate the app",
    layoutEditor: "App layout",
    layoutReset: "Reset default",
    layoutMoveEarlier: "Move earlier",
    layoutMoveLater: "Move later",
    layoutPickCard: "Pick card",
    layoutPlaceBefore: "Place before this",
    layoutCardSelected: "Card selected",
    layoutDragAndDrop: "Drag and drop",
    layoutSizeSmall: "Small card",
    layoutSizeMedium: "Medium card",
    layoutSizeLarge: "Large card",
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
    openSplTrainer: "Open SPL-TRAINER",
    openOfficialManual: "Open LKFR VFR manual",
    openOfficialBriefing: "Open AIS View / NOTAM briefing",
    openOfficialTextPdf: "Open LKFR text PDF",
    vpl4DocumentTitle: "VPL-4 document",
    vpl4Expand: "Show document",
    vpl4Collapse: "Minimize document",
    vpl4OpenFullscreen: "Open fullscreen",
    vpl4CloseFullscreen: "Close document",
    vpl4Missing: "File not found. Please upload weather-app/public/vpl4.pdf.",
    checkCurrentWeather: "Check current LKFR weather and aerodrome situation",

    airportCategoryLabel: "Aerodrome category",
    airportOperationLabel: "Operation type",
    airportFrequencyLabel: "Official frequency",
    trafficCircuitLabel: "Traffic circuits",
    circuitAltitudeLabel: "Circuit altitude",
    officialRunwayStatusLabel: "Estimated grass runway state",
    recentRainLabel: "Precipitation over last 6 / 12 h",
    officialSourceNote:
      "Source: official LKFR aerodrome text in the Czech ANS VFR manual. Always verify NOTAM, SNOWTAM and operational data in AIS View.",
    currentNoticesLabel: "Current operational notices",
    atisStatusLabel: "ATIS",
    atisUnavailableNote:
      "A standard ATIS is generally not published for LKFR. For current operations use AIS View, METAR/TAF and Frýdlant RADIO information.",
    radioInfoLabel: "Operational information / radio",
    officialBriefingLead:
      "Dedicated briefing block for operational restrictions and aerodrome status. Use it to verify NOTAM, SNOWTAM, published LKFR data and current supporting information.",
    runwayWetRisk: "Wet / soft grass runway",
    runwayWetNote:
      "The LKFR grass runway is operationally sensitive after heavier rain. Verify actual usability in the official briefing.",
    runwaySnowNote:
      "In winter conditions, LKFR does not provide snow removal on movement areas. Verify SNOWTAM / official briefing before flight.",
    runwayNoSofteningSign:
      "No model-derived sign of a soft runway; still verify the official briefing.",
    gustsLabel: "Gusts",
    infoLabel: "Info",
    windLimitLabel: "Wind limit",
    windLimitNote:
      "approaching/training limits for SPL, use extra caution for take-off and landing",
    lkfrTrainingLimitsTitle: "LKFR limits for SPL training",
    lkfrCrosswindLimitText: "Crosswind max {crosswind} kt, surface wind max {surfaceWind} kt.",
    lkfrVfrGoodText: "VFR good: visibility min {visibilityKm} km, cloud base min {cloudBase} m AGL.",
    lkfrWetRunwayWarningText: "Wet RWY warning: {rain6h} mm/6h or {rain12h} mm/12h.",
    lkfrWetRunwayCriticalText: "Wet RWY critical: {rain6h} mm/6h or {rain12h} mm/12h.",
    lkfrDataSourceLabel: "LKFR data source:",
    meteoDataSourceNote:
      "Meteo data source: AviationWeather (METAR/TAF) + Open-Meteo (model). Training thresholds are conservative internal app settings for LKFR/SPL.",
    windShearInTaf: "Wind shear in TAF",
    yes: "yes",
    no: "no",
    liProxyLabel: "LI proxy",
    cloudCoverageLabel: "coverage",
    cloudTypeLabel: "Type",
    verticalDevelopmentLabel: "Vertical development",
    riskLabel: "risk",
    lowRiskLabel: "low",
    verticalDevelopmentRiskNote:
      "Current conditions support vertical overdevelopment (storms/CB).",
    verticalDevelopmentLowNote: "No strong signal of convective overdevelopment.",
    chartAxesLegendTitle: "Chart axes and data layers",
    phenomenaLabel: "Phenomena",
    webcamLinkLabel: "LKFR webcam",
    vfrSuitable: "VFR: suitable",
    vfrMarginal: "VFR: marginal",
    vfrNotSuitable: "VFR: not suitable",
    crosswindDemanding: "Demanding",
    crosswindCaution: "Caution",
    crosswindSuitable: "Suitable",
    overdevelopmentLabel: "Overdevelopment",
    highCloudHeatingReducedLabel: "Heating reduced by high cloud",
    hazardOccurrenceLow: "Hazard occurrence: low",
    hazardOccurrenceCountLabel: "Hazard occurrence: {count}",
    occurrenceRiskHigh: "Occurrence risk: high",
    occurrenceRiskMedium: "Occurrence risk: medium",
    occurrenceRiskLow: "Occurrence risk: low",
    gaforLikeNote:
      "Local GAFOR-like estimate from visibility, cloud base, precipitation and wind. This is not an official GAFOR product.",
    instabilityStrong: "strongly unstable",
    instabilitySlight: "slightly unstable",
    instabilityStable: "more stable",
    verticalDevelopmentTag: "Vertical development",
    streetsLabel: "Streets",
    blueThermalsLabel: "Blue thermals",
    weakCuLabel: "Weak Cu",
    highCloudLabel: "High cloud",
    dayDecayLabel: "Day decay",

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

    skyLowStratus: "Low stratus / fog",
    skyLowOvercast: "Low overcast",
    skyOvercast: "Overcast / spread-out cloud",
    skyBlueWeak: "Weak blue day",
    skyBlueDay: "Blue day",
    skyBlueThermal: "Blue thermal day",
    skyWeakCu: "Weak Cu",
    skyCuDay: "Cu day",
    skyCuStreets: "Cu streets",
    skyUsable: "Usable thermal sky",
    skyMixed: "Mixed development",
    skyOverdeveloped: "Overdevelopment",
    skyHighCloudShield: "High cloud shield",
    skyDecaying: "Decaying thermals",
    thermalSkyEstimate: "approximate soaring sky classification",

    pilotLowStratus:
      "low stratus or fog makes normal soaring effectively impossible",
    pilotBlueWeak:
      "thermals may exist but will be weak and poorly marked",
    pilotBlueThermal:
      "blue thermal conditions are expected, with little or no Cu marking",
    pilotWeakCu:
      "small Cu may indicate only weak and less regular thermals",
    pilotCuStreets:
      "organised cloud streets may strongly support XC conditions",
    pilotOverdeveloped:
      "clouds are overdeveloping and may suppress heating or lead to showers and storms",
    pilotHighCloudShield:
      "high cloud reduces solar heating and weakens convection",
    pilotDecaying:
      "thermals are fading and the day is likely moving into decay",

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
    pilotBlue: "blue thermal conditions with limited cloud marking",
    pilotOvercast: "cloud cover suppresses surface heating and thermals",
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
    pilotXcLocalOnly: "better suited to local flying than XC",

    pilotStormMain: "the main limitation is thunderstorm risk",
    pilotShowers: "precipitation may interrupt the day",
    pilotWatchCloud: "watch for cloud spreading and loss of heating",
    pilotWatchWind: "watch the wind profile and drift",

    pilotRiskHigh: "overall operational risk is high",
    pilotRiskModerate: "overall operational risk is moderate",
    pilotRiskManageable: "overall operational risk is manageable",

    today: "Today",
    tomorrow: "Tomorrow",
    dayPlus2: "Day +2",

    currentForecastHour: "Current forecast hour",
    flightDayStart: "Start of flight day",
    flightDayEnd: "End of flight day",
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
      "Outside VFR day — outside the flight-day interval (approximately civil twilight), VFR operations are not permitted.",
    metarSource: "METAR LKFR (LIVE)",
    modelSource: "MODEL (fallback)",
    windSource: "Wind source",
    metarUnavailable: "MODEL (METAR UNAVAILABLE)",
    metarAvailable: "METAR LKFR (LIVE)",

    lowLayer: "Low layer",
    middleLayer: "Middle layer",
    highLayer: "High layer",
    sourceLabel: "Source",
    observedLabel: "Observed",
    forecastLabel: "Forecast",
    priorityLabel: "Priority",
    metarFirstLabel: "LKFR METAR, then model fallback",
    qnh: "QNH",
    visibility: "Visibility",
    ceilingLabel: "Ceiling",
    modelSurfaceWind: "Model surface wind",
    airportObservedWind: "Aerodrome surface wind",
    rateNote:
      "Simple rating. You can later connect it to a form or backend.",
    metarFallbackLabel: "MODEL (fallback)",
    liveLabel: "LIVE",
    tafLabel: "TAF",
    gaforLikeLabel: "GAFOR-like:",
  },
};

async function getWeather(): Promise<ForecastData | null> {
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
    `&timezone=${encodeURIComponent(LKFR_TIME_ZONE)}` +
    `&timeformat=unixtime`;

  try {
    const res = await fetchWithTimeout(
      url,
      {
        next: { revalidate: 300 },
      },
      9000
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Failed to load forecast:", res.status, text);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("Forecast fetch crashed:", err);
    return null;
  }
}

async function getMetarWind(icao: string) {
  try {
    const res = await fetchWithTimeout(
      `https://aviationweather.gov/api/data/metar?ids=${icao}&format=json`,
      {
        next: { revalidate: 120 },
        headers: {
          "User-Agent": "beskydy-soaring-weather/1.0",
        },
      },
      7000
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

    const gustRaw = metar.wgst;
    const gustKt =
      typeof gustRaw === "number"
        ? gustRaw
        : typeof gustRaw === "string"
        ? Number(gustRaw)
        : null;

    const rawText = typeof metar.rawOb === "string" ? metar.rawOb : "";
    const parsedTempDew = rawText.match(/\s(M?\d{2})\/(M?\d{2})\b/u);
    const parseSignedPair = (value: unknown, fallback: string | undefined) => {
      if (typeof value === "number" && Number.isFinite(value)) return value;
      if (typeof value === "string" && value.length > 0) {
        const numeric = Number(value);
        if (Number.isFinite(numeric)) return numeric;
      }
      if (!fallback) return null;
      const normalized = fallback.startsWith("M") ? `-${fallback.slice(1)}` : fallback;
      const numeric = Number(normalized);
      return Number.isFinite(numeric) ? numeric : null;
    };

    const cloudLayerMatches = Array.from(
      rawText.matchAll(/\b(FEW|SCT|BKN|OVC|VV)(\d{3})(?:CB|TCU)?\b/gu)
    ) as RegExpMatchArray[];

    const cloudLayers = cloudLayerMatches.map((match: RegExpMatchArray) => ({
      cover: match[1],
      baseFtAgl: Number(match[2]) * 100,
      cloudType: match[3] ?? null,
    }));

    const ceilingLayer = cloudLayers.find(
      (layer) => layer.cover === "BKN" || layer.cover === "OVC" || layer.cover === "VV"
    );

    const qnhFromRawQ = rawText.match(/\bQ(\d{4})\b/u);
    const qnhFromRawA = rawText.match(/\bA(\d{4})\b/u);
    const qnhHpa = qnhFromRawQ
      ? Number(qnhFromRawQ[1])
      : qnhFromRawA
      ? Math.round((Number(qnhFromRawA[1]) / 100) * 33.8639)
      : null;

    const visField = metar.visib;
    let visibilityM: number | null = null;

    if (typeof visField === "number" && Number.isFinite(visField)) {
      visibilityM = visField > 20 ? Math.round(visField) : Math.round(visField * 1609.34);
    } else if (typeof visField === "string" && visField.length > 0) {
      const normalized = visField.replace("+", "");
      const asNumber = Number(normalized);
      if (Number.isFinite(asNumber)) {
        visibilityM = asNumber > 20 ? Math.round(asNumber) : Math.round(asNumber * 1609.34);
      }
    }

    if (visibilityM === null) {
      if (/\bCAVOK\b/u.test(rawText)) {
        visibilityM = 10000;
      } else {
        const rawVis = rawText.match(/\b(\d{4})(?:NDV)?\b/u);
        if (rawVis) {
          const parsed = Number(rawVis[1]);
          if (Number.isFinite(parsed) && parsed >= 50 && parsed <= 9999) {
            visibilityM = parsed;
          }
        }
      }
    }

    const weatherCodes = Array.from(
      rawText.matchAll(/\b(?:-\+)?(?:TS|RA|SN|DZ|FG|BR|HZ|SH|GR|GS|FZRA|FZDZ)\b/gu)
    ) as RegExpMatchArray[];

    return {
      speedKt: Number.isFinite(speedKt) ? speedKt : 0,
      gustKt: gustKt !== null && Number.isFinite(gustKt) ? gustKt : null,
      directionDeg: Number.isFinite(directionDeg) ? directionDeg : 0,
      rawText,
      temperatureC: parseSignedPair(metar.temp, parsedTempDew?.[1]),
      dewPointC: parseSignedPair(metar.dewp, parsedTempDew?.[2]),
      cloudLayers,
      ceilingFtAgl: ceilingLayer?.baseFtAgl ?? null,
      qnhHpa: qnhHpa && Number.isFinite(qnhHpa) ? qnhHpa : null,
      visibilityM: visibilityM && Number.isFinite(visibilityM) ? visibilityM : null,
      weatherCodes: weatherCodes.map((match) => match[0]),
    } satisfies MetarObservation;
  } catch {
    return null;
  }
}

async function getTafBriefing(primaryIcao: string, fallbackIcao: string) {
  try {
    const response = await fetchWithTimeout(
      `https://aviationweather.gov/api/data/taf?ids=${primaryIcao},${fallbackIcao}&format=json`,
      {
        next: { revalidate: 120 },
        headers: {
          "User-Agent": "beskydy-soaring-weather/1.0",
        },
      },
      7000
    );

    if (!response.ok) return null;

    const rows = await response.json();
    if (!Array.isArray(rows) || rows.length === 0) return null;

    const primary = rows.find((row: { icaoId?: string }) => row?.icaoId === primaryIcao);
    const chosen = primary ?? rows.find((row: { icaoId?: string }) => row?.icaoId === fallbackIcao) ?? rows[0];

    const hasWindshear = Array.isArray(chosen?.fcsts)
      ? chosen.fcsts.some(
          (fcst: { wshearSpd?: number | null; wshearDir?: number | null; wshearHgt?: number | null }) =>
            typeof fcst?.wshearSpd === "number" ||
            typeof fcst?.wshearDir === "number" ||
            typeof fcst?.wshearHgt === "number"
        )
      : false;

    return {
      sourceIcao: typeof chosen?.icaoId === "string" ? chosen.icaoId : fallbackIcao,
      rawTaf: typeof chosen?.rawTAF === "string" ? chosen.rawTAF : "",
      hasWindshear,
    } satisfies TafBriefing;
  } catch {
    return null;
  }
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/giu, " ")
    .replace(/&amp;/giu, "&")
    .replace(/&quot;/giu, '"')
    .replace(/&apos;/giu, "'")
    .replace(/&lt;/giu, "<")
    .replace(/&gt;/giu, ">")
    .replace(/&deg;/giu, "°")
    .replace(/&#(\d+);/gu, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/giu, (_, code: string) =>
      String.fromCharCode(Number.parseInt(code, 16))
    );
}

function htmlToPlainText(value: string) {
  return decodeHtmlEntities(
    value
      .replace(/<br\s*\/?>/giu, "\n")
      .replace(/<\/\s*(p|div|tr|li|ul|table|h\d)\s*>/giu, "\n")
      .replace(/<li[^>]*>/giu, "- ")
      .replace(/<[^>]+>/gu, " ")
  )
    .replace(/[ \t]+\n/gu, "\n")
    .replace(/\n{2,}/gu, "\n")
    .replace(/[ \t]{2,}/gu, " ")
    .trim();
}

function extractHtmlText(html: string, pattern: RegExp) {
  const match = html.match(pattern);
  if (!match?.[1]) return null;
  const value = htmlToPlainText(match[1]);
  return value.length > 0 ? value : null;
}

async function getOfficialAirportBriefing(): Promise<OfficialAirportBriefing | null> {
  try {
    const response = await fetchWithTimeout(
      AIM_VFR_MANUAL_URL,
      {
        next: { revalidate: 1800 },
      },
      7000
    );

    if (!response.ok) return null;

    const html = await response.text();
    const circuitSection =
      html.match(
        /<span class="number">1\.3<\/span>Letištní okruhy([\s\S]*?)<p class="level2"><span class="number">1\.3\.1<\/span>/iu
      )?.[1] ?? "";

    const circuitDirections = Array.from(
      circuitSection.matchAll(/<li>\s*([^<]+)\s*<\/li>/giu)
    )
      .map((match) => htmlToPlainText(match[1]))
      .filter(Boolean);

    const frequencyMatch = html.match(
      /<div id="aerodrome-frekvence"[\s\S]*?<span>(.*?)<\/span>\s*([^<]+)/iu
    );

    const frequency = frequencyMatch
      ? `${htmlToPlainText(frequencyMatch[1])} ${htmlToPlainText(frequencyMatch[2])}`.trim()
      : null;

    const runwayWarnings = [
      extractHtmlText(html, /<span class="number">1\.1<\/span>([\s\S]*?)<\/p>/iu),
      extractHtmlText(html, /<span class="number">1\.2<\/span>([\s\S]*?)<\/p>/iu),
      extractHtmlText(html, /<span class="number">1\.4\.2<\/span>([\s\S]*?)<\/p>/iu),
    ].filter((value): value is string => Boolean(value));

    return {
      category: extractHtmlText(html, /<div id="aerodrome-statut"[^>]*>([\s\S]*?)<\/div>/iu),
      operation: extractHtmlText(html, /<div id="aerodrome-provoz"[^>]*>([\s\S]*?)<\/div>/iu),
      frequency,
      circuitAltitude: extractHtmlText(
        html,
        /<span class="number">1\.3\.1<\/span>Výška letu po okruhu je\s*([\s\S]*?)<\/p>/iu
      ),
      circuitDirections,
      runwayWarnings,
    } satisfies OfficialAirportBriefing;
  } catch {
    return null;
  }
}

function getMetarCoverageLabel(cover: string, lang: Lang) {
  const labels = {
    cs: {
      FEW: "malá oblačnost",
      SCT: "polojasno až oblačno",
      BKN: "oblačno",
      OVC: "zataženo",
      VV: "vertikální dohled",
    },
    en: {
      FEW: "few",
      SCT: "scattered",
      BKN: "broken",
      OVC: "overcast",
      VV: "vertical visibility",
    },
  } as const;

  return labels[lang][cover as keyof (typeof labels)["cs"]] ?? cover;
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

function sumRecentValues(arr: number[] | undefined, endIndex: number, hours: number) {
  if (!arr?.length || endIndex < 0) return 0;

  const startIndex = Math.max(0, endIndex - hours + 1);
  let total = 0;

  for (let index = startIndex; index <= endIndex; index += 1) {
    total += safeArrayValue(arr, index, 0);
  }

  return Math.round(total * 10) / 10;
}

function findNearestHourIndex(times: number[]) {
  if (!times.length) return 0;

  const now = Date.now();
  let bestIndex = 0;
  let bestDiff = Infinity;

  for (let i = 0; i < times.length; i++) {
    const ts = times[i] * 1000;
    const diff = Math.abs(ts - now);

    if (diff < bestDiff) {
      bestDiff = diff;
      bestIndex = i;
    }
  }

  return bestIndex;
}

function findLatestAvailableHourIndex(times: number[]) {
  if (!times.length) return 0;

  const nowSec = Math.floor(Date.now() / 1000);

  for (let i = times.length - 1; i >= 0; i -= 1) {
    if (times[i] <= nowSec) return i;
  }

  return 0;
}

function formatHourMinute(timestampSec: number, locale: string) {
  return new Date(timestampSec * 1000).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: LKFR_TIME_ZONE,
  });
}

function getDateKey(timestampSec: number) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: LKFR_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return fmt.format(new Date(timestampSec * 1000));
}

function getHourInPrague(timestampSec: number) {
  const hour = new Intl.DateTimeFormat("en-GB", {
    timeZone: LKFR_TIME_ZONE,
    hour: "2-digit",
    hour12: false,
  }).format(new Date(timestampSec * 1000));

  return Number(hour);
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
    precipitation: number;
    precipitationProbability: number;
    surfaceWind: number;
    wind850: number;
    isWithinVfrDay: boolean;
    currentHour: number;
    sunriseHour: number;
    sunsetHour: number;
  },
  t: Translation
) {
  const {
    cloudLow,
    cloudMid,
    cloudHigh,
    clouds,
    radiation,
    spread,
    lcl,
    precipitation,
    precipitationProbability,
    surfaceWind,
    wind850,
    isWithinVfrDay,
    currentHour,
    sunriseHour,
    sunsetHour,
  } = params;

  const convectiveWindow =
    isWithinVfrDay &&
    currentHour >= sunriseHour + 2 &&
    currentHour <= sunsetHour - 2;

  const lowStratus = cloudLow >= 85 && lcl < 350 && radiation < 120;

  const lowOvercast = cloudLow >= 75 && lcl < 700 && radiation < 180;

  const overcast =
    (clouds >= 90 || cloudLow >= 80) && radiation < 220 && spread < 6;

  const highCloudShield =
    cloudHigh >= 70 && cloudLow < 50 && radiation < 260;

  const overdeveloped =
    convectiveWindow &&
    cloudLow >= 70 &&
    cloudMid >= 45 &&
    radiation < 220 &&
    spread >= 4 &&
    (precipitation > 0.1 || precipitationProbability >= 45);

  const blueWeak =
    cloudLow < 15 &&
    cloudMid < 20 &&
    cloudHigh < 35 &&
    radiation >= 220 &&
    radiation < 420 &&
    spread >= 2.5 &&
    spread < 5.5;

  const blueThermal =
    cloudLow < 20 &&
    cloudMid < 25 &&
    cloudHigh < 35 &&
    radiation >= 380 &&
    spread >= 5.5 &&
    lcl >= 700;

  const weakCu =
    cloudLow >= 15 &&
    cloudLow < 35 &&
    radiation >= 250 &&
    spread >= 3 &&
    lcl >= 600 &&
    lcl < 1100;

  const cuDay =
    cloudLow >= 25 &&
    cloudLow <= 60 &&
    radiation >= 300 &&
    spread >= 4.5 &&
    lcl >= 900 &&
    precipitation < 0.1;

  const cuStreets =
    cloudLow >= 25 &&
    cloudLow <= 60 &&
    radiation >= 320 &&
    spread >= 5 &&
    lcl >= 1100 &&
    surfaceWind >= 8 &&
    surfaceWind <= 18 &&
    wind850 >= 12 &&
    wind850 <= 28 &&
    cloudMid < 35 &&
    precipitation < 0.1;

  const usable =
    radiation >= 220 &&
    spread >= 3 &&
    lcl >= 600 &&
    !overcast &&
    !lowOvercast &&
    !lowStratus;

  const decaying =
    isWithinVfrDay &&
    currentHour >= sunsetHour - 2 &&
    radiation < 180 &&
    spread < 5;

  if (lowStratus) {
    return {
      label: t.skyLowStratus,
      className: "badgeRed",
      convective: false,
      overcast: true,
      blue: false,
      streeting: false,
      riskOd: false,
    };
  }

  if (lowOvercast) {
    return {
      label: t.skyLowOvercast,
      className: "badgeRed",
      convective: false,
      overcast: true,
      blue: false,
      streeting: false,
      riskOd: false,
    };
  }

  if (overdeveloped) {
    return {
      label: t.skyOverdeveloped,
      className: "badgeRed",
      convective: true,
      overcast: false,
      blue: false,
      streeting: false,
      riskOd: true,
    };
  }

  if (overcast) {
    return {
      label: t.skyOvercast,
      className: "badgeRed",
      convective: false,
      overcast: true,
      blue: false,
      streeting: false,
      riskOd: false,
    };
  }

  if (highCloudShield) {
    return {
      label: t.skyHighCloudShield,
      className: "badgeYellow",
      convective: false,
      overcast: false,
      blue: false,
      streeting: false,
      riskOd: false,
    };
  }

  if (cuStreets) {
    return {
      label: t.skyCuStreets,
      className: "badgeBlue",
      convective: true,
      overcast: false,
      blue: false,
      streeting: true,
      riskOd: false,
    };
  }

  if (cuDay) {
    return {
      label: t.skyCuDay,
      className: "badgeGreen",
      convective: true,
      overcast: false,
      blue: false,
      streeting: false,
      riskOd: false,
    };
  }

  if (weakCu) {
    return {
      label: t.skyWeakCu,
      className: "badgeYellow",
      convective: true,
      overcast: false,
      blue: false,
      streeting: false,
      riskOd: false,
    };
  }

  if (blueThermal) {
    return {
      label: t.skyBlueThermal,
      className: "badgeBlue",
      convective: false,
      overcast: false,
      blue: true,
      streeting: false,
      riskOd: false,
    };
  }

  if (blueWeak) {
    return {
      label: t.skyBlueWeak,
      className: "badgeYellow",
      convective: false,
      overcast: false,
      blue: true,
      streeting: false,
      riskOd: false,
    };
  }

  if (decaying) {
    return {
      label: t.skyDecaying,
      className: "badgeYellow",
      convective: false,
      overcast: false,
      blue: false,
      streeting: false,
      riskOd: false,
    };
  }

  if (usable) {
    return {
      label: t.skyUsable,
      className: "badgeGreen",
      convective: false,
      overcast: false,
      blue: false,
      streeting: false,
      riskOd: false,
    };
  }

  return {
    label: t.skyMixed,
    className: "badgeYellow",
    convective: false,
    overcast: false,
    blue: false,
    streeting: false,
    riskOd: false,
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

  if (skyType === t.skyLowStratus) {
    parts.push(t.pilotLowStratus);
  } else if (skyType === t.skyLowOvercast || skyType === t.skyOvercast) {
    parts.push(t.pilotOvercast);
  } else if (skyType === t.skyHighCloudShield) {
    parts.push(t.pilotHighCloudShield);
  } else if (skyType === t.skyOverdeveloped) {
    parts.push(t.pilotOverdeveloped);
  } else if (skyType === t.skyCuStreets) {
    parts.push(t.pilotCuStreets);
  } else if (skyType === t.skyCuDay) {
    parts.push(t.pilotConvective);
  } else if (skyType === t.skyWeakCu) {
    parts.push(t.pilotWeakCu);
  } else if (skyType === t.skyBlueThermal || skyType === t.skyBlueDay) {
    parts.push(t.pilotBlueThermal);
  } else if (skyType === t.skyBlueWeak) {
    parts.push(t.pilotBlueWeak);
  } else if (skyType === t.skyDecaying) {
    parts.push(t.pilotDecaying);
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
      `${t.pilotBestWindow} ${thermalStart}–${thermalEnd}; ${t.pilotPeakNear} ${thermalMax}`
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

  return (
    parts
      .filter(Boolean)
      .map((part) =>
        part && part.length > 0
          ? part.charAt(0).toUpperCase() + part.slice(1)
          : part
      )
      .join(". ") + "."
  );
}

function getCoverageLabel(value: number, lang: Lang) {
  if (lang === "cs") {
    if (value >= 85) return "zataženo";
    if (value >= 60) return "výrazná oblačnost";
    if (value >= 35) return "proměnlivá oblačnost";
    if (value >= 10) return "malá oblačnost";
    return "převážně jasno";
  }

  if (value >= 85) return "overcast";
  if (value >= 60) return "significant cloud";
  if (value >= 35) return "variable cloud";
  if (value >= 10) return "few clouds";
  return "mostly clear";
}

function toOktas(coverPercent: number) {
  return Math.max(0, Math.min(8, Math.round((coverPercent / 100) * 8)));
}

function formatTranslation(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}

function translateAirportBriefing(briefing: OfficialAirportBriefing | null, lang: Lang): OfficialAirportBriefing | null {
  if (!briefing || lang === "cs") return briefing;

  // Translate category
  const categoryMap: Record<string, string> = {
    "Veřejné letiště": "Public aerodrome",
    "Soukromé letiště": "Private aerodrome",
    "Civilní letiště": "Civil aerodrome",
  };

  // Translate operation types
  const operationMap: Record<string, string> = {
    "Sportovní/letová činnost": "Sporting/flying activity",
    "Letová aktivita": "Flying activity",
    "Sportovní činnost": "Sporting activity",
    "Schváleno pro veřejný provoz": "Approved for public operations",
  };

  // Translate circuit directions
  const directionMap: Record<string, string> = {
    "L": "L (left)",
    "R": "R (right)",
    "LH": "LH (left)",
    "RH": "RH (right)",
    "S": "N (north)",
    "J": "S (south)",
    "V": "E (east)",
    "Z": "W (west)",
  };

  const translateRunwayWarning = (warning: string) => {
    const normalized = warning.trim();

    if (/Odstraňování\s+sněhu\s+z\s+pohybových\s+ploch\s+není\s+zajištěno\.?/iu.test(normalized)) {
      return "Snow removal on movement areas is not provided.";
    }

    if (/Nepoužitelnost\s+RWY\s+po\s+dlouhotrvajících\s+deštích\.?/iu.test(normalized)) {
      return "RWY may become unusable after prolonged rainfall.";
    }

    if (/Možnost\s+výskytu\s+nežádoucích\s+osob[\s\S]*RWY\s*08\/26/iu.test(normalized)) {
      return "Possible presence of unauthorized persons crossing RWY 08/26 in the threshold and approach areas, and along the southern edge of the runway strip. Conduct takeoff, landing and taxi with increased caution.";
    }

    return warning;
  };

  return {
    category: categoryMap[briefing.category ?? ""] ?? briefing.category,
    operation: operationMap[briefing.operation ?? ""] ?? briefing.operation,
    frequency: briefing.frequency,
    circuitAltitude: briefing.circuitAltitude,
    circuitDirections: briefing.circuitDirections.map(d => directionMap[d] ?? d),
    runwayWarnings: briefing.runwayWarnings.map(translateRunwayWarning),
  };
}

function getGaforLikeCategory(params: {
  isWithinVfrDay: boolean;
  visibilityM: number | null;
  cloudBaseAglM: number;
  hasStorm: boolean;
  hasStrongWind: boolean;
  hasRain: boolean;
  hasOvercast: boolean;
}) {
  const { isWithinVfrDay, visibilityM, cloudBaseAglM, hasStorm, hasStrongWind, hasRain, hasOvercast } = params;

  if (!isWithinVfrDay || hasStorm || (visibilityM !== null && visibilityM < 3000) || cloudBaseAglM < 300) {
    return "X";
  }

  if ((visibilityM !== null && visibilityM < 5000) || cloudBaseAglM < 500 || hasStrongWind) {
    return "M";
  }

  if ((visibilityM !== null && visibilityM < 8000) || cloudBaseAglM < 900 || hasRain || hasOvercast) {
    return "D";
  }

  return "O";
}

function getSkyDescription(skyLabel: string, t: Translation) {
  if (skyLabel === t.skyLowStratus) return t.pilotLowStratus;
  if (skyLabel === t.skyLowOvercast || skyLabel === t.skyOvercast) {
    return t.pilotOvercast;
  }
  if (skyLabel === t.skyHighCloudShield) return t.pilotHighCloudShield;
  if (skyLabel === t.skyOverdeveloped) return t.pilotOverdeveloped;
  if (skyLabel === t.skyCuStreets) return t.pilotCuStreets;
  if (skyLabel === t.skyCuDay) return t.pilotConvective;
  if (skyLabel === t.skyWeakCu) return t.pilotWeakCu;
  if (skyLabel === t.skyBlueThermal || skyLabel === t.skyBlueDay) {
    return t.pilotBlueThermal;
  }
  if (skyLabel === t.skyBlueWeak) return t.pilotBlueWeak;
  if (skyLabel === t.skyDecaying) return t.pilotDecaying;
  return t.pilotMixed;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const lang: Lang = params?.lang === "en" ? "en" : "cs";
  const profileCfg = studentProfileCfg;
  const t = translations[lang];

  const [data, metarWind, airportBriefingRaw, tafBriefing] = await Promise.all([
    getWeather(),
    getMetarWind("LKFR"),
    getOfficialAirportBriefing(),
    getTafBriefing("LKFR", "LKMT"),
  ]);

  const airportBriefing = translateAirportBriefing(airportBriefingRaw, lang);

  if (!data) {
    return (
      <main className="container">
        <div className="topHeaderRow">
          <div>
            <h1 className="titleWithLogo">
              <img
                src="/icon.svg"
                alt="SPL Trainer logo"
                className="topBrandLogo"
                width={56}
                height={56}
              />
              <span>{t.title}</span>
            </h1>
            <h2>{t.subtitle}</h2>
          </div>

          <div className="headerControls">
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
        </div>

        <div className="card" style={{ marginTop: "18px" }}>
          <h3>⚠️ {t.modelForecast}</h3>
          <p style={{ lineHeight: 1.7, margin: 0 }}>
            {t.forecastUnavailable}
          </p>
        </div>

        <footer className="card disclaimerCard" style={{ marginTop: "18px" }}>
          <h3 className="disclaimerTitleRow">
            <Info size={18} />
            {t.disclaimerTitle}
          </h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>{t.disclaimerText}</p>
        </footer>
      </main>
    );
  }

  const hasMetar = !!metarWind;

  const currentIndex = findNearestHourIndex(data.hourly.time);
  const currentDateKey = getDateKey(data.hourly.time[currentIndex]);

  const dailyIndex = data.daily.sunrise.findIndex(
    (s: number) => getDateKey(s) === currentDateKey
  );

  const sunriseRaw =
    dailyIndex >= 0 ? data.daily.sunrise[dailyIndex] : data.daily.sunrise[0];
  const sunsetRaw =
    dailyIndex >= 0 ? data.daily.sunset[dailyIndex] : data.daily.sunset[0];

  const vfrDayStartRaw = sunriseRaw + VFR_DAY_START_OFFSET_SEC;
  const vfrDayEndRaw = sunsetRaw + VFR_DAY_END_OFFSET_SEC;

  const vfrDayStartTime = vfrDayStartRaw ? new Date(vfrDayStartRaw * 1000) : null;
  const vfrDayEndTime = vfrDayEndRaw ? new Date(vfrDayEndRaw * 1000) : null;

  const vfrDayStartLabel = vfrDayStartRaw ? formatHourMinute(vfrDayStartRaw, t.locale) : "-";
  const vfrDayEndLabel = vfrDayEndRaw ? formatHourMinute(vfrDayEndRaw, t.locale) : "-";

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
  const recentPrecipitation6h = sumRecentValues(data.hourly.precipitation, currentIndex, 6);
  const recentPrecipitation12h = sumRecentValues(data.hourly.precipitation, currentIndex, 12);
  const runwayWetRisk =
    recentPrecipitation6h >= LKFR_LIMITS.runwayWet6hWarnMm ||
    recentPrecipitation12h >= LKFR_LIMITS.runwayWet12hWarnMm;
  const runwayVeryWetRisk =
    recentPrecipitation6h >= LKFR_LIMITS.runwayWet6hBadMm ||
    recentPrecipitation12h >= LKFR_LIMITS.runwayWet12hBadMm;

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
  const observedTemperature = hasMetar && metarWind!.temperatureC !== null
    ? metarWind!.temperatureC
    : temperature;
  const observedDewPoint = hasMetar && metarWind!.dewPointC !== null
    ? metarWind!.dewPointC
    : dewpoint;
  const metarPhenomena = hasMetar ? metarWind!.weatherCodes : [];
  const hasMetarSnowPhenomena = metarPhenomena.some((code) => /SN|SG|GS|PL|FZRA|FZDZ/i.test(code));
  const runwaySnowRisk = hasMetarSnowPhenomena;
  const metarCloudLayers = hasMetar ? metarWind!.cloudLayers : [];
  const hasMetarCloudLayers = metarCloudLayers.length > 0;
  const metarQnh = hasMetar ? metarWind!.qnhHpa : null;
  const metarQfe = metarQnh !== null ? Math.round(metarQnh - FIELD_ELEVATION_MSL / 8.3) : null;
  const metarVisibility = hasMetar ? metarWind!.visibilityM : null;
  const metarGust = hasMetar ? metarWind!.gustKt : null;
  const metarCeiling = hasMetar ? metarWind!.ceilingFtAgl : null;

  const runwayHeading = 84;
  const runwayRotation = runwayHeading - 90;
  const angleDiff =
    ((airportSurfaceWindDir - runwayHeading + 540) % 360) - 180;
  const rad = (angleDiff * Math.PI) / 180;
  const compassTicks = Array.from({ length: 36 }, (_, index) => ({
    angle: index * 10,
    major: index % 3 === 0,
  }));

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
  const cloudBaseAglM = metarCeiling ? Math.round(metarCeiling * 0.3048) : lcl;
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

  const thermalArray = data.hourly.temperature_2m.map((temp: number, i: number) => {
    const td = safeArrayValue(data.hourly.dew_point_2m, i);
    const low = safeArrayValue(data.hourly.cloud_cover_low, i, 0);
    const mid = safeArrayValue(data.hourly.cloud_cover_mid, i, 0);
    const high = safeArrayValue(data.hourly.cloud_cover_high, i, 0);
    const radNow = safeArrayValue(data.hourly.shortwave_radiation, i, 0);
    const rain = safeArrayValue(data.hourly.precipitation, i, 0);
    const rainProb = safeArrayValue(data.hourly.precipitation_probability, i, 0);
    const sfcWind = kmhToKt(safeArrayValue(data.hourly.wind_speed_10m, i, 0));
    const w850Now = kmhToKt(safeArrayValue(data.hourly.wind_speed_850hPa, i, 0));
    const w700Now = kmhToKt(safeArrayValue(data.hourly.wind_speed_700hPa, i, 0));

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

  const hours = data.hourly.time.map((ts: number) =>
    new Date(ts * 1000).toLocaleTimeString(t.locale, {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: LKFR_TIME_ZONE,
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

  const forecastTs = data.hourly.time[currentIndex] * 1000;
  const isWithinVfrDay =
    vfrDayStartTime !== null &&
    vfrDayEndTime !== null &&
    forecastTs >= vfrDayStartTime.getTime() &&
    forecastTs <= vfrDayEndTime.getTime();

  const vfrVisibilityOk = (metarVisibility ?? 10000) >= LKFR_LIMITS.vfrVisibilityGoodM;
  const vfrCloudBaseOk = cloudBaseAglM >= LKFR_LIMITS.vfrCloudBaseGoodM;
  const vfrWindOk =
    airportSurfaceWindKt <= LKFR_LIMITS.vfrSurfaceWindMaxKt &&
    crosswindAbs <= LKFR_LIMITS.vfrCrosswindMaxKt;
  const vfrOverallOk = isWithinVfrDay && vfrVisibilityOk && vfrCloudBaseOk && vfrWindOk;
  const vfrOverallMarginal =
    isWithinVfrDay &&
    (metarVisibility ?? 10000) >= LKFR_LIMITS.vfrVisibilityMarginalM &&
    cloudBaseAglM >= LKFR_LIMITS.vfrCloudBaseMarginalM;

  const vfrStatusLabel = vfrOverallOk
    ? t.vfrSuitable
    : vfrOverallMarginal
    ? t.vfrMarginal
    : t.vfrNotSuitable;

  const vfrStatusClass = vfrOverallOk
    ? "badgeGreen"
    : vfrOverallMarginal
    ? "badgeYellow"
    : "badgeRed";

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

  const THERMAL_THRESHOLD = profileCfg.thermalWindowThreshold;

  const sunriseTs = vfrDayStartTime ? vfrDayStartTime.getTime() : null;
  const sunsetTs = vfrDayEndTime ? vfrDayEndTime.getTime() : null;

  const vfrIndices = data.hourly.time
    .map((tsSec: number, i: number) => {
      const ts = tsSec * 1000;
      const sameDay = getDateKey(tsSec) === currentDateKey;
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
    if (
      thermalArray[i] >= THERMAL_THRESHOLD &&
      thermalArray[i] > bestThermalValue
    ) {
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

  const hasUsableThermalWindow =
    thermalStartIndex >= 0 &&
    thermalMaxIndex >= 0 &&
    thermalEndIndex >= 0;

  const thermalStart = hasUsableThermalWindow ? hours[thermalStartIndex] : "-";
  const thermalMax = hasUsableThermalWindow ? hours[thermalMaxIndex] : "-";
  const thermalEnd = hasUsableThermalWindow ? hours[thermalEndIndex] : "-";

  const currentHour = getHourInPrague(data.hourly.time[currentIndex]);
  const sunriseHour = sunriseRaw ? getHourInPrague(sunriseRaw) : 0;
  const sunsetHour = sunsetRaw ? getHourInPrague(sunsetRaw) : 23;

  const sky = detectSkyType(
    {
      cloudLow,
      cloudMid,
      cloudHigh,
      clouds,
      radiation,
      spread,
      lcl,
      precipitation,
      precipitationProbability,
      surfaceWind: airportSurfaceWindKt,
      wind850,
      isWithinVfrDay,
      currentHour,
      sunriseHour,
      sunsetHour,
    },
    t
  );

  const hazards: {
    label: string;
    type: string;
    severity: number;
  }[] = [];

  if (
    precipitationProbability > 60 &&
    cloudLow > 50 &&
    cloudMid > 50 &&
    expectedClimb > 2.2
  ) {
    hazards.push({ label: t.stormRisk, type: "storm", severity: 6 });
  }
  if (observedTemperature < 0) {
    hazards.push({ label: t.freezing, type: "ice", severity: 5 });
  }
  if (hasMetarSnowPhenomena) {
    hazards.push({ label: t.snow, type: "snow", severity: 5 });
  }
  if (
    airportSurfaceWindKt > LKFR_LIMITS.strongWindSurfaceKt ||
    wind850 > LKFR_LIMITS.strongWind850Kt ||
    crosswindAbs > LKFR_LIMITS.strongWindCrosswindKt
  ) {
    hazards.push({
      label: t.strongWind,
      type: "wind",
      severity: 4,
    });
  }
  if (precipitation > 0.2 || precipitationProbability > 45) {
    hazards.push({ label: t.rain, type: "rain", severity: 3 });
  }
  if (runwayWetRisk) {
    hazards.push({ label: t.runwayWetRisk, type: "rain", severity: 4 });
  }
  if (lcl < 500 || (cloudLow > 75 && radiation < 180)) {
    hazards.push({
      label: t.lowCloudBase,
      type: "cloud",
      severity: 2,
    });
  }
  if (sky.overcast) {
    hazards.push({
      label: t.overcastRisk,
      type: "overcast",
      severity: 1,
    });
  }

  if (sky.riskOd) {
    hazards.push({
      label: t.overdevelopmentLabel,
      type: "storm",
      severity: 5,
    });
  }

  if (sky.label === t.skyHighCloudShield) {
    hazards.push({
      label: t.highCloudHeatingReducedLabel,
      type: "overcast",
      severity: 2,
    });
  }

  hazards.sort((a, b) => b.severity - a.severity);

  const hasStorm = hazards.some((h) => h.type === "storm");
  const hasRain = hazards.some((h) => h.type === "rain");
  const hasStrongWind = hazards.some((h) => h.type === "wind");
  const hasOvercast = hazards.some((h) => h.type === "overcast");
  const hasIce = hazards.some((h) => h.type === "ice");
  const hasSnow = hazards.some((h) => h.type === "snow");
  const hasRunwaySnowRisk = runwaySnowRisk || hasSnow;

  const hazardOccurrenceText =
    hazards.length === 0
      ? t.hazardOccurrenceLow
      : formatTranslation(t.hazardOccurrenceCountLabel, { count: hazards.length });

  const operationalRisk = Math.round(
    clamp(
      (hasStorm ? 35 : 0) +
        (hasRain ? 18 : 0) +
        (runwayWetRisk ? (runwayVeryWetRisk ? 24 : 12) : 0) +
        (hasRunwaySnowRisk ? 28 : 0) +
        clamp(crosswindAbs * 2, 0, 20) +
        clamp(airportSurfaceWindKt > 0 ? airportSurfaceWindKt * 1.2 : 0, 0, 20) +
        clamp((sky.overcast ? 18 : 0) + (cloudLow > 70 ? 8 : 0), 0, 18),
      0,
      100
    )
  );

  const hazardRiskText =
    operationalRisk >= 60
      ? t.occurrenceRiskHigh
      : operationalRisk >= 35
      ? t.occurrenceRiskMedium
      : t.occurrenceRiskLow;

  const gaforCategory = getGaforLikeCategory({
    isWithinVfrDay,
    visibilityM: metarVisibility,
    cloudBaseAglM,
    hasStorm,
    hasStrongWind,
    hasRain,
    hasOvercast,
  });

  const gaforLabel =
    gaforCategory === "O"
      ? "O (open)"
      : gaforCategory === "D"
      ? "D (difficult)"
      : gaforCategory === "M"
      ? "M (marginal)"
      : "X (closed)";

  const gaforNote =
    t.gaforLikeNote;

  const instabilityIndex =
    Math.round((6 - (spread * 0.75 + radiation / 260 - cloudLow / 130)) * 10) / 10;
  const instabilityLabel =
    instabilityIndex <= -2
      ? t.instabilityStrong
      : instabilityIndex <= 1
      ? t.instabilitySlight
      : t.instabilityStable;

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
    operationalRisk >= profileCfg.noGoOperationalRisk ||
    lcl < 350 ||
    crosswindAbs > profileCfg.noGoCrosswind ||
    airportSurfaceWindKt > profileCfg.noGoSurfaceWind ||
    runwayVeryWetRisk ||
    hasRunwaySnowRisk ||
    hasStorm ||
    hasIce ||
    hasSnow
  ) {
    semaphore = t.noGo;
    semaphoreClass = "badgeRed";
    semaphoreNote = t.semaphoreNoGoNote;
  } else if (
    effectiveThermalScore >= profileCfg.goMinThermalScore &&
    operationalRisk < profileCfg.goMaxOperationalRisk &&
    lcl > profileCfg.goMinLcl
  ) {
    semaphore = t.go;
    semaphoreClass = "badgeGreen";
    semaphoreNote = t.semaphoreGoNote;
  }

  if (semaphoreClass === "badgeGreen" && runwayWetRisk) {
    semaphore = t.caution;
    semaphoreClass = "badgeYellow";
    semaphoreNote = t.runwayWetNote;
  }

  if (semaphoreClass === "badgeRed" && hasRunwaySnowRisk && !hasStorm) {
    semaphoreNote = t.runwaySnowNote;
  } else if (semaphoreClass !== "badgeGreen" && runwayWetRisk && !hasStorm) {
    semaphoreNote = t.runwayWetNote;
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

  const latestForecastIndex = findLatestAvailableHourIndex(data.hourly.time);
  const latestForecastTimestamp = data.hourly.time[latestForecastIndex];
  const latestForecastLocalLabel = latestForecastTimestamp
    ? new Date(latestForecastTimestamp * 1000).toLocaleString(t.locale, {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: LKFR_TIME_ZONE,
      })
    : "n/a";

  let soaringClass = "badgeRed";

  const runwayStateText = hasRunwaySnowRisk
    ? t.runwaySnowNote
    : runwayVeryWetRisk
    ? t.runwayWetNote
    : runwayWetRisk
    ? t.runwayWetNote
    : t.runwayNoSofteningSign;
  const runwayStateClass = hasRunwaySnowRisk || runwayVeryWetRisk
    ? "bad"
    : runwayWetRisk
    ? "warn"
    : "go";
  if (displayedSoaringIndex > 30) soaringClass = "badgeYellow";
  if (displayedSoaringIndex > 50) soaringClass = "badgeGreen";
  if (displayedSoaringIndex > 70) soaringClass = "badgeBlue";

  let flyingClass = "badgeYellow";
  if (flyingCondition.includes("🟢")) flyingClass = "badgeGreen";
  if (flyingCondition.includes("🔴")) flyingClass = "badgeRed";

  let trainingWindClass = "badgeGreen";
  if (crosswindAbs > 6) trainingWindClass = "badgeYellow";
  if (crosswindAbs > 10 || airportSurfaceWindKt > 14) trainingWindClass = "badgeRed";

  const summaryParts: string[] = [];
  if (effectiveThermalScore < 30) summaryParts.push(t.summaryWeak);
  else if (effectiveThermalScore < 60) summaryParts.push(t.summaryModerate);
  else summaryParts.push(t.summaryGood);

  if (lcl < 600) summaryParts.push(t.summaryLowBase);
  if (sky.overcast) summaryParts.push(t.overcastRisk);
  if (airportSurfaceWindKt > 12 || crosswindAbs > 10) summaryParts.push(t.summaryWindy);
  if (sky.convective) summaryParts.push(t.summaryCu);
  if (sky.label === t.skyCuStreets) {
    summaryParts.push(t.streetsLabel);
  }
  if (sky.label === t.skyBlueThermal) {
    summaryParts.push(t.blueThermalsLabel);
  }
  if (sky.label === t.skyWeakCu) {
    summaryParts.push(t.weakCuLabel);
  }
  if (sky.label === t.skyOverdeveloped) {
    summaryParts.push(t.overdevelopmentLabel);
  }
  if (sky.label === t.skyHighCloudShield) {
    summaryParts.push(t.highCloudLabel);
  }
  if (sky.label === t.skyDecaying) {
    summaryParts.push(t.dayDecayLabel);
  }
  if (xcPotential === t.xcPotentialGood || xcPotential === t.xcPotentialDay) {
    summaryParts.push(t.summaryXc);
  }

  const flightSummary = !isWithinVfrDay
    ? t.outsideVfrNote
    : summaryParts.join(" • ");

  const skyDescription = getSkyDescription(sky.label, t);

  return (
    <main className="container">
      <div className="topHeaderRow">
        <div>
          <h1 className="titleWithLogo">
            <img
              src="/icon.svg"
              alt="SPL Trainer logo"
              className="topBrandLogo"
              width={56}
              height={56}
            />
            <span>{t.title}</span>
          </h1>
          <h2>{t.subtitle}</h2>
        </div>

        <div className="headerControls">
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
      </div>

      <div className="metaLine appMetaStrip">
        <span>
          <LivePragueDateTime locale={t.locale} timeZone={LKFR_TIME_ZONE} />
        </span>
        <span>
          {t.forecastHour}: {latestForecastLocalLabel} ({t.local})
        </span>
      </div>

      <div className="statusPills">
        <span className={`sourceBadge ${hasMetar ? "live" : "fallback"}`}>
          {t.sourceLabel}: {airportWindSourceLabel}
        </span>

        <span className="statusPill">
          {hasMetar ? t.metarAvailable : t.metarUnavailable}
        </span>

        <span className="statusPill">
          {t.vfrDay}: {vfrDayStartLabel} – {vfrDayEndLabel}
        </span>

        <span className={vfrStatusClass}>{vfrStatusLabel}</span>
      </div>

      <section className="topStatusCard">
        <div className="topStatusGrid">
          <div className={`${semaphoreCardClass} topPilotCard`}>
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
            </div>

            <div className="metricCard trainingCrosswindCard">
              <div className="metricLabel">{t.crosswind}</div>
              <div className="metricValueLarge">{crosswindAbs} kt</div>
              <div className={trainingWindClass}>
                {crosswindAbs > 10 || airportSurfaceWindKt > 14
                  ? t.crosswindDemanding
                  : crosswindAbs > 6
                  ? t.crosswindCaution
                  : t.crosswindSuitable}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="summaryBox">{flightSummary}</div>

      <div className="grid compactGrid priorityGrid" data-layout-group="priority" style={{ marginBottom: "18px" }}>
        <div className="card compactCard highPriorityCard priorityCardConditions" data-layout-id="conditions" data-layout-default-size="s">
          <h3>
            <Plane size={18} /> {t.flyingConditions}
          </h3>
          <p className={flyingClass}>{flyingCondition}</p>
        </div>

        <div className="card compactCard highPriorityCard priorityCardRisks" data-layout-id="risks" data-layout-default-size="s">
          <h3>
            <Info size={18} /> {t.weatherRisks}
          </h3>
          <p style={{ marginTop: 0 }}>{hazardOccurrenceText}</p>
          <p className={operationalRisk >= 60 ? "badgeRed" : operationalRisk >= 35 ? "badgeYellow" : "badgeGreen"}>
            {hazardRiskText}
          </p>
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
                  {h.label}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="card compactCard highPriorityCard priorityCardSoaring" data-layout-id="soaring" data-layout-default-size="s">
          <h3>
            <Gauge size={18} /> {t.soaringIndex}
          </h3>
          <p className="big">{displayedSoaringIndex}</p>
          <p className={soaringClass}>{soaringRating}</p>
          <p style={{ marginTop: "8px" }}>
            <strong>{t.liProxyLabel}:</strong> {instabilityIndex.toFixed(1)} ({instabilityLabel})
          </p>
          <p style={{ marginTop: "8px" }}>
            {t.baseAgl}: {metarCeiling ? `${Math.round(metarCeiling * 0.3048)} m` : `${lcl} m`} • {t.thermalTop}: {thermalTop} m
          </p>
        </div>

        <div className="card compactCard mediumPriorityCard quarterPriorityCard priorityCardWindow" data-layout-id="window" data-layout-default-size="s">
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

        <div className="card compactCard lowPriorityCard priorityCardClouds" data-layout-id="clouds" data-layout-default-size="l">
          <h3>
            <Cloud size={18} /> {t.cloudLayers}
          </h3>

          {hasMetarCloudLayers ? (
            <div className="cloudLayersGrid">
              {metarCloudLayers.map((layer, index) => (
                <div key={`${layer.cover}-${layer.baseFtAgl}-${index}`} className="cloudLayerItem">
                  <div className="cloudLayerTop">
                    <strong>{layer.cover}</strong>
                    <span>{layer.baseFtAgl} ft AGL</span>
                  </div>

                  <div className="cloudLayerCaption">
                    {getMetarCoverageLabel(layer.cover, lang)} • {Math.round(layer.baseFtAgl * 0.3048)} m AGL • {t.cloudCoverageLabel} {layer.cover === "FEW" ? "1-2" : layer.cover === "SCT" ? "3-4" : layer.cover === "BKN" ? "5-7" : "8"}/8
                  </div>
                  {layer.cloudType ? (
                    <div className="cloudLayerCaption">
                      {t.cloudTypeLabel}: {layer.cloudType}
                    </div>
                  ) : null}
                </div>
              ))}

            </div>
          ) : (
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
                    {getCoverageLabel(layer.value, lang)} • {toOktas(layer.value)}/8
                  </div>
                </div>
              ))}

              <div className="cloudLayerItem">
                <div className="cloudLayerTop">
                  <strong>{t.verticalDevelopmentLabel}</strong>
                  <span>{sky.riskOd ? t.riskLabel : t.lowRiskLabel}</span>
                </div>
                <div className="cloudLayerCaption">
                  {sky.riskOd
                    ? t.verticalDevelopmentRiskNote
                    : t.verticalDevelopmentLowNote}
                </div>
              </div>

            </div>
          )}
        </div>

        <div className="card compactCard mediumPriorityCard quarterPriorityCard priorityCardWind" data-layout-id="wind" data-layout-default-size="s">
          <h3>
            <Wind size={18} /> {t.windProfile}
          </h3>
          <p>
            {t.surface}: {modelSurfaceWindKt} kt {modelSurfaceWindArrow} (
            {Math.round(modelSurfaceWindDir)}°) • {t.forecastLabel}: {t.modelSource}
          </p>
          <p>
            850 hPa: {wind850} kt {wind850Arrow} ({Math.round(wind850Dir)}°)
          </p>
          <p>
            700 hPa: {wind700} kt {wind700Arrow} ({Math.round(wind700Dir)}°)
          </p>
          <p>
            {t.thermalDrift}: {thermalDrift} kt
          </p>
        </div>

        <div className="card compactCard wideCard highPriorityCard fullPriorityCard briefingCard priorityCardBriefing" data-layout-id="briefing" data-layout-default-size="m">
          <h3>
            <Info size={18} /> {t.operationalBriefing}
          </h3>

          <p className="briefingLead">{t.officialBriefingLead}</p>

          <p className={gaforCategory === "X" ? "badgeRed" : gaforCategory === "M" ? "badgeYellow" : gaforCategory === "D" ? "badgeYellow" : "badgeGreen"}>
            {t.gaforLikeLabel} {gaforLabel}
          </p>
          <p style={{ marginTop: 0, color: "#bfd0e6" }}>{gaforNote}</p>

          <div className="briefingInfoCard">
            <strong>{t.lkfrTrainingLimitsTitle}</strong>

            <ul className="limitsList">
              <li>
                {formatTranslation(t.lkfrCrosswindLimitText, {
                  crosswind: LKFR_LIMITS.vfrCrosswindMaxKt,
                  surfaceWind: LKFR_LIMITS.vfrSurfaceWindMaxKt,
                })}
              </li>
              <li>
                {formatTranslation(t.lkfrVfrGoodText, {
                  visibilityKm: LKFR_LIMITS.vfrVisibilityGoodM / 1000,
                  cloudBase: LKFR_LIMITS.vfrCloudBaseGoodM,
                })}
              </li>
              <li>
                {formatTranslation(t.lkfrWetRunwayWarningText, {
                  rain6h: LKFR_LIMITS.runwayWet6hWarnMm,
                  rain12h: LKFR_LIMITS.runwayWet12hWarnMm,
                })}
              </li>
              <li>
                {formatTranslation(t.lkfrWetRunwayCriticalText, {
                  rain6h: LKFR_LIMITS.runwayWet6hBadMm,
                  rain12h: LKFR_LIMITS.runwayWet12hBadMm,
                })}
              </li>
            </ul>

            <span>
              {t.lkfrDataSourceLabel}{" "}
              <a className="briefingSourceLink" href={AIM_VFR_MANUAL_URL} target="_blank" rel="noopener noreferrer">
                AIM VFR manual LKFR
              </a>
              {" · "}
              <a className="briefingSourceLink" href={AISVIEW_URL} target="_blank" rel="noopener noreferrer">
                AIS View
              </a>
            </span>

            <span>
              {t.meteoDataSourceNote}
            </span>
          </div>

          <div className="briefingLinkGrid">
            <a
              href={AISVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="briefingLink"
            >
              {t.openOfficialBriefing}
            </a>

            <a
              href={AIM_VFR_MANUAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="briefingLink"
            >
              {t.openOfficialManual}
            </a>

            <a
              href={AIM_VFR_TEXT_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="briefingLink"
            >
              {t.openOfficialTextPdf}
            </a>

            <a
              href={METAR_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              className="briefingLink"
            >
              {t.openMetar}
            </a>
          </div>
        </div>

        {tafBriefing?.rawTaf ? (
          <div className="card compactCard wideCard highPriorityCard fullPriorityCard briefingCard" data-layout-id="taf" data-layout-default-size="m">
            <h3>
              <Info size={18} /> {t.tafLabel} ({tafBriefing.sourceIcao})
            </h3>
            <div className="briefingInfoCard">
              <span style={{ wordBreak: "break-word", fontFamily: "monospace", fontSize: "0.9rem" }}>{tafBriefing.rawTaf}</span>
              <span>
                {t.windShearInTaf}: {tafBriefing.hasWindshear ? t.yes : t.no}
              </span>
            </div>
          </div>
        ) : null}

        {airportBriefing ? (
          <div className="card compactCard wideCard highPriorityCard fullPriorityCard briefingCard priorityCardOfficialAirport" data-layout-id="official" data-layout-default-size="m">
            <div className="officialAirportBriefing standalone">
              <h3 className="officialAirportHeading">
                <NotebookPen size={18} /> {t.officialBriefing}
              </h3>

              <div className="officialAirportGrid">
                {airportBriefing.category ? (
                  <div>
                    <strong>{t.airportCategoryLabel}:</strong> {airportBriefing.category}
                  </div>
                ) : null}

                {airportBriefing.operation ? (
                  <div>
                    <strong>{t.airportOperationLabel}:</strong> {airportBriefing.operation}
                  </div>
                ) : null}

                {airportBriefing.frequency ? (
                  <div>
                    <strong>{t.airportFrequencyLabel}:</strong> {airportBriefing.frequency}
                  </div>
                ) : null}

                {airportBriefing.circuitDirections.length > 0 ? (
                  <div>
                    <strong>{t.trafficCircuitLabel}:</strong>{" "}
                    {airportBriefing.circuitDirections.join(" • ")}
                  </div>
                ) : null}

                {airportBriefing.circuitAltitude ? (
                  <div>
                    <strong>{t.circuitAltitudeLabel}:</strong> {airportBriefing.circuitAltitude}
                  </div>
                ) : null}
              </div>

              <div className="briefingInfoGrid">
                <div className="briefingInfoCard">
                  <strong>{t.currentNoticesLabel}</strong>
                  <span>{t.officialSourceNote}</span>
                </div>

                <div className="briefingInfoCard">
                  <strong>{t.atisStatusLabel}</strong>
                  <span>{t.atisUnavailableNote}</span>
                </div>

                {airportBriefing.frequency ? (
                  <div className="briefingInfoCard">
                    <strong>{t.radioInfoLabel}</strong>
                    <span>{airportBriefing.frequency}</span>
                  </div>
                ) : null}
              </div>

              {airportBriefing.runwayWarnings.length > 0 ? (
                <ul className="officialNotesList">
                  {airportBriefing.runwayWarnings.slice(0, 3).map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="card compactCard wideCard highPriorityCard fullPriorityCard briefingCard" data-layout-id="vpl4" data-layout-default-size="m">
          <h3>
            <Info size={18} /> {t.vpl4DocumentTitle}
          </h3>
          <Vpl4Viewer
            src="/vpl4.pdf#toolbar=1&navpanes=0"
            title="VPL-4"
            expandLabel={t.vpl4Expand}
            collapseLabel={t.vpl4Collapse}
            openLabel={t.vpl4OpenFullscreen}
            closeLabel={t.vpl4CloseFullscreen}
            missingLabel={t.vpl4Missing}
          />
        </div>

      </div>

      <section className="chartSection" style={{ marginBottom: "18px" }}>
        <div className="chartCard">
          <h3 style={{ marginBottom: "14px" }}>
            <Gauge size={18} /> {t.modelForecast}
          </h3>
          <p style={{ margin: "-2px 0 12px", color: "#a9bbd3", fontSize: "0.86rem" }}>
            {t.allTimesUtc}
          </p>
          <div className="chartWrap">
            <WeatherChart
              lang={lang}
              labelsText={{
                today: t.today,
                tomorrow: t.tomorrow,
                dayPlus2: t.dayPlus2,
                flightDayStart: t.flightDayStart,
                flightDayEnd: t.flightDayEnd,
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
                axesLegendTitle: t.chartAxesLegendTitle,
              }}
              data={{
                labels: hours,
                times: data.hourly.time,
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


      <div className="grid compactGrid dataGrid" data-layout-group="data" style={{ marginBottom: "18px" }}>
        <div className="card compactCard mediumPriorityCard" data-layout-id="weather" data-layout-default-size="s">
          <h3>
            <Thermometer size={18} /> {t.weather}
          </h3>
          <p>
            {t.temperature}: {observedTemperature.toFixed(1)} °C
          </p>
          <p>
            {t.dewPoint}: {observedDewPoint.toFixed(1)} °C
          </p>
          <p>
            {t.sunHeating}: {Math.round(radiation)} W/m²
          </p>
          <p>
            {t.precipitation}: {precipitation.toFixed(1)} mm
          </p>
          <p>
            {t.spread}: {spread.toFixed(1)} °C
          </p>
        </div>

        <div className="card compactCard" data-layout-id="sky" data-layout-default-size="s">
          <h3>
            <Cloud size={18} /> {t.skyType}
          </h3>
          <p className={`big ${sky.className}`}>{sky.label}</p>
          <p className="small">{t.thermalSkyEstimate}</p>
          <p style={{ marginTop: "10px", lineHeight: 1.6 }}>{skyDescription}</p>
        </div>

      </div>

      <div className="grid compactGrid utilityGrid" data-layout-group="utility" style={{ marginBottom: "18px" }}>
        <div className="card compactCard highPriorityCard" data-layout-id="metar-embed" data-layout-default-size="m">
          <h3>
            <Info size={18} /> {t.metarInfo}
          </h3>

          <div className="metarEmbedWrap">
            <a
              href="https://metar-taf.com/metar/LKFR"
              id="metartaf-JAeaR16D"
              className="metarEmbedRoot"
            >
              METAR Frydlant Airfield
            </a>
            <Script
              src="https://metar-taf.com/embed-js/LKFR?qnh=hPa&rh=rh&target=JAeaR16D"
              strategy="afterInteractive"
              crossOrigin="anonymous"
            />
          </div>
        </div>

        <div className="card compactCard" data-layout-id="rating" data-layout-default-size="s">
          <h3>
            <Star size={18} /> {t.appRating}
          </h3>

          <AppRating note={t.rateNote} lang={lang} storageKey="lkfr-app-rating" />
        </div>

        <div className="card compactCard" data-layout-id="quick-links" data-layout-default-size="s">
          <h3>
            <Camera size={18} /> {t.quickLinks}
          </h3>

          <div className="quickLinksColumn">
            <a
              href={AIRPORT_WEBSITE}
              target="_blank"
              rel="noopener noreferrer"
              className="briefingLink"
            >
              {t.openWebsite}
            </a>

            <a
              href={SPL_TRAINER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="briefingLink"
            >
              {t.openSplTrainer}
            </a>

          </div>
        </div>

      </div>

      <footer className="card disclaimerCard">
        <h3 className="disclaimerTitleRow">
          <Info size={18} />
          {t.disclaimerTitle}
        </h3>
        <p style={{ margin: 0, lineHeight: 1.7 }}>{t.disclaimerText}</p>
      </footer>

      <div className="appFooter" aria-label="App footer logo">
        <div className="appFooterBrand">
          <img
            src="/icon.svg"
            alt="Beskydy Soaring Weather logo"
            className="appFooterLogo"
          />
          <span className="appFooterName">Beskydy Soaring Weather</span>
        </div>
      </div>
    </main>
  );
}