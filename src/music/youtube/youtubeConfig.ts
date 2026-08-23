/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — YOUTUBE CONFIGURATION
   Secure environment configuration & official API endpoints.
   ========================================================================= */

const metaEnv = (import.meta as any).env || {};

export const YOUTUBE_CONFIG = {
  // Never hardcode secrets. Read safely from environment or fallback
  API_KEY: metaEnv.VITE_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY || '',
  SEARCH_ENDPOINT: 'https://www.googleapis.com/youtube/v3/search',
  VIDEOS_ENDPOINT: 'https://www.googleapis.com/youtube/v3/videos',
  IFRAME_API_URL: 'https://www.youtube.com/iframe_api',
  DEFAULT_SEARCH_PARAMS: {
    part: 'snippet',
    type: 'video',
    videoEmbeddable: 'true',
    regionCode: 'IN',
    relevanceLanguage: 'en',
    maxResults: 10
  },
  DEFAULT_PLAYER_VARS: {
    autoplay: 0,
    controls: 1,
    disablekb: 0,
    fs: 1,
    modestbranding: 1,
    rel: 0,
    playsinline: 1,
    enablejsapi: 1
  }
};
