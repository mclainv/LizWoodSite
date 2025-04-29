import React, { useState, forwardRef, useImperativeHandle } from 'react';

// Module-scoped highest z-index counter
let highestZ = 20;

const DraggableResizeableImage = forwardRef(
  ({ src, alt, width, height, rotated, initialPos = { x: 0, y: 0, z: 1 } }, ref) => {
    // Draggable state
    const [pos, setPos] = useState({ x: initialPos.x, y: initialPos.y });
    const [zIndex, setZIndex] = useState(initialPos.z);
    const [isResizing, setIsResizing] = useState(false);

    // Resizable state
    const [size, setSize] = useState({ x: width, y: height });
    const [rotation, setRotation] = useState({ deg: rotated });

    // expose getPosition() on the ref
    useImperativeHandle(ref, () => ({
      getPosition: () => ({ x: pos.x, y: pos.y, z: zIndex, rotated: rotation.deg }),
    }));

    const onMouseDown = (e) => {
      e.preventDefault();
      // bring to front
      highestZ += 1;
      setZIndex(highestZ);

      let dragged = false;
      const startX = e.pageX - pos.x;
      const startY = e.pageY - pos.y;

      const onMouseMoveDrag = (e) => {
        dragged = true;
        setPos({ x: e.pageX - startX, y: e.pageY - startY });
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
  //Resizable

    const resizeHandler = (e) => {
      e.preventDefault();
      const startSize = { ...size };
      const startX = e.pageX;
      const startY = e.pageY;

      const onMouseMoveResize = (e) => {
        const newWidth = Math.max(30, startSize.x + (e.pageX - startX));
        const newHeight = Math.max(30, startSize.y + (e.pageY - startY));
        setSize({ x: newWidth, y: newHeight });
      };
      const onMouseUpResize = () => {
        document.removeEventListener('mousemove', onMouseMoveResize);
        document.removeEventListener('mouseup', onMouseUpResize);
      };
      document.addEventListener('mousemove', onMouseMoveResize);
      document.addEventListener('mouseup', onMouseUpResize);
    };
    //Rotateable
    const rotateHandler = (mouseDownEvent) => {
      const startRotation = rotation;
      const startPosition = { x: mouseDownEvent.pageX, y: mouseDownEvent.pageY };

      function onMouseMoveRotate(mouseMoveEvent) {
        // calculate raw angle change
        const deltaX = mouseMoveEvent.pageX - startPosition.x;
        const deltaY = mouseMoveEvent.pageY - startPosition.y;
        let newDeg = (startRotation.deg + deltaX + deltaY) % 360;
        if (mouseDownEvent.shiftKey) {
          // quantize to 10° increments
          newDeg = Math.round(newDeg / 10) * 10;
        }
        setRotation({ deg: newDeg });
      }
      function onMouseUpRotate() {
          document.removeEventListener("mousemove", onMouseMoveRotate);
          // uncomment the following line if not using `{ once: true }`
          // document.body.removeEventListener("mouseup", onMouseUp);
      }
      document.addEventListener("mousemove", onMouseMoveRotate);
      document.addEventListener("mouseup", onMouseUpRotate, { once: true });
    };
    //Resetable
    const resetHandler = () => {
      setSize({ x: width, y: height });
      setRotation({deg: rotated})
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
        <img
          src={src}
          alt={alt}
          width={size.x}
          height={size.y}
          onMouseDown={onMouseDown}
          draggable={false}
          style={{
            position: 'absolute',
            left: pos.x,
            top: pos.y,
            zIndex: zIndex,
            cursor: 'grab',
            userSelect: 'none',
            transform: `rotate(${rotation.deg}deg)`
          }}
        />
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
          <button 
            id="draghandle" 
            type="button" 
            onMouseDown={resizeHandler}
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
              zIndex: 10
            }}
          >
            Resize
          </button>
          <button 
            id="rotatehandle" 
            type="button" 
            onMouseDown={rotateHandler}
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
              zIndex: 10
            }}
          >
            Rotate
          </button>
        </div>
        <button 
          id="clickable" 
          type="button" 
          onClick={resetHandler}
          style={{
            position: 'absolute',
            bottom: '5px',
            left: '5px',
            background: '#f0f0f0',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: buttonPadding,
            fontSize: buttonFontSize,
            zIndex: 10
          }}
        >
          Reset
        </button>
      </div>
    );
  }
);

export default DraggableResizeableImage;