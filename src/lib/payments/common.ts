import crypto from 'node:crypto'

export function amountToMinorUnit(amount: number) {
  return Math.round(amount * 100)
}

export function newReference(gateway: string) {
  const prefix = gateway === 'paystack' ? 'TGBP-PS' : 'TGBP-FW'
  return `${prefix}-${Date.now()}-${crypto.randomBytes(5).toString('hex')}`
}

export function safeEqualHexOrBase64(a: string, b: string) {
  const aa = Buffer.from(a)
  const bb = Buffer.from(b)
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb)
}
