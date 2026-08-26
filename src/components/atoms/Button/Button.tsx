import React from 'react';
import styles from './Button.module.css';
import { Spinner } from '../Spinner/Spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'warm' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      icon,
      iconPosition = 'left',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const rootClasses = [
      styles.button,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      fullWidth ? styles.fullWidth : '',
      loading ? styles.loading : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={rootClasses}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Spinner className={styles.spinner} size="sm" />}
        {!loading && icon && iconPosition === 'left' && <span className={styles.iconLeft}>{icon}</span>}
        <span className={styles.content}>{children}</span>
        {!loading && icon && iconPosition === 'right' && <span className={styles.iconRight}>{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
