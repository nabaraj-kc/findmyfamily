'use client';

import React, { useState } from 'react';
import { Button } from '@/components/atoms/Button/Button';
import { TextArea } from '@/components/atoms/TextArea/TextArea';
import { Input } from '@/components/atoms/Input/Input';
import { FormField } from '@/components/molecules/FormField/FormField';
import { Icon } from '@/components/atoms/Icon/Icon';
import { submitCaseTip } from '@/app/actions/submitTip';

interface InformationModalProps {
  caseId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const InformationModal: React.FC<InformationModalProps> = ({ caseId, isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tip, setTip] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tip.trim()) {
      setErrorMessage('Please describe what information or sighting you have.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await submitCaseTip(caseId, tip, contactInfo);
      if (res.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(res.error || 'Failed to submit information.');
      }
    } catch (err: any) {
      setErrorMessage('Error submitting information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: 'var(--space-4)'
    }}>
      <div style={{
        backgroundColor: '#0c0c0e',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid #27272a'
      }}>
        {isSuccess ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
            <div style={{ 
              width: '60px', height: '60px', 
              borderRadius: '50%', 
              backgroundColor: '#ffffff', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto var(--space-6)'
            }}>
              <Icon name="CheckCircle" size={28} style={{ color: '#000000' }} />
            </div>
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-2)', color: '#ffffff' }}>
              Information Submitted
            </h3>
            <p style={{ color: '#a1a1aa', marginBottom: 'var(--space-6)' }}>
              Thank you for providing this crucial information. It has been securely recorded and routed to the response team and family.
            </p>
            <Button variant="primary" onClick={onClose} style={{ width: '100%' }}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <div style={{ 
              padding: 'var(--space-4) var(--space-6)', 
              borderBottom: '1px solid #27272a',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: '#ffffff' }}>
                I Have Information
              </h3>
              <button 
                onClick={onClose}
                style={{ 
                  background: 'none', border: 'none', 
                  color: '#a1a1aa', cursor: 'pointer',
                  padding: 'var(--space-1)'
                }}
                aria-label="Close modal"
              >
                <Icon name="X" size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <div style={{ backgroundColor: '#141417', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid #27272a' }}>
                <p style={{ fontSize: 'var(--text-sm)', color: '#d4d4d8' }}>
                  You are submitting a tip for case <strong style={{ color: '#ffffff' }}>{caseId}</strong>. Your information will be stored securely for verification.
                </p>
              </div>

              {errorMessage && (
                <div style={{
                  padding: 'var(--space-3) var(--space-4)',
                  backgroundColor: '#18181b',
                  border: '1px solid #ef4444',
                  borderRadius: 'var(--radius-md)',
                  color: '#f87171',
                  fontSize: 'var(--text-sm)'
                }}>
                  {errorMessage}
                </div>
              )}

              <FormField label="What do you know?" required>
                <TextArea 
                  value={tip}
                  onChange={(e) => setTip(e.target.value)}
                  placeholder="Please describe what you saw, where, and when..."
                  rows={5}
                />
              </FormField>

              <FormField label="Your Contact Info (Optional)" helperText="If you would like the family or officials to be able to contact you.">
                <Input 
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="Phone number or email"
                />
              </FormField>

              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={isSubmitting}>
                  Submit Information
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
