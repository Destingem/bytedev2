"use client"

import { useState, useEffect } from "react"
import { AuditResults } from './AuditResults'
import { AuditLoading } from './AuditLoading'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { AuditData } from '@/types/audit'

export function AuditResultsWrapper({
  url,
  domain
}: {
  url: string
  domain: string
}) {
  const [auditData, setAuditData] = useState<AuditData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAuditData()
  }, [url])

  async function fetchAuditData(refresh = false) {
    try {
      setError(null)
      if (!refresh) setIsLoading(true)
      else setIsRefreshing(true)

      const endpoint = `/api/audit/data?url=${encodeURIComponent(url)}${refresh ? '&refresh=true' : ''}`
      const response = await fetch(endpoint)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch audit data')
      }
      
      const data = await response.json()
      setAuditData(data)
    } catch (err: any) {
      console.error("Error fetching audit data:", err)
      setError(err.message || 'An error occurred while fetching audit data')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  function handleRefresh() {
    fetchAuditData(true)
  }

  // Calculate if data is stale (older than 24 hours)
  const isStale = auditData ? 
    (new Date().getTime() - new Date(auditData.timestamp).getTime() > 24 * 60 * 60 * 1000) : 
    false

  if (isLoading) {
    return <AuditLoading />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 max-w-2xl w-full">
          <h2 className="text-xl font-bold mb-2">Chyba při zpracování auditu</h2>
          <p>{error}</p>
          <Button 
            onClick={() => fetchAuditData()}
            className="mt-4"
          >
            Zkusit znovu
          </Button>
        </div>
      </div>
    )
  }

  if (!auditData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-6 max-w-2xl w-full">
          <h2 className="text-xl font-bold mb-2">Data nejsou dostupná</h2>
          <p>Nepodařilo se načíst data auditu pro doménu {domain}.</p>
          <Button 
            onClick={() => fetchAuditData(true)}
            className="mt-4"
          >
            Zkusit znovu
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8">
        {/* Data freshness indicator and refresh button */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-500">
            Data z: {new Date(auditData.timestamp).toLocaleString('cs-CZ')}
            {isStale && (
              <span className="ml-2 text-amber-600 font-medium">
                (Zastaralá data)
              </span>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Obnovuji...' : 'Obnovit data'}
          </Button>
        </div>

        <AuditResults auditData={auditData} />
      </div>
    </div>
  )
}
