'use client'

import { FormEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type FormField = {
  label: string
  name: string
  type?: 'text' | 'email' | 'tel' | 'textarea'
  required?: boolean
  minLength?: number
}

type MailtoFormProps = {
  subject: string
  submitLabel?: string
  successMessage?: string
  fields: FormField[]
  className?: string
  style?: React.CSSProperties
}

export function MailtoForm({
  subject,
  submitLabel = 'Submit',
  successMessage,
  fields,
  className = '',
  style,
}: MailtoFormProps) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [message, setMessage] = useState('')

  function updateField(name: string, value: string) {
    setValues((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const body = fields
      .map((field) => {
        const value = values[field.name] || ''
        return `${field.label}:\n${value}`
      })
      .join('\n\n')

    const mailtoUrl =
      `mailto:?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`

    window.location.href = mailtoUrl

    setMessage(
      successMessage ||
        'Your email draft is ready. Please review and send it.',
    )
  }

  return (
    <form onSubmit={handleSubmit} className={className} style={style}>
      {fields.map((field) => {
        const fieldId = `membership-${field.name}`

        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.label}
              {field.required && (
                <span className="ml-1 text-destructive">*</span>
              )}
            </Label>

            {field.type === 'textarea' ? (
              <Textarea
                id={fieldId}
                name={field.name}
                value={values[field.name] || ''}
                onChange={(event) =>
                  updateField(field.name, event.target.value)
                }
                required={field.required}
                minLength={field.minLength}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className="min-h-32 resize-y"
              />
            ) : (
              <Input
                id={fieldId}
                name={field.name}
                type={field.type || 'text'}
                value={values[field.name] || ''}
                onChange={(event) =>
                  updateField(field.name, event.target.value)
                }
                required={field.required}
                minLength={field.minLength}
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            )}
          </div>
        )
      })}

      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>

      {message && (
        <p
          role="status"
          className="rounded-lg bg-muted px-4 py-3 text-sm leading-6 text-muted-foreground"
        >
          {message}
        </p>
      )}
    </form>
  )
}