'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/atoms/Icon/Icon';
import { Button } from '@/components/atoms/Button/Button';
import { useTranslations } from 'next-intl';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('common');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redirect to admin dashboard using hard navigation to clear router cache
        const currentLocale = window.location.pathname.split('/')[1];
        window.location.href = `/${currentLocale}/admin`;
      } else {
        setError(data.message || 'Invalid password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-bg-primary)',
      padding: 'var(--space-4)'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        backgroundColor: '#111113', // Deep dark
        padding: 'var(--space-8)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid #27272a',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-4)'
          }}>
            <Icon name="Lock" size={32} style={{ color: '#3b82f6' }} />
          </div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: '#ffffff' }}>
            Admin Login
          </h1>
          <p style={{ color: '#a1a1aa', marginTop: 'var(--space-2)' }}>
            Enter the admin password to access the dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', color: '#e4e4e7', fontSize: 'var(--text-sm)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#18181b',
                border: '1px solid #3f3f46',
                borderRadius: 'var(--radius-md)',
                color: '#ffffff',
                fontSize: 'var(--text-base)',
                outline: 'none',
              }}
              placeholder="••••••••••••"
              autoFocus
            />
          </div>
          
          {error && (
            <div style={{ padding: '10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)', color: '#f87171', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading}
            style={{ width: '100%', marginTop: 'var(--space-2)', padding: '12px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
          
          <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
            <button 
              type="button" 
              onClick={() => router.push('/')}
              style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', fontSize: 'var(--text-sm)', textDecoration: 'underline' }}
            >
              Return to Homepage
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
