import React, {
  useState,
  forwardRef
} from 'react';
import { useFall } from '../../hooks/useFall.tsx';

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
    const [isFalling, setIsFalling] = useState(false);

    // Initialize the falling animation hook
    useFall();

    const onMouseDown = (e) => {
      // Don't allow dragging if the image is falling
      if (isFalling) return;
      
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

    const onPinClick = (e) => {
      e.stopPropagation(); // Prevent triggering the image's onMouseDown
      setIsFalling(true);
    };

    return (
      <div style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        zIndex: zIndex,
        cursor: isFalling ? 'default' : 'grab',
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
          zIndex: zIndex+1,
          display: 'block',
          transform: `rotate(${pin.initialPos.rotated}deg)`,
          cursor: 'pointer'
        }}
        onClick={onPinClick}
        draggable={false}
      />
      </div>
    );
  }
);

export default DraggableImage;