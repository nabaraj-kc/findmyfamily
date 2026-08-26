'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import styles from './RotatingAlert.module.css';
import { Icon } from '../../atoms/Icon/Icon';

export const RotatingAlert: React.FC = () => {
  const t = useTranslations('emergencyAlerts');
  
  const messages = [
    { text: t('safeMessage'), icon: 'AlertTriangle' },
    { text: t('emergencyNumbers'), icon: 'PhoneAlert' },
    { text: t('pmReliefFund'), icon: 'HeartHandshake' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 5000); // 5 seconds
    
    return () => clearInterval(interval);
  }, [messages.length]);

  const currentMessage = messages[currentIndex];

  return (
    <div className={styles.alertContainer} role="alert">
      <div key={currentIndex} className={styles.messageWrapper}>
        <Icon name={currentMessage.icon as any} size={18} className={styles.icon} />
        <span className={styles.message}>{currentMessage.text}</span>
      </div>
    </div>
  );
};
