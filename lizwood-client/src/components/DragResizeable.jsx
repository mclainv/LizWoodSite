import React, { useState } from 'react';

// Module-scoped highest z-index counter
let highestZ = 1;

const DraggableImage = ({ src, alt, width, height, initialPos = { x: 0, y: 0, z: 1 } }) => {
  // Position state
  const [pos, setPos] = useState({ x: initialPos.x, y: initialPos.y });
  // Z-index state
  const [zIndex, setZIndex] = useState(initialPos.z);
  
  const onMouseDown = (e) => {
    e.preventDefault();
    // Bring this image to front
    highestZ += 1;
    setZIndex(highestZ);

    let dragged = false;

    // Calculate offset between mouse and image top-left
    const startX = e.pageX - pos.x;
    const startY = e.pageY - pos.y;

    const onMouseMove = (e) => {
      dragged = true;
      setPos({ x: e.pageX - startX, y: e.pageY - startY });
    };

    const onMouseUp = () => {
      if(dragged) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      else {
        //show resize box
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      onMouseDown={onMouseDown}
      draggable={false}
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        zIndex,
        cursor: 'grab',
        userSelect: 'none'
      }}
    />
  );
};

export default DraggableImage;