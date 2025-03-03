"use client"

import { motion } from "framer-motion"
import { Check, X } from "lucide-react"

const ideal = [
  "Začínající podnikatelé a startupy",
  "Malé a střední firmy",
  "Inovativní projekty",
  "Flexibilní přístup k realizaci",
  "Důraz na business výsledky"
]

const notIdeal = [
  "Projekty vyžadující rigidní certifikace",
  "Bankovní a zdravotnický sektor",
  "Striktně technické specifikace",
  "Složité korporátní procesy"
]

export function ForWhom() {
  return (
    <section className="py-32 md:py-40 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Pro koho jsme <span className="text-blue-600">vhodní</span>
          </h2>
          <p className="text-xl text-gray-600">
            Náš přístup není pro každého. Zaměřujeme se na klienty, kterým můžeme přinést největší hodnotu.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <Check className="w-6 h-6 text-green-600" />
              Ideální klient
            </h3>
            <div className="space-y-4">
              {ideal.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <X className="w-6 h-6 text-red-600" />
              Nejsme vhodní pro
            </h3>
            <div className="space-y-4">
              {notIdeal.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <X className="w-3 h-3 text-red-600" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
