'use client'
import React, { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface DeviceCapabilities {
  isLowTier: boolean
  isMobile: boolean
  prefersReducedMotion: boolean
  dprRange: [number, number]
  geometryArgs: [number, number, number, number, number, number]
}

function StudioEnvironment({ isLowTier }: { isLowTier: boolean }) {
  const { scene } = useThree()

  // Generate studio reflection texture with adaptive resolution
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    const width = isLowTier ? 512 : 1024
    const height = isLowTier ? 256 : 512
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')

    if (ctx) {
      // 1. Bright studio white background
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, width, height)

      const scaleX = width / 2048
      const scaleY = height / 1024

      // Draw smooth wavy chromatic reflection bands
      const drawCurvedChromaticBand = (
        startY: number,
        bandHeight: number,
        cyanColor: string,
        amberColor: string  
      ) => {
        const sy = startY * scaleY
        const bh = bandHeight * scaleY

        // TOP FRINGE
        ctx.beginPath()
        ctx.moveTo(0, sy - 10 * scaleY)
        ctx.bezierCurveTo(512 * scaleX, sy - 20 * scaleY, 1536 * scaleX, sy + 5 * scaleY, width, sy - 10 * scaleY)
        ctx.lineTo(width, sy)
        ctx.bezierCurveTo(1536 * scaleX, sy + 15 * scaleY, 512 * scaleX, sy - 10 * scaleY, 0, sy)
        ctx.closePath()

        const topGrad = ctx.createLinearGradient(0, sy - 15 * scaleY, 0, sy)
        topGrad.addColorStop(0, 'rgba(0, 240, 255, 0)')
        topGrad.addColorStop(0.5, cyanColor)
        topGrad.addColorStop(1, '#050508')
        ctx.fillStyle = topGrad
        ctx.fill()

        // DEEP BLACK CORE
        ctx.beginPath()
        ctx.moveTo(0, sy)
        ctx.bezierCurveTo(512 * scaleX, sy - 10 * scaleY, 1536 * scaleX, sy + 15 * scaleY, width, sy)
        ctx.lineTo(width, sy + bh)
        ctx.bezierCurveTo(1536 * scaleX, sy + bh - 15 * scaleY, 512 * scaleX, sy + bh + 12 * scaleY, 0, sy + bh)
        ctx.closePath()
        ctx.fillStyle = '#050508'
        ctx.fill()

        // BOTTOM FRINGE
        ctx.beginPath()
        ctx.moveTo(0, sy + bh)
        ctx.bezierCurveTo(512 * scaleX, sy + bh + 12 * scaleY, 1536 * scaleX, sy + bh - 15 * scaleY, width, sy + bh)
        ctx.lineTo(width, sy + bh + 15 * scaleY)
        ctx.bezierCurveTo(1536 * scaleX, sy + bh + 25 * scaleY, 512 * scaleX, sy + bh - 2 * scaleY, 0, sy + bh + 15 * scaleY)
        ctx.closePath()

        const botGrad = ctx.createLinearGradient(0, sy + bh, 0, sy + bh + 18 * scaleY)
        botGrad.addColorStop(0, '#050508')
        botGrad.addColorStop(0.4, amberColor)
        botGrad.addColorStop(1, 'rgba(255, 200, 0, 0)')
        ctx.fillStyle = botGrad
        ctx.fill()
      }

      drawCurvedChromaticBand(190, 240, 'rgba(0, 225, 255, 0.95)', 'rgba(255, 85, 0, 0.95)')
      drawCurvedChromaticBand(610, 220, 'rgba(0, 210, 255, 0.95)', 'rgba(255, 110, 0, 0.95)')
    }

    const tex = new THREE.CanvasTexture(canvas)
    tex.mapping = THREE.EquirectangularReflectionMapping
    tex.needsUpdate = true
    return tex
  }, [isLowTier])

  useEffect(() => {
    scene.environment = texture
    return () => {
      scene.environment = null
      texture.dispose()
    }
  }, [scene, texture])

  return null
}

function TorusMesh({
  geometryArgs,
  isVisible,
  isLowTier,
}: {
  geometryArgs: [number, number, number, number, number, number]
  isVisible: boolean
  isLowTier: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const baseRot = useRef({ x: 0, y: 0 })
  const pointerLerp = useRef({ x: 0, y: 0 })
  const scrollOffset = useRef({ rotZ: 0, zPos: 0, scaleMult: 1 })
  const { width } = useThree((state) => ({ width: state.viewport.width }))

  const responsiveScale = useMemo(() => {
    if (width < 3.6) return 0.24 // Mobile (<640px)
    if (width < 5.8) return 0.40 // Tablet (640px - 1024px)
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
      scrub: 1.0,
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
    // Completely skip calculations if section is out of viewport
    if (!isVisible || !meshRef.current) return

    baseRot.current.x += delta * (isLowTier ? 0.25 : 0.35)
    baseRot.current.y += delta * (isLowTier ? 0.35 : 0.45)

    if (!isLowTier) {
      const targetX = (state.pointer.y * Math.PI) / 8
      const targetY = (state.pointer.x * Math.PI) / 8
      pointerLerp.current.x = THREE.MathUtils.lerp(pointerLerp.current.x, targetX, 0.05)
      pointerLerp.current.y = THREE.MathUtils.lerp(pointerLerp.current.y, targetY, 0.05)
    }

    meshRef.current.rotation.x = baseRot.current.x + pointerLerp.current.x
    meshRef.current.rotation.y = baseRot.current.y + pointerLerp.current.y
    meshRef.current.rotation.z = scrollOffset.current.rotZ

    meshRef.current.position.z = scrollOffset.current.zPos
    const currentScale = responsiveScale * scrollOffset.current.scaleMult
    meshRef.current.scale.set(currentScale, currentScale, currentScale)
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={responsiveScale}>
      <torusKnotGeometry args={geometryArgs} />
      <meshPhysicalMaterial
        color="#FFFFFF"
        roughness={isLowTier ? 0.05 : 0.01}
        metalness={0.96}
        clearcoat={isLowTier ? 0.5 : 1.0}
        clearcoatRoughness={0.05}
        reflectivity={1.0}
        envMapIntensity={isLowTier ? 2.5 : 3.2}
      />
    </mesh>
  )
}

export default function ChromeTorus() {
  const [isClient, setIsClient] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [caps, setCaps] = useState<DeviceCapabilities>({
    isLowTier: false,
    isMobile: false,
    prefersReducedMotion: false,
    dprRange: [1, 1.5],
    geometryArgs: [0.78, 0.24, 180, 32, 2, 3],
  })

  useEffect(() => {
    setIsClient(true)

    // Hardware Capability Detection
    if (typeof window !== 'undefined') {
      const cores = navigator.hardwareConcurrency || 4
      const memory = (navigator as any).deviceMemory || 4
      const isMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const isLowTier = cores <= 4 || memory <= 4 || isMobile

      setCaps({
        isLowTier,
        isMobile,
        prefersReducedMotion,
        dprRange: isLowTier ? [1, 1.1] : [1, 1.5],
        geometryArgs: isLowTier 
          ? [0.78, 0.24, 90, 18, 2, 3]   // ~1,620 vertices on low-spec/mobile
          : [0.78, 0.24, 180, 32, 2, 3], // ~5,760 vertices on desktop (down from 14,400)
      })

      // Viewport Intersection Observer to completely pause Three.js when scrolled away from Hero
      const heroEl = document.getElementById('home')
      if (heroEl) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              setIsVisible(entry.isIntersecting)
            })
          },
          { threshold: 0.05 }
        )
        observer.observe(heroEl)
        return () => observer.disconnect()
      }
    }
  }, [])

  if (!isClient || caps.prefersReducedMotion) {
    return <div className="w-full h-full" />
  }

  return (
    <div className="w-full h-full relative pointer-events-none overflow-visible flex items-center justify-center">
      <Canvas
        frameloop={isVisible ? 'always' : 'never'}
        dpr={caps.dprRange}
        camera={{ position: [0, 0, 5.8], fov: 36 }}
        gl={{
          antialias: !caps.isLowTier,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          precision: caps.isLowTier ? 'mediump' : 'highp'
        }}
        className="w-full h-full !absolute inset-0 pointer-events-none overflow-visible"
      >
        <StudioEnvironment isLowTier={caps.isLowTier} />

        {/* Optimized Lighting (2-3 lights maximum) */}
        <ambientLight intensity={caps.isLowTier ? 2.5 : 2.8} color="#FFFFFF" />
        <directionalLight position={[10, 15, 10]} intensity={3.0} color="#FFFFFF" />
        <directionalLight position={[-10, 15, -10]} intensity={2.5} color="#FFFFFF" />
        {!caps.isLowTier && <pointLight position={[0, 0, 7]} intensity={3.0} color="#FFFFFF" />}

        <TorusMesh
          geometryArgs={caps.geometryArgs}
          isVisible={isVisible}
          isLowTier={caps.isLowTier}
        />
      </Canvas>
    </div>
  )
}

