"use client";

import React, { FC, JSX, useEffect, useRef } from "react";
import gsap from "gsap";

interface Position {
  x: number;
  y: number;
}

export interface SmoothCursorProps {
  cursor?: JSX.Element;
}

const DefaultCursorSVG: FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={50}
      height={54}
      viewBox="0 0 50 54"
      fill="none"
      style={{ transform: "scale(0.5)" }}
    >
      <g filter="url(#filter0_d_91_7928)">
        <path
          d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
          fill="black"
        />
        <path
          d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
          stroke="white"
          strokeWidth={2.25825}
        />
      </g>
      <defs>
        <filter
          id="filter0_d_91_7928"
          x={0.602397}
          y={0.952444}
          width={49.0584}
          height={52.428}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={2.25825} />
          <feGaussianBlur stdDeviation={2.25825} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_91_7928"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_91_7928"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export function SmoothCursor({
  cursor = <DefaultCursorSVG />,
}: SmoothCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef<Position>({ x: 0, y: 0 });
  const velocity = useRef<Position>({ x: 0, y: 0 });
  const lastUpdateTime = useRef(Date.now());
  const previousAngle = useRef(0);
  const accumulatedRotation = useRef(0);
  const isHoveredRef = useRef(false);
  const isMouseDownRef = useRef(false);

  useEffect(() => {
    if (!cursorRef.current || typeof window === "undefined") return;

    // Strict detection: disable on mobile (<1024px), tablet, touch devices, and reduced motion
    const checkIsTouchOrSmall = () => {
      const isTouch =
        window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(hover: none)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 1024;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      return isTouch || isSmallScreen || prefersReducedMotion;
    };

    if (checkIsTouchOrSmall()) {
      if (cursorRef.current) cursorRef.current.style.display = "none";
      return;
    }

    const el = cursorRef.current;
    el.style.display = "block";
    
    // High-performance GSAP quickTo setters for instant hardware-accelerated tracking
    const xTo = gsap.quickTo(el, "x", { duration: 0.22, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.22, ease: "power3.out" });
    const rotTo = gsap.quickTo(el, "rotation", { duration: 0.35, ease: "power2.out" });

    // Initial entrance
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0 });
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

      if (speed > 0.15) {
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
          gsap.to(el, {
            scale: 1.45,
            duration: 0.25,
            ease: "back.out(2)",
          });
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
          gsap.to(el, {
            scale: 1.0,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      }
    };

    // Click / Mousedown tactile squish action
    const handleMouseDown = () => {
      isMouseDownRef.current = true;
      gsap.to(el, {
        scale: 0.75,
        duration: 0.12,
        ease: "power3.out",
      });
    };

    // Release / Mouseup spring bounce
    const handleMouseUp = () => {
      isMouseDownRef.current = false;
      const targetScale = isHoveredRef.current ? 1.45 : 1.0;
      gsap.to(el, {
        scale: targetScale,
        duration: 0.35,
        ease: "back.out(2.8)",
      });
    };

    // Viewport enter / leave
    const handleMouseLeave = () => {
      gsap.to(el, { opacity: 0, scale: 0.2, duration: 0.25, ease: "power2.out" });
    };

    const handleMouseEnter = () => {
      gsap.to(el, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.8)" });
    };

    const handleResize = () => {
      if (checkIsTouchOrSmall()) {
        if (cursorRef.current) cursorRef.current.style.display = "none";
      } else {
        if (cursorRef.current) cursorRef.current.style.display = "block";
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="hidden lg:block fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform select-none"
      style={{ transform: "translate3d(0, 0, 0)" }}
    >
      {cursor}
    </div>
  );
}
