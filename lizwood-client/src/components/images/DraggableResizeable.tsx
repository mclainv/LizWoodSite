import React, { useState, useImperativeHandle } from 'react';
import { ImageProps, Position } from '../../types/types.ts'; // Assuming Position exists
import ImageEditorButtons from '../buttons/imageEditorButton.tsx'; // Import the new component

// Module-scoped highest z-index counter
let highestZ = 20;

// No forwardRef needed; accept props directly
export default function DraggableResizeableImage(
  { _id,
    src, 
    alt,
    ogWidth, 
    ogHeight, 
    initialPos = { x: 0, y: 0, z: 1, rotated: 0, width: ogWidth, height: ogHeight },
    pin,
    onDeleteRequest, 
    ref }: ImageProps
  ) {
  // Draggable state
  const [pos, setPos] = useState({ x: initialPos.x, y: initialPos.y });
  const [zIndex, setZIndex] = useState(initialPos.z);
  const [isResizing, setIsResizing] = useState(false);

  // Resizable state
  const [size, setSize] = useState({ x: initialPos.width, y: initialPos.height });
  const [rotation, setRotation] = useState({ deg: initialPos.rotated });

  // Expose getPosition() via useImperativeHandle using the ref from props
  useImperativeHandle(ref, () => ({
    getPosition: (): Position => ({
      x: pos.x,
      y: pos.y,
      z: zIndex,
      rotated: rotation.deg,
      width: size.x,
      height: size.y,
      pin: pin ? {
        src: pin.src,
        width: pin.ogWidth,
        height: pin.ogHeight,
        initialPos: pin.initialPos
      } : undefined
    }),
  }));

  const onMouseDown = (e) => {
    e.preventDefault();
    // bring to front
    highestZ += 1;
    setZIndex(highestZ);

    let dragged = false;
    const startX = e.pageX - pos.x;
    const startY = e.pageY - pos.y;

    const onMouseMoveDrag = (moveEvent: MouseEvent) => {
      dragged = true;
      setPos({ x: moveEvent.pageX - startX, y: moveEvent.pageY - startY });
    };

    const onMouseUpDrag = () => {
      document.removeEventListener('mousemove', onMouseMoveDrag);
      document.removeEventListener('mouseup', onMouseUpDrag);
      if (!dragged) {
        // click without drag toggles resize mode
        setIsResizing(prev => !prev);
      }
    };

    document.addEventListener('mousemove', onMouseMoveDrag);
    document.addEventListener('mouseup', onMouseUpDrag);
  };

  const resizeHandler = (e) => {
    e.preventDefault();
    const startSize = { ...size };
    const startX = e.pageX;
    const startY = e.pageY;

    const onMouseMoveResize = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(30, startSize.x + (moveEvent.pageX - startX));
      const newHeight = Math.max(30, startSize.y + (moveEvent.pageY - startY));
      setSize({ x: newWidth, y: newHeight });
    };
    const onMouseUpResize = () => {
      document.removeEventListener('mousemove', onMouseMoveResize);
      document.removeEventListener('mouseup', onMouseUpResize);
    };
    document.addEventListener('mousemove', onMouseMoveResize);
    document.addEventListener('mouseup', onMouseUpResize);
  };

  const rotateHandler = (mouseDownEvent) => {
    const startRotation = rotation;
    const startPosition = { x: mouseDownEvent.pageX, y: mouseDownEvent.pageY };

    function onMouseMoveRotate(mouseMoveEvent: MouseEvent) {
      const deltaX = mouseMoveEvent.pageX - startPosition.x;
      const deltaY = mouseMoveEvent.pageY - startPosition.y;
      let newDeg = (startRotation.deg + deltaX + deltaY) % 360;
      if (mouseDownEvent.shiftKey) {
        newDeg = Math.round(newDeg / 10) * 10;
      }
      setRotation({ deg: newDeg });
    }
    function onMouseUpRotate() {
      document.removeEventListener("mousemove", onMouseMoveRotate);
      document.removeEventListener("mouseup", onMouseUpRotate);
    }
    document.addEventListener("mousemove", onMouseMoveRotate);
    document.addEventListener("mouseup", onMouseUpRotate);
  };

  const deleteHandler = (event: globalThis.MouseEvent) => {
    event.stopPropagation();
    // TODO: Implement delete functionality
    if (onDeleteRequest) {
      if(pin) {
        onDeleteRequest('draggable', _id);
      } else {
        onDeleteRequest('fixed', _id);
      }
    } else {
      console.log('No onDeleteRequest function provided');
    }
  };

  const resetHandler = (event: globalThis.MouseEvent) => {
    event.stopPropagation();
    // Ensure initialPos is defined before accessing its properties
    if (initialPos) {
        setSize({ x: initialPos.width, y: initialPos.height });
        setRotation({ deg: initialPos.rotated });
    }
  };

    // determine if buttons should shrink for small sizes
    const isSmall = size.x < 100 || size.y < 100;
    const isTiny = size.x < 50 || size.y < 50;
    let buttonPadding = isSmall ? '2px 4px' : '4px 8px';
    let buttonFontSize = isSmall ? '0.75rem' : '1rem';
    if(isTiny) {
      buttonPadding = '1px 2px';
      buttonFontSize = '0.5rem';
    }

    if (!isResizing) {
      return (
        <div style={{
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          transform: `rotate(${rotation.deg}deg)`,
          zIndex: zIndex,
        }}> 
          <img
            src={src}
            alt={alt}
            width={size.x}
            height={size.y}
            onMouseDown={onMouseDown}
            draggable={false}
            style={{
              cursor: 'grab',
              userSelect: 'none',
            }}
          />
          {pin && (
            <img
              src={pin.src}
              alt="pin"
              width={pin.initialPos.width}
              height={pin.initialPos.height}
              style={{
                position: 'absolute',
                left: pin.initialPos.x,
                top: pin.initialPos.y,
                zIndex: 1000,
              }}
            />
          )}
        </div>
      );
    }
    return (
      // <div style={{ width: size.x, height: size.y, position: 'absolute', left: pos.x, top: pos.y, zIndex, overflow: 'hidden', transform: `rotate(${rotation}deg)` }}>
      //   <img src={src} alt={alt} width={size.x} height={size.y} draggable={false} style={{ display: 'block', width: '100%', height: '100%' }} />
      //   <button onMouseDown={resizeHandler} style={{ position: 'absolute', bottom: 0, right: 0, cursor: 'nwse-resize' }}>Resize</button>
      //   <button onClick={rotateHandler} style={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer' }}>Rotate</button>
      //   <button onClick={resetHandler} style={{ position: 'absolute', bottom: 0, left: 0, cursor: 'pointer' }}>Reset</button>
      // </div>,
      <div
        style={{ 
          width: size.x + 20, 
          height: size.y + 20,
          zIndex: zIndex,
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          overflow: 'hidden',
          transform: `rotate(${rotation.deg}deg)`
        }}>
        <div id="container" style={{ 
          width: size.x, 
          height: size.y,
          position: 'relative',
          border: '1px dashed #ccc',
          overflow: 'hidden'
        }}>
          <img 
            onMouseDown={onMouseDown}
            src={src} 
            alt={alt} 
            width={size.x} 
            height={size.y}
          />
          {pin && (
          <img
            src={pin.src}
            alt="pin"
            width={pin.initialPos.width}
            height={pin.initialPos.height}
            style={{
              position: 'absolute',
              left: pin.initialPos.x,
              top: pin.initialPos.y,
              zIndex: 1000,
            }}
          />
          )}
        </div>
        <ImageEditorButtons 
          onResize={resizeHandler}
          onRotate={rotateHandler}
          onReset={resetHandler}
          onDelete={deleteHandler}
          buttonPadding={buttonPadding}
          buttonFontSize={buttonFontSize}
        />
      </div>
    );
}