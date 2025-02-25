"use client"

import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Clock, Send, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useRef } from "react"
import { useRouter } from 'next/navigation'
import { loadFormData, saveFormData } from "@/utils/form-storage"

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const contactInfo = [
  {
    icon: Phone,
    title: "Telefon",
    content: "+420 777 888 999",
    link: "tel:+420777888999",
  },
  {
    icon: Mail,
    title: "Email",
    content: "info@bytedev.cz",
    link: "mailto:info@bytedev.cz",
  },
  {
    icon: MapPin,
    title: "Adresa",
    content: "Technologická 15, Praha 6",
    link: "https://maps.google.com",
  },
  {
    icon: Clock,
    title: "Otevírací doba",
    content: "Po-Pá: 9:00 - 17:00",
  },
]

export default function KontaktPage() {
  const router = useRouter()
  const [aiMessage, setAiMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState(() => loadFormData())
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Save form data when it changes
  useEffect(() => {
    saveFormData(formData)
  }, [formData])

  // Auto-scroll when chat history changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatHistory])

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiMessage.trim() || isLoading) return

    setIsLoading(true)
    const newMessage: ChatMessage = { role: 'user', content: aiMessage }

    try {
      setChatHistory(prev => [...prev, newMessage])
      
      const response = await fetch('/api/contact-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: aiMessage,
          history: chatHistory,
          formData
        })
      })

      const data = await response.json()

      // Handle form updates
      if (data.formUpdate?.action === 'inquiry') {
        setFormData(data.formUpdate.data)
      }
      
      // Handle AI-triggered form submission
      if (data.formUpdate?.action === 'submit') {
        try {
          const submitResponse = await fetch('/api/contact/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          })

          if (submitResponse.ok) {
            setFormData({
              name: "", company: "", email: "", phone: "", 
              website: "", subject: "", description: ""
            })
            setChatHistory(prev => [...prev, {
              role: 'assistant',
              content: 'Formulář byl úspěšně odeslán! Děkujeme za váš zájem.'
            }])
          } else {
            throw new Error('Failed to submit form')
          }
        } catch (submitError) {
          setChatHistory(prev => [...prev, {
            role: 'assistant',
            content: 'Omlouváme se, ale došlo k chybě při odesílání formuláře.'
          }])
        }
      } else {
        // Add normal AI response to chat
        setChatHistory(prev => [...prev, {
          role: 'assistant',
          content: data.text
        }])
      }

      setAiMessage("")
    } catch (error) {
      console.error('AI Chat error:', error)
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: 'Omlouváme se, ale došlo k chybě při zpracování vaší zprávy.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setChatHistory(prev => [...prev, {
          role: 'assistant',
          content: 'Formulář byl úspěšně odeslán! Děkujeme za váš zájem. Budeme vás kontaktovat co nejdříve.'
        }])
        setFormData({
          name: "", company: "", email: "", phone: "", 
          website: "", subject: "", description: ""
        })
      } else {
        throw new Error('Failed to submit form')
      }
    } catch (error) {
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: 'Omlouváme se, ale došlo k chybě při odesílání formuláře. Zkuste to prosím znovu.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // Update the button text based on chat history
  const buttonText = chatHistory.length > 0 
    ? (isLoading ? 'Zpracovávám...' : 'Poslat zprávu')
    : (isLoading ? 'Zpracovávám...' : 'Zahájit konverzaci')

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white" />
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8 max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Spojte se s <span className="text-blue-600">námi</span>
            </h1>
            <p className="text-xl text-gray-600">
              Jsme tu pro vás. Kontaktujte nás s jakýmkoliv dotazem nebo si domluvte nezávaznou konzultaci.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 mb-20"
          >
            <div className="space-y-6 text-center">
              <h2 className="text-3xl font-bold text-gray-900">Kontaktní informace</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Vyberte si způsob komunikace, který vám nejvíce vyhovuje. Jsme tu pro vás.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-screen-xl mx-auto">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-gray-50 rounded-xl"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  {item.link ? (
                    <a href={item.link} className="text-blue-600 hover:underline">
                      {item.content}
                    </a>
                  ) : (
                    <p className="text-gray-600">{item.content}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Options Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Kontaktujte nás</h2>
            <p className="text-gray-600">Vyberte si způsob, který vám nejvíce vyhovuje</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* AI Assistant */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <Bot className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">AI Asistent</h3>
                    <p className="text-gray-600">Rychlé a přirozené</p>
                  </div>
                </div>
                
                {/* Chat History */}
                <div 
                  ref={chatContainerRef}
                  className="space-y-4 mb-4 max-h-[300px] overflow-y-auto scroll-smooth"
                >
                  {chatHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`${
                          msg.role === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        } rounded-lg p-3 max-w-[80%]`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAiSubmit} className="space-y-4">
                  <textarea
                    value={aiMessage}
                    onChange={(e) => setAiMessage(e.target.value)}
                    disabled={isLoading}
                    className="w-full min-h-[150px] rounded-xl border bg-gray-50/50 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                    placeholder="Popište nám váš projekt přirozeným jazykem. Například:

'Dobrý den, zastupuji menší e-shop s oblečením a hledáme řešení pro modernizaci našeho webu. Aktuálně máme problém s rychlostí načítání a rádi bychom přidali nové funkce...'"
                    rows={6}
                  />
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {buttonText}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Traditional Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <Mail className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Klasický formulář</h3>
                    <p className="text-gray-600">Strukturované zadání</p>
                  </div>
                </div>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900">
                        Jméno
                      </label>
                      <Input 
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Jan Novák" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900">
                        Společnost
                      </label>
                      <Input 
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="Název společnosti" 
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900">
                        Email
                      </label>
                      <Input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="jan@spolecnost.cz" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900">
                        Telefon
                      </label>
                      <Input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+420 123 456 789" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">
                      Aktuální web
                    </label>
                    <Input 
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="www.vas-web.cz" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">
                      Předmět
                    </label>
                    <Input 
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Téma vaší zprávy" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">
                      Popis
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full min-h-[150px] rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Popište váš projekt nebo dotaz..."
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Odesílám...' : 'Odeslat zprávu'}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section - Updated background */}
      <section className="py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900">Kde nás najdete</h2>
            <p className="text-gray-600">Navštivte nás v naší kanceláři v Praze</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="aspect-video rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2559.9076203976837!2d14.3892693!3d50.1036889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDA2JzEzLjMiTiAxNMKwMjMnMjEuNCJF!5e0!3m2!1scs!2scz!4v1635000000000!5m2!1scs!2scz"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </section>
    </div>
  )
}

