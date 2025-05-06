import React from 'react';

interface ButtonProps {
  onResize: (event: React.MouseEvent<Element, MouseEvent>) => void;
  onRotate: (event: React.MouseEvent<Element, MouseEvent>) => void;
  onReset: React.MouseEventHandler<HTMLButtonElement>;
  onDelete: React.MouseEventHandler<HTMLButtonElement>;
  buttonPadding: string;
  buttonFontSize: string;
}

const ImageEditorButtons: React.FC<ButtonProps> = ({
  onResize,
  onRotate,
  onReset,
  onDelete,
  buttonPadding,
  buttonFontSize
}) => {
  const buttonStyle: React.CSSProperties = {
    position: 'absolute',
    cursor: 'pointer',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    padding: buttonPadding,
    fontSize: buttonFontSize,
    lineHeight: '1',
    zIndex: 1001,
    userSelect: 'none',
  };

  return (
    <>
      {/* Resize Handle (Bottom Right) */}
      <button
        style={{
          ...buttonStyle,
          bottom: '-5px',
          right: '-5px',
          cursor: 'nwse-resize',
        }}
        onMouseDown={onResize}
        title="Resize (Hold Shift for aspect ratio)"
      >
        &#x21F2;
      </button>

      {/* Rotate Handle (Top Right) */}
      <button
        style={{
          ...buttonStyle,
          top: '-5px',
          right: '-5px',
          cursor: 'alias',
        }}
        onMouseDown={onRotate}
        title="Rotate (Hold Shift to snap)"
      >
        &#x21BB;
      </button>

      {/* Reset Handle (Top Left) */}
      <button
        style={{
          ...buttonStyle,
          top: '-5px',
          left: '-5px',
        }}
        onClick={onReset}
        title="Reset Size & Rotation"
      >
        &#129192;
      </button>

      {/* Delete Handle (Bottom Left) */}
      <button
        style={{
          ...buttonStyle,
          bottom: '-5px',
          left: '-5px',
          backgroundColor: 'rgba(200, 0, 0, 0.7)',
        }}
        onClick={onDelete}
        title="Delete Item"
      >
        &times;
      </button>
    </>
  );
};

export default ImageEditorButtons;
