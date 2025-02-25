"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Server, Shield, Zap, Clock, ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Server,
    title: "Vlastní infrastruktura",
    description: "Provozujeme vlastní servery optimalizované pro maximální výkon",
  },
  {
    icon: Shield,
    title: "Maximální bezpečnost",
    description: "Pravidelné aktualizace a monitoring 24/7",
  },
  {
    icon: Zap,
    title: "Rychlost a výkon",
    description: "Optimalizované servery pro rychlé načítání",
  },
  {
    icon: Clock,
    title: "Dostupnost 99.9%",
    description: "Garantovaná dostupnost vašeho webu",
  },
]

const benefits = [
  {
    title: "Managed hosting",
    description: "Kompletní správa serveru v ceně",
    features: ["Monitoring 24/7", "Pravidelné zálohy", "Technická podpora", "Automatické aktualizace"],
  },
  {
    title: "Výkon a škálování",
    description: "Výkon podle vašich potřeb",
    features: ["SSD disky", "Dostatek RAM", "Automatické škálování", "Load balancing"],
  },
  {
    title: "Bezpečnost",
    description: "Maximální zabezpečení vašich dat",
    features: ["SSL certifikáty", "Firewall", "DDoS ochrana", "Pravidelné aktualizace"],
  },
]

export default function HostingPage() {
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
                Spolehlivý hosting pro <span className="text-blue-600">váš byznys</span>
              </h1>
              <p className="text-xl text-gray-600">
                Hosting optimalizovaný pro výkon a bezpečnost. Kompletní správa serveru, abyste se mohli soustředit na
                své podnikání.
              </p>
              <div className="flex gap-4">
                <Button size="lg">Vyzkoušet hosting</Button>
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
                <Image src="/placeholder.svg?height=400&width=600" alt="Hosting" fill className="object-cover" />
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Proč náš hosting</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hosting navržený pro maximální výkon a bezpečnost vašeho webu.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-8 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 mb-6">{benefit.description}</p>
                <ul className="space-y-3">
                  {benefit.features.map((feature, featureIndex) => (
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
            <h2 className="text-3xl md:text-4xl font-bold text-white">Připraveni začít?</h2>
            <p className="text-xl text-blue-100">
              Vyzkoušejte náš hosting zdarma po dobu 30 dní a přesvědčte se o jeho kvalitě.
            </p>
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-blue-50">
              Vyzkoušet zdarma
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

