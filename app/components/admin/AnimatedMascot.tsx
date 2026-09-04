'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useTheme } from '@/app/providers';

export type MascotState = 
  | 'idle' 
  | 'email-focus' 
  | 'password-focus' 
  | 'password-peek' 
  | 'submitting' 
  | 'success' 
  | 'error'
  | 'waving'
  | 'scanning'
  | 'sleeping'
  | 'poked'
  | 'cheering';

interface AnimatedMascotProps {
  state: MascotState;
  textLength?: number;
  onMascotClick?: () => void;
  onAutoStateChange?: (state: MascotState) => void;
}

export default function AnimatedMascot({ 
  state, 
  textLength = 0, 
  onMascotClick,
  onAutoStateChange
}: AnimatedMascotProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [blink, setBlink] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [effectiveState, setEffectiveState] = useState<MascotState>(state);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autonomousActionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync external state changes
  useEffect(() => {
    setEffectiveState(state);
  }, [state]);

  // Welcome greeting wave on initial mount
  useEffect(() => {
    const welcomeTimer = setTimeout(() => {
      setEffectiveState('waving');
      const resetTimer = setTimeout(() => {
        setEffectiveState('idle');
      }, 2400);
      return () => clearTimeout(resetTimer);
    }, 400);

    return () => clearTimeout(welcomeTimer);
  }, []);

  // Autonomous life cycle: Random micro-actions & auto-sleep when user is inactive
  useEffect(() => {
    if (state !== 'idle') return;

    // Schedule random autonomous actions every 10-18 seconds (e.g., scan, look around, wave)
    autonomousActionTimerRef.current = setInterval(() => {
      if (effectiveState === 'idle') {
        const actions: MascotState[] = ['waving', 'scanning', 'idle'];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        
        if (randomAction !== 'idle') {
          setEffectiveState(randomAction);
          setTimeout(() => {
            setEffectiveState('idle');
          }, 2600);
        }
      }
    }, 14000);

    // Auto-sleep after 35 seconds of complete idle
    idleTimerRef.current = setTimeout(() => {
      if (effectiveState === 'idle') {
        setEffectiveState('sleeping');
      }
    }, 35000);

    return () => {
      if (autonomousActionTimerRef.current) clearInterval(autonomousActionTimerRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [state, effectiveState]);

  // Periodic eye blinking
  useEffect(() => {
    if (effectiveState !== 'idle' && effectiveState !== 'email-focus' && effectiveState !== 'waving') return;

    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 3000 + Math.random() * 2200);

    return () => clearInterval(interval);
  }, [effectiveState]);

  // Mouse cursor tracking & wake on mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (effectiveState === 'sleeping') {
      setEffectiveState('idle');
    }

    if (effectiveState !== 'idle' && effectiveState !== 'waving') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    setMousePos({ x, y });
  };

  const handleMascotInternalClick = () => {
    if (effectiveState === 'submitting' || effectiveState === 'success') return;
    setEffectiveState('poked');
    setTimeout(() => {
      setEffectiveState('idle');
    }, 1200);
    if (onMascotClick) onMascotClick();
  };

  const emailPupilX = Math.min(Math.max((textLength - 12) * 0.8, -8), 8);

  // Anti-gravity float & bobbing animation
  const droidFloatVariants: Variants = {
    idle: {
      y: [0, -10, 0],
      rotate: [0, -1.5, 1.5, 0],
      transition: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' },
    },
    'email-focus': {
      y: 4,
      rotate: 3,
      x: 3,
      transition: { type: 'spring', stiffness: 300, damping: 22 },
    },
    'password-focus': {
      y: 0,
      rotate: 0,
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
    'password-peek': {
      y: -2,
      rotate: -3,
      x: -2,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
    submitting: {
      y: [0, -4, 0],
      rotate: [0, -2, 2, 0],
      transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
    },
    success: {
      y: [0, -26, 0],
      rotate: [0, -8, 8, 0],
      transition: { duration: 0.6, repeat: 3, ease: 'easeOut' },
    },
    error: {
      x: [0, -10, 10, -8, 8, -4, 4, 0],
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
    waving: {
      y: [0, -8, 0],
      rotate: [0, 2, -2, 0],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    },
    scanning: {
      y: 10,
      rotate: 0,
      transition: { type: 'spring', stiffness: 300, damping: 18 },
    },
    sleeping: {
      y: [6, 12, 6],
      rotate: [3, 4, 3],
      transition: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
    },
    poked: {
      rotate: [0, -15, 15, -10, 10, 0],
      y: [0, -14, 0],
      scale: [1, 1.08, 1],
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    cheering: {
      y: [0, -22, 0],
      rotate: [-6, 6, -6],
      transition: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  // Floating Magnetic Left Hand
  const leftHandVariants: Variants = {
    idle: {
      y: [0, -6, 0],
      x: 0,
      rotate: 0,
      transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
    },
    'email-focus': {
      y: 8,
      x: 6,
      rotate: 12,
      transition: { type: 'spring', stiffness: 350, damping: 20 },
    },
    'password-focus': {
      y: -64,
      x: 34,
      rotate: 25,
      transition: { type: 'spring', stiffness: 450, damping: 24 },
    },
    'password-peek': {
      y: -64,
      x: 34,
      rotate: 25,
    },
    submitting: {
      y: -10,
      x: 4,
      rotate: 15,
      transition: { duration: 0.2 },
    },
    success: {
      y: -50,
      x: -18,
      rotate: -45,
      transition: { type: 'spring', stiffness: 350, damping: 16 },
    },
    error: {
      y: 16,
      x: -4,
      rotate: -15,
      transition: { duration: 0.3 },
    },
    waving: {
      y: 6,
      x: -2,
      rotate: -10,
      transition: { duration: 0.3 },
    },
    scanning: {
      y: 12,
      x: 8,
      rotate: 20,
      transition: { duration: 0.3 },
    },
    sleeping: {
      y: 18,
      x: 4,
      rotate: 15,
      transition: { duration: 0.6 },
    },
    poked: {
      y: -25,
      x: -15,
      rotate: -30,
      transition: { duration: 0.4 },
    },
    cheering: {
      y: -54,
      x: -20,
      rotate: -60,
      transition: { duration: 0.4, repeat: Infinity, repeatType: 'reverse' },
    },
  };

  // Floating Magnetic Right Hand
  const rightHandVariants: Variants = {
    idle: {
      y: [0, -6, 0],
      x: 0,
      rotate: 0,
      transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 },
    },
    'email-focus': {
      y: 8,
      x: 10,
      rotate: -8,
      transition: { type: 'spring', stiffness: 350, damping: 20 },
    },
    'password-focus': {
      y: -64,
      x: -34,
      rotate: -25,
      transition: { type: 'spring', stiffness: 450, damping: 24 },
    },
    'password-peek': {
      y: -24,
      x: -16,
      rotate: -5,
      transition: { type: 'spring', stiffness: 350, damping: 20 },
    },
    submitting: {
      y: -10,
      x: -4,
      rotate: -15,
      transition: { duration: 0.2 },
    },
    success: {
      y: -50,
      x: 18,
      rotate: 45,
      transition: { type: 'spring', stiffness: 350, damping: 16 },
    },
    error: {
      y: 16,
      x: 4,
      rotate: 15,
      transition: { duration: 0.3 },
    },
    waving: {
      y: [-62, -74, -62],
      x: [24, 38, 24],
      rotate: [20, 60, 20],
      transition: { duration: 0.75, repeat: Infinity, ease: 'easeInOut' },
    },
    scanning: {
      y: 12,
      x: -8,
      rotate: -20,
      transition: { duration: 0.3 },
    },
    sleeping: {
      y: 18,
      x: -4,
      rotate: -15,
      transition: { duration: 0.6 },
    },
    poked: {
      y: -25,
      x: 15,
      rotate: 30,
      transition: { duration: 0.4 },
    },
    cheering: {
      y: -54,
      x: 20,
      rotate: 60,
      transition: { duration: 0.4, repeat: Infinity, repeatType: 'reverse' },
    },
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onClick={handleMascotInternalClick}
      className="relative w-full max-w-[280px] h-[340px] mx-auto flex items-center justify-center select-none cursor-pointer group"
      title="AERO-BOT (Click to poke!)"
    >
      {/* Floor Magnetic Propulsion Shadow */}
      <motion.div
        animate={{
          scale: effectiveState === 'success' || effectiveState === 'cheering' ? [1, 0.7, 1] : [1, 1.12, 1],
          opacity: effectiveState === 'success' || effectiveState === 'cheering' ? [0.6, 0.2, 0.6] : [0.35, 0.5, 0.35],
        }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute bottom-6 w-32 h-6 rounded-full blur-md ${
          isLight ? 'bg-sky-500/25' : 'bg-primary/25'
        }`}
      />

      {/* Sleep ZZZ Particles */}
      {effectiveState === 'sleeping' && (
        <div className="absolute top-8 right-8 font-mono font-bold text-xs text-primary/80 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 0], y: -24, x: [0, 8, 16], scale: 1.2 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
          >
            z Z Z
          </motion.div>
        </div>
      )}

      {/* AERO-BOT VECTOR GRAPHIC */}
      <svg
        viewBox="0 0 240 320"
        className="w-full h-full overflow-visible transition-transform duration-200 group-hover:scale-[1.02]"
      >
        <defs>
          {/* Light / Dark Adaptive Chassis Shading */}
          <linearGradient id="chassisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            {isLight ? (
              <>
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#F1F5F9" />
                <stop offset="100%" stopColor="#E2E8F0" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#222834" />
                <stop offset="50%" stopColor="#181D26" />
                <stop offset="100%" stopColor="#10131A" />
              </>
            )}
          </linearGradient>

          {/* Light / Dark Titanium Highlights */}
          <linearGradient id="titaniumRim" x1="0%" y1="0%" x2="0%" y2="100%">
            {isLight ? (
              <>
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#3A4354" />
                <stop offset="100%" stopColor="#1E232E" />
              </>
            )}
          </linearGradient>

          {/* Plasma Jet Flame Glow */}
          <linearGradient id="jetFlame" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isLight ? "#0284C7" : "#38BDF8"} stopOpacity="0.9" />
            <stop offset="60%" stopColor="#818CF8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </linearGradient>

          {/* Neon Glow Filter */}
          <filter id="oledGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={isLight ? "2" : "3"} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* MAIN DROID GROUP */}
        <motion.g
          variants={droidFloatVariants}
          animate={effectiveState}
        >
          {/* ANTI-GRAVITY THRUSTER CONE & FLAME */}
          <g transform="translate(120, 246)">
            <ellipse 
              cx="0" cy="0" rx="20" ry="6" 
              fill={isLight ? "#E2E8F0" : "#181D26"} 
              stroke={isLight ? "#CBD5E1" : "#2D3545"} 
              strokeWidth="2" 
            />
            <ellipse cx="0" cy="1" rx="14" ry="4" fill={isLight ? "#0F172A" : "#0D0F14"} />
            
            {/* Animated Plasma Jet Stream */}
            <motion.path
              d="M -12 2 Q 0 34 12 2 Z"
              fill="url(#jetFlame)"
              filter="url(#oledGlow)"
              animate={{
                scaleY: effectiveState === 'success' || effectiveState === 'cheering' ? [1, 1.8, 1] : effectiveState === 'sleeping' ? [0.6, 0.8, 0.6] : [1, 1.3, 0.9, 1.2, 1],
                opacity: effectiveState === 'success' || effectiveState === 'cheering' ? [0.9, 1, 0.9] : effectiveState === 'sleeping' ? [0.3, 0.5, 0.3] : [0.7, 0.95, 0.7],
              }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </g>

          {/* DROID MAIN BODY CAPSULE */}
          <rect
            x="60"
            y="60"
            width="120"
            height="180"
            rx="60"
            fill="url(#chassisGrad)"
            stroke="url(#titaniumRim)"
            strokeWidth={isLight ? "2.5" : "3"}
            filter={isLight ? "drop-shadow(0 10px 25px rgba(0,0,0,0.08))" : "drop-shadow(0 10px 25px rgba(0,0,0,0.4))"}
          />

          {/* Lateral Antenna / Sensor Fin (Left) */}
          <rect 
            x="46" y="110" width="10" height="28" rx="5" 
            fill={isLight ? "#E2E8F0" : "#181D26"} 
            stroke={isLight ? "#CBD5E1" : "#2D3545"} 
            strokeWidth="2" 
          />
          <circle cx="51" cy="124" r="2.5" fill={isLight ? "#0284C7" : "#38BDF8"} filter="url(#oledGlow)" />

          {/* Lateral Antenna / Sensor Fin (Right) */}
          <rect 
            x="184" y="110" width="10" height="28" rx="5" 
            fill={isLight ? "#E2E8F0" : "#181D26"} 
            stroke={isLight ? "#CBD5E1" : "#2D3545"} 
            strokeWidth="2" 
          />
          <circle cx="189" cy="124" r="2.5" fill={isLight ? "#0284C7" : "#38BDF8"} filter="url(#oledGlow)" />

          {/* Top Audio / Comm Dome Sensor */}
          <path 
            d="M 106 60 Q 120 48 134 60" 
            fill="none" 
            stroke={isLight ? "#0284C7" : "#38BDF8"} 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            filter="url(#oledGlow)" 
          />
          <circle cx="120" cy="50" r="3.5" fill={isLight ? "#0284C7" : "#38BDF8"} filter="url(#oledGlow)" />

          {/* CURVED OLED VISOR SCREEN */}
          <rect
            x="68"
            y="76"
            width="104"
            height="76"
            rx="34"
            fill="#08090D"
            stroke={isLight ? "#334155" : "#1B202B"}
            strokeWidth="2"
          />

          {/* Visor Specular Sheen (Glossy Reflection) */}
          <path
            d="M 82 82 Q 120 74 158 82"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity={isLight ? "0.25" : "0.15"}
          />

          {/* SCANNING BEAM EMISSION (When Scanning) */}
          {effectiveState === 'scanning' && (
            <motion.path
              d="M 80 140 L 40 230 L 200 230 L 160 140 Z"
              fill="url(#jetFlame)"
              opacity="0.3"
              filter="url(#oledGlow)"
              animate={{ opacity: [0.15, 0.45, 0.15] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}

          {/* TORSO / SYSTEM STATUS PANEL */}
          <g transform="translate(120, 185)">
            <rect 
              x="-34" y="-12" width="68" height="42" rx="14" 
              fill={isLight ? "#F1F5F9" : "#0D0F14"} 
              stroke={isLight ? "#CBD5E1" : "#1F2430"} 
              strokeWidth="1.5" 
            />
            
            <circle 
              cx="0" cy="9" r="9" 
              fill={isLight ? "#E2E8F0" : "#131720"} 
              stroke={isLight ? "#94A3B8" : "#283040"} 
              strokeWidth="1.5" 
            />
            <motion.circle
              cx="0"
              cy="9"
              r="4.5"
              fill={effectiveState === 'success' || effectiveState === 'cheering' ? '#34D399' : effectiveState === 'error' ? '#F43F5E' : isLight ? '#0284C7' : '#38BDF8'}
              filter="url(#oledGlow)"
              animate={
                effectiveState === 'submitting'
                  ? { scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }
                  : { opacity: [0.8, 1, 0.8] }
              }
              transition={{ duration: 1.5, repeat: Infinity }}
            />

            <line x1="-24" y1="9" x2="-14" y2="9" stroke={isLight ? "#94A3B8" : "#283040"} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="14" y1="9" x2="24" y2="9" stroke={isLight ? "#94A3B8" : "#283040"} strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* OLED FACE GLYPHS / EYES */}
          {/* LEFT EYE GLYPH */}
          <g transform="translate(95, 114)">
            {effectiveState === 'sleeping' ? (
              <line x1="-8" y1="2" x2="8" y2="2" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" filter="url(#oledGlow)" />
            ) : effectiveState === 'poked' ? (
              <g stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" filter="url(#oledGlow)">
                <line x1="0" y1="-8" x2="0" y2="2" />
                <circle cx="0" cy="7" r="1.5" fill="#38BDF8" />
              </g>
            ) : blink ? (
              <line x1="-9" y1="0" x2="9" y2="0" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" filter="url(#oledGlow)" />
            ) : effectiveState === 'error' ? (
              <g stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" filter="url(#oledGlow)">
                <line x1="-6" y1="-6" x2="6" y2="6" />
                <line x1="6" y1="-6" x2="-6" y2="6" />
              </g>
            ) : effectiveState === 'success' || effectiveState === 'cheering' ? (
              <path d="M -8 3 Q 0 -6 8 3" fill="none" stroke="#34D399" strokeWidth="3.5" strokeLinecap="round" filter="url(#oledGlow)" />
            ) : effectiveState === 'waving' ? (
              <path d="M -8 3 Q 0 -5 8 3" fill="none" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" filter="url(#oledGlow)" />
            ) : effectiveState === 'submitting' || effectiveState === 'scanning' ? (
              <motion.circle
                cx="0"
                cy="0"
                r="7"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="2.5"
                strokeDasharray="12 6"
                filter="url(#oledGlow)"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
              />
            ) : (
              <motion.g
                animate={
                  effectiveState === 'email-focus'
                    ? { x: emailPupilX, y: 5 }
                    : { x: mousePos.x * 0.4, y: mousePos.y * 0.4 }
                }
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              >
                <rect x="-7" y="-10" width="14" height="20" rx="7" fill="#38BDF8" filter="url(#oledGlow)" />
                <circle cx="2" cy="-3" r="2" fill="#FFFFFF" />
              </motion.g>
            )}
          </g>

          {/* RIGHT EYE GLYPH */}
          <g transform="translate(145, 114)">
            {effectiveState === 'sleeping' ? (
              <line x1="-8" y1="2" x2="8" y2="2" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" filter="url(#oledGlow)" />
            ) : effectiveState === 'poked' ? (
              <g stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" filter="url(#oledGlow)">
                <line x1="0" y1="-8" x2="0" y2="2" />
                <circle cx="0" cy="7" r="1.5" fill="#38BDF8" />
              </g>
            ) : blink ? (
              <line x1="-9" y1="0" x2="9" y2="0" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" filter="url(#oledGlow)" />
            ) : effectiveState === 'error' ? (
              <g stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" filter="url(#oledGlow)">
                <line x1="-6" y1="-6" x2="6" y2="6" />
                <line x1="6" y1="-6" x2="-6" y2="6" />
              </g>
            ) : effectiveState === 'success' || effectiveState === 'cheering' ? (
              <path d="M -8 3 Q 0 -6 8 3" fill="none" stroke="#34D399" strokeWidth="3.5" strokeLinecap="round" filter="url(#oledGlow)" />
            ) : effectiveState === 'waving' ? (
              <path d="M -8 3 Q 0 -5 8 3" fill="none" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" filter="url(#oledGlow)" />
            ) : effectiveState === 'submitting' || effectiveState === 'scanning' ? (
              <motion.circle
                cx="0"
                cy="0"
                r="7"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="2.5"
                strokeDasharray="12 6"
                filter="url(#oledGlow)"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
              />
            ) : (
              <motion.g
                animate={
                  effectiveState === 'email-focus'
                    ? { x: emailPupilX, y: 5 }
                    : effectiveState === 'password-peek'
                      ? { x: 3, y: 1 }
                      : { x: mousePos.x * 0.4, y: mousePos.y * 0.4 }
                }
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              >
                <rect x="-7" y="-10" width="14" height="20" rx="7" fill="#38BDF8" filter="url(#oledGlow)" />
                <circle cx="2" cy="-3" r="2" fill="#FFFFFF" />
              </motion.g>
            )}
          </g>

          {/* OLED MOUTH GLYPH */}
          <g transform="translate(120, 138)">
            {effectiveState === 'success' || effectiveState === 'cheering' || effectiveState === 'waving' ? (
              <path d="M -10 -2 Q 0 8 10 -2" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" filter="url(#oledGlow)" />
            ) : effectiveState === 'error' ? (
              <path d="M -8 3 Q 0 -4 8 3" fill="none" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" filter="url(#oledGlow)" />
            ) : effectiveState === 'poked' ? (
              <ellipse cx="0" cy="0" rx="4" ry="5" fill="#38BDF8" filter="url(#oledGlow)" />
            ) : effectiveState === 'sleeping' ? (
              <line x1="-3" y1="0" x2="3" y2="0" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" filter="url(#oledGlow)" />
            ) : effectiveState === 'email-focus' ? (
              <circle cx="0" cy="0" r="2.5" fill="#38BDF8" filter="url(#oledGlow)" />
            ) : (
              <line x1="-5" y1="0" x2="5" y2="0" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" opacity="0.8" filter="url(#oledGlow)" />
            )}
          </g>

          {/* FLOATING MAGNETIC LEFT HAND */}
          <motion.g
            variants={leftHandVariants}
            animate={effectiveState}
            style={{ originX: '48px', originY: '175px' }}
          >
            <circle cx="48" cy="175" r="5" fill="#38BDF8" opacity="0.3" filter="url(#oledGlow)" />
            <circle 
              cx="44" cy="175" r="14" 
              fill={isLight ? "#FFFFFF" : "#1E2430"} 
              stroke={isLight ? "#CBD5E1" : "#323B4E"} 
              strokeWidth="2.5" 
            />
            <circle cx="44" cy="175" r="6" fill="#38BDF8" opacity="0.6" filter="url(#oledGlow)" />
            <circle cx="36" cy="166" r="3.5" fill={isLight ? "#E2E8F0" : "#181D26"} stroke={isLight ? "#CBD5E1" : "#323B4E"} strokeWidth="1.5" />
            <circle cx="44" cy="162" r="3.5" fill={isLight ? "#E2E8F0" : "#181D26"} stroke={isLight ? "#CBD5E1" : "#323B4E"} strokeWidth="1.5" />
            <circle cx="52" cy="166" r="3.5" fill={isLight ? "#E2E8F0" : "#181D26"} stroke={isLight ? "#CBD5E1" : "#323B4E"} strokeWidth="1.5" />
          </motion.g>

          {/* FLOATING MAGNETIC RIGHT HAND */}
          <motion.g
            variants={rightHandVariants}
            animate={effectiveState}
            style={{ originX: '192px', originY: '175px' }}
          >
            <circle cx="192" cy="175" r="5" fill="#38BDF8" opacity="0.3" filter="url(#oledGlow)" />
            <circle 
              cx="196" cy="175" r="14" 
              fill={isLight ? "#FFFFFF" : "#1E2430"} 
              stroke={isLight ? "#CBD5E1" : "#323B4E"} 
              strokeWidth="2.5" 
            />
            <circle cx="196" cy="175" r="6" fill="#38BDF8" opacity="0.6" filter="url(#oledGlow)" />
            <circle cx="188" cy="166" r="3.5" fill={isLight ? "#E2E8F0" : "#181D26"} stroke={isLight ? "#CBD5E1" : "#323B4E"} strokeWidth="1.5" />
            <circle cx="196" cy="162" r="3.5" fill={isLight ? "#E2E8F0" : "#181D26"} stroke={isLight ? "#CBD5E1" : "#323B4E"} strokeWidth="1.5" />
            <circle cx="204" cy="166" r="3.5" fill={isLight ? "#E2E8F0" : "#181D26"} stroke={isLight ? "#CBD5E1" : "#323B4E"} strokeWidth="1.5" />
          </motion.g>
        </motion.g>
      </svg>
    </div>
  );
}
