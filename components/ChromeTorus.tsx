'use client'
import React, { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function StudioEnvironment() {
  const { scene } = useThree()

  // Generate ultra-high contrast studio reflection texture with chromatic aberration fringes
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const ctx = canvas.getContext('2d')

    if (ctx) {
      // 1. Pure bright studio white background
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, 2048, 1024)

      // Function to draw smooth wavy zebra bands with chromatic fringes
      const drawCurvedChromaticBand = (
        startY: number,
        bandHeight: number,
        cyanColor: string,
        amberColor: string
      ) => {
        // --- TOP FRINGE (Cyan / Electric Blue) ---
        ctx.beginPath()
        ctx.moveTo(0, startY - 18)
        ctx.bezierCurveTo(512, startY - 35, 1536, startY + 5, 2048, startY - 18)
        ctx.lineTo(2048, startY)
        ctx.bezierCurveTo(1536, startY + 20, 512, startY - 18, 0, startY)
        ctx.closePath()

        const topGrad = ctx.createLinearGradient(0, startY - 25, 0, startY)
        topGrad.addColorStop(0, 'rgba(0, 240, 255, 0)')
        topGrad.addColorStop(0.4, cyanColor)
        topGrad.addColorStop(0.85, 'rgba(0, 160, 255, 0.95)')
        topGrad.addColorStop(1, '#050508')
        ctx.fillStyle = topGrad
        ctx.fill()

        // --- DEEP BLACK CORE ---
        ctx.beginPath()
        ctx.moveTo(0, startY)
        ctx.bezierCurveTo(512, startY - 18, 1536, startY + 20, 2048, startY)
        ctx.lineTo(2048, startY + bandHeight)
        ctx.bezierCurveTo(1536, startY + bandHeight - 20, 512, startY + bandHeight + 18, 0, startY + bandHeight)
        ctx.closePath()
        ctx.fillStyle = '#050508'
        ctx.fill()

        // --- BOTTOM FRINGE (Amber / Fiery Orange / Yellow) ---
        ctx.beginPath()
        ctx.moveTo(0, startY + bandHeight)
        ctx.bezierCurveTo(512, startY + bandHeight + 18, 1536, startY + bandHeight - 20, 2048, startY + bandHeight)
        ctx.lineTo(2048, startY + bandHeight + 20)
        ctx.bezierCurveTo(1536, startY + bandHeight + 38, 512, startY + bandHeight - 2, 0, startY + bandHeight + 20)
        ctx.closePath()

        const botGrad = ctx.createLinearGradient(0, startY + bandHeight, 0, startY + bandHeight + 25)
        botGrad.addColorStop(0, '#050508')
        botGrad.addColorStop(0.3, amberColor)
        botGrad.addColorStop(0.75, 'rgba(255, 180, 0, 0.95)')
        botGrad.addColorStop(1, 'rgba(255, 220, 0, 0)')
        ctx.fillStyle = botGrad
        ctx.fill()
      }

      // Draw primary horizontal studio bands with dynamic wave patterns
      drawCurvedChromaticBand(190, 240, 'rgba(0, 225, 255, 0.95)', 'rgba(255, 85, 0, 0.95)')
      drawCurvedChromaticBand(610, 220, 'rgba(0, 210, 255, 0.95)', 'rgba(255, 110, 0, 0.95)')

      // Vertical side studio reflectors for 3D rim lighting
      const leftGrad = ctx.createLinearGradient(0, 0, 280, 0)
      leftGrad.addColorStop(0, '#08080C')
      leftGrad.addColorStop(0.7, 'rgba(255, 130, 0, 0.7)')
      leftGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = leftGrad
      ctx.fillRect(0, 0, 280, 1024)

      const rightGrad = ctx.createLinearGradient(2048, 0, 1768, 0)
      rightGrad.addColorStop(0, '#08080C')
      rightGrad.addColorStop(0.7, 'rgba(0, 220, 255, 0.7)')
      rightGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = rightGrad
      ctx.fillRect(1768, 0, 280, 1024)
    }

    const tex = new THREE.CanvasTexture(canvas)
    tex.mapping = THREE.EquirectangularReflectionMapping
    tex.needsUpdate = true
    return tex
  }, [])

  useEffect(() => {
    scene.environment = texture
    return () => {
      scene.environment = null
    }
  }, [scene, texture])

  return null
}

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function TorusMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const baseRot = useRef({ x: 0, y: 0 })
  const pointerLerp = useRef({ x: 0, y: 0 })
  const scrollOffset = useRef({ rotZ: 0, zPos: 0, scaleMult: 1 })
  const { width, camera } = useThree((state) => ({ width: state.viewport.width, camera: state.camera }))

  // Dynamic responsive scale calculated according to screen breakpoints
  const responsiveScale = useMemo(() => {
    if (width < 3.6) return 0.24 // Mobile screens (<640px)
    if (width < 5.8) return 0.40 // Tablet screens (640px - 1024px)
    if (width < 8.8) return 0.70 // Desktop (1024px - 1440px)
    return 1.12                  // Large displays (>1440px)
  }, [width])

  useEffect(() => {
    const heroEl = document.getElementById('home')
    if (!heroEl) return

    const trigger = ScrollTrigger.create({
      trigger: heroEl,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => {
        const p = self.progress
        scrollOffset.current.rotZ = p * Math.PI * 1.5
        scrollOffset.current.zPos = -p * 2.8
        scrollOffset.current.scaleMult = 1 - p * 0.28
      }
    })

    return () => {
      trigger.kill()
    }
  }, [])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    // Continuous smooth rotation clock
    baseRot.current.x += delta * 0.35
    baseRot.current.y += delta * 0.45

    // Smoothly interpolated pointer parallax without compounding drift
    const targetX = (state.pointer.y * Math.PI) / 8
    const targetY = (state.pointer.x * Math.PI) / 8

    pointerLerp.current.x = THREE.MathUtils.lerp(pointerLerp.current.x, targetX, 0.05)
    pointerLerp.current.y = THREE.MathUtils.lerp(pointerLerp.current.y, targetY, 0.05)

    meshRef.current.rotation.x = baseRot.current.x + pointerLerp.current.x
    meshRef.current.rotation.y = baseRot.current.y + pointerLerp.current.y
    meshRef.current.rotation.z = scrollOffset.current.rotZ

    meshRef.current.position.z = scrollOffset.current.zPos
    const currentScale = responsiveScale * scrollOffset.current.scaleMult
    meshRef.current.scale.set(currentScale, currentScale, currentScale)
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={responsiveScale} castShadow receiveShadow>
      {/* Torus Knot Geometry scaled cleanly across breakpoints */}
      <torusKnotGeometry args={[0.78, 0.24, 300, 48, 2, 3]} />
      <meshPhysicalMaterial
        color="#FFFFFF"
        roughness={0.01}
        metalness={0.98}
        clearcoat={1.0}
        clearcoatRoughness={0.02}
        reflectivity={1.0}
        envMapIntensity={3.2}
      />
    </mesh>
  )
}

export default function ChromeTorus() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className="w-full h-full" />
  }

  return (
    <div className="w-full h-full relative pointer-events-none overflow-visible flex items-center justify-center">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5.8], fov: 36 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        className="w-full h-full !absolute inset-0 pointer-events-none overflow-visible"
      >
        <StudioEnvironment />

        {/* Studio Lighting */}
        <ambientLight intensity={2.8} color="#FFFFFF" />
        <directionalLight position={[10, 15, 10]} intensity={3.0} color="#FFFFFF" />
        <directionalLight position={[-10, 15, -10]} intensity={2.8} color="#FFFFFF" />
        <directionalLight position={[0, -10, 10]} intensity={2.5} color="#FFFFFF" />
        <pointLight position={[0, 0, 7]} intensity={3.5} color="#FFFFFF" />

        <TorusMesh />
      </Canvas>
    </div>
  )
}
