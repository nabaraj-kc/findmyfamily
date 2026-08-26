'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/atoms/Icon/Icon';
import { Button } from '@/components/atoms/Button/Button';
import { Input } from '@/components/atoms/Input/Input';
import { TextArea } from '@/components/atoms/TextArea/TextArea';
import { FormField } from '@/components/molecules/FormField/FormField';
import { ALL_DISTRICTS } from '@/constants';

interface EditCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: any;
  onSave: (updatedData: any) => Promise<void>;
  onDelete?: (caseId: string) => Promise<void>;
}

export const EditCaseModal: React.FC<EditCaseModalProps> = ({
  isOpen,
  onClose,
  caseData,
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState<any>({ ...caseData });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !caseData) return null;

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Failed to save case:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete case ${caseData.caseId} (${caseData.fullName})? This action cannot be undone.`)) {
      return;
    }
    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete(caseData.caseId);
      }
      onClose();
    } catch (err) {
      console.error('Failed to delete case:', err);
      alert('Failed to delete case.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 260,
      padding: 'var(--space-4)'
    }}>
      <div style={{
        backgroundColor: '#0c0c0e',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid #27272a',
        width: '100%',
        maxWidth: '620px',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-xl)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: 'var(--space-4) var(--space-6)',
          borderBottom: '1px solid #27272a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#141417'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Icon name="Edit3" size={20} style={{ color: '#ffffff' }} />
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>
                Edit Case Record: {caseData.caseId}
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: '#a1a1aa' }}>
                Full public read, write, edit, and delete permissions enabled
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-4)' }}>
            <FormField label="Full Name" required>
              <Input 
                value={formData.fullName || ''}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="Full name"
              />
            </FormField>

            <FormField label="Age" required>
              <Input 
                type="number"
                value={formData.age || ''}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="Age"
              />
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
            <FormField label="Gender" required>
              <select 
                value={formData.gender || 'male'}
                onChange={(e) => handleChange('gender', e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '44px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #27272a',
                  backgroundColor: '#141417',
                  color: '#ffffff',
                  fontSize: 'var(--text-sm)'
                }}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </FormField>

            <FormField label="Status" required>
              <select 
                value={formData.status || 'missing'}
                onChange={(e) => handleChange('status', e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '44px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #27272a',
                  backgroundColor: '#141417',
                  color: '#ffffff',
                  fontSize: 'var(--text-sm)'
                }}
              >
                <option value="missing">Missing</option>
                <option value="safe">Found Safe</option>
                <option value="injured">Found Injured</option>
                <option value="reunited">Reunited</option>
                <option value="deceased">Deceased</option>
              </select>
            </FormField>

            <FormField label="Trust Tier">
              <select 
                value={formData.trustTier || 'community'}
                onChange={(e) => handleChange('trustTier', e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '44px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #27272a',
                  backgroundColor: '#141417',
                  color: '#ffffff',
                  fontSize: 'var(--text-sm)'
                }}
              >
                <option value="official">Official Verified</option>
                <option value="volunteer">Volunteer Verified</option>
                <option value="community">Community Report</option>
              </select>
            </FormField>
          </div>

          <FormField label="District" required>
            <select 
              value={formData.districtId || 1}
              onChange={(e) => handleChange('districtId', Number(e.target.value))}
              style={{
                width: '100%',
                minHeight: '44px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #27272a',
                backgroundColor: '#141417',
                color: '#ffffff',
                fontSize: 'var(--text-sm)'
              }}
            >
              {ALL_DISTRICTS.map(d => (
                <option key={d.id} value={d.id}>
                  {d.nameEn} ({d.nameNe})
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Last Known Location / Found Location" required>
            <TextArea 
              value={formData.lastKnownLocation || formData.lastSeenLocation || ''}
              onChange={(e) => handleChange('lastKnownLocation', e.target.value)}
              rows={2}
            />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <FormField label="Distinguishing Features">
              <Input 
                value={formData.features || ''}
                onChange={(e) => handleChange('features', e.target.value)}
                placeholder="Scars, marks, tattoos, height..."
              />
            </FormField>

            <FormField label="Clothing / Attire">
              <Input 
                value={formData.clothing || ''}
                onChange={(e) => handleChange('clothing', e.target.value)}
                placeholder="Shirt, pants, jacket..."
              />
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <FormField label="Reporter Name">
              <Input 
                value={formData.reporterName || ''}
                onChange={(e) => handleChange('reporterName', e.target.value)}
              />
            </FormField>

            <FormField label="Reporter Phone">
              <Input 
                value={formData.reporterPhone || ''}
                onChange={(e) => handleChange('reporterPhone', e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Photo URL (Optional)">
            <Input 
              value={formData.photoUrl || ''}
              onChange={(e) => handleChange('photoUrl', e.target.value)}
              placeholder="https://... or data:image/..."
            />
          </FormField>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)', borderTop: '1px solid #27272a', paddingTop: 'var(--space-4)' }}>
            {onDelete && (
              <Button 
                type="button" 
                variant="danger" 
                onClick={handleDelete}
                loading={isDeleting}
                icon={<Icon name="Trash2" size={16} />}
              >
                Delete Record
              </Button>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-3)', marginLeft: 'auto' }}>
              <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={isSaving}>
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
