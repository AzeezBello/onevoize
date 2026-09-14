'use client'

import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PrintFormButton() {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full sm:w-auto"
      onClick={() => window.print()}
    >
      <Printer className="mr-2 h-4 w-4" />
      Download / Print PDF Form
    </Button>
  )
}