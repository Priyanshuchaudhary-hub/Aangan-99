/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — GLOBAL NOSTALGIA MUSIC CONTEXT
   Layer 17 Verified Real Provider Playback Engine with Provider Abstraction.
   ========================================================================= */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { NostalgiaTrack, NostalgiaPlaylist, RadioHostMessage, PlaybackState, ProviderType } from '../music/types.ts';
import { NOSTALGIA_TRACKS, NOSTALGIA_PLAYLISTS, RADIO_HOST_QUOTES } from '../data/musicData.ts';
import { musicPlayerManager, RepeatMode } from '../music/player/MusicPlayerManager.ts';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';
import { YouTubePlayer } from '../music/youtube/YouTubePlayer.ts';

interface MusicContextType {
  currentTrack: NostalgiaTrack;
  playbackState: PlaybackState;
  isPlaying: boolean;
  isLoading: boolean;
  isUnavailable: boolean;
  playbackProgress: number; // 0 to 100
  currentTimeSeconds: number;
  durationSeconds: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  isFullPlayerOpen: boolean;
  isRadioOpen: boolean;
  isRadioMinimized: boolean;
  isSetupModalOpen: boolean;
  isDebugPanelOpen: boolean;
  isAutoplayAllowed: boolean;
  providerType: ProviderType;
  errorDetails: string | null;
  activePlaylist: NostalgiaPlaylist | null;
  queue: NostalgiaTrack[];
  favoriteTrackIds: string[];
  favoritePlaylistIds: string[];
  listeningHistory: { trackId: string; playedAt: number; memoryId?: string }[];
  radioHostQuote: RadioHostMessage | null;

  // Actions
  playTrack: (track: NostalgiaTrack, playlist?: NostalgiaPlaylist, memoryId?: string) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  seekTo: (percent: number) => void;
  seekToSeconds: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleFavoriteTrack: (trackId: string) => void;
  toggleFavoritePlaylist: (playlistId: string) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  openSearchModal: (initialQuery?: string) => void;
  playCustomYouTubeTrack: (video: { videoId: string; title: string; channelTitle: string; thumbnail?: string }) => Promise<void>;
  setIsFullPlayerOpen: (open: boolean) => void;
  setIsRadioOpen: (open: boolean) => void;
  setIsRadioMinimized: (minimized: boolean) => void;
  setIsSetupModalOpen: (open: boolean) => void;
  setIsDebugPanelOpen: (open: boolean) => void;
  switchProvider: (type: ProviderType) => Promise<void>;
  startRadioUserGesture: () => Promise<void>;
  setQueue: (tracks: NostalgiaTrack[]) => void;
  addToQueue: (track: NostalgiaTrack) => void;
  removeFromQueue: (trackId: string) => void;
  playMemoryMix: (memoryId: string) => void;
  triggerDiscoveryMode: () => { memoryId: string; track: NostalgiaTrack; quote: RadioHostMessage };
  getRelatedTracksForMemory: (memoryId: string) => NostalgiaTrack[];
  testYouTubePlayback: (videoId?: string) => Promise<void>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

const LOCAL_STORAGE_FAV_TRACKS_KEY = 'aangan99_fav_tracks_v3';
const LOCAL_STORAGE_FAV_PLAYLISTS_KEY = 'aangan99_fav_playlists_v3';
const LOCAL_STORAGE_HISTORY_KEY = 'aangan99_music_history_v3';

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<NostalgiaTrack>(NOSTALGIA_TRACKS[0]);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('IDLE');
  const [currentTimeSeconds, setCurrentTimeSeconds] = useState<number>(0);
  const [durationSeconds, setDurationSeconds] = useState<number>(180);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [isMuted, setIsMutedState] = useState<boolean>(false);
  const [isShuffle, setIsShuffleState] = useState<boolean>(false);
  const [repeatMode, setRepeatModeState] = useState<RepeatMode>('OFF');
  const [providerType, setProviderTypeState] = useState<ProviderType>('youtube');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState<boolean>(false);
  const [isRadioOpen, setIsRadioOpen] = useState<boolean>(true);
  const [isRadioMinimized, setIsRadioMinimized] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState<boolean>(false);
  const [isDebugPanelOpen, setIsDebugPanelOpen] = useState<boolean>(false);
  const [isAutoplayAllowed, setIsAutoplayAllowed] = useState<boolean>(false);

  const [activePlaylist, setActivePlaylist] = useState<NostalgiaPlaylist | null>(NOSTALGIA_PLAYLISTS[1]);
  const [queue, setQueueState] = useState<NostalgiaTrack[]>(NOSTALGIA_TRACKS);
  const [radioHostQuote, setRadioHostQuote] = useState<RadioHostMessage | null>(RADIO_HOST_QUOTES[0]);

  // Persistent Favorites & History
  const [favoriteTrackIds, setFavoriteTrackIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_FAV_TRACKS_KEY);
      return saved ? JSON.parse(saved) : ['tr-dd-anthem', 'tr-malgudi-theme', 'tr-purani-jeans'];
    } catch {
      return ['tr-dd-anthem', 'tr-malgudi-theme', 'tr-purani-jeans'];
    }
  });

  const [favoritePlaylistIds, setFavoritePlaylistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_FAV_PLAYLISTS_KEY);
      return saved ? JSON.parse(saved) : ['summer-vacation-mix', 'rainy-window'];
    } catch {
      return ['summer-vacation-mix', 'rainy-window'];
    }
  });

  const [listeningHistory, setListeningHistory] = useState<{ trackId: string; playedAt: number; memoryId?: string }[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Initialize Music Player Manager & Listeners
  useEffect(() => {
    musicPlayerManager.initialize().catch((err) => {
      console.warn('Error initializing MusicPlayerManager:', err);
    });

    musicPlayerManager.setQueue(NOSTALGIA_TRACKS);

    const unsubscribe = musicPlayerManager.onStateChange((state) => {
      setPlaybackState(state.state);
      setProviderTypeState(state.providerType);
      setCurrentTimeSeconds(state.currentTimeSeconds);
      setDurationSeconds(state.durationSeconds || 180);
      setVolumeState(state.volume);
      setIsMutedState(state.isMuted);
      setErrorDetails(state.error);

      if (state.currentTrack) {
        setCurrentTrack(state.currentTrack);
      }
    });

    // Keyboard listener for Shift+D debug panel
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        setIsDebugPanelOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unsubscribe();
      window.removeEventListener('keydown', handleKeyDown);
      musicPlayerManager.destroy();
    };
  }, []);

  // Save favorites & history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_FAV_TRACKS_KEY, JSON.stringify(favoriteTrackIds));
    } catch (e) {
      console.warn('Could not save favorite tracks:', e);
    }
  }, [favoriteTrackIds]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_FAV_PLAYLISTS_KEY, JSON.stringify(favoritePlaylistIds));
    } catch (e) {
      console.warn('Could not save favorite playlists:', e);
    }
  }, [favoritePlaylistIds]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(listeningHistory.slice(0, 50)));
    } catch (e) {
      console.warn('Could not save listening history:', e);
    }
  }, [listeningHistory]);

  const isPlaying = playbackState === 'PLAYING';
  const isLoading = playbackState === 'LOADING' || playbackState === 'BUFFERING';
  const isUnavailable = playbackState === 'UNAVAILABLE' || playbackState === 'ERROR' || playbackState === 'AUTH_REQUIRED';
  const playbackProgress = durationSeconds > 0 ? (currentTimeSeconds / durationSeconds) * 100 : 0;

  // Actions
  const playTrack = async (track: NostalgiaTrack, playlist?: NostalgiaPlaylist, memoryId?: string) => {
    if (playlist) setActivePlaylist(playlist);
    setIsAutoplayAllowed(true);

    // Record history
    setListeningHistory((prev) => [
      { trackId: track.id, playedAt: Date.now(), memoryId },
      ...prev.filter((h) => h.trackId !== track.id)
    ]);

    await musicPlayerManager.playTrack(track, playlist);
  };

  const togglePlayPause = async () => {
    audioSynthesizer.playClick('switch');
    setIsAutoplayAllowed(true);
    await musicPlayerManager.togglePlayPause();
  };

  const nextTrack = async () => {
    audioSynthesizer.playClick('switch');
    await musicPlayerManager.next();
  };

  const previousTrack = async () => {
    audioSynthesizer.playClick('switch');
    await musicPlayerManager.previous();
  };

  const seekTo = (percent: number) => {
    const clamped = Math.max(0, Math.min(100, percent));
    const targetSec = (durationSeconds * clamped) / 100;
    musicPlayerManager.seek(targetSec);
  };

  const seekToSeconds = (seconds: number) => {
    musicPlayerManager.seek(seconds);
  };

  const setVolume = (vol: number) => {
    musicPlayerManager.setVolume(vol);
  };

  const toggleMute = () => {
    musicPlayerManager.setMute(!isMuted);
  };

  const toggleShuffle = () => {
    audioSynthesizer.playClick('switch');
    const newShuffle = musicPlayerManager.toggleShuffle();
    setIsShuffleState(newShuffle);
    setQueueState([...musicPlayerManager.getQueue()]);
  };

  const toggleRepeat = () => {
    audioSynthesizer.playClick('switch');
    const newRepeat = musicPlayerManager.toggleRepeat();
    setRepeatModeState(newRepeat);
  };

  const switchProvider = async (type: ProviderType) => {
    await musicPlayerManager.switchProvider(type);
  };

  const startRadioUserGesture = async () => {
    setIsAutoplayAllowed(true);
    audioSynthesizer.playClick('switch');
    await musicPlayerManager.togglePlayPause();
  };

  const toggleFavoriteTrack = (trackId: string) => {
    audioSynthesizer.playClick('switch');
    setFavoriteTrackIds((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  };

  const toggleFavoritePlaylist = (playlistId: string) => {
    audioSynthesizer.playClick('switch');
    setFavoritePlaylistIds((prev) =>
      prev.includes(playlistId) ? prev.filter((id) => id !== playlistId) : [...prev, playlistId]
    );
  };

  const setQueue = (tracks: NostalgiaTrack[]) => {
    musicPlayerManager.setQueue(tracks);
    setQueueState([...musicPlayerManager.getQueue()]);
  };

  const addToQueue = (track: NostalgiaTrack) => {
    const currentQ = musicPlayerManager.getQueue();
    if (!currentQ.find((t) => t.id === track.id)) {
      setQueue([...currentQ, track]);
    }
  };

  const removeFromQueue = (trackId: string) => {
    const currentQ = musicPlayerManager.getQueue();
    setQueue(currentQ.filter((t) => t.id !== trackId));
  };

  const playMemoryMix = (memoryId: string) => {
    const matchingTracks = NOSTALGIA_TRACKS.filter((t) => t.memoryIds.includes(memoryId));
    if (matchingTracks.length > 0) {
      setQueue(matchingTracks);
      playTrack(matchingTracks[0], undefined, memoryId);
    } else {
      playTrack(NOSTALGIA_TRACKS[0], undefined, memoryId);
    }
  };

  const triggerDiscoveryMode = () => {
    const randomHostQuote = RADIO_HOST_QUOTES[Math.floor(Math.random() * RADIO_HOST_QUOTES.length)];
    setRadioHostQuote(randomHostQuote);

    let targetTrack = NOSTALGIA_TRACKS[0];
    if (randomHostQuote.suggestedTrackId) {
      const found = NOSTALGIA_TRACKS.find((t) => t.id === randomHostQuote.suggestedTrackId);
      if (found) targetTrack = found;
    } else {
      targetTrack = NOSTALGIA_TRACKS[Math.floor(Math.random() * NOSTALGIA_TRACKS.length)];
    }

    playTrack(targetTrack);
    return {
      memoryId: randomHostQuote.suggestedMemoryId || 'summer-vacation',
      track: targetTrack,
      quote: randomHostQuote
    };
  };

  const getRelatedTracksForMemory = (memoryId: string) => {
    return NOSTALGIA_TRACKS.filter((t) => t.memoryIds.includes(memoryId)).slice(0, 4);
  };

  const testYouTubePlayback = async (videoId: string = 'Umqb9KENgmk') => {
    audioSynthesizer.playClick('switch');
    setProviderTypeState('youtube');
    await musicPlayerManager.switchProvider('youtube');
    const testTrack: NostalgiaTrack = {
      id: `yt-test-${videoId}`,
      title: 'Tum Hi Ho (Official Video)',
      artist: 'Arijit Singh & Mithoon',
      album: 'Barsaat (1995)',
      year: 1995,
      duration: '04:00',
      durationSeconds: 240,
      artwork: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      provider: 'youtube',
      providerTrackId: videoId,
      youtubeId: videoId,
      externalUrl: `https://www.youtube.com/watch?v=${videoId}`,
      playlistIds: ['summer-vacation-mix'],
      memoryIds: [],
      tags: ['test', 'youtube'],
      mood: ['nostalgic'],
      language: 'Hindi'
    };
    setCurrentTrack(testTrack);
    setPlaybackState('LOADING');
    await YouTubePlayer.getInstance().testYouTubePlayback(videoId);
  };

  const openSearchModal = (initialQuery?: string) => {
    audioSynthesizer.playClick('soft');
    setIsSearchModalOpen(true);
  };

  const playCustomYouTubeTrack = async (video: { videoId: string; title: string; channelTitle: string; thumbnail?: string }) => {
    audioSynthesizer.playClick('switch');
    setProviderTypeState('youtube');
    await musicPlayerManager.switchProvider('youtube');

    const customTrack: NostalgiaTrack = {
      id: `yt-custom-${video.videoId}`,
      title: video.title,
      artist: video.channelTitle,
      album: 'YouTube Search Result',
      year: new Date().getFullYear(),
      duration: '04:00',
      durationSeconds: 240,
      artwork: video.thumbnail || `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
      provider: 'youtube',
      providerTrackId: video.videoId,
      youtubeId: video.videoId,
      externalUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
      playlistIds: ['summer-vacation-mix'],
      memoryIds: [],
      tags: ['youtube', 'custom-search'],
      mood: ['nostalgic'],
      language: 'Hindi'
    };

    await playTrack(customTrack);
  };

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        playbackState,
        isPlaying,
        isLoading,
        isUnavailable,
        playbackProgress,
        currentTimeSeconds,
        durationSeconds,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        isFullPlayerOpen,
        isRadioOpen,
        isRadioMinimized,
        isSearchModalOpen,
        setIsSearchModalOpen,
        openSearchModal,
        playCustomYouTubeTrack,
        isSetupModalOpen,
        isDebugPanelOpen,
        isAutoplayAllowed,
        providerType,
        errorDetails,
        activePlaylist,
        queue,
        favoriteTrackIds,
        favoritePlaylistIds,
        listeningHistory,
        radioHostQuote,

        playTrack,
        togglePlayPause,
        nextTrack,
        previousTrack,
        seekTo,
        seekToSeconds,
        setVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        toggleFavoriteTrack,
        toggleFavoritePlaylist,
        setIsFullPlayerOpen,
        setIsRadioOpen,
        setIsRadioMinimized,
        setIsSetupModalOpen,
        setIsDebugPanelOpen,
        switchProvider,
        startRadioUserGesture,
        setQueue,
        addToQueue,
        removeFromQueue,
        playMemoryMix,
        triggerDiscoveryMode,
        getRelatedTracksForMemory,
        testYouTubePlayback
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
