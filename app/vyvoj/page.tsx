"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Code2, GitBranch, Laptop, Rocket, Server, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const technologies = [
  {
    name: "Next.js",
    description: "Moderní React framework pro rychlé a výkonné webové aplikace",
    icon: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "TypeScript",
    description: "Typově bezpečný JavaScript pro spolehlivější kód",
    icon: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "TailwindCSS",
    description: "Utility-first CSS framework pro moderní design",
    icon: "/placeholder.svg?height=40&width=40",
  },
]

const processSteps = [
  {
    icon: Laptop,
    title: "Analýza a plánování",
    description: "Důkladně analyzujeme vaše potřeby a vytvoříme plán realizace",
  },
  {
    icon: Code2,
    title: "Vývoj",
    description: "Využíváme moderní technologie pro vytvoření kvalitního řešení",
  },
  {
    icon: GitBranch,
    title: "Testování",
    description: "Důkladně testujeme funkcionalitu i použitelnost",
  },
  {
    icon: Rocket,
    title: "Nasazení",
    description: "Bezpečné nasazení na produkční prostředí",
  },
  {
    icon: Zap,
    title: "Optimalizace",
    description: "Kontinuální vylepšování výkonu a UX",
  },
  {
    icon: Server,
    title: "Monitoring",
    description: "24/7 sledování dostupnosti a výkonu",
  },
]

export default function VyvojPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-48 md:py-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white" />
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 relative">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Vývoj webů <span className="text-blue-600">pro váš růst</span>
              </h1>
              <p className="text-xl text-gray-600">
                Vytváříme weby a aplikace, které podporují váš byznys. Používáme moderní technologie, ale soustředíme se
                především na vaše cíle.
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg">Nezávazná konzultace</Button>
                <Button size="lg" variant="outline">
                  Více o procesu
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Technologie, které používáme</h2>
            <p className="text-xl text-gray-600">
              Vybíráme technologie, které nejlépe slouží vašim potřebám. Nehoníme se za trendy, ale za výsledky.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute -inset-4 rounded-lg bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-6 space-y-4">
                  <Image src={tech.icon || "/placeholder.svg"} alt={tech.name} width={40} height={40} />
                  <h3 className="text-xl font-semibold text-gray-900">{tech.name}</h3>
                  <p className="text-gray-600">{tech.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Jak pracujeme</h2>
            <p className="text-xl text-gray-600">
              Náš proces je navržen tak, aby byl transparentní a efektivní. Vy máte vždy přehled o tom, co se děje.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

