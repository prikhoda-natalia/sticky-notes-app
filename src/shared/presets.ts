import type { RectSize } from './types';

export const NOTE_COLORS = ['yellow', 'pink', 'blue', 'green'] as const;
export type NoteColor = (typeof NOTE_COLORS)[number];

export const NOTE_SIZES = ['S', 'M', 'L'] as const;
export type NoteSize = (typeof NOTE_SIZES)[number];

export const NOTE_SIZE_TO_DIMENSIONS: Record<NoteSize, RectSize> = {
  S: { width: 180, height: 130 },
  M: { width: 240, height: 170 },
  L: { width: 320, height: 220 },
};
