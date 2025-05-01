import React from 'react';

interface ImageEditorButtonsProps {
  onResize: (event: globalThis.MouseEvent) => void;
  onRotate: (event: globalThis.MouseEvent) => void;
  onReset: (event: globalThis.MouseEvent) => void;
  onDelete: (event: globalThis.MouseEvent) => void;
  buttonPadding: string;
  buttonFontSize: string;
}

const ImageEditorButtons = ({
  onResize,
  onRotate,
  onReset,
  onDelete,
  buttonPadding,
  buttonFontSize,
}: ImageEditorButtonsProps) => {
  return (
    <>
      {/* Resize Button (lives inside the image container for positioning) */}
      <button
        id="draghandle"
        type="button"
        onMouseDown={onResize}
        style={{
          position: 'absolute',
          bottom: '5px',
          right: '5px',
          cursor: 'nwse-resize',
          background: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: buttonPadding,
          fontSize: buttonFontSize,
          zIndex: 30, // Ensure buttons are above the image
        }}
      >
        Resize
      </button>

      {/* Rotate Button (lives inside the image container for positioning) */}
      <button
        id="rotatehandle"
        type="button"
        onMouseDown={onRotate}
        style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          cursor: 'alias',
          background: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: buttonPadding,
          fontSize: buttonFontSize,
          zIndex: 30, // Ensure buttons are above the image
        }}
      >
        Rotate
      </button>

      {/* Delete Button (lives inside the image container) */}
      <button
        id="deletehandle"
        type="button"
        onMouseDown={onDelete}
        style={{
          position: 'absolute',
          top: '5px',
          left: '5px',
          cursor: 'alias',
          background: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: buttonPadding,
          fontSize: buttonFontSize,
          zIndex: 30, // Ensure buttons are above the image
        }}
      >
        Delete
      </button>

      {/* Reset Button (lives outside the inner image container but inside the main resizing div) */}
      <button
        id="clickable"
        type="button"
        onClick={onReset} // Note: onClick for reset
        style={{
          position: 'absolute',
          bottom: '5px', // Position relative to the outer resizing div
          left: '5px', // Position relative to the outer resizing div
          background: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: buttonPadding,
          fontSize: buttonFontSize,
          zIndex: 30, // Ensure buttons are above the image
        }}
      >
        Reset
      </button>
    </>
  );
};

export default ImageEditorButtons;
