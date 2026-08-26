import React from 'react';
import { Container, Section } from '@/components/layout';
import { Badge } from '@/components/atoms/Badge/Badge';
import { Button } from '@/components/atoms/Button/Button';
import { Icon } from '@/components/atoms/Icon/Icon';
import { Link } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

export default async function DevelopersPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) || { locale: 'en' };
  const isNe = locale === 'ne';

  return (
    <Section padding="lg">
      <Container size="lg">
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
            <Badge variant="trust" trustTier="official" size="sm">
              {isNe ? 'प्राविधिक दस्तावेज' : 'Developer & Architecture Specs'}
            </Badge>
            <span style={{ fontSize: 'var(--text-xs)', color: '#71717a' }}>
              v2.4.0 — Disaster Response Open Protocol
            </span>
          </div>

          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', color: '#ffffff', marginBottom: 'var(--space-2)' }}>
            {isNe ? 'डेभलपर तथा खुला विपद् डेटा नीति' : 'For Developers: Architecture, Security & Open-Access Policy'}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-md)', maxWidth: '800px', lineHeight: 1.6 }}>
            {isNe 
              ? 'आपतकालीन बाढी-पहिरो उद्धारमा द्रुत सूचना सम्पादन, स्थायी डेटा मेटाउने नीति र सुरक्षा प्रणालीको प्राविधिक विवरण।' 
              : 'Comprehensive technical documentation explaining our open disaster data governance, real-time edit/delete rationale, offline-first sync engine, and enterprise security framework.'}
          </p>
        </div>

        {/* SECTION 1: CORE RATIONALE (WHY OPEN EDIT & PERMANENT DELETE) */}
        <div style={{
          backgroundColor: '#111113',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid #27272a',
          padding: 'var(--space-8)',
          marginBottom: 'var(--space-8)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-4)' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#1c1917',
              border: '1px solid #78350f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b'
            }}>
              <Icon name="ShieldAlert" size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', color: '#ffffff' }}>
                {isNe ? 'हामी किन सबै सामग्री सम्पादन र मेटाउने पहुँच खुला राख्छौं?' : 'Why Are Content Editing & Deletion Openly Accessible?'}
              </h2>
              <span style={{ fontSize: 'var(--text-xs)', color: '#a1a1aa' }}>
                Disaster Response Open Data Protocol & The Right to Erasure
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
            <div style={{ backgroundColor: '#18181b', padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', border: '1px solid #27272a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Icon name="Zap" size={18} style={{ color: '#38bdf8' }} />
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: '#ffffff' }}>
                  1. Zero-Friction Emergency Response
                </h3>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: '#a1a1aa', lineHeight: 1.6 }}>
                In active disaster zones (Rasuwa, Nuwakot, Melamchi), cell towers are intermittent and field personnel change every few hours. Requiring rigid bureaucratic authentication or administrative approval to correct a child&apos;s misspelled name or hospital ward number causes fatal search delays.
              </p>
            </div>

            <div style={{ backgroundColor: '#18181b', padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', border: '1px solid #27272a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Icon name="Edit3" size={18} style={{ color: '#10b981' }} />
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: '#ffffff' }}>
                  2. Rapid Decentralized Data Hygiene
                </h3>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: '#a1a1aa', lineHeight: 1.6 }}>
                Crowdsourced missing reports submitted during panic often contain initial errors (wrong clothing description, outdated landmark). Allowing immediate inline updates empowers ground volunteers to refine records in real-time as search dogs and drone operators uncover fresh coordinates.
              </p>
            </div>

            <div style={{ backgroundColor: '#18181b', padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', border: '1px solid #27272a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Icon name="Trash2" size={18} style={{ color: '#ef4444' }} />
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: '#ffffff' }}>
                  3. The Humanitarian Right to Erasure
                </h3>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: '#a1a1aa', lineHeight: 1.6 }}>
                In compliance with humanitarian data conventions, once a missing individual is safely reunited, families have the unconditional legal and ethical right to permanently erase their contact numbers, photos, and medical notes from public view without waiting for system administrators.
              </p>
            </div>

            <div style={{ backgroundColor: '#18181b', padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', border: '1px solid #27272a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Icon name="Database" size={18} style={{ color: '#a855f7' }} />
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: '#ffffff' }}>
                  4. Post-Disaster Factory Wipe Protocol
                </h3>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: '#a1a1aa', lineHeight: 1.6 }}>
                Once flood waters recede and government relief operations conclude, the Admin Mission Control possesses master purge tools to execute an irrevocable database wipe and disk vacuum, preventing vulnerable citizen data from lingering on servers indefinitely.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: SECURITY & SYSTEM ARCHITECTURE */}
        <div style={{
          backgroundColor: '#111113',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid #27272a',
          padding: 'var(--space-8)',
          marginBottom: 'var(--space-8)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-6)' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#0c1a2e',
              border: '1px solid #1d4ed8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#60a5fa'
            }}>
              <Icon name="Lock" size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', color: '#ffffff' }}>
                Enterprise Security & Resilient Architecture
              </h2>
              <span style={{ fontSize: 'var(--text-xs)', color: '#a1a1aa' }}>
                Defense-in-depth, zero injection vectors, and strict headers
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'bold', color: '#ffffff', marginBottom: '8px' }}>
                🔒 1. Parameterized SQL Defense
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: '#a1a1aa', lineHeight: 1.6, marginBottom: '8px' }}>
                Every database interaction uses prepared statements with strictly typed bind parameters (`@caseId`, `@fullName`, etc.) via `better-sqlite3`. SQL injection attack surfaces are mathematically zero.
              </p>
              <code style={{ display: 'block', backgroundColor: '#09090b', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '11px', color: '#22c55e', fontFamily: 'monospace' }}>
                db.prepare(&apos;SELECT * FROM cases WHERE caseId = ?&apos;).get(caseId);
              </code>
            </div>

            <div>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'bold', color: '#ffffff', marginBottom: '8px' }}>
                🛡️ 2. Production Security Headers
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: '#a1a1aa', lineHeight: 1.6, marginBottom: '8px' }}>
                Configured with strict Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), X-Content-Type-Options `nosniff`, and Referrer-Policy `strict-origin-when-cross-origin`.
              </p>
              <code style={{ display: 'block', backgroundColor: '#09090b', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '11px', color: '#38bdf8', fontFamily: 'monospace' }}>
                Strict-Transport-Security: max-age=63072000; preload
              </code>
            </div>

            <div>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'bold', color: '#ffffff', marginBottom: '8px' }}>
                ⚡ 3. Offline-First IndexedDB Sync
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: '#a1a1aa', lineHeight: 1.6, marginBottom: '8px' }}>
                When users report a missing person with zero internet connectivity, records are encrypted and stored in client-side IndexedDB queues, auto-flushing to `/api/sync` immediately upon connection restoration.
              </p>
              <code style={{ display: 'block', backgroundColor: '#09090b', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '11px', color: '#eab308', fontFamily: 'monospace' }}>
                POST /api/sync → processOfflineBatch() → 200 OK
              </code>
            </div>

            <div>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'bold', color: '#ffffff', marginBottom: '8px' }}>
                ☁️ 4. Serverless & Vercel Storage
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: '#a1a1aa', lineHeight: 1.6, marginBottom: '8px' }}>
                The storage engine adapts automatically to serverless runtime environments (using `/tmp` writable cache fallback on Vercel Edge/Lambdas) with pluggable support for distributed LibSQL / Turso databases.
              </p>
              <code style={{ display: 'block', backgroundColor: '#09090b', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '11px', color: '#ec4899', fontFamily: 'monospace' }}>
                const DB_DIR = isVercel ? &apos;/tmp/data&apos; : &apos;./data&apos;;
              </code>
            </div>
          </div>
        </div>

        {/* SECTION 3: REST API ENDPOINT REFERENCE */}
        <div style={{
          backgroundColor: '#111113',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid #27272a',
          padding: 'var(--space-8)',
          marginBottom: 'var(--space-8)'
        }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', color: '#ffffff', marginBottom: 'var(--space-4)' }}>
            REST API Endpoints Reference
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-xs)' }}>
              <thead>
                <tr style={{ backgroundColor: '#09090b', borderBottom: '1px solid #27272a' }}>
                  <th style={{ padding: '10px 14px', color: '#71717a' }}>Method</th>
                  <th style={{ padding: '10px 14px', color: '#71717a' }}>Endpoint</th>
                  <th style={{ padding: '10px 14px', color: '#71717a' }}>Description</th>
                  <th style={{ padding: '10px 14px', color: '#71717a' }}>Payload / Parameters</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #27272a' }}>
                  <td style={{ padding: '10px 14px', color: '#38bdf8', fontWeight: 'bold' }}>GET</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#ffffff' }}>/api/cases</td>
                  <td style={{ padding: '10px 14px', color: '#a1a1aa' }}>Fetch public published missing & found cases</td>
                  <td style={{ padding: '10px 14px', color: '#71717a' }}>`?status=...&district=...&q=...`</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #27272a' }}>
                  <td style={{ padding: '10px 14px', color: '#22c55e', fontWeight: 'bold' }}>POST</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#ffffff' }}>/api/cases</td>
                  <td style={{ padding: '10px 14px', color: '#a1a1aa' }}>Create a missing or found report</td>
                  <td style={{ padding: '10px 14px', color: '#71717a' }}>`{'{ fullName, districtId, ... }'}`</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #27272a' }}>
                  <td style={{ padding: '10px 14px', color: '#38bdf8', fontWeight: 'bold' }}>GET</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#ffffff' }}>/api/community</td>
                  <td style={{ padding: '10px 14px', color: '#a1a1aa' }}>Retrieve community discussions and citizen replies</td>
                  <td style={{ padding: '10px 14px', color: '#71717a' }}>None</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #27272a' }}>
                  <td style={{ padding: '10px 14px', color: '#ef4444', fontWeight: 'bold' }}>DELETE</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#ffffff' }}>/api/community</td>
                  <td style={{ padding: '10px 14px', color: '#a1a1aa' }}>Permanently delete a post or comment</td>
                  <td style={{ padding: '10px 14px', color: '#71717a' }}>`?postId=...` or `?commentId=...`</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #27272a' }}>
                  <td style={{ padding: '10px 14px', color: '#38bdf8', fontWeight: 'bold' }}>GET</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#ffffff' }}>/api/gallery</td>
                  <td style={{ padding: '10px 14px', color: '#a1a1aa' }}>Retrieve verified disaster field photos</td>
                  <td style={{ padding: '10px 14px', color: '#71717a' }}>None</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #27272a' }}>
                  <td style={{ padding: '10px 14px', color: '#ef4444', fontWeight: 'bold' }}>DELETE</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#ffffff' }}>/api/gallery</td>
                  <td style={{ padding: '10px 14px', color: '#a1a1aa' }}>Permanently remove photo from archive</td>
                  <td style={{ padding: '10px 14px', color: '#71717a' }}>`?id=...`</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #27272a' }}>
                  <td style={{ padding: '10px 14px', color: '#f59e0b', fontWeight: 'bold' }}>POST</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#ffffff' }}>/api/admin/cases</td>
                  <td style={{ padding: '10px 14px', color: '#a1a1aa' }}>Bulk delete or Hard Purge All Data</td>
                  <td style={{ padding: '10px 14px', color: '#71717a' }}>`{'{ action: "hard_purge_all" }'}`</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Navigation Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <Link href="/">
            <Button variant="secondary" icon={<Icon name="ArrowLeft" size={16} />}>
              Back to Home
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="primary" icon={<Icon name="ShieldCheck" size={16} />}>
              Open Admin Mission Control
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
