import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { siteConfig } from '@/lib/site';
import { Noto_Sans, Playfair_Display } from 'next/font/google';
import { cn } from '@/lib/utils';

const notoSans = Noto_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });

// Applies the saved theme before first paint so there is no flash and no hydration mismatch.
const themeScript = `try{var t=localStorage.getItem('one-voize-theme');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t}catch(e){}`;

export const metadata: Metadata = {
  title: `${siteConfig.displayName} | ${siteConfig.tagline}`,
  description: siteConfig.description,
  applicationName: siteConfig.displayName,
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  keywords: ['One Voize Friends Club of Lagos', 'community support', 'charity Lagos', 'donations Nigeria', 'Global Voize Club'],
  authors: [{ name: siteConfig.displayName }],
  creator: siteConfig.displayName,
  robots: { index: true, follow: true },
  openGraph: {
    title: siteConfig.displayName,
    description: siteConfig.description,
    type: 'website',
    siteName: siteConfig.displayName,
    images: [{ url: '/images/ONE VOICE FRONT PAGE.jpg', width: 1200, height: 533, alt: siteConfig.displayName }],
  },
  twitter: { card: 'summary_large_image', title: siteConfig.displayName, description: siteConfig.description },
  icons: {
    icon: '/images/ONE VOICE LOGO.png',
    shortcut: '/images/ONE VOICE LOGO.png',
    apple: '/images/ONE VOICE LOGO.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0b1a9e',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(notoSans.variable, playfair.variable)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
