import React from 'react';
import { useTranslations } from 'next-intl';
import { Icon } from '@/components/atoms/Icon/Icon';

interface StatusStepProps {
  data: any;
  updateData: (fields: Partial<any>) => void;
}

export const StatusStep: React.FC<StatusStepProps> = ({ data, updateData }) => {
  const t = useTranslations('reportFound');

  const options = [
    { id: 'safe', label: t('statusSafe'), description: t('statusSafeDesc'), icon: 'CheckCircle', color: 'var(--color-success)', bgSelected: 'rgba(61, 153, 112, 0.08)' },
    { id: 'injured', label: t('statusInjured'), description: t('statusInjuredDesc'), icon: 'AlertTriangle', color: 'var(--color-warning)', bgSelected: 'rgba(217, 119, 6, 0.08)' },
    { id: 'deceased', label: t('statusDeceased'), description: t('statusDeceasedDesc'), icon: 'Info', color: 'var(--color-slate-600)', bgSelected: 'rgba(71, 85, 105, 0.08)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
        {t('statusStepDesc')}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {options.map(option => {
          const isSelected = data.status === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => updateData({ status: option.id })}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-4)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                border: `2px solid ${isSelected ? option.color : 'var(--color-border)'}`,
                backgroundColor: isSelected ? option.bgSelected : 'var(--color-bg-primary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--duration-fast) var(--ease-default)'
              }}
            >
              <div style={{ marginTop: '2px' }}>
                <Icon name={option.icon} size={24} style={{ color: option.color }} />
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-primary)' }}>
                  {option.label}
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
