export async function sendEmail(params: {
  to: { email: string; name?: string }[]
  subject: string
  htmlContent: string
  sender?: { name: string; email: string }
  replyTo?: { name: string; email: string }
}) {
  const payload = {
    sender: {
      name: 'Admin',
      email: 'admin@imagedit.io'
    },
    to: params.to,
    subject: params.subject,
    htmlContent: params.htmlContent,
    replyTo: params.replyTo
  }

  console.log('Sending email with config:', {
    sender: payload.sender,
    to: payload.to,
    subject: payload.subject
  })

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY || ''
    },
    body: JSON.stringify(payload)
  })

  const responseData = await response.json()
  
  if (!response.ok) {
    console.error('Email API error:', {
      status: response.status,
      data: responseData
    })
    throw new Error('Failed to send email')
  }

  return responseData
}
