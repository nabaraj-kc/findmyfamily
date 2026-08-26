'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Container, Section } from '@/components/layout';
import { CaseIdBadge } from '@/components/molecules/CaseIdBadge/CaseIdBadge';
import btnStyles from '@/components/atoms/Button/Button.module.css';
import { Icon } from '@/components/atoms/Icon/Icon';

export default function FoundSuccessPage() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get('caseId') || 'UNKNOWN';
  const status = searchParams.get('status') || 'safe';
  const isOffline = searchParams.get('offline') === 'true';

  const isDeceased = status === 'deceased';

  return (
    <Section padding="xl">
      <Container size="sm" className="text-center">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          padding: 'var(--space-12)',
          backgroundColor: '#111113',
          borderRadius: 'var(--radius-2xl)',
          border: '1px solid #27272a',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--space-6)'
          }}>
            <Icon 
              name={isOffline ? 'WifiOff' : 'CheckCircle'} 
              size={28} 
              style={{ color: '#000000' }} 
            />
          </div>

          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-4)', color: '#ffffff' }}>
            {isOffline ? 'Report Saved Locally' : 'Found Report Registered'}
          </h1>

          <p style={{ color: '#a1a1aa', marginBottom: 'var(--space-8)', maxWidth: '420px', lineHeight: 1.6 }}>
            {isOffline 
              ? 'Your report has been saved on your device and will be synced to the database once you are online.'
              : isDeceased 
                ? 'Thank you for reporting. In accordance with dignity and sensitivity protocols, this record is held privately in our secure database for official coroner and family verification.'
                : 'Thank you for reporting. This found person entry has been saved to the database and will be matched against active missing person reports.'}
          </p>

          <div style={{ marginBottom: 'var(--space-8)' }}>
            <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: '#71717a', marginBottom: 'var(--space-2)' }}>
              Assigned Case Tracking ID
            </span>
            <CaseIdBadge caseId={caseId} />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link 
              href="/" 
              className={`${btnStyles.button} ${btnStyles['variant-primary']}`}
              style={{ textDecoration: 'none' }}
            >
              <span className={btnStyles.content}>Return Home</span>
            </Link>

            {!isDeceased && !isOffline && (
              <Link 
                href={`/cases/${caseId}`} 
                className={`${btnStyles.button} ${btnStyles['variant-secondary']}`}
                style={{ textDecoration: 'none' }}
              >
                <span className={btnStyles.content}>View Case Details</span>
              </Link>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
