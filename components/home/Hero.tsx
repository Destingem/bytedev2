"use client"

import { ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MeshBackground } from "@/components/ui/mesh-background"

export function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden min-h-[75vh] flex items-center justify-center rounded-b-[4rem] bg-gradient-to-b from-white via-blue-50/70 to-blue-100">
      <MeshBackground />
      <div className="container px-4 md:px-6 relative z-10 max-w-screen-xl mx-auto">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-12"
          >
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
              <Sparkles className="w-4 h-4 mr-2" />
              Partner pro Vaše webové projekty
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-8">
              Vytváříme weby, které <span className="text-blue-600">podporují Váš byznys</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              Nejde o technologie, jde o Váš úspěch. Stavíme weby, které přinášejí skutečnou hodnotu Vašemu podnikání a
              Vašim zákazníkům.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Nezávazná konzultace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Jak pracujeme
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

