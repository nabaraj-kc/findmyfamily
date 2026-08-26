import React from 'react';
import { Input, TextArea } from '../../atoms/Input/Input';

export interface FormFieldProps {
  label: string;
  name?: string;
  type?: 'text' | 'tel' | 'email' | 'number' | 'textarea';
  required?: boolean;
  error?: string;
  helperText?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  showVoiceInput?: boolean;
  maxLength?: number;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export const FormField = React.forwardRef<HTMLElement, FormFieldProps>(
  ({ label, name, type = 'text', required, className = '', children, ...props }, ref) => {
    
    // For required fields, add a subtle indicator to the label text
    const displayLabel = required ? `${label} *` : label;

    // If children are provided, it acts purely as a layout wrapper
    if (children) {
      return (
        <div className={className}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--space-2)' }}>
            {displayLabel}
          </label>
          {children}
        </div>
      );
    }

    if (type === 'textarea') {
      return (
        <TextArea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          name={name}
          label={displayLabel}
          required={required}
          className={className}
          {...(props as any)}
        />
      );
    }

    return (
      <Input
        ref={ref as React.Ref<HTMLInputElement>}
        type={type}
        name={name}
        label={displayLabel}
        required={required}
        className={className}
        {...(props as any)}
      />
    );
  }
);
FormField.displayName = 'FormField';
