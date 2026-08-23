import React, { useEffect, useState } from 'react';

type CursorState = 'default' | 'interactive' | 'object' | 'text';

export const RetroCustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check fine pointer (desktop mouse)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    const checkIsDesktop = () => {
      setIsDesktop(mediaQuery.matches && window.innerWidth >= 768);
    };

    checkIsDesktop();
    mediaQuery.addEventListener('change', checkIsDesktop);
    window.addEventListener('resize', checkIsDesktop);

    return () => {
      mediaQuery.removeEventListener('change', checkIsDesktop);
      window.removeEventListener('resize', checkIsDesktop);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      document.documentElement.classList.remove('custom-cursor-active');
      return;
    }

    document.documentElement.classList.add('custom-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Inspect target under cursor
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (
        target.closest('textarea') ||
        target.closest('input[type="text"]') ||
        target.closest('.selectable-text')
      ) {
        setCursorState('text');
      } else if (
        target.closest('.object-inspect') ||
        target.closest('.memory-card') ||
        target.closest('.relic-item') ||
        target.closest('.polaroid-frame') ||
        target.closest('img') ||
        target.closest('canvas')
      ) {
        setCursorState('object');
      } else if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('[role="button"]') ||
        target.closest('.interactive-hover') ||
        target.closest('.cursor-pointer')
      ) {
        setCursorState('interactive');
      } else {
        setCursorState('default');
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [isDesktop, isVisible]);

  if (!isDesktop || !isVisible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[99999] transition-transform duration-75 ease-out"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        willChange: 'transform'
      }}
    >
      {/* DEFAULT RETRO WIN98 ARROW CURSOR */}
      {cursorState === 'default' && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="drop-shadow-[1px_2px_2px_rgba(0,0,0,0.6)]"
        >
          <path
            d="M3 2L3 19L7.5 14.5L11 21.5L13.5 20.5L10 13.5L16 13.5L3 2Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {/* INTERACTIVE RETRO POINTING HAND */}
      {cursorState === 'interactive' && (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          className="drop-shadow-[1px_2px_3px_rgba(0,0,0,0.7)] -translate-x-2 -translate-y-1 scale-110"
        >
          <path
            d="M9 11V3.5C9 2.67 9.67 2 10.5 2C11.33 2 12 2.67 12 3.5V10M12 10V5.5C12 4.67 12.67 4 13.5 4C14.33 4 15 4.67 15 5.5V10M15 10V7.5C15 6.67 15.67 6 16.5 6C17.33 6 18 6.67 18 7.5V14C18 18.42 14.42 22 10 22C6.69 22 3.86 19.98 2.65 17.06L1 13.11L2.17 11.94C2.52 11.59 3.03 11.4 3.52 11.48L6 11.9V11C6 10.17 6.67 9.5 7.5 9.5C8.33 9.5 9 10.17 9 11Z"
            fill="#FFFBEB"
            stroke="#800000"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {/* OBJECT MAGNIFY / GLOW INSPECT CURSOR */}
      {cursorState === 'object' && (
        <div className="relative -translate-x-3 -translate-y-3 flex items-center justify-center">
          <div className="absolute w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/60 animate-ping" />
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            className="drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
          >
            <circle cx="10" cy="10" r="6" fill="#18110c" stroke="#f59e0b" strokeWidth="2" />
            <line x1="14.5" y1="14.5" x2="20" y2="20" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="10" cy="10" r="2" fill="#fcd34d" />
          </svg>
        </div>
      )}

      {/* TEXT I-BEAM CURSOR */}
      {cursorState === 'text' && (
        <svg
          width="16"
          height="24"
          viewBox="0 0 16 24"
          fill="none"
          className="-translate-x-2 -translate-y-3"
        >
          <path
            d="M4 3H12M8 3V21M4 21H12"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
};
