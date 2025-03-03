"use client"

import { motion } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import * as d3 from "d3-shape"
import useMeasure from "react-use-measure"

const roadmapSteps = [
  {
    title: "Krok 1: Úvodní konzultace",
    description: "Setkáme se s vámi, abychom pochopili vaše potřeby a cíle.",
  },
  {
    title: "Krok 2: Návrh řešení",
    description: "Připravíme návrh řešení, který bude odpovídat vašim požadavkům.",
  },
  {
    title: "Krok 2.1: Prototypování",
    description: "U větších projektů vytvoříme interaktivní prototyp pro lepší představu.",
    optional: true
  },
  {
    title: "Krok 3: Vývoj a testování",
    description: "Začneme s vývojem a průběžně testujeme, aby vše fungovalo správně.",
  },
  {
    title: "Krok 4: Nasazení",
    description: "Nasadíme hotové řešení na produkční prostředí.",
  },
  {
    title: "Krok 5: Podpora a údržba",
    description: "Poskytujeme podporu a údržbu, aby váš web byl vždy aktuální.",
  },
  {
    title: "Krok 6: Modernizace a úpravy",
    description: "Průběžně aktualizujeme a vylepšujeme web podle nejnovějších trendů a vašich potřeb.",
  },
]

export function RoadmapSection() {
  const [pathRef, bounds] = useMeasure()
  const [points, setPoints] = useState<[number, number][]>([])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const updatePoints = () => {
      const newPoints: [number, number][] = []
      cardRefs.current.forEach((ref, index) => {
        if (!ref) return
        const rect = ref.getBoundingClientRect()
        const x = rect.left + rect.width / 2 - (bounds.left || 0)
        const baseY = index % 2 === 0 ? 
          rect.bottom - (bounds.top || 0) : 
          rect.top - (bounds.top || 0)
        
        // Add control points with responsive offsets
        const offset = index % 2 === 0 ? -1 * (bounds.height / 8) : bounds.height / 8
        if (index > 0) {
          newPoints.push([x - (bounds.width / 10), baseY + offset])
        }
        newPoints.push([x, baseY + offset])
        if (index < cardRefs.current.length - 1) {
          newPoints.push([x + (bounds.width / 10), baseY + offset])
        }
      })
      setPoints(newPoints.filter(point => point[0] !== 0))
    }

    updatePoints()
    window.addEventListener('resize', updatePoints)
    return () => window.removeEventListener('resize', updatePoints)
  }, [bounds])

  const pathString = points.length > 0 ? d3.line()
    .x(d => d[0])
    .y(d => d[1])
    .curve(d3.curveBasis)(points) || '' : '' // Changed to curveBasis for smoother curves

  return (
    <section className="py-16 lg:py-20 bg-white overflow-hidden">
      <div className="px-4 md:px-6 min-h-[40vh] max-h-[80vh]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb max-w-3xl mx-auto relative"
        >
        
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 relative z-10">
            Cesta k <span className="text-blue-600">úspěšnému projektu</span>
          </h2>
          <p className="text-xl text-gray-600 relative z-10">
            Jednoduchý a transparentní proces, který vás dovede k cíli
          </p>
        </motion.div>

        <div className="relative w-full lg:w-[100%] lg:-translate-x-[5%]" ref={pathRef}>
          {/* Connecting path */}
          <svg
            className="absolute inset-0 w-full h-full -z-10"
            style={{ transform: 'translateY(-3rem)' }}
          >
            <motion.path
              d={pathString}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="drop-shadow-md"
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#60A5FA" />
              </linearGradient>
            </defs>

            {/* Updated animated dot */}
            <motion.circle
              r="6"
              fill="#3B82F6"
              filter="drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))"
              initial={{ pathOffset: 0 }}
              animate={{ 
                pathOffset: [0, 1]
              }}
              transition={{
                duration: 5,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
              }}
              style={{
                offsetPath: `path("${pathString}")`,
              }}
            />
          </svg>

          {/* Cards */}
          <div className="relative h-[90vh] mx-auto max-w-full px-[10%]">
            {roadmapSteps.map((step, index) => (
              <motion.div
                key={index}
                ref={el => cardRefs.current[index] = el}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="absolute w-[16rem] md:w-[18rem] lg:w-[20rem]"
                style={{
                  left: `${(index / (roadmapSteps.length - 1)) * 80 + 10}%`,
                  top: index % 2 === 0 ? '15vh' : '55vh',
                  transform: 'translate(-50%, 0)',
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`
                    bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all
                    relative
                    ${step.optional ? 'border-2 border-dashed border-blue-200' : 'border border-gray-100'}
                  `}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold shadow-lg"
                    >
                      {!step.optional ? (index + 1) : '*'}
                    </motion.div>
                    {step.optional && (
                      <span className="text-sm font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                        Volitelné
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>

                  {/* Connection points */}
                
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile view - updated to be more responsive */}
        <div className="md:hidden space-y-6 mt-8 w-full">
          {roadmapSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="w-full max-w-[90vw] mx-auto"
            >
              {/* ... stejný obsah karty jako výše ... */}
            </motion.div>
          ))}
        </div>
      </div>


    </section>
  )
}
