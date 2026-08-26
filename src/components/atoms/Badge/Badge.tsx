import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps {
  variant: 'status' | 'trust' | 'caseId' | 'generic';
  status?: 'missing' | 'found-safe' | 'found-injured' | 'found-deceased' | 'reunited' | 'resolved';
  trustTier?: 'official' | 'volunteer' | 'community';
  children: React.ReactNode;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant,
  status,
  trustTier,
  children,
  size = 'sm',
  icon,
  className = '',
}) => {
  const rootClasses = [
    styles.badge,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    status ? styles[`status-${status}`] : '',
    trustTier ? styles[`trust-${trustTier}`] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={rootClasses}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.text}>{children}</span>
    </span>
  );
};
