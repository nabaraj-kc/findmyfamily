import React from 'react';
import { useTranslations } from 'next-intl';
import { Container, Section } from '@/components/layout';

export default function PrivacyPage() {
  const t = useTranslations('privacy');

  return (
    <Section padding="lg">
      <Container size="sm">
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-4)' }}>
          {t('title')}
        </h1>
        <p style={{ fontSize: 'var(--text-md)', lineHeight: 1.6, color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap' }}>
          {t('content')}
        </p>
      </Container>
    </Section>
  );
}
