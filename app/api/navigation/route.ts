import { scanPages } from '@/utils/navigation-scanner'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const pages = await scanPages()
    return NextResponse.json(pages)
  } catch (error) {
    console.error('Navigation scanning error:', error)
    return NextResponse.json(
      { error: 'Failed to scan navigation' },
      { status: 500 }
    )
  }
}
