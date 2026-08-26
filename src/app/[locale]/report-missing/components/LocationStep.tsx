import React from 'react';
import { useTranslations } from 'next-intl';
import { TextArea } from '@/components/atoms/TextArea/TextArea';
import { Input } from '@/components/atoms/Input/Input';
import { FormField } from '@/components/molecules/FormField/FormField';
import { ALL_DISTRICTS } from '@/constants';

interface LocationStepProps {
  data: any;
  updateData: (fields: Partial<any>) => void;
}

export const LocationStep: React.FC<LocationStepProps> = ({ data, updateData }) => {
  const t = useTranslations('reportMissing');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <p style={{ color: '#a1a1aa' }}>
        {t('locationDesc')}
      </p>

      <FormField label={t('district')} required>
        <select 
          value={data.district || '1'}
          onChange={(e) => updateData({ district: e.target.value })}
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
          {ALL_DISTRICTS.map(d => (
            <option key={d.id} value={d.id} style={{ backgroundColor: '#141417', color: '#ffffff' }}>
              {d.nameEn} ({d.nameNe})
            </option>
          ))}
        </select>
      </FormField>

      <FormField label={t('lastSeenLocation')} required>
        <TextArea 
          value={data.lastSeenLocation || ''}
          onChange={(e) => updateData({ lastSeenLocation: e.target.value })}
          placeholder={t('lastSeenLocationPlaceholder')}
          rows={3}
        />
      </FormField>

      <FormField label={t('lastSeenDate')} required>
        <Input 
          type="date"
          value={data.lastSeenDate || ''}
          onChange={(e) => updateData({ lastSeenDate: e.target.value })}
        />
      </FormField>
    </div>
  );
};
