import type { OnBoardGeometry, OnClientGeometry } from './types';

import { NOTE_SIZE_TO_DIMENSIONS } from './presets';

export function applyNoteGeometry(note: HTMLElement, noteOnBoard: OnBoardGeometry) {
  note.style.transform = `translate3d(${noteOnBoard.boardX}px, ${noteOnBoard.boardY}px, 0)`;
  note.style.width = `${noteOnBoard.width}px`;
  note.style.height = `${noteOnBoard.height}px`;
}

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

export function clampNoteOnBoardSize(
  noteOnBoard: OnBoardGeometry,
  boardOnClient: OnClientGeometry,
): OnBoardGeometry {
  const minWidth = NOTE_SIZE_TO_DIMENSIONS.S.width;
  const minHeight = NOTE_SIZE_TO_DIMENSIONS.S.height;
  const maxWidth = Math.max(minWidth, boardOnClient.width - noteOnBoard.boardX);
  const maxHeight = Math.max(minHeight, boardOnClient.height - noteOnBoard.boardY);

  return {
    ...noteOnBoard,
    width: Math.min(Math.max(minWidth, noteOnBoard.width), maxWidth),
    height: Math.min(Math.max(minHeight, noteOnBoard.height), maxHeight),
  };
}

export function rectsIntersect(a: OnBoardGeometry, b: OnBoardGeometry): boolean {
  return (
    a.boardX < b.boardX + b.width &&
    a.boardX + a.width > b.boardX &&
    a.boardY < b.boardY + b.height &&
    a.boardY + a.height > b.boardY
  );
}

export function toBoardGeometry(boardRect: DOMRect, elRect: DOMRect): OnBoardGeometry {
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
