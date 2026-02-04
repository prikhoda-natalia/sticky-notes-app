/**
 * Geometry helpers for sticky notes.
 *
 * Coordinate spaces:
 * - Client space: viewport-based (DOMRect, pointer events)
 * - Board space: relative to the board’s top-left corner
 *
 * Rule of thumb:
 * - Convert → clamp → apply
 */

import type { OnBoardGeometry, OnClientGeometry } from "./types";

import { NOTE_SIZE_TO_DIMENSIONS } from "./presets";

export function applyNoteGeometry(
  note: HTMLElement,
  noteOnBoard: OnBoardGeometry,
) {
  note.style.transform = `translate3d(${noteOnBoard.boardX}px, ${noteOnBoard.boardY}px, 0)`;
  note.style.width = `${noteOnBoard.width}px`;
  note.style.height = `${noteOnBoard.height}px`;
}
/**
 * Clamps a note's board-space position so it stays fully inside the board.
 *
 * Guarantees after execution:
 * - `boardX >= 0`
 * - `boardY >= 0`
 * - `boardX + width <= board width`
 * - `boardY + height <= board height`
 *
 * Notes:
 * - Does NOT modify size.
 * - If the board is smaller than the note, the position collapses to (0, 0).
 */
export function clampNoteOnBoardPosition(
  noteOnBoard: OnBoardGeometry,
  boardOnClient: OnClientGeometry,
): OnBoardGeometry {
  const maxBoardX = Math.max(0, boardOnClient.width - noteOnBoard.width);
  const maxBoardY = Math.max(0, boardOnClient.height - noteOnBoard.height);

  return {
    ...noteOnBoard,
    boardX: Math.min(Math.max(0, noteOnBoard.boardX), maxBoardX),
    boardY: Math.min(Math.max(0, noteOnBoard.boardY), maxBoardY),
  };
}

/**
 * Clamps a note's size so it:
 * - Never goes below the smallest allowed note size
 * - Never overflows the board from its current position
 *
 * Notes:
 * - Size is clamped relative to the *current* `boardX` / `boardY`.
 * - This function assumes position has already been validated or clamped.
 *
 * Invariants enforced:
 * - width >= NOTE_SIZE_TO_DIMENSIONS.S.width
 * - height >= NOTE_SIZE_TO_DIMENSIONS.S.height
 * - boardX + width <= board width
 * - boardY + height <= board height
 */
export function clampNoteOnBoardSize(
  noteOnBoard: OnBoardGeometry,
  boardOnClient: OnClientGeometry,
): OnBoardGeometry {
  const minWidth = NOTE_SIZE_TO_DIMENSIONS.S.width;
  const minHeight = NOTE_SIZE_TO_DIMENSIONS.S.height;
  const maxWidth = Math.max(minWidth, boardOnClient.width - noteOnBoard.boardX);
  const maxHeight = Math.max(
    minHeight,
    boardOnClient.height - noteOnBoard.boardY,
  );

  return {
    ...noteOnBoard,
    width: Math.min(Math.max(minWidth, noteOnBoard.width), maxWidth),
    height: Math.min(Math.max(minHeight, noteOnBoard.height), maxHeight),
  };
}

/**
 * Checks whether two board-space rectangles overlap.
 *
 * Uses AABB (axis-aligned bounding box) intersection. Touching edges (no overlapping area) are considered NOT intersecting.
 */
export function rectsIntersect(
  a: OnBoardGeometry,
  b: OnBoardGeometry,
): boolean {
  return (
    a.boardX < b.boardX + b.width &&
    a.boardX + a.width > b.boardX &&
    a.boardY < b.boardY + b.height &&
    a.boardY + a.height > b.boardY
  );
}

export function toBoardGeometry(
  boardRect: DOMRect,
  elRect: DOMRect,
): OnBoardGeometry {
  return {
    boardX: elRect.left - boardRect.left,
    boardY: elRect.top - boardRect.top,
    width: elRect.width,
    height: elRect.height,
  };
}

export function toClientGeometry(boardRect: DOMRect): OnClientGeometry {
  return {
    clientX: boardRect.left,
    clientY: boardRect.top,
    width: boardRect.width,
    height: boardRect.height,
  };
}
