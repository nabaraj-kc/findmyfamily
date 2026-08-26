import type { Metadata } from 'next'
import { Noto_Sans, Noto_Sans_Devanagari, Lora } from 'next/font/google'
import '@/styles/globals.css'

const notoSans = Noto_Sans({ subsets: ['latin'], variable: '--font-noto-sans', display: 'swap' })
const notoSansDevanagari = Noto_Sans_Devanagari({ subsets: ['devanagari'], variable: '--font-noto-sans-devanagari', display: 'swap' })
const lora = Lora({ subsets: ['latin'], variable: '--font-lora', display: 'swap' })

export const metadata: Metadata = {
  title: {
    template: '%s | Find My Family',
    default: 'Find My Family — Nepal Missing Persons Platform',
  },
  description: 'Report and search for missing persons during Nepal flood disasters. Reunite families. हराएका व्यक्तिहरूको खोजी र परिवार पुनर्मिलन।',
  keywords: ['Nepal', 'missing persons', 'flood', 'disaster', 'family reunification', 'हराएको', 'खोजी'],
  openGraph: {
    type: 'website',
    locale: 'ne_NP',
    siteName: 'Find My Family',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ne" className={`${notoSans.variable} ${notoSansDevanagari.variable} ${lora.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
