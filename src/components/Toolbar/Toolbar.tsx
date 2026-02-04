import type { NoteColor, NoteSize } from '@/shared/presets';

import { NOTE_COLORS, NOTE_SIZES } from '@/shared/presets';

import logo from '@/assets/logo.png';

import './Toolbar.css';

type ToolbarProps = {
  isPlacing: boolean;
  onAddClick: () => void;
  selectedSize: NoteSize;
  onSizeSelect: (size: NoteSize) => void;
  selectedColor: NoteColor;
  onColorSelect: (color: NoteColor) => void;
};

const Toolbar = ({
  isPlacing,
  onAddClick,
  selectedSize,
  onSizeSelect,
  selectedColor,
  onColorSelect,
}: ToolbarProps) => {
  return (
    <div className="toolbar">
      <div className="brand">
        <div className="brandLogo">
          <img alt="Redux Logo" className="brandLogoImage" src={logo} />
        </div>
        <b className="brandAppName">Sticky Notes</b>
      </div>
      <div className="toolbarSpacer" />
      <div className="toolbarGroup">
        {NOTE_SIZES.map((s) => (
          <button
            key={s}
            className={
              s === selectedSize ? 'button buttonSmall buttonActive' : 'button buttonSmall'
            }
            onClick={() => onSizeSelect(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="toolbarGroup">
        {NOTE_COLORS.map((c) => (
          <button
            key={c}
            className={c === selectedColor ? 'colorSwatch colorSwatchActive' : 'colorSwatch'}
            style={{ background: `var(--note-${c})` }}
            onClick={() => onColorSelect(c)}
            aria-label={`Color ${c}`}
          />
        ))}
      </div>
      <div className="toolbarGroup">
        <button className="button" onClick={onAddClick}>
          {isPlacing ? 'Click on board…' : 'Add note'}
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
