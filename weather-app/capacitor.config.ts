import type { CapacitorConfig } from "@capacitor/cli";

const serverUrl = process.env.CAP_SERVER_URL;

const config: CapacitorConfig = {
  appId: "cz.lkfr.spl.weather",
  appName: "Počasí LKFR",
  webDir: "www",
  server: serverUrl
    ? {
        url: serverUrl,
        cleartext: false,
      }
    : undefined,
};

export default config;
