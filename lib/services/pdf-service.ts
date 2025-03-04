import { jsPDF } from "jspdf"
import type { AuditData } from "@/types/audit"
import { addFont } from "@/lib/fonts/pdf-fonts"

// Simple base64 encoded ByteDev logo (just text) - replace with an actual working logo
const LOGO_TEXT = "ByteDev"

export async function generatePdfReport(auditData: AuditData): Promise<Blob> {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })
  
  // Add fonts
  addFont(doc)
  
  // Set up some colors and styles
  const colors = {
    primary: [0, 102, 204],    // Blue
    success: [34, 197, 94],    // Green
    warning: [245, 158, 11],   // Amber
    danger: [239, 68, 68],     // Red
    text: [60, 60, 60],        // Dark gray
    lightText: [120, 120, 120] // Light gray
  }
  
  // Cover page
  doc.setFillColor(245, 247, 250) // Light blue background
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F')
  
  // Instead of using an image logo, let's render a text logo
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  doc.setTextColor(...colors.primary)
  doc.text("ByteDev", 20, 30)
  
  // Title
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  doc.setTextColor(...colors.primary)
  doc.text("Audit webových stránek", 20, 60)
  
  // URL and date
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(14)
  doc.setTextColor(...colors.text)
  doc.text(`Analýza webu: ${auditData.url}`, 20, 75)
  doc.text(`Vygenerováno: ${new Date(auditData.timestamp).toLocaleDateString("cs-CZ", { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 20, 85)
  
  // Summary scores - draw score gauges
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text("Souhrnné hodnocení", 20, 110)
  
  // Score cards in a grid
  const scoreCardWidth = 40
  const scoreCardHeight = 50
  const startX = 20
  const startY = 120
  const gap = 10
  
  // Performance score card
  drawScoreCard(doc, "Performance", auditData.performance.score, startX, startY, colors)
  
  // SEO score card
  drawScoreCard(doc, "SEO", auditData.seo.score, startX + scoreCardWidth + gap, startY, colors)
  
  // Accessibility score card
  drawScoreCard(doc, "Přístupnost", auditData.accessibility.score, startX + 2 * (scoreCardWidth + gap), startY, colors)
  
  // Best Practices score card
  drawScoreCard(doc, "Best Practices", auditData.bestPractices.score, startX + 3 * (scoreCardWidth + gap), startY, colors)
  
  // Add a table of contents
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text("Obsah reportu:", 20, 180)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text("1. AI doporučení", 30, 195)
  doc.text("2. Rychlost a výkon", 30, 205)
  doc.text("3. SEO analýza", 30, 215)
  doc.text("4. Technologie a server", 30, 225)
  
  // Add footer
  addFooter(doc, 1, auditData.url)
  
  // Add AI recommendations page
  doc.addPage()
  addHeader(doc, "AI doporučení")
  
  // AI Summary
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text("Souhrnné doporučení:", 20, 40)
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  const summaryText = doc.splitTextToSize(auditData.aiRecommendations.summary, 170)
  doc.text(summaryText, 20, 50)
  
  // Add priorities
  let yPosition = 50 + summaryText.length * 5 + 10
  
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text("Prioritní úkoly:", 20, yPosition)
  yPosition += 10
  
  auditData.aiRecommendations.priorities.forEach((priority, index) => {
    // Check if we need a new page
    if (yPosition > 270) {
      addFooter(doc, doc.getNumberOfPages(), auditData.url)
      doc.addPage()
      yPosition = 40
      addHeader(doc, "AI doporučení (pokračování)")
    }
    
    // Priority box
    doc.setFillColor(245, 247, 250) // Light blue background
    doc.roundedRect(20, yPosition, 170, 30, 3, 3, 'F')
    
    // Priority number in circle
    doc.setFillColor(...colors.primary)
    doc.circle(30, yPosition + 10, 7, 'F')
    doc.setTextColor(255, 255, 255) // White
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text((index + 1).toString(), 30, yPosition + 10, { align: 'center' })
    
    // Priority title
    doc.setTextColor(...colors.text)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text(priority.title, 40, yPosition + 10)
    
    // Priority description
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    const descriptionText = doc.splitTextToSize(priority.description, 150)
    doc.text(descriptionText, 40, yPosition + 15)
    
    yPosition += 35 // Move to next priority position
  })
  
  addFooter(doc, doc.getNumberOfPages(), auditData.url)
  
  // Add performance metrics page
  doc.addPage()
  addHeader(doc, "Rychlost a výkon")
  
  // Performance score graphic
  drawScoreGauge(doc, auditData.performance.score, 105, 50, 30, colors)
  
  // Core Web Vitals
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text("Core Web Vitals:", 20, 90)
  
  yPosition = 100
  auditData.performance.metrics.forEach((metric, index) => {
    // Metric box
    doc.setFillColor(245, 247, 250) // Light blue background
    doc.roundedRect(20, yPosition, 170, 25, 3, 3, 'F')
    
    // Metric name
    doc.setTextColor(...colors.text)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text(metric.name, 30, yPosition + 10)
    
    // Metric description based on name
    let description = ""
    switch(metric.name) {
      case "LCP": description = "Largest Contentful Paint - Doba načtení největšího obsahu"; break;
      case "FID": description = "First Input Delay - Prodleva prvního vstupu"; break;
      case "CLS": description = "Cumulative Layout Shift - Kumulativní posun rozložení"; break;
      case "TTI": description = "Time to Interactive - Čas do interaktivity"; break;
      case "Speed Index": description = "Index rychlosti zobrazení obsahu"; break;
      case "Total Blocking Time": description = "Celkový čas blokování"; break;
    }
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(description, 30, yPosition + 18)
    
    // Metric value with color based on status
    let valueColor;
    if (metric.status === "good") valueColor = colors.success;
    else if (metric.status === "needs-improvement") valueColor = colors.warning;
    else valueColor = colors.danger;
    
    doc.setTextColor(...valueColor)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text(`${metric.value} ${metric.unit}`, 160, yPosition + 10, { align: 'right' })
    
    // Status indicator
    let statusText = metric.status === "good" ? "Dobré" : 
                    metric.status === "needs-improvement" ? "Průměrné" : "Špatné";
    
    doc.setFontSize(9)
    doc.text(statusText, 160, yPosition + 18, { align: 'right' })
    
    yPosition += 30 // Move to next metric position
  })
  
  addFooter(doc, doc.getNumberOfPages(), auditData.url)
  
  // Add SEO page
  doc.addPage()
  addHeader(doc, "SEO analýza")
  
  // SEO score graphic
  drawScoreGauge(doc, auditData.seo.score, 105, 50, 30, colors)
  
  // SEO checks
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text("SEO kontroly:", 20, 90)
  
  yPosition = 100
  auditData.seo.checks.forEach((check, index) => {
    // Check if we need a new page
    if (yPosition > 250) {
      addFooter(doc, doc.getNumberOfPages(), auditData.url)
      doc.addPage()
      yPosition = 40
      addHeader(doc, "SEO analýza (pokračování)")
    }
    
    // SEO check box
    const boxFill = check.status === "passed" ? [240, 249, 244] : [254, 242, 242]; // Light green or light red
    doc.setFillColor(...boxFill)
    doc.roundedRect(20, yPosition, 170, 20, 3, 3, 'F')
    
    // Status icon
    const iconColor = check.status === "passed" ? colors.success : colors.danger;
    doc.setFillColor(...iconColor)
    doc.circle(30, yPosition + 10, 5, 'F')
    
    // Check title
    doc.setTextColor(...colors.text)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(check.title, 40, yPosition + 10)
    
    // Check description
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(check.description, 40, yPosition + 17)
    
    yPosition += 25 // Move to next check position
  })
  
  addFooter(doc, doc.getNumberOfPages(), auditData.url)
  
  // Add technologies page
  doc.addPage()
  addHeader(doc, "Technologie a server")
  
  // Technologies
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text("Detekované technologie:", 20, 40)
  
  // Tech stack in grid
  const techPerRow = 3
  const techWidth = 50
  const techHeight = 25
  const techGap = 10
  
  let techX = 20
  let techY = 50
  
  auditData.techStack.forEach((tech, index) => {
    // Tech box
    doc.setFillColor(245, 247, 250)
    doc.roundedRect(techX, techY, techWidth, techHeight, 3, 3, 'F')
    
    // Tech name
    doc.setTextColor(...colors.text)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text(tech.name, techX + techWidth/2, techY + techHeight/2, { align: 'center' })
    
    // Update position for next tech
    techX += techWidth + techGap
    
    // Move to next row if needed
    if ((index + 1) % techPerRow === 0) {
      techX = 20
      techY += techHeight + techGap
    }
  })
  
  // Add space after tech grid
  techY = techY + techHeight + 20
  
  // Server Info
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text("Informace o serveru:", 20, techY)
  
  // Server info table
  techY += 10
  const serverInfo = [
    { label: "IP adresa", value: auditData.serverInfo.ip },
    { label: "Server", value: auditData.serverInfo.server },
    { label: "Lokace", value: auditData.serverInfo.location },
    { label: "DNS", value: auditData.serverInfo.dns }
  ]
  
  serverInfo.forEach((info, index) => {
    // Alternate row background
    if (index % 2 === 0) {
      doc.setFillColor(245, 247, 250)
      doc.rect(20, techY, 170, 12, 'F')
    }
    
    // Label
    doc.setTextColor(...colors.text)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(info.label, 30, techY + 8)
    
    // Value
    doc.setFont('helvetica', 'normal')
    doc.text(info.value, 120, techY + 8)
    
    techY += 12
  })
  
  addFooter(doc, doc.getNumberOfPages(), auditData.url)
  
  return doc.output("blob")
}

// Helper functions
function drawScoreCard(doc: jsPDF, label: string, score: number, x: number, y: number, colors: any) {
  // Card background
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(x, y, 40, 50, 3, 3, 'F')
  doc.setDrawColor(230, 230, 230)
  doc.roundedRect(x, y, 40, 50, 3, 3, 'S')
  
  // Score gauge
  drawScoreGauge(doc, score, x + 20, y + 25, 15, colors)
  
  // Label
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...colors.text)
  doc.text(label, x + 20, y + 45, { align: 'center' })
}

function drawScoreGauge(doc: jsPDF, score: number, x: number, y: number, radius: number, colors: any) {
  // Determine color based on score
  let color;
  if (score >= 90) color = colors.success;
  else if (score >= 50) color = colors.warning;
  else color = colors.danger;
  
  // Background circle
  doc.setDrawColor(230, 230, 230)
  doc.setFillColor(245, 247, 250)
  doc.circle(x, y, radius, 'FD')
  
  // Score text
  doc.setFontSize(radius)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...color)
  doc.text(score.toString(), x, y + radius/4, { align: 'center' })
  
  // Score indicator color block
  doc.setFillColor(...color)
  doc.roundedRect(x - 7, y + radius + 2, 14, 4, 1, 1, 'F')
}

function addHeader(doc: jsPDF, title: string) {
  // Header background
  doc.setFillColor(245, 247, 250)
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 25, 'F')
  
  // Add text logo instead of image
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text("ByteDev", 20, 15)
  
  // Title
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text(title, doc.internal.pageSize.getWidth() - 20, 15, { align: 'right' })
}

function addFooter(doc: jsPDF, pageNumber: number, url: string) {
  const pageCount = doc.getNumberOfPages()
  const pageWidth = doc.internal.pageSize.getWidth()
  
  // Footer background
  doc.setFillColor(245, 247, 250)
  doc.rect(0, doc.internal.pageSize.getHeight() - 15, pageWidth, 15, 'F')
  
  // Page number
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(120, 120, 120)
  doc.text(
    `Strana ${pageNumber} z ${pageCount}`,
    pageWidth - 20,
    doc.internal.pageSize.getHeight() - 5,
    { align: 'right' }
  )
  
  // URL and generation info
  doc.text(
    `Audit webu: ${url}`,
    20,
    doc.internal.pageSize.getHeight() - 5
  )
}
