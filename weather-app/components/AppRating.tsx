"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  note?: string;
  storageKey?: string;
  lang?: "cs" | "en";
};

export default function AppRating({
  note,
  storageKey = "lkfr-app-rating",
  lang = "cs",
}: Props) {
  const [rating, setRating] = useState<number>(0);
  const [hovered, setHovered] = useState<number>(0);
  const [saved, setSaved] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;

      const parsed = Number(raw);
      if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 5) {
        setRating(parsed);
      }
    } catch {
      // ignore storage errors
    }
  }, [storageKey]);

  const text = useMemo(() => {
    if (lang === "en") {
      return {
        titleEmpty: "Tap or click the stars",
        titleValue: `Rating: ${rating} / 5`,
        saved: "Saved",
        clear: "Clear rating",
      };
    }

    return {
      titleEmpty: "Klikněte nebo klepněte na hvězdičky",
      titleValue: `Hodnocení: ${rating} / 5`,
      saved: "Uloženo",
      clear: "Smazat hodnocení",
    };
  }, [lang, rating]);

  function saveRating(value: number) {
    setRating(value);
    setSaved(true);

    try {
      window.localStorage.setItem(storageKey, String(value));
    } catch {
      // ignore storage errors
    }

    window.setTimeout(() => setSaved(false), 1400);
  }

  function clearRating() {
    setRating(0);
    setHovered(0);
    setSaved(false);

    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // ignore storage errors
    }
  }

  const visibleValue = hovered || rating;

  return (
    <div className="ratingCardInner">
      <div className="ratingHeaderRow">
        <div className="ratingPrompt">
          {rating > 0 ? text.titleValue : text.titleEmpty}
        </div>

        {saved ? <span className="ratingSavedBadge">{text.saved}</span> : null}
      </div>

      <div
        className="ratingWrap"
        role="radiogroup"
        aria-label={lang === "en" ? "App rating" : "Hodnocení aplikace"}
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const active = n <= visibleValue;

          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} / 5`}
              title={`${n} / 5`}
              className={`ratingButton ${active ? "active" : ""}`}
              onClick={() => saveRating(n)}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              onFocus={() => setHovered(n)}
              onBlur={() => setHovered(0)}
            >
              ★
            </button>
          );
        })}
      </div>

      <div className="ratingFooterRow">
        <p className="ratingValue">
          {rating > 0 ? text.titleValue : text.titleEmpty}
        </p>

        {mounted && rating > 0 ? (
          <button
            type="button"
            className="ratingClearButton"
            onClick={clearRating}
          >
            {text.clear}
          </button>
        ) : null}
      </div>

      {note ? <p className="rateNoteText">{note}</p> : null}
    </div>
  );
}