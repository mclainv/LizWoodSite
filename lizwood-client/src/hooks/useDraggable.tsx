import { useState, useCallback, useRef, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
}

// Returns [current position, mousedown handler]
export function useDraggable(initialPos: Point | undefined): [Point, (e: React.MouseEvent<Element, MouseEvent>) => void] {
  const safeInitialPos = { x: initialPos?.x ?? 0, y: initialPos?.y ?? 0 };
  const [pos, setPos] = useState(safeInitialPos);

  const startPosRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((event: globalThis.MouseEvent) => {
    setPos({
      x: event.pageX - startPosRef.current.x,
      y: event.pageY - startPosRef.current.y,
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<Element, MouseEvent>) => {
      event.preventDefault();
      startPosRef.current = {
        x: event.pageX - pos.x,
        y: event.pageY - pos.y,
      };
      document.addEventListener('mousemove', handleMouseMove as EventListener);
      document.addEventListener('mouseup', handleMouseUp as EventListener);
    },
    [pos, handleMouseMove, handleMouseUp]
  );

  useEffect(() => {
      setPos({ x: initialPos?.x ?? 0, y: initialPos?.y ?? 0 });
  }, [initialPos?.x, initialPos?.y]);

  return [pos, handleMouseDown];
}
