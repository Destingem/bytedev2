"use client"

import { CtaBanner } from '@/components/home/CtaBanner'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { AuditResultsWrapper } from './AuditResultsWrapper'

export function DomainAuditClient({
  domain,
  url
}: {
  domain: string
  url: string
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-blue-600 py-6">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Audit webu: {domain}</h1>
          <Link href="/audit">
            <Button 
              variant="outline" 
              className="bg-white hover:bg-blue-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zpět na Audit
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <AuditResultsWrapper url={url} domain={domain} />

      <CtaBanner />
    </div>
  )
}
