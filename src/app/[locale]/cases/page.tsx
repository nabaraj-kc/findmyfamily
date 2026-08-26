import React from 'react';
import { Container, Section } from '@/components/layout';
import { CaseFilters } from './components/CaseFilters';
import { CaseCard } from '@/components/molecules/CaseCard/CaseCard';
import { getPublicCases } from '@/lib/db/database';
import { ExportCasesButton } from './components/ExportCasesButton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CasesDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = (await searchParams) || {};
  const q = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q.toLowerCase() : '';
  const statusFilter = typeof resolvedSearchParams.status === 'string' ? resolvedSearchParams.status : '';
  const districtFilter = typeof resolvedSearchParams.district === 'string' ? resolvedSearchParams.district : '';

  // Server-side filtering
  let cases = await getPublicCases();

  if (statusFilter) {
    cases = cases.filter(c => c.status === statusFilter);
  }

  if (districtFilter) {
    const districtIdNum = parseInt(districtFilter, 10);
    cases = cases.filter(c => c.districtId === districtIdNum);
  }

  if (q) {
    cases = cases.filter(c => 
      c.fullName.toLowerCase().includes(q) || 
      c.caseId.toLowerCase().includes(q)
    );
  }

  return (
    <Section padding="lg">
      <Container size="lg">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-8)'
        }}>
          <div>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-2)' }}>
              Missing & Found Directory
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Browse active cases, or use the filters below to narrow your search.
            </p>
          </div>

          <ExportCasesButton cases={cases} />
        </div>

        <CaseFilters />

        {cases.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: 'var(--space-12)', 
            backgroundColor: 'var(--color-bg-secondary)', 
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--color-border)'
          }}>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)' }}>
              No cases found matching your criteria.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-6)'
          }}>
            {cases.map((c, idx) => (
              <CaseCard key={c.caseId ? `case-card-${c.caseId}` : `case-card-idx-${idx}`} data={c as any} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
