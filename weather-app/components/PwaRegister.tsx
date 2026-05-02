"use client";

import { useEffect } from "react";

const APP_CACHE_PREFIX = "spl-weather-lkfr";

export default function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          void registration.unregister();
        });
      });

      if ("caches" in window) {
        void caches.keys().then((keys) => {
          keys
            .filter((key) => key.startsWith(APP_CACHE_PREFIX))
            .forEach((key) => void caches.delete(key));
        });
      }

      return;
    }

    let hasRefreshed = false;

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (hasRefreshed) {
        return;
      }

      hasRefreshed = true;
      window.location.reload();
    });

    navigator.serviceWorker
      .register("/sw.js", { updateViaCache: "none" })
      .then((registration) => {
        void registration.update();

        const activateWaitingWorker = () => {
          registration.waiting?.postMessage({ type: "SKIP_WAITING" });
        };

        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;

          if (!installing) {
            return;
          }

          installing.addEventListener("statechange", () => {
            if (
              installing.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              activateWaitingWorker();
            }
          });
        });

        activateWaitingWorker();
      })
      .catch(() => {
        // Registration errors are non-fatal for main weather functionality.
      });
  }, []);

  return null;
}
