"use client"

import { useState, useRef, useEffect } from "react"
import { ChatButton } from "@/components/ui/chat-button"
import { ChatInput } from "@/components/ui/chat-input"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { ChatMessage, loadMessages, saveMessages } from "@/utils/chat-storage"

const capabilities = [
  "navigovat webem",
  "provést základní audit webu",
  "odpovídat na dotazy o našich službách",
  "pomoci s výběrem řešení",
  "poslat poptávku"
]

export function Chat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const router = useRouter()
  const chatRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load messages from storage on mount
  useEffect(() => {
    setMessages(loadMessages())
  }, [])

  // Save messages when they change
  useEffect(() => {
    saveMessages(messages)
  }, [messages])

  // Add this new useEffect for auto-scrolling
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Expose toggle function to global scope for other components to use
  useEffect(() => {
    // Create toggle function that can be called from other components
    window.toggleChatWindow = () => {
      setIsOpen(true);
    };

    // Clean up when component unmounts
    return () => {
      delete window.toggleChatWindow;
    };
  }, []);

  const handleSubmit = async (message: string) => {
    try {
      const newMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: Date.now()
      }
      
      setMessages(prev => [...prev, newMessage])
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message,
          history: messages // Send entire conversation history
        })
      })

      const data = await response.json()
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.text,
        timestamp: Date.now()
      }
      
      setMessages(prev => [...prev, assistantMessage])

      // Handle navigation if present
      if (data.navigation?.action === 'navigate') {
        const { path, section } = data.navigation
        router.push(`${path}${section ? `#${section}` : ''}`)
        setIsOpen(false)
      }

    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Omlouváme se, ale došlo k chybě při zpracování vaší zprávy.' 
      }])
    }
  }

  return (
    <>
      <ChatButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-6"
          >
            <div 
              ref={chatRef}
              className="w-full max-w-[50%] min-w-[500px] backdrop-blur-xl bg-white/70 rounded-xl border border-gray-200/50 shadow-2xl flex flex-col max-h-[600px]"
            >
              <div className="flex flex-col p-4 border-b border-gray-200/50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900">Chatbot byte</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Umím: {capabilities.join(", ")}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 backdrop-blur-xl bg-white/50">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`${
                        msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100/80 text-gray-900'
                      } rounded-lg p-3 max-w-[80%] backdrop-blur-sm`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} /> {/* Add this empty div as scroll anchor */}
              </div>
              <div className="border-t border-gray-200/50 bg-white/50 backdrop-blur-xl rounded-b-xl">
                <div className="w-full p-4">
                  <ChatInput onSubmit={handleSubmit} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
