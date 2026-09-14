import { MailtoForm } from '@/components/MailtoForm'

export function MembershipForm() {
  return <MailtoForm subject="New membership application" submitLabel="Open email application" successMessage="Your email draft is ready. Please review it and send it from your email app." fields={[{ label: 'Full name', name: 'full-name', required: true }, { label: 'Email address', name: 'email', type: 'email', required: true }, { label: 'Phone number', name: 'phone', type: 'tel', required: true }, { label: 'Residential address', name: 'address', required: true }, { label: 'Occupation', name: 'occupation', required: true }, { label: 'Why would you like to join?', name: 'reason', type: 'textarea', required: true }]} className="membership-form" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 22, padding: 28, display: 'grid', gap: 16 }}/>
}
