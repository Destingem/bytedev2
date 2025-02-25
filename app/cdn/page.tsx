"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Globe, Zap, Shield, BarChart, ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Globe,
    title: "Globální síť",
    description: "Servery strategicky rozmístěné po celém světě pro minimální latenci",
    details: ["Evropa", "Amerika", "Asie", "Austrálie"],
  },
  {
    icon: Zap,
    title: "Rychlé načítání",
    description: "Optimalizovaná distribuce obsahu pro maximální rychlost",
    details: ["Automatická optimalizace", "Komprese obsahu", "HTTP/3", "Předběžné načítání"],
  },
  {
    icon: Shield,
    title: "Bezpečnost",
    description: "Pokročilá ochrana proti útokům a zabezpečení obsahu",
    details: ["DDoS ochrana", "WAF", "SSL/TLS", "Rate limiting"],
  },
  {
    icon: BarChart,
    title: "Analytika",
    description: "Detailní přehled o výkonu a využití CDN",
    details: ["Real-time statistiky", "Výkonnostní metriky", "Chybové logy", "Uživatelská analytika"],
  },
]

const benefits = [
  {
    title: "Až 3x rychlejší načítání",
    description: "Díky globální síti serverů a pokročilé optimalizaci",
  },
  {
    title: "99.99% dostupnost",
    description: "Garantovaná dostupnost díky redundantní infrastruktuře",
  },
  {
    title: "Automatická optimalizace",
    description: "Inteligentní systém pro optimalizaci obsahu",
  },
  {
    title: "Snadná integrace",
    description: "Stačí změnit DNS záznamy a CDN je připravena",
  },
]

export default function CdnPage() {
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
                Rychlejší web s naší <span className="text-blue-600">CDN</span>
              </h1>
              <p className="text-xl text-gray-600">
                Globální síť pro rychlé doručování vašeho obsahu. Automatická optimalizace a maximální bezpečnost.
              </p>
              <div className="flex gap-4">
                <Button size="lg">Vyzkoušet CDN</Button>
                <Button size="lg" variant="outline">
                  Technická specifikace
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
                <Image src="/placeholder.svg?height=400&width=600" alt="CDN Network" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Vlastnosti naší CDN</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Výkonná CDN navržená pro moderní web a náročné aplikace.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="grid grid-cols-2 gap-3">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-gray-600">{detail}</span>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Výhody naší CDN</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Proč si vybrat právě naši CDN službu?</p>
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
      <section className="py-20 bg-blue-600">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-screen-xl mx-auto px-4 md:px-6"
        >
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Zrychlete svůj web ještě dnes</h2>
            <p className="text-xl text-blue-100">
              Vyzkoušejte naši CDN zdarma po dobu 30 dní a přesvědčte se o jejích výhodách.
            </p>
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-blue-50">
              Začít zdarma
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

