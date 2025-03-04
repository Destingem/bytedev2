import { NextResponse } from "next/server"
import { getAuditData } from '@/lib/services/server-audit-service'
import { createHash } from 'crypto'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json(
        { error: "URL je povinný parametr" },
        { status: 400 }
      )
    }

    // Generate a redirect URL instead of processing here
    const domain = new URL(url).hostname
    const redirectUrl = `/audit/${domain}?url=${encodeURIComponent(url)}`
    
    return NextResponse.json({ redirectUrl })
  } catch (error) {
    console.error("Audit API error:", error)
    return NextResponse.json(
      { error: "Chyba při zpracování auditu" },
      { status: 500 }
    )
  }
}

// Add endpoint for getting AI recommendations separately
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const auditDataStr = url.searchParams.get('auditData')
    
    if (!auditDataStr) {
      return NextResponse.json(
        { error: "Chybí data auditu" },
        { status: 400 }
      )
    }
    
    try {
      const auditData = JSON.parse(auditDataStr)
      const aiRecommendations = await generateAiReport(auditData)
      
      return NextResponse.json({ aiRecommendations })
    } catch (error) {
      console.error("AI recommendation generation error:", error)
      return NextResponse.json(
        { 
          aiRecommendations: {
            summary: "Nepodařilo se vygenerovat AI doporučení. Zkuste to prosím později.",
            priorities: [
              {
                title: "Prohlédněte si výsledky auditu",
                description: "I bez AI doporučení můžete prozkoumat jednotlivé metriky a kontroly v záložkách výše."
              }
            ]
          }
        }
      )
    }
  } catch (error) {
    console.error("AI recommendations API error:", error)
    return NextResponse.json(
      { error: "Chyba při generování AI doporučení" },
      { status: 500 }
    )
  }
}
