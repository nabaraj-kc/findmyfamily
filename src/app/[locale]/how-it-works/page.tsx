import React from 'react';
import { useTranslations } from 'next-intl';
import { Container, Section } from '@/components/layout';

export default function HowItWorksPage() {
  const t = useTranslations('howItWorks');

  return (
    <Section padding="lg">
      <Container size="sm">
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-6)' }}>
          {t('title')}
        </h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div>
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-2)' }}>
              {t('step1Title')}
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{t('step1Desc')}</p>
          </div>
          
          <div>
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-2)' }}>
              {t('step2Title')}
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{t('step2Desc')}</p>
          </div>
          
          <div>
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-2)' }}>
              {t('step3Title')}
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{t('step3Desc')}</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
