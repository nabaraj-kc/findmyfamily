import React from 'react';
import { MatchPair } from '@/lib/matching/matcher';
import { Button } from '@/components/atoms/Button/Button';
import { Badge } from '@/components/atoms/Badge/Badge';
import { getDistrictName } from '@/lib/data/mockCases';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Icon } from '@/components/atoms/Icon/Icon';

interface MatchCardProps {
  match: MatchPair;
  onConfirm: (match: MatchPair) => void;
  onReject: (match: MatchPair) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onConfirm, onReject }) => {
  const { missing, found, result } = match;
  const locale = useLocale() as 'en' | 'ne';

  const scoreColor = result.score >= 80 ? 'var(--color-success)' : result.score >= 60 ? 'var(--color-warning)' : 'var(--color-slate-500)';

  const ProfileColumn = ({ data, label, badgeVariant }: any) => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontWeight: 'var(--weight-bold)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </h4>
        <Badge variant={badgeVariant} size="sm">{data.caseId}</Badge>
      </div>
      
      <div style={{ 
        width: '100%', 
        aspectRatio: '1', 
        backgroundColor: 'var(--color-slate-100)', 
        borderRadius: 'var(--radius-lg)', 
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--color-border)'
      }}>
        {data.photoUrl ? (
          <Image src={data.photoUrl} alt={data.fullName} fill style={{ objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Icon name="User" size={48} style={{ color: 'var(--color-slate-300)' }} />
          </div>
        )}
      </div>

      <div>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>
          {data.fullName}
        </h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          {data.age} yrs • {data.gender}
        </p>
      </div>
      
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
        <p><strong>District:</strong> {getDistrictName(data.districtId, locale)}</p>
        <p><strong>Date:</strong> {data.dateStr}</p>
        {(data.features || data.clothing) && (
          <div style={{ marginTop: 'var(--space-2)' }}>
            {data.features && <p><strong>Features:</strong> {data.features}</p>}
            {data.clothing && <p><strong>Clothing:</strong> {data.clothing}</p>}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-md)',
      overflow: 'hidden'
    }}>
      
      {/* Top Banner: Score */}
      <div style={{ 
        backgroundColor: 'var(--color-bg-secondary)', 
        padding: 'var(--space-4)', 
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            width: '48px', height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-bg-primary)',
            border: `3px solid ${scoreColor}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-lg)',
            color: scoreColor
          }}>
            {result.score}
          </div>
          <div>
            <h3 style={{ fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>Confidence Match</h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Algorithmic Suggestion</p>
          </div>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          {result.reasons.map((r, i) => (
            <span key={i} style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              ✓ {r}
            </span>
          ))}
        </div>
      </div>

      {/* Side by Side */}
      <div style={{ 
        display: 'flex', 
        gap: 'var(--space-6)', 
        padding: 'var(--space-6)',
        flexDirection: 'row',
        flexWrap: 'wrap'
      }}>
        <ProfileColumn data={missing} label="Missing Report" badgeVariant="warning" />
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}>
          <Icon name="ArrowRightLeft" size={24} style={{ color: 'var(--color-slate-300)' }} />
        </div>

        <ProfileColumn data={found} label="Found Report" badgeVariant="success" />
      </div>

      {/* Actions */}
      <div style={{ 
        padding: 'var(--space-4)', 
        backgroundColor: 'var(--color-bg-secondary)', 
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 'var(--space-3)'
      }}>
        <Button variant="ghost" onClick={() => onReject(match)}>
          Reject Match
        </Button>
        <Button variant="primary" onClick={() => onConfirm(match)}>
          Confirm Match
        </Button>
      </div>

    </div>
  );
};
