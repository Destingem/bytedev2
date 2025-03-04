"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Calendar, ExternalLink, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { extractDomain } from "@/lib/utils"

type AuditHistoryItem = {
  domain: string
  url: string
  timestamp: string
}

export function AuditHistory() {
  const [history, setHistory] = useState<AuditHistoryItem[]>([])

  useEffect(() => {
    // Load audit history from localStorage
    try {
      const savedHistory = localStorage.getItem("auditHistory")
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory)
        setHistory(parsedHistory.slice(0, 6)) // Show only the last 6 audits
      }
    } catch (error) {
      console.error("Failed to load audit history", error)
    }
  }, [])

  if (history.length === 0) {
    return null
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('cs-CZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Nedávné audity</h2>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {history.map((item, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-40 w-full bg-gradient-to-br from-blue-50 to-blue-100 border-b flex items-center justify-center">
                <Link href={`/audit/${item.domain}`} className="w-full h-full flex items-center justify-center">
                  {/* Use a fallback visual instead of an image */}
                  <div className="text-center px-4">
                    <div className="w-16 h-16 rounded-full mx-auto bg-blue-100 border border-blue-200 flex items-center justify-center mb-2">
                      <img 
                        src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=64`} 
                        alt=""
                        className="w-8 h-8"
                        onError={(e) => {
                          // Fallback for failed favicon
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = `<Globe className="w-8 h-8 text-blue-500" />`;
                        }}
                      />
                    </div>
                    <h3 className="font-medium text-blue-900">{item.domain}</h3>
                  </div>
                </Link>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <img 
                    src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=32`} 
                    alt=""
                    className="w-4 h-4"
                  />
                  {item.domain}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pb-3">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>
                    {formatDate(item.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-blue-600 transition-colors"
                  >
                    {item.url}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </p>
              </CardContent>
              
              <CardFooter className="pt-0">
                <Link href={`/audit/${item.domain}`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full">
                    Zobrazit audit
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
