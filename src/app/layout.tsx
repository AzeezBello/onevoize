import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: `${siteConfig.displayName} | ${siteConfig.tagline}`,
  description: siteConfig.description,
  applicationName: siteConfig.displayName,
  openGraph: {
    title: siteConfig.displayName,
    description: siteConfig.description,
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <><Navbar/><main>{children}</main><Footer/></>;
}
