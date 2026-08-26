import React from 'react';
import styles from './Input.module.css';
import { Icon } from '../Icon/Icon';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  showVoiceInput?: boolean;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, icon, showVoiceInput, fullWidth = true, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const rootClasses = [
      styles.wrapper,
      fullWidth ? styles.fullWidth : '',
      className
    ].filter(Boolean).join(' ');

    const inputClasses = [
      styles.input,
      error ? styles.hasError : '',
      icon ? styles.hasIcon : '',
      showVoiceInput ? styles.hasVoice : ''
    ].filter(Boolean).join(' ');

    return (
      <div className={rootClasses}>
        {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
        
        <div className={styles.inputContainer}>
          {icon && <span className={styles.iconLeft}>{icon}</span>}
          
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            aria-invalid={!!error}
            aria-describedby={`${error ? errorId : ''} ${helperText ? helperId : ''}`.trim() || undefined}
            {...props}
          />
          
          {showVoiceInput && (
            <button type="button" className={styles.voiceBtn} aria-label="Voice input">
              <Icon name="Mic" size={18} />
            </button>
          )}
        </div>

        {error && <p id={errorId} className={styles.errorText} role="alert">{error}</p>}
        {!error && helperText && <p id={helperId} className={styles.helperText}>{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showVoiceInput?: boolean;
  fullWidth?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className = '', label, error, helperText, showVoiceInput, fullWidth = true, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const rootClasses = [
      styles.wrapper,
      fullWidth ? styles.fullWidth : '',
      className
    ].filter(Boolean).join(' ');

    const inputClasses = [
      styles.input,
      styles.textarea,
      error ? styles.hasError : '',
    ].filter(Boolean).join(' ');

    return (
      <div className={rootClasses}>
        {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
        
        <div className={styles.inputContainer}>
          <textarea
            ref={ref}
            id={inputId}
            className={inputClasses}
            aria-invalid={!!error}
            aria-describedby={`${error ? errorId : ''} ${helperText ? helperId : ''}`.trim() || undefined}
            {...props}
          />
          
          {showVoiceInput && (
            <button type="button" className={styles.voiceBtnArea} aria-label="Voice input">
              <Icon name="Mic" size={18} />
            </button>
          )}
        </div>

        {error && <p id={errorId} className={styles.errorText} role="alert">{error}</p>}
        {!error && helperText && <p id={helperId} className={styles.helperText}>{helperText}</p>}
      </div>
    );
  }
);
TextArea.displayName = 'TextArea';
