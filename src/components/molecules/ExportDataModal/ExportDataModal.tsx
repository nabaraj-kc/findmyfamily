'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/atoms/Icon/Icon';
import { Button } from '@/components/atoms/Button/Button';
import { exportToCsv, exportToJson, printOrSavePdf } from '@/lib/utils/exportData';

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  cases?: any[];
}

export const ExportDataModal: React.FC<ExportDataModalProps> = ({ isOpen, onClose, cases = [] }) => {
  const [exportType, setExportType] = useState<'all' | 'missing' | 'found'>('all');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const getFilteredData = async () => {
    // If cases passed, use them, otherwise fetch all cases from API
    if (cases && cases.length > 0) {
      let data = [...cases];
      if (exportType === 'missing') data = data.filter(c => c.status === 'missing');
      if (exportType === 'found') data = data.filter(c => c.status !== 'missing');
      return data;
    }

    try {
      const res = await fetch('/api/cases');
      const json = await res.json();
      let data = json.cases || [];
      if (exportType === 'missing') data = data.filter((c: any) => c.status === 'missing');
      if (exportType === 'found') data = data.filter((c: any) => c.status !== 'missing');
      return data;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const handleExportCsv = async () => {
    setIsLoading(true);
    const data = await getFilteredData();
    exportToCsv(data, `findmyfamily-${exportType}-${new Date().toISOString().split('T')[0]}.csv`);
    setIsLoading(false);
    onClose();
  };

  const handleExportJson = async () => {
    setIsLoading(true);
    const data = await getFilteredData();
    exportToJson(data, `findmyfamily-${exportType}-${new Date().toISOString().split('T')[0]}.json`);
    setIsLoading(false);
    onClose();
  };

  const handleExportPdf = async () => {
    setIsLoading(true);
    const data = await getFilteredData();
    printOrSavePdf(data, `Find My Family — ${exportType.toUpperCase()} Persons Official Report`);
    setIsLoading(false);
    onClose();
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
      zIndex: 220,
      padding: 'var(--space-4)'
    }}>
      <div style={{
        backgroundColor: '#0c0c0e',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid #27272a',
        width: '100%',
        maxWidth: '480px',
        padding: 'var(--space-6)',
        boxShadow: 'var(--shadow-xl)',
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Icon name="DownloadCloud" size={22} style={{ color: '#ffffff' }} />
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)' }}>Export Dataset</h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <p style={{ color: '#a1a1aa', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', lineHeight: 1.5 }}>
          Download official missing and found persons datasets to your device for offline rescue operations, GIS mapping, or volunteer coordination.
        </p>

        {/* Filter Selection */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: '#71717a', textTransform: 'uppercase', marginBottom: 'var(--space-2)', display: 'block' }}>
            Select Dataset Scope
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-2)' }}>
            {(['all', 'missing', 'found'] as const).map(t => (
              <button
                key={t}
                onClick={() => setExportType(t)}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${exportType === t ? '#ffffff' : '#27272a'}`,
                  backgroundColor: exportType === t ? '#ffffff' : '#141417',
                  color: exportType === t ? '#000000' : '#a1a1aa',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all var(--duration-fast) ease'
                }}
              >
                {t === 'all' ? 'All Records' : `${t} only`}
              </button>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
          <button
            onClick={handleExportCsv}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: '#141417',
              border: '1px solid #27272a',
              borderRadius: 'var(--radius-md)',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'all var(--duration-fast) ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Icon name="FileSpreadsheet" size={20} style={{ color: '#ffffff' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>CSV Spreadsheet (.csv)</div>
                <div style={{ fontSize: 'var(--text-xs)', color: '#a1a1aa' }}>Excel, Google Sheets, LibreOffice compatible (UTF-8)</div>
              </div>
            </div>
            <Icon name="ChevronRight" size={16} style={{ color: '#71717a' }} />
          </button>

          <button
            onClick={handleExportJson}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: '#141417',
              border: '1px solid #27272a',
              borderRadius: 'var(--radius-md)',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'all var(--duration-fast) ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Icon name="Code" size={20} style={{ color: '#ffffff' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>JSON Data (.json)</div>
                <div style={{ fontSize: 'var(--text-xs)', color: '#a1a1aa' }}>Developer & NGO API integration format</div>
              </div>
            </div>
            <Icon name="ChevronRight" size={16} style={{ color: '#71717a' }} />
          </button>

          <button
            onClick={handleExportPdf}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: '#141417',
              border: '1px solid #27272a',
              borderRadius: 'var(--radius-md)',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'all var(--duration-fast) ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Icon name="Printer" size={20} style={{ color: '#ffffff' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>Printable PDF Report (.pdf)</div>
                <div style={{ fontSize: 'var(--text-xs)', color: '#a1a1aa' }}>Formatted dossier for rescue teams & field units</div>
              </div>
            </div>
            <Icon name="ChevronRight" size={16} style={{ color: '#71717a' }} />
          </button>
        </div>

        <Button variant="ghost" onClick={onClose} fullWidth>
          Cancel
        </Button>
      </div>
    </div>
  );
};
