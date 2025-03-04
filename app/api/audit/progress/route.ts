import { NextResponse } from "next/server"

// Simple in-memory store for tracking audit progress
// In production, this should use a more persistent solution
const auditProgress: Record<string, { stage: string, progress: number }> = {}

export async function POST(request: Request) {
  try {
    const { auditId, stage, progress } = await request.json()
    
    if (!auditId) {
      return NextResponse.json(
        { error: "Audit ID is required" },
        { status: 400 }
      )
    }
    
    auditProgress[auditId] = { stage, progress: progress || 0 }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update audit progress" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const auditId = url.searchParams.get('auditId')
    
    if (!auditId) {
      return NextResponse.json(
        { error: "Audit ID is required" },
        { status: 400 }
      )
    }
    
    const progress = auditProgress[auditId] || { stage: "init", progress: 0 }
    
    return NextResponse.json(progress)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get audit progress" },
      { status: 500 }
    )
  }
}
