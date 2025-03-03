"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, MessageSquarePlus, Sparkles, Bot } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

// Define a type for the global chat toggling function
declare global {
  interface Window {
    toggleChatWindow?: () => void;
  }
}

export function CtaBanner() {
  const [isChatAvailable, setChatAvailable] = useState(false);

  useEffect(() => {
    // Check if the chat toggle function is available in the global scope
    setChatAvailable(!!window.toggleChatWindow);
  }, []);

  const handleOpenChat = () => {
    if (window.toggleChatWindow) {
      window.toggleChatWindow();
    }
  };

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Card container with nice spacing */}
          <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
            
            {/* Sparkles decoration */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute top-12 right-16 text-yellow-300"
            >
              <Sparkles className="w-8 h-8" />
            </motion.div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="text-center md:text-left max-w-xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Připraveni posunout váš projekt na další úroveň?
                </h2>
                <p className="text-blue-50 text-lg md:text-xl opacity-90 mb-20">
                  Nečekejte s realizací vašeho nápadu. Náš tým je připraven pomoci s vývojem, hostingem a optimalizací.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                   <Link href="/kontakt">
                   <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-6 h-auto font-medium">
                      Nezávazně konzultovat
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-blue-100 text-white hover:bg-blue-600 hover:text-white text-lg px-8 py-6 h-auto font-medium"
                      onClick={handleOpenChat}
                    >
                      <MessageSquarePlus className="mr-2 h-5 w-5" />
                      Poraďte se s AI
                    </Button>
                  </motion.div>
                </div>
              </div>
              
              {/* AI Contact Form Info */}
              <div className="hidden md:block bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-sm shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/30 backdrop-blur-sm flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white text-xl font-semibold">AI Kontaktní formulář</h3>
                </div>
                <p className="text-blue-50 mb-5">
                  Kontaktujte nás velmi jednoduše přes náš inteligentní formulář, který vám pomůže specifikovat vaše požadavky a ušetří čas.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-blue-50 text-sm">
                    <span className="mr-2 text-green-400">✓</span>
                    Rychlejší zpracování požadavku
                  </li>
                  <li className="flex items-center text-blue-50 text-sm">
                    <span className="mr-2 text-green-400">✓</span>
                    Přesnější odhad nákladů
                  </li>
                  <li className="flex items-center text-blue-50 text-sm">
                    <span className="mr-2 text-green-400">✓</span>
                    Dostupný 24/7
                  </li>
                </ul>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                 <Link href="/kontakt">
                 <Button 
                    variant="ghost" 
                    className="text-white border border-white/30 hover:bg-white/20 w-full"
                    
                  >
                    <Bot className="mr-2 h-4 w-4" />
                    Spustit AI formulář
                  </Button>
                    </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
