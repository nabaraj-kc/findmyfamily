import React from 'react';
import { useTranslations } from 'next-intl';

interface ReviewStepProps {
  data: any;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ data }) => {
  const t = useTranslations('reportMissing');

  const SummaryItem = ({ label, value }: { label: string, value: string | undefined }) => (
    <div style={{ marginBottom: 'var(--space-4)' }}>
      <dt style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '0.05em' }}>
        {label}
      </dt>
      <dd style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-primary)', fontWeight: 'var(--weight-medium)' }}>
        {value || '—'}
      </dd>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ backgroundColor: 'var(--color-bg-secondary)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-border)' }}>
          Missing Person
        </h3>
        <dl>
          <SummaryItem label={t('fullName')} value={data.fullName} />
          <SummaryItem label={t('age')} value={data.age ? `${data.age} years` : undefined} />
          <SummaryItem label={t('gender')} value={data.gender} />
          <SummaryItem label={t('district')} value={data.district} />
          <SummaryItem label={t('lastSeenLocation')} value={data.lastSeenLocation} />
        </dl>
      </div>

      <div style={{ backgroundColor: 'var(--color-bg-secondary)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-border)' }}>
          Reporter Details
        </h3>
        <dl>
          <SummaryItem label={t('reporterName')} value={data.reporterName} />
          <SummaryItem label={t('reporterPhone')} value={data.reporterPhone} />
          <SummaryItem label={t('relationship')} value={data.relationship} />
        </dl>
      </div>

      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
        Please verify the information above. Submitting this report will make it available to our matching engine and volunteers.
      </p>
    </div>
  );
};
