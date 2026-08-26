import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import styles from './Footer.module.css';
import { EMERGENCY_HOTLINES } from '@/constants';
import { Container } from '../../layout/Container/Container';
import { Icon } from '../../atoms/Icon/Icon';

export const Footer: React.FC = () => {
  const t = useTranslations();
  
  return (
    <footer className={styles.footer}>
      <Container size="lg">
        <div className={styles.grid}>
          {/* Emergency Hotlines */}
          <div className={styles.emergencySection}>
            <h3 className={styles.title}>
              <Icon name="PhoneAlert" size={20} className={styles.titleIcon} />
              {t('emergency.title')}
            </h3>
            <p className={styles.subtitle}>{t('emergency.subtitle')}</p>
            
            <ul className={styles.hotlineList}>
              {EMERGENCY_HOTLINES.map((hotline) => (
                <li key={hotline.number} className={styles.hotlineItem}>
                  <span className={styles.hotlineName}>{t(hotline.nameKey)}</span>
                  <a href={`tel:${hotline.number}`} className={styles.hotlineNumber}>
                    {hotline.number}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div className={styles.linksSection}>
            <div className={styles.linksGroup}>
              <h4 className={styles.groupTitle}>Find My Family</h4>
              <ul className={styles.linkList}>
                <li><Link href="/" className={styles.link}>{t('navigation.home')}</Link></li>
                <li><Link href="/report-missing" className={styles.link}>{t('navigation.reportMissing')}</Link></li>
                <li><Link href="/report-found" className={styles.link}>{t('navigation.reportFound')}</Link></li>
                <li><Link href="/cases" className={styles.link}>{t('navigation.search')}</Link></li>
                <li><Link href="/gallery" className={styles.link}>{t('navigation.gallery')}</Link></li>
                <li><Link href="/community" className={styles.link}>{t('navigation.community')}</Link></li>
              </ul>
            </div>
            
            <div className={styles.linksGroup}>
              <h4 className={styles.groupTitle}>{t('navigation.about')}</h4>
              <ul className={styles.linkList}>
                <li><Link href="/about" className={styles.link}>{t('footer.about')}</Link></li>
                <li><Link href="/how-it-works" className={styles.link}>{t('footer.howItWorks')}</Link></li>
                <li><Link href="/privacy" className={styles.link}>{t('footer.privacy')}</Link></li>
                <li><a href="mailto:contact@findmyfamily.gov.np" className={styles.link}>{t('footer.contact')}</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} {t('common.appName')}. {t('footer.madeWith')}.
          </p>
        </div>
      </Container>
    </footer>
  );
};
