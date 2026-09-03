"use client";

import { motion, useSpring } from "motion/react";
import { FC, JSX, useEffect, useRef, useState } from "react";

interface Position {
  x: number;
  y: number;
}

export interface SmoothCursorProps {
  cursor?: JSX.Element;
  springConfig?: {
    damping: number;
    stiffness: number;
    mass: number;
    restDelta: number;
  };
}

const DefaultCursorSVG: FC<{ isHovered?: boolean; isClicked?: boolean }> = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={46}
      height={50}
      viewBox="0 0 50 54"
      fill="none"
      className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)] select-none pointer-events-none"
    >
      <g>
        <path
          d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
          fill="#121217"
        />
        <path
          d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
          stroke="#FFFFFF"
          strokeWidth={2}
        />
      </g>
    </svg>
  );
};

export function SmoothCursor({
  cursor,
  springConfig = {
    damping: 32,
    stiffness: 450,
    mass: 0.6,
    restDelta: 0.001,
  },
}: SmoothCursorProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const lastMousePos = useRef<Position>({ x: 0, y: 0 });
  const velocity = useRef<Position>({ x: 0, y: 0 });
  const lastUpdateTime = useRef(0);
  const previousAngle = useRef(0);
  const accumulatedRotation = useRef(0);

  const cursorX = useSpring(-100, springConfig);
  const cursorY = useSpring(-100, springConfig);
  const rotation = useSpring(0, {
    ...springConfig,
    damping: 45,
    stiffness: 300,
  });
  const scale = useSpring(1, {
    ...springConfig,
    stiffness: 520,
    damping: 28,
  });

  useEffect(() => {
    const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const updateVelocity = (currentPos: Position) => {
      const now = performance.now();
      const deltaTime = now - (lastUpdateTime.current || now);

      if (deltaTime > 0 && deltaTime < 100) {
        velocity.current = {
          x: (currentPos.x - lastMousePos.current.x) / deltaTime,
          y: (currentPos.y - lastMousePos.current.y) / deltaTime,
        };
      }

      lastUpdateTime.current = now;
      lastMousePos.current = currentPos;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      updateVelocity({ x: mouseX, y: mouseY });

      const speed = Math.sqrt(
        Math.pow(velocity.current.x, 2) + Math.pow(velocity.current.y, 2)
      );

      // Check for interactive button/anchor/input targets
      const target = document.elementFromPoint(mouseX, mouseY) as HTMLElement | null;
      const interactive = target?.closest(
        'button, a, .cursor-target, [role="button"], input, textarea, select'
      ) as HTMLElement | null;

      if (interactive) {
        setIsHovered(true);

        const rect = interactive.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Subtle magnetic pull toward button center (smooth, not jarring)
        const pull = 0.22;
        const targetX = mouseX + (centerX - mouseX) * pull;
        const targetY = mouseY + (centerY - mouseY) * pull;

        cursorX.set(targetX);
        cursorY.set(targetY);

        // Stabilize upright rotation on interactive elements
        rotation.set(0);
        scale.set(1.18);
      } else {
        setIsHovered(false);

        cursorX.set(mouseX);
        cursorY.set(mouseY);

        if (speed > 0.08) {
          const currentAngle =
            Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) + 90;

          let angleDiff = currentAngle - previousAngle.current;
          if (angleDiff > 180) angleDiff -= 360;
          if (angleDiff < -180) angleDiff += 360;
          accumulatedRotation.current += angleDiff;
          rotation.set(accumulatedRotation.current);
          previousAngle.current = currentAngle;

          scale.set(0.95);
        } else {
          scale.set(1);
        }
      }
    };

    const handleMouseDown = () => {
      setIsClicked(true);
      scale.set(0.82);
    };

    const handleMouseUp = () => {
      setIsClicked(false);
      scale.set(isHovered ? 1.18 : 1);
    };

    let rafId: number;
    const throttledMouseMove = (e: MouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        handleMouseMove(e);
        rafId = 0;
      });
    };

    document.body.style.cursor = "none";
    window.addEventListener("mousemove", throttledMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", throttledMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "auto";
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [cursorX, cursorY, rotation, scale, isHovered]);

  return (
    <motion.div
      style={{
        position: "fixed",
        left: cursorX,
        top: cursorY,
        translateX: "-50%",
        translateY: "-30%",
        rotate: rotation,
        scale: scale,
        zIndex: 99999,
        pointerEvents: "none",
        willChange: "transform",
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 450,
        damping: 30,
      }}
    >
      {cursor || <DefaultCursorSVG isHovered={isHovered} isClicked={isClicked} />}
    </motion.div>
  );
}
