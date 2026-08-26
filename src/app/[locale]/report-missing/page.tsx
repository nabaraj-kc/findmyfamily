'use client';

import React, { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Container, Section } from '@/components/layout';
import { FormWizard, WizardStep } from '@/components/organisms/FormWizard/FormWizard';
import { BasicDetailsStep } from './components/BasicDetailsStep';
import { LocationStep } from './components/LocationStep';
import { FeaturesStep } from './components/FeaturesStep';
import { ReporterStep } from './components/ReporterStep';
import { ReviewStep } from './components/ReviewStep';
import { submitReportMissing } from '@/app/actions/reportMissing';
import { savePendingSubmission } from '@/lib/utils/offlineQueue';

export default function ReportMissingPage() {
  const t = useTranslations('reportMissing');
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({
    district: '1', // default Rasuwa
    gender: 'male',
    lastSeenDate: new Date().toISOString().split('T')[0],
    privacyConsent: true
  });

  const updateData = (fields: Partial<any>) => {
    setFormData((prev: any) => ({ ...prev, ...fields }));
  };

  const validateStep = (stepIndex: number): boolean | string => {
    if (stepIndex === 0) {
      if (!formData.fullName || !formData.fullName.trim()) {
        return 'Please enter the full name of the missing person.';
      }
      if (!formData.age || Number(formData.age) <= 0) {
        return 'Please enter a valid age.';
      }
      if (!formData.gender) {
        return 'Please select a gender.';
      }
    } else if (stepIndex === 1) {
      if (!formData.district) {
        return 'Please select the district.';
      }
      if (!formData.lastSeenLocation || !formData.lastSeenLocation.trim()) {
        return 'Please enter the specific last seen location (e.g. village, bridge, camp).';
      }
      if (!formData.lastSeenDate) {
        return 'Please select the date last seen.';
      }
    } else if (stepIndex === 3) {
      if (!formData.reporterName || !formData.reporterName.trim()) {
        return 'Please enter your name as the reporter.';
      }
      if (!formData.reporterPhone || !formData.reporterPhone.trim()) {
        return 'Please enter your contact phone number.';
      }
      if (!formData.relationship) {
        return 'Please specify your relationship to the missing person.';
      }
      if (!formData.privacyConsent) {
        return 'Please agree to share these details for rescue and reunification coordination.';
      }
    }
    return true;
  };

  const steps: WizardStep[] = [
    { title: 'Basic Details', component: <BasicDetailsStep data={formData} updateData={updateData} /> },
    { title: 'Last Known Location', component: <LocationStep data={formData} updateData={updateData} /> },
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

      const result = await submitReportMissing(formData);
      if (result.success) {
        router.push(`/report-missing/success?caseId=${result.caseId}`);
        return;
      } else {
        alert(result.error || 'Submission failed. Saving locally.');
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.warn('Saving report to local offline storage.', error);
      const offlineId = `PENDING-MP-${Math.floor(1000 + Math.random() * 9000)}`;
      savePendingSubmission({ ...formData, type: 'missing', _offlineId: offlineId });
      router.push(`/report-missing/success?caseId=${offlineId}&offline=true`);
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
