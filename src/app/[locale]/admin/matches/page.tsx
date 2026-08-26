'use client';

import React, { useState, useEffect } from 'react';
import { Container, Section } from '@/components/layout';
import { MatchCard } from './components/MatchCard';
import { getHighConfidenceMatches, MatchPair } from '@/lib/matching/matcher';
import { mockCases } from '@/lib/data/mockCases';
import { Icon } from '@/components/atoms/Icon/Icon';

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<MatchPair[]>([]);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    // Generate matches on client load
    const potentialMatches = getHighConfidenceMatches(mockCases, 40); // Lower threshold to ensure we see examples
    setMatches(potentialMatches);
  }, []);

  const handleConfirm = (match: MatchPair) => {
    // In a real app, this calls an API to link cases and notify users
    setMatches(prev => prev.filter(m => m.missing.id !== match.missing.id));
    showToast(`Match Confirmed! ${match.missing.fullName} linked with ${match.found.caseId}`, 'success');
  };

  const handleReject = (match: MatchPair) => {
    // In a real app, this logs the rejection so the algorithm doesn't suggest it again
    setMatches(prev => prev.filter(m => m.missing.id !== match.missing.id || m.found.id !== match.found.id));
    showToast('Match rejected and removed from queue.', 'info');
  };

  const showToast = (message: string, type: 'success' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <Section padding="lg">
      <Container size="lg">
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-2)' }}>
            Match Review Queue
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            The algorithm has flagged the following cases for potential matches based on age, gender, location, and keywords.
          </p>
        </div>

        {toast && (
          <div style={{
            position: 'fixed', bottom: 'var(--space-6)', right: 'var(--space-6)',
            backgroundColor: toast.type === 'success' ? 'var(--color-success)' : 'var(--color-slate-800)',
            color: 'white',
            padding: 'var(--space-4) var(--space-6)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 50,
            display: 'flex', alignItems: 'center', gap: 'var(--space-3)'
          }}>
            <Icon name={toast.type === 'success' ? 'CheckCircle' : 'Info'} size={20} />
            {toast.message}
          </div>
        )}

        {matches.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: 'var(--space-12)', 
            backgroundColor: 'var(--color-bg-secondary)', 
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--color-border)'
          }}>
            <Icon name="CheckCircle" size={48} style={{ color: 'var(--color-slate-300)', marginBottom: 'var(--space-4)' }} />
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-primary)' }}>
              Queue is Empty
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
              No high-confidence matches currently detected.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {matches.map((match, i) => (
              <MatchCard 
                key={`${match.missing.id}-${match.found.id}-${i}`} 
                match={match} 
                onConfirm={handleConfirm}
                onReject={handleReject}
              />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
