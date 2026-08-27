'use client';

import React, { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Button } from '@/components/atoms/Button/Button';
import { Icon } from '@/components/atoms/Icon/Icon';
import { InformationModal } from './InformationModal';


export const CaseDetailClient: React.FC<{ caseId: string, status: string, fullCase?: any }> = ({ 
  caseId, 
  status,
  fullCase 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);




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



      <InformationModal 
        caseId={caseId} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />


    </div>
  );
};
