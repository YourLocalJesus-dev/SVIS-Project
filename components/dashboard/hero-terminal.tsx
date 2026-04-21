"use client"

import * as React from "react"
import { motion } from "motion/react"
import { useStore, getTodayStats, getStreak } from "@/lib/store"
import { ScrambleText } from "@/components/crt/glitch-text"

const QUOTES = [
  "the grid is only as sharp as the operator.",
  "ship the draft. polish the signal.",
  "study now. flex on your past self later.",
  "focus is a muscle. stretch daily.",
  "the only way out is through the pomodoro.",
  "25 minutes of calm > 4 hours of chaos.",
  "make the machine proud.",
]

export function HeroTerminal() {
  const { missions, focusSessions } = useStore()
  const { completedToday, focusToday, openMissions } = getTodayStats(missions, focusSessions)
  const streak = getStreak(focusSessions)
  const quote = React.useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], [])

  const now = new Date()
  const greeting =
    now.getHours() < 5
      ? "GRAVEYARD SHIFT"
      : now.getHours() < 12
        ? "GOOD MORNING"
        : now.getHours() < 17
          ? "GOOD AFTERNOON"
          : now.getHours() < 21
            ? "GOOD EVENING"
            : "LATE SHIFT"

  return (
    <div className="relative flex flex-col gap-4 border-2 border-foreground bg-foreground px-5 py-6 text-background shadow-[6px_6px_0_0_var(--primary)] sm:px-8 sm:py-8">
      {/* corner brackets */}
      <Brackets />
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
        <span className="inline-block h-2 w-2 bg-accent" />
        session // authenticated
      </div>
      <h2 className="font-display text-3xl leading-none tracking-widest sm:text-5xl">
        <ScrambleText text={greeting + ", OPERATOR."} />
      </h2>
      <p className="max-w-prose font-mono text-sm text-background/80">
        // {quote}
      </p>

      <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-xs sm:grid-cols-4">
        <Stat label="OPEN MSN" value={String(openMissions).padStart(2, "0")} />
        <Stat label="DONE TODAY" value={String(completedToday).padStart(2, "0")} />
        <Stat label="FOCUS MIN" value={String(focusToday).padStart(3, "0")} />
        <Stat label="STREAK" value={`${streak}d`} />
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.random() * 0.3 }}
      className="flex flex-col gap-1"
    >
      <span className="text-[10px] uppercase tracking-widest text-background/60">{label}</span>
      <span className="font-display text-3xl leading-none tracking-widest text-accent">
        {value}
      </span>
    </motion.div>
  )
}

function Brackets() {
  const base = "absolute h-4 w-4 border-accent"
  return (
    <>
      <span className={`${base} left-1 top-1 border-l-2 border-t-2`} />
      <span className={`${base} right-1 top-1 border-r-2 border-t-2`} />
      <span className={`${base} bottom-1 left-1 border-b-2 border-l-2`} />
      <span className={`${base} bottom-1 right-1 border-b-2 border-r-2`} />
    </>
  )
}
