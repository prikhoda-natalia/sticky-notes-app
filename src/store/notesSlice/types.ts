import type { EntityState, PayloadAction } from '@reduxjs/toolkit';
import type { NoteColor } from '@/shared/presets';
import type { OnBoardGeometry } from '@/shared/types';

type NoteId = {
  id: string;
};

export type Note = OnBoardGeometry &
  NoteId & {
    color: NoteColor;
  };

export type NotesState = EntityState<Note, string>;

export type NoteAddedAction = PayloadAction<Note>;
export type NoteDeletedAction = PayloadAction<Note['id']>;
export type NoteUpdatedAction = PayloadAction<OnBoardGeometry & NoteId>;
