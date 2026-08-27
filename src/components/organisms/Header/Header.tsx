'use client';

import React, { useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import styles from './Header.module.css';
import { LanguageToggle } from '../../molecules/LanguageToggle/LanguageToggle';
import { usePreferences } from '@/context/PreferencesContext';
import { Icon } from '../../atoms/Icon/Icon';
import { InstallAppButton } from '../../molecules/InstallAppButton/InstallAppButton';
import { DonationModal } from '../../molecules/DonationModal/DonationModal';


export const Header: React.FC = () => {
  const t = useTranslations('navigation');
  const tCommon = useTranslations('common');
  const { isDataSaver, toggleDataSaver } = usePreferences();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          {/* Logo Area */}
          <div className={styles.logoArea}>
            <Link href="/" className={styles.logo}>
              <span style={{ fontSize: '20px', lineHeight: 1 }}>🇳🇵</span>
              <span className={styles.logoText}>{tCommon('appName')}</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className={styles.desktopNav}>
            <Link href="/report-missing" className={styles.navLink}>{t('reportMissing')}</Link>
            <Link href="/report-found" className={styles.navLink}>{t('reportFound')}</Link>
            <Link href="/cases" className={styles.navLink}>{t('search')}</Link>
            <Link href="/community" className={styles.navLink}>{t('community')}</Link>
            <Link href="/gallery" className={styles.navLink}>{t('gallery')}</Link>
            <Link href="/developers" className={styles.navLink} style={{ color: '#38bdf8' }}>{t('developers')}</Link>
            <Link href="/admin" className={styles.navLink} style={{ color: '#ffffff', fontSize: '13px', fontWeight: 'bold' }}>Admin Console</Link>
          </nav>

          {/* Actions Bar */}
          <div className={styles.actions}>
            {/* Desktop Only: Song Player */}
            <div className={styles.desktopOnlyAction}>

            </div>

            {/* Desktop Only: Download App */}
            <div className={styles.desktopOnlyAction}>
              <InstallAppButton variant="header" />
            </div>

            {/* Desktop Only: Relief Fund QR Trigger */}
            <div className={styles.desktopOnlyAction}>
              <button
                onClick={() => setDonationModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  backgroundColor: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: 'var(--radius-full)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                title="Donate to Prime Minister Disaster Relief Fund"
              >
                <Icon name="Heart" size={14} style={{ color: '#ef4444' }} />
                <span>Relief Fund</span>
              </button>
            </div>

            {/* Desktop Only: Data Saver Toggle */}
            <div className={styles.desktopOnlyAction}>
              <button 
                onClick={toggleDataSaver}
                className={`${styles.actionBtn} ${isDataSaver ? styles.activeDataSaver : ''}`}
                aria-label={t('dataSaver')}
                title={t('dataSaver')}
              >
                <Icon name={isDataSaver ? 'WifiOff' : 'Wifi'} size={18} />
              </button>
            </div>
            
            {/* Language Toggle (Shown on all screen sizes) */}
            <LanguageToggle />
            
            {/* Mobile Menu Hamburger (Visible on mobile only) */}
            <button 
              className={styles.mobileMenuBtn} 
              onClick={toggleMenu} 
              aria-label="Toggle navigation menu"
            >
              <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Menu */}
        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <nav className={styles.mobileNav}>
              <Link href="/report-missing" className={styles.mobileNavLink} onClick={toggleMenu}>{t('reportMissing')}</Link>
              <Link href="/report-found" className={styles.mobileNavLink} onClick={toggleMenu}>{t('reportFound')}</Link>
              <Link href="/cases" className={styles.mobileNavLink} onClick={toggleMenu}>{t('search')}</Link>
              <Link href="/community" className={styles.mobileNavLink} onClick={toggleMenu}>{t('community')}</Link>
              <Link href="/gallery" className={styles.mobileNavLink} onClick={toggleMenu}>{t('gallery')}</Link>
              <Link href="/developers" className={styles.mobileNavLink} onClick={toggleMenu} style={{ color: '#38bdf8' }}>{t('developers')}</Link>
              <Link href="/admin" className={styles.mobileNavLink} onClick={toggleMenu} style={{ fontWeight: 'bold', color: '#ffffff' }}>Admin Console</Link>
              
              <div className={styles.mobileActions}>
                {/* Mobile Nepali Song Player */}


                {/* Mobile Relief Fund Button */}
                <button
                  onClick={() => { setDonationModalOpen(true); toggleMenu(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: 'var(--radius-md)',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  <Icon name="Heart" size={18} style={{ color: '#ef4444' }} />
                  <span>Prime Minister Relief Fund QR</span>
                </button>

                {/* Mobile Install App Button */}
                <InstallAppButton variant="banner" />

                {/* Mobile Data Saver Toggle */}
                <button 
                  onClick={() => { toggleDataSaver(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    backgroundColor: '#141417',
                    border: '1px solid #27272a',
                    borderRadius: 'var(--radius-md)',
                    color: '#ffffff',
                    fontSize: '13px',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon name={isDataSaver ? 'WifiOff' : 'Wifi'} size={18} />
                    <span>Low Data / Offline Mode</span>
                  </div>
                  <span style={{ fontSize: '11px', color: isDataSaver ? '#10b981' : '#71717a', fontWeight: 'bold' }}>
                    {isDataSaver ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Floating Global Audio Player Indicator for Mobile & Desktop */}


      {/* Donation Relief QR Modal */}
      <DonationModal 
        isOpen={donationModalOpen} 
        onClose={() => setDonationModalOpen(false)} 
      />
    </>
  );
};
