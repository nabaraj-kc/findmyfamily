import React from 'react';
import { getTranslations } from 'next-intl/server';
import styles from './StatsSection.module.css';
import { StatsCounter } from '../../molecules/StatsCounter/StatsCounter';
import { Container } from '../../layout/Container/Container';
import { Icon } from '../../atoms/Icon/Icon';
import { getDashboardMetrics } from '@/lib/db/database';

export const StatsSection = async () => {
  const t = await getTranslations('homepage');
  const metrics = await getDashboardMetrics();

  return (
    <section className={styles.section}>
      <Container size="lg">
        <div className={styles.grid}>
          <StatsCounter
            value={metrics.totalMissing}
            label={t('statsActive')}
            icon={<Icon name="AlertCircle" size={24} />}
          />
          <StatsCounter
            value={metrics.totalFound}
            label={t('statsResolved')}
            icon={<Icon name="HeartHandshake" size={24} />}
          />
          <StatsCounter
            value={metrics.totalMissing + metrics.totalFound}
            label={t('statsTotal')}
            icon={<Icon name="FileText" size={24} />}
          />
        </div>
      </Container>
    </section>
  );
};
