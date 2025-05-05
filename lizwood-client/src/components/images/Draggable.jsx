import React, {
  useState,
  forwardRef,
} from 'react';

// Module-scoped highest z-index counter
let highestZ = 1;

const DraggableImage = forwardRef(
  ({ 
    src, 
    alt, 
    ogWidth, 
    ogHeight,
    initialPos = 
      { x: 0, y: 0, z: 1, rotated: 0, width: ogWidth, height: ogHeight },
    pin,
    }, ref) => {
    const [pos, setPos] = useState({ x: initialPos.x, y: initialPos.y });
    const [zIndex, setZIndex] = useState(initialPos.z);
    // expose getPosition() on the ref
    // useImperativeHandle(ref, () => ({
    //   getPosition: () => ({ x: pos.x, y: pos.y, z: zIndex }),
    // }));

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
          //just clicked
          //maybe route from here
        }
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    return (
      <div style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        zIndex: zIndex,
        cursor: 'grab',
        userSelect: 'none',
        transform: `rotate(${initialPos.rotated}deg)`
        }}>
        
      <img
        src={src}
        alt={alt}
        width={initialPos.width}
        height={initialPos.height}
        onMouseDown={onMouseDown}
        draggable={false}
      />
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
      </div>
    );
  }
);

export default DraggableImage;