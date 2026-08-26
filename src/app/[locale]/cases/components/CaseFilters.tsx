'use client';

import React, { useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Input } from '@/components/atoms/Input/Input';
import { ALL_DISTRICTS } from '@/constants';
import { useLocale } from 'next-intl';

export const CaseFilters: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale() as 'en' | 'ne';

  // Current values
  const currentQuery = searchParams.get('q') || '';
  const currentStatus = searchParams.get('status') || '';
  const currentDistrict = searchParams.get('district') || '';

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(pathname + '?' + createQueryString('q', e.target.value));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(pathname + '?' + createQueryString('status', e.target.value));
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(pathname + '?' + createQueryString('district', e.target.value));
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 'var(--space-4)',
      marginBottom: 'var(--space-8)',
      padding: 'var(--space-4)',
      backgroundColor: '#111113',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid #27272a'
    }}>
      <div>
        <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--space-2)', color: '#ffffff' }}>
          Search Name or Case ID
        </label>
        <Input 
          placeholder="e.g. Aarav or MP-2026-..." 
          value={currentQuery}
          onChange={handleSearch}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--space-2)', color: '#ffffff' }}>
          Filter by Status
        </label>
        <select 
          value={currentStatus}
          onChange={handleStatusChange}
          style={{
            width: '100%',
            minHeight: '44px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #27272a',
            backgroundColor: '#141417',
            color: '#ffffff',
            fontFamily: 'inherit',
            fontSize: 'var(--text-base)'
          }}
        >
          <option value="" style={{ backgroundColor: '#141417', color: '#ffffff' }}>All Statuses</option>
          <option value="missing" style={{ backgroundColor: '#141417', color: '#ffffff' }}>Missing</option>
          <option value="safe" style={{ backgroundColor: '#141417', color: '#ffffff' }}>Found Safe</option>
          <option value="injured" style={{ backgroundColor: '#141417', color: '#ffffff' }}>Found Injured</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--space-2)', color: '#ffffff' }}>
          Filter by District
        </label>
        <select 
          value={currentDistrict}
          onChange={handleDistrictChange}
          style={{
            width: '100%',
            minHeight: '44px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #27272a',
            backgroundColor: '#141417',
            color: '#ffffff',
            fontFamily: 'inherit',
            fontSize: 'var(--text-base)'
          }}
        >
          <option value="" style={{ backgroundColor: '#141417', color: '#ffffff' }}>All Districts</option>
          {ALL_DISTRICTS.map(d => (
            <option key={d.id} value={d.id} style={{ backgroundColor: '#141417', color: '#ffffff' }}>
              {locale === 'en' ? d.nameEn : d.nameNe}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
