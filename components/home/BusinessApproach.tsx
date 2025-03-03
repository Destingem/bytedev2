"use client"

import { motion } from "framer-motion"
import { 
  PiggyBank, 
  Lightbulb, 
  HomeIcon, 
  ArrowRight, 
  Target,
  Wrench,
  Building,
  Store,
  Quote
} from "lucide-react"
import { Button } from "@/components/ui/button"

const scenarios = [
  {
    icon: Store,
    budget: "30 000 Kč",
    title: "Lokální kadeřnictví",
    solution: "WordPress s předpřipravenou šablonou",
    description: "Perfektní řešení pro zobrazení základních informací, fotogalerie a kontaktu."
  },
  {
    icon: Building,
    budget: "200 000 Kč",
    title: "Střední firma",
    solution: "Vlastní web na míru",
    description: "Kompletně přizpůsobený design a funkce pro vaše specifické potřeby."
  },
  {
    icon: HomeIcon,
    budget: "500 000 Kč+",
    title: "E-commerce",
    solution: "Komplexní webová aplikace",
    description: "Plně škálovatelné řešení s pokročilými funkcemi a integrací systémů."
  }
]

export function BusinessApproach() {
  return (
    <section className="py-32 md:py-40 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-24">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
            <Lightbulb className="w-4 h-4 mr-2" />
            Jiný přístup k vývoji webů
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Neděláme webovky.<br />
            <span className="text-blue-600">Řešíme problémy.</span>
          </h2>
          <p className="text-xl text-gray-600">
            Odmítáme šablonové oceňování. Web je služba, ne produkt z katalogu.
          </p>
        </div>

        {/* Budget Scale */}
        <div className="mb-32">
          <div className="grid md:grid-cols-3 gap-8">
            {scenarios.map((scenario, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              >
                <div className="absolute -top-6 left-8 w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <scenario.icon className="w-6 h-6" />
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {scenario.budget}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {scenario.title}
                  </h3>
                  <div className="text-sm text-blue-600 mb-4">{scenario.solution}</div>
                  <p className="text-gray-600">{scenario.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid lg:grid-cols-2 gap-60 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-16">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex-shrink-0 flex items-center justify-center">
                  <PiggyBank className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Garantujeme dodržení rozpočtu
                  </h3>
                  <p className="text-gray-600">
                    Žádné překvapení na konci projektu. Pokud se na změně rozpočtu nedomluvíme, dodržíme původní cenu.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex-shrink-0 flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Řešení podle vašich potřeb
                  </h3>
                  <p className="text-gray-600">
                    Nenutíme vám předražená řešení. Pro každý projekt volíme technologie, které dávají smysl.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex-shrink-0 flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Inovativní model pronájmu
                  </h3>
                  <p className="text-gray-600">
                    Web na míru s flexibilitou předplatného. Včetně hostingu, infrastruktury a pravidelných aktualizací.
                  </p>
                </div>
              </div>
            </div>

            <Button size="lg" className="mt-12">
              Více o našem přístupu
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="text-blue-500 opacity-30 absolute -left-20 -top-20">
              <Quote size={80} />
            </div>
            <div className="text-blue-500 opacity-30 absolute -right-10 -bottom-10 transform rotate-180">
              <Quote size={80} />
            </div>
            <blockquote className="text-4xl text-gray-900 leading-relaxed">
              Nejlepší webové řešení je pro každého klienta unikátní. <br /> To však neznamená, že je třeba všechno vytvořit na <strong className="text-blue-600">zelené louce</strong>, většinou je správné použít existující osvědčené technologie a projekty.
            </blockquote>
            <div className="mt-6 font-semibold text-blue-600">
              Náš přístup k projektům
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
