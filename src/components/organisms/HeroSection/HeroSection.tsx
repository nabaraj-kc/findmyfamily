'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import styles from './HeroSection.module.css';
import btnStyles from '../../atoms/Button/Button.module.css';
import { Icon } from '../../atoms/Icon/Icon';
import { usePreferences } from '@/context/PreferencesContext';
import { ExportDataModal } from '../../molecules/ExportDataModal/ExportDataModal';
import { DonationModal } from '../../molecules/DonationModal/DonationModal';

export const HeroSection: React.FC = () => {
  const t = useTranslations('homepage');
  const { isDataSaver } = usePreferences();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  return (
    <>
      <section className={`${styles.hero} ${isDataSaver ? styles.dataSaver : ''}`}>
        {/* Animated Flowing Nepal National Flag Background */}
        <div className={styles.flagBackgroundWrapper}>
          <div className={styles.flagWaving} />
          <div className={styles.flagWindOverlay} />
        </div>
        <div className={styles.darkVignette} />
        
        <div className={styles.container}>
          <div className={styles.content}>
            {/* Top National Portal Badge */}
            <div className={styles.portalBadge}>
              <span>🇳🇵</span>
              <span>नेपाल राष्ट्रिय विपद् तथा पारिवारिक पुनर्मिलन पोर्टल</span>
            </div>

            {/* Main Headline */}
            <h1 className={styles.title}>{t('heroTitle')}</h1>
            
            {/* Subtitle */}
            <p className={styles.subtitle}>{t('heroSubtitle')}</p>
            
            {/* Primary Action Buttons (Missing vs Found) */}
            <div className={styles.actions}>
              <Link 
                href="/report-missing" 
                className={`${btnStyles.button} ${btnStyles['variant-primary']} ${btnStyles['size-lg']}`}
                style={{ textDecoration: 'none', width: '100%', justifyContent: 'center' }}
              >
                <span className={btnStyles.iconLeft}>
                  <Icon name="Search" />
                </span>
                <span className={btnStyles.content}>{t('reportMissingCta')}</span>
              </Link>
              
              <Link 
                href="/report-found" 
                className={`${btnStyles.button} ${btnStyles['variant-secondary']} ${btnStyles['size-lg']}`}
                style={{ textDecoration: 'none', width: '100%', justifyContent: 'center' }}
              >
                <span className={btnStyles.iconLeft}>
                  <Icon name="HeartHandshake" />
                </span>
                <span className={btnStyles.content}>{t('reportFoundCta')}</span>
              </Link>
            </div>

            {/* Secondary Utility Row (Export Dataset & Relief QR) */}
            <div className={styles.utilityRow}>
              <button
                onClick={() => setIsExportOpen(true)}
                className={styles.utilityBtn}
                title="Export missing/found dataset as CSV, JSON, or PDF"
              >
                <Icon name="DownloadCloud" size={14} style={{ color: '#a1a1aa' }} />
                <span>Export Dataset</span>
              </button>

              <button
                onClick={() => setIsDonationOpen(true)}
                className={styles.utilityBtn}
                title="View PM Disaster Relief Fund Official QR"
              >
                <Icon name="Heart" size={14} style={{ color: '#ef4444' }} />
                <span>PM Relief Fund QR</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <ExportDataModal 
        isOpen={isExportOpen} 
        onClose={() => setIsExportOpen(false)} 
      />

      <DonationModal 
        isOpen={isDonationOpen} 
        onClose={() => setIsDonationOpen(false)} 
      />
    </>
  );
};
