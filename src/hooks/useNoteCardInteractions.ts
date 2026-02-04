/**
 * Manages pointer-driven move/resize interactions for a note card on a board.
 *
 * Mental model:
 * - On start: capture the pointer, snapshot board/trash geometry, and store the initial note geometry.
 * - On move: compute the next geometry in board space, clamp it to board bounds, and paint via RAF.
 * - On end: commit the latest geometry (or `null` if dropped over trash) and reset all transient state.
 *
 * Coordinate spaces:
 * - Pointer events arrive in client space.
 * - Note/trash calculations happen in board space (relative to board top-left).
 *
 * Performance:
 * - DOM writes are batched in `requestAnimationFrame` via `applyNoteGeometry` to avoid layout thrashing.
 * - Geometry is kept in refs to avoid re-rendering during drag.
 */

import { useCallback, useEffect, useRef } from "react";

import type { PointerEvent, RefObject } from "react";
import type { NoteEvent, NoteEventInit } from "./types";
import type { OnBoardGeometry } from "@/shared/types";

import {
  applyNoteGeometry,
  clampNoteOnBoardPosition,
  clampNoteOnBoardSize,
  rectsIntersect,
  toBoardGeometry,
  toClientGeometry,
} from "@/shared/geometry";

type UseNoteCardInteractionsArgs = {
  noteRef: RefObject<HTMLElement | null>;
  boardRef: RefObject<HTMLElement | null>;
  trashRef: RefObject<HTMLElement | null>;
  onCommit: (rect: OnBoardGeometry | null) => void;
};

export function useNoteCardInteractions({
  noteRef,
  boardRef,
  trashRef,
  onCommit,
}: UseNoteCardInteractionsArgs) {
  const noteEventRef = useRef<NoteEvent | null>(null);
  const nextNoteGeometryRef = useRef<OnBoardGeometry | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const isActiveRef = useRef(false);
  const isOverTrashRef = useRef(false);

  const schedulePaint = useCallback(() => {
    if (rafIdRef.current != null) return;

    rafIdRef.current = window.requestAnimationFrame(() => {
      rafIdRef.current = null;

      const noteEl = noteRef.current;
      const nextNoteGeometry = nextNoteGeometryRef.current;
      if (!noteEl || !nextNoteGeometry) return;

      applyNoteGeometry(noteEl, nextNoteGeometry);
    });
  }, [noteRef]);

  const setNoteActive = useCallback(
    (active: boolean) => {
      if (isActiveRef.current === active) return;
      isActiveRef.current = active;

      const noteEl = noteRef.current;
      if (!noteEl) return;

      noteEl.classList.toggle("active", active);
    },
    [noteRef],
  );

  const setTrashActive = useCallback(
    (active: boolean) => {
      if (isOverTrashRef.current === active) return;
      isOverTrashRef.current = active;

      const trashEl = trashRef?.current;
      if (!trashEl) return;

      trashEl.classList.toggle("active", active);
    },
    [trashRef],
  );

  const handleDraggingStart = useCallback(
    (e: PointerEvent, { mode, noteOnBoard }: NoteEventInit) => {
      const boardEl = boardRef.current;
      const trashEl = trashRef?.current;
      if (!boardEl || !trashEl) return;

      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

      const boardRect = boardEl.getBoundingClientRect();
      const trashRect = trashEl.getBoundingClientRect();

      noteEventRef.current = {
        mode,
        noteOnBoard,
        pointer: {
          id: e.pointerId,
          clientX: e.clientX,
          clientY: e.clientY,
        },
        trashOnBoard: toBoardGeometry(boardRect, trashRect),
        boardOnClient: toClientGeometry(boardRect),
      };

      nextNoteGeometryRef.current = noteOnBoard;
      schedulePaint();
      setNoteActive(true);
      setTrashActive(false);
    },
    [boardRef, schedulePaint, setNoteActive, setTrashActive, trashRef],
  );

  const handleDragging = useCallback(
    (e: PointerEvent) => {
      const noteEvent = noteEventRef.current;
      if (!noteEvent) return;

      if (e.pointerId !== noteEvent.pointer.id) return;

      const diffX = e.clientX - noteEvent.pointer.clientX;
      const diffY = e.clientY - noteEvent.pointer.clientY;

      let nextNoteGeometry: OnBoardGeometry;

      if (noteEvent.mode === "move") {
        nextNoteGeometry = {
          ...noteEvent.noteOnBoard,
          boardX: noteEvent.noteOnBoard.boardX + diffX,
          boardY: noteEvent.noteOnBoard.boardY + diffY,
        };
        nextNoteGeometry = clampNoteOnBoardPosition(
          nextNoteGeometry,
          noteEvent.boardOnClient,
        );
      } else {
        nextNoteGeometry = {
          ...noteEvent.noteOnBoard,
          width: noteEvent.noteOnBoard.width + diffX,
          height: noteEvent.noteOnBoard.height + diffY,
        };
        nextNoteGeometry = clampNoteOnBoardSize(
          nextNoteGeometry,
          noteEvent.boardOnClient,
        );
      }

      nextNoteGeometryRef.current = nextNoteGeometry;
      schedulePaint();

      setTrashActive(rectsIntersect(nextNoteGeometry, noteEvent.trashOnBoard));
    },
    [schedulePaint, setTrashActive],
  );

  const handleDraggingEnd = useCallback(
    (e: PointerEvent) => {
      const noteEvent = noteEventRef.current;
      if (!noteEvent) return;

      if (e.pointerId !== noteEvent.pointer.id) return;

      (e.currentTarget as HTMLElement).releasePointerCapture(
        noteEvent.pointer.id,
      );

      const latestNoteGeometry = nextNoteGeometryRef.current;
      const isOverTrash = isOverTrashRef.current;

      onCommit(isOverTrash ? null : latestNoteGeometry);

      if (rafIdRef.current != null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      noteEventRef.current = null;
      nextNoteGeometryRef.current = null;
      setNoteActive(false);
      setTrashActive(false);
    },
    [onCommit, setNoteActive, setTrashActive],
  );

  useEffect(() => {
    return () => {
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return {
    handleDraggingStart,
    handleDragging,
    handleDraggingEnd,
  };
}
