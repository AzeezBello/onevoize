import type { MetadataRoute } from 'next'

const publicRoutes = ['', '/about', '/committee', '/campaigns', '/constitution', '/contact', '/donate', '/events', '/exco', '/gallery', '/membership', '/programs', '/volunteer']

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return publicRoutes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }))
}
