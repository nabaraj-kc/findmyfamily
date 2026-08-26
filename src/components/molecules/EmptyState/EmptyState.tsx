import React from 'react';
import styles from './EmptyState.module.css';
import { Icon } from '../../atoms/Icon/Icon';
import { Button } from '../../atoms/Button/Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  iconName?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  iconName = 'Search',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.iconWrapper}>
        <Icon name={iconName} size={32} className={styles.icon} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      
      {actionLabel && onAction && (
        <div className={styles.action}>
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
