import React from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/atoms/Input/Input';
import { FormField } from '@/components/molecules/FormField/FormField';

interface ReporterStepProps {
  data: any;
  updateData: (fields: Partial<any>) => void;
}

export const ReporterStep: React.FC<ReporterStepProps> = ({ data, updateData }) => {
  const t = useTranslations('reportMissing');

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

      <FormField label={t('relationship')} required>
        <select 
          value={data.relationship || 'parent'}
          onChange={(e) => updateData({ relationship: e.target.value })}
          style={{
            width: '100%',
            minHeight: '44px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #27272a',
            backgroundColor: '#141417',
            color: '#ffffff',
            fontFamily: 'inherit',
            fontSize: 'var(--text-base)'
          }}
        >
          <option value="parent" style={{ backgroundColor: '#141417', color: '#ffffff' }}>Parent</option>
          <option value="child" style={{ backgroundColor: '#141417', color: '#ffffff' }}>Child</option>
          <option value="sibling" style={{ backgroundColor: '#141417', color: '#ffffff' }}>Sibling</option>
          <option value="spouse" style={{ backgroundColor: '#141417', color: '#ffffff' }}>Spouse</option>
          <option value="friend" style={{ backgroundColor: '#141417', color: '#ffffff' }}>Friend / Neighbor</option>
          <option value="volunteer" style={{ backgroundColor: '#141417', color: '#ffffff' }}>Volunteer / Rescue Team</option>
          <option value="other" style={{ backgroundColor: '#141417', color: '#ffffff' }}>Other</option>
        </select>
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
