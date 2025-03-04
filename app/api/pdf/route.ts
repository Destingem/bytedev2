import { NextRequest, NextResponse } from "next/server";
import { getAuditData } from "@/lib/services/server-audit-service";
import { generatePdfReport } from "@/lib/services/pdf-service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");
  
  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }
  
  try {
    // Get audit data
    const auditData = await getAuditData(url);
    
    if (!auditData) {
      return NextResponse.json({ error: "Failed to retrieve audit data" }, { status: 404 });
    }
    
    // Generate PDF on the server side
    const pdfBlob = await generatePdfReport(auditData);
    
    // Return PDF as binary data with appropriate headers
    return new NextResponse(pdfBlob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="audit-${url.replace(/^https?:\/\//, "").replace(/[^\w]/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf"`
      }
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
