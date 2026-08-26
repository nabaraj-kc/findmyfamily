'use client';

import React from 'react';
import { usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import styles from './LanguageToggle.module.css';

export const LanguageToggle: React.FC = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'ne' : 'en';
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <button 
      onClick={toggleLanguage}
      className={styles.toggle}
      aria-label="Toggle language between Nepali and English"
    >
      <span className={`${styles.option} ${locale === 'ne' ? styles.active : ''}`}>
        ने
      </span>
      <span className={styles.divider}>/</span>
      <span className={`${styles.option} ${locale === 'en' ? styles.active : ''}`}>
        EN
      </span>
    </button>
  );
};
