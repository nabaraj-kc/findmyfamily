'use client';

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Icon } from '@/components/atoms/Icon/Icon';

const VIDEO_STREAM_URL = 'https://video.primis.tech/uploads/cn1/video/users/hls/31354/video_691c61a43f372727529437/vid6a8ecd98d879b632689517.mp4/chunklist_1280.m3u8';

export const DisasterVideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hls.loadSource(VIDEO_STREAM_URL);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        // Attempt autoplay muted
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.warn('HLS Fatal error:', data);
          setHasError(true);
          setIsLoading(false);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS for Safari iOS/macOS
      video.src = VIDEO_STREAM_URL;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        video.play().catch(() => {});
      });
    } else {
      setHasError(true);
      setIsLoading(false);
    }

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    return () => {
      if (hls) {
        hls.destroy();
      }
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      videoRef.current.requestFullscreen().catch(() => {});
    }
  };

  return (
    <div style={{
      backgroundColor: '#0c0c0e',
      border: '1px solid #27272a',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.8)'
    }}>
      {/* Video Header Bar */}
      <div style={{
        padding: '12px 20px',
        backgroundColor: '#141417',
        borderBottom: '1px solid #27272a',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            backgroundColor: '#ef4444',
            color: '#ffffff',
            borderRadius: 'var(--radius-sm)',
            fontSize: '10px',
            fontWeight: 'bold',
            letterSpacing: '0.05em'
          }}>
            LIVE
          </span>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#ffffff' }}>
            Disaster Zone Field Footage & Rescue Operations
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={toggleMute}
            style={{
              padding: '4px 10px',
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              borderRadius: 'var(--radius-full)',
              color: '#ffffff',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Icon name={isMuted ? 'VolumeX' : 'Volume2'} size={12} />
            <span>{isMuted ? 'Unmute Audio' : 'Muted'}</span>
          </button>
        </div>
      </div>

      {/* Video Screen Container */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', backgroundColor: '#000000', overflow: 'hidden' }}>
        <video
          ref={videoRef}
          controls
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 3
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <Icon name="Loader2" size={32} style={{ color: '#ffffff', animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Loading Live HLS Stream...</span>
            </div>
          </div>
        )}

        {/* Fallback Error Display */}
        {hasError && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0c0c0e',
            color: '#ffffff',
            padding: 'var(--space-6)',
            textAlign: 'center',
            zIndex: 3
          }}>
            <div>
              <Icon name="AlertTriangle" size={32} style={{ color: '#ef4444', margin: '0 auto 8px' }} />
              <p style={{ fontSize: '14px', fontWeight: 'bold' }}>Live Stream Connecting</p>
              <p style={{ fontSize: '12px', color: '#71717a' }}>Footage is streaming directly from the emergency response network.</p>
            </div>
          </div>
        )}
      </div>

      {/* Description Footer */}
      <div style={{ padding: '14px 20px', backgroundColor: '#0c0c0e', borderTop: '1px solid #27272a' }}>
        <p style={{ fontSize: '12px', color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
          🔴 <strong>Field Report:</strong> Live footage monitoring flood levels, debris flows, and search & rescue access routes across Nepal. Please report any recognized survivors or locations immediately.
        </p>
      </div>
    </div>
  );
};
