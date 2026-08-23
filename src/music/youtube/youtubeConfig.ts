/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — YOUTUBE CONFIGURATION
   Secure environment configuration & official API endpoints.
   ========================================================================= */

const getApiKey = (): string => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_YOUTUBE_API_KEY) {
      return (import.meta as any).env.VITE_YOUTUBE_API_KEY;
    }
    if (typeof process !== 'undefined' && process?.env?.YOUTUBE_API_KEY) {
      return process.env.YOUTUBE_API_KEY;
    }
  } catch {
    // Ignore runtime environment lookup errors in pure browser static environments
  }
  return '';
};

export const YOUTUBE_CONFIG = {
  // Never hardcode secrets. Read safely from environment or fallback
  API_KEY: getApiKey(),
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
