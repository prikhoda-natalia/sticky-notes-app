import type { RefObject } from 'react';

import './TrashZone.css';

type TrashZoneProps = {
  trashRef: RefObject<HTMLDivElement | null>;
};

const TrashZone = ({ trashRef }: TrashZoneProps) => {
  return (
    <div ref={trashRef} className="trash">
      Drop here to delete
    </div>
  );
};

export default TrashZone;
