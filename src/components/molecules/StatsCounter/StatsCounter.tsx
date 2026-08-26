import React from 'react';
import styles from './StatsCounter.module.css';

export interface StatsCounterProps {
  value: number;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatsCounter: React.FC<StatsCounterProps> = ({ value, label, icon, className = '' }) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.content}>
        <div className={styles.value}>
          {new Intl.NumberFormat().format(value)}
        </div>
        <div className={styles.label}>{label}</div>
      </div>
    </div>
  );
};
