import { NextResponse } from 'next/server';
import { getAuditData } from '@/lib/services/server-audit-service';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Extract URL from ID
    const urlPart = id.split('-').slice(1).join('-');
    const url = decodeURIComponent(urlPart);
    
    // Get report data
    const reportData = await getAuditData(url);
    
    if (!reportData) {
      return NextResponse.json(
        { error: 'Failed to generate audit data' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(reportData);
  } catch (error) {
    console.error('Report API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate or retrieve report' },
      { status: 500 }
    );
  }
}