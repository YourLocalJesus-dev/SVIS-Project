"use client"

import * as React from "react"
import { motion } from "motion/react"
import { useStore } from "@/lib/store"

const LINES = [
  "NEON-DRIVE BIOS v1.0.86 (c) 1986",
  "INITIALIZING STUDY.TERMINAL ...",
  "CHECKING MEMORY .............. 640K OK",
  "LOADING MISSION QUEUE ......... OK",
  "LOADING FOCUS PROTOCOL ........ OK",
  "LOADING NEURAL LINK ........... OK",
  "SESSION AUTHENTICATED",
  "> GOOD LUCK, OPERATOR.",
]

export function BootSequence({ onDone }: { onDone: () => void }) {
  const { markBootSeen } = useStore()
  const [step, setStep] = React.useState(0)

  React.useEffect(() => {
    if (step >= LINES.length) {
      const t = window.setTimeout(() => {
        markBootSeen()
        onDone()
      }, 550)
      return () => window.clearTimeout(t)
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), 160 + Math.random() * 90)
    return () => window.clearTimeout(t)
  }, [step, markBootSeen, onDone])

  // Allow skip
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") {
        markBootSeen()
        onDone()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [markBootSeen, onDone])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-background px-6"
    >
      <div className="w-full max-w-xl">
        <pre className="mb-6 whitespace-pre text-[10px] leading-[1.1] text-primary sm:text-xs">{ASCII}</pre>
        <div className="space-y-1 font-mono text-xs sm:text-sm">
          {LINES.slice(0, step).map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1 }}
              className="text-foreground"
            >
              <span className="text-muted-foreground">{">"}</span> {l}
            </motion.div>
          ))}
          {step < LINES.length && (
            <div className="text-foreground">
              <span className="text-muted-foreground">{">"}</span> <span className="blink">█</span>
            </div>
          )}
        </div>
        <div className="mt-6 text-[10px] uppercase tracking-widest text-muted-foreground">
          press any key to skip
        </div>
      </div>
    </motion.div>
  )
}

const ASCII = `    _   ______________  _   __      ____  ____  _____    _______
   / | / / ____/ __/ __ \\/ | / /     / __ \\/ __ \\/  _/ |  / / ____/
  /  |/ / __/ / /_/ / / /  |/ /_____/ / / / /_/ // / | | / / __/
 / /|  / /___/ __/ /_/ / /|  /_____/ /_/ / _, _// /  | |/ / /___
/_/ |_/_____/_/  \\____/_/ |_/     /_____/_/ |_/___/  |___/_____/`
