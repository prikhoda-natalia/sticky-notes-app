import { useRef, useState } from 'react';

import type { NoteColor, NoteSize } from '@/shared/presets';
import type { OnBoardGeometry } from '@/shared/types';

import Board from '@/components/Board';
import NoteCard from '@/components/NoteCard';
import Toolbar from '@/components/Toolbar';
import TrashZone from '@/components/TrashZone';
import { useNotePlacement } from '@/hooks/useNotePlacement';
import { uuid } from '@/shared/uuid';
import { useAppDispatch, useAppSelector } from '@/store';
import { notesActions, selectAllNoteIds } from '@/store/notesSlice';

import './App.css';

const App = () => {
  const dispatch = useAppDispatch();
  const boardRef = useRef<HTMLDivElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);

  const noteIds = useAppSelector(selectAllNoteIds);

  const [isPlacing, setIsPlacing] = useState(false);
  const [selectedNoteSize, setSelectedNoteSize] = useState<NoteSize>('M');
  const [selectedNoteColor, setSelectedNoteColor] = useState<NoteColor>('yellow');

  const addNote = (rect: OnBoardGeometry) => {
    dispatch(
      notesActions.noteAdded({
        id: uuid('note'),
        color: selectedNoteColor,
        ...rect,
      }),
    );

    setIsPlacing(false);
  };

  const updateOrDeleteNote = (id: string, rect: OnBoardGeometry | null) => {
    if (!rect) {
      dispatch(notesActions.noteDeleted(id));
      return;
    }

    dispatch(notesActions.noteUpdated({ id, ...rect }));
  };

  const handlePlacementStart = () => {
    setIsPlacing(true);
  };

  const { handlePlacement } = useNotePlacement({
    boardRef,
    onCommit: addNote,
  });

  return (
    <>
      <Toolbar
        isPlacing={isPlacing}
        onAddClick={handlePlacementStart}
        selectedSize={selectedNoteSize}
        onSizeSelect={setSelectedNoteSize}
        selectedColor={selectedNoteColor}
        onColorSelect={setSelectedNoteColor}
      />
      <Board
        boardRef={boardRef}
        onPointerDown={(e) => handlePlacement(e, { noteSize: selectedNoteSize })}
        isPlacing={isPlacing}
      >
        {noteIds.map((id) => (
          <NoteCard
            key={id}
            id={id}
            boardRef={boardRef}
            trashRef={trashRef}
            onCommit={(rect) => updateOrDeleteNote(id, rect)}
          />
        ))}
        <TrashZone trashRef={trashRef} />
      </Board>
    </>
  );
};

export default App;
