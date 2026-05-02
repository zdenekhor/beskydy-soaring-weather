"use client";

import { useEffect, useState } from "react";

type Props = {
  src: string;
  title: string;
  expandLabel: string;
  collapseLabel: string;
  openLabel: string;
  closeLabel: string;
  missingLabel: string;
};

export default function Vpl4Viewer({
  src,
  title,
  expandLabel,
  collapseLabel,
  openLabel,
  closeLabel,
  missingLabel,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const pdfUrl = src.split("#")[0] ?? src;

  useEffect(() => {
    let isMounted = true;

    const checkPdf = async () => {
      try {
        const response = await fetch(pdfUrl, { method: "HEAD", cache: "no-store" });
        if (isMounted) {
          setIsAvailable(response.ok);
        }
      } catch {
        if (isMounted) {
          setIsAvailable(false);
        }
      }
    };

    checkPdf();

    return () => {
      isMounted = false;
    };
  }, [pdfUrl]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
      {isAvailable === false ? <div className="documentMissingBox">{missingLabel}</div> : null}

      {isAvailable !== false && isExpanded ? (
        <div className="documentEmbedWrap">
          <iframe src={src} title={title} className="documentEmbedFrame" />
        </div>
      ) : null}

      <div className="documentActionsRow">
        <button
          type="button"
          className="briefingLink"
          onClick={() => setIsExpanded((current) => !current)}
          disabled={isAvailable === false}
        >
          {isExpanded ? collapseLabel : expandLabel}
        </button>

        {isExpanded ? (
          <button
            type="button"
            className="briefingLink documentFullscreenButton"
            onClick={() => setIsOpen(true)}
            disabled={isAvailable === false}
          >
            {openLabel}
          </button>
        ) : null}
      </div>

      {isOpen ? (
        <div className="documentModal" role="dialog" aria-modal="true" aria-label={title}>
          <div className="documentModalHeader">
            <strong>{title}</strong>
            <div className="documentModalActions">
              <button
                type="button"
                className="briefingLink documentModalClose"
                onClick={() => setIsOpen(false)}
              >
                {closeLabel}
              </button>
            </div>
          </div>
          <iframe src={src} title={`${title} fullscreen`} className="documentModalFrame" />
        </div>
      ) : null}
    </>
  );
}
