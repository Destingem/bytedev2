"use client"

import { motion } from "framer-motion"
import { Cloud, Shield, Cpu, Gauge } from "lucide-react"

const features = [
  {
    icon: Cloud,
    title: "Cloudové řešení",
    description: "Škálovatelná infrastruktura postavená na moderních cloudových technologiích"
  },
  {
    icon: Shield,
    title: "Zabezpečení",
    description: "SSL certifikáty, WAF, DDoS ochrana a pravidelné bezpečnostní audity"
  },
  {
    icon: Cpu,
    title: "Výkon",
    description: "Automatické škálování výkonu podle aktuálního zatížení"
  },
  {
    icon: Gauge,
    title: "Monitoring",
    description: "24/7 monitoring dostupnosti a výkonu s okamžitou reakcí"
  }
]

export function HostingSection() {
  return (
    <section className="py-32 md:py-40 bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4 md:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Špičkový <span className="text-blue-600">hosting</span>
          </h2>
          <p className="text-xl text-gray-600">
            Kompletní správa infrastruktury pro bezstarostný provoz vašeho webu
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl border border-gray-200"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
