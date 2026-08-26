'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Icon } from '@/components/atoms/Icon/Icon';
import { Button } from '@/components/atoms/Button/Button';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  if (!isOpen) return null;

  const bankAccounts = [
    { bank: 'Himalayan Bank Ltd (HBL)', account: '01904631210086', currency: 'NPR / USD' },
    { bank: 'Standard Chartered Bank', account: '01013243601', currency: 'NPR' },
    { bank: 'Rastriya Banijya Bank (RBB)', account: '113010000362001', currency: 'NPR' }
  ];

  const copyToClipboard = (account: string, bank: string) => {
    navigator.clipboard.writeText(account);
    setCopiedBank(bank);
    setTimeout(() => setCopiedBank(null), 2500);
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
      zIndex: 250,
      padding: 'var(--space-4)'
    }}>
      <div style={{
        backgroundColor: '#0c0c0e',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid #27272a',
        width: '100%',
        maxWidth: '540px',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-xl)',
        color: '#ffffff',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: 'var(--space-6)',
          borderBottom: '1px solid #27272a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#141417'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Heart" size={20} style={{ color: '#ef4444' }} />
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: '#ffffff' }}>
                Prime Minister Disaster Relief Fund
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: '#a1a1aa' }}>
                प्रधानमन्त्री दैवी प्रकोप उद्धार कोष • Official Government Relief Fund
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: 'var(--space-1)' }}
            aria-label="Close"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: '#a1a1aa', lineHeight: 1.6 }}>
            Every contribution directly supports search, rescue operations, relief material distribution, and temporary shelter for flood and landslide victims across Nepal.
          </p>

          {/* Official QR Code Showcase */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid #27272a'
          }}>
            <p style={{ color: '#000000', fontSize: 'var(--text-xs)', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Official Fonepay & Himalayan Bank Relief QR
            </p>
            <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <Image 
                src="/images/pm-relief-qr.jpg" 
                alt="Government Disaster Relief Fund QR Code" 
                fill 
                style={{ objectFit: 'contain' }}
              />
            </div>
            <p style={{ color: '#52525b', fontSize: 'var(--text-xs)', marginTop: '8px' }}>
              Scan using any Mobile Banking App, Fonepay, Alipay+, or UnionPay
            </p>
          </div>

          {/* Bank Accounts List */}
          <div>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: '#ffffff', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="Landmark" size={16} style={{ color: '#ffffff' }} />
              Direct Bank Transfer Details
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {bankAccounts.map((b) => (
                <div key={b.bank} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-3) var(--space-4)',
                  backgroundColor: '#141417',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #27272a'
                }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: '#a1a1aa' }}>{b.bank}</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: '#ffffff', fontFamily: 'monospace' }}>
                      {b.account}
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(b.account, b.bank)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 10px',
                      backgroundColor: copiedBank === b.bank ? '#ffffff' : '#27272a',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      color: copiedBank === b.bank ? '#000000' : '#ffffff',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all var(--duration-fast) ease'
                    }}
                  >
                    <Icon name={copiedBank === b.bank ? 'Check' : 'Copy'} size={12} />
                    {copiedBank === b.bank ? 'Copied' : 'Copy A/C'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button variant="primary" onClick={onClose} fullWidth>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
