"use client"

import { motion } from "framer-motion"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { CheckCircle2, CircleDashed, ChevronRight, Loader2 } from "lucide-react"

interface AuditLoadingStepProps {
  title: string
  description: string
  status: "idle" | "loading" | "completed"
  progress?: number
}

export function AuditLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzujeme váš web</h2>
      <p className="text-gray-600 max-w-md text-center">
        Provádíme komplexní analýzu všech aspektů webu. Tento proces může trvat až 30 sekund.
      </p>
    </div>
  )
}

function AuditLoadingStep({ title, description, status, progress }: AuditLoadingStepProps) {
  return (
    <div className="flex mb-8">
      <div className="mr-4 mt-1">
        {status === "completed" ? (
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
        ) : status === "loading" ? (
          <div className="h-8 w-8 flex items-center justify-center">
            <LoadingSpinner size="sm" className="border-blue-600" />
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
            <CircleDashed className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <h3 className={`font-medium ${status === "idle" ? "text-gray-400" : "text-gray-900"}`}>
          {title}
        </h3>
        <p className={`text-sm ${status === "idle" ? "text-gray-400" : "text-gray-600"}`}>
          {description}
        </p>
        
        {status === "loading" && typeof progress === "number" && (
          <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
