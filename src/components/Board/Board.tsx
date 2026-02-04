import type { PointerEvent, PointerEventHandler, ReactNode, RefObject } from 'react';

import './Board.css';

type BoardProps = {
  boardRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  onPointerDown: PointerEventHandler<HTMLDivElement>;
  isPlacing: boolean;
};

const Board = ({ boardRef, children, onPointerDown, isPlacing }: BoardProps) => {
  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!isPlacing) return;

    onPointerDown(e);
  };

  return (
    <div
      ref={boardRef}
      className={isPlacing ? 'board boardPlacing' : 'board'}
      onPointerDown={handlePointerDown}
    >
      {children}
    </div>
  );
};

export default Board;
