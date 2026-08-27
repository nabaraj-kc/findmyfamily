'use client';

import React, { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Button } from '@/components/atoms/Button/Button';
import { Icon } from '@/components/atoms/Icon/Icon';
import { InformationModal } from './InformationModal';
import { EditCaseModal } from '@/components/molecules/EditCaseModal/EditCaseModal';

export const CaseDetailClient: React.FC<{ caseId: string, status: string, fullCase?: any }> = ({ 
  caseId, 
  status,
  fullCase 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  const handleSaveEditedCase = async (updatedData: any) => {
    const res = await fetch(`/api/cases/${encodeURIComponent(caseId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });
    if (res.ok) {
      router.refresh();
    } else {
      throw new Error('Failed to update case');
    }
  };



  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: '100%' }}>
      {status !== 'safe' && status !== 'deceased' && (
        <Button 
          variant="primary" 
          onClick={() => setIsModalOpen(true)}
          icon={<Icon name="MessageSquare" size={18} />}
          style={{ width: '100%', padding: 'var(--space-4)' }}
        >
          I Have Sighting / Info
        </Button>
      )}

      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsEditModalOpen(true)}
          icon={<Icon name="Edit2" size={14} />}
          style={{ flex: 1 }}
        >
          Edit Record
        </Button>


      </div>

      <InformationModal 
        caseId={caseId} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {isEditModalOpen && (
        <EditCaseModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          caseData={fullCase || { caseId, status }}
          onSave={handleSaveEditedCase}
        />
      )}
    </div>
  );
};
