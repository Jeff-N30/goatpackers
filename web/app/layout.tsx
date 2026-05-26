import type { Metadata } from 'next';
import './globals.css';
import PublicChrome from '@/components/PublicChrome';
import PageViewTracker from '@/components/PageViewTracker';

export const metadata: Metadata = {
  title: 'Goatpackers Lebanon',
  description: "A community of hikers exploring Lebanon's mountains and trails together.",
  keywords: ['hiking', 'Lebanon', 'trails', 'mountains', 'outdoors', 'goatpackers'],
  icons: {
    icon: '/goatpackers_logo_dark.png',
    apple: '/goatpackers_logo_dark.png',
  },
  openGraph: {
    title: 'Goatpackers Lebanon',
    description: "Exploring Lebanon's trails together.",
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <PageViewTracker />
        <PublicChrome>{children}</PublicChrome>
      </body>
    </html>
  );
}
