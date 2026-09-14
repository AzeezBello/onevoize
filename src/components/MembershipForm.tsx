import { MailtoForm } from '@/components/MailtoForm'

export function MembershipForm() {
  return <MailtoForm subject="New membership application" submitLabel="Open email application" successMessage="Your email draft is ready. Please review it and send it from your email app." fields={[{ label: 'Full name', name: 'full-name', required: true, minLength: 2 }, { label: 'Email address', name: 'email', type: 'email', required: true }, { label: 'Phone number', name: 'phone', type: 'tel', required: true }, { label: 'Residential address', name: 'address', required: true, minLength: 8 }, { label: 'Occupation', name: 'occupation', required: true, minLength: 2 }, { label: 'Why would you like to join?', name: 'reason', type: 'textarea', required: true, minLength: 20 }]} className="membership-form" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 22, padding: 28, display: 'grid', gap: 16 }}/>
}
