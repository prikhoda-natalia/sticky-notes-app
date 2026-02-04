import type { RootState } from '@/store/types';

import { notesAdapter } from './reducer';

const notesSelectors = notesAdapter.getSelectors<RootState>((state) => state.notes);

export const selectAllNoteIds = notesSelectors.selectIds;
export const selectNoteById = notesSelectors.selectById;
