/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — PERSISTENT MEDIA LAYER / YOUTUBE PLAYER HOST
   Root-level permanent host for the official YouTube IFrame Player instance.
   Guarantees persistent playback across window minimize, restore, navigation,
   and folder browsing with ZERO DOM unmounting.
   ========================================================================= */

import React from 'react';

export const PersistentMediaLayer: React.FC = () => {
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


