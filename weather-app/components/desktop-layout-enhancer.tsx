"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type LayoutSize = "s" | "m" | "l";

type Labels = {
  editor: string;
  reset: string;
  moveEarlier: string;
  moveLater: string;
  pickCard: string;
  placeBefore: string;
  cardSelected: string;
  dragAndDrop: string;
  sizeSmall: string;
  sizeMedium: string;
  sizeLarge: string;
};

type CardMeta = {
  id: string;
  element: HTMLElement;
  defaultSize: LayoutSize;
};

type GroupMeta = {
  container: HTMLElement;
  cards: CardMeta[];
};

type GroupLayout = {
  order: string[];
  sizes: Record<string, LayoutSize>;
};

type LayoutState = Record<string, GroupLayout>;

const STORAGE_KEY = "bsw-standalone-layout-v1";

function isStandaloneDesktop() {
  if (typeof window === "undefined") return false;

  const standaloneNavigator =
    typeof navigator !== "undefined" &&
    (navigator as Navigator & { standalone?: boolean }).standalone === true;

  const standaloneDisplayMode =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: window-controls-overlay)").matches;

  return (
    (standaloneDisplayMode || standaloneNavigator) &&
    window.matchMedia("(min-width: 1024px)").matches
  );
}

function getStoredLayout() {
  if (typeof window === "undefined") return {} as LayoutState;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LayoutState) : {};
  } catch {
    return {} as LayoutState;
  }
}

function getDefaultLayout(groups: Record<string, GroupMeta>): LayoutState {
  return Object.fromEntries(
    Object.entries(groups).map(([groupId, group]) => [
      groupId,
      {
        order: group.cards.map((card) => card.id),
        sizes: Object.fromEntries(group.cards.map((card) => [card.id, card.defaultSize])),
      },
    ])
  );
}

function mergeLayout(groups: Record<string, GroupMeta>, stored: LayoutState): LayoutState {
  const defaults = getDefaultLayout(groups);

  return Object.fromEntries(
    Object.entries(defaults).map(([groupId, groupLayout]) => {
      const storedGroup = stored[groupId];
      if (!storedGroup) return [groupId, groupLayout];

      const validIds = new Set(groupLayout.order);
      const storedOrder = storedGroup.order.filter((id) => validIds.has(id));
      const missing = groupLayout.order.filter((id) => !storedOrder.includes(id));

      return [
        groupId,
        {
          order: [...storedOrder, ...missing],
          sizes: Object.fromEntries(
            groupLayout.order.map((id) => [id, storedGroup.sizes[id] ?? groupLayout.sizes[id]])
          ),
        },
      ];
    })
  );
}

export default function DesktopLayoutEnhancer({ labels }: { labels: Labels }) {
  const [enabled, setEnabled] = useState(false);
  const [groups, setGroups] = useState<Record<string, GroupMeta>>({});
  const [layout, setLayout] = useState<LayoutState>({});
  const [draggingCard, setDraggingCard] = useState<{ groupId: string; cardId: string } | null>(
    null
  );
  const [selectedCard, setSelectedCard] = useState<{ groupId: string; cardId: string } | null>(
    null
  );

  useEffect(() => {
    const standaloneQuery = window.matchMedia("(display-mode: standalone)");
    const overlayQuery = window.matchMedia("(display-mode: window-controls-overlay)");
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const update = () => setEnabled(isStandaloneDesktop());

    update();
    const rafId = window.requestAnimationFrame(update);
    const timeoutId = window.setTimeout(update, 220);

    standaloneQuery.addEventListener("change", update);
    overlayQuery.addEventListener("change", update);
    desktopQuery.addEventListener("change", update);
    window.addEventListener("pageshow", update);
    window.addEventListener("resize", update);
    document.addEventListener("visibilitychange", update);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
      standaloneQuery.removeEventListener("change", update);
      overlayQuery.removeEventListener("change", update);
      desktopQuery.removeEventListener("change", update);
      window.removeEventListener("pageshow", update);
      window.removeEventListener("resize", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove("layoutStandaloneDesktop");
      return;
    }

    document.body.classList.add("layoutStandaloneDesktop");

    const groupElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-layout-group]")
    );

    const discoveredGroups = Object.fromEntries(
      groupElements.map((groupEl) => {
        const groupId = groupEl.dataset.layoutGroup ?? "default";
        const cards = Array.from(groupEl.querySelectorAll<HTMLElement>(":scope > [data-layout-id]"))
          .map((cardEl) => ({
            id: cardEl.dataset.layoutId ?? "",
            element: cardEl,
            defaultSize: (cardEl.dataset.layoutDefaultSize as LayoutSize | undefined) ?? "s",
          }))
          .filter((card) => card.id.length > 0);

        return [groupId, { container: groupEl, cards } satisfies GroupMeta];
      })
    );

    const frameId = window.requestAnimationFrame(() => {
      setGroups(discoveredGroups);
      setLayout(mergeLayout(discoveredGroups, getStoredLayout()));
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      document.body.classList.remove("layoutStandaloneDesktop");
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !Object.keys(groups).length || !Object.keys(layout).length) return;

    for (const [groupId, group] of Object.entries(groups)) {
      const groupLayout = layout[groupId];
      if (!groupLayout) continue;

      const cardsById = new Map(group.cards.map((card) => [card.id, card]));

      for (const id of groupLayout.order) {
        const card = cardsById.get(id);
        if (!card) continue;

        card.element.dataset.layoutSize = groupLayout.sizes[id] ?? card.defaultSize;
        group.container.appendChild(card.element);
      }
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  }, [enabled, groups, layout]);

  const cards = useMemo(
    () => Object.entries(groups).flatMap(([groupId, group]) => group.cards.map((card) => ({ groupId, card }))),
    [groups]
  );

  const moveCard = (groupId: string, cardId: string, direction: -1 | 1) => {
    setLayout((current) => {
      const group = current[groupId];
      if (!group) return current;

      const index = group.order.indexOf(cardId);
      const targetIndex = index + direction;
      if (index < 0 || targetIndex < 0 || targetIndex >= group.order.length) return current;

      const nextOrder = [...group.order];
      const [item] = nextOrder.splice(index, 1);
      nextOrder.splice(targetIndex, 0, item);

      return {
        ...current,
        [groupId]: {
          ...group,
          order: nextOrder,
        },
      };
    });
  };

  const moveCardBefore = (groupId: string, movingCardId: string, targetCardId: string) => {
    setLayout((current) => {
      const group = current[groupId];
      if (!group) return current;

      const fromIndex = group.order.indexOf(movingCardId);
      const targetIndex = group.order.indexOf(targetCardId);

      if (fromIndex < 0 || targetIndex < 0 || fromIndex === targetIndex) return current;

      const nextOrder = [...group.order];
      const [item] = nextOrder.splice(fromIndex, 1);
      const insertIndex = fromIndex < targetIndex ? targetIndex - 1 : targetIndex;
      nextOrder.splice(insertIndex, 0, item);

      return {
        ...current,
        [groupId]: {
          ...group,
          order: nextOrder,
        },
      };
    });
  };

  const placeSelectedCardBefore = (groupId: string, targetCardId: string) => {
    if (!selectedCard || selectedCard.groupId !== groupId || selectedCard.cardId === targetCardId) {
      return;
    }

    moveCardBefore(groupId, selectedCard.cardId, targetCardId);
    setSelectedCard(null);
  };

  useEffect(() => {
    if (!enabled || !Object.keys(groups).length) return;

    const cleanups: Array<() => void> = [];

    for (const [groupId, group] of Object.entries(groups)) {
      for (const card of group.cards) {
        const handleDragOver = (event: DragEvent) => {
          if (!draggingCard || draggingCard.groupId !== groupId || draggingCard.cardId === card.id) {
            return;
          }

          event.preventDefault();
          card.element.classList.add("layoutDropTarget");
        };

        const handleDragLeave = () => {
          card.element.classList.remove("layoutDropTarget");
        };

        const handleDrop = (event: DragEvent) => {
          event.preventDefault();
          card.element.classList.remove("layoutDropTarget");

          if (!draggingCard || draggingCard.groupId !== groupId || draggingCard.cardId === card.id) {
            return;
          }

          moveCardBefore(groupId, draggingCard.cardId, card.id);
          setDraggingCard(null);
          setSelectedCard(null);
        };

        card.element.addEventListener("dragover", handleDragOver);
        card.element.addEventListener("dragleave", handleDragLeave);
        card.element.addEventListener("drop", handleDrop);

        cleanups.push(() => {
          card.element.classList.remove("layoutDropTarget");
          card.element.removeEventListener("dragover", handleDragOver);
          card.element.removeEventListener("dragleave", handleDragLeave);
          card.element.removeEventListener("drop", handleDrop);
        });
      }
    }

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, [enabled, groups, draggingCard]);

  const resizeCard = (groupId: string, cardId: string, size: LayoutSize) => {
    setLayout((current) => ({
      ...current,
      [groupId]: {
        ...current[groupId],
        sizes: {
          ...current[groupId]?.sizes,
          [cardId]: size,
        },
      },
    }));
  };

  const resetLayout = () => {
    const next = getDefaultLayout(groups);
    setLayout(next);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  if (!enabled || !cards.length) return null;

  return (
    <>
      {createPortal(
        <div className="layoutEditorToolbar">
          <strong>{labels.editor}</strong>
          <button type="button" className="briefingLink" onClick={resetLayout}>
            {labels.reset}
          </button>
        </div>,
        document.body
      )}

      {cards.map(({ groupId, card }) =>
        createPortal(
          <div className="layoutCardControls" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="layoutControlButton"
              title={labels.moveEarlier}
              onClick={() => moveCard(groupId, card.id, -1)}
            >
              ←
            </button>
            <button
              type="button"
              className="layoutControlButton"
              title={labels.moveLater}
              onClick={() => moveCard(groupId, card.id, 1)}
            >
              →
            </button>
            <button
              type="button"
              className={`layoutControlButton layoutPickButton ${
                selectedCard?.groupId === groupId && selectedCard.cardId === card.id ? "active" : ""
              }`}
              title={
                selectedCard?.groupId === groupId && selectedCard.cardId === card.id
                  ? labels.cardSelected
                  : labels.pickCard
              }
              onClick={() => {
                const isSelected =
                  selectedCard?.groupId === groupId && selectedCard.cardId === card.id;
                setSelectedCard(isSelected ? null : { groupId, cardId: card.id });
              }}
            >
              {selectedCard?.groupId === groupId && selectedCard.cardId === card.id ? "✓" : "◎"}
            </button>
            <button
              type="button"
              className="layoutControlButton layoutPlaceButton"
              title={labels.placeBefore}
              disabled={
                !selectedCard ||
                selectedCard.groupId !== groupId ||
                selectedCard.cardId === card.id
              }
              onClick={() => placeSelectedCardBefore(groupId, card.id)}
            >
              ⇤
            </button>
            <button
              type="button"
              draggable
              className="layoutControlButton layoutDragHandle"
              title={labels.dragAndDrop}
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "move";
                setDraggingCard({ groupId, cardId: card.id });
                setSelectedCard(null);
              }}
              onDragEnd={() => setDraggingCard(null)}
            >
              ↕
            </button>
            <button
              type="button"
              className="layoutControlButton"
              title={labels.sizeSmall}
              onClick={() => resizeCard(groupId, card.id, "s")}
            >
              S
            </button>
            <button
              type="button"
              className="layoutControlButton"
              title={labels.sizeMedium}
              onClick={() => resizeCard(groupId, card.id, "m")}
            >
              M
            </button>
            <button
              type="button"
              className="layoutControlButton"
              title={labels.sizeLarge}
              onClick={() => resizeCard(groupId, card.id, "l")}
            >
              L
            </button>
          </div>,
          card.element
        )
      )}
    </>
  );
}