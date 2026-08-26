'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Icon } from '@/components/atoms/Icon/Icon';

interface DisasterSlide {
  src: string;
  title: string;
  titleNe: string;
  location: string;
  description: string;
}

const DISASTER_SLIDES: DisasterSlide[] = [
  {
    src: '/images/disaster/flood-1.png',
    title: 'Rasuwa Valley Flood Wave & Landslide',
    titleNe: 'रसुवा बाढी तथा पहिरो प्रभाव',
    location: 'Rasuwa, Bhote Koshi Corridor',
    description: 'Sudden flash flood surge carrying debris and boulders across transportation routes.'
  },
  {
    src: '/images/disaster/flood-2.png',
    title: 'Himalayan Ridge Slope Collapse',
    titleNe: 'पहिरोले थुनिएको नदी क्षेत्र',
    location: 'Upper Mountain River Basin',
    description: 'Massive landslide blocking natural river channels creating critical upstream flooding.'
  },
  {
    src: '/images/disaster/flood-3.png',
    title: 'Melamchi Settlement & Bridge Inundation',
    titleNe: 'मेलम्ची बजार र पुल क्षेत्रको बाढी',
    location: 'Melamchi River Crossing',
    description: 'Raging torrent waters cutting off critical bridge access to residential communities.'
  },
  {
    src: '/images/disaster/flood-4.jpg',
    title: 'Aerial View of Submerged Settlements',
    titleNe: 'बाढीले पुरेका बस्तीहरूको हवाई दृश्य',
    location: 'Downstream Inundation Zone',
    description: 'Extensive silt and mud deposits submerging homes and community infrastructure.'
  }
];

export const DisasterImageCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DISASTER_SLIDES.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + DISASTER_SLIDES.length) % DISASTER_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % DISASTER_SLIDES.length);
  };

  const current = DISASTER_SLIDES[currentIndex];

  return (
    <div 
      style={{
        backgroundColor: '#0c0c0e',
        border: '1px solid #27272a',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.8)',
        position: 'relative'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header Bar */}
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
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#ffffff', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Live Ground Situation & Flood Impact
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: '#a1a1aa' }}>
            {currentIndex + 1} / {DISASTER_SLIDES.length}
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={handlePrev}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#18181b',
                border: '1px solid #27272a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Previous image"
            >
              <Icon name="ChevronLeft" size={14} />
            </button>
            <button
              onClick={handleNext}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#18181b',
                border: '1px solid #27272a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Next image"
            >
              <Icon name="ChevronRight" size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Image Stage */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '380px',
        maxHeight: '55vh',
        backgroundColor: '#000000',
        overflow: 'hidden'
      }}>
        {DISASTER_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.src}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: isActive ? 1 : 0,
                transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: isActive ? 1 : 0,
                pointerEvents: isActive ? 'auto' : 'none'
              }}
            >
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                priority={idx === 0}
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                  transform: isActive ? 'scale(1.03)' : 'scale(1)',
                  transition: 'transform 5s ease-out',
                  filter: 'contrast(1.08) brightness(0.92)'
                }}
                sizes="(max-width: 768px) 100vw, 900px"
              />
              {/* Bottom Gradient for Text Legibility */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.1) 70%, transparent 100%)'
              }} />
            </div>
          );
        })}

        {/* Floating Slide Details */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px 24px',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Icon name="MapPin" size={14} style={{ color: '#ef4444' }} />
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#d4d4d8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {current.location}
              </span>
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: '#ffffff', marginBottom: '2px', lineHeight: 1.25 }}>
              {current.title}
            </h3>
            <p style={{ fontSize: '12px', color: '#a1a1aa', lineHeight: 1.4, margin: 0 }}>
              {current.titleNe} • {current.description}
            </p>
          </div>

          {/* Dots Indicator */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {DISASTER_SLIDES.map((_, i) => (
              <button
                key={`dot-${i}`}
                onClick={() => setCurrentIndex(i)}
                style={{
                  width: i === currentIndex ? '24px' : '8px',
                  height: '6px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: i === currentIndex ? '#ffffff' : '#3f3f46',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s ease'
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
