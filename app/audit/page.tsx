"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Search, BarChart, FastForwardIcon as Speed, ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CtaBanner } from "@/components/home/CtaBanner"

const auditTypes = [
  {
    icon: Speed,
    title: "Technický audit",
    description: "Komplexní analýza technického stavu vašeho webu",
    features: [
      "Analýza výkonu a rychlosti",
      "Kontrola zabezpečení",
      "Audit kódu a architektury",
      "Kontrola mobilní optimalizace",
    ],
  },
  {
    icon: Search,
    title: "SEO audit",
    description: "Detailní analýza SEO připravenosti",
    features: ["Analýza klíčových slov", "Kontrola on-page faktorů", "Audit zpětných odkazů", "Analýza konkurence"],
  },
  {
    icon: BarChart,
    title: "Výkonnostní audit",
    description: "Měření a optimalizace obchodních výsledků",
    features: [
      "Analýza konverzního poměru",
      "Audit uživatelské cesty",
      "Měření výkonu marketingu",
      "Doporučení pro zlepšení",
    ],
  },
]

const benefits = [
  {
    title: "Detailní report",
    description: "Získáte komplexní report s konkrétními doporučeními",
  },
  {
    title: "Prioritizace",
    description: "Pomůžeme vám určit, co řešit nejdříve",
  },
  {
    title: "Akční plán",
    description: "Vytvoříme plán implementace doporučených změn",
  },
  {
    title: "Měřitelné výsledky",
    description: "Sledujeme a vyhodnocujeme dopad změn",
  },
]

export default function AuditPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white" />
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Audit webu pro <span className="text-blue-600">maximální výkon</span>
              </h1>
              <p className="text-xl text-gray-600">
                Komplexní analýza vašeho webu z technického, SEO a obchodního pohledu. Získejte konkrétní doporučení pro
                zlepšení.
              </p>
              <div className="flex gap-4">
                <Button size="lg">Objednat audit</Button>
                <Button size="lg" variant="outline">
                  Více informací
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative h-[400px] rounded-2xl overflow-hidden">
                <Image src="/placeholder.svg?height=400&width=600" alt="Audit webu" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Audit Types Section */}
      <section className="py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Typy auditů</h2>
            <p className="text-xl text-gray-600">
              Vyberte si typ auditu podle vašich potřeb, nebo nám dovolte doporučit optimální kombinaci.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {auditTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6">
                  <type.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{type.title}</h3>
                <p className="text-gray-600 mb-6">{type.description}</p>
                <ul className="space-y-3">
                  {type.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Co získáte</h2>
            <p className="text-xl text-gray-600">
              Audit není jen report. Je to začátek cesty k lepšímu webu.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CtaBanner />
    </div>
  )
}

