import React from 'react';
import { Link } from '@/i18n/routing';
import { Icon } from '@/components/atoms/Icon/Icon';
import { Container } from '@/components/layout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-bg-secondary)' }}>
      {/* Admin Sub-Navigation */}
      <div style={{ backgroundColor: 'var(--color-slate-900)', color: 'white', padding: 'var(--space-4) 0' }}>
        <Container size="lg">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Icon name="ShieldCheck" size={24} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', letterSpacing: '0.02em' }}>
                Command Center
              </span>
            </div>
            
            <nav style={{ display: 'flex', gap: 'var(--space-6)' }}>
              <Link href="/admin" style={{ color: 'var(--color-slate-300)', textDecoration: 'none', fontWeight: 'var(--weight-medium)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Icon name="LayoutDashboard" size={18} />
                Overview
              </Link>
              <Link href="/admin/matches" style={{ color: 'var(--color-slate-300)', textDecoration: 'none', fontWeight: 'var(--weight-medium)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Icon name="GitMerge" size={18} />
                Match Queue
              </Link>
            </nav>
          </div>
        </Container>
      </div>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: 'var(--space-8) 0' }}>
        {children}
      </main>
    </div>
  );
}
