'use client';

import React, { useEffect, useState } from 'react';
import { getPendingSubmissions, removePendingSubmission } from '@/lib/utils/offlineQueue';
import { Icon } from '@/components/atoms/Icon/Icon';

export const OfflineSyncManager: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const syncPendingItems = async () => {
    const items = getPendingSubmissions();
    setPendingCount(items.length);

    if (items.length === 0 || !navigator.onLine) return;

    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map((i: any) => i.data || i) }),
      });

      const data = await res.json();
      if (data.success && data.syncedCount > 0) {
        // Clear synced items from storage
        items.forEach((item: any) => {
          removePendingSubmission(item.id);
        });

        setPendingCount(0);
        setSyncToast(`✓ Synced ${data.syncedCount} offline report${data.syncedCount > 1 ? 's' : ''} to database!`);
        setTimeout(() => setSyncToast(null), 5000);
      }
    } catch (err) {
      console.warn('Sync failed, will retry on next connection event:', err);
    }
  };

  useEffect(() => {
    setIsOnline(navigator.onLine);
    setPendingCount(getPendingSubmissions().length);

    const handleOnline = () => {
      setIsOnline(true);
      syncPendingItems();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setPendingCount(getPendingSubmissions().length);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (navigator.onLine) {
      syncPendingItems();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {/* Offline Status Bar */}
      {!isOnline && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#18181b',
          borderBottom: '1px solid #3f3f46',
          color: '#ffffff',
          padding: '6px 16px',
          textAlign: 'center',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--weight-semibold)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.6)'
        }}>
          <Icon name="WifiOff" size={14} style={{ color: '#ffffff' }} />
          <span>Offline Mode Active — Reports saved locally and synced when online ({pendingCount} pending).</span>
        </div>
      )}

      {/* Sync Success Toast */}
      {syncToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          backgroundColor: '#ffffff',
          color: '#000000',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.8)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--weight-bold)',
          zIndex: 300,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 0.2s ease',
          border: '1px solid #ffffff'
        }}>
          <Icon name="CheckCircle" size={18} style={{ color: '#000000' }} />
          <span>{syncToast}</span>
        </div>
      )}
    </>
  );
};
