import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { siteConfig } from '@/lib/site'

export const alt = siteConfig.displayName
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), 'src/app/og-logo.png'))
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', gap: 56, padding: '64px 72px', color: '#fff', background: 'linear-gradient(135deg, #050a4d 0%, #0b1a9e 50%, #0e2fd6 100%)', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 22 }}>
          <div style={{ fontSize: 22, letterSpacing: 6, textTransform: 'uppercase', color: '#ffd700' }}>Friends Club of Lagos</div>
          <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1, textTransform: 'uppercase' }}>One Voize</div>
          <div style={{ fontSize: 30, lineHeight: 1.35, color: 'rgba(255,255,255,0.88)', maxWidth: 620 }}>{`${siteConfig.tagline} Friendship, mutual support and practical service for a community that shows up together.`}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 340, height: 340, borderRadius: 36, background: '#fff', padding: 28 }}>
          <img src={logoSrc} width={284} height={235} alt="" />
        </div>
      </div>
    ),
    size,
  )
}
