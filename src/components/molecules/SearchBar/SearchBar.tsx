import React from 'react';
import styles from './SearchBar.module.css';
import { Icon } from '../../atoms/Icon/Icon';

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  size?: 'md' | 'lg';
  showVoiceInput?: boolean;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onSubmit,
  size = 'md',
  showVoiceInput = false,
  className = '',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit(value);
    }
  };

  const handleClear = () => {
    if (onChange) onChange('');
  };

  return (
    <div className={`${styles.wrapper} ${styles[`size-${size}`]} ${className}`}>
      <div className={styles.iconLeft}>
        <Icon name="Search" size={size === 'lg' ? 24 : 20} className={styles.icon} />
      </div>
      
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      
      <div className={styles.actions}>
        {value && (
          <button type="button" className={styles.actionBtn} onClick={handleClear} aria-label="Clear search">
            <Icon name="X" size={18} />
          </button>
        )}
        
        {showVoiceInput && (
          <button type="button" className={styles.actionBtn} aria-label="Voice search">
            <Icon name="Mic" size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
