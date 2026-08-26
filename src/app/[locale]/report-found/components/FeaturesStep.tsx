import React from 'react';
import { useTranslations } from 'next-intl';
import { TextArea } from '@/components/atoms/TextArea/TextArea';
import { FormField } from '@/components/molecules/FormField/FormField';

interface FeaturesStepProps {
  data: any;
  updateData: (fields: Partial<any>) => void;
}

export const FeaturesStep: React.FC<FeaturesStepProps> = ({ data, updateData }) => {
  const t = useTranslations('reportFound');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <p style={{ color: 'var(--color-text-secondary)' }}>
        {t('featuresDesc')}
      </p>

      <FormField label={t('distinguishingFeatures')}>
        <TextArea 
          value={data.features || ''}
          onChange={(e) => updateData({ features: e.target.value })}
          placeholder={t('featuresPlaceholder')}
          rows={4}
        />
      </FormField>

      <FormField label={t('clothing')}>
        <TextArea 
          value={data.clothing || ''}
          onChange={(e) => updateData({ clothing: e.target.value })}
          placeholder={t('clothingPlaceholder')}
          rows={3}
        />
      </FormField>
    </div>
  );
};
