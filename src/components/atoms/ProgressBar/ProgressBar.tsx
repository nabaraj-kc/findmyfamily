import React from 'react';
import styles from './ProgressBar.module.css';
import { Icon } from '../Icon/Icon';

export interface ProgressBarProps {
  progress: number; // 0 to 100
  className?: string;
  ariaLabel?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = '', ariaLabel = 'Progress' }) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div 
      className={`${styles.barContainer} ${className}`}
      role="progressbar"
      aria-valuenow={clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
    >
      <div 
        className={styles.barFill} 
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
};

export interface ProgressDotsProps {
  totalSteps: number;
  currentStep: number;
  labels?: string[];
  className?: string;
}

export const ProgressDots: React.FC<ProgressDotsProps> = ({ totalSteps, currentStep, labels, className = '' }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className={`${styles.dotsContainer} ${className}`} aria-label={`Step ${currentStep} of ${totalSteps}`}>
      {steps.map((step, index) => {
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;
        
        return (
          <React.Fragment key={step}>
            <div className={styles.dotWrapper}>
              <div 
                className={`
                  ${styles.dot} 
                  ${isCompleted ? styles.dotCompleted : ''} 
                  ${isActive ? styles.dotActive : ''}
                `}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? <Icon name="Check" size={14} strokeWidth={3} /> : <span>{step}</span>}
              </div>
              {labels && labels[index] && (
                <span className={`${styles.dotLabel} ${isActive ? styles.labelActive : ''}`}>
                  {labels[index]}
                </span>
              )}
            </div>
            
            {index < totalSteps - 1 && (
              <div className={`${styles.connector} ${isCompleted ? styles.connectorCompleted : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
