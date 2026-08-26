'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export interface Track {
  id: string;
  title: string;
  nepaliTitle: string;
  src: string;
  startOffset: number; // seconds
  playDuration: number; // seconds
}

export const PLAYLIST: Track[] = [
  {
    id: 'charisong',
    title: 'Chari Song Tribute',
    nepaliTitle: 'चरी गीत (राहत धुन)',
    src: '/audio/charisong.mp3',
    startOffset: 25, // starts at 25 seconds
    playDuration: 60 // plays for 1 minute (60 seconds)
  },
  {
    id: 'nepalisong',
    title: 'Nepali Disaster Relief Song',
    nepaliTitle: 'नेपाली राहत तथा ऐक्यबद्धता धुन',
    src: '/audio/nepalisong.mp3',
    startOffset: 0, // starts at 0 seconds
    playDuration: 40 // plays for 40 seconds
  }
];

interface AudioPlayerContextType {
  isPlaying: boolean;
  isMuted: boolean;
  currentTrack: Track;
  togglePlay: () => void;
  toggleMute: () => void;
  play: () => void;
  pause: () => void;
  skipNext: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

// Global singleton audio instance to guarantee ONLY ONE audio stream exists across the whole app
let globalAudioInstance: HTMLAudioElement | null = null;

function getOrCreateGlobalAudio(): HTMLAudioElement {
  if (typeof window === 'undefined') return null as any;
  if (!globalAudioInstance) {
    globalAudioInstance = new Audio();
    globalAudioInstance.volume = 0.65;
    globalAudioInstance.preload = 'auto';
  }
  return globalAudioInstance;
}

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // First track is explicitly charisong (index 0) to play immediately upon website launch
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const userInteractedRef = useRef(false);
  const trackTimeoutRef = useRef<any>(null);
  const currentTrackIndexRef = useRef(0);

  currentTrackIndexRef.current = currentTrackIndex;
  const currentTrack = PLAYLIST[currentTrackIndex];

  const loadAndPlayTrack = (trackIndex: number) => {
    const audio = getOrCreateGlobalAudio();
    if (!audio) return;

    if (trackTimeoutRef.current) {
      clearTimeout(trackTimeoutRef.current);
      trackTimeoutRef.current = null;
    }

    const track = PLAYLIST[trackIndex];
    audio.src = track.src;

    const onLoadedMetadata = () => {
      audio.currentTime = track.startOffset;
      if (isPlaying || !userInteractedRef.current) {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.load();

    // Schedule switch to next track when allocated play duration is reached
    trackTimeoutRef.current = setTimeout(() => {
      switchNextTrack();
    }, track.playDuration * 1000);
  };

  const switchNextTrack = () => {
    const nextIndex = (currentTrackIndexRef.current + 1) % PLAYLIST.length;
    setCurrentTrackIndex(nextIndex);
    loadAndPlayTrack(nextIndex);
  };

  useEffect(() => {
    const audio = getOrCreateGlobalAudio();
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => switchNextTrack();

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    // Initial load: charisong (index 0) starting at 25 seconds
    loadAndPlayTrack(0);

    // Autoplay trigger immediately
    const attemptAutoplay = () => {
      if (userInteractedRef.current) return;
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        const onFirstInteraction = () => {
          if (!userInteractedRef.current) {
            audio.play().then(() => setIsPlaying(true)).catch(() => {});
          }
          cleanupInteractionListeners();
        };

        const cleanupInteractionListeners = () => {
          window.removeEventListener('pointerdown', onFirstInteraction);
          window.removeEventListener('touchstart', onFirstInteraction);
          window.removeEventListener('scroll', onFirstInteraction);
          window.removeEventListener('click', onFirstInteraction);
        };

        window.addEventListener('pointerdown', onFirstInteraction, { once: true });
        window.addEventListener('touchstart', onFirstInteraction, { once: true });
        window.addEventListener('scroll', onFirstInteraction, { once: true });
        window.addEventListener('click', onFirstInteraction, { once: true });
      });
    };

    attemptAutoplay();

    return () => {
      if (trackTimeoutRef.current) {
        clearTimeout(trackTimeoutRef.current);
      }
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const play = () => {
    userInteractedRef.current = false;
    const audio = getOrCreateGlobalAudio();
    if (audio) {
      audio.play().then(() => setIsPlaying(true)).catch(console.warn);
    }
  };

  const pause = () => {
    userInteractedRef.current = true; // explicitly marked as user stopped
    if (trackTimeoutRef.current) {
      clearTimeout(trackTimeoutRef.current);
      trackTimeoutRef.current = null;
    }
    const audio = getOrCreateGlobalAudio();
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    const audio = getOrCreateGlobalAudio();
    if (!audio) return;

    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const toggleMute = () => {
    const audio = getOrCreateGlobalAudio();
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const skipNext = () => {
    switchNextTrack();
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        isPlaying,
        isMuted,
        currentTrack,
        togglePlay,
        toggleMute,
        play,
        pause,
        skipNext
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
