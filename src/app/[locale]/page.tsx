import React from 'react';
import { HeroSection, HomeSearch, StatsSection } from '@/components/organisms';
import { Container, Section } from '@/components/layout';
import { DisasterImageCarousel } from '@/components/molecules/DisasterImageCarousel/DisasterImageCarousel';
import { DisasterVideoPlayer } from '@/components/molecules/DisasterVideoPlayer/DisasterVideoPlayer';
import { Icon } from '@/components/atoms/Icon/Icon';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      
      <HomeSearch />

      {/* Ground Situation & Live Stream Section on Scroll Down */}
      <Section padding="lg">
        <Container size="lg">
          <div style={{ marginBottom: 'var(--space-8)', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 14px',
              backgroundColor: '#141417',
              border: '1px solid #27272a',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: 'var(--space-3)'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <span>प्रत्यक्ष स्थलगत स्थिति तथा भिडियो फुटेज</span>
            </div>
            
            <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 'bold', color: '#ffffff', marginBottom: 'var(--space-2)' }}>
              Live Disaster Field Media & Surveillance
            </h2>
            <p style={{ color: '#a1a1aa', maxWidth: '680px', margin: '0 auto', fontSize: 'var(--text-sm)' }}>
              Real-time ground photography from flood-affected corridors alongside live stream surveillance to aid identification and emergency search & rescue teams.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-8)',
            alignItems: 'start'
          }}>
            {/* 1. Animated Flood Disaster Image Loop Carousel */}
            <div>
              <DisasterImageCarousel />
            </div>

            {/* 2. Embedded Live HLS Video Stream */}
            <div>
              <DisasterVideoPlayer />
            </div>
          </div>
        </Container>
      </Section>

      <StatsSection />
    </>
  );
}
