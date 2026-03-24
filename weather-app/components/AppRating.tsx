"use client";

import { useState } from "react";

type Props = {
  note?: string;
};

export default function AppRating({ note }: Props) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  return (
    <div>
      <div className="ratingWrap">
        {[1, 2, 3, 4, 5].map((n) => {
          const active = n <= (hovered || rating);

          return (
            <button
              key={n}
              type="button"
              className={`ratingButton ${active ? "active" : ""}`}
              aria-label={`Rate ${n}`}
              title={`${n} / 5`}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
            >
              ★
            </button>
          );
        })}
      </div>

      <p className="ratingValue">
        {rating > 0 ? `Hodnocení: ${rating} / 5` : "Klikněte na hvězdičky"}
      </p>

      {note ? <p className="rateNoteText">{note}</p> : null}
    </div>
  );
}