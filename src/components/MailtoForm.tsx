'use client'

import { FormEvent, useState } from 'react'
import { siteConfig } from '@/lib/site'

type MailtoField = {
  label: string
  name: string
  type?: 'text' | 'email' | 'tel' | 'textarea'
  required?: boolean
}

type MailtoFormProps = {
  subject: string
  submitLabel: string
  successMessage: string
  fields: MailtoField[]
  className?: string
  style?: React.CSSProperties
}

export function MailtoForm({ subject, submitLabel, successMessage, fields, className, style }: MailtoFormProps) {
  const [submitted, setSubmitted] = useState(false)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const body = fields.map(field => `${field.label}: ${data.get(field.name) || ''}`).join('\n\n')
    window.location.href = `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSubmitted(true)
  }

  return <form onSubmit={submit} className={className} style={style}>
    {fields.map(field => field.type === 'textarea' ? <label key={field.name} style={{ display: 'grid', gap: 7, fontWeight: 700, fontSize: 14 }}>{field.label}<textarea name={field.name} required={field.required} rows={5} placeholder={field.label} style={{ padding: 13, border: '1px solid var(--border)', borderRadius: 10, background: 'var(--card)', color: 'var(--foreground)' }}/></label> : <label key={field.name} style={{ display: 'grid', gap: 7, fontWeight: 700, fontSize: 14 }}>{field.label}<input name={field.name} type={field.type || 'text'} required={field.required} placeholder={field.label} style={{ padding: 13, border: '1px solid var(--border)', borderRadius: 10, background: 'var(--card)', color: 'var(--foreground)' }}/></label>)}
    <button className="btn btn-primary" type="submit" style={{ border: 0, cursor: 'pointer' }}>{submitted ? 'Email draft opened' : submitLabel}</button>
    {submitted && <p role="status" style={{ color: 'var(--brand)', margin: 0 }}>{successMessage}</p>}
  </form>
}