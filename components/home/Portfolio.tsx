"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const projects = [
  {
    title: "E-commerce platforma",
    description: "Moderní řešení pro online prodej s pokročilými funkcemi",
    image: "/projects/ecommerce.jpg",
    tags: ["Next.js", "Stripe", "Tailwind"]
  },
  {
    title: "SaaS aplikace",
    description: "Webová aplikace pro správu projektů a týmů",
    image: "/projects/saas.jpg",
    tags: ["React", "Node.js", "PostgreSQL"]
  },
  {
    title: "Firemní portál",
    description: "Interní systém pro správu dokumentů a procesů",
    image: "/projects/portal.jpg",
    tags: ["Vue.js", "Laravel", "Docker"]
  }
]

export function Portfolio() {
  return (
    <section className="py-32 md:py-40 bg-gray-50">
      <div className="container px-4 md:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Naše <span className="text-blue-600">projekty</span>
          </h2>
          <p className="text-xl text-gray-600">
            Ukázky našich řešení pro klienty z různých odvětví
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200"
            >
              <div className="aspect-video relative">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg">
            Více projektů
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
