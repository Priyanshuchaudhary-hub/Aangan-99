/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — YOUTUBE API SINGLETON LOADER
   Ensures single global injection and reusable promise for YouTube IFrame API.
   ========================================================================= */

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

let apiPromise: Promise<void> | null = null;

export function loadYouTubeIframeAPI(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window is undefined'));
  }

  if (window.YT && window.YT.Player) {
    return Promise.resolve();
  }

  if (apiPromise) {
    return apiPromise;
  }

  apiPromise = new Promise((resolve, reject) => {
    // Check if script element already exists
    let script = document.getElementById('yt-iframe-api-script') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'yt-iframe-api-script';
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => {
        apiPromise = null;
        reject(new Error('Failed to load YouTube Iframe API script from URL'));
      };
      document.head.appendChild(script);
    }

    const existingCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (existingCallback) {
        try {
          existingCallback();
        } catch (e) {
          console.error('[YOUTUBE LOADER] Error in existing callback:', e);
        }
      }
      if (window.YT && window.YT.Player) {
        resolve();
      } else {
        apiPromise = null;
        reject(new Error('YouTube API loaded but YT.Player unavailable'));
      }
    };

    // Polling fallback if callback fired or YT attached
    const interval = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(interval);
        resolve();
      }
    }, 100);

    // Timeout after 10s
    setTimeout(() => {
      clearInterval(interval);
      if (window.YT && window.YT.Player) {
        resolve();
      } else {
        apiPromise = null;
        reject(new Error('YouTube IFrame API loading timed out after 10 seconds'));
      }
    }, 10000);
  });

  return apiPromise;
}
