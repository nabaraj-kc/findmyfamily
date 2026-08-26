'use client';

import React from 'react';
import { Icon } from '@/components/atoms/Icon/Icon';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

interface PlayerProps {
  variant?: 'compact' | 'floating' | 'inline';
}

export const NepalSolidarityPlayer: React.FC<PlayerProps> = ({ variant = 'inline' }) => {
  const { isPlaying, isMuted, currentTrack, togglePlay, toggleMute, skipNext } = useAudioPlayer();

  // Compact Pill (Used in Navigation Header & Admin Console)
  if (variant === 'compact') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <button
          onClick={togglePlay}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            backgroundColor: isPlaying ? '#ffffff' : '#18181b',
            border: '1px solid #27272a',
            borderRadius: 'var(--radius-full)',
            color: isPlaying ? '#000000' : '#ffffff',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
          title={`${currentTrack.title} — Click to Play/Pause`}
          aria-label={isPlaying ? 'Pause music' : 'Play song'}
        >
          <span style={{ fontSize: '14px' }}>🇳🇵</span>
          {isPlaying ? (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '12px' }}>
              <span style={{ width: '2px', height: '100%', backgroundColor: '#000000', animation: 'eqPulse1 0.6s infinite alternate' }} />
              <span style={{ width: '2px', height: '60%', backgroundColor: '#000000', animation: 'eqPulse2 0.8s infinite alternate' }} />
              <span style={{ width: '2px', height: '85%', backgroundColor: '#000000', animation: 'eqPulse3 0.5s infinite alternate' }} />
            </div>
          ) : (
            <Icon name="VolumeX" size={14} />
          )}
          <span style={{ fontSize: '11px' }}>{isPlaying ? 'Pause Music' : 'Play Song'}</span>
        </button>

        {isPlaying && (
          <button
            onClick={skipNext}
            style={{
              padding: '6px 8px',
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              borderRadius: 'var(--radius-full)',
              color: '#a1a1aa',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Skip to next song (Nepali / Chari)"
          >
            <Icon name="SkipForward" size={12} />
          </button>
        )}
      </div>
    );
  }

  // Floating Corner Badge (Mobile & Desktop Global Playback Bar)
  if (variant === 'floating') {
    return (
      <div 
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px 6px 10px',
          backgroundColor: 'rgba(12, 12, 14, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid #27272a',
          borderRadius: 'var(--radius-full)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
          maxWidth: 'calc(100vw - 40px)',
          cursor: 'pointer'
        }}
        onClick={togglePlay}
      >
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: isPlaying ? '#ffffff' : '#27272a',
          color: isPlaying ? '#000000' : '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Icon name={isPlaying ? 'Pause' : 'Play'} size={12} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '12px' }}>🇳🇵</span>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#ffffff', whiteSpace: 'nowrap' }}>
              {isPlaying ? currentTrack.nepaliTitle : 'गीत सुन्नुहोस्'}
            </span>
          </div>
          <span style={{ fontSize: '9px', color: '#a1a1aa', whiteSpace: 'nowrap' }}>
            {isPlaying ? `${currentTrack.title} (Live)` : 'Click to Play'}
          </span>
        </div>

        {isPlaying && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px', marginLeft: '4px' }}>
            <span style={{ width: '2px', height: '100%', backgroundColor: '#ffffff', animation: 'eqPulse1 0.6s infinite alternate' }} />
            <span style={{ width: '2px', height: '50%', backgroundColor: '#ffffff', animation: 'eqPulse2 0.8s infinite alternate' }} />
            <span style={{ width: '2px', height: '80%', backgroundColor: '#ffffff', animation: 'eqPulse3 0.5s infinite alternate' }} />
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            skipNext();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#a1a1aa',
            cursor: 'pointer',
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Next song"
        >
          <Icon name="SkipForward" size={13} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#a1a1aa',
            cursor: 'pointer',
            padding: '2px 4px'
          }}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          <Icon name={isMuted ? 'VolumeX' : 'Volume2'} size={14} />
        </button>
      </div>
    );
  }

  // Inline Hero / Drawer Card
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 16px',
      backgroundColor: 'rgba(20, 20, 23, 0.85)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      border: '1px solid #27272a',
      borderRadius: 'var(--radius-full)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
      width: '100%',
      maxWidth: '380px',
      justifyContent: 'space-between',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
        <span style={{ fontSize: '18px' }}>🇳🇵</span>
        <div style={{ textAlign: 'left', overflow: 'hidden' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentTrack.nepaliTitle}
            </span>
            {isPlaying && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '10px', flexShrink: 0 }}>
                <span style={{ width: '2px', height: '100%', backgroundColor: '#ffffff', animation: 'eqPulse1 0.6s infinite alternate' }} />
                <span style={{ width: '2px', height: '60%', backgroundColor: '#ffffff', animation: 'eqPulse2 0.8s infinite alternate' }} />
                <span style={{ width: '2px', height: '80%', backgroundColor: '#ffffff', animation: 'eqPulse3 0.5s infinite alternate' }} />
              </div>
            )}
          </div>
          <div style={{ fontSize: '10px', color: '#a1a1aa' }}>
            {isPlaying ? `${currentTrack.title} (${currentTrack.playDuration}s loop)` : 'Click play to listen'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <button
          onClick={togglePlay}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: isPlaying ? '#ffffff' : '#27272a',
            color: isPlaying ? '#000000' : '#ffffff',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          aria-label={isPlaying ? 'Pause song' : 'Play song'}
        >
          <Icon name={isPlaying ? 'Pause' : 'Play'} size={14} />
        </button>

        <button
          onClick={skipNext}
          style={{
            background: 'none',
            border: 'none',
            color: '#a1a1aa',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '4px'
          }}
          title="Next song"
        >
          <Icon name="SkipForward" size={14} />
        </button>

        {isPlaying && (
          <button
            onClick={toggleMute}
            style={{
              background: 'none',
              border: 'none',
              color: '#a1a1aa',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px'
            }}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            <Icon name={isMuted ? 'VolumeX' : 'Volume2'} size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
