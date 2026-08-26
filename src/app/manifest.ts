import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Find My Family — Nepal Missing Persons Platform',
    short_name: 'Find My Family',
    description: 'Report and search for missing persons during Nepal flood disasters. Reunite families.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F8F6F2',
    theme_color: '#1C1917', // Updated to match Liquid Glass dark premium theme
    orientation: 'portrait-primary',
    categories: ['social', 'utilities'],
    lang: 'ne',
    icons: [
      { src: '/icons/icon-72.png', sizes: '72x72', type: 'image/png' },
      { src: '/icons/icon-96.png', sizes: '96x96', type: 'image/png' },
      { src: '/icons/icon-128.png', sizes: '128x128', type: 'image/png' },
      { src: '/icons/icon-144.png', sizes: '144x144', type: 'image/png' },
      { src: '/icons/icon-152.png', sizes: '152x152', type: 'image/png' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-384.png', sizes: '384x384', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
