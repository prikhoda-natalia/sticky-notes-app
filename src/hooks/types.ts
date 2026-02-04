import type { NoteSize } from '@/shared/presets';
import type { OnBoardGeometry, OnClientGeometry } from '@/shared/types';

export type NoteEventMode = 'move' | 'resize';

export type NoteEventInit = {
  mode: NoteEventMode;
  noteOnBoard: OnBoardGeometry;
};

export type NoteEvent = NoteEventInit & {
  pointer: {
    id: PointerEvent['pointerId'];
    clientX: PointerEvent['clientX'];
    clientY: PointerEvent['clientY'];
  };
  trashOnBoard: OnBoardGeometry;
  boardOnClient: OnClientGeometry;
};

export type NotePlacementInit = {
  noteSize: NoteSize;
};
