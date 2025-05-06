import { useState, useCallback, useRef, useEffect } from 'react';

interface Size {
  x: number;
  y: number;
}

interface UseResizableOptions {
  initialSize: Size;
  aspectRatio?: number;
  minSize?: Size;
}

// Type for the hook's return value
type UseResizableReturn = [
  Size, // current size
  (e: React.MouseEvent<Element, MouseEvent>) => void, // mousedown handler
  () => void, // reset function
  React.Dispatch<React.SetStateAction<Size>> // setSize function
];

// Returns [current size, resize mousedown handler, reset function, setSize function]
export function useResizable({
  initialSize,
  aspectRatio = 1, // Default aspect ratio if none provided
  minSize = { x: 30, y: 30 }, // Default minimum size
}: UseResizableOptions): UseResizableReturn {
  const [size, setSize] = useState(initialSize);
  const startSizeRef = useRef(initialSize);
  const startMousePosRef = useRef({ x: 0, y: 0 });

  // Store initialSize in a ref to ensure reset uses the very first value
  const initialSizeRef = useRef(initialSize);

  const handleMouseMove = useCallback(
    (event: globalThis.MouseEvent) => {
      let newWidth = size.x;
      let newHeight = size.y;
      const startSize = startSizeRef.current;
      const startMousePos = startMousePosRef.current;

      if (event.shiftKey && aspectRatio !== 0) {
        const deltaX = event.pageX - startMousePos.x;
        const deltaY = event.pageY - startMousePos.y;

        // Determine dominant axis for aspect ratio lock
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          newWidth = startSize.x + deltaX;
          newHeight = newWidth / aspectRatio;
        } else {
          newHeight = startSize.y + deltaY;
          newWidth = newHeight * aspectRatio;
        }

        // Apply minimum size constraints while maintaining aspect ratio
        newWidth = Math.max(minSize.x, newWidth);
        newHeight = Math.max(minSize.y, newHeight);
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            newHeight = Math.max(minSize.y, newWidth / aspectRatio);
        } else {
            newWidth = Math.max(minSize.x, newHeight * aspectRatio);
        }
      } else {
        // No shift key, resize freely
        newWidth = startSize.x + (event.pageX - startMousePos.x);
        newHeight = startSize.y + (event.pageY - startMousePos.y);
         // Apply minimum size constraints directly
         newWidth = Math.max(minSize.x, newWidth);
         newHeight = Math.max(minSize.y, newHeight);
      }

      if (!isNaN(newWidth) && !isNaN(newHeight)) {
        setSize({ x: newWidth, y: newHeight });
      } else {
        console.warn("Resize calculation resulted in NaN.");
      }
    },
    [size.x, size.y, aspectRatio, minSize.x, minSize.y] // Include dependencies
  );

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<Element, MouseEvent>) => {
      event.preventDefault();
      event.stopPropagation(); // Prevent triggering drag on resize handle
      startSizeRef.current = { ...size };
      startMousePosRef.current = { x: event.pageX, y: event.pageY };
      document.addEventListener('mousemove', handleMouseMove as EventListener);
      document.addEventListener('mouseup', handleMouseUp as EventListener);
    },
    [size, handleMouseMove, handleMouseUp]
  );

  // Reset function
  const resetSize = useCallback(() => {
    setSize(initialSizeRef.current); // Reset to the initial value stored in ref
  }, []); // No dependencies needed

  // Effect to update size if initialSize prop changes *externally*
  // Note: This might conflict with the reset logic if not careful.
  // Consider if you truly need the component to react to initialSize changes *after* mount.
  // If reset should always go back to the *very first* initialSize, the ref approach is good.
  useEffect(() => {
    // Update the state *only if* the prop actually changes from the current state
    // This prevents overwriting the state during user interaction if the prop reference changes unnecessarily
    if (initialSize.x !== size.x || initialSize.y !== size.y) {
       // Also update the ref if the initial prop changes, so reset uses the new base
       initialSizeRef.current = initialSize;
       setSize(initialSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSize.x, initialSize.y]); // Rerun if initialSize values change

  return [size, handleMouseDown, resetSize, setSize]; // Return the setSize function
}
