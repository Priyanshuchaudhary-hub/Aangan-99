import React, { useState, useCallback, useEffect, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseDragOptions {
  initialPosition?: Position;
  bounds?: { minX: number; maxX: number; minY: number; maxY: number };
  onDragStart?: () => void;
  onDragEnd?: (finalPos: Position) => void;
}

export function useDrag({
  initialPosition = { x: 0, y: 0 },
  bounds,
  onDragStart,
  onDragEnd
}: UseDragOptions = {}) {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

  const startDrag = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      // Prevent drag if clicking on buttons or inputs
      const target = e.target as HTMLElement;
      if (target.closest('button, input, textarea, a, select')) {
        return;
      }

      onDragStart?.();
      setIsDragging(true);

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      dragStartRef.current = {
        startX: clientX,
        startY: clientY,
        initialX: position.x,
        initialY: position.y
      };
    },
    [position, onDragStart]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!dragStartRef.current) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - dragStartRef.current.startX;
      const deltaY = clientY - dragStartRef.current.startY;

      let nextX = dragStartRef.current.initialX + deltaX;
      let nextY = dragStartRef.current.initialY + deltaY;

      if (bounds) {
        nextX = Math.max(bounds.minX, Math.min(bounds.maxX, nextX));
        nextY = Math.max(bounds.minY, Math.min(bounds.maxY, nextY));
      }

      setPosition({ x: nextX, y: nextY });
    };

    const handleEnd = () => {
      setIsDragging(false);
      dragStartRef.current = null;
      onDragEnd?.(position);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, bounds, onDragEnd, position]);

  return {
    position,
    setPosition,
    isDragging,
    startDrag
  };
}
