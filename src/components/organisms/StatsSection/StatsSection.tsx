import React from 'react';
import { useTranslations } from 'next-intl';
import styles from './StatsSection.module.css';
import { StatsCounter } from '../../molecules/StatsCounter/StatsCounter';
import { Container } from '../../layout/Container/Container';
import { Icon } from '../../atoms/Icon/Icon';

export const StatsSection: React.FC = () => {
  const t = useTranslations('homepage');

  return (
    <section className={styles.section}>
      <Container size="lg">
        <div className={styles.grid}>
          <StatsCounter
            value={142}
            label={t('statsActive')}
            icon={<Icon name="AlertCircle" size={24} />}
          />
          <StatsCounter
            value={38}
            label={t('statsResolved')}
            icon={<Icon name="HeartHandshake" size={24} />}
          />
          <StatsCounter
            value={180}
            label={t('statsTotal')}
            icon={<Icon name="FileText" size={24} />}
          />
        </div>
      </Container>
    </section>
  );
};
