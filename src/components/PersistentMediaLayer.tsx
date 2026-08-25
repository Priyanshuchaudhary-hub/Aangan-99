/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — PERSISTENT MEDIA LAYER / YOUTUBE PLAYER HOST
   Root-level permanent host for the official YouTube IFrame Player instance.
   Guarantees persistent playback across window minimize, restore, navigation,
   and folder browsing with ZERO DOM unmounting.
   ========================================================================= */

import React, { useEffect, useRef } from 'react';
import { YouTubePlayer } from '../music/youtube/YouTubePlayer.ts';

export const PersistentMediaLayer: React.FC = () => {
  const initializedRef = useRef<boolean>(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    console.log('[PERSISTENT YOUTUBE PLAYER] Mounting persistent layer and initializing YT player host...');
    const player = YouTubePlayer.getInstance();
    player.initialize('yt-official-iframe-host').catch((err) => {
      console.warn('[PERSISTENT YOUTUBE PLAYER] Lifecycle initialization warning:', err);
    });
  }, []);

  return (
    <div
      id="persistent-media-layer"
      className="fixed bottom-0 right-0 w-24 h-24 pointer-events-none opacity-[0.01] overflow-hidden -z-50 select-none"
      aria-hidden="true"
    >
      {/* Permanent YouTube IFrame Host DOM Node */}
      <div id="yt-official-iframe-host" className="w-full h-full" />
    </div>
  );
};

export const PersistentYouTubePlayer = PersistentMediaLayer;



