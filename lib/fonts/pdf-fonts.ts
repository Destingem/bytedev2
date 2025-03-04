// Updated font helper for PDF generation

export function addFont(doc: any) {
  try {
    // Use standard fonts that come with jsPDF
    // Replace all Montserrat instances with standard fonts
    doc.setFont('helvetica', 'normal')
    
    // Create mappings for different font variants we need
    doc._fontMapping = {
      'Montserrat-normal': {
        id: 'helvetica',
        encoding: 'StandardEncoding',
        built: true
      },
      'Montserrat-bold': {
        id: 'helvetica-bold',
        encoding: 'StandardEncoding',
        built: true
      }
    }
    
    // Override the setFont method to handle our custom font mappings
    const originalSetFont = doc.setFont
    doc.setFont = function(family: string, style: string = 'normal') {
      if (family === 'Montserrat') {
        if (style === 'bold') {
          return originalSetFont.call(doc, 'helvetica', 'bold')
        } else {
          return originalSetFont.call(doc, 'helvetica', 'normal')
        }
      }
      return originalSetFont.call(doc, family, style)
    }
  } catch (e) {
    console.error("Error setting up fonts:", e)
  }
}
