"use client";

import { useEffect, useState } from "react";

type Props = {
  locale: string;
  timeZone: string;
};

export default function LivePragueDateTime({ locale, timeZone }: Props) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 30000);

    return () => window.clearInterval(timer);
  }, []);

  const formattedDate = now.toLocaleDateString(locale, {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone,
  });

  const formattedTime = now.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  });

  return (
    <>
      {formattedDate} • {formattedTime}
    </>
  );
}