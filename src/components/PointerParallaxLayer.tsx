import React, { useEffect, useState, useRef } from 'react';

interface PointerParallaxLayerProps {
  children: React.ReactNode;
  depth?: 'bg' | 'mg' | 'fg'; // bg: 2-4px, mg: 4-7px, fg: 6-10px
  intensity?: number;
  className?: string;
}

export const PointerParallaxLayer: React.FC<PointerParallaxLayerProps> = ({
  children,
  depth = 'mg',
  intensity,
  className = ''
}) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const targetOffset = useRef({ x: 0, y: 0 });
  const currentOffset = useRef({ x: 0, y: 0 });
  const animFrameId = useRef<number | null>(null);

  const depthMultiplier = intensity !== undefined ? intensity : (depth === 'bg' ? 3 : depth === 'mg' ? 6 : 9);

  useEffect(() => {
    // Disable parallax on touch screens or prefers-reduced-motion
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    ) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coords between -1 and 1
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;

      targetOffset.current = {
        x: normX * depthMultiplier,
        y: normY * depthMultiplier
      };
    };

    const updateParallax = () => {
      // Damped spring ease toward target offset
      const ease = 0.08;
      currentOffset.current.x += (targetOffset.current.x - currentOffset.current.x) * ease;
      currentOffset.current.y += (targetOffset.current.y - currentOffset.current.y) * ease;

      setOffset({
        x: Math.round(currentOffset.current.x * 100) / 100,
        y: Math.round(currentOffset.current.y * 100) / 100
      });

      animFrameId.current = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animFrameId.current = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [depthMultiplier]);

  return (
    <div
      className={className}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        willChange: 'transform',
        transition: 'transform 0.1s cubic-bezier(0.25, 0.1, 0.25, 1)'
      }}
    >
      {children}
    </div>
  );
};
