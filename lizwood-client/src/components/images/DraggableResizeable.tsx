import React, { useState, useImperativeHandle, useCallback } from 'react';
import { ImageProps, Position, PinSourceData, PinData } from '../../types/types.ts';
import ImageEditorButtons from '../buttons/imageEditorButton.tsx';
import { useDraggable } from '../../hooks/useDraggable.tsx';
import { useResizable } from '../../hooks/useResizable.tsx';
import { useRotatable } from '../../hooks/useRotatable.tsx';
import { availablePinSources } from '../../data/pinSources.ts'; // Verifying this exact path

// Module-scoped highest z-index counter
let highestZ = 20;

// Default empty size/rotation for hooks when pin is absent
const defaultSize = { x: 0, y: 0 };
const defaultRotation = { deg: 0 };

// Placeholder - replace with your actual pin image URLs
// Ensure the initial pin.src passed via props is included here!

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
  // --- Main Image Hooks --- 
  const [pos, dragHandler] = useDraggable({ x: initialPos.x, y: initialPos.y }); 
  const [size, resizeHandler, resetSize] = useResizable({
    initialSize: { x: initialPos.width, y: initialPos.height },
    aspectRatio: (ogHeight && ogWidth) ? ogWidth / ogHeight : 1,
    minSize: { x: 30, y: 30 }
  });
  const [rotation, rotateHandler, resetRotation] = useRotatable({ 
    initialRotation: { deg: initialPos.rotated } 
  });

  // --- Pin Hooks & State --- 
  const initialPinPos = pin ? { x: pin.initialPos.x, y: pin.initialPos.y } : undefined;
  const [pinPos, pinDragHandler] = useDraggable(initialPinPos);

  // Function to find the initial pin source object
  // IMPORTANT: Assumes availablePinSources is now an array of PinSourceData objects
  const findInitialPinSource = useCallback((): PinSourceData => {
    if (pin?.src) {
      const found = availablePinSources.find(ps => ps.src === pin.src);
      if (found) return found;
      console.warn("Initial pin.src not found in availablePinSources. Falling back.");
    }
    return availablePinSources.length > 0 ? availablePinSources[0] : { src: '', ogWidth: 0, ogHeight: 0, rotated: 0 }; 
  }, [pin?.src]); // Dependency on pin.src
  
  const [currentPinSource, setCurrentPinSource] = useState<PinSourceData>(findInitialPinSource);

  const initialPinRotation = pin ? { deg: pin.initialPos.rotated } : defaultRotation;
  const initialPinSize = pin ? { x: pin.initialPos.width, y: pin.initialPos.height } : defaultSize;

  const [pinRotation, rotatePinHandler, resetPinRotation] = useRotatable({ initialRotation: initialPinRotation });

  // Calculate the CURRENT aspect ratio on each render based on state
  const currentPinAspectRatio = currentPinSource.ogWidth / currentPinSource.ogHeight;
  
  const [pinSize, resizePinHandler, resetPinSize, setPinSize] = useResizable({
    initialSize: initialPinSize,       // Still use original initial size for first mount
    aspectRatio: currentPinAspectRatio, // Pass the DYNAMIC aspect ratio
    minSize: { x: 10, y: 10 } 
  });

  // --- Component State --- 
  const [zIndex, setZIndex] = useState(initialPos.z);
  const [isEditing, setIsEditing] = useState(false);

  // Expose getPosition() via useImperativeHandle 
  useImperativeHandle(ref, () => ({
    // Return the state structure matching the schema's defaultPosition field
    getPosition: (): Position & { pin?: PinData } => {
      const pinState: PinData | undefined = pin ? {
        src: currentPinSource.src, 
        ogWidth: currentPinSource.ogWidth, 
        ogHeight: currentPinSource.ogHeight,
        initialPos: 
        {
          x: pinPos.x, 
          y: pinPos.y,
          rotated: pinRotation.deg, 
          width: pinSize.x, 
          height: pinSize.y
        }
      } : undefined;
      console.log("pinState", pinState);
      return {
        x: pos.x,
        y: pos.y,
        z: zIndex,
        rotated: rotation.deg,
        width: size.x,
        height: size.y,
        pin: pinState // This matches the structure within defaultPosition in the schema
      };
    }
  }));

  // --- Event Handlers --- 

  // Main image drag start / click handler
  const onMouseDown = (e: React.MouseEvent<Element, MouseEvent>) => {
    highestZ += 1;
    setZIndex(highestZ);
    let dragged = false;
    const initialPageX = e.pageX;
    const initialPageY = e.pageY;
    const tempMoveHandler = (moveEvent: MouseEvent) => {
      if (Math.abs(moveEvent.pageX - initialPageX) > 3 || Math.abs(moveEvent.pageY - initialPageY) > 3) {
        dragged = true;
        document.removeEventListener('mousemove', tempMoveHandler);
        document.removeEventListener('mouseup', tempUpHandler);
        dragHandler(e); 
      }
    };
    const tempUpHandler = () => {
      document.removeEventListener('mousemove', tempMoveHandler);
      document.removeEventListener('mouseup', tempUpHandler);
      if (!dragged) {
        setIsEditing(prev => !prev);
      }
    };
    document.addEventListener('mousemove', tempMoveHandler);
    document.addEventListener('mouseup', tempUpHandler);
  };

  // Pin drag start / click handler (attached to pin image)
  const onPinMouseDown = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation(); 
    highestZ += 1;
    setZIndex(highestZ);
    let dragged = false;
    const initialPageX = e.pageX;
    const initialPageY = e.pageY;
    const tempMoveHandler = (moveEvent: MouseEvent) => {
      // Check if movement exceeds a small threshold to differentiate click from drag
      if (Math.abs(moveEvent.pageX - initialPageX) > 3 || Math.abs(moveEvent.pageY - initialPageY) > 3) {
        dragged = true;
        // If dragging starts, remove this temporary listener and let useDraggable take over
        document.removeEventListener('mousemove', tempMoveHandler);
        document.removeEventListener('mouseup', tempUpHandler);
        if (pinDragHandler) { // Initialize the actual pin drag handler
            pinDragHandler(e); 
        }
      }
    };
    const tempUpHandler = () => {
      document.removeEventListener('mousemove', tempMoveHandler);
      document.removeEventListener('mouseup', tempUpHandler);
      if (!dragged) {
        // click without drag toggles main image edit mode
        setIsEditing(prev => !prev);
      }
    };
    document.addEventListener('mousemove', tempMoveHandler);
    document.addEventListener('mouseup', tempUpHandler);
  };

  // Pin rotate start handler (attached to pin rotate handle)
  const onPinRotateMouseDown = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation(); 
    if (rotatePinHandler) {
      rotatePinHandler(e); 
    }
  };

  // Pin resize start handler (attached to pin resize handle)
  const onPinResizeMouseDown = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation();
    if (resizePinHandler) {
      resizePinHandler(e);
    }
  };

  // Pin cycle image handler (attached to pin cycle button)
  const cyclePinImage = (e: React.MouseEvent<Element, MouseEvent>) => {
      e.stopPropagation(); 
      if (!pin || availablePinSources.length <= 1) return; 

      const currentIndex = availablePinSources.findIndex(ps => ps.src === currentPinSource.src);
      const nextIndex = (currentIndex + 1) % availablePinSources.length;
      const nextPinSource = availablePinSources[nextIndex];
      
      // Update the source state first
      setCurrentPinSource(nextPinSource);

      // Calculate new height based on current width and NEXT source's aspect ratio
      const currentWidth = pinSize.x; 
      const nextAspectRatio = (nextPinSource.ogHeight && nextPinSource.ogWidth) ? nextPinSource.ogWidth / nextPinSource.ogHeight : 1;
      
      let newHeight = currentWidth / nextAspectRatio; 
      // Handle division by zero or invalid aspect ratio
      if (isNaN(newHeight) || !isFinite(newHeight) || nextAspectRatio === 0) { 
          newHeight = nextPinSource.ogHeight; // Fallback to original height of new image
      }
      
      // Apply min height constraint
      const minPinHeight = 10;
      newHeight = Math.max(minPinHeight, newHeight);

      // Programmatically set the new size
      setPinSize({ x: currentWidth, y: newHeight });
  };

  const deleteHandler = useCallback((event: React.MouseEvent<Element, MouseEvent>) => {
    event.stopPropagation();
    if (onDeleteRequest) {
      const itemType = pin ? 'draggable' : 'fixed';
      onDeleteRequest(itemType, _id);
    }
  }, [onDeleteRequest, _id, pin]);

  const resetHandler = useCallback((event: React.MouseEvent<Element, MouseEvent>) => {
    event.stopPropagation();
    resetSize(); 
    resetRotation(); 
    
    if (pin) { 
      const originalSource = findInitialPinSource(); 
      setCurrentPinSource(originalSource); 
      resetPinRotation();
      resetPinSize();
      // Find the initial pin object again for reset
      const initialSource = findInitialPinSource(); 
      setCurrentPinSource(initialSource);
      // TODO: Add reset for pin position if useDraggable is updated
    }
  }, [resetSize, resetRotation, resetPinRotation, pin, findInitialPinSource, resetPinSize]); // Added resetPinSize

  // --- Style Calculations ---
  const isSmall = size.x < 100 || size.y < 100;
  const isTiny = size.x < 50 || size.y < 50;
  let buttonPadding = isSmall ? '2px 4px' : '4px 8px';
  let buttonFontSize = isSmall ? '0.75rem' : '1rem';
  if (isTiny) {
    buttonPadding = '1px 2px';
    buttonFontSize = '0.5rem';
  }

  // --- Render Logic ---

  const renderPin = () => {
    if (!pin) return null;

    // Pin styles defined inside renderPin where pin is guaranteed non-null
    const pinContainerStyle: React.CSSProperties = {
        position: 'absolute',
        left: pinPos.x,
        top: pinPos.y,
        width: pinSize.x, 
        height: pinSize.y, 
        zIndex: zIndex + 1, 
        transform: `rotate(${pinRotation.deg}deg)`,
        cursor: 'move',
        userSelect: 'none',
        border: isEditing ? '1px dashed rgba(255,255,255,0.5)' : 'none',
    };

    const pinHandleStyle: React.CSSProperties = {
        position: 'absolute',
        width: '10px',
        height: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        border: '1px solid white',
        zIndex: zIndex + 2, 
        userSelect: 'none',
        display: 'flex', // Use flexbox for centering symbol
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '8px', // Adjust symbol size
        lineHeight: '1',
    }

    const pinRotateHandleStyle: React.CSSProperties = {
        ...pinHandleStyle,
        top: '-5px', 
        right: '-5px', 
        borderRadius: '50%',
        cursor: 'alias',
    };

    const pinResizeHandleStyle: React.CSSProperties = {
        ...pinHandleStyle,
        bottom: '-5px', 
        right: '-5px',
        borderRadius: '0', 
        cursor: 'nwse-resize',
    };

    const pinCycleHandleStyle: React.CSSProperties = {
        ...pinHandleStyle,
        top: '-5px',
        left: '-5px',
        borderRadius: '3px', // Slightly rounded square
        cursor: 'pointer',
    };

    return (
      <div style={pinContainerStyle}>
        <img
          src={currentPinSource.src} // Use src string from the state object
          alt="pin"
          width="100%" 
          height="100%"
          onMouseDown={onPinMouseDown} 
          draggable={false}
          style={{ display: 'block' }} 
        />
        {isEditing && (
          <>
            {/* Pin Cycle Handle (Top Left) */}
            <div 
               style={pinCycleHandleStyle}
               onClick={cyclePinImage} // Use onClick for simple action
               title="Cycle Pin Image"
            >
              &#x21CC; {/* Rightwards arrows over leftwards arrows */} 
            </div>
            {/* Pin Rotate Handle (Top Right) */}
            <div 
               style={pinRotateHandleStyle}
               onMouseDown={onPinRotateMouseDown} 
               title="Rotate Pin"
            >
               &#x21BB; {/* Added symbol */} 
            </div>
            {/* Pin Resize Handle (Bottom Right) */}
            <div
               style={pinResizeHandleStyle}
               onMouseDown={onPinResizeMouseDown}
               title="Resize Pin (Hold Shift for aspect ratio)"
            >
               &#x21F2; {/* Added symbol */} 
            </div>
          </>
        )}
      </div>
    );
  }

  if (!isEditing) {
    // Non-editing mode render
    return (
      <div style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        transform: `rotate(${rotation.deg}deg)`,
        zIndex: zIndex,
        width: size.x, 
        height: size.y,
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
            display: 'block',
          }}
        />
        {renderPin()} 
      </div>
    );
  }

  // Editing Mode Render
  return (
    <div
      style={{
        width: size.x + 2, 
        height: size.y + 2,
        zIndex: zIndex,
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        transform: `rotate(${rotation.deg}deg)`,
      }}>
      <div id="image-container" style={{ 
        width: size.x,
        height: size.y,
        position: 'relative',
        border: '1px dashed #ccc',
        // overflow: 'hidden' 
      }}>
        <img
          onMouseDown={onMouseDown} 
          src={src}
          alt={alt}
          width={size.x}
          height={size.y}
          draggable={false} 
          style={{ display: 'block' }} 
        />
         {renderPin()} 
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