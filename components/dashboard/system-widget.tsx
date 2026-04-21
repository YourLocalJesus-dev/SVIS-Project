"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Panel } from "@/components/crt/panel"
import { useStore, getLast7Days } from "@/lib/store"

function useClock() {
  const [t, setT] = React.useState<Date | null>(null)
  React.useEffect(() => {
    setT(new Date())
    const id = window.setInterval(() => setT(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return t
}

/* Analog-ish digital clock + 7-day sparkline chart + random sys lines */
export function SystemWidget() {
  const t = useClock()
  const { focusSessions } = useStore()
  const days = getLast7Days(focusSessions)
  const max = Math.max(60, ...days.map((d) => d.minutes))

  const hh = t ? String(t.getHours()).padStart(2, "0") : "--"
  const mm = t ? String(t.getMinutes()).padStart(2, "0") : "--"
  const ss = t ? String(t.getSeconds()).padStart(2, "0") : "--"

  return (
    <Panel label="SYSTEM // ALIVE">
      <div className="flex flex-col gap-4 p-4">
        {/* clock */}
        <div className="flex items-baseline justify-between gap-2 border-2 border-foreground bg-muted px-3 py-2">
          <div className="font-display text-5xl leading-none tracking-widest text-primary">
            {hh}
            <span className="blink">:</span>
            {mm}
            <span className="ml-1 text-2xl text-muted-foreground">:{ss}</span>
          </div>
          <div className="text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            sys.time
            <br />
            UTC{t ? getTz(t) : ""}
          </div>
        </div>

        {/* last 7 days sparkline */}
        <div>
          <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>focus // last 7 days</span>
            <span>min</span>
          </div>
          <div className="flex h-24 items-end gap-1">
            {days.map((d, i) => {
              const h = (d.minutes / max) * 100
              return (
                <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(2, h)}%` }}
                    transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
                    className="w-full border border-foreground bg-primary"
                    style={{ minHeight: d.minutes > 0 ? 4 : 2, background: d.minutes === 0 ? "var(--muted)" : undefined }}
                  />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    {d.label[0]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* sys log */}
        <div className="border-t border-border pt-3">
          <SysLog />
        </div>
      </div>
    </Panel>
  )
}

function getTz(d: Date) {
  const off = -d.getTimezoneOffset() / 60
  const s = (off >= 0 ? "+" : "") + off
  return s
}

const LOG_LINES = [
  "heartbeat // nominal",
  "mem.scan // clean",
  "neural.link // online",
  "caffeine.level // acceptable",
  "motivation.buffer // 87%",
  "distraction // quarantined",
  "ghost.in.the.shell // whispered",
  "dopamine // rationed",
]

function SysLog() {
  const [lines, setLines] = React.useState<string[]>([])

  React.useEffect(() => {
    // seed 4 initial lines
    const seed = Array.from({ length: 4 }, () => LOG_LINES[Math.floor(Math.random() * LOG_LINES.length)])
    setLines(seed)

    const id = window.setInterval(() => {
      setLines((prev) => [LOG_LINES[Math.floor(Math.random() * LOG_LINES.length)], ...prev].slice(0, 4))
    }, 3500)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="space-y-0.5 font-mono text-[11px] leading-snug">
      {lines.map((l, i) => (
        <motion.div
          key={`${i}-${l}`}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1 - i * 0.22, x: 0 }}
          transition={{ duration: 0.2 }}
          className="text-foreground"
        >
          <span className="text-muted-foreground">{"> "}</span>
          {l}
        </motion.div>
      ))}
    </div>
  )
}
