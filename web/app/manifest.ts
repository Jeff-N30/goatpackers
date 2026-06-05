import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Goatpackers Lebanon',
    short_name: 'Goatpackers',
    description: "Lebanon's hiking club — exploring mountain trails together.",
    start_url: '/',
    display: 'browser',
    background_color: '#f5f3ec',
    theme_color: '#5c6135',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
