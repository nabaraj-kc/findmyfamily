'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/atoms/Icon/Icon';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      // Redirect to home or login page
      const currentLocale = window.location.pathname.split('/')[1];
      router.push(`/${currentLocale}/admin/login`);
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      style={{ 
        background: 'none', 
        border: 'none', 
        color: '#ef4444', 
        cursor: 'pointer',
        display: 'flex', 
        alignItems: 'center', 
        gap: 'var(--space-2)',
        fontWeight: 'var(--weight-medium)',
        fontSize: 'var(--text-base)'
      }}
    >
      <Icon name="LogOut" size={18} />
      Logout
    </button>
  );
}
