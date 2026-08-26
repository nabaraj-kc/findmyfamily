import React from 'react';
import styles from './Spinner.module.css';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'current' | 'primary' | 'accent';
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '', color = 'current' }) => {
  return (
    <div
      className={`${styles.spinner} ${styles[`size-${size}`]} ${styles[`color-${color}`]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
