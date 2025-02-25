"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Heart, Target, Users, Code2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const team = [
  {
    name: "Jan Novák",
    role: "CEO & Lead Developer",
    image: "/placeholder.svg?height=400&width=400",
    description: "10+ let zkušeností s vývojem webových aplikací",
  },
  {
    name: "Marie Svobodová",
    role: "UX Designer",
    image: "/placeholder.svg?height=400&width=400",
    description: "Specialistka na uživatelskou přívětivost a design",
  },
  {
    name: "Petr Dvořák",
    role: "Technical Lead",
    image: "/placeholder.svg?height=400&width=400",
    description: "Expert na architekturu a výkon aplikací",
  },
]

const values = [
  {
    icon: Heart,
    title: "Lidský přístup",
    description: "Technologie jsou důležité, ale lidé jsou na prvním místě",
  },
  {
    icon: Target,
    title: "Zaměření na výsledky",
    description: "Měříme úspěch podle vašich obchodních výsledků",
  },
  {
    icon: Users,
    title: "Partnerství",
    description: "Jsme váš partner pro dlouhodobý růst",
  },
  {
    icon: Code2,
    title: "Kvalita",
    description: "Děláme věci pořádně, ne na rychlo",
  },
]

export default function ONasPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white" />
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8 max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Tým, který stojí za <span className="text-blue-600">ByteDev</span>
            </h1>
            <p className="text-xl text-gray-600">
              Jsme parta nadšenců do technologií, kteří věří, že web může být lepší. Spojujeme technickou expertízu s
              porozuměním byznysu.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative h-[400px] rounded-2xl overflow-hidden mb-6">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-white/90">{member.role}</p>
                  </div>
                </div>
                <p className="text-gray-600">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Naše hodnoty</h2>
            <p className="text-xl text-gray-600">
              Hodnoty, které definují náš přístup k práci a spolupráci s klienty.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-20 bg-blue-600">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-screen-xl mx-auto px-4 md:px-6"
        >
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Pojďte s námi tvořit lepší web</h2>
            <p className="text-xl text-blue-100">
              Hledáme talentované lidi, kteří chtějí dělat věci jinak. Připojte se k našemu týmu.
            </p>
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-blue-50">
              Otevřené pozice
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

