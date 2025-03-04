"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, CircleDashed, Loader2 } from "lucide-react"

const AUDIT_STAGES = [
  { id: "init", label: "Inicializace auditu", description: "Připravuji analýzu webu" },
  { id: "fetch", label: "Načítání obsahu", description: "Stahuji obsah webové stránky" },
  { id: "performance", label: "Rychlost a výkon", description: "Měřím rychlost načítání a Core Web Vitals" },
  { id: "seo", label: "SEO analýza", description: "Kontroluji optimalizaci pro vyhledávače" },
  { id: "tech", label: "Technická analýza", description: "Detekuji technologie a serverovou konfiguraci" },
  { id: "ai", label: "AI doporučení", description: "Generuji personalizovaná doporučení" }
]

interface AuditProgressProps {
  currentStage: string
  isComplete?: boolean
}

export function AuditProgress({ currentStage, isComplete = false }: AuditProgressProps) {
  const [activeStageIndex, setActiveStageIndex] = useState(0)
  
  useEffect(() => {
    const index = AUDIT_STAGES.findIndex(stage => stage.id === currentStage)
    if (index !== -1) {
      setActiveStageIndex(index)
    }
  }, [currentStage])
  
  return (
    <div className="max-w-2xl mx-auto my-8">
      {AUDIT_STAGES.map((stage, index) => {
        const isActive = index === activeStageIndex
        const isCompleted = index < activeStageIndex || isComplete
        
        return (
          <div key={stage.id} className="flex items-start mb-6">
            <div className="mr-4 mt-1">
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </motion.div>
              ) : isActive ? (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center"
                >
                  <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                </motion.div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <CircleDashed className="h-5 w-5 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h3 className={`font-medium ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                {stage.label}
              </h3>
              <p className={`text-sm ${isActive || isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                {stage.description}
              </p>
              
              {isActive && !isComplete && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 8, ease: "linear" }}
                  className="h-1 bg-blue-500 mt-2 rounded-full"
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
