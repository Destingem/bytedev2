"use client"
import { Hero } from "@/components/home/Hero"
import { BusinessApproach } from "@/components/home/BusinessApproach"
import { RentalModel } from "@/components/home/RentalModel"
import { ForWhom } from "@/components/home/ForWhom"
import { motion, useScroll, useSpring } from "framer-motion"
import { useState } from "react"
import { Portfolio } from "@/components/home/Portfolio"
import { AuditSection } from "@/components/home/AuditSection"
import { HostingSection } from "@/components/home/HostingSection"
import { CdnSection } from "@/components/home/CdnSection"
import { CtaBanner } from "@/components/home/CtaBanner"
import { OurProjects } from "@/components/home/OurProjects"

export default function Home() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform-origin-0"
        style={{ scaleX }}
      />

      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.06), transparent 80%)`,
        }}
      />

      <main className="flex-1" onMouseMove={handleMouseMove}>
        <Hero />
        <BusinessApproach />
        <OurProjects />
        <RentalModel />
        <AuditSection />
        <HostingSection />
        <CdnSection />
        <ForWhom />
        <CtaBanner />
      </main>
    </>
  )
}