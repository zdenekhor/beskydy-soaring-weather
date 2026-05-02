"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Lang = "cs" | "en";

type CommentItem = {
  id: number;
  parentId: number | null;
  authorName: string;
  message: string;
  createdAt: string;
  replies: CommentItem[];
};

type Props = {
  lang?: Lang;
  storageKey?: string;
};

function getOrCreateClientId(storageKey: string) {
  const idKey = `${storageKey}-client-id`;

  try {
    const existing = window.localStorage.getItem(idKey);
    if (existing && existing.length > 0) return existing;

    const generated =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    window.localStorage.setItem(idKey, generated);
    return generated;
  } catch {
    return `fallback-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

function getStoredName(storageKey: string) {
  try {
    return window.localStorage.getItem(`${storageKey}-author-name`) ?? "";
  } catch {
    return "";
  }
}

function saveStoredName(storageKey: string, value: string) {
  try {
    window.localStorage.setItem(`${storageKey}-author-name`, value);
  } catch {
    // ignore localStorage errors
  }
}

export default function CommentThread({
  lang = "cs",
  storageKey = "lkfr-comments",
}: Props) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [message, setMessage] = useState("");
  const [replyParentId, setReplyParentId] = useState<number | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [error, setError] = useState("");

  const text = useMemo(() => {
    if (lang === "en") {
      return {
        title: "Comments from pilots",
        empty: "No comments yet. Add the first observation.",
        loading: "Loading comments...",
        name: "Name or callsign",
        message: "Comment",
        messagePlaceholder: "Share current conditions, launch notes, or runway remarks.",
        replyPlaceholder: "Write a reply...",
        add: "Add comment",
        reply: "Reply",
        sendReply: "Send reply",
        cancel: "Cancel",
        sending: "Saving...",
        readOnlyHint: "Public thread visible to all visitors.",
        error: "Comment could not be saved.",
      };
    }

    return {
      title: "Komentáře pilotů",
      empty: "Zatím tu nejsou žádné komentáře. Přidejte první pozorování.",
      loading: "Načítám komentáře...",
      name: "Jméno nebo volací znak",
      message: "Komentář",
      messagePlaceholder: "Napište aktuální podmínky, poznámku ke startu nebo provozní informaci.",
      replyPlaceholder: "Napište odpověď...",
      add: "Přidat komentář",
      reply: "Odpovědět",
      sendReply: "Odeslat odpověď",
      cancel: "Zrušit",
      sending: "Ukládám...",
      readOnlyHint: "Veřejné vlákno viditelné pro všechny návštěvníky.",
      error: "Komentář se nepodařilo uložit.",
    };
  }, [lang]);

  const loadComments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/comments/${encodeURIComponent(storageKey)}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = (await response.json()) as { comments: CommentItem[] };
      setComments(data.comments ?? []);
    } catch {
      setError(text.error);
    } finally {
      setLoading(false);
    }
  }, [storageKey, text.error]);

  useEffect(() => {
    setAuthorName(getStoredName(storageKey));
    void loadComments();
  }, [loadComments, storageKey]);

  const formatDate = useCallback(
    (value: string) => {
      const date = new Date(value);
      return date.toLocaleString(lang === "cs" ? "cs-CZ" : "en-GB", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Prague",
      });
    },
    [lang]
  );

  async function submitComment(parentId?: number | null) {
    const trimmedName = authorName.trim();
    const trimmedMessage = (parentId ? replyMessage : message).trim();

    if (!trimmedName || !trimmedMessage) return;

    setSubmitting(true);
    setError("");

    try {
      saveStoredName(storageKey, trimmedName);

      const response = await fetch(`/api/comments/${encodeURIComponent(storageKey)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: getOrCreateClientId(storageKey),
          authorName: trimmedName,
          message: trimmedMessage,
          parentId: parentId ?? null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save comment");
      }

      const data = (await response.json()) as { comments: CommentItem[] };
      setComments(data.comments ?? []);

      if (parentId) {
        setReplyParentId(null);
        setReplyMessage("");
      } else {
        setMessage("");
      }
    } catch {
      setError(text.error);
    } finally {
      setSubmitting(false);
    }
  }

  function renderReplies(items: CommentItem[]) {
    return items.map((item) => (
      <article key={item.id} className="commentItem reply">
        <div className="commentMetaRow">
          <strong>{item.authorName}</strong>
          <span>{formatDate(item.createdAt)}</span>
        </div>

        <p className="commentMessage">{item.message}</p>
      </article>
    ));
  }

  return (
    <div className="commentsSection">
      <div className="commentsComposer">
        <div className="commentsHint">{text.readOnlyHint}</div>

        <div className="commentFormGrid">
          <input
            type="text"
            value={authorName}
            onChange={(event) => setAuthorName(event.target.value)}
            className="commentInput"
            maxLength={48}
            placeholder={text.name}
          />

          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="commentTextarea"
            rows={4}
            maxLength={1200}
            placeholder={text.messagePlaceholder}
          />
        </div>

        <div className="commentActionsRow">
          <button
            type="button"
            className="commentSubmitButton"
            onClick={() => void submitComment(null)}
            disabled={submitting}
          >
            {submitting ? text.sending : text.add}
          </button>

          {error ? <span className="commentErrorText">{error}</span> : null}
        </div>
      </div>

      <div className="commentsList">
        {loading ? <p className="commentEmptyState">{text.loading}</p> : null}

        {!loading && comments.length === 0 ? (
          <p className="commentEmptyState">{text.empty}</p>
        ) : null}

        {!loading
          ? comments.map((item) => (
              <article key={item.id} className="commentItem">
                <div className="commentMetaRow">
                  <strong>{item.authorName}</strong>
                  <span>{formatDate(item.createdAt)}</span>
                </div>

                <p className="commentMessage">{item.message}</p>

                <div className="commentActionsRow inline">
                  <button
                    type="button"
                    className="commentReplyButton"
                    onClick={() => {
                      setReplyParentId(replyParentId === item.id ? null : item.id);
                      setReplyMessage("");
                    }}
                  >
                    {text.reply}
                  </button>
                </div>

                {replyParentId === item.id ? (
                  <div className="commentReplyComposer">
                    <textarea
                      value={replyMessage}
                      onChange={(event) => setReplyMessage(event.target.value)}
                      className="commentTextarea reply"
                      rows={3}
                      maxLength={1200}
                      placeholder={text.replyPlaceholder}
                    />

                    <div className="commentActionsRow inline">
                      <button
                        type="button"
                        className="commentSubmitButton"
                        onClick={() => void submitComment(item.id)}
                        disabled={submitting}
                      >
                        {submitting ? text.sending : text.sendReply}
                      </button>

                      <button
                        type="button"
                        className="commentReplyButton"
                        onClick={() => {
                          setReplyParentId(null);
                          setReplyMessage("");
                        }}
                      >
                        {text.cancel}
                      </button>
                    </div>
                  </div>
                ) : null}

                {item.replies.length > 0 ? (
                  <div className="commentReplies">{renderReplies(item.replies)}</div>
                ) : null}
              </article>
            ))
          : null}
      </div>
    </div>
  );
}