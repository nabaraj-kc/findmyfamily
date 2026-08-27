'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@/components/atoms/Icon/Icon';
import { Button } from '@/components/atoms/Button/Button';

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if the prompt was dismissed recently (client-side only)
    if (typeof window !== 'undefined') {
      const isDismissed = localStorage.getItem('pwa-prompt-dismissed') === 'true';
      setDismissed(isDismissed);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We no longer need the prompt. Clear it up.
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const handleDismiss = () => {
    setIsInstallable(false);
    setDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pwa-prompt-dismissed', 'true');
    }
  };

  if (!isInstallable || dismissed) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)',
      maxWidth: '400px',
      backgroundColor: '#1c1917',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid #44403c',
      padding: '16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            backgroundColor: '#292524', 
            padding: '10px', 
            borderRadius: '12px',
            color: '#ffffff'
          }}>
            <Icon name="DownloadCloud" size={24} />
          </div>
          <div>
            <h4 style={{ color: '#ffffff', margin: 0, fontSize: '15px', fontWeight: 'bold' }}>
              Install App
            </h4>
            <p style={{ color: '#a8a29e', margin: 0, fontSize: '13px', marginTop: '2px' }}>
              Access offline during network outages
            </p>
          </div>
        </div>
        <button 
          onClick={handleDismiss}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#78716c',
            cursor: 'pointer',
            padding: '4px'
          }}
          aria-label="Close"
        >
          <Icon name="X" size={18} />
        </button>
      </div>
      
      <Button 
        variant="primary" 
        onClick={handleInstallClick}
        style={{ width: '100%' }}
      >
        Install Now
      </Button>
    </div>
  );
};
