"use client"

import * as React from "react"
import { useStore, getStreak, getTodayStats } from "@/lib/store"

const TICKER = [
  "NEON-DRIVE // STUDY TERMINAL",
  "STAY FOCUSED, OPERATOR",
  "DRINK WATER // STRETCH // BLINK",
  "THE GRID NEVER SLEEPS",
  "PRESS ? FOR SECRETS",
  "DO SOMETHING YOUR FUTURE SELF WILL THANK YOU FOR",
  "SYSTEM: NOMINAL",
]

function useClock() {
  const [now, setNow] = React.useState<Date | null>(null)
  React.useEffect(() => {
    setNow(new Date())
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

export function StatusBar() {
  const now = useClock()
  const { missions, focusSessions } = useStore()
  const streak = getStreak(focusSessions)
  const { focusToday, openMissions } = getTodayStats(missions, focusSessions)

  const date = now
    ? now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit", year: "numeric" }).toUpperCase()
    : "----"
  const time = now ? now.toLocaleTimeString("en-US", { hour12: false }) : "--:--:--"

  const ticker = [...TICKER, ...TICKER].join("   ///   ")

  return (
    <footer className="sticky bottom-0 z-30 -mx-4 mt-4 border-t-2 border-foreground bg-background/95 backdrop-blur-sm sm:-mx-6 lg:-mx-8">
      {/* marquee */}
      <div className="overflow-hidden border-b border-border py-1">
        <div className="marquee-track flex whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="pr-8">{ticker}</span>
          <span className="pr-8">{ticker}</span>
        </div>
      </div>
      {/* stats row */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest sm:px-4 sm:text-xs">
        <div className="flex items-center gap-3">
          <span>
            <span className="text-muted-foreground">DATE </span>
            {date}
          </span>
          <span className="hidden sm:inline">
            <span className="text-muted-foreground">TIME </span>
            {time}
            <span className="blink ml-1">▌</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>
            <span className="text-muted-foreground">OPEN </span>
            {String(openMissions).padStart(2, "0")}
          </span>
          <span>
            <span className="text-muted-foreground">FCS </span>
            {focusToday}
            <span className="text-muted-foreground">m</span>
          </span>
          <span>
            <span className="text-muted-foreground">STRK </span>
            {streak}
            <span className="text-muted-foreground">d</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
