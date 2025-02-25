import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai"
import { NextRequest, NextResponse } from "next/server"
import { scanPages } from '@/utils/navigation-scanner'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Optimized generation config for better responses
const generationConfig: GenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
}

async function getNavigationContext() {
  const pages = await scanPages()
  return {
    pages: Object.entries(pages).reduce((acc, [path, info]) => ({
      ...acc,
      [path]: {
        title: info.title,
        description: info.description,
        content: info.content,
        sections: info.sections.map(s => ({
          id: s.id,
          title: s.title,
          content: s.content
        }))
      }
    }), {})
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()
    const navigationContext = await getNavigationContext()
    console.log(navigationContext)
    const systemPrompt = `
    Jsi AI asistent pro ByteDev. Odpovídej stručně, výstižně a přirozeně v češtině.
    Máš k dispozici obsah všech stránek webu pro lepší porozumění kontextu.

    Dostupné stránky a jejich obsah:
    ${JSON.stringify(navigationContext, null, 2)}
    Když se tě uživatel zeptá na něco, co je na webu, odkazuj na konkrétní stránku nebo sekci.
    Když odkazuješ na stránku, použij:
    { "action": "navigate", "path": "/cesta", "section": "sekce" }

    Příklady:
    - Pro přesměrování: {"action":"navigate","path":"/kontakt"}
    - Pro sekci: {"action":"navigate","path":"/sluzby","section":"vyvoj-webu"}

    A nikdy neodpovídej práznou odpovědí. Pokud nevíš, co odpovědět, řekni, že nevíš.
    `

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite-preview-02-05",
      generationConfig,
    })
    
    // Convert history into chat format and include system prompt
    const chatHistory = [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model",
        parts: [{ text: "Understood. I'll help users navigate the website and provide information in Czech." }],
      },
      ...history.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }))
    ]

    const chat = model.startChat({ history: chatHistory })

    const result = await chat.sendMessage([{ text: message }])
    const response = await result.response
    const text = response.text()
    console.log('Chat response:', text)
    // Parse navigation commands
    const navigationMatch = text.match(/\{[\s\S]*?"action":\s*?"navigate"[\s\S]*?\}/g)
    let navigation = null
    console.log('Navigation match:', navigationMatch)
    if (navigationMatch) {
      try {
        const jsonStr = navigationMatch[0]
          .replace(/[\n\r]+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()

        navigation = JSON.parse(jsonStr)
        const cleanText = text.replace(navigationMatch[0], '').trim()
        console.log('Navigation:', navigation)
        return NextResponse.json({ text: cleanText, navigation })
      } catch (e) {
        console.error('Failed to parse navigation:', e)
      }
    }

    return NextResponse.json({ text })
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'Omlouváme se, ale došlo k chybě při zpracování vaší zprávy.' },
      { status: 500 }
    )
  }
}
