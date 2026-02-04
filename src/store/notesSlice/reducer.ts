import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import type { Note, NoteAddedAction, NoteDeletedAction, NoteUpdatedAction } from './types';

export const notesAdapter = createEntityAdapter<Note>();

export const notesSlice = createSlice({
  name: 'notes',
  initialState: notesAdapter.getInitialState(),
  reducers: {
    noteAdded(state, action: NoteAddedAction) {
      notesAdapter.addOne(state, action.payload);
    },
    noteDeleted(state, action: NoteDeletedAction) {
      notesAdapter.removeOne(state, action.payload);
    },
    noteUpdated(state, action: NoteUpdatedAction) {
      const { id, ...rect } = action.payload;
      notesAdapter.updateOne(state, { id, changes: rect });
    },
  },
});

export const notesActions = notesSlice.actions;

export default notesSlice.reducer;
