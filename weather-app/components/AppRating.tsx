"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  note?: string;
  storageKey?: string;
  lang?: "cs" | "en";
};

type RatingStats = {
  count: number;
  average: number;
  userRating: number;
};

export default function AppRating({
  note,
  storageKey = "lkfr-app-rating",
  lang = "cs",
}: Props) {
  const [rating, setRating] = useState<number>(0);
  const [hovered, setHovered] = useState<number>(0);
  const [saved, setSaved] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<RatingStats>({
    count: 0,
    average: 0,
    userRating: 0,
  });

  const saveTimeoutRef = useRef<number | null>(null);

  const text = useMemo(() => {
    if (lang === "en") {
      return {
        groupLabel: "App rating",
        titleEmpty: "Tap or click the stars",
        titleValue: `Your rating: ${rating} / 5`,
        saved: "Saved",
        clear: "Clear rating",
        average: "Average rating",
        votes: "Votes",
        loading: "Loading rating...",
        noVotes: "No ratings yet",
      };
    }

    return {
      groupLabel: "Hodnocení aplikace",
      titleEmpty: "Klikněte nebo klepněte na hvězdičky",
      titleValue: `Vaše hodnocení: ${rating} / 5`,
      saved: "Uloženo",
      clear: "Smazat hodnocení",
      average: "Průměrné hodnocení",
      votes: "Počet hodnocení",
      loading: "Načítám hodnocení...",
      noVotes: "Zatím bez hodnocení",
    };
  }, [lang, rating]);

  useEffect(() => {
    void loadStats();
  }, [storageKey]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current !== null) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  async function loadStats() {
    setLoading(true);

    let localRating = 0;

    try {
      const raw = window.localStorage.getItem(storageKey);
      const parsed = Number(raw);

      if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 5) {
        localRating = parsed;
        setRating(parsed);
      } else {
        setRating(0);
      }
    } catch {
      setRating(0);
    }

    try {
      const res = await fetch(`/api/ratings/${encodeURIComponent(storageKey)}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch rating stats");
      }

      const data = (await res.json()) as { count: number; average: number };

      setStats({
        count: data.count ?? 0,
        average: data.average ?? 0,
        userRating: localRating,
      });
    } catch {
      setStats({
        count: 0,
        average: 0,
        userRating: localRating,
      });
    } finally {
      setLoading(false);
    }
  }

  async function saveRating(value: number) {
    const previousRating = rating;

    setRating(value);
    setSaved(true);

    try {
      window.localStorage.setItem(storageKey, String(value));
    } catch {
      // ignore localStorage errors
    }

    try {
      const res = await fetch(`/api/ratings/${encodeURIComponent(storageKey)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          previousRating,
          newRating: value,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save rating");
      }

      const data = (await res.json()) as {
        count: number;
        average: number;
        userRating: number;
      };

      setStats({
        count: data.count ?? 0,
        average: data.average ?? 0,
        userRating: data.userRating ?? value,
      });
    } catch {
      setRating(previousRating);
      try {
        if (previousRating > 0) {
          window.localStorage.setItem(storageKey, String(previousRating));
        } else {
          window.localStorage.removeItem(storageKey);
        }
      } catch {
        // ignore localStorage errors
      }
    }

    if (saveTimeoutRef.current !== null) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      setSaved(false);
    }, 1400);
  }

  async function clearRating() {
    const previousRating = rating;

    setRating(0);
    setHovered(0);
    setSaved(false);

    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // ignore localStorage errors
    }

    try {
      const res = await fetch(`/api/ratings/${encodeURIComponent(storageKey)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          previousRating,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to clear rating");
      }

      const data = (await res.json()) as {
        count: number;
        average: number;
        userRating: number;
      };

      setStats({
        count: data.count ?? 0,
        average: data.average ?? 0,
        userRating: 0,
      });
    } catch {
      setRating(previousRating);
      try {
        if (previousRating > 0) {
          window.localStorage.setItem(storageKey, String(previousRating));
        }
      } catch {
        // ignore localStorage errors
      }
    }
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLButtonElement>,
    currentValue: number
  ) {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      void saveRating(Math.min(5, currentValue + 1));
    }

    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      void saveRating(Math.max(1, currentValue - 1));
    }

    if (e.key === "Home") {
      e.preventDefault();
      void saveRating(1);
    }

    if (e.key === "End") {
      e.preventDefault();
      void saveRating(5);
    }

    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      void clearRating();
    }
  }

  const visibleValue = hovered || rating;
  const summaryText = rating > 0 ? text.titleValue : text.titleEmpty;
  const averageText =
    stats.count > 0 ? `${stats.average.toFixed(1)} / 5` : text.noVotes;

  return (
    <div className="ratingCardInner">
      <div className="ratingHeaderRow">
        <p className="ratingPrompt">{summaryText}</p>
        {saved ? <span className="ratingSavedBadge">{text.saved}</span> : null}
      </div>

      <div className="ratingStatsBox">
        <div className="ratingStatItem">
          <div className="ratingStatLabel">{text.average}</div>
          <div className="ratingStatValue">
            {loading ? text.loading : averageText}
          </div>
        </div>

        <div className="ratingStatItem">
          <div className="ratingStatLabel">{text.votes}</div>
          <div className="ratingStatValue">
            {loading ? "..." : stats.count}
          </div>
        </div>
      </div>

      <div
        className="ratingWrap"
        role="radiogroup"
        aria-label={text.groupLabel}
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const active = n <= visibleValue;
          const checked = rating === n;

          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={`${n} / 5`}
              title={`${n} / 5`}
              tabIndex={checked || (rating === 0 && n === 1) ? 0 : -1}
              className={`ratingButton ${active ? "active" : ""}`}
              onClick={() => void saveRating(n)}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              onFocus={() => setHovered(n)}
              onBlur={() => setHovered(0)}
              onKeyDown={(e) => handleKeyDown(e, n)}
            >
              ★
            </button>
          );
        })}
      </div>

      <div className="ratingFooterRow">
        <p className="ratingValue">{summaryText}</p>

        {rating > 0 ? (
          <button
            type="button"
            className="ratingClearButton"
            onClick={() => void clearRating()}
          >
            {text.clear}
          </button>
        ) : null}
      </div>

      {note ? <p className="rateNoteText">{note}</p> : null}
    </div>
  );
}