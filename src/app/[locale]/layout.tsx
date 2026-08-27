import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { PreferencesProvider } from '@/context/PreferencesContext';
import { AudioPlayerProvider } from '@/context/AudioPlayerContext';
import { Header, Footer, RotatingAlert } from '@/components/organisms';
import { OfflineSyncManager } from '@/components/molecules/OfflineSyncManager/OfflineSyncManager';
import { InstallPrompt } from '@/components/molecules/InstallPrompt/InstallPrompt';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Find My Family',
  description: 'Humanitarian disaster-response platform for Nepal',
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#000000',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // @ts-ignore
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <PreferencesProvider>
        <AudioPlayerProvider>
          <OfflineSyncManager />
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <InstallPrompt />
            <RotatingAlert />
            <Header />
            <main style={{ flex: 1 }}>
              {children}
            </main>
            <Footer />
          </div>
        </AudioPlayerProvider>
      </PreferencesProvider>
    </NextIntlClientProvider>
  );
}
