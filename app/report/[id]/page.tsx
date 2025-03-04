"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { FileText, Share2, ArrowLeft } from 'lucide-react'
import { AuditResults } from '@/components/audit/AuditResults'
import { CtaBanner } from '@/components/home/CtaBanner'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import type { AuditData } from '@/types/audit'

export default function ReportPage() {
  const router = useRouter()
  const { id } = useParams() as { id: string }
  const [report, setReport] = useState<AuditData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReport() {
      try {
        setLoading(true)
        const response = await fetch(`/api/report/${id}`)
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        
        const data = await response.json()
        setReport(data)
      } catch (err) {
        console.error('Failed to fetch report:', err)
        setError('Nepodařilo se načíst report. Report buď neexistuje nebo došlo k chybě.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchReport()
    }
  }, [id])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-blue-600 py-6">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Audit Report</h1>
          <Button 
            variant="outline" 
            className="bg-white hover:bg-blue-50"
            onClick={() => router.push('/audit')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zpět na Audit
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-lg text-gray-600">Načítám výsledky auditu...</p>
          </div>
        ) : error ? (
          <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-20 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Report nenalezen</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={() => router.push('/audit')}>
                Vytvořit nový audit
              </Button>
            </div>
          </div>
        ) : report ? (
          <AuditResults data={report} />
        ) : null}
      </div>

      <CtaBanner />
    </div>
  )
}
