import { memo, useRef } from 'react';

import type { RefObject } from 'react';
import type { OnBoardGeometry } from '@/shared/types';

import { useNoteCardInteractions } from '@/hooks/useNoteCardInteractions';
import { useAppSelector } from '@/store';
import { selectNoteById } from '@/store/notesSlice';

import './NoteCard.css';

type NoteCardProps = {
  id: string;
  boardRef: RefObject<HTMLDivElement | null>;
  trashRef: RefObject<HTMLDivElement | null>;
  onCommit: (rect: OnBoardGeometry | null) => void;
};

const NoteCard = ({ id, boardRef, trashRef, onCommit }: NoteCardProps) => {
  const note = useAppSelector((state) => selectNoteById(state, id));

  const noteRef = useRef<HTMLDivElement>(null);

  const { handleDraggingStart, handleDragging, handleDraggingEnd } = useNoteCardInteractions({
    noteRef,
    boardRef,
    trashRef,
    onCommit,
  });

  const noteOnBoard: OnBoardGeometry = {
    boardX: note.boardX,
    boardY: note.boardY,
    width: note.width,
    height: note.height,
  };

  if (!note) return null;

  return (
    <div
      ref={noteRef}
      className="note"
      style={{
        transform: `translate3d(${note.boardX}px, ${note.boardY}px, 0)`,
        width: note.width,
        height: note.height,
        background: note.color,
      }}
    >
      <div
        className="noteHeader"
        onPointerDown={(e) => {
          e.stopPropagation();
          handleDraggingStart(e, { mode: 'move', noteOnBoard });
        }}
        onPointerMove={handleDragging}
        onPointerUp={handleDraggingEnd}
      >
        <span className="noteGrip" />
      </div>
      <div className="noteBody">I'm a note!</div>
      <div
        className="resizeHandle"
        onPointerDown={(e) => {
          e.stopPropagation();
          handleDraggingStart(e, { mode: 'resize', noteOnBoard });
        }}
        onPointerMove={handleDragging}
        onPointerUp={handleDraggingEnd}
      />{' '}
    </div>
  );
};

export default memo(NoteCard);
