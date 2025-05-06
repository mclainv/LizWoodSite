import { useState, useCallback, useRef, useEffect } from 'react';

interface Rotation {
  deg: number;
}

interface UseRotatableOptions {
  initialRotation: Rotation;
}

// Type for the hook's return value
type UseRotatableReturn = [
  Rotation, // current rotation
  (e: React.MouseEvent<Element, MouseEvent>) => void, // mousedown handler
  () => void // reset function
];

// Returns [current rotation, rotate mousedown handler, reset function]
export function useRotatable({
  initialRotation,
}: UseRotatableOptions): UseRotatableReturn {
  const [rotation, setRotation] = useState(initialRotation);
  const startRotationRef = useRef(initialRotation);
  const startMousePosRef = useRef({ x: 0, y: 0 });

  // Store initialRotation in a ref
  const initialRotationRef = useRef(initialRotation);

  const handleMouseMove = useCallback(
    (event: globalThis.MouseEvent) => {
      const startRotation = startRotationRef.current;
      const startPosition = startMousePosRef.current;
      const deltaX = event.pageX - startPosition.x;
      const deltaY = event.pageY - startPosition.y;
      let newDeg = (startRotation.deg + deltaX + deltaY) % 360;

      // Quantize rotation if Shift key is held
      if (event.shiftKey) {
        newDeg = Math.round(newDeg / 10) * 10;
      }

      setRotation({ deg: newDeg });
    },
    [] // No direct dependencies from component scope needed here
  );

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<Element, MouseEvent>) => {
      event.preventDefault();
      event.stopPropagation(); // Prevent triggering drag on rotate handle
      startRotationRef.current = { ...rotation };
      startMousePosRef.current = { x: event.pageX, y: event.pageY };
      document.addEventListener('mousemove', handleMouseMove as EventListener);
      document.addEventListener('mouseup', handleMouseUp as EventListener);
    },
    [rotation, handleMouseMove, handleMouseUp]
  );

  // Reset function
  const resetRotation = useCallback(() => {
    setRotation(initialRotationRef.current);
  }, []); // No dependencies needed

  // Effect to update rotation if initialRotation prop changes *externally*
  useEffect(() => {
    if (initialRotation.deg !== rotation.deg) {
        initialRotationRef.current = initialRotation;
        setRotation(initialRotation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [initialRotation]); // Add initialRotation to dependency array

  return [rotation, handleMouseDown, resetRotation]; // Return the reset function
}
