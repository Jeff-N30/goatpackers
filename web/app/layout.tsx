import type { Metadata } from 'next';
import './globals.css';
import PublicChrome from '@/components/PublicChrome';
import PageViewTracker from '@/components/PageViewTracker';
import ScrollTop from '@/components/ScrollTop';
import InviteRedirect from '@/components/InviteRedirect';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://goatpackers.lblabs.net';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  verification: { google: 'xHPddgeiUlrX8i11BdZd0OudA0sDC-Z3Hfnf-JpnPAA' },
  title: {
    default: 'Goatpackers Lebanon',
    template: '%s | Goatpackers Lebanon',
  },
  description:
    "Goatpackers is Lebanon's premier hiking club — exploring mountain trails, cedar forests, canyon walks, and alpine peaks together. Join our community for weekly group hikes across the Lebanese mountains.",
  keywords: [
    'hiking Lebanon',
    'hiking club Lebanon',
    'hiking group Lebanon',
    'Goatpackers',
    'Goatpackers Lebanon',
    'Lebanon hiking trails',
    'Lebanese mountains hiking',
    'mountain hiking Lebanon',
    'outdoor activities Lebanon',
    'hiking community Lebanon',
    'weekend hikes Lebanon',
    'cedar forest Lebanon',
    'Qornet el Sawda hike',
    'Chouf cedar reserve',
    'Wadi Qannoubine',
    'Kadisha valley hike',
    'Lebanon nature',
    'trail running Lebanon',
    'pack goats Lebanon',
    'packing goats Lebanon',
    'packing goats for hiking Lebanon',
    'packing goats Lebanon',
    'camping Lebanon',
    'survival skills Lebanon',

  ],
  authors: [{ name: 'Goatpackers Lebanon', url: SITE_URL }],
  creator: 'Goatpackers Lebanon',
  publisher: 'Goatpackers Lebanon',
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Goatpackers Lebanon',
    title: 'Goatpackers Lebanon — Hiking Club & Mountain Trails',
    description:
      "Lebanon's hiking community — exploring mountain trails, cedar forests, and canyon walks together. Join us for weekly group hikes.",
    images: [
      {
        url: '/background.jpeg',
        width: 1200,
        height: 630,
        alt: 'Goatpackers Lebanon — Hiking in the Lebanese mountains',
      },
    ],

    
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Goatpackers Lebanon — Hiking Club',
    description: "Lebanon's hiking community — exploring mountain trails together.",
    images: ['/background.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SportsOrganization',
  name: 'Goatpackers Lebanon',
  alternateName: 'Goatpackers',
  description:
    "Lebanon's hiking club exploring mountain trails, cedar forests, canyon walks, and alpine peaks together.",
  url: SITE_URL,
  logo: `${SITE_URL}/goatpackers_logo_dark.png`,
  image: `${SITE_URL}/background.jpeg`,
  sport: 'Hiking',
  foundingDate: '2026',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'LB',
    addressLocality: 'Lebanon',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+961-76-369-668',
      contactType: 'customer service',
      availableLanguage: ['English', 'Arabic', 'French'],
    },
    {
      '@type': 'ContactPoint',
      email: 'goatpackers.lb@gmail.com',
      contactType: 'customer service',
    },
  ],
  sameAs: ['https://www.instagram.com/goatpackers.lb'],
  areaServed: {
    '@type': 'Country',
    name: 'Lebanon',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <ScrollTop />
        <InviteRedirect />
        <PageViewTracker />
        <PublicChrome>{children}</PublicChrome>
      </body>
    </html>
  );
}
