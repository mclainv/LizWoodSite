import React, { useState } from 'react';

function Resizeable({ src, alt }) {
  const [size, setSize] = useState({ x: 400, y: 300 });
  const [rotation, setRotation] = useState({deg: 0});

  const resizeHandler = (mouseDownEvent) => {
    const startSize = size;
    const startPosition = { x: mouseDownEvent.pageX, y: mouseDownEvent.pageY };
    
    function onMouseMoveResize(mouseMoveEvent) {
      setSize(currentSize => ({ 
        x: startSize.x - startPosition.x + mouseMoveEvent.pageX, 
        y: startSize.y - startPosition.y + mouseMoveEvent.pageY 
      }));
      console.log(size.x);
    }
    
    function onMouseUpResize() {
      document.body.removeEventListener("mousemove", onMouseMoveResize);
      // uncomment the following line if not using `{ once: true }`
      // document.body.removeEventListener("mouseup", onMouseUp);
    }
    
    document.body.addEventListener("mousemove", onMouseMoveResize);
    document.body.addEventListener("mouseup", onMouseUpResize, { once: true });
  };
  const rotateHandler = (mouseDownEvent) => {
    const startRotation = rotation;
    const startPosition = { x: mouseDownEvent.pageX, y: mouseDownEvent.pageY };

    function onMouseMoveRotate(mouseMoveEvent) {
        setRotation(currentRotation => ({
          deg: (startRotation.deg 
          - (startPosition.x - mouseMoveEvent.pageX) 
          - (startPosition.y - mouseMoveEvent.pageY)) % 360
        }));
        console.log(rotation.deg);
      }
    function onMouseUpRotate() {
        document.body.removeEventListener("mousemove", onMouseMoveRotate);
        // uncomment the following line if not using `{ once: true }`
        // document.body.removeEventListener("mouseup", onMouseUp);
    }
    document.body.addEventListener("mousemove", onMouseMoveRotate);
    document.body.addEventListener("mouseup", onMouseUpRotate, { once: true });
  };
  
  const resetHandler = () => {
    setSize({ x: 200, y: 200 });
  };

  return (
    <div style={{ 
      width: size.x + 20, 
      height: size.y + 20,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div id="container" style={{ 
        width: size.x, 
        height: size.y,
        position: 'relative',
        border: '1px dashed #ccc',
        overflow: 'hidden'
      }}>
        <img 
          src={src} 
          alt={alt} 
          width={size.x} 
          height={size.y}
          style={{ transform: `rotate(${rotation.deg}deg)` }}
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
            padding: '4px 8px',
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
            padding: '4px 8px',
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
          padding: '4px 8px',
          zIndex: 10
        }}
      >
        Reset
      </button>
    </div>
  );
}

export default Resizeable;