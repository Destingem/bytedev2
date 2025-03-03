"use client"

import { motion } from "framer-motion"
import { Globe } from "lucide-react"

export function CdnSection() {
  return (
    <section className="py-32 md:py-40 bg-blue-600 text-white overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Globe className="w-16 h-16 mb-8" />
            <h2 className="text-4xl font-bold mb-6">
              Globální CDN síť
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Rychlé načítání webu kdekoli na světě díky síti více než 200 datových center.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-4xl font-bold mb-2">200+</div>
                <div className="text-blue-100">Lokací po celém světě</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">&lt;50ms</div>
                <div className="text-blue-100">Průměrná latence</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">99.99%</div>
                <div className="text-blue-100">Garantovaná dostupnost</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-blue-100">Monitoring a podpora</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="aspect-square relative">
              <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse" />
              <div className="absolute inset-4 bg-white/20 rounded-full animate-pulse delay-300" />
              <div className="absolute inset-8 bg-white/30 rounded-full animate-pulse delay-500" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
