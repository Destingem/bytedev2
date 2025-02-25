"use client"

import { useEffect, useRef } from "react"

export const WaveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let mouseX = 0
    let mouseY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const drawWave = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, 'rgba(58, 101, 156, 0.6)') // blue-50
      gradient.addColorStop(1, 'rgb(215, 24, 24)')
      ctx.fillStyle = gradient

      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.moveTo(0, canvas.height / 2)

        for (let x = 0; x < canvas.width; x += 10) {
          const distanceFromMouse = Math.sqrt(
            Math.pow(x - mouseX, 2) + Math.pow(canvas.height / 2 - mouseY, 2)
          )
          const wave = Math.sin(x * 0.02 + time * 0.002 + i) * 50
          const yPos = canvas.height / 2 + wave + distanceFromMouse * 0.1
          ctx.lineTo(x, yPos)
        }

        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame((t) => drawWave(t))
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()
    drawWave(0)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 opacity-80"
    />
  )
}
