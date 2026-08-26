import React, { TextareaHTMLAttributes, forwardRef } from 'react';
import styles from './TextArea.module.css';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  isError?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, isError, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`${styles.textarea} ${isError ? styles.error : ''} ${className || ''}`}
        {...props}
      />
    );
  }
);

TextArea.displayName = 'TextArea';
