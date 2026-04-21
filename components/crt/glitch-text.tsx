"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type Props = {
  text: string
  className?: string
  as?: React.ElementType
  hoverOnly?: boolean
}

export function GlitchText({ text, className, as: Tag = "span", hoverOnly = false }: Props) {
  return (
    <Tag
      data-text={text}
      className={cn(hoverOnly ? "glitch-hover" : "glitch", className)}
    >
      {text}
    </Tag>
  )
}

/* Scramble-on-reveal — cycles through random chars then settles to final text.
   Used for headlines and mission titles on mount. */
export function ScrambleText({
  text,
  className,
  duration = 700,
}: {
  text: string
  className?: string
  duration?: number
}) {
  const [display, setDisplay] = React.useState(text)
  React.useEffect(() => {
    const chars = "!<>-_\\/[]{}—=+*^?#________"
    const frames = 12
    let frame = 0
    const id = window.setInterval(() => {
      frame++
      const progress = frame / frames
      setDisplay(
        text
          .split("")
          .map((c, i) => {
            if (c === " ") return " "
            if (i / text.length < progress) return c
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join(""),
      )
      if (frame >= frames) {
        window.clearInterval(id)
        setDisplay(text)
      }
    }, duration / frames)
    return () => window.clearInterval(id)
  }, [text, duration])
  return <span className={className}>{display}</span>
}
