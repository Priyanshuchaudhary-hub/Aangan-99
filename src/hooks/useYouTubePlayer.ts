/* =========================================================================
   AANGAN '99 — YOUTUBE PLAYER CONTROLLER HOOK (useYouTubePlayer)
   Unified controller decoupling Radio UI from the underlying YT.Player engine.
   ========================================================================= */

import { useState, useEffect, useCallback } from 'react';
import { YouTubePlayer } from '../music/youtube/YouTubePlayer.ts';
import { PlaybackState } from '../music/youtube/youtubeTypes.ts';

export function useYouTubePlayer() {
  const yt = YouTubePlayer.getInstance();
  const [playerState, setPlayerState] = useState<PlaybackState>(yt.getPlayerState());
  const [currentTime, setCurrentTime] = useState<number>(yt.getCurrentTime());
  const [duration, setDuration] = useState<number>(yt.getDuration());
  const [error, setError] = useState<string | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = yt.subscribe((payload) => {
      setPlayerState(payload.state);
      setCurrentTime(payload.currentTime);
      setDuration(payload.duration);
      setError(payload.error);
      if (payload.track?.youtubeVideoId) {
        setCurrentVideoId(payload.track.youtubeVideoId);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [yt]);

  const play = useCallback(() => {
    yt.playVideo();
  }, [yt]);

  const pause = useCallback(() => {
    yt.pauseVideo();
  }, [yt]);

  const loadVideo = useCallback((videoId: string) => {
    yt.testYouTubePlayback(videoId);
  }, [yt]);

  const seekTo = useCallback((seconds: number) => {
    yt.seekTo(seconds);
  }, [yt]);

  const getCurrentTime = useCallback(() => {
    return yt.getCurrentTime();
  }, [yt]);

  const getDuration = useCallback(() => {
    return yt.getDuration();
  }, [yt]);

  const getPlayerState = useCallback(() => {
    return yt.getPlayerState();
  }, [yt]);

  return {
    play,
    pause,
    loadVideo,
    seekTo,
    getCurrentTime,
    getDuration,
    getPlayerState,
    currentVideoId,
    playerState,
    currentTime,
    duration,
    error
  };
}
