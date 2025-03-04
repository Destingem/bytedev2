import { NextResponse } from 'next/server'
import { getAuditData, refreshAuditForUrl } from '@/lib/services/server-audit-service'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const refresh = searchParams.get('refresh') === 'true';
    
    // Add cache-control header based on request
    const headers = new Headers();
    if (refresh) {
      // No caching for refresh requests
      headers.set('Cache-Control', 'no-store, must-revalidate');
    } else {
      // Cache for 24 hours, but allow revalidation
      headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
    }

    if (!url) {
      return NextResponse.json({
        error: "URL je povinný parametr"
      }, {
        status: 400,
        headers
      });
    }

    // If refresh parameter is provided, force refresh the data
    const auditData = refresh 
      ? await refreshAuditForUrl(url)
      : await getAuditData(url);

    if (!auditData) {
      return NextResponse.json({
        error: "Nepodařilo se analyzovat zadaný web"
      }, {
        status: 422,
        headers
      });
    }

    // Add cache timestamp header to help clients know when data was cached
    if (auditData.timestamp) {
      headers.set('X-Cache-Timestamp', auditData.timestamp);
    }

    return NextResponse.json(auditData, { headers });
  } catch (error) {
    console.error("Audit data API error:", error);
    return NextResponse.json({
      error: "Chyba při zpracování auditu"
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }
}
