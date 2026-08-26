import React, { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/atoms/Input/Input';
import { FormField } from '@/components/molecules/FormField/FormField';
import { Icon } from '@/components/atoms/Icon/Icon';

interface BasicDetailsStepProps {
  data: any;
  updateData: (fields: Partial<any>) => void;
}

export const BasicDetailsStep: React.FC<BasicDetailsStepProps> = ({ data, updateData }) => {
  const t = useTranslations('reportMissing');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        updateData({ photoUrl: uploadEvent.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <p style={{ color: '#a1a1aa' }}>
        {t('basicDetailsDesc')}
      </p>

      {/* Photo Upload Area */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        style={{ display: 'none' }} 
        onChange={handlePhotoSelect} 
      />

      <div 
        onClick={() => fileInputRef.current?.click()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: data.photoUrl ? 'var(--space-4)' : 'var(--space-8)',
          border: '1px dashed #27272a',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: '#141417',
          cursor: 'pointer',
          transition: 'all var(--duration-fast) ease'
        }}
      >
        {data.photoUrl ? (
          <div style={{ textAlign: 'center' }}>
            <img 
              src={data.photoUrl} 
              alt="Preview" 
              style={{ maxHeight: '160px', borderRadius: 'var(--radius-md)', objectFit: 'cover', margin: '0 auto var(--space-2)' }} 
            />
            <p style={{ color: '#ffffff', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>
              Click to change photo
            </p>
          </div>
        ) : (
          <>
            <Icon name="Camera" size={28} style={{ color: '#71717a', marginBottom: 'var(--space-2)' }} />
            <span style={{ color: '#a1a1aa', fontSize: 'var(--text-sm)' }}>
              Tap to upload a recent photo (Optional)
            </span>
          </>
        )}
      </div>

      <FormField label={t('fullName')} required>
        <Input 
          value={data.fullName || ''}
          onChange={(e) => updateData({ fullName: e.target.value })}
          placeholder={t('fullNamePlaceholder')}
        />
      </FormField>

      <FormField label={t('nickname')}>
        <Input 
          value={data.nickname || ''}
          onChange={(e) => updateData({ nickname: e.target.value })}
          placeholder={t('nicknamePlaceholder')}
        />
      </FormField>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <FormField label={t('age')} required>
          <Input 
            type="number"
            value={data.age || ''}
            onChange={(e) => updateData({ age: e.target.value })}
            placeholder="e.g. 34"
          />
        </FormField>

        <FormField label={t('gender')} required>
          <select 
            value={data.gender || 'male'}
            onChange={(e) => updateData({ gender: e.target.value })}
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
            <option value="male" style={{ backgroundColor: '#141417', color: '#ffffff' }}>Male</option>
            <option value="female" style={{ backgroundColor: '#141417', color: '#ffffff' }}>Female</option>
            <option value="other" style={{ backgroundColor: '#141417', color: '#ffffff' }}>Other</option>
          </select>
        </FormField>
      </div>
    </div>
  );
};
