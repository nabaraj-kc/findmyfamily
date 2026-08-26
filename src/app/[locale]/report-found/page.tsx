'use client';

import React, { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Container, Section } from '@/components/layout';
import { FormWizard, WizardStep } from '@/components/organisms/FormWizard/FormWizard';
import { StatusStep } from './components/StatusStep';
import { BasicDetailsStep } from './components/BasicDetailsStep';
import { LocationStep } from './components/LocationStep';
import { FeaturesStep } from './components/FeaturesStep';
import { ReporterStep } from './components/ReporterStep';
import { ReviewStep } from './components/ReviewStep';
import { submitReportFound } from '@/app/actions/reportFound';
import { savePendingSubmission } from '@/lib/utils/offlineQueue';

export default function ReportFoundPage() {
  const t = useTranslations('reportFound');
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({
    status: 'safe',
    district: '1',
    gender: 'male',
    foundDate: new Date().toISOString().split('T')[0],
    privacyConsent: true
  });

  const updateData = (fields: Partial<any>) => {
    setFormData((prev: any) => ({ ...prev, ...fields }));
  };

  const validateStep = (stepIndex: number): boolean | string => {
    if (stepIndex === 0) {
      if (!formData.status) {
        return 'Please select the condition/status of the found individual.';
      }
    } else if (stepIndex === 1) {
      if (!formData.age || Number(formData.age) <= 0) {
        return 'Please provide an approximate age.';
      }
      if (!formData.gender) {
        return 'Please select the gender.';
      }
    } else if (stepIndex === 2) {
      if (!formData.district) {
        return 'Please select the district where they were found.';
      }
      if (!formData.foundLocation || !formData.foundLocation.trim()) {
        return 'Please enter the specific location where they were found (e.g. hospital, shelter, roadside).';
      }
      if (!formData.foundDate) {
        return 'Please select the date found.';
      }
    } else if (stepIndex === 4) {
      if (!formData.reporterName || !formData.reporterName.trim()) {
        return 'Please enter your name as the finder/reporter.';
      }
      if (!formData.reporterPhone || !formData.reporterPhone.trim()) {
        return 'Please enter your phone number so officials can contact you.';
      }
      if (!formData.privacyConsent) {
        return 'Please agree to share these details for rescue and reunification coordination.';
      }
    }
    return true;
  };

  const steps: WizardStep[] = [
    { title: 'Person Condition', component: <StatusStep data={formData} updateData={updateData} /> },
    { title: 'Basic Details', component: <BasicDetailsStep data={formData} updateData={updateData} /> },
    { title: 'Found Location', component: <LocationStep data={formData} updateData={updateData} /> },
    { title: 'Distinguishing Features', component: <FeaturesStep data={formData} updateData={updateData} /> },
    { title: 'Your Contact Details', component: <ReporterStep data={formData} updateData={updateData} /> },
    { title: 'Review & Submit', component: <ReviewStep data={formData} /> },
  ];

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Offline');
      }

      const result = await submitReportFound(formData);
      if (result.success) {
        router.push(`/report-found/success?caseId=${result.caseId}&status=${formData.status}`);
        return;
      } else {
        alert(result.error || 'Submission failed. Saving locally.');
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.warn('Saving found report to local offline storage.', error);
      const offlineId = `PENDING-FP-${Math.floor(1000 + Math.random() * 9000)}`;
      savePendingSubmission({ ...formData, type: 'found', _offlineId: offlineId });
      router.push(`/report-found/success?caseId=${offlineId}&status=${formData.status}&offline=true`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section padding="lg">
      <Container size="sm">
        <div style={{ marginBottom: 'var(--space-8)', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-2)' }}>
            {t('pageTitle')}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            {t('pageSubtitle')}
          </p>
        </div>

        <FormWizard
          steps={steps}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          onComplete={handleComplete}
          isSubmitting={isSubmitting}
          onValidateStep={validateStep}
        />
      </Container>
    </Section>
  );
}
