'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/atoms/Button/Button';
import { Icon } from '@/components/atoms/Icon/Icon';
import styles from './Gallery.module.css';

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  source: string;
  createdAt?: string;
  date?: string;
}

export const GalleryClient: React.FC = () => {
  const t = useTranslations('gallery');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [caption, setCaption] = useState('');

  // Fetch images from persistent SQLite database
  const fetchImages = async () => {
    try {
      const res = await fetch('/api/gallery', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setImages(data.images || []);
      }
    } catch (e) {
      console.warn('Failed to load gallery images:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // In web demo, convert file to data URL / object URL and persist to SQLite
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Url = reader.result as string;
        const res = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: {
              url: base64Url,
              caption: caption || 'Community uploaded evidence',
              source: 'Community Member'
            }
          })
        });
        const data = await res.json();
        if (data.success && data.image) {
          setImages(prev => [data.image, ...prev]);
          setCaption('');
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Upload failed:', err);
      setIsUploading(false);
    } finally {
      e.target.value = '';
    }
  };


  return (
    <Section padding="lg">
      <Container size="lg">
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>{t('title')}</h1>
            <p className={styles.subtitle}>{t('subtitle')}</p>
          </div>
          
          <div className={styles.uploadSection}>
            <input 
              type="text" 
              placeholder={t('captionPlaceholder')} 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className={styles.captionInput}
            />
            <input 
              type="file" 
              id="gallery-upload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <Button 
              variant="primary" 
              onClick={() => document.getElementById('gallery-upload')?.click()}
              loading={isUploading}
              icon={<Icon name="Camera" />}
            >
              {t('uploadBtn')}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: '#71717a' }}>
            <Icon name="Loader2" size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 8px' }} />
            <p>Loading verified disaster photos...</p>
          </div>
        ) : images.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-12)',
            backgroundColor: '#111113',
            borderRadius: 'var(--radius-xl)',
            border: '1px dashed #27272a',
            color: '#71717a'
          }}>
            <Icon name="Image" size={40} style={{ margin: '0 auto 12px', color: '#52525b' }} />
            <p style={{ fontSize: 'var(--text-md)', fontWeight: 'bold', color: '#ffffff' }}>No gallery photos</p>
            <p style={{ fontSize: 'var(--text-sm)' }}>Upload disaster impact photos above to share verified situational evidence.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {images.map((img) => (
              <div 
                key={img.id} 
                className={styles.card}
                style={{ position: 'relative' }}
              >

                <div className={styles.imageWrapper}>
                  <img src={img.url} alt={img.caption || 'Disaster photo'} className={styles.image} loading="lazy" />
                </div>
                <div className={styles.cardContent}>
                  <p className={styles.caption}>{img.caption}</p>
                  <div className={styles.meta}>
                    <span className={styles.source}>
                      <Icon name="ShieldCheck" size={14} className={styles.verifiedIcon} />
                      {img.source || 'Verified Source'}
                    </span>
                    <span className={styles.date}>{img.createdAt || img.date || 'Recent'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
};
