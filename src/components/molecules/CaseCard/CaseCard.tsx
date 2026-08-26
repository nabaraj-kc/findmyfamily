import React from 'react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import styles from './CaseCard.module.css';
import { Badge } from '../../atoms/Badge/Badge';
import { Icon } from '../../atoms/Icon/Icon';
import { MockCase, getDistrictName } from '@/lib/data/mockCases';
import { useLocale } from 'next-intl';

interface CaseCardProps {
  data: MockCase;
}

export const CaseCard: React.FC<CaseCardProps> = ({ data }) => {
  const locale = useLocale() as 'en' | 'ne';
  
  // Determine color and icon based on status
  let statusBadgeStatus: 'missing' | 'found-safe' | 'found-injured' | 'found-deceased' = 'missing';
  let statusIcon = 'Search';
  let statusLabel = 'Missing';

  if (data.status === 'safe') {
    statusBadgeStatus = 'found-safe';
    statusIcon = 'CheckCircle';
    statusLabel = 'Found Safe';
  } else if (data.status === 'injured') {
    statusBadgeStatus = 'found-injured';
    statusIcon = 'AlertTriangle';
    statusLabel = 'Found Injured';
  }

  return (
    <Link href={`/cases/${data.caseId}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        {data.photoUrl ? (
          <Image 
            src={data.photoUrl} 
            alt={`Photo of ${data.fullName}`} 
            fill 
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <Icon name="User" size={48} style={{ color: 'var(--color-slate-400)' }} />
          </div>
        )}
        <div className={styles.badgeContainer}>
          <Badge variant="status" status={statusBadgeStatus} className={styles.statusBadge}>
            <Icon name={statusIcon} size={14} style={{ marginRight: '4px' }} />
            {statusLabel}
          </Badge>
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name} title={data.fullName}>{data.fullName}</h3>
          <span className={styles.caseId}>{data.caseId}</span>
        </div>
        
        <div className={styles.details}>
          <div className={styles.detailRow}>
            <Icon name="MapPin" size={16} className={styles.detailIcon} />
            <span className={styles.detailText}>{getDistrictName(data.districtId, locale)}</span>
          </div>
          <div className={styles.detailRow}>
            <Icon name="Clock" size={16} className={styles.detailIcon} />
            <span className={styles.detailText}>{data.dateStr}</span>
          </div>
        </div>

        <div className={styles.footer}>
          <span className={styles.ageGender}>
            {data.age} yrs • {data.gender.charAt(0).toUpperCase() + data.gender.slice(1)}
          </span>
          {data.trustTier === 'official' && (
            <span title="Officially Verified">
              <Icon name="CheckCircle" size={16} style={{ color: 'var(--color-primary)' }} />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
