import { NextResponse } from "next/server";

// Keep track of audits with a simple in-memory store
// This should be replaced with a proper database in production
const auditHistory = new Map<string, {
  domain: string;
  url: string;
  timestamp: string;
  performance: number;
  seo: number;
}>();

export async function GET() {
  try {
    // Convert the Map values to an array and sort by timestamp (newest first)
    const history = Array.from(auditHistory.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Return the most recent 10 entries
    return NextResponse.json(history.slice(0, 10));
  } catch (error) {
    console.error("Error fetching audit history:", error);
    return NextResponse.json({ error: "Failed to fetch audit history" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auditData = await request.json();
    recordAudit(auditData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error recording audit:", error);
    return NextResponse.json({ error: "Failed to record audit" }, { status: 500 });
  }
}

// Helper function to record an audit in history
// This is not exported as a route handler - it's used internally
function recordAudit(auditData: any) {
  try {
    if (!auditData?.url) return;
    
    const url = auditData.url;
    const domain = new URL(url).hostname;
    
    auditHistory.set(url, {
      domain,
      url,
      timestamp: auditData.timestamp || new Date().toISOString(),
      performance: auditData.performance?.score || 0,
      seo: auditData.seo?.score || 0
    });
  } catch (error) {
    console.error("Error recording audit:", error);
  }
}
