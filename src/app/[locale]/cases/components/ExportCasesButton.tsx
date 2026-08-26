'use client';

import React, { useState } from 'react';
import { Button } from '@/components/atoms/Button/Button';
import { Icon } from '@/components/atoms/Icon/Icon';
import { ExportDataModal } from '@/components/molecules/ExportDataModal/ExportDataModal';

export const ExportCasesButton: React.FC<{ cases: any[] }> = ({ cases }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(true)}
        icon={<Icon name="DownloadCloud" size={16} />}
      >
        Export Dataset (PDF, CSV, JSON)
      </Button>

      <ExportDataModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        cases={cases} 
      />
    </>
  );
};
