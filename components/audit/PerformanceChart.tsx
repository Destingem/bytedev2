"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface PerformanceChartProps {
  score: number;
  metrics: any[];
}

export default function PerformanceChart({ score, metrics }: PerformanceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas dimensions considering device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    
    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)
    
    // Draw gauge
    const centerX = rect.width / 2
    const centerY = rect.height - 20
    const radius = Math.min(centerX, centerY) - 10
    
    // Draw background arc
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI, false)
    ctx.lineWidth = 15
    ctx.strokeStyle = '#e5e7eb'
    ctx.stroke()
    
    // Draw score arc
    const scoreRadians = (score / 100) * Math.PI + Math.PI
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, scoreRadians, false)
    ctx.lineWidth = 15
    
    // Color based on score
    let gradient
    if (score >= 90) {
      gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      gradient.addColorStop(0, '#34d399')
      gradient.addColorStop(1, '#10b981')
    } else if (score >= 50) {
      gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      gradient.addColorStop(0, '#fbbf24')
      gradient.addColorStop(1, '#f59e0b')
    } else {
      gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      gradient.addColorStop(0, '#f87171')
      gradient.addColorStop(1, '#ef4444')
    }
    
    ctx.strokeStyle = gradient
    ctx.stroke()
    
    // Draw score text
    ctx.font = 'bold 24px Inter, sans-serif'
    ctx.fillStyle = '#111827'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${score}`, centerX, centerY - 15)
    
    // Draw label
    ctx.font = '14px Inter, sans-serif'
    ctx.fillStyle = '#6b7280'
    ctx.fillText('Performance', centerX, centerY + 10)
  }, [score])
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-full max-w-[220px] aspect-square relative">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
        ></canvas>
      </div>
      
      <div className="w-full space-y-2">
        {metrics.slice(0, 3).map((metric, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.2 }}
            className="flex items-center justify-between"
          >
            <div className="text-sm font-medium text-gray-700">{metric.name}</div>
            <div className="flex items-center gap-2">
              <div 
                className={`text-sm font-semibold ${
                  metric.status === 'good' ? 'text-green-600' : 
                  metric.status === 'needs-improvement' ? 'text-amber-600' : 
                  'text-red-600'
                }`}
              >
                {metric.value} {metric.unit}
              </div>
              <div 
                className={`w-2 h-2 rounded-full ${
                  metric.status === 'good' ? 'bg-green-500' : 
                  metric.status === 'needs-improvement' ? 'bg-amber-500' : 
                  'bg-red-500'
                }`}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
