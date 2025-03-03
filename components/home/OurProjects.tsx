"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

// Define categories for filtering
const categories = ["Všechny", "E-commerce", "Weby", "Aplikace", "Branding"]

// Project data
const projects = [
  {
    id: 1,
    title: "Bohemia Healing",
    category: "E-commerce",
    description: "Prémiový e-shop s CBD produkty",
    image: "/images/projects/bohemia-healing.jpg",
    url: "https://bohemiahealing.cz",
    tags: ["Shoptet", "UI/UX", "Branding"]
  },
  {
    id: 2,
    title: "Doktor na telefonu",
    category: "Aplikace",
    description: "Telemedicínská platforma pro online konzultace",
    image: "/images/projects/doktor-na-telefonu.jpg",
    url: "https://doktornatelefonu.cz",
    tags: ["React", "Next.js", "API"]
  },
  {
    id: 3,
    title: "Zdravá strava",
    category: "Weby",
    description: "Informační portál o zdravé výživě",
    image: "/images/projects/zdrava-strava.jpg",
    url: "https://zdravastrava.cz",
    tags: ["WordPress", "SEO", "Content"]
  },
  {
    id: 4,
    title: "Lékárna.cz",
    category: "E-commerce",
    description: "Online lékárna s širokou nabídkou",
    image: "/images/projects/lekarna.jpg",
    url: "https://lekarna.cz",
    tags: ["E-commerce", "UX/UI", "Shoptet"]
  },
  {
    id: 5,
    title: "Fitness Coach",
    category: "Aplikace",
    description: "Mobilní aplikace pro sledování tréninků",
    image: "/images/projects/fitness-coach.jpg",
    url: "https://fitnesscoach.cz",
    tags: ["React Native", "Firebase", "UX/UI"]
  },
  {
    id: 6,
    title: "Bylinky z hor",
    category: "Branding",
    description: "Rebrand tradiční značky bylinných produktů",
    image: "/images/projects/bylinky-z-hor.jpg",
    url: "https://bylinkyzhor.cz",
    tags: ["Branding", "Web", "Packaging"]
  }
]

export function OurProjects() {
  const [activeCategory, setActiveCategory] = useState("Všechny")
  const [visibleProjects, setVisibleProjects] = useState(projects)

  // Filter projects based on selected category
  const filterProjects = (category: string) => {
    setActiveCategory(category)
    if (category === "Všechny") {
      setVisibleProjects(projects)
    } else {
      setVisibleProjects(projects.filter(project => project.category === category))
    }
  }

  return (
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
              onClick={() => filterProjects(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category 
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

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <AnimatePresence mode="wait">
            {visibleProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* Image container with consistent aspect ratio */}
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
                        {project.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="text-xs font-medium bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link 
                        href={project.url} 
                        className="text-white flex items-center gap-2 text-sm font-medium hover:underline"
                        target="_blank"
                      >
                        Navštívit web <ExternalLink size={14} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Content */}
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

        {/* View all projects button */}
        <div className="text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="outline" size="lg">
              Zobrazit všechny projekty
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
