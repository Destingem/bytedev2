"use client"

import { motion } from "framer-motion"
import { Activity, Search, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const auditTypes = [
  {
    icon: Search,
    title: "SEO Audit",
    description: "Analýza viditelnosti webu ve vyhledávačích a návrhy na zlepšení"
  },
  {
    icon: Activity,
    title: "Performance Audit",
    description: "Měření rychlosti, optimalizace a technický stav webu"
  },
  {
    icon: Zap,
    title: "UX Audit",
    description: "Analýza uživatelského rozhraní a návrhy na zlepšení konverzí"
  }
]

export function AuditSection() {
  return (
    <section className="py-32 md:py-40 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Bezplatný <span className="text-blue-600">audit webu</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Zjistěte potenciál vašeho webu. Připravíme pro vás komplexní analýzu s konkrétními doporučeními.
            </p>
            <Button size="lg">
              Objednat audit zdarma
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid gap-6"
          >
            {auditTypes.map((type, index) => (
              <div
                key={index}
                className="flex gap-6 p-6 bg-gray-50 rounded-xl"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <type.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {type.title}
                  </h3>
                  <p className="text-gray-600">{type.description}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
