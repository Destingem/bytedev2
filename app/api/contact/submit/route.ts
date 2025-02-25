import { NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/utils/brevo"

interface ContactForm {
  name: string
  company: string
  email: string
  phone: string
  website: string
  subject: string
  description: string
}

export async function POST(req: NextRequest) {
  try {
    const data: ContactForm = await req.json()
    console.log('Processing form submission:', data)
    
    if (!data.name || !data.email || !data.subject || !data.description) {
      return NextResponse.json(
        { error: 'Chybí povinné údaje' },
        { status: 400 }
      )
    }

    try {
      console.log('Environment check:', {
        hasBrevoKey: !!process.env.BREVO_API_KEY,
        hasSmtpUser: !!process.env.SMTP_USER,
        notificationEmail: process.env.NOTIFICATION_EMAIL
      })

      const result = await sendEmail({
        to: [{
          name: 'ByteDev Team',
          email: process.env.NOTIFICATION_EMAIL || 'ondrej.zaplatilek@bytedev.cz'
        }],
        subject: `🚀 Nová poptávka: ${data.subject}`,
        htmlContent: `
          <h2>📝 Nová poptávka z webu ByteDev</h2>
          <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Jméno:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Společnost:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.company || 'Neuvedeno'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Telefon:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.phone || 'Neuvedeno'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Web:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.website || 'Neuvedeno'}</td>
            </tr>
          </table>
          <h3 style="margin-top: 20px;">💬 Předmět: ${data.subject}</h3>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px;">
            <strong>Popis:</strong><br>
            ${data.description.replace(/\n/g, '<br>')}
          </div>
          <p style="color: #666; margin-top: 20px; font-size: 12px;">
            Odesláno z kontaktního formuláře ByteDev
          </p>
        `,
        replyTo: {
          name: data.name,
          email: data.email
        }
      })

      console.log('Email sent:', result)

      return NextResponse.json({
        success: true,
        message: 'Formulář byl úspěšně odeslán'
      })
    } catch (emailError) {
      console.error('Email send error:', emailError)
      throw emailError
    }
  } catch (error) {
    console.error('Form submission error:', error)
    return NextResponse.json(
      { error: 'Došlo k chybě při zpracování formuláře' },
      { status: 500 }
    )
  }
}
