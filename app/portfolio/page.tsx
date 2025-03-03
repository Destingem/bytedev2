"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ArrowRight, ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CtaBanner } from "@/components/home/CtaBanner"

type Project = {
  id: number
  title: string
  description: string
  image: string
  category: string
  technologies: string[]
  link?: string
  github?: string
  results: string[]
}

const projects: Project[] = [
  {
    id: 1,
    title: "Autoškola Pospíšil",
    description: "Moderní webová prezentace s rezervačním systémem pro autoškolu.",
    image: "/projects/autoskola.jpg",
    category: "Weby",
    technologies: ["WordPress", "PHP", "MySQL"],
    link: "https://autoskolapospisil.cz",
    results: [
      "Nahrazení zastaralého webu z roku 2006",
      "Významný nárůst poptávky",
      "Automatizace rezervačního procesu"
    ]
  },
  {
    id: 2,
    title: "Polystyren sypaný",
    description: "Modernizace HTML webu na Next.js aplikaci s vylepšenou SEO optimalizací.",
    image: "/projects/polystyren.jpg",
    category: "E-commerce",
    technologies: ["Next.js", "React", "Tailwind CSS"],
    link: "https://www.polystyrensypany.cz",
    results: [
      "Zlepšení pozic ve vyhledávačích",
      "Nárůst organických poptávek",
      "Rychlejší načítání stránek"
    ]
  },
  {
    id: 3,
    title: "SSK Slatina Brno",
    description: "Prototyp moderního webu pro sportovní klub.",
    image: "/projects/ssk.jpg",
    category: "Weby",
    technologies: ["Figma", "UI/UX", "Prototyping"],
    results: [
      "Vytvoření interaktivního prototypu",
      "Uživatelské testování",
      "Definice designového systému"
    ]
  },
  {
    id: 4,
    title: "Follows.cz",
    description: "Social Media Marketing platforma pro správu sociálních sítí.",
    image: "/projects/follows.jpg",
    category: "Aplikace",
    technologies: ["React", "Node.js", "PostgreSQL"],
    link: "https://follows.cz",
    results: [
      "Komplexní SMM řešení",
      "Automatizace marketingových procesů",
      "Škálovatelná architektura"
    ]
  },
  {
    id: 5,
    title: "Swordfish Trombones",
    description: "Webová prezentace pro hudební kapelu.",
    image: "/projects/swordfish.jpg",
    category: "Weby",
    technologies: ["Next.js", "Tailwind CSS", "Framer Motion"],
    results: [
      "Moderní designové zpracování",
      "Optimalizace pro mobilní zařízení",
      "Integrace sociálních sítí"
    ]
  },
  {
    id: 6,
    title: "Vinařství Badin",
    description: "E-shop a prezentace pro vinařství.",
    image: "/projects/badin.jpg",
    category: "E-commerce",
    technologies: ["WordPress", "WooCommerce", "PHP"],
    link: "https://www.vinarstvibadin.cz",
    results: [
      "Kompletní e-commerce řešení",
      "Správa skladu",
      "Marketingová automatizace"
    ]
  },
  {
    id: 7,
    title: "Imagedit.io",
    description: "Cloudová platforma pro správu a úpravu obrázků s vlastním CDN.",
    image: "/projects/imagedit.jpg",
    category: "Aplikace",
    technologies: ["AWS", "Symfony", "Docker", "PostgreSQL"],
    results: [
      "Škálovatelná cloud architektura",
      "Vlastní CDN řešení",
      "Vysoký výkon a dostupnost"
    ]
  },
  {
    id: 8,
    title: "Jirkova tesla",
    description: "Prototyp webu pro inovativní startup v automobilovém průmyslu.",
    image: "/projects/tesla.jpg",
    category: "Weby",
    technologies: ["Figma", "Next.js", "React"],
    results: [
      "Kompletní UX/UI návrh",
      "Prototyp produktu",
      "Uživatelské testování"
    ]
  },
  {
    id: 9,
    title: "Offtrader Trading Platform",
    description: "Online platforma pro obchodování a vzdělávání v oblasti financí.",
    image: "/projects/offtrader.jpg",
    category: "Aplikace",
    technologies: ["Next.js", "Appwrite", "YooKassa"],
    link: "https://offtrader.ru",
    results: [
      "Komplexní platforma pro trading",
      "Integrace platebního systému YooKassa",
      "Automatizace vzdělávacího procesu"
    ]
  },
  {
    id: 10,
    title: "Offtrader Academy",
    description: "Vzdělávací platforma pro trading a finanční gramotnost.",
    image: "/projects/offtrader-academy.jpg",
    category: "Aplikace",
    technologies: ["Moodle", "PHP", "MySQL"],
    link: "https://academy.offtrader.ru",
    results: [
      "Vlastní Moodle instance",
      "Personalizované vzdělávací materiály",
      "Automatické hodnocení a certifikace"
    ]
  }
]

const categories = ["Všechny", "E-commerce", "Weby", "Aplikace", "Branding"]

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState("Všechny")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const filteredProjects = projects.filter(
    (project) => selectedCategory === "Všechny" || project.category === selectedCategory,
  )

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
              Naše <span className="text-blue-600">práce</span>
            </h1>
            <p className="text-xl text-gray-600">
              Ukázky naší práce a projekty, na kterých jsme pracovali.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-32 md:py-40 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Naše <span className="text-blue-600">projekty</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Vybraná řešení, která jsme navrhli a implementovali pro naše klienty.
            </p>
          </motion.div>

          {/* Categories filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((category, index) => (
              <motion.button
                key={index}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category 
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <AnimatePresence mode="wait">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => setSelectedProject(project)}
                  className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    <Image 
                      src={project.image} 
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex gap-2 mb-2">
                          {project.technologies.map((tech, index) => (
                            <span 
                              key={index} 
                              className="text-xs font-medium bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-xs font-medium text-blue-600 mb-2">
                      {project.category}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600">
                      {project.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="relative h-[400px]">
                <Image
                  src={selectedProject.image || "/placeholder.svg"}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedProject.title}</h2>
                <p className="text-gray-600 mb-6">{selectedProject.description}</p>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Technologie</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech) => (
                        <span key={tech} className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Výsledky</h3>
                    <ul className="space-y-2">
                      {selectedProject.results.map((result, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  {selectedProject.link && (
                    <Button asChild>
                      <a href={selectedProject.link} target="_blank" rel="noopener noreferrer">
                        Navštívit web
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {selectedProject.github && (
                    <Button variant="outline" asChild>
                      <a href={selectedProject.github} target="_blank" rel="noopener noreferrer">
                        GitHub
                        <Github className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <CtaBanner />
    </div>
  )
}

