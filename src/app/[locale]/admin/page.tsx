'use client';

import React from 'react';
import { Container, Section } from '@/components/layout';
import { AdminDashboardClient } from './components/AdminDashboardClient';

export default function AdminDashboardPage() {
  return (
    <Section padding="lg">
      <Container size="lg">
        <AdminDashboardClient
          initialCases={[]}
          initialTips={[]}
          initialGallery={[]}
          initialCommunity={[]}
        />
      </Container>
    </Section>
  );
}
