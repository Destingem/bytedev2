"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export const MeshBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  const targetPosition = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!containerRef.current) return

    // Setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    
    // Geometry setup
    const geometry = new THREE.PlaneGeometry(80, 80, 50, 50) // Increased size and detail
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      wireframe: true,
      color: '#60a5fa', // Lighter blue
      shininess: 100,
      transparent: true,
      opacity: 0.8, // Increased opacity
      wireframeLinewidth: 1.5
    })
    
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    mesh.rotation.x = -0.3 // Tilt the mesh slightly
    
    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(0, 1, 1)
    scene.add(light)
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // Camera position
    camera.position.z = 20 // Moved camera back

    // Renderer setup
    renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.current.appendChild(renderer.domElement)

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)

      // Smooth mouse tracking with increased effect
      targetPosition.current.x += (mousePosition.current.x - targetPosition.current.x) * 0.05
      targetPosition.current.y += (mousePosition.current.y - targetPosition.current.y) * 0.05

      // Update mesh vertices with more dramatic effect
      const positions = geometry.attributes.position.array
      const time = Date.now() * 0.001
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i]
        const y = positions[i + 1]
        const distance = Math.sqrt(
          Math.pow(x - targetPosition.current.x * 20, 2) + 
          Math.pow(y - targetPosition.current.y * 20, 2)
        )
        
        // More complex wave pattern
        positions[i + 2] = 
          Math.sin(distance * 0.3 + time) * 2.0 + 
          Math.cos(x * 0.3 + time) * 1.0 +
          Math.sin(y * 0.3 + time) * 1.0
      }
      
      geometry.attributes.position.needsUpdate = true

      // More dramatic rotation
      mesh.rotation.x = -0.3 + targetPosition.current.y * 0.3
      mesh.rotation.y = targetPosition.current.x * 0.3

      renderer.render(scene, camera)
    }

    // Event listeners
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 z-0" />
}
