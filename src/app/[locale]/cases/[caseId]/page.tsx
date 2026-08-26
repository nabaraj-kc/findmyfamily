import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Container, Section } from '@/components/layout';
import { getCaseById, getDistrictName } from '@/lib/db/database';
import { Badge } from '@/components/atoms/Badge/Badge';
import { Icon } from '@/components/atoms/Icon/Icon';
import { CaseIdBadge } from '@/components/molecules/CaseIdBadge/CaseIdBadge';
import { CaseDetailClient } from './components/CaseDetailClient';

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ caseId: string; locale: string }>;
}) {
  const { caseId, locale } = await params;
  const caseData = await getCaseById(caseId);

  if (!caseData) {
    notFound();
  }

  // Derived properties
  let statusBadgeStatus: 'missing' | 'found-safe' | 'found-injured' | 'found-deceased' = 'missing';
  let statusIcon = 'Search';
  let statusLabel = 'Missing';

  if (caseData.status === 'safe') {
    statusBadgeStatus = 'found-safe';
    statusIcon = 'CheckCircle';
    statusLabel = 'Found Safe';
  } else if (caseData.status === 'injured') {
    statusBadgeStatus = 'found-injured';
    statusIcon = 'AlertTriangle';
    statusLabel = 'Found Injured';
  } else if (caseData.status === 'deceased') {
    statusBadgeStatus = 'found-deceased';
    statusIcon = 'Info';
    statusLabel = 'Deceased (Private)';
  }

  return (
    <Section padding="lg">
      <Container size="md">
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
              <Badge variant="status" status={statusBadgeStatus} size="md">
                <Icon name={statusIcon} size={16} style={{ marginRight: '6px' }} />
                {statusLabel}
              </Badge>
              {caseData.trustTier === 'official' && (
                <Badge variant="trust" trustTier="official" size="sm">
                  <Icon name="CheckCircle" size={12} style={{ marginRight: '4px' }} />
                  Officially Verified
                </Badge>
              )}
            </div>
            <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>
              {caseData.fullName}
            </h1>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
              {caseData.age} years old • {caseData.gender.charAt(0).toUpperCase() + caseData.gender.slice(1)}
            </p>
          </div>
          <CaseIdBadge caseId={caseData.caseId} />
        </div>

        {/* Two Column Layout for Desktop */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: 'var(--space-8)'
        }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Photo */}
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              aspectRatio: '3/4',
              backgroundColor: 'var(--color-slate-100)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              border: '1px solid var(--color-border)'
            }}>
              {caseData.photoUrl ? (
                <Image 
                  src={caseData.photoUrl} 
                  alt={caseData.fullName} 
                  fill 
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 350px"
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Icon name="User" size={64} style={{ color: 'var(--color-slate-300)' }} />
                </div>
              )}
            </div>

            {/* Client Component handles the Information Modal & Edit/Delete State */}
            <CaseDetailClient caseId={caseData.caseId} status={caseData.status} fullCase={caseData} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            
            <div style={{ backgroundColor: '#111113', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid #27272a' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-4)' }}>
                {caseData.status === 'missing' ? 'Last Known Location' : 'Found Location'}
              </h2>
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                <Icon name="MapPin" size={24} style={{ color: '#ffffff', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ fontWeight: 'var(--weight-medium)', color: '#ffffff' }}>
                    {caseData.lastKnownLocation}
                  </p>
                  <p style={{ color: '#a1a1aa', fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>
                    District: {getDistrictName(caseData.districtId, locale as 'en' | 'ne')} • Date: {caseData.dateStr}
                  </p>
                </div>
              </div>
            </div>

            {(caseData.features || caseData.clothing) && (
              <div style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', backgroundColor: '#111113', border: '1px solid #27272a' }}>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-4)' }}>
                  Distinguishing Features
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {caseData.features && (
                    <div>
                      <h4 style={{ fontSize: 'var(--text-sm)', color: '#a1a1aa', marginBottom: 'var(--space-1)' }}>Physical Features</h4>
                      <p style={{ color: '#ffffff' }}>{caseData.features}</p>
                    </div>
                  )}
                  {caseData.clothing && (
                    <div>
                      <h4 style={{ fontSize: 'var(--text-sm)', color: '#a1a1aa', marginBottom: 'var(--space-1)' }}>Clothing</h4>
                      <p style={{ color: '#ffffff' }}>{caseData.clothing}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', backgroundColor: '#111113', border: '1px dashed #27272a' }}>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-2)' }}>
                Help Find {caseData.fullName.split(' ')[0]}
              </h2>
              <p style={{ color: '#a1a1aa', fontSize: 'var(--text-sm)' }}>
                Sharing this case on social media or local community groups significantly increases the chances of a match.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--weight-semibold)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Icon name="Share2" size={16} style={{ marginRight: '6px' }} /> Share on Social Media
                </span>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </Section>
  );
}
