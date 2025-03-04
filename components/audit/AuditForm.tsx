"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { extractDomain } from "@/lib/utils"

interface AuditFormProps {
  onSubmit: (url: string) => void
  isLoading: boolean
}

export function AuditForm({ onSubmit, isLoading }: AuditFormProps) {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Add protocol if missing
    let formattedUrl = url.trim()
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl
    }

    // Simple URL validation
    try {
      new URL(formattedUrl)
      
      // Save to localStorage history
      try {
        const domain = extractDomain(formattedUrl)
        const historyItem = {
          domain,
          url: formattedUrl,
          timestamp: new Date().toISOString()
        }
        
        const savedHistory = localStorage.getItem("auditHistory") || "[]"
        const parsedHistory = JSON.parse(savedHistory)
        
        // Add to beginning and maintain uniqueness by domain
        const filteredHistory = parsedHistory.filter(
          (item: any) => item.domain !== domain
        )
        const newHistory = [historyItem, ...filteredHistory]
        localStorage.setItem("auditHistory", JSON.stringify(newHistory))
      } catch (e) {
        console.error("Failed to save to history", e)
      }
      
      onSubmit(formattedUrl)
    } catch (e) {
      setError("Zadejte platnou URL adresu")
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
        <div className="flex-1">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="www.vase-domena.cz"
            className="h-12"
            disabled={isLoading}
            required
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <Button 
          type="submit" 
          size="lg" 
          className="h-12"
          disabled={isLoading || !url.trim()}
        >
          {isLoading ? "Analyzuji..." : "Spustit audit"}
          {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </form>
    </div>
  )
}
