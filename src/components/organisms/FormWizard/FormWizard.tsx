import React from 'react';
import styles from './FormWizard.module.css';
import { Button } from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';

export interface WizardStep {
  title: string;
  component: React.ReactNode;
  validate?: () => boolean | string;
}

interface FormWizardProps {
  steps: WizardStep[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onComplete: () => void;
  isSubmitting?: boolean;
  onValidateStep?: (stepIndex: number) => boolean | string;
}

export const FormWizard: React.FC<FormWizardProps> = ({
  steps,
  currentStep,
  setCurrentStep,
  onComplete,
  isSubmitting = false,
  onValidateStep,
}) => {
  const [stepError, setStepError] = React.useState<string | null>(null);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    setStepError(null);

    // Run step validator if provided
    if (onValidateStep) {
      const validationResult = onValidateStep(currentStep);
      if (validationResult !== true && typeof validationResult === 'string') {
        setStepError(validationResult);
        return;
      }
      if (validationResult === false) {
        setStepError('Please complete all required fields correctly before continuing.');
        return;
      }
    }

    const currentStepConfig = steps[currentStep];
    if (currentStepConfig?.validate) {
      const res = currentStepConfig.validate();
      if (res !== true) {
        setStepError(typeof res === 'string' ? res : 'Please complete all required fields.');
        return;
      }
    }

    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    setStepError(null);
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className={styles.wizard}>
      {/* Progress Dots */}
      <div className={styles.progressContainer}>
        <div className={styles.progressDots}>
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`${styles.dot} ${
                idx === currentStep
                  ? styles.dotActive
                  : idx < currentStep
                  ? styles.dotCompleted
                  : ''
              }`}
            />
          ))}
        </div>
        <h2 className={styles.stepTitle}>{steps[currentStep].title}</h2>
      </div>

      {/* Step Content */}
      <div className={styles.stepContent}>
        {steps[currentStep].component}
      </div>

      {/* Validation Error Banner */}
      {stepError && (
        <div style={{
          margin: 'var(--space-4) 0',
          padding: 'var(--space-3) var(--space-4)',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid var(--color-error)',
          borderRadius: 'var(--radius-md)',
          color: '#fca5a5',
          fontSize: 'var(--text-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)'
        }}>
          <Icon name="AlertCircle" size={18} style={{ color: 'var(--color-error)', flexShrink: 0 }} />
          <span>{stepError}</span>
        </div>
      )}

      {/* Navigation Footer */}
      <div className={styles.footer}>
        {!isFirstStep && (
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            disabled={isSubmitting}
            icon={<Icon name="ArrowLeft" size={18} />}
          >
            Back
          </Button>
        )}
        <div className={styles.spacer} />
        <Button 
          variant="primary" 
          onClick={handleNext} 
          loading={isSubmitting}
        >
          {isLastStep ? 'Submit Report' : 'Next'}
        </Button>
      </div>
    </div>
  );
};
