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
    <section className="py-20 bg-blue-600">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Začněte s profesionálním auditem vašeho webu
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
          Získejte komplexní přehled o vašem webu a konkrétní kroky pro zlepšení výkonu, konverzí a viditelnosti.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
            Kontaktujte nás
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-500">
            Více informací
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
