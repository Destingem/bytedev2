import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai"
import { NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const generationConfig: GenerationConfig = {
  temperature: 0.9,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 2048,
}

export async function POST(req: NextRequest) {
  try {
    const { message, history, formData } = await req.json()
    
    const systemPrompt = `
    Jsi AI asistent pro ByteDev, který pomáhá s vyplněním kontaktního formuláře.
    Odpovídej stručně, výstižně a přirozeně v češtině.

    KRITICKY DŮLEŽITÉ:
    1. Při každé odpovědi uživatele IHNED analyzuj jméno, společnost a další údaje
    2. Každou odpověď MUSÍŠ vrátit s JSON objektem obsahujícím nalezené údaje
    3. Pokud se uživatel zmíní o projektu, ulož to jako předmět a popis

    Formát odpovědi:
    [text odpovědi]
    {"action":"inquiry","data":{"name":"...","company":"...","email":"...","phone":"...","website":"...","subject":"...","description":"..."}}

    Příklady správné detekce:

    Uživatel: "Jmenuji se Petr Novák"
    {"action":"inquiry","data":{"name":"Petr Novák"}}

    Uživatel: "Jsem Jan ze společnosti ABC"
    {"action":"inquiry","data":{"name":"Jan","company":"ABC"}}

    Uživatel: "Potřebujeme nový web pro naši firmu XYZ"
    {"action":"inquiry","data":{"company":"XYZ","subject":"Nový web","description":"Zájem o vytvoření nového webu"}}

    A když je uživatel požádán o odeslání formuláře:
    {"action":"submit"}
    DŮLEŽITÉ:
    - Po každé odpovědi uživatele MUSÍ následovat JSON s daty
    - Kontroluj jméno v každé zprávě
    - Extrahuj všechny relevantní informace
    - Udržuj kontext předchozí konverzace

    Aktuální stav formuláře:
    ${JSON.stringify(formData, null, 2)}
    `

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite-preview-02-05",
      generationConfig,
    })
    
    const chatHistory = [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Rozumím, pomohu s vyplněním kontaktního formuláře." }] },
      ...history.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }))
    ]

    const chat = model.startChat({ history: chatHistory })
    const result = await chat.sendMessage([{ text: message }])
    const response = await result.response
    const text = response.text()
    console.log('Raw response:', text)

    let formUpdate = null
    let cleanText = text

    try {
      const lines = text.split('\n')
      const jsonLine = lines.find(line => line.trim().startsWith('{') && line.trim().endsWith('}'))
      
      if (jsonLine) {
        formUpdate = JSON.parse(jsonLine.trim())
        cleanText = lines.filter(line => line !== jsonLine).join('\n').trim()

        // Check if user wants to submit
        if (message.toLowerCase().includes('odesl')) {
          const requiredFields = ['name', 'email', 'subject', 'description']
          const missingFields = requiredFields.filter(field => !formData[field])
          
          if (missingFields.length === 0) {
            formUpdate.action = 'submit'
          } else {
            cleanText = `Bohužel nemohu odeslat formulář, chybí: ${missingFields.join(', ')}`
            formUpdate.action = 'inquiry'
          }
        }

        if (formUpdate?.action === 'inquiry' && formUpdate?.data) {
          // Create new form data by merging existing data with updates
          const newData = { ...formData }
          
          // Process each field
          Object.entries(formUpdate.data).forEach(([key, value]) => {
            if (value && typeof value === 'string' && value.trim()) {
              // Don't override existing values with empty or invalid ones
              const trimmedValue = value.trim()
              if (trimmedValue !== '...' && !trimmedValue.toLowerCase().includes('nevím')) {
                newData[key] = trimmedValue
              }
            }
          })

          // Update form data with processed values
          formUpdate.data = newData

          // Log for debugging
          console.log('Processed form data:', newData)
        }
      }
    } catch (e) {
      console.error('JSON processing error:', e)
      console.error('Problematic text:', text)
      formUpdate = null
    }

    return NextResponse.json({ 
      text: cleanText, 
      formUpdate
    })
  } catch (error) {
    console.error('Contact AI Error:', error)
    return NextResponse.json(
      { error: 'Omlouváme se, ale došlo k chybě při zpracování vaší zprávy.' },
      { status: 500 }
    )
  }
}
