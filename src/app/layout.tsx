import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { siteConfig } from '@/lib/site';
import { Noto_Sans, Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";

const montserrat = Montserrat({subsets:['latin'],variable:'--font-heading'});

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'});

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
  },
  twitter: { card: 'summary_large_image', title: siteConfig.displayName, description: siteConfig.description },
  icons: {
    icon: '/images/ONE VOICE LOGO.png',
    shortcut: '/images/ONE VOICE LOGO.png',
    apple: '/images/ONE VOICE LOGO.png',
  },
  manifest: '/images/ONE VOICE LOGO.png',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1119a8',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={cn("font-sans", notoSans.variable, montserrat.variable)}><body><Navbar/><main>{children}</main><Footer/></body></html>;
}
