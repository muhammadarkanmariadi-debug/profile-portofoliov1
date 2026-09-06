/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import { useTheme } from "next-themes"
import { useTheme as useAppTheme } from "@/app/providers"
import {
  Cloud,
  fetchSimpleIcons,
  ICloud,
  renderSimpleIcon,
  SimpleIcon,
} from "react-icon-cloud"

export const cloudProps: Omit<ICloud, "children"> = {
  containerProps: {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      padding: 0,
    },
  },
  options: {
    reverse: true,
    depth: 0.82,
    wheelZoom: false,
    imageScale: 2.5,
    activeCursor: "grab",
    tooltip: "native",
    initial: [0.08, -0.08],
    clickToFront: 500,
    tooltipDelay: 0,
    outlineColour: "#0000",
    maxSpeed: 0.032,
    minSpeed: 0.016,
    decel: 0.95,
  },
}

export const renderCustomIcon = (icon: SimpleIcon, theme: string) => {
  const bgHex = theme === "light" ? "#ffffff" : "#08080c"
  const fallbackHex = theme === "light" ? "#121217" : "#fafafc"
  const minContrastRatio = 1.0

  return renderSimpleIcon({
    icon,
    bgHex,
    fallbackHex,
    minContrastRatio,
    size: 52,
    aProps: {
      href: undefined,
      target: undefined,
      rel: undefined,
      onClick: (e: any) => e.preventDefault(),
    },
  })
}

export type DynamicCloudProps = {
  iconSlugs: string[]
}

type IconData = Awaited<ReturnType<typeof fetchSimpleIcons>>

export function IconCloud({ iconSlugs }: DynamicCloudProps) {
  const [data, setData] = useState<IconData | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const nextTheme = useTheme()
  let appTheme: any = null
  try {
    appTheme = useAppTheme()
  } catch {
    // ignore if outside provider
  }
  const activeTheme = appTheme?.theme || nextTheme?.theme || "light"

  useEffect(() => {
    fetchSimpleIcons({ slugs: iconSlugs }).then(setData)
  }, [iconSlugs])

  useEffect(() => {
    if (!wrapperRef.current || typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.05 }
    )

    observer.observe(wrapperRef.current)
    return () => observer.disconnect()
  }, [])

  const renderedIcons = useMemo(() => {
    if (!data) return null

    return Object.values(data.simpleIcons).map((icon) =>
      renderCustomIcon(icon, activeTheme),
    )
  }, [data, activeTheme])

  return (
    <div ref={wrapperRef} className="w-full flex items-center justify-center">
      {isVisible && renderedIcons ? (
        // @ts-ignore
        <Cloud {...cloudProps}>
          <>{renderedIcons}</>
        </Cloud>
      ) : (
        <div className="w-full h-[320px] flex items-center justify-center" />
      )}
    </div>
  )
}

