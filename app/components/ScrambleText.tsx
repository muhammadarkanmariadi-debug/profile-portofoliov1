'use client'
import React, { useEffect, useState } from 'react'

const CHARS = '!<>-_\\/[]{}—=+*^?#________'

interface ScrambleTextProps {
  text: string
  className?: string
}

export default function ScrambleText({ text, className = '' }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text)

  useEffect(() => {
    let scrambleInterval: NodeJS.Timeout
    let loopTimeout: NodeJS.Timeout

    const scramble = () => {
      let iteration = 0
      clearInterval(scrambleInterval)

      scrambleInterval = setInterval(() => {
        setDisplayText((prev) =>
          text
            .split('')
            .map((letter, index) => {
              if (letter === ' ') return ' '
              if (index < iteration) {
                return text[index]
              }
              return CHARS[Math.floor(Math.random() * CHARS.length)]
            })
            .join('')
        )

        if (iteration >= text.length) {
          clearInterval(scrambleInterval)
          // Repeat the animation after 8 seconds
          loopTimeout = setTimeout(scramble, 5000)
        }

        iteration += 1 / 3
      }, 30)
    }

    // Small delay before starting the first time
    const initialTimeout = setTimeout(scramble, 200)

    return () => {
      clearTimeout(initialTimeout)
      clearTimeout(loopTimeout)
      clearInterval(scrambleInterval)
    }
  }, [text])

  return <span className={className}>{displayText}</span>
}
