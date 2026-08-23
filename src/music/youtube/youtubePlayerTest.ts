/* =========================================================================
   AANGAN '99 / YOUTUBE PLAYER ISOLATED TEST CONFIG & HELPERS
   Contains configuration for single test video and diagnostic state checkers.
   ========================================================================= */

export const YOUTUBE_TEST_CONFIG = {
  TEST_VIDEO_ID: 'Umqb9KENgmk', // Known verified public embeddable video: Tum Hi Ho - Arijit Singh
  TEST_VIDEO_TITLE: 'Tum Hi Ho (Official Video)',
  TEST_VIDEO_ARTIST: 'Arijit Singh & Mithoon',
  FALLBACK_TEST_VIDEO_ID: 'Umqb9KENgmk', // Tum Hi Ho
};

export interface YouTubeDiagnosticState {
  apiReady: boolean;
  playerReady: boolean;
  videoLoaded: boolean;
  playRequestSent: boolean;
  playerState: string;
  errorCode: number | null;
  errorMessage: string | null;
  iframeCreated: boolean;
  iframeBlocked: boolean;
  cspIssue: boolean;
  networkIssue: boolean;
  origin: string;
  isHttps: boolean;
  browser: string;
}

export function getBrowserInfo(): string {
  if (typeof navigator === 'undefined') return 'Unknown';
  return `${navigator.userAgent}`;
}

export function getPlayerStateString(stateCode: number | null | undefined): string {
  if (stateCode === null || stateCode === undefined) return 'UNINIT';
  if (typeof window !== 'undefined' && window.YT && window.YT.PlayerState) {
    switch (stateCode) {
      case window.YT.PlayerState.UNSTARTED: // -1
        return 'UNSTARTED (-1)';
      case window.YT.PlayerState.ENDED: // 0
        return 'ENDED (0)';
      case window.YT.PlayerState.PLAYING: // 1
        return 'PLAYING (1)';
      case window.YT.PlayerState.PAUSED: // 2
        return 'PAUSED (2)';
      case window.YT.PlayerState.BUFFERING: // 3
        return 'BUFFERING (3)';
      case window.YT.PlayerState.CUED: // 5
        return 'CUED (5)';
      default:
        return `UNKNOWN (${stateCode})`;
    }
  }
  return `CODE (${stateCode})`;
}
