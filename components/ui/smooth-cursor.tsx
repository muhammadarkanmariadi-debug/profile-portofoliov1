"use client";

import React, { FC, useEffect, useRef } from "react";
import gsap from "gsap";

interface Position {
  x: number;
  y: number;
}

export interface SmoothCursorProps {
  customCursor?: React.ReactNode;
}

export function SmoothCursor({ customCursor }: SmoothCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const lastMousePos = useRef<Position>({ x: -100, y: -100 });
  const velocity = useRef<Position>({ x: 0, y: 0 });
  const lastUpdateTime = useRef(Date.now());
  const previousAngle = useRef(0);
  const accumulatedRotation = useRef(0);
  const isHoveredRef = useRef(false);
  const isMouseDownRef = useRef(false);

  useEffect(() => {
    if (!cursorRef.current || typeof window === "undefined") return;

    // Disable for touch devices or reduced motion preference
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || prefersReducedMotion) {
      if (cursorRef.current) cursorRef.current.style.display = "none";
      return;
    }

    const el = cursorRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;

    // High-performance GSAP quickTo setters
    const xTo = gsap.quickTo(el, "x", { duration: 0.18, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.18, ease: "power3.out" });
    const rotTo = dot ? gsap.quickTo(dot, "rotation", { duration: 0.35, ease: "power2.out" }) : null;

    // Initial entrance
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.5 });
    gsap.to(el, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" });

    const updateVelocity = (currentPos: Position) => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastUpdateTime.current;

      if (deltaTime > 0) {
        velocity.current = {
          x: (currentPos.x - lastMousePos.current.x) / deltaTime,
          y: (currentPos.y - lastMousePos.current.y) / deltaTime,
        };
      }

      lastUpdateTime.current = currentTime;
      lastMousePos.current = currentPos;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const currentPos = { x: e.clientX, y: e.clientY };
      updateVelocity(currentPos);

      const speed = Math.sqrt(
        Math.pow(velocity.current.x, 2) + Math.pow(velocity.current.y, 2)
      );

      xTo(currentPos.x);
      yTo(currentPos.y);

      // Kinetic rotation based on trajectory velocity
      if (speed > 0.15 && rotTo) {
        const currentAngle =
          Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) + 90;

        let angleDiff = currentAngle - previousAngle.current;
        if (angleDiff > 180) angleDiff -= 360;
        if (angleDiff < -180) angleDiff += 360;
        accumulatedRotation.current += angleDiff;
        rotTo(accumulatedRotation.current);
        previousAngle.current = currentAngle;
      }
    };

    // Target selector for interactive elements
    const interactiveSelector = [
      "a",
      "button",
      "input",
      "textarea",
      "select",
      "[role='button']",
      "[tabindex]:not([tabindex='-1'])",
      ".cursor-target",
      "[draggable='true']",
      "label",
      "summary",
      "[data-cursor]",
    ].join(", ");

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(interactiveSelector);
      if (interactive) {
        isHoveredRef.current = true;
        if (!isMouseDownRef.current) {
          // Scale up ring and dot for hover reaction
          if (ring) {
            gsap.to(ring, {
              scale: 1.85,
              borderColor: "var(--color-primary, #60A5FA)",
              backgroundColor: "rgba(96, 165, 250, 0.12)",
              backdropFilter: "blur(2px)",
              duration: 0.3,
              ease: "back.out(2)",
            });
          }
          if (dot) {
            gsap.to(dot, {
              scale: 1.3,
              duration: 0.25,
              ease: "power2.out",
            });
          }
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const related = e.relatedTarget as HTMLElement | null;
      if (!related || !related.closest(interactiveSelector)) {
        isHoveredRef.current = false;
        if (!isMouseDownRef.current) {
          if (ring) {
            gsap.to(ring, {
              scale: 1,
              borderColor: "rgba(255, 255, 255, 0.4)",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(0px)",
              duration: 0.35,
              ease: "power2.out",
            });
          }
          if (dot) {
            gsap.to(dot, {
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          }
        }
      }
    };

    // Click / Mousedown tactile squish action
    const handleMouseDown = () => {
      isMouseDownRef.current = true;
      if (ring) {
        gsap.to(ring, {
          scale: 0.75,
          duration: 0.12,
          ease: "power3.out",
        });
      }
      if (dot) {
        gsap.to(dot, {
          scale: 0.65,
          duration: 0.12,
          ease: "power3.out",
        });
      }
    };

    // Release / Mouseup spring bounce
    const handleMouseUp = () => {
      isMouseDownRef.current = false;
      const targetScale = isHoveredRef.current ? 1.85 : 1.0;
      const dotTargetScale = isHoveredRef.current ? 1.3 : 1.0;

      if (ring) {
        gsap.to(ring, {
          scale: targetScale,
          duration: 0.35,
          ease: "back.out(2.8)",
        });
      }
      if (dot) {
        gsap.to(dot, {
          scale: dotTargetScale,
          duration: 0.3,
          ease: "back.out(2.5)",
        });
      }
    };

    // Viewport enter / leave
    const handleMouseLeave = () => {
      gsap.to(el, { opacity: 0, scale: 0.4, duration: 0.25, ease: "power2.out" });
    };

    const handleMouseEnter = () => {
      gsap.to(el, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.8)" });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[99999] will-change-transform flex items-center justify-center -translate-x-1/2 -translate-y-1/2 select-none"
      style={{ transform: "translate3d(-100px, -100px, 0)" }}
    >
      {customCursor ? (
        customCursor
      ) : (
        <div className="relative flex items-center justify-center">
          {/* Outer Kinetic Aura Ring */}
          <div
            ref={ringRef}
            className="w-8 h-8 rounded-full border border-white/40 bg-white/5 shadow-sm transform-gpu transition-colors duration-200"
          />

          {/* Inner Pointer Dot / Arrow with Trajectory Rotation */}
          <div
            ref={dotRef}
            className="absolute w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(96,165,250,0.8)] transform-gpu"
          />
        </div>
      )}
    </div>
  );
}
