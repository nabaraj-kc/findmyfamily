import React from 'react';
import { useTranslations } from 'next-intl';

interface ReviewStepProps {
  data: any;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ data }) => {
  const t = useTranslations('reportFound');

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
      
      {/* Highlighted Status Block */}
      <div style={{ 
        backgroundColor: data.status === 'deceased' ? 'var(--color-slate-100)' : data.status === 'injured' ? 'var(--color-warning-muted)' : 'rgba(61, 153, 112, 0.1)', 
        padding: 'var(--space-6)', 
        borderRadius: 'var(--radius-lg)',
        border: `1px solid ${data.status === 'deceased' ? 'var(--color-slate-300)' : data.status === 'injured' ? 'var(--color-warning)' : 'var(--color-success)'}`
      }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>
          Status: {data.status ? data.status.charAt(0).toUpperCase() + data.status.slice(1) : 'Unknown'}
        </h3>
        {data.status === 'deceased' && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate-700)', marginTop: 'var(--space-2)' }}>
            Note: For sensitivity and privacy, deceased reports are routed directly to officials and are not published publicly.
          </p>
        )}
      </div>

      <div style={{ backgroundColor: 'var(--color-bg-secondary)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-border)' }}>
          Found Person Details
        </h3>
        <dl>
          <SummaryItem label={t('approximateName')} value={data.fullName} />
          <SummaryItem label={t('approximateAge')} value={data.age ? `${data.age} years` : undefined} />
          <SummaryItem label={t('gender')} value={data.gender} />
          <SummaryItem label={t('district')} value={data.district} />
          <SummaryItem label={t('foundLocation')} value={data.foundLocation} />
          <SummaryItem label={t('foundDate')} value={data.foundDate} />
        </dl>
      </div>

      <div style={{ backgroundColor: 'var(--color-bg-secondary)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-border)' }}>
          Reporter Details
        </h3>
        <dl>
          <SummaryItem label={t('reporterName')} value={data.reporterName} />
          <SummaryItem label={t('reporterPhone')} value={data.reporterPhone} />
        </dl>
      </div>
    </div>
  );
};
