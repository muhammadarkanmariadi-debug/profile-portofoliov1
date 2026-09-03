'use client'
import React, { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function StudioEnvironment() {
  const { scene } = useThree()

  // Generate the studio reflection texture with chromatic aberration edges
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    const ctx = canvas.getContext('2d')

    if (ctx) {
      // 1. Bright studio white background
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, 1024, 1024)

      // Helper for iridescent dispersion borders
      const drawIridescentBand = (y: number, height: number) => {
        // Top chromatic fringe (Cyan to Yellow-Orange)
        const topFringe = ctx.createLinearGradient(0, y - 14, 0, y)
        topFringe.addColorStop(0, 'rgba(0, 229, 255, 0)')
        topFringe.addColorStop(0.5, 'rgba(0, 200, 255, 0.9)')
        topFringe.addColorStop(0.85, 'rgba(255, 200, 0, 0.9)')
        topFringe.addColorStop(1, '#050508')
        ctx.fillStyle = topFringe
        ctx.fillRect(0, y - 14, 1024, 14)

        // Deep graphic black core
        ctx.fillStyle = '#08080C'
        ctx.fillRect(0, y, 1024, height)

        // Bottom chromatic fringe (Orange to Blue)
        const botFringe = ctx.createLinearGradient(0, y + height, 0, y + height + 14)
        botFringe.addColorStop(0, '#08080C')
        botFringe.addColorStop(0.2, 'rgba(255, 80, 20, 0.9)')
        botFringe.addColorStop(0.6, 'rgba(0, 150, 255, 0.8)')
        botFringe.addColorStop(1, 'rgba(0, 100, 255, 0)')
        ctx.fillStyle = botFringe
        ctx.fillRect(0, y + height, 1024, 14)
      }

      // Draw primary horizontal studio bands
      drawIridescentBand(180, 220)
      drawIridescentBand(620, 180)

      // Additional vertical reflection panel on left/right for 3D depth
      const vertGrad = ctx.createLinearGradient(0, 0, 200, 0)
      vertGrad.addColorStop(0, '#08080C')
      vertGrad.addColorStop(0.8, 'rgba(255, 120, 0, 0.6)')
      vertGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = vertGrad
      ctx.fillRect(0, 0, 200, 1024)
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

function TorusMesh() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (!meshRef.current) return

    // Smooth continuous floating rotation
    meshRef.current.rotation.x += delta * 0.38
    meshRef.current.rotation.y += delta * 0.5

    // Pointer parallax reaction
    const targetRotX = (state.pointer.y * Math.PI) / 5
    const targetRotY = (state.pointer.x * Math.PI) / 5

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, meshRef.current.rotation.x + targetRotX * 0.06, 0.08)
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, meshRef.current.rotation.y + targetRotY * 0.06, 0.08)
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
      {/* Torus Knot Geometry matching the visual proportions */}
      <torusKnotGeometry args={[0.98, 0.28, 280, 40, 2, 3]} />
      <meshPhysicalMaterial
        color="#FFFFFF"
        roughness={0.03}
        metalness={0.96}
        clearcoat={1.0}
        clearcoatRoughness={0.04}
        reflectivity={1.0}
        envMapIntensity={2.8}
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
        camera={{ position: [0, 0, 4.3], fov: 42 }}
        gl={{ 
          antialias: true, 
          alpha: true, 
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        className="w-full h-full !absolute inset-0 pointer-events-none"
      >
        <StudioEnvironment />

        {/* Ambient & Key Studio Lighting */}
        <ambientLight intensity={1.5} color="#FFFFFF" />
        <directionalLight position={[10, 15, 10]} intensity={3.5} color="#FFFFFF" />
        <directionalLight position={[-10, 15, -10]} intensity={2.5} color="#FFFFFF" />
        <directionalLight position={[0, -10, 10]} intensity={2.0} color="#FFFFFF" />
        <pointLight position={[0, 0, 6]} intensity={3.0} color="#FFFFFF" />

        <TorusMesh />
      </Canvas>
    </div>
  )
}
