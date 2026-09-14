'use client'

import { MembershipForm } from '@/components/MembershipForm'

export default function Membership() {
  return <main>
    <section className="section" style={{ background: 'var(--surface)' }}><div className="container"><div className="eyebrow">Membership Form</div><h1 className="serif" style={{ fontSize: 'clamp(48px,7vw,78px)', lineHeight: 1 }}>Join Global Voize Club.</h1><p style={{ maxWidth: 700, color: 'var(--muted)', fontSize: 18, lineHeight: 1.7 }}>Complete the online application below. Membership is open to responsible adults who share the club&apos;s values of solidarity and service.</p></div></section>
    <section className="section"><div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, .8fr) minmax(0, 1.2fr)', gap: 60, alignItems: 'start' }}><div><div className="eyebrow">Before you apply</div><h2 className="serif" style={{ fontSize: 38 }}>Membership starts with shared responsibility.</h2><p style={{ color: 'var(--muted)', lineHeight: 1.8 }}>New members are screened through the appointed committee and should be known to an existing member. Please review the club constitution before applying.</p><button type="button" className="btn btn-light" onClick={() => window.print()}>Download / print PDF form</button></div><MembershipForm/></div></section>
  </main>
}
