import React from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/atoms/Input/Input';
import { FormField } from '@/components/molecules/FormField/FormField';

interface ReporterStepProps {
  data: any;
  updateData: (fields: Partial<any>) => void;
}

export const ReporterStep: React.FC<ReporterStepProps> = ({ data, updateData }) => {
  const t = useTranslations('reportFound');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <p style={{ color: '#a1a1aa' }}>
        {t('reporterDesc')}
      </p>

      <FormField label={t('reporterName')} required>
        <Input 
          value={data.reporterName || ''}
          onChange={(e) => updateData({ reporterName: e.target.value })}
          placeholder={t('reporterNamePlaceholder')}
        />
      </FormField>

      <FormField label={t('reporterPhone')} required>
        <Input 
          type="tel"
          value={data.reporterPhone || ''}
          onChange={(e) => updateData({ reporterPhone: e.target.value })}
          placeholder="+977 98XXXXXXXX"
        />
      </FormField>

      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        gap: 'var(--space-3)', 
        marginTop: 'var(--space-4)',
        padding: 'var(--space-4)',
        backgroundColor: '#141417',
        borderRadius: 'var(--radius-md)',
        border: '1px solid #27272a'
      }}>
        <input 
          type="checkbox" 
          id="privacy" 
          checked={data.privacyConsent !== false}
          onChange={(e) => updateData({ privacyConsent: e.target.checked })}
          style={{ marginTop: '4px', width: '18px', height: '18px', accentColor: '#ffffff' }}
        />
        <label htmlFor="privacy" style={{ fontSize: 'var(--text-sm)', color: '#ffffff', lineHeight: 1.5, cursor: 'pointer' }}>
          {t('privacyConsentText')}
        </label>
      </div>
    </div>
  );
};
