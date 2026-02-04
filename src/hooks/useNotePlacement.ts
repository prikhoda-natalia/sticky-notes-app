/**
 * Handles new note placement on the board via a pointer event.
 *
 * Behavior:
 * - Converts the pointer position from client space to board space.
 * - Centers the new note under the pointer.
 * - Clamps the resulting geometry so the note is fully inside the board.
 * - Commits the final board-space geometry immediately.
 *
 * This hook is intentionally stateless:
 * - No pointer capture
 * - No dragging lifecycle
 * - No intermediate rendering
 *
 * Designed for "click / tap to place" interactions.
 */

import { useCallback } from "react";

import type { PointerEvent, RefObject } from "react";
import type { NotePlacementInit } from "./types";
import type { OnBoardGeometry } from "@/shared/types";

import { clampNoteOnBoardPosition, toClientGeometry } from "@/shared/geometry";
import { NOTE_SIZE_TO_DIMENSIONS } from "@/shared/presets";

type UseNotePlacementArgs = {
  boardRef: RefObject<HTMLElement | null>;
  onCommit: (rect: OnBoardGeometry) => void;
};

export function useNotePlacement({ boardRef, onCommit }: UseNotePlacementArgs) {
  const handlePlacement = useCallback(
    (e: PointerEvent, { noteSize }: NotePlacementInit) => {
      if (e.target !== e.currentTarget) return;

      const boardEl = boardRef.current;
      if (!boardEl) return;

      const boardRect = boardEl.getBoundingClientRect();
      const boardOnClient = toClientGeometry(boardRect);
      const pointerOnBoardX = e.clientX - boardOnClient.clientX;
      const pointerOnBoardY = e.clientY - boardOnClient.clientY;

      const width = NOTE_SIZE_TO_DIMENSIONS[noteSize].width;
      const height = NOTE_SIZE_TO_DIMENSIONS[noteSize].height;

      let placedNoteGeometry: OnBoardGeometry = {
        boardX: pointerOnBoardX - width / 2,
        boardY: pointerOnBoardY - height / 2,
        width,
        height,
      };
      placedNoteGeometry = clampNoteOnBoardPosition(
        placedNoteGeometry,
        boardOnClient,
      );

      onCommit(placedNoteGeometry);
    },
    [boardRef, onCommit],
  );

  return {
    handlePlacement,
  };
}
