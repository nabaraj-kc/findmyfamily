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
      { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
