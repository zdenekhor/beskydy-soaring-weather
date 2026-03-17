import { NextResponse } from "next/server";

export async function GET() {
  try {
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

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      const details = await response.text();

      console.error("Open-Meteo error:", details);

      return NextResponse.json(
        {
          error: "Failed to fetch forecast data",
          details,
          url,
        },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Forecast API error:", error);

    return NextResponse.json(
      {
        error: "Forecast API error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}