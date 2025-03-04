"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function ReportLandingPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to audit page after a short delay
    const timer = setTimeout(() => {
      router.push('/audit')
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [router])
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Přesměrování na audit
        </h1>
        <p className="text-gray-600 mb-8">
          Pro vytvoření nebo zobrazení reportu potřebujeme platné ID reportu. 
          Přesměrováváme vás na stránku auditu webu.
        </p>
        <Button onClick={() => router.push('/audit')}>
          Přejít na audit
        </Button>
      </div>
    </div>
  )
}
