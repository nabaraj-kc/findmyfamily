'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@/components/atoms/Icon/Icon';
import { Button } from '@/components/atoms/Button/Button';

export const InstallAppButton: React.FC<{ variant?: 'header' | 'banner' | 'modal' }> = ({ variant = 'header' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Detect if already in standalone PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isInstalled) {
      alert('Find My Family is already installed on your device.');
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowIOSModal(true);
    }
  };

  if (isInstalled) {
    return null;
  }

  return (
    <>
      {variant === 'header' ? (
        <button
          onClick={handleInstallClick}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            backgroundColor: '#18181b',
            border: '1px solid #27272a',
            borderRadius: 'var(--radius-full)',
            color: '#ffffff',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-semibold)',
            cursor: 'pointer',
            transition: 'all var(--duration-fast) ease',
            whiteSpace: 'nowrap'
          }}
          title="Download & install app on your phone"
        >
          <Icon name="Download" size={14} style={{ color: '#a1a1aa' }} />
          <span>Download App</span>
        </button>
      ) : (
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handleInstallClick}
          icon={<Icon name="Smartphone" size={16} />}
        >
          Download App for Offline Use
        </Button>
      )}

      {/* iOS / Browser Install Instructions Modal */}
      {showIOSModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 300,
          padding: 'var(--space-4)'
        }}>
          <div style={{
            backgroundColor: '#0c0c0e',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid #27272a',
            width: '100%',
            maxWidth: '440px',
            padding: 'var(--space-6)',
            boxShadow: 'var(--shadow-xl)',
            color: '#ffffff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Icon name="Smartphone" size={22} style={{ color: '#ffffff' }} />
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)' }}>Install on Your Device</h3>
              </div>
              <button 
                onClick={() => setShowIOSModal(false)}
                style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <p style={{ color: '#a1a1aa', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', lineHeight: 1.5 }}>
              Install <strong>Find My Family</strong> to your phone&apos;s home screen for instant access, emergency hotlines, and 100% offline functionality during network outages.
            </p>

            <div style={{ backgroundColor: '#141417', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', border: '1px solid #27272a' }}>
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#ffffff', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>1</span>
                <span style={{ fontSize: 'var(--text-sm)' }}>Tap the <strong>Share</strong> or <strong>Menu (⋮)</strong> button in your browser.</span>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#ffffff', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>2</span>
                <span style={{ fontSize: 'var(--text-sm)' }}>Select <strong>&quot;Add to Home Screen&quot;</strong> or <strong>&quot;Install App&quot;</strong>.</span>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#ffffff', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>3</span>
                <span style={{ fontSize: 'var(--text-sm)' }}>Launch from your home screen anytime, even with zero cellular signal!</span>
              </div>
            </div>

            <Button variant="primary" onClick={() => setShowIOSModal(false)} fullWidth>
              Got It
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
