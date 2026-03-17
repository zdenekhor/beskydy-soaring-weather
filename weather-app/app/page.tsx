import WeatherChart from "@/components/WeatherChart";

type ForecastData = {
  hourly: {
    time: string[];
    temperature_2m: number[];
    dew_point_2m: number[];
    cloud_cover: number[];
    cloud_cover_low: number[];
    cloud_cover_mid: number[];
    cloud_cover_high: number[];
    precipitation: number[];
    precipitation_probability: number[];
    shortwave_radiation: number[];
    pressure_msl: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    wind_speed_850hPa: number[];
    wind_direction_850hPa: number[];
    wind_speed_700hPa: number[];
    wind_direction_700hPa: number[];
  };
  daily: {
    sunrise: string[];
    sunset: string[];
  };
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

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to load forecast: ${res.status} ${text}`);
  }

  return res.json();
}

export default async function Page() {
  const data = await getWeather();

  return (
    <main style={{ padding: 20 }}>
      <h1>SPL Weather – Beskydy</h1>

      <WeatherChart data={data} />
    </main>
  );
}