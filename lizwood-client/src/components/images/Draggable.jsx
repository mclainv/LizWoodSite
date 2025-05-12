import React, {
  useState,
  forwardRef
} from 'react';
import { useFall } from '../../hooks/useFall.tsx';
import cursorImage from '../../assets/cursor-small.png';
import grabbingImage from '../../assets/grabbing-small.png';

// Module-scoped highest z-index counter
let highestZ = 1;

const DraggableImage = forwardRef(
  ({ 
    src, 
    alt, 
    ogWidth, 
    ogHeight,
    route,
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
      const startX = e.pageX;
      const startY = e.pageY;

      // Calculate offset between mouse and image top-left
      const offsetX = startX - pos.x;
      const offsetY = startY - pos.y;

      const onMouseMove = (e) => {
        // Check if mouse moved more than 5 pixels in any direction
        if (Math.abs(e.pageX - startX) > 5 || Math.abs(e.pageY - startY) > 5) {
          dragged = true;
        }
        if (dragged) {
          setPos({ x: e.pageX - offsetX, y: e.pageY - offsetY });
        }
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        
        if (!dragged) {
          //just clicked
          if (route) {
            window.location.href = route;
          }
          console.log('Image clicked!');
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
        style={{
          cursor: `url(${grabbingImage}) 15 15, pointer`
        }}
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
          cursor: `url(${cursorImage}), pointer`
        }}
        onClick={onPinClick}
        draggable={false}
      />
      </div>
    );
  }
);

export default DraggableImage;